import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (name, email, password, role) => {
  try {
    const response = await api.post('/auth/register', { name, email, password, role });
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Registration failed' };
  }
};

export const login = async (email, password, role) => {
  try {
    const response = await api.post('/auth/login', { email, password, role });
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Login failed' };
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to fetch user' };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/auth/users');
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to fetch users' };
  }
};

export const getQuizzes = async () => {
  try {
    const response = await api.get('/quiz/quizzes');
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to fetch quizzes' };
  }
};

export const createQuiz = async (quizData) => {
  try {
    const response = await api.post('/quiz/quizzes', quizData);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to create quiz' };
  }
};

export const updateQuiz = async (id, quizData) => {
  try {
    const response = await api.put(`/quiz/quizzes/${id}`, quizData);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to update quiz' };
  }
};

export const deleteQuiz = async (id) => {
  try {
    const response = await api.delete(`/quiz/quizzes/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to delete quiz' };
  }
};

export const updateQuizAvailability = async (id, updates) => {
  try {
    const response = await api.patch(`/quiz/quizzes/${id}/availability`, updates);
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to update quiz availability' };
  }
};

export const getQuizResults = async () => {
  try {
    const response = await api.get('/quiz/results');
    return response.data;
  } catch (error) {
    return error.response?.data || { status: 'error', message: 'Failed to fetch quiz results' };
  }
};