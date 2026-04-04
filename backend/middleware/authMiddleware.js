const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes by verifying the JWT token
// Only authenticated users can access routes using this middleware
const protect = async (req, res, next) => {
  let token;

  // Check if the request contains an Authorization header with a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the header
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user linked to the token and exclude the password field
      req.user = await User.findById(decoded.id).select('-password');

      // Return error if the user no longer exists
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Continue to the next middleware or route handler
      return next();
    } catch (error) {
      console.error('protect middleware error:', error);
      return res.status(401).json({ message: 'Not authorised' });
    }
  }

  // Return error if no token is provided
  return res.status(401).json({ message: 'Not authorised, no token' });
};

// Restrict access to admin users only
const adminOnly = (req, res, next) => {
  // Allow access only if the authenticated user has admin role
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  // Return error if the user is not an admin
  return res.status(403).json({ message: 'Admin access only' });
};

// Export authentication and authorisation middleware
module.exports = { protect, adminOnly };