// Memory Game Class
class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.timer = null;
        this.timeLeft = 300; // 5 minutes in seconds
        this.totalPairs = 8;
        
        this.symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
        this.initializeGame();
        this.bindEvents();
    }

    initializeGame() {
        this.createCards();
        this.shuffleCards();
        this.renderBoard();
        this.updateDisplay();
    }

    createCards() {
        this.cards = [];
        this.symbols.forEach(symbol => {
            this.cards.push({ symbol, isFlipped: false, isMatched: false, id: Math.random() });
            this.cards.push({ symbol, isFlipped: false, isMatched: false, id: Math.random() });
        });
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    renderBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            cardElement.innerHTML = card.isFlipped ? card.symbol : '❓';
            
            if (card.isMatched) {
                cardElement.classList.add('matched');
            } else if (card.isFlipped) {
                cardElement.classList.add('flipped');
            }
            
            gameBoard.appendChild(cardElement);
        });
    }

    bindEvents() {
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        document.getElementById('submitGameBtn').addEventListener('click', () => this.submitGame());
        document.getElementById('resetGameBtn').addEventListener('click', () => this.resetGame());
        
        document.getElementById('gameBoard').addEventListener('click', (e) => {
            if (e.target.classList.contains('card') && this.gameStarted && !this.gameEnded) {
                this.flipCard(parseInt(e.target.dataset.index));
            }
        });
    }

    startGame() {
        this.gameStarted = true;
        this.startTimer();
        document.getElementById('startGameBtn').disabled = true;
        document.getElementById('submitGameBtn').disabled = false;
        document.getElementById('resetGameBtn').disabled = false;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endGame('انتهى الوقت!');
            }
        }, 1000);
    }

    flipCard(index) {
        const card = this.cards[index];
        
        if (card.isFlipped || card.isMatched || this.flippedCards.length >= 2) {
            return;
        }

        card.isFlipped = true;
        this.flippedCards.push(index);
        this.renderBoard();

        if (this.flippedCards.length === 2) {
            this.moves++;
            this.checkMatch();
        }
    }

    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];

        if (card1.symbol === card2.symbol) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            this.score += 10;
            
            if (this.matchedPairs === this.totalPairs) {
                setTimeout(() => this.endGame('أحسنت! أكملت اللعبة!'), 500);
            }
        } else {
            // No match
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                this.renderBoard();
            }, 1000);
        }

        this.flippedCards = [];
        this.updateDisplay();
    }

    updateDisplay() {
        // Update timer
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('gameTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update moves and score
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('gameScore').textContent = this.score;
    }

    submitGame() {
        if (this.gameStarted && !this.gameEnded) {
            this.endGame('تم إنهاء اللعبة يدوياً');
        }
    }

    endGame(message) {
        this.gameEnded = true;
        clearInterval(this.timer);
        
        const finalScore = this.score;
        const finalMoves = this.moves;
        const stars = this.calculateStars(finalMoves);
        
        document.getElementById('gameStatus').textContent = message;
        document.getElementById('finalGameScore').textContent = finalScore;
        document.getElementById('finalMoves').textContent = finalMoves;
        document.getElementById('stars').innerHTML = this.renderStars(stars);
        
        document.getElementById('gameScoreModal').style.display = 'flex';
    }

    calculateStars(moves) {
        const minMoves = this.totalPairs; // Perfect game = 8 moves
        
        if (moves <= minMoves) return 5;           // 8 moves = 5 stars
        if (moves <= minMoves + 2) return 4;       // 10 moves = 4 stars
        if (moves <= minMoves + 4) return 3;       // 12 moves = 3 stars
        if (moves <= minMoves + 6) return 2;       // 14 moves = 2 stars
        return 1;                                  // >14 moves = 1 star
    }

    renderStars(stars) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="star ${i <= stars ? '' : 'empty'}">⭐</span>`;
        }
        return html;
    }

    resetGame() {
        clearInterval(this.timer);
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.timeLeft = 300;
        
        this.initializeGame();
        document.getElementById('startGameBtn').disabled = false;
        document.getElementById('submitGameBtn').disabled = true;
        document.getElementById('resetGameBtn').disabled = true;
    }
}

// JavaScript Quiz Class
class JavaScriptQuiz {
    constructor() {
        this.questions = [
            {
                question: "ما هو نوع البيانات الذي يتم إرجاعه من `typeof null`؟",
                options: ["object", "null", "undefined", "string"],
                correct: 0
            },
            {
                question: "كيف يمكنك إضافة عنصر جديد في نهاية المصفوفة؟",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correct: 0
            },
            {
                question: "ما هو الفرق بين `==` و `===`؟",
                options: ["لا يوجد فرق", "== يقارن القيم والنوع، === يقارن القيم فقط", "== يقارن القيم فقط، === يقارن القيم والنوع", "كلاهما يقارن القيم والنوع"],
                correct: 2
            },
            {
                question: "كيف يمكنك إنشاء دالة في JavaScript؟",
                options: ["function myFunc() {}", "var myFunc = function() {}", "let myFunc = () => {}", "جميع الإجابات صحيحة"],
                correct: 3
            },
            {
                question: "ما هو `NaN` في JavaScript؟",
                options: ["Not a Number", "Null and Number", "New Array Number", "Not Available Now"],
                correct: 0
            },
            {
                question: "كيف يمكنك إزالة العنصر الأخير من المصفوفة؟",
                options: ["push()", "pop()", "shift()", "unshift()"],
                correct: 1
            },
            {
                question: "ما هو `this` في JavaScript؟",
                options: ["يشير دائماً إلى الكائن الحالي", "يشير إلى النافذة", "يشير إلى السياق الذي يتم استدعاؤه منه", "لا يشير إلى شيء"],
                correct: 2
            },
            {
                question: "كيف يمكنك تحويل النص إلى رقم صحيح؟",
                options: ["parseInt()", "parseFloat()", "Number()", "جميع الإجابات صحيحة"],
                correct: 3
            },
            {
                question: "ما هو `closure` في JavaScript؟",
                options: ["دالة داخل دالة", "دالة لها حق الوصول إلى المتغيرات في النطاق الخارجي", "دالة بدون معاملات", "دالة تقوم بإرجاع قيمة"],
                correct: 1
            },
            {
                question: "كيف يمكنك التحقق من وجود خاصية في كائن؟",
                options: ["hasOwnProperty()", "in operator", "typeof", "جميع الإجابات صحيحة"],
                correct: 3
            },
            {
                question: "ما هو `event bubbling`؟",
                options: ["انتقال الحدث من العنصر الأب إلى العنصر الابن", "انتقال الحدث من العنصر الابن إلى العنصر الأب", "إيقاف الحدث", "إعادة توجيه الحدث"],
                correct: 1
            },
            {
                question: "كيف يمكنك إنشاء نسخة عميقة من كائن؟",
                options: ["Object.assign()", "JSON.parse(JSON.stringify())", "spread operator (...)", "جميع الإجابات صحيحة"],
                correct: 3
            },
            {
                question: "ما هو `hoisting` في JavaScript؟",
                options: ["رفع المتغيرات والدوال إلى أعلى النطاق", "إخفاء المتغيرات", "حذف المتغيرات", "إعادة تسمية المتغيرات"],
                correct: 0
            },
            {
                question: "كيف يمكنك إيقاف تنفيذ حلقة؟",
                options: ["break", "continue", "return", "جميع الإجابات صحيحة"],
                correct: 3
            },
            {
                question: "ما هو `Promise` في JavaScript؟",
                options: ["كائن يمثل عملية غير متزامنة", "دالة عادية", "متغير", "مصفوفة"],
                correct: 0
            }
        ];
        
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.quizStarted = false;
        this.quizEnded = false;
        this.timer = null;
        this.timeLeft = 900; // 15 minutes in seconds
        this.startTime = null;
        this.shuffledQuestions = [];
        
        this.initializeQuiz();
        this.bindEvents();
    }

    initializeQuiz() {
        this.shuffleQuestions();
        this.updateDisplay();
    }

    shuffleQuestions() {
        // Create a copy of questions and shuffle them
        this.shuffledQuestions = [...this.questions];
        for (let i = this.shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.shuffledQuestions[i], this.shuffledQuestions[j]] = 
            [this.shuffledQuestions[j], this.shuffledQuestions[i]];
        }
        // Take only first 10 questions
        this.shuffledQuestions = this.shuffledQuestions.slice(0, 10);
    }

    bindEvents() {
        document.getElementById('startQuizBtn').addEventListener('click', () => this.startQuiz());
        document.getElementById('prevBtn').addEventListener('click', () => this.previousQuestion());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextQuestion());
        document.getElementById('submitQuizBtn').addEventListener('click', () => this.submitQuiz());
    }

    startQuiz() {
        this.quizStarted = true;
        this.startTime = Date.now();
        this.startTimer();
        this.showQuestion();
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('questionScreen').style.display = 'block';
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            
            if (this.timeLeft <= 0) {
                this.endQuiz('انتهى الوقت!');
            }
        }, 1000);
    }

    showQuestion() {
        const question = this.shuffledQuestions[this.currentQuestionIndex];
        document.getElementById('questionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.dataset.index = index;
            
            // Check if user has already answered this question
            if (this.userAnswers[this.currentQuestionIndex] !== undefined) {
                if (index === this.userAnswers[this.currentQuestionIndex]) {
                    optionElement.classList.add('selected');
                }
                if (index === question.correct) {
                    optionElement.classList.add('correct');
                } else if (index === this.userAnswers[this.currentQuestionIndex] && 
                          this.userAnswers[this.currentQuestionIndex] !== question.correct) {
                    optionElement.classList.add('incorrect');
                }
            }
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        this.updateNavigationButtons();
    }

    selectOption(optionIndex) {
        if (this.quizEnded) return;
        
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        this.showQuestion(); // Refresh to show selection
        
        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (this.currentQuestionIndex < this.shuffledQuestions.length - 1) {
                this.nextQuestion();
            }
        }, 1000);
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.showQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.shuffledQuestions.length - 1) {
            this.currentQuestionIndex++;
            this.showQuestion();
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitQuizBtn');
        
        prevBtn.disabled = this.currentQuestionIndex === 0;
        nextBtn.disabled = this.currentQuestionIndex === this.shuffledQuestions.length - 1;
        
        // Show submit button on last question
        if (this.currentQuestionIndex === this.shuffledQuestions.length - 1) {
            submitBtn.style.display = 'inline-block';
            nextBtn.style.display = 'none';
        } else {
            submitBtn.style.display = 'none';
            nextBtn.style.display = 'inline-block';
        }
    }

    submitQuiz() {
        this.endQuiz('تم إنهاء الاختبار يدوياً');
    }

    endQuiz(message) {
        this.quizEnded = true;
        clearInterval(this.timer);
        
        this.calculateScore();
        this.showResults(message);
    }

    calculateScore() {
        this.score = 0;
        this.shuffledQuestions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct) {
                this.score += 10;
            }
        });
    }

    showResults(message) {
        const correctAnswers = this.score / 10;
        const percentage = Math.round((correctAnswers / this.shuffledQuestions.length) * 100);
        const timeUsed = this.calculateTimeUsed();
        
        document.getElementById('finalQuizScore').textContent = this.score;
        document.getElementById('correctAnswers').textContent = correctAnswers;
        document.getElementById('percentage').textContent = percentage + '%';
        document.getElementById('timeUsed').textContent = timeUsed;
        
        // Show grade info
        const gradeInfo = document.getElementById('gradeInfo');
        let gradeText = '';
        let gradeColor = '';
        
        if (percentage >= 90) {
            gradeText = 'ممتاز! 🏆';
            gradeColor = '#27ae60';
        } else if (percentage >= 80) {
            gradeText = 'جيد جداً! 🌟';
            gradeColor = '#3498db';
        } else if (percentage >= 70) {
            gradeText = 'جيد! 👍';
            gradeColor = '#f39c12';
        } else if (percentage >= 60) {
            gradeText = 'مقبول! ✅';
            gradeColor = '#e67e22';
        } else {
            gradeText = 'يحتاج تحسين! 📚';
            gradeColor = '#e74c3c';
        }
        
        gradeInfo.textContent = gradeText;
        gradeInfo.style.background = `linear-gradient(45deg, ${gradeColor}, ${gradeColor}dd)`;
        
        document.getElementById('quizResultsModal').style.display = 'flex';
    }

    calculateTimeUsed() {
        if (!this.startTime) return '0:00';
        
        const timeUsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(timeUsed / 60);
        const seconds = timeUsed % 60;
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        // Update timer
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('quizTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress
        document.getElementById('progress').textContent = 
            `${this.currentQuestionIndex + 1} / ${this.shuffledQuestions.length}`;
        
        // Update score
        document.getElementById('quizScore').textContent = this.score;
    }
}

// Tab Navigation
class TabNavigation {
    constructor() {
        this.currentTab = 'game';
        this.memoryGame = null;
        this.quiz = null;
        this.initializeTabs();
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Initialize the default tab
        this.switchTab('game');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Section`).classList.add('active');

        this.currentTab = tabName;

        // Initialize the appropriate game/quiz
        if (tabName === 'game' && !this.memoryGame) {
            this.memoryGame = new MemoryGame();
        } else if (tabName === 'quiz' && !this.quiz) {
            this.quiz = new JavaScriptQuiz();
        }
    }
}

