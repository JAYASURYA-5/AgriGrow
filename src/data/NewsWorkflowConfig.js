/**
 * NewsWorkflowConfig.js
 * Configuration for AgriGrow News Workflow System
 * Manages data sources, APIs, and processing pipelines
 */

export const newsDataSources = {
  agricultural_news: {
    name: 'Agricultural News Websites',
    icon: '📰',
    sources: [
      'agritech.com',
      'farmersdaily.com',
      'agrinews.org'
    ],
    updateFrequency: '30 minutes'
  },
  government_portals: {
    name: 'Government Schemes & Subsidies',
    icon: '🏛️',
    sources: [
      'pmkisan.gov.in',
      'agricooperate.gov.in',
      'farmer.gov.in'
    ],
    updateFrequency: '1 hour'
  },
  market_prices: {
    name: 'Market Price APIs',
    icon: '💹',
    sources: [
      'enam.gov.in',
      'agrimarket.nic.in',
      'commodityprices.com'
    ],
    updateFrequency: '15 minutes'
  },
  weather_data: {
    name: 'Weather APIs',
    icon: '🌥️',
    sources: [
      'imd.gov.in',
      'openweathermap.org',
      'weatherapi.com'
    ],
    updateFrequency: '10 minutes'
  },
  pest_disease_db: {
    name: 'Pest & Disease Databases',
    icon: '🐛',
    sources: [
      'plantwise.org',
      'agri.icar.gov.in',
      'ipmcenters.org'
    ],
    updateFrequency: '2 hours'
  },
  technology_updates: {
    name: 'Agri-Technology News',
    icon: '🤖',
    sources: [
      'agritech.org',
      'farminginnovations.com',
      'smartfarm.io'
    ],
    updateFrequency: '1 hour'
  }
};

export const newsCategories = {
  market: {
    name: 'Market Updates',
    color: 'emerald',
    icon: '📊',
    emoji: '💹',
    description: 'Latest commodity prices and market trends'
  },
  weather: {
    name: 'Weather Alerts',
    color: 'blue',
    icon: 'cloud',
    emoji: '🌦️',
    description: 'Regional weather forecasts and alerts'
  },
  'crop-health': {
    name: 'Crop Health',
    color: 'yellow',
    icon: 'agriculture',
    emoji: '🌾',
    description: 'Disease and pest management'
  },
  technology: {
    name: 'Technology',
    color: 'purple',
    icon: 'smart_toy',
    emoji: '🤖',
    description: 'Agricultural technology innovations'
  },
  schemes: {
    name: 'Government Schemes',
    color: 'pink',
    icon: 'gavel',
    emoji: '🏛️',
    description: 'Subsidies and government support'
  }
};

export const processingPipeline = {
  stages: [
    {
      id: 'collection',
      name: 'Data Collection',
      status: 'active',
      icon: '📥',
      description: 'Gathering data from multiple sources'
    },
    {
      id: 'filtering',
      name: 'AI Filtering',
      status: 'active',
      icon: '🔍',
      description: 'Removing duplicates and irrelevant content'
    },
    {
      id: 'categorization',
      name: 'Categorization',
      status: 'active',
      icon: '📋',
      description: 'Organizing into agriculture categories'
    },
    {
      id: 'personalization',
      name: 'Personalization',
      status: 'active',
      icon: '📍',
      description: 'Filtering by location and preferences'
    },
    {
      id: 'insights',
      name: 'AI Analysis',
      status: 'active',
      icon: '💡',
      description: 'Converting to actionable insights'
    },
    {
      id: 'delivery',
      name: 'Delivery',
      status: 'active',
      icon: '📲',
      description: 'Sending to farmers via app'
    }
  ]
};

export const systemStats = {
  sourcesActive: 18,
  articlesProcessed: 2847,
  farmersReached: 15420,
  updateFrequency: '10-30 minutes',
  dataAccuracy: '98.7%'
};
