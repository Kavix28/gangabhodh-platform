const mongoose = require('mongoose');
require('dotenv').config();

// Course Schema (duplicate for seeding)
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

const Course = mongoose.model('Course', courseSchema);

const sampleCourses = [
  {
    title: 'Complete Web Development Bootcamp',
    description: 'Learn full-stack web development from scratch. Build real projects and deploy them to the cloud.',
    instructor: 'John Doe',
    category: 'Web Development',
    difficulty: 'Beginner',
    duration: '40 hours',
    thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
    rating: 4.8,
    studentsCount: 15420,
    lessons: [
      { title: 'Introduction to Web Development', duration: '15:30', videoId: 'dQw4w9WgXcQ', description: 'Overview of web development technologies' },
      { title: 'HTML Fundamentals', duration: '22:45', videoId: 'dQw4w9WgXcQ', description: 'Learn HTML structure and elements' },
      { title: 'CSS Styling', duration: '28:15', videoId: 'dQw4w9WgXcQ', description: 'Style your web pages with CSS' },
      { title: 'JavaScript Basics', duration: '35:20', videoId: 'dQw4w9WgXcQ', description: 'Introduction to JavaScript programming' },
      { title: 'React Framework', duration: '42:30', videoId: 'dQw4w9WgXcQ', description: 'Build dynamic UIs with React' },
      { title: 'Backend with Node.js', duration: '38:45', videoId: 'dQw4w9WgXcQ', description: 'Server-side development with Node.js' },
      { title: 'Database Integration', duration: '31:10', videoId: 'dQw4w9WgXcQ', description: 'Connect your app to databases' },
      { title: 'Deployment and Hosting', duration: '25:20', videoId: 'dQw4w9WgXcQ', description: 'Deploy your applications to the cloud' }
    ],
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
    isPublished: true
  },
  {
    title: 'Data Science with Python',
    description: 'Master data science concepts and tools using Python. Learn statistics, machine learning, and data visualization.',
    instructor: 'Sarah Johnson',
    category: 'Data Science',
    difficulty: 'Intermediate',
    duration: '35 hours',
    thumbnail: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
    rating: 4.9,
    studentsCount: 8750,
    lessons: [
      { title: 'Python for Data Science', duration: '20:15', videoId: 'dQw4w9WgXcQ', description: 'Python basics for data science' },
      { title: 'NumPy and Pandas', duration: '32:30', videoId: 'dQw4w9WgXcQ', description: 'Data manipulation with NumPy and Pandas' },
      { title: 'Data Visualization', duration: '28:45', videoId: 'dQw4w9WgXcQ', description: 'Create charts and graphs' },
      { title: 'Statistical Analysis', duration: '35:20', videoId: 'dQw4w9WgXcQ', description: 'Statistical methods and hypothesis testing' },
      { title: 'Machine Learning Basics', duration: '40:15', videoId: 'dQw4w9WgXcQ', description: 'Introduction to ML algorithms' },
      { title: 'Deep Learning', duration: '45:30', videoId: 'dQw4w9WgXcQ', description: 'Neural networks and deep learning' }
    ],
    tags: ['Python', 'Data Science', 'Machine Learning', 'Statistics'],
    isPublished: true
  },
  {
    title: 'UI/UX Design Fundamentals',
    description: 'Learn the principles of user interface and user experience design. Create beautiful and functional designs.',
    instructor: 'Mike Chen',
    category: 'Design',
    difficulty: 'Beginner',
    duration: '25 hours',
    thumbnail: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    rating: 4.7,
    studentsCount: 12300,
    lessons: [
      { title: 'Design Thinking', duration: '18:30', videoId: 'dQw4w9WgXcQ', description: 'User-centered design approach' },
      { title: 'Typography and Color', duration: '22:15', videoId: 'dQw4w9WgXcQ', description: 'Typography and color theory' },
      { title: 'Layout and Composition', duration: '25:45', videoId: 'dQw4w9WgXcQ', description: 'Creating effective layouts' },
      { title: 'Prototyping', duration: '30:20', videoId: 'dQw4w9WgXcQ', description: 'Create interactive prototypes' },
      { title: 'User Testing', duration: '20:10', videoId: 'dQw4w9WgXcQ', description: 'Test and validate your designs' }
    ],
    tags: ['UI Design', 'UX Design', 'Prototyping', 'User Research'],
    isPublished: true
  },
  {
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications using React Native. Deploy to both iOS and Android.',
    instructor: 'Emily Davis',
    category: 'Mobile Development',
    difficulty: 'Intermediate',
    duration: '45 hours',
    thumbnail: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
    rating: 4.6,
    studentsCount: 9800,
    lessons: [
      { title: 'React Native Setup', duration: '15:45', videoId: 'dQw4w9WgXcQ', description: 'Set up development environment' },
      { title: 'Components and Navigation', duration: '28:30', videoId: 'dQw4w9WgXcQ', description: 'Build UI components and navigation' },
      { title: 'State Management', duration: '32:15', videoId: 'dQw4w9WgXcQ', description: 'Manage application state' },
      { title: 'APIs and Networking', duration: '25:20', videoId: 'dQw4w9WgXcQ', description: 'Connect to external APIs' },
      { title: 'Device Features', duration: '30:45', videoId: 'dQw4w9WgXcQ', description: 'Access camera, GPS, and other features' },
      { title: 'App Store Deployment', duration: '22:30', videoId: 'dQw4w9WgXcQ', description: 'Deploy to app stores' }
    ],
    tags: ['React Native', 'Mobile Development', 'iOS', 'Android'],
    isPublished: true
  },
  {
    title: 'Machine Learning Basics',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
    instructor: 'David Wilson',
    category: 'Machine Learning',
    difficulty: 'Intermediate',
    duration: '30 hours',
    thumbnail: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
    rating: 4.8,
    studentsCount: 7650,
    lessons: [
      { title: 'What is Machine Learning?', duration: '20:30', videoId: 'dQw4w9WgXcQ', description: 'Introduction to ML concepts' },
      { title: 'Supervised Learning', duration: '35:15', videoId: 'dQw4w9WgXcQ', description: 'Classification and regression' },
      { title: 'Unsupervised Learning', duration: '28:45', videoId: 'dQw4w9WgXcQ', description: 'Clustering and dimensionality reduction' },
      { title: 'Model Evaluation', duration: '25:20', videoId: 'dQw4w9WgXcQ', description: 'Evaluate and improve models' },
      { title: 'Neural Networks', duration: '40:30', videoId: 'dQw4w9WgXcQ', description: 'Introduction to neural networks' }
    ],
    tags: ['Machine Learning', 'AI', 'Python', 'Algorithms'],
    isPublished: true
  },
  {
    title: 'Digital Marketing Mastery',
    description: 'Learn digital marketing strategies including SEO, social media, email marketing, and analytics.',
    instructor: 'Lisa Thompson',
    category: 'Marketing',
    difficulty: 'Beginner',
    duration: '20 hours',
    thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
    rating: 4.5,
    studentsCount: 11200,
    lessons: [
      { title: 'Digital Marketing Overview', duration: '15:30', videoId: 'dQw4w9WgXcQ', description: 'Introduction to digital marketing' },
      { title: 'SEO Fundamentals', duration: '25:45', videoId: 'dQw4w9WgXcQ', description: 'Search engine optimization' },
      { title: 'Social Media Marketing', duration: '22:15', videoId: 'dQw4w9WgXcQ', description: 'Leverage social platforms' },
      { title: 'Email Marketing', duration: '18:30', videoId: 'dQw4w9WgXcQ', description: 'Build and nurture email lists' },
      { title: 'Analytics and Measurement', duration: '20:45', videoId: 'dQw4w9WgXcQ', description: 'Track and analyze performance' }
    ],
    tags: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
    isPublished: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/readie');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Insert sample courses
    await Course.insertMany(sampleCourses);
    console.log('Sample courses inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();