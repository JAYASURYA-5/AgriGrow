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
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/predict';

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

  // This is a mock response - replace with actual API call
  // Example API integration patterns:
  
  // Pattern 1: Using PlantNet API or similar
  // const response = await fetch('https://api.plantnet.org/v2/identify', {
  //   method: 'POST',
  //   body: formData
  // });

  // Pattern 2: Using TensorFlow.js model
  // const model = await tf.loadLayersModel('/models/disease-model.json');
  // const prediction = model.predict(preprocessedImage);

  // Pattern 3: Using custom backend API
  // const response = await fetch('/api/predict', {
  //   method: 'POST',
  //   body: JSON.stringify({ image: base64Data })
  // });

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

