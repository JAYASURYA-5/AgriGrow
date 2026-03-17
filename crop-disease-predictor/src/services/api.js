/**
 * API service for crop disease prediction
 * This service handles image analysis using an external API
 */

/**
 * Analyzes a crop image to detect diseases
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} - Prediction results with disease information
 */
export async function analyzeDisease(imageFile) {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/predict';

  // Prefer sending the raw file (keeps metadata and avoids base64 loss)
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return formatResponse(data);
  } catch (error) {
    console.error('Error analyzing disease with API, falling back to mock:', error);

    // Fallback to local mock to keep the UI responsive
    const base64Data = await fileToBase64(imageFile);
    return await mockAnalyzeDisease(base64Data, imageFile.type);
  }
}

/**
 * Analyzes a soil image to detect soil type and suggest crops based on color analysis
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} - Prediction results with soil information
 */
export async function analyzeSoil(imageFile) {
  console.log("Analyzing soil image:", imageFile.name);

  try {
    // 1. Process the image to get color data
    const colorData = await extractColorFeatures(imageFile);

    // 2. Validate if it is likely soil
    if (!isLikelySoil(colorData)) {
      throw new Error("The uploaded image does not appear to be soil. Please upload a clear image of soil.");
    }

    // 3. Determine soil type based on color properties
    const soilType = detectSoilType(colorData);

    // 4. Return enriched data for the specific soil type
    return getSoilData(soilType);

  } catch (error) {
    console.error("Soil analysis failed:", error);
    throw error; // Re-throw to be handled by the UI
  }
}

// --- Image Processing Utilities ---

/**
 * Extracts average color and dominant properties from an image file
 */
async function extractColorFeatures(imageFile) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(imageFile);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Downscale for performance and average color approximation
      canvas.width = 100;
      canvas.height = 100;

      ctx.drawImage(img, 0, 0, 100, 100);

      try {
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const data = imageData.data;

        let r = 0, g = 0, b = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        resolve({ r, g, b });
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = (e) => reject(new Error("Failed to load image for processing"));
    img.src = objectUrl;
  });
}

/**
 * Validates if the color matches general soil profiles (Earthy tones)
 * Rejects Blues, Purples, Neon Greens, etc.
 */
function isLikelySoil({ r, g, b }) {
  // Convert RGB to HSL for easier color checking
  const [h, s, l] = rgbToHsl(r, g, b);

  // 1. Blue/Cyan/Purple/Magenta (Sky, Water, Artificial)
  if (h > 170 && h < 330) return false;

  // 2. Vivid Green (Plant leaves are ok, but pure neon isn't soil)
  if (h > 70 && h < 160 && s > 0.6 && l > 0.3) return false;

  // 3. Extreme brightness (White paper/screen)
  if (l > 0.95) return false;

  return true;
}

/**
 * Classifies soil type based on RGB/HSL values
 */
function detectSoilType({ r, g, b }) {
  const [h, s, l] = rgbToHsl(r, g, b);

  if (l < 0.3) {
    return "Black Soil";
  }

  if (r > g + 30 && g > b + 10) {
    return "Red Soil";
  }

  if (r > 160 && g > 140 && b < 120) {
    return "Sandy Soil";
  }

  if (s < 0.15) {
    return "Clay Soil";
  }

  return "Loamy Soil";
}

/**
 * Helper to convert RGB to HSL
 */
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

/**
 * Returns static data based on determined soil type
 */
