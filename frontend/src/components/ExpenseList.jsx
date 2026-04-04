import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ExpenseList = ({ expenses, setExpenses, setEditingExpense }) => {
  const { user } = useAuth();

  // Delete an expense after user confirmation
  const handleDelete = async (expense) => {
    // Ask the user to confirm before deleting
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.title}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Send delete request for the selected expense
      await axiosInstance.delete(`/api/expenses/${expense._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Remove the deleted expense from the local state
      setExpenses((prevExpenses) =>
        prevExpenses.filter((item) => item._id !== expense._id)
      );

      alert('Expense deleted successfully.');
    } catch (error) {
      console.error('Delete expense error:', error);
      alert(error.response?.data?.message || 'Failed to delete expense.');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Expenses</h2>

      {expenses.length === 0 ? (
        // Show empty state message when no expenses are available
        <div className="bg-white border border-slate-200 rounded-2xl shadow p-6 text-center">
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No expenses found
          </h3>
          <p className="text-slate-600 mb-3">
            Add your first expense above or change the filters to see more results.
          </p>
          <p className="text-sm text-slate-500">
            You can filter by trip, category, or sort by date and amount.
          </p>
        </div>
      ) : (
        // Display each expense in a card layout
        expenses.map((expense) => (
          <div key={expense._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h3 className="font-bold text-lg">{expense.title}</h3>
            <p>
              <span className="font-medium">Amount:</span> $
              {Number(expense.amount).toFixed(2)}
            </p>
            <p>
              <span className="font-medium">Category:</span> {expense.category}
            </p>
            <p>
              <span className="font-medium">Date:</span>{' '}
              {expense.date ? new Date(expense.date).toLocaleDateString() : 'No date'}
            </p>
            <p>
              <span className="font-medium">Trip:</span>{' '}
              {expense.trip?.tripName || 'No trip'}
            </p>
            <p>
              <span className="font-medium">Notes:</span> {expense.notes || 'No notes'}
            </p>

            <div className="mt-3">
              <button
                // Load selected expense into the form for editing
                onClick={() => setEditingExpense(expense)}
                className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                // Delete the selected expense
                onClick={() => handleDelete(expense)}
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