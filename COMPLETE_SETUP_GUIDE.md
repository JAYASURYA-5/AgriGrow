# AgriGrow Login Database - Complete Setup Guide

## 📦 What's Been Created

### Database Tables (7 Total)
1. **users** - Main user accounts
2. **user_profiles** - Extended profile information  
3. **sessions** - Active session management
4. **password_reset_tokens** - Password recovery
5. **email_verification_tokens** - Email verification
6. **login_attempts** - Security audit log
7. **user_roles** - Role-based access control

### Service Files (3 Total)
1. **authService.js** - Authentication functions
2. **sessionService.js** - Session management
3. **securityService.js** - Security & logging

### Migration Files
- **000_combined_migration.sql** - All SQL in one file
- **001-007_*.sql** - Individual migration files

### Documentation
- **LOGIN_DATABASE_SETUP.md** - Schema reference
- **DEPLOYMENT_GUIDE.md** - Deployment instructions
- **COMPLETE_SETUP_GUIDE.md** - This file

## 🚀 Quick Start (4 Steps)

### Step 1: Run Deployment Script
```bash
npm run db:deploy
```
This will open your Supabase Dashboard

### Step 2: Execute SQL Migration
1. Click **SQL Editor** in the left sidebar
2. Click **+ New Query**
3. Copy all content from `database/migrations/000_combined_migration.sql`
4. Paste into the SQL editor
5. Click **Run** button

### Step 3: Verify Installation
```bash
npm run db:verify
```

### Step 4: Start Building
Now you can use the auth services in your React components!

## 📝 Usage Examples

### Registration
```javascript
import { registerUser } from '@/services/authService';

const result = await registerUser(
  'farmer@agrigrow.com',
  'password123',
  'farmerjan',
  'Jan Farmer',
  'farmer'
);

if (result.success) {
  console.log('Account created:', result.user);
}
```

### Login
```javascript
import { loginUser } from '@/services/authService';

const result = await loginUser(
  'farmer@agrigrow.com',
  'password123',
  '192.168.1.1',
  navigator.userAgent
);

if (result.success) {
  // Store session
  localStorage.setItem('session', JSON.stringify(result.session));
  // Redirect to dashboard
}
```

### Get Current User
```javascript
import { getCurrentUser } from '@/services/authService';

const result = await getCurrentUser();
if (result.success) {
  console.log('User:', result.user);
}
```

## 🔐 Security Features

✅ **Password Hashing** - Supabase handles securely
✅ **Session Management** - 24-hour expiration by default
✅ **Row Level Security** - All tables protected with RLS
✅ **Login Tracking** - All attempts logged
✅ **Email Verification** - Required for new accounts
✅ **Brute Force Detection** - Built-in security service
✅ **JWT Tokens** - Industry standard authentication

## 📊 Database Schema Overview

```
users (Main)
├── user_profiles (1:1)
├── sessions (1:Many)
├── password_reset_tokens (1:Many)
├── email_verification_tokens (1:Many)
├── login_attempts (1:Many)
└── user_roles (1:Many)
```

## 🛠️ Available Commands

```bash
# Deploy database
npm run db:deploy

# Verify database setup
npm run db:verify

# Full setup (deploy + verify)
npm run db:setup

# Start development
npm run dev

# Build for production
npm run build
```

## 📖 Available Functions

### authService.js
```javascript
registerUser()          // Create new account
loginUser()            // User login
logoutUser()           // User logout
getCurrentUser()       // Get authenticated user
updateUserInfo()       // Update basic info
updateUserProfile()    // Update profile data
requestPasswordReset() // Send reset email
resetPassword()        // Reset with token
verifyEmail()          // Email verification
```

### sessionService.js
```javascript
createSession()              // Create new session
getUserSessions()            // List user sessions
updateSessionActivity()      // Track activity
invalidateSession()          // End single session
invalidateAllUserSessions()  // Logout all devices
isSessionValid()             // Check validity
cleanExpiredSessions()       // Cleanup
```

### securityService.js
```javascript
getUserLoginAttempts()      // User login history
getLoginAttemptsByEmail()   // Email-based search
getLoginAttemptsByIP()      // IP-based search
getFailedLoginAttempts()    // Failed attempts
detectSuspiciousActivity()  // Brute force detection
logLoginAttempt()           // Manual log
getLoginStatistics()        // Statistics
```

## 🔗 Related Files

- **Migrations**: `database/migrations/`
- **Services**: `src/services/`
- **Config**: `.env`
- **Docs**: `database/` folder

## ❓ Troubleshooting

### Tables Not Created?
1. Did you execute the SQL in Supabase SQL Editor?
2. Did you click the "Run" button?
3. Check for error messages in the SQL editor output

### Services Not Working?
```bash
# Clear node_modules and reinstall
rm -r node_modules
npm install
```

### Verify Still Showing Missing Tables?
```bash
# Check Supabase directly
# Dashboard → Table Editor
# You should see 7 tables listed
```

## 🎯 Next Steps

1. **Create Login Component** - `src/components/Login.jsx`
2. **Create Register Component** - `src/components/Register.jsx`
3. **Create Auth Context** - `src/contexts/AuthContext.jsx`
4. **Set Protected Routes** - Update routing logic
5. **Add Email Configuration** - Supabase Auth settings
6. **Implement 2FA** - Optional security enhancement

## 📚 Learning Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Tokens](https://jwt.io)

## ✨ You're All Set!

Your AgriGrow database is ready for authentication. The services are production-ready and include:

- ✅ Secure password handling
- ✅ Session management
- ✅ Email verification
- ✅ Password recovery
- ✅ Login tracking
- ✅ Brute force protection
- ✅ Role-based access control

Start building your login UI components now!

---

**Database Version**: 1.0  
**Last Updated**: March 17, 2026  
**Status**: ✅ Ready for Production
