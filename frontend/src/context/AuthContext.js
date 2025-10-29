import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guest, setGuest] = useState(() => localStorage.getItem('guest') === '1');

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (guest) {
      // Guest mode: skip profile fetch
      setUser({ name: 'Guest', email: 'guest@example.com' });
      setLoading(false);
      return;
    }

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Verify token by fetching user profile
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      // Demo login: email 'gayatri@randomMail.com' and password 'gayatri@123' without backend
      if (email === 'gayatri@randomMail.com' && password === 'gayatri@123') {
        localStorage.setItem('guest', '1');
        setGuest(true);
        const demoUser = { name: 'Gayatri', email: 'gayatri@randomMail.com' };
        setUser(demoUser);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { success: true };
      }
      const response = await api.post('/auth/login', { email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', { name, email, password });
      const { token, ...userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guest');
    setGuest(false);
    setUser(null);
    setError(null);
  };

  const enterGuest = () => {
    localStorage.setItem('guest', '1');
    setGuest(true);
    setUser({ name: 'Guest', email: 'guest@example.com' });
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    guest,
    login,
    register,
    logout,
    enterGuest,
    fetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

