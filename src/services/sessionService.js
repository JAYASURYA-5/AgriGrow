import supabase from './authService';

/**
 * Create user session record
 */
export const createSession = async (userId, token, refreshToken, deviceInfo, ipAddress, userAgent) => {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

    const { data, error } = await supabase
      .from('sessions')
      .insert([
        {
          user_id: userId,
          token,
          refresh_token: refreshToken,
          device_info: deviceInfo,
          ip_address: ipAddress,
          user_agent: userAgent,
          is_active: true,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      session: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get user sessions
 */
export const getUserSessions = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      sessions: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update session activity
 */
export const updateSessionActivity = async (sessionId) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .update({
        last_activity_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
      .select();

    if (error) throw error;

    return {
      success: true,
      session: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Invalidate session
 */
export const invalidateSession = async (sessionId) => {
  try {
    const { error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', sessionId);

    if (error) throw error;

    return {
      success: true,
      message: 'Session invalidated',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Invalidate all user sessions
 */
export const invalidateAllUserSessions = async (userId, exceptSessionId = null) => {
  try {
    let query = supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (exceptSessionId) {
      query = query.neq('id', exceptSessionId);
    }

    const { error } = await query;

    if (error) throw error;

    return {
      success: true,
      message: 'All sessions invalidated',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Check if session is valid
 */
export const isSessionValid = async (sessionId) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return {
      success: true,
      isValid: !!data,
      session: data,
    };
  } catch (error) {
    return {
      success: false,
      isValid: false,
      error: error.message,
    };
  }
};

/**
 * Clean expired sessions
 */
export const cleanExpiredSessions = async () => {
  try {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;

    return {
      success: true,
      message: 'Expired sessions cleaned',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
