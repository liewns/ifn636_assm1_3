const Trip = require('../models/Trip');

// Get all trips belonging to the logged-in user
const getTrips = async (req, res) => {
  try {
    // Find trips created by the current user and sort newest first
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error('getTrips error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new trip for the logged-in user
const createTrip = async (req, res) => {
  const { tripName, budget, startDate, endDate, notes } = req.body;

  try {
    // Check that all required fields are provided
    if (!tripName || budget === undefined || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Prevent negative budget values
    if (Number(budget) < 0) {
      return res.status(400).json({ message: 'Budget cannot be negative' });
    }

    // Ensure the trip end date is not earlier than the start date
    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // Create the new trip record
    const trip = await Trip.create({
      user: req.user.id,
      tripName,
      budget,
      startDate,
      endDate,
      notes: notes || '',
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('createTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update an existing trip belonging to the logged-in user
const updateTrip = async (req, res) => {
  const { tripName, budget, startDate, endDate, notes } = req.body;

  try {
    // Find the trip by ID
    const trip = await Trip.findById(req.params.id);

    // Return error if the trip does not exist
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Ensure the trip belongs to the logged-in user
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    // Use updated values if provided, otherwise keep existing values
    const updatedTripName = tripName ?? trip.tripName;
    const updatedBudget = budget ?? trip.budget;
    const updatedStartDate = startDate ?? trip.startDate;
    const updatedEndDate = endDate ?? trip.endDate;
    const updatedNotes = notes ?? trip.notes;

    // Prevent negative budget values
    if (Number(updatedBudget) < 0) {
      return res.status(400).json({ message: 'Budget cannot be negative' });
    }

    // Ensure the updated end date is not earlier than the updated start date
    if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // Apply updated values to the trip record
    trip.tripName = updatedTripName;
    trip.budget = updatedBudget;
    trip.startDate = updatedStartDate;
    trip.endDate = updatedEndDate;
    trip.notes = updatedNotes;

    // Save the updated trip
    const savedTrip = await trip.save();
    res.status(200).json(savedTrip);
  } catch (error) {
    console.error('updateTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete a trip belonging to the logged-in user
const deleteTrip = async (req, res) => {
  try {
    // Find the trip by ID
    const trip = await Trip.findById(req.params.id);

    // Return error if the trip does not exist
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Ensure the trip belongs to the logged-in user
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    // Delete the trip record
    await trip.deleteOne();
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('deleteTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Export all trip controller functions
module.exports = {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
};