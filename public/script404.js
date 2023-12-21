import * as PIXI from '/pixi.js/dist/pixi.min.mjs';

const app = new PIXI.Application({
    width: 600,
    height: window.innerHeight,
    backgroundColor: 0x000000,
});
document.body.appendChild(app.view);

const piecesContainer = new PIXI.Container();
app.stage.addChild(piecesContainer);

const ROWS = 20;
const COLUMNS = 20;
const BLOCK_SIZE = 30;
const board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
let currentPiece;
let currentPieceX;
let currentPieceY;
let originalY; 
let score = 0;
let lastUpdateTime = 0;
let pieces = [
    [[1, 1, 1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1, 1], [1, 1, 0]]
];

// Remplace ce chemin par le tien
const imagePath = '/img/';

const piecesTextures = [
    PIXI.Texture.from(imagePath + 'y_block.png'),
    PIXI.Texture.from(imagePath + 'r_block.png'),
    PIXI.Texture.from(imagePath + 'g_block.png'),
    // Ajoute des textures pour chaque type de pièce que tu as
];

function drawSquare(x, y, textureOrColor) {
    if (typeof textureOrColor === 'number') {
        // C'est une couleur
        const graphics = new PIXI.Graphics();
        graphics.lineStyle(2, textureOrColor); // Épaisseur du trait 2 pixels, couleur définie par textureOrColor
        graphics.drawRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        piecesContainer.addChild(graphics);
    } else {
        // C'est une texture
        const sprite = new PIXI.Sprite(textureOrColor);
        sprite.x = x * BLOCK_SIZE;
        sprite.y = y * BLOCK_SIZE;
        sprite.width = BLOCK_SIZE;
        sprite.height = BLOCK_SIZE;
        piecesContainer.addChild(sprite);
    }
}

function drawBoard() {
    piecesContainer.removeChildren();
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            if (board[row][col] !== 0) {
                drawSquare(col, row, piecesTextures[board[row][col] - (-1)]);
            }
        }
    }
}

function drawPiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] !== 0) {
                drawSquare(currentPieceX + col, currentPieceY + row, piecesTextures[currentPiece[row][col] - 0]);
            }
        }
    }
}

function drawPreview() {
    const previewPiece = getPreviewPiece();

    originalY = currentPieceY; // Ajoute cette ligne

    while (isValidMove(previewPiece, currentPieceX, currentPieceY + 1)) {
        currentPieceY++;
    }

    for (let row = 0; row < previewPiece.length; row++) {
        for (let col = 0; col < previewPiece[row].length; col++) {
            if (previewPiece[row][col] !== 0) {
                drawSquare(currentPieceX + col, currentPieceY + row, 0xC0C0C0); // Texture grise pour la prévisualisation
            }
        }
    }

    currentPieceY = originalY; // Rétablit la position originale de la pièce
}

function isValidMove(piece, x, y) {
    for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
            if (
                piece[row][col] !== 0 &&
                (board[y + row] && board[y + row][x + col]) !== 0
            ) {
                return false;
            }
        }
    }
    return true;
}

function getPreviewPiece() {
    const previewPiece = [];
    for (let row = 0; row < currentPiece.length; row++) {
        previewPiece[row] = currentPiece[row].slice(); // Crée une copie de la ligne
    }
    return previewPiece;
}

function clearBoard() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLUMNS; col++) {
            board[row][col] = 0;
        }
    }
}

function mergePiece() {
    for (let row = 0; row < currentPiece.length; row++) {
        for (let col = 0; col < currentPiece[row].length; col++) {
            if (currentPiece[row][col] !== 0) {
                board[currentPieceY + row][currentPieceX + col] = 1;
            }
        }
    }
}

function clearRows() {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLUMNS).fill(0));
            score += 10;
            updateScore();
        }
    }
}

function updateScore() {
    document.getElementById('score').innerText = score;
}

let canRotate = true; // Ajoute cette variable globale

function rotatePiece() {
    const tempPiece = currentPiece;
    currentPiece = currentPiece[0].map((_, i) => currentPiece.map(row => row[i])).reverse();

    // Vérifie si la rotation dépasse les limites horizontales
    if (!isValidMove(currentPiece, currentPieceX, currentPieceY)) {
        currentPiece = tempPiece; // Annule la rotation
        canRotate = false; // Bloque la rotation temporairement
    }
}

function moveDown() {
    if (isValidMove(currentPiece, currentPieceX, currentPieceY + 1)) {
        currentPieceY++;
        canRotate = true; // Autorise la rotation quand le bloc se déplace vers le bas
    } else {
        mergePiece();
        clearRows();
        currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
        currentPieceX = Math.floor(COLUMNS / 2) - Math.floor(currentPiece[0].length / 2);
        currentPieceY = 0;

        if (!isValidMove(currentPiece, currentPieceX, currentPieceY)) {
            // Game over
            alert("Game Over! Your score: " + score);
            resetGame();
        }
    }
}

function moveLeft() {
    if (isValidMove(currentPiece, currentPieceX - 1, currentPieceY)) {
        currentPieceX--;
        canRotate = true; // Autorise la rotation quand le bloc se déplace horizontalement
    }
}

function moveRight() {
    if (isValidMove(currentPiece, currentPieceX + 1, currentPieceY)) {
        currentPieceX++;
        canRotate = true; // Autorise la rotation quand le bloc se déplace horizontalement
    }
}


let lastAutoMoveDownTime = 0;
const autoMoveDownInterval = 500; // Délai en millisecondes entre chaque descente automatique

function autoMoveDown(timestamp) {
    if (!lastAutoMoveDownTime) {
        lastAutoMoveDownTime = timestamp;
    }

    const deltaTime = timestamp - lastAutoMoveDownTime;

    if (deltaTime > autoMoveDownInterval) {
        moveDown();
        lastAutoMoveDownTime = timestamp;
    }
}

function resetGame() {
    clearBoard();
    score = 0;
    drawBoard();
    updateScore();
}

document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") {
        moveDown();
    } else if (e.key === "ArrowLeft") {
        moveLeft();
    } else if (e.key === "ArrowRight") {
        moveRight();
    } else if (e.key === "ArrowUp") {
        rotatePiece();
    }
    drawBoard();
});

function gameLoop(timestamp) {
    autoMoveDown(timestamp);
    drawBoard();
    drawPiece();
    drawPreview(); // Ajoute la prévisualisation
    requestAnimationFrame(gameLoop);
}

function startGame() {
    resetGame();
    currentPiece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPieceX = Math.floor(COLUMNS / 2) - Math.floor(currentPiece[0].length / 2);
    currentPieceY = 0;
    lastUpdateTime = null;
    requestAnimationFrame(gameLoop);
}

startGame();
