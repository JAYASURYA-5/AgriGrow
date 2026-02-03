import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '../crop-disease-predictor/src/components/ImageUpload.jsx';
import Results from '../crop-disease-predictor/src/components/Results.jsx';
import { analyzeDisease, analyzeSoil } from '../crop-disease-predictor/src/services/api';
import '../crop-disease-predictor/src/App.css';

function App() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('disease'); // 'disease' or 'soil'

  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setResults(null);
      setError(null);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResults(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prediction = mode === 'disease'
        ? await analyzeDisease(selectedImage)
        : await analyzeSoil(selectedImage);

      setResults(prediction);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="background-3d">
        {/* Background agriculture video (replace src with your own if desired) */}
        <div className="video-bg">
          <video
            className="bg-video"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80"
          >
            <source src="https://cdn.coverr.co/videos/coverr-green-field-1711/1080p.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="video-overlay"></div>
        </div>

        {/* Agricultural Field Pattern */}
        <div className="crop-field"></div>

        {/* Floating Leaves */}
        <div className="floating-leaves">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="leaf" style={{
              '--delay': `${i * 0.2}s`,
              '--duration': `${12 + Math.random() * 8}s`,
              '--x': `${Math.random() * 100}%`,
              '--y': `${Math.random() * 100}%`,
              '--rotation': `${Math.random() * 360}deg`,
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
          ))}
        </div>

        {/* Crop Rows Animation */}
        <div className="crop-rows">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="crop-row" style={{
              '--row-delay': `${i * 0.3}s`,
              '--row-index': i,
            }}></div>
          ))}
        </div>

        {/* Agricultural Gradient Mesh */}
        <div className="agricultural-gradient"></div>

        {/* Plant Silhouettes */}
        <div className="plant-silhouettes">
          <div className="plant plant-1"></div>
          <div className="plant plant-2"></div>
          <div className="plant plant-3"></div>
        </div>

        {/* Sun/Weather Effects */}
        <div className="sun-effect"></div>
      </div>
      <div className="content-wrapper">
        <header className="app-header">
          <button onClick={() => navigate('/')} className="back-button" aria-label="Go back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
          <div className="header-content">
            <svg className="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
            <h1>Crop Disease Predictor</h1>
          </div>
          <p>Upload a crop image to detect diseases and get treatment recommendations</p>
        </header>

        {/* Mode Toggle Switch */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '4px',
            display: 'inline-flex',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <button
              onClick={() => { setMode('disease'); setResults(null); setSelectedImage(null); }}
              style={{
                background: mode === 'disease' ? '#22c55e' : 'transparent',
                color: mode === 'disease' ? 'white' : 'white',
                border: 'none',
                padding: '8px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
              Disease Check
            </button>
            <button
              onClick={() => { setMode('soil'); setResults(null); setSelectedImage(null); }}
              style={{
                background: mode === 'soil' ? '#22c55e' : 'transparent',
                color: mode === 'soil' ? 'white' : 'white',
                border: 'none',
                padding: '8px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              Soil Analysis
            </button>
          </div>
        </div>

        <main className="main-content">
          <ImageUpload
            onImageSelect={handleImageSelect}
            imagePreview={imagePreview}
            onReset={handleReset}
            onAnalyze={handleAnalyze}
            loading={loading}
            hasImage={!!selectedImage}
          />

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          <Results results={results} loading={loading} mode={mode} />
        </main>

      </div>
    </div>
  );
}

export default App;

