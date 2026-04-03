const Trip = require('../models/Trip');

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error('getTrips error:', error);
    res.status(500).json({ message: error.message });
  }
};

const createTrip = async (req, res) => {
  const { tripName, budget, startDate, endDate, notes } = req.body;

  try {
    if (!tripName || budget === undefined || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    if (Number(budget) < 0) {
      return res.status(400).json({ message: 'Budget cannot be negative' });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

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

const updateTrip = async (req, res) => {
  const { tripName, budget, startDate, endDate, notes } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    const updatedTripName = tripName ?? trip.tripName;
    const updatedBudget = budget ?? trip.budget;
    const updatedStartDate = startDate ?? trip.startDate;
    const updatedEndDate = endDate ?? trip.endDate;
    const updatedNotes = notes ?? trip.notes;

    if (Number(updatedBudget) < 0) {
      return res.status(400).json({ message: 'Budget cannot be negative' });
    }

    if (new Date(updatedEndDate) < new Date(updatedStartDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    trip.tripName = updatedTripName;
    trip.budget = updatedBudget;
    trip.startDate = updatedStartDate;
    trip.endDate = updatedEndDate;
    trip.notes = updatedNotes;

    const savedTrip = await trip.save();
    res.status(200).json(savedTrip);
  } catch (error) {
    console.error('updateTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    await trip.deleteOne();
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('deleteTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTrips,
  createTrip,
  updateTrip,
  deleteTrip,
};