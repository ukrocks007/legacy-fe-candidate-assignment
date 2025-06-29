import React from 'react';
import { Navigate } from 'react-router-dom';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
}) => {
  const { user, primaryWallet } = useDynamicContext();
  const { isAuthenticated } = useAuth();

  // If authentication is required
  if (requireAuth) {
    // Check if wallet is connected
    if (!user || !primaryWallet) {
      return <Navigate to='/' replace />;
    }

    // Check if user is authenticated with backend
    if (!isAuthenticated) {
      return <Navigate to='/' replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
