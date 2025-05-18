import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Read the API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const navigate = useNavigate();

  // Set the Authorization header for all future requests when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log("Token expired, logging out");
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            setRequiresPasswordChange(false);
            setIsLoading(false);
            return;
          }

          // Check if this is a temporary password
          if (decoded.isTemporaryPassword) {
            setRequiresPasswordChange(true);
          }

          // Set default headers for axios
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;

          try {
            const response = await axios.get(`${API_BASE_URL}/auth/me`);
            setUser(response.data.user);
            setToken(storedToken);
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Only clear auth if it's a 401 Unauthorized error
            if (error.response && error.response.status === 401) {
              localStorage.removeItem("token");
              setToken(null);
              setUser(null);
              setRequiresPasswordChange(false);
            }
          }
        } catch (error) {
          console.error("Error decoding token:", error);
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
          setRequiresPasswordChange(false);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Handle redirecting to change password page if needed
  useEffect(() => {
    if (requiresPasswordChange && user && !isLoading) {
      navigate("/set-new-password");
    }
  }, [requiresPasswordChange, user, isLoading, navigate]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token: newToken, user: loggedInUser } = response.data || {};

      if (loggedInUser?.requiresPasswordChange) {
        setRequiresPasswordChange(true);
      }

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(loggedInUser);

      return true;
    } catch (error) {
      console.error(
        "Login error in AuthContext:",
        error?.response?.data || error.message
      );
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRequiresPasswordChange(false);
    navigate("/login");
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (newPassword) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/change-password`, {
        newPassword,
      });

      // Update token and user state with the new values
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        setRequiresPasswordChange(false);
      }

      return response.data;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    requiresPasswordChange,
    login,
    register,
    logout,
    forgotPassword,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};