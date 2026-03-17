import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { diseaseApi } from '../services/diseaseApi';

const Desease = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  // Load scan history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('diseaseScans');
    if (saved) {
      setScanHistory(JSON.parse(saved));
    }
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const handleFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleTakePhoto = () => {
    // For now, open file picker (camera support requires HTTPS and specific browser permissions)
    fileInputRef.current?.click();
  };

  const saveScanToHistory = (predictionData, file) => {
    const newScan = {
      id: Date.now(),
      disease: predictionData.disease_name || 'Unknown',
      isHealthy: !predictionData.disease_detected,
      date: new Date().toLocaleDateString(),
      crop: predictionData.crop_name || 'Unknown',
      confidence: predictionData.confidence || 0,
      image: imageUrl,
    };
    const updated = [newScan, ...scanHistory].slice(0, 10); // Keep last 10
    setScanHistory(updated);
    localStorage.setItem('diseaseScans', JSON.stringify(updated));
  };

  const handleSaveToLog = () => {
    if (result) {
      saveScanToHistory(result, selectedFile);
      alert('Scan saved to history!');
    }
  };

  const handleViewProducts = () => {
    // Navigate to market or products page
    navigate('/market');
  };

  const getTabContent = () => {
    if (!result) return 'No analysis available';

    const content = {
      overview: result.reason || 'Analyzing plant health...',
      symptoms: (result.symptoms || []).join('\n') || 'No symptoms data',
      treatment: (result.treatment || []).join('\n') || 'No treatment data',
    };
    return content[activeTab];
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const prediction = await diseaseApi.predict(file);
      setResult(prediction);
      
      // Auto-save successful scan
      setTimeout(() => saveScanToHistory(prediction, file), 500);
    } catch (err) {
      setError(err.message || 'Failed to analyze image. Please try again.');
      console.error('Disease prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
        <button
          className="flex size-12 shrink-0 items-center justify-center text-text-light dark:text-text-dark ag-back"
          onClick={handleBack}
          aria-label="Back to home"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>
        <h1 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
          Crop Disease Detection
        </h1>
        <div className="flex size-12 shrink-0 items-center justify-center"></div>
      </div>

      {/* Headline Text */}
      <h2 className="text-text-light dark:text-text-dark tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
        Scan your plant to identify diseases
      </h2>

      {/* Image Upload Card */}
      <div className="p-4 @container">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-black/20 p-6 shadow-sm border border-gray-200 dark:border-gray-800 gap-4">
          <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal text-center">
            Upload a clear image of the affected plant part for an instant diagnosis.
          </p>
          <div className="flex w-full items-center justify-center gap-4 pt-2">
            <button
              className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg h-24 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium leading-normal cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition"
              onClick={handleTakePhoto}
              disabled={loading}
            >
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
              <span className="truncate">Take a Photo</span>
            </button>
            <button
              className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg h-24 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium leading-normal cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition"
              onClick={handleFromGallery}
              disabled={loading}
            >
              <span className="material-symbols-outlined text-3xl">photo_library</span>
              <span className="truncate">From Gallery</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {loading && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              <span className="text-text-light dark:text-text-dark text-sm">Analyzing image...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500 text-red-600 text-sm w-full">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Results Display Card */}
      {result && (
        <>
          <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Diagnosis Results
          </h3>

          <div className="p-4 @container">
            <div className="flex flex-col items-stretch justify-start rounded-xl bg-white dark:bg-black/20 shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
              {imageUrl && (
                <div
                  className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                  data-alt="Plant image for disease detection"
                ></div>
              )}
              <div className="flex w-full grow flex-col items-stretch justify-center gap-4 p-4">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-text-light dark:text-text-dark text-xl font-bold leading-tight tracking-[-0.015em]">
                        {result.disease_name || 'Unknown Disease'}
                      </p>
                      <p className="text-text-light/70 dark:text-text-dark/70 text-sm mt-1">
                        Crop: {result.crop_name || 'Unknown'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      !result.disease_detected 
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {!result.disease_detected ? 'Healthy' : 'Disease Detected'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          result.confidence > 80 ? 'bg-green-500' :
                          result.confidence > 60 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <p className="text-text-light dark:text-text-dark text-sm font-bold leading-normal whitespace-nowrap">
                      {Math.round(result.confidence)}% Confidence
                    </p>
                  </div>
                </div>

                {result.simple_explanation && (
                  <div className="p-3 bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/30 rounded-lg">
                    <p className="text-text-light dark:text-text-dark text-sm font-medium mb-1">Easy to Understand:</p>
                    <p className="text-text-light/80 dark:text-text-dark/80 text-sm">
                      {result.simple_explanation}
                    </p>
                  </div>
                )}

                {/* Tabbed Information */}
                <div className="flex flex-col">
                  <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                      className={`px-4 py-2 text-sm font-medium transition ${
                        activeTab === 'overview'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark'
                      }`}
                      onClick={() => setActiveTab('overview')}
                    >
                      Overview
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium transition ${
                        activeTab === 'symptoms'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark'
                      }`}
                      onClick={() => setActiveTab('symptoms')}
                    >
                      Symptoms
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium transition ${
                        activeTab === 'treatment'
                          ? 'text-primary border-b-2 border-primary'
                          : 'text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark'
                      }`}
                      onClick={() => setActiveTab('treatment')}
                    >
                      Treatment
                    </button>
                  </div>
                  <div className="pt-3">
                    <div className="text-text-light dark:text-text-dark text-base font-normal leading-normal whitespace-pre-wrap">
                      {activeTab === 'overview' && (
                        <>
                          <p className="font-semibold mb-2">Reason:</p>
                          <p>{result.reason || 'No information available'}</p>
                          <p className="font-semibold mt-4 mb-2">Future Consequences:</p>
                          <p>{result.future_consequences || 'Will progress if untreated'}</p>
                        </>
                      )}
                      {activeTab === 'symptoms' && (
                        <>
                          <p className="font-semibold mb-2">Symptoms:</p>
                          {Array.isArray(result.symptoms) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {result.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          ) : (
                            <p>{result.symptoms || 'No symptoms data'}</p>
                          )}
                        </>
                      )}
                      {activeTab === 'treatment' && (
                        <>
                          <p className="font-semibold mb-2">Treatment:</p>
                          {Array.isArray(result.treatment) ? (
                            <ul className="list-disc list-inside space-y-1">
                              {result.treatment.map((t, i) => <li key={i}>{t}</li>)}
                            </ul>
                          ) : (
                            <p>{result.treatment || 'No treatment data'}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-between pt-2">
                  <button
                    className="flex min-w-[84px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary/20 dark:bg-primary/30 text-primary text-sm font-medium leading-normal hover:bg-primary/30 dark:hover:bg-primary/40 transition"
                    onClick={handleSaveToLog}
                  >
                    <span className="truncate">Save to Log</span>
                  </button>
                  <button
                    className="flex min-w-[84px] flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-medium leading-normal hover:bg-primary/90 transition"
                    onClick={handleViewProducts}
                  >
                    <span className="truncate">View Solutions</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent Scans Section */}
      {scanHistory.length > 0 && (
        <>
          <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-6">
            Recent Scans
          </h3>

          <div className="flex flex-col gap-3 px-4 pb-6">
            {scanHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl bg-white dark:bg-black/20 p-3 shadow-sm border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  // Could implement click to view full history item
                  console.log('View scan:', item);
                }}
              >
                {item.image && (
                  <div
                    className="w-16 h-16 shrink-0 bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
                    style={{ backgroundImage: `url("${item.image}")` }}
                    data-alt={`Image of ${item.disease}`}
                  ></div>
                )}
                <div className="flex flex-col flex-1">
                  <p className="text-text-light dark:text-text-dark text-base font-bold leading-tight">
                    {item.disease}
                  </p>
                  <p className={`text-sm leading-normal ${item.isHealthy
                    ? 'text-green-600 dark:text-green-400 font-medium'
                    : 'text-text-light/70 dark:text-text-dark/70'
                    }`}>
                    {item.isHealthy ? 'Healthy' : `${item.crop} • ${item.date}`}
                  </p>
                </div>
                <span className="material-symbols-outlined text-text-light/50 dark:text-text-dark/50">
                  chevron_right
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Desease;
