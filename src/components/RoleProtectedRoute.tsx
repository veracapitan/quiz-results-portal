import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: 'doctor' | 'patient';
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-softGreen-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect if user doesn't have the required role
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'doctor' ? '/doctor-results' : '/'} />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;