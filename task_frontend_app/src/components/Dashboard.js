import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import TaskList from './TaskList';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Dashboard component for authenticated users
 * @returns {JSX.Element} Dashboard component
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // PUBLIC_INTERFACE
  /**
   * Handle user logout
   */
  const handleLogout = () => {
    logout();
  };

  // PUBLIC_INTERFACE
  /**
   * Handle navigation to different sections
   * @param {string} path - Navigation path
   */
  const handleNavigation = (path) => {
    navigate(path);
  };

  // PUBLIC_INTERFACE
  /**
   * Check if current path is active
   * @param {string} path - Path to check
   * @returns {boolean} True if path is active
   */
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-nav">
          <h1>TaskMaster</h1>
          <nav className="nav-links">
            <button 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => handleNavigation('/dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-link ${isActive('/dashboard/tasks') ? 'active' : ''}`}
              onClick={() => handleNavigation('/dashboard/tasks')}
            >
              Tasks
            </button>
          </nav>
          <div className="user-actions">
            <span className="user-greeting">
              Welcome, {user?.name || user?.first_name || 'User'}!
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <Routes>
          <Route path="/" element={<DashboardHome onNavigate={handleNavigation} />} />
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </main>
    </div>
  );
};

// PUBLIC_INTERFACE
/**
 * Dashboard home component
 * @param {Object} props - Component props
 * @param {Function} props.onNavigate - Navigation handler
 * @returns {JSX.Element} Dashboard home component
 */
const DashboardHome = ({ onNavigate }) => {
  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome to TaskMaster</h2>
        <p>Your task management dashboard is ready to use.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Tasks</h3>
          <p>Manage and organize your tasks efficiently.</p>
          <button 
            className="card-button"
            onClick={() => onNavigate('/dashboard/tasks')}
          >
            View Tasks
          </button>
        </div>

        <div className="dashboard-card">
          <h3>Projects</h3>
          <p>Track your projects and their progress.</p>
          <button className="card-button">View Projects</button>
        </div>

        <div className="dashboard-card">
          <h3>Analytics</h3>
          <p>View insights and analytics about your productivity.</p>
          <button className="card-button">View Analytics</button>
        </div>

        <div className="dashboard-card">
          <h3>Settings</h3>
          <p>Customize your preferences and account settings.</p>
          <button className="card-button">Open Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
