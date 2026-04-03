import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TripForm = ({ trips, setTrips, editingTrip, setEditingTrip }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    tripName: '',
    budget: '',
    startDate: '',
    endDate: '',
    notes: '',
  });

  useEffect(() => {
    if (editingTrip) {
      setFormData({
        tripName: editingTrip.tripName || '',
        budget: editingTrip.budget ?? '',
        startDate: editingTrip.startDate ? editingTrip.startDate.slice(0, 10) : '',
        endDate: editingTrip.endDate ? editingTrip.endDate.slice(0, 10) : '',
        notes: editingTrip.notes || '',
      });
    } else {
      setFormData({
        tripName: '',
        budget: '',
        startDate: '',
        endDate: '',
        notes: '',
      });
    }
  }, [editingTrip]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tripName || !formData.budget || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }

    if (Number(formData.budget) < 0) {
      alert('Budget cannot be negative.');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert('End date cannot be before start date.');
      return;
    }

    try {
      const payload = {
        ...formData,
        budget: Number(formData.budget),
      };

      if (editingTrip) {
        const response = await axiosInstance.put(
          `/api/trips/${editingTrip._id}`,
          payload,
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
        const response = await axiosInstance.post('/api/trips', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setTrips([response.data, ...trips]);
      }

      setEditingTrip(null);
      setFormData({
        tripName: '',
        budget: '',
        startDate: '',
        endDate: '',
        notes: '',
      });
    } catch (error) {
      console.error('Save trip error:', error);
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
        name="tripName"
        placeholder="Trip Name"
        value={formData.tripName}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="number"
        name="budget"
        placeholder="Budget"
        value={formData.budget}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        min="0"
        step="0.01"
        required
      />

      <label className="block mb-1 font-medium">Start Date</label>
      <input
        type="date"
        name="startDate"
        value={formData.startDate}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <label className="block mb-1 font-medium">End Date</label>
      <input
        type="date"
        name="endDate"
        value={formData.endDate}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        rows="4"
      />

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingTrip ? 'Update Trip' : 'Create Trip'}
      </button>
    </form>
  );
};

export default TripForm;