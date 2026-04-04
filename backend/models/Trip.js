const mongoose = require('mongoose');

// Define the schema for trip records
// Each trip belongs to a user and stores travel planning details
const tripSchema = new mongoose.Schema(
  {
    // Reference to the user who created the trip
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    // Name or title of the trip
    tripName: {
      type: String,
      required: true,
      trim: true,
    },

    // Budget allocated for the trip
    budget: {
      type: Number,
      required: true,
      min: 0,
    },

    // Trip start date
    startDate: {
      type: Date,
      required: true,
    },

    // Trip end date
    endDate: {
      type: Date,
      required: true,
    },

    // Optional notes related to the trip
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

// Export the Trip model
module.exports = mongoose.model('Trip', tripSchema);