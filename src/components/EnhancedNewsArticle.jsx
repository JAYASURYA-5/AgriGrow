/**
 * EnhancedNewsArticle.jsx
 * Enhanced article detail view with AI insights, actionable recommendations, and workflow information
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { enhancedNewsArchive } from '../data/EnhancedNewsArchive';
import { NewsProcessingEngine } from '../data/NewsProcessingEngine';

// Category Default Images - ONE consistent image per category
const categoryDefaultImages = {
  'market': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
  'weather': 'https://images.unsplash.com/photo-1534080564897-61f3b3bcc911?w=800',
  'crop-health': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
  'technology': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
};

// Default Category Insights URLs - Category-based routing
const defaultCategoryInsights = {
  'market': 'https://agricoop.gov.in/',
  'weather': 'https://mausam.imd.gov.in/',
  'crop-health': 'https://www.ipmcenters.org/',
  'technology': 'https://farmer.gov.in/HomeAction'
};

const getDefaultImageForCategory = (category) => {
  return categoryDefaultImages[category] || categoryDefaultImages['market'];
};

const getInsightsUrl = (article) => {
  if (article.insights_url) {
    return article.insights_url;
  }
  return defaultCategoryInsights[article.category] || defaultCategoryInsights['market'];
};

const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-emerald-500' : 'bg-blue-500';
  const icon = type === 'error' ? 'error' : type === 'success' ? 'check_circle' : 'info';

  return (
    <div className={`fixed bottom-6 right-6 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 z-50`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-medium">{message}</span>
    </div>
  );
};

const EnhancedNewsArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Find and process article
  const article = React.useMemo(() => {
    const found = enhancedNewsArchive.find(news => news.id === id);
    if (found) {
      // Process through AI engine to get insights
      const processed = NewsProcessingEngine.processArticles([found])[0];
      setLoading(false);
      return processed;
    }
    setLoading(false);
    return null;
  }, [id]);



  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-6xl text-red-600 block mb-4">error</span>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <button
            onClick={() => navigate('/news')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Back to News
          </button>
        </div>
      </div>
    );
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'blue';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/news')}
          className="inline-flex items-center gap-2 mb-8 p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-semibold text-gray-800">Back to News</span>
        </button>

        {/* Article Container */}
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Featured Image */}
          <div className="w-full h-96 overflow-hidden">
            <img src={getDefaultImageForCategory(article.category)} alt={article.title} className="w-full h-full object-cover" />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800">
                {article.category.toUpperCase()}
              </span>
              {article.region && (
                <span className="px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                  📍 {article.region.toUpperCase()}
                </span>
              )}
              <span className="text-gray-600 text-sm">
                {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              <span className="text-gray-500 text-sm">• {article.source}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">{article.title}</h1>

            {/* Summary */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">{article.summary}</p>

            {/* Full Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {article.fullContent || article.summary}
              </p>
            </div>

            {/* AI Insights Button */}
            <div className="border-t border-gray-200 pt-8">
              <button
                onClick={() => setShowInsightsModal(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined">lightbulb</span>
                <span>View AI Insights & Recommendations</span>
              </button>
            </div>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Articles in {article.category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enhancedNewsArchive
                  .filter(news => news.category === article.category && news.id !== article.id)
                  .slice(0, 6)
                  .map(news => (
                    <div
                      key={news.id}
                      onClick={() => navigate(`/news/${news.id}`)}
                      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200"
                    >
                      {news.image && (
                        <img src={news.image} alt={news.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      )}
                      <h4 className="font-bold text-gray-900 line-clamp-2 hover:text-emerald-600 mb-2">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{news.summary}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </article>

        {/* AI Insights Modal */}
        {showInsightsModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl my-8">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">AI-Generated Insights</h2>
                  <p className="text-emerald-100 text-sm mt-1">Smart recommendations based on this article</p>
                </div>
                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-8">
                {/* Article Summary */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">article</span>
                    Article Summary
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{article.summary}</p>
                  <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Category:</span> {article.category.toUpperCase()}
                      {article.region && (
                        <> | <span className="font-semibold">Region:</span> {article.region.toUpperCase()}</>
                      )}
                      | <span className="font-semibold">Source:</span> {article.source}
                    </p>
                  </div>
                </div>

                {/* AI Insights */}
                {article.insights && article.insights.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600">insights</span>
                      Smart Insights & Recommendations
                    </h3>
                    <div className="space-y-4">
                      {article.insights.map((insight, idx) => (
                        <div
                          key={idx}
                          className={`p-6 rounded-lg border-l-4 ${
                            insight.urgency === 'critical'
                              ? 'bg-red-50 dark:bg-red-900/20 border-l-red-500'
                              : insight.urgency === 'high'
                              ? 'bg-orange-50 dark:bg-orange-900/20 border-l-orange-500'
                              : insight.urgency === 'medium'
                              ? 'bg-yellow-50 dark:bg-yellow-900/20 border-l-yellow-500'
                              : 'bg-blue-50 dark:bg-blue-900/20 border-l-blue-500'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-3xl">{insight.icon}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">{insight.title}</h4>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                                  insight.urgency === 'critical' ? 'bg-red-500' :
                                  insight.urgency === 'high' ? 'bg-orange-500' :
                                  insight.urgency === 'medium' ? 'bg-yellow-500' :
                                  'bg-blue-500'
                                }`}>
                                  {insight.urgency.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-base">{insight.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources & Data */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">source</span>
                    Information Sources
                  </h3>
                  <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p className="font-semibold">This article aggregates data from:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {article.sources?.map((source, idx) => (
                        <li key={idx} className="text-sm">{source}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Takeaways */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">done_all</span>
                    Key Takeaways
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>This article has been processed through our AI pipeline for accuracy and relevance</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Insights are generated automatically based on content analysis</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Recommendations are tailored to agricultural needs and urgency levels</span>
                    </li>
                    {article.region && (
                      <li className="flex gap-3">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>This article is relevant to farmers in the {article.region.toUpperCase()} region</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-b-2xl flex gap-3 justify-end border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={() => setShowInsightsModal(false)}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white font-semibold rounded-lg transition"
                >
                  Close
                </button>
                <a
                  href={getInsightsUrl(article)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
                >
                  <span>Browse Category Resources</span>
                  <span className="material-symbols-outlined">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedNewsArticle;
