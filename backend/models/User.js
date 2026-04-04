const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema for user accounts
// Stores authentication details and user role information
const userSchema = new mongoose.Schema(
  {
    // User's full name
    name: { type: String, required: true, trim: true },

    // User's email address, stored in lowercase and must be unique
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },

    // User's hashed password
    password: { type: String, required: true },

    // User role used for access control
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // Automatically add createdAt and updatedAt fields
    timestamps: true,
  }
);

// Hash the password before saving the user document
// Only runs when the password field has been modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare an entered password with the stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Export the User model
module.exports = mongoose.model('User', userSchema);