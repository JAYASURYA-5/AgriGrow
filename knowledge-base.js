/**
 * AgriBot Knowledge Base
 * Centralized API endpoints, data sources, and handlers for:
 * - Weather (global, real-time)
 * - Agriculture (crops, vegetables, fruits, flowers)
 * - Policies & Schemes (country-specific)
 * - Market Prices (commodities, seeds, manure)
 * - Plant & Crop Database
 */

const AGRIBOT_KB = {
  // =================================
  // 1. WEATHER & CLIMATE APIs
  // =================================
  WEATHER_APIS: {
    // Primary: Open-Meteo (free, global, no API key required)
    OPEN_METEO: {
      name: 'Open-Meteo',
      forecast: 'https://api.open-meteo.com/v1/forecast',
      current: 'https://api.open-meteo.com/v1/forecast?current_weather=true',
      params: '?latitude={lat}&longitude={lon}&timezone=auto&current_weather=true&hourly=temperature_2m,precipitation&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
      docs: 'https://open-meteo.com/en/docs'
    },
    // Fallback: wttr.in (text-based weather)
    WTTR_IN: {
      name: 'wttr.in',
      endpoint: 'https://wttr.in/{location}?format=j1',
      docs: 'https://wttr.in/:help'
    },
    // Alternative: Weather.gov (USA only)
    WEATHER_GOV: {
      name: 'NOAA Weather.gov',
      points: 'https://api.weather.gov/points/{lat},{lon}',
      docs: 'https://api.weather.gov/'
    }
  },

  // Geocoding APIs
  GEOCODING_APIS: {
    NOMINATIM: {
      name: 'Nominatim (OpenStreetMap)',
      search: 'https://nominatim.openstreetmap.org/search?format=json&q={query}',
      reverse: 'https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}',
      docs: 'https://nominatim.org/release-docs/latest/'
    },
    GOOGLE_GEOCODING: {
      name: 'Google Geocoding (requires API key)',
      endpoint: 'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}',
      docs: 'https://developers.google.com/maps/documentation/geocoding'
    }
  },

  // =================================
  // 2. AGRICULTURE & CROP DATABASE
  // =================================
  CROP_DATABASE: {
    // Major crops, vegetables, fruits, flowers with basic info
    CROPS: {
      'Maize/Corn': {
        aliases: ['corn', 'maise', 'maiz'],
        category: 'cereal',
        regions: ['Africa', 'Americas', 'Asia', 'Europe'],
        growing_period: '90-150 days',
        climate: 'Warm (15-35°C)',
        soil: 'Well-drained, pH 6-7',
        water: '500-800 mm',
        season: 'Summer (varies by region)'
      },
      'Tomato': {
        aliases: ['tom', 'tomatoe'],
        category: 'vegetable',
        regions: ['Global'],
        growing_period: '60-85 days',
        climate: 'Warm (20-30°C)',
        soil: 'Fertile, organic-rich',
        water: '400-600 mm',
        season: 'Spring/Summer'
      },
      'Potato': {
        aliases: ['spud'],
        category: 'tuber',
        regions: ['Global'],
        growing_period: '70-120 days',
        climate: 'Cool (15-20°C)',
        soil: 'Loose, well-draining',
        water: '500-750 mm',
        season: 'Spring/Fall'
      },
      'Rice': {
        aliases: ['paddy'],
        category: 'cereal',
        regions: ['Asia', 'Africa', 'Americas'],
        growing_period: '120-150 days',
        climate: 'Warm (20-30°C), water-loving',
        soil: 'Clay-based, flooded',
        water: '1000-1500 mm',
        season: 'Monsoon/Rainy'
      },
      'Wheat': {
        aliases: ['cereal grain'],
        category: 'cereal',
        regions: ['Global'],
        growing_period: '120-150 days',
        climate: 'Cool to moderate (10-20°C)',
        soil: 'Well-drained, pH 6-7.5',
        water: '400-600 mm',
        season: 'Winter/Spring'
      },
      'Soybean': {
        aliases: ['soya'],
        category: 'legume',
        regions: ['Americas', 'Asia', 'Africa'],
        growing_period: '90-140 days',
        climate: 'Warm (20-30°C)',
        soil: 'Well-drained, pH 6-7',
        water: '450-700 mm',
        season: 'Summer'
      },
      'Banana': {
        aliases: ['plantain'],
        category: 'fruit',
        regions: ['Tropical regions'],
        growing_period: '270-365 days',
        climate: 'Tropical (18-30°C)',
        soil: 'Rich, well-draining',
        water: '1500-2250 mm',
        season: 'Year-round'
      },
      'Apple': {
        aliases: ['pomme'],
        category: 'fruit',
        regions: ['Temperate regions'],
        growing_period: '150-180 days (fruiting)',
        climate: 'Temperate (5-25°C)',
        soil: 'Well-drained, pH 6-7',
        water: '600-900 mm',
        season: 'Spring/Summer'
      },
      'Cabbage': {
        aliases: ['brassica'],
        category: 'vegetable',
        regions: ['Global'],
        growing_period: '70-120 days',
        climate: 'Cool (15-20°C)',
        soil: 'Rich, well-draining',
        water: '400-600 mm',
        season: 'Spring/Fall'
      },
      'Pepper/Chili': {
        aliases: ['capsicum', 'chilli'],
        category: 'vegetable',
        regions: ['Global'],
        growing_period: '60-90 days',
        climate: 'Warm (20-30°C)',
        soil: 'Fertile, organic-rich',
        water: '500-700 mm',
        season: 'Summer'
      },
      'Onion': {
        aliases: ['bulb'],
        category: 'vegetable',
        regions: ['Global'],
        growing_period: '100-180 days',
        climate: 'Moderate (12-24°C)',
        soil: 'Well-prepared, pH 6-7',
        water: '300-500 mm',
        season: 'Fall/Winter'
      },
      'Lettuce': {
        aliases: ['greens', 'salad'],
        category: 'vegetable',
        regions: ['Global'],
        growing_period: '30-60 days',
        climate: 'Cool (15-20°C)',
        soil: 'Fertile, moist',
        water: '250-350 mm',
        season: 'Spring/Fall'
      },
      'Coconut': {
        aliases: ['coco'],
        category: 'fruit',
        regions: ['Tropical regions'],
        growing_period: '365-1095 days',
        climate: 'Tropical (22-32°C)',
        soil: 'Well-draining, sandy',
        water: '1000-1500 mm',
        season: 'Year-round'
      },
      'Mango': {
        aliases: ['king of fruits'],
        category: 'fruit',
        regions: ['Tropical/Subtropical'],
        growing_period: '150-180 days',
        climate: 'Warm (24-30°C)',
        soil: 'Well-drained, pH 5.5-7.5',
        water: '600-2250 mm',
        season: 'Summer'
      },
      'Rose': {
        aliases: ['flower'],
        category: 'flower',
        regions: ['Global'],
        growing_period: '30-90 days',
        climate: 'Moderate (15-25°C)',
        soil: 'Well-draining, rich',
        water: '400-600 mm',
        season: 'Spring/Summer'
      },
      'Sunflower': {
        aliases: ['sunflor'],
        category: 'flower',
        regions: ['Global'],
        growing_period: '70-100 days',
        climate: 'Warm (15-25°C)',
        soil: 'Well-drained',
        water: '400-600 mm',
        season: 'Summer'
      }
    }
  },

  // =================================
  // 3. PLANT DISEASE & PEST DATABASE
  // =================================
  DISEASE_DATABASE: {
    'Late Blight': {
      crops: ['Tomato', 'Potato'],
      symptoms: 'Water-soaked lesions, white mold on leaf undersides, rapid plant collapse',
      cause: 'Phytophthora infestans (fungus)',
      conditions: 'Cool, wet weather (10-20°C)',
      prevention: 'Crop rotation, resistant varieties, fungicide sprays',
      treatment: 'Remove infected plants, apply approved fungicides'
    },
    'Early Blight': {
      crops: ['Tomato', 'Potato'],
      symptoms: 'Brown spots with concentric rings on leaves',
      cause: 'Alternaria solani (fungus)',
      conditions: 'Warm, humid (20-25°C)',
      prevention: 'Remove lower leaves, improve air flow, mulch',
      treatment: 'Fungicide sprays, remove infected foliage'
    },
    'Powdery Mildew': {
      crops: ['Cucumber', 'Melon', 'Squash', 'Grape'],
      symptoms: 'White powder on leaves, stunted growth',
      cause: 'Various fungi species',
      conditions: 'Warm days, cool nights (15-27°C), low humidity',
      prevention: 'Improve air circulation, resistant varieties',
      treatment: 'Sulfur sprays, neem oil'
    },
    'Leaf Spot': {
      crops: ['Beans', 'Cabbage', 'Lettuce'],
      symptoms: 'Circular brown/grey spots with yellow halos',
      cause: 'Various bacteria/fungi',
      conditions: 'High humidity (80%+)',
      prevention: 'Crop rotation, avoid overhead irrigation',
      treatment: 'Remove infected leaves, fungicide/bactericide'
    },
    'Rust': {
      crops: ['Wheat', 'Barley', 'Coffee'],
      symptoms: 'Orange/brown pustules on leaf undersides',
      cause: 'Rust fungi',
      conditions: 'Warm, humid (15-27°C)',
      prevention: 'Resistant varieties, fungicide sprays',
      treatment: 'Fungicide applications'
    },
    'Mosaic Virus': {
      crops: ['Tomato', 'Pepper', 'Cucumber'],
      symptoms: 'Mottled leaves, stunted growth, yellow patches',
      cause: 'Plant viruses (TMV, CMV, etc.)',
      conditions: 'Any warm climate',
      prevention: 'Use resistant varieties, control aphids/insects',
      treatment: 'Remove infected plants, disinfect tools'
    }
  },

  // =================================
  // 4. PEST DATABASE
  // =================================
  PEST_DATABASE: {
    'Aphids': {
      crops: ['Most crops'],
      damage: 'Yellowing, stunted growth, sticky residue',
      identification: 'Small, soft-bodied, pear-shaped insects',
      control: 'Neem oil, insecticidal soap, encourage natural predators'
    },
    'Whiteflies': {
      crops: ['Tomato', 'Cucumber', 'Cabbage'],
      damage: 'Yellowing, leaf drop, sticky residue',
      identification: 'Tiny white flying insects on leaf undersides',
      control: 'Yellow sticky traps, neem oil, insecticidal soap'
    },
    'Spider Mites': {
      crops: ['Most crops'],
      damage: 'Fine webbing, yellowing, leaf stippling',
      identification: 'Tiny red/yellow mites, fine webbing',
      control: 'Water spray, neem oil, increase humidity'
    },
    'Caterpillars': {
      crops: ['Cabbage', 'Tomato', 'Corn'],
      damage: 'Leaf holes, fruit damage',
      identification: 'Larval stage of butterflies/moths',
      control: 'Hand-picking, Bt spray, netting'
    },
    'Beetles': {
      crops: ['Most crops'],
      damage: 'Skeletonized leaves, root damage',
      identification: 'Varies by species',
      control: 'Hand-picking, crop rotation, neem oil'
    }
  },

  // =================================
  // 5. MARKET PRICE APIs & DATA SOURCES
  // =================================
  MARKET_APIS: {
    // Global commodity prices
    COMMODITY_FUTURES: {
      name: 'Trading Economics / Commodity Futures',
      endpoint: 'https://tradingeconomics.com/commodities',
      sources: ['CME (Chicago)', 'ICE (UK)', 'LME (London)'],
      commodities: ['Wheat', 'Corn', 'Soybean', 'Coffee', 'Cocoa', 'Sugar', 'Rice']
    },
    // FAO Food Price Index (UN Food & Agriculture Organization)
    FAO_FAOSTAT: {
      name: 'FAO FAOSTAT',
      endpoint: 'https://www.fao.org/faostat/',
      data: ['crop production', 'prices', 'trade', 'food balance'],
      countries: 'All UN member states'
    },
    // World Bank Commodity Prices
    WORLD_BANK: {
      name: 'World Bank Commodity Price Data',
      endpoint: 'https://www.worldbank.org/en/research/commodity-markets',
      data: ['historical prices', 'forecasts', 'indices']
    },
    // Regional market data (Africa)
    AFDB_STATS: {
      name: 'African Development Bank Statistics',
      endpoint: 'https://www.afdb.org/en/statistics',
      data: ['African commodity prices', 'market data']
    },
    // India (major agricultural producer)
    AGMARKNET_INDIA: {
      name: 'India Agmarknet (Ministry of Agriculture)',
      endpoint: 'https://agmarknet.gov.in/',
      data: ['daily market prices', 'state-wise commodity prices'],
      region: 'India (all states)'
    },
    // USA (USDA)
    USDA_NASS: {
      name: 'USDA NASS (National Agricultural Statistics Service)',
      endpoint: 'https://quickstats.nass.usda.gov/',
      data: ['crop prices', 'production data'],
      region: 'USA'
    },
    // Kenya Agricultural Commodity Exchange
    KACE: {
      name: 'Kenya Agricultural Commodity Exchange',
      endpoint: 'https://www.kacekenya.org/',
      data: ['commodity prices', 'market data'],
      region: 'Kenya & East Africa'
    },
    // Brazil Agricultural Data
    CONAB: {
      name: 'CONAB (Brazilian Agricultural Statistics)',
      endpoint: 'https://www.conab.gov.br/',
      data: ['production', 'prices', 'forecasts'],
      region: 'Brazil'
    }
  },

  // =================================
  // 6. GOVERNMENT SCHEMES & POLICIES
  // =================================
  GOVERNMENT_SCHEMES: {
    INDIA: {
      country: 'India',
      schemes: [
        {
          name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
          description: 'Direct income support to farmers',
          amount: '₹6,000 per year in 3 installments',
          eligibility: 'Landholding farmers',
          link: 'https://pmkisan.gov.in/'
        },
        {
          name: 'Crop Insurance Scheme (PMFBY)',
          description: 'Pradhan Mantri Fasal Bima Yojana',
          amount: 'Varies by crop and coverage',
          eligibility: 'All farmers (loanee & non-loanee)',
          link: 'https://pmfby.gov.in/'
        },
        {
          name: 'FPO Scheme',
          description: 'Farmer Producer Organization',
          amount: 'Subsidy for formation and operation',
          eligibility: '10+ farmers',
          link: 'https://dpiit.gov.in/'
        }
      ],
      resources: [
        'https://farmer.gov.in/',
        'https://pib.gov.in/ (Press Information Bureau)'
      ]
    },
    KENYA: {
      country: 'Kenya',
      schemes: [
        {
          name: 'National Cereals and Produce Board Support',
          description: 'Stabilization of grain prices',
          eligibility: 'Grain farmers',
          link: 'https://ncpb.go.ke/'
        },
        {
          name: 'Kenya Cereal Enhancement Programme',
          description: 'Productivity and marketing support',
          eligibility: 'Small-scale farmers',
          link: 'https://www.kcep-fp.org/'
        }
      ]
    },
    USA: {
      country: 'USA',
      schemes: [
        {
          name: 'USDA Farm Service Agency Loans',
          description: 'Loans for farm operations and equipment',
          link: 'https://www.fsa.usda.gov/'
        },
        {
          name: 'Crop Insurance Program',
          description: 'Risk management through insurance',
          link: 'https://www.rma.usda.gov/'
        }
      ]
    },
    EUROPE: {
      country: 'European Union',
      schemes: [
        {
          name: 'Common Agricultural Policy (CAP)',
          description: 'EU subsidies and direct payments',
          link: 'https://agriculture.ec.europa.eu/common-agricultural-policy_en'
        }
      ]
    },
    BRAZIL: {
      country: 'Brazil',
      schemes: [
        {
          name: 'PRONAF (Programa Nacional da Agricultura Familiar)',
          description: 'Support for family farmers',
          link: 'https://www.gov.br/agricultura'
        }
      ]
    }
  },

  // =================================
  // 7. SEEDS & MANURE DATABASE
  // =================================
  INPUTS: {
    SEEDS: {
      sources: [
        'ICRISAT (International Crops Research Institute)',
        'CIMMYT (Maize & Wheat Research)',
        'IRRI (Rice Research)',
        'Local seed companies per country',
        'FAO Seed Bank Network'
      ],
      types: ['Hybrid', 'Open-pollinated', 'Heirloom', 'Certified'],
      certifications: ['ISTA', 'AOSA', 'Government certified']
    },
    MANURE_FERTILIZERS: {
      organic: ['Cow manure', 'Compost', 'Vermicompost', 'Seaweed extract'],
      chemical: ['NPK (10-10-10, 15-15-15, etc.)', 'Urea', 'DAP', 'Sulfate of Potash'],
      sources: [
        'Local farmers/suppliers',
        'Government agricultural departments',
        'Fertilizer companies'
      ]
    }
  },

  // =================================
  // 8. PLANT DATABASES (External)
  // =================================
  EXTERNAL_PLANT_DBS: {
    USES_TREFLE_API: {
      name: 'Trefle Plant Database API',
      endpoint: 'https://trefle.io/api/v1',
      docs: 'https://trefle.io/',
      data: ['Plant taxonomy', 'Growing conditions', 'Characteristics'],
      free_tier: 'Limited (requires registration)'
    },
    PLANTNET_API: {
      name: 'Plant.id / PlantNet API',
      endpoint: 'https://api.plant.id/v2',
      docs: 'https://plant.id/api/',
      data: ['Plant identification', 'Disease detection'],
      free_tier: 'Limited'
    },
    PERENUAL_API: {
      name: 'Perenual Plant Database',
      endpoint: 'https://perenual.com/api',
      docs: 'https://perenual.com/api',
      data: ['Plants, care guides, watering'],
      free_tier: 'Yes'
    },
    WIKIPEDIA_API: {
      name: 'Wikipedia API',
      endpoint: 'https://en.wikipedia.org/w/api.php',
      data: ['Plant articles', 'Farming info', 'Policies'],
      free_tier: 'Yes'
    }
  },

  // =================================
  // 9. SOIL & WATER RESOURCES
  // =================================
  SOIL_WATER_APIS: {
    SOIL_GRIDS: {
      name: 'SoilGrids (ISRIC)',
      endpoint: 'https://soilgrids.org/maps',
      data: ['Soil properties', 'Global coverage'],
      docs: 'https://soilgrids.org/'
    },
    COPERNICUS_SENTINEL: {
      name: 'Copernicus Sentinel Satellite Data',
      endpoint: 'https://scihub.copernicus.eu/',
      data: ['Soil moisture', 'Vegetation index', 'Land cover'],
      docs: 'https://scihub.copernicus.eu/'
    },
    AQUASTAT: {
      name: 'FAO AQUASTAT (Water)',
      endpoint: 'https://www.fao.org/aquastat/',
      data: ['Water availability', 'Irrigation', 'Precipitation'],
      coverage: 'Global'
    }
  },

  // =================================
  // 10. PEST & DISEASE MONITORING
  // =================================
  MONITORING_NETWORKS: {
    PLANTWISE: {
      name: 'PlantWise (CABI)',
      endpoint: 'https://www.plantwise.org/',
      data: ['Pest and disease information', 'Extension advice'],
      coverage: 'Global'
    },
    IPPC: {
      name: 'IPPC (International Plant Protection Convention)',
      endpoint: 'https://www.ippc.int/',
      data: ['Plant health, quarantine, phytosanitary'],
      coverage: 'Global'
    }
  },

  // =================================
  // UTILITY FUNCTIONS
  // =================================
  UTILS: {
    // Find crop info by name or alias
    findCrop: function(query) {
      const q = query.toLowerCase().trim();
      for (const [name, info] of Object.entries(this.CROP_DATABASE.CROPS || {})) {
        if (name.toLowerCase() === q || (info.aliases && info.aliases.includes(q))) {
          return { name, ...info };
        }
      }
      return null;
    },

    // Find disease info by crop
    findDiseaseForCrop: function(cropName) {
      const diseases = [];
      for (const [name, info] of Object.entries(this.DISEASE_DATABASE || {})) {
        if (info.crops && info.crops.some(c => c.toLowerCase() === cropName.toLowerCase())) {
          diseases.push({ name, ...info });
        }
      }
      return diseases;
    },

    // Find pest info
    findPest: function(pestName) {
      const p = pestName.toLowerCase().trim();
      for (const [name, info] of Object.entries(this.PEST_DATABASE || {})) {
        if (name.toLowerCase() === p) {
          return { name, ...info };
        }
      }
      return null;
    },

    // Get schemes for a country
    getSchemes: function(country) {
      const c = country.toUpperCase();
      return this.GOVERNMENT_SCHEMES[c] || null;
    }
  }
};

// Export for use in Node.js or as global in browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AGRIBOT_KB;
}
if (typeof window !== 'undefined') {
  window.AGRIBOT_KB = AGRIBOT_KB;
}
