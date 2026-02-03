import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Analysis = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleBack = () => {
    navigate('/');
  };

  const handleUpload = () => {
    // Placeholder for upload functionality
    console.log('Upload clicked');
  };

  const handleAnalyze = () => {
    // Placeholder for analyze functionality
    console.log('Analyze clicked');
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log('Download clicked');
  };

  const analysisData = {
    overview: {
      title: "Farm Performance Overview",
      content: "Your farm has shown consistent growth over the past quarter. Key metrics include a 15% increase in yield, improved soil health indicators, and successful implementation of sustainable practices."
    },
    trends: {
      title: "Market Trends Analysis",
      content: "Current market trends show increasing demand for organic produce. Local prices for tomatoes have risen 8% in the last month, while corn prices remain stable."
    },
    recommendations: {
      title: "AI Recommendations",
      content: "Based on your data, we recommend increasing irrigation efficiency by 20% and adopting precision farming techniques. Consider diversifying crops to include more high-value vegetables."
    }
  };

  const getTabContent = () => {
    return analysisData[activeTab] || analysisData.overview;
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
          Farm Analysis
        </h1>
        <div className="flex size-12 shrink-0 items-center justify-center"></div>
      </div>

      {/* Upload Section */}
      <div className="p-4 @container">
        <div className="flex flex-col items-center justify-center rounded-xl bg-white dark:bg-black/20 p-6 shadow-sm border border-gray-200 dark:border-gray-800 gap-4">
          <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal text-center">
            Upload your farm data for comprehensive analysis and insights.
          </p>
          <button
            className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg h-24 bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium leading-normal cursor-pointer"
            onClick={handleUpload}
          >
            <span className="material-symbols-outlined text-3xl">upload_file</span>
            <span className="truncate">Upload Data</span>
          </button>
        </div>
      </div>

      {/* Analysis Tabs */}
      <div className="px-4">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-light/70 dark:text-text-dark/70'
              }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'trends'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-light/70 dark:text-text-dark/70'
              }`}
            onClick={() => setActiveTab('trends')}
          >
            Trends
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'recommendations'
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-light/70 dark:text-text-dark/70'
              }`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
        </div>

        {/* Analysis Content */}
        <div className="bg-white dark:bg-black/20 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 mb-4">
          <h3 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight mb-2">
            {getTabContent().title}
          </h3>
          <p className="text-text-light dark:text-text-dark text-base font-normal leading-normal">
            {getTabContent().content}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary text-white text-sm font-medium leading-normal"
          onClick={handleAnalyze}
        >
          <span className="material-symbols-outlined">analytics</span>
          Run Analysis
        </button>
        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-primary/20 dark:bg-primary/30 text-primary text-sm font-medium leading-normal"
          onClick={handleDownload}
        >
          <span className="material-symbols-outlined">download</span>
          Download Report
        </button>
      </div>
    </div>
  );
};

export default Analysis;
