// scripts/createAdmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    const email = 'admin@betwise.com';

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️ Admin already exists');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new User({
      username: 'admin',
      email,
      password: hashedPassword,
      role: 'admin',
      walletBalance: 0
    });

    await admin.save();
    console.log('✅ Admin user created with email:', email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();

