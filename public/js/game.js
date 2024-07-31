const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);

let questions;
let currentQuestionIndex = 0;
let questionText;
let answerButtons = [];
let score = 0;
let correctAnswers = 0;
let questionTracker;
let scoreText;
let results = [];

function preload() {
    this.load.json('questions', 'assets/questions.json');
    this.load.image('background', 'assets/background.jpg');
}

function create() {
    this.add.sprite(0, 0, 'background').setOrigin(0, 0).setDisplaySize(config.width, config.height);

    questions = this.cache.json.get('questions');

    if (!questions || questions.length === 0) {
        console.error('No questions loaded or questions format is incorrect.');
        return;
    }

    displayQuestion.call(this, currentQuestionIndex);

    questionTracker = this.add.text(config.width - 200, 10, '', { fontSize: '30px', fill: '#fff' });
    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '30px', fill: '#fff' });
}

function update() { }

function displayQuestion(index) {
    if (questionText) {
        questionText.destroy();
    }

    answerButtons.forEach(button => button.destroy());
    answerButtons = [];

    const question = questions[index];
    questionText = this.add.text(config.width / 2, config.height / 2 - 100, question.question, {
        fontSize: '36px',
        fill: '#fff',
        align: 'center',
        wordWrap: { width: config.width - 40 }
    }).setOrigin(0.5, 0.5);

    question.answers.forEach((answer, i) => {
        let button = this.add.text(config.width / 2, config.height / 2 - 20 + i * 60, answer, {
            fontSize: '28px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: config.width - 40 }
        })
            .setOrigin(0.5, 0.5)
            .setInteractive()
            .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => button.setStyle({ fill: '#fff' }))
            .on('pointerdown', () => handleAnswerClick.call(this, answer, question.correct, index));
        answerButtons.push(button);
    });

    if (questionTracker) {
        questionTracker.setText(`Question ${index + 1}`);
    }
}

function handleAnswerClick(selectedAnswer, correctAnswer, questionIndex) {
    const result = { questionIndex, correct: selectedAnswer === correctAnswer };
    results.push(result);

    if (result.correct) {
        score += 10;
        correctAnswers++;
        if (scoreText) {
            scoreText.setText('Score: ' + score);
        }
    }

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion.call(this, currentQuestionIndex);
    } else {
        window.location.href = `gameover.html?score=${score}&correct=${correctAnswers}&total=${questions.length}&results=${encodeURIComponent(JSON.stringify(results))}`;
    }
}
