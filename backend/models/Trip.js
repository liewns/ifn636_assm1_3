const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tripName: {
      type: String,
      required: true,
      trim: true,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);