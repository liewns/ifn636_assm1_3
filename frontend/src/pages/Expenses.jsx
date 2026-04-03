import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';

const Expenses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.token) {
        alert('Please log in first.');
        navigate('/login');
        return;
      }

      try {
        const [expensesResponse, tripsResponse] = await Promise.all([
          axiosInstance.get('/api/expenses', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axiosInstance.get('/api/trips', {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        setExpenses(expensesResponse.data);
        setTrips(tripsResponse.data);
      } catch (error) {
        console.error('Fetch expenses/trips error:', error);
        alert(error.response?.data?.message || 'Failed to fetch expenses.');
      }
    };

    fetchData();
  }, [user, navigate]);

  return (
    <div className="container mx-auto p-6">
      <ExpenseForm
        expenses={expenses}
        setExpenses={setExpenses}
        trips={trips}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />
      <ExpenseList
        expenses={expenses}
        setExpenses={setExpenses}
        setEditingExpense={setEditingExpense}
      />
    </div>
  );
};

export default Expenses;