const authMiddleware = require('./middleware/authMiddleware');
const authController = require('./controller/authController');

console.log('authMiddleware is a function:', typeof authMiddleware === 'function');
console.log('authController.getMe is a function:', typeof authController.getMe === 'function');
