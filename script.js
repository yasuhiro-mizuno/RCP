class RockPaperScissorsGame {
    constructor() {
        this.choices = ['rock', 'paper', 'scissors'];
        this.choiceNames = {
            rock: 'グー',
            paper: 'パー',
            scissors: 'チョキ'
        };
        this.choiceImages = {
            rock: 'images/rock.png',
            paper: 'images/paper.png',
            scissors: 'images/scissors.png'
        };
        
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.loadScore();
    }
    
    initializeElements() {
        this.choiceBtns = document.querySelectorAll('.choice-btn');
        this.computerImg = document.getElementById('computer-img');
        this.computerText = document.getElementById('computer-text');
        this.resultDiv = document.getElementById('result');
        this.winsSpan = document.getElementById('wins');
        this.lossesSpan = document.getElementById('losses');
        this.drawsSpan = document.getElementById('draws');
        this.resetBtn = document.getElementById('reset-btn');
        this.confettiContainer = document.getElementById('confetti-container');
    }
    
    bindEvents() {
        this.choiceBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const choice = e.currentTarget.dataset.choice;
                this.playGame(choice);
            });
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.resetScore();
        });
    }
    
    playGame(playerChoice) {
        // プレイヤーの選択をハイライト
        this.highlightPlayerChoice(playerChoice);
        
        // コンピューターの選択をアニメーション付きで表示
        this.animateComputerChoice(() => {
            const computerChoice = this.getComputerChoice();
            this.showComputerChoice(computerChoice);
            
            // 結果を判定して表示
            const result = this.determineWinner(playerChoice, computerChoice);
            this.showResult(result);
            this.updateScore(result);
            
            // 勝利時にクラッカーを表示
            if (result === 'win') {
                this.showConfetti();
            }
        });
    }
    
    highlightPlayerChoice(choice) {
        this.choiceBtns.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const selectedBtn = document.querySelector(`[data-choice="${choice}"]`);
        selectedBtn.classList.add('selected');
        
        // 3秒後にハイライトを解除
        setTimeout(() => {
            selectedBtn.classList.remove('selected');
        }, 3000);
    }
    
    animateComputerChoice(callback) {
        let animationCount = 0;
        const maxAnimations = 10;
        
        const animate = () => {
            if (animationCount < maxAnimations) {
                const randomChoice = this.choices[Math.floor(Math.random() * this.choices.length)];
                this.computerImg.src = this.choiceImages[randomChoice];
                this.computerText.textContent = this.choiceNames[randomChoice];
                animationCount++;
                setTimeout(animate, 100);
            } else {
                callback();
            }
        };
        
        animate();
    }
    
    getComputerChoice() {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }
    
    showComputerChoice(choice) {
        this.computerImg.src = this.choiceImages[choice];
        this.computerText.textContent = this.choiceNames[choice];
    }
    
    determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) {
            return 'draw';
        }
        
        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };
        
        return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }
    
    showResult(result) {
        this.resultDiv.className = `result ${result}`;
        
        const messages = {
            win: '🎉 あなたの勝ち！',
            lose: '😢 あなたの負け...',
            draw: '🤝 引き分け'
        };
        
        this.resultDiv.textContent = messages[result];
    }
    
    updateScore(result) {
        switch (result) {
            case 'win':
                this.wins++;
                break;
            case 'lose':
                this.losses++;
                break;
            case 'draw':
                this.draws++;
                break;
        }
        
        this.displayScore();
        this.saveScore();
    }
    
    displayScore() {
        this.winsSpan.textContent = this.wins;
        this.lossesSpan.textContent = this.losses;
        this.drawsSpan.textContent = this.draws;
    }
    
    resetScore() {
        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.displayScore();
        this.saveScore();
        
        // 結果表示をクリア
        this.resultDiv.textContent = '';
        this.resultDiv.className = 'result';
        
        // コンピューターの選択をリセット
        this.computerImg.src = 'images/question.png';
        this.computerText.textContent = '？';
        
        // プレイヤーの選択ハイライトを解除
        this.choiceBtns.forEach(btn => {
            btn.classList.remove('selected');
        });
    }
    
    saveScore() {
        const scoreData = {
            wins: this.wins,
            losses: this.losses,
            draws: this.draws
        };
        localStorage.setItem('rpsScore', JSON.stringify(scoreData));
    }
    
    loadScore() {
        const savedScore = localStorage.getItem('rpsScore');
        if (savedScore) {
            const scoreData = JSON.parse(savedScore);
            this.wins = scoreData.wins || 0;
            this.losses = scoreData.losses || 0;
            this.draws = scoreData.draws || 0;
            this.displayScore();
        }
    }
    
    showConfetti() {
        // 既存のクラッカーをクリア
        this.confettiContainer.innerHTML = '';
        
        // クラッカーを生成
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            this.confettiContainer.appendChild(confetti);
        }
        
        // 5秒後にクラッカーを削除
        setTimeout(() => {
            this.confettiContainer.innerHTML = '';
        }, 5000);
    }
}

// ゲームを初期化
document.addEventListener('DOMContentLoaded', () => {
    new RockPaperScissorsGame();
});