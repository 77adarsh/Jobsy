import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

// Make sure you have VITE_BACKEND_API_URL in your .env file
const BACKEND_URL = process.env.VITE_BACKEND_API_URL;

axios.defaults.baseURL = BACKEND_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);
  const [requiresPasswordChange, setRequiresPasswordChange] = useState(false);
  const navigate = useNavigate();

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
          if (decoded.exp * 1000 < Date.now()) {
            console.log("Token expired, logging out");
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            setRequiresPasswordChange(false);
            setIsLoading(false);
            return;
          }

          if (decoded.isTemporaryPassword) {
            setRequiresPasswordChange(true);
          }

          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;

          try {
            const response = await axios.get("/auth/me");
            setUser(response.data.user);
            setToken(storedToken);
          } catch (error) {
            console.error("Error fetching user data:", error);
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

  useEffect(() => {
    if (requiresPasswordChange && user && !isLoading) {
      navigate("/set-new-password");
    }
  }, [requiresPasswordChange, user, isLoading, navigate]);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/auth/login", { email, password });
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
      const response = await axios.post("/auth/register", {
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
      const response = await axios.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (newPassword) => {
    try {
      const response = await axios.post("/auth/change-password", {
        newPassword,
      });

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

export const useAuth = () => useContext(AuthContext);