const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');

// Route to fetch messages by group
router.get('/:group', groupsController.getMessagesByGroup);

// Route to create a new message
router.post('/', groupsController.createMessage);

module.exports = router;
