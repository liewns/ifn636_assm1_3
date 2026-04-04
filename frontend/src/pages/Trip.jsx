import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import TripForm from '../components/TripForm';
import TripList from '../components/TripList';
import { useAuth } from '../context/AuthContext';

const Trips = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Store trip data, expense data, and the selected trip for editing
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    // Fetch trips and expenses when the page loads
    const fetchData = async () => {
      // Redirect unauthenticated users to the login page
      if (!user || !user.token) {
        alert('Please log in first.');
        navigate('/login');
        return;
      }

      try {
        // Request trips and expenses at the same time
        const [tripsResponse, expensesResponse] = await Promise.all([
          axiosInstance.get('/api/trips', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/expenses', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        // Save fetched data into local state
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
      {/* Form for creating a new trip or editing an existing one */}
      <TripForm
        trips={trips}
        setTrips={setTrips}
        editingTrip={editingTrip}
        setEditingTrip={setEditingTrip}
      />

      {/* List of trips with related expense information */}
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