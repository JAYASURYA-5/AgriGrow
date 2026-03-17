import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Register a new user
 */
export const registerUser = async (email, password, username, fullName, userType = 'farmer') => {
  try {
    // Register with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Create user record in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          username,
          full_name: fullName,
          user_type: userType,
          password_hash: '',
          is_active: true,
        },
      ])
      .select();

    if (userError) throw userError;

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          preferred_language: 'en',
        },
      ]);

    if (profileError) throw profileError;

    return {
      success: true,
      user: userData[0],
      message: 'Registration successful. Please verify your email.',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Login user
 */
export const loginUser = async (email, password, ipAddress, userAgent) => {
  try {
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;

    const userId = authData.user.id;

    // Log successful login attempt
    await supabase.from('login_attempts').insert([
      {
        user_id: userId,
        email,
        ip_address: ipAddress,
        user_agent: userAgent,
        success: true,
      },
    ]);

    // Update last login time
    await supabase
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);

    // Get user data with profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, user_profiles(*)')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    return {
      success: true,
      user: userData,
      session: authData.session,
    };
  } catch (error) {
    // Log failed login attempt
    if (email) {
      await supabase.from('login_attempts').insert([
        {
          email,
          ip_address: ipAddress,
          user_agent: userAgent,
          success: false,
          failure_reason: error.message,
        },
      ]);
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = async (sessionId) => {
  try {
    // Mark session as inactive
    if (sessionId) {
      await supabase
        .from('sessions')
        .update({ is_active: false })
        .eq('id', sessionId);
    }

    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  try {
    // Send password reset email through Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset email sent',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Reset password with token
 */
export const resetPassword = async (email, password, token) => {
  try {
    // Update password using Supabase
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) throw error;

    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify email
 */
export const verifyEmail = async (userId, token) => {
  try {
    // Mark email as verified
    const { error } = await supabase
      .from('users')
      .update({
        is_verified: true,
        email_verified_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;

    // Mark token as verified
    await supabase
      .from('email_verification_tokens')
      .update({ verified_at: new Date().toISOString() })
      .eq('token', token);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) throw sessionError;

    if (!sessionData.session) {
      return {
        success: false,
        user: null,
      };
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*, user_profiles(*)')
      .eq('id', sessionData.session.user.id)
      .single();

    if (userError) throw userError;

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profileData)
      .eq('user_id', userId)
      .select();

    if (error) throw error;

    return {
      success: true,
      profile: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update user basic info
 */
export const updateUserInfo = async (userId, userInfo) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: userInfo.full_name,
        phone_number: userInfo.phone_number,
        profile_picture_url: userInfo.profile_picture_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) throw error;

    return {
      success: true,
      user: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export default supabase;
