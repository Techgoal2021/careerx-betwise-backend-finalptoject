
const mongoose = require('mongoose');
const BetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
  betType: { type: String, required: true },
  stake: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' }

}, { timestamps: true });

const Bet = mongoose.model('Bet', BetSchema);
module.exports = Bet;
