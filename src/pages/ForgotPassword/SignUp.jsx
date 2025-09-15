import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Link } from 'react-router-dom';
import { resetAuth } from '../../redux/auth/actions';
import { getAuthData } from '../../redux/auth/selectors';
import '../Login.css';
import logo_bg from '../../assets/images/logo_bg.png';
import { FcGoogle } from "react-icons/fc";
import { IoLogoGithub } from "react-icons/io5";
import { RiFacebookCircleFill } from "react-icons/ri";
import { IoEye, IoEyeOff } from "react-icons/io5";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, userLoggedIn, user } = useSelector(getAuthData);

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  if (userLoggedIn && user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add sign up logic here
    console.log('Sign up data:', formData);
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
          <h2 className="text-white mb-4 login-title">Sign Up</h2>
        </div>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder='First Name'
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="login-input"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder='Last Name'
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="login-input"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">Email</Form.Label>
            <Form.Control
              type="email"
              placeholder='username@gmail.com'
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="login-input"
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder='password'
                value={formData.password}
                onChange={handleChange}
                required
                className="login-input pe-5"
              />
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoEyeOff className="text-muted" /> : <IoEye className="text-muted" />}
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">Confirm Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder='confirm password'
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="login-input pe-5"
              />
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoEyeOff className="text-muted" /> : <IoEye className="text-muted" />}
              </button>
            </div>
          </Form.Group>

          <Button
            className="w-100 mb-3 mt-4 login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign In'}
          </Button>


          <div className="text-center">
            <span className="text-white login-text">Already have an account? </span>
            <Link to="/login" className="text-white text-decoration-underline fw-bold login-text">Login</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUp;