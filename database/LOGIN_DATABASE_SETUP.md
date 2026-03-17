# AgriGrow Login Database Setup Guide

## Overview

This guide explains how to set up the login functionality databases in Supabase for AgriGrow.

## Database Tables

### 1. **users** (Main User Table)
Stores core user information for authentication and identification.

```sql
Fields:
- id (UUID): Primary key, auto-generated
- email (VARCHAR): Unique email address
- username (VARCHAR): Unique username
- password_hash (VARCHAR): Hashed password
- full_name (VARCHAR): User's full name
- phone_number (VARCHAR): Contact phone [OPTIONAL]
- user_type (VARCHAR): farmer, admin, vendor, expert
- profile_picture_url (TEXT): URL to profile image
- bio (TEXT): User biography
- is_active (BOOLEAN): Account status
- is_verified (BOOLEAN): Email verification status
- email_verified_at (TIMESTAMP): Email verification date
- phone_verified_at (TIMESTAMP): Phone verification date
- last_login_at (TIMESTAMP): Last login timestamp
- created_at (TIMESTAMP): Account creation date
- updated_at (TIMESTAMP): Last update date
- deleted_at (TIMESTAMP): Account deletion date (soft delete)
```

### 2. **user_profiles** (Extended User Information)
Stores additional user profile data like location and preferences.

```sql
Fields:
- id (UUID): Primary key
- user_id (UUID): Foreign key to users table
- location (VARCHAR): User location
- state (VARCHAR): State/Province
- district (VARCHAR): District
- pincode (VARCHAR): Postal code
- farm_size_acres (DECIMAL): Farm size in acres
- crops_grown (TEXT[]): Array of crops grown
- experience_years (INTEGER): Years of farming experience
- preferred_language (VARCHAR): Language preference (default: 'en')
- notification_preferences (JSONB): Notification settings
- social_media_links (JSONB): Social media profiles
- created_at (TIMESTAMP): Creation date
- updated_at (TIMESTAMP): Last update date
```

### 3. **sessions** (User Session Management)
Tracks active user sessions for security and device management.

```sql
Fields:
- id (UUID): Primary key
- user_id (UUID): Foreign key to users table
- token (VARCHAR): Session token
- refresh_token (VARCHAR): Refresh token for token renewal
- device_info (JSONB): Device information (browser, OS, etc.)
- ip_address (INET): IP address of login
- user_agent (TEXT): Browser user agent string
- is_active (BOOLEAN): Session active status
- expires_at (TIMESTAMP): Session expiration time
- created_at (TIMESTAMP): Session creation date
- updated_at (TIMESTAMP): Last update date
- last_activity_at (TIMESTAMP): Last activity timestamp
```

### 4. **password_reset_tokens** (Password Recovery)
Manages password reset tokens for secure password recovery.

```sql
Fields:
- id (UUID): Primary key
- user_id (UUID): Foreign key to users table
- token (VARCHAR): Unique reset token
- email (VARCHAR): User email
- expires_at (TIMESTAMP): Token expiration time
- used_at (TIMESTAMP): When token was used
- created_at (TIMESTAMP): Token creation date
```

### 5. **email_verification_tokens** (Email Verification)
Manages email verification tokens for new registrations.

```sql
Fields:
- id (UUID): Primary key
- user_id (UUID): Foreign key to users table
- token (VARCHAR): Unique verification token
- email (VARCHAR): Email to verify
- expires_at (TIMESTAMP): Token expiration time
- verified_at (TIMESTAMP): Verification completion time
- created_at (TIMESTAMP): Token creation date
```

### 6. **login_attempts** (Security Logging)
Tracks all login attempts for security auditing and fraud detection.

```sql
Fields:
- id (UUID): Primary key
- user_id (UUID): Foreign key to users table [NULLABLE]
- email (VARCHAR): Email used in attempt
- username (VARCHAR): Username used in attempt
- ip_address (INET): IP address of request
- user_agent (TEXT): Browser user agent
- success (BOOLEAN): Success/failure flag
- failure_reason (VARCHAR): Reason for failure [NULLABLE]
- device_info (JSONB): Device information
- created_at (TIMESTAMP): Attempt timestamp
```

### 7. **user_roles** (Role-Based Access Control)
Manages user roles and permissions.

```sql
Fields:
- id (UUID): Primary key
- user_id (UUID): Foreign key to users table
- role_name (VARCHAR): Role name (admin, moderator, expert, etc.)
- permissions (TEXT[]): Array of permission strings
- granted_by (UUID): Admin who granted role
- created_at (TIMESTAMP): Role assignment date
```

