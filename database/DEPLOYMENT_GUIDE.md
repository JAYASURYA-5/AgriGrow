# Database Deployment Guide

## Quick Start - Deploy to Supabase

### Option 1: Using Supabase SQL Editor (Easiest)

1. **Log in to Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your AgriGrow project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute Migration Scripts**
   - Copy contents from each migration file (001-007) in order
   - Create a new SQL editor tab for each migration
   - Execute them in sequence

4. **Verify Tables**
   - Go to "Table Editor"
   - Confirm all 7 tables are created:
     - users
     - user_profiles
     - sessions
     - password_reset_tokens
     - email_verification_tokens
     - login_attempts
     - user_roles

### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link your project
supabase link --project-ref your_project_ref

# Create migrations directory structure
mkdir -p supabase/migrations

# Copy migration files to supabase/migrations/

# Run migrations
supabase db push
```

### Option 3: Single SQL File (Combined)

Create a single file `setup_login_db.sql` with all tables:

```bash
# Execute in SQL Editor
psql postgresql://postgres:PASSWORD@host:5432/postgres < setup_login_db.sql
```

## Verification Checklist

After deployment, verify:

- [ ] All 7 tables created successfully
- [ ] All indexes created
- [ ] RLS enabled on all tables
- [ ] RLS policies configured
- [ ] Foreign keys working correctly
- [ ] Can insert test data without errors

## Test Data (Optional)

```sql
-- Insert test user
INSERT INTO users (email, username, full_name, user_type, password_hash, is_active, is_verified)
VALUES (
  'test@agrigrow.com',
  'testuser',
  'Test User',
  'farmer',
  'test_hash_placeholder',
  true,
  true
);

-- Insert test profile
INSERT INTO user_profiles (user_id, preferred_language, location, state)
VALUES (
  (SELECT id FROM users WHERE email = 'test@agrigrow.com'),
  'en',
  'Test Location',
  'Test State'
);
```

## Environment Setup

Add to your `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# Additional Auth Settings (Optional)
VITE_JWT_SECRET=your_jwt_secret
VITE_PASSWORD_RESET_EXPIRY=3600
VITE_EMAIL_VERIFICATION_EXPIRY=86400
VITE_SESSION_EXPIRY=86400
```

## Backup & Recovery

### Create Backup

```bash
# Using Supabase Dashboard
1. Settings → Backups
2. Click "Create Backup"
3. Download if needed

# Or via CLI
supabase db dump > backup.sql
```

### Restore from Backup

```bash
# Via SQL Editor - paste backup content and execute
# Or via CLI
psql postgresql://postgres:PASSWORD@host:5432/postgres < backup.sql
```

## Production Deployment Checklist

- [ ] All migrations tested in development
- [ ] RLS policies verified and secure
- [ ] Email templates configured
- [ ] JWT secret configured
- [ ] HTTPS enabled
- [ ] Backups scheduled
- [ ] Monitoring alerts set up
- [ ] Load testing completed
- [ ] Disaster recovery plan documented

## Common Issues & Solutions

### Issue: "relation does not exist"
**Cause**: Tables not created in correct order
**Solution**: Re-run migrations in sequence (001 → 007)

### Issue: RLS preventing inserts
**Cause**: RLS policies too restrictive
**Solution**: Check auth.uid() returns correct value

### Issue: Foreign key violation
**Cause**: Parent record doesn't exist
**Solution**: Create parent records first (e.g., user before user_profile)

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [AgriGrow Documentation](../README.md)
