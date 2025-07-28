const User = require('../models/userModel');
console.log('✅ Admin middleware loaded');

module.exports = async (req, res, next) => {
  try {
    if (!req.user || !req.user._id) {
      console.log('Access denied: req.user is undefined or missing _id');
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized: User not authenticated',
      });
    }

    console.log('Admin middleware: Checking role for user', req.user._id);
    const user = await User.findById(req.user._id).select('role');

    if (!user || user.role !== 'admin') {
      console.log('Access denied: User role', user ? user.role : 'not found', 'for ID', req.user._id);
      return res.status(403).json({
        status: 'error',
        message: 'Access denied: Admin role required',
      });
    }

    console.log('Admin access granted for user', req.user._id);
    next();
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Server error while checking admin role',
    });
  }
};

// const User = require('../models/userModel');

// module.exports = async (req, res, next) => {
//   try {
//     console.log('Admin middleware: Checking role for user', req.user._id);
//     const user = await User.findById(req.user._id).select('role');
//     if (!user || user.role !== 'admin') {
//       console.log('Access denied: User role', user ? user.role : 'not found', 'for ID', req.user._id);
//       return res.status(403).json({
//         status: 'error',
//         message: 'Access denied: Admin role required',
//       });
//     }
//     console.log('Admin access granted for user', req.user._id);
//     next();
//   } catch (error) {
//     console.error('Admin middleware error:', error.message);
//     res.status(500).json({
//       status: 'error',
//       message: 'Server error while checking admin role',
//     });
//   }
// };