import { createContext, useState, useEffect } from 'react';
import * as api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = async (name, email, password, role) => {
    try {
      const response = await api.register(name, email, password, role);
      if (response.status === 'success') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const login = async (email, password, role) => {
    try {
      const response = await api.login(email, password, role);
      if (response.status === 'success') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, user: response.data.user };
      }
      return { success: false, message: response.message };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const getAllUsers = async () => {
    try {
      const response = await api.getAllUsers();
      return response;
    } catch (error) {
      return { status: 'error', message: 'Failed to fetch users' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, register, login, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};