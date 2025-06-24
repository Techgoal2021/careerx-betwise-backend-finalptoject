const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateUser, isAdmin } = require('../middleware/auth');
const User = require('../models/User');


// Public Routes
router.post('/register', UserController.registerUser);
router.post('/login', UserController.loginUser);

// Protected Routes
router.get('/', authenticateUser, isAdmin, UserController.getUsers); // Admin only
router.get('/:id', authenticateUser, UserController.getUserById);
router.put('/:id', authenticateUser, UserController.updateUser);
router.put('/:id/online', authenticateUser, isAdmin, UserController.updateUserStatus); // Optional: Admin only
router.delete('/:id', authenticateUser, isAdmin, UserController.deleteUser);

// Wallet Routes
router.post('/:id/wallet/deposit', authenticateUser, UserController.depositFunds);
router.post('/:id/wallet/withdraw', authenticateUser, UserController.withdrawFunds);
router.get('/:id/wallet/balance', authenticateUser, UserController.getUserBalance);

// ✅ Development/Test Wallet Funding Route
router.post('/fund-wallet', authenticateUser, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.walletBalance += amount;
    await user.save();

    res.json({ message: 'Wallet funded', walletBalance: user.walletBalance });
  } catch (err) {
    // 👇 Add this line right here
    console.error('Fund wallet error:', err);
    res.status(500).json({ message: 'Error funding wallet' });
  }
});

router.get('/test', (req, res) => {
  res.send('User route is working!');
});



module.exports = router;


