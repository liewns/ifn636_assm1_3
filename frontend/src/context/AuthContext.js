import React, { createContext, useState, useContext } from 'react';

// Create a context to store authentication data across the app
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store the logged-in user in state
  // Load saved user data from localStorage when the app starts
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save user data after login and update the context state
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Update stored user information, such as profile changes
  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Clear user data when logging out
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // Provide authentication data and functions to all child components
  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to make AuthContext easier to use in components
export const useAuth = () => useContext(AuthContext);