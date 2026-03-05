'use client';

import Link from 'next/link';
import YouTubeLayout from '../../src/components/YouTubeLayout';

export default function Courses() {
  const courses = [
    { id: 1, title: 'Introduction to Agriculture', description: 'Learn the basics of modern farming techniques and best practices.' },
    { id: 2, title: 'Crop Management', description: 'Techniques for effective crop production and yield optimization.' },
    { id: 3, title: 'Sustainable Farming', description: 'Eco-friendly agricultural practices for long-term success.' },
    { id: 4, title: 'Soil Health & Fertility', description: 'Master soil management and nutrient optimization.' },
    { id: 5, title: 'Pest & Disease Management', description: 'Integrated approaches to protect your crops naturally.' },
    { id: 6, title: 'Water Conservation', description: 'Smart irrigation and water management strategies.' },
  ];

  return (
    <YouTubeLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              📚 Farming Courses
            </h1>
            <p className="text-gray-700 text-lg font-semibold">
              Master agricultural techniques with our comprehensive course library
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105 border-2 border-transparent hover:border-blue-400"
              >
                {/* Thumbnail */}
                <div className="relative bg-gradient-to-br from-blue-400 to-cyan-400 h-48 overflow-hidden cursor-pointer flex items-center justify-center">
                  <p className="text-6xl">📖</p>
                </div>

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-black text-gray-900 text-lg mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Enroll Button */}
                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition duration-300 shadow-lg text-center"
                  >
                    📚 Enroll Now
                  </Link>
                </div>

                {/* Bottom accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-400 to-cyan-500"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </YouTubeLayout>
  );
}