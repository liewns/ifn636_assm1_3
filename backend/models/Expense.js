const mongoose = require('mongoose');

// Define the schema for expense records
// Each expense belongs to a user and is linked to a trip
const expenseSchema = new mongoose.Schema(
  {
    // Reference to the user who created the expense
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // Reference to the trip that this expense belongs to
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Trip',
    },

    // Expense title or short description
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Amount spent for the expense
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Expense category, limited to predefined options
    category: {
      type: String,
      required: true,
      trim: true,
      enum: ['Accommodation', 'Transport', 'Food', 'Activities', 'Shopping', 'Other'],
    },

    // Date when the expense occurred
    date: {
      type: Date,
      required: true,
    },

    // Optional notes for extra details about the expense
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Export the Expense model
module.exports = mongoose.model('Expense', expenseSchema);