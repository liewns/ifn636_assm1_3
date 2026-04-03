import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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

        setTrips(tripsResponse.data);
        setExpenses(expensesResponse.data);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        alert(error.response?.data?.message || 'Failed to load dashboard.');
      }
    };

    fetchData();
  }, [user, navigate]);

  const summary = useMemo(() => {
    const totalTrips = trips.length;
    const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.budget || 0), 0);
    const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const remainingBudget = totalBudget - totalSpent;

    return {
      totalTrips,
      totalBudget,
      totalSpent,
      remainingBudget,
    };
  }, [trips, expenses]);

  const upcomingTrips = useMemo(() => {
    const today = new Date();

    return [...trips]
      .filter((trip) => trip.startDate && new Date(trip.startDate) >= today)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 3);
  }, [trips]);

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Travel Overview</h1>
          <p className="text-slate-600 mt-2">
            View your trips, spending, and budget summary at a glance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Trips</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">{summary.totalTrips}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Budget</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              ${summary.totalBudget.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Spent</p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              ${summary.totalSpent.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Remaining Budget</p>
            <h2
              className={`text-3xl font-bold mt-2 ${
                summary.remainingBudget < 0 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              ${summary.remainingBudget.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Upcoming Trips</h2>
              <Link to="/trips" className="text-blue-600 hover:underline text-sm font-medium">
                View all
              </Link>
            </div>

            {upcomingTrips.length === 0 ? (
              <p className="text-slate-500">No upcoming trips yet.</p>
            ) : (
              <div className="space-y-4">
                {upcomingTrips.map((trip) => (
                  <div key={trip._id} className="border border-slate-200 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900">{trip.tripName}</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      {trip.startDate
                        ? new Date(trip.startDate).toLocaleDateString()
                        : 'No start date'}{' '}
                      -{' '}
                      {trip.endDate
                        ? new Date(trip.endDate).toLocaleDateString()
                        : 'No end date'}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      Budget: ${Number(trip.budget || 0).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Recent Expenses</h2>
              <Link to="/expenses" className="text-blue-600 hover:underline text-sm font-medium">
                View all
              </Link>
            </div>

            {recentExpenses.length === 0 ? (
              <p className="text-slate-500">No expenses recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div key={expense._id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">{expense.title}</h3>
                      <span className="font-semibold text-slate-900">
                        ${Number(expense.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mt-1">{expense.category}</p>
                    <p className="text-slate-600 text-sm mt-1">
                      {expense.date
                        ? new Date(expense.date).toLocaleDateString()
                        : 'No date'}
                    </p>
                    <p className="text-slate-600 text-sm mt-1">
                      Trip: {expense.trip?.tripName || 'No trip'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to="/trips"
            className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Manage Trips
          </Link>
          <Link
            to="/expenses"
            className="bg-white text-slate-900 border border-slate-300 px-5 py-3 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            Manage Expenses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;