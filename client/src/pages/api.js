 import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for token and logging
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('API request:', config.method, config.url, JSON.stringify(config.data, null, 2));
  return config;
});

// ✅ Simplified and exported register function using api instance
export const register = (name, email, password, role) => {
  const payload = { name, email, password, role };
  console.log('Register function called with:', JSON.stringify(payload, null, 2));
  return api.post('/auth/register', payload)
    .then((res) => res.data)
    .catch((error) => {
      console.error('Register API error:', JSON.stringify(error.response?.data || error, null, 2));
      return error.response?.data || { status: 'error', message: error.message || 'Registration failed' };
    });
};

// export const register = (name, email, password, role) => {
//   const payload = { name, email, password, role };
//   console.log('Register function called with:', JSON.stringify(payload, null, 2));
//   return api.post('/auth/register', payload)
//     .then((res) => res.data)
//     .catch((error) => {
//       console.error('Register API error:', JSON.stringify(error.response?.data || error, null, 2));
//       return error.response?.data || { status: 'error', message: error.message || 'Registration failed' };
//     });
// };

export const login = async (email, password, role) => {
  try {
    console.log('Login function called with:', JSON.stringify({ email, password, role }, null, 2));
    const response = await api.post('/auth/login', { email, password, role });
    console.log('Login API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('Login API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Login failed' };
  }
};

export const getMe = async () => {
  try {
    const response = await api.get('/auth/me');
    console.log('GetMe API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('GetMe API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to fetch user' };
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get('/auth/users');
    console.log('GetAllUsers API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('GetAllUsers API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to fetch users' };
  }
};

export const getQuizzes = async () => {
  try {
    const response = await api.get('/quiz/quizzes');
    console.log('GetQuizzes API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('GetQuizzes API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to fetch quizzes' };
  }
};

export const createQuiz = async (quizData) => {
  try {
    const response = await api.post('/quiz/quizzes', quizData);
    console.log('CreateQuiz API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('CreateQuiz API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to create quiz' };
  }
};

export const updateQuiz = async (id, quizData) => {
  try {
    const response = await api.put(`/quiz/quizzes/${id}`, quizData);
    console.log('UpdateQuiz API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('UpdateQuiz API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to update quiz' };
  }
};

export const deleteQuiz = async (id) => {
  try {
    const response = await api.delete(`/quiz/quizzes/${id}`);
    console.log('DeleteQuiz API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('DeleteQuiz API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to delete quiz' };
  }
};

export const updateQuizAvailability = async (id, updates) => {
  try {
    const response = await api.patch(`/quiz/quizzes/${id}/availability`, updates);
    console.log('UpdateQuizAvailability API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('UpdateQuizAvailability API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to update quiz availability' };
  }
};

export const getQuizResults = async () => {
  try {
    const response = await api.get('/quiz/results');
    console.log('GetQuizResults API response:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error('GetQuizResults API error:', JSON.stringify(error.response?.data || error, null, 2));
    return error.response?.data || { status: 'error', message: 'Failed to fetch quiz results' };
  }
};
