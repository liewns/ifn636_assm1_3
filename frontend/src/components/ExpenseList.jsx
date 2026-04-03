import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ExpenseList = ({ expenses, setExpenses, setEditingExpense }) => {
  const { user } = useAuth();

  const handleDelete = async (expenseId) => {
    try {
      await axiosInstance.delete(`/api/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setExpenses(expenses.filter((expense) => expense._id !== expenseId));
    } catch (error) {
      console.error('Delete expense error:', error);
      alert(error.response?.data?.message || 'Failed to delete expense.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Expenses</h2>

      {expenses.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded shadow">
          No expenses yet. Create your first expense above.
        </div>
      ) : (
        expenses.map((expense) => (
          <div key={expense._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h3 className="font-bold text-lg">{expense.title}</h3>
            <p>
              <span className="font-medium">Amount:</span> ${Number(expense.amount).toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Category:</span> {expense.category}
            </p>
            <p>
              <span className="font-medium">Date:</span>{' '}
              {expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'}
            </p>
            <p>
              <span className="font-medium">Trip:</span> {expense.trip?.tripName || 'No trip'}
            </p>
            <p>
              <span className="font-medium">Notes:</span> {expense.notes || 'No notes'}
            </p>

            <div className="mt-3">
              <button
                onClick={() => setEditingExpense(expense)}
                className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(expense._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ExpenseList;