// models/Game.js

const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  odds: {
    team1: { type: Number, required: true },
    team2: { type: Number, required: true },
    draw: { type: Number } // optional draw odds
  },
  result: {
    type: String,
    enum: ['team1', 'team2', 'draw'],
    default: null
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed'],
    default: 'scheduled'
  },
  matchDate: { type: Date, required: true } // correct placement
}, { timestamps: true });

module.exports = mongoose.model('Game', gameSchema);



