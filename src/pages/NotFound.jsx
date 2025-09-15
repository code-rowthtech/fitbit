import { Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="display-1">404</h1>
      <h2>Page Not Found</h2>
      <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate(-1)}>Go to Dashboard</Button>
    </Container>
  );
};

export default NotFound;