// Global functions for modals
function closeGameScoreModal() {
    document.getElementById('gameScoreModal').style.display = 'none';
}

function closeQuizResults() {
    document.getElementById('quizResultsModal').style.display = 'none';
}

function closeQuizAnswers() {
    document.getElementById('quizAnswersModal').style.display = 'none';
}

function showAnswers() {
    const answersList = document.getElementById('answersList');
    answersList.innerHTML = '';
    
    tabNavigation.quiz.shuffledQuestions.forEach((question, index) => {
        const answerItem = document.createElement('div');
        answerItem.className = 'answer-item';
        
        const userAnswer = tabNavigation.quiz.userAnswers[index] !== undefined ? 
            question.options[tabNavigation.quiz.userAnswers[index]] : 'لم يتم الإجابة';
        const correctAnswer = question.options[question.correct];
        const isCorrect = tabNavigation.quiz.userAnswers[index] === question.correct;
        
        answerItem.innerHTML = `
            <div class="answer-question">${question.question}</div>
            <div class="answer-user">إجابتك: ${userAnswer}</div>
            <div class="answer-correct">الإجابة الصحيحة: ${correctAnswer}</div>
            <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? 'صحيح ✓' : 'خاطئ ✗'}
            </div>
        `;
        
        answersList.appendChild(answerItem);
    });
    
    document.getElementById('quizResultsModal').style.display = 'none';
    document.getElementById('quizAnswersModal').style.display = 'flex';
}

function restartQuiz() {
    if (tabNavigation.quiz) {
        tabNavigation.quiz = new JavaScriptQuiz();
    }
}

// Initialize the application
let tabNavigation;
document.addEventListener('DOMContentLoaded', () => {
    tabNavigation = new TabNavigation();
});
