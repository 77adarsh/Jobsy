import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Set the Authorization header for all future requests when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
            console.log('Token expired, logging out');
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsLoading(false);
            return;
          }

          // Set default headers for axios
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          try {
            const response = await axios.get('/api/auth/me');
            setUser(response.data.user);
            setToken(storedToken);
          } catch (error) {
            console.error('Error fetching user data:', error);
            // Only clear auth if it's a 401 Unauthorized error
            if (error.response && error.response.status === 401) {
              localStorage.removeItem('token');
              setToken(null);
              setUser(null);
            }
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []); // Remove navigate from dependency array

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: loggedInUser } = response.data;
      
      // First set the token and user in state
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      
      // Then navigate after state is updated
      return true;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const forgotPassword = async (email) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};