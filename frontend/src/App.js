import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Trips from './pages/Trip';
import Expenses from './pages/Expenses';
import Navbar from './components/Navbar';
import PublicNavbar from './components/PublicNavbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import TripDetails from './pages/TripDetails';
import Admin from './pages/Admin';

function AppRoutes() {
  const location = useLocation();

  // Define routes that should use the public navigation bar
  const publicPages = ['/', '/login', '/register'];
  const isPublicPage = publicPages.includes(location.pathname);

  return (
    <>
      {/* Show public navbar on landing, login, and register pages */}
      {isPublicPage ? <PublicNavbar /> : <Navbar />}

      {/* Define all application routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:id" element={<TripDetails />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    // Wrap the app in the Router so routing works across all pages
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;