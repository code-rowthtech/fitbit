import { useEffect } from 'react';
import { checkTokenAndRedirect } from '../utils/tokenUtils';

const withTokenValidation = (WrappedComponent) => {
  return function TokenValidatedComponent(props) {
    useEffect(() => {
      // Check token on component mount
      checkTokenAndRedirect();
      
      // Set up periodic token validation (every 5 minutes)
      const interval = setInterval(() => {
        checkTokenAndRedirect();
      }, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default withTokenValidation;