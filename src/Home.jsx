import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme, useAuth } from './Contexts';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, updateTheme } = useTheme();

  const [weatherData, setWeatherData] = useState({
    temp: 24,
    condition: 'Sunny',
    humidity: 65,
    windSpeed: 10,
    rain: 'Clear skies today',
    location: 'Farm Location Weather',
    weatherCode: 0,
    timezone: null,
    cityName: 'Loading...'
  });
  const [userName, setUserName] = useState('Alex');
  const [greeting, setGreeting] = useState('Good Morning');
  const [userFarm, setUserFarm] = useState('Ooty');
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [locationStatus, setLocationStatus] = useState('');

  // Image Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const agriImages = [
    'https://images.unsplash.com/photo-1625246333195-bf404ec83659?q=80&w=1000&auto=format&fit=crop', // Tractor/Field
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000&auto=format&fit=crop', // Green Field
    'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1000&auto=format&fit=crop', // Farmer
    'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=1000&auto=format&fit=crop', // Crops
    'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1000&auto=format&fit=crop'  // Wheat
  ];

  const [isLoadingWeather, setIsLoadingWeather] = useState(true);

  // Auto-switch images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % agriImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      setUserName(user.name || 'Alex');
      if (user.location && user.location.lat && user.location.lon) {
        fetchWeatherByCoords(user.location.lat, user.location.lon);
      } else {
        fetchWeather();
      }
      updateGreeting(user.timezone);
    } else {
      fetchWeather();
      updateGreeting();
    }

    // Refresh weather every 10 minutes
    const interval = setInterval(() => {
      if (user?.location?.lat) {
        fetchWeatherByCoords(user.location.lat, user.location.lon);
      } else {
        fetchWeather();
      }
    }, 600000);
    return () => clearInterval(interval);
  }, [user]);

  const updateGreeting = (timezone = null) => {
    let hour = new Date().getHours();
    if (timezone) {
      try {
        const hstr = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          hour12: false,
          timeZone: timezone
        }).format(new Date());
        hour = parseInt(hstr, 10);
        if (Number.isNaN(hour)) hour = new Date().getHours();
      } catch (e) {
        hour = new Date().getHours();
      }
    }

    let greet = 'Good Morning';
    if (hour >= 5 && hour < 12) greet = 'Good Morning';
    else if (hour >= 12 && hour < 17) greet = 'Good Afternoon';
    else if (hour >= 17 && hour < 21) greet = 'Good Evening';
    else greet = 'Good Night';

    setGreeting(greet);
  };

  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Heavy Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Hail',
      99: 'Thunderstorm with Hail'
    };
    return weatherCodes[code] || 'Unknown';
  };

  const fetchWeather = () => {
    try {
      const sel = localStorage.getItem('ag_selected_location');
      if (sel) {
        const loc = JSON.parse(sel);
        if (loc && loc.lat && loc.lon) {
          fetchWeatherByCoords(loc.lat, loc.lon);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse selected location:', e);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error);
          fetchWeatherByIP();
        }
      );
    } else {
      fetchWeatherByIP();
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&temperature_unit=celsius&timezone=auto`;
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const [weatherResponse, geoResponse] = await Promise.all([
        fetch(url).then(r => r.json()),
        fetch(geoUrl).then(r => r.json()).catch(() => null)
      ]);

      let locationName = 'Your Farm';
      if (geoResponse && geoResponse.address) {
        const addr = geoResponse.address;
        locationName = addr.city || addr.town || addr.village || addr.county || 'Your Farm';
      }

      updateWeatherUI(weatherResponse.current, weatherResponse.timezone, locationName, lat, lon);
    } catch (error) {
      console.log('Weather API error:', error);
      fetchWeatherByIP();
    }
  };

  const fetchWeatherByIP = async () => {
    const url = 'https://wttr.in/?format=j1';

    try {
      const response = await fetch(url);
      const data = await response.json();
      const current = data.current_condition[0];
      const location = data.nearest_area[0];

      const weatherData = {
        temperature_2m: current.temp_C,
        weather_code: current.weatherCode,
        relative_humidity_2m: current.humidity,
        wind_speed_10m: current.windspeedKmph,
        description: current.weatherDesc[0].value
      };

      const locationName = location ? `${location.areaName[0].value}, ${location.country[0].value}` : 'Your Location';
      updateWeatherUI(weatherData, null, locationName, null, null);
    } catch (error) {
      console.log('Weather API fallback error:', error);
    }
  };

  const updateWeatherUI = (data, timezone, locationName, lat, lon) => {
    const temp = Math.round(data.temperature_2m);
    const condition = data.description || getWeatherDescription(data.weather_code);
    const humidity = Math.round(data.relative_humidity_2m);
    const windSpeed = Math.round(data.wind_speed_10m);

    let rainText = 'Clear weather';
    if (data.weather_code >= 51 && data.weather_code <= 67) {
      rainText = '🌧️ Rain expected today';
    } else if (data.weather_code >= 71 && data.weather_code <= 86) {
      rainText = '❄️ Snow/Mix expected';
    } else if (data.weather_code >= 95 && data.weather_code <= 99) {
      rainText = '⛈️ Thunderstorm alert';
    } else if (data.weather_code >= 45 && data.weather_code <= 48) {
      rainText = '🌫️ Foggy conditions';
    } else {
      rainText = '✅ No rain expected';
    }

    setWeatherData({
      temp,
      condition,
      humidity,
      windSpeed,
      rain: rainText,
      location: `${locationName} Farm Location`,
      weatherCode: data.weather_code,
      timezone,
      cityName: locationName
    });

    setIsLoadingWeather(false);

    if (timezone) {
      // Just formatting hour if needed for other logic, but image logic is removed
    }

    updateGreeting(timezone);

    // Store weather data
    localStorage.setItem('ag_weather', JSON.stringify({
      temp,
      condition,
      humidity,
      windSpeed,
      location: locationName,
      weatherCode: data.weather_code,
      lastUpdated: new Date().toISOString()
    }));
  };

  const handleProfileClick = () => {
    navigate('/userprofile');
  };

  const handleNotificationsClick = () => {
    // Handle notifications
  };

  const handleLocationSave = async () => {
    const query = locationInput.trim();
    if (!query) {
      setLocationStatus('Please enter a location.');
      return;
    }

    setLocationStatus('Searching…');
    const results = await geocodeLocationName(query);

    if (!results || results.length === 0) {
      setLocationStatus('Location not found. Try a more specific query.');
      return;
    }

    if (results.length === 1) {
      const r = results[0];
      const obj = { name: r.display_name, lat: parseFloat(r.lat), lon: parseFloat(r.lon) };
      localStorage.setItem('ag_selected_location', JSON.stringify(obj));
      setLocationStatus('Location saved. Updating weather…');
      setLocationModalOpen(false);
      fetchWeatherByCoords(obj.lat, obj.lon);
      return;
    }

    setLocationSuggestions(results);
    setLocationStatus(`Found ${results.length} matches — tap the correct one.`);
  };

  const geocodeLocationName = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(query)}&limit=5`;
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Arigrow-App'
        }
      });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.warn('Geocode error', e);
      return [];
    }
  };

  const handleSuggestionClick = (result) => {
    const obj = { name: result.display_name, lat: parseFloat(result.lat), lon: parseFloat(result.lon) };
    localStorage.setItem('ag_selected_location', JSON.stringify(obj));
    setLocationStatus('Location saved. Updating weather…');
    setLocationSuggestions([]);
    setLocationModalOpen(false);
    fetchWeatherByCoords(obj.lat, obj.lon);
  };

  const handleChatClick = () => {
    navigate('/chatbot');
  };

  const handleMarketClick = () => {
    navigate('/analysis');
  };

  const getTempColor = (temp) => {
    if (temp < 0) return '#3B82F6';
    if (temp < 15) return '#10B981';
    if (temp < 25) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="relative flex min-h-screen min-w-full flex-col bg-[#f8fdf7] dark:bg-background-dark text-black dark:text-white overflow-x-hidden">
      {/* Top App Bar */}
      <div className="relative flex items-center bg-[#f8fdf7] dark:bg-background-dark p-3 pb-2 sticky top-0 z-10 border-b border-white/10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button onClick={handleProfileClick} className="flex shrink-0 items-center hover:scale-105 transition-transform duration-150" aria-label="Open profile">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-12 h-12 ring-2 ring-primary/50 hover:ring-primary transition-all duration-200 border-2 border-white dark:border-background-dark"
              style={{ backgroundImage: `url("${user?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}")` }}
            ></div>
          </button>
          <h2 className="text-black dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Arigrow</h2>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 hover:scale-110 p-0"
            aria-label="Toggle Theme"
          >
            <span className="material-symbols-outlined text-2xl">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <button onClick={handleNotificationsClick} className="flex shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 w-10 bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 transition-all duration-200 hover:scale-110 p-0" aria-label="Notifications">
            <span className="material-symbols-outlined text-2xl">notifications</span>
          </button>
        </div>
      </div>

      {/* Location Editor Modal */}
      {locationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-[#0f2716] p-4 mx-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-black dark:text-white">Set Location</h3>
              <button onClick={() => setLocationModalOpen(false)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800">✕</button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Enter a place name or coordinates (city, village, or address). The selected location will be used across the site until changed.</p>
            <input
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="w-full rounded-md p-2 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#08160b] text-black dark:text-white"
              placeholder="e.g. Nairobi, Kenya or 1.2921,36.8219"
            />
            {locationSuggestions.length > 0 && (
              <div className="mt-2 max-h-40 overflow-auto rounded-md bg-white/95 dark:bg-[#08160b]/95 border border-gray-100 dark:border-gray-700 p-2 text-sm">
                {locationSuggestions.map((result, index) => (
                  <div
                    key={index}
                    className="py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded"
                    onClick={() => handleSuggestionClick(result)}
                  >
                    {result.display_name}
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center justify-end gap-2 mt-3">
              <button onClick={() => setLocationModalOpen(false)} className="px-3 py-2 rounded-md bg-white/50 dark:bg-white/5 text-sm">Cancel</button>
              <button onClick={handleLocationSave} className="px-3 py-2 rounded-md bg-primary text-[#112212] text-sm font-semibold">Save</button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{locationStatus}</p>
          </div>
        </div>
      )}

      {/* Headline Text */}
      <h1 className="text-black dark:text-white tracking-light text-[32px] font-bold leading-tight px-4 text-left pb-0 pt-0 animate-fade-in-down">
        {greeting}, <span className="text-primary">{userName}</span>!
      </h1>

      {/* Main Weather Card */}
      <div className="px-4 pb-4 -mt-2 animate-slide-in-up">
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent dark:from-[#2a5c32] dark:via-[#1f4820] dark:to-[#19341b] p-4 hover:shadow-2xl hover:from-white/10 hover:to-transparent dark:hover:from-[#3a7c42] dark:hover:to-[#2a5c32] transition-all duration-300 border border-white/20 dark:border-white/10 group hover:scale-[1.02]">
          {/* Weather Image */}
          <div className="w-full bg-center bg-no-repeat aspect-video bg-cover relative overflow-hidden">
            {isLoadingWeather && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            {/* Carousel Image */}
            <img
              key={currentImageIndex} // Key forces re-render for animation
              src={agriImages[currentImageIndex]}
              alt="Agriculture Background"
              className="absolute top-6 right-4 bottom-4 left-4 w-[calc(100%-32px)] h-[calc(100%-32px)] object-cover rounded-lg animate-fade-in-down transition-all duration-1000"
            />
          </div>

          {/* Weather Info */}
          <div className="flex flex-col gap-4 p-4">
            {/* Location Header */}
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl animate-pulse">location_on</span>
              <p className="text-gray-600 dark:text-gray-300 text-sm font-bold uppercase tracking-wider">{weatherData.cityName || 'Your Farm'}</p>
            </div>

            {/* Main Weather Display - Large */}
            <div className="flex flex-col gap-1">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-normal">Current Weather</p>
              <div className="flex items-baseline gap-3">
                <p className="text-black dark:text-white text-5xl font-bold leading-tight" style={{ color: getTempColor(weatherData.temp) }}>
                  {weatherData.temp}°C
                </p>
              </div>
              <p className="text-black dark:text-white text-lg font-semibold">{weatherData.condition}</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{weatherData.rain}</p>
            </div>

            {/* Weather Details Grid - Enhanced */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-start gap-2 bg-white/10 dark:bg-white/10 rounded-xl p-3 hover:bg-white/15 dark:hover:bg-white/15 transition-colors duration-200 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">water_drop</span>
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Humidity</p>
                </div>
                <p className="text-black dark:text-white text-2xl font-bold">{weatherData.humidity}%</p>
              </div>
              <div className="flex flex-col items-start gap-2 bg-white/10 dark:bg-white/10 rounded-xl p-3 hover:bg-white/15 dark:hover:bg-white/15 transition-colors duration-200 backdrop-blur">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">air</span>
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-medium">Wind Speed</p>
                </div>
                <p className="text-black dark:text-white text-2xl font-bold">{weatherData.windSpeed} km/h</p>
              </div>
            </div>

            {/* View Forecast Button */}
            <Link to="/wea" className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#112212] text-sm font-semibold leading-normal hover:bg-primary/90 active:scale-95 transition-all duration-200 gap-2">
              <span className="material-symbols-outlined text-lg">calendar_today</span>
              <span className="truncate">View Detailed Forecast</span>
            </Link>

          </div>
        </div>
      </div>

      {/* Alerts & Notifications */}
      <div className="px-4 pb-4">
        <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-amber-500/50 bg-gradient-to-br from-amber-500/15 to-amber-500/5 p-5 transition-all duration-300 @[480px]:flex-row @[480px]:items-center">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-amber-400 text-3xl">warning</span>
            <div className="flex flex-col gap-1">
              <p className="text-black dark:text-white text-base font-bold leading-tight">Latest update on intercrop suggestions</p>
              <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal">Check intercrop suggestions for pest control.</p>
            </div>
          </div>
          <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-[#112212] text-sm font-semibold leading-normal hover:bg-primary/90 active:scale-95 transition-all duration-200 shrink-0" onClick={() => navigate('/som')}>
            <span className="truncate">View Suggestions</span>
          </button>
        </div>
      </div>

      {/* Section Header: Live Sensor Data */}
      <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8 animate-fade-in-down">Live Sensor Data</h2>

      {/* Sensor Data Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        <div className="flex flex-col items-start justify-between gap-2 rounded-xl bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent dark:from-blue-500/15 dark:via-blue-600/10 dark:to-transparent p-4 hover:from-blue-500/20 hover:to-blue-500/5 dark:hover:from-blue-600/25 dark:hover:to-blue-500/10 transition-all duration-300 border border-blue-400/20 dark:border-blue-400/30 group cursor-pointer transform hover:scale-105">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-xl group-hover:scale-110 transition-transform">water_drop</span>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Soil Moisture</p>
          </div>
          <p className="text-black dark:text-white text-3xl font-bold group-hover:text-blue-500 transition-colors">62%</p>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Optimal</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 rounded-xl bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-transparent dark:from-orange-500/15 dark:via-orange-600/10 dark:to-transparent p-4 hover:from-orange-500/20 hover:to-orange-500/5 dark:hover:from-orange-600/25 dark:hover:to-orange-500/10 transition-all duration-300 border border-orange-400/20 dark:border-orange-400/30 group cursor-pointer transform hover:scale-105">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-500 text-xl group-hover:scale-110 transition-transform">thermostat</span>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Temperature</p>
          </div>
          <p className="text-black dark:text-white text-3xl font-bold group-hover:text-orange-500 transition-colors">24°C</p>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Optimal</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 rounded-xl bg-gradient-to-br from-cyan-500/10 via-cyan-400/5 to-transparent dark:from-cyan-500/15 dark:via-cyan-600/10 dark:to-transparent p-4 hover:from-cyan-500/20 hover:to-cyan-500/5 dark:hover:from-cyan-600/25 dark:hover:to-cyan-500/10 transition-all duration-300 border border-cyan-400/20 dark:border-cyan-400/30 group cursor-pointer transform hover:scale-105">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-500 text-xl group-hover:scale-110 transition-transform">humidity_percentage</span>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Humidity</p>
          </div>
          <p className="text-black dark:text-white text-3xl font-bold group-hover:text-cyan-500 transition-colors">68%</p>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Optimal</p>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-2 rounded-xl bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent dark:from-purple-500/15 dark:via-purple-600/10 dark:to-transparent p-4 hover:from-purple-500/20 hover:to-purple-500/5 dark:hover:from-purple-600/25 dark:hover:to-purple-500/10 transition-all duration-300 border border-purple-400/20 dark:border-purple-400/30 group cursor-pointer transform hover:scale-105">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-500 text-xl group-hover:scale-110 transition-transform">science</span>
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Soil pH</p>
          </div>
          <p className="text-black dark:text-white text-3xl font-bold group-hover:text-purple-500 transition-colors">6.8</p>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-green-500 group-hover:animate-pulse"></div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-medium">Optimal</p>
          </div>
        </div>
      </div>

      {/* Section Header: Intercrop Suggestion */}
      <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-8 animate-fade-in-down">Intercrop Suggestion</h2>

      {/* Crop Health Summary */}
      <div className="px-4 pb-4">
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-transparent dark:from-[#2a5c32] dark:via-[#1f4820] dark:to-[#19341b] p-4 hover:shadow-2xl hover:from-white/10 hover:to-transparent dark:hover:from-[#3a7c42] dark:hover:to-[#2a5c32] transition-all duration-300 border border-white/20 dark:border-white/10 group hover:scale-[1.02]">
          <div className="flex justify-between items-center">
            <p className="text-black dark:text-white font-bold text-lg">Crop Health</p>
            <Link to="/intercrop" className="text-primary text-sm font-semibold hover:text-primary/80 hover:scale-105 transition-all duration-200">View Report</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative size-20">
              <svg className="size-full group-hover:scale-110 transition-transform" height="36" viewBox="0 0 36 36" width="36" xmlns="http://www.w3.org/2000/svg">
                <circle className="stroke-current text-gray-300 dark:text-gray-700" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                <circle className="stroke-current text-primary animate-pulse-glow" cx="18" cy="18" fill="none" r="16" strokeDasharray="100" strokeDashoffset="8" strokeWidth="3" transform="rotate(-90 18 18)"></circle>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">92%</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">Your crops are in excellent condition. Minimal stress detected across all zones.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Header: Quick Actions */}
      <div className="flex items-center justify-between px-4 pt-8 pb-3">
        <h2 className="text-black dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] animate-fade-in-down">Quick Actions</h2>
        <button onClick={handleChatClick} aria-label="Open Chat" className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-[#112212] hover:scale-110 active:scale-95 transition-all duration-200 z-20" title="Chat with AgroAI">
          <span className="material-symbols-outlined text-lg">support_agent</span>
        </button>
      </div>

      {/* Quick Actions Panel */}
      <div className="grid grid-cols-3 gap-4 px-4 pb-24">
        <Link to="/lms" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-indigo-400/10 to-transparent dark:from-indigo-600/25 dark:via-indigo-500/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-indigo-500/30 hover:to-indigo-400/10 dark:hover:from-indigo-600/35 dark:hover:to-indigo-500/20 transition-all duration-300 active:scale-95 border border-indigo-400/30 dark:border-indigo-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-indigo-500 group-hover:scale-125 transition-transform">school</span>
          <span className="font-semibold text-sm">LMS</span>
        </Link>
        <Link to="/dp" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-red-500/20 via-red-400/10 to-transparent dark:from-red-600/25 dark:via-red-500/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-red-500/30 hover:to-red-400/10 dark:hover:from-red-600/35 dark:hover:to-red-500/20 transition-all duration-300 active:scale-95 border border-red-400/30 dark:border-red-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-red-500 group-hover:scale-125 transition-transform">photo_camera</span>
          <span className="font-semibold text-sm">Disease Detection</span>
        </Link>
        <Link to="/notes" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-yellow-400/20 via-yellow-300/10 to-transparent dark:from-yellow-500/25 dark:via-yellow-400/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-yellow-400/30 hover:to-yellow-300/10 dark:hover:from-yellow-500/35 dark:hover:to-yellow-400/20 transition-all duration-300 active:scale-95 border border-yellow-400/30 dark:border-yellow-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-yellow-500 group-hover:scale-125 transition-transform">note</span>
          <span className="font-semibold text-sm">Notes</span>
        </Link>
        <Link to="/scheme" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-transparent dark:from-emerald-600/25 dark:via-emerald-500/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-emerald-500/30 hover:to-emerald-400/10 dark:hover:from-emerald-600/35 dark:hover:to-emerald-500/20 transition-all duration-300 active:scale-95 border border-emerald-400/30 dark:border-emerald-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-emerald-500 group-hover:scale-125 transition-transform">policy</span>
          <span className="font-semibold text-sm">Scheme</span>
        </Link>
        <Link to="/quc" className="relative cursor-pointer flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent dark:from-amber-600/25 dark:via-amber-500/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-amber-500/30 hover:to-amber-400/10 dark:hover:from-amber-600/35 dark:hover:to-amber-500/20 transition-all duration-300 active:scale-95 border border-amber-400/30 dark:border-amber-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-amber-500 group-hover:scale-125 transition-transform">trending_up</span>
          <span className="font-semibold text-sm">Market Prices</span>
        </Link>
        <Link to="/fin" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-violet-500/20 via-violet-400/10 to-transparent dark:from-violet-600/25 dark:via-violet-500/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-violet-500/30 hover:to-violet-400/10 dark:hover:from-violet-600/35 dark:hover:to-violet-500/20 transition-all duration-300 active:scale-95 border border-violet-400/30 dark:border-violet-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-violet-500 group-hover:scale-125 transition-transform">wallet</span>
          <span className="font-semibold text-sm">Finance</span>
        </Link>
        <Link to="/cal" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-cyan-400/10 to-transparent dark:from-cyan-600/25 dark:via-cyan-500/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-cyan-500/30 hover:to-cyan-400/10 dark:hover:from-cyan-600/35 dark:hover:to-cyan-500/20 transition-all duration-300 active:scale-95 border border-cyan-400/30 dark:border-cyan-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-cyan-500 group-hover:scale-125 transition-transform">calendar_month</span>
          <span className="font-semibold text-sm">Crop Calendar</span>
        </Link>
        <Link to="/Livestock" className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-400/10 to-transparent dark:from-orange-600/25 dark:via-orange-500/15 dark:to-transparent p-4 h-28 text-black dark:text-white hover:from-orange-500/30 hover:to-orange-400/10 dark:hover:from-orange-600/35 dark:hover:to-orange-500/20 transition-all duration-300 active:scale-95 border border-orange-400/30 dark:border-orange-400/40 group hover:scale-110 hover:-translate-y-1">
          <span className="material-symbols-outlined text-5xl text-orange-500 group-hover:scale-125 transition-transform">pets</span>
          <span className="font-semibold text-sm">Livestock</span>
        </Link>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background-light dark:bg-background-dark backdrop-blur-sm border-t border-white/10 z-10">
        <div className="flex justify-around items-center h-full w-full px-2">
          <Link className="flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex-1" to="/lms">
            <span className="material-symbols-outlined bg-white dark:bg-white/20 rounded-lg p-2">school</span>
            <span className="text-xs font-medium">LMS</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex-1" to="/comm">
            <span className="material-symbols-outlined bg-white dark:bg-white/20 rounded-lg p-2">groups</span>
            <span className="text-xs font-medium">Community</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex-1" to="/eco">
            <span className="material-symbols-outlined bg-white dark:bg-white/20 rounded-lg p-2">storefront</span>
            <span className="text-xs font-medium">Market</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex-1" to="/news">
            <span className="material-symbols-outlined bg-white dark:bg-white/20 rounded-lg p-2">article</span>
            <span className="text-xs font-medium">News</span>
          </Link>
          <Link className="flex flex-col items-center justify-center gap-1 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex-1" to="/settings">
            <span className="material-symbols-outlined bg-white dark:bg-white/20 rounded-lg p-2">settings</span>
            <span className="text-xs font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
