/**
 * PersonalizationEngine.js
 * Location-based and preference-based personalization system
 * Tailors news delivery to individual farmer needs
 */

export const indianRegions = {
  'north': {
    name: 'North India',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Himachal Pradesh', 'Jammu & Kashmir'],
    climate: 'Temperate to Subtropical',
    majorCrops: ['Wheat', 'Rice', 'Sugarcane', 'Cotton'],
    emoji: '🏔️'
  },
  'south': {
    name: 'South India',
    states: ['Tamil Nadu', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Kerala'],
    climate: 'Tropical',
    majorCrops: ['Rice', 'Coconut', 'Spices', 'Coffee'],
    emoji: '🏝️'
  },
  'east': {
    name: 'East India',
    states: ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha'],
    climate: 'Subtropical',
    majorCrops: ['Rice', 'Jute', 'Vegetables', 'Sugar'],
    emoji: '🌾'
  },
  'west': {
    name: 'West India',
    states: ['Gujarat', 'Maharashtra', 'Goa', 'Rajasthan'],
    climate: 'Semi-Arid to Arid',
    majorCrops: ['Cotton', 'Groundnut', 'Onion', 'Millets'],
    emoji: '🏜️'
  },
  'central': {
    name: 'Central India',
    states: ['Madhya Pradesh', 'Chhattisgarh'],
    climate: 'Subtropical',
    majorCrops: ['Rice', 'Soybean', 'Corn', 'Pulses'],
    emoji: '🌳'
  }
};

export class PersonalizationEngine {
  /**
   * Get region from GPS coordinates or farmer input
   */
  static getRegionFromLocation(latitude, longitude) {
    // Simplified region detection based on lat/long
    if (latitude > 28) return 'north';
    if (latitude > 20) return 'central';
    if (latitude > 15) return 'south';
    if (longitude > 75) return 'west';
    return 'east';
  }

  /**
   * Create user profile with preferences
   */
  static createUserProfile(farmerId, location, cropTypes = ['rice', 'wheat']) {
    const region = typeof location === 'string' 
      ? location 
      : this.getRegionFromLocation(location.lat, location.lng);

    return {
      farmerId,
      region,
      regionName: indianRegions[region]?.name || 'Unknown',
      cropTypes,
      preferences: {
        categories: ['market', 'weather', 'crop-health', 'schemes'],
        updateFrequency: 'real-time',
        notificationEnabled: true,
        language: 'en'
      },
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Filter articles based on user region and preferences
   */
  static personalizeNews(articles, userProfile) {
    const filteredArticles = articles.filter(article => {
      // Category preference filter
      if (!userProfile.preferences.categories.includes(article.category)) {
        return false;
      }

      // Crop type relevance
      const cropRelated = userProfile.cropTypes.some(crop => 
        article.summary.toLowerCase().includes(crop.toLowerCase())
      );

      // Region relevance
      const regionRelevant = !article.region || article.region === userProfile.region;

      // Return articles that match preferences
      return regionRelevant || cropRelated;
    });

    // Sort by relevance score (highest first)
    return filteredArticles.sort((a, b) => {
      const scoreA = this.calculatePersonalizationScore(a, userProfile);
      const scoreB = this.calculatePersonalizationScore(b, userProfile);
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate how relevant an article is to the user
   */
  static calculatePersonalizationScore(article, userProfile) {
    let score = 0;

    // Category match (40 points)
    if (userProfile.preferences.categories.includes(article.category)) {
      score += 40;
    }

    // Crop type match (30 points)
    const cropMatch = userProfile.cropTypes.some(crop =>
      article.summary.toLowerCase().includes(crop.toLowerCase())
    );
    if (cropMatch) score += 30;

    // Region match (20 points)
    if (article.region === userProfile.region) {
      score += 20;
    }

    // Recency (10 points)
    const hoursSincePublish = (Date.now() - new Date(article.date)) / (1000 * 60 * 60);
    if (hoursSincePublish < 6) score += 10;
    else if (hoursSincePublish < 24) score += 5;

    // Insight urgency bonus (25 points)
    if (article.insights && article.insights.length > 0) {
      const maxUrgency = article.insights[0]?.urgency;
      if (maxUrgency === 'critical') score += 25;
      else if (maxUrgency === 'high') score += 15;
    }

    return Math.min(score, 100);
  }

  /**
   * Get region-specific alerts
   */
  static getRegionAlerts(region, articles) {
    return articles.filter(article => {
      if (!article.insights || article.insights.length === 0) return false;
      
      const hasAlert = article.insights.some(insight => {
        return ['alert', 'critical'].includes(insight.type);
      });

      return hasAlert && (article.region === region || !article.region);
    });
  }

  /**
   * Get actionable recommendations based on user profile
   */
  static getRecommendations(userProfile, articles) {
    const recommendations = [];

    // Get relevant articles
    const relevantArticles = this.personalizeNews(articles, userProfile);

    // Market recommendations
    const marketArticles = relevantArticles.filter(a => a.category === 'market');
    if (marketArticles.length > 0) {
      const priceInsights = marketArticles[0]?.insights?.filter(i => i.type === 'action');
      if (priceInsights?.length > 0) {
        recommendations.push({
          type: 'market',
          icon: '💹',
          title: 'Market Opportunity',
          suggestion: priceInsights[0].description,
          urgency: priceInsights[0].urgency
        });
      }
    }

    // Weather recommendations
    const weatherArticles = relevantArticles.filter(a => a.category === 'weather');
    if (weatherArticles.length > 0) {
      const weatherInsights = weatherArticles[0]?.insights?.filter(i => i.type === 'alert');
      if (weatherInsights?.length > 0) {
        recommendations.push({
          type: 'weather',
          icon: '⚠️',
          title: 'Weather Alert',
          suggestion: weatherInsights[0].description,
          urgency: weatherInsights[0].urgency
        });
      }
    }

    // Crop health recommendations
    const healthArticles = relevantArticles.filter(a => a.category === 'crop-health');
    if (healthArticles.length > 0) {
      const healthInsights = healthArticles[0]?.insights?.filter(i => i.type === 'alert' || i.type === 'action');
      if (healthInsights?.length > 0) {
        recommendations.push({
          type: 'health',
          icon: '🌾',
          title: 'Crop Health Alert',
          suggestion: healthInsights[0].description,
          urgency: healthInsights[0].urgency
        });
      }
    }

    // Scheme recommendations
    const schemeArticles = relevantArticles.filter(a => a.category === 'schemes');
    if (schemeArticles.length > 0) {
      recommendations.push({
        type: 'schemes',
        icon: '💰',
        title: 'New Scheme Available',
        suggestion: 'Check eligibility for new government support programs',
        urgency: 'medium'
      });
    }

    return recommendations;
  }

  /**
   * Schedule updates based on user preferences
   */
  static getNextUpdateTime(lastUpdate, frequency = 'real-time') {
    const frequencies = {
      'real-time': 10, // minutes
      'hourly': 60,
      'daily': 24 * 60,
      'weekly': 7 * 24 * 60
    };

    const minutes = frequencies[frequency] || 10;
    const nextUpdate = new Date(lastUpdate.getTime() + minutes * 60000);
    return nextUpdate;
  }
}

export default PersonalizationEngine;
