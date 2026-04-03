const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    tripName: { type: String, required: true },
    destination: { type: String, required: true },
    travelDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Trip', tripSchema);