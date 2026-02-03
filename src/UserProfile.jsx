import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './Contexts';
import { db } from './services/db';

const UserProfile = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');
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

  const [editForm, setEditForm] = useState({
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
  }, [user]);

  const handleEditClick = () => {
    setEditForm({
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
        name: editForm.name,
        farm: editForm.farm,
        phone: editForm.phone,
        email: editForm.email,
        farmSize: editForm.farmSize,
        location: { ...userData.location, name: editForm.location },
        keyCrops: editForm.keyCrops.split(',').map(c => c.trim()).filter(c => c !== '')
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

  const handleLogout = () => {
    logout();
    navigate('/login');
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
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Farm Name</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={editForm.farm}
                  onChange={(e) => setEditForm({ ...editForm, farm: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Phone Number</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Email</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Farm Size</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={editForm.farmSize}
                  onChange={(e) => setEditForm({ ...editForm, farmSize: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Location</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium">Key Crops (comma separated)</span>
                <input
                  className="rounded-xl p-3 border border-border-light dark:border-border-dark bg-gray-50 dark:bg-background-dark"
                  value={editForm.keyCrops}
                  onChange={(e) => setEditForm({ ...editForm, keyCrops: e.target.value })}
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
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4">
            {['activity', 'saved'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-bold rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-primary text-white shadow-md' : 'text-gray-500'}`}
              >
                {tab}
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

          {activeTab === 'saved' && (
            <div className="text-center py-10 opacity-50">
              <span className="material-symbols-outlined text-5xl mb-2">bookmark_border</span>
              <p>No saved items yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
