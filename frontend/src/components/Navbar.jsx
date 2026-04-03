import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <div className="text-xl font-bold">Travel Expense Tracker</div>

      <div className="space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/trips" className="hover:underline">
              Trips
            </Link>
            <Link to="/expenses" className="hover:underline">
              Expenses
            </Link>
            <Link to="/settings" className="hover:underline">
              Settings
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="hover:underline">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;