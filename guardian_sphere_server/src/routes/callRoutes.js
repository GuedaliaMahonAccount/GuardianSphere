const express = require('express');
const router = express.Router();
const callsController = require('../controllers/callsController');

// Créer un nouvel appel
router.post('/calls', callsController.createCall);

// Obtenir tous les appels actifs
router.get('/calls', callsController.getActiveCalls);

// Terminer un appel
router.put('/calls/:id/end', callsController.removeEmptyCall);

module.exports = router;
