const express = require('express');
const router = express.Router();
const followUpController = require('../controllers/followUpController');

// Create a new treatment
router.post('/follow', followUpController.createTreatment);

// Get treatments by username
router.get('/follow', followUpController.getByUsername);

// Update a specific treatment
router.put('/follow/:id', followUpController.updateTreatment);

// Delete a specific treatment
router.delete('/follow/:id', followUpController.deleteTreatment);

module.exports = router;