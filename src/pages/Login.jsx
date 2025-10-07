// import { useState, useEffect } from 'react';
// import { Form, Button, Alert } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux';
// import { Navigate, Link } from 'react-router-dom';
// import { loginUser, resetAuth } from '../redux/auth/actions';
// import { getAuthData } from '../redux/auth/selectors';
// import './Login.css';
// import logo_bg from '../assets/images/logo_bg.png';
// import { IoEye, IoEyeOff } from "react-icons/io5";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const dispatch = useDispatch();
//   const { loading, error, userLoggedIn, user } = useSelector(getAuthData);
//   console.log(error,'errorerror')

//   useEffect(() => {
//     dispatch(resetAuth());
//   }, [dispatch]);

//   if (userLoggedIn && user) {
//     return <Navigate to={`/patient-dashboard/${user?.patientId}`} replace />;
//   }
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(loginUser(formData.username, formData.password));
//   };

//   return (
//     <div className="vh-100 d-flex align-items-center justify-content-center position-relative px-3 login-bg">
//       <img
//         src={logo_bg}
//         alt="Background"
//         className="d-none d-md-block login-bg-image"
//       />
//       <div className="login-form-container w-100">
//         <div className="mb-2">
//           <h2 className="text-white mb-4 login-title">Login</h2>
//         </div>

//         {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-2">
//             <Form.Label className="text-white mb-2 login-label">Email</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder='Username@gmail.com'
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="login-input"
//             />
//           </Form.Group>

//           <Form.Group className="mb-2">
//             <Form.Label className="text-white mb-2 login-label">Password</Form.Label>
//             <div className="position-relative">
//               <Form.Control
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder='Password'
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="login-input pe-5"
//               />
//               <button
//                 type="button"
//                 className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <IoEyeOff className="text-muted" /> : <IoEye className="text-muted" />}
//               </button>
//             </div>
//           </Form.Group>

//           <div className="mb-3">
//             <Link to="/forgot-password" className="text-white text-decoration-none login-text">Forgot Password?</Link>
//           </div>

//           <Button
//             className="w-100 mb-3 login-btn"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? 'Signing in...' : 'Sign In'}
//           </Button>

//           {/* <div className="text-center mb-3">
//             <span className="text-white login-text">or continue with</span>
//           </div>

//           <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
//             <Button variant="light" className="rounded-3 d-flex align-items-center justify-content-center social-btn">
//               <FcGoogle  className='fs-4'/>
//             </Button>
//             <Button variant="light" className="rounded-3 d-flex align-items-center justify-content-center social-btn">
//               <IoLogoGithub  className='fs-4'/>
//             </Button>
//             <Button variant="light" className="rounded-3 d-flex align-items-center justify-content-center social-btn">
//               <RiFacebookCircleFill style={{color:'#059BE5'}} className='fs-4'/>
//             </Button>
//           </div> */}

//           {/* <div className="text-center">
//             <span className="text-white login-text">Don't have an account? </span>
//             <Link to="/signup" className="text-white text-decoration-underline fw-bold login-text">Sign Up</Link>
//           </div> */}
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginUser, resetAuth } from "../redux/auth/actions";
import { getAuthData } from "../redux/auth/selectors";
import "./Login.css";
import logo_bg from "../assets/images/logo_bg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { loading, error, userLoggedIn, user } = useSelector(getAuthData);

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  if (userLoggedIn && user) {
    return <Navigate to={`/patient-dashboard/${user?.patientId}`} replace />;
  }

  const handleInputChange = (e, callback) => {
    callback(e);
  };

  const preventFirstSpace = (e) => {
    if (e.target.value.length === 0 && e.key === " ") {
      e.preventDefault();
    }
  };

  const onSubmit = (data) => {
    dispatch(loginUser(data.email, data.password));
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
          <h2 className="text-white mb-4 login-title">Login</h2>
        </div>

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="Username@gmail.com"
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

          <Form.Group className="mb-2">
            <Form.Label className="text-white mb-2 login-label">
              Password <span className="text-danger">*</span>
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onKeyDown={preventFirstSpace}
                {...register("password", {
                  required: "Password is required",
                })}
                className="login-input pe-5"
              />
              <button
                type="button"
                className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOff className="text-muted" />
                ) : (
                  <IoEye className="text-muted" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-danger" style={{ fontSize: "10px" }}>
                {errors.password.message}
              </span>
            )}
          </Form.Group>

          <div className="mb-3">
            <Link
              to="/forgot-password"
              className="text-white text-decoration-none login-text"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            className="w-100 mb-3 login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
