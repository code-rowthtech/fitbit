import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const LoginRedirect = () => {
  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="shadow-sm text-center">
            <Card.Body className="p-4">
              <div className="mb-4">
                <img 
                  src="https://accounts.fitbit.com/assets/fitbit-logo-new.svg" 
                  alt="Fitbit Logo" 
                  style={{ height: '40px' }}
                />
              </div>
              <h5 className="mb-3">You have been logged out</h5>
              <p className="text-muted mb-4">Please login again to continue</p>
              <Button variant="primary" onClick={handleLoginRedirect} className="w-100">
                Go to Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginRedirect;