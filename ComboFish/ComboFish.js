const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 480;

// Game assets
const assets = {
    backgroundTop: './assets/backgroundFisherman2.png',
    backgroundBottom: './assets/backgroundFisherman1.png',
    rod: './assets/rodHook.png',
    fish: './assets/fish.png',
    fish2: './assets/fish2.png',
    two: './assets/2.png',
    three: './assets/3.png',
    four: './assets/4.png',
    five: './assets/5.png',
    combo: './assets/Combo.png',
    x: './assets/X.png',
};

const images = {};

function showGameCanvas() {
    document.getElementById('gameCanvas').classList.add('active');
    document.getElementById('endScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('tutorialScreen').classList.remove('active');
}

function showEndScreen() {
    document.getElementById('gameCanvas').classList.remove('active');
    document.getElementById('endScreen').classList.add('active');
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('tutorialScreen').classList.remove('active');
}

function showHomeScreen() {
    document.getElementById('gameCanvas').classList.remove('active');
    document.getElementById('endScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.add('active');
    document.getElementById('tutorialScreen').classList.remove('active');
}

function showTutorialScreen() {
    document.getElementById('gameCanvas').classList.remove('active');
    document.getElementById('endScreen').classList.remove('active');
    document.getElementById('homeScreen').classList.remove('active');
    document.getElementById('tutorialScreen').classList.add('active');
}

// Game state
let gameRunning = false;
let rodX = 10, rodY = -380;
let fishes = [];
let score = 0;
let combo = 1;
let comboCount = 0;
let startTime = Date.now();
let spacePressed = false;
let comboOn = false;
let timerInterval;

// Function to get remaining time
function getRemainingTime() {
    const currentTime = Date.now();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // Time in seconds
    if(elapsedTime >= 60) {
        endGame();
        return 0;
    }
    return 60 - elapsedTime;
}

// Draw clock on screen
function drawClock() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    const remainingTime = getRemainingTime();
    ctx.fillText(`Time: ${remainingTime}s`, 10, 30);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 50); // Position below the clock
}

function spawnFish() {
    console.log('Spawning fish...');
    // Randomize position and direction
    const direction = Math.random() > 0.5 ? 1 : -1; // 1 for right, -1 for left
    const x = direction === 1 ? -50 : canvas.width + 50; // Start at left or right edge
    const y = Math.random() * (canvas.height - 140) + 130; // Random vertical position
    const speed = Math.random() * 2 + 3; // Random speed between 2 and 4
    const type = direction > 0.5 ? 'fish2' : 'fish'; // Randomly assign type

    // Create fish object
    const fish = {
        x,
        y,
        speed,
        direction,
        type
    };

    fishes.push(fish);

    // Randomize next spawn
    const nextSpawn = Math.random() * 2000 + 500; // Random time between 0.5 and 2.5 seconds
    setTimeout(spawnFish, nextSpawn);
}

// Update and render fish
function updateFishes() {
    console.log('Fishes:', fishes);
    fishes.forEach((fish, index) => {
        // Move fish
        fish.x += fish.speed * fish.direction;

        // Remove fish if it goes off-screen
        if (fish.x < -50 || fish.x > canvas.width + 50) {
            fishes.splice(index, 1);
            return; // Skip further processing for this fish
        }

        // Draw the fish
        if (images[fish.type]) {
            ctx.drawImage(images[fish.type], fish.x, fish.y, 50, 30);
        } else {
            console.error(`Missing image for fish type: ${fish.type}`);
            ctx.fillStyle = 'red'; // Debugging fallback
            ctx.fillRect(fish.x, fish.y, 50, 30);
        }
    });
}

// Collision detection
function detectCollision() {
    let fishCaught = false; // Tracks if a fish is caught in this frame
    fishes.forEach((fish, index) => {

        // Check if fish overlaps with the rod's edge
        if (
            fish.x >= rodX + 165 &&
            fish.x <= rodX + 230 &&
            fish.y >= rodY + 440 &&
            fish.y <= rodY + 480 &&
            spacePressed
        ) {
            // Remove the fish and update the score
            fishes.splice(index, 1); // Despawn the fish
            fishCaught = true; // Fish caught
        }
    });
    if(fishCaught) {
        score += combo; // Add to the score (combo currently set to 1)
        comboCount += 1;

        if(comboCount >= 3 && combo < 5) {
            combo += 1;
            comboOn = true;
        }

        console.log(`Fish caught! Score: ${score}`);
    }
    else if(spacePressed) {
        // Reset combo if space pressed without catching a fish
        comboCount = 0;
        combo = 1;
        comboOn = false;
        console.log(`Combo reset!`);
    }

    spacePressed = false;
}

