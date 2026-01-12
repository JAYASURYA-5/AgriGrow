import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import News from './News';
import Wea from './wea.jsx';
import Market from './Market';
import Analysis from './Analysis';
import Chatbot from './Chatbot';
import Desease from './Desease';
import Intercrop from './Intercrop';
import Page from './page.tsx';
import Scheme from './Scheme';
import Settings from './Settings';
import Upload from './Upload';
import UserProfile from './UserProfile';
import Som from './som.jsx';
import Quc from './quc.tsx';
import Eco from './eco.jsx';
import Dp from './dp.jsx';
import Comm from './comm.jsx';


// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('ag_preferences');
    const preferences = saved ? JSON.parse(saved) : { theme: 'light' };
    return preferences.theme;
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Apply current theme
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'auto') {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      }
    } else {
      // Default to light
      root.classList.add('light');
    }
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
    // Update localStorage
    const saved = localStorage.getItem('ag_preferences');
    const preferences = saved ? JSON.parse(saved) : {};
    preferences.theme = newTheme;
    localStorage.setItem('ag_preferences', JSON.stringify(preferences));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/wea" element={<Wea />} />
          <Route path="/market" element={<Market />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/comm" element={<Comm />} />
          <Route path="/disease" element={<Desease />} />
          <Route path="/intercrop" element={<Intercrop />} />
          <Route path="/lms" element={<Page />} />
          <Route path="/courses" element={<Page />} />
          <Route path="/playlists" element={<Page />} />
          <Route path="/favorites" element={<Page />} />
          <Route path="/scheme" element={<Scheme />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/quc" element={<Quc />} />
          <Route path="/som" element={<Som />} />
          <Route path="/eco/*" element={<Eco />} />
          <Route path="/dp" element={<Dp />} />
          <Route path="/page" element={<Page />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
