import axios from 'axios';

// API base URL from environment variable
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://vscode-internal-83110-beta.beta01.cloud.kavia.ai:3001';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, remove it and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // PUBLIC_INTERFACE
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @param {string} userData.name - User name
   * @returns {Promise<Object>} Registration response
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/api/auth/register', userData);
      if (response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/api/auth/login', credentials);
      if (response.data.token) {
        this.setAuthToken(response.data.token);
        this.setUser(response.data.user);
      }
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // PUBLIC_INTERFACE
  /**
   * Get current user from localStorage
   * @returns {Object|null} Current user data or null
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // PUBLIC_INTERFACE
  /**
   * Check if user is authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  // PUBLIC_INTERFACE
  /**
   * Get auth token
   * @returns {string|null} Auth token or null
   */
  getAuthToken() {
    return localStorage.getItem('authToken');
  }

  /**
   * Set auth token in localStorage
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    localStorage.setItem('authToken', token);
  }

  /**
   * Set user data in localStorage
   * @param {Object} user - User data
   */
  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Handle API errors
   * @param {Error} error - Axios error object
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

const authService = new AuthService();
export default authService;
