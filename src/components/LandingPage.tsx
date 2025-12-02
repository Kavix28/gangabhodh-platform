import React from 'react';
import { BookOpen, Users, Shield, Star } from 'lucide-react';

interface LandingPageProps {
  onShowAuth: (show: boolean) => void;
  onSetAuthMode: (mode: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onShowAuth, onSetAuthMode }) => {
  const handleGetStarted = () => {
    onSetAuthMode('signup');
    onShowAuth(true);
  };

  const handleSignIn = () => {
    onSetAuthMode('login');
    onShowAuth(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-wide">Gangabhodh</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium">Home</a>
              <a href="#why-us" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Why Us</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">How It Works</a>
              <a href="#support" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Support</a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Contact</a>
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleSignIn}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition-all transform hover:scale-105 font-medium shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  The Website<br />
                  That Makes<br />
                  <span className="text-emerald-500">Reading Fun!</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Discover thousands of free courses, learn at your own pace, and join a community of lifelong learners. Start your educational journey today!
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <div className="bg-white rounded-2xl p-6 space-y-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Interactive Learning</h3>
                    <p className="text-gray-600">Engage with courses through videos, quizzes, and hands-on projects.</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-8 right-8 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-red-400 rounded-full opacity-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Gangabhodh?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing online learning with our innovative approach to education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Instructors</h3>
              <p className="text-gray-600">Learn from industry professionals and certified educators with real-world experience.</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Free</h3>
              <p className="text-gray-600">Access thousands of high-quality courses without any cost. Education should be accessible to everyone.</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your learning progress and earn certificates upon course completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to start your learning journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up Free</h3>
              <p className="text-gray-600">Create your account with email or phone number. Verify with OTP for security.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Browse Courses</h3>
              <p className="text-gray-600">Explore our extensive library of courses across various subjects and skill levels.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Start Learning</h3>
              <p className="text-gray-600">Watch video lectures, take notes, and track your progress as you learn.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Need Support?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our dedicated support team is here to help you succeed in your learning journey.
          </p>
          <button className="bg-emerald-500 text-white px-8 py-3 rounded-full hover:bg-emerald-600 transition-all transform hover:scale-105 font-medium shadow-lg">
            Contact Support
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                </div>
                <span className="text-2xl font-bold">Gangabhodh</span>
              </div>
              <p className="text-gray-400 mb-6">
                Making quality education accessible to everyone, everywhere. Join millions of learners worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#why-us" className="hover:text-white transition-colors">Why Us</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@Gangabhodh.com</li>
                <li>+1 (555) 123-4567</li>
                <li>24/7 Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Gangabhodh. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
