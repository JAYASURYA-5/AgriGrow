export const cropDatabase = {
  wheat: {
    companions: [
      { name: 'Chickpea', benefit: 'Nitrogen fixation, complementary root depth', yield: '+15-20%', spacing: '30cm between rows', season: 'Winter', water: 'Low', nutrients: 'Adds nitrogen to soil' },
      { name: 'Mustard', benefit: 'Pest repellent, different nutrient needs', yield: '+12-18%', spacing: '25cm between rows', season: 'Winter', water: 'Moderate', nutrients: 'Light feeder' },
      { name: 'Lentil', benefit: 'Nitrogen enrichment, weed suppression', yield: '+18-25%', spacing: '20cm between rows', season: 'Winter', water: 'Low', nutrients: 'Nitrogen fixer' }
    ],
    info: { bestSoil: ['Loamy', 'Alluvial'], bestClimate: ['Temperate', 'Subtropical'], growthDuration: '120-150 days' }
  },
  rice: {
    companions: [
      { name: 'Mung Bean', benefit: 'Nitrogen fixation, fast maturity', yield: '+10-15%', spacing: '30cm between rows', season: 'Summer/Monsoon', water: 'High', nutrients: 'Nitrogen fixer' },
      { name: 'Azolla', benefit: 'Biofertilizer, weed control', yield: '+20-30%', spacing: 'Surface coverage', season: 'Year-round', water: 'Aquatic', nutrients: 'Nitrogen provider' },
      { name: 'Fish Farming', benefit: 'Integrated system, pest control', yield: '+25-35%', spacing: 'Integrated system', season: 'Year-round', water: 'High', nutrients: 'Provides organic matter' }
    ],
    info: { bestSoil: ['Clay', 'Alluvial'], bestClimate: ['Tropical', 'Subtropical'], growthDuration: '90-120 days' }
  },
  corn: {
    companions: [
      { name: 'Beans', benefit: 'Nitrogen fixation, soil enrichment', yield: '+20-25%', spacing: '45cm between rows', season: 'Summer', water: 'Moderate', nutrients: 'Nitrogen fixer' },
      { name: 'Squash', benefit: 'Ground cover, moisture retention', yield: '+15-20%', spacing: '60cm between plants', season: 'Summer', water: 'Moderate', nutrients: 'Heavy feeder' },
      { name: 'Soybean', benefit: 'Nitrogen provision, complementary growth', yield: '+18-22%', spacing: '40cm between rows', season: 'Summer', water: 'Moderate', nutrients: 'Nitrogen fixer' }
    ],
    info: { bestSoil: ['Loamy', 'Sandy', 'Alluvial'], bestClimate: ['Tropical', 'Subtropical', 'Temperate'], growthDuration: '80-110 days' }
  },
  tomato: {
    companions: [
      { name: 'Basil', benefit: 'Pest repellent, improves flavor', yield: '+10-15%', spacing: '25cm between plants', season: 'Summer', water: 'Moderate', nutrients: 'Light feeder' },
      { name: 'Marigold', benefit: 'Nematode control, attracts pollinators', yield: '+12-18%', spacing: '30cm between plants', season: 'Summer', water: 'Low', nutrients: 'Very light feeder' },
      { name: 'Carrot', benefit: 'Different root depth, space optimization', yield: '+8-12%', spacing: '15cm between rows', season: 'Cool season', water: 'Moderate', nutrients: 'Light feeder' }
    ],
    info: { bestSoil: ['Loamy', 'Sandy'], bestClimate: ['Tropical', 'Subtropical', 'Temperate'], growthDuration: '60-90 days' }
  },
  cotton: {
    companions: [
      { name: 'Sorghum', benefit: 'Trap crop for pests, wind protection', yield: '+10-15%', spacing: '50cm between rows', season: 'Summer', water: 'Moderate', nutrients: 'Moderate feeder' },
      { name: 'Cowpea', benefit: 'Nitrogen fixation, ground cover', yield: '+15-20%', spacing: '40cm between rows', season: 'Summer', water: 'Low-Moderate', nutrients: 'Nitrogen fixer' },
      { name: 'Green Gram', benefit: 'Soil fertility, quick cash crop', yield: '+12-18%', spacing: '30cm between rows', season: 'Summer', water: 'Low', nutrients: 'Nitrogen fixer' }
    ],
    info: { bestSoil: ['Loamy', 'Clay'], bestClimate: ['Tropical', 'Subtropical'], growthDuration: '150-180 days' }
  },
  sugarcane: {
    companions: [
      { name: 'Onion', benefit: 'Different growth period, additional income', yield: '+8-12%', spacing: '20cm between rows', season: 'Winter', water: 'Moderate', nutrients: 'Moderate feeder' },
      { name: 'Garlic', benefit: 'Pest deterrent, early harvest', yield: '+10-15%', spacing: '15cm between rows', season: 'Winter', water: 'Moderate', nutrients: 'Light feeder' },
      { name: 'Turmeric', benefit: 'Shade tolerance, soil health', yield: '+12-18%', spacing: '30cm between rows', season: 'Year-round', water: 'High', nutrients: 'Heavy feeder' }
    ],
    info: { bestSoil: ['Loamy', 'Alluvial'], bestClimate: ['Tropical', 'Subtropical'], growthDuration: '10-12 months' }
  }
};

export const mainCrops = [
  { id: 'wheat', name: 'Wheat', icon: '🌾' },
  { id: 'rice', name: 'Rice', icon: '🌾' },
  { id: 'corn', name: 'Corn/Maize', icon: '🌽' },
  { id: 'tomato', name: 'Tomato', icon: '🍅' },
  { id: 'cotton', name: 'Cotton', icon: '☁️' },
  { id: 'sugarcane', name: 'Sugarcane', icon: '🎋' }
];

export const soilTypes = [
  { id: 'loamy', name: 'Loamy Soil', description: 'Best all-purpose soil' },
  { id: 'clay', name: 'Clay Soil', description: 'Good water retention' },
  { id: 'sandy', name: 'Sandy Soil', description: 'Good drainage' },
  { id: 'alluvial', name: 'Alluvial Soil', description: 'Rich in nutrients' }
];

export const climateTypes = [
  { id: 'tropical', name: 'Tropical', temp: '25-35°C' },
  { id: 'subtropical', name: 'Subtropical', temp: '15-30°C' },
  { id: 'temperate', name: 'Temperate', temp: '10-25°C' },
  { id: 'arid', name: 'Arid/Semi-arid', temp: '20-40°C' }
];
