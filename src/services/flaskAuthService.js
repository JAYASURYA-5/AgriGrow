const API_BASE = 'http://localhost:5000/api';

export const flaskAuthService = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (data.success) {
      localStorage.setItem('flask_token', data.access_token);
      localStorage.setItem('flask_user', JSON.stringify(data.user));
    }
    return data;
  },
  
  getToken: () => localStorage.getItem('flask_token'),
  
  getHeaders: () => ({
    'Authorization': `Bearer ${localStorage.getItem('flask_token')}`,
    'Content-Type': 'application/json'
  }),

  logout: () => {
    localStorage.removeItem('flask_token');
    localStorage.removeItem('flask_user');
  }
};

export default flaskAuthService;

