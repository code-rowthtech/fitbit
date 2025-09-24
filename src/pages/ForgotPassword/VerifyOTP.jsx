import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../Login.css';
import logo_bg from '../../assets/images/logo_bg.png';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const navigate = useNavigate();

    const handleOtpChange = (index, value) => {
        if (value.length <= 1) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/change-password');
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
                    <h2 className="text-white mb-4 login-title">Verify OTP</h2>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <div className="d-flex justify-content-center gap-3">
                            {otp.map((digit, index) => (
                                <Form.Control
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    className="login-input text-center border-0"
                                    style={{ width: '60px', height: '60px', fontSize: '28px', backgroundColor: '#8bb4f1', color: 'white' }}
                                    required
                                />
                            ))}
                        </div>
                    </Form.Group>
                    <div className='text-center'>
                        <p className='text-white login-label'>
                            00:120 sec
                        </p>
                    </div>

                    <Button
                        className="w-100 mb-3 mt-2 login-btn"
                        type="submit"
                    >
                        Sign in
                    </Button>

                    <div className="text-center">
                        <span className="text-white login-text">Don’t receive code? </span>
                        <a href="#" className="text-white text-decoration-underline fw-bold login-text">Re-send</a>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default VerifyOTP