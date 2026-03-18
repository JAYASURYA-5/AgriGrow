import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Contexts';
import videoApi from '../services/videoApi';
import '../styles/VideoUpload.css';

const VideoUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Soil Health',
    keywords: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [myUploads, setMyUploads] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const fileInputRef = React.useRef(null);

  const categories = [
    'Soil Health', 'Irrigation', 'Pest Control', 'Crop Management',
    'Organic Farming', 'Schemes', 'Livestock', 'Weather', 'Market'
  ];

  // Fetch user's uploads on component mount
  React.useEffect(() => {
    fetchMyUploads();
  }, []);

  const fetchMyUploads = async () => {
    try {
      const response = await videoApi.getUserVideos();
      const videos = response.videos || [];
      setMyUploads(videos);
    } catch (err) {
      console.error('Failed to fetch videos:', err);
      setMyUploads([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 1GB)
    const maxSize = 1024 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Video file must be less than 1GB');
      return;
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm', 'video/ogg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid video format (MP4, MOV, AVI, WebM, OGG)');
      return;
    }

    setVideoFile(file);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to upload videos');
      return;
    }

    if (!videoFile || !formData.title || !formData.description) {
      setError('Please select a video file and fill all required fields');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('video', videoFile);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('category', formData.category);
      uploadFormData.append('keywords', formData.keywords);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      // Upload file
      const result = await videoApi.uploadFile(uploadFormData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      console.log('Video uploaded:', result);
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleNewUpload = () => {
    setUploadSuccess(false);
    setVideoFile(null);
    setFormData({
      title: '',
      description: '',
      category: 'Soil Health',
      keywords: ''
    });
    setUploadProgress(0);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (uploadSuccess) {
    return (
      <div className="upload-success-container">
        <div className="success-card">
          <span className="material-symbols-outlined success-icon">check_circle</span>
          <h1>✅ Video Instantly Published!</h1>
          <p>✅ Video saved to your **Upload History** forever!</p>
          <p>Manage, edit or delete anytime in LMS Dashboard → My Uploads tab</p>
          <div className="success-details">
            <div className="detail-item">
              <span className="material-symbols-outlined">play_circle</span>
              <div>
                <h3>{formData.title}</h3>
                <p>{formData.category} • {formData.keywords || 'General'}</p>
              </div>
            </div>
          </div>
          <div className="success-actions">
            <button onClick={handleNewUpload} className="btn-secondary">
              📤 Upload Another
            </button>
            <button onClick={() => navigate('/lms')} className="btn-primary">
              👀 View My Uploads
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="video-upload-container">
      <div className="upload-header">
        <button onClick={() => navigate('/lms')} className="btn-back">
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <h1>📹 Upload Video File</h1>
        <p>Share your agriculture videos instantly with farmers (no approval needed)</p>
      </div>

      <div className="upload-content">
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h2>🎬 Video File *</h2>
            <div className="form-group">
              <label htmlFor="videoFile">Select Video File</label>
              <div 
                className="file-upload-area"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#2d5a8c';
                  e.currentTarget.style.background = '#f0f7ff';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.background = '#f9fafb';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#ddd';
                  e.currentTarget.style.background = '#f9fafb';
                  const files = e.dataTransfer.files;
                  if (files?.length) {
                    const event = {
                      target: { files: files }
                    };
                    handleFileChange(event);
                  }
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={handleFileChange}
                  className="file-input"
                  style={{ display: 'none' }}
                />
                <span className="material-symbols-outlined">upload_file</span>
                <p>Click to upload or drag and drop</p>
                <small>MP4, MOV, AVI, WebM, OGG (Max 1GB)</small>
                {videoFile && (
                  <div className="file-selected">
                    ✅ {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
              </div>
            </div>

            {/* Video Preview Section */}
            {videoFile && (
              <div className="video-preview-section">
                <h3>👀 Video Preview</h3>
                <video
                  width="100%"
                  height="300"
                  controls
                  style={{
                    borderRadius: '8px',
                    border: '2px solid #e5e7eb',
                    backgroundColor: '#000'
                  }}
                >
                  <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                  Your browser does not support the video tag.
                </video>
                <small style={{ display: 'block', marginTop: '8px', color: '#666' }}>
                  ℹ️ Preview your video before uploading. Use the player to check quality and content.
                </small>
              </div>
            )}
          </div>

          <div className="form-section">
            <h2>📝 Video Details</h2>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Drip Irrigation for Small Farms"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Explain what farmers will learn..."
                className="form-textarea"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="keywords">Keywords (comma separated)</label>
                <input
                  type="text"
                  id="keywords"
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleInputChange}
                  placeholder="irrigation, drip, water saving"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="form-actions">
            {!isUploading && (
              <>
                <button type="button" onClick={() => navigate('/lms')} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <span className="material-symbols-outlined">upload</span>
                  Upload & Publish Video
                </button>
              </>
            )}

            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }}>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                </div>
                <p>Publishing to LMS dashboard...</p>
              </div>
            )}
          </div>
        </form>

        {/* Upload History Section */}
        <div className="form-section" style={{ marginTop: '60px', paddingTop: '40px', borderTop: '2px solid #eee' }}>
          <h2>📤 My Upload History</h2>
          
          {myUploads.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999', background: '#f9fafb', borderRadius: '8px' }}>
              <p>📭 No videos uploaded yet</p>
              <p style={{ fontSize: '0.9rem' }}>Upload your first video above to get started!</p>
            </div>
          ) : (
            <div className="upload-history-list">
              {myUploads.map((video) => (
                <div key={video.id} className="history-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '15px',
                  background: '#f9fafb',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  border: '1px solid #eee'
                }}>
                  <div className="history-info" style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#1a3a52' }}>{video.title}</h4>
                    <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '0.9rem' }}>{video.description}</p>
                    <small style={{ color: '#999' }}>
                      📁 {video.category} | 📅 {new Date(video.uploadedAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="history-actions" style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const newTitle = prompt('Edit title:', video.title);
                        if (newTitle) {
                          videoApi.updateVideo(video.id, { title: newTitle })
                            .then(() => fetchMyUploads())
                            .catch(err => setError(err.message));
                        }
                      }}
                      style={{
                        background: '#dbeafe',
                        color: '#1e40af',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>edit</span>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this video?')) {
                          videoApi.deleteVideo(video.id)
                            .then(() => {
                              setMyUploads(myUploads.filter(v => v.id !== video.id));
                              alert('Video deleted successfully!');
                            })
                            .catch(err => setError(err.message));
                        }
                      }}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>delete</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;


