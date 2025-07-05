import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, logout as reduxLogout } from '../auth/authSlice';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch(reduxLogout());
  }, [dispatch]);

  const validateToken = useCallback(async (token) => {
    try {
      if (!token) return false;

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data } = await axios.get('/api/auth/protected');

      dispatch(setCredentials({
        user: data.user,
        token: token
      }));

      return true;
    } catch (err) {
      console.error('Token validation failed:', err);
      clearAuthData();
      return false;
    }
  }, [dispatch, clearAuthData]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await validateToken(token);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch, validateToken]);
  const register = async (userData, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Registering user:', userData);

      const { data } = await axios.post('/api/auth/register', userData);
      console.log('Registration response:', data);

      if (options.autoLogin && data.token) {
        localStorage.setItem('token', data.token);
        await validateToken(data.token);
      }

      return data;
    } catch (err) {
      console.error('Registration error:', err);
      const error = err.response?.data?.error ||
        err.response?.data?.message ||
        'Registration failed';
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.post('/api/auth/login', credentials);

      // Check for token in response
      if (!data.token) {
        throw new Error('No token received');
      }

      localStorage.setItem('token', data.token);
      dispatch(setCredentials({
        user: data.user,
        token: data.token
      }));

      return data;  // Return the response data
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  const value = {
    currentUser: userInfo,
    loading,
    error,
    register,
    login,
    logout,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};