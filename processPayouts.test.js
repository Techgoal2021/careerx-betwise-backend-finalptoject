// tests/processPayouts.test.js
const mongoose = require('mongoose');
const { connect, closeDatabase, clearDatabase } = require('./dbHandler');
const User = require('../models/User'); // Adjust the path as necessary
const Game = require('../models/Game'); // Adjust the path as necessary
const Bet = require('../models/Bet');   // Adjust the path as necessary
const processPayouts = require('../services/processPayouts'); // Adjust the path as necessary

beforeAll(async () => await connect());
afterEach(async () => await clearDatabase());
afterAll(async () => await closeDatabase());

describe('processPayouts', () => {
  it('should update wallet and bet status for winning bets', async () => {
    // Setup: Create a user
    const user = await User.create({ name: 'Test User', wallet: 100 });

    // Setup: Create a game with a result
    const game = await Game.create({
      team1: 'Team A',
      team2: 'Team B',
      odds: { team1: 2.0, team2: 3.0 },
      result: 'team1'
    });

    // Setup: Place a bet on the winning team
    const betAmount = 50;
    await Bet.create({
      user: user._id,
      game: game._id,
      amount: betAmount,
      team: 'team1',
      status: 'pending'
    });

    // Execution: Process payouts
    await processPayouts(game._id);

    // Assertions: Fetch updated user and bet
    const updatedUser = await User.findById(user._id);
    const updatedBet = await Bet.findOne({ user: user._id, game: game._id });

    // Calculate expected wallet balance
    const expectedWinnings = betAmount * game.odds[game.result];
    const expectedWallet = 100 + expectedWinnings;

    expect(updatedUser.wallet).toBeCloseTo(expectedWallet);
    expect(updatedBet.status).toBe('won');
  });
});
