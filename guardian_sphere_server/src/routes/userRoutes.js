const express = require('express');
const { signup, login, getUser } = require('../controllers/usercontroller');
const { authMiddleware } = require('../middlewares/authMiddleware'); // To protect routes if necessary

const router = express.Router();

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Protected route to get user details (optional)
router.get('/:userId', authMiddleware, getUser);

module.exports = router;
