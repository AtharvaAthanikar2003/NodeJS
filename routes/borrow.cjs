const express = require('express');
const Borrow = require('../models/Borrow.cjs');
const Book = require('../models/Book.cjs');
const User = require('../models/User.cjs');
const router = express.Router();

router.post('/borrow', async (req, res) => {
  try {
    const { username, bookId, dueDate } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'User not found' });
    const book = await Book.findById(bookId);
    if (!book) return res.status(400).json({ msg: 'Book not found' });
    if (!book.available) return res.status(400).json({ msg: 'Book not available' });
    const borrow = new Borrow({ username, bookId, dueDate });
    await borrow.save();
    book.available = false;
    await book.save();
    res.json({ msg: 'Book borrowed successfully', borrow });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/return', async (req, res) => {
  try {
    const { username, bookId } = req.body;
    const borrowRecord = await Borrow.findOne({ username, bookId });
    if (!borrowRecord) return res.status(404).json({ msg: 'Borrow record not found' });
    const book = await Book.findById(bookId);
    if (book) {
      book.available = true;
      await book.save();
    }
    await Borrow.deleteOne({ _id: borrowRecord._id });
    res.json({ msg: 'Book returned successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
