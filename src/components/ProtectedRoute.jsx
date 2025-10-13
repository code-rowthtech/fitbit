import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAuthData } from '../redux/auth/selectors';
import { checkTokenAndRedirect } from '../utils/tokenUtils';

const ProtectedRoute = ({ children }) => {
  const { loading, user, userLoggedIn } = useSelector(getAuthData);
  
  useEffect(() => {
    // Check token expiration on component mount and periodically
    const checkToken = () => {
      if (userLoggedIn && user) {
        checkTokenAndRedirect();
      }
    };
    
    checkToken();
    
    // Check token every 5 minutes
    const interval = setInterval(checkToken, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [userLoggedIn, user]);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  return (userLoggedIn && user) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;