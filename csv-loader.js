/**
 * CSV Loader for Agritech.csv
 * Parses CSV data and provides utility functions for querying soil, weather, and crop data
 */

const CSVLoader = {
  /**
   * Parse CSV string to array of objects
   */
  parseCSV: (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        const value = values[index] || '';
        // Convert numeric values
        row[header] = isNaN(value) ? value : parseFloat(value);
      });
      data.push(row);
    }
    return data;
  },

  /**
   * Load CSV from file
   */
  loadCSV: async (filePath) => {
    try {
      const response = await fetch(filePath);
      const csvText = await response.text();
      return CSVLoader.parseCSV(csvText);
    } catch (error) {
      console.error('Error loading CSV:', error);
      return [];
    }
  },

  /**
   * Get unique values for a column
   */
  getUnique: (data, column) => {
    return [...new Set(data.map(row => row[column]))].filter(v => v);
  },

  /**
   * Filter data by state/district
   */
  filterByLocation: (data, state, district = null) => {
    let filtered = data.filter(row => 
      row.state && row.state.toLowerCase() === state.toLowerCase()
    );
    
    if (district) {
      filtered = filtered.filter(row =>
        row.district && row.district.toLowerCase() === district.toLowerCase()
      );
    }
    
    return filtered;
  },

  /**
   * Get soil recommendations based on soil type and pH
   */
  getSoilRecommendations: (data, location = null) => {
    const filtered = location 
      ? CSVLoader.filterByLocation(data, location.state, location.district)
      : data;

    if (filtered.length === 0) return null;

    const avg = {
      soil_pH: (filtered.reduce((sum, row) => sum + (row.soil_pH || 0), 0) / filtered.length).toFixed(2),
      nitrogen_mgkg: (filtered.reduce((sum, row) => sum + (row.nitrogen_mgkg || 0), 0) / filtered.length).toFixed(2),
      phosphorus_mgkg: (filtered.reduce((sum, row) => sum + (row.phosphorus_mgkg || 0), 0) / filtered.length).toFixed(2),
      potassium_mgkg: (filtered.reduce((sum, row) => sum + (row.potassium_mgkg || 0), 0) / filtered.length).toFixed(2),
      organic_carbon_pct: (filtered.reduce((sum, row) => sum + (row.organic_carbon_pct || 0), 0) / filtered.length).toFixed(2),
    };

    return {
      location: location ? `${location.state}, ${location.district}` : 'Overall',
      soilData: avg,
      recommendations: CSVLoader.generateSoilTips(avg)
    };
  },

  /**
   * Generate soil improvement tips
   */
  generateSoilTips: (soilData) => {
    const tips = [];

    if (soilData.soil_pH < 6) {
      tips.push('Soil is acidic - Consider adding lime to increase pH');
    } else if (soilData.soil_pH > 8) {
      tips.push('Soil is alkaline - Add sulfur or acidifying agents');
    }

    if (soilData.nitrogen_mgkg < 200) {
      tips.push('Low nitrogen - Apply nitrogenous fertilizers');
    }

    if (soilData.phosphorus_mgkg < 15) {
      tips.push('Low phosphorus - Use phosphate fertilizers');
    }

    if (soilData.potassium_mgkg < 150) {
      tips.push('Low potassium - Apply potassium-rich fertilizers');
    }

    if (soilData.organic_carbon_pct < 0.5) {
      tips.push('Low organic matter - Add compost or manure');
    }

    return tips.length > 0 ? tips : ['Soil conditions are suitable for most crops'];
  },

  /**
   * Get weather summary for a location
   */
  getWeatherSummary: (data, state, month = null) => {
    let filtered = data.filter(row => row.state && row.state.toLowerCase() === state.toLowerCase());
    
    if (month) {
      filtered = filtered.filter(row => row.month && row.month.toLowerCase() === month.toLowerCase());
    }

    if (filtered.length === 0) return null;

    const avgTemp = (filtered.reduce((sum, row) => sum + (row.avg_temperature_C || 0), 0) / filtered.length).toFixed(1);
    const avgRainfall = (filtered.reduce((sum, row) => sum + (row.rainfall_mm || 0), 0) / filtered.length).toFixed(1);
    const avgHumidity = (filtered.reduce((sum, row) => sum + (row.humidity_pct || 0), 0) / filtered.length).toFixed(1);
    const avgWindSpeed = (filtered.reduce((sum, row) => sum + (row.wind_speed_kmh || 0), 0) / filtered.length).toFixed(1);

    return {
      state,
      month: month || 'Average',
      temperature: avgTemp,
      rainfall: avgRainfall,
      humidity: avgHumidity,
      windSpeed: avgWindSpeed,
      summary: `${state} experiences average temperature of ${avgTemp}°C, ${avgRainfall}mm rainfall, ${avgHumidity}% humidity, and ${avgWindSpeed}km/h wind speed.`
    };
  },

  /**
   * Find best crops for a location and soil type
   */
  findBestCrops: (data, state, soilType = null) => {
    let filtered = data.filter(row => row.state && row.state.toLowerCase() === state.toLowerCase());
    
    if (soilType) {
      filtered = filtered.filter(row => row.soil_type && row.soil_type.toLowerCase() === soilType.toLowerCase());
    }

    if (filtered.length === 0) return null;

    // Group by soil type to get most common ones
    const soilCounts = {};
    const soilConditions = {};

    filtered.forEach(row => {
      const soil = row.soil_type;
      soilCounts[soil] = (soilCounts[soil] || 0) + 1;
      
      if (!soilConditions[soil]) {
        soilConditions[soil] = {
          avg_pH: 0,
          avg_temp: 0,
          avg_rainfall: 0,
          count: 0
        };
      }
      soilConditions[soil].avg_pH += row.soil_pH || 0;
      soilConditions[soil].avg_temp += row.avg_temperature_C || 0;
      soilConditions[soil].avg_rainfall += row.rainfall_mm || 0;
      soilConditions[soil].count += 1;
    });

    Object.keys(soilConditions).forEach(soil => {
      const data = soilConditions[soil];
      data.avg_pH = (data.avg_pH / data.count).toFixed(2);
      data.avg_temp = (data.avg_temp / data.count).toFixed(1);
      data.avg_rainfall = (data.avg_rainfall / data.count).toFixed(1);
    });

    return {
      state,
      soilTypes: soilCounts,
      soilConditions
    };
  },

  /**
   * Get all states from CSV
   */
  getStates: (data) => {
    return CSVLoader.getUnique(data, 'state');
  },

  /**
   * Get all districts for a state
   */
  getDistricts: (data, state) => {
    return CSVLoader.getUnique(
      data.filter(row => row.state === state),
      'district'
    );
  },

  /**
   * Get all soil types
   */
  getSoilTypes: (data) => {
    return CSVLoader.getUnique(data, 'soil_type');
  },

  /**
   * Query handler for chatbot
   */
  handleQuery: (data, userMessage) => {
    const msg = userMessage.toLowerCase();

    // Handle soil queries
    if (msg.includes('soil')) {
      if (msg.includes('nitrogen') || msg.includes('phosphorus') || msg.includes('potassium')) {
        const match = msg.match(/in\s+([a-zA-Z\s,]+)/i);
        const location = match ? match[1].trim() : null;
        
        if (location) {
          const parts = location.split(',').map(p => p.trim());
          const result = CSVLoader.getSoilRecommendations(data, {
            state: parts[0],
            district: parts[1] || null
          });
          
          if (result) {
            return `**Soil Analysis for ${result.location}**\n\n` +
              `pH: ${result.soilData.soil_pH}\n` +
              `Nitrogen: ${result.soilData.nitrogen_mgkg} mg/kg\n` +
              `Phosphorus: ${result.soilData.phosphorus_mgkg} mg/kg\n` +
              `Potassium: ${result.soilData.potassium_mgkg} mg/kg\n` +
              `Organic Carbon: ${result.soilData.organic_carbon_pct}%\n\n` +
              `**Recommendations:**\n${result.recommendations.join('\n')}`;
          }
        }
      }
    }

    // Handle weather queries
    if (msg.includes('weather') || msg.includes('temperature') || msg.includes('rainfall')) {
      const stateMatch = msg.match(/in\s+([a-zA-Z\s,]+)/i) || msg.match(/([A-Z][a-zA-Z\s]+)\s+(?:weather|temperature|rainfall)/i);
      const monthMatch = msg.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
      
      if (stateMatch) {
        const state = stateMatch[1].trim().split(',')[0].trim();
        const month = monthMatch ? monthMatch[1] : null;
        const result = CSVLoader.getWeatherSummary(data, state, month);
        
        if (result) {
          return `**${result.summary}**\n\n` +
            `Temperature: ${result.temperature}°C\n` +
            `Rainfall: ${result.rainfall}mm\n` +
            `Humidity: ${result.humidity}%\n` +
            `Wind Speed: ${result.windSpeed}km/h`;
        }
      }
    }

    // Handle crop queries
    if (msg.includes('crop') || msg.includes('grow') || msg.includes('plant')) {
      const stateMatch = msg.match(/in\s+([a-zA-Z\s,]+)/i);
      if (stateMatch) {
        const parts = stateMatch[1].trim().split(',');
        const state = parts[0].trim();
        const soilType = parts[1] ? parts[1].trim() : null;
        
        const result = CSVLoader.findBestCrops(data, state, soilType);
        if (result) {
          let response = `**Crop Information for ${result.state}**\n\n`;
          response += `Available Soil Types:\n`;
          Object.keys(result.soilTypes).forEach(soil => {
            response += `- ${soil}: Found in ${result.soilTypes[soil]} records\n`;
          });
          response += `\nSoil Conditions:\n`;
          Object.keys(result.soilConditions).slice(0, 3).forEach(soil => {
            const cond = result.soilConditions[soil];
            response += `- ${soil}: pH ${cond.avg_pH}, Temp ${cond.avg_temp}°C, Rainfall ${cond.avg_rainfall}mm\n`;
          });
          return response;
        }
      }
    }

    return null;
  }
};

// Export for Node.js/module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CSVLoader;
}
