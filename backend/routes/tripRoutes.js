const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');

const router = express.Router();

router.route('/').get(protect, getTrips).post(protect, createTrip);
router.route('/:id').put(protect, updateTrip).delete(protect, deleteTrip);

module.exports = router;