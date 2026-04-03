import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TripList = ({ trips, expenses, setTrips, setEditingTrip }) => {
  const { user } = useAuth();

  const handleDelete = async (tripId) => {
    try {
      await axiosInstance.delete(`/api/trips/${tripId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setTrips(trips.filter((trip) => trip._id !== tripId));
    } catch (error) {
      console.error('Delete trip error:', error);
      alert(error.response?.data?.message || 'Failed to delete trip.');
    }
  };

  const getTripExpenses = (tripId) => {
    return expenses.filter((expense) => {
      const expenseTripId =
        typeof expense.trip === 'object' ? expense.trip?._id : expense.trip;

      return expenseTripId === tripId;
    });
  };

  const getTotalSpent = (tripId) => {
    return getTripExpenses(tripId).reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Trips</h2>

      {trips.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded shadow">
          No trips yet. Create your first trip above.
        </div>
      ) : (
        trips.map((trip) => {
          const totalSpent = getTotalSpent(trip._id);
          const remaining = Number(trip.budget || 0) - totalSpent;
          const isOverBudget = remaining < 0;
          const tripExpensesCount = getTripExpenses(trip._id).length;

          return (
            <div key={trip._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg">{trip.tripName}</h3>

                  <p>
                    <span className="font-medium">Budget:</span>{' '}
                    ${Number(trip.budget || 0).toFixed(2)}
                  </p>

                  <p>
                    <span className="font-medium">Total Spent:</span>{' '}
                    ${totalSpent.toFixed(2)}
                  </p>

                  <p>
                    <span className="font-medium">Remaining:</span>{' '}
                    <span
                      className={
                        isOverBudget
                          ? 'text-red-600 font-semibold'
                          : 'text-green-600 font-semibold'
                      }
                    >
                      ${remaining.toFixed(2)}
                    </span>
                  </p>

                  <p>
                    <span className="font-medium">Expenses Count:</span>{' '}
                    {tripExpensesCount}
                  </p>

                  <p>
                    <span className="font-medium">Start Date:</span>{' '}
                    {trip.startDate
                      ? new Date(trip.startDate).toLocaleDateString()
                      : 'No start date'}
                  </p>

                  <p>
                    <span className="font-medium">End Date:</span>{' '}
                    {trip.endDate
                      ? new Date(trip.endDate).toLocaleDateString()
                      : 'No end date'}
                  </p>

                  <p>
                    <span className="font-medium">Notes:</span>{' '}
                    {trip.notes || 'No notes'}
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

              <div className="mt-3">
                <button
                  onClick={() => setEditingTrip(trip)}
                  className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(trip._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TripList;
