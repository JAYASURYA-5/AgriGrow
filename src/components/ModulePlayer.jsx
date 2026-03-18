import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Contexts';
import '../styles/ModulePlayer.css';

/**
 * Module Player - Displays course content (video, text, infographics, tips)
 * Tracks progress, navigation between modules, and completion
 */
const ModulePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [currentModuleIdx, setCurrentModuleIdx] = useState(0);
  const [currentModule, setCurrentModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moduleProgress, setModuleProgress] = useState({});
  const [contentType, setContentType] = useState('video'); // video, text, infographics, tips
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [timeSpent, setTimeSpent] = useState(0);

  // Fetch course and modules
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lms/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (!response.ok) throw new Error('Failed to load course');
        const data = await response.json();
        
        setCourse(data.course);
        setModules(data.modules || []);
        if (data.modules && data.modules.length > 0) {
          setCurrentModule(data.modules[0]);
        }

        setError(null);
      } catch (err) {
        console.error('Course error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourseData();
  }, [courseId, user]);

  // Track time spent on module
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mark module as completed
  const handleCompleteModule = async () => {
    try {
      const response = await fetch(
        `/api/lms/progress/module/${currentModule.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'completed',
            time_spent_minutes: Math.floor(timeSpent / 60),
            notes: notes
          })
        }
      );

      if (!response.ok) throw new Error('Failed to complete module');

      setModuleProgress({
        ...moduleProgress,
        [currentModule.id]: { status: 'completed', time_spent: timeSpent }
      });

      alert('✅ Module completed! Great work!');

      // Move to next module
      if (currentModuleIdx < modules.length - 1) {
        setCurrentModuleIdx(currentModuleIdx + 1);
        setCurrentModule(modules[currentModuleIdx + 1]);
        setTimeSpent(0);
        setNotes('');
      } else {
        // Show completion message
        setTimeout(() => {
          navigate(`/lms/course/${courseId}/completion`);
        }, 1500);
      }
    } catch (err) {
      console.error('Completion error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  // Update progress as incomplete
  const handleMarkProgress = async (status) => {
    try {
      const response = await fetch(
        `/api/lms/progress/module/${currentModule.id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: status,
            time_spent_minutes: Math.floor(timeSpent / 60)
          })
        }
      );

      if (!response.ok) throw new Error('Failed to update progress');
      setModuleProgress({
        ...moduleProgress,
        [currentModule.id]: { status: status, time_spent: timeSpent }
      });
    } catch (err) {
      console.error('Progress error:', err);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  if (loading) {
    return (
      <div className="module-player loading">
        <div className="spinner"></div>
        <p>Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="module-player error">
        <div className="error-box">
          <h2>⚠️ Error Loading Module</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="module-player">
      {/* Player Header */}
      <div className="player-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
        <h2>{course?.title || 'Course'}</h2>
        <div className="header-stats">
          <span className="time-badge">⏱️ {formatTime(timeSpent)}</span>
          <span className="module-badge">Module {currentModuleIdx + 1}/{modules.length}</span>
        </div>
      </div>

      <div className="player-container">
        {/* Main Content Area */}
        <div className="content-area">
          {/* Module Title */}
          <div className="module-header">
            <h1>{currentModule?.title || 'Module'}</h1>
            <p className="module-description">{currentModule?.description}</p>
          </div>

          {/* Content Type Tabs */}
          <div className="content-tabs">
            {currentModule?.content_types?.includes('video') && (
              <button
                className={`tab-btn ${contentType === 'video' ? 'active' : ''}`}
                onClick={() => setContentType('video')}
              >
                🎥 Video
              </button>
            )}
            {currentModule?.content_types?.includes('text') && (
              <button
                className={`tab-btn ${contentType === 'text' ? 'active' : ''}`}
                onClick={() => setContentType('text')}
              >
                📄 Reading
              </button>
            )}
            {currentModule?.content_types?.includes('infographics') && (
              <button
                className={`tab-btn ${contentType === 'infographics' ? 'active' : ''}`}
                onClick={() => setContentType('infographics')}
              >
                📊 Infographics
              </button>
            )}
            {currentModule?.content_types?.includes('tips') && (
              <button
                className={`tab-btn ${contentType === 'tips' ? 'active' : ''}`}
                onClick={() => setContentType('tips')}
              >
                💡 Tips
              </button>
            )}
          </div>

          {/* Content Display */}
          <div className="content-display">
            {contentType === 'video' && currentModule?.video_url && (
              <div className="video-container">
                <video
                  controls
                  width="100%"
                  height="auto"
                  style={{ borderRadius: '8px' }}
                >
                  <source src={currentModule.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <p className="video-duration">Duration: {currentModule.duration_minutes || 0} minutes</p>
              </div>
            )}

            {contentType === 'text' && currentModule?.content && (
              <div className="text-content">
                <div dangerouslySetInnerHTML={{ __html: currentModule.content }} />
              </div>
            )}

            {contentType === 'infographics' && currentModule?.infographic_urls && (
              <div className="infographics-container">
                {currentModule.infographic_urls.map((url, idx) => (
                  <img key={idx} src={url} alt={`Infographic ${idx + 1}`} />
                ))}
              </div>
            )}

            {contentType === 'tips' && currentModule?.tips && (
              <div className="tips-container">
                {currentModule.tips.map((tip, idx) => (
                  <div key={idx} className="tip-card">
                    <div className="tip-icon">💡</div>
                    <div className="tip-content">
                      <h4>{tip.title}</h4>
                      <p>{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Learning Objectives */}
          {currentModule?.learning_objectives && (
            <div className="learning-objectives">
              <h3>What You'll Learn</h3>
              <ul>
                {currentModule.learning_objectives.map((obj, idx) => (
                  <li key={idx}>✓ {obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Points */}
          {currentModule?.key_points && (
            <div className="key-points">
              <h3>Key Points to Remember</h3>
              <ul>
                {currentModule.key_points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="sidebar">
          {/* Module List */}
          <div className="modules-list">
            <h3>📚 Course Modules</h3>
            <div className="modules-scroll">
              {modules.map((mod, idx) => (
                <button
                  key={idx}
                  className={`module-item ${idx === currentModuleIdx ? 'active' : ''} ${moduleProgress[mod.id]?.status || ''}`}
                  onClick={() => {
                    setCurrentModuleIdx(idx);
                    setCurrentModule(mod);
                    setTimeSpent(0);
                    setNotes('');
                  }}
                >
                  <span className="module-number">{idx + 1}</span>
                  <span className="module-name">{mod.title}</span>
                  {moduleProgress[mod.id]?.status === 'completed' && (
                    <span className="checkmark">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          <div className="notes-section">
            <button
              className="notes-toggle"
              onClick={() => setShowNotes(!showNotes)}
            >
              📝 {showNotes ? 'Hide' : 'Show'} Notes
            </button>
            {showNotes && (
              <textarea
                className="notes-input"
                placeholder="Take notes about this module..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            )}
          </div>

          {/* Progress Info */}
          <div className="progress-info">
            <h4>Module Progress</h4>
            <p>Status: <strong>{moduleProgress[currentModule?.id]?.status || 'In Progress'}</strong></p>
            <p>Time Spent: <strong>{formatTime(timeSpent)}</strong></p>
            <p>Overall: <strong>{Math.round((Object.values(moduleProgress).filter(p => p.status === 'completed').length / modules.length) * 100)}%</strong></p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="player-actions">
        <button
          className="btn-secondary"
          onClick={() => handleMarkProgress('in_progress')}
        >
          📖 Continue Later
        </button>
        <button
          className="btn-primary"
          onClick={handleCompleteModule}
        >
          ✓ Mark as Complete {currentModuleIdx < modules.length - 1 ? '→' : '(Final)'}
        </button>
      </div>

      {/* Next Module Preview */}
      {currentModuleIdx < modules.length - 1 && (
        <div className="next-module-preview">
          <p>Next up: <strong>{modules[currentModuleIdx + 1]?.title}</strong></p>
        </div>
      )}
    </div>
  );
};

export default ModulePlayer;
