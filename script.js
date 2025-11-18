window.onload = function() {
    const startScreen = document.getElementById("start-screen");
    const startButton = document.getElementById("start-button");
    const canvas = document.getElementById("gameCanvas");
    const c = canvas.getContext("2d");

    let gameDuration = 90;
    let timerInterval;
    let hitSound = new Audio("shoot.mp3");
    let gameEndSound = new Audio("win.mp3");
    let winScore = 25;
    let score = 0;
    let gameOver = false;
    let playerX, playerY;
    let playerSpeed = 3.5;
    let moveLeft = false, moveRight = false;
    let bullets = [];
    let bullet_speed = 5;
    let enemies = [];
    let enemy_speed = 1;
    let playerImg = new Image();
    playerImg.src = "https://image.ibb.co/dfbD1U/heroShip.png";

    function startGame() {
        startScreen.style.display = "none";
        canvas.style.display = "block";
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        playerX = innerWidth / 2;
        playerY = innerHeight - 50;
        startTimer();
        animate();
    }

    function showMessage(emoji, text) {
        c.fillStyle = "white";
        c.font = "50px Arial";
        c.textAlign = "center";
        c.fillText(`${emoji} ${text} ${emoji}`, innerWidth / 2, innerHeight / 2);
    }

    function endGame() {
        if (gameOver) return;
        clearInterval(timerInterval);
        gameOver = true;
        gameEndSound.play();
        c.fillStyle = "black";
        c.fillRect(0, 0, innerWidth, innerHeight);
        score >= winScore ? showMessage("🎉", "You Win!") : showMessage("😢", "You Lose!");
        setTimeout(() => location.reload(), 3000);
    }

    function Bullet(x, y) {
        this.x = x;
        this.y = y;
        this.speed = bullet_speed;
        this.draw = function() {
            c.fillStyle = "white";
            c.fillRect(this.x, this.y, 6, 8);
        };
        this.update = function() {
            this.y -= this.speed;
            this.draw();
        };
    }

    function Enemy(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = enemy_speed;
        this.draw = function() {
            c.fillStyle = "red";
            c.fillRect(this.x, this.y, this.width, this.height);
        };
        this.update = function() {
            this.y += this.speed;
            this.draw();
        };
    }

    function fire() {
        bullets.push(new Bullet(playerX - 3, playerY - 32));
    }

    function movePlayer() {
        if (moveLeft && playerX > 0) playerX -= playerSpeed;
        if (moveRight && playerX < innerWidth) playerX += playerSpeed;
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowLeft") moveLeft = true;
        if (event.key === "ArrowRight") moveRight = true;
        if (event.key === "ArrowUp") fire();
    });

    document.addEventListener("keyup", function(event) {
        if (event.key === "ArrowLeft") moveLeft = false;
        if (event.key === "ArrowRight") moveRight = false;
    });

    function drawEnemies() {
        if (!gameOver) {
            for (let i = 0; i < 3; i++) {
                enemies.push(new Enemy(Math.random() * (innerWidth - 32), -32));
            }
        }
    }
    setInterval(drawEnemies, 1200);

    function collision(bullet, enemy) {
        return bullet.x < enemy.x + enemy.width && bullet.x + 6 > enemy.x && bullet.y < enemy.y + enemy.height && bullet.y + 8 > enemy.y;
    }

    function animate() {
        if (gameOver) return;
        requestAnimationFrame(animate);
        c.clearRect(0, 0, innerWidth, innerHeight);
        c.fillStyle = 'white';
        c.fillText("Score: " + score + "/" + winScore + "+", innerWidth - 200, 20);
        c.fillText("Time: " + gameDuration, innerWidth / 2 - 30, 20);
        movePlayer();
        c.drawImage(playerImg, playerX - 32, playerY - 32);
        bullets.forEach((bullet, i) => { bullet.update(); if (bullet.y < 0) bullets.splice(i, 1); });
        enemies.forEach((enemy, j) => { enemy.update(); if (enemy.y > innerHeight) enemies.splice(j, 1); });
        for (let j = enemies.length - 1; j >= 0; j--) {
            for (let i = bullets.length - 1; i >= 0; i--) {
                if (collision(bullets[i], enemies[j])) {
                    enemies.splice(j, 1);
                    bullets.splice(i, 1);
                    score++;
                    hitSound.currentTime = 0;
                    hitSound.play();
                    break;
                }
            }
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            gameDuration--;
            if (gameDuration <= 0) endGame();
        }, 1000);
    }

    startButton.addEventListener("click", startGame);
};
