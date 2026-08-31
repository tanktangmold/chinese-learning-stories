// Built-in reward mini-games: airplane (odd days) and snake (even days).

let miniGame = null;

function miniGameKind(day) {
    return Number(day) % 2 === 1 ? "plane" : "snake";
}

function stopMiniGame() {
    if (miniGame && typeof miniGame.stop === "function") miniGame.stop();
    miniGame = null;
}

function startMiniGame(kind, onWin) {
    stopMiniGame();
    const board = document.getElementById("game-board");
    if (!board) return;
    if (kind === "snake") miniGame = runSnakeGame(board, onWin);
    else miniGame = runPlaneGame(board, onWin);
}

function finishMiniGame(onWin) {
    stopMiniGame();
    if (typeof onWin === "function") onWin();
}

function runPlaneGame(board, onWin) {
    board.innerHTML = `<p class="game-score" id="mini-score">⭐ 0 / 5</p>
        <canvas id="mini-canvas" class="mini-canvas" width="640" height="360"></canvas>
        <p class="muted">画面をおすと、飛行機が上がるよ</p>`;
    const canvas = document.getElementById("mini-canvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("mini-score");
    const W = canvas.width;
    const H = canvas.height;
    const state = {
        y: H / 2,
        vy: 0,
        stars: 0,
        items: [],
        clouds: [],
        t: 0,
        alive: true,
        raf: 0,
    };

    function spawn() {
        if (state.t % 70 === 0) {
            state.clouds.push({ x: W + 20, y: 40 + Math.random() * (H - 120), w: 70 + Math.random() * 40, h: 36 });
        }
        if (state.t % 90 === 20) {
            state.items.push({ x: W + 10, y: 50 + Math.random() * (H - 100), r: 12, got: false });
        }
    }

    function flap() {
        if (!state.alive) return;
        state.vy = -7.2;
    }

    function hitCloud(c) {
        return state.y > c.y - 8 && state.y < c.y + c.h + 8 && 86 > c.x && 86 < c.x + c.w;
    }

    function tick() {
        if (!state.alive) return;
        state.t += 1;
        spawn();
        state.vy += 0.32;
        state.y += state.vy;
        if (state.y < 18) {
            state.y = 18;
            state.vy = 0;
        }
        if (state.y > H - 18) {
            state.y = H - 18;
            state.vy = 0;
        }
        state.clouds.forEach((c) => {
            c.x -= 3.2;
        });
        state.items.forEach((s) => {
            s.x -= 3.2;
            const dx = s.x - 86;
            const dy = s.y - state.y;
            if (!s.got && dx * dx + dy * dy < 28 * 28) {
                s.got = true;
                state.stars += 1;
                if (scoreEl) scoreEl.textContent = `⭐ ${state.stars} / 5`;
            }
        });
        state.clouds = state.clouds.filter((c) => c.x > -120);
        state.items = state.items.filter((s) => s.x > -20 && !s.got);
        if (state.clouds.some(hitCloud)) {
            state.y = H / 2;
            state.vy = 0;
        }
        draw();
        if (state.stars >= 5) {
            state.alive = false;
            finishMiniGame(onWin);
            return;
        }
        state.raf = requestAnimationFrame(tick);
    }

    function draw() {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#8ecae6");
        g.addColorStop(1, "#c9f0ff");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fff7d6";
        ctx.beginPath();
        ctx.arc(560, 54, 28, 0, Math.PI * 2);
        ctx.fill();
        state.clouds.forEach((c) => {
            ctx.fillStyle = "rgba(255,255,255,.92)";
            ctx.beginPath();
            ctx.ellipse(c.x + c.w / 2, c.y + c.h / 2, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        state.items.forEach((s) => {
            ctx.fillStyle = "#f2c14e";
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#2c2416";
            ctx.lineWidth = 2;
            ctx.stroke();
        });
        ctx.save();
        ctx.translate(86, state.y);
        ctx.rotate(Math.max(-0.4, Math.min(0.5, state.vy / 12)));
        ctx.fillStyle = "#e85d4c";
        ctx.beginPath();
        ctx.moveTo(28, 0);
        ctx.lineTo(-22, 14);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-22, -14);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#2c2416";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillRect(-4, -6, 10, 12);
        ctx.restore();
    }

    function onPointer(event) {
        event.preventDefault();
        flap();
    }
    canvas.addEventListener("pointerdown", onPointer);
    state.raf = requestAnimationFrame(tick);
    return {
        stop() {
            state.alive = false;
            cancelAnimationFrame(state.raf);
            canvas.removeEventListener("pointerdown", onPointer);
        },
    };
}

function runSnakeGame(board, onWin) {
    board.innerHTML = `<p class="game-score" id="mini-score">⚽ 0 / 5</p>
        <canvas id="mini-canvas" class="mini-canvas" width="420" height="420"></canvas>
        <div class="dpad" id="mini-dpad">
            <button type="button" data-dir="up" aria-label="上">↑</button>
            <div class="dpad-mid">
                <button type="button" data-dir="left" aria-label="左">←</button>
                <button type="button" data-dir="right" aria-label="右">→</button>
            </div>
            <button type="button" data-dir="down" aria-label="下">↓</button>
        </div>`;
    const canvas = document.getElementById("mini-canvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("mini-score");
    const N = 14;
    const cell = canvas.width / N;
    const state = {
        snake: [{ x: 3, y: 7 }, { x: 2, y: 7 }, { x: 1, y: 7 }],
        dir: { x: 1, y: 0 },
        nextDir: { x: 1, y: 0 },
        food: { x: 9, y: 7 },
        eaten: 0,
        alive: true,
        timer: 0,
    };

    function placeFood() {
        for (let i = 0; i < 80; i += 1) {
            const x = 1 + Math.floor(Math.random() * (N - 2));
            const y = 1 + Math.floor(Math.random() * (N - 2));
            if (!state.snake.some((p) => p.x === x && p.y === y)) {
                state.food = { x, y };
                return;
            }
        }
    }

    function setDir(name) {
        const map = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
        const d = map[name];
        if (!d) return;
        if (d.x === -state.dir.x && d.y === -state.dir.y) return;
        state.nextDir = d;
    }

    function bumpReset() {
        state.snake = [{ x: 3, y: 7 }, { x: 2, y: 7 }, { x: 1, y: 7 }];
        state.dir = { x: 1, y: 0 };
        state.nextDir = { x: 1, y: 0 };
    }

    function step() {
        if (!state.alive) return;
        state.dir = state.nextDir;
        const head = state.snake[0];
        const nx = head.x + state.dir.x;
        const ny = head.y + state.dir.y;
        if (nx < 0 || ny < 0 || nx >= N || ny >= N || state.snake.some((p) => p.x === nx && p.y === ny)) {
            bumpReset();
            draw();
            return;
        }
        state.snake.unshift({ x: nx, y: ny });
        if (nx === state.food.x && ny === state.food.y) {
            state.eaten += 1;
            if (scoreEl) scoreEl.textContent = `⚽ ${state.eaten} / 5`;
            if (state.eaten >= 5) {
                state.alive = false;
                finishMiniGame(onWin);
                return;
            }
            placeFood();
        } else {
            state.snake.pop();
        }
        draw();
    }

    function draw() {
        ctx.fillStyle = "#7cb342";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgba(44,36,22,.12)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= N; i += 1) {
            ctx.beginPath();
            ctx.moveTo(i * cell, 0);
            ctx.lineTo(i * cell, canvas.width);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * cell);
            ctx.lineTo(canvas.width, i * cell);
            ctx.stroke();
        }
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#2c2416";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc((state.food.x + 0.5) * cell, (state.food.y + 0.5) * cell, cell * 0.32, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        state.snake.forEach((p, i) => {
            ctx.fillStyle = i === 0 ? "#e85d4c" : "#1d7a6f";
            ctx.fillRect(p.x * cell + 2, p.y * cell + 2, cell - 4, cell - 4);
        });
    }

    function onKey(event) {
        const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
        if (map[event.key]) {
            event.preventDefault();
            setDir(map[event.key]);
        }
    }
    document.addEventListener("keydown", onKey);
    board.querySelectorAll("[data-dir]").forEach((btn) => {
        btn.addEventListener("pointerdown", (event) => {
            event.preventDefault();
            setDir(btn.dataset.dir);
        });
    });
    draw();
    state.timer = setInterval(step, 170);
    return {
        stop() {
            state.alive = false;
            clearInterval(state.timer);
            document.removeEventListener("keydown", onKey);
        },
    };
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { miniGameKind, startMiniGame, stopMiniGame };
}
