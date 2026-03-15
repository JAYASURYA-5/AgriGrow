import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme, useAuth } from './Contexts';

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { theme, updateTheme } = useTheme();

  // Load settings from localStorage or use defaults
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ag_notifications');
    return saved ? JSON.parse(saved) : {
      push: true,
      email: false,
      sms: true
    };
  });

  const [privacy, setPrivacy] = useState(() => {
    const saved = localStorage.getItem('ag_privacy');
    return saved ? JSON.parse(saved) : {
      profileVisibility: 'public',
      dataSharing: false
    };
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('ag_preferences');
    return saved ? JSON.parse(saved) : {
      language: 'en',
      theme: 'light',
      units: 'metric'
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('ag_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ag_privacy', JSON.stringify(privacy));
  }, [privacy]);

  useEffect(() => {
    localStorage.setItem('ag_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const handleNotificationChange = (type, value) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  const handlePrivacyChange = (type, value) => {
    setPrivacy(prev => ({ ...prev, [type]: value }));
  };

  const handlePreferenceChange = (type, value) => {
    if (type === 'theme') {
      updateTheme(value);
    }
    setPreferences(prev => ({ ...prev, [type]: value }));
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePassword = () => {
    const newPassword = prompt('Enter your new password:');
    if (newPassword && newPassword.length >= 6) {
      // In a real app, this would make an API call
      alert('Password changed successfully!');
    } else if (newPassword) {
      alert('Password must be at least 6 characters long.');
    }
  };

  const handleDownloadData = () => {
    const userData = {
      notifications,
      privacy,
      preferences,
      exportDate: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'agri-flow-user-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('Your data has been downloaded successfully!');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Clear all user data
      localStorage.clear();
      alert('Account deleted successfully. You will be redirected to the home page.');
      navigate('/');
    }
  };

  const handleHelpCenter = () => {
    const helpText = `
<<<<<<< HEAD
Help Center - AgriGrow
=======
Help Center - AgriFlow
>>>>>>> fe82cd6137968a35adf4325fe480306ec0731366

Getting Started:
- Set your location to get accurate weather and market data
- Configure your notification preferences
- Choose your preferred language and units

Features:
- Weather: Get real-time weather updates for your location
- Market: View current crop prices and trends
- News: Stay updated with agricultural news
- Analysis: Get insights on your farming data
- Community: Connect with other farmers

Troubleshooting:
- If weather data doesn't load, check your location settings
- For market data issues, ensure you have internet connection
- Contact support if problems persist

For more help, visit our website or contact support.
    `;
    alert(helpText);
  };

  const handleContactUs = () => {
<<<<<<< HEAD
    const email = 'support@AgriGrow.com';
    const subject = 'Support Request from AgriGrow App';
=======
    const email = 'support@agriflow.com';
    const subject = 'Support Request from AgriFlow App';
>>>>>>> fe82cd6137968a35adf4325fe480306ec0731366
    const body = 'Please describe your issue or question:';

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleAbout = () => {
    const aboutText = `
<<<<<<< HEAD
About AgriGrow
=======
About AgriFlow
>>>>>>> fe82cd6137968a35adf4325fe480306ec0731366

Version: 1.0.0
Platform: Web Application

<<<<<<< HEAD
AgriGrow is a comprehensive agricultural management platform designed to help farmers make informed decisions through:
=======
AgriFlow is a comprehensive agricultural management platform designed to help farmers make informed decisions through:
>>>>>>> fe82cd6137968a35adf4325fe480306ec0731366

- Real-time weather monitoring
- Market price tracking
- Agricultural news updates
- Crop analysis tools
- Community support
- Government scheme information

Developed with modern web technologies for optimal performance and user experience.

<<<<<<< HEAD
© 2024 AgriGrow. All rights reserved.
=======
© 2024 AgriFlow. All rights reserved.
>>>>>>> fe82cd6137968a35adf4325fe480306ec0731366
    `;
    alert(aboutText);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary group/design-root overflow-x-hidden">
      {/* Top App Bar */}
      <div className="flex items-center bg-background-light dark:bg-background-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-border-light dark:border-border-dark">
        <div className="flex size-12 shrink-0 items-center">
          <button onClick={handleBackClick} aria-label="Back to home">
            <span className="material-symbols-outlined text-text-light-primary dark:text-dark-primary text-2xl">arrow_back</span>
          </button>
        </div>
        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">Settings</h2>
        <div className="flex w-12 items-center justify-end">
          <button
            onClick={handleLogout}
            className="text-accent text-base font-bold leading-normal tracking-[0.015em] shrink-0"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-4 space-y-6">

        {/* Notifications Section */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Notifications</h3>

          <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">notifications</span>
              </div>
              <div>
                <p className="text-base font-medium leading-tight">Push Notifications</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Receive alerts on your device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.push}
                onChange={(e) => handleNotificationChange('push', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">email</span>
              </div>
              <div>
                <p className="text-base font-medium leading-tight">Email Notifications</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Get updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.email}
                onChange={(e) => handleNotificationChange('email', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">sms</span>
              </div>
              <div>
                <p className="text-base font-medium leading-tight">SMS Notifications</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Receive text messages</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications.sms}
                onChange={(e) => handleNotificationChange('sms', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Privacy</h3>

          <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">visibility</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-medium leading-tight">Profile Visibility</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Control who can see your profile</p>
              </div>
            </div>
            <select
              value={privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
              className="w-full p-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">share</span>
              </div>
              <div>
                <p className="text-base font-medium leading-tight">Data Sharing</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Allow anonymous data sharing for improvements</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={privacy.dataSharing}
                onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 dark:peer-focus:ring-primary/25 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Preferences</h3>

          <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">language</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-medium leading-tight">Language</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Choose your preferred language</p>
              </div>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full p-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">palette</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-medium leading-tight">Theme</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Choose your app theme</p>
              </div>
            </div>
            <select
              value={theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="w-full p-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div className="px-4 py-3">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center rounded-lg bg-primary/20 shrink-0 size-10 text-primary">
                <span className="material-symbols-outlined">straighten</span>
              </div>
              <div className="flex-1">
                <p className="text-base font-medium leading-tight">Units</p>
                <p className="text-sm text-text-light-secondary dark:text-dark-secondary">Measurement units</p>
              </div>
            </div>
            <select
              value={preferences.units}
              onChange={(e) => handlePreferenceChange('units', e.target.value)}
              className="w-full p-2 border border-border-light dark:border-border-dark rounded-lg bg-background-light dark:bg-background-dark text-text-light-primary dark:text-dark-primary"
            >
              <option value="metric">Metric</option>
              <option value="imperial">Imperial</option>
            </select>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Account</h3>

          <button onClick={handleChangePassword} className="flex items-center gap-4 px-4 min-h-14 justify-between group w-full text-left">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-accent/20 shrink-0 size-10 text-accent">
                <span className="material-symbols-outlined">password</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Change Password</p>
            </div>
            <div className="shrink-0 text-text-light-secondary dark:text-dark-secondary group-hover:text-text-light-primary dark:group-hover:text-dark-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </button>

          <button onClick={handleDownloadData} className="flex items-center gap-4 px-4 min-h-14 justify-between group w-full text-left">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-accent/20 shrink-0 size-10 text-accent">
                <span className="material-symbols-outlined">download</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Download Data</p>
            </div>
            <div className="shrink-0 text-text-light-secondary dark:text-dark-secondary group-hover:text-text-light-primary dark:group-hover:text-dark-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </button>

          <button onClick={handleDeleteAccount} className="flex items-center gap-4 px-4 min-h-14 justify-between group w-full text-left">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-red-500/20 shrink-0 size-10 text-red-500">
                <span className="material-symbols-outlined">delete</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Delete Account</p>
            </div>
            <div className="shrink-0 text-text-light-secondary dark:text-dark-secondary group-hover:text-red-500 transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </button>
        </div>

        {/* Support Section */}
        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm">
          <h3 className="text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Support</h3>

          <button onClick={handleHelpCenter} className="flex items-center gap-4 px-4 min-h-14 justify-between group w-full text-left">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-accent/20 shrink-0 size-10 text-accent">
                <span className="material-symbols-outlined">help_outline</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Help Center</p>
            </div>
            <div className="shrink-0 text-text-light-secondary dark:text-dark-secondary group-hover:text-text-light-primary dark:group-hover:text-dark-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </button>

          <button onClick={handleContactUs} className="flex items-center gap-4 px-4 min-h-14 justify-between group w-full text-left">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-accent/20 shrink-0 size-10 text-accent">
                <span className="material-symbols-outlined">contact_support</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">Contact Us</p>
            </div>
            <div className="shrink-0 text-text-light-secondary dark:text-dark-secondary group-hover:text-text-light-primary dark:group-hover:text-dark-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </button>

          <button onClick={handleAbout} className="flex items-center gap-4 px-4 min-h-14 justify-between group w-full text-left">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-lg bg-accent/20 shrink-0 size-10 text-accent">
                <span className="material-symbols-outlined">info</span>
              </div>
              <p className="text-base font-normal leading-normal flex-1 truncate">About</p>
            </div>
            <div className="shrink-0 text-text-light-secondary dark:text-dark-secondary group-hover:text-text-light-primary dark:group-hover:text-dark-primary transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
