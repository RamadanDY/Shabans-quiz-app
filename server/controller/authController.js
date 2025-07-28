 const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, and password are required',
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      });
    }
    const validRoles = ['user', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'user';
    const user = await User.create({ name, email, password, role: userRole });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Registered user:', user._id, 'Role:', user.role);
    res.status(201).json({
      status: 'success',
      data: { user: { id: user._id, name, email, role: user.role }, token },
    });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error registering user',
      error: error.message,
    });
  }
 };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Logged in user:', user._id, 'Role:', user.role);
    res.status(200).json({
      status: 'success',
      data: { user: { id: user._id, name: user.name, email, role: user.role }, token },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error logging in',
      error: error.message,
    });
  }
 };

const getMe = async (req, res) => {
  try {
    console.log('getMe: Fetching user for ID:', req.user._id);
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }
    console.log('Fetched user:', user._id, 'Role:', user.role);
    res.status(200).json({
      status: 'success',
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(400).json({
      status: 'error',
      message: 'Error fetching user',
      error: error.message,
    });
  }
 };

module.exports = {
  register,
  login,
  getMe
};

 
  

 