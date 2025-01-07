const express = require('express');
const Book = require('../models/Book.cjs');
const router = express.Router();

router.get('/books', async (req, res) => {
  try {
    const books = await Book.find({ available: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', err });
  }
});

router.post('/books', async (req, res) => {
  const { name, author, genre, type } = req.body;
  try {
    const newBook = new Book({ name, author, genre, type });
    await newBook.save();
    res.status(201).json({ msg: 'Book created successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error', err });
  }
});

router.put('/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, author, genre, type, available, admin } = req.body;
    if (!admin) return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    const book = await Book.findByIdAndUpdate(id, { name, author, genre, type, available }, { new: true, runValidators: true });
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    res.json({ msg: 'Book updated successfully', book });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
