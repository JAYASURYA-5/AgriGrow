import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Lms.css';

const LmsMain = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('lmsUserProfile');
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Load all courses
    const savedCourses = localStorage.getItem('lmsCourses');
    if (savedCourses) {
      setAllCourses(JSON.parse(savedCourses));
    } else {
      initializeDefaultCourses();
    }

    // Load user progress
    const savedProgress = localStorage.getItem('lmsUserProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const initializeDefaultCourses = () => {
    const defaultCourses = [
      {
        id: 1,
        title: 'Soil Preparation Basics',
        category: 'Soil Health',
        level: 'Beginner',
        duration: '4 weeks',
        instructor: 'Dr. Anil Kumar',
        rating: 4.8,
        students: 2543,
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=450&fit=crop',
        description: 'Learn the fundamentals of soil preparation for maximum crop yield.',
        modules: [
          { id: 1, title: 'Understanding Soil Types', duration: '20 min', completed: false, videoUrl: 'https://www.youtube.com/embed/lGzTB-tl0bw', youtubeId: 'lGzTB-tl0bw' },
          { id: 2, title: 'Soil Composition Analysis', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/aQvZcf0bCXU', youtubeId: 'aQvZcf0bCXU' },
          { id: 3, title: 'pH Levels & Nutrients', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/2e8ZvUXjW0c', youtubeId: '2e8ZvUXjW0c' },
          { id: 4, title: 'Testing and Analysis', duration: '28 min', completed: false, videoUrl: 'https://www.youtube.com/embed/W_qGEFwNbJ8', youtubeId: 'W_qGEFwNbJ8' },
          { id: 5, title: 'Soil Quality Improvement', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/bZK_0TJo8XI', youtubeId: 'bZK_0TJo8XI' },
          { id: 6, title: 'Preparation Techniques', duration: '26 min', completed: false, videoUrl: 'https://www.youtube.com/embed/5_kLfPQKRUc', youtubeId: '5_kLfPQKRUc' },
          { id: 7, title: 'Tilling & Plowing Best Practices', duration: '23 min', completed: false, videoUrl: 'https://www.youtube.com/embed/BvEOoASMKXs', youtubeId: 'BvEOoASMKXs' },
          { id: 8, title: 'Quiz: Soil Fundamentals', duration: '20 min', completed: false, videoUrl: 'https://www.youtube.com/embed/K6vMx0zEG_A', youtubeId: 'K6vMx0zEG_A' }
        ]
      },
      {
        id: 2,
        title: 'Modern Irrigation Techniques',
        category: 'Irrigation',
        level: 'Intermediate',
        duration: '5 weeks',
        instructor: 'Rajesh Patel',
        rating: 4.6,
        students: 1893,
        image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=400&h=250&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=800&h=450&fit=crop',
        description: 'Master drip irrigation, sprinkler systems, and water conservation.',
        modules: [
          { id: 1, title: 'Water Management Basics', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/pMQH6Hg8sUE', youtubeId: 'pMQH6Hg8sUE' },
          { id: 2, title: 'Water Conservation Techniques', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/0aQHnS6gFh8', youtubeId: '0aQHnS6gFh8' },
          { id: 3, title: 'Irrigation System Types', duration: '28 min', completed: false, videoUrl: 'https://www.youtube.com/embed/8sKg8Q_8Qhc', youtubeId: '8sKg8Q_8Qhc' },
          { id: 4, title: 'Drip Irrigation Fundamentals', duration: '26 min', completed: false, videoUrl: 'https://www.youtube.com/embed/HqQSFrP0BuA', youtubeId: 'HqQSFrP0BuA' },
          { id: 5, title: 'Drip Irrigation Systems Setup', duration: '30 min', completed: false, videoUrl: 'https://www.youtube.com/embed/VJ3lDNR0sB4', youtubeId: 'VJ3lDNR0sB4' },
          { id: 6, title: 'Sprinkler System Design', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/Lxs5Yw7iMpE', youtubeId: 'Lxs5Yw7iMpE' },
          { id: 7, title: 'Sprinkler Installation', duration: '27 min', completed: false, videoUrl: 'https://www.youtube.com/embed/qKqKXW-7cKk', youtubeId: 'qKqKXW-7cKk' },
          { id: 8, title: 'Water Conservation Strategies', duration: '23 min', completed: false, videoUrl: 'https://www.youtube.com/embed/8zNqvAI-Ywc', youtubeId: '8zNqvAI-Ywc' },
          { id: 9, title: 'Maintenance & Troubleshooting', duration: '21 min', completed: false, videoUrl: 'https://www.youtube.com/embed/gk94RZqxWlc', youtubeId: 'gk94RZqxWlc' },
          { id: 10, title: 'Quiz & Case Studies', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/U8qYZDmpLq0', youtubeId: 'U8qYZDmpLq0' }
        ]
      },
      {
        id: 3,
        title: 'Organic Farming Essentials',
        category: 'Organic Farming',
        level: 'Intermediate',
        duration: '6 weeks',
        instructor: 'Priya Singh',
        rating: 4.9,
        students: 3201,
        image: 'https://images.unsplash.com/photo-1500541961454-2e30c00f3817?w=400&h=250&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1500541961454-2e30c00f3817?w=800&h=450&fit=crop',
        description: 'Complete guide to organic farming methods and certification.',
        modules: [
          { id: 1, title: 'Organic Farming Principles', duration: '20 min', completed: false, videoUrl: 'https://www.youtube.com/embed/YkzZ6N8GdDI', youtubeId: 'YkzZ6N8GdDI' },
          { id: 2, title: 'Certification Requirements', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/aHO3eFxNH-k', youtubeId: 'aHO3eFxNH-k' },
          { id: 3, title: 'Organic Fertilizers Overview', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/fB0MvVKUdAk', youtubeId: 'fB0MvVKUdAk' },
          { id: 4, title: 'Composting Methods', duration: '26 min', completed: false, videoUrl: 'https://www.youtube.com/embed/lVeq-WGfLqc', youtubeId: 'lVeq-WGfLqc' },
          { id: 5, title: 'Vermicomposting Techniques', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/kj2TrSLBFRo', youtubeId: 'kj2TrSLBFRo' },
          { id: 6, title: 'Natural Pest Control Methods', duration: '28 min', completed: false, videoUrl: 'https://www.youtube.com/embed/KfqZfX8BQGE', youtubeId: 'KfqZfX8BQGE' },
          { id: 7, title: 'Organic Weed Management', duration: '23 min', completed: false, videoUrl: 'https://www.youtube.com/embed/8lLwGzLHKsk', youtubeId: '8lLwGzLHKsk' },
          { id: 8, title: 'Crop-Livestock Integration', duration: '27 min', completed: false, videoUrl: 'https://www.youtube.com/embed/5x3SNfHB4lE', youtubeId: '5x3SNfHB4lE' },
          { id: 9, title: 'Organic Record Keeping', duration: '20 min', completed: false, videoUrl: 'https://www.youtube.com/embed/rV8YjSqsxsM', youtubeId: 'rV8YjSqsxsM' },
          { id: 10, title: 'Certification & Compliance', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/3OQMr6gVHyE', youtubeId: '3OQMr6gVHyE' }
        ]
      },
      {
        id: 4,
        title: 'Pest Management Strategy',
        category: 'Pest Control',
        level: 'Beginner',
        duration: '3 weeks',
        instructor: 'Dr. Vikram Dasgupta',
        rating: 4.7,
        students: 2156,
        image: 'https://images.unsplash.com/photo-1488459716781-6f3ee109e5e4?w=400&h=250&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1488459716781-6f3ee109e5e4?w=800&h=450&fit=crop',
        description: 'Identify and manage common pests effectively without chemicals.',
        modules: [
          { id: 1, title: 'Pest Recognition Basics', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/A3M-sXbvDyo', youtubeId: 'A3M-sXbvDyo' },
          { id: 2, title: 'Common Pests Identification', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/pZeImTJjjU8', youtubeId: 'pZeImTJjjU8' },
          { id: 3, title: 'Beneficial Insects Overview', duration: '20 min', completed: false, videoUrl: 'https://www.youtube.com/embed/mlgZRQFV3Sw', youtubeId: 'mlgZRQFV3Sw' },
          { id: 4, title: 'Pest Scouting & Monitoring', duration: '26 min', completed: false, videoUrl: 'https://www.youtube.com/embed/qPJJP_Sp8Io', youtubeId: 'qPJJP_Sp8Io' },
          { id: 5, title: 'IPM (Integrated Pest Management)', duration: '28 min', completed: false, videoUrl: 'https://www.youtube.com/embed/7vDOqkq-QmY', youtubeId: '7vDOqkq-QmY' },
          { id: 6, title: 'Chemical Treatment Guide', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/Vx6JZ4yCg0A', youtubeId: 'Vx6JZ4yCg0A' },
          { id: 7, title: 'Organic Pest Control', duration: '27 min', completed: false, videoUrl: 'https://www.youtube.com/embed/taSx8OtPl5U', youtubeId: 'taSx8OtPl5U' },
          { id: 8, title: 'Prevention Techniques', duration: '23 min', completed: false, videoUrl: 'https://www.youtube.com/embed/j5kB4sKEarU', youtubeId: 'j5kB4sKEarU' },
          { id: 9, title: 'Disease Management', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/DlMkHDt0V3c', youtubeId: 'DlMkHDt0V3c' },
          { id: 10, title: 'Case Studies & Quiz', duration: '21 min', completed: false, videoUrl: 'https://www.youtube.com/embed/xvL9gXGLKhw', youtubeId: 'xvL9gXGLKhw' }
        ]
      },
      {
        id: 5,
        title: 'Crop Rotation Planning',
        category: 'Crop Management',
        level: 'Intermediate',
        duration: '4 weeks',
        instructor: 'Govind Sharma',
        rating: 4.5,
        students: 1234,
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=250&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=450&fit=crop',
        description: 'Plan effective crop rotation to improve soil health and yield.',
        modules: [
          { id: 1, title: 'Rotation Principles', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/1q2efRJFBRo', youtubeId: '1q2efRJFBRo' },
          { id: 2, title: 'Crop Family Classifications', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/kj2TrSLBFRo', youtubeId: 'kj2TrSLBFRo' },
          { id: 3, title: 'Soil Health Through Rotation', duration: '26 min', completed: false, videoUrl: 'https://www.youtube.com/embed/w0HrfZG1YC4', youtubeId: 'w0HrfZG1YC4' },
          { id: 4, title: 'Planning Tools & Maps', duration: '23 min', completed: false, videoUrl: 'https://www.youtube.com/embed/nQF7G6EJPbg', youtubeId: 'nQF7G6EJPbg' },
          { id: 5, title: 'Legume Crops in Rotation', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/l71oj1vMBH4', youtubeId: 'l71oj1vMBH4' },
          { id: 6, title: 'Cover Crops Benefits', duration: '21 min', completed: false, videoUrl: 'https://www.youtube.com/embed/T2Fx3rTsVNI', youtubeId: 'T2Fx3rTsVNI' },
          { id: 7, title: 'Market Considerations', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/d3UqXSIgpQs', youtubeId: 'd3UqXSIgpQs' },
          { id: 8, title: 'Profitability Analysis', duration: '27 min', completed: false, videoUrl: 'https://www.youtube.com/embed/YFJhBv8fNAg', youtubeId: 'YFJhBv8fNAg' },
          { id: 9, title: 'Crop Rotation Examples', duration: '29 min', completed: false, videoUrl: 'https://www.youtube.com/embed/ZNVm2v90FmA', youtubeId: 'ZNVm2v90FmA' },
          { id: 10, title: 'Quiz & Planning Exercise', duration: '30 min', completed: false, videoUrl: 'https://www.youtube.com/embed/q3AzCtqDzXQ', youtubeId: 'q3AzCtqDzXQ' }
        ]
      },
      {
        id: 6,
        title: 'Government Schemes & Subsidies',
        category: 'Schemes',
        level: 'Beginner',
        duration: '2 weeks',
        instructor: 'Anita Verma',
        rating: 4.6,
        students: 3450,
        image: 'https://images.unsplash.com/photo-1551632786-e91435c562fa?w=400&h=250&fit=crop',
        videoThumbnail: 'https://images.unsplash.com/photo-1551632786-e91435c562fa?w=800&h=450&fit=crop',
        description: 'Understand and access government schemes for farmers.',
        modules: [
          { id: 1, title: 'Overview of Government Support', duration: '20 min', completed: false, videoUrl: 'https://www.youtube.com/embed/Lxs5Yw7iMpE', youtubeId: 'Lxs5Yw7iMpE' },
          { id: 2, title: 'Major Government Schemes', duration: '22 min', completed: false, videoUrl: 'https://www.youtube.com/embed/qKqKXW-7cKk', youtubeId: 'qKqKXW-7cKk' },
          { id: 3, title: 'PM-Kisan Scheme Details', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/8zNqvAI-Ywc', youtubeId: '8zNqvAI-Ywc' },
          { id: 4, title: 'Agricultural Insurance Schemes', duration: '26 min', completed: false, videoUrl: 'https://www.youtube.com/embed/gk94RZqxWlc', youtubeId: 'gk94RZqxWlc' },
          { id: 5, title: 'Credit Guarantee Schemes', duration: '23 min', completed: false, videoUrl: 'https://www.youtube.com/embed/U8qYZDmpLq0', youtubeId: 'U8qYZDmpLq0' },
          { id: 6, title: 'Applications & Documentation', duration: '25 min', completed: false, videoUrl: 'https://www.youtube.com/embed/aHO3eFxNH-k', youtubeId: 'aHO3eFxNH-k' },
          { id: 7, title: 'Online Application Process', duration: '21 min', completed: false, videoUrl: 'https://www.youtube.com/embed/fB0MvVKUdAk', youtubeId: 'fB0MvVKUdAk' },
          { id: 8, title: 'Subsidy Claims & Benefits', duration: '27 min', completed: false, videoUrl: 'https://www.youtube.com/embed/lVeq-WGfLqc', youtubeId: 'lVeq-WGfLqc' },
          { id: 9, title: 'Troubleshooting Common Issues', duration: '24 min', completed: false, videoUrl: 'https://www.youtube.com/embed/pZeImTJjjU8', youtubeId: 'pZeImTJjjU8' },
          { id: 10, title: 'Q&A Session with Experts', duration: '20 min', completed: false, videoUrl: 'https://www.youtube.com/embed/mlgZRQFV3Sw', youtubeId: 'mlgZRQFV3Sw' }
        ]
      }
    ];
    setAllCourses(defaultCourses);
    localStorage.setItem('lmsCourses', JSON.stringify(defaultCourses));
  };

  const getRecommendedCourses = () => {
    // Simple recommendation algorithm based on category preference
    if (userProfile?.preferredCategory) {
      return allCourses.filter(c => c.category === userProfile.preferredCategory).slice(0, 3);
    }
    return allCourses.slice(0, 3);
  };

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(allCourses.map(c => c.category))];

  const handleCourseClick = (courseId) => {
    navigate(`/lms/course/${courseId}`);
  };

  const handleUploadVideo = () => {
    navigate('/lms/upload-content');
  };

  const handleProfileSetup = () => {
    navigate('/lms/profile');
  };

  return (
    <div className="lms-container">
      {/* Header */}
      <div className="lms-header">
        <div className="lms-header-content">
          <div>
            <h1 className="lms-title">🎓 AgriGrow Learning Academy</h1>
            <p className="lms-subtitle">Learn farming at your own pace with expert guidance</p>
          </div>
          <div className="lms-header-actions">
            {!userProfile && (
              <button onClick={handleProfileSetup} className="btn-primary">
                <span className="material-symbols-outlined">person_add</span>
                Complete Profile
              </button>
            )}
            <button onClick={handleUploadVideo} className="btn-secondary">
              <span className="material-symbols-outlined">video_library</span>
              Upload Course
            </button>
          </div>
        </div>
      </div>

      {/* User Profile Banner */}
      {userProfile && (
        <div className="profile-banner">
          <div className="profile-info">
            <h3>Welcome, {userProfile.name || 'Farmer'}! 👋</h3>
            <p>Crop: {userProfile.crop} | Location: {userProfile.location} | Level: {userProfile.experience}</p>
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">
                {Object.values(userProgress).filter(p => p.coursesCompleted).length || 0}
              </span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-value">
                {Object.values(userProgress).reduce((sum, p) => sum + (p.totalHours || 0), 0)}
              </span>
              <span className="stat-label">Hours Learned</span>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="lms-search-section">
        <div className="search-box">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      {userProfile && (
        <div className="lms-section">
          <h2 className="section-title">📚 Recommended For You</h2>
          <div className="courses-grid">
            {getRecommendedCourses().map(course => (
              <div
                key={course.id}
                className="course-card recommended"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="course-image">
                  <img src={course.videoThumbnail || course.image} alt={course.title} />
                  <div className="play-button-overlay">
                    <span className="material-symbols-outlined">play_circle</span>
                  </div>
                  <span className="course-level">{course.level}</span>
                  <span className="course-duration-badge">📹 {course.modules?.[0]?.duration || course.duration}</span>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-instructor">👨‍🏫 {course.instructor}</p>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span className="course-rating">⭐ {course.rating}</span>
                    <span className="course-students">👥 {(course.students / 1000).toFixed(1)}K students</span>
                  </div>
                  <div className="course-footer">
                    <span>{course.modules?.length || 0} Modules</span>
                    <span>{course.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Courses */}
      <div className="lms-section">
        <h2 className="section-title">
          📖 All Courses ({filteredCourses.length})
        </h2>
        {filteredCourses.length > 0 ? (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="course-image">
                  <img src={course.videoThumbnail || course.image} alt={course.title} />
                  <div className="play-button-overlay">
                    <span className="material-symbols-outlined">play_circle</span>
                  </div>
                  <span className="course-level">{course.level}</span>
                  <span className="course-duration-badge">📹 {course.modules?.[0]?.duration || course.duration}</span>
                </div>
                <div className="course-content">
                  <h3>{course.title}</h3>
                  <p className="course-instructor">👨‍🏫 {course.instructor}</p>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span className="course-rating">⭐ {course.rating}</span>
                    <span className="course-students">👥 {(course.students / 1000).toFixed(1)}K students</span>
                  </div>
                  <div className="course-footer">
                    <span>{course.modules?.length || 0} Modules</span>
                    <span>{course.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <span className="material-symbols-outlined">search_off</span>
            <p>No courses found. Try a different search.</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose AgriGrow LMS?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="material-symbols-outlined">videocam</span>
            <h3>Video Learning</h3>
            <p>Expert-led video courses with step-by-step guidance</p>
          </div>
          <div className="feature-card">
            <span className="material-symbols-outlined">schedule</span>
            <h3>Learn at Your Pace</h3>
            <p>Flexible scheduling - learn whenever you want</p>
          </div>
          <div className="feature-card">
            <span className="material-symbols-outlined">assessment</span>
            <h3>Assessments</h3>
            <p>Quiz and practical assignments after each module</p>
          </div>
          <div className="feature-card">
            <span className="material-symbols-outlined">card_membership</span>
            <h3>Certificates</h3>
            <p>Earn recognized certificates on completion</p>
          </div>
          <div className="feature-card">
            <span className="material-symbols-outlined">language</span>
            <h3>Multilingual</h3>
            <p>Available in regional languages</p>
          </div>
          <div className="feature-card">
            <span className="material-symbols-outlined">get_app</span>
            <h3>Offline Access</h3>
            <p>Download courses for offline learning</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LmsMain;
