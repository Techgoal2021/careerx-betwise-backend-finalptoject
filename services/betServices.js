// services/betService.js

const mongoose = require('mongoose');
const Bet = require('../models/Bet');
const User = require('../models/User');
const Game = require('../models/Game');

exports.processPayouts = async (gameId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const game = await Game.findById(gameId).session(session);
    if (!game || !game.result) {
      throw new Error('Game result not set');
    }

    const bets = await Bet.find({ gameId }).session(session);
    for (const bet of bets) {
      if (bet.selection === game.result) {
        const payout = bet.amount * game.odds[game.result];

        const user = await User.findByIdAndUpdate(
          bet.userId,
          { $inc: { wallet: payout } },
          { new: true, session }
        );

        bet.status = 'won';
        console.log(`User ${user._id} won bet: +${payout}`);
      } else {
        bet.status = 'lost';
        console.log(`User ${bet.userId} lost bet.`);
      }

      await bet.save({ session });
    }

    await session.commitTransaction();
    console.log('Payout processing completed successfully.');
  } catch (error) {
    await session.abortTransaction();
    console.error('Error processing payouts:', error);
    throw error; // rethrow to handle it where this service is used
  } finally {
    session.endSession();
  }
};
