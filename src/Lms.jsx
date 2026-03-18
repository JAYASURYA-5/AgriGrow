import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from './components/VideoPlayer';

const Lms = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [userVideos, setUserVideos] = useState([]);

  // Load uploaded videos on mount and listen for new uploads
  React.useEffect(() => {
    const loadVideos = () => {
      try {
        const uploadedVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
        const userUploads = uploadedVideos.filter(v => v.isUserUploaded);
        setUserVideos(userUploads);
        console.log('✅ Loaded videos from storage:', userUploads.length, 'videos');
      } catch (error) {
        console.error('Error loading videos:', error);
      }
    };

    loadVideos();

    // Listen for new video uploads and refresh
    const handleVideoUpload = (event) => {
      console.log('🎬 Video upload event received');
      loadVideos(); // Reload all videos to ensure latest appears
    };
    
    window.addEventListener('videoUploaded', handleVideoUpload);
    
    // Also reload videos when user navigates to LMS
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadVideos();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('videoUploaded', handleVideoUpload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleChatClick = () => {
    navigate('/chatbot');
  };

  const categories = ['All', 'Soil Health', 'Irrigation', 'Pest Control', 'Crop Management', 'Organic Farming', 'Schemes', 'Livestock', 'Weather', 'Market', 'Crop Guides', 'Water Management', 'Pest Management'];

  const featuredContent = [
    {
      id: 1,
      title: 'Optimizing Irrigation with IoT Sensors',
      description: 'Learn how IoT sensors can save water and boost crop yields.',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=800&h=450&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/1q2efRJFBRo',
      youtubeId: '1q2efRJFBRo',
      isVideo: true
    },
    {
      id: 2,
      title: 'Identifying and Managing Common Pests',
      description: 'A visual guide to identifying and controlling crop pests naturally.',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=450&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/KfqZfX8BQGE',
      youtubeId: 'KfqZfX8BQGE',
      isVideo: true
    },
    {
      id: 3,
      title: 'Organic Farming & Soil Health',
      description: 'Expert advice on maintaining healthy soil for sustainable farming.',
      image: 'https://images.unsplash.com/photo-1500541961454-2e30c00f3817?w=800&h=450&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/YkzZ6N8GdDI',
      youtubeId: 'YkzZ6N8GdDI',
      isVideo: true
    }
  ];

  const articles = [
    {
      id: 1,
      category: "Crop Guides",
      title: 'Complete Guide to Rice Farming',
      description: 'Learn step-by-step rice cultivation techniques for maximum yield.',
      readTime: 'Video • 15 min',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/YsCVpRhqPuk',
      youtubeId: 'YsCVpRhqPuk',
      isVideo: true
    },
    {
      id: 2,
      category: 'Water Management',
      title: 'Drip Irrigation System Installation',
      description: 'Complete guide to setting up and maintaining drip irrigation systems.',
      readTime: 'Video • 20 min',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=250&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/xPaGLW0sWdI',
      youtubeId: 'xPaGLW0sWdI',
      isVideo: true
    },
    {
      id: 3,
      category: 'Pest Management',
      title: 'Natural Pest Control Methods',
      description: 'Eco-friendly strategies to manage crop pests and diseases.',
      readTime: 'Video • 18 min',
      image: 'https://images.unsplash.com/photo-1488459716781-6f3ee109e5e4?w=400&h=250&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/L9vWNbz3b8Q',
      youtubeId: 'L9vWNbz3b8Q',
      isVideo: true
    },
    {
      id: 4,
      category: 'Soil Health',
      title: 'Soil Testing and Nutrient Management',
      description: 'Understand soil composition and optimize nutrient levels.',
      readTime: 'Video • 17 min',
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc4?w=400&h=250&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/tYDdXH9ECPU',
      youtubeId: 'tYDdXH9ECPU',
      isVideo: true
    },
    {
      id: 5,
      category: 'Crop Guides',
      title: 'Wheat Farming Best Practices',
      description: 'Expert techniques for growing high-yield wheat crops.',
      readTime: 'Video • 19 min',
      image: 'https://images.unsplash.com/photo-1574914103412-32882c60e0e4?w=400&h=250&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/nP6tMDCJNQM',
      youtubeId: 'nP6tMDCJNQM',
      isVideo: true
    },
    {
      id: 6,
      category: 'Irrigation',
      title: 'Sprinkler System Design & Installation',
      description: 'How to design and install efficient sprinkler irrigation systems.',
      readTime: 'Video • 21 min',
      image: 'https://images.unsplash.com/photo-1585420261730-b91ba36265f0?w=400&h=250&fit=crop',
      videoUrl: 'https://www.youtube.com/embed/LdMlC2vTDr8',
      youtubeId: 'LdMlC2vTDr8',
      isVideo: true
    }
  ];

  // Combine articles with user uploads and filter by category
  const allContent = [
    ...userVideos.map((video, idx) => ({
      ...video,
      id: video.id || `user-video-${idx}`,
      isVideo: true,
      category: video.category || 'Community Videos',
      readTime: `Video • ${video.duration || '0'} min`,
      image: video.image || 'https://via.placeholder.com/400x250',
      videoUrl: video.videoData || video.videoUrl,
      youtubeId: video.youtubeId || null,
    })),
    ...articles
  ];
  
  // Filter by category and search query with better matching
  const filteredArticles = allContent.filter(item => {
    const matchesCategory = activeCategory === 'All' || 
      (item.category && item.category.toLowerCase()) === activeCategory.toLowerCase();
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      (item.title && item.title.toLowerCase().includes(searchLower)) ||
      (item.description && item.description.toLowerCase().includes(searchLower)) ||
      (item.category && item.category.toLowerCase().includes(searchLower)) ||
      (item.fileName && item.fileName.toLowerCase().includes(searchLower)) ||
      (item.author && item.author.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display">
      {/* Top App Bar */}/*
      <div className="flex items-center p-4 pb-2 bg-background-light dark:bg-background-dark sticky top-0 z-50 border-b-2 border-[#234826]">
        <button
          onClick={handleBack}
          className="flex size-12 shrink-0 items-center justify-center text-[#234826] dark:text-[#91ca96] hover:bg-[#f0f7ff] dark:hover:bg-[#1f4427] rounded-lg transition-all font-bold"
          aria-label="Back to home"
          title="Back to Home"
        >
          <span className="material-symbols-outlined text-3xl">arrow_back</span>
        </button>
        <div className="flex size-12 shrink-0 items-center justify-start"></div>
        <h1 className="text-xl font-bold leading-tight tracking-[-0.015em] flex-1 text-center text-black dark:text-white">
          Knowledge Hub
        </h1>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Search Bar */}/*
      <div className="px-4 py-3">
        <label className="flex flex-col min-w-40 h-12 w-full">
          <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
            <div className="text-[#91ca96] flex border-none bg-[#234826] items-center justify-center pl-4 rounded-l-lg border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border-none bg-[#234826] focus:border-none h-full placeholder:text-[#91ca96] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal font-display"
              placeholder="Search articles, tutorials..."
            />
          </div>
        </label>
      </div>

      {/* Featured Content Header */}/*
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-lg font-bold text-black dark:text-white">Featured For You</h2>
      </div>

      {/* Carousel */}/*
      <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-stretch p-4 pt-0 gap-4">
          {[
            ...userVideos.slice(0, 2).map(video => ({
              ...video,
              isVideo: true,
              image: video.thumbnailData || 'https://via.placeholder.com/800x450'
            })),
            ...featuredContent
          ].slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex h-full flex-1 flex-col gap-3 rounded-lg min-w-64 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedVideo(item)}
            >
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl relative group"
                style={{ backgroundImage: `url("${item.image}")` }}
              >
                {item.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors rounded-xl">
                    <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-black dark:text-white text-base font-medium leading-normal">{item.title}</p>
                <p className="text-gray-600 dark:text-[#91ca96] text-sm font-normal leading-normal">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chips */}/*
      <div className="flex gap-3 px-4 pb-4 overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <div
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full pl-4 pr-4 cursor-pointer ${
              activeCategory === category ? 'bg-primary' : 'bg-[#19341b]'
            }`}
          >
            <p className={`text-sm font-medium leading-normal ${
              activeCategory === category ? 'text-[#112212]' : 'text-white'
            }`}>
              {category}
            </p>
          </div>
        ))}
      </div>

      {/* Content Cards Section */}/*
      <div className="flex flex-col gap-4 px-4 pb-24">
        {filteredArticles.map((article) => (
          <div key={article.id} className="@container" onClick={() => article.isVideo && setSelectedVideo(article)}>
            <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden bg-white/5 dark:bg-[#19341b] hover:bg-white/10 dark:hover:bg-[#1f4427] transition-colors cursor-pointer">
              <div
                className="w-full bg-center bg-no-repeat aspect-video bg-cover relative group"
                style={{ backgroundImage: `url("${article.image}")` }}
              >
                {article.isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                    <span className="material-symbols-outlined text-white text-5xl">play_circle</span>
                  </div>
                )}
              </div>
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-4">
                <p className="text-gray-600 dark:text-[#91ca96] text-sm font-normal leading-normal">{article.category}</p>
                <p className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">{article.title}</p>
                <p className="text-gray-700 dark:text-[#91ca96] text-base font-normal leading-normal">{article.description}</p>
                <div className="flex items-center gap-3 justify-between mt-2">
                  <p className="text-gray-600 dark:text-[#91ca96] text-sm font-normal leading-normal">{article.readTime}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (article.isVideo) setSelectedVideo(article);
                    }}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-primary text-[#112212] text-sm font-medium leading-normal hover:shadow-md transition-shadow"
                  >
                    <span className="truncate">{article.isVideo ? 'Watch Now' : 'Read More'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}/*
      {selectedVideo && (
        <VideoPlayer
          videoUrl={selectedVideo.videoUrl || selectedVideo.videoData || selectedVideo.youtubeUrl}
          title={selectedVideo.title}
          description={selectedVideo.description}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {/* AI Chat FAB */}/*
      <div className="fixed bottom-6 right-6 z-20">
        <button
          onClick={handleChatClick}
          aria-label="Open Chat"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-[#112212] shadow-sm z-20"
          title="Chat with AgroAI"
        >
          <span className="material-symbols-outlined text-lg">support_agent</span>
        </button>
      </div>
    </div>
  );
};

export default Lms;
