"""
LMS Database Seeding Script
Seeds initial courses, modules, quizzes, and learning content into the database
"""

from lms_models import db, Course, Module, Quiz, QuizQuestion

def seed_lms_data():
    """Populate database with initial LMS content"""
    
    # Clear existing data (optional)
    # Quiz.query.delete()
    # Module.query.delete()
    # Course.query.delete()
    
    # Define sample courses
    courses_data = [
        {
            'title': 'Soil Health & Fertility Management',
            'description': 'Learn about soil testing, nutrient management, composting, and organic farming practices.',
            'category': 'Soil Health',
            'level': 'Beginner',
            'instructor': 'Dr. Rajesh Kumar',
            'duration_hours': 8,
            'image_url': '/images/soil-health.jpg',
            'learning_objectives': [
                'Understand soil composition and pH',
                'Learn NPK nutrient management',
                'Master composting techniques',
                'Implement crop rotation'
            ],
            'rating': 4.8,
            'module_count': 5,
            'prerequisites': None,
            'description': 'Complete guide to soil health management for sustainable farming'
        },
        {
            'title': 'Efficient Irrigation Techniques',
            'description': 'Master drip irrigation, sprinkler systems, and water conservation methods.',
            'category': 'Irrigation',
            'level': 'Beginner',
            'instructor': 'Ms. Priya Singh',
            'duration_hours': 6,
            'image_url': '/images/irrigation.jpg',
            'learning_objectives': [
                'Understand water requirements',
                'Learn drip irrigation setup',
                'Implement sprinkler systems',
                'Water conservation methods'
            ],
            'rating': 4.7,
            'module_count': 4,
            'prerequisites': None
        },
        {
            'title': 'Integrated Pest Management (IPM)',
            'description': 'Organic and conventional pest control strategies for crop protection.',
            'category': 'Pest Control',
            'level': 'Intermediate',
            'instructor': 'Dr. Amit Patel',
            'duration_hours': 10,
            'image_url': '/images/pest-control.jpg',
            'learning_objectives': [
                'Identify common pests and diseases',
                'Biological control methods',
                'Organic pesticide preparation',
                'Disease prevention strategies'
            ],
            'rating': 4.6,
            'module_count': 6,
            'prerequisites': 'Soil Health & Fertility Management'
        },
        {
            'title': 'Organic Farming Certification',
            'description': 'Complete guide to organic farming practices and certification process.',
            'category': 'Organic Farming',
            'level': 'Intermediate',
            'instructor': 'Mr. Vikram Sharma',
            'duration_hours': 12,
            'image_url': '/images/organic-farming.jpg',
            'learning_objectives': [
                'Organic certification requirements',
                'Transition planning',
                'Organic input production',
                'Record keeping and documentation'
            ],
            'rating': 4.9,
            'module_count': 7,
            'prerequisites': None
        },
        {
            'title': 'Modern Crop Management',
            'description': 'Advanced techniques for crop planning, spacing, and yield optimization.',
            'category': 'Crop Management',
            'level': 'Advanced',
            'instructor': 'Dr. Sunil Desai',
            'duration_hours': 15,
            'image_url': '/images/crop-management.jpg',
            'learning_objectives': [
                'Crop planning and scheduling',
                'Precision agriculture techniques',
                'AI-powered monitoring',
                'Yield optimization strategies'
            ],
            'rating': 4.8,
            'module_count': 8,
            'prerequisites': 'Soil Health & Fertility Management'
        }
    ]
    
    # Create courses
    courses = []
    for course_data in courses_data:
        course = Course(**course_data)
        db.session.add(course)
        courses.append(course)
    
    db.session.commit()
    
    # Define sample modules
    modules_data = {
        courses[0].id: [  # Soil Health course
            {
                'title': 'Understanding Soil: Composition & Properties',
                'description': 'Learn about soil structure, texture, and composition',
                'sequence': 1,
                'duration_minutes': 45,
                'content': '<p>Soil is composed of minerals, organic matter, water, and air...</p>',
                'video_url': '/videos/soil-intro.mp4',
                'content_types': ['video', 'text'],
                'learning_objectives': ['Identify soil components', 'Understand soil texture'],
                'key_points': ['Soil = minerals + organic matter + water + air', 'Texture affects nutrient holding capacity']
            },
            {
                'title': 'Soil Testing & Analysis',
                'description': 'How to test soil and interpret results',
                'sequence': 2,
                'duration_minutes': 50,
                'content': '<p>Soil testing reveals nutrient levels...</p>',
                'video_url': '/videos/soil-testing.mp4',
                'content_types': ['video', 'infographics'],
                'learning_objectives': ['Conduct soil tests', 'Interpret test results'],
                'key_points': ['pH testing methods', 'Nutrient analysis importance']
            }
        ],
        courses[1].id: [  # Irrigation course
            {
                'title': 'Introduction to Irrigation Systems',
                'description': 'Overview of different irrigation methods',
                'sequence': 1,
                'duration_minutes': 40,
                'content': '<p>Irrigation is the artificial application of water to land...</p>',
                'video_url': '/videos/irrigation-intro.mp4',
                'content_types': ['video', 'text', 'tips'],
                'learning_objectives': ['Know irrigation types', 'Understand when to irrigate'],
                'key_points': ['Furrow, flood, sprinkler, drip systems', 'Timing is crucial for yield']
            }
        ]
    }
    
    # Create modules
    all_modules = {}
    for course_id, modules in modules_data.items():
        all_modules[course_id] = []
        for module_data in modules:
            module_data['course_id'] = course_id
            module = Module(**module_data)
            db.session.add(module)
            db.session.flush()
            all_modules[course_id].append(module)
    
    db.session.commit()
    
    # Define sample quizzes
    quizzes_data = {
        all_modules[courses[0].id][0].id: {  # Soil composition module
            'title': 'Soil Composition Assessment',
            'quiz_type': 'Multiple Choice',
            'passing_score': 70,
            'time_limit_minutes': 15,
            'max_attempts': 3,
            'questions': [
                {
                    'question_text': 'What percentage of soil is typically composed of minerals?',
                    'options': ['25%', '45%', '65%', '85%'],
                    'correct_option': 2,
                    'explanation': 'Most soil is 45-65% minerals depending on location and type.'
                },
                {
                    'question_text': 'Which of these is NOT a soil component?',
                    'options': ['Minerals', 'Organic Matter', 'Plastic', 'Water'],
                    'correct_option': 2,
                    'explanation': 'Plastic is not a natural soil component.'
                }
            ]
        }
    }
    
    # Create quizzes and questions
    for module_id, quiz_data in quizzes_data.items():
        quiz = Quiz(module_id=module_id, **{k: v for k, v in quiz_data.items() if k != 'questions'})
        db.session.add(quiz)
        db.session.flush()
        
        for q_data in quiz_data['questions']:
            question = QuizQuestion(
                quiz_id=quiz.id,
                question_text=q_data['question_text'],
                options=q_data['options'],
                correct_option=q_data['correct_option'],
                explanation=q_data['explanation']
            )
            db.session.add(question)
    
    db.session.commit()
    
    print("✅ LMS database seeding completed!")
    print(f"   - Created {len(courses)} courses")
    print(f"   - Created {sum(len(mods) for mods in all_modules.values())} modules")
    print(f"   - Created {len(quizzes_data)} quizzes")

if __name__ == '__main__':
    from app import app, db as app_db
    
    with app.app_context():
        seed_lms_data()
