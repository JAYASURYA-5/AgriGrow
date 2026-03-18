import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LmsProfile.css';

const LmsProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    state: '',
    crop: '',
    experience: 'Beginner',
    landSize: '',
    language: 'English',
    preferredCategory: 'Soil Health'
  });

  const [savedProfile, setSavedProfile] = useState(false);

  useEffect(() => {
    const existingProfile = localStorage.getItem('lmsUserProfile');
    if (existingProfile) {
      const profile = JSON.parse(existingProfile);
      setFormData(profile);
      setSavedProfile(true);
    }
  }, []);

  const crops = [
    'Rice', 'Wheat', 'Corn', 'Cotton', 'Sugarcane',
    'Pulses', 'Vegetables', 'Fruits', 'Spices', 'Oilseeds'
  ];

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  const categories = [
    'Soil Health', 'Irrigation', 'Pest Control', 'Crop Management',
    'Organic Farming', 'Schemes', 'Livestock'
  ];

  const languages = ['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.crop || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    localStorage.setItem('lmsUserProfile', JSON.stringify(formData));
    setSavedProfile(true);
    alert('Profile saved successfully!');
    navigate('/lms');
  };

  return (
    <div className="lms-profile-container">
      <div className="profile-header">
        <button onClick={() => navigate('/lms')} className="btn-back">
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
        <h1>👨‍🌾 Farmer Profile Setup</h1>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <form onSubmit={handleSubmit} className="profile-form">
            {/* Personal Information Section */}
            <div className="form-section">
              <h2>👤 Personal Information</h2>
              
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Village/Town name"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Agricultural Information Section */}
            <div className="form-section">
              <h2>🌾 Agricultural Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="crop">Primary Crop *</label>
                  <select
                    id="crop"
                    name="crop"
                    value={formData.crop}
                    onChange={handleInputChange}
                    required
                    className="form-select"
                  >
                    <option value="">Select Your Crop</option>
                    {crops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="landSize">Land Size (acres)</label>
                  <input
                    type="number"
                    id="landSize"
                    name="landSize"
                    value={formData.landSize}
                    onChange={handleInputChange}
                    placeholder="0.5"
                    step="0.1"
                    min="0"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="experience">Experience Level</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="Beginner">Beginner (0-2 years)</option>
                  <option value="Intermediate">Intermediate (2-5 years)</option>
                  <option value="Advanced">Advanced (5+ years)</option>
                </select>
              </div>
            </div>

            {/* Learning Preferences Section */}
            <div className="form-section">
              <h2>📚 Learning Preferences</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="language">Preferred Language</label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {languages.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredCategory">Interested Category</label>
                  <select
                    id="preferredCategory"
                    name="preferredCategory"
                    value={formData.preferredCategory}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="learning-tips">
                <h3>💡 Tips for Better Learning:</h3>
                <ul>
                  <li>✓ Dedicate 30-60 minutes daily for best results</li>
                  <li>✓ Complete modules sequentially for better understanding</li>
                  <li>✓ Take quizzes to reinforce learning</li>
                  <li>✓ Download content for offline access</li>
                  <li>✓ Apply what you learn on your farm immediately</li>
                </ul>
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="form-actions">
              <button type="button" onClick={() => navigate('/lms')} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {savedProfile ? 'Update Profile' : 'Create Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="info-cards">
          <div className="info-card">
            <span className="material-symbols-outlined">school</span>
            <h3>Personalized Learning</h3>
            <p>Get course recommendations based on your profile and farming needs</p>
          </div>

          <div className="info-card">
            <span className="material-symbols-outlined">language</span>
            <h3>Regional Languages</h3>
            <p>Learn in your preferred language for better understanding</p>
          </div>

          <div className="info-card">
            <span className="material-symbols-outlined">card_membership</span>
            <h3>Certifications</h3>
            <p>Earn certificates to showcase your new skills</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LmsProfile;
