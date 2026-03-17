import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '@/services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored session
        const storedSession = localStorage.getItem('auth_session');
        const storedUser = localStorage.getItem('user');

        if (storedSession && storedUser) {
          setSession(JSON.parse(storedSession));
          setUser(JSON.parse(storedUser));
        }

        // Fetch current user from database
        const result = await getCurrentUser();
        if (result.success && result.user) {
          setUser(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
        } else {
          // Clear invalid session
          localStorage.removeItem('auth_session');
          localStorage.removeItem('user');
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (session, userData) => {
    setSession(session);
    setUser(userData);
    localStorage.setItem('auth_session', JSON.stringify(session));
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Call logout service
      await logoutUser(session?.id);

      // Clear state
      setUser(null);
      setSession(null);
      localStorage.removeItem('auth_session');
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
