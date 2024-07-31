const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    username: String,
    score: Number,
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Score', ScoreSchema);
