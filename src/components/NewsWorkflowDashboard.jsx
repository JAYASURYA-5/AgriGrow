/**
 * NewsWorkflowDashboard.jsx
 * Visual representation of the News Processing Workflow
 * Shows data collection, processing, personalization, and delivery pipeline
 */

import React, { useState, useEffect } from 'react';
import { newsDataSources, processingPipeline, systemStats, newsCategories } from '../data/NewsWorkflowConfig';

const NewsWorkflowDashboard = () => {
  const [activeStage, setActiveStage] = useState('collection');
  const [animateFlow, setAnimateFlow] = useState(false);

  useEffect(() => {
    setAnimateFlow(true);
  }, []);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            AgriGrow News Workflow System
          </h1>
          <p className="text-emerald-200 text-lg max-w-3xl mx-auto">
            Real-time agricultural news collection, AI processing, and personalized delivery to farmers
          </p>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { label: 'Active Sources', value: systemStats.sourcesActive, icon: '📡' },
            { label: 'Articles Processed', value: systemStats.articlesProcessed, icon: '📰' },
            { label: 'Farmers Reached', value: systemStats.farmersReached.toLocaleString(), icon: '👨‍🌾' },
            { label: 'Update Frequency', value: systemStats.updateFrequency, icon: '⏱️' },
            { label: 'Data Accuracy', value: systemStats.dataAccuracy, icon: '✅' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-emerald-400/30 hover:border-emerald-400 transition">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-emerald-200 text-sm font-semibold">{stat.label}</div>
              <div className="text-white text-lg md:text-xl font-bold mt-1">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Main Workflow Diagram */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-emerald-400/20 mb-12 overflow-x-auto">
          {/* Data Sources */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
              <span className="text-3xl">📥</span>
              1. Data Collection from Multiple Sources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(newsDataSources).map(([key, source]) => (
                <div key={key} className="bg-gradient-to-br from-emerge-600/20 to-green-600/10 rounded-lg p-4 border border-emerald-400/30 hover:border-emerald-400 transition">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-3xl">{source.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-white">{source.name}</h3>
                      <p className="text-emerald-200 text-xs">Updates: {source.updateFrequency}</p>
                    </div>
                  </div>
                  <div className="text-emerald-100 text-xs space-y-1">
                    {source.sources.map((s, i) => (
                      <div key={i}>• {s}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Animation */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="text-emerald-300 text-2xl font-bold animate-bounce">↓</div>
              <p className="text-emerald-200 text-sm mt-2">Data flowing through pipeline...</p>
            </div>
          </div>

          {/* Processing Pipeline */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              2-5. AI Processing Pipeline
            </h2>
            <div className="space-y-3">
              {processingPipeline.stages.map((stage, idx) => (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`p-4 rounded-lg border-2 transition cursor-pointer transform hover:scale-102 ${
                    activeStage === stage.id
                      ? 'bg-emerald-500/30 border-emerald-400 shadow-lg shadow-emerald-500/50'
                      : 'bg-slate-700/30 border-slate-600 hover:border-emerald-400/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{stage.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg">{stage.name}</h3>
                        <span className="px-2 py-0.5 bg-emerald-500/50 rounded text-emerald-200 text-xs font-semibold">
                          {stage.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-emerald-200 text-sm mt-1">{stage.description}</p>
                    </div>
                    <div className="text-emerald-400 font-bold text-xl">→</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Animation */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="text-emerald-300 text-2xl font-bold animate-bounce">↓</div>
              <p className="text-emerald-200 text-sm mt-2">Ready for delivery to farmers...</p>
            </div>
          </div>

          {/* News Categories (Output) */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center gap-2">
              <span className="text-3xl">📱</span>
              6. Information Delivery & Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(newsCategories).map(([key, category]) => (
                <div key={key} className="bg-gradient-to-br from-blue-600/20 to-purple-600/10 rounded-lg p-4 border border-blue-400/30 hover:border-blue-400 transition hover:shadow-lg hover:shadow-blue-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">{category.emoji}</span>
                    <h3 className="font-bold text-white text-lg">{category.name}</h3>
                  </div>
                  <p className="text-blue-200 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow Animation */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="text-emerald-300 text-2xl font-bold animate-bounce">↓</div>
              <p className="text-emerald-200 text-sm mt-2">Personalized news delivered to each farmer...</p>
            </div>
          </div>

          {/* End User (Farmer) */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center justify-center gap-2">
              <span className="text-3xl">👨‍🌾</span>
              7. End User - Farmer
            </h2>
            <div className="bg-gradient-to-r from-emerald-600/30 via-green-600/30 to-emerald-600/30 rounded-lg p-8 border-2 border-emerald-400 shadow-lg shadow-emerald-500/50">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="text-2xl font-bold text-white mb-2">Farmer Receives Personalized Updates</h3>
              <p className="text-emerald-200 text-lg mb-4">
                Real-time, location-specific, actionable agricultural news tailored to their crops and region
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/5 rounded p-3">
                  <div className="text-2xl mb-2">📍</div>
                  <p className="text-emerald-200 text-sm font-semibold">Location-based Alerts</p>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="text-2xl mb-2">💡</div>
                  <p className="text-emerald-200 text-sm font-semibold">Actionable Insights</p>
                </div>
                <div className="bg-white/5 rounded p-3">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-emerald-200 text-sm font-semibold">Real-time Updates</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-emerald-400/20">
            <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">✨</span>
              Key Features
            </h3>
            <ul className="space-y-2 text-emerald-200">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> AI-powered duplicate detection
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Intelligent categorization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Region-based personalization
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Automated insight generation
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span> Real-time notifications
              </li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-lg p-6 border border-emerald-400/20">
            <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Benefits for Farmers
            </h3>
            <ul className="space-y-2 text-emerald-200">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">•</span> Get relevant news in seconds
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">•</span> Make informed decisions faster
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">•</span> Reduce crop losses
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">•</span> Better market timing
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400">•</span> Maximize yield & profits
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsWorkflowDashboard;
