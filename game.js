const player = document.getElementById("player");

const scoreText = document.getElementById("score");
const coinsText = document.getElementById("coins");
const livesText = document.getElementById("lives");

const gameOverScreen = document.getElementById("gameOver");

const finalScore = document.getElementById("finalScore");
const finalCoins = document.getElementById("finalCoins");


// ======================================
// VARIÁVEIS
// ======================================

let gameRunning = true;

let jumping = false;

let score = 0;

let coins = 0;

let lives = 3;

let speed = 6;


// ======================================
// PULO
// ======================================

document.addEventListener("keydown", function(event) {

    if (event.code === "Space") {

        event.preventDefault();

        jump();

    }

});


document.addEventListener("click", function() {

    jump();

});


function jump() {

    if (jumping || !gameRunning) {
        return;
    }

    jumping = true;

    let height = 0;

    let direction = 1;


    const jumpInterval = setInterval(() => {

        height += 10 * direction;

        player.style.bottom =
            (100 + height) + "px";


        // chegou no ponto mais alto

        if (height >= 170) {

            direction = -1;

        }


        // voltou para o chão

        if (height <= 0) {

            clearInterval(jumpInterval);

            player.style.bottom = "100px";

            jumping = false;

        }

    }, 20);

}


// ======================================
// OBSTÁCULOS
// ======================================

function createObstacle() {

    if (!gameRunning) {
        return;
    }


    const obstacle =
        document.createElement("div");


    obstacle.classList.add("obstacle");


    // Tipos de obstáculos

    const types = [
        "rock",
        "box",
        "cactus"
    ];


    const randomType =
        types[
            Math.floor(
                Math.random() * types.length
            )
        ];


    obstacle.classList.add(randomType);


    // começa fora da tela

    obstacle.style.right = "-100px";


    document
        .getElementById("game")
        .appendChild(obstacle);


    let position = -100;


    const movement =
        setInterval(() => {

            if (!gameRunning) {

                clearInterval(movement);

                return;

            }


            // movimento do mundo

            position += speed;


            obstacle.style.right =
                position + "px";


            checkCollision(obstacle);


            // saiu da tela

            if (
                position >
                window.innerWidth + 100
            ) {

                clearInterval(movement);

                obstacle.remove();

            }

        }, 20);

}


// ======================================
// MOEDAS
// ======================================

function createCoin() {

    if (!gameRunning) {
        return;
    }


    const coin =
        document.createElement("div");


    coin.classList.add("coin");


    coin.style.right = "-50px";


    document
        .getElementById("game")
        .appendChild(coin);


    let position = -50;


    const movement =
        setInterval(() => {

            if (!gameRunning) {

                clearInterval(movement);

                return;

            }


            position += speed;


            coin.style.right =
                position + "px";


            checkCoinCollision(coin);


            if (
                position >
                window.innerWidth + 100
            ) {

                clearInterval(movement);

                coin.remove();

            }

        }, 20);

}


// ======================================
// COLISÃO
// ======================================

function checkCollision(obstacle) {

    const playerRect =
        player.getBoundingClientRect();


    const obstacleRect =
        obstacle.getBoundingClientRect();


    if (

        playerRect.left <
        obstacleRect.right &&

        playerRect.right >
        obstacleRect.left &&

        playerRect.top <
        obstacleRect.bottom &&

        playerRect.bottom >
        obstacleRect.top

    ) {

        obstacle.remove();

        loseLife();

    }

}


// ======================================
// COLISÃO COM MOEDA
// ======================================

function checkCoinCollision(coin) {

    const playerRect =
        player.getBoundingClientRect();


    const coinRect =
        coin.getBoundingClientRect();


    if (

        playerRect.left <
        coinRect.right &&

        playerRect.right >
        coinRect.left &&

        playerRect.top <
        coinRect.bottom &&

        playerRect.bottom >
        coinRect.top

    ) {

        coins++;


        coinsText.textContent =
            "🪙 " + coins;


        coin.remove();

    }

}


// ======================================
// PERDER VIDA
// ======================================

function loseLife() {

    lives--;


    updateLives();


    // efeito de dano

    player.style.opacity = "0.3";


    setTimeout(() => {

        player.style.opacity = "1";

    }, 300);


    if (lives <= 0) {

        gameOver();

    }

}


// ======================================
// VIDAS
// ======================================

function updateLives() {

    livesText.textContent =
        "❤️".repeat(lives);

}


// ======================================
// GAME OVER
// ======================================

function gameOver() {

    gameRunning = false;


    finalScore.textContent =
        score;


    finalCoins.textContent =
        coins;


    gameOverScreen.style.display =
        "flex";
    // Se um jogador foi selecionado via CRUD, atualiza seus pontos para que
    // a página de cadastro/CRUD possa persistir a mudança.
    try {
        const jogadorAtual = JSON.parse(localStorage.getItem("jogadorAtual"));
        if (jogadorAtual) {
            jogadorAtual.pontos = score;
            jogadorAtual.nivel = jogadorAtual.nivel || 1;
            localStorage.setItem("jogadorAtual", JSON.stringify(jogadorAtual));
        }
    } catch (e) {
        // ignore
    }
}


// ======================================
// REINICIAR
// ======================================

function restartGame() {

    location.reload();

}


// ======================================
// PONTUAÇÃO
// ======================================

setInterval(() => {

    if (!gameRunning) {
        return;
    }


    score++;


    scoreText.textContent =
        "🏆 Pontos: " + score;


    // aumenta a velocidade

    if (score % 100 === 0) {

        speed += 1;

    }

}, 100);


// ======================================
// GERAR OBSTÁCULOS
// ======================================

function obstacleLoop() {

    if (!gameRunning) {
        return;
    }


    createObstacle();


    const time =
        Math.random() * 1300 + 900;


    setTimeout(
        obstacleLoop,
        time
    );

}


// ======================================
// GERAR MOEDAS
// ======================================

function coinLoop() {

    if (!gameRunning) {
        return;
    }


    createCoin();


    const time =
        Math.random() * 1800 + 1200;


    setTimeout(
        coinLoop,
        time
    );

}


// ======================================
// LINHAS DE VELOCIDADE
// ======================================

function createSpeedLine() {

    if (!gameRunning) {
        return;
    }


    const line =
        document.createElement("div");


    line.classList.add("speedLine");


    // posição vertical aleatória

    line.style.top =
        Math.random() * 60 + 20 + "%";


    document
        .getElementById("game")
        .appendChild(line);


    setTimeout(() => {

        line.remove();

    }, 1000);

}


// ======================================
// LOOP DAS LINHAS
// ======================================

setInterval(() => {

    if (gameRunning) {

        createSpeedLine();

    }

}, 500);


// ======================================
// INICIAR
// ======================================

obstacleLoop();

coinLoop();

