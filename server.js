const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'readie-session-secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/readie'
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/readie', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  phone: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationOtp: String,
  verificationOtpExpires: Date,
  authProvider: { type: String, default: 'local' },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  progress: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    completedLessons: [Number],
    lastAccessed: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});

// Course Schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: String,
  category: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  duration: String,
  thumbnail: String,
  rating: { type: Number, default: 0 },
  studentsCount: { type: Number, default: 0 },
  lessons: [{
    title: String,
    duration: String,
    videoId: String,
    description: String,
    resources: [String]
  }],
  tags: [String],
  isPublished: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

// =====================
// Email configuration (Brevo)
// =====================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp-relay.brevo.com',
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : 587,
  secure: false, // TLS with STARTTLS on port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Readie - Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Welcome to Readie!</h2>
        <p>Your verification code is:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'readie-jwt-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, authMethod } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: authMethod === 'email' ? email : undefined },
        { phone: authMethod === 'phone' ? phone : undefined }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      name,
      email: authMethod === 'email' ? email : undefined,
      phone: authMethod === 'phone' ? phone : undefined,
      password: hashedPassword,
      verificationOtp: otp,
      verificationOtpExpires: otpExpires
    });

    await user.save();

    // Send OTP
    if (authMethod === 'email') {
      await sendOtpEmail(email, otp);
    }
    // Note: SMS sending would be implemented here for phone verification

    res.status(201).json({ 
      message: 'User created successfully. Please verify your account with the OTP sent to your ' + authMethod,
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, phone, password, authMethod } = req.body;

    // Find user
    const user = await User.findOne({
      $or: [
        { email: authMethod === 'email' ? email : undefined },
        { phone: authMethod === 'phone' ? phone : undefined }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Please verify your account first' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'readie-jwt-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    // Find user
    const user = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check OTP
    if (user.verificationOtp !== otp || user.verificationOtpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'readie-jwt-secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Account verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Resend OTP
app.post('/api/auth/resend-otp', async (req, res) => {
  try {
    const { email, phone } = req.body;

    const user = await User.findOne({
      $or: [
        { email: email },
        { phone: phone }
      ]
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new OTP
    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationOtp = otp;
    user.verificationOtpExpires = otpExpires;
    await user.save();

    // Send OTP
    if (email) {
      await sendOtpEmail(email, otp);
    }

    res.json({ message: 'OTP sent successfully' });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -verificationOtp -verificationOtpExpires');
    res.json(user);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get courses
app.get('/api/courses', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Courses fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get single course
app.get('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    console.error('Course fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Enroll in course
app.post('/api/courses/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const courseId = req.params.id;

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    // Update course student count
    await Course.findByIdAndUpdate(courseId, { $inc: { studentsCount: 1 } });

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update lesson progress
app.post('/api/courses/:courseId/lessons/:lessonId/complete', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const { courseId, lessonId } = req.params;

    let progress = user.progress.find(p => p.courseId.toString() === courseId);
    
    if (!progress) {
      progress = {
        courseId,
        completedLessons: [],
        lastAccessed: new Date()
      };
      user.progress.push(progress);
    }

    if (!progress.completedLessons.includes(parseInt(lessonId))) {
      progress.completedLessons.push(parseInt(lessonId));
    }
    
    progress.lastAccessed = new Date();
    await user.save();

    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
