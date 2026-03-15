import React from 'react';
import { useTheme } from '../App';

const ThemeToggle = () => {
  const { theme, updateTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    updateTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.293 1.707a1 1 0 011.414-1.414l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm2 2a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707zM10 7a3 3 0 100 6 3 3 0 000-6zm-5.293-1.293a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707zM3.707 9.293a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zm2-2a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707zM9 20a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-4.293-1.707a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707zm9.586 0a1 1 0 011.414 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707zM15 13a1 1 0 011 1v1a1 1 0 110 2v-1a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
