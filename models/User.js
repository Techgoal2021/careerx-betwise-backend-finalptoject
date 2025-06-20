
// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletBalance: { type: Number, default: 0 },
  online: { type: Boolean, default: false },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
});

  


module.exports = mongoose.model('User', userSchema);




