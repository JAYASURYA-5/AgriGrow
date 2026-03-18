from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, validators
# PyMySQL removed - using pure SQLite
import bcrypt
import os
from dotenv import load_dotenv
import datetime
from werkzeug.utils import secure_filename
import uuid
import os
from werkzeug.utils import secure_filename
import uuid

load_dotenv()


app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-change-me')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///auth.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-jwt-secret')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(minutes=15)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = datetime.timedelta(days=7)

# Origins for CORS (frontend)
CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:5173').split(','))

db = SQLAlchemy(app)
jwt = JWTManager(app)

# Database Model


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    last_login_at = db.Column(db.DateTime)

    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode(
            'utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

# Forms for validation


class RegisterForm(FlaskForm):
    username = StringField('Username', [validators.Length(
        min=3, max=100), validators.DataRequired()])
    email = StringField(
        'Email', [validators.Email(), validators.DataRequired()])
    password = PasswordField(
        'Password', [validators.Length(min=8), validators.DataRequired()])


class LoginForm(FlaskForm):
    email = StringField(
        'Email', [validators.Email(), validators.DataRequired()])
    password = PasswordField('Password', [validators.DataRequired()])

# Routes


@app.route('/api/register', methods=['POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        if User.query.filter_by(email=form.email.data).first():
            return jsonify({'error': 'Email already registered'}), 400
        if User.query.filter_by(username=form.username.data).first():
            return jsonify({'error': 'Username taken'}), 400

        user = User(
            username=form.username.data,
            email=form.email.data
        )
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()

        return jsonify({
            'success': True,
            'message': 'User registered successfully',
            'user_id': user.id
        }), 201

    return jsonify({'error': form.errors}), 400


@app.route('/api/login', methods=['POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.is_active and user.check_password(form.password.data):
            user.last_login_at = db.func.current_timestamp()
            db.session.commit()

            access_token = create_access_token(
                identity={'id': user.id, 'email': user.email})
            return jsonify({
                'success': True,
                'access_token': access_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                }
            })

        return jsonify({'error': 'Invalid credentials'}), 401

    return jsonify({'error': form.errors}), 400


@app.route('/api/logout', methods=['POST'])
@jwt_required()
def logout():
    return jsonify({'success': True, 'message': 'Logged out successfully'})


@app.route('/api/profile', methods=['GET'])
@jwt_required()
def profile():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    return jsonify({
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'created_at': user.created_at.isoformat() if user.created_at else None
        }
    })


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})


class Video(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    youtube_url = db.Column(db.String(500), nullable=False)
    video_id = db.Column(db.String(50), nullable=False)
    thumbnail = db.Column(db.String(500))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    keywords = db.Column(db.JSON)
    category = db.Column(db.String(100))
    views = db.Column(db.Integer, default=0)
    uploaded_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    user = db.relationship('User', backref='videos')

@app.route('/api/videos', methods=['POST'])
@jwt_required()
def upload_video():
    data = request.json
    try:
        current_user_id = get_jwt_identity()['id']
        video = Video(
            user_id=current_user_id,
            youtube_url=data['youtube_url'],
            video_id=data['video_id'],
            thumbnail=data.get('thumbnail'),
            title=data['title'],
            description=data.get('description'),
            keywords=data.get('keywords', []),
            category=data.get('category', 'General')
        )
        db.session.add(video)
        db.session.commit()
        return jsonify({'success': True, 'video': {
            'id': video.id,
            'title': video.title,
            'youtube_url': video.youtube_url
        }}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/videos/user', methods=['GET'])
@jwt_required()
def get_user_videos():
    current_user_id = get_jwt_identity()['id']
    videos = Video.query.filter_by(user_id=current_user_id).order_by(Video.uploaded_at.desc()).all()
    return jsonify({
        'success': True,
        'videos': [{
            'id': v.id,
            'title': v.title,
            'youtube_url': v.youtube_url,
            'thumbnail': v.thumbnail,
            'description': v.description,
            'keywords': v.keywords,
            'category': v.category,
            'views': v.views,
            'uploaded_at': v.uploaded_at.isoformat()
        } for v in videos]
    })

@app.route('/api/videos', methods=['GET'])
@jwt_required()
def get_all_videos():
    current_user_id = get_jwt_identity()['id']
    user = User.query.get(current_user_id)
    if user.username != 'admin':
        return jsonify({'error': 'Admin only'}), 403
    videos = Video.query.order_by(Video.uploaded_at.desc()).all()
    return jsonify({
        'success': True,
        'videos': [{
            'id': v.id,
            'user_id': v.user_id,
            'title': v.title,
            'youtube_url': v.youtube_url,
            'thumbnail': v.thumbnail,
            'description': v.description,
            'keywords': v.keywords,
            'views': v.views,
            'uploaded_at': v.uploaded_at.isoformat()
        } for v in videos]
    })

@app.route('/api/videos/<int:video_id>', methods=['PUT'])
@jwt_required()
def update_video(video_id):
    current_user_id = get_jwt_identity()['id']
    data = request.json
    video = Video.query.get_or_404(video_id)
    if video.user_id != current_user_id and User.query.get(current_user_id).username != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    video.title = data.get('title', video.title)
    video.description = data.get('description', video.description)
    video.keywords = data.get('keywords', video.keywords)
    video.category = data.get('category', video.category)
    db.session.commit()
    return jsonify({'success': True})

@app.route('/api/videos/upload', methods=['POST'])
@jwt_required()
def upload_video_file():
    try:
        current_user_id = get_jwt_identity()['id']
        
        # Create uploads directory if not exists
        upload_dir = 'static/videos'
        os.makedirs(upload_dir, exist_ok=True)
        
        # Handle video file
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No video file selected'}), 400
        
        # Secure filename and generate unique name
        filename = secure_filename(video_file.filename)
        video_id = str(uuid.uuid4())[:8]
        video_ext = os.path.splitext(filename)[1] or '.mp4'
        video_path = f"{upload_dir}/{video_id}{video_ext}"
        video_file.save(video_path)
        
        # Get form data
        title = request.form.get('title', 'Untitled Video')
        description = request.form.get('description', '')
        category = request.form.get('category', 'General')
        keywords_str = request.form.get('keywords', '')
        keywords = [k.strip() for k in keywords_str.split(',') if k.strip()]
        
        # Create video record (store relative path)
        video = Video(
            user_id=current_user_id,
            youtube_url=f"http://localhost:5000/{video_path}",
            video_id=video_id,
            thumbnail=None,
            title=title,
            description=description,
            keywords=keywords,
            category=category
        )
        db.session.add(video)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'video': {
                'id': video.id,
                'title': video.title,
                'url': video.youtube_url,
                'video_id': video.video_id
            }
        }), 201
        
    except Exception as e:
        if 'db' in locals():
            db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/videos/<int:video_id>', methods=['DELETE'])
@jwt_required()
def delete_video(video_id):
    current_user_id = get_jwt_identity()['id']
    video = Video.query.get_or_404(video_id)
    if video.user_id != current_user_id and User.query.get(current_user_id).username != 'admin':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Delete file if exists
    video_path = video.youtube_url.replace('http://localhost:5000/', '')
    if os.path.exists(video_path):
        os.remove(video_path)
    
    db.session.delete(video)
    db.session.commit()
    return jsonify({'success': True})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
