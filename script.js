const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const scoreXText = document.getElementById('scoreX');
const scoreOText = document.getElementById('scoreO');
const modeRadios = document.getElementsByName('mode');

let currentPlayer = "X";
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let vsAI = false;
let scores = { X: 0, O: 0 };

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (gameBoard[index] !== "" || !isGameActive) return;

  makeMove(index, currentPlayer);

  if (checkGameEnd()) return;

  if (vsAI && currentPlayer === "O") {
    setTimeout(() => {
      const aiMove = getBestAIMove();
      makeMove(aiMove, "O");
      checkGameEnd();
    }, 500);
  }
}

function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;
  currentPlayer = player === "X" ? "O" : "X";
  statusText.textContent = `Turn: ${currentPlayer}`;
}

function checkGameEnd() {
  const winner = getWinner();
  if (winner) {
    statusText.textContent = `${winner} wins!`;
    scores[winner]++;
    updateScores();
    isGameActive = false;
    return true;
  }
  if (gameBoard.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return true;
  }
  return false;
}

function getWinner() {
  for (let condition of winConditions) {
    const [a, b, c] = condition;
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      return gameBoard[a];
    }
  }
  return null;
}

function getBestAIMove() {
  // Easy AI: choose random empty cell
  const emptyIndices = gameBoard
    .map((val, idx) => val === "" ? idx : null)
    .filter(val => val !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function updateScores() {
  scoreXText.textContent = scores["X"];
  scoreOText.textContent = scores["O"];
}

function restartGame() {
  gameBoard.fill("");
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
  isGameActive = true;
  statusText.textContent = `Turn: ${currentPlayer}`;
}

restartBtn.addEventListener('click', restartGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    vsAI = document.querySelector('input[name="mode"]:checked').value === "ai";
    restartGame();
  });
});

// Initialize
restartGame();
