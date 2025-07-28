 const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user; // ✅ Set the user on the request object
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = protect;



// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');

// module.exports = async (req, res, next) => {
//   try {
//     console.log('Auth middleware: Processing request', req.method, req.url);
//     const authHeader = req.headers.authorization;
//     console.log('Auth header:', authHeader);

//     const token = authHeader?.split(' ')[1];
//     if (!token) {
//       console.log('No token provided');
//       return res.status(401).json({
//         status: 'error',
//         message: 'No token provided',
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     console.log('Decoded JWT:', decoded);

//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) {
//       console.log('User not found for ID:', decoded.id);
//       return res.status(401).json({
//         status: 'error',
//         message: 'User not found',
//       });
//     }

//     req.user = { _id: user._id };
//     console.log('Set req.user:', req.user);
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error.message);
//     res.status(401).json({
//       status: 'error',
//       message: 'Invalid or expired token',
//       error: error.message,
//     });
//   }
// };