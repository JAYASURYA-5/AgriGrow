'use client';

import React, { useState, useEffect } from 'react';
import YouTubeLayout from '../../src/components/YouTubeLayout';

interface PlaylistVideo {
  id: string;
  title: string;
  videoUrl: string;
  watched: boolean;
  watchedDuration: number;
  totalDuration: number;
}

interface Playlist {
  id: string;
  name: string;
  videos: PlaylistVideo[];
  createdAt: string;
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load playlists from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('farmtube_playlists');
      if (stored) {
        setPlaylists(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
    setIsLoading(false);
  }, []);

  // Save playlists to localStorage
  const saveToStorage = (updated: Playlist[]) => {
    localStorage.setItem('farmtube_playlists', JSON.stringify(updated));
    setPlaylists(updated);
  };

  // Create new playlist
  const createPlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name && name.trim()) {
      const newPlaylist: Playlist = {
        id: Date.now().toString(),
        name: name.trim(),
        videos: [],
        createdAt: new Date().toLocaleDateString(),
      };
      const updated = [...playlists, newPlaylist];
      saveToStorage(updated);
      setSelectedPlaylist(newPlaylist);
    }
  };

  // Delete playlist
  const deletePlaylist = (id: string) => {
    if (confirm('Delete this playlist?')) {
      const updated = playlists.filter((p) => p.id !== id);
      saveToStorage(updated);
      if (selectedPlaylist?.id === id) {
        setSelectedPlaylist(null);
      }
    }
  };

  // Toggle video watched status
  const toggleWatched = (videoId: string) => {
    if (!selectedPlaylist) return;

    const updated = playlists.map((p) => {
      if (p.id === selectedPlaylist.id) {
        return {
          ...p,
          videos: p.videos.map((v) =>
            v.id === videoId ? { ...v, watched: !v.watched } : v
          ),
        };
      }
      return p;
    });

    saveToStorage(updated);
    const newSelected = updated.find((p) => p.id === selectedPlaylist.id);
    if (newSelected) setSelectedPlaylist(newSelected);
  };

  // Calculate stats
  const calculateStats = (playlist: Playlist) => {
    const totalVideos = playlist.videos.length;
    const watchedVideos = playlist.videos.filter((v) => v.watched).length;
    const remainingVideos = totalVideos - watchedVideos;
    const completionPercent = totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0;
    const totalDuration = playlist.videos.reduce((sum, v) => sum + v.totalDuration, 0);
    const watchedDuration = playlist.videos.reduce((sum, v) => sum + v.watchedDuration, 0);

    return { totalVideos, watchedVideos, remainingVideos, completionPercent, totalDuration, watchedDuration };
  };

  if (isLoading) {
    return (
      <YouTubeLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-xl text-gray-600">Loading playlists...</p>
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
            <h1 className="text-5xl font-black bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-2">
              📚 My Learning Playlists
            </h1>
            <p className="text-gray-700 text-lg font-semibold">
              Organize your farming education journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Playlists Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-2xl p-8 sticky top-32">
                <h2 className="text-2xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  📋 Playlists
                </h2>

                <button
                  onClick={createPlaylist}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-black mb-6 hover:scale-105 transition duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  ➕ Create Playlist
                </button>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {playlists.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No playlists yet</p>
                  ) : (
                    playlists.map((playlist) => {
                      const stats = calculateStats(playlist);
                      return (
                        <div
                          key={playlist.id}
                          onClick={() => setSelectedPlaylist(playlist)}
                          className={`p-4 rounded-2xl cursor-pointer transition duration-300 font-bold text-sm border-2 ${
                            selectedPlaylist?.id === playlist.id
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-600 shadow-lg'
                              : 'bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          <p className="truncate">{playlist.name}</p>
                          <p className="text-xs opacity-75">
                            {stats.watchedVideos}/{stats.totalVideos} videos
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {selectedPlaylist ? (
                <>
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {(() => {
                      const stats = calculateStats(selectedPlaylist);
                      return (
                        <>
                          <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-blue-500">
                            <p className="text-gray-600 text-sm font-bold">Total Videos</p>
                            <p className="text-4xl font-black text-blue-600 mt-2">{stats.totalVideos}</p>
                          </div>
                          <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-green-500">
                            <p className="text-gray-600 text-sm font-bold">Watched</p>
                            <p className="text-4xl font-black text-green-600 mt-2">{stats.watchedVideos}</p>
                          </div>
                          <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-orange-500">
                            <p className="text-gray-600 text-sm font-bold">Remaining</p>
                            <p className="text-4xl font-black text-orange-600 mt-2">{stats.remainingVideos}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Progress Visualization */}
                  {(() => {
                    const stats = calculateStats(selectedPlaylist);
                    return (
                      <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-black text-gray-900">Overall Progress</h3>
                          <p className="text-3xl font-black text-emerald-600">
                            {Math.round(stats.completionPercent)}%
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 h-full transition-all duration-500 rounded-full shadow-lg"
                            style={{ width: `${stats.completionPercent}%` }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-4 border-2 border-emerald-200">
                            <p className="text-xs text-gray-600 font-bold">Total Duration</p>
                            <p className="text-2xl font-black text-emerald-600">
                              {Math.floor(stats.totalDuration / 60)}h {stats.totalDuration % 60}m
                            </p>
                          </div>
                          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-4 border-2 border-teal-200">
                            <p className="text-xs text-gray-600 font-bold">Watched Duration</p>
                            <p className="text-2xl font-black text-teal-600">
                              {Math.floor(stats.watchedDuration / 60)}h {stats.watchedDuration % 60}m
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Videos List */}
                  <div className="bg-white rounded-3xl shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-black text-gray-900">Videos</h3>
                      <button
                        onClick={() => deletePlaylist(selectedPlaylist.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-red-600 transition duration-300"
                      >
                        🗑️ Delete
                      </button>
                    </div>

                    {selectedPlaylist.videos.length === 0 ? (
                      <p className="text-gray-500 text-center py-12">
                        No videos in this playlist yet. Add videos from the home page!
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {selectedPlaylist.videos.map((video, index) => (
                          <div
                            key={video.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-2xl border-2 border-gray-200 hover:border-emerald-400 transition duration-300"
                          >
                            <span className="text-2xl font-black text-gray-400">{index + 1}</span>

                            <div className="flex-1">
                              <p className="font-bold text-gray-900 text-sm">{video.title}</p>
                              <p className="text-xs text-gray-600 mt-1">
                                {Math.floor(video.watchedDuration / 60)}m/{Math.floor(video.totalDuration / 60)}m watched
                              </p>
                            </div>

                            <button
                              onClick={() => toggleWatched(video.id)}
                              className={`px-4 py-2 rounded-xl font-bold transition duration-300 ${
                                video.watched
                                  ? 'bg-green-500 text-white hover:bg-green-600'
                                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                              }`}
                            >
                              {video.watched ? '✓ Watched' : '◯ Not Watched'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                  <p className="text-2xl font-black text-gray-400 mb-4">📭 No Playlist Selected</p>
                  <p className="text-gray-600">Create or select a playlist to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </YouTubeLayout>
  );
}
