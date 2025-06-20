// controllers/betController.js

const Bet = require('../models/Bet');
const User = require('../models/User');
exports.placeBet = async (req, res) => {
  try {
    const { gameId, betType, stake } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.walletBalance < stake) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    user.walletBalance -= stake;
    await user.save();

    const bet = new Bet({ userId, gameId, betType, stake, status: 'pending' });
    await bet.save();

    res.status(201).json({ message: 'Bet placed successfully', bet });
  } catch (err) {
    console.error('Place bet error:', err);
    res.status(500).json({ message: 'Error placing bet' });
  }
};


exports.getUserBetHistory = async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ bets });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving bet history' });
  }
};
