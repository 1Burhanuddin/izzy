
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type ProtectedRouteProps = {
  requireAdmin?: boolean;
  redirectPath?: string;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin = false,
  redirectPath = '/login',
}) => {
  const { user, isAdmin, isLoading } = useAuth();

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

  if (requireAdmin && !isAdmin) {
    toast.error('Admin access required for this page');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
