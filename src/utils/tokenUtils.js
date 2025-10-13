import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const AUTH_SESSION_KEY = "fitbit_user";

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.warn("Invalid token format:", error);
    return true;
  }
};

export const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem(AUTH_SESSION_KEY);
};

export const handleTokenExpiration = () => {
  console.warn("Access token expired!");
  toast.error("Your session has expired. Redirecting you to the login page.");
  clearAuthData();
  setTimeout(() => {
    window.location.href = "/login";
  }, 1000);
};

export const checkTokenAndRedirect = () => {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    handleTokenExpiration();
    return false;
  }
  return true;
};