## Setup Instructions

### Step 1: Create Tables via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy each migration file content (001 through 007)
4. Execute each SQL script in order

OR use the command line:

```bash
# Using Supabase CLI
supabase db push
```

### Step 2: Enable Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Users Table**: Users can view/update only their own records
- **Sessions Table**: Users can manage only their own sessions
- **Login Attempts**: Visible to authenticated users (for their own records)
- **User Profiles**: Users can manage their own profile data
- **User Roles**: Only visible during authentication flow

### Step 3: Configure Environment Variables

Update `.env` file with Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
VITE_SUPABASE_URL="https://your_project.supabase.co"
```

### Step 4: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## API Services

### Available Authentication Services

#### **authService.js**
- `registerUser(email, password, username, fullName, userType)`
- `loginUser(email, password, ipAddress, userAgent)`
- `logoutUser(sessionId)`
- `requestPasswordReset(email)`
- `resetPassword(email, password, token)`
- `verifyEmail(userId, token)`
- `getCurrentUser()`
- `updateUserProfile(userId, profileData)`
- `updateUserInfo(userId, userInfo)`

#### **sessionService.js**
- `createSession(userId, token, refreshToken, deviceInfo, ipAddress, userAgent)`
- `getUserSessions(userId)`
- `updateSessionActivity(sessionId)`
- `invalidateSession(sessionId)`
- `invalidateAllUserSessions(userId, exceptSessionId)`
- `isSessionValid(sessionId)`
- `cleanExpiredSessions()`

#### **securityService.js**
- `getUserLoginAttempts(userId, limit)`
- `getLoginAttemptsByEmail(email, limit)`
- `getLoginAttemptsByIP(ipAddress, limit)`
- `getFailedLoginAttempts(hours)`
- `detectSuspiciousActivity(ipAddress, maxFailedAttempts)`
- `logLoginAttempt(userId, email, username, ipAddress, userAgent, success, failureReason)`
- `getLoginStatistics(days)`

## Usage Example

```javascript
import { registerUser, loginUser, getCurrentUser } from '@/services/authService';

// Registration
const register = await registerUser(
  'user@example.com',
  'password123',
  'johndoe',
  'John Doe',
  'farmer'
);

if (register.success) {
  console.log('Registration successful:', register.user);
}

// Login
const login = await loginUser(
  'user@example.com',
  'password123',
  '192.168.1.1',
  navigator.userAgent
);

if (login.success) {
  console.log('Logged in:', login.user);
  localStorage.setItem('session', JSON.stringify(login.session));
}

// Get Current User
const currentUser = await getCurrentUser();
console.log('Current user:', currentUser.user);
```

## Security Best Practices

1. **Password Hashing**: Supabase handles password hashing automatically
2. **Session Expiry**: Sessions expire after 24 hours by default (configurable)
3. **HTTPS Only**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting on login endpoints
5. **Email Verification**: Require email verification before access
6. **Brute Force Protection**: Use login attempt monitoring for suspicious activity
7. **JWT Tokens**: Supabase uses industry-standard JWT tokens
8. **RLS Policies**: All tables use Row Level Security for data protection

## Database Indexes

Indexes are created for optimal query performance:

```sql
-- Users table
idx_users_email
idx_users_username
idx_users_user_type
idx_users_is_active

-- Sessions table
idx_sessions_user_id
idx_sessions_token
idx_sessions_is_active
idx_sessions_expires_at

-- Login attempts table
idx_login_attempts_user_id
idx_login_attempts_email
idx_login_attempts_ip_address
idx_login_attempts_created_at
idx_login_attempts_success
```

## Troubleshooting

### Issue: Foreign key constraint error
**Solution**: Ensure parent records exist before inserting child records. User must exist before creating user_profile.

### Issue: RLS policies preventing access
**Solution**: Verify you're authenticated and have the correct privileges. Check RLS policy configuration.

### Issue: Email not sending
**Solution**: Configure email settings in Supabase dashboard under Auth → Email Templates.

## Dashboard Monitoring

Monitor login activities via Supabase Dashboard:

1. **SQL Editor**: Query login_attempts table
2. **Auth Dashboard**: View authentication events
3. **Realtime**: Subscribe to session changes
4. **Logs**: Check application logs for errors

## Next Steps

1. Create React components for Login/Register forms
2. Implement password reset flow
3. Add email verification UI
4. Set up authentication context/provider
5. Implement session management on frontend
6. Add social login (OAuth) options
7. Implement two-factor authentication (2FA)

---

**Last Updated**: March 17, 2026
**Database Version**: 1.0
**Status**: Ready for Production
