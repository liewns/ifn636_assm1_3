const User = require('../models/User');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

// Get summary statistics for the admin dashboard
// Returns total users, trips, expenses, and total amount spent
const getAdminSummary = async (req, res) => {
  try {
    // Count total documents in each collection
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalExpenses = await Expense.countDocuments();

    // Retrieve all expenses to calculate total spending
    const expenses = await Expense.find();
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );

    // Send summary data as JSON response
    res.status(200).json({
      totalUsers,
      totalTrips,
      totalExpenses,
      totalSpent,
    });
  } catch (error) {
    console.error('getAdminSummary error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all users for admin view
// Excludes passwords for security reasons
const getAllUsers = async (req, res) => {
  try {
    // Find all users, hide password field, and sort newest first
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all trips for admin view
// Includes basic user information for each trip
const getAllTrips = async (req, res) => {
  try {
    // Find all trips, include user's name and email, sort newest first
    const trips = await Trip.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    console.error('getAllTrips error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses for admin view
// Includes linked user and trip information
const getAllExpenses = async (req, res) => {
  try {
    // Find all expenses, populate user and trip details, sort newest first
    const expenses = await Expense.find()
      .populate('user', 'name email')
      .populate('trip', 'tripName')
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('getAllExpenses error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a user and all related records
// Prevents an admin from deleting their own account
const deleteUser = async (req, res) => {
  try {
    // Find the user by ID from the request parameters
    const userToDelete = await User.findById(req.params.id);

    // Return error if user does not exist
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent admin from deleting their own account
    if (userToDelete._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    // Delete all trips and expenses belonging to the user
    await Trip.deleteMany({ user: userToDelete._id });
    await Expense.deleteMany({ user: userToDelete._id });

    // Delete the user record
    await userToDelete.deleteOne();

    res.status(200).json({ message: 'User and related records deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a trip and all expenses linked to that trip
const deleteTrip = async (req, res) => {
  try {
    // Find the trip by ID
    const trip = await Trip.findById(req.params.id);

    // Return error if trip does not exist
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Delete all expenses linked to this trip
    await Expense.deleteMany({ trip: trip._id });

    // Delete the trip itself
    await trip.deleteOne();

    res.status(200).json({ message: 'Trip and related expenses deleted successfully' });
  } catch (error) {
    console.error('deleteTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a single expense record
const deleteExpense = async (req, res) => {
  try {
    // Find the expense by ID
    const expense = await Expense.findById(req.params.id);

    // Return error if expense does not exist
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Delete the expense record
    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('deleteExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export all admin controller functions
module.exports = {
  getAdminSummary,
  getAllUsers,
  getAllTrips,
  getAllExpenses,
  deleteUser,
  deleteTrip,
  deleteExpense,
};