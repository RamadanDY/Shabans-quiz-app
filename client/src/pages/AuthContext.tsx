import { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api'; // adjust path if needed

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const register = async (name, email, password, role) => {
    try {
      const response = await api.register(name, email, password, role);
      return response.data;
    } catch (error) {
      console.error('Register error in AuthContext:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
