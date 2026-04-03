import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    currency: 'AUD',
    notifications: true,
    theme: 'Light',
  });

  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    const savedSettings = localStorage.getItem('travelExpenseSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [user, navigate]);

  const handleSave = () => {
    localStorage.setItem('travelExpenseSettings', JSON.stringify(settings));
    alert('Settings saved successfully.');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName =
    user?.name || user?.username || user?.fullName || 'User';

  const displayEmail = user?.email || 'No email available';

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600 mb-8">
          Manage your profile, preferences, and account settings.
        </p>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Profile
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500">Name</p>
              <p className="text-slate-900 font-medium">{displayName}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-slate-900 font-medium">{displayEmail}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Preferences
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm text-slate-500 mb-2">
                Preferred Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-lg"
              >
                <option value="AUD">AUD</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="flex items-center justify-between border border-slate-200 rounded-lg p-4">
              <div>
                <p className="font-medium text-slate-900">Notifications</p>
                <p className="text-sm text-slate-500">
                  Receive alerts and reminders.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notifications: e.target.checked,
                  })
                }
                className="h-5 w-5"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) =>
                  setSettings({ ...settings, theme: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-lg"
              >
                <option value="Light">Light</option>
                <option value="Dark">Dark</option>
              </select>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Settings
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Support
          </h2>
          <p className="text-slate-600 mb-2">Need help using the app?</p>
          <p className="text-slate-900 font-medium">support@traveltracker.com</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Account
          </h2>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;