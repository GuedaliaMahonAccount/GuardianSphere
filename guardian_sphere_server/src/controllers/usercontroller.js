const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Import the User model
const Code = require('../models/code'); // Import the Code model


// Admin Signup
exports.adminSignup = async (req, res) => {
  const {
    realName,
    email,
    password,
    anonymousName,
    photo,
    organization,
    secter,
  } = req.body;

  try {
    console.log('Admin Signup request received:', req.body);

    // Check if a code already exists for this organization and sector
    let code = await Code.findOne({ organization, secter });
    if (!code) {
      // Generate a unique code for the organization and sector
      const generatedCode = `${organization}_${secter}_${Date.now()}`;
      code = new Code({
        organization,
        secter,
        code: generatedCode,
      });
      await code.save();
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the admin user
    const user = new User({
      realName,
      email,
      password: hashedPassword,
      anonymousName: anonymousName || 'Anonymous',
      photo: photo || '/Pictures/default-avatar.png',
      organization,
      secter,
      code: code._id, // Reference to the Code model
      contacted: 0,
      points: 0,
      signaledcount: 0,
      banned: false,
      role: 'admin', // Explicitly set as admin
    });

    const savedUser = await user.save();

    console.log('Admin user saved:', savedUser);
    res.status(201).json({
      message: 'Admin registered successfully',
      userId: savedUser._id,
      code: code.code, // Return the generated code
    });
  } catch (error) {
    console.error('Error during admin signup:', error);
    res.status(500).json({ message: 'Admin signup failed', error });
  }
};

// Normal User Signup
exports.userSignup = async (req, res) => {
  const {
    realName,
    email,
    password,
    anonymousName,
    photo,
    code: userCode, // Code provided by the user
  } = req.body;

  try {
    console.log('User Signup request received:', req.body);

    // Verify the code
    const code = await Code.findOne({ code: userCode });
    if (!code) {
      return res.status(400).json({ message: 'Invalid code' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user with organization and secter from the Code model
    const user = new User({
      realName,
      email,
      password: hashedPassword,
      anonymousName: anonymousName || 'Anonymous',
      photo: photo || '/Pictures/default-avatar.png',
      organization: code.organization,
      secter: code.secter,
      code: code._id, // Reference the Code model
      contacted: 0,
      points: 0,
      signaledcount: 0,
      banned: false,
      role: 'user', // Default role for normal users
    });

    const savedUser = await user.save();
    console.log('User saved:', savedUser);

    res.status(201).json({ message: 'User registered successfully', userId: savedUser._id });
  } catch (error) {
    console.error('Error during user signup:', error);
    res.status(500).json({ message: 'User signup failed', error });
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



exports.incrementPoints = async (req, res) => {
  const userId = req.userId; // Extract userId from authMiddleware

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: 1 } }, // Incrémente 'points' de 1
      { new: true } // Retourne l'utilisateur mis à jour
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Points incremented successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error incrementing points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};