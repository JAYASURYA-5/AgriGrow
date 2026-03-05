"use client";
import React, { useState } from 'react';
import YouTubeLayout from '../../src/components/YouTubeLayout';
import VideoPlayer from '../../src/components/VideoPlayer';

const videos = [
  {
    id: 1,
    title: 'How to Prepare Soil for Farming',
    description: 'Step-by-step guide to preparing soil for crops.',
    src: '/videos/prepare-soil.mp4',
    thumbnail: '/thumbnails/prepare-soil.jpg',
  },
  {
    id: 2,
    title: 'Irrigation Techniques Explained',
    description: 'Learn about modern irrigation methods for better yield.',
    src: '/videos/irrigation.mp4',
    thumbnail: '/thumbnails/irrigation.jpg',
  },
  {
    id: 3,
    title: 'Organic Pest Control',
    description: 'Natural ways to protect your crops from pests.',
    src: '/videos/organic-pest-control.mp4',
    thumbnail: '/thumbnails/organic-pest-control.jpg',
  },
];

export default function FarmingVideos() {
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  return (
    <YouTubeLayout>
      <div className="bg-gray-100 min-h-screen p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer src={selectedVideo.src} title={selectedVideo.title} />
            </div>
            <div className="bg-white rounded-lg p-6 mt-4 shadow">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedVideo.title}</h1>
              <p className="text-gray-600">{selectedVideo.description}</p>
              <div className="mt-4 flex gap-4">
                <button className="bg-red-600 text-white px-6 py-2 rounded-full font-medium hover:bg-red-700 transition">
                  Subscribe
                </button>
                <button className="bg-gray-200 text-gray-900 px-6 py-2 rounded-full font-medium hover:bg-gray-300 transition">
                  👍 Like
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Videos */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended Videos</h2>
            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`cursor-pointer p-3 rounded-lg transition ${
                    selectedVideo.id === video.id ? 'bg-blue-100 border-2 border-blue-500' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{video.description.substring(0, 40)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </YouTubeLayout>
  );
}
