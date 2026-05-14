const board = document.getElementById("game-board");
const runBtn = document.getElementById("run-btn");
const resetBtn = document.getElementById("reset-btn");
const codeInput = document.getElementById("code-input");
const statusText = document.getElementById("status");

const ROWS = 3;
const COLS = 4;

let cat = {
    x: 0,
    y: 2,
    emoji: "🐱"
};

const fish = {
    x: 3,
    y: 0
};

let gameWon = false;

function renderBoard() {

    board.innerHTML = "";

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            const cell = document.createElement("div");
            cell.classList.add("cell");

            // CAT
            if (x === cat.x && y === cat.y) {

                cell.innerHTML = `<img src="assets/cat_hungry.webp">`;

                if (gameWon) {
                    cell.classList.add("win-cat");
                }
            }

            // FISH
            else if (x === fish.x && y === fish.y) {
                cell.innerHTML = `<img src="assets/noodle.png">`;
            }

            // EMPTY
            else {
                cell.textContent = "⬜";
            }

            board.appendChild(cell);
        }
    }
}

function kanan() {
    if (cat.x < COLS - 1) {
        cat.x++;
    }
}

function kiri() {
    if (cat.x > 0) {
        cat.x--;
    }
}

function atas() {
    if (cat.y > 0) {
        cat.y--;
    }
}

function bawah() {
    if (cat.y < ROWS - 1) {
        cat.y++;
    }
}

function checkWin() {

    if (cat.x === fish.x && cat.y === fish.y) {

        gameWon = true;

        cat.emoji = "😺";

        statusText.innerHTML =
            "🎉 YEAYYY! Kucing berhasil mendapatkan makanan!";

        statusText.style.color = "#22c55e";

        renderBoard();

        createConfetti();

        return true;
    }

    return false;
}

function createConfetti() {

    for (let i = 0; i < 20; i++) {

        const confetti = document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left = Math.random() * window.innerWidth + "px";

        confetti.style.animationDuration =
            (Math.random() * 2 + 2) + "s";

        confetti.style.opacity = Math.random();

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

async function runCode() {

    gameWon = false;

    cat.emoji = "🐱";

    statusText.textContent = "⏳ Menjalankan code...";
    statusText.style.color = "white";

    const code = codeInput.value;

    const commands = code
        .split("\n")
        .map(cmd => cmd.trim())
        .filter(cmd => cmd !== "");

    for (const command of commands) {

        switch (command) {

            case "kanan();":
                kanan();
                break;

            case "kiri();":
                kiri();
                break;

            case "atas();":
                atas();
                break;

            case "bawah();":
                bawah();
                break;

            default:

                cat.emoji = "🙀";

                renderBoard();

                statusText.textContent =
                    `❌ Command tidak dikenali: ${command}`;

                statusText.style.color = "#ef4444";

                return;
        }

        renderBoard();

        await new Promise(resolve => setTimeout(resolve, 500));

        if (checkWin()) {
            return;
        }
    }

    cat.emoji = "😿";

    renderBoard();

    statusText.textContent =
        "😿 Kucing belum mencapai makanan...";

    statusText.style.color = "#facc15";
}

function resetGame() {

    cat = {
        x: 0,
        y: 2,
        emoji: "🐱"
    };

    gameWon = false;

    statusText.textContent =
        "Game di-reset!";

    statusText.style.color = "white";

    renderBoard();
}

runBtn.addEventListener("click", runCode);
resetBtn.addEventListener("click", resetGame);

renderBoard();