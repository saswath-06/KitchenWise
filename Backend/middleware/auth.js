const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Please authenticate',
      error: error.message 
    });
  }
};

module.exports = auth;