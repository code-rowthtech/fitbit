import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordConfirm } from '../../helpers/api/auth';
import '../../pages/Login.css';
import logo_bg from '../../assets/images/logo_bg.png';
import { IoEye, IoEyeOff } from "react-icons/io5";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const email = sessionStorage.getItem('resetEmail');
    if (!email) {
      setError('Session expired. Please start the process again.');
      return;
    }
    
    setLoading(true);
    
    try {
      await forgotPasswordConfirm({ 
        email: email,
        password: formData.password 
      });
      setSuccess('Password updated successfully!');
      sessionStorage.removeItem('resetEmail');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-white mb-4 login-title">Change Password</h2>
        </div>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
        {success && <Alert variant="success" className="mb-3">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder='Enter new password'
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

          <Form.Group className="mb-4">
            <Form.Label className="text-white mb-2 login-label">Confirm Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder='Confirm new password'
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
            className="w-100 mb-3 mt-2 login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ChangePassword;