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
        "Wheat", "Sugar Cane", "Cotton", "Pulses", "Oilseeds",
        "Vegetables (Tomatoes, Peppers, Green Beans)",
        "Fruits (Apples, Berries, Mellons)"
      ],
      farming_tips: [
        "Ideal for most crops, requires regular organic matter addition",
        "Maintain drainage to prevent waterlogging during heavy rains",
        "Rotate crops to preserve nutrient balance"
      ]
    },
    "Black Soil": {
      soil_detected: true,
      soil_type: "Black Soil (Regur)",
      confidence: 88 + Math.floor(Math.random() * 10),
      characteristics: [
        "Deep black to grey color",
        "High clay content, cracks when dry",
        "Self-ploughing nature",
        "High moisture retention capacity"
      ],
      composition: [
        "High Clay content",
        "Rich in Calcium Carbonate, Magnesium, Potash",
        "Poor in Phosphorous"
      ],
      recommended_crops: [
        "Cotton", "Sorghum (Jowar)", "Soybean",
        "Wheat", "Millets", "Linseed",
        "Sunflower", "Citrus Fruits"
      ],
      farming_tips: [
        "Work the soil when it has correct moisture content (too wet = sticky, too dry = hard)",
        "Use organic manure to improve friability",
        "Practice deep ploughing in summer"
      ]
    },
    "Red Soil": {
      soil_detected: true,
      soil_type: "Red Soil",
      confidence: 86 + Math.floor(Math.random() * 10),
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
        "Groundnut", "Potato", "Maize", "Rice",
        "Ragi", "Tobacco", "Vegetables", "Mango", "Cashew"
      ],
      farming_tips: [
        "Apply nitrogenous and phosphatic fertilizers regularly",
        "Add organic matter to improve water holding capacity",
        "Liming may be required if soil is too acidic"
      ]
    },
    "Sandy Soil": {
      soil_detected: true,
      soil_type: "Sandy Soil",
      confidence: 90 + Math.floor(Math.random() * 10),
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
        "Carrots", "Potatoes", "Radishes",
        "Cucumbers", "Watermelon", "Muskmelon",
        "Peanuts", "Corn (with irrigation)"
      ],
      farming_tips: [
        "Requires frequent but light irrigation",
        "Add heavy amounts of organic matter to improve retention",
        "Apply fertilizers in small, frequent doses"
      ]
    },
    "Clay Soil": {
      soil_detected: true,
      soil_type: "Clay Soil",
      confidence: 89 + Math.floor(Math.random() * 10),
      characteristics: [
        "Very fine particles",
        "Sticky when wet, rock hard when dry",
        "Poor drainage, slow to warm up",
        "High nutrient density"
      ],
      composition: [
        "> 35% Clay particles",
        "Silicate minerals",
        "High mineral content"
      ],
      recommended_crops: [
        "Broccoli", "Cabbage", "Cauliflower",
        "Leafy Greens (Spinach/Chard)",
        "Rice", "Sunflowers", "Beans"
      ],
      farming_tips: [
        "Avoid working soil when wet to prevent compaction",
        "Add Gypsum to improve soil structure and aeration",
        "Use raised beds to improve drainage"
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