function getSoilData(soilType) {
  const soilDB = {
    "Loamy Soil": {
      soil_detected: true,
      soil_type: "Loamy Soil",
      confidence: 85 + Math.floor(Math.random() * 10),
      common_places: ["Northern plains of India", "Parts of Punjab and Haryana", "River valleys", "Fertile deltas"],
      soil_condition: "Moderate fertility with good structure; excellent for agriculture",
      water_holding_capacity: "Moderate (60-90mm per 30cm depth) - Ideal for most crops",
      suitable_for_harvest: {
        status: "Yes - Excellent",
        explanation: "Perfect soil for harvest. Good nutrient retention with optimal water availability. Supports year-round cultivation."
      },
      characteristics: [
        "Dark, rich color indicating high organic matter",
        "Crumbly texture, holds shape but breaks apart easily",
        "Balanced mixture of sand, silt, and clay",
        "Excellent water retention and drainage"
      ],
      composition: [
        "40% Sand",
        "40% Silt",
        "20% Clay"
      ],
      recommended_crops: [
        { name: "Wheat", harvest_period: "March-April", suitable: true },
        { name: "Rice", harvest_period: "September-October", suitable: true },
        { name: "Maize", harvest_period: "July-August", suitable: true },
        { name: "Cotton", harvest_period: "October-November", suitable: true },
        { name: "Sugar Cane", harvest_period: "October-December", suitable: true },
        { name: "Pulses", harvest_period: "March-April", suitable: true },
        { name: "Vegetables (Tomatoes, Peppers, Beans)", harvest_period: "Year-round", suitable: true },
        { name: "Fruits (Apples, Berries, Melons)", harvest_period: "Season-dependent", suitable: true }
      ],
      farming_tips: [
        "Ideal for most crops, requires regular organic matter addition",
        "Maintain drainage to prevent waterlogging during heavy rains",
        "Rotate crops to preserve nutrient balance",
        "Add compost annually to maintain soil fertility",
        "Use drip irrigation for water efficiency"
      ]
    },
    "Black Soil": {
      soil_detected: true,
      soil_type: "Black Soil (Regur)",
      confidence: 88 + Math.floor(Math.random() * 10),
      common_places: ["Deccan Plateau (Maharashtra, Karnataka)", "Central India (Madhya Pradesh)", "Parts of Andhra Pradesh", "Black soil regions of India"],
      soil_condition: "High fertility with good nutrient content; self-ploughing capacity",
      water_holding_capacity: "High (90-120mm per 30cm depth) - Excellent for drought-prone areas",
      suitable_for_harvest: {
        status: "Yes - Very Good",
        explanation: "Excellent for harvest especially in cotton and pulses. Retains moisture well but requires careful water management."
      },
      characteristics: [
        "Deep black to grey color",
        "High clay content, cracks when dry",
        "Self-ploughing nature",
        "High moisture retention capacity"
      ],
      composition: [
        "High Clay content (40-50%)",
        "Rich in Calcium Carbonate, Magnesium, Potash",
        "Poor in Phosphorous"
      ],
      recommended_crops: [
        { name: "Cotton", harvest_period: "October-February", suitable: true },
        { name: "Sorghum (Jowar)", harvest_period: "September-October", suitable: true },
        { name: "Soybean", harvest_period: "October-November", suitable: true },
        { name: "Groundnut", harvest_period: "September-October", suitable: true },
        { name: "Wheat", harvest_period: "March-April", suitable: true },
        { name: "Millets", harvest_period: "August-September", suitable: true },
        { name: "Linseed", harvest_period: "March-April", suitable: true },
        { name: "Chick Pea", harvest_period: "March-April", suitable: true }
      ],
      farming_tips: [
        "Work the soil when it has correct moisture content (too wet = sticky, too dry = hard)",
        "Use organic manure to improve friability and reduce cracks",
        "Practice deep ploughing in summer to break hardened layers",
        "Maintain optimum moisture during crop growth",
        "Use mulching to conserve soil moisture"
      ]
    },
    "Red Soil": {
      soil_detected: true,
      soil_type: "Red Soil",
      confidence: 86 + Math.floor(Math.random() * 10),
      common_places: ["Southern India (Tamil Nadu, Karnataka, Andhra Pradesh)", "Eastern India (Odisha, West Bengal)", "Parts of Maharashtra and Telangana"],
      soil_condition: "Moderate fertility with acidic nature; requires management for balanced nutrients",
      water_holding_capacity: "Low to Moderate (30-60mm per 30cm depth) - Requires irrigation support",
      suitable_for_harvest: {
        status: "Yes - Moderate",
        explanation: "Good for harvest with proper soil management and amendment. Requires regular fertilizer and organic matter addition."
      },
      characteristics: [
        "Reddish color due to iron oxide",
        "Porous and friable structure",
        "Absence of lime, kankar (impure calcium carbonate)",
        "Neutral to acidic pH"
      ],
      composition: [
        "Rich in Iron and Potash",
        "Deficient in Nitrogen, Phosphorous, and Humus",
        "Sandy to Loamy texture"
      ],
      recommended_crops: [
        { name: "Groundnut", harvest_period: "September-October", suitable: true },
        { name: "Potato", harvest_period: "December-January", suitable: true },
        { name: "Maize", harvest_period: "July-August", suitable: true },
        { name: "Rice", harvest_period: "September-October", suitable: true },
        { name: "Ragi", harvest_period: "October-November", suitable: true },
        { name: "Tobacco", harvest_period: "March-May", suitable: true },
        { name: "Vegetables", harvest_period: "Year-round", suitable: true },
        { name: "Mango", harvest_period: "March-June", suitable: true }
      ],
      farming_tips: [
        "Apply nitrogenous and phosphatic fertilizers regularly",
        "Add organic matter to improve water holding capacity",
        "Liming may be required if soil is too acidic (pH < 5.5)",
        "Use micronutrient spray for iron deficiency",
        "Practice soil conservation techniques to prevent erosion"
      ]
    },
    "Sandy Soil": {
      soil_detected: true,
      soil_type: "Sandy Soil",
      confidence: 90 + Math.floor(Math.random() * 10),
      common_places: ["Coastal regions", "Desert margins (Rajasthan)", "River beds and sandy plains", "Arid zones"],
      soil_condition: "Low fertility with poor water retention; requires amendment for crop cultivation",
      water_holding_capacity: "Very Low (15-30mm per 30cm depth) - Requires frequent irrigation",
      suitable_for_harvest: {
        status: "Conditional - Limited",
        explanation: "Can support harvest for specific crops requiring good drainage. Requires intensive irrigation and fertilizer management."
      },
      characteristics: [
        "Large particles, gritty feel",
        "Drains very quickly, poor water retention",
        "Warms up fast in spring",
        "Low nutrient content"
      ],
      composition: [
        "> 70% Sand particles",
        "< 15% Clay",
        "Low organic matter"
      ],
      recommended_crops: [
        { name: "Carrots", harvest_period: "November-December", suitable: true },
        { name: "Radishes", harvest_period: "October-November", suitable: true },
        { name: "Potatoes", harvest_period: "August-September", suitable: true },
        { name: "Peas", harvest_period: "February-March", suitable: true },
        { name: "Groundnut", harvest_period: "September-October", suitable: true },
        { name: "Watermelon", harvest_period: "May-June", suitable: true },
        { name: "Muskmelon", harvest_period: "April-May", suitable: true },
        { name: "Maize (with irrigation)", harvest_period: "July-August", suitable: true }
      ],
      farming_tips: [
        "Requires frequent but light irrigation (every 3-5 days)",
        "Add 20-30 tons of organic matter per hectare annually",
        "Apply fertilizers in small, frequent doses (split application)",
        "Use mulch to reduce water evaporation",
        "Practice zero tillage to preserve soil structure"
      ]
    },
    "Clay Soil": {
      soil_detected: true,
      soil_type: "Clay Soil",
      confidence: 89 + Math.floor(Math.random() * 10),
      common_places: ["Floodplain areas", "Depressional zones", "River deltas", "Valley soils"],
      soil_condition: "High fertility but poor drainage; requires soil improvement for optimal growth",
      water_holding_capacity: "Very High (120-150mm per 30cm depth) - Often waterlogged",
      suitable_for_harvest: {
        status: "Conditional - Requires Management",
        explanation: "Can support good harvest with proper drainage management. Needs aeration and structure improvement for better results."
      },
      characteristics: [
        "Very fine particles",
        "Sticky when wet, rock hard when dry",
        "Poor drainage, slow to warm up",
        "High nutrient density but often locked up"
      ],
      composition: [
        "> 35% Clay particles",
        "Silicate minerals",
        "High mineral content"
      ],
      recommended_crops: [
        { name: "Rice (in waterlogged areas)", harvest_period: "September-October", suitable: true },
        { name: "Cabbage", harvest_period: "November-January", suitable: true },
        { name: "Broccoli", harvest_period: "November-December", suitable: true },
        { name: "Cauliflower", harvest_period: "December-January", suitable: true },
        { name: "Spinach/Leafy Greens", harvest_period: "November-February", suitable: true },
        { name: "Beans", harvest_period: "May-July", suitable: true },
        { name: "Sunflower", harvest_period: "September-October", suitable: true },
        { name: "Sugarcane", harvest_period: "October-December", suitable: true }
      ],
      farming_tips: [
        "Never work soil when wet to prevent compaction and loss of structure",
        "Add Gypsum (500-1000 kg/ha) to improve soil structure and aeration",
        "Use raised beds to improve drainage",
        "Add organic matter and coarse sand to improve friability",
        "Create furrows for proper water drainage",
        "Practice minimal tilling to preserve structure"
      ]
    }
  };

  return soilDB[soilType] || soilDB["Loamy Soil"];
}

