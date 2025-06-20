const mongoose = require('mongoose');
const Bet = require('../models/Bet');
const User = require('../models/User');
const Game = require('../models/Game');
const logger = require('../utils/logger');

/**
 * Processes payouts for a completed game.
 * @param {String} gameId - The ID of the game.
 * @param {mongoose.ClientSession} session - The current transaction session.
 */
exports.processPayouts = async (gameId, session) => {
  try {
    // Retrieve the game within the session
    const game = await Game.findById(gameId).session(session);
    if (!game || !game.result) {
      throw new Error('Game result not set');
    }

    // Fetch all bets associated with the game
    const bets = await Bet.find({ gameId }).session(session);

    for (const bet of bets) {
      if (bet.selection === game.result) {
        const payout = bet.amount * game.odds[game.result];

        // Update user's wallet balance
        const user = await User.findById(bet.userId).session(session);
        if (!user) {
          throw new Error(`User with ID ${bet.userId} not found`);
        }
        user.wallet += payout;
        await user.save({ session });

        // Update bet status
        bet.status = 'won';
        await bet.save({ session });

        logger.info(`Payout of ${payout} processed for user ${user._id} on bet ${bet._id}`);
      } else {
        // Update bet status for lost bets
        bet.status = 'lost';
        await bet.save({ session });

        logger.info(`Bet ${bet._id} marked as lost for user ${bet.userId}`);
      }
    }
  } catch (error) {
    logger.error(`Error processing payouts for game ${gameId}: ${error.message}`);
    throw error; // Propagate error to be handled by the calling function
  }
};
