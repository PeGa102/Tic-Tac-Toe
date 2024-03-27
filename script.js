document.addEventListener("DOMContentLoaded", () => {
    const board = document.getElementById("board");
    const status = document.getElementById("status");
    const resetBtn = document.getElementById("resetBtn");
    const newGameBtn = document.getElementById("newGameBtn");
    const difficultySelect = document.getElementById("difficultyLevel");

    let currentPlayer = "X";
    let gameState = ["", "", "", "", "", "", "", "", ""];

    const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let difficultyLevel = "easy"; // Default difficulty level

    function render() {
        board.innerHTML = "";
        gameState.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.addEventListener("click", () => handleCellClick(index));
            board.appendChild(cellElement);
        });
        status.textContent = `Current Player: ${currentPlayer}`;
    }

    function handleCellClick(index) {
        if (gameState[index] !== "" || checkWinner()) return;
        gameState[index] = currentPlayer;
        render();
        if (checkWinner()) {
            showResult(`Player ${currentPlayer} wins!`);
        } else if (!gameState.includes("")) {
            showResult("It's a draw!");
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (currentPlayer === "O") {
                setTimeout(makeAIMove, 500);
            }
        }
    }

    function makeAIMove() {
        if (difficultyLevel === "easy") {
            makeRandomMove();
        } else if (difficultyLevel === "medium") {
            makeRandomMove(); // For now, medium AI also makes random moves
        } else if (difficultyLevel === "hard") {
            const bestMove = minimax(gameState, currentPlayer).index;
            handleCellClick(bestMove);
        }
    }

    function makeRandomMove() {
        let emptyCells = gameState.map((cell, index) => cell === "" ? index : -1).filter(index => index !== -1);
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        handleCellClick(emptyCells[randomIndex]);
    }

    function checkWinner() {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    }

    function showResult(message) {
        status.textContent = message;
        board.removeEventListener("click", handleCellClick);
    }

    function resetGame() {
        currentPlayer = "X";
        gameState = ["", "", "", "", "", "", "", "", ""];
        render();
        status.textContent = `Current Player: ${currentPlayer}`;
        board.addEventListener("click", handleCellClick);
    }

    resetBtn.addEventListener("click", resetGame);
    newGameBtn.addEventListener("click", resetGame);

    difficultySelect.addEventListener("change", (event) => {
        difficultyLevel = event.target.value;
        resetGame();
    });

    render();
});

function minimax(newBoard, player) {
    let emptyCells = newBoard.map((cell, index) => cell === "" ? index : -1).filter(index => index !== -1);

    if (checkWin(newBoard, "X")) {
        return { score: -10 };
    } else if (checkWin(newBoard, "O")) {
        return { score: 10 };
    } else if (emptyCells.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i = 0; i < emptyCells.length; i++) {
        let move = {};
        move.index = emptyCells[i];
        newBoard[emptyCells[i]] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[emptyCells[i]] = "";
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i].index;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i].index;
            }
        }
    }

    return moves.find(move => move.index === bestMove);
}


function checkWin(board, player) {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}
