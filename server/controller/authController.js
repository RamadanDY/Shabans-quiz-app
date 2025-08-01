const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const router = express.Router();

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Register request:', JSON.stringify({ name, email, role }, null, 2)); // Debug log
    if (!name || !email || !password || !role) {
      console.log('Missing required fields:', { name, email, password, role });
      return res.status(400).json({
        status: 'error',
        message: 'Name, email, password, and role are required',
      });
    }
    const validRoles = ['user', 'admin'];
    if (!validRoles.includes(role)) {
      console.log('Invalid role provided:', role);
      return res.status(400).json({
        status: 'error',
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`,
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      });
    }
    const user = await User.create({ name, email, password, role });
    console.log('User created:', user._id, 'Role:', user.role);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Registered user:', user._id, 'Role:', user.role);
    res.status(201).json({
      status: 'success',
      data: { user: { id: user._id, name, email, role: user.role }, token },
    });
  } catch (error) {
    console.error('Register error:', error.message, error.stack);
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
    console.log('Login request:', JSON.stringify({ email }, null, 2));
    if (!email || !password) {
      console.log('Missing required fields:', { email, password });
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required',
      });
    }
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      console.log('Invalid credentials for:', email);
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
    console.error('Login error:', error.message, error.stack);
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
      console.log('User not found:', req.user._id);
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
    console.error('Get user error:', error.message, error.stack);
    res.status(400).json({
      status: 'error',
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    console.log('getAllUsers: Fetching users for admin ID:', req.user._id);
    if (req.user.role !== 'admin') {
      console.log('Access denied for non-admin:', req.user._id);
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Admin role required.',
      });
    }
    const users = await User.find().select('name email role createdAt');
    console.log('Fetched users:', users.length);
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (error) {
    console.error('Get users error:', error.message, error.stack);
    res.status(400).json({
      status: 'error',
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  getAllUsers,
};