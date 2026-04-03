const Expense = require('../models/Expense');
const Trip = require('../models/Trip');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .populate('trip', 'tripName')
      .sort({ date: -1, createdAt: -1 });

    res.status(200).json(expenses);
  } catch (error) {
    console.error('getExpenses error:', error);
    res.status(500).json({ message: error.message });
  }
};

const createExpense = async (req, res) => {
  const { title, amount, category, date, trip, notes } = req.body;

  try {
    if (!title || amount === undefined || !category || !date || !trip) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (Number(amount) < 0) {
      return res.status(400).json({ message: 'Amount cannot be negative' });
    }

    const selectedTrip = await Trip.findById(trip);

    if (!selectedTrip) {
      return res.status(404).json({ message: 'Selected trip not found' });
    }

    if (selectedTrip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised to use this trip' });
    }

    const expense = await Expense.create({
      user: req.user.id,
      trip,
      title,
      amount,
      category,
      date,
      notes: notes || '',
    });

    const populatedExpense = await Expense.findById(expense._id).populate('trip', 'tripName');

    res.status(201).json(populatedExpense);
  } catch (error) {
    console.error('createExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateExpense = async (req, res) => {
  const { title, amount, category, date, trip, notes } = req.body;

  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    const updatedTripId = trip ?? expense.trip;
    const selectedTrip = await Trip.findById(updatedTripId);

    if (!selectedTrip) {
      return res.status(404).json({ message: 'Selected trip not found' });
    }

    if (selectedTrip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised to use this trip' });
    }

    const updatedAmount = amount ?? expense.amount;

    if (Number(updatedAmount) < 0) {
      return res.status(400).json({ message: 'Amount cannot be negative' });
    }

    expense.title = title ?? expense.title;
    expense.amount = updatedAmount;
    expense.category = category ?? expense.category;
    expense.date = date ?? expense.date;
    expense.trip = updatedTripId;
    expense.notes = notes ?? expense.notes;

    const savedExpense = await expense.save();
    const populatedExpense = await Expense.findById(savedExpense._id).populate('trip', 'tripName');

    res.status(200).json(populatedExpense);
  } catch (error) {
    console.error('updateExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    await expense.deleteOne();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('deleteExpense error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};