/**
 * Disease Prediction API Service
 * Connects frontend to backend Flask API at localhost:5000
 */

const API_BASE = 'http://localhost:5000/api';

export const diseaseApi = {
  /**
   * Predict disease from image file
   */
  predict: async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE}/predict`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Prediction failed: ${response.status}`);
    }

    return response.json();
  },

  /**
   * Health check
   */
  health: async () => {
    const response = await fetch(`${API_BASE}/health`);
    return response.json();
  }
};

