"""
LMS Recommendation Engine for AgriGrow
Uses AI/ML to provide personalized course recommendations based on user profile
"""

from lms_models import (
    db, UserProfile, Course, Enrollment, ModuleProgress, 
    CourseRecommendation, QuizResponse
)
from datetime import datetime, timedelta
import json

class RecommendationEngine:
    """Generates personalized course recommendations"""
    
    # Category mapping for crop types
    CROP_CATEGORY_MAP = {
        'Rice': ['Soil Health', 'Irrigation', 'Pest Control', 'Crop Management'],
        'Wheat': ['Soil Health', 'Irrigation', 'Crop Management', 'Organic Farming'],
        'Corn': ['Soil Health', 'Irrigation', 'Pest Control', 'Crop Management'],
        'Cotton': ['Soil Health', 'Pest Control', 'Irrigation', 'Organic Farming'],
        'Sugarcane': ['Irrigation', 'Soil Health', 'Pest Control', 'Crop Management'],
        'Vegetables': ['Soil Health', 'Irrigation', 'Pest Control', 'Organic Farming'],
        'Fruits': ['Soil Health', 'Irrigation', 'Pest Control', 'Crop Management'],
        'Pulses': ['Soil Health', 'Crop Management', 'Organic Farming', 'Irrigation'],
        'Spices': ['Soil Health', 'Pest Control', 'Organic Farming', 'Crop Management'],
        'Oilseeds': ['Soil Health', 'Crop Management', 'Irrigation', 'Pest Control'],
    }
    
    # Experience level progression
    EXPERIENCE_PROGRESSION = {
        'Beginner': ['Beginner', 'Intermediate'],
        'Intermediate': ['Intermediate', 'Advanced'],
        'Advanced': ['Advanced']
    }
    
    @staticmethod
    def calculate_relevance_score(user_profile, course):
        """Calculate how relevant a course is for a user (0-100)"""
        score = 0
        max_score = 100
        
        # 1. Category matching (30 points)
        recommended_categories = RecommendationEngine.CROP_CATEGORY_MAP.get(
            user_profile.crop_type, []
        )
        if course.category in recommended_categories:
            score += 30
        elif len(recommended_categories) > 0:
            score += 15  # Partial match
        
        # 2. Experience level match (25 points)
        if course.level == user_profile.experience_level:
            score += 25
        elif course.level in RecommendationEngine.EXPERIENCE_PROGRESSION.get(
            user_profile.experience_level, []
        ):
            score += 15  # Next level course
        
        # 3. Location relevance (20 points)
        # Can be enhanced with climate/weather data
        if user_profile.state:
            score += 15  # Generic regional relevance
        
        # 4. Prerequisite satisfaction (15 points)
        if course.prerequisites:
            score += 10  # Simplified - check if user took prerequisite
        else:
            score += 15  # No prerequisites
        
        # 5. Learning style match (10 points)
        # Based on content types user prefers
        score += 10
        
        return min(int(score), 100)
    
    @staticmethod
    def get_course_difficulty_score(course):
        """Calculate course difficulty score"""
        level_scores = {'Beginner': 1, 'Intermediate': 2, 'Advanced': 3}
        return level_scores.get(course.level, 1)
    
    @staticmethod
    def generate_recommendations(user_id, limit=10):
        """Generate personalized course recommendations for a user"""
        user_profile = UserProfile.query.filter_by(user_id=user_id).first()
        
        if not user_profile:
            return []
        
        # Get user's enrolled courses
        enrolled_courses = Enrollment.query.filter_by(user_id=user_id).all()
        enrolled_course_ids = [e.course_id for e in enrolled_courses]
        
        # Get all available courses (excluding enrolled)
        all_courses = Course.query.filter(
            ~Course.id.in_(enrolled_course_ids)
        ).all()
        
        # Calculate relevance for each course
        recommendations = []
        for course in all_courses:
            relevance = RecommendationEngine.calculate_relevance_score(
                user_profile, course
            )
            
            # Only recommend courses with minimum relevance
            if relevance >= 40:
                recommendations.append({
                    'course': course,
                    'relevance': relevance
                })
        
        # Sort by relevance
        recommendations.sort(key=lambda x: x['relevance'], reverse=True)
        
        # Save recommendations to database
        CourseRecommendation.query.filter_by(user_id=user_id).delete()
        
        for rec in recommendations[:limit]:
            reason = RecommendationEngine.get_recommendation_reason(
                user_profile, rec['course']
            )
            
            db_rec = CourseRecommendation(
                user_id=user_id,
                course_id=rec['course'].id,
                relevance_score=rec['relevance'],
                reason=reason
            )
            db.session.add(db_rec)
        
        db.session.commit()
        
        return recommendations[:limit]
    
    @staticmethod
    def get_recommendation_reason(user_profile, course):
        """Generate human-readable reason for recommendation"""
        reasons = []
        
        recommended_categories = RecommendationEngine.CROP_CATEGORY_MAP.get(
            user_profile.crop_type, []
        )
        if course.category in recommended_categories:
            reasons.append(f"Relevant to {user_profile.crop_type} farming")
        
        if course.level == user_profile.experience_level:
            reasons.append(f"Matched to your {user_profile.experience_level} level")
        elif course.level in RecommendationEngine.EXPERIENCE_PROGRESSION.get(
            user_profile.experience_level, []
        ):
            reasons.append(f"Great next step from your current level")
        
        if user_profile.preferred_category == course.category:
            reasons.append("Matches your preferred topic")
        
        if course.rating >= 4.7:
            reasons.append("Highly rated by other farmers")
        
        return " • ".join(reasons) if reasons else "Recommended for you"
    
    @staticmethod
    def adaptive_difficulty_recommendation(user_id):
        """Recommend course difficulty based on performance"""
        user_profile = UserProfile.query.filter_by(user_id=user_id).first()
        quiz_responses = QuizResponse.query.filter_by(user_id=user_id).all()
        
        if not quiz_responses:
            return user_profile.experience_level
        
        # Calculate average quiz score
        avg_score = sum(r.score for r in quiz_responses) / len(quiz_responses)
        
        # Adjust difficulty recommendation
        if avg_score >= 85 and user_profile.experience_level != 'Advanced':
            return 'Advanced'
        elif avg_score < 60 and user_profile.experience_level != 'Beginner':
            return 'Intermediate'
        
        return user_profile.experience_level
    
    @staticmethod
    def get_next_module_suggestion(enrollment_id):
        """Suggest next module to study"""
        enrollment = Enrollment.query.get(enrollment_id)
        
        if not enrollment:
            return None
        
        # Find first incomplete module
        for module_progress in sorted(
            enrollment.module_progress,
            key=lambda x: x.module.sequence or 0
        ):
            if module_progress.status != 'completed':
                return {
                    'module_id': module_progress.module_id,
                    'title': module_progress.module.title,
                    'estimated_time': module_progress.module.duration_minutes
                }
        
        return None
    
    @staticmethod
    def get_performance_feedback(user_id):
        """Generate feedback based on learning performance"""
        quiz_responses = QuizResponse.query.filter_by(user_id=user_id).all()
        enrollments = Enrollment.query.filter_by(user_id=user_id).all()
        
        feedback_messages = []
        
        if not quiz_responses:
            feedback_messages.append({
                'type': 'encouragement',
                'message': 'Welcome! Start your first course to begin your learning journey.'
            })
            return feedback_messages
        
        # Calculate metrics
        avg_score = sum(r.score for r in quiz_responses) / len(quiz_responses)
        total_courses = len(enrollments)
        completed_courses = sum(1 for e in enrollments if e.status == 'completed')
        
        # Excellent performance
        if avg_score >= 85:
            feedback_messages.append({
                'type': 'encouragement',
                'message': f'🌟 Excellent work! Your average quiz score is {int(avg_score)}%. Keep it up!'
            })
        
        # Good progress
        if completed_courses >= 3:
            feedback_messages.append({
                'type': 'encouragement',
                'message': f'🎉 You\'ve completed {completed_courses} courses! You\'re becoming an agricultural expert!'
            })
        
        # Struggling suggestion
        if avg_score < 60:
            feedback_messages.append({
                'type': 'suggestion',
                'message': 'Consider revising the course materials or trying a beginner-level course.'
            })
        
        # Idle course warning
        for enrollment in enrollments:
            if enrollment.status == 'in_progress':
                last_access = max(
                    (m.last_accessed for m in enrollment.module_progress),
                    default=None
                )
                if last_access and (datetime.utcnow() - last_access) > timedelta(days=7):
                    feedback_messages.append({
                        'type': 'suggestion',
                        'message': f'You haven\'t accessed "{enrollment.course.title}" in a while. Continue where you left off!'
                    })
        
        return feedback_messages
    
    @staticmethod
    def trigger_seasonal_recommendations(user_id):
        """Recommend courses based on farming season"""
        from datetime import datetime
        
        user_profile = UserProfile.query.filter_by(user_id=user_id).first()
        if not user_profile:
            return []
        
        current_month = datetime.utcnow().month
        
        # Seasonal recommendations (simplified)
        seasonal_categories = {
            'planting_season': (3, 5),  # Mar-May
            'monsoon': (6, 8),  # Jun-Aug
            'harvest': (9, 11),  # Sep-Nov
            'winter': (12, 2)  # Dec-Feb
        }
        
        current_season = None
        for season, (start, end) in seasonal_categories.items():
            if start <= current_month <= end:
                current_season = season
            elif start > end and (current_month >= start or current_month <= end):
                current_season = season
        
        # Map season to relevant courses
        seasonal_course_map = {
            'planting_season': ['Soil Health', 'Irrigation', 'Soil Preparation'],
            'monsoon': ['Pest Control', 'Crop Management'],
            'harvest': ['Crop Management', 'Market'],
            'winter': ['Soil Health', 'Organic Farming']
        }
        
        if current_season:
            relevant_categories = seasonal_course_map.get(current_season, [])
            return {
                'season': current_season,
                'recommended_categories': relevant_categories,
                'message': f'Courses for {current_season.replace("_", " ")} are now recommended'
            }
        
        return []

def batch_generate_recommendations():
    """Generate recommendations for all users (run periodically)"""
    users = UserProfile.query.all()
    
    for user in users:
        try:
            RecommendationEngine.generate_recommendations(user.user_id)
        except Exception as e:
            print(f"Error generating recommendations for user {user.user_id}: {e}")
