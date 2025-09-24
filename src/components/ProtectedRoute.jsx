import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getAuthData } from '../redux/auth/selectors';

const ProtectedRoute = ({ children }) => {
  const { loading, user, userLoggedIn } = useSelector(getAuthData);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (userLoggedIn && user) ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;