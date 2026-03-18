import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Contexts';
import '../styles/CourseLibrary.css';

/**
 * Course Library - Browse and search all available courses
 * Features: filtering by category/level, search, recommendations
 */
const CourseLibrary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const [error, setError] = useState(null);

  const categories = [
    'All Categories',
    'Soil Health',
    'Irrigation',
    'Pest Control',
    'Crop Management',
    'Organic Farming',
    'Market',
    'Weather',
    'Technology'
  ];

  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/lms/courses?category=${selectedCategory === 'all' ? '' : selectedCategory}&level=${selectedLevel === 'all' ? '' : selectedLevel}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to load courses');
        const data = await response.json();
        setCourses(data.courses || []);
        
        // Track enrolled courses
        const enrolled = new Set(
          (data.enrolled_course_ids || []).map(id => id.toString())
        );
        setEnrolledCourseIds(enrolled);
        
        setError(null);
      } catch (err) {
        console.error('Courses error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchCourses();
  }, [user, selectedCategory, selectedLevel]);

  // Filter and sort courses
  useEffect(() => {
    let result = [...courses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'duration':
        result.sort((a, b) => (a.duration_hours || 0) - (b.duration_hours || 0));
        break;
      default: // recommended
        result.sort((a, b) => (b.is_recommended ? 1 : 0) - (a.is_recommended ? 1 : 0));
    }

    setFilteredCourses(result);
  }, [courses, searchQuery, sortBy]);

  const handleEnroll = async (courseId) => {
    try {
      const response = await fetch(`/api/lms/enrollment/${courseId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) throw new Error('Enrollment failed');
      
      // Update enrolled courses
      setEnrolledCourseIds(prev => new Set([...prev, courseId.toString()]));
      
      // Show success message
      alert('Successfully enrolled in course!');
    } catch (err) {
      console.error('Enrollment error:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleContinueLeaning = (courseId) => {
    navigate(`/lms/course/${courseId}`);
  };

  if (error) {
    return (
      <div className="course-library error">
        <div className="error-box">
          <h2>⚠️ Error Loading Courses</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-library">
      {/* Header */}
      <div className="library-header">
        <h1>🎓 Course Library</h1>
        <p>Discover agricultural courses tailored to your farming needs</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search courses by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            <option value="Soil Health">Soil Health</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Pest Control">Pest Control</option>
            <option value="Crop Management">Crop Management</option>
            <option value="Organic Farming">Organic Farming</option>
            <option value="Market">Market</option>
            <option value="Weather">Weather</option>
            <option value="Technology">Technology</option>
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="recommended">Recommended</option>
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
            <option value="duration">Duration</option>
          </select>
        </div>

        <div className="results-info">
          <p>{filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading courses...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="courses-grid">
          {filteredCourses.map(course => {
            const isEnrolled = enrolledCourseIds.has(course.id.toString());
            const isRecommended = course.is_recommended;

            return (
              <div key={course.id} className="course-card">
                {isRecommended && (
                  <div className="recommended-badge">⭐ Recommended</div>
                )}

                {/* Course Image */}
                <div
                  className="course-image"
                  style={{
                    backgroundImage: `url('${course.image_url || '/default-course.jpg'}')`
                  }}
                >
                  <div className="course-overlay">
                    <span className="course-level">{course.level}</span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  
                  <p className="course-instructor">by {course.instructor}</p>
                  
                  <p className="course-description">{course.description.substring(0, 100)}...</p>

                  {/* Course Meta */}
                  <div className="course-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📚</span>
                      <span>{course.module_count || 0} modules</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      <span>{course.duration_hours || 0} hours</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">⭐</span>
                      <span>{Number(course.rating || 0).toFixed(1)}/5</span>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="course-category">
                    <span className="category-badge">{course.category}</span>
                  </div>

                  {/* Learning Objectives */}
                  <div className="learning-objectives">
                    <p><strong>You'll learn:</strong></p>
                    <ul>
                      {course.learning_objectives?.slice(0, 2).map((obj, idx) => (
                        <li key={idx}>✓ {obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="course-actions">
                    {isEnrolled ? (
                      <button
                        className="btn-success enrolled"
                        onClick={() => handleContinueLeaning(course.id)}
                      >
                        ✓ Enrolled - Continue Learning
                      </button>
                    ) : (
                      <button
                        className="btn-primary enroll"
                        onClick={() => handleEnroll(course.id)}
                      >
                        Enroll Now →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>🔍 No courses found matching your criteria</p>
          <p>Try adjusting your filters or search terms</p>
          <button
            className="btn-secondary"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedLevel('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseLibrary;
