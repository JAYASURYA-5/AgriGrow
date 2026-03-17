import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { agriNewsArchive } from './data/AgriNewsArchive';

// Toast Component for notifications
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-emerald-500' : 'bg-blue-500';
  const icon = type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info';

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-slide-in`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

// Category Default Images
const CATEGORY_IMAGES = {
  'market': 'https://images.unsplash.com/photo-1488459716781-6c3571bf3acf?w=500&h=300&fit=crop',
  'technology': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
  'weather': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=500&h=300&fit=crop',
  'crop-health': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=300&fit=crop'
};

const CATEGORY_COLORS = {
  'market': { bg: 'from-blue-100 to-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-800' },
  'technology': { bg: 'from-purple-100 to-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-800' },
  'weather': { bg: 'from-cyan-100 to-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-100 text-cyan-800' },
  'crop-health': { bg: 'from-green-100 to-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-800' }
};

// URL Validation Utility
const isValidUrl = (urlString) => {
  try {
    if (!urlString || urlString === '#' || urlString === '' || urlString === 'undefined') {
      return false;
    }
    new URL(urlString);
    return true;
  } catch (err) {
    console.warn('Invalid URL:', urlString, err);
    return false;
  }
};

const NewsGridCard = ({ news, onArticleClick, onOpenArticle, onToast }) => {
  const colors = CATEGORY_COLORS[news.category] || CATEGORY_COLORS['market'];
  const displayImage = news.image || CATEGORY_IMAGES[news.category] || CATEGORY_IMAGES['market'];
  const hasValidLink = isValidUrl(news.link);

  const handleCardClick = (e) => {
    e.preventDefault();
    onArticleClick(news.id);
  };

  const handleReadMore = (e) => {
    e.stopPropagation();
    onArticleClick(news.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="overflow-hidden rounded-t-2xl h-48 bg-gray-200 dark:bg-gray-700 relative">
        <img 
          src={displayImage} 
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = CATEGORY_IMAGES[news.category] || CATEGORY_IMAGES['market'];
          }}
        />
        {/* Overlay with Open Icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
          <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="material-symbols-outlined text-5xl">article</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
            {news.category === 'crop-health' ? '🌾 Crop Health' : 
             news.category === 'market' ? '📊 Market' :
             news.category === 'technology' ? '🚀 Technology' :
             news.category === 'weather' ? '☁️ Weather' : news.category}
          </span>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{news.source}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors text-gray-900 dark:text-gray-100">
          {news.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 line-clamp-3 text-sm leading-relaxed flex-1">
          {news.summary}
        </p>

        {/* Footer with Date and Button */}
        <div className="flex flex-col gap-3 pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(news.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
          </span>
          
          {/* Read More Button */}
          {hasValidLink ? (
            <button
              onClick={handleReadMore}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-all text-sm justify-center"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              <span>Read More</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-600 font-semibold rounded-lg opacity-50 text-sm justify-center cursor-not-allowed">
              <span className="material-symbols-outlined text-base">block</span>
              <span>Link N/A</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const News = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Handle opening original article with validation
  const handleOpenArticle = (news, onToast) => {
    try {
      if (!news?.link) {
        onToast('Link not available for this article', 'error');
        console.error('Article link is missing:', news);
        return;
      }

      if (!isValidUrl(news.link)) {
        onToast('Invalid article link', 'error');
        console.error('Invalid URL:', news.link);
        return;
      }

      // Open in new tab with security settings
      const newWindow = window.open(news.link, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        onToast('Unable to open article - pop-up may be blocked', 'error');
        console.warn('Pop-up blocked for URL:', news.link);
      } else {
        onToast('Opening article...', 'success');
      }
    } catch (error) {
      onToast('Error opening article. Please try again.', 'error');
      console.error('Error opening article:', error);
    }
  };

  const handleArticleClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  useEffect(() => {
    try {
      setNewsItems(agriNewsArchive);
      setLoading(false);
    } catch (err) {
      console.error('Error loading news:', err);
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const filteredNews = newsItems
    .filter(item => activeFilter === 'all' || item.category === activeFilter)
    .filter(item => !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === 'newest' 
      ? new Date(b.date) - new Date(a.date) 
      : new Date(a.date) - new Date(b.date)
    );

  const categories = [
    { id: 'all', label: 'All News', icon: '📰' },
    { id: 'market', label: 'Markets', icon: '📊' },
    { id: 'crop-health', label: 'Crop Health', icon: '🌾' },
    { id: 'technology', label: 'Technology', icon: '🚀' },
    { id: 'weather', label: 'Weather', icon: '☁️' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-red-600 block mb-4">error</span>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Error Loading News</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link to="/" className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      {/* Back Button - Fixed at Top Left */}
      <Link to="/" className="fixed top-6 left-6 z-50 flex items-center justify-center p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200 dark:border-gray-700">
        <span className="material-symbols-outlined text-2xl text-emerald-600 dark:text-emerald-400">arrow_back</span>
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-3">
            📰 Agri News
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            100+ Curated Agriculture Articles • Stay informed with latest farming trends
          </p>
        </header>

        {/* Search & Filter Section */}
        <div className="mb-12 bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                <span className="material-symbols-outlined text-2xl">search</span>
              </span>
              <input
                type="text"
                placeholder="Search by title, keywords, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Found <span className="font-semibold text-emerald-600 dark:text-emerald-400">{filteredNews.length}</span> {filteredNews.length === 1 ? 'article' : 'articles'}
              </p>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                  activeFilter === cat.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
            <button
              onClick={() => setSortOrder('newest')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sortOrder === 'newest'
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortOrder('oldest')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                sortOrder === 'oldest'
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 ? (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Latest Articles
              </h2>
              <span className="text-sm font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full">
                {filteredNews.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNews.map((news) => (
                <NewsGridCard 
                  key={news.id} 
                  news={news} 
                  onArticleClick={handleArticleClick}
                  onOpenArticle={handleOpenArticle}
                  onToast={showToast}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <div className="mb-6 p-6 bg-gray-100 dark:bg-gray-700 rounded-full">
              <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">search_off</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">No Articles Found</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
              Try adjusting your search terms, keywords, or category filters to find what you're looking for.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-all"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-12 border-t border-gray-300 dark:border-gray-700"></div>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 border border-emerald-200 dark:border-emerald-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400 block mb-3">newspaper</span>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">100+ Articles</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fresh content daily</p>
            </div>
            <div>
              <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400 block mb-3">category</span>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">4 Categories</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Markets, Health, Tech, Weather</p>
            </div>
            <div>
              <span className="material-symbols-outlined text-4xl text-emerald-600 dark:text-emerald-400 block mb-3">link</span>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">Direct Links</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Opens in new tab</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
