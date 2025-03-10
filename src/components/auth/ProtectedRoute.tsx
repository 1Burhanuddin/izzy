
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type ProtectedRouteProps = {
  adminOnly?: boolean;
  redirectPath?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  adminOnly = false,
  redirectPath = '/login',
}) => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check for admin access on each location change for protected routes
    if (!isLoading && adminOnly && user && !isAdmin) {
      toast.error('Admin access required for this page');
    }
  }, [location.pathname, isLoading, adminOnly, user, isAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    toast.error('Please sign in to access this page');
    return <Navigate to={redirectPath} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
