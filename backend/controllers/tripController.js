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
  const { tripName, destination, travelDate } = req.body;

  try {
    if (!tripName || !destination || !travelDate) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const trip = await Trip.create({
      user: req.user.id,
      tripName,
      destination,
      travelDate,
    });

    res.status(201).json(trip);
  } catch (error) {
    console.error('createTrip error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateTrip = async (req, res) => {
  const { tripName, destination, travelDate } = req.body;

  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorised' });
    }

    trip.tripName = tripName || trip.tripName;
    trip.destination = destination || trip.destination;
    trip.travelDate = travelDate || trip.travelDate;

    const updatedTrip = await trip.save();
    res.status(200).json(updatedTrip);
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