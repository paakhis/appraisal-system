import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every outgoing request
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('appraise_user');
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // ignore malformed storage
    }
  }
  return config;
});

// Handle the sliding-expiry refresh header from JwtAuthFilter
api.interceptors.response.use((response) => {
  const refreshedToken = response.headers['x-refreshed-token'];
  if (refreshedToken) {
    const stored = localStorage.getItem('appraise_user');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        user.token = refreshedToken;
        localStorage.setItem('appraise_user', JSON.stringify(user));
      } catch {
        // ignore
      }
    }
  }
  return response;
});

export default api;