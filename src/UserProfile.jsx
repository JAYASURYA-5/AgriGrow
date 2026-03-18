import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './Contexts';
import { db } from './services/db';
import Certificate from './components/Certificate';

const UserProfile = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');
  const [userUploadedVideos, setUserUploadedVideos] = useState([]);
  const [userCertificates, setUserCertificates] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', keywords: '' });
  const [userData, setUserData] = useState({
    name: '',
    farm: '',
    phone: '',
    email: '',
    farmSize: '',
    location: { name: '' },
    keyCrops: [],
    profileImage: '',
    gender: ''
  });

  const [profileEditForm, setProfileEditForm] = useState({
    name: '',
    farm: '',
    phone: '',
    email: '',
    farmSize: '',
    location: '',
    keyCrops: ''
  });

  useEffect(() => {
    if (user) {
      setUserData(prev => ({ ...prev, ...user }));
    }

    // Load user's uploaded videos
    const allVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
    const myVideos = allVideos.filter(video => video.uploadedBy === user?.id);
    setUserUploadedVideos(myVideos);

    // Load user's certificates
    const allCertificates = JSON.parse(localStorage.getItem('courseCertificates') || '[]');
    const myCertificates = allCertificates.filter(cert => cert.userId === (user?.name || user?.id));
    setUserCertificates(myCertificates);
  }, [user]);

  // Auto-detect farm location on mount
  useEffect(() => {
    if (navigator.geolocation && !userData.location?.latitude) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          try {
            // Try to get location name from coordinates using reverse geocoding
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const locationName = data.address?.village || data.address?.city || data.address?.town || 
                                data.address?.county || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            
            setUserData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                name: locationName,
                latitude,
                longitude,
                accuracy
              }
            }));

            // Show notification
            const toast = document.createElement('div');
            toast.textContent = `📍 Farm location detected: ${locationName}`;
            Object.assign(toast.style, {
              position: 'fixed', top: '24px', right: '24px', backgroundColor: '#3b82f6', color: 'white',
              padding: '12px 24px', borderRadius: '12px', zIndex: '9999', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            });
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 4000);
          } catch (error) {
            console.log('Reverse geocoding failed, using coordinates');
            setUserData(prev => ({
              ...prev,
              location: {
                ...prev.location,
                name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                latitude,
                longitude,
                accuracy
              }
            }));
          }
        },
        (error) => {
          console.log('Geolocation error:', error.message);
          // Silently fail - user can enter location manually
        }
      );
    }
  }, []);

  const handleEditClick = () => {
    setProfileEditForm({
      name: userData.name || '',
      farm: userData.farm || '',
      phone: userData.phone || '',
      email: userData.email || '',
      farmSize: userData.farmSize || '',
      location: userData.location?.name || '',
      keyCrops: Array.isArray(userData.keyCrops) ? userData.keyCrops.join(', ') : (userData.keyCrops || '')
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedFields = {
        name: profileEditForm.name,
        farm: profileEditForm.farm,
        phone: profileEditForm.phone,
        email: profileEditForm.email,
        farmSize: profileEditForm.farmSize,
        location: { ...userData.location, name: profileEditForm.location },
        keyCrops: profileEditForm.keyCrops.split(',').map(c => c.trim()).filter(c => c !== '')
      };

      const saved = await db.updateProfile(user.id, updatedFields);
      login(saved); // Update global context state
      setUserData(prev => ({ ...prev, ...saved }));
      setIsEditing(false);

      // Toast notification
      const toast = document.createElement('div');
      toast.textContent = 'Profile updated successfully';
      Object.assign(toast.style, {
        position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#10b981', color: 'white',
        padding: '12px 24px', borderRadius: '12px', zIndex: '9999', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      });
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Manual location detection function
  const detectLocationManually = () => {
    if (!navigator.geolocation) {
      showErrorDialog('Geolocation is not supported by your browser. Please enter location manually.');
      return;
    }

    const detectBtn = document.querySelector('[data-detect-location]');
    if (detectBtn) detectBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          // Try reverse geocoding to get readable address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { timeout: 5000 }
          );
          const data = await response.json();
          const locationName = data.address?.village || data.address?.city || data.address?.town || 
                              data.address?.county || data.address?.state || 
                              `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          setProfileEditForm({ ...profileEditForm, location: locationName });
          setUserData(prev => ({
            ...prev,
            location: { ...prev.location, name: locationName, latitude, longitude, accuracy }
          }));

          showSuccessToast(`📍 Location detected: ${locationName}`);
        } catch (error) {
          // Fallback to coordinates only
          const coordsOnly = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setProfileEditForm({ ...profileEditForm, location: coordsOnly });
          setUserData(prev => ({
            ...prev,
            location: { ...prev.location, name: coordsOnly, latitude, longitude, accuracy }
          }));
          showSuccessToast(`📍 Coordinates detected: ${coordsOnly}`);
        }
        if (detectBtn) detectBtn.disabled = false;
      },
      (error) => {
        let errorMsg = 'Could not detect location. Please enter manually.';
        if (error.code === 1) errorMsg = 'Location permission denied. Please enable GPS and try again.';
        else if (error.code === 2) errorMsg = 'Position unavailable. Please try again.';
        else if (error.code === 3) errorMsg = 'Location request timeout. Please try again.';
        
        showErrorDialog(errorMsg);
        if (detectBtn) detectBtn.disabled = false;
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Helper function to show error dialog
  const showErrorDialog = (message) => {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm';
    dialog.innerHTML = `
      <div class="bg-white dark:bg-card-dark rounded-2xl shadow-xl p-6 max-w-sm mx-4 animate-in">
        <div class="flex justify-between items-start mb-3">
          <h3 class="text-lg font-bold">Location Detection</h3>
          <button onclick="this.closest('div').remove()" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-5">${message}</p>
        <button onclick="this.closest('div').remove()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors">
          OK
        </button>
      </div>
    `;
    document.body.appendChild(dialog);
    setTimeout(() => dialog.style.opacity = '0', 2500);
    setTimeout(() => dialog.remove(), 3000);
  };

  // Helper function for success toast
  const showSuccessToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '24px', right: '24px', backgroundColor: '#10b981', color: 'white',
      padding: '12px 24px', borderRadius: '12px', zIndex: '9999', fontWeight: 'bold', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', animation: 'slideIn 0.3s ease-out'
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteVideo = (videoId) => {
    const confirmed = window.confirm('Are you sure you want to delete this video? This action cannot be undone.');
    if (!confirmed) return;

    // Get all videos
    const allVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
    
    // Find video and check permission
    const videoIndex = allVideos.findIndex(v => v.id === videoId);
    const video = allVideos[videoIndex];

    // Check if user is uploader or admin
    const isUploader = video.uploadedBy === user?.id;
    const isAdmin = user?.role === 'admin';

    if (!isUploader && !isAdmin) {
      alert('❌ You do not have permission to delete this video.');
      return;
    }

    // Remove video
    allVideos.splice(videoIndex, 1);
    localStorage.setItem('uploadedVideos', JSON.stringify(allVideos));

    // Update state
    const myVideos = allVideos.filter(v => v.uploadedBy === user?.id);
    setUserUploadedVideos(myVideos);

    alert('✅ Video deleted successfully');
  };

  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description,
      keywords: video.keywords?.join(', ') || ''
    });
  };

  const handleSaveVideoEdits = () => {
    if (!editingVideo) return;

    // Get all videos
    const allVideos = JSON.parse(localStorage.getItem('uploadedVideos') || '[]');
    
    // Find and update video
    const videoIndex = allVideos.findIndex(v => v.id === editingVideo.id);
    allVideos[videoIndex] = {
      ...allVideos[videoIndex],
      title: editForm.title,
      description: editForm.description,
      keywords: editForm.keywords.split(',').map(k => k.trim())
    };

    // Save to localStorage
    localStorage.setItem('uploadedVideos', JSON.stringify(allVideos));

    // Update state
    const myVideos = allVideos.filter(v => v.uploadedBy === user?.id);
    setUserUploadedVideos(myVideos);

    // Clear editing state
    setEditingVideo(null);
    alert('✅ Video updated successfully');
  };

  const activities = [
    { icon: 'monitoring', title: 'Sensor data checked', subtitle: 'Field A-12 | 2 hours ago' },
    { icon: 'water_drop', title: 'Irrigation schedule updated', subtitle: 'Zone 4 | Yesterday' },
    { icon: 'article', title: 'New report generated', subtitle: 'Soil Moisture Analysis | 3 days ago' }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <div className="flex size-12 shrink-0 items-center">
          <button onClick={() => navigate('/')} aria-label="Back to home">
            <span className="material-symbols-outlined text-text-light-primary dark:text-dark-primary text-2xl">arrow_back</span>
          </button>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">My Profile</h2>
        <div className="flex w-12 items-center justify-end">
          <button onClick={handleLogout} className="text-accent text-base font-bold leading-normal tracking-[0.015em] shrink-0">
            Logout
          </button>
        </div>
      </div>

      {/* Profile Header */}
      <div className="flex p-4 mt-4">
        <div className="flex w-full flex-col gap-4 items-center">
          <div className="flex gap-4 flex-col items-center">
            <div className="relative">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-4 border-primary shadow-xl"
                style={{ backgroundImage: `url("${userData.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'}")` }}
              ></div>
              <button className="absolute bottom-0 right-0 flex items-center justify-center size-8 bg-primary text-white rounded-full border-2 border-background-light dark:border-background-dark">
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{userData.name || 'User'}</p>
              <p className="text-accent text-base font-normal leading-normal text-center">{userData.farm || 'Your Farm'}</p>
            </div>
          </div>
          <button
            onClick={handleEditClick}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] shadow-sm hover:bg-primary/90 transition-colors"
          >
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Form Modal/Overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
            <div className="space-y-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Name</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={profileEditForm.name}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, name: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Farm Name</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={profileEditForm.farm}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, farm: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Phone Number</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={profileEditForm.phone}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, phone: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Email</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={profileEditForm.email}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, email: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Farm Size</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={profileEditForm.farmSize}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, farmSize: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Location</span>
                <div className="flex gap-2 items-end">
                  <input
                    className="flex-1 rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary"
                    value={profileEditForm.location}
                    onChange={(e) => setProfileEditForm({ ...profileEditForm, location: e.target.value })}
                    placeholder="Enter or auto-detect farm location"
                  />
                  <button
                    data-detect-location
                    onClick={detectLocationManually}
                    type="button"
                    className="h-12 w-12 bg-gradient-to-br from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Auto-detect farm location using GPS"
                  >
                    <span className="material-symbols-outlined text-2xl">location_on</span>
                  </button>
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Key Crops (comma separated)</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={profileEditForm.keyCrops}
                  onChange={(e) => setProfileEditForm({ ...profileEditForm, keyCrops: e.target.value })}
                />
              </label>
              <div className="flex gap-3 pt-4">
                <button onClick={handleSave} className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all">Save</button>
                <button onClick={handleCancel} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Sections */}
      <div className="px-4 space-y-6">
        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-bold border-b border-border-light dark:border-border-dark pb-2">Personal Information</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">phone</span>
              <span className="text-sm">Phone</span>
            </div>
            <span className="font-bold text-sm">{userData.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">person</span>
              <span className="text-sm">Gender</span>
            </div>
            <span className="text-sm opacity-70">{userData.gender || 'Not set'}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">email</span>
              <span className="text-sm">Email</span>
            </div>
            <span className="text-sm truncate max-w-[200px]">{userData.email || 'N/A'}</span>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-bold border-b border-border-light dark:border-border-dark pb-2">Farm Details</h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">straighten</span>
              <span className="text-sm">Farm Size</span>
            </div>
            <span className="text-sm opacity-70">{userData.farmSize || 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <span className="text-sm">Location</span>
            </div>
            <span className="text-sm opacity-70 truncate max-w-[200px]">{userData.location?.name || 'N/A'}</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">grass</span>
              <span className="text-sm">Key Crops</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {userData.keyCrops?.map((crop, i) => (
                <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{crop}</span>
              )) || <span className="text-xs opacity-50 italic">No crops listed</span>}
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="pb-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4 overflow-x-auto">
            {['activity', 'videos', 'upload-history', 'certificates'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all whitespace-nowrap ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-500'}`}
              >
                {tab === 'videos' ? 'My Videos' : tab === 'upload-history' ? 'Upload History' : tab === 'certificates' ? 'Certificates' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'activity' && (
            <div className="space-y-3">
              {activities.map((act, i) => (
                <div key={i} className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-4 rounded-2xl shadow-sm">
                  <div className="bg-primary/20 p-2 rounded-xl text-primary">
                    <span className="material-symbols-outlined">{act.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{act.title}</p>
                    <p className="text-xs opacity-60">{act.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-4">
              {userUploadedVideos.length > 0 ? (
                userUploadedVideos.map(video => (
                  <div key={video.id} className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark">
                    <div className="flex gap-4 p-4">
                      {/* Thumbnail */}
                      <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={video.thumbnailData} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                          <span className="material-symbols-outlined text-white text-3xl">play_circle</span>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-sm line-clamp-2">{video.title}</h3>
                          <p className="text-xs opacity-60 line-clamp-1">{video.description}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{video.duration}</span>
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-gray-600 dark:text-gray-300">
                              {(video.size / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="opacity-50">
                            {new Date(video.uploadedAt).toLocaleDateString()} • {video.views} views
                          </span>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 opacity-50">
                  <span className="material-symbols-outlined text-5xl mb-2">video_library</span>
                  <p>No videos uploaded yet</p>
                  <p className="text-xs mt-1">Start uploading videos to share with the community</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'upload-history' && (
            <div className="space-y-4">
              {userUploadedVideos.length > 0 ? (
                <div>
                  <div className="bg-card-light dark:bg-card-dark rounded-2xl overflow-hidden shadow-sm border border-border-light dark:border-border-dark">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-primary/10 border-b border-border-light dark:border-border-dark">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-bold">Title</th>
                            <th className="px-4 py-3 text-left text-sm font-bold">Duration</th>
                            <th className="px-4 py-3 text-left text-sm font-bold">Upload Date</th>
                            <th className="px-4 py-3 text-left text-sm font-bold">Views</th>
                            <th className="px-4 py-3 text-right text-sm font-bold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userUploadedVideos.map(video => (
                            <tr key={video.id} className="border-b border-border-light dark:border-border-dark hover:bg-white/5 dark:hover:bg-black/10 transition-colors">
                              <td className="px-4 py-3 text-sm font-medium truncate max-w-64">{video.title}</td>
                              <td className="px-4 py-3 text-sm">{video.duration}</td>
                              <td className="px-4 py-3 text-sm">{new Date(video.uploadedAt).toLocaleDateString()}</td>
                              <td className="px-4 py-3 text-sm">{video.views}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleEditVideo(video)}
                                    className="px-3 py-1 text-sm font-semibold bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-base">edit</span>
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVideo(video.id)}
                                    className="px-3 py-1 text-sm font-semibold bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors flex items-center gap-1"
                                  >
                                    <span className="material-symbols-outlined text-base">delete</span>
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 opacity-50">
                  <span className="material-symbols-outlined text-5xl mb-2">upload_file</span>
                  <p>No upload history yet</p>
                  <p className="text-xs mt-1">Your uploaded videos will appear here</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {userCertificates.length > 0 ? (
                userCertificates.map(certificate => {
                  const courseMap = {
                    '1': 'Soil Preparation & Health',
                    '2': 'Irrigation Techniques',
                    '3': 'Organic Farming Practices',
                    '4': 'Pest & Disease Management',
                    '5': 'Crop Rotation & Diversity',
                    'soil-health': 'Soil Preparation & Health',
                    'irrigation': 'Irrigation Techniques',
                    'organic-farming': 'Organic Farming Practices',
                    'pest-management': 'Pest & Disease Management',
                    'crop-rotation': 'Crop Rotation & Diversity'
                  };
                  const courseName = courseMap[certificate.courseId] || 'Agricultural Course';
                  
                  return (
                    <div key={certificate.id} className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl overflow-hidden shadow-md border-2 border-amber-200 dark:border-amber-700">
                      <div className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-3xl">🏅</span>
                              <h4 className="text-lg font-bold text-amber-900 dark:text-amber-200">Certificate of Achievement</h4>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Course: <span className="font-semibold">{courseName}</span></p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Score: <span className="font-bold text-green-600 dark:text-green-400">{certificate.score}%</span></p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Completed: {new Date(certificate.completionDate).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">ID: {certificate.id}</p>
                          </div>
                          <button
                            onClick={() => setSelectedCertificate(certificate)}
                            className="flex-shrink-0 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all whitespace-nowrap"
                          >
                            View Full
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <span className="material-symbols-outlined text-5xl mb-2 opacity-30">card_membership</span>
                  <p className="opacity-70">No certificates yet</p>
                  <p className="text-xs mt-1 opacity-50">Complete course assessments to earn certificates</p>
                </div>
              )}
            </div>
          )}

          {/* Edit Video Modal */}
          {editingVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-white dark:bg-card-dark rounded-3xl shadow-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Edit Video</h3>
                <div className="space-y-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Title</span>
                    <input
                      type="text"
                      className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Description</span>
                    <textarea
                      className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                      rows="3"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium">Keywords (comma separated)</span>
                    <input
                      type="text"
                      className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                      value={editForm.keywords}
                      onChange={(e) => setEditForm({ ...editForm, keywords: e.target.value })}
                    />
                  </label>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveVideoEdits}
                      className="flex-1 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-all"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingVideo(null)}
                      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Certificate Display Modal */}
          {selectedCertificate && (
            <Certificate 
              certificate={selectedCertificate}
              onClose={() => setSelectedCertificate(null)}
            />
          )}
      </div>
    </div>
  );
};

export default UserProfile;
