import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Store admin summary data and platform records
  const [summary, setSummary] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Fetch all admin dashboard data from the backend
  const fetchAdminData = useCallback(async () => {
    // Redirect to login if there is no authenticated user
    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    // Restrict this page to admin users only
    if (user.role !== 'admin') {
      alert('Admin access only.');
      navigate('/dashboard');
      return;
    }

    try {
      // Request summary, users, trips, and expenses at the same time
      const [summaryRes, usersRes, tripsRes, expensesRes] = await Promise.all([
        axiosInstance.get('/api/admin/summary', {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        axiosInstance.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        axiosInstance.get('/api/admin/trips', {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
        axiosInstance.get('/api/admin/expenses', {
          headers: { Authorization: `Bearer ${user.token}` },
        }),
      ]);

      // Save all returned admin data into local state
      setSummary(summaryRes.data);
      setUsers(usersRes.data);
      setTrips(tripsRes.data);
      setExpenses(expensesRes.data);
    } catch (error) {
      console.error('Admin fetch error:', error);
      alert(error.response?.data?.message || 'Failed to load admin panel.');
    }
  }, [user, navigate]);

  // Load admin data when the page first opens
  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  // Delete a user after confirmation
  const handleDeleteUser = async (userItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userItem.name}"?\n\nThis will also delete all of their trips and expenses.`
    );

    if (!confirmed) return;

    try {
      // Send delete request for the selected user
      await axiosInstance.delete(`/api/admin/users/${userItem._id || userItem.id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('User deleted successfully.');

      // Refresh admin data after deletion
      fetchAdminData();
    } catch (error) {
      console.error('Delete user error:', error);
      alert(error.response?.data?.message || 'Failed to delete user.');
    }
  };

  // Delete a trip after confirmation
  const handleDeleteTrip = async (tripItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete trip "${tripItem.tripName}"?\n\nThis will also delete all expenses linked to this trip.`
    );

    if (!confirmed) return;

    try {
      // Send delete request for the selected trip
      await axiosInstance.delete(`/api/admin/trips/${tripItem._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('Trip deleted successfully.');

      // Refresh admin data after deletion
      fetchAdminData();
    } catch (error) {
      console.error('Delete trip error:', error);
      alert(error.response?.data?.message || 'Failed to delete trip.');
    }
  };

  // Delete an expense after confirmation
  const handleDeleteExpense = async (expenseItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete expense "${expenseItem.title}"?`
    );

    if (!confirmed) return;

    try {
      // Send delete request for the selected expense
      await axiosInstance.delete(`/api/admin/expenses/${expenseItem._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('Expense deleted successfully.');

      // Refresh admin data after deletion
      fetchAdminData();
    } catch (error) {
      console.error('Delete expense error:', error);
      alert(error.response?.data?.message || 'Failed to delete expense.');
    }
  };

  // Show loading message while summary data is still being retrieved
  if (!summary) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-6xl mx-auto">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Panel</h1>
        <p className="text-slate-600 mb-8">
          View platform-wide users, trips, expenses, and summary data.
        </p>

        {/* Summary cards showing key platform totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Users</p>
            <h2 className="text-3xl font-bold mt-2">{summary.totalUsers}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Trips</p>
            <h2 className="text-3xl font-bold mt-2">{summary.totalTrips}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Expenses</p>
            <h2 className="text-3xl font-bold mt-2">{summary.totalExpenses}</h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-slate-500 text-sm">Total Spent</p>
            <h2 className="text-3xl font-bold mt-2">${summary.totalSpent.toFixed(2)}</h2>
          </div>
        </div>

        {/* Table showing all users in the system */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={item._id || item.id} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2">{item.email}</td>
                    <td className="py-2 capitalize">{item.role}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDeleteUser(item)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        disabled={(item._id || item.id) === user.id}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table showing all trips in the system */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">Trips</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Trip Name</th>
                  <th className="py-2">Owner</th>
                  <th className="py-2">Budget</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2">{item.tripName}</td>
                    <td className="py-2">{item.user?.name || 'Unknown user'}</td>
                    <td className="py-2">${Number(item.budget || 0).toFixed(2)}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDeleteTrip(item)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table showing all expenses in the system */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Expenses</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Title</th>
                  <th className="py-2">Trip</th>
                  <th className="py-2">User</th>
                  <th className="py-2">Amount</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="py-2">{item.title}</td>
                    <td className="py-2">{item.trip?.tripName || 'No trip'}</td>
                    <td className="py-2">{item.user?.name || 'Unknown user'}</td>
                    <td className="py-2">${Number(item.amount || 0).toFixed(2)}</td>
                    <td className="py-2">
                      <button
                        onClick={() => handleDeleteExpense(item)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;