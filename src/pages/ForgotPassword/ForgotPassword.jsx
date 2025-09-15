import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../Login.css';
import logo_bg from '../../assets/images/logo_bg.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle send OTP logic here
    navigate('/verify-otp');
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center position-relative px-3 login-bg">
      <img
        src={logo_bg}
        alt="Background"
        className="d-none d-md-block login-bg-image"
      />
      <div className="login-form-container w-100">
        <div className="mb-2">
          <h2 className="text-white mb-4 login-title">Forgot Password?</h2>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="text-white mb-2 login-label">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder='username@gmail.com'
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input"
            />
          </Form.Group>

          <Button
            className="w-100 mb-3 mt-2 login-btn"
            type="submit"
          >
            Send OTP
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;