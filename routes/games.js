const express = require('express');
const router = express.Router();
const GameController = require('../controllers/GameController');
const { authenticateUser, isAdmin } = require('../middleware/auth'); 

// Game routes
router.get('/', GameController.getGames);
router.post('/add', authenticateUser, isAdmin, GameController.createGame); // ✅ Auth then isAdmin
router.put('/:id', authenticateUser, isAdmin, GameController.updateGame);  // optional: protect update/delete too
router.delete('/:id', authenticateUser, isAdmin, GameController.deleteGame);
router.get('/results', GameController.getGameResults);

module.exports = router;
