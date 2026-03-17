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


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
