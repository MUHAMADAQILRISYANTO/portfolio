const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const rows = 20;
const columns = 10;
const blockSize = 30;
const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4FF33', '#FF33D4', '#33FFF5', '#F833FF'];

// Game state variables
let board = Array.from({ length: rows }, () => Array(columns).fill(null));
let score = 0;
let currentPiece = generatePiece();

// Draw the game board
function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the grid
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c]) {
                ctx.fillStyle = board[r][c];
                ctx.fillRect(c * blockSize, r * blockSize, blockSize, blockSize);
                ctx.strokeStyle = '#222';
                ctx.strokeRect(c * blockSize, r * blockSize, blockSize, blockSize);
            }
        }
    }

    // Draw the current piece
    if (currentPiece) {
        currentPiece.shape.forEach(([r, c]) => {
            ctx.fillStyle = currentPiece.color;
            ctx.fillRect((currentPiece.x + c) * blockSize, (currentPiece.y + r) * blockSize, blockSize, blockSize);
            ctx.strokeStyle = '#222';
            ctx.strokeRect((currentPiece.x + c) * blockSize, (currentPiece.y + r) * blockSize, blockSize, blockSize);
        });
    }

    // Display the score
    document.getElementById('scoreValue').textContent = score;
}

// Generate a random Tetris piece
function generatePiece() {
    const shapes = [
        [
            [1, 1, 1],
            [0, 1, 0]
        ], // T shape
        [
            [1, 1],
            [1, 1]
        ], // O shape
        [
            [1, 1, 0],
            [0, 1, 1]
        ], // S shape
        [
            [0, 1, 1],
            [1, 1, 0]
        ], // Z shape
        [
            [1, 1, 1, 1]
        ], // I shape
        [
            [1, 1, 1],
            [1, 0, 0]
        ], // L shape
        [
            [1, 1, 1],
            [0, 0, 1]
        ], // J shape
    ];
    const randomIndex = Math.floor(Math.random() * shapes.length);
    const shape = shapes[randomIndex];
    return {
        shape: shape,
        color: colors[randomIndex],
        x: Math.floor(columns / 2) - Math.floor(shape[0].length / 2),
        y: 0,
    };
}

// Check for collision
function isCollision() {
    for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
            if (currentPiece.shape[r][c]) {
                const newX = currentPiece.x + c;
                const newY = currentPiece.y + r;
                if (newX < 0 || newX >= columns || newY >= rows || board[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Place the current piece on the board
function placePiece() {
    currentPiece.shape.forEach(([r, c]) => {
        if (r + currentPiece.y >= 0) {
            board[r + currentPiece.y][c + currentPiece.x] = currentPiece.color;
        }
    });

    // Check for full lines and remove them
    for (let r = rows - 1; r >= 0; r--) {
        if (board[r].every(cell => cell)) {
            board.splice(r, 1);
            board.unshift(Array(columns).fill(null));
            score += 10;
        }
    }

    currentPiece = generatePiece();

    if (isCollision()) {
        alert('Game Over!');
        resetGame();
    }
}

// Move piece
function movePiece(dx, dy) {
    currentPiece.x += dx;
    currentPiece.y += dy;

    if (isCollision()) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;

        if (dy) {
            placePiece();
        }
    }
}

// Rotate piece
function rotatePiece() {
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
        currentPiece.shape.map(row => row[index])
    ).reverse();

    const originalShape = currentPiece.shape;
    currentPiece.shape = rotatedShape;

    if (isCollision()) {
        currentPiece.shape = originalShape;
    }
}

// Handle user input
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        movePiece(-1, 0);
    } else if (e.key === 'ArrowRight') {
        movePiece(1, 0);
    } else if (e.key === 'ArrowDown') {
        movePiece(0, 1);
    } else if (e.key === 'ArrowUp') {
        rotatePiece();
    }
});

// Game loop
function gameLoop() {
    movePiece(0, 1);
    drawBoard();
}

// Reset the game
function resetGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(null));
    score = 0;
    currentPiece = generatePiece();
}

// Start the game
setInterval(gameLoop, 500);