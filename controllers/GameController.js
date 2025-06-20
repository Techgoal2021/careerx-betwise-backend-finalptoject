const Game = require('../models/Game');
const { processPayouts } = require('../services/payoutService');
const logger = require('../utils/logger');

exports.getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    logger.error('Error fetching games:', err);
    res.status(500).json({ message: 'Error fetching games' });
  }
};

exports.createGame = async (req, res) => {
  try {
    const { team1, team2, odds } = req.body;
    if (!team1 || !team2 || !odds || !odds.team1 || !odds.team2) {
      return res.status(400).json({ message: 'Team names and odds are required' });
    }
    const game = new Game(req.body);
    await game.save();
    res.status(201).json(game);
  } catch (err) {
    logger.error('Error creating game:', err);
    res.status(400).json({ message: 'Error creating game' });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const updatedGame = await Game.findByIdAndUpdate(gameId, req.body, { new: true });
    if (!updatedGame) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(updatedGame);
  } catch (err) {
    logger.error('Error updating game:', err);
    res.status(400).json({ message: 'Error updating game' });
  }
};

exports.deleteGame = async (req, res) => {
  try {
    const gameId = req.params.id;
    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    await Game.findByIdAndDelete(gameId);
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    logger.error('Error deleting game:', err);
    res.status(400).json({ message: 'Error deleting game' });
  }
};

exports.getGameResults = async (req, res) => {
  try {
    const games = await Game.find({ result: { $ne: null } }).sort({ date: -1 });
    res.status(200).json({ games });
  } catch (error) {
    logger.error('Error retrieving game results:', error);
    res.status(500).json({ message: 'Error retrieving game results' });
  }
};
