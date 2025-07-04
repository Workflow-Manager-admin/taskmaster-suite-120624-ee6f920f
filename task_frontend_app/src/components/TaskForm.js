import React, { useState, useEffect } from 'react';
import './TaskForm.css';

// PUBLIC_INTERFACE
/**
 * TaskForm component for creating and editing tasks
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object for editing (null for creating)
 * @param {Function} props.onSubmit - Submit handler function
 * @param {Function} props.onCancel - Cancel handler function
 * @returns {JSX.Element} TaskForm component
 */
const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form with task data when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  // PUBLIC_INTERFACE
  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Validate form data
   * @returns {Object} Validation errors
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be less than 200 characters';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!['low', 'medium', 'high', 'urgent', 'critical'].includes(formData.priority)) {
      newErrors.priority = 'Invalid priority level';
    }

    if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(formData.status)) {
      newErrors.status = 'Invalid status';
    }

    if (formData.due_date) {
      const dueDate = new Date(formData.due_date);
      if (isNaN(dueDate.getTime())) {
        newErrors.due_date = 'Invalid due date';
      }
    }

    return newErrors;
  };

  // PUBLIC_INTERFACE
  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const submitData = {
        ...formData,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null
      };

      await onSubmit(submitData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <div className="task-form-header">
        <h2>{task ? 'Edit Task' : 'Create New Task'}</h2>
        <button 
          className="btn btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter task title"
            disabled={loading}
            maxLength={200}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Enter task description (optional)"
            disabled={loading}
            rows={4}
            maxLength={1000}
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className={errors.priority ? 'error' : ''}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority && <span className="error-message">{errors.priority}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={errors.status ? 'error' : ''}
              disabled={loading}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && <span className="error-message">{errors.status}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className={errors.due_date ? 'error' : ''}
            disabled={loading}
          />
          {errors.due_date && <span className="error-message">{errors.due_date}</span>}
        </div>

        {errors.submit && (
          <div className="error-banner">
            {errors.submit}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
