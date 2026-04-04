const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');

const router = express.Router();

// Trip routes
// Allow authenticated users to view all their trips and create new ones
router.route('/').get(protect, getTrips).post(protect, createTrip);

// Trip ID routes
// Allow authenticated users to update or delete a selected trip
router.route('/:id').put(protect, updateTrip).delete(protect, deleteTrip);

// Export the trip router
module.exports = router;