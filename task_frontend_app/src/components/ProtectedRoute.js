import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// PUBLIC_INTERFACE
/**
 * Protected route component that redirects unauthenticated users
 * @param {Object} props - Component props
 * @param {JSX.Element} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
