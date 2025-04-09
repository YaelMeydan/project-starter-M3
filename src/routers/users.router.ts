import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { NewBook } from "../models/books.model";
import { User } from "../models/users.model";
import mongoose from "mongoose";

export const router = express.Router();

router.get('/:userId/collection', authenticate, async (req, res) => {
    try {
        const { userId } = req.signedCookies;
        const user = await User.findById(userId).populate('bookCollection');

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json({ data: user.bookCollection });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch user collection', details: error.message });
    }
});


router.post('/add/:bookId', authenticate, async (req, res) => {
    try {
        const { userId } = req.signedCookies;
        const { bookId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const book = await NewBook.findById(bookId);
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        if (user.bookCollection.includes(new mongoose.Types.ObjectId(bookId))) {
            res.status(400).json({ error: 'Book already in collection' });
            return;
        }

        user.bookCollection.push(new mongoose.Types.ObjectId(bookId));
        await user.save();

        book.followers.push(userId);
        await book.save();

        res.status(200).json({ message: 'Book added to collection' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to add book to collection', details: error.message });
    }
});

