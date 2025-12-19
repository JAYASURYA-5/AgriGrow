import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('activity');
  const [userData, setUserData] = useState({
    name: 'Jordan Peterson',
    farm: 'Green Valley Farms',
    phone: '+1-202-555-0182',
    email: 'j.peterson@greenvalley.com',
    farmSize: '150 Acres',
    location: 'Central Valley, CA',
    keyCrops: ['Corn', 'Soybeans']
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
    // Load user data from localStorage on component mount
    const savedUser = localStorage.getItem('ag_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUserData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Error loading user data:', e);
      }
    }
  }, []);

  const handleEditClick = () => {
    setEditForm({
      name: userData.name,
      farm: userData.farm,
      phone: userData.phone,
      email: userData.email,
      farmSize: userData.farmSize,
      location: userData.location,
      keyCrops: Array.isArray(userData.keyCrops) ? userData.keyCrops.join(', ') : userData.keyCrops
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedUser = {
      ...userData,
      name: editForm.name,
      farm: editForm.farm,
      phone: editForm.phone,
      email: editForm.email,
      farmSize: editForm.farmSize,
      location: editForm.location,
      keyCrops: editForm.keyCrops.split(',').map(crop => crop.trim()).filter(crop => crop.length > 0)
    };
    setUserData(updatedUser);
    localStorage.setItem('ag_user', JSON.stringify(updatedUser));
    setIsEditing(false);

    // Show success toast
    const toast = document.createElement('div');
    toast.textContent = 'Profile saved';
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: '#112',
      color: '#fff',
      padding: '8px 12px',
      borderRadius: '8px',
      zIndex: 9999
    });
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  const activities = [
    {
      icon: 'monitoring',
      title: 'Sensor data checked',
      subtitle: 'Field A-12 | 2 hours ago'
    },
    {
      icon: 'water_drop',
      title: 'Irrigation schedule updated',
      subtitle: 'Zone 4 | Yesterday'
    },
    {
      icon: 'article',
      title: 'New report generated',
      subtitle: 'Soil Moisture Analysis | 3 days ago'
    }
  ];

  const settingsItems = [
    {
      icon: 'notifications',
      title: 'Notifications',
      href: '#'
    },
    {
      icon: 'help_outline',
      title: 'Help & Support',
      href: '#'
    },
    {
      icon: 'gavel',
      title: 'Terms of Service',
      href: '#'
    }
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <div className="flex size-12 shrink-0 items-center">
          <button onClick={handleBackClick} aria-label="Back to home">
            <span className="material-symbols-outlined text-text-light-primary dark:text-dark-primary text-2xl">arrow_back</span>
          </button>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">My Profile</h2>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={handleLogout}
            className="text-accent text-base font-bold leading-normal tracking-[0.015em] shrink-0"
          >
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
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 border-2 border-primary/50"
                style={{ backgroundImage: `url("https://example.com/profile.jpg")` }}
              ></div>
              <button className="absolute bottom-0 right-0 flex items-center justify-center size-8 bg-primary text-white rounded-full border-2 border-background-light dark:border-background-dark">
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center">
              <p className="text-[22px] font-bold leading-tight tracking-[-0.015em] text-center">{userData.name}</p>
              <p className="text-accent text-base font-normal leading-normal text-center">{userData.farm}</p>
            </div>
          </div>
          <button
            onClick={handleEditClick}
            className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] w-full max-w-[480px] shadow-sm hover:bg-primary/90 transition-colors"
          >
            <span className="truncate">Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <div className="px-4">
          <div className="bg-card-light dark:bg-card-dark border border-gray-300 dark:border-gray-600 rounded-lg p-4">
            <div className="space-y-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium pb-1">Name</span>
                <input
                  className="form-input rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                  type="text"
                  placeholder="Your name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium pb-1">Farm name</span>
                <input
                  className="form-input rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                  type="text"
                  placeholder="Farm name"
                  value={editForm.farm}
                  onChange={(e) => setEditForm(prev => ({ ...prev, farm: e.target.value }))}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium pb-1">Phone</span>
                <input
                  className="form-input rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                  type="tel"
                  placeholder="Phone number"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium pb-1">Email</span>
                <input
                  className="form-input rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                  type="email"
                  placeholder="Email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium pb-1">Farm Size</span>
                <input
                  className="form-input rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                  type="text"
                  placeholder="e.g. 150 Acres"
                  value={editForm.farmSize}
                  onChange={(e) => setEditForm(prev => ({ ...prev, farmSize: e.target.value }))}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium pb-1">Location</span>
                <input
                  className="form-input rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                  type="text"
                  placeholder="e.g. Central Valley, CA"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </label>
              <label className="flex flex-col">
                <span className="text-sm font-medium pb-1">Key Crops (comma-separated)</span>
                <input
                  className="form-input rounded-lg p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white"
                  type="text"
                  placeholder="e.g. Corn, Soybeans, Wheat"
                  value={editForm.keyCrops}
                  onChange={(e) => setEditForm(prev => ({ ...prev, keyCrops: e.target.value }))}
                />
              </label>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 rounded-lg bg-primary text-white py-2 font-semibold hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white py-2 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Information Section */}
      <div className="px-4">
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Personal Information</h3>
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">phone</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Phone</p>
            </div>
            <div className="shrink-0">
              <p className="text-base font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">
                {userData.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">email</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Email</p>
            </div>
            <div className="shrink-0">
              <p className="text-base font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">
                {userData.email}
              </p>
            </div>
          </div>
          <div className="h-2"></div>

          {/* Farm Details Section */}
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Farm Details</h3>
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">straighten</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Farm Size</p>
            </div>
            <div className="shrink-0">
              <p className="text-base font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">
                {userData.farmSize}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Location</p>
            </div>
            <div className="shrink-0">
              <p className="text-base font-normal leading-normal text-text-light-secondary dark:text-dark-secondary">
                {userData.location}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 px-4 min-h-14 justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">grass</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Key Crops</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {userData.keyCrops.map((crop, index) => (
                <span key={index} className="text-xs font-medium bg-accent/20 text-accent py-1 px-2 rounded-full">
                  {crop}
                </span>
              ))}
            </div>
          </div>
          <div className="h-4"></div>
        </div>
      </div>

      {/* Activity & Engagement Section */}
      <div className="p-4">
        <div className="flex gap-2 p-1 bg-background-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg" role="tablist">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 rounded-md py-2 text-sm font-bold ${
              activeTab === 'activity'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-light-secondary dark:text-dark-secondary'
            }`}
            role="tab"
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex-1 rounded-md py-2 text-sm font-bold ${
              activeTab === 'saved'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-light-secondary dark:text-dark-secondary'
            }`}
            role="tab"
          >
            Saved
          </button>
          <button
            onClick={() => setActiveTab('subscription')}
            className={`flex-1 rounded-md py-2 text-sm font-bold ${
              activeTab === 'subscription'
                ? 'bg-primary text-white shadow-sm'
                : 'text-text-light-secondary dark:text-dark-secondary'
            }`}
            role="tab"
          >
            Subscription
          </button>
        </div>

        {activeTab === 'activity' && (
          <div className="mt-4 space-y-3" role="tabpanel">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 bg-card-light dark:bg-card-dark p-3 rounded-lg">
                <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                  <span className="material-symbols-outlined">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-medium leading-tight">{activity.title}</p>
                  <p className="text-sm text-text-light-secondary dark:text-dark-secondary">{activity.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="mt-4 space-y-3" role="tabpanel">
            <p className="text-center text-text-light-secondary dark:text-dark-secondary py-8">
              No saved items yet
            </p>
          </div>
        )}

        {activeTab === 'subscription' && (
          <div className="mt-4 space-y-3" role="tabpanel">
            <p className="text-center text-text-light-secondary dark:text-dark-secondary py-8">
              Subscription details will appear here
            </p>
          </div>
        )}
      </div>

      {/* App Settings & Support Section */}
      <div className="px-4 pb-8">
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Settings & Support</h3>
          {settingsItems.map((item, index) => (
            <a key={index} className="flex items-center gap-4 px-4 min-h-14 justify-between group" href={item.href}>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg bg-accent/20 shrink-0 size-10 text-accent">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <p className="text-base font-normal leading-normal flex-1 truncate">{item.title}</p>
              </div>
              <div className="shrink-0 text-text-light-secondary dark:text-dark-secondary group-hover:text-text-light-primary dark:group-hover:text-dark-primary transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </a>
          ))}
          <div className="h-2"></div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
