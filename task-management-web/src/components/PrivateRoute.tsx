// src/components/PrivateRoute.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  // If still loading, show nothing or a loading spinner
  if (loading) {
    return null; // Or <p>Loading...</p> or a spinner
  }

  // If authenticated, render the child routes
  // Otherwise, redirect to the authentication page
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
