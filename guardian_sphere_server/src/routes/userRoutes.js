const express = require('express');
const { signup, login, getUser } = require('../controllers/usercontroller');
const { authMiddleware } = require('../middlewares/authMiddleware'); // To protect routes if necessary
const { updateUserData } = require('../controllers/groupsController');

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Protected route to get user details (optional)
router.get('/me', authMiddleware, getUser); // Correctly routes to getUser

// Protected route to update user data (optional)
router.put('/me', authMiddleware, updateUserData);

module.exports = router;
