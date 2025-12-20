import React, { useState } from 'react';
import ImageUpload from '../crop-disease-predictor/src/components/ImageUpload.jsx';
import Results from '../crop-disease-predictor/src/components/Results.jsx';
import { analyzeDisease } from '../crop-disease-predictor/src/services/api';
import './App.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const prediction = await analyzeDisease(selectedImage);
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
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
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
        <div className="header-content">
          <svg className="leaf-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
          <h1>Crop Disease Predictor</h1>
        </div>
        <p>Upload a crop image to detect diseases and get treatment recommendations</p>
      </header>

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
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        <Results results={results} loading={loading} />
      </main>

      </div>
    </div>
  );
}

export default App;

