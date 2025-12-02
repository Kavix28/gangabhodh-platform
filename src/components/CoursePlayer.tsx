import React, { useState } from 'react';
import { ChevronLeft, Play, CheckCircle, FileText, Download, Star } from 'lucide-react';

interface CoursePlayerProps {
  course: any;
  onBack: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onBack }) => {
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set([0, 1]));

  const lessons = [
    { id: 0, title: 'Introduction to the Course', duration: '5:32', videoId: 'dQw4w9WgXcQ' },
    { id: 1, title: 'Setting up the Environment', duration: '12:45', videoId: 'dQw4w9WgXcQ' },
    { id: 2, title: 'Basic Concepts', duration: '18:22', videoId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Hands-on Practice', duration: '25:10', videoId: 'dQw4w9WgXcQ' },
    { id: 4, title: 'Advanced Techniques', duration: '22:15', videoId: 'dQw4w9WgXcQ' },
    { id: 5, title: 'Project Implementation', duration: '30:45', videoId: 'dQw4w9WgXcQ' },
    { id: 6, title: 'Testing and Debugging', duration: '15:30', videoId: 'dQw4w9WgXcQ' },
    { id: 7, title: 'Deployment and Launch', duration: '20:18', videoId: 'dQw4w9WgXcQ' }
  ];

  const markAsCompleted = (lessonId: number) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const progressPercentage = (completedLessons.size / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft size={20} />
                <span>Back to Courses</span>
              </button>
              <div className="w-px h-6 bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: {Math.round(progressPercentage)}%
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video bg-black relative">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${lessons[activeLesson].videoId}?autoplay=1&rel=0`}
                  title={lessons[activeLesson].title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {lessons[activeLesson].title}
                    </h2>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span>Lesson {activeLesson + 1} of {lessons.length}</span>
                      <span>Duration: {lessons[activeLesson].duration}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => markAsCompleted(activeLesson)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      completedLessons.has(activeLesson)
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle
                      size={16}
                      className={completedLessons.has(activeLesson) ? 'text-emerald-600' : 'text-gray-400'}
                    />
                    <span>{completedLessons.has(activeLesson) ? 'Completed' : 'Mark Complete'}</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">About this lesson</h3>
                  <p className="text-gray-600 leading-relaxed">
                    This lesson covers the fundamental concepts you need to understand before moving forward. 
                    You'll learn about the core principles, best practices, and practical applications that will 
                    form the foundation of your knowledge in this subject area.
                  </p>
                </div>

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <FileText size={16} />
                      <span>Notes</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Download size={16} />
                      <span>Resources</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                      <Star size={16} />
                      <span>Add to Favorites</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Course Content</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {completedLessons.size} of {lessons.length} lessons completed
                </p>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLesson(index)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      activeLesson === index ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {completedLessons.has(index) ? (
                          <CheckCircle size={16} className="text-emerald-600" />
                        ) : (
                          <Play size={16} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium mb-1 ${
                          activeLesson === index ? 'text-emerald-900' : 'text-gray-900'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 mb-2">
                    Course Progress
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    {Math.round(progressPercentage)}% Complete
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};