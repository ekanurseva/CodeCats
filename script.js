const board = document.getElementById("game-board");
const runBtn = document.getElementById("run-btn");
const resetBtn = document.getElementById("reset-btn");
const codeInput = document.getElementById("code-input");
const statusText = document.getElementById("status");

/* =========================
   LEVEL DATA
========================= */

const levels = [

    // LEVEL 1
    {
        rows: 1,
        cols: 2,

        cat: {
            x: 0,
            y: 0
        },

        fish: {
            x: 1,
            y: 0
        }
    },

    // LEVEL 2
    {
        rows: 1,
        cols: 3,

        cat: {
            x: 0,
            y: 0
        },

        fish: {
            x: 2,
            y: 0
        }
    },

    // LEVEL 3
    {
        rows: 2,
        cols: 2,

        cat: {
            x: 0,
            y: 1
        },

        fish: {
            x: 1,
            y: 0
        }
    },

    // LEVEL 4
    {
        rows: 3,
        cols: 3,

        cat: {
            x: 0,
            y: 2
        },

        fish: {
            x: 2,
            y: 0
        }
    },

    // LEVEL 5
    {
        rows: 5,
        cols: 5,

        cat: {
            x: 0,
            y: 0
        },

        fish: {
            x: 3,
            y: 4
        },

        walls: [
            { x: 2, y: 0 },

            { x: 0, y: 1 },
            { x: 2, y: 1 },
            { x: 4, y: 1 },

            { x: 1, y: 3 },
            { x: 2, y: 3 },
            { x: 3, y: 3 }
        ]
    },

    // LEVEL 6
    {
        rows: 6,
        cols: 6,

        cat: {
            x: 0,
            y: 5
        },

        fish: {
            x: 5,
            y: 0
        },

        walls: [

            // BARIS 1
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },

            // BARIS 2
            { x: 1, y: 1 },

            // BARIS 3
            { x: 3, y: 2 },
            { x: 4, y: 2 },

            // BARIS 4
            { x: 1, y: 3 },
            { x: 2, y: 3 },

            // BARIS 5
            { x: 4, y: 4 },

            // BARIS 6
            { x: 2, y: 5 }
        ]
    }

];

/* =========================
   GAME STATE
========================= */

let currentLevel = 0;

let cat = {};
let fish = {};
let walls = [];

let ROWS = 0;
let COLS = 0;

let gameWon = false;

/* =========================
   LOAD LEVEL
========================= */

function loadLevel(levelIndex) {

    const level = levels[levelIndex];

    ROWS = level.rows;
    COLS = level.cols;
    walls = level.walls || [];

    cat = {
        x: level.cat.x,
        y: level.cat.y,
        image: "assets/cat_hungry.webp"
    };

    fish = {
        x: level.fish.x,
        y: level.fish.y
    };

    gameWon = false;

    statusText.innerHTML =
        `Level ${levelIndex + 1}`;

    statusText.style.color = "white";

    board.style.gridTemplateColumns =
        `repeat(${COLS}, 90px)`;

    renderBoard();
}

/* =========================
   RENDER BOARD
========================= */

function renderBoard() {

    board.innerHTML = "";

    for (let y = 0; y < ROWS; y++) {

        for (let x = 0; x < COLS; x++) {

            const cell = document.createElement("div");

            cell.classList.add("cell");

            // CAT
            if (x === cat.x && y === cat.y) {

                cell.innerHTML = `<img src="${cat.image}" alt="cat">`;

                if (gameWon) {
                    cell.classList.add("win-cat");
                }
            }

            // FISH
            else if (x === fish.x && y === fish.y) {

                cell.innerHTML = `<img src="assets/noodle.png">`;;
            }

            //walls
            else if (isWall(x, y)) {

                cell.innerHTML =
                    `<img src="assets/wall.png" alt="wall">`;
            }

            // EMPTY
            else {

                cell.innerHTML =
                    `<img src="assets/street.png" alt="street">`;
            }

            board.appendChild(cell);
        }
    }
}

/* =========================
   MOVEMENT
========================= */

function kanan() {

    const nextX = cat.x + 1;

    if (
        nextX < COLS &&
        !isWall(nextX, cat.y)
    ) {
        cat.x++;
    }
}

function kiri() {

    const nextX = cat.x - 1;

    if (
        nextX >= 0 &&
        !isWall(nextX, cat.y)
    ) {
        cat.x--;
    }
}

function atas() {

    const nextY = cat.y - 1;

    if (
        nextY >= 0 &&
        !isWall(cat.x, nextY)
    ) {
        cat.y--;
    }
}

function bawah() {

    const nextY = cat.y + 1;

    if (
        nextY < ROWS &&
        !isWall(cat.x, nextY)
    ) {
        cat.y++;
    }
}

function isWall(x, y) {

    return walls.some(wall =>
        wall.x === x &&
        wall.y === y
    );
}

/* =========================
   CHECK WIN
========================= */

function checkWin() {

    if (cat.x === fish.x &&
        cat.y === fish.y) {

        gameWon = true;

        cat.image = "assets/cat_eat.webp";

        renderBoard();

        createConfetti();

        // LAST LEVEL
        if (currentLevel === levels.length - 1) {

            statusText.innerHTML =
                "SELAMAT! Semua level selesai!";
        }

        // NEXT LEVEL
        else {

            statusText.innerHTML =
                `<b>Level ${currentLevel + 1} selesai!</b><br>
                 Menuju level ${currentLevel + 2}...`;

            setTimeout(() => {

                currentLevel++;

                loadLevel(currentLevel);

            }, 2000);
        }

        statusText.style.color = "#22c55e";

        return true;
    }

    return false;
}

/* =========================
   CONFETTI
========================= */

function createConfetti() {

    for (let i = 0; i < 20; i++) {

        const confetti =
            document.createElement("div");

        confetti.classList.add("confetti");

        confetti.style.left =
            Math.random() * window.innerWidth + "px";

        confetti.style.animationDuration =
            (Math.random() * 2 + 2) + "s";

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 4000);
    }
}

/* =========================
   RUN CODE
========================= */

async function runCode() {

    gameWon = false;

    cat.image = "assets/cat_hungry.webp";

    statusText.innerHTML =
        "⏳ Menjalankan code...";

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

                cat.image = "assets/cat_sad.webp";

                renderBoard();

                statusText.innerHTML =
                    `❌ Command salah: ${command}`;

                statusText.style.color = "#ff6868";

                return;
        }

        renderBoard();

        await new Promise(resolve =>
            setTimeout(resolve, 500));

        if (checkWin()) {
            return;
        }
    }

    cat.image = "assets/cat_sad.webp";

    renderBoard();

    statusText.innerHTML =
        "Kucing belum mencapai makanan";

    statusText.style.color = "#ffe374";
}

/* =========================
   RESET GAME
========================= */

function resetGame() {

    loadLevel(currentLevel);

    codeInput.value = "";
}

/* =========================
   EVENTS
========================= */

runBtn.addEventListener("click", runCode);

resetBtn.addEventListener("click", resetGame);

/* =========================
   START GAME
========================= */

loadLevel(currentLevel);