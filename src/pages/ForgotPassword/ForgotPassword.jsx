import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../helpers/api/auth";
import "../Login.css";
import logo_bg from "../../assets/images/logo_bg.png";
import { useSelector } from "react-redux";
import { getAuthData } from "../../redux/auth/selectors";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { passwordReset } = useSelector(getAuthData);

  const handleInputChange = (e, callback) => {
    callback(e);
  };

  const preventFirstSpace = (e) => {
    if (e.target.value.length === 0 && e.key === " ") {
      e.preventDefault();
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");

    try {
      await forgotPassword({ email: data.email });
      sessionStorage.setItem("resetEmail", data.email);
      navigate("/verify-otp");
    } catch (err) {
      setError(err || "Failed to send OTP");
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
          <h2 className="text-white mb-4 login-title">Forgot Password?</h2>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group className="mb-4">
            <Form.Label className="text-white mb-2 login-label">
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="username@gmail.com"
              autoComplete="off"
              onKeyDown={(e) => {
                preventFirstSpace(e);
                const isEmoji =
                  /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                    e.key
                  );
                if (isEmoji && e.key.length === 1) {
                  e.preventDefault();
                }
              }}
              onPaste={(e) => {
                const pastedText = e.clipboardData.getData("text");
                const hasEmoji =
                  /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                    pastedText
                  );
                if (hasEmoji) {
                  e.preventDefault();
                }
              }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Please enter a valid email address",
                },
                validate: {
                  noEmojis: (value) =>
                    !/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
                      value
                    ) || "Emojis are not allowed in email",
                },
                onChange: (e) =>
                  handleInputChange(e, (e) =>
                    setValue("email", e.target.value)
                  ),
              })}
              className="login-input"
            />
            {errors.email && (
              <span className="text-danger" style={{ fontSize: "10px" }}>
                {errors.email.message}
              </span>
            )}
          </Form.Group>

          <Button
            className="w-100 mb-3 mt-2 login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
