const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Score = require('../models/Score');

// Fetch quiz questions
router.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Submit score
router.post('/scores', async (req, res) => {
    const score = new Score({
        username: req.body.username,
        score: req.body.score
    });

    try {
        const newScore = await score.save();
        res.status(201).json(newScore);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
