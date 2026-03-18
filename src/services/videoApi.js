import flaskAuthService from './flaskAuthService';

const API_BASE = 'http://localhost:5000/api';

// In-memory store for video Blob URLs (keeps videos playable during session)
const videoFileStore = new Map();

// Helper: Generate unique ID for videos
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// Helper: Get user ID from auth context
const getUserId = () => {
  try {
    const user = localStorage.getItem('flask_user');
    return user ? JSON.parse(user).id || 'user-1' : 'user-1';
  } catch {
    return 'user-1';
  }
};

// Helper: Store videos in localStorage with user isolation
const getVideosFromStorage = () => {
  try {
    const userId = getUserId();
    const allVideos = JSON.parse(localStorage.getItem('user_videos') || '{}');
    return allVideos[userId] || [];
  } catch {
    return [];
  }
};

const saveVideosToStorage = (videos) => {
  const userId = getUserId();
  const allVideos = JSON.parse(localStorage.getItem('user_videos') || '{}');
  allVideos[userId] = videos;
  localStorage.setItem('user_videos', JSON.stringify(allVideos));
};

export const videoApi = {
  // Upload video file with FormData - works with backend OR uses localStorage fallback
  uploadFile: async (formData) => {
    try {
      // Try backend first
      const headers = flaskAuthService.getHeaders();
      const response = await fetch(`${API_BASE}/videos/upload`, {
        method: 'POST',
        headers: {
          'Authorization': headers.Authorization,
        },
        body: formData
      });

      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Backend unavailable, using local storage');
    }

    // Fallback: Store in localStorage
    try {
      const title = formData.get('title');
      const description = formData.get('description');
      const category = formData.get('category');
      const keywords = formData.get('keywords');
      const videoFile = formData.get('video');

      if (!title || !description || !videoFile) {
        throw new Error('Missing required fields');
      }

      // Create Blob URL for the video (works for session)
      const videoObjectUrl = URL.createObjectURL(videoFile);

      // Generate placeholder image
      const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22250%22%3E%3Crect fill=%22%232d5a8c%22 width=%22400%22 height=%22250%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2224%22%3E▶ Video%3C/text%3E%3C/svg%3E';

      const videoId = generateId();
      const newVideo = {
        id: videoId,
        title,
        description,
        category,
        keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
        fileName: videoFile.name,
        fileSize: videoFile.size,
        uploadedAt: new Date().toISOString(),
        mimeType: videoFile.type,
        videoData: videoObjectUrl, // Use Blob URL
        image: placeholderImage,
        approved: true,
        isUserUploaded: true,
        duration: '0 min',
        author: localStorage.getItem('userName') || 'Farmer',
        readTime: 'Video',
        youtubeId: null,
        isVideo: true
      };

      // Store blob URL in memory so it stays playable
      videoFileStore.set(videoId, videoObjectUrl);

      // Save metadata only to localStorage
      const videos = getVideosFromStorage();
      videos.push(newVideo);
      saveVideosToStorage(videos);
      
      // Also save to 'uploadedVideos' for LMS dashboard
      const allUploaded = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
      allUploaded.unshift(newVideo);
      localStorage.setItem('uploadedVideos', JSON.stringify(allUploaded));
      
      // Dispatch custom event so LMS can refresh
      window.dispatchEvent(new CustomEvent('videoUploaded', { detail: newVideo }));
      
      console.log('✅ Video uploaded and saved:', newVideo);
      return new Promise(resolve => {
        // Small delay to ensure storage is written
        setTimeout(() => resolve(newVideo), 100);
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Upload failed. Please try again.');
    }
  },

  // Get user's uploaded videos - works with backend OR uses localStorage fallback
  getUserVideos: async () => {
    try {
      // Try backend first
      const headers = flaskAuthService.getHeaders();
      const response = await fetch(`${API_BASE}/videos/user/uploads`, {
        headers
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Backend unavailable, using local storage');
    }

    // Fallback: Get from localStorage
    try {
      const videos = getVideosFromStorage();
      return { videos };
    } catch (error) {
      return { videos: [] };
    }
  },

  // Update video metadata - works with backend OR uses localStorage fallback
  updateVideo: async (videoId, videoData) => {
    try {
      // Try backend first
      const headers = flaskAuthService.getHeaders();
      const response = await fetch(`${API_BASE}/videos/${videoId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData)
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Backend unavailable, using local storage');
    }

    // Fallback: Update in localStorage
    try {
      const videos = getVideosFromStorage();
      const videoIndex = videos.findIndex(v => v.id === videoId);
      if (videoIndex === -1) {
        throw new Error('Video not found');
      }
      videos[videoIndex] = { ...videos[videoIndex], ...videoData };
      saveVideosToStorage(videos);
      return videos[videoIndex];
    } catch (error) {
      throw new Error(error.message || 'Update failed');
    }
  },

  // Delete video - works with backend OR uses localStorage fallback
  deleteVideo: async (videoId) => {
    try {
      // Try backend first
      const headers = flaskAuthService.getHeaders();
      const response = await fetch(`${API_BASE}/videos/${videoId}`, {
        method: 'DELETE',
        headers
      });
      if (response.ok) {
        return response.json();
      }
    } catch (error) {
      console.log('Backend unavailable, using local storage');
    }

    // Fallback: Delete from localStorage
    try {
      const videos = getVideosFromStorage();
      const filteredVideos = videos.filter(v => v.id !== videoId);
      saveVideosToStorage(filteredVideos);
      return { success: true, id: videoId };
    } catch (error) {
      throw new Error(error.message || 'Delete failed');
    }
  },

  // Get video blob URL from store
  getVideoUrl: (videoId) => {
    return videoFileStore.get(videoId);
  },

  // Store video URL in memory
  storeVideoUrl: (videoId, blobUrl) => {
    videoFileStore.set(videoId, blobUrl);
  },
};

// Helper to resolve video URLs
export const resolveVideoUrl = (video) => {
  if (!video) return null;
  
  // If it's a YouTube video
  if (video.youtubeId || (video.videoUrl && video.videoUrl.includes('youtube'))) {
    return video.videoUrl || `https://www.youtube.com/embed/${video.youtubeId}`;
  }
  
  // If it's a local video, check the file store first
  if (video.id && videoFileStore.has(video.id)) {
    return videoFileStore.get(video.id);
  }
  
  // Return the stored video data (blob URL or data URL)
  return video.videoData || video.videoUrl || null;
};

export default videoApi;

