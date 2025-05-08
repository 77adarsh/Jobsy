import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Correct import
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // ✅ Named import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken); // ✅ Updated usage
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            navigate('/login');
            return;
          }

          try {
            const response = await axios.get('/api/auth/me', {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });            
            setUser(response.data.user);
            setToken(storedToken);
          } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            navigate('/login');
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          navigate('/login');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [navigate]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: loggedInUser } = response.data;
      console.log('Login response from server:', response.data);
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(loggedInUser);
      console.log('State after setting user and token:', { user: loggedInUser, token: newToken });
      navigate('/');
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
      navigate('/');
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
