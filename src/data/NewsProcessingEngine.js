/**
 * NewsProcessingEngine.js
 * AI-powered processing pipeline for news data
 * Handles filtering, categorization, and insight generation
 */

export class NewsProcessingEngine {
  /**
   * Filter out duplicate and irrelevant articles
   */
  static filterDuplicates(articles) {
    const seen = new Set();
    return articles.filter(article => {
      const key = `${article.title}-${article.category}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Categorize articles using AI logic
   */
  static categorizeArticle(article) {
    const titleLower = article.title.toLowerCase();
    const summaryLower = article.summary.toLowerCase();
    const content = `${titleLower} ${summaryLower}`;

    // Market-related keywords
    if (/price|market|commodity|mandi|trade|export|sell|buy|rate|cost/.test(content)) {
      return 'market';
    }
    // Weather-related keywords
    if (/weather|rain|monsoon|climate|temperature|forecast|wind|storm|drought/.test(content)) {
      return 'weather';
    }
    // Crop health keywords
    if (/disease|pest|insect|crop|health|infection|cure|treatment|fungal|bacterial/.test(content)) {
      return 'crop-health';
    }
    // Tech keywords
    if (/technology|iot|drone|app|digital|smart|automation|ai|robot|sensor/.test(content)) {
      return 'technology';
    }
    // Government schemes
    if (/scheme|subsidy|grant|government|fund|support|loan|pm-kisan|pradhan/.test(content)) {
      return 'schemes';
    }
    
    return article.category || 'market';
  }

  /**
   * Generate actionable insights from article
   */
  static generateInsights(article) {
    const category = article.category;
    const title = article.title.toLowerCase();
    const summary = article.summary.toLowerCase();

    const insights = [];

    if (category === 'market') {
      if (/price.*up|increase|rise/.test(title + summary)) {
        insights.push({
          type: 'action',
          icon: '📈',
          title: 'Price Rising',
          description: 'Market prices trending upward. Consider selling if you have surplus stock.',
          urgency: 'high',
          color: 'emerald'
        });
      }
      if (/price.*down|decrease|fall|drop/.test(title + summary)) {
        insights.push({
          type: 'action',
          icon: '📉',
          title: 'Price Falling',
          description: 'Market prices declining. Wait for better rates if possible.',
          urgency: 'medium',
          color: 'amber'
        });
      }
      if (/export|international|global/.test(title + summary)) {
        insights.push({
          type: 'opportunity',
          icon: '🌍',
          title: 'Export Opportunity',
          description: 'International market showing interest. Consider export options.',
          urgency: 'high',
          color: 'green'
        });
      }
    }

    if (category === 'weather') {
      if (/rain|monsoon|storm|heavy/.test(title + summary)) {
        insights.push({
          type: 'alert',
          icon: '⚠️',
          title: 'Heavy Rain Alert',
          description: 'Prepare for heavy rainfall. Ensure crop protection and drainage.',
          urgency: 'critical',
          color: 'red'
        });
      }
      if (/drought|dry|low-rain|water/.test(title + summary)) {
        insights.push({
          type: 'alert',
          icon: '💧',
          title: 'Water Shortage',
          description: 'Drought conditions expected. Plan irrigation accordingly.',
          urgency: 'high',
          color: 'orange'
        });
      }
      if (/temperature|heat|frost|cold/.test(title + summary)) {
        insights.push({
          type: 'advisory',
          icon: '🌡️',
          title: 'Temperature Alert',
          description: 'Extreme temperature conditions. Adjust crop management.',
          urgency: 'medium',
          color: 'blue'
        });
      }
    }

    if (category === 'crop-health') {
      if (/outbreak|spread|detected/.test(title + summary)) {
        insights.push({
          type: 'alert',
          icon: '🐛',
          title: 'Disease Outbreak',
          description: 'New pest/disease detected in region. Take preventive measures.',
          urgency: 'critical',
          color: 'red'
        });
      }
      if (/treatment|cure|control|management/.test(title + summary)) {
        insights.push({
          type: 'action',
          icon: '💊',
          title: 'Treatment Available',
          description: 'Effective treatment method found. Check details for application.',
          urgency: 'high',
          color: 'green'
        });
      }
      if (/organic|natural|pesticide-free/.test(title + summary)) {
        insights.push({
          type: 'opportunity',
          icon: '♻️',
          title: 'Organic Solution',
          description: 'Natural pest control method available. Better for soil health.',
          urgency: 'medium',
          color: 'emerald'
        });
      }
    }

    if (category === 'technology') {
      insights.push({
        type: 'info',
        icon: '🤖',
        title: 'New Technology',
        description: 'Latest agricultural technology innovation announced.',
        urgency: 'low',
        color: 'purple'
      });
    }

    if (category === 'schemes') {
      insights.push({
        type: 'opportunity',
        icon: '💰',
        title: 'New Scheme Available',
        description: 'Check eligibility and apply for government support.',
        urgency: 'high',
        color: 'pink'
      });
    }

    return insights.length > 0 ? insights : [{
      type: 'info',
      icon: '📌',
      title: 'Important Update',
      description: 'Review this article for important information.',
      urgency: 'low',
      color: 'gray'
    }];
  }

  /**
   * Calculate article relevance score
   */
  static calculateRelevanceScore(article, userPreferences = {}) {
    let score = 100;
    const { categories = [], location = null } = userPreferences;

    // Category match bonus
    if (categories.includes(article.category)) {
      score += 25;
    }

    // Location match bonus
    if (location && article.region === location) {
      score += 20;
    }

    // Recency bonus
    const hoursSincePublish = (Date.now() - new Date(article.date)) / (1000 * 60 * 60);
    if (hoursSincePublish < 1) score += 30;
    else if (hoursSincePublish < 6) score += 15;
    else if (hoursSincePublish < 24) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Process all articles through the pipeline
   */
  static processArticles(articles, userPreferences = {}) {
    return articles
      .map(article => ({
        ...article,
        category: this.categorizeArticle(article),
        insights: this.generateInsights(article),
        relevanceScore: this.calculateRelevanceScore(article, userPreferences)
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export default NewsProcessingEngine;
