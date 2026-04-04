import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Store expense data, available trips, and the selected expense for editing
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  // Store filter and sorting options for the expense list
  const [filters, setFilters] = useState({
    trip: '',
    category: '',
    sort: 'latest',
  });

  // Fetch expenses and trips when the page loads
  useEffect(() => {
    const fetchData = async () => {
      // Redirect unauthenticated users to the login page
      if (!user || !user.token) {
        alert('Please log in first.');
        navigate('/login');
        return;
      }

      try {
        // Request expenses and trips at the same time
        const [expensesResponse, tripsResponse] = await Promise.all([
          axiosInstance.get('/api/expenses', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/trips', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        // Save fetched data into local state
        setExpenses(expensesResponse.data);
        setTrips(tripsResponse.data);
      } catch (error) {
        console.error('Fetch expenses/trips error:', error);
        alert(error.response?.data?.message || 'Failed to fetch expenses.');
      }
    };

    fetchData();
  }, [user, navigate]);

  // Filter and sort expenses based on selected options
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter expenses by selected trip
    if (filters.trip) {
      result = result.filter((expense) => {
        const expenseTripId =
          typeof expense.trip === 'object' ? expense.trip?._id : expense.trip;
        return expenseTripId === filters.trip;
      });
    }

    // Filter expenses by selected category
    if (filters.category) {
      result = result.filter((expense) => expense.category === filters.category);
    }

    // Sort expenses according to the selected order
    if (filters.sort === 'latest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (filters.sort === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filters.sort === 'highest') {
      result.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (filters.sort === 'lowest') {
      result.sort((a, b) => Number(a.amount) - Number(b.amount));
    }

    return result;
  }, [expenses, filters]);

  return (
    <div className="container mx-auto p-6">
      {/* Form for creating a new expense or editing an existing one */}
      <ExpenseForm
        expenses={expenses}
        setExpenses={setExpenses}
        trips={trips}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />

      {/* Filter and sort controls for the expense list */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Filter and Sort Expenses</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.trip}
            onChange={(e) =>
              setFilters({ ...filters, trip: e.target.value })
            }
            className="w-full p-3 border border-slate-300 rounded-lg"
          >
            <option value="">All Trips</option>
            {trips.map((trip) => (
              <option key={trip._id} value={trip._id}>
                {trip.tripName}
              </option>
            ))}
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="w-full p-3 border border-slate-300 rounded-lg"
          >
            <option value="">All Categories</option>
            <option value="Accommodation">Accommodation</option>
            <option value="Transport">Transport</option>
            <option value="Food">Food</option>
            <option value="Activities">Activities</option>
            <option value="Shopping">Shopping</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({ ...filters, sort: e.target.value })
            }
            className="w-full p-3 border border-slate-300 rounded-lg"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Display the filtered and sorted list of expenses */}
      <ExpenseList
        expenses={filteredExpenses}
        setExpenses={setExpenses}
        setEditingExpense={setEditingExpense}
      />
    </div>
  );
};

export default Expenses;