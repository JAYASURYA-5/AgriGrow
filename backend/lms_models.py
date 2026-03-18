"""
LMS Models for AgriGrow
Defines database models for learning management system
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class UserProfile(db.Model):
    """Extended user profile for LMS personalization"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=False)
    
    # Profile Information
    phone = db.Column(db.String(20))
    location = db.Column(db.String(255))
    state = db.Column(db.String(100))
    crop_type = db.Column(db.String(100))
    experience_level = db.Column(db.String(50), default='Beginner')  # Beginner, Intermediate, Advanced
    land_size = db.Column(db.Float)  # in acres
    preferred_language = db.Column(db.String(50), default='English')
    preferred_category = db.Column(db.String(100), default='Soil Health')
    
    # Learning Preferences
    learning_pace = db.Column(db.String(50), default='moderate')  # slow, moderate, fast
    content_type_preference = db.Column(db.JSON, default='{"video": 1, "text": 1, "infographics": 1, "tips": 1}')
    
    # Tracking
    total_hours_learned = db.Column(db.Float, default=0)
    courses_completed = db.Column(db.Integer, default=0)
    last_learning_date = db.Column(db.DateTime)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='lms_profile', uselist=False)
    enrollments = db.relationship('Enrollment', backref='profile', lazy=True, cascade='all, delete-orphan')

class Course(db.Model):
    """LMS Course"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(100), nullable=False)  # Soil Health, Irrigation, etc.
    level = db.Column(db.String(50), default='Beginner')  # Beginner, Intermediate, Advanced
    duration_weeks = db.Column(db.Integer, default=4)
    instructor = db.Column(db.String(255))
    rating = db.Column(db.Float, default=4.5)
    total_students = db.Column(db.Integer, default=0)
    thumbnail_url = db.Column(db.String(500))
    learning_objectives = db.Column(db.JSON)  # List of learning outcomes
    prerequisites = db.Column(db.JSON)  # List of prerequisite course IDs
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    modules = db.relationship('Module', backref='course', lazy=True, cascade='all, delete-orphan')
    enrollments = db.relationship('Enrollment', backref='course', lazy=True, cascade='all, delete-orphan')
    recommendations = db.relationship('CourseRecommendation', backref='course', lazy=True, cascade='all, delete-orphan')

class Module(db.Model):
    """Course Module/Lesson"""
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    sequence = db.Column(db.Integer)  # Module order in course
    duration_minutes = db.Column(db.Integer, default=15)
    learning_objectives = db.Column(db.JSON)
    
    # Content (can have multiple types)
    video_url = db.Column(db.String(500))
    video_thumbnail = db.Column(db.String(500))
    text_content = db.Column(db.Text)
    infographics_url = db.Column(db.String(500))
    download_url = db.Column(db.String(500))  # For offline access
    
    # Assessment
    has_quiz = db.Column(db.Boolean, default=False)
    required_score = db.Column(db.Integer, default=70)  # Minimum score to pass
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quizzes = db.relationship('Quiz', backref='module', lazy=True, cascade='all, delete-orphan')
    progress = db.relationship('ModuleProgress', backref='module', lazy=True, cascade='all, delete-orphan')

class Quiz(db.Model):
    """Quiz/Assessment for Module"""
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    question_count = db.Column(db.Integer)
    time_limit_minutes = db.Column(db.Integer, default=15)
    passing_score = db.Column(db.Integer, default=70)
    
    # Questions stored as JSON
    questions = db.Column(db.JSON)  # [{id, question, type, options, correct_answer, explanation}, ...]
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    responses = db.relationship('QuizResponse', backref='quiz', lazy=True, cascade='all, delete-orphan')

class QuizResponse(db.Model):
    """User's Quiz Response/Attempt"""
    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    answers = db.Column(db.JSON)  # {question_id: selected_answer}
    score = db.Column(db.Integer)
    passed = db.Column(db.Boolean)
    time_taken_minutes = db.Column(db.Integer)
    
    attempted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='quiz_responses')

class Enrollment(db.Model):
    """User enrollment in a Course"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    
    enrollment_date = db.Column(db.DateTime, default=datetime.utcnow)
    completion_date = db.Column(db.DateTime)
    status = db.Column(db.String(50), default='in_progress')  # in_progress, completed, paused
    progress_percentage = db.Column(db.Float, default=0)
    
    # Relationships
    user = db.relationship('User', backref='course_enrollments')
    module_progress = db.relationship('ModuleProgress', backref='enrollment', lazy=True, cascade='all, delete-orphan')

class ModuleProgress(db.Model):
    """User's progress in individual Module"""
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.Integer, db.ForeignKey('enrollment.id'), nullable=False)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    
    status = db.Column(db.String(50), default='not_started')  # not_started, in_progress, completed
    completion_date = db.Column(db.DateTime)
    time_spent_minutes = db.Column(db.Integer, default=0)
    last_accessed = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Quiz performance
    quiz_attempts = db.Column(db.Integer, default=0)
    best_quiz_score = db.Column(db.Integer)
    quiz_passed = db.Column(db.Boolean, default=False)

class Certificate(db.Model):
    """Course Completion Certificate"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    
    certificate_number = db.Column(db.String(50), unique=True)
    issued_date = db.Column(db.DateTime, default=datetime.utcnow)
    expiry_date = db.Column(db.DateTime)
    
    # Certificate data
    score = db.Column(db.Float)
    duration_hours = db.Column(db.Float)
    
    # Relationships
    user = db.relationship('User', backref='certificates')
    course = db.relationship('Course', backref='certificates')

class CourseRecommendation(db.Model):
    """AI-based Course Recommendations"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    
    relevance_score = db.Column(db.Float)  # 0-100 based on user profile
    reason = db.Column(db.String(255))  # Why this course is recommended
    recommendation_date = db.Column(db.DateTime, default=datetime.utcnow)
    clicked = db.Column(db.Boolean, default=False)
    enrolled = db.Column(db.Boolean, default=False)
    
    # Relationships
    user = db.relationship('User', backref='course_recommendations')

class OfflineContent(db.Model):
    """Offline-downloadable content"""
    id = db.Column(db.Integer, primary_key=True)
    module_id = db.Column(db.Integer, db.ForeignKey('module.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    file_url = db.Column(db.String(500))
    file_size_mb = db.Column(db.Float)
    content_type = db.Column(db.String(50))  # pdf, video, zip, etc.
    
    downloaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)  # Content auto-deletes after expiry
    
    # Relationships
    user = db.relationship('User', backref='downloaded_content')
    module = db.relationship('Module', backref='offline_versions')

class LearningFeedback(db.Model):
    """AI-generated feedback for user learning"""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    
    feedback_type = db.Column(db.String(50))  # performance, suggestion, encouragement
    message = db.Column(db.Text)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)
    read = db.Column(db.Boolean, default=False)
    
    # Relationships
    user = db.relationship('User', backref='learning_feedback')
    course = db.relationship('Course', backref='user_feedback')
