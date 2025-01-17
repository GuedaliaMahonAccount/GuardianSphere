const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Route to fetch messages by group, language, and secter
router.get('/:group', groupsController.getMessagesByGroup);

// Route to create a new message
router.post('/', groupsController.createMessage);

// Report a message
router.post('/report', authMiddleware, groupsController.reportMessage);

module.exports = router;