import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Context
export const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('ag_preferences');
        const preferences = saved ? JSON.parse(saved) : { theme: 'light' };
        return preferences.theme;
    });

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');

        if (theme === 'dark') {
            root.classList.add('dark');
        } else if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                root.classList.add('dark');
            }
        } else {
            root.classList.add('light');
        }
    }, [theme]);

    const updateTheme = (newTheme) => {
        setTheme(newTheme);
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

// Auth Context
export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('ag_user');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('ag_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('ag_user');
        localStorage.removeItem('ag_selected_location');
        localStorage.removeItem('ag_weather');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
