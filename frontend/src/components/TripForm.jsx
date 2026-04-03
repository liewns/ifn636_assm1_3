import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TripForm = ({ trips, setTrips, editingTrip, setEditingTrip }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tripName: '',
    destination: '',
    travelDate: '',
  });

  useEffect(() => {
    if (editingTrip) {
      setFormData({
        tripName: editingTrip.tripName,
        destination: editingTrip.destination,
        travelDate: editingTrip.travelDate
          ? editingTrip.travelDate.slice(0, 10)
          : '',
      });
    } else {
      setFormData({
        tripName: '',
        destination: '',
        travelDate: '',
      });
    }
  }, [editingTrip]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTrip) {
        const response = await axiosInstance.put(
          `/api/trips/${editingTrip._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setTrips(
          trips.map((trip) =>
            trip._id === response.data._id ? response.data : trip
          )
        );
      } else {
        const response = await axiosInstance.post('/api/trips', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setTrips([response.data, ...trips]);
      }

      setEditingTrip(null);
      setFormData({
        tripName: '',
        destination: '',
        travelDate: '',
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save trip.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingTrip ? 'Edit Trip' : 'Create New Trip'}
      </h1>

      <input
        type="text"
        placeholder="Trip Name"
        value={formData.tripName}
        onChange={(e) =>
          setFormData({ ...formData, tripName: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Destination"
        value={formData.destination}
        onChange={(e) =>
          setFormData({ ...formData, destination: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="date"
        value={formData.travelDate}
        onChange={(e) =>
          setFormData({ ...formData, travelDate: e.target.value })
        }
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTrip ? 'Update Trip' : 'Create Trip'}
      </button>
    </form>
  );
};

export default TripForm;