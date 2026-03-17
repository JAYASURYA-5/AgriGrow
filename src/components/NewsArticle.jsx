import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { agriNewsArchive } from '../data/AgriNewsArchive';

// Advanced Toast Component
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

const NewsArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [showExpandedContent, setShowExpandedContent] = useState(false);
  const [loading, setLoading] = useState(true);

  // Find article and ensure data is loaded
  const article = React.useMemo(() => {
    const found = agriNewsArchive.find(news => news.id === id);
    setLoading(false);
    return found;
  }, [id]);

  // Log for debugging
  React.useEffect(() => {
    console.log('Route ID:', id);
    console.log('Article found:', article?.title);
    if (!article) {
      console.warn('Article not found for ID:', id);
      console.log('Available IDs:', agriNewsArchive.slice(0, 5).map(n => n.id));
    }
  }, [id, article]);

  // Related resources by category
  const resourcesByCategory = {
    'market': [
      { title: 'Agricultural Commodity Prices', url: 'https://www.indexmundi.com/commodities/', icon: '📊' },
      { title: 'E-NAM - National Agriculture Market', url: 'https://enam.gov.in/', icon: '🏪' },
      { title: 'Mandi Prices & Trends', url: 'https://agrimarket.nic.in/', icon: '📈' },
      { title: 'Farmer Export Opportunities', url: 'https://www.apeda.gov.in/', icon: '🌍' },
      { title: 'Global Commodity Markets', url: 'https://markets.businessinsider.com/commodities', icon: '💹' }
    ],
    'technology': [
      { title: 'Smart Agriculture Solutions', url: 'https://www.agritech.org/', icon: '🤖' },
      { title: 'IoT in Farming', url: 'https://www.techforgood.org/', icon: '📡' },
      { title: 'Precision Agriculture Guide', url: 'https://www.agronomy.org/', icon: '🎯' },
      { title: 'Drone Technology for Farming', url: 'https://www.dronefarmers.org/', icon: '🚁' },
      { title: 'Agricultural Tech Startups', url: 'https://www.crunchbase.com/hub/agriculture', icon: '🚀' }
    ],
    'weather': [
      { title: 'India Meteorological Department', url: 'https://www.imd.gov.in/', icon: '🌤️' },
      { title: 'Weather Forecast & Alerts', url: 'https://weather.gov.in/', icon: '⛅' },
      { title: 'Crop Weather Advisory', url: 'https://meghdoot.imd.gov.in/', icon: '🌧️' },
      { title: 'Climate & Monsoon Updates', url: 'https://mausam.imd.gov.in/', icon: '🌩️' },
      { title: 'Seasonal Farming Guide', url: 'https://www.fao.org/agriculture/climate/', icon: '📅' }
    ],
    'crop-health': [
      { title: 'Plant Disease Database', url: 'https://www.plantwise.org/', icon: '🔬' },
      { title: 'Integrated Pest Management', url: 'https://www.ipmcenters.org/', icon: '🐛' },
      { title: 'Crop Health Assessment', url: 'https://drishti.icar.gov.in/', icon: '🌾' },
      { title: 'Organic Farming Guidance', url: 'https://www.ifoam.bio/', icon: '♻️' },
      { title: 'Soil Health Card Scheme', url: 'https://soilhealth.dac.gov.in/', icon: '🌱' }
    ]
  };

  // Category-specific source URLs for original sources
  const categorySourceUrls = {
    'market': 'https://agrimarket.nic.in/',
    'technology': 'https://www.agritech.org/',
    'weather': 'https://www.imd.gov.in/',
    'crop-health': 'https://www.ipmcenters.org/'
  };

  const getTopicResources = () => {
    return resourcesByCategory[article?.category] || resourcesByCategory['market'];
  };

  // Validate URL function
  const isValidUrl = (urlString) => {
    try {
      // Check if URL exists and is not empty or placeholder
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

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Handle opening expanded content view
  const handleReadMore = () => {
    setShowExpandedContent(true);
  };

  // Get all related articles in the same category
  const relatedArticles = agriNewsArchive
    .filter(news => news.category === article?.category && news.id !== article?.id);

  // Get next related article (for Read Full Article button)
  const nextArticle = relatedArticles.length > 0 ? relatedArticles[0] : null;

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
          <p className="text-gray-600 mb-6">
            The article with ID <span className="font-mono bg-gray-200 px-2 py-1 rounded">{id}</span> could not be found.
          </p>
          <button
            onClick={() => navigate('/news')}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Back to All News</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
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
        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-96 overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Category & Meta */}
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800">
                {article.category.toUpperCase()}
              </span>
              <span className="text-gray-600 text-sm">
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
              <span className="text-gray-500 text-sm">• {article.source}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
              {article.summary}
            </p>

            {/* Full Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {article.fullContent || article.summary}
              </p>
            </div>

            {/* Read More Button - Shows Topic-Related Content */}
            <div className="border-t border-gray-200 pt-8 mb-8">
              <div className="flex flex-col gap-4">
                {/* Main CTA: Read More with Topic Resources */}
                <button
                  onClick={handleReadMore}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:shadow-lg hover:scale-105 transition-all cursor-pointer w-full sm:w-auto"
                >
                  <span className="material-symbols-outlined">library_books</span>
                  <span>Read More & Browse Resources</span>
                </button>
                
                {/* Secondary: Related Article Navigation */}
                {nextArticle && (
                  <button
                    onClick={() => navigate(`/news/${nextArticle.id}`)}
                    className="inline-flex items-center gap-3 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <span>Read Next Article in {article.category}</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                )}
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Similar Articles in {article.category}</h3>
              {relatedArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedArticles.slice(0, 6).map(news => (
                    <div
                      key={news.id}
                      onClick={() => navigate(`/news/${news.id}`)}
                      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all border border-gray-200 hover:border-emerald-300"
                    >
                      {news.image && (
                        <img 
                          src={news.image} 
                          alt={news.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      <h4 className="font-bold text-gray-900 line-clamp-2 hover:text-emerald-600 mb-2">
                        {news.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {news.summary}
                      </p>
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        Read more <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No similar articles found</p>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Expanded Content Modal */}
        {showExpandedContent && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl my-8">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{article.title}</h2>
                  <p className="text-emerald-100 text-sm mt-1">Curated resources for {article.category}</p>
                </div>
                <button
                  onClick={() => setShowExpandedContent(false)}
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
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {article.summary}
                  </p>
                  <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Category:</span> {article.category.toUpperCase()} | 
                      <span className="font-semibold ml-2">Source:</span> {article.source} | 
                      <span className="font-semibold ml-2">Date:</span> {new Date(article.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Related Resources Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">link</span>
                    Related Resources & Links
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getTopicResources().map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-400 transition-all hover:shadow-lg"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{resource.icon}</span>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                              {resource.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 group-hover:text-emerald-600">
                              {resource.url}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition">
                            open_in_new
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick Tips Section */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600">lightbulb</span>
                    Quick Tips for {article.category === 'crop-health' ? 'Crop Health' : article.category === 'market' ? 'Market Updates' : article.category === 'technology' ? 'Tech Adoption' : 'Weather Planning'}
                  </h3>
                  <div className="space-y-3 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    {article.category === 'crop-health' && (
                      <>
                        <div className="flex gap-3">
                          <span className="text-2xl">🌾</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Monitor regularly:</strong> Check crops for diseases and pest infestations weekly</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">💧</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Proper irrigation:</strong> Maintain optimal soil moisture for healthy crops</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">🧪</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Soil testing:</strong> Use soil health card scheme for better yield</p>
                        </div>
                      </>
                    )}
                    {article.category === 'market' && (
                      <>
                        <div className="flex gap-3">
                          <span className="text-2xl">📊</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Track prices:</strong> Monitor daily market rates before selling</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">🏪</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Use e-NAM:</strong> Trade directly on National Agriculture Market</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">📈</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Value addition:</strong> Process crops for higher profits</p>
                        </div>
                      </>
                    )}
                    {article.category === 'technology' && (
                      <>
                        <div className="flex gap-3">
                          <span className="text-2xl">💻</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Digital tools:</strong> Use apps for crop management</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">📱</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Smart farming:</strong> Explore precision agriculture techniques</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">🤖</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Automation:</strong> Adopt IoT and sensor technology</p>
                        </div>
                      </>
                    )}
                    {article.category === 'weather' && (
                      <>
                        <div className="flex gap-3">
                          <span className="text-2xl">🌤️</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Check forecasts:</strong> Stay updated with IMD weather alerts</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">⛈️</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Plan accordingly:</strong> Adjust farming schedule with seasons</p>
                        </div>
                        <div className="flex gap-3">
                          <span className="text-2xl">💧</span>
                          <p className="text-gray-700 dark:text-gray-300"><strong>Water management:</strong> Plan irrigation based on rainfall</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Category Authority Source */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">category</span>
                    Official {article.category === 'crop-health' ? 'Crop Health' : article.category === 'market' ? 'Market' : article.category === 'technology' ? 'Agriculture Technology' : 'Weather'} Resources
                  </h3>
                  <a
                    href={categorySourceUrls[article.category]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-400 transition group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
                          {article.category === 'crop-health' ? 'Integrated Pest Management Center' : 
                           article.category === 'market' ? 'Agricultural Market Portal' : 
                           article.category === 'technology' ? 'AgriTech Solutions' : 
                           'India Meteorological Department'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Click to access official {article.category} resources
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-2xl text-blue-600 group-hover:translate-x-2 transition">
                        open_in_new
                      </span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-b-2xl flex gap-3 justify-end border-t border-gray-200 dark:border-gray-600 flex-wrap">
                <button
                  onClick={() => setShowExpandedContent(false)}
                  className="px-6 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white font-semibold rounded-lg transition"
                >
                  Close
                </button>
                
                {/* Category Source Button */}
                <a
                  href={categorySourceUrls[article.category]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center gap-2"
                >
                  <span>Browse {article.category === 'crop-health' ? 'Health Resources' : article.category === 'market' ? 'Market Data' : article.category === 'technology' ? 'Tech Resources' : 'Weather Updates'}</span>
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

export default NewsArticle;
