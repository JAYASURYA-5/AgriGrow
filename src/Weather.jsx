import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Weather = () => {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState({
    temp: '--',
    condition: '--',
    humidity: '--',
    wind: '--',
    image: ''
  });

  const [location, setLocation] = useState('Green Valley Farm');
  const [alertVisible, setAlertVisible] = useState(true);

  useEffect(() => {
    // Back button navigation to home
    const handleBack = () => {
      navigate('/');
    };

    document.querySelectorAll('.ag-back').forEach((b) => {
      b.addEventListener('click', handleBack);
    });

    // Initialize weather data
    initWeather();

    // Refresh every 10 minutes
    const interval = setInterval(() => {
      const sel = JSON.parse(localStorage.getItem('ag_selected_location') || 'null');
      if (sel && sel.lat && sel.lon) {
        fetchWeatherByCoords(sel.lat, sel.lon);
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
          () => fetchWeatherByIP()
        );
      } else {
        fetchWeatherByIP();
      }
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  const getTimeOfDayImage = (hour, weatherCode) => {
    // Check if raining (weather codes 51-82 for drizzle, rain, showers)
    const isRaining = weatherCode >= 51 && weatherCode <= 82;
    if (isRaining) {
      return 'https://images.unsplash.com/photo-1433995306078-c32e82ef0cf1?w=1200&h=600&fit=crop&q=80'; // rain drops
    }

    // Time-based images (non-rain):
    // Morning (6 AM - 9:59 AM): sunrise
    if (hour >= 6 && hour < 10) {
      return 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&h=600&fit=crop&q=80'; // sunrise/morning field
    }
    // Afternoon (10 AM - 4:59 PM): bright noon sun
    if (hour >= 10 && hour < 17) {
      return 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&h=600&fit=crop&q=80'; // bright sunny farm
    }
    // Evening (5 PM - 7:59 PM): sunset
    if (hour >= 17 && hour < 20) {
      return 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1200&h=600&fit=crop&q=80'; // sunset colors (warm field)
    }
    // Night (8 PM - 5:59 AM): night/dark
    return 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=600&fit=crop&q=80'; // dark sky / night
  };

  const getWeatherImage = (condition, code) => {
    // Try to use time-of-day without timezone (uses browser local time as fallback)
    const hour = new Date().getHours();
    return getTimeOfDayImage(hour, code);
  };

  const setImage = (url) => {
    setWeatherData(prev => ({ ...prev, image: url }));
  };

  const updatePageFromWeather = (obj, locationName, timezone) => {
    if (!obj) return;
    const temp = Math.round(obj.temperature_2m || obj.temp || 0);
    const cond = obj.description || obj.condition || obj.conditionText || (obj.weather_code ? '' + obj.weather_code : '');
    const humidity = Math.round(obj.relative_humidity_2m || obj.humidity || 0);
    const wind = Math.round(obj.wind_speed_10m || obj.windSpeed || obj.wind || 0);

    setWeatherData({
      temp,
      condition: cond,
      humidity,
      wind,
      image: weatherData.image
    });

    setLocation(locationName || 'Green Valley Farm');

    // Use time-of-day + weather image selection (with timezone if available)
    let imgUrl;
    if (timezone) {
      try {
        const hstr = new Intl.DateTimeFormat('en-US', { hour: 'numeric', hour12: false, timeZone: timezone }).format(new Date());
        const hour = parseInt(hstr, 10);
        if (!Number.isNaN(hour)) {
          imgUrl = getTimeOfDayImage(hour, obj.weather_code);
        } else {
          imgUrl = getWeatherImage(cond || '', obj.weather_code);
        }
      } catch (e) {
        imgUrl = getWeatherImage(cond || '', obj.weather_code);
      }
    } else {
      imgUrl = getWeatherImage(cond || '', obj.weather_code);
    }
    setImage(imgUrl);

    // store for other pages
    try {
      localStorage.setItem('ag_weather', JSON.stringify({
        temp,
        condition: cond,
        humidity,
        windSpeed: wind,
        location: locationName || document.title,
        weatherCode: obj.weather_code,
        lastUpdated: new Date().toISOString()
      }));
    } catch (e) { }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&temperature_unit=celsius&timezone=auto`;
    const geoUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
      const [weatherResponse, geoResponse] = await Promise.all([
        fetch(url).then(r => r.json()),
        fetch(geoUrl).then(r => r.json()).catch(() => null)
      ]);

      const current = weatherResponse.current || weatherResponse.current_weather || {};
      let locName = 'Your Location';
      if (geoResponse && geoResponse.address) {
        const a = geoResponse.address;
        locName = a.city || a.town || a.village || a.county || geoResponse.display_name || locName;
      }

      // normalize into expected shape
      const w = {
        temperature_2m: current.temperature_2m || current.temperature || current.temp || null,
        weather_code: current.weather_code || current.weathercode || null,
        relative_humidity_2m: (current.relative_humidity_2m || current.relative_humidity || current.humidity) || null,
        wind_speed_10m: current.wind_speed_10m || current.windspeed_10m || current.windspeed_kmph || null,
        description: (current.description || current.weather || current.condition || '')
      };

      // pass timezone from Open-Meteo so image selection uses local hour
      updatePageFromWeather(w, locName, weatherResponse.timezone);
    } catch (err) {
      console.warn('fetchWeatherByCoords error', err);
      fetchWeatherByIP();
    }
  };

  const fetchWeatherByIP = async () => {
    try {
      const response = await fetch('https://wttr.in/?format=j1');
      const data = await response.json();

      const current = data.current_condition && data.current_condition[0] ? data.current_condition[0] : null;
      const location = data.nearest_area && data.nearest_area[0] ? data.nearest_area[0] : null;

      if (!current) return;

      const w = {
        temperature_2m: current.temp_C,
        weather_code: current.weatherCode,
        relative_humidity_2m: current.humidity,
        wind_speed_10m: current.windspeedKmph,
        description: current.weatherDesc && current.weatherDesc[0] ? current.weatherDesc[0].value : ''
      };

      const locName = location ? `${location.areaName[0].value}, ${location.country[0].value}` : document.title;

      // IP fallback doesn't provide timezone, so pass null
      updatePageFromWeather(w, locName, null);
    } catch (e) {
      console.warn('IP weather fetch failed', e);
    }
  };

  const initWeather = () => {
    // Prefer user-selected location
    try {
      const selRaw = localStorage.getItem('ag_selected_location');
      if (selRaw) {
        const sel = JSON.parse(selRaw);
        if (sel && sel.lat && sel.lon) {
          fetchWeatherByCoords(sel.lat, sel.lon);
          return;
        }
      }
    } catch (e) { /* ignore */ }

    // Use stored weather if recent (10 minutes)
    try {
      const stored = localStorage.getItem('ag_weather');
      if (stored) {
        const s = JSON.parse(stored);
        if (s && s.lastUpdated) {
          const age = (Date.now() - new Date(s.lastUpdated).getTime());
          if (age < 10 * 60 * 1000) {
            // use stored data
            const reconstructed = {
              temperature_2m: s.temp,
              relative_humidity_2m: s.humidity,
              wind_speed_10m: s.windSpeed,
              description: s.condition,
              weather_code: s.weatherCode
            };
            // timezone not stored in ag_weather, so pass null
            updatePageFromWeather(reconstructed, s.location || document.title, null);
            return;
          }
        }
      }
    } catch (e) { }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
        (err) => fetchWeatherByIP()
      );
    } else {
      fetchWeatherByIP();
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col dark group/design-root overflow-x-hidden">
      <div className="flex-1 pb-24">
        {/* TopAppBar */}
        <header className="sticky top-0 z-10 flex items-center bg-background-light/80 p-4 pb-2 dark:bg-background-dark/80 backdrop-blur-sm justify-between">
          <button className="flex size-12 shrink-0 items-center justify-center text-zinc-800 dark:text-white ag-back" onClick={handleBack} aria-label="Back to home">
            <span className="material-symbols-outlined text-3xl">arrow_back</span>
          </button>
          <div className="flex size-12 shrink-0 items-center text-white">
            <span className="material-symbols-outlined text-3xl text-zinc-800 dark:text-white">location_on</span>
          </div>
          <h1 className="flex-1 text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-800 dark:text-white">{location}</h1>
          <div className="flex w-12 items-center justify-end">
            <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-transparent text-zinc-800 dark:text-white gap-2 text-base font-bold leading-normal tracking-[0.015em] min-w-0 p-0">
              <span className="material-symbols-outlined text-3xl">calendar_today</span>
            </button>
          </div>
        </header>
        <main className="flex flex-col gap-4">
          {/* Current Weather Card */}
          <div className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start bg-zinc-100 dark:bg-zinc-900/50">
              <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-2 p-4 @xl:px-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-normal leading-normal text-zinc-600 dark:text-zinc-400">Current Weather</p>
                    <p className="text-5xl font-bold leading-tight tracking-tighter text-zinc-800 dark:text-white"><span>{weatherData.temp}</span>°C</p>
                    <p className="text-base text-zinc-700 dark:text-gray-300">{weatherData.condition}</p>
                  </div>
                  <div className="w-48 h-28 relative rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                    <img
                      className="absolute inset-0 w-full h-full object-cover opacity-100 transition-opacity duration-500"
                      src={weatherData.image}
                      alt="weather image"
                      style={{ display: weatherData.image ? 'block' : 'none' }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  <p className="text-base font-normal leading-normal text-zinc-600 dark:text-zinc-400">
                    Humidity: <span>{weatherData.humidity}</span>% · Wind: <span>{weatherData.wind}</span> km/h
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* ActionPanel - Alert */}
          {alertVisible && (
          <div className="px-4 @container">
            <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-amber-500/50 bg-amber-500/10 p-5 @[480px]:flex-row @[480px]:items-center">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-amber-500">warning</span>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-bold leading-tight text-zinc-800 dark:text-white">High Wind Advisory</p>
                  <p className="text-base font-normal leading-normal text-zinc-600 dark:text-zinc-400">Strong winds expected. Secure loose equipment.</p>
                </div>
              </div>
              <button className="flex h-8 min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-zinc-800 dark:bg-zinc-200 px-4 text-sm font-medium leading-normal text-white dark:text-zinc-900" onClick={() => setAlertVisible(false)}>
                <span className="truncate">Dismiss</span>
              </button>
            </div>
          </div>
          )}
          {/* SectionHeader - Hourly */}
          <h2 className="px-4 pb-0 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-800 dark:text-white">Hourly Forecast</h2>
          {/* Carousel */}
          <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden">
            <div className="flex items-stretch gap-3 px-4 py-2">
              <div className="flex h-full w-24 flex-1 flex-col items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
                <p className="text-base font-medium leading-normal text-zinc-800 dark:text-white">Now</p>
                <span className="material-symbols-outlined !text-4xl text-primary">partly_cloudy_day</span>
                <p className="text-lg font-bold leading-normal text-zinc-800 dark:text-white">24°</p>
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <span className="material-symbols-outlined !text-base">water_drop</span>
                  <p className="text-sm font-normal">10%</p>
                </div>
              </div>
              <div className="flex h-full w-24 flex-1 flex-col items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
                <p className="text-base font-medium leading-normal text-zinc-800 dark:text-white">2 PM</p>
                <span className="material-symbols-outlined !text-4xl text-zinc-600 dark:text-zinc-400">cloud</span>
                <p className="text-lg font-bold leading-normal text-zinc-800 dark:text-white">26°</p>
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <span className="material-symbols-outlined !text-base">water_drop</span>
                  <p className="text-sm font-normal">5%</p>
                </div>
              </div>
              <div className="flex h-full w-24 flex-1 flex-col items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
                <p className="text-base font-medium leading-normal text-zinc-800 dark:text-white">3 PM</p>
                <span className="material-symbols-outlined !text-4xl text-zinc-600 dark:text-zinc-400">rainy</span>
                <p className="text-lg font-bold leading-normal text-zinc-800 dark:text-white">27°</p>
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <span className="material-symbols-outlined !text-base">water_drop</span>
                  <p className="text-sm font-normal">40%</p>
                </div>
              </div>
              <div className="flex h-full w-24 flex-1 flex-col items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
                <p className="text-base font-medium leading-normal text-zinc-800 dark:text-white">4 PM</p>
                <span className="material-symbols-outlined !text-4xl text-zinc-600 dark:text-zinc-400">thunderstorm</span>
                <p className="text-lg font-bold leading-normal text-zinc-800 dark:text-white">26°</p>
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <span className="material-symbols-outlined !text-base">water_drop</span>
                  <p className="text-sm font-normal">80%</p>
                </div>
              </div>
              <div className="flex h-full w-24 flex-1 flex-col items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
                <p className="text-base font-medium leading-normal text-zinc-800 dark:text-white">5 PM</p>
                <span className="material-symbols-outlined !text-4xl text-zinc-600 dark:text-zinc-400">cloud</span>
                <p className="text-lg font-bold leading-normal text-zinc-800 dark:text-white">24°</p>
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <span className="material-symbols-outlined !text-base">water_drop</span>
                  <p className="text-sm font-normal">20%</p>
                </div>
              </div>
              <div className="flex h-full w-24 flex-1 flex-col items-center gap-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
                <p className="text-base font-medium leading-normal text-zinc-800 dark:text-white">6 PM</p>
                <span className="material-symbols-outlined !text-4xl text-zinc-600 dark:text-zinc-400">clear_night</span>
                <p className="text-lg font-bold leading-normal text-zinc-800 dark:text-white">23°</p>
                <div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400">
                  <span className="material-symbols-outlined !text-base">water_drop</span>
                  <p className="text-sm font-normal">0%</p>
                </div>
              </div>
            </div>
          </div>
          {/* SectionHeader - Daily */}
          <h2 className="px-4 pb-0 pt-4 text-lg font-bold leading-tight tracking-[-0.015em] text-zinc-800 dark:text-white">Daily Forecast</h2>
          {/* Daily Forecast List */}
          <div className="flex flex-col gap-2 px-4">
            <div className="flex items-center justify-between rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
              <p className="flex-1 text-base font-medium text-zinc-800 dark:text-white">Today</p>
              <span className="material-symbols-outlined text-2xl text-primary">partly_cloudy_day</span>
              <p className="flex-1 text-right text-base font-medium text-zinc-800 dark:text-white">28° / 18°</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
              <p className="flex-1 text-base font-medium text-zinc-800 dark:text-white">Wed</p>
              <span className="material-symbols-outlined text-2xl text-zinc-600 dark:text-zinc-400">rainy</span>
              <p className="flex-1 text-right text-base font-medium text-zinc-800 dark:text-white">25° / 17°</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
              <p className="flex-1 text-base font-medium text-zinc-800 dark:text-white">Thu</p>
              <span className="material-symbols-outlined text-2xl text-zinc-600 dark:text-zinc-400">thunderstorm</span>
              <p className="flex-1 text-right text-base font-medium text-zinc-800 dark:text-white">24° / 16°</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
              <p className="flex-1 text-base font-medium text-zinc-800 dark:text-white">Fri</p>
              <span className="material-symbols-outlined text-2xl text-zinc-600 dark:text-zinc-400">cloud</span>
              <p className="flex-1 text-right text-base font-medium text-zinc-800 dark:text-white">26° / 18°</p>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-zinc-100 dark:bg-zinc-900/50 p-4">
              <p className="flex-1 text-base font-medium text-zinc-800 dark:text-white">Sat</p>
              <span className="material-symbols-outlined text-2xl text-zinc-600 dark:text-zinc-400">sunny</span>
              <p className="flex-1 text-right text-base font-medium text-zinc-800 dark:text-white">29° / 20°</p>
            </div>
          </div>
        </main>
      </div>
      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-background-light/80 dark:border-zinc-800 dark:bg-background-dark/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md items-center justify-around px-4 py-2">
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-xs">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-primary">
            <span className="material-symbols-outlined">partly_cloudy_day</span>
            <span className="text-xs">Weather</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">grass</span>
            <span className="text-xs">Crops</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">sensors</span>
            <span className="text-xs">News</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 text-zinc-600 dark:text-zinc-400">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Weather;