// Game loop enhancement
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    if (images.backgroundBottom) {
        ctx.drawImage(images.backgroundBottom, 0, 0, canvas.width, canvas.height);
    }

    // Update and draw fish
    updateFishes();

    // Detect collisions
    detectCollision();

    // Draw rod
    if (images.rod) {
        ctx.drawImage(images.rod, rodX, rodY);
    }

    // if (images.fish) {
    //     ctx.drawImage(images.fish, rodX + 230, rodY + 475, 50, 30);
    // }

    // Draw top background
    if (images.backgroundTop) {
        ctx.drawImage(images.backgroundTop, 0, 0);
    }

    // Draw clock & score
    drawClock();
    drawScore();
    
    if(comboOn) {
        if (images.combo) {
            ctx.drawImage(images.combo, -5, 35, 100, 70);
            ctx.drawImage(images.x, 107, 55, 18, 23);
            if(combo == 2) {
                ctx.drawImage(images.two, 92, 58, 15, 25);
            }
            if(combo == 3) {
                ctx.drawImage(images.three, 92, 50, 15, 36);
            }
            if(combo == 4) {
                ctx.drawImage(images.four, 92, 50, 15, 36);
            }
            if(combo == 5) {
                ctx.drawImage(images.five, 94, 48, 19, 36);
            }
        }
    }

    // Continue game loop
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Load assets
function loadAssets(callback) {
    let loaded = 0;
    const total = Object.keys(assets).length;

    Object.entries(assets).forEach(([key, src]) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            images[key] = img;
            console.log(`${key} loaded`);
            loaded++;
            if (loaded === total) callback();
        };
        img.onerror = () => {
            console.error(`Error loading ${key}`);
        };
    });
}

// Start fish spawning when the game starts
function startGame() {
    showGameCanvas(); // Ensure game canvas is visible
    gameRunning = true;
    spawnFish(); // Start spawning fish
    gameLoop();  // Start game loop

    // // Start the countdown timer
    // timerInterval = setInterval(updateCountdown, 1000);
}

// Initialize
loadAssets(() => {
    console.log('Assets loaded. Starting game.');
    showHomeScreen();
});

// function showEndingScreen() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'black';
//     ctx.fillRect(0, 0, canvas.width, canvas.height); // Dark background

//     ctx.fillStyle = 'white';
//     ctx.font = '30px Arial';
//     ctx.textAlign = 'center';
//     ctx.fillText(`Game Over!`, canvas.width / 2, canvas.height / 2 - 40);
//     ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2);

//     // Draw "Play Again" button
//     ctx.fillStyle = 'yellow';
//     ctx.fillRect(canvas.width / 2 - 75, canvas.height / 2 + 40, 150, 50);
//     ctx.fillStyle = 'black';
//     ctx.font = '20px Arial';
//     ctx.fillText(`Play Again`, canvas.width / 2, canvas.height / 2 + 75);
// }

// End the game
function endGame() {
    gameRunning = false;
    clearInterval(timerInterval); // Stop the timer
    document.getElementById('finalScore').textContent = score; // Update final score
    showEndScreen(); // Show the ending screen
}

function restartGame() {
    // Reset game state
    rodX = 10, rodY = -380;
    fishes = [];
    score = 0;
    combo = 1;
    comboCount = 0;
    startTime = Date.now();
    spacePressed = false;
    comboOn = false;
    gameRunning = false;

    // Restart the game
    startGame();
}

// Input handling
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && rodY >= -380) rodY -= 10; // Move up
    if (e.key === 'ArrowDown' && rodY <= -10) rodY += 10; // Move down
    if (e.key === ' ') {
        spacePressed = true; // Space key pressed
        setTimeout(() => {
            spacePressed = false; // Reset after a short delay
        }, 100); // 100ms trigger window
    }
});

// canvas.addEventListener('click', (e) => {
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Check if "Play Again" button is clicked
//     if (
//         x >= canvas.width / 2 - 75 &&
//         x <= canvas.width / 2 + 75 &&
//         y >= canvas.height / 2 + 40 &&
//         y <= canvas.height / 2 + 90
//     ) {
//         restartGame();
//     }
// });