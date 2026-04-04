const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

// Get all expenses belonging to the logged-in user
// Includes the related trip name for display purposes
const getExpenses = async (req, res) => {
  try {
    // Find expenses for the current user and sort by newest date first
    const expenses = await Expense.find({ user: req.user.id })
      .populate('trip', 'tripName')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('getExpenses error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new expense for the logged-in user
const createExpense = async (req, res) => {
  const { title, amount, category, date, trip, notes } = req.body;

  try {
    // Check that all required fields are provided
    if (!title || amount === undefined || !category || !date || !trip) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Prevent negative expense amounts
    if (Number(amount) < 0) {
      return res.status(400).json({ message: 'Amount cannot be negative' });
    }

    // Check that the selected trip exists
    const selectedTrip = await Trip.findById(trip);

    if (!selectedTrip) {
      return res.status(404).json({ message: 'Selected trip not found' });
    }

    // Ensure the trip belongs to the logged-in user
    if (selectedTrip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised to use this trip' });
    }

    // Create the new expense record
    const expense = await Expense.create({
      user: req.user.id,
      trip,
      title,
      amount,
      category,
      date,
      notes: notes || '',
    });

    // Retrieve the created expense with trip name populated
    const populatedExpense = await Expense.findById(expense._id).populate('trip', 'tripName');

    res.status(201).json(populatedExpense);
  } catch (error) {
    console.error('createExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing expense
const updateExpense = async (req, res) => {
  const { title, amount, category, date, trip, notes } = req.body;

  try {
    // Find the expense by ID
    const expense = await Expense.findById(req.params.id);

    // Return error if expense does not exist
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Ensure the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    // Use the updated trip if provided, otherwise keep the current one
    const updatedTripId = trip ?? expense.trip;
    const selectedTrip = await Trip.findById(updatedTripId);

    // Check that the selected trip exists
    if (!selectedTrip) {
      return res.status(404).json({ message: 'Selected trip not found' });
    }

    // Ensure the selected trip belongs to the logged-in user
    if (selectedTrip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised to use this trip' });
    }

    // Use the updated amount if provided, otherwise keep the current amount
    const updatedAmount = amount ?? expense.amount;

    // Prevent negative expense amounts
    if (Number(updatedAmount) < 0) {
      return res.status(400).json({ message: 'Amount cannot be negative' });
    }

    // Update only the provided fields, otherwise keep existing values
    expense.title = title ?? expense.title;
    expense.amount = updatedAmount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;
    expense.trip = updatedTripId;
    expense.notes = notes ?? expense.notes;

    // Save the updated expense
    const savedExpense = await expense.save();

    // Retrieve the updated expense with trip name populated
    const populatedExpense = await Expense.findById(savedExpense._id).populate('trip', 'tripName');

    res.status(200).json(populatedExpense);
  } catch (error) {
    console.error('updateExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete an expense belonging to the logged-in user
const deleteExpense = async (req, res) => {
  try {
    // Find the expense by ID
    const expense = await Expense.findById(req.params.id);

    // Return error if expense does not exist
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Ensure the expense belongs to the logged-in user
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    // Delete the expense record
    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('deleteExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export all expense controller functions
module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};