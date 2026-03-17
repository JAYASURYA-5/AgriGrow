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

-- Sample data (remove in production)
-- INSERT INTO users (username, email, password_hash) VALUES 
-- ('admin', 'admin@agrigrow.com', '$2b$12$KIXpH3.Rcw8TL.0T7.3t8OozPa5YQ.9jQXgN.PQ8eT.0d3mKXhJq');

-- Verification: 
-- SELECT * FROM users LIMIT 5;

