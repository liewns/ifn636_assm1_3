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

// Admin dashboard summary route
// Returns overall totals for users, trips, expenses, and spending
router.get('/summary', protect, adminOnly, getAdminSummary);

// Admin user management routes
// Allow admin to view all users and delete a selected user
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

// Admin trip management routes
// Allow admin to view all trips and delete a selected trip
router.get('/trips', protect, adminOnly, getAllTrips);
router.delete('/trips/:id', protect, adminOnly, deleteTrip);

// Admin expense management routes
// Allow admin to view all expenses and delete a selected expense
router.get('/expenses', protect, adminOnly, getAllExpenses);
router.delete('/expenses/:id', protect, adminOnly, deleteExpense);

// Export the admin router
module.exports = router;