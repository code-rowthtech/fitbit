import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const AUTH_SESSION_KEY = "fitbit_user";

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!navigator.onLine) {
      window.location.href = "/no-internet";
      return Promise.reject("No internet connection");
    }

    if (!error.response) {
      return Promise.reject(error.message || "An unexpected error occurred.");
    }

    const { status, data } = error.response;
    let message;

    switch (status) {
      case 401:
        message = data?.message || "Unauthorized access";
        // Check if token exists and is expired
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decoded.exp < currentTime) {
              console.warn("Access token expired!");
              toast.error(
                "Your session has expired. Redirecting you to the login page."
              );
            }
          } catch (decodeError) {
            console.warn("Invalid token format");
            toast.error("Invalid session. Redirecting you to the login page.");
          }
        }
        // Clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem(AUTH_SESSION_KEY);
        // Redirect to login
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        break;
      case 403:
        message = data?.message || "Access Forbidden";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem(AUTH_SESSION_KEY);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        break;
      case 400:
        message = data?.message || data?.error || "Bad Request";
        break;
      case 404:
        message =
          data?.message ||
          "Sorry! The data you are looking for could not be found.";
        break;
      case 500:
        message = data?.message || "Internal server error";
        break;
      default:
        message =
          data?.message || error.message || "An unknown error occurred.";
    }

    return Promise.reject(message);
  }
);

export default api;
