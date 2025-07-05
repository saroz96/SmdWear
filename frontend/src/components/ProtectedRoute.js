import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>; // Or your custom loader
  }

  if (requireAuth && !currentUser) {
    // Redirect to login with return location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && currentUser) {
    // Redirect away if auth isn't required but user is logged in
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;