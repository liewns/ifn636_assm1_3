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
  const [expenses, setExpenses] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.token) {
        alert('Please log in first.');
        navigate('/login');
        return;
      }

      try {
        const [tripsResponse, expensesResponse] = await Promise.all([
          axiosInstance.get('/api/trips', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/expenses', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        setTrips(tripsResponse.data);
        setExpenses(expensesResponse.data);
      } catch (error) {
        console.error('Fetch trip data error:', error);
        console.error('Status:', error.response?.status);
        console.error('Response data:', error.response?.data);
        alert(error.response?.data?.message || 'Failed to fetch trip data.');
      }
    };

    fetchData();
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
        expenses={expenses}
        setTrips={setTrips}
        setEditingTrip={setEditingTrip}
      />
    </div>
  );
};

export default Trips;