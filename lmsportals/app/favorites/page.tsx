'use client';

import React, { useState, useEffect } from 'react';
import YouTubeLayout from '../../src/components/YouTubeLayout';

interface FavoriteVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
  views: string;
  uploadedAt: string;
  videoUrl: string;
  addedAt: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('farmtube_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        // Initialize with sample favorites
        const sampleFavorites: FavoriteVideo[] = [
          {
            id: '1',
            title: 'How to Prepare Soil for Planting',
            description: 'Learn the essential steps to prepare your soil for optimal plant growth. This comprehensive guide covers soil testing, amendments, and best practices.',
            thumbnail: '/thumbnails/prepare-soil.jpg',
            channel: 'Farming Master',
            views: '2.3M views',
            uploadedAt: '2 weeks ago',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            addedAt: new Date().toLocaleDateString(),
          },
          {
            id: '2',
            title: 'Efficient Irrigation Techniques',
            description: 'Master modern irrigation methods to save water and increase crop yield. Discover drip irrigation, sprinkler systems, and smart watering.',
            thumbnail: '/thumbnails/irrigation.jpg',
            channel: 'Green Harvest',
            views: '1.8M views',
            uploadedAt: '1 week ago',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            addedAt: new Date().toLocaleDateString(),
          },
          {
            id: '3',
            title: 'Organic Pest Control Methods',
            description: 'Protect your crops naturally without harmful chemicals. Learn about beneficial insects, natural pesticides, and integrated pest management.',
            thumbnail: '/thumbnails/organic-pest-control.jpg',
            channel: 'Sustainable Farms',
            views: '1.5M views',
            uploadedAt: '3 days ago',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            addedAt: new Date().toLocaleDateString(),
          },
        ];
        setFavorites(sampleFavorites);
        localStorage.setItem('farmtube_favorites', JSON.stringify(sampleFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage
  const saveToStorage = (updated: FavoriteVideo[]) => {
    localStorage.setItem('farmtube_favorites', JSON.stringify(updated));
    setFavorites(updated);
  };

  // Remove from favorites
  const removeFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      const updated = favorites.filter((v) => v.id !== id);
      saveToStorage(updated);
      alert('Removed from favorites!');
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing from favorites');
    }
  };

  if (isLoading) {
    return (
      <YouTubeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">Loading favorites...</p>
        </div>
      </YouTubeLayout>
    );
  }

  return (
    <YouTubeLayout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              ⭐ My Favorite Videos
            </h1>
            <p className="text-gray-700 text-lg font-semibold">
              Your curated collection of farming education content
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-amber-500">
              <p className="text-gray-600 text-sm font-bold">Total Favorites</p>
              <p className="text-4xl font-black text-amber-600 mt-2">{favorites.length}</p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm font-bold">Videos Saved</p>
              <p className="text-4xl font-black text-orange-600 mt-2">{favorites.length}</p>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-red-500">
              <p className="text-gray-600 text-sm font-bold">Last Added</p>
              <p className="text-lg font-black text-red-600 mt-2">
                {favorites.length > 0 ? favorites[0].addedAt : 'N/A'}
              </p>
            </div>
          </div>

          {/* Videos Grid */}
          {favorites.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
              <p className="text-6xl mb-4">⭐</p>
              <p className="text-2xl font-black text-gray-400 mb-4">No Favorites Yet</p>
              <p className="text-gray-600">
                Start adding videos to your favorites while watching! Click the star icon in the video player.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105 border-2 border-transparent hover:border-amber-400"
                >
                  {/* Thumbnail */}
                  <div className="relative bg-gradient-to-br from-amber-300 to-orange-300 h-48 overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-125 transition duration-500 filter group-hover:brightness-110"
                    />

                    {/* Duration badge */}
                    <span className="absolute bottom-3 right-3 bg-black bg-opacity-90 text-white text-xs px-4 py-2 rounded-full font-black">
                      12:45
                    </span>

                    {/* Remove from favorites button */}
                    <button
                      onClick={(e) => removeFavorite(video.id, e)}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg transition-all hover:scale-110 shadow-lg"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Channel Avatar */}
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 rounded-full flex-shrink-0 shadow-lg flex items-center justify-center font-bold text-white text-lg">
                        ⭐
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h3 className="font-black text-gray-900 line-clamp-2 group-hover:text-amber-600 text-sm leading-tight transition duration-300">
                          {video.title}
                        </h3>

                        {/* Channel */}
                        <p className="text-xs font-bold text-amber-600 group-hover:text-amber-800 mt-1">
                          {video.channel}
                        </p>

                        {/* Stats */}
                        <p className="text-xs text-gray-500 font-semibold mt-1">
                          {video.views} • {video.uploadedAt}
                        </p>

                        {/* Description */}
                        <p className="text-xs text-gray-700 line-clamp-2 mt-2 leading-relaxed group-hover:text-gray-900">
                          {video.description}
                        </p>

                        {/* Added date */}
                        <p className="text-xs text-amber-500 font-bold mt-2">
                          Added: {video.addedAt}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent bar */}
                  <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 group-hover:h-2 transition-all duration-300"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </YouTubeLayout>
  );
}
