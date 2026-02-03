import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from './Contexts';

import Home from './Home';
import News from './News';
import Wea from './wea.jsx';
import Market from './Market';
import Analysis from './Analysis';
import Chatbot from './Chatbot';
import Desease from './Desease';
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
import Fin from './fin.jsx';
import Cal from './cal.jsx';
import Login from './Login';
import Signup from './Signup';

import AnimalDashboard from './components/Animal/AnimalDashboard';
import AnimalRegistration from './components/Animal/AnimalRegistration';
import HealthMonitoring from './components/Animal/HealthMonitoring';
import AnimalTracking from './components/Animal/AnimalTracking';
import FeedPlanner from './components/Animal/FeedPlanner';
import EnvironmentMonitor from './components/Animal/EnvironmentMonitor';
import AlertsSystem from './components/Animal/AlertsSystem';

function AppContent() {
  const { isAuthenticated } = useAuth();

  // Simple component to redirect if authenticated
  const AuthRoute = ({ children, redirectTo = '/' }) => {
    return isAuthenticated ? <Navigate to={redirectTo} replace /> : children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/signup" element={
          <AuthRoute>
            <Signup />
          </AuthRoute>
        } />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/news" element={<News />} />
        <Route path="/wea" element={<Wea />} />
        <Route path="/market" element={<Market />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/comm" element={<Comm />} />
        <Route path="/disease" element={<Desease />} />

        {/* Animal Management Routes */}
        <Route path="/animal" element={<AnimalDashboard />} />
        <Route path="/animal/register" element={<AnimalRegistration />} />
        <Route path="/animal/health" element={<HealthMonitoring />} />
        <Route path="/animal/tracking" element={<AnimalTracking />} />
        <Route path="/animal/feed" element={<FeedPlanner />} />
        <Route path="/animal/environment" element={<EnvironmentMonitor />} />
        <Route path="/animal/alerts" element={<AlertsSystem />} />
        <Route path="/animal/disease" element={<Dp />} />

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
        <Route path="/fin" element={<Fin />} />
        <Route path="/cal" element={<Cal />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
