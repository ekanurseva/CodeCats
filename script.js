const board = document.getElementById("game-board");
const runBtn = document.getElementById("run-btn");
const resetBtn = document.getElementById("reset-btn");
const nextBtn = document.getElementById("next-btn");

const themeToggle =
    document.getElementById("theme-toggle");

const lessonModal =
    document.getElementById("lesson-modal");

const lessonTitle =
    document.getElementById("lesson-title");

const lessonDescription =
    document.getElementById("lesson-description");

const lessonExample =
    document.getElementById("lesson-example");

const lessonTakeaway =
    document.getElementById("lesson-takeaway-text");

const closeLessonBtn =
    document.getElementById("close-lesson-btn");

const lessonCode =
    document.getElementById("lesson-code");

const lessonExplanation =
    document.getElementById("lesson-explanation");

const lessonLogic =
    document.getElementById("lesson-logic");

const lessonConcept =
    document.getElementById("lesson-concept");

const codeInput = document.getElementById("code-input");
const statusText = document.getElementById("status");

const startBtn =
    document.getElementById("start-btn");

const introScreen =
    document.getElementById("intro-screen");

const container =
    document.querySelector(".container");

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add(
        "light-theme"
    );

    themeToggle.textContent =
        "🌙 Dark Mode";
}

/* =========================
   HIDE GAME FIRST
========================= */

container.style.display = "none";

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

    // LEVEL 3
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

            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 4, y: 1 },

            { x: 1, y: 3 },
            { x: 2, y: 3 },
            { x: 3, y: 3 }
        ]
    },

    // LEVEL 4
    {
        rows: 5,
        cols: 5,

        cat: {
            x: 0,
            y: 4
        },

        fish: {
            x: 4,
            y: 0
        },

        walls: [

            { x: 1, y: 0 },
            { x: 2, y: 0 },

            { x: 1, y: 1 },
            { x: 4, y: 2 },

            { x: 3, y: 2 },

            { x: 1, y: 3 }
        ]
    },

    // LEVEL 5
    {
        rows: 5,
        cols: 5,

        cat: {
            x: 0,
            y: 4
        },

        fish: {
            x: 4,
            y: 2
        },

        walls: [

            { x: 1, y: 0 },

            { x: 3, y: 1 },
            { x: 4, y: 3 },

            { x: 1, y: 2 },
            { x: 3, y: 2 },

            { x: 2, y: 3 },
            { x: 3, y: 4 }
        ]
    }
    
];

/* =========================
   LESSON MODAL
========================= */

