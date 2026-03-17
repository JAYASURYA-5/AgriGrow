/**
 * Flask Backend Auth Service - Replaces Supabase for Login/Register
 * Use with Login.jsx / Register.jsx
 */

// Base URL - change for production
const API_BASE = "http://localhost:5000/api";

/**
 * Login with Flask backend
 */
export const loginUserFlask = async (
  email,
  password,
  ipAddress = "0.0.0.0",
  userAgent = navigator.userAgent,
) => {
  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Store JWT token
      localStorage.setItem("flask_access_token", data.access_token);
      localStorage.setItem("flask_user", JSON.stringify(data.user));

      return {
        success: true,
        session: { access_token: data.access_token },
        user: data.user,
      };
    } else {
      return {
        success: false,
        error: data.error || "Login failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Network error: " + error.message,
    };
  }
};

/**
 * Register new user with Flask backend
 */
export const registerUserFlask = async (
  email,
  password,
  username,
  fullName = "",
  userType = "farmer",
) => {
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      success: false,
      error: "Network error: " + error.message,
    };
  }
};

/**
 * Get current user (JWT protected)
 */
export const getCurrentUserFlask = async () => {
  const token = localStorage.getItem("flask_access_token");
  if (!token) return { success: false, user: null };

  try {
    const response = await fetch(`${API_BASE}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    localStorage.removeItem("flask_access_token");
    return { success: false, error: "Token expired" };
  }
};

/**
 * Logout
 */
export const logoutUserFlask = async () => {
  localStorage.removeItem("flask_access_token");
  localStorage.removeItem("flask_user");
  return { success: true, message: "Logged out" };
};

// Export for backward compatibility
export default {
  loginUserFlask,
  registerUserFlask,
  getCurrentUserFlask,
  logoutUserFlask,
};
