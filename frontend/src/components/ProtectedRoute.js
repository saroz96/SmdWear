// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children, requireAuth = true }) => {
//   const { currentUser, loading } = useAuth();
//   const location = useLocation();

//   if (loading) {
//     return <div className="loading-spinner">Loading...</div>; // Or your custom loader
//   }

//   if (requireAuth && !currentUser) {
//     // Redirect to login with return location
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (!requireAuth && currentUser) {
//     // Redirect away if auth isn't required but user is logged in
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !currentUser) {
        // First show the message
        setShowMessage(true);
        // Then set a flag to redirect after delay
        const timer = setTimeout(() => {
          setShouldRedirect(true);
        }, 3000); // 3 seconds delay
        return () => clearTimeout(timer);
      }
    }
  }, [loading, currentUser, requireAuth]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (shouldRedirect && requireAuth && !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && currentUser) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {showMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '10px 20px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          animation: 'fadeIn 0.5s'
        }}>
          Please login to view this resource
        </div>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;