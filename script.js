// script.js
document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start-button');
    const resetButton = document.getElementById('reset-button');
    const scoreList = document.getElementById('score-list');
    const usernameInput = document.getElementById('username');

    let score = 0;
    let timer;
    let gameRunning = false;
    let appleInterval;
    let redPointInterval;
    let fallSpeed = 2; // Velocidade inicial da queda

    function startGame() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Por favor, insira um nome de usuário.');
            return;
        }

        if (gameRunning) return;
        gameRunning = true;
        score = 0;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = 60; // Tempo total de 1 minuto

        timer = setInterval(() => {
            let timeLeft = parseInt(timerDisplay.textContent, 10);
            if (timeLeft <= 1) {
                clearInterval(timer);
                gameRunning = false;
                clearInterval(appleInterval);
                clearInterval(redPointInterval);
                alert('Tempo esgotado! Sua pontuação final é ' + score);
                saveScore();
                return;
            }
            timerDisplay.textContent = timeLeft - 1;
            
            // Aumenta a velocidade de queda com base no tempo restante
            fallSpeed = 2 + (60 - timeLeft) / 10; // Aumenta a velocidade gradualmente
        }, 1000);

        startFallingApples();
        startFallingRedPoints();
    }

    function resetGame() {
        if (timer) clearInterval(timer);
        if (appleInterval) clearInterval(appleInterval);
        if (redPointInterval) clearInterval(redPointInterval);
        gameRunning = false;
        score = 0;
        scoreDisplay.textContent = score;
        timerDisplay.textContent = 60; // Tempo total de 1 minuto
        fallSpeed = 2; // Resetar a velocidade para o valor inicial
        gameArea.innerHTML = '';
    }

    function startFallingApples() {
        appleInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) { // Cria 3 maçãs uma após a outra
                createFallingItem('apple', 1);
            }
        }, 1000); // Gera 3 maçãs a cada 0.5 segundos
    }

    function startFallingRedPoints() {
        redPointInterval = setInterval(() => {
            createFallingItem('red-point', -1);
        }, 500); // Cria um ponto vermelho a cada 1 segundo
    }

    function createFallingItem(type, pointChange) {
        let item = document.createElement('div');
        item.classList.add(type);
        item.style.top = '0px';
        item.style.left = `${Math.random() * (gameArea.clientWidth - 30)}px`; // Subtrai a largura do item para não sair da área

        item.addEventListener('click', () => {
            score += pointChange;
            scoreDisplay.textContent = score;
            gameArea.removeChild(item);
        });

        gameArea.appendChild(item);
        animateFalling(item);
    }

    function animateFalling(item) {
        let topPosition = 0;

        function fall() {
            if (!gameRunning) return;
            topPosition += fallSpeed;
            item.style.top = `${topPosition}px`;

            if (topPosition > gameArea.clientHeight) { // Quando o item sair da área do jogo
                gameArea.removeChild(item);
            } else {
                requestAnimationFrame(fall);
            }
        }
        fall();
    }

    function saveScore() {
        const username = usernameInput.value.trim();
        if (!username) return; // Não salva a pontuação se o nome não estiver presente
        let scores = JSON.parse(localStorage.getItem('scores')) || [];
        scores.push({ username, score });
        localStorage.setItem('scores', JSON.stringify(scores));
        displayScores();
    }

    function displayScores() {
        // Obtém a lista de pontuações do localStorage ou inicializa uma lista vazia
        const scores = JSON.parse(localStorage.getItem('scores')) || [];
    
        // Ordena as pontuações pela menor pontuação
        scores.sort((a, b) => a.score - b.score);
    
        // Limpa a lista existente de pontuações exibidas
        scoreList.innerHTML = '';
    
        // Adiciona cada pontuação à lista de exibição
        scores.forEach(entry => {
            let li = document.createElement('li');
            li.textContent = `${entry.username}: ${entry.score} pontos`;
            scoreList.appendChild(li);
        });
    }
    

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);

    // Display previous scores on load
    displayScores();
});
