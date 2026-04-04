import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TripDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Store the selected trip, its related expenses, and loading state
  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trip and expense data for the selected trip
    const fetchTripDetails = async () => {
      // Redirect unauthenticated users to the login page
      if (!user || !user.token) {
        navigate('/login');
        return;
      }

      try {
        // Request all trips and expenses at the same time
        const [tripsResponse, expensesResponse] = await Promise.all([
          axiosInstance.get('/api/trips', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/expenses', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        // Find the trip that matches the route ID
        const selectedTrip = tripsResponse.data.find((item) => item._id === id);

        // Redirect back if the trip cannot be found
        if (!selectedTrip) {
          alert('Trip not found.');
          navigate('/trips');
          return;
        }

        // Filter expenses that belong to the selected trip
        const tripExpenses = expensesResponse.data.filter((expense) => {
          const expenseTripId =
            typeof expense.trip === 'object' ? expense.trip?._id : expense.trip;
          return expenseTripId === id;
        });

        // Save trip and related expenses into local state
        setTrip(selectedTrip);
        setExpenses(tripExpenses);
      } catch (error) {
        console.error('Fetch trip details error:', error);
        alert(error.response?.data?.message || 'Failed to load trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [user, navigate, id]);

  // Calculate the total amount spent for this trip
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  }, [expenses]);

  // Calculate remaining budget and check whether the trip is over budget
  const remaining = trip ? Number(trip.budget || 0) - totalSpent : 0;
  const isOverBudget = remaining < 0;

  // Show loading message while trip details are being retrieved
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-5xl mx-auto">Loading trip details...</div>
      </div>
    );
  }

  // Return nothing if no trip is available after loading
  if (!trip) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Link back to the main trips page */}
        <div className="mb-6">
          <Link to="/trips" className="text-blue-600 hover:underline">
            ← Back to Trips
          </Link>
        </div>

        {/* Main trip information card */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                {trip.tripName}
              </h1>

              <p className="text-slate-700 mb-2">
                <span className="font-medium">Budget:</span> $
                {Number(trip.budget || 0).toFixed(2)}
              </p>

              <p className="text-slate-700 mb-2">
                <span className="font-medium">Start Date:</span>{' '}
                {trip.startDate
                  ? new Date(trip.startDate).toLocaleDateString()
                  : 'No start date'}
              </p>

              <p className="text-slate-700 mb-2">
                <span className="font-medium">End Date:</span>{' '}
                {trip.endDate
                  ? new Date(trip.endDate).toLocaleDateString()
                  : 'No end date'}
              </p>

              <p className="text-slate-700">
                <span className="font-medium">Notes:</span> {trip.notes || 'No notes'}
              </p>
            </div>

            <div>
              {/* Show a badge to indicate whether the trip is over budget */}
              {isOverBudget ? (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                  Over Budget
                </span>
              ) : (
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  Within Budget
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Summary cards for expense count, total spent, and remaining budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Expenses Count</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {expenses.length}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Spent</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              ${totalSpent.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Remaining Budget</p>
            <h2
              className={`text-3xl font-bold mt-2 ${
                isOverBudget ? 'text-red-600' : 'text-green-600'
              }`}
            >
              ${remaining.toFixed(2)}
            </h2>
          </div>
        </div>

        {/* Expense list section for this specific trip */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-slate-900">
              Trip Expenses
            </h2>
            <Link
              to="/expenses"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Go to Expenses
            </Link>
          </div>

          {expenses.length === 0 ? (
            // Show empty state message when no expenses are linked to the trip
            <div className="border border-slate-200 rounded-2xl p-6 text-center">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                No expenses linked to this trip yet
              </h3>
              <p className="text-slate-600 mb-3">
                Go to the Expenses page and add an expense for this trip to start tracking spending.
              </p>
              <p className="text-sm text-slate-500">
                Choose this trip from the dropdown when creating the expense.
              </p>
            </div>
          ) : (
            // Display all expenses linked to this trip
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="border border-slate-200 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {expense.title}
                      </h3>
                      <p className="text-slate-600 text-sm mt-1">
                        Category: {expense.category}
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        Date:{' '}
                        {expense.date
                          ? new Date(expense.date).toLocaleDateString()
                          : 'No date'}
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        Notes: {expense.notes || 'No notes'}
                      </p>
                    </div>

                    <div className="font-semibold text-slate-900">
                      ${Number(expense.amount || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails;