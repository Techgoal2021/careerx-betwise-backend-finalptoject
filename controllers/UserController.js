const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate user input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      walletBalance: 0, // Initialize wallet balance to 0
    });

    // Save user to database
    await user.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user' });
  }
};


// const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'User logged in successfully',
      token: token
    });

  } catch (err) {
    res.status(400).json({ message: 'Error logging in user' });
  }
};



// Get All Users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error fetching users' });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error fetching user' });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const updates = req.body;
    delete updates.password; // exclude password from updates
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating user' });
  }
};

// Update User Status
exports.updateUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const status = req.body.status;
    if (!['active', 'inactive'].includes(status)) { // validate status
      return res.status(400).json({ message: 'Invalid status' });
    }
    const user = await User.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error updating user status' });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error deleting user' });
  }
};


// Get user balance
exports.getUserBalance = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('walletBalance');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ balance: user.walletBalance });
  } catch (err) {
    res.status(400).json({ message: 'Error fetching user balance' });
  }
};


// Deposit funds into user account
exports.depositFunds = async (req, res) => {
  try {
    const userId = req.params.id;
    const amount = req.body.amount;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid deposit amount' });
    }
    const user = await User.findByIdAndUpdate(userId, { $inc: { walletBalance: amount } }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ balance: user.walletBalance });
  } catch (err) {
    res.status(400).json({ message: 'Error depositing funds' });
  }
};


// Withdraw funds from user account
exports.withdrawFunds = async (req, res) => {
  try {
    const userId = req.params.id;
    const amount = req.body.amount;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid withdrawal amount' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { walletBalance: -amount } }, { new: true });
    res.json({ balance: updatedUser.walletBalance });
  } catch (err) {
    res.status(400).json({ message: 'Error withdrawing funds' });
  }
};




