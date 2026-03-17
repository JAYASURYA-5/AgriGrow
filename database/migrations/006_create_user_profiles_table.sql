-- Create user profiles table for additional user information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location VARCHAR(255),
  state VARCHAR(100),
  district VARCHAR(100),
  pincode VARCHAR(10),
  farm_size_acres DECIMAL(10, 2),
  crops_grown TEXT[],
  experience_years INTEGER,
  preferred_language VARCHAR(50) DEFAULT 'en',
  notification_preferences JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  social_media_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_location ON user_profiles(location);
CREATE INDEX idx_user_profiles_state ON user_profiles(state);

-- RLS (Row Level Security) Policy
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
