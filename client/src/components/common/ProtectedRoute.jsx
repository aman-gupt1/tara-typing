import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Handle unauthorized admin access notification
  useEffect(() => {
    if (!loading && isAuthenticated && user && requireAdmin && user.role !== 'admin') {
      toast.error('Access denied: Administrator privileges required.', {
        toastId: 'admin-access-denied',
      });
    }
  }, [loading, isAuthenticated, user, requireAdmin]);

  if (loading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm font-medium">Verifying session...</span>
        </div>
      </div>
    );
  }

  // Not authenticated at all -> Redirect to login page and remember target route
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated user attempting to access admin route without admin privileges
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  return <ProtectedRoute requireAdmin>{children}</ProtectedRoute>;
};

export default ProtectedRoute;
