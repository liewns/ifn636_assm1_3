import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TripDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!user || !user.token) {
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

        const selectedTrip = tripsResponse.data.find((item) => item._id === id);

        if (!selectedTrip) {
          alert('Trip not found.');
          navigate('/trips');
          return;
        }

        const tripExpenses = expensesResponse.data.filter((expense) => {
          const expenseTripId =
            typeof expense.trip === 'object' ? expense.trip?._id : expense.trip;
          return expenseTripId === id;
        });

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

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  }, [expenses]);

  const remaining = trip ? Number(trip.budget || 0) - totalSpent : 0;
  const isOverBudget = remaining < 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-5xl mx-auto">Loading trip details...</div>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to="/trips" className="text-blue-600 hover:underline">
            ← Back to Trips
          </Link>
        </div>

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
            <p className="text-slate-500">
              No expenses linked to this trip yet.
            </p>
          ) : (
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