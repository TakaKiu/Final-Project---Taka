const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define your routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the main page
});

app.get('/questions', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'questions.html')); // Serve the questions page
});

// Example API routes for handling questions and scores
app.get('/api/questions', (req, res) => {
    res.json([
        {
            category: 'General Knowledge',
            type: 'multiple',
            difficulty: 'easy',
            question: 'What is the capital of France?',
            correct_answer: 'Paris',
            incorrect_answers: ['London', 'Rome', 'Berlin']
        },
        {
            category: 'Science',
            type: 'multiple',
            difficulty: 'medium',
            question: 'What is the chemical symbol for gold?',
            correct_answer: 'Au',
            incorrect_answers: ['Ag', 'Pb', 'Fe']
        },
        {
            category: 'History',
            type: 'multiple',
            difficulty: 'hard',
            question: 'Who was the first President of the United States?',
            correct_answer: 'George Washington',
            incorrect_answers: ['Thomas Jefferson', 'John Adams', 'Abraham Lincoln']
        },
        {
            category: 'Geography',
            type: 'multiple',
            difficulty: 'easy',
            question: 'Which is the largest ocean on Earth?',
            correct_answer: 'Pacific Ocean',
            incorrect_answers: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean']
        },
        {
            category: 'Technology',
            type: 'multiple',
            difficulty: 'medium',
            question: 'What does HTML stand for?',
            correct_answer: 'HyperText Markup Language',
            incorrect_answers: ['HyperText Machine Language', 'HighText Markup Language', 'HyperText Multilayer Language']
        },
        {
            category: 'Entertainment',
            type: 'multiple',
            difficulty: 'easy',
            question: 'Who wrote the Harry Potter series?',
            correct_answer: 'J.K. Rowling',
            incorrect_answers: ['J.R.R. Tolkien', 'George R.R. Martin', 'J.D. Salinger']
        },
        {
            category: 'Sports',
            type: 'multiple',
            difficulty: 'medium',
            question: 'Which country won the FIFA World Cup in 2018?',
            correct_answer: 'France',
            incorrect_answers: ['Croatia', 'Germany', 'Brazil']
        },
        {
            category: 'Mathematics',
            type: 'multiple',
            difficulty: 'medium',
            question: 'What is the value of Pi to 2 decimal places?',
            correct_answer: '3.14',
            incorrect_answers: ['3.15', '3.13', '3.16']
        },
        {
            category: 'Literature',
            type: 'multiple',
            difficulty: 'medium',
            question: 'What is the name of the fictional wizarding school in the Harry Potter series?',
            correct_answer: 'Hogwarts',
            incorrect_answers: ['Beauxbatons', 'Durmstrang', 'Ilvermorny']
        },
        {
            category: 'Music',
            type: 'multiple',
            difficulty: 'easy',
            question: 'Which band released the album "Abbey Road"?',
            correct_answer: 'The Beatles',
            incorrect_answers: ['The Rolling Stones', 'The Beach Boys', 'The Who']
        }
    ]);
});

app.post('/api/scores', (req, res) => {
    const { username, score } = req.body;

    // Validate input
    if (!username || typeof score !== 'number') {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // Save score to database (example logic)
    // You should replace this with actual database saving logic
    console.log(`Score submitted: ${username} - ${score}`);

    res.json({ message: 'Score submitted successfully' });
});

// Handle 404 errors
app.use((req, res, next) => {
    res.status(404).send('Sorry, we cannot find that!');
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