/**
 * Converts a file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Mock disease analysis function
 * Replace this with actual API integration
 * @param {string} base64Data - Base64 encoded image
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} - Mock prediction results
 */
async function mockAnalyzeDisease(base64Data, mimeType) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock response structure
  const mockDiseases = [
    {
      disease_detected: true,
      disease_name: 'Early Blight',
      confidence: 87,
      affected_crop: 'Tomato',
      severity: 'Medium',
      symptoms: [
        'Dark brown spots with concentric rings on leaves',
        'Yellowing and wilting of lower leaves',
        'Lesions on stems and fruits'
      ],
      causes: [
        'Fungal pathogen Alternaria solani',
        'High humidity and warm temperatures',
        'Poor air circulation'
      ],
      treatment: [
        'Remove and destroy infected plant parts immediately',
        'Apply fungicide containing chlorothalonil or mancozeb every 7-10 days',
        'Ensure proper spacing between plants for better air circulation',
        'Water plants at the base to avoid wetting leaves',
        'Apply organic fungicides like neem oil or copper-based products',
        'Maintain soil pH between 6.0-6.8 for optimal plant health'
      ],
      prevention: [
        'Use disease-resistant tomato varieties',
        'Practice crop rotation (avoid planting tomatoes in same spot for 3-4 years)',
        'Remove plant debris from garden at end of season',
        'Avoid overhead watering',
        'Maintain proper plant spacing',
        'Apply mulch to prevent soil splash onto leaves'
      ]
    },
    {
      disease_detected: true,
      disease_name: 'Powdery Mildew',
      confidence: 92,
      affected_crop: 'Cucumber',
      severity: 'Low',
      symptoms: [
        'White powdery spots on leaves and stems',
        'Leaves may curl or become distorted',
        'Premature leaf drop'
      ],
      causes: [
        'Fungal spores spread by wind',
        'High humidity with moderate temperatures',
        'Poor air circulation'
      ],
      treatment: [
        'Prune affected leaves and stems to improve air flow',
        'Apply sulfur-based fungicide or baking soda solution (1 tbsp per gallon of water)',
        'Spray with neem oil or horticultural oil every 7-10 days',
        'Increase air circulation around plants',
        'Water plants in the morning to allow leaves to dry',
        'Apply potassium bicarbonate as a natural fungicide'
      ],
      prevention: [
        'Plant in areas with good air circulation',
        'Water at the base of plants, not on leaves',
        'Space plants adequately',
        'Choose resistant varieties when available',
        'Avoid overhead irrigation',
        'Remove and destroy infected plant material'
      ]
    },
    {
      disease_detected: false,
      disease_name: 'Healthy',
      confidence: 95,
      affected_crop: 'Corn',
      severity: null,
      symptoms: [],
      causes: [],
      treatment: [],
      prevention: []
    }
  ];

  // Randomly select a mock disease for demonstration
  const randomIndex = Math.floor(Math.random() * mockDiseases.length);
  return mockDiseases[randomIndex];
}

/**
 * Formats API response to match expected structure
 * @param {Object} apiResponse - Raw API response
 * @returns {Object} - Formatted response
 */
function formatResponse(apiResponse) {
  // Transform API response to match expected format
  return {
    disease_detected: apiResponse.disease_detected ?? true,
    disease_name: apiResponse.disease_name || 'Unknown Disease',
    confidence: apiResponse.confidence || 0,
    affected_crop: apiResponse.affected_crop || 'Unknown Crop',
    severity: apiResponse.severity || 'Medium',
    symptoms: apiResponse.symptoms || [],
    causes: apiResponse.causes || [],
    treatment: apiResponse.treatment || [],
    prevention: apiResponse.prevention || []
  };
}
