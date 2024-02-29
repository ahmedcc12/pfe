// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { auth } = useAuth();

  return !auth.token ? children : <Navigate to="/" replace />;
};

export default PublicRoute;