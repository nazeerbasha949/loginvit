import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check authentication directly from localStorage
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // Only redirect to login if both token and role are missing
  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
};

export default PrivateRoute; 