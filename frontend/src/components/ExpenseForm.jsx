import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ExpenseForm = ({
  expenses,
  setExpenses,
  trips,
  editingExpense,
  setEditingExpense,
}) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    trip: '',
    notes: '',
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount ?? '',
        category: editingExpense.category || '',
        date: editingExpense.date ? editingExpense.date.slice(0, 10) : '',
        trip: editingExpense.trip?._id || editingExpense.trip || '',
        notes: editingExpense.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
        trip: trips.length > 0 ? trips[0]._id : '',
        notes: '',
      });
    }
  }, [editingExpense, trips]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setFormData({
      title: '',
      amount: '',
      category: '',
      date: '',
      trip: trips.length > 0 ? trips[0]._id : '',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.amount || !formData.category || !formData.date || !formData.trip) {
      alert('Please fill in all required fields.');
      return;
    }

    if (Number(formData.amount) < 0) {
      alert('Amount cannot be negative.');
      return;
    }

    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (editingExpense) {
        const response = await axiosInstance.put(
          `/api/expenses/${editingExpense._id}`,
          payload,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        setExpenses(
          expenses.map((expense) =>
            expense._id === response.data._id ? response.data : expense
          )
        );

        alert('Expense updated successfully.');
      } else {
        const response = await axiosInstance.post('/api/expenses', payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        setExpenses([response.data, ...expenses]);
        alert('Expense created successfully.');
      }

      setEditingExpense(null);
      setFormData({
        title: '',
        amount: '',
        category: '',
        date: '',
        trip: trips.length > 0 ? trips[0]._id : '',
        notes: '',
      });
    } catch (error) {
      console.error('Save expense error:', error);
      alert(error.response?.data?.message || 'Failed to save expense.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-2">
        {editingExpense ? 'Edit Expense' : 'Create New Expense'}
      </h1>

      <p className="text-slate-600 mb-4">
        {editingExpense
          ? 'Update the selected expense or cancel to go back to your filtered list.'
          : 'Add an expense and link it to one of your trips to track spending accurately.'}
      </p>

      <input
        type="text"
        name="title"
        placeholder="Expense Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        min="0"
        step="0.01"
        required
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Select Category</option>
        <option value="Accommodation">Accommodation</option>
        <option value="Transport">Transport</option>
        <option value="Food">Food</option>
        <option value="Activities">Activities</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>

      <label className="block mb-1 font-medium">Date</label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <select
        name="trip"
        value={formData.trip}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Choose Trip</option>
        {trips.map((trip) => (
          <option key={trip._id} value={trip._id}>
            {trip.tripName}
          </option>
        ))}
      </select>

      <textarea
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        rows="4"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingExpense ? 'Update Expense' : 'Create Expense'}
        </button>

        {editingExpense && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex-1 bg-slate-200 text-slate-900 p-2 rounded hover:bg-slate-300"
          >
            Cancel Edit
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;