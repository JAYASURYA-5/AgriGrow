import React from 'react';
import './Results.css';

function Results({ results, loading, mode = 'disease' }) {
  if (loading) {
    return (
      <div className="results-section card">
        <h2>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {mode === 'soil' ? 'Soil Analysis Results' : 'Analysis Results'}
        </h2>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{mode === 'soil' ? 'Analyzing soil...' : 'Analyzing image...'}</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-section card">
        <h2>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {mode === 'soil' ? 'Soil Analysis Results' : 'Analysis Results'}
        </h2>
        <div className="empty-state">
          <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <p>{mode === 'soil' ? 'Upload soil image to identify its type' : 'Upload and analyze an image to see results'}</p>
        </div>
      </div>
    );
  }

  // Helper for safe access
  const isHealthy = mode === 'disease'
    ? (!results.disease_detected || results.disease_name === 'Healthy')
    : false;

  if (mode === 'soil') {
    return (
      <div className="results-section card">
        <h2>
          <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Soil Analysis Results
        </h2>
        <div className="analysis-summary">
          <div className="summary-item">
            <strong>Soil Type:</strong> {results.soil_type || 'Unknown'}
          </div>
        </div>

        <div className="results-content">
          <div className="status-badge" style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e' }}>
            <div className="status-info">
              <svg className="status-icon" style={{ color: '#22c55e' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <div className="status-details">
                <h3>{results.soil_type}</h3>
              </div>
            </div>
            <div className="confidence">
              <div className="confidence-value">{results.confidence || 0}%</div>
              <div className="confidence-label">Match</div>
            </div>
          </div>

          {results.common_places && results.common_places.length > 0 && (
            <div className="result-section">
              <h4>
                <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Common Geographic Locations
              </h4>
              <ul>
                {results.common_places.map((place, index) => (
                  <li key={index}>{place}</li>
                ))}
              </ul>
            </div>
          )}

          {results.soil_condition && (
            <div className="result-section" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
              <h4>Soil Condition</h4>
              <p style={{ lineHeight: '1.6', color: '#555' }}>{results.soil_condition}</p>
            </div>
          )}

          {results.water_holding_capacity && (
            <div className="result-section" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
              <h4>💧 Water Holding Capacity</h4>
              <p style={{ lineHeight: '1.6', color: '#555', fontWeight: '500' }}>{results.water_holding_capacity}</p>
            </div>
          )}

          {results.suitable_for_harvest && (
            <div className="result-section" style={{ 
              backgroundColor: results.suitable_for_harvest.status.includes('Yes') ? 'rgba(34, 197, 94, 0.05)' : 'rgba(251, 146, 60, 0.05)',
              padding: '12px',
              borderLeft: results.suitable_for_harvest.status.includes('Yes') ? '4px solid #22c55e' : '4px solid #fb923c',
              borderRadius: '4px'
            }}>
              <h4>✅ Suitable for Harvest</h4>
              <p style={{ lineHeight: '1.6', color: '#555', fontWeight: '500' }}>{results.suitable_for_harvest.status}</p>
              <p style={{ lineHeight: '1.6', color: '#666', marginTop: '8px' }}>{results.suitable_for_harvest.explanation}</p>
            </div>
          )}

          <div className="result-section">
            <h4>Characteristics</h4>
            <ul>
              {results.characteristics && results.characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h4>Composition</h4>
            <ul>
              {results.composition && results.composition.map((comp, index) => (
                <li key={index}>{comp}</li>
              ))}
            </ul>
          </div>

          <div className="result-section treatment-section">
            <h4>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
              Recommended Crops & Harvest Season
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {results.recommended_crops && results.recommended_crops.map((crop, index) => {
                const cropObj = typeof crop === 'object' ? crop : { name: crop, harvest_period: 'Season-dependent', suitable: true };
                return (
                  <div key={index} style={{
                    background: cropObj.suitable ? 'rgba(34, 197, 94, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                    color: cropObj.suitable ? '#15803d' : '#6b7280',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    borderLeft: cropObj.suitable ? '3px solid #22c55e' : '3px solid #9ca3af',
                    fontSize: '0.95rem'
                  }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{cropObj.name}</div>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>🕒 {cropObj.harvest_period}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="result-section prevention-section">
            <h4>
              <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Farming Tips & Best Practices
            </h4>
            <ul>
              {results.farming_tips && results.farming_tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-section card">
      <h2>
        <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Analysis Results
      </h2>
      <div className="analysis-summary">
        <div className="summary-item">
          <strong>🦠 Disease Detected:</strong> {results.disease_name || 'Unknown Disease'}
        </div>
      </div>

      <div className="results-content">
        <div className={`status-badge ${isHealthy ? 'healthy' : 'diseased'}`}>
          <div className="status-info">
            {isHealthy ? (
              <svg className="status-icon" style={{ color: '#22c55e' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg className="status-icon" style={{ color: '#ef4444' }} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
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


            {results.reason && (
              <div className="result-section" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', padding: '12px', borderLeft: '4px solid #3b82f6', borderRadius: '4px' }}>
                <h4>
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Why This Disease Occurred
                </h4>
                <p style={{ lineHeight: '1.6', color: '#555', fontSize: '0.95rem' }}>{results.reason}</p>
              </div>
            )}

            {results.symptoms && results.symptoms.length > 0 && (
              <div className="result-section">
                <h4>
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Symptoms Observed
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  {results.symptoms.map((symptom, index) => (
                    <li key={index} style={{ color: '#555', marginBottom: '6px' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold', color: '#ef4444' }}>•</span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.level_in_plant && (
              <div className="result-section">
                <h4>Infection Level in Plant</h4>
                <p style={{ lineHeight: '1.6', color: '#555', padding: '10px', backgroundColor: 'rgba(251, 146, 60, 0.1)', borderRadius: '6px' }}>{results.level_in_plant}</p>
              </div>
            )}

            {results.plant_part_affected && results.plant_part_affected.length > 0 && (
              <div className="result-section">
                <h4>Affected Plant Parts</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {results.plant_part_affected.map((part, index) => (
                    <span key={index} style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#991b1b',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}>
                      {part}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.severity && (
              <div className="result-section">
                <h4>Severity Level</h4>
                <span className={`severity-badge severity-${results.severity.toLowerCase()}`}>
                  {results.severity}
                </span>
              </div>
            )}

            {results.future_consequences && (
              <div className="result-section" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '12px', borderLeft: '4px solid #ef4444', borderRadius: '4px' }}>
                <h4>⚠️ Future Consequences (If Untreated)</h4>
                <p style={{ lineHeight: '1.6', color: '#555' }}>{results.future_consequences}</p>
              </div>
            )}

            {results.causes && results.causes.length > 0 && (
              <div className="result-section">
                <h4>Root Causes</h4>
                <ul style={{ lineHeight: '1.8' }}>
                  {results.causes.map((cause, index) => (
                    <li key={index} style={{ color: '#555', marginBottom: '6px' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold', color: '#3b82f6' }}>→</span>
                      {cause}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.treatment && results.treatment.length > 0 && (
              <div className="result-section treatment-section">
                <h4>
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Prevention & Precautions
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  {results.prevention.map((tip, index) => (
                    <li key={index} style={{ color: '#555', marginBottom: '6px' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold', color: '#22c55e' }}>✓</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {isHealthy && (
          <>
            <div className="result-section" style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', padding: '12px', borderLeft: '4px solid #22c55e', borderRadius: '4px' }}>
              <h4>✅ Healthy Plant Status</h4>
              <p style={{ lineHeight: '1.6', color: '#555' }}>Your {results.crop_name || 'plant'} is in excellent condition with no disease detected.</p>
            </div>

            {results.symptoms && results.symptoms.length > 0 && (
              <div className="result-section">
                <h4>
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Healthy Plant Indicators
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  {results.symptoms.map((symptom, index) => (
                    <li key={index} style={{ color: '#555', marginBottom: '6px' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold', color: '#22c55e' }}>✓</span>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.prevention && results.prevention.length > 0 && (
              <div className="result-section prevention-section">
                <h4>
                  <svg className="section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Maintenance & Care Tips
                </h4>
                <ul style={{ lineHeight: '1.8' }}>
                  {results.prevention.map((tip, index) => (
                    <li key={index} style={{ color: '#555', marginBottom: '6px' }}>
                      <span style={{ marginRight: '8px', fontWeight: 'bold', color: '#22c55e' }}>✓</span>
                      {tip}
                    </li>
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

