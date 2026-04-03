const express = require('express');
const {
  getAdminSummary,
  getAllUsers,
  getAllTrips,
  getAllExpenses,
  deleteUser,
  deleteTrip,
  deleteExpense,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', protect, adminOnly, getAdminSummary);

router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

router.get('/trips', protect, adminOnly, getAllTrips);
router.delete('/trips/:id', protect, adminOnly, deleteTrip);

router.get('/expenses', protect, adminOnly, getAllExpenses);
router.delete('/expenses/:id', protect, adminOnly, deleteExpense);

module.exports = router;