-- MySQL Database Schema for Authentication System
-- Compatible with MySQL 8.0+ or MariaDB 10.5+

-- Drop if exists (development only)
DROP TABLE IF EXISTS users;

-- Users table matching exact requirements
CREATE TABLE users
(
    id INT
    AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR
    (100) NOT NULL UNIQUE,
  email VARCHAR
    (255) NOT NULL UNIQUE,
  password_hash VARCHAR
    (255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Additional fields for completeness
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  last_login_at TIMESTAMP NULL,
  
  INDEX idx_users_email
    (email),
  INDEX idx_users_username
    (username),
  INDEX idx_users_created_at
    (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample admin user (bcrypt: admin123)
INSERT INTO users (username, email, password_hash, is_active) VALUES 
('admin', 'admin@agrigrow.com', '$2b$12$9jQXgN.PQ8eT.0d3mKXhJqKIXpH3.Rcw8TL.0T7.3t8OozPa5YQ.', TRUE);

-- Verification: 
-- SELECT * FROM users LIMIT 5;

-- LMS Videos table
CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    youtube_url VARCHAR(500) NOT NULL,
    video_id VARCHAR(50) NOT NULL,
    thumbnail VARCHAR(500),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    keywords JSON,
    category VARCHAR(100),
    views INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_videos_user (user_id),
    INDEX idx_videos_uploaded (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verification:
-- SELECT * FROM videos LIMIT 5;

