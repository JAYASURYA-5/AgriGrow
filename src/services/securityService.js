import supabase from './authService';

/**
 * Get login attempts for a user
 */
export const getUserLoginAttempts = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      attempts: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get login attempts by email
 */
export const getLoginAttemptsByEmail = async (email, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      attempts: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get login attempts by IP address
 */
export const getLoginAttemptsByIP = async (ipAddress, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('ip_address', ipAddress)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return {
      success: true,
      attempts: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get failed login attempts in last X hours
 */
export const getFailedLoginAttempts = async (hours = 24) => {
  try {
    const sinceDate = new Date();
    sinceDate.setHours(sinceDate.getHours() - hours);

    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('success', false)
      .gte('created_at', sinceDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Count attempts by IP and email
    const byIP = {};
    const byEmail = {};

    data.forEach((attempt) => {
      const ip = attempt.ip_address;
      const email = attempt.email;

      byIP[ip] = (byIP[ip] || 0) + 1;
      byEmail[email] = (byEmail[email] || 0) + 1;
    });

    return {
      success: true,
      attempts: data,
      byIP,
      byEmail,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Detect suspicious login activity (possible brute force)
 */
export const detectSuspiciousActivity = async (ipAddress, maxFailedAttempts = 5) => {
  try {
    const sinceDate = new Date();
    sinceDate.setHours(sinceDate.getHours() - 1); // Check last hour

    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('ip_address', ipAddress)
      .eq('success', false)
      .gte('created_at', sinceDate.toISOString());

    if (error) throw error;

    const isSuspicious = data.length >= maxFailedAttempts;

    return {
      success: true,
      isSuspicious,
      failedAttempts: data.length,
      attempts: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Log login attempt
 */
export const logLoginAttempt = async (userId, email, username, ipAddress, userAgent, success, failureReason = null) => {
  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .insert([
        {
          user_id: userId || null,
          email,
          username,
          ip_address: ipAddress,
          user_agent: userAgent,
          success,
          failure_reason: failureReason,
        },
      ])
      .select();

    if (error) throw error;

    return {
      success: true,
      attempt: data[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get login statistics
 */
export const getLoginStatistics = async (days = 7) => {
  try {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .gte('created_at', sinceDate.toISOString());

    if (error) throw error;

    const stats = {
      totalAttempts: data.length,
      successfulLogins: data.filter((a) => a.success).length,
      failedLogins: data.filter((a) => !a.success).length,
      uniqueUsers: new Set(data.filter((a) => a.user_id).map((a) => a.user_id)).size,
      uniqueIPs: new Set(data.map((a) => a.ip_address)).size,
      successRate: (data.filter((a) => a.success).length / data.length) * 100,
    };

    return {
      success: true,
      stats,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
