'use client';

import React, { useState, useEffect } from 'react';
import YouTubeLayout from '../lmsportals/src/components/YouTubeLayout';
import VideoCard from '../lmsportals/src/components/VideoCard';

interface UploadedVideo {
  id: string;
  title: string;
  description: string;
  file: string;
  videoUrl: string;
  uploadedAt: string;
  status: 'uploading' | 'completed' | 'processing';
}

export default function Home() {
  const [uploadedVideos, setUploadedVideos] = useState<UploadedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load videos from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('farmtube_uploads');
      if (stored) {
        setUploadedVideos(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
    setIsLoading(false);
  }, []);

  return (
    <YouTubeLayout>
      <div className="bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 min-h-screen">
        {/* Welcome Section */}
        <div className="px-10 py-16 text-center">
          <h1 className="text-6xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🌾 Welcome to Farming LMS Portal
          </h1>
          <p className="text-xl text-gray-700 font-semibold mb-8 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive learning platform for agriculture education. Explore courses, upload videos, create playlists, and connect with the farming community!
          </p>
          
          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <a href="/courses" className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-blue-400">
              <p className="text-4xl mb-3">📚</p>
              <h3 className="font-black text-gray-900 mb-2">Courses</h3>
              <p className="text-sm text-gray-600">Explore farming courses</p>
            </a>
            
            <a href="/upload" className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-purple-400">
              <p className="text-4xl mb-3">📤</p>
              <h3 className="font-black text-gray-900 mb-2">Upload</h3>
              <p className="text-sm text-gray-600">Share your videos</p>
            </a>
            
            <a href="/playlists" className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-emerald-400">
              <p className="text-4xl mb-3">📋</p>
              <h3 className="font-black text-gray-900 mb-2">Playlists</h3>
              <p className="text-sm text-gray-600">Organize your videos</p>
            </a>
            
            <a href="/favorites" className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-amber-400">
              <p className="text-4xl mb-3">⭐</p>
              <h3 className="font-black text-gray-900 mb-2">Favorites</h3>
              <p className="text-sm text-gray-600">Your favorite videos</p>
            </a>
          </div>
        </div>

        {/* Uploaded Videos Section */}
        {uploadedVideos.length > 0 && (
          <div className="px-10 py-12">
            <h2 className="text-4xl font-black text-gray-900 mb-8">
              🎥 Recently Uploaded Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {uploadedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  description={video.description}
                  thumbnail="placeholder"
                  channel="Community Upload"
                  views={`Uploaded ${video.uploadedAt}`}
                  uploadedAt={video.uploadedAt}
                  videoUrl={video.videoUrl}
                />
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="px-10 py-16 bg-gradient-to-r from-emerald-100 via-green-100 to-teal-100 mx-10 rounded-3xl mt-8 mb-16">
          <h2 className="text-4xl font-black text-center text-gray-900 mb-8">✨ Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-3xl mb-3">🎓</p>
              <h3 className="font-black text-gray-900 mb-2">Learn</h3>
              <p className="text-gray-700 font-semibold">Access comprehensive farming education and agricultural courses</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-3xl mb-3">📹</p>
              <h3 className="font-black text-gray-900 mb-2">Share</h3>
              <p className="text-gray-700 font-semibold">Upload and share your farming knowledge with the community</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <p className="text-3xl mb-3">🎯</p>
              <h3 className="font-black text-gray-900 mb-2">Organize</h3>
              <p className="text-gray-700 font-semibold">Create playlists and manage your learning journey</p>
            </div>
          </div>
        </div>
      </div>
    </YouTubeLayout>
  );
}
