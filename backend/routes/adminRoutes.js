const express = require('express');
const {
  getAdminSummary,
  getAllUsers,
  getAllTrips,
  getAllExpenses,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, adminOnly, getAdminSummary);
router.get('/users', protect, adminOnly, getAllUsers);
router.get('/trips', protect, adminOnly, getAllTrips);
router.get('/expenses', protect, adminOnly, getAllExpenses);

module.exports = router;