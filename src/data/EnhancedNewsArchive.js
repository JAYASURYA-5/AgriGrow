/**
 * EnhancedNewsArchive.js
 * Enhanced news data with sources, insights, and regional information
 * Compatible with AI processing pipeline
 */

import { NewsProcessingEngine } from './NewsProcessingEngine';

const baseNewsPosts = [
  {
    id: 'news-001',
    title: 'Rice Prices Surge in Major Markets',
    summary: 'Agricultural prices have surged significantly in the last week as supply becomes tight. Farmers are seeing better returns on their crops.',
    category: 'market',
    region: 'east',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    link: 'https://www.business-standard.com/markets/capital-market-news/digital-platforms-helping-boost-agriculture-income-125072300292_1.html',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'Agricultural Market Portal',
    sources: ['enam.gov.in', 'agrimarket.nic.in'],
    fullContent: 'Rice prices have jumped 15% in the national market. This is primarily due to lower-than-expected yields in major producing states. Farmers are advised to check current market rates before selling their produce.',
    keywords: ['rice', 'price', 'market', 'increase'],
    relevance: { crops: ['rice', 'wheat'], regions: ['east', 'central'] },
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'news-002',
    title: 'Heavy Monsoon Rains Expected in Next 48 Hours',
    summary: 'The Indian Meteorological Department warns of heavy rainfall expected across central and eastern regions. Farmers should prepare drainage systems.',
    category: 'weather',
    region: 'central',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
    link: 'https://weatheragro.com/',
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    source: 'India Meteorological Department',
    sources: ['imd.gov.in', 'weather.gov.in'],
    fullContent: 'CRITICAL WEATHER ALERT: Heavy to very heavy rainfall expected in Central and Eastern India within the next 48 hours. Farmers are advised to: 1) Strengthen drainage systems, 2) Secure loose structures, 3) Postpone pesticide spraying, 4) Monitor crop conditions.',
    keywords: ['weather', 'rain', 'monsoon', 'alert', 'drainage'],
    relevance: { crops: ['all'], regions: ['central', 'east'] },
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'news-003',
    title: 'Fall Armyworm Outbreak Detected',
    summary: 'Fall armyworm has been detected in corn fields across multiple states. Swift action required to prevent crop loss.',
    category: 'crop-health',
    region: 'west',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800',
    link: 'https://www.indiafarm.org/news/india-agri-news/',
    date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    source: 'Integrated Pest Management Center',
    sources: ['ipmcenters.org', 'plantwise.org'],
    fullContent: 'Fall Armyworm outbreak confirmed in corn fields. Recommended control measures: 1) Use bioinsecticides (Bt corn, spinosad), 2) Deploy pheromone traps, 3) Remove affected plant parts, 4) Apply neem oil spray. Avoid chemical pesticides that kill beneficial insects.',
    keywords: ['pest', 'disease', 'armyworm', 'control', 'treatment'],
    relevance: { crops: ['corn', 'maize'], regions: ['west', 'central'] },
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'news-004',
    title: 'AI-Powered Crop Health Monitoring Apps Launch',
    summary: 'New agricultural technology using AI and drones to monitor crop health in real-time. Now available for farmers.',
    category: 'technology',
    region: null,
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    link: 'https://agrinews.in/technology/',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: 'AgriTech Solutions',
    sources: ['agritech.org'],
    fullContent: 'Revolutionary AI app launched for crop health monitoring. Features: Real-time disease detection, drone imaging, weather integration, pest alerts, and yield prediction. Compatible with all smartphones. Free trial for first month.',
    keywords: ['technology', 'AI', 'app', 'monitoring', 'drone'],
    relevance: { crops: ['all'], regions: ['all'] },
    lastUpdated: new Date().toISOString()
  }
];

// Agriculture-focused image URLs for each category
const categoryImages = {
  market: [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', // Farmer with harvest
    'https://images.unsplash.com/photo-1488459716781-6918f33427d7?w=800', // Market produce
    'https://images.unsplash.com/photo-1595428773223-ef52624120d2?w=800', // Farm products
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=800', // Farmer hands
  ],
  weather: [
    'https://images.unsplash.com/photo-1534080564897-61f3b3bcc911?w=800', // Storm clouds
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', // Rain weather
    'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800', // Weather forecast
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', // Clouds sky
  ],
  'crop-health': [
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', // Green crops field
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', // Farm inspection
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', // Crop monitoring
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800', // Healthy plants
  ],
  technology: [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', // Tech in agriculture
    'https://images.unsplash.com/photo-1460925895917-adf4e7884ffe?w=800', // Farm technology
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', // Digital farming
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800', // AgriTech innovation
  ]
};

// Category-specific routing URLs
const categoryRoutes = {
  'market': 'https://www.business-standard.com/markets/capital-market-news/digital-platforms-helping-boost-agriculture-income-125072300292_1.html',
  'weather': 'https://weatheragro.com/',
  'crop-health': 'https://www.indiafarm.org/news/india-agri-news/',
  'technology': 'https://agrinews.in/technology/'
};

// Generate more articles to reach 100
const generateAdditionalArticles = () => {
  const templates = [
    { category: 'market', prefix: 'Cotton prices', suffix: 'market conditions' },
    { category: 'weather', prefix: 'Temperature forecast', suffix: 'weather update' },
    { category: 'crop-health', prefix: 'Root rot disease management', suffix: 'crop protection' },
    { category: 'technology', prefix: 'Smart irrigation systems', suffix: 'agricultural innovation' }
  ];

  const additionalArticles = [];
  let idCounter = 5;

  for (let i = 0; i < 96; i++) {
    const template = templates[i % templates.length];
    const regions = ['north', 'south', 'east', 'west', 'central'];
    const region = regions[i % regions.length];
    const categoryImageList = categoryImages[template.category];
    const imageIndex = i % categoryImageList.length;

    additionalArticles.push({
      id: `news-${String(idCounter).padStart(3, '0')}`,
      title: `${template.prefix} - Article ${idCounter}`,
      summary: `Important update regarding ${template.suffix}. Check the details for your region.`,
      category: template.category,
      region: region,
      image: categoryImageList[imageIndex],
      link: categoryRoutes[template.category],
      date: new Date(Date.now() - (i * 60 * 60 * 1000)).toISOString(),
      source: `News Source ${i % 10 + 1}`,
      sources: ['source1.com', 'source2.com'],
      fullContent: `Detailed content for ${template.prefix}. This is important information for farmers in the ${region} region.`,
      keywords: [template.category, 'agriculture', 'farming'],
      relevance: { crops: ['rice', 'wheat', 'cotton'], regions: [region] },
      lastUpdated: new Date().toISOString()
    });

    idCounter++;
  }

  return additionalArticles;
};

// Combine base and generated articles
export const enhancedNewsArchive = [
  ...baseNewsPosts,
  ...generateAdditionalArticles()
];

// Export processed articles with insights and categorization
export const getProcessedNewsArchive = () => {
  return NewsProcessingEngine.processArticles(enhancedNewsArchive);
};

export default enhancedNewsArchive;
