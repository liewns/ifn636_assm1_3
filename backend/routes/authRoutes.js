const express = require('express');
const {
  registerUser,
  loginUser,
  updateUserProfile,
  getProfile,
  updateUserPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication routes
// Allow users to register a new account and log in
router.post('/register', registerUser);
router.post('/login', loginUser);

// Profile routes
// Allow authenticated users to view and update their profile details
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);

// Password update route
// Allow authenticated users to change their password
router.put('/password', protect, updateUserPassword);

// Export the auth router
module.exports = router;