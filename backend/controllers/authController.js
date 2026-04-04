const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Generate a signed JWT token for authenticated users
// The token stores the user ID and expires in 30 days
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register a new user account
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check that all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Clean email input by removing spaces and converting to lowercase
    const cleanedEmail = email.trim().toLowerCase();

    // Check if a user with the same email already exists
    const userExists = await User.findOne({ email: cleanedEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user record
    const user = await User.create({
      name: name.trim(),
      email: cleanedEmail,
      password,
    });

    // Return newly created user details with authentication token
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Log in an existing user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Clean email input to ensure consistent matching
    const cleanedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanedEmail });

    // Check whether the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // Reject login if password does not match
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Return user details and token on successful login
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: error.message });
  }
};

// Get the logged-in user's profile information
const getProfile = async (req, res) => {
  try {
    // Find user by ID from the authenticated request and exclude password
    const user = await User.findById(req.user.id).select('-password');

    // Return error if user cannot be found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return basic profile information
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update the logged-in user's profile details
const updateUserProfile = async (req, res) => {
  try {
    // Find the current authenticated user
    const user = await User.findById(req.user.id);

    // Return error if user is not found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, email } = req.body;

    // If email is changed, check that it is not already used by another account
    if (email && email.trim().toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      user.email = email.trim().toLowerCase();
    }

    // Update name if a new one is provided, otherwise keep existing name
    user.name = name?.trim() || user.name;

    // Save updated user details
    const updatedUser = await user.save();

    // Return updated profile details with a new token
    return res.status(200).json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update the logged-in user's password
const updateUserPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check that all password fields are filled in
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all password fields' });
    }

    // Ensure the new password and confirmation match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    // Enforce a minimum password length
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Find the authenticated user
    const user = await User.findById(req.user.id);

    // Return error if user does not exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the current password before allowing update
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Save the new password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Export authentication controller functions
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
  updateUserPassword,
};