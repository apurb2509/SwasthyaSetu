import React, { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) {
    // Optional: Show a loading spinner or a blank page while session is being checked
    return <div>Loading...</div>;
  }

  if (!session) {
    // If there is no user session, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If there is a session, render the child component (the protected page)
  return <>{children}</>;
};

export default ProtectedRoute;