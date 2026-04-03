import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import TripForm from '../components/TripForm';
import TripList from '../components/TripList';
import { useAuth } from '../context/AuthContext';

const Trips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user || !user.token) {
        alert('Please log in first.');
        navigate('/login');
        return;
      }

      try {
        const response = await axiosInstance.get('/api/trips', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setTrips(response.data);
      } catch (error) {
        console.error('Fetch trips error:', error);
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        alert(error.response?.data?.message || 'Failed to fetch trips.');
      }
    };

    fetchTrips();
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6">
      <TripForm
        trips={trips}
        setTrips={setTrips}
        editingTrip={editingTrip}
        setEditingTrip={setEditingTrip}
      />
      <TripList
        trips={trips}
        setTrips={setTrips}
        setEditingTrip={setEditingTrip}
      />
    </div>
  );
};

export default Trips;