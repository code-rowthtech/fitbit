import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { verifyOtpPassword, forgotPassword } from "../../helpers/api/auth";
import "../Login.css";
import logo_bg from "../../assets/images/logo_bg.png";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(120);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next field if value is entered
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous field on backspace if current field is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpCode = parseInt(otp.join(""));
    const email = sessionStorage.getItem("resetEmail");

    try {
      await verifyOtpPassword({ otp: otpCode, email });
      navigate("/change-password");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError("");
    setOtp(["", "", "", ""]);
    const email = sessionStorage.getItem("resetEmail");

    try {
      await forgotPassword({ email });
      setTimer(120);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
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
          <h2 className="text-white mb-4 login-title">Verify OTP</h2>
        </div>

        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-4">
            <div className="d-flex justify-content-center gap-3">
              {otp.map((digit, index) => (
                <Form.Control
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="login-input text-center border-0"
                  style={{
                    width: "60px",
                    height: "60px",
                    fontSize: "28px",
                    backgroundColor: "#8bb4f1",
                    color: "white",
                  }}
                  required
                />
              ))}
            </div>
          </Form.Group>
          <div className="text-center">
            <p className="text-white login-label">
              {Math.floor(timer / 60)
                .toString()
                .padStart(2, "0")}
              :{(timer % 60).toString().padStart(2, "0")} sec
            </p>
          </div>

          <Button
            className="w-100 mb-3 mt-2 login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>

          {timer === 0 && (
            <div className="text-center">
              <span className="text-white login-text">
                Didn't receive the code?{" "}
              </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="btn btn-link text-white text-decoration-underline fw-bold login-text p-0"
              >
                {resendLoading ? "Sending..." : "Re-send"}
              </button>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default VerifyOTP;
