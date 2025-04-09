import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { NewBook } from "../models/books.model";
import { User } from "../models/users.model";
import mongoose from "mongoose";

export const router = express.Router();

router.get('/all', async (req, res) => {
    try {
        const { } = req.query;
        const books = await NewBook.find();
        res.status(200).json({ data: books });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch community books', details: error.message });
    }
});


router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
             res.status(400).json({ error: 'Search query is required' });
             return;
        }

        const searchQuery = query as string;
        const books = await NewBook.find({
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { author: { $regex: searchQuery, $options: 'i' } },
            ],
        });

        res.status(200).json({ data: books });
        return;
        
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to search for books', details: error.message });
    }
});

router.post('/new', authenticate, async (req, res) => {
    try {
        const { title, author } = req.body;

        if (!title || !author) {
             res.status(400).json({ error: 'Title and author are required' });
                return;
        }

        const newBook = new NewBook({ title, author, followers: [req.signedCookies.userId] });
        await newBook.save();


        const user = await User.findById(req.signedCookies.userId);
        if (user) {
            user.bookCollection.push(newBook._id);
            await user.save();
        }

        res.status(201).json({ message: 'Book created successfully' });
        res.end();
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to create book', details: error.message });
    }
});

// Add a review to a book
router.post('/:bookId/review', authenticate, async (req, res) => {
    try {
        const { reviewText } = req.body;
        const { bookId } = req.params;
       
        if (!reviewText) {
             res.status(400).json({ error: 'Review text is required' });
             return;             
        }

        const book = await NewBook.findById(bookId);
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        const user = await User.findById(req.signedCookies.userId);
        if (!user) {
             res.status(404).json({ error: 'User not found' });
                return;
        }

        book.reviews.push({
            userId: req.signedCookies.userId,
            username: user.username,
            text: reviewText,
            createdAt: new Date(),
        });
        await book.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to add review', details: error.message });
    }
});


