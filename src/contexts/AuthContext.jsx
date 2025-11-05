import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const apiUrl = import.meta.env.VITE_APP_API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (username, password, role) => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        const data = await response.json();
        const userData = { username, role };
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem("authToken", data.token || "auth-token");
        localStorage.setItem("userData", JSON.stringify(userData));
        return { success: true };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || "Login failed" };
      }
    } catch (error) {
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Clear all auth-related data
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
  };

  const value = {
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
