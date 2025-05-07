import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';  // Import Navigate
import axios from 'axios';
import * as jwt_decode from 'jwt-decode';

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
          const decoded = jwt_decode(storedToken);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            navigate('/login');
            return;
          }

          try {
            const response = await axios.get('/api/auth/me');
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
      {children}  {/* Render children regardless of isLoading */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

//  Create a ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    //  Show a loading indicator while checking auth state
    return <div>Loading...</div>; //  Or a more sophisticated loader
  }
  if (!user) {
    //  Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }
  return children; //  Render the protected component
};

//  Example usage in your App.js or similar
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />  {/* Your protected home page */}
            </ProtectedRoute>
          }
        />
        {/* Other routes */}
      </Routes>
    </AuthProvider>
  );
};

export default App;