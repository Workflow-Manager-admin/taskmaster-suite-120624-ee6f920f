import React, { useEffect, useState } from 'react';
import authService from '../services/authService';
import './Dashboard.css';

// PUBLIC_INTERFACE
/**
 * Dashboard component for authenticated users
 * @returns {JSX.Element} Dashboard component
 */
const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  // PUBLIC_INTERFACE
  /**
   * Handle user logout
   */
  const handleLogout = () => {
    authService.logout();
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-nav">
          <h1>TaskMaster</h1>
          <div className="user-actions">
            <span className="user-greeting">
              Welcome, {user?.name || 'User'}!
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h2>Welcome to TaskMaster</h2>
            <p>Your task management dashboard is ready to use.</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Tasks</h3>
              <p>Manage and organize your tasks efficiently.</p>
              <button className="card-button">View Tasks</button>
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
      </main>
    </div>
  );
};

export default Dashboard;
