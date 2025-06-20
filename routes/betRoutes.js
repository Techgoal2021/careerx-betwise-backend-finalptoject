// routes/betRoutes.js
const express = require('express');
const router = express.Router();
const betController = require('../controllers/betController');
const { authenticateUser } = require('../middleware/auth');

// ✅ Secure both routes
router.post('/place-bet', authenticateUser, betController.placeBet);
router.get('/history', authenticateUser, betController.getUserBetHistory);

module.exports = router;
