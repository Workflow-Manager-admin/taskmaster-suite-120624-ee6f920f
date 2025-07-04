import React from 'react';
import './TaskFilter.css';

// PUBLIC_INTERFACE
/**
 * TaskFilter component for filtering tasks
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.onFilterChange - Filter change handler function
 * @returns {JSX.Element} TaskFilter component
 */
const TaskFilter = ({ filters, onFilterChange }) => {
  // PUBLIC_INTERFACE
  /**
   * Handle filter change
   * @param {string} filterType - Type of filter (status, priority, etc.)
   * @param {string} value - Filter value
   */
  const handleFilterChange = (filterType, value) => {
    onFilterChange({
      [filterType]: value
    });
  };

  // PUBLIC_INTERFACE
  /**
   * Clear all filters
   */
  const clearFilters = () => {
    onFilterChange({
      status: '',
      priority: '',
      limit: 50,
      offset: 0
    });
  };

  // PUBLIC_INTERFACE
  /**
   * Check if any filters are active
   * @returns {boolean} True if any filters are active
   */
  const hasActiveFilters = () => {
    return filters.status || filters.priority;
  };

  return (
    <div className="task-filter">
      <div className="filter-header">
        <h3>Filters</h3>
        {hasActiveFilters() && (
          <button 
            className="btn btn-sm btn-secondary"
            onClick={clearFilters}
          >
            Clear All
          </button>
        )}
      </div>

      <div className="filter-section">
        <h4>Status</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="status"
              value=""
              checked={filters.status === ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            <span>All</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="status"
              value="pending"
              checked={filters.status === 'pending'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            <span>Pending</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="status"
              value="in_progress"
              checked={filters.status === 'in_progress'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            <span>In Progress</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="status"
              value="completed"
              checked={filters.status === 'completed'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            <span>Completed</span>
          </label>
          <label className="filter-option">
            <input
              type="radio"
              name="status"
              value="cancelled"
              checked={filters.status === 'cancelled'}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            />
            <span>Cancelled</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>Priority</h4>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="radio"
              name="priority"
              value=""
              checked={filters.priority === ''}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            />
            <span>All</span>
          </label>
          <label className="filter-option priority-critical">
            <input
              type="radio"
              name="priority"
              value="critical"
              checked={filters.priority === 'critical'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            />
            <span>Critical</span>
          </label>
          <label className="filter-option priority-urgent">
            <input
              type="radio"
              name="priority"
              value="urgent"
              checked={filters.priority === 'urgent'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            />
            <span>Urgent</span>
          </label>
          <label className="filter-option priority-high">
            <input
              type="radio"
              name="priority"
              value="high"
              checked={filters.priority === 'high'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            />
            <span>High</span>
          </label>
          <label className="filter-option priority-medium">
            <input
              type="radio"
              name="priority"
              value="medium"
              checked={filters.priority === 'medium'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            />
            <span>Medium</span>
          </label>
          <label className="filter-option priority-low">
            <input
              type="radio"
              name="priority"
              value="low"
              checked={filters.priority === 'low'}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            />
            <span>Low</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h4>Display</h4>
        <div className="filter-options">
          <label className="filter-option">
            <span>Items per page:</span>
            <select
              value={filters.limit || 50}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="filter-select"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
