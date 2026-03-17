/**
 * News API Service for AgriGrow
 * Fetches global agriculture & farmer-related news from NewsAPI.org
 * Free tier: https://newsapi.org/
 */

const API_BASE = 'https://newsapi.org/v2';
const DEFAULT_API_KEY = 'YOUR_NEWSAPI_KEY_HERE'; // Replace with real key from newsapi.org

// Agri/farmer keywords for filtering
const AGRI_KEYWORDS = [
  'agriculture', 'farmer', 'farmers', 'crop', 'harvest', 'agri', 'subsidy', 
  'scheme', 'irrigation', 'soil', 'pest', 'yield', 'monsoon', 'tractor',
  'fertilizer', 'seed', 'MSP', 'wheat', 'rice', 'corn', 'soybean', 'cotton'
];

export const newsApi = {
  /**
   * Fetch latest agriculture news
   * @param {string} apiKey - NewsAPI key (localStorage or param)
   * @param {number} pageSize - Max articles (default 50)
   * @returns {Promise<{articles: Array, total: number}>}
   */
  fetchAgriNews: async (apiKey = null, pageSize = 50) => {
    const key = apiKey || localStorage.getItem('newsApiKey') || DEFAULT_API_KEY;
    if (key === DEFAULT_API_KEY) {
      console.warn('Using NewsAPI demo mode. Get free key: https://newsapi.org/');
    }

    const query = AGRI_KEYWORDS.join(' OR ');
const url = `${API_BASE}/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&from=1947-01-01&pageSize=${pageSize}&apiKey=${key}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }
      const data = await response.json();

      // Map to consistent format + categorize
      const articles = data.articles
        .filter(article => article.urlToImage && article.publishedAt) // Require image + date
        .map(article => {
          const category = inferCategory(article.title + ' ' + article.description);
          return {
            id: article.url,
            title: article.title,
            summary: article.description?.substring(0, 150) + '...' || '',
            link: article.url,
            date: article.publishedAt,
            source: article.source.name,
            image: article.urlToImage,
            category
          };
        });

      return { articles, total: data.totalResults };
    } catch (error) {
      console.error('News fetch failed:', error);
      throw new Error('Failed to fetch news. Check API key and internet.');
    }
  }
};

/**
 * Infer category from content
 */
function inferCategory(content) {
  if (content.match(/market|price|trade|export|mandi/i)) return 'market';
  if (content.match(/weather|rain|monsoon|climate|imD/i)) return 'weather';
  if (content.match(/tech|drone|ai|iot|app|digital/i)) return 'technology';
  if (content.match(/disease|pest|blight|health|soil/i)) return 'crop-health';
  return 'market'; // default
}

