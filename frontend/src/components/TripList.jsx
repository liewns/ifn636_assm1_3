import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TripList = ({ trips, setTrips, setEditingTrip }) => {
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Trips</h2>

      {trips.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded shadow">
          No trips yet. Create your first trip above.
        </div>
      ) : (
        trips.map((trip) => (
          <div key={trip._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h3 className="font-bold text-lg">{trip.tripName}</h3>
            <p>{trip.destination}</p>
            <p className="text-sm text-gray-500">
              Travel Date:{' '}
              {trip.travelDate
                ? new Date(trip.travelDate).toLocaleDateString()
                : 'No date'}
            </p>

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
        ))
      )}
    </div>
  );
};

export default TripList;