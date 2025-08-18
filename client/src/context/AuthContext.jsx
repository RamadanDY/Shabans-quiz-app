import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
const loadUser = async () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    setUser(JSON.parse(storedUser)); // immediate hydration
  }

  if (token) {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
      localStorage.setItem('user', JSON.stringify(response.data.data)); // keep in sync
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }
  setLoading(false);
};

const login = async (email, password) => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    setUser(response.data.data.user);
    return { success: true, user: response.data.data.user };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};


  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        role,
      });
      localStorage.setItem('token', response.data.data.token);
      setUser(response.data.data.user);
      return { success: true, user: response.data.data.user };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  // ✅ ADD getAllUsers here
  const getAllUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { status: 'success', data: response.data.data };
    } catch (error) {
      return {
        status: 'error',
        message: error.response?.data?.message || 'Failed to fetch users',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, getAllUsers }}>
      {children}
    </AuthContext.Provider>
  );
};
