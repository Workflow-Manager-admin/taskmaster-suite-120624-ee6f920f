import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';
import taskService from '../services/taskService';
import authService from '../services/authService';
import './TaskList.css';

// PUBLIC_INTERFACE
/**
 * TaskList component for displaying and managing tasks
 * @returns {JSX.Element} TaskList component
 */
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    limit: 50,
    offset: 0
  });
  const [stats, setStats] = useState(null);

  // Load tasks when component mounts or filters change
  useEffect(() => {
    loadTasks();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load task statistics
  useEffect(() => {
    loadStats();
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Load tasks from API
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getAllTasks(filters);
      setTasks(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Load task statistics
   */
  const loadStats = async () => {
    try {
      const response = await taskService.getTaskStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle filter changes
   * @param {Object} newFilters - New filter values
   */
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
  };

  // PUBLIC_INTERFACE
  /**
   * Handle task creation
   * @param {Object} taskData - Task data
   */
  const handleCreateTask = async (taskData) => {
    try {
      const currentUser = authService.getCurrentUser();
      const taskWithUser = { ...taskData, user_id: currentUser.id };
      
      await taskService.createTask(taskWithUser);
      setShowForm(false);
      loadTasks();
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle task update
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   */
  const handleUpdateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      setEditingTask(null);
      loadTasks();
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle task status update
   * @param {number} id - Task ID
   * @param {string} status - New status
   */
  const handleStatusUpdate = async (id, status) => {
    try {
      await taskService.updateTaskStatus(id, status);
      loadTasks();
      loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle task deletion
   * @param {number} id - Task ID
   */
  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        loadTasks();
        loadStats();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Handle task edit
   * @param {Object} task - Task to edit
   */
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // PUBLIC_INTERFACE
  /**
   * Handle form cancellation
   */
  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="task-list-container">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <div className="header-content">
          <h2>Task Management</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            + Add Task
          </button>
        </div>
        
        {stats && (
          <div className="task-stats">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completed:</span>
              <span className="stat-value">{stats.by_status?.completed || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">In Progress:</span>
              <span className="stat-value">{stats.by_status?.in_progress || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending:</span>
              <span className="stat-value">{stats.by_status?.pending || 0}</span>
            </div>
          </div>
        )}
      </div>

      <div className="task-list-content">
        <div className="task-filter-sidebar">
          <TaskFilter 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="task-list-main">
          {error && (
            <div className="error-message">
              {error}
              <button 
                className="btn btn-secondary"
                onClick={() => setError(null)}
              >
                Dismiss
              </button>
            </div>
          )}

          {tasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks found</h3>
              <p>Create your first task to get started!</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add Task
              </button>
            </div>
          ) : (
            <div className="task-list-items">
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? 
                (data) => handleUpdateTask(editingTask.id, data) : 
                handleCreateTask
              }
              onCancel={handleCancelForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