const lessons = [

    {
        title: "Sequence (Urutan Instruksi)",

        code:
`kanan();`,

        explanation:
`Perintah kanan() membuat kucing bergerak satu langkah ke kanan.`,

        logic:
`START
↓
kanan()
↓
Kucing bergerak ke kanan
↓
Mencapai makanan
↓
FINISH`,

        concept:
`Komputer menjalankan instruksi secara berurutan dari atas ke bawah. Jika urutannya benar maka tujuan akan tercapai.`
    },

    {
        title: "Algoritma",

        code:
`atas();
kanan(); atau
kanan();
atas();`,

        explanation:
`Kucing harus bergerak ke atas terlebih dahulu, kemudian ke kanan atau ke kanan lalu ke atas untuk mencapai makanan.`,


        logic:
`START
↓
atas() / kanan()
↓
kanan() / atas()
↓
Makanan ditemukan
↓
FINISH`,

        concept:
`Algoritma adalah langkah-langkah yang disusun untuk menyelesaikan suatu masalah.`
    },

    {
        title: "Problem Solving",

        code:
`Cari jalur alternatif
karena terdapat rintangan.`,

        explanation:
`Jalur menuju makanan ada yang terhalang tembok sehingga perlu mencari jalan lain.`,

        logic:
`START
↓
Analisis rintangan
↓
Cari jalur alternatif
↓
Jalankan langkah
↓
FINISH`,

        concept:
`Programmer harus mampu menemukan solusi ketika jalur yang diinginkan tidak dapat digunakan.`
    },

    {
        title: "Debugging dan Analisis",

        code:
`Periksa posisi
kucing, makanan,
dan rintangan.`,

        explanation:
`Sebelum menulis kode, analisis terlebih dahulu kondisi yang ada.`,

        logic:
`START
↓
Analisis Map
↓
Susun Langkah
↓
Uji Solusi
↓
FINISH`,

        concept:
`Debugging adalah proses mencari dan memperbaiki kesalahan pada solusi yang dibuat.`
    },

    {
        title: "Computational Thinking",

        code:
`Masalah Besar
↓
Pecah Menjadi
Langkah Kecil`,

        explanation:
`Masalah yang kompleks dapat dipecah menjadi langkah-langkah sederhana yang mudah diselesaikan.`,

        logic:
`START
↓
Pecah Masalah
↓
Susun Langkah
↓
Eksekusi
↓
FINISH`,

        concept:
`Computational Thinking adalah cara berpikir yang digunakan programmer untuk menyelesaikan masalah secara sistematis.`
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
    nextBtn.style.display = "none";
    runBtn.disabled = false;

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
        `🎮 Level ${levelIndex + 1} / ${levels.length}`;

    statusText.style.color = "var(--text-secondary)";

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

                cell.innerHTML =
                    `<img src="${cat.image}" alt="cat">`;

                if (gameWon) {
                    cell.classList.add("win-cat");
                }
            }

            // FISH
            else if (x === fish.x && y === fish.y) {

                cell.innerHTML =
                    `<img src="assets/noodle.png" alt="fish">`;
            }

            // WALL
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

    if (
        cat.x === fish.x &&
        cat.y === fish.y
    ) {

        gameWon = true;

        runBtn.disabled = true;

        cat.image =
            "assets/cat_happy.webp";

        renderBoard();

        createConfetti();

        statusText.style.color =
            "#22c55e";

        showLesson(currentLevel);

        return true;
    }

    return false;
}
/* =========================
   CONFETTI
========================= */

function createConfetti() {

    document
        .querySelectorAll(".confetti")
        .forEach(c => c.remove());

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

function showLesson(levelIndex) {

    const lesson =
        lessons[levelIndex];

    lessonTitle.textContent =
        lesson.title;

    lessonCode.textContent =
        lesson.code;

    lessonExplanation.textContent =
        lesson.explanation;

    lessonLogic.textContent =
        lesson.logic;

    lessonConcept.textContent =
        lesson.concept;

    lessonModal.style.display =
        "flex";
}

/* =========================
   RUN CODE
========================= */

async function runCode() {

    nextBtn.style.display = "none";

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
   INTRO PARTICLES
========================= */

function createParticles() {

    for (let i = 0; i < 35; i++) {

        const particle =
            document.createElement("div");

        particle.classList.add("particle");

        particle.style.left =
            Math.random() * 100 + "vw";

        const size =
            Math.random() * 4 + 2;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.animationDuration =
            (Math.random() * 5 + 5) + "s";

        particle.style.animationDelay =
            Math.random() * 5 + "s";

        particle.style.opacity =
            Math.random();

        introScreen.appendChild(particle);
    }
}

createParticles();

/* =========================
   EVENTS
========================= */

runBtn.addEventListener(
    "click",
    runCode
);

resetBtn.addEventListener(
    "click",
    resetGame
);

nextBtn.addEventListener("click", () => {

    if (
        currentLevel <
        levels.length - 1
    ) {

        currentLevel++;

        loadLevel(currentLevel);

        codeInput.value = "";
    }
});

startBtn.addEventListener("click", () => {

    introScreen.style.display = "none";

    container.style.display = "flex";
});

closeLessonBtn.addEventListener("click", () => {

    lessonModal.style.display =
        "none";

    if (
        currentLevel ===
        levels.length - 1
    ) {

        statusText.innerHTML =
            "🏆 SELAMAT! Semua level selesai!";

        return;
    }

    statusText.innerHTML =
        `🎉 Level ${currentLevel + 1} selesai!`;

    nextBtn.style.display =
        "block";
});

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle(
        "light-theme"
    );

    const isLight =
        document.body.classList.contains(
            "light-theme"
        );

    themeToggle.textContent =
        isLight
            ? "🌙 Dark Mode"
            : "🌞 Light Mode";

    localStorage.setItem(
        "theme",
        isLight
            ? "dark"
            : "light"
    );
});

/* =========================
   START GAME
========================= */

loadLevel(currentLevel);