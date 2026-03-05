'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import YouTubeLayout from '../../../src/components/YouTubeLayout';

export default function CourseDetail() {
  const params = useParams();
  const courseId = params?.id as string;

  // Mock data
  const course = {
    id: courseId,
    title: 'Introduction to Agriculture',
    description: 'Learn the basics of modern farming techniques and sustainable practices.',
    lessons: [
      {
        id: 1,
        title: 'What is Agriculture?',
        content: 'Agriculture is the practice of cultivating plants and livestock to produce food, fiber, and other products.',
        video: '/videos/agriculture-intro.mp4',
      },
      {
        id: 2,
        title: 'History of Farming',
        content: 'Farming has evolved over thousands of years, from subsistence farming to modern industrial agriculture.',
        video: '/videos/history-of-farming.mp4',
      },
      {
        id: 3,
        title: 'Modern Farming Techniques',
        content: 'Explore contemporary farming methods including precision agriculture, hydroponics, and vertical farming.',
        video: '/videos/modern-farming.mp4',
      },
    ],
  };

  return (
    <YouTubeLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl font-bold text-blue-600 hover:bg-blue-50 transition duration-300 shadow-lg"
            >
              ← Back to Courses
            </Link>
          </div>

          {/* Course Header */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-l-4 border-blue-500">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3">
              {course.title}
            </h1>
            <p className="text-gray-700 text-lg font-semibold leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Lessons */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 mb-4">📚 Course Lessons</h2>
            {course.lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 p-8"
              >
                {/* Lesson Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center flex-shrink-0 font-black text-white text-xl">
                    {lesson.id}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 pt-2">
                    {lesson.title}
                  </h3>
                </div>

                {/* Lesson Content */}
                <p className="text-gray-700 text-lg mb-6 leading-relaxed ml-16">
                  {lesson.content}
                </p>

                {/* Video Placeholder */}
                <div className="ml-16 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-2xl h-64 flex items-center justify-center cursor-pointer hover:shadow-lg transition duration-300">
                  <div className="text-center">
                    <p className="text-6xl mb-2">🎥</p>
                    <p className="text-white font-bold text-lg">Video Lesson: {lesson.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enrollment Info */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl shadow-2xl p-8 mt-12 text-white">
            <h3 className="text-2xl font-black mb-2">Ready to Learn?</h3>
            <p className="text-lg mb-4 font-semibold">Start this course today and master agricultural practices!</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-black text-lg hover:scale-110 transition duration-300 shadow-lg">
              ✓ Enroll Now
            </button>
          </div>
        </div>
      </div>
    </YouTubeLayout>
  );
}