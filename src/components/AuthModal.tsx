import React, { useState } from 'react';
import { X, Mail, Phone, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onAuth: (userData: any) => void;
  onToggleMode: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onAuth, onToggleMode }) => {
  const [step, setStep] = useState('credentials'); // credentials, otp
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [authMethod, setAuthMethod] = useState('email'); // email, phone
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (step === 'credentials') {
        // Validate form
        if (mode === 'signup') {
          if (!formData.name.trim()) {
            setError('Name is required');
            return;
          }
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
          }
          if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
          }
        }

        const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        const payload = {
          ...formData,
          authMethod
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          if (mode === 'signup') {
            setStep('otp');
          } else {
            localStorage.setItem('authToken', data.token);
            onAuth(data.user);
          }
        } else {
          setError(data.message || 'Authentication failed');
        }
      } else if (step === 'otp') {
        // Verify OTP
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
          setError('Please enter the complete OTP');
          return;
        }

        const response = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            [authMethod]: formData[authMethod],
            otp: otpCode
          })
        });

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem('authToken', data.token);
          onAuth(data.user);
        } else {
          setError(data.message || 'Invalid OTP');
        }
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          [authMethod]: formData[authMethod]
        })
      });

      const data = await response.json();
      if (response.ok) {
        setError('');
        // Show success message
      } else {
        setError(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'otp' ? 'Verify OTP' : (mode === 'login' ? 'Welcome Back' : 'Create Account')}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {step === 'credentials' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {mode === 'signup' ? 'Choose Login Method' : 'Login With'}
                </label>
                <div className="flex space-x-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('email')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      authMethod === 'email' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-300 text-gray-600'
                    } flex items-center justify-center space-x-2`}
                  >
                    <Mail size={16} />
                    <span>Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className={`flex-1 py-2 px-4 rounded-lg border ${
                      authMethod === 'phone' 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                        : 'border-gray-300 text-gray-600'
                    } flex items-center justify-center space-x-2`}
                  >
                    <Phone size={16} />
                    <span>Phone</span>
                  </button>
                </div>
                
                <input
                  type={authMethod === 'email' ? 'email' : 'tel'}
                  name={authMethod}
                  value={formData[authMethod as keyof typeof formData]}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-12"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">
                We've sent a 6-digit code to your {authMethod === 'email' ? 'email' : 'phone number'}
              </p>
              
              <div className="flex space-x-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    maxLength={1}
                  />
                ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleResendOtp}
                  className="flex-1 text-emerald-600 py-3 rounded-lg border border-emerald-600 hover:bg-emerald-50 transition-colors font-medium"
                >
                  Resend Code
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || otp.join('').length !== 6}
                  className="flex-1 bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {step === 'credentials' && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={onToggleMode}
                  className="text-emerald-600 hover:text-emerald-700 font-medium ml-2"
                >
                  {mode === 'login' ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};