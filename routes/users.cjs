const express = require('express');
const User = require('../models/User.cjs');
const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;