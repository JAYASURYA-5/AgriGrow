import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, AuthProvider, useAuth } from './Contexts';

// Eagerly load critical pages
import Home from './Home';
import Login from './Login';
import Signup from './Signup';

// Lazy load non-critical components
const News = React.lazy(() => import('./News'));
const Wea = React.lazy(() => import('./wea.jsx'));
const Market = React.lazy(() => import('./Market'));
const Analysis = React.lazy(() => import('./Analysis'));
const Chatbot = React.lazy(() => import('./Chatbot'));
const Desease = React.lazy(() => import('./Desease'));
const Page = React.lazy(() => import('./page.tsx'));
const Scheme = React.lazy(() => import('./Scheme'));
const Settings = React.lazy(() => import('./Settings'));
const Upload = React.lazy(() => import('./Upload'));
const UserProfile = React.lazy(() => import('./UserProfile'));
const Intercrop = React.lazy(() => import('./Intercrop.jsx'));
const Quc = React.lazy(() => import('./quc.tsx'));
const Eco = React.lazy(() => import('./eco.jsx'));
const Dp = React.lazy(() => import('./dp.jsx'));
const Comm = React.lazy(() => import('./comm.jsx'));
const Fin = React.lazy(() => import('./fin.jsx'));
const Cal = React.lazy(() => import('./cal.jsx'));
const LivestockApp = React.lazy(() => import('./LivestockApp/LivestockApp'));

// Loading fallback component
const LoadingFallback = () => <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!isAuthenticated ? <Signup /> : <Navigate to="/" replace />} />
        <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/news" element={<Suspense fallback={<LoadingFallback />}><News /></Suspense>} />
        <Route path="/wea" element={<Suspense fallback={<LoadingFallback />}><Wea /></Suspense>} />
        <Route path="/market" element={<Suspense fallback={<LoadingFallback />}><Market /></Suspense>} />
        <Route path="/analysis" element={<Suspense fallback={<LoadingFallback />}><Analysis /></Suspense>} />
        <Route path="/chatbot" element={<Suspense fallback={<LoadingFallback />}><Chatbot /></Suspense>} />
        <Route path="/comm" element={<Suspense fallback={<LoadingFallback />}><Comm /></Suspense>} />
        <Route path="/disease" element={<Suspense fallback={<LoadingFallback />}><Desease /></Suspense>} />
        <Route path="/lms" element={<Suspense fallback={<LoadingFallback />}><Page /></Suspense>} />
        <Route path="/courses" element={<Suspense fallback={<LoadingFallback />}><Page /></Suspense>} />
        <Route path="/playlists" element={<Suspense fallback={<LoadingFallback />}><Page /></Suspense>} />
        <Route path="/favorites" element={<Suspense fallback={<LoadingFallback />}><Page /></Suspense>} />
        <Route path="/scheme" element={<Suspense fallback={<LoadingFallback />}><Scheme /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<LoadingFallback />}><Settings /></Suspense>} />
        <Route path="/upload" element={<Suspense fallback={<LoadingFallback />}><Upload /></Suspense>} />
        <Route path="/userprofile" element={<Suspense fallback={<LoadingFallback />}><UserProfile /></Suspense>} />
        <Route path="/quc" element={<Suspense fallback={<LoadingFallback />}><Quc /></Suspense>} />
        <Route path="/intercrop" element={<Suspense fallback={<LoadingFallback />}><Intercrop /></Suspense>} />
        <Route path="/eco/*" element={<Suspense fallback={<LoadingFallback />}><Eco /></Suspense>} />
        <Route path="/dp" element={<Suspense fallback={<LoadingFallback />}><Dp /></Suspense>} />
        <Route path="/page" element={<Suspense fallback={<LoadingFallback />}><Page /></Suspense>} />
        <Route path="/fin" element={<Suspense fallback={<LoadingFallback />}><Fin /></Suspense>} />
        <Route path="/cal" element={<Suspense fallback={<LoadingFallback />}><Cal /></Suspense>} />
        <Route path="/Livestock/*" element={<Suspense fallback={<LoadingFallback />}><LivestockApp /></Suspense>} />
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
