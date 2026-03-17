import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AgriBot Assistant. How can I help you with your farm today?",
      isUser: false,
      isTyping: false
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const chatMessagesRef = useRef(null);
  const fileInputRef = useRef(null);

  // Config for API keys (would be set in environment variables in production)
  const CONFIG = {
    HUGGINGFACE_API_KEY: '',
    OPENAI_API_KEY: '',
    USER_AGENT: 'AgriBot/1.0 (https://example.com)',
    SYSTEM_PROMPT_MODE: 'simple',
    DIALECT: ''
  };

  // Load CSV data on component mount
  useEffect(() => {
    const loadCsvData = async () => {
      try {
        const response = await fetch('/Agritech.csv');
        const csvText = await response.text();
        const data = parseCSV(csvText);
        setCsvData(data);
        console.log('CSV data loaded:', data.length, 'rows');
      } catch (error) {
        console.error('Error loading CSV:', error);
      }
    };

    loadCsvData();

    // Also load CSV pages from localStorage
    try {
      const saved = localStorage.getItem('agri_csv_pages');
      if (saved) {
        const parsed = JSON.parse(saved);
        window.AGCSV = parsed;
        if (typeof AGRIBOT_KB !== 'undefined') AGRIBOT_KB.CSV_PAGES = parsed;
        console.info('Loaded CSV pages from localStorage:', parsed.length);
      }
    } catch (e) {
      console.warn('load csv from storage failed', e);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Parse CSV string to array of objects
  const parseCSV = (csvText) => {
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
  };

  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  const addMessage = (text, isUser = false) => {
    const newMessage = {
      id: Date.now(),
      text,
      isUser,
      isTyping: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addTypingIndicator = () => {
    setIsTyping(true);
    const typingMessage = {
      id: 'typing',
      text: '',
      isUser: false,
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);
  };

  const removeTypingIndicator = () => {
    setIsTyping(false);
    setMessages(prev => prev.filter(msg => msg.id !== 'typing'));
  };

  // CSV Query Functions
  const getSoilRecommendations = (state, district = null) => {
    let filtered = csvData.filter(row =>
      row.state && row.state.toLowerCase() === state.toLowerCase()
    );

    if (district) {
      filtered = filtered.filter(row =>
        row.district && row.district.toLowerCase() === district.toLowerCase()
      );
    }

    if (filtered.length === 0) return null;

    const avg = {
      soil_pH: (filtered.reduce((sum, row) => sum + (row.soil_pH || 0), 0) / filtered.length).toFixed(2),
      nitrogen_mgkg: (filtered.reduce((sum, row) => sum + (row.nitrogen_mgkg || 0), 0) / filtered.length).toFixed(2),
      phosphorus_mgkg: (filtered.reduce((sum, row) => sum + (row.phosphorus_mgkg || 0), 0) / filtered.length).toFixed(2),
      potassium_mgkg: (filtered.reduce((sum, row) => sum + (row.potassium_mgkg || 0), 0) / filtered.length).toFixed(2),
      organic_carbon_pct: (filtered.reduce((sum, row) => sum + (row.organic_carbon_pct || 0), 0) / filtered.length).toFixed(2),
    };

    const tips = [];
    if (avg.soil_pH < 6) tips.push('Soil is acidic - Consider adding lime to increase pH');
    else if (avg.soil_pH > 8) tips.push('Soil is alkaline - Add sulfur or acidifying agents');
    if (avg.nitrogen_mgkg < 200) tips.push('Low nitrogen - Apply nitrogenous fertilizers');
    if (avg.phosphorus_mgkg < 15) tips.push('Low phosphorus - Use phosphate fertilizers');
    if (avg.potassium_mgkg < 150) tips.push('Low potassium - Apply potassium-rich fertilizers');
    if (avg.organic_carbon_pct < 0.5) tips.push('Low organic matter - Add compost or manure');

    return {
      location: `${state}${district ? ', ' + district : ''}`,
      soilData: avg,
      recommendations: tips.length > 0 ? tips : ['Soil conditions are suitable for most crops']
    };
  };

  const getWeatherSummary = (state, month = null) => {
    let filtered = csvData.filter(row => row.state && row.state.toLowerCase() === state.toLowerCase());

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
  };

  const findBestCrops = (state, soilType = null) => {
    let filtered = csvData.filter(row => row.state && row.state.toLowerCase() === state.toLowerCase());

    if (soilType) {
      filtered = filtered.filter(row => row.soil_type && row.soil_type.toLowerCase() === soilType.toLowerCase());
    }

    if (filtered.length === 0) return null;

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
  };

  const handleCSVQuery = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Handle soil queries
    if (msg.includes('soil')) {
      const stateMatch = msg.match(/in\s+([a-zA-Z\s,]+)/i);
      if (stateMatch) {
        const parts = stateMatch[1].trim().split(',').map(p => p.trim());
        const result = getSoilRecommendations(parts[0], parts[1]);

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

    // Handle weather queries
    if (msg.includes('weather') || msg.includes('temperature') || msg.includes('rainfall') || msg.includes('humidity')) {
      const stateMatch = msg.match(/in\s+([a-zA-Z\s,]+)/i) || msg.match(/([A-Z][a-zA-Z\s]+)\s+(?:weather|temperature|rainfall)/i);
      const monthMatch = msg.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);

      if (stateMatch) {
        const state = stateMatch[1].trim().split(',')[0].trim();
        const month = monthMatch ? monthMatch[1] : null;
        const result = getWeatherSummary(state, month);

        if (result) {
          return `**${result.summary}**\n\n` +
            `Temperature: ${result.temperature}°C\n` +
            `Rainfall: ${result.rainfall}mm\n` +
            `Humidity: ${result.humidity}%\n` +
            `Wind Speed: ${result.windSpeed}km/h`;
        } else {
          return `I don't have weather data for ${state}${month ? ' in ' + month : ''}. Available states: Karnataka, Maharashtra, Gujarat, Madhya Pradesh, Uttar Pradesh, Bihar, Haryana, Rajasthan, Andhra Pradesh, Telangana, West Bengal, Odisha, Tamil Nadu, Punjab. Try asking for one of these!`;
        }
      }
    }

    // Handle crop/soil type queries
    if ((msg.includes('crop') || msg.includes('grow') || msg.includes('plant') || msg.includes('soil type')) && msg.includes('in')) {
      const stateMatch = msg.match(/in\s+([a-zA-Z\s,]+)/i);
      if (stateMatch) {
        const parts = stateMatch[1].trim().split(',');
        const state = parts[0].trim();
        const soilType = parts[1] ? parts[1].trim() : null;

        const result = findBestCrops(state, soilType);
        if (result) {
          let response = `**Crop & Soil Information for ${result.state}**\n\n`;
          response += `Available Soil Types:\n`;
          Object.keys(result.soilTypes).forEach(soil => {
            response += `- ${soil}: Found in ${result.soilTypes[soil]} records\n`;
          });
          response += `\nSoil Conditions Summary:\n`;
          Object.keys(result.soilConditions).slice(0, 3).forEach(soil => {
            const cond = result.soilConditions[soil];
            response += `- ${soil}: pH ${cond.avg_pH}, Avg Temp ${cond.avg_temp}°C, Rainfall ${cond.avg_rainfall}mm\n`;
          });
          return response;
        } else {
          return `I don't have crop data for ${state}. Available states: Karnataka, Maharashtra, Gujarat, Madhya Pradesh, Uttar Pradesh, Bihar, Haryana, Rajasthan, Andhra Pradesh, Telangana, West Bengal, Odisha, Tamil Nadu, Punjab. Try one of these states!`;
        }
      }
    }

    return null;
  };

  const detectIntent = (text) => {
    const t = text.toLowerCase();
    if (t.match(/\b(weather|rain|temperature|forecast|sunrise|sunset|wind|humidity)\b/)) return 'weather';
    if (t.match(/\b(price|market|price of|market price|rate per|per kg|per tonne|per ton|cost of)\b/)) return 'market';
    if (t.match(/\b(scheme|policy|subsidy|grant|government scheme|government policy|crop insurance|pm kisan|fpo)\b/)) return 'policy';
    if (t.match(/\b(plant|crop|soil|fertilizer|pest|disease|irrigation|seed|manure|harvest|yield)\b/)) return 'agri';
    return 'general';
  };

  const isPredictionRequest = (text) => {
    if (!text || typeof text !== 'string') return false;
    if (typeof AGRIBOT_KB !== 'undefined' && AGRIBOT_KB.UTILS && typeof AGRIBOT_KB.UTILS.isPredictionRequest === 'function') {
      try {
        return AGRIBOT_KB.UTILS.isPredictionRequest(text);
      } catch (e) {
        console.warn('kb prediction check failed', e);
      }
    }
    const t = text.toLowerCase();
    const predictive = /\b(will|won't|would|predict|prediction|forecast|probability|probable|chance of|chance that|likely to|what will|going to|will it|is it going to|in \d{4}|by \d{4}|next year|next month|next week|tomorrow|future|long-term outlook)\b/;
    const marketFuture = /\b(price|market|value|rate|cost)\b.*\b(will|going to|forecast|predict|by|in)\b|\b(what will the price|what will prices)\b/;
    return predictive.test(t) || marketFuture.test(t);
  };

  const handleWeatherQuery = async (text) => {
    const locMatch = text.match(/in\s+([a-zA-Z\s,\-]+)/i);
    let place = locMatch ? locMatch[1].trim() : null;
    if (!place) {
      const possible = text.match(/\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/);
      if (possible) place = possible[1];
    }

    if (!place) return 'Please tell me the location (for example: "weather in Nairobi, Kenya") so I can fetch the current forecast.';

    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`, {
        headers: { 'User-Agent': CONFIG.USER_AGENT },
        method: 'GET'
      });
      const geo = await geoRes.json();
      if (!geo || geo.length === 0) return `I couldn't find that location: ${escapeHtml(place)}. Please try a nearby town or larger region.`;
      const { lat, lon, display_name } = geo[0];

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`);
      const weatherJson = await weatherRes.json();
      if (!weatherJson || !weatherJson.current_weather) return `Unable to retrieve weather for ${escapeHtml(display_name)}.`;

      const cw = weatherJson.current_weather;
      const lines = [];
      lines.push(`Weather for ${display_name}:`);
      lines.push(`Temperature: ${cw.temperature}°C`);
      lines.push(`Wind speed: ${cw.windspeed} km/h, direction ${cw.winddirection}°`);
      lines.push(`Weather code: ${cw.weathercode} (see Open-Meteo weather codes)`);
      if (weatherJson.timezone) lines.push(`Timezone: ${weatherJson.timezone}`);

      return lines.join('\n');
    } catch (e) {
      console.warn('weather error', e);
      return 'Sorry, I could not fetch live weather right now. Please try again in a moment.';
    }
  };

  const handlePolicyQuery = async (text) => {
    const q = text;
    try {
      const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=5&namespace=0&format=json&origin=*`);
      const searchJson = await searchRes.json();
      const titles = searchJson[1] || [];
      const links = searchJson[3] || [];
      if (titles.length === 0) return `I couldn't find a direct match for "${escapeHtml(q)}". Could you provide the country or the scheme name?`;
      const top = titles[0];
      const extractRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(top)}&format=json&origin=*`);
      const exJson = await extractRes.json();
      const pages = exJson.query && exJson.query.pages;
      const page = pages && Object.values(pages)[0];
      const extract = page && page.extract ? page.extract : 'No summary available.';
      const link = links[0] || `https://en.wikipedia.org/wiki/${encodeURIComponent(top)}`;
      return `${extract}\n\nRead more: ${link}`;
    } catch (e) {
      console.warn('policy error', e);
      return 'I could not look up policy details right now; please try again later. If you tell me the country and scheme name I can provide a summary.';
    }
  };

  const handleMarketQuery = async (text) => {
    const commodityMatch = text.match(/price of ([a-zA-Z\s]+)/i) || text.match(/([a-zA-Z]+) price/i);
    const placeMatch = text.match(/in\s+([a-zA-Z\s,\-]+)/i);
    const commodity = commodityMatch ? commodityMatch[1].trim() : (commodityMatch && commodityMatch[0]) || null;
    const place = placeMatch ? placeMatch[1].trim() : null;

    if (!commodity && !place) return 'Please specify the commodity and/or location, for example: "price of maize in Kenya".';

    let reply = `Market price lookup for ${commodity ? escapeHtml(commodity) : 'the commodity'} ${place ? 'in ' + escapeHtml(place) : ''}:\n`;
    reply += '- I can fetch live prices if you configure a market-data API (FAO/WorldBank/commodities API).\n';
    reply += '- As a fallback I can search summaries on Wikipedia and provide links.\n';
    reply += 'Try providing a specific market (e.g., "Nairobi wholesale market") or enable a market API key in the config for precise up-to-date prices.';
    return reply;
  };

  const getDefaultAgriculturalResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    // Tomato specific
    if (msg.includes('tomato') || (msg.includes('plant') && msg.includes('vegetable'))) {
      return 'Tomatoes thrive in warm weather (20-30°C). Plant after last frost, ensure 6-8 hours sunlight, consistent watering, and 60-90cm spacing. For specific soil/climate data, ask "soil in [State]" or "weather in [State]".';
    }

    // Pest management
    if (msg.includes('pest') && !msg.includes('soil')) {
      return 'For pest control: Monitor crops early, practice crop rotation, maintain proper spacing, and use integrated pest management. Tell me the crop and pest type for specific advice. Ask "soil in [location]" for regional pest data.';
    }

    // Soil and fertilizer
    if (msg.includes('soil') || msg.includes('fertilizer')) {
      let answer = 'Test soil pH and nutrients regularly. Use organic matter and apply N-P-K fertilizers based on soil test results.\n\n';
      answer += 'To get your specific soil data, ask: "soil in [State]" or "soil in [State], [District]"\n\n';
      answer += 'For example: "soil in Karnataka" or "soil in Tamil Nadu, Tiruchirappalli"\n\n';
      answer += 'I can help with nitrogen, phosphorus, potassium, pH, and organic matter levels for your region.';
      return answer;
    }

    // Weather and climate
    if (msg.includes('weather') || msg.includes('rain') || msg.includes('temperature') || msg.includes('climate')) {
      return 'Weather is crucial for farming. For your region\'s data, ask: "weather in [State]" or include the month: "weather in [State], July"\n\nI can provide: Temperature, rainfall, humidity, and wind speed data for better farm planning.';
    }

    // Disease diagnosis
    if (msg.includes('disease') || msg.includes('symptom')) {
      return 'To diagnose diseases, tell me:\n1. **Crop**: What are you growing?\n2. **Symptoms**: Leaf spots, wilting, yellowing, powder, etc.\n3. **Location**: Ask "soil in [State]" for regional disease patterns\n\nYou can also upload a plant image using the "Diagnose Crop Disease" button.';
    }

    // Pest-specific
    if (msg.includes('aphid') || msg.includes('whitefly') || msg.includes('caterpillar') || msg.includes('mite')) {
      return 'Common pest solutions:\n- **Aphids/Whiteflies**: Neem oil, insecticidal soap, yellow sticky traps\n- **Caterpillars**: Bt spray, hand-picking, crop rotation\n- **Mites**: Water spray, neem oil, increase humidity\n\nFor region-specific information, ask: "soil in [State]"';
    }

    // Crop selection
    if (msg.includes('grow') || msg.includes('cultivate') || msg.includes('plant') || msg.includes('sow')) {
      return 'To choose the right crop:\n1. Check regional soil data: "soil in [State]"\n2. Check weather: "weather in [State]"\n3. Learn crop info: "crop in [State]"\n\nI can provide data for 14 Indian states to help you select suitable crops.';
    }

    // Scheme/policy/subsidy
    if (msg.includes('scheme') || msg.includes('subsidy') || msg.includes('grant') || msg.includes('policy')) {
      return 'Agricultural schemes vary by country. Tell me your country/state and I can provide details on:\n- Government subsidies\n- Loan programs\n- Crop insurance\n- PM KISAN and FPO benefits\n\nWhich state are you in?';
    }

    // Irrigation
    if (msg.includes('irrigation') || msg.includes('water') || msg.includes('watering')) {
      return 'Irrigation depends on rainfall and soil type. Check regional data:\n- "weather in [State]" - see rainfall amounts\n- "soil in [State]" - soil water-holding capacity\n\nThis helps determine irrigation frequency and amount needed.';
    }

    // Market prices
    if (msg.includes('price') || msg.includes('market') || msg.includes('sell')) {
      return 'For market information, tell me:\n1. **Crop**: What are you selling?\n2. **Location**: Which market/state?\n\nI can help with price trends and market analysis. Also check regional soil/weather data to forecast yields.';
    }

    // Generic fallback - encourage specificity
    return 'I can help with:\n\n**Soil Data**: Ask "soil in [State]" - get pH, nutrients, recommendations\n**Weather**: Ask "weather in [State]" - temperature, rainfall, humidity\n**Crops**: Ask "crop in [State]" - suitable crops for your region\n**Diseases**: Describe symptoms and crop type\n**General Advice**: About pests, fertilizers, irrigation, schemes\n\nGive me your location for the most accurate, data-driven answers!';
  };

  const queryKnowledgeBase = async (userMessage) => {
    const msg = userMessage.toLowerCase();

    try {
      const csvData = (typeof AGRIBOT_KB !== 'undefined' && AGRIBOT_KB.CSV_PAGES) ? AGRIBOT_KB.CSV_PAGES : (window.AGCSV || null);
      if (csvData && Array.isArray(csvData) && csvData.length > 0) {
        if (msg.match(/\b(list pages|show pages|available pages|what pages|list of pages)\b/)) {
          let listHtml = '<div style="display:flex;flex-direction:column;gap:6px;">';
          for (const row of csvData) {
            const title = row.title || row.name || row.page || (row[Object.keys(row)[0]] || 'Entry');
            const path = row.path || row.url || row.link || row.page || '';
            const safeTitle = escapeHtml(title.toString());
            if (path) {
              const safePath = escapeHtml(path.toString());
              listHtml += `<div><a href="${safePath}" target="_blank" rel="noopener" style="color:#0369A1">${safeTitle}</a></div>`;
            } else {
              listHtml += `<div>${safeTitle}</div>`;
            }
          }
          listHtml += '</div>';
          return { type: 'csv', html: listHtml };
        }

        for (const row of csvData) {
          for (const key of Object.keys(row)) {
            const val = (row[key] || '').toString().toLowerCase();
            if (val && msg.includes(val)) {
              const title = row.title || row.name || row.page || (row[Object.keys(row)[0]] || 'Entry');
              const path = row.path || row.url || row.link || row.page || '';
              const safeTitle = escapeHtml(title.toString());
              const safeDesc = row.description ? escapeHtml(row.description.toString()) : '';
              let html = `<div><strong>${safeTitle}</strong>`;
              if (safeDesc) html += `<div style="margin-top:6px">${safeDesc}</div>`;
              if (path) {
                const safePath = escapeHtml(path.toString());
                html += `<div style="margin-top:6px"><a href="${safePath}" target="_blank" rel="noopener" style="color:#0369A1">Open page</a></div>`;
              }
              html += `</div>`;
              return { type: 'csv', html };
            }
          }
        }
      }
    } catch (e) {
      console.warn('csv lookup error', e);
    }

    if (msg.includes('grow') || msg.includes('plant') || msg.includes('cultivat')) {
      const crops = ['tomato', 'potato', 'maize', 'corn', 'wheat', 'rice', 'banana', 'pepper', 'onion', 'cabbage'];
      for (const crop of crops) {
        if (msg.includes(crop)) {
          if (typeof AGRIBOT_KB !== 'undefined' && AGRIBOT_KB.UTILS && AGRIBOT_KB.UTILS.findCrop) {
            const info = AGRIBOT_KB.UTILS.findCrop(crop);
            if (info) {
              return `**${info.name}**\nClimate: ${info.climate}\nGrowing period: ${info.growing_period}\nSoil: ${info.soil}\nWater needed: ${info.water}\nSeason: ${info.season}`;
            }
          }
        }
      }
    }

    if (msg.includes('disease') && msg.includes('tomato')) {
      if (typeof AGRIBOT_KB !== 'undefined' && AGRIBOT_KB.UTILS && AGRIBOT_KB.UTILS.findDiseaseForCrop) {
        const diseases = AGRIBOT_KB.UTILS.findDiseaseForCrop('Tomato');
        if (diseases.length > 0) {
          let answer = 'Common tomato diseases:\n';
          diseases.slice(0, 3).forEach(d => {
            answer += `\n**${d.name}**: ${d.symptoms}\nPrevention: ${d.prevention}`;
          });
          return answer;
        }
      }
    }

    if (msg.includes('scheme') || msg.includes('subsidy')) {
      const countries = ['india', 'kenya', 'usa', 'brazil', 'europe'];
      for (const country of countries) {
        if (msg.includes(country)) {
          if (typeof AGRIBOT_KB !== 'undefined' && AGRIBOT_KB.UTILS && AGRIBOT_KB.UTILS.getSchemes) {
            const schemes = AGRIBOT_KB.UTILS.getSchemes(country);
            if (schemes) {
              let answer = `**${country.toUpperCase()} Agricultural Schemes:**\n`;
              schemes.schemes.forEach((s, i) => {
                answer += `\n${i + 1}. **${s.name}**: ${s.description}\nAmount/Eligibility: ${s.amount || 'Check eligibility'}\n`;
                if (s.link) answer += `Link: ${s.link}`;
              });
              return answer;
            }
          }
        }
      }
    }

    return null;
  };

  const callModelIfAvailable = async (userMessage) => {
    if (CONFIG.HUGGINGFACE_API_KEY) {
      try {
        const res = await fetch('https://api-inference.huggingface.co/models/gpt2', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + CONFIG.HUGGINGFACE_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: userMessage, parameters: { max_new_tokens: 150 } })
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json[0] && json[0].generated_text) return json[0].generated_text;
          if (json.generated_text) return json.generated_text;
        }
      } catch (e) {
        console.warn('hf error', e);
      }
    }

    if (CONFIG.OPENAI_API_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CONFIG.OPENAI_API_KEY },
          body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'user', content: userMessage }], max_tokens: 300 })
        });
        if (res.ok) {
          const j = await res.json();
          return j.choices?.[0]?.message?.content || null;
        }
      } catch (e) {
        console.warn('openai error', e);
      }
    }

    return null;
  };

  const callModelForAnswer = async (userText) => {
    const PROMPTS = {
      simple: `You are AgriBot, an assistant for farmers. When given a user's question, correct any grammar or spelling errors while keeping the user's meaning. If there is ambiguity, ask one short clarifying question. Give a short, clear answer in very simple language similar to the user's phrasing. Use short sentences and simple words. Include a short confidence estimate if you can.`,
      friendly: `You are AgriBot, a friendly farming assistant. Fix grammar lightly but keep the user's voice. If the question is unclear, ask one polite, brief question. Answer in a friendly, conversational tone similar to the user. Keep answers short, helpful, and actionable. Add a short confidence note.`,
      formal: `You are AgriBot, an expert agricultural assistant. Correct grammar and clarify ambiguities with one concise question. Provide a clear, structured, and accurate answer. Use precise terms and include a confidence percentage if appropriate.`
    };
    const mode = CONFIG.SYSTEM_PROMPT_MODE && PROMPTS[CONFIG.SYSTEM_PROMPT_MODE] ? CONFIG.SYSTEM_PROMPT_MODE : 'simple';
    let system = PROMPTS[mode];
    if (CONFIG.DIALECT && CONFIG.DIALECT.trim()) {
      system += `\nAdapt wording and local examples to the dialect: ${CONFIG.DIALECT}. Use locally familiar words where appropriate.`;
    }

    if (CONFIG.OPENAI_API_KEY) {
      try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CONFIG.OPENAI_API_KEY },
          body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'system', content: system }, { role: 'user', content: userText }], max_tokens: 300 })
        });
        if (res.ok) {
          const j = await res.json();
          return j.choices?.[0]?.message?.content || null;
        }
      } catch (e) {
        console.warn('openai error', e);
      }
    }

    if (CONFIG.HUGGINGFACE_API_KEY) {
      try {
        const prompt = system + '\n\nUser: ' + userText + '\n\nAnswer:';
        const res = await fetch('https://api-inference.huggingface.co/models/gpt2', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + CONFIG.HUGGINGFACE_API_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 200 } })
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json[0] && json[0].generated_text) return json[0].generated_text;
          if (json.generated_text) return json.generated_text;
        }
      } catch (e) {
        console.warn('hf error', e);
      }
    }

    return null;
  };

  const handleQuery = async (text) => {
    const intent = detectIntent(text);
    if (intent === 'weather') return await handleWeatherQuery(text);
    if (intent === 'policy') return await handlePolicyQuery(text);
    if (intent === 'market') return await handleMarketQuery(text);
    if (intent === 'agri') {
      const modelReply = await callModelIfAvailable(text);
      return modelReply || getDefaultAgriculturalResponse(text);
    }
    const model = await callModelIfAvailable(text);
    return model || getDefaultAgriculturalResponse(text);
  };

  const sendMessage = async () => {
    const userText = inputValue.trim();
    if (!userText) return;

    addMessage(userText, true);
    setInputValue('');

    if (isPredictionRequest(userText)) {
      const refusal = "I can't answer prediction questions about the future. I can provide historical data, trends, or explain possible scenarios and risks. Please ask for historical data or scenario analysis instead.";
      addMessage(refusal, false);
      return;
    }

    addTypingIndicator();

    await new Promise(r => setTimeout(r, 200));

    try {
      // First try CSV queries
      const csvAnswer = handleCSVQuery(userText);
      if (csvAnswer) {
        removeTypingIndicator();
        addMessage(csvAnswer, false);
        return;
      }

      const kbAnswer = await queryKnowledgeBase(userText);
      if (kbAnswer) {
        removeTypingIndicator();
        if (typeof kbAnswer === 'object' && kbAnswer.type === 'csv' && kbAnswer.html) {
          addMessage(kbAnswer.html.replace(/<[^>]*>/g, ''), false);
        } else if (typeof kbAnswer === 'string') {
          addMessage(kbAnswer, false);
        } else {
          addMessage(String(kbAnswer), false);
        }
        return;
      }

      const modelAvailable = CONFIG.OPENAI_API_KEY || CONFIG.HUGGINGFACE_API_KEY;
      if (modelAvailable) {
        const ans = await callModelForAnswer(userText);
        removeTypingIndicator();
        if (ans) {
          addMessage(ans, false);
          return;
        }
      }

      const reply = await handleQuery(userText);
      removeTypingIndicator();
      const combined = `You asked: "${userText}"\nAnswer: ${reply}`;
      addMessage(combined, false);
    } catch (e) {
      console.error('query error', e);
      removeTypingIndicator();
      addMessage('An error occurred while processing your request. Please try again later.', false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePromptClick = (prompt) => {
    if (prompt === 'diagnose') {
      fileInputRef.current?.click();
    } else if (prompt === 'soil') {
      setInputValue('soil health tips');
      sendMessage();
    } else if (prompt === 'market') {
      handleMarketTop3();
    }
  };

  const handleMarketTop3 = async () => {
    addMessage('Fetching top 3 high-rate crops (last 30 days)...', false);
    addTypingIndicator();
    const sample = [];
    sample.push({ crop: 'Coffee', region: 'Brazil/Ethiopia', change: '+6.2%', note: 'example data (configure market API for live prices)' });
    sample.push({ crop: 'Palm oil', region: 'Malaysia/Indonesia', change: '+4.8%', note: 'example data (configure market API for live prices)' });
    sample.push({ crop: 'Maize', region: 'USA/Argentina', change: '+3.1%', note: 'example data (configure market API for live prices)' });
    let msg = 'Top 3 (sample) — last 30 days:\n';
    sample.forEach((s, i) => { msg += `${i + 1}. ${s.crop} (${s.region}) — ${s.change} — ${s.note}\n`; });
    msg += '\nTo enable live market prices, add a market API key to the CONFIG (e.g., provider: commodities-api) or ask me to integrate a specific provider.';
    removeTypingIndicator();
    addMessage(msg, false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addMessage('Image uploaded. Analyzing...', true);

    // Display image preview
    const imageUrl = URL.createObjectURL(file);
    const imageMessage = {
      id: Date.now(),
      text: '',
      isUser: false,
      image: imageUrl
    };
    setMessages(prev => [...prev, imageMessage]);

    addTypingIndicator();
    try {
      // For now, simulate diagnosis since we don't have the actual model configured
      const diag = 'Plant diagnosis is not available because no plant diagnosis model is configured. Please add a Hugging Face API key and set CONFIG.PLANT_MODEL to a plant disease model.';
      removeTypingIndicator();
      addMessage(diag, false);
    } catch (e) {
      removeTypingIndicator();
      addMessage('Sorry, I could not analyze the image. Try again or enable a plant model in settings.', false);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="relative flex h-screen max-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      {/* Header Bar */}
      <div className="flex shrink-0 items-center border-b border-white/10 bg-background-light dark:bg-background-dark p-4">
        <button className="text-white ag-back" onClick={handleBack} aria-label="Back to home">
          <span className="material-symbols-outlined text-gray-800 dark:text-white">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 p-1">
            <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
          </div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">AgriBot Assistant</h1>
        </div>
      </div>

      {/* Chat History Area */}
      <div ref={chatMessagesRef} className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end gap-3 ${message.isUser ? 'justify-end' : ''}`}>
            {!message.isUser && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
              </div>
            )}
            <div className={`flex flex-1 flex-col items-${message.isUser ? 'end' : 'start'} gap-1`}>
              <p className={`text-[13px] font-normal leading-normal ${message.isUser ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {message.isUser ? 'You' : 'AgriBot'}
              </p>
              {message.isTyping ? (
                <div className="flex items-center gap-2 rounded-lg rounded-bl-none bg-white px-4 py-3 dark:bg-[#1A2C1B]">
                  <span className="h-2 w-2 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-primary/50"></span>
                  <span className="h-2 w-2 animate-[pulse_1.5s_ease-in-out_0.2s_infinite] rounded-full bg-primary/50"></span>
                  <span className="h-2 w-2 animate-[pulse_1.5s_ease-in-out_0.4s_infinite] rounded-full bg-primary/50"></span>
                </div>
              ) : message.image ? (
                <img src={message.image} alt="uploaded" className="max-w-xs rounded-lg" />
              ) : (
                <p className={`flex max-w-xs rounded-lg ${message.isUser ? 'rounded-br-none bg-primary' : 'rounded-bl-none bg-white dark:bg-[#1A2C1B]'} px-4 py-3 text-base font-normal leading-normal ${message.isUser ? 'text-background-dark' : 'text-gray-800 dark:text-white'}`}>
                  {message.text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="w-full shrink-0 bg-background-light p-4 dark:bg-background-dark">
        {/* Suggested Prompts */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
          <button
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-white px-4 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:bg-[#1A2C1B] dark:text-gray-300 dark:ring-white/10 dark:hover:bg-[#203a22]"
            onClick={() => handlePromptClick('soil')}
          >
            Soil Health Tips
          </button>
          <button
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-white px-4 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:bg-[#1A2C1B] dark:text-gray-300 dark:ring-white/10 dark:hover:bg-[#203a22]"
            onClick={() => handlePromptClick('diagnose')}
          >
            Diagnose Crop Disease
          </button>
          <button
            className="flex h-9 shrink-0 items-center justify-center gap-x-2 whitespace-nowrap rounded-lg bg-white px-4 text-sm font-medium text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:bg-[#1A2C1B] dark:text-gray-300 dark:ring-white/10 dark:hover:bg-[#203a22]"
            onClick={() => handlePromptClick('market')}
          >
            Market Prices
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {/* Text Input Field */}
        <div className="flex w-full items-center gap-2 rounded-xl bg-transparent p-2 ring-1 ring-inset ring-primary/30 focus-within:ring-2 focus-within:ring-primary/50">
          <input
            className="flex-1 border-0 bg-transparent text-gray-800 placeholder-gray-400 focus:ring-0 dark:text-white dark:placeholder-gray-500"
            placeholder="Ask about crops, pests, or weather..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
          />
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-background-dark transition-colors hover:bg-primary/90 active:scale-95"
            onClick={sendMessage}
          >
            <span className="material-symbols-outlined text-2xl">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
