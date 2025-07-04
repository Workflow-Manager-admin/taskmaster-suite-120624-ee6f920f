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

class TaskService {
  // PUBLIC_INTERFACE
  /**
   * Get all tasks with optional filtering
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Filter by status (pending, in_progress, completed, cancelled)
   * @param {string} filters.priority - Filter by priority (low, medium, high, urgent, critical)
   * @param {number} filters.user_id - Filter by user ID
   * @param {number} filters.limit - Limit number of results
   * @param {number} filters.offset - Offset for pagination
   * @returns {Promise<Object>} Tasks response
   */
  async getAllTasks(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await apiClient.get(`/api/tasks?${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get task by ID
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Task data
   */
  async getTaskById(id) {
    try {
      const response = await apiClient.get(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description
   * @param {string} taskData.priority - Task priority
   * @param {string} taskData.due_date - Task due date
   * @param {number} taskData.user_id - User ID
   * @returns {Promise<Object>} Created task data
   */
  async createTask(taskData) {
    try {
      const response = await apiClient.post('/api/tasks', taskData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update task (full update)
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise<Object>} Updated task data
   */
  async updateTask(id, taskData) {
    try {
      const response = await apiClient.put(`/api/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Update task status only
   * @param {number} id - Task ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated task data
   */
  async updateTaskStatus(id, status) {
    try {
      const response = await apiClient.patch(`/api/tasks/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Delete task
   * @param {number} id - Task ID
   * @returns {Promise<Object>} Delete response
   */
  async deleteTask(id) {
    try {
      const response = await apiClient.delete(`/api/tasks/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // PUBLIC_INTERFACE
  /**
   * Get task statistics
   * @param {number} userId - User ID (optional)
   * @returns {Promise<Object>} Task statistics
   */
  async getTaskStats(userId = null) {
    try {
      const params = userId ? `?user_id=${userId}` : '';
      const response = await apiClient.get(`/api/tasks/stats${params}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
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

const taskService = new TaskService();
export default taskService;
