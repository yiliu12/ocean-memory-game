// Ocean Memory Game JavaScript

class OceanMemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 8;
        this.gameMode = 'single'; // 'single' or 'two'
        this.currentPlayer = 1;
        this.player1Score = 0;
        this.player2Score = 0;
        this.gameStarted = false;
        this.timer = null;
        this.startTime = null;
        this.isGameActive = false;
        
        // Ocean-themed emojis for cards
        this.oceanEmojis = ['🐠', '🐟', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐚', '🌊', '🏝️', '⚓', '🚢', '🐋', '🐬'];
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Game mode selection
        document.getElementById('singlePlayerBtn').addEventListener('click', () => {
            this.selectGameMode('single');
        });
        
        document.getElementById('twoPlayerBtn').addEventListener('click', () => {
            this.selectGameMode('two');
        });

        // Game setup
        document.getElementById('startGameBtn').addEventListener('click', () => {
            this.startGame();
        });

        document.getElementById('backToModeBtn').addEventListener('click', () => {
            this.showGameModeSelection();
        });

        // Game controls
        document.getElementById('newGameBtn').addEventListener('click', () => {
            this.newGame();
        });

        document.getElementById('resetGameBtn').addEventListener('click', () => {
            this.resetScores();
        });

        document.getElementById('backToMenuBtn').addEventListener('click', () => {
            this.backToMenu();
        });

        // Modal buttons
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideGameOverModal();
            this.newGame();
        });

        document.getElementById('newGameModalBtn').addEventListener('click', () => {
            this.hideGameOverModal();
            this.resetScores();
            this.newGame();
        });

        document.getElementById('backToMenuModalBtn').addEventListener('click', () => {
            this.hideGameOverModal();
            this.backToMenu();
        });

        // Player name inputs
        document.getElementById('player1Name').addEventListener('input', (e) => {
            document.getElementById('player1NameDisplay').textContent = e.target.value || 'Player 1';
        });

        document.getElementById('player2Name').addEventListener('input', (e) => {
            document.getElementById('player2NameDisplay').textContent = e.target.value || 'Player 2';
        });
    }

    selectGameMode(mode) {
        this.gameMode = mode;
        this.showGameSetup();
    }

    showGameModeSelection() {
        document.getElementById('gameModeSelection').classList.remove('hidden');
        document.getElementById('gameSetup').classList.add('hidden');
        document.getElementById('gameBoard').classList.add('hidden');
        this.stopTimer();
    }

    showGameSetup() {
        document.getElementById('gameModeSelection').classList.add('hidden');
        document.getElementById('gameSetup').classList.remove('hidden');
        document.getElementById('gameBoard').classList.add('hidden');
        
        const player2Input = document.getElementById('player2Input');
        if (this.gameMode === 'single') {
            player2Input.style.display = 'none';
            document.getElementById('setupTitle').textContent = 'Single Player Setup';
        } else {
            player2Input.style.display = 'flex';
            document.getElementById('setupTitle').textContent = 'Two Player Setup';
        }
    }

    startGame() {
        this.gameStarted = true;
        this.isGameActive = true;
        this.matchedPairs = 0;
        this.currentPlayer = 1;
        this.flippedCards = [];
        
        document.getElementById('gameSetup').classList.add('hidden');
        document.getElementById('gameBoard').classList.remove('hidden');
        
        this.createCards();
        this.updateDisplay();
        this.startTimer();
    }

    createCards() {
        const cardsGrid = document.getElementById('cardsGrid');
        cardsGrid.innerHTML = '';
        
        // Select 8 random ocean emojis for 16 cards (8 pairs)
        const selectedEmojis = this.oceanEmojis.slice(0, this.totalPairs);
        this.cards = [];
        
        // Create pairs of cards
        selectedEmojis.forEach(emoji => {
            this.cards.push({ emoji, isFlipped: false, isMatched: false, id: this.cards.length });
            this.cards.push({ emoji, isFlipped: false, isMatched: false, id: this.cards.length });
        });
        
        // Shuffle cards
        this.shuffleCards();
        
        // Create card elements
        this.cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.dataset.index = index;
            cardElement.addEventListener('click', () => this.flipCard(index));
            cardsGrid.appendChild(cardElement);
        });
    }

    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    flipCard(index) {
        if (!this.isGameActive || this.cards[index].isFlipped || this.cards[index].isMatched) {
            return;
        }

        const card = this.cards[index];
        card.isFlipped = true;
        this.flippedCards.push(index);
        
        this.updateCardDisplay(index);
        
        if (this.flippedCards.length === 2) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const [index1, index2] = this.flippedCards;
        const card1 = this.cards[index1];
        const card2 = this.cards[index2];
        
        if (card1.emoji === card2.emoji) {
            // Match found
            card1.isMatched = true;
            card2.isMatched = true;
            this.matchedPairs++;
            
            // Update scores
            if (this.gameMode === 'single') {
                this.player1Score++;
            } else {
                if (this.currentPlayer === 1) {
                    this.player1Score++;
                } else {
                    this.player2Score++;
                }
            }
            
            this.updateDisplay();
            
            // Check if game is complete
            if (this.matchedPairs === this.totalPairs) {
                setTimeout(() => {
                    this.endGame();
                }, 500);
            } else {
                // Keep current player's turn
                setTimeout(() => {
                    this.flippedCards = [];
                }, 1000);
            }
        } else {
            // No match
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;
                this.updateCardDisplay(index1);
                this.updateCardDisplay(index2);
                this.flippedCards = [];
                
                // Switch players in two-player mode
                if (this.gameMode === 'two') {
                    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
                    this.updateDisplay();
                }
            }, 1000);
        }
    }

    updateCardDisplay(index) {
        const cardElements = document.querySelectorAll('.card');
        const card = this.cards[index];
        const cardElement = cardElements[index];
        
        if (card.isMatched) {
            cardElement.classList.add('flipped', 'matched');
            cardElement.textContent = card.emoji;
        } else if (card.isFlipped) {
            cardElement.classList.add('flipped');
            cardElement.textContent = card.emoji;
        } else {
            cardElement.classList.remove('flipped', 'matched');
            cardElement.textContent = '';
        }
    }

    updateDisplay() {
        // Update player names
        document.getElementById('player1NameDisplay').textContent = 
            document.getElementById('player1Name').value || 'Player 1';
        document.getElementById('player2NameDisplay').textContent = 
            document.getElementById('player2Name').value || 'Player 2';
        
        // Update scores
        document.getElementById('player1ScoreValue').textContent = this.player1Score;
        document.getElementById('player2ScoreValue').textContent = this.player2Score;
        
        // Update current player display
        if (this.gameMode === 'single') {
            document.getElementById('currentPlayerDisplay').textContent = 'Single Player Mode';
        } else {
            const currentPlayerName = this.currentPlayer === 1 ? 
                (document.getElementById('player1Name').value || 'Player 1') :
                (document.getElementById('player2Name').value || 'Player 2');
            document.getElementById('currentPlayerDisplay').textContent = `Current Player: ${currentPlayerName}`;
        }
    }

    startTimer() {
        this.startTime = Date.now();
        this.timer = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        document.getElementById('timerDisplay').textContent = 
            `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    endGame() {
        this.isGameActive = false;
        this.stopTimer();
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        let resultsHTML = '';
        
        if (this.gameMode === 'single') {
            resultsHTML = `
                <p><strong>Congratulations!</strong></p>
                <p>You completed the game in <strong>${timeString}</strong></p>
                <p>Total pairs found: <strong>${this.matchedPairs}</strong></p>
            `;
        } else {
            const player1Name = document.getElementById('player1Name').value || 'Player 1';
            const player2Name = document.getElementById('player2Name').value || 'Player 2';
            
            let winner = '';
            if (this.player1Score > this.player2Score) {
                winner = player1Name;
            } else if (this.player2Score > this.player1Score) {
                winner = player2Name;
            } else {
                winner = 'It\'s a tie!';
            }
            
            resultsHTML = `
                <p><strong>Game Complete!</strong></p>
                <p>Time: <strong>${timeString}</strong></p>
                <p>${player1Name}: <strong>${this.player1Score}</strong> pairs</p>
                <p>${player2Name}: <strong>${this.player2Score}</strong> pairs</p>
                <p><strong>Winner: ${winner}</strong></p>
            `;
        }
        
        document.getElementById('gameOverResults').innerHTML = resultsHTML;
        document.getElementById('gameOverModal').classList.remove('hidden');
    }

    hideGameOverModal() {
        document.getElementById('gameOverModal').classList.add('hidden');
    }

    newGame() {
        this.matchedPairs = 0;
        this.currentPlayer = 1;
        this.flippedCards = [];
        this.isGameActive = true;
        
        this.createCards();
        this.updateDisplay();
        this.startTimer();
    }

    resetScores() {
        this.player1Score = 0;
        this.player2Score = 0;
        this.updateDisplay();
    }

    backToMenu() {
        this.stopTimer();
        this.showGameModeSelection();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new OceanMemoryGame();
}); 