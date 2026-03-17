import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Share2, X } from 'lucide-react';

export default function WeatherDashboard() {
  const [city, setCity] = useState('Chennai');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFullDashboard, setShowFullDashboard] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const API_KEY = '4fe167c68c9a59c482151115be6cc147';

  const getWeatherEmoji = (main, desc) => {
    const mainLower = main?.toLowerCase() || '';
    const descLower = desc?.toLowerCase() || '';

    if (mainLower === 'clear') return '☀️';
    if (mainLower === 'clouds') {
      if (descLower.includes('few')) return '🌤️';
      if (descLower.includes('scattered')) return '⛅';
      return '☁️';
    }
    if (mainLower === 'rain') {
      if (descLower.includes('light')) return '🌦️';
      return '🌧️';
    }
    if (mainLower === 'drizzle') return '🌦️';
    if (mainLower === 'thunderstorm') return '⛈️';
    if (mainLower === 'snow') return '❄️';
    if (mainLower === 'mist' || mainLower === 'fog') return '🌫️';
    return '🌤️';
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!weatherRes.ok) throw new Error('City not found');

      const weatherData = await weatherRes.json();
      setWeather(weatherData);

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = await forecastRes.json();
      setForecast(forecastData);

    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
      setShowSuggestions(false);
    }
  };

  const handleCityChange = async (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length >= 2) {
      setLoadingSuggestions(true);
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=10&appid=${API_KEY}`
        );
        const data = await response.json();

        const formattedSuggestions = data.map(item => ({
          name: item.name,
          country: item.country,
          state: item.state,
          lat: item.lat,
          lon: item.lon,
          display: item.state
            ? `${item.name}, ${item.state}, ${item.country}`
            : `${item.name}, ${item.country}`
        }));

        setSuggestions(formattedSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectCity = (selectedCity) => {
    setCity(selectedCity.name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const shareWeather = () => {
    if (!weather) return;

    const shareText = `Weather in ${weather.name}: ${Math.round(weather.main.temp)}°C, ${weather.weather[0].description}`;

    if (navigator.share) {
      navigator.share({ title: 'Weather Forecast', text: shareText })
        .catch(() => copyToClipboard(shareText));
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Weather information copied to clipboard!'))
      .catch(() => alert('Unable to copy'));
  };

  const getThreeDayForecast = () => {
    if (!forecast) return [];

    const dailyData = {};
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = { temps: [], weather: item.weather[0], date: item.dt };
      }
      dailyData[date].temps.push(item.main.temp);
    });

    return Object.keys(dailyData).slice(0, 3).map(key => {
      const data = dailyData[key];
      const avgTemp = data.temps.reduce((a, b) => a + b) / data.temps.length;
      return {
        date: new Date(data.date * 1000).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric'
        }),
        avgTemp: Math.round(avgTemp),
        maxTemp: Math.round(Math.max(...data.temps)),
        minTemp: Math.round(Math.min(...data.temps)),
        weather: data.weather,
        emoji: getWeatherEmoji(data.weather.main, data.weather.description)
      };
    });
  };

  const getChartData = () => {
    if (!forecast) return [];
    return forecast.list.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      temp: item.main.temp
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 text-white p-5">
      {!showFullDashboard ? (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-light mb-5">Weather Forecast</h1>
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                value={city}
                onChange={handleCityChange}
                onKeyPress={handleKeyPress}
                onFocus={() => city.length >= 2 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search for a city..."
                className="w-full px-5 py-4 pr-12 bg-white border-2 border-slate-500/30 rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
              />
              <button
                onClick={fetchWeather}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
              </button>

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-700 border border-slate-600 rounded-xl shadow-2xl max-h-80 overflow-y-auto scrollbar-thin">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => selectCity(suggestion)}
                      className="px-5 py-3 hover:bg-slate-600 cursor-pointer transition-colors border-b border-slate-600 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-blue-400 text-xl">📍</div>
                        <div>
                          <div className="text-white font-medium">{suggestion.name}</div>
                          <div className="text-gray-400 text-sm">
                            {suggestion.state && `${suggestion.state}, `}{suggestion.country}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {loadingSuggestions && (
                <div className="absolute z-10 w-full mt-2 bg-slate-700 border border-slate-600 rounded-xl shadow-2xl p-4 text-center text-gray-400">
                  Searching cities...
                </div>
              )}

              {showSuggestions && !loadingSuggestions && suggestions.length === 0 && city.length >= 2 && (
                <div className="absolute z-10 w-full mt-2 bg-slate-700 border border-slate-600 rounded-xl shadow-2xl p-4 text-center text-gray-400">
                  No cities found
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="max-w-md mx-auto mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-center">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center text-xl">Loading...</div>
          )}

          {weather && forecast && !loading && (
            <div
              onClick={() => setShowFullDashboard(true)}
              className="max-w-xl mx-auto bg-slate-700/60 backdrop-blur-xl rounded-3xl p-10 shadow-2xl cursor-pointer hover:transform hover:-translate-y-2 transition-all"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-semibold mb-2">
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <p className="text-lg text-gray-300 capitalize">
                    {weather.weather[0].description}
                  </p>
                </div>
                <div className="text-7xl">
                  {getWeatherEmoji(weather.weather[0].main, weather.weather[0].description)}
                </div>
              </div>

              <div className="text-7xl font-bold mb-5">
                {Math.round(weather.main.temp)}°C
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 pt-8 border-t border-slate-500/30">
                {forecast.list.slice(0, 6).map((item, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-sm text-gray-400 mb-2">
                      {new Date(item.dt * 1000).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </div>
                    <div className="text-3xl mb-2">
                      {getWeatherEmoji(item.weather[0].main, item.weather[0].description)}
                    </div>
                    <div className="text-lg font-semibold">
                      {Math.round(item.main.temp)}°
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-5 text-gray-400 text-sm">
                Click to view detailed forecast
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-light">
              {weather.name}, {weather.sys.country}
            </h1>
            <div className="flex gap-3">
              <button
                onClick={shareWeather}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 border border-blue-500 text-blue-200 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
              <button
                onClick={() => setShowFullDashboard(false)}
                className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500 text-red-200 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Temperature</div>
              <div className="text-5xl mb-3">🌡️</div>
              <div className="text-4xl font-bold mb-2">{Math.round(weather.main.temp)}°C</div>
              <div className="text-sm text-gray-300">Feels like {Math.round(weather.main.feels_like)}°C</div>
            </div>

            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Wind Speed</div>
              <div className="text-5xl mb-3">💨</div>
              <div className="text-4xl font-bold mb-2">{weather.wind.speed} m/s</div>
              <div className="text-sm text-gray-300">Direction: {weather.wind.deg}°</div>
            </div>

            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Humidity</div>
              <div className="text-5xl mb-3">💧</div>
              <div className="text-4xl font-bold mb-2">{weather.main.humidity}%</div>
              <div className="text-sm text-gray-300">Moisture in air</div>
            </div>

            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Pressure</div>
              <div className="text-5xl mb-3">🔽</div>
              <div className="text-4xl font-bold mb-2">{weather.main.pressure} hPa</div>
              <div className="text-sm text-gray-300">Atmospheric pressure</div>
            </div>

            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Visibility</div>
              <div className="text-5xl mb-3">👁️</div>
              <div className="text-4xl font-bold mb-2">{(weather.visibility / 1000).toFixed(1)} km</div>
              <div className="text-sm text-gray-300">Clear visibility</div>
            </div>

            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Cloudiness</div>
              <div className="text-5xl mb-3">☁️</div>
              <div className="text-4xl font-bold mb-2">{weather.clouds.all}%</div>
              <div className="text-sm text-gray-300">Cloud coverage</div>
            </div>

            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Sunrise</div>
              <div className="text-5xl mb-3">🌅</div>
              <div className="text-4xl font-bold mb-2">{formatTime(weather.sys.sunrise)}</div>
              <div className="text-sm text-gray-300">Morning time</div>
            </div>

            <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Sunset</div>
              <div className="text-5xl mb-3">🌇</div>
              <div className="text-4xl font-bold mb-2">{formatTime(weather.sys.sunset)}</div>
              <div className="text-sm text-gray-300">Evening time</div>
            </div>
          </div>

          <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-5">3-Day Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getThreeDayForecast().map((day, idx) => (
                <div key={idx} className="bg-slate-600/40 rounded-xl p-5 text-center">
                  <div className="font-semibold mb-3">{day.date}</div>
                  <div className="text-5xl mb-3">{day.emoji}</div>
                  <div className="text-3xl font-bold mb-2">{day.avgTemp}°C</div>
                  <div className="text-sm text-gray-300 mb-2">
                    H: {day.maxTemp}° L: {day.minTemp}°
                  </div>
                  <div className="text-sm text-gray-400 capitalize">{day.weather.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-5">Today's Weather Timeline</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {forecast.list.slice(0, 8).map((item, idx) => (
                <div key={idx} className="bg-slate-600/40 rounded-xl p-4 text-center">
                  <div className="text-sm text-gray-400 mb-2">
                    {new Date(item.dt * 1000).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false
                    })}
                  </div>
                  <div className="text-3xl mb-2">
                    {getWeatherEmoji(item.weather[0].main, item.weather[0].description)}
                  </div>
                  <div className="text-xl font-semibold">{Math.round(item.main.temp)}°</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-700/60 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-5">Temperature Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <XAxis
                    dataKey="time"
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af' }}
                    domain={['dataMin - 2', 'dataMax + 2']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#334155',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value) => [`${value.toFixed(1)}°C`, 'Temperature']}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}