/**
 * EnhancedNews.jsx
 * Enhanced News component with complete workflow system
 * Integrates data processing, personalization, and real-time updates
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { enhancedNewsArchive } from '../data/EnhancedNewsArchive';
import { NewsProcessingEngine } from '../data/NewsProcessingEngine';
import { PersonalizationEngine, indianRegions } from '../data/PersonalizationEngine';
import NewsWorkflowDashboard from './NewsWorkflowDashboard';

// Category Default Images - Agriculture-focused imagery
const categoryDefaultImages = {
  'market': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', // Farmer harvesting
  'weather': 'https://images.unsplash.com/photo-1534080564897-61f3b3bcc911?w=800', // Weather patterns
  'crop-health': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', // Green farm field
  'technology': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800' // AgriTech
};

// Default Category Insights URLs - Category-based routing
const defaultCategoryInsights = {
  'market': 'https://agricoop.gov.in/',
  'weather': 'https://mausam.imd.gov.in/',
  'crop-health': 'https://www.ipmcenters.org/',
  'technology': 'https://farmer.gov.in/HomeAction'
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
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

// Function to get image for article with proper fallback
const getArticleImage = (article) => {
  // Priority 1: Use article's own image if available
  if (article.image) {
    return article.image;
  }
  // Priority 2: Use category default
  return categoryDefaultImages[article.category] || categoryDefaultImages['market'];
};

// Function to get insights URL with fallback logic
const getInsightsUrl = (article) => {
  if (article.insights_url) {
    return article.insights_url;
  }
  return defaultCategoryInsights[article.category] || defaultCategoryInsights['market'];
};

const EnhancedNews = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('north');
  const [sortBy, setSortBy] = useState('newest');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Initialize user profile and load articles
  useEffect(() => {
    const initializeNews = async () => {
      try {
        setLoading(true);
        
        // Create user profile for current region
        const profile = PersonalizationEngine.createUserProfile(
          'farmer-001',
          selectedRegion,
          ['rice', 'wheat', 'corn']
        );
        setUserProfile(profile);

        // Process articles through AI pipeline
        const processedArticles = NewsProcessingEngine.processArticles(
          enhancedNewsArchive,
          { categories: profile.preferences.categories, location: selectedRegion }
        );
        
        setArticles(processedArticles);

        // Get personalized recommendations
        const recs = PersonalizationEngine.getRecommendations(profile, processedArticles);
        setRecommendations(recs);

        // Show success toast
        showToast(`Loaded ${processedArticles.length} articles`, 'success');
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing news:', error);
        showToast('Error loading news', 'error');
        setLoading(false);
      }
    };

    initializeNews();
  }, []);

  // Filter and sort articles
  useEffect(() => {
    let filtered = articles;

    // Exclude schemes category
    filtered = filtered.filter(article => article.category !== 'schemes');

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Region filter
    filtered = filtered.filter(article => !article.region || article.region === selectedRegion);

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'relevance') {
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    setFilteredArticles(filtered);
  }, [articles, selectedCategory, selectedRegion, searchQuery, sortBy]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleReadMore = (e, article) => {
    e.stopPropagation();
    if (article.link) {
      window.open(article.link, '_blank', 'noopener,noreferrer');
      showToast(`Opening ${article.category} news...`, 'success');
    } else {
      showToast('Link not available', 'error');
    }
  };

  const refreshNews = async () => {
    showToast('Refreshing news...', 'info');
    const updatedArticles = NewsProcessingEngine.processArticles(
      enhancedNewsArchive,
      { categories: userProfile?.preferences.categories, location: selectedRegion }
    );
    setArticles(updatedArticles);
    setLastUpdate(new Date());
    showToast('News refreshed!', 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing news articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-8 px-4">
      {/* Back Button - Fixed at Top Left */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-50 flex items-center justify-center p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 border border-gray-200"
      >
        <span className="material-symbols-outlined text-2xl text-emerald-600">arrow_back</span>
      </button>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">AgriGrow News Hub</h1>
          </div>
          <p className="text-gray-600 text-lg">Personalized agricultural news powered by AI</p>
        </div>

        <>
          {/* Personalization Info */}
            {userProfile && (
              <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg p-6 mb-8 text-white shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">📍</span>
                    <div>
                      <p className="font-semibold">Your Region</p>
                      <p className="text-emerald-50">{userProfile.regionName} • {indianRegions[userProfile.region].climate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🌾</span>
                    <div>
                      <p className="font-semibold">Major Crops</p>
                      <p className="text-emerald-50">{indianRegions[userProfile.region].majorCrops.join(', ')}</p>
                    </div>
                  </div>
                  <button
                    onClick={refreshNews}
                    className="px-4 py-2 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined">refresh</span>
                    Refresh
                  </button>
                </div>
              </div>
            )}

            {/* Top Recommendations */}
            {recommendations.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Trending Alerts for You</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendations.slice(0, 4).map((rec, idx) => (
                    <div key={idx} className={`rounded-lg p-4 border-l-4 bg-white shadow-md hover:shadow-lg transition ${
                      rec.urgency === 'critical' ? 'border-l-red-500 bg-red-50' :
                      rec.urgency === 'high' ? 'border-l-orange-500 bg-orange-50' :
                      'border-l-blue-500 bg-blue-50'
                    }`}>
                      <div className="text-3xl mb-2">{rec.icon}</div>
                      <h3 className="font-bold text-gray-900">{rec.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{rec.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="market">Market</option>
                  <option value="weather">Weather</option>
                  <option value="crop-health">Crop Health</option>
                  <option value="technology">Technology</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="relevance">Most Relevant</option>
                </select>
              </div>

              {/* Region Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-semibold text-gray-700 self-center">Region:</span>
                {Object.entries(indianRegions).map(([key, region]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRegion(key)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      selectedRegion === key
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {region.emoji} {region.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6 text-gray-600 font-semibold">
              Showing <span className="text-emerald-600">{filteredArticles.length}</span> articles
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </div>

            {/* News Grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map(article => (
                  <div
                    key={article.id}
                    onClick={() => handleArticleClick(article)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition cursor-pointer overflow-hidden group"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={getArticleImage(article)}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
                        {article.category.toUpperCase()}
                      </div>
                      {/* Urgency Badge */}
                      {article.insights?.[0]?.urgency && (
                        <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                          article.insights[0].urgency === 'critical' ? 'bg-red-500' :
                          article.insights[0].urgency === 'high' ? 'bg-orange-500' :
                          'bg-blue-500'
                        }`}></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <span>{article.region ? `📍 ${article.region}` : '🌍 Global'}</span>
                        <span>•</span>
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600">
                        {article.title}
                      </h3>

                      {/* Summary */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {article.summary}
                      </p>

                      {/* Insights Preview */}
                      {article.insights?.[0] && (
                        <div className="mb-3 p-2 bg-gray-50 rounded flex items-start gap-2">
                          <span className="text-lg">{article.insights[0].icon}</span>
                          <p className="text-xs text-gray-700 font-semibold">
                            {article.insights[0].title}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        {/* Read More Button */}
                        <button
                          onClick={(e) => handleReadMore(e, article)}
                          className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2 text-sm"
                        >
                          <span className="material-symbols-outlined text-base">open_in_new</span>
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600 text-lg">No articles found matching your criteria</p>
              </div>
            )}

            {/* Last Update */}
            <div className="mt-8 text-center text-gray-600 text-sm">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          </>
      </div>
    </div>
  );
};

export default EnhancedNews;
