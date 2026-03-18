import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Contexts';
import { useNavigate } from 'react-router-dom';
import videoApi from '../services/videoApi';
import '../styles/LMSDashboard.css';


/**
 * LMS Dashboard - Main hub for learning
 * Displays user profile, courses, progress, and recommendations
 */
const LMSDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get dashboard stats
        const dashRes = await fetch('/api/lms/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!dashRes.ok) throw new Error('Failed to load dashboard');
        const dashData = await dashRes.json();
        setDashboard(dashData);

        // Get user profile
        const profileRes = await fetch('/api/lms/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!profileRes.ok) throw new Error('Failed to load profile');
        const profileData = await profileRes.json();
        setUserProfile(profileData);

        // Get recommendations
        const recsRes = await fetch('/api/lms/recommendations', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!recsRes.ok) throw new Error('Failed to load recommendations');
        const recsData = await recsRes.json();
        setRecommendations(recsData.slice(0, 5)); // Show top 5

        // Fetch my videos
        const videosRes = await videoApi.getUserVideos();
        setMyVideos(videosRes.videos || []);

        setError(null);

      } catch (err) {
        console.error('Dashboard error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <div className="spinner"></div>
        <p>Loading your learning dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container error">
        <div className="error-box">
          <h2>⚠️ Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with user greeting */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, {userProfile?.name || user?.username}! 🎓</h1>
          <p className="subtitle">
            {userProfile?.crop_type ? `Growing ${userProfile.crop_type} in ${userProfile.state}` : 'Continue your agricultural learning journey'}
          </p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{dashboard?.total_enrollments || 0}</span>
            <span className="stat-label">Courses Enrolled</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{dashboard?.total_learning_hours || 0}</span>
            <span className="stat-label">Hours Learned</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{dashboard?.total_certificates || 0}</span>
            <span className="stat-label">Certificates</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          📚 My Courses
        </button>
        <button
          className={`tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          💡 For You
        </button>
        <button
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button
          className={`tab-btn ${activeTab === 'uploads' ? 'active' : ''}`}
          onClick={() => setActiveTab('uploads')}
        >
          📹 My Uploads
        </button>
      </div>


      {/* Tab Content */}
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-content overview-tab">
            <div className="recent-courses">
              <h2>📖 Recent Courses</h2>
              {dashboard?.recent_courses && dashboard.recent_courses.length > 0 ? (
                <div className="courses-grid">
                  {dashboard.recent_courses.map(course => (
                    <div key={course.id} className="course-card recent">
                      <div className="course-image" style={{
                        backgroundImage: `url('${course.image_url || '/default-course.jpg'}')`
                      }}></div>
                      <div className="course-info">
                        <h3>{course.title}</h3>
                        <p className="course-category">{course.category}</p>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{
                            width: `${course.progress_percentage || 0}%`
                          }}></div>
                        </div>
                        <span className="progress-text">{course.progress_percentage || 0}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No courses started yet. Explore courses to begin learning!</p>
              )}
            </div>

            {/* Learning Streak */}
            <div className="learning-stats">
              <div className="stat-box">
                <h3>🔥 Learning Streak</h3>
                <p className="big-number">{dashboard?.current_streak || 0}</p>
                <p className="stat-description">consecutive days</p>
              </div>
              <div className="stat-box">
                <h3>⭐ Average Score</h3>
                <p className="big-number">{dashboard?.average_quiz_score || 0}%</p>
                <p className="stat-description">quiz performance</p>
              </div>
              <div className="stat-box">
                <h3>📈 Growth</h3>
                <p className="big-number">{dashboard?.modules_completed || 0}</p>
                <p className="stat-description">modules completed</p>
              </div>
            </div>

            {/* Learning Advice */}
            {dashboard?.learning_feedback && dashboard.learning_feedback.length > 0 && (
              <div className="learning-advice">
                <h2>💬 Your Learning Coach Says</h2>
                {dashboard.learning_feedback.map((feedback, idx) => (
                  <div key={idx} className={`advice-card ${feedback.type}`}>
                    <p>{feedback.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Courses Tab */}
        {activeTab === 'courses' && (
          <div className="tab-content courses-tab">
            <h2>My Enrolled Courses</h2>
            {dashboard?.enrolled_courses && dashboard.enrolled_courses.length > 0 ? (
              <div className="courses-grid">
                {dashboard.enrolled_courses.map(course => (
                  <div key={course.id} className="course-card">
                    <div className="course-image" style={{
                      backgroundImage: `url('${course.image_url || '/default-course.jpg'}')`
                    }}></div>
                    <div className="course-info">
                      <h3>{course.title}</h3>
                      <p className="course-instructor">By {course.instructor}</p>
                      <div className="course-meta">
                        <span className="level">{course.level}</span>
                        <span className="rating">⭐ {course.rating}/5</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{
                          width: `${course.progress_percentage || 0}%`
                        }}></div>
                      </div>
                      <button className="btn-primary continue-btn">
                        Continue Learning →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't enrolled in any courses yet.</p>
                <button className="btn-primary" onClick={() => setActiveTab('recommendations')}>
                  Explore Courses →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="tab-content recommendations-tab">
            <h2>Recommended For You</h2>
            <p className="rec-subtitle">
              Based on your profile: {userProfile?.crop_type} farming • {userProfile?.experience_level} level
            </p>
            {recommendations && recommendations.length > 0 ? (
              <div className="courses-grid">
                {recommendations.map(rec => (
                  <div key={rec.course?.id} className="course-card recommended">
                    <div className="relevance-badge">{rec.relevance_score}% match</div>
                    <div className="course-image" style={{
                      backgroundImage: `url('${rec.course?.image_url || '/default-course.jpg'}')`
                    }}></div>
                    <div className="course-info">
                      <h3>{rec.course?.title}</h3>
                      <p className="course-reason">{rec.reason}</p>
                      <div className="course-details">
                        <span>{rec.course?.level}</span>
                        <span>{rec.course?.duration_hours} hours</span>
                      </div>
                      <button className="btn-primary enroll-btn">
                        Enroll Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No recommendations available. Complete your profile for personalized suggestions!</p>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && userProfile && (
          <div className="tab-content profile-tab">
            <div className="profile-card">
              <h2>Your Learning Profile</h2>
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Name</label>
                  <p>{userProfile.name}</p>
                </div>
                <div className="profile-field">
                  <label>Crop Type</label>
                  <p>{userProfile.crop_type || 'Not specified'}</p>
                </div>
                <div className="profile-field">
                  <label>Experience Level</label>
                  <p>{userProfile.experience_level}</p>
                </div>
                <div className="profile-field">
                  <label>Location</label>
                  <p>{userProfile.state}</p>
                </div>
                <div className="profile-field">
                  <label>Land Size</label>
                  <p>{userProfile.land_size_acres} acres</p>
                </div>
                <div className="profile-field">
                  <label>Preferred Language</label>
                  <p>{userProfile.preferred_language}</p>
                </div>
              </div>
              <button className="btn-secondary edit-btn">Edit Profile</button>
            </div>
          </div>
        )}

        {/* My Uploads Tab */}
        {activeTab === 'uploads' && (
          <div className="tab-content uploads-tab">
            <div className="tab-header">
              <h2>📹 My Video Uploads</h2>
              <button 
                className="btn-primary upload-new-btn"
                onClick={() => navigate('/video-upload')}
              >
                <span className="material-symbols-outlined">upload</span>
                Upload New Video
              </button>
            </div>
            {myVideos.length === 0 ? (
              <div className="empty-state">
                <span className="material-symbols-outlined empty-icon">video_library</span>
                <h3>No uploads yet</h3>
                <p>Your uploaded videos will appear here. 
                  <br/>Share your farming knowledge with other farmers!</p>
                <button 
                  className="btn-primary" 
                  onClick={() => navigate('/video-upload')}
                >
                  Upload Your First Video
                </button>
              </div>
            ) : (
              <div className="videos-grid">
                {myVideos.map((video) => (
                  <div key={video.id} className="video-card">
                    <div className="video-thumbnail" style={{
                      backgroundImage: `url('${video.thumbnail || "https://img.youtube.com/vi/${video.video_id}/0.jpg"}')`
                    }}>
                      <span className="play-overlay">
                        <span className="material-symbols-outlined">play_circle</span>
                      </span>
                    </div>
                    <div className="video-info">
                      <h3>{video.title}</h3>
                      <p className="video-meta">
                        <span>{video.category}</span> • 
                        <span>{video.views} views</span> • 
                        <span>{new Date(video.uploaded_at).toLocaleDateString()}</span>
                      </p>
                      <p className="video-description">{video.description?.substring(0, 100)}...</p>
                      <div className="video-actions">
                        <button 
                          className="btn-secondary video-edit"
                          onClick={() => {
                            // Edit modal or navigate
                            alert(`Edit video ${video.title}`);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn-danger video-delete"
                          onClick={async () => {
                            if (confirm(`Delete "${video.title}"?`)) {
                              try {
                                await videoApi.delete(video.id);
                                setMyVideos(prev => prev.filter(v => v.id !== video.id));
                              } catch (err) {
                                alert('Delete failed: ' + err.message);
                              }
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSDashboard;

