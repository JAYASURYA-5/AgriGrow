"""
LMS API Routes for AgriGrow
Handles all learning management system endpoints
"""

from flask import Flask, request, jsonify, Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import json
import uuid
from lms_models import (
    db, UserProfile, Course, Module, Quiz, QuizResponse, Enrollment, 
    ModuleProgress, Certificate, CourseRecommendation, OfflineContent, LearningFeedback
)

lms_bp = Blueprint('lms', __name__, url_prefix='/api/lms')

# ==================== USER PROFILE ====================

@lms_bp.route('/profile', methods=['POST'])
@jwt_required()
def create_user_profile():
    """Create/Update user profile for LMS"""
    user_id = get_jwt_identity()['id']
    data = request.json
    
    try:
        profile = UserProfile.query.filter_by(user_id=user_id).first()
        
        if not profile:
            profile = UserProfile(user_id=user_id)
        
        # Update profile fields
        profile.phone = data.get('phone')
        profile.location = data.get('location')
        profile.state = data.get('state')
        profile.crop_type = data.get('crop_type')
        profile.experience_level = data.get('experience_level', 'Beginner')
        profile.land_size = data.get('land_size')
        profile.preferred_language = data.get('preferred_language', 'English')
        profile.preferred_category = data.get('preferred_category', 'Soil Health')
        profile.learning_pace = data.get('learning_pace', 'moderate')
        
        db.session.add(profile)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'profile': {
                'crop_type': profile.crop_type,
                'experience_level': profile.experience_level,
                'location': profile.location
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@lms_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    """Get user's LMS profile"""
    user_id = get_jwt_identity()['id']
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    
    if not profile:
        return jsonify({'error': 'Profile not found'}), 404
    
    return jsonify({
        'success': True,
        'profile': {
            'crop_type': profile.crop_type,
            'experience_level': profile.experience_level,
            'location': profile.location,
            'state': profile.state,
            'land_size': profile.land_size,
            'preferred_language': profile.preferred_language,
            'preferred_category': profile.preferred_category,
            'total_hours_learned': profile.total_hours_learned,
            'courses_completed': profile.courses_completed
        }
    })

# ==================== COURSE MANAGEMENT ====================

@lms_bp.route('/courses', methods=['GET'])
def get_courses():
    """Get all available courses with filtering"""
    category = request.args.get('category')
    level = request.args.get('level')
    search = request.args.get('search')
    
    query = Course.query
    
    if category:
        query = query.filter_by(category=category)
    if level:
        query = query.filter_by(level=level)
    if search:
        query = query.filter(Course.title.ilike(f'%{search}%'))
    
    courses = query.all()
    
    return jsonify({
        'success': True,
        'courses': [{
            'id': c.id,
            'title': c.title,
            'description': c.description,
            'category': c.category,
            'level': c.level,
            'duration_weeks': c.duration_weeks,
            'instructor': c.instructor,
            'rating': c.rating,
            'students': c.total_students,
            'thumbnail': c.thumbnail_url,
            'objectives': c.learning_objectives
        } for c in courses]
    })

@lms_bp.route('/courses/<int:course_id>', methods=['GET'])
def get_course_detail(course_id):
    """Get detailed course information with modules"""
    course = Course.query.get_or_404(course_id)
    
    return jsonify({
        'success': True,
        'course': {
            'id': course.id,
            'title': course.title,
            'description': course.description,
            'category': course.category,
            'level': course.level,
            'duration_weeks': course.duration_weeks,
            'instructor': course.instructor,
            'rating': course.rating,
            'thumbnail': course.thumbnail_url,
            'objectives': course.learning_objectives,
            'prerequisites': course.prerequisites,
            'modules': [{
                'id': m.id,
                'title': m.title,
                'duration_minutes': m.duration_minutes,
                'sequence': m.sequence,
                'has_quiz': m.has_quiz
            } for m in course.modules]
        }
    })

# ==================== MODULE CONTENT ====================

@lms_bp.route('/modules/<int:module_id>', methods=['GET'])
@jwt_required()
def get_module(module_id):
    """Get module content"""
    module = Module.query.get_or_404(module_id)
    
    return jsonify({
        'success': True,
        'module': {
            'id': module.id,
            'title': module.title,
            'description': module.description,
            'duration_minutes': module.duration_minutes,
            'video_url': module.video_url,
            'video_thumbnail': module.video_thumbnail,
            'text_content': module.text_content,
            'infographics_url': module.infographics_url,
            'has_quiz': module.has_quiz
        }
    })

# ==================== PROGRESS TRACKING ====================

@lms_bp.route('/enrollment/<int:course_id>', methods=['POST'])
@jwt_required()
def enroll_course(course_id):
    """Enroll user in a course"""
    user_id = get_jwt_identity()['id']
    
    # Check if already enrolled
    existing = Enrollment.query.filter_by(user_id=user_id, course_id=course_id).first()
    if existing:
        return jsonify({'error': 'Already enrolled in this course'}), 400
    
    try:
        enrollment = Enrollment(user_id=user_id, course_id=course_id)
        db.session.add(enrollment)
        
        # Create module progress records
        course = Course.query.get(course_id)
        for module in course.modules:
            progress = ModuleProgress(enrollment_id=None, module_id=module.id)
            db.session.add(progress)
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'enrollment_id': enrollment.id
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@lms_bp.route('/progress/<int:enrollment_id>', methods=['GET'])
@jwt_required()
def get_progress(enrollment_id):
    """Get course progress"""
    enrollment = Enrollment.query.get_or_404(enrollment_id)
    
    return jsonify({
        'success': True,
        'progress': {
            'enrollment_id': enrollment.id,
            'course_id': enrollment.course_id,
            'progress_percentage': enrollment.progress_percentage,
            'status': enrollment.status,
            'enrollment_date': enrollment.enrollment_date.isoformat(),
            'modules': [{
                'module_id': m.module_id,
                'status': m.status,
                'time_spent': m.time_spent_minutes,
                'quiz_score': m.best_quiz_score,
                'quiz_passed': m.quiz_passed
            } for m in enrollment.module_progress]
        }
    })

@lms_bp.route('/progress/module/<int:module_id>', methods=['POST'])
@jwt_required()
def update_module_progress(module_id):
    """Update progress when module is accessed/completed"""
    user_id = get_jwt_identity()['id']
    data = request.json
    
    try:
        # Find enrollment and module progress
        enrollment_id = data.get('enrollment_id')
        enrollment = Enrollment.query.get(enrollment_id)
        
        if not enrollment or enrollment.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        progress = ModuleProgress.query.filter_by(
            enrollment_id=enrollment_id,
            module_id=module_id
        ).first_or_404()
        
        # Update progress
        if data.get('status'):
            progress.status = data['status']
        if data.get('time_spent'):
            progress.time_spent_minutes += data['time_spent']
        
        progress.last_accessed = datetime.utcnow()
        
        # If completed, set completion date
        if data.get('status') == 'completed' and not progress.completion_date:
            progress.completion_date = datetime.utcnow()
        
        db.session.commit()
        
        # Calculate overall progress
        total_modules = len(enrollment.module_progress)
        completed = sum(1 for m in enrollment.module_progress if m.status == 'completed')
        enrollment.progress_percentage = (completed / total_modules * 100) if total_modules > 0 else 0
        
        db.session.commit()
        
        return jsonify({'success': True})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== QUIZZES & ASSESSMENTS ====================

@lms_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    """Get quiz questions"""
    quiz = Quiz.query.get_or_404(quiz_id)
    
    return jsonify({
        'success': True,
        'quiz': {
            'id': quiz.id,
            'title': quiz.title,
            'description': quiz.description,
            'time_limit_minutes': quiz.time_limit_minutes,
            'passing_score': quiz.passing_score,
            'questions': quiz.questions
        }
    })

@lms_bp.route('/quiz/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def submit_quiz(quiz_id):
    """Submit quiz answers and get score"""
    user_id = get_jwt_identity()['id']
    data = request.json
    
    try:
        quiz = Quiz.query.get_or_404(quiz_id)
        answers = data.get('answers', {})
        time_taken = data.get('time_taken_minutes', 0)
        
        # Calculate score
        score = 0
        for question in quiz.questions:
            q_id = str(question['id'])
            if q_id in answers and answers[q_id] == question['correct_answer']:
                score += (100 / len(quiz.questions))
        
        passed = score >= quiz.passing_score
        
        # Save response
        response = QuizResponse(
            quiz_id=quiz_id,
            user_id=user_id,
            answers=answers,
            score=int(score),
            passed=passed,
            time_taken_minutes=time_taken
        )
        db.session.add(response)
        db.session.commit()
        
        # Update module progress
        module = quiz.module
        enrollments = Enrollment.query.filter_by(user_id=user_id).all()
        for enrollment in enrollments:
            progress = ModuleProgress.query.filter_by(
                enrollment_id=enrollment.id,
                module_id=module.id
            ).first()
            if progress:
                progress.quiz_attempts += 1
                progress.best_quiz_score = max(progress.best_quiz_score or 0, int(score))
                progress.quiz_passed = passed
                db.session.commit()
        
        return jsonify({
            'success': True,
            'score': int(score),
            'passed': passed,
            'passing_score': quiz.passing_score,
            'feedback': [{
                'question_id': q['id'],
                'correct_answer': q['correct_answer'],
                'explanation': q.get('explanation', '')
            } for q in quiz.questions]
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== RECOMMENDATIONS ====================

@lms_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get AI-based course recommendations"""
    user_id = get_jwt_identity()['id']
    
    profile = UserProfile.query.filter_by(user_id=user_id).first()
    if not profile:
        return jsonify({'error': 'Profile not found. Please complete profile first.'}), 400
    
    # Get user's enrolled courses
    enrolled = Enrollment.query.filter_by(user_id=user_id).all()
    enrolled_ids = [e.course_id for e in enrolled]
    
    # Get recommendations
    recommendations = CourseRecommendation.query.filter_by(user_id=user_id).order_by(
        CourseRecommendation.relevance_score.desc()
    ).limit(10).all()
    
    return jsonify({
        'success': True,
        'recommendations': [{
            'course_id': r.course_id,
            'course_title': r.course.title,
            'relevance_score': r.relevance_score,
            'reason': r.reason,
            'thumbnail': r.course.thumbnail_url
        } for r in recommendations if r.course_id not in enrolled_ids]
    })

# ==================== CERTIFICATES ====================

@lms_bp.route('/certificate/<int:course_id>', methods=['POST'])
@jwt_required()
def generate_certificate(course_id):
    """Generate certificate upon course completion"""
    user_id = get_jwt_identity()['id']
    data = request.json
    
    try:
        # Check if user completed the course
        enrollment = Enrollment.query.filter_by(
            user_id=user_id,
            course_id=course_id,
            status='completed'
        ).first()
        
        if not enrollment:
            return jsonify({'error': 'Course not completed'}), 400
        
        # Generate certificate
        certificate_number = f"AGRIGROW-{uuid.uuid4().hex[:8].upper()}"
        
        certificate = Certificate(
            user_id=user_id,
            course_id=course_id,
            certificate_number=certificate_number,
            score=enrollment.progress_percentage,
            duration_hours=enrollment.module_progress[0].time_spent_minutes / 60 if enrollment.module_progress else 0
        )
        db.session.add(certificate)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'certificate': {
                'certificate_number': certificate_number,
                'issued_date': certificate.issued_date.isoformat(),
                'score': certificate.score,
                'duration_hours': certificate.duration_hours
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@lms_bp.route('/certificates', methods=['GET'])
@jwt_required()
def get_certificates():
    """Get user's certificates"""
    user_id = get_jwt_identity()['id']
    
    certificates = Certificate.query.filter_by(user_id=user_id).all()
    
    return jsonify({
        'success': True,
        'certificates': [{
            'id': c.id,
            'course_title': c.course.title,
            'certificate_number': c.certificate_number,
            'issued_date': c.issued_date.isoformat(),
            'score': c.score
        } for c in certificates]
    })

# ==================== OFFLINE ACCESS ====================

@lms_bp.route('/offline/download/<int:module_id>', methods=['POST'])
@jwt_required()
def download_offline_content(module_id):
    """Prepare content for offline download"""
    user_id = get_jwt_identity()['id']
    
    try:
        module = Module.query.get_or_404(module_id)
        
        # Create offline content record
        offline = OfflineContent(
            module_id=module_id,
            user_id=user_id,
            content_type='zip',
            file_size_mb=100,  # Placeholder
            expires_at=datetime.utcnow() + timedelta(days=30)
        )
        db.session.add(offline)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'download_id': offline.id,
            'content': {
                'title': module.title,
                'text': module.text_content,
                'video_url': module.video_url,
                'resources': [module.infographics_url] if module.infographics_url else []
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ==================== STATISTICS & DASHBOARD ====================

@lms_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get user's LMS dashboard statistics"""
    user_id = get_jwt_identity()['id']
    
    enrollments = Enrollment.query.filter_by(user_id=user_id).all()
    certificates = Certificate.query.filter_by(user_id=user_id).count()
    
    total_hours = sum(
        sum(m.time_spent_minutes for m in e.module_progress) / 60 
        for e in enrollments
    )
    
    completed_courses = sum(1 for e in enrollments if e.status == 'completed')
    in_progress = sum(1 for e in enrollments if e.status == 'in_progress')
    
    return jsonify({
        'success': True,
        'dashboard': {
            'total_enrollments': len(enrollments),
            'completed_courses': completed_courses,
            'in_progress_courses': in_progress,
            'certificates': certificates,
            'total_learning_hours': round(total_hours, 1),
            'recent_courses': [{
                'course_id': e.course_id,
                'title': e.course.title,
                'progress': e.progress_percentage,
                'status': e.status
            } for e in sorted(
                enrollments,
                key=lambda x: x.enrollment_date,
                reverse=True
            )[:5]]
        }
    })

def register_lms_routes(app):
    """Register LMS blueprint with Flask app"""
    app.register_blueprint(lms_bp)
