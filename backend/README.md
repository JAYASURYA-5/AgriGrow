# Flask Authentication Backend for AgriGrow

## Overview

Production-ready Flask API for user authentication. Supports SQLite (dev) or MySQL (prod).

**Features:**

- bcrypt password hashing
- Email/username validation
- JWT/session management
- SQL injection prevention (SQLAlchemy)
- CORS for React frontend
- Rate limiting ready

## Quick Start

1. **Install dependencies:**

```bash
pip install -r requirements.txt
```

2. **Setup database:**

```bash
python init_db.py
```

3. **Run server:**

```bash
python app.py
```

Server runs on http://localhost:5000

4. **Test endpoints:**

```bash
curl -X POST http://localhost:5000/api/register -H "Content-Type: application/json" -d '{"username":"test","email":"test@example.com","password":"password123"}'

curl -X POST http://localhost:5000/api/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"password123"}'
```

## API Endpoints

| Method | Endpoint        | Description                  |
| ------ | --------------- | ---------------------------- |
| POST   | `/api/register` | Create new user              |
| POST   | `/api/login`    | User login (returns JWT)     |
| POST   | `/api/logout`   | Invalidate session           |
| GET    | `/api/profile`  | Get current user (protected) |

## Environment Variables

```env
# Database (SQLite default, MySQL for prod)
SQLALCHEMY_DATABASE_URI=sqlite:///auth.db
# or mysql+pymysql://user:pass@localhost/auth_db

SECRET_KEY=your-secret-key-change-in-prod
JWT_SECRET_KEY=your-jwt-secret-key
```

## Database Schema

See `database/schema.sql`

## Security

- bcrypt (12 rounds)
- Parameterized queries
- Input sanitization (WTForms)
- JWT expiry (15min access, 7d refresh)
- CORS restricted to frontend origin

---

**Version 1.0** | **Flask 2.3+** | **MySQL/SQLite compatible**
