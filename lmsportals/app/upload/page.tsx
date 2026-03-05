'use client';

import React, { useState } from 'react';
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

export default function UploadPage() {
  const [videos, setVideos] = useState<UploadedVideo[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setIsUploading(true);
      
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Convert file to Base64
      const videoFile = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const base64String = event.target?.result as string;

        const newVideo: UploadedVideo = {
          id: Date.now().toString(),
          title: formData.title || 'Untitled Video',
          description: formData.description || 'No description provided',
          file: videoFile.name,
          videoUrl: base64String, // Store Base64 encoded video
          uploadedAt: new Date().toLocaleDateString(),
          status: 'completed',
        };

        setVideos((prev) => [newVideo, ...prev]);
        
        // Save to localStorage
        const stored = localStorage.getItem('farmtube_uploads');
        const allVideos = stored ? JSON.parse(stored) : [];
        localStorage.setItem('farmtube_uploads', JSON.stringify([newVideo, ...allVideos]));

        // Show success message
        setTimeout(() => {
          alert(`✅ Video "${formData.title || 'Untitled Video'}" uploaded successfully!\n\nView it in My Videos`);
        }, 500);

        // Reset form
        setFormData({ title: '', description: '' });
        setUploadProgress(0);
        setIsUploading(false);
        
        // Reset file input
        e.target.value = '';
      };
      
      reader.readAsDataURL(videoFile);
    }
  };

  return (
    <YouTubeLayout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-2">
              📤 Upload Your Videos
            </h1>
            <p className="text-gray-700 text-lg font-semibold">
              Share your farming expertise with the community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-purple-200">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                🎬 Upload New Video
              </h2>

              <form className="space-y-6">
                {/* Video Title */}
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">
                    Video Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter video title..."
                    className="w-full px-6 py-4 border-2 border-purple-300 rounded-2xl bg-white text-gray-900 font-bold text-lg placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>

                {/* Video Description */}
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your video content..."
                    rows={4}
                    className="w-full px-6 py-4 border-2 border-purple-300 rounded-2xl bg-white text-gray-900 font-bold text-lg placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-200 transition-all duration-300 resize-none"
                  />
                </div>

                {/* Video File Upload */}
                <div>
                  <label className="block text-sm font-black text-gray-700 mb-3">
                    Select Video File *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                      id="videoInput"
                    />
                    <label
                      htmlFor="videoInput"
                      className={`flex items-center justify-center gap-3 w-full px-8 py-6 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300 font-bold text-lg ${
                        isUploading
                          ? 'border-purple-400 bg-purple-50'
                          : 'border-purple-300 hover:border-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      <span className="text-3xl">🎥</span>
                      <span className="text-purple-600">
                        {isUploading ? 'Uploading...' : 'Click to upload video'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-gray-700">Upload Progress</p>
                      <p className="font-black text-purple-600 text-lg">{uploadProgress}%</p>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Upload Info */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
                  <p className="text-sm font-bold text-gray-700 mb-2">📋 Supported Formats:</p>
                  <p className="text-xs text-gray-600 font-semibold">
                    MP4, WebM, Ogg, MOV (Max 500MB)
                  </p>
                </div>
              </form>
            </div>

            {/* Uploaded Videos List */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-pink-200">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-2">
                📚 Your Videos ({videos.length})
              </h2>

              {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-5xl mb-4">📹</p>
                  <p className="text-gray-400 font-bold mb-2">No videos uploaded yet</p>
                  <p className="text-gray-500 text-sm">Upload your first video to get started!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200 hover:border-purple-400 transition duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-black text-gray-900 text-sm mb-1 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-xs text-gray-600 font-semibold mb-2">
                            {video.file}
                          </p>
                          <p className="text-xs text-gray-500">
                            📅 {video.uploadedAt}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black ${
                              video.status === 'completed'
                                ? 'bg-green-500 text-white'
                                : video.status === 'processing'
                                ? 'bg-yellow-500 text-white'
                                : 'bg-blue-500 text-white'
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          {videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm font-bold">Total Uploads</p>
                <p className="text-4xl font-black text-purple-600 mt-2">{videos.length}</p>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-pink-500">
                <p className="text-gray-600 text-sm font-bold">Status: Ready</p>
                <p className="text-4xl font-black text-pink-600 mt-2">
                  {videos.filter((v) => v.status === 'completed').length}
                </p>
              </div>
              <div className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-rose-500">
                <p className="text-gray-600 text-sm font-bold">Last Uploaded</p>
                <p className="text-lg font-black text-rose-600 mt-2">
                  {videos[0]?.uploadedAt}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </YouTubeLayout>
  );
}
