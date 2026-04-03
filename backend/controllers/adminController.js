const User = require('../models/User');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');

const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrips = await Trip.countDocuments();
    const totalExpenses = await Expense.countDocuments();

    const expenses = await Expense.find();
    const totalSpent = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );

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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    console.error('getAllTrips error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
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

const deleteUser = async (req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToDelete._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own admin account' });
    }

    await Trip.deleteMany({ user: userToDelete._id });
    await Expense.deleteMany({ user: userToDelete._id });
    await userToDelete.deleteOne();

    res.status(200).json({ message: 'User and related records deleted successfully' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    await Expense.deleteMany({ trip: trip._id });
    await trip.deleteOne();

    res.status(200).json({ message: 'Trip and related expenses deleted successfully' });
  } catch (error) {
    console.error('deleteTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('deleteExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminSummary,
  getAllUsers,
  getAllTrips,
  getAllExpenses,
  deleteUser,
  deleteTrip,
  deleteExpense,
};