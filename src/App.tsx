import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { CoursePlayer } from './components/CoursePlayer';

type View = 'landing' | 'dashboard' | 'course';
type AuthMode = 'login' | 'signup';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<any | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token and get user data
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setCurrentView('dashboard');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleAuth = (userData: any) => {
    setUser(userData);
    setCurrentView('dashboard');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setCurrentView('landing');
  };

  const openCourse = (course: any) => {
    setSelectedCourse(course);
    setCurrentView('course');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <LandingPage
            onShowAuth={setShowAuthModal}
            onSetAuthMode={setAuthMode}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onOpenCourse={openCourse}
          />
        );
      case 'course':
        return (
          <CoursePlayer
            course={selectedCourse}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      default:
        return (
          <LandingPage
            onShowAuth={setShowAuthModal}
            onSetAuthMode={setAuthMode}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderCurrentView()}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onAuth={handleAuth}
          onToggleMode={() =>
            setAuthMode(authMode === 'login' ? 'signup' : 'login')
          }
        />
      )}
    </div>
  );
}

export default App;
