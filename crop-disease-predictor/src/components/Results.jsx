import React from 'react';
import './Results.css';

function Results({ results, loading }) {
  if (loading) {
    return (
      <div className="results-section card">
        <h2>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Analysis Results
        </h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing image...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-section card">
        <h2>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          Analysis Results
        </h2>
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
          </svg>
          <p>Upload and analyze an image to see results</p>
        </div>
      </div>
    );
  }

  const isHealthy = !results.disease_detected || results.disease_name === 'Healthy';

  return (
    <div className="results-section card">
      <h2>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        Analysis Results
      </h2>
      <div className="analysis-summary">
        <div className="summary-item">
          <strong>Disease:</strong> {results.disease_name || 'Unknown Disease'}
        </div>
      </div>

      <div className="results-content">
        <div className={`status-badge ${isHealthy ? 'healthy' : 'diseased'}`}>
          <div className="status-info">
            {isHealthy ? (
              <svg className="status-icon" style={{ color: '#22c55e' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ) : (
              <svg className="status-icon" style={{ color: '#ef4444' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            )}
            <div className="status-details">
              <h3>{results.disease_name || 'Unknown'}</h3>
            </div>
          </div>
          <div className="confidence">
            <div className="confidence-value">{results.confidence || 0}%</div>
            <div className="confidence-label">Confidence</div>
          </div>
        </div>

        {!isHealthy && (
          <>
            <div className="result-section">
              <h4>Disease Detected</h4>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#ef4444', marginBottom: '0.5rem' }}>
                {results.disease_name || 'Unknown Disease'}
              </div>
            </div>

            {results.severity && (
              <div className="result-section">
                <h4>Severity Level</h4>
                <span className={`severity-badge severity-${results.severity.toLowerCase()}`}>
                  {results.severity}
                </span>
              </div>
            )}

            {results.symptoms && results.symptoms.length > 0 && (
              <div className="result-section">
                <h4>Symptoms Observed</h4>
                <ul>
                  {results.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.causes && results.causes.length > 0 && (
              <div className="result-section">
                <h4>Possible Causes</h4>
                <ul>
                  {results.causes.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.treatment && results.treatment.length > 0 && (
              <div className="result-section treatment-section">
                <h4>
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Step-by-Step Treatment Guide
                </h4>
                <ol className="treatment-steps">
                  {results.treatment.map((step, index) => (
                    <li key={index}>
                      <span className="step-number">{index + 1}</span>
                      <span className="step-content">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {results.prevention && results.prevention.length > 0 && (
              <div className="result-section prevention-section">
                <h4>
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Prevention Tips
                </h4>
                <ul>
                  {results.prevention.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Results;

