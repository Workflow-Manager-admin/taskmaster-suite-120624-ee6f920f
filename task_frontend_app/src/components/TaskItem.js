import React from 'react';
import './TaskItem.css';

// PUBLIC_INTERFACE
/**
 * TaskItem component for displaying individual tasks
 * @param {Object} props - Component props
 * @param {Object} props.task - Task object
 * @param {Function} props.onEdit - Edit handler function
 * @param {Function} props.onDelete - Delete handler function
 * @param {Function} props.onStatusChange - Status change handler function
 * @returns {JSX.Element} TaskItem component
 */
const TaskItem = ({ task, onEdit, onDelete, onStatusChange }) => {
  // PUBLIC_INTERFACE
  /**
   * Get priority color class
   * @param {string} priority - Task priority
   * @returns {string} CSS class name
   */
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'priority-low';
      case 'medium': return 'priority-medium';
      case 'high': return 'priority-high';
      case 'urgent': return 'priority-urgent';
      case 'critical': return 'priority-critical';
      default: return 'priority-medium';
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Get status color class
   * @param {string} status - Task status
   * @returns {string} CSS class name
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'in_progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  // PUBLIC_INTERFACE
  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && task.status !== 'completed';
    
    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return isOverdue ? `${formatted} (Overdue)` : formatted;
  };

  // PUBLIC_INTERFACE
  /**
   * Check if task is overdue
   * @returns {boolean} True if task is overdue
   */
  const isOverdue = () => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  };

  // PUBLIC_INTERFACE
  /**
   * Handle status change
   * @param {Event} e - Change event
   */
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    onStatusChange(task.id, newStatus);
  };

  return (
    <div className={`task-item ${getStatusColor(task.status)} ${isOverdue() ? 'overdue' : ''}`}>
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              ✏️
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(task.id)}
              title="Delete task"
            >
              🗑️
            </button>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-meta">
          <div className="task-priority">
            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
              {task.priority?.toUpperCase() || 'MEDIUM'}
            </span>
          </div>

          <div className="task-status">
            <select 
              value={task.status || 'pending'} 
              onChange={handleStatusChange}
              className={`status-select ${getStatusColor(task.status)}`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="task-due-date">
            <span className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
              📅 {formatDate(task.due_date)}
            </span>
          </div>
        </div>

        {task.user && (
          <div className="task-assignee">
            <span className="assignee-label">Assigned to:</span>
            <span className="assignee-name">
              {task.user.first_name} {task.user.last_name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
