import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseAssessment from './CourseAssessment';
import Certificate from './Certificate';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [course, setCourse] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [progress, setProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [videoWatched, setVideoWatched] = useState({});
  const [videoPlaying, setVideoPlaying] = useState({});
  const [watchProgress, setWatchProgress] = useState({});
  const [videoQuality, setVideoQuality] = useState('720p');
  const [autoplay, setAutoplay] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const [likes, setLikes] = useState({});
  const [dislikes, setDislikes] = useState({});
  const [userLiked, setUserLiked] = useState(false);
  const [userDisliked, setUserDisliked] = useState(false);
  const [watchHistory, setWatchHistory] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  useEffect(() => {
    const courses = JSON.parse(localStorage.getItem('lmsCourses') || '[]');
    const foundCourse = courses.find(c => c.id === parseInt(courseId));
    if (foundCourse) {
      setCourse(foundCourse);
      setActiveModule(foundCourse.modules[0]);
      calculateProgress(foundCourse);
      
      // Load video watching data
      const savedVideoData = localStorage.getItem(`course_${courseId}_videoWatched`);
      if (savedVideoData) {
        setVideoWatched(JSON.parse(savedVideoData));
      }
    }
  }, [courseId]);

  const handleCertificateEarned = (event) => {
    setSelectedCertificate(event.detail);
    setShowAssessment(false);
  };

  useEffect(() => {
    window.addEventListener('certificateEarned', handleCertificateEarned);
    return () => {
      window.removeEventListener('certificateEarned', handleCertificateEarned);
    };
  }, []);

  const calculateProgress = (courseData) => {
    const completed = courseData.modules.filter(m => m.completed).length;
    const percentage = Math.round((completed / courseData.modules.length) * 100);
    setProgress(percentage);
  };

  const handleVideoTimeUpdate = (moduleId) => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      
      // Update current time state
      setCurrentTime(current);
      
      // Update duration if not set
      if (duration && videoDuration === 0) {
        setVideoDuration(duration);
      }
      
      const percentage = duration > 0 ? (current / duration) * 100 : 0;
      
      setWatchProgress(prev => ({
        ...prev,
        [moduleId]: percentage
      }));

      // Track watch history
      setWatchHistory(prev => ({
        ...prev,
        [moduleId]: new Date().toISOString()
      }));

      // Mark as watched if 80% watched
      if (percentage >= 80 && !videoWatched[moduleId]) {
        markVideoAsWatched(moduleId);
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (autoplay && activeModule) {
      const currentIndex = course.modules.findIndex(m => m.id === activeModule.id);
      const nextIndex = currentIndex + 1;
      if (nextIndex < course.modules.length) {
        setActiveModule(course.modules[nextIndex]);
        setShowQuiz(false);
        setVideoDuration(0);
        setCurrentTime(0);
        setTimeout(() => videoRef.current?.play(), 500);
      } else {
        // Course completed - show option to take assessment
        const completedMessage = '✅ You have completed all videos in this course!\n\nWould you like to take the assessment to earn a certificate?';
        if (window.confirm(completedMessage)) {
          setShowAssessment(true);
        }
      }
    }
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    if (userLiked) {
      setUserLiked(false);
      setLikes(prev => ({
        ...prev,
        [activeModule.id]: (prev[activeModule.id] || 0) - 1
      }));
    } else {
      setUserLiked(true);
      if (userDisliked) setUserDisliked(false);
      setLikes(prev => ({
        ...prev,
        [activeModule.id]: (prev[activeModule.id] || 0) + 1
      }));
      setDislikes(prev => ({
        ...prev,
        [activeModule.id]: Math.max(0, (prev[activeModule.id] || 0) - 1)
      }));
    }
  };

  const handleDislike = () => {
    if (userDisliked) {
      setUserDisliked(false);
      setDislikes(prev => ({
        ...prev,
        [activeModule.id]: (prev[activeModule.id] || 0) - 1
      }));
    } else {
      setUserDisliked(true);
      if (userLiked) setUserLiked(false);
      setDislikes(prev => ({
        ...prev,
        [activeModule.id]: (prev[activeModule.id] || 0) + 1
      }));
      setLikes(prev => ({
        ...prev,
        [activeModule.id]: Math.max(0, (prev[activeModule.id] || 0) - 1)
      }));
    }
  };

  const handleShare = () => {
    const shareText = `Check out "${activeModule.title}" from ${course.title} on AgriGrow LMS! 🎓`;
    if (navigator.share) {
      navigator.share({
        title: activeModule.title,
        text: shareText,
        url: window.location.href
      }).catch(err => console.log('Share error:', err));
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert('✅ Link copied to clipboard!');
    }
  };

  const markVideoAsWatched = (moduleId) => {
    setVideoWatched(prev => {
      const updated = { ...prev, [moduleId]: true };
      localStorage.setItem(`course_${courseId}_videoWatched`, JSON.stringify(updated));
      return updated;
    });
  };

  const isVideoWatched = (moduleId) => {
    return videoWatched[moduleId] === true;
  };

  const getCompletionRequirement = () => {
    if (!course) return 0;
    const watchedCount = course.modules.filter(m => isVideoWatched(m.id)).length;
    return Math.round((watchedCount / course.modules.length) * 100);
  };

  const handleModuleComplete = () => {
    if (!course || !activeModule) return;

    // Check if video is watched first
    if (!isVideoWatched(activeModule.id)) {
      alert('⚠️ Please watch the video (80% completion) before marking as complete');
      return;
    }

    const updatedCourse = { ...course };
    const moduleIndex = updatedCourse.modules.findIndex(m => m.id === activeModule.id);
    updatedCourse.modules[moduleIndex].completed = true;

    setCourse(updatedCourse);
    setActiveModule(updatedCourse.modules[moduleIndex]);

    // Update localStorage
    const courses = JSON.parse(localStorage.getItem('lmsCourses') || '[]');
    const courseIndex = courses.findIndex(c => c.id === course.id);
    courses[courseIndex] = updatedCourse;
    localStorage.setItem('lmsCourses', JSON.stringify(courses));

    calculateProgress(updatedCourse);

    // Move to next module
    const nextModuleIndex = moduleIndex + 1;
    if (nextModuleIndex < updatedCourse.modules.length) {
      setActiveModule(updatedCourse.modules[nextModuleIndex]);
      setShowQuiz(false);
    }
  };

  const handleModuleClick = (module) => {
    setActiveModule(module);
    setShowQuiz(false);
    setQuizSubmitted(false);
    setVideoDuration(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    // Require video to be watched before taking quiz
    if (!isVideoWatched(activeModule.id)) {
      alert('⚠️ Please watch the video (80% completion) before taking the quiz!');
      return;
    }

    setQuizSubmitted(true);
    // Calculate score
    const correctAnswers = {
      1: 'loam',
      2: true,
      3: 'nitrogen, phosphorus, potassium'
    };

    const score = Object.keys(quizAnswers).filter(
      q => quizAnswers[q] === correctAnswers[q]
    ).length;

    const percentage = (score / Object.keys(correctAnswers).length) * 100;
    
    if (percentage >= 70) {
      handleModuleComplete();
      alert(`✅ Quiz passed! Score: ${percentage.toFixed(0)}%`);
    } else {
      alert(`❌ Quiz score: ${percentage.toFixed(0)}%. Try again!`);
    }
  };

  const handleDownloadCourse = async () => {
    try {
      const courseContent = {
        title: course.title,
        description: course.description,
        modules: course.modules,
        downloadedAt: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(courseContent, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${course.title.replace(/\s+/g, '_')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('Course downloaded for offline access!');
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleCertificate = () => {
    // Require all videos to be watched (80% watched)
    const allVideosWatched = course.modules.every(m => isVideoWatched(m.id));
    
    if (allVideosWatched && progress === 100) {
      navigate('/lms/certificate', { state: { courseId: course.id, courseName: course.title } });
    } else if (!allVideosWatched) {
      alert('⚠️ Please watch all course videos (80% of each) to earn the certificate!');
    } else {
      alert('⚠️ Complete all modules and quizzes to earn the certificate!');
    }
  };

  if (!course) {
    return <div className="course-loading">Loading course...</div>;
  }

  const quizQuestions = [
    {
      id: 1,
      question: 'What type of soil is ideal for most crops?',
      options: ['sand', 'loam', 'clay', 'silt'],
      correct: 'loam'
    },
    {
      id: 2,
      question: 'Is regular soil testing important?',
      options: ['Yes', 'No'],
      correct: true
    },
    {
      id: 3,
      question: 'What are the three primary nutrients in NPK?',
      options: ['nitrogen, phosphorus, potassium', 'neon, phosphorus, potash'],
      correct: 'nitrogen, phosphorus, potassium'
    }
  ];

  return (
    <div className="course-detail-container">
      {/* Course Header */}
      <div className="course-header">
        <button onClick={() => navigate('/lms')} className="btn-back">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Courses
        </button>
        <div className="course-header-content">
          <div>
            <h1>{course.title}</h1>
            <p className="course-instructor">By {course.instructor}</p>
          </div>
          <div className="course-header-stats">
            <div className="stat">
              <span className="stat-label">Progress</span>
              <span className="stat-value">{progress}%</span>
            </div>
            <div className="stat">
              <span className="stat-label">Rating</span>
              <span className="stat-value">⭐ {course.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <span className="progress-text">{progress}% Complete</span>
          </div>
        </div>
        <p className="progress-info">
          {course.modules.filter(m => m.completed).length} of {course.modules.length} modules completed
        </p>
        <p className="progress-info video-progress-info">
          📹 Videos watched: {course.modules.filter(m => isVideoWatched(m.id)).length} of {course.modules.length} ({getCompletionRequirement()}%)
        </p>
      </div>

      <div className="course-main-content">
        {/* Sidebar - Module List */}
        <div className="modules-sidebar">
          <h3>📚 Course Modules</h3>
          <div className="modules-list">
            {course.modules.map((module, index) => (
              <div
                key={module.id}
                className={`module-item ${activeModule?.id === module.id ? 'active' : ''} ${
                  module.completed ? 'completed' : ''
                }`}
                onClick={() => handleModuleClick(module)}
              >
                <div className="module-number">{index + 1}</div>
                <div className="module-info">
                  <h4>{module.title}</h4>
                  <span className="module-duration">⏱️ {module.duration}</span>
                </div>
                {module.completed && (
                  <span className="material-symbols-outlined check-icon">check_circle</span>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Actions */}
          <div className="sidebar-actions">
            <button onClick={handleDownloadCourse} className="btn-download">
              <span className="material-symbols-outlined">download</span>
              Download Course
            </button>
            <button 
              onClick={handleCertificate} 
              className={`btn-certificate ${(progress < 100 || !course.modules.every(m => isVideoWatched(m.id))) ? 'disabled' : ''}`}
              disabled={(progress < 100 || !course.modules.every(m => isVideoWatched(m.id)))}
            >
              <span className="material-symbols-outlined">card_membership</span>
              {course.modules.every(m => isVideoWatched(m.id)) && progress === 100 ? 'Get Certificate 🎓' : 'Get Certificate'}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="course-content-area">
          {!showQuiz ? (
            <>
              {/* Module Content */}
              <div className="module-content">
                <img src={course.image} alt={course.title} className="module-image" />
                
                <div className="module-details">
                  <h2>{activeModule.title}</h2>
                  <div className="module-meta">
                    <span>⏱️ Duration: {activeModule.duration}</span>
                    <span>📖 Module {course.modules.findIndex(m => m.id === activeModule.id) + 1}</span>
                  </div>

                  <div className="module-description">
                    <h3>About This Module</h3>
                    <p>
                      This module covers important aspects of {activeModule.title.toLowerCase()}. 
                      You'll learn practical techniques and best practices that you can apply directly to your farm.
                    </p>

                    <h4>What You'll Learn:</h4>
                    <ul>
                      <li>Fundamental concepts and principles</li>
                      <li>Hands-on practical applications</li>
                      <li>Common challenges and solutions</li>
                      <li>Best practices from experienced farmers</li>
                    </ul>

                    <h4>Video Content:</h4>
                    <div className="video-container-youtube">
                      {/* Main Video Player */}
                      <div className="video-player-wrapper">
                        <video
                          ref={videoRef}
                          className="video-player"
                          onPlay={() => {
                            setVideoPlaying(prev => ({ ...prev, [activeModule.id]: true }));
                            setIsPlaying(true);
                          }}
                          onPause={() => {
                            setVideoPlaying(prev => ({ ...prev, [activeModule.id]: false }));
                            setIsPlaying(false);
                          }}
                          onTimeUpdate={() => handleVideoTimeUpdate(activeModule.id)}
                          onLoadedMetadata={handleVideoLoadedMetadata}
                          onEnded={handleVideoEnded}
                          poster={course.videoThumbnail || course.image}
                        >
                          <source src={activeModule.videoUrl || `https://commondatastorage.googleapis.com/gtv-videos-library/sample/${activeModule.id % 2 === 0 ? 'ForBiggerBlazes.mp4' : 'ElephantsDream.mp4'}`} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        
                        {/* Play/Pause Overlay Button */}
                        <button 
                          className="video-play-button-overlay"
                          onClick={togglePlayPause}
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          <span className="material-symbols-outlined">
                            {isPlaying ? 'pause_circle' : 'play_circle'}
                          </span>
                        </button>
                        
                        {/* Video Duration Display */}
                        <div className="video-duration-display">
                          <span className="current-time">{formatTime(currentTime)}</span>
                          <span className="time-separator">/</span>
                          <span className="total-duration">{formatTime(videoDuration)}</span>
                        </div>
                      </div>

                      {/* Video Metadata */}
                      <div className="video-metadata">
                        <div className="video-title-section">
                          <h3>{activeModule.title}</h3>
                          <div className="video-stats">
                            <span className="video-instructor">📌 {course.instructor}</span>
                            <span className="video-duration">
                              ⏱️ {videoDuration > 0 ? formatTime(videoDuration) : activeModule.duration}
                            </span>
                            <span className="video-rating">⭐ {course.rating}/5.0</span>
                          </div>
                          {/* Video Time Display */}
                          <div className="video-time-tracker">
                            <span className="time-info">
                              Current: <strong>{formatTime(currentTime)}</strong> / Total: <strong>{formatTime(videoDuration)}</strong>
                            </span>
                            <span className={`playback-status ${isPlaying ? 'playing' : 'paused'}`}>
                              {isPlaying ? '▶️ Playing' : '⏸️ Paused'}
                            </span>
                          </div>
                        </div>

                        {/* Video Progress */}
                        <div className="video-progress-section">
                          <div className="watch-progress-bar-large">
                            <div 
                              className="watch-progress-fill-large" 
                              style={{ width: `${watchProgress[activeModule.id] || 0}%` }}
                            ></div>
                          </div>
                          <div className="progress-details">
                            <span>{Math.round(watchProgress[activeModule.id] || 0)}% watched</span>
                            {isVideoWatched(activeModule.id) && (
                              <span className="video-watched-badge">✓ Watched</span>
                            )}
                          </div>
                        </div>

                        {/* Quality & Autoplay Controls */}
                        <div className="video-controls">
                          <div className="quality-control">
                            <label>Quality:</label>
                            <select value={videoQuality} onChange={(e) => setVideoQuality(e.target.value)}>
                              <option value="360p">360p</option>
                              <option value="480p">480p</option>
                              <option value="720p">720p (Default)</option>
                              <option value="1080p">1080p</option>
                            </select>
                          </div>
                          <label className="autoplay-control">
                            <input 
                              type="checkbox" 
                              checked={autoplay} 
                              onChange={(e) => setAutoplay(e.target.checked)}
                            />
                            Autoplay next video
                          </label>
                        </div>

                        {/* YouTube-like Actions */}
                        <div className="video-actions">
                          <button 
                            className={`action-btn like-btn ${userLiked ? 'active' : ''}`}
                            onClick={handleLike}
                            title="Like this video"
                          >
                            <span className="material-symbols-outlined">thumb_up</span>
                            <span className="action-count">{likes[activeModule.id] || 0}</span>
                          </button>
                          <button 
                            className={`action-btn dislike-btn ${userDisliked ? 'active' : ''}`}
                            onClick={handleDislike}
                            title="Dislike this video"
                          >
                            <span className="material-symbols-outlined">thumb_down</span>
                            <span className="action-count">{dislikes[activeModule.id] || 0}</span>
                          </button>
                          <button 
                            className="action-btn share-btn"
                            onClick={handleShare}
                            title="Share this video"
                          >
                            <span className="material-symbols-outlined">share</span>
                            <span>Share</span>
                          </button>
                          <button 
                            className="action-btn save-btn"
                            title="Save to watch later"
                          >
                            <span className="material-symbols-outlined">bookmark</span>
                            <span>Save</span>
                          </button>
                        </div>

                        {/* Description Section */}
                        <div className="video-description-section">
                          <div className="description-header">
                            <h4>About this video</h4>
                            <button 
                              className="show-more-btn"
                              onClick={() => setShowDescription(!showDescription)}
                            >
                              {showDescription ? 'Show less' : 'Show more'}
                            </button>
                          </div>
                          <p className={`description-text ${showDescription ? 'expanded' : ''}`}>
                            This comprehensive video covers {activeModule.title.toLowerCase()} techniques. 
                            Learn practical methods from {course.instructor} that you can implement immediately on your farm. 
                            This module is part of the "{course.title}" course and includes hands-on demonstrations, 
                            common challenges, and proven solutions for maximum crop yield improvement.
                          </p>
                        </div>
                      </div>

                      {/* Video Info */}
                      <div className="video-info">
                        <div className="video-title">
                          <span className="material-symbols-outlined">videocam</span>
                          <span>{activeModule.title}</span>
                        </div>
                        
                        {isVideoWatched(activeModule.id) ? (
                          <div className="video-status-watched">
                            <span className="material-symbols-outlined">check_circle</span>
                            Video watched ✓
                          </div>
                        ) : (
                          <div className="video-status-pending">
                            <span className="material-symbols-outlined">info</span>
                            Watch 80% of the video to mark as complete
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Module Actions */}
                  <div className="module-actions">
                    {activeModule.title.includes('Quiz') ? (
                      <button 
                        onClick={() => {
                          if (!isVideoWatched(activeModule.id)) {
                            alert('⚠️ Please watch the video first!');
                            return;
                          }
                          setShowQuiz(true);
                        }} 
                        className={`btn-primary full-width ${!isVideoWatched(activeModule.id) ? 'disabled' : ''}`}
                        disabled={!isVideoWatched(activeModule.id)}
                      >
                        {isVideoWatched(activeModule.id) ? 'Take Quiz ✓' : '▶ Watch Video First'}
                      </button>
                    ) : (
                      <>
                        {activeModule.completed && (
                          <span className="module-completed">✓ Completed</span>
                        )}
                        <button 
                          onClick={handleModuleComplete}
                          className={`btn-primary full-width ${!isVideoWatched(activeModule.id) ? 'disabled' : ''}`}
                          disabled={!isVideoWatched(activeModule.id) || activeModule.completed}
                        >
                          {activeModule.completed ? 'Module Completed ✓' : isVideoWatched(activeModule.id) ? 'Mark as Complete' : '⏱️ Watch Video (80%)'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Quiz Section */}
              <div className="quiz-section">
                <h2>quiz: {activeModule.title}</h2>
                <p className="quiz-instructions">
                  Answer all questions to complete this module. You need 70% to pass!
                </p>

                <div className="quiz-questions">
                  {quizQuestions.map((question, index) => (
                    <div key={question.id} className="quiz-question">
                      <h4>{index + 1}. {question.question}</h4>
                      <div className="quiz-options">
                        {question.options.map((option, optIndex) => (
                          <label key={optIndex} className="quiz-option">
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              onChange={() => handleQuizAnswer(question.id, option)}
                              checked={quizAnswers[question.id] === option}
                              disabled={quizSubmitted}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!quizSubmitted && (
                  <button onClick={handleSubmitQuiz} className="btn-primary full-width">
                    Submit Quiz
                  </button>
                )}

                {quizSubmitted && (
                  <div className="quiz-result">
                    <p>Quiz submitted! Check your score above.</p>
                    <button 
                      onClick={() => setShowQuiz(false)}
                      className="btn-secondary full-width"
                    >
                      Back to Module
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Course Assessment Modal */}
      {showAssessment && course && (
        <CourseAssessment 
          courseId={course.id.toString()} 
          userId={JSON.parse(localStorage.getItem('lmsUserProfile') || '{}').name}
          onClose={() => setShowAssessment(false)}
        />
      )}

      {/* Certificate Display Modal */}
      {selectedCertificate && (
        <Certificate 
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}
    </div>
  );
};

export default CourseDetail;
