const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup
exports.signup = async (req, res) => {
  const {
    realName,
    email,
    password,
    anonymousName,
    photo,
    organization,
    secter,
    role,
  } = req.body;

  try {
    console.log('Signup request received:', req.body); // Debug
    const hashedPassword = await bcrypt.hash(password, 10);

    // Include all fields in the User creation
    const user = new User({
      realName,
      email,
      password: hashedPassword,
      anonymousName: anonymousName || 'Anonymous',
      photo: photo || '/Pictures/default-avatar.png',
      organization: organization || '',
      secter: secter || '',
      contacted: 0,
      points: 0,
      signaledcount: 0,
      banned: false,
      role: role || 'user', // Default to 'user' if role is not provided
    });

    const savedUser = await user.save();
    console.log('User saved:', savedUser); // Debug
    res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
  } catch (error) {
    console.error('Error during signup:', error); // Debug
    res.status(500).json({ message: 'Signup failed', error });
  }
};

  
// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
};

// Get User Info
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId); // req.userId comes from authMiddleware
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Failed to fetch user info', error });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { anonymousName, photo } = req.body;
    const userId = req.userId; // Correctly use req.userId

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in request.' });
    }

    // Prepare the fields to be updated
    const updates = {};
    if (anonymousName !== undefined) updates.anonymousName = anonymousName;
    if (photo !== undefined) updates.photo = photo;

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true, // Return the updated document
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({
      message: 'User profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Check availability of email and anonymous name
exports.checkAvailability = async (req, res) => {
  const { email, anonymousName } = req.body;

  try {
    const emailExists = email ? await User.exists({ email }) : false;
    const usernameExists = anonymousName ? await User.exists({ anonymousName }) : false;

    res.status(200).json({ emailExists, usernameExists });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ message: 'Failed to check availability', error });
  }
};

// Increment 'contacted' field
exports.incrementContacted = async (req, res) => {
  const userId = req.userId; // Extract userId from authMiddleware

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { contacted: 1 } }, // Increment 'contacted' by 1
      { new: true } // Return the updated user
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Contacted field incremented successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error incrementing contacted field:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclut le mot de passe pour des raisons de sécurité
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Failed to fetch all users', error });
  }
};

