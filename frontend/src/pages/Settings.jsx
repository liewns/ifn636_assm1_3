import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // Store editable profile details
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });

  // Store password update fields
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Store local user preferences such as currency, notifications, and theme
  const [settings, setSettings] = useState({
    currency: 'AUD',
    notifications: true,
    theme: 'Light',
  });

  useEffect(() => {
    // Redirect unauthenticated users to the login page
    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    // Fetch the user's current profile details from the backend
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        // Populate the profile form with saved user data
        setProfileForm({
          name: response.data.name || '',
          email: response.data.email || '',
        });
      } catch (error) {
        console.error('Fetch profile error:', error);
        alert(error.response?.data?.message || 'Failed to load profile.');
      }
    };

    fetchProfile();

    // Load saved preferences from localStorage if they exist
    const savedSettings = localStorage.getItem('travelExpenseSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [user, navigate]);

  // Submit updated profile details to the backend
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put('/api/auth/profile', profileForm, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // Update user details in context after a successful profile change
      updateUser(response.data);
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Profile update error:', error);
      alert(error.response?.data?.message || 'Failed to update profile.');
    }
  };

  // Submit password change request to the backend
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.put('/api/auth/password', passwordForm, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert(response.data.message || 'Password updated successfully.');

      // Clear password fields after a successful update
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Password update error:', error);
      alert(error.response?.data?.message || 'Failed to update password.');
    }
  };

  // Save user preferences locally in the browser
  const handleSavePreferences = () => {
    localStorage.setItem('travelExpenseSettings', JSON.stringify(settings));
    alert('Settings saved successfully.');
  };

  // Log the user out and redirect them to the login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Page heading and short description */}
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600 mb-8">
          Manage your profile, preferences, and account settings.
        </p>

        {/* Profile update section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Profile</h2>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-500 mb-2">Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, name: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="w-full p-3 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Password update section */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Security</h2>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-500 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-500 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full p-3 border border-slate-300 rounded-lg"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white p-3 rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              Change Password
            </button>
          </form>
        </div>

        {/* Preferences section for local app settings */}
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Preferences</h2>

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
              onClick={handleSavePreferences}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save Settings
            </button>
          </div>
        </div>

        {/* Account section with logout action */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Account</h2>
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