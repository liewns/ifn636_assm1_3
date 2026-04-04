const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');

const router = express.Router();

// Expense routes
// Allow authenticated users to view all their expenses and create new ones
router.route('/').get(protect, getExpenses).post(protect, createExpense);

// Expense ID routes
// Allow authenticated users to update or delete a selected expense
router.route('/:id').put(protect, updateExpense).delete(protect, deleteExpense);

// Export the expense router
module.exports = router;