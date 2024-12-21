const express = require('express');
const { signup, login, getUser ,updateUserProfile, checkAvailability, incrementContacted} = require('../controllers/usercontroller');
const { authMiddleware } = require('../middlewares/authMiddleware'); // To protect routes if necessary

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route to check if an email is available or not (optional)
router.post('/check-availability', checkAvailability);

// Protected route to get user details (optional)
router.get('/me', authMiddleware, getUser); // Correctly routes to getUser

// Protected route to update user data (optional)
router.put('/profile', authMiddleware, updateUserProfile);

// Route to increment 'contacted' field
router.put('/increment-contacted', authMiddleware, incrementContacted);

module.exports = router;
