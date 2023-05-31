
const gameCanvas = document.getElementById("gameView");
const canvasContext = gameCanvas.getContext('2d');
const playerMsg = document.getElementById("playerMsg");
const gameState = document.getElementById("gameState");
const minScore = document.getElementById("minScore");
const secScore = document.getElementById("secScore");
let secTimer = 0;
let minTimer = 0;
let timerIntervalID, startGameIntervalID;

let enableDisableArrowKey;

const batHeight = 100;
let batPosition = gameCanvas.height/2 - batHeight/2;
let batSpeed = 50;
let ballSpeedX = 50;
let ballSpeedY = 50;
let ballX = gameCanvas.width/2;
let ballY = gameCanvas.height/2;
let ballRadius = 10;

window.onload = function() {
    window.addEventListener("keydown", (evt) => {
        if (evt.key === "ArrowDown"){
            enableDisableArrowKey && moveBat(true);
        } else if (evt.key === "ArrowUp") {
            enableDisableArrowKey && moveBat(false);
        } else if (evt.key === " ") {
            console.log("Space Clicked!!");
            startGame();
        }
    });
    drawBatAndBall();
    updateScore();
}

/*
* Starts the game on spacebar click
*/
function startGame() {
    enableDisableArrowKey = true;
    gameState.innerText = "GAME STARTED!!";
    secTimer = 0;
    minTimer = 0;
    updateScore();
    playerMsg.hidden = true;
    timerIntervalID = setInterval(() => {
        secTimer += 1;
        updateScore();
    }, 1000);
    startGameIntervalID = setInterval(() => {
        moveBall();
        drawBatAndBall();
    }, 100);
}

/*
* Updates user score
*/
function updateScore() {
    if (secTimer === 60) {
        minTimer++;
        secTimer = 0;
    } 
    minScore.innerText = minTimer < 10 ? 0 + minTimer : minTimer;
    secScore.innerText = secTimer < 10 ? 0 + secTimer : secTimer;
}

function drawBatAndBall() {
    console.log("Bat Position : ", batPosition);
    canvasContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    canvasContext.beginPath();
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

    canvasContext.beginPath();
    canvasContext.fillStyle = 'purple';
    canvasContext.fillRect(0, batPosition, 10, batHeight);

    canvasContext.beginPath();
    canvasContext.fillStyle = 'red';
    canvasContext.arc(ballX, ballY, ballRadius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

/*
* Updates the bat position by batSpeed on user interaction
*/
function moveBat(isDown) {
    if (isDown && batPosition < gameCanvas.height - batHeight) {
        batPosition += batSpeed;
    } else if (!isDown && batPosition !== 0) {
        batPosition -= batSpeed;
    }
}

/*
* Updates the ball position by ballSpeed
*/
function moveBall() {
    // handling speed of ball in Y-axis
    if (ballY + ballSpeedY <= 0) {
        ballY = ballRadius;
    } else if (ballY + ballSpeedY > gameCanvas.height - ballRadius) {
        ballY = gameCanvas.height - ballRadius
    } else {
        ballY += ballSpeedY;
    }
    if (ballY >= gameCanvas.height - ballRadius || ballY <= ballRadius) {
        ballSpeedY = -ballSpeedY;
    }

    // handling speed of ball in X-axis
    if (ballX + ballSpeedX <= 0) {
        ballX = ballRadius;
        // check for ball hit
        checkBallHit();
    } else if (ballX + ballSpeedX > gameCanvas.width - ballRadius) {
        ballX = gameCanvas.width - ballRadius
    } else {
        ballX += ballSpeedX;
    }
    if (ballX >= gameCanvas.width - ballRadius || ballX <= ballRadius) {
        ballSpeedX = -ballSpeedX;
    }
}

/*
* Checks if ball hit the bat or not
*/
function checkBallHit() {
    if (ballY >= batPosition && ballY <= batPosition + batHeight) {
        console.log("Ball hit");
    } else {
        // End of the game code here
        console.log("Ball missed", ballY, batPosition);
        enableDisableArrowKey = false;
        gameState.innerText = "GAME END!!";
        playerMsg.hidden = false;
        clearInterval(timerIntervalID);
        clearInterval(startGameIntervalID);
    }
}
