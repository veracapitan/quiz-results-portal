import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();

  // Redirect doctors to their dedicated results page
  if (user?.role === 'doctor') {
    return <Navigate to="/doctor-results" />;
  }

  // Redirect patients to cuestionarios page
  if (user?.role === 'patient') {
    return <Navigate to="/cuestionarios" />;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/login" />;
};

export default Index;
