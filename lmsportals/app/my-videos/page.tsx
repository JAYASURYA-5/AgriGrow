'use client';

import React, { useState, useEffect } from 'react';
import YouTubeLayout from '../../src/components/YouTubeLayout';

interface UploadedVideo {
  id: string;
  title: string;
  description: string;
  file: string;
  videoUrl: string;
  uploadedAt: string;
  status: 'uploading' | 'completed' | 'processing';
}

export default function MyVideosPage() {
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState<string | null>(null);

  // Load videos from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('farmtube_uploads');
      if (stored) {
        setVideos(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
    setIsLoading(false);
  }, []);

  const deleteVideo = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const updated = videos.filter((v) => v.id !== id);
        setVideos(updated);
        localStorage.setItem('farmtube_uploads', JSON.stringify(updated));
        if (showPlayer === id) {
          setShowPlayer(null);
        }
        alert('Video deleted successfully!');
      } catch (error) {
        console.error('Error deleting video:', error);
        alert('Error deleting video');
      }
    }
  };

  if (isLoading) {
    return (
      <YouTubeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">Loading your videos...</p>
        </div>
      </YouTubeLayout>
    );
  }

  return (
    <YouTubeLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              🎬 My Uploaded Videos
            </h1>
            <p className="text-gray-700 text-lg font-semibold">
              View and manage all your farming education videos
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-bold">Total Videos</p>
              <p className="text-4xl font-black text-purple-600 mt-2">{videos.length}</p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-pink-500">
              <p className="text-gray-600 text-sm font-bold">Completed</p>
              <p className="text-4xl font-black text-pink-600 mt-2">
                {videos.filter((v) => v.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-rose-500">
              <p className="text-gray-600 text-sm font-bold">Processing</p>
              <p className="text-4xl font-black text-rose-600 mt-2">
                {videos.filter((v) => v.status === 'processing').length}
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-amber-500">
              <p className="text-gray-600 text-sm font-bold">Total Size</p>
              <p className="text-4xl font-black text-amber-600 mt-2">
                {videos.length > 0 ? (videos.length * 45).toFixed(0) : 0}MB
              </p>
            </div>
          </div>

          {/* Videos Grid */}
          {videos.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-2xl p-16 text-center">
              <p className="text-6xl mb-4">🎬</p>
              <p className="text-2xl font-black text-gray-400 mb-4">No Videos Yet</p>
              <p className="text-gray-600 mb-6">
                Upload your first farming education video to share with the community!
              </p>
              <a
                href="/upload"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-black text-lg hover:scale-110 transition-transform duration-300 shadow-lg"
              >
                📤 Go to Upload
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-105 border-2 border-transparent hover:border-purple-400"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative bg-gradient-to-br from-purple-400 to-pink-400 h-48 overflow-hidden cursor-pointer"
                    onClick={() => setShowPlayer(video.id)}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-6xl">🎥</p>
                    </div>

                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-500 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white bg-opacity-0 group-hover:bg-opacity-90 transition duration-500 rounded-full flex items-center justify-center shadow-2xl">
                        <span className="text-purple-600 text-3xl font-black group-hover:scale-125 transition duration-300">
                          ▶
                        </span>
                      </div>
                    </div>

                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-4 py-2 rounded-full text-xs font-black text-white ${
                          video.status === 'completed'
                            ? 'bg-green-500'
                            : video.status === 'processing'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                        }`}
                      >
                        {video.status === 'completed'
                          ? '✓ Ready'
                          : video.status === 'processing'
                          ? '⏳ Processing'
                          : '📤 Uploading'}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="font-black text-gray-900 line-clamp-2 text-lg mb-2">
                      {video.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-semibold mb-3">
                      📁 {video.file}
                    </p>
                    <p className="text-xs text-gray-700 line-clamp-2 mb-4">
                      {video.description}
                    </p>

                    {/* Date */}
                    <p className="text-xs text-gray-500 font-bold mb-4">
                      📅 Uploaded: {video.uploadedAt}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowPlayer(video.id)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold hover:scale-105 transition duration-300 shadow-lg"
                      >
                        ▶ Play
                      </button>
                      <button
                        onClick={(e) => deleteVideo(video.id, e)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 transition duration-300 shadow-lg"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="h-1 bg-gradient-to-r from-purple-400 to-pink-500"></div>
                </div>
              ))}
            </div>
          )}

          {/* Video Player Modal */}
          {showPlayer && (
            <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4">
              <div className="bg-black rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl relative">
                {/* Close Button */}
                <button
                  onClick={() => setShowPlayer(null)}
                  className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full w-12 h-12 flex items-center justify-center text-black font-bold text-2xl z-10 transition-all duration-300 hover:scale-110"
                >
                  ✕
                </button>

                {/* Video Player */}
                <div className="bg-black relative">
                  <video
                    controls
                    autoPlay
                    className="w-full h-auto"
                    src={videos.find((v) => v.id === showPlayer)?.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>

                  {/* Video Info */}
                  <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-6 text-white">
                    <h2 className="text-2xl font-black mb-2">
                      {videos.find((v) => v.id === showPlayer)?.title}
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">
                      {videos.find((v) => v.id === showPlayer)?.description}
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>📅 {videos.find((v) => v.id === showPlayer)?.uploadedAt}</span>
                      <span>📁 {videos.find((v) => v.id === showPlayer)?.file}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </YouTubeLayout>
  );
}
