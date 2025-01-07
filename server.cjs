const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Book = require('./models/Book.cjs');
const User = require('./models/User.cjs');
const userRouter = require('./routes/users.cjs');
const authRoutes = require('./routes/auth.cjs');
const bookRoutes = require('./routes/books.cjs');
const borrowRoutes = require('./routes/borrow.cjs');

const app = express();
app.use(bodyParser.json());

const mongoURI = 'mongodb://127.0.0.1:27017/library-management';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
        seedDatabase();
    })
    .catch((err) => console.log('Error connecting to MongoDB:', err));

const PORT = process.env.PORT || 7000;

app.get('/', (_req, res) => {
    res.send('Library Management System Backend');
});

app.use('/api/auth', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', borrowRoutes);
app.use('/api', userRouter);

async function seedDatabase() {
    try {
        const userExists = await User.countDocuments();
        if (userExists === 0) {
            await new User({ name: 'Admin User', username: 'admin', password: 'admin123', email: 'admin@library.com', mobile: 1234567890, admin: true }).save();
            await new User({ name: 'Atharva Athanikar', username: 'Atharva', password: 'atharva2003', email: 'aa@gmail.com', mobile: 9123456780, admin: false }).save();
        }

        const bookExists = await Book.countDocuments();
        if (bookExists === 0) {
            await new Book({ name: 'Wings of fire', author: 'APJ Abdul kalam', genre: 'Motivation', type: 'Book', available: true }).save();
            await new Book({ name: '1984', author: 'George Orwell', genre: 'Dystopian', type: 'Novel', available: true }).save();
            await new Book({ name: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', type: 'Novel', available: true }).save();
            await new Book({ name: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', type: 'Novel', available: true }).save();
            await new Book({ name: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', type: 'Novel', available: true }).save();
        }
    } catch (err) {
        console.log('Error seeding database:', err);
    }
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
