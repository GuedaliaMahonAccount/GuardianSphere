const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Signup
exports.signup = async (req, res) => {
    const { realName, email, password, anonymousName, photo } = req.body;
  
    try {
      console.log('Signup request received:', req.body); // Debug
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        realName,
        email,
        password: hashedPassword,
        anonymousName: anonymousName || 'Anonymous',
        photo: photo || '/Pictures/default-avatar.png',
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