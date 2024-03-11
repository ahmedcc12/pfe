import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';

const PublicRoute = ({ children }) => {
  const { auth } = useAuth();

  return auth.accessToken ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
