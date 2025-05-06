// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const response = await authService.getProfile();
        setUser(response.data);
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(userData);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authService.forgotPassword(email);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Password reset request failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Value to be provided throughout the app
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;