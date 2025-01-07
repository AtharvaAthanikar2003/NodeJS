const mongoose = require('mongoose');

const borrowSchema = new mongoose.Schema({
  username: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },  
  dueDate: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Borrow', borrowSchema);
