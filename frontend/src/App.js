import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Trips from './pages/Trip';
import Expenses from './pages/Expenses';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;