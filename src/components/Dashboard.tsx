import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Video,
  FileText,
  User,
  HelpCircle,
  LogOut,
  Search,
  Star,
  Play,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
  onOpenCourse: (course: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onLogout,
  onOpenCourse,
}) => {
  const [activeSection, setActiveSection] = useState('courses');
  const [activeSubSection, setActiveSubSection] = useState('all');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    courses: true,
    profile: false,
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (menu: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const menuItems = [
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      hasSubmenu: true,
      submenu: [
        { id: 'all', label: 'All Courses' },
        { id: 'my', label: 'My Courses' },
        { id: 'recommended', label: 'Recommended' },
      ],
    },
    {
      id: 'lectures',
      label: 'Lectures',
      icon: Video,
      hasSubmenu: false,
    },
    {
      id: 'notes',
      label: 'Notes',
      icon: FileText,
      hasSubmenu: false,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      hasSubmenu: true,
      submenu: [
        { id: 'account', label: 'Account' },
        { id: 'settings', label: 'Settings' },
      ],
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      hasSubmenu: false,
    },
  ];

  const sampleCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'John Doe',
      rating: 4.8,
      students: 15420,
      duration: '40 hours',
      thumbnail:
        'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      category: 'Web Development',
      progress: 65,
      isEnrolled: true,
    },
    {
      id: 2,
      title: 'Data Science with Python',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      students: 8750,
      duration: '35 hours',
      thumbnail:
        'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg',
      category: 'Data Science',
      progress: 0,
      isEnrolled: false,
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Chen',
      rating: 4.7,
      students: 12300,
      duration: '25 hours',
      thumbnail:
        'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
      category: 'Design',
      progress: 30,
      isEnrolled: true,
    },
    {
      id: 4,
      title: 'Mobile App Development with React Native',
      instructor: 'Emily Davis',
      rating: 4.6,
      students: 9800,
      duration: '45 hours',
      thumbnail:
        'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
      category: 'Mobile Development',
      progress: 0,
      isEnrolled: false,
    },
    {
      id: 5,
      title: 'Machine Learning Basics',
      instructor: 'David Wilson',
      rating: 4.8,
      students: 7650,
      duration: '30 hours',
      thumbnail:
        'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg',
      category: 'Machine Learning',
      progress: 80,
      isEnrolled: true,
    },
    {
      id: 6,
      title: 'Digital Marketing Mastery',
      instructor: 'Lisa Thompson',
      rating: 4.5,
      students: 11200,
      duration: '20 hours',
      thumbnail:
        'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg',
      category: 'Marketing',
      progress: 0,
      isEnrolled: false,
    },
  ];

  const filteredCourses = sampleCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;

    if (activeSubSection === 'my') {
      return matchesSearch && matchesCategory && course.isEnrolled;
    }
    if (activeSubSection === 'recommended') {
      return matchesSearch && matchesCategory && course.rating >= 4.7;
    }
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(sampleCourses.map((c) => c.category))];

  const renderContent = () => {
    if (activeSection === 'courses') {
      return (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {activeSubSection === 'all' && 'All Courses'}
                {activeSubSection === 'my' && 'My Courses'}
                {activeSubSection === 'recommended' && 'Recommended Courses'}
              </h1>
              <p className="text-gray-600">
                {filteredCourses.length} courses available
              </p>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm border animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-300 rounded-t-xl" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                    <div className="h-3 bg-gray-300 rounded w-1/2" />
                    <div className="h-3 bg-gray-300 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => onOpenCourse(course)}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    {course.isEnrolled && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Enrolled
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      by {course.instructor}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-700">
                          {course.rating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({course.students.toLocaleString()})
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock size={14} />
                        <span className="text-sm">{course.duration}</span>
                      </div>
                    </div>

                    {course.isEnrolled && course.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {course.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Other sections placeholder
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
        <p className="text-gray-600">This section is under development.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-400 rounded-full" />
              <div className="w-3 h-3 bg-red-400 rounded-full" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Gangabhodh
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.hasSubmenu) {
                    toggleMenu(item.id);
                  } else {
                    setActiveSection(item.id);
                  }
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.hasSubmenu &&
                  (expandedMenus[item.id] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  ))}
              </button>

              {item.hasSubmenu && expandedMenus[item.id] && (
                <div className="ml-6 mt-2 space-y-1">
                  {item.submenu?.map((subItem) => (
                    <button
                      key={subItem.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setActiveSubSection(subItem.id);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === item.id &&
                        activeSubSection === subItem.id
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {subItem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{renderContent()}</div>
      </div>
    </div>
  );
};
