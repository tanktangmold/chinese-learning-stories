const SCENE_ALIAS = {
    house: "island",
    kick: "firstkick",
    run: "daily",
    effort: "daily",
    goodbye: "academy",
    travel: "star",
};

const AVATARS = ["⚽", "🌟", "🐼", "🐶", "🌸", "🔥", "🌈", "🎯"];
const IMAGE_STYLES = ["comic", "picturebook", "realistic"];
const IMAGE_VERSION = "instant-svg-v1";
const CLASSROOM_KEY = "xiaoxue-classroom";
const STATIC_VOICES = [
    { id: "xiaoxiao", nameZh: "晓晓", nameJa: "女声・お姉さん", gender: "female", pitch: 1.12, rate: 0.9 },
    { id: "xiaoyi", nameZh: "晓伊", nameJa: "女声・やさしい", gender: "female", pitch: 1.18, rate: 0.88 },
    { id: "xiaohan", nameZh: "晓涵", nameJa: "女声・先生", gender: "female", pitch: 1.05, rate: 0.86 },
    { id: "yunxi", nameZh: "云希", nameJa: "男声・少年", gender: "male", pitch: 0.88, rate: 0.92 },
    { id: "yunyang", nameZh: "云扬", nameJa: "男声・お兄さん", gender: "male", pitch: 0.72, rate: 0.88 },
    { id: "yunjian", nameZh: "云健", nameJa: "男声・先生", gender: "male", pitch: 0.62, rate: 0.85 },
];

let staticMode = false;
let staticCourse = null;
let staticGames = null;

// Function words that make bad quiz targets.
const SKIP_WORDS = new Set([
    "他", "的", "了", "很", "在", "是", "也", "都", "不", "有", "和",
    "我", "你", "这", "还", "更", "就", "又", "要", "会", "把", "给", "从", "到",
]);

// One collectible sticker per course day.
const STICKERS = [
    "🏝️", "❤️", "👟", "🌞", "🐶", "🌳", "⭐", "📖", "🎈", "🌌",
    "⚽", "🚌", "🏫", "🌊", "📮", "💪", "🍚", "🌙", "🏥", "💗",
    "😢", "🗣️", "🏃", "🥇", "✈️", "🏟️", "🥅", "👏", "🏆", "🌍",
];

const PRAISE = [
    { zh: "太棒了！", ja: "すごい！" },
    { zh: "你真厉害！", ja: "きみ、天才！" },
    { zh: "进球啦！", ja: "ゴール！" },
    { zh: "好耳朵！", ja: "いい耳だね！" },
    { zh: "越来越好了！", ja: "どんどん上手になってる！" },
    { zh: "了不起！", ja: "かっこいい！" },
];

function pickPraise() {
    return PRAISE[Math.floor(Math.random() * PRAISE.length)];
}

function shuffle(list) {
    const out = [...list];
    for (let i = out.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
}

function stickerFor(day) {
    return STICKERS[(day - 1) % STICKERS.length];
}

// --- per-child word strength (which words need review) -------------------

function statsKey() {
    return "xiaoxue-stats-" + (state.child ? state.child.id : "anon");
}

function loadWordStats() {
    try {
        return JSON.parse(localStorage.getItem(statsKey()) || "{}") || {};
    } catch (_) {
        return {};
    }
}

function bumpWordStat(zh, field) {
    zh = String(zh || "").trim();
    if (!zh) return;
    const stats = loadWordStats();
    const entry = stats[zh] || { hit: 0, miss: 0 };
    entry[field] += 1;
    stats[zh] = entry;
    localStorage.setItem(statsKey(), JSON.stringify(stats));
}

const recordWordHit = (zh) => bumpWordStat(zh, "hit");
const recordWordMiss = (zh) => bumpWordStat(zh, "miss");

// --- gentle streak: counts days with a finished lesson, never scolds -----

function localDateString(date) {
    const d = date || new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function studyDaysKey() {
    return "xiaoxue-days-" + (state.child ? state.child.id : "anon");
}

function recordStudyDay() {
    let days = [];
    try {
        days = JSON.parse(localStorage.getItem(studyDaysKey()) || "[]") || [];
    } catch (_) {}
    const today = localDateString();
    if (!days.includes(today)) {
        days.push(today);
        localStorage.setItem(studyDaysKey(), JSON.stringify(days));
    }
}

function studyStreak() {
    let days = [];
    try {
        days = JSON.parse(localStorage.getItem(studyDaysKey()) || "[]") || [];
    } catch (_) {}
    const set = new Set(days);
    const cursor = new Date();
    if (!set.has(localDateString(cursor))) cursor.setDate(cursor.getDate() - 1);
    let streak = 0;
    while (set.has(localDateString(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

const state = {
    child: null,
    children: [],
    course: null,
    progress: null,
    info: null,
    day: 1,
    lesson: null,
    index: 0,
    heard: new Set(),
    seconds: 0,
    timer: null,
    style: localStorage.getItem("learn-style") || "comic",
    voice: localStorage.getItem("learn-voice") || "xiaoxiao",
    voices: [],
    audio: null,
    imageLoadTimer: null,
    imageSeq: 0,
    speakSeq: 0,
    slowRun: 0,
    speakFinish: null,
    avatar: "⚽",
    screen: "kids",
    practice: [],
    practiceIndex: 0,
    testScore: 0,
    game: null,
    gameIndex: 0,
    buildPicked: [],
    courseImagesPreloaded: false,
    warmup: [],
    warmupIndex: 0,
};

const $ = (id) => document.getElementById(id);

function showScreen(name) {
    state.screen = name;
    document.querySelectorAll(".screen").forEach((screen) => {
        screen.classList.toggle("active", screen.dataset.screen === name);
    });
    $("back-btn").hidden = name === "kids";
    $("child-chip").hidden = !state.child;
    if (state.child) {
        $("child-chip").textContent = `${state.child.avatar} ${state.child.name}`;
    }
    if (name !== "lesson") {
        stopTimer();
        stopSpeak();
    }
}

function sceneUrl(style, scene) {
    const id = SCENE_ALIAS[scene] || scene || "intro";
    return `images/${style}/${id}.webp`;
}

function lessonBeat(day, line) {
    if (state.lesson && Number(state.lesson.day) === Number(day) && state.lesson.lines && state.lesson.lines[line]) {
        return { beat: state.lesson.lines[line], scene: state.lesson.scene };
    }
    const lesson = (state.course && state.course.days[day - 1]) || (staticCourse && staticCourse.days[day - 1]);
    if (!lesson) return { beat: null, scene: "intro" };
    return { beat: lesson.lines[line], scene: lesson.scene };
}

function pictureConcept(zh, scene) {
    zh = String(zh || "");
    if (/手术|心跳|医生|医院/.test(zh)) return "hospital";
    if (/家里人|爸爸|妈妈|爱/.test(zh)) return "family";
    if (/离开|十二岁|打电话|想家|哭/.test(zh)) return "goodbye";
    if (/里斯本|学院|口音/.test(zh) || scene === "academy") return "academy";
    if (/英国|曼联|鼓掌|有名/.test(zh) || scene === "star") return "stadium";
    if (/训练|努力|射门|进球|两只脚/.test(zh)) return "training";
    if (/小岛|葡萄牙|家很小/.test(zh) || scene === "island" || scene === "house") return "island";
    return "play";
}

function picturePalette(style) {
    if (style === "picturebook") return { sky: "#fff3cf", sky2: "#d9f0ff", ground: "#cde8b5", ink: "#5c4a32", fill: "#fffaf0", sun: "#f7c96f", red: "#e66954", blue: "#78a6d8" };
    if (style === "realistic") return { sky: "#dfe8ef", sky2: "#f4efe4", ground: "#98b783", ink: "#2e2a22", fill: "#f2eadc", sun: "#c9a566", red: "#b94e42", blue: "#667f9b" };
    return { sky: "#c9f0ff", sky2: "#fff3b8", ground: "#72d06d", ink: "#2c2419", fill: "#fffdf2", sun: "#ffd34d", red: "#ef4f3d", blue: "#4aa3ff" };
}

function hashSeed(text) {
    let n = 0;
    String(text || "").split("").forEach((ch, i) => {
        n = (n + ch.charCodeAt(0) * (i + 3)) % 997;
    });
    return n;
}

function instantSentenceSvg(zh, scene, style) {
    const p = picturePalette(style);
    const concept = pictureConcept(zh, scene);
    const seed = hashSeed(zh + style);
    const boyX = 280 + (seed % 70);
    const ballX = 430 + (seed % 80);
    const extras = {
        hospital: `<rect x="70" y="250" width="200" height="130" rx="16" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/><rect x="150" y="280" width="36" height="70" fill="${p.red}"/><rect x="132" y="298" width="72" height="36" fill="${p.red}"/>`,
        family: `<path d="M80 390h210V250L185 180 80 250z" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/><rect x="140" y="300" width="50" height="90" fill="${p.blue}"/>`,
        goodbye: `<path d="M80 380h150v-90l-75-50-75 50z" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/><path d="M500 360 l30 30 h-60z" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>`,
        academy: `<rect x="70" y="230" width="230" height="150" rx="14" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/><rect x="100" y="270" width="44" height="50" fill="${p.blue}"/><rect x="170" y="270" width="44" height="50" fill="${p.blue}"/>`,
        stadium: `<path d="M50 330 C180 230 590 230 720 330 L670 400 C530 340 230 340 100 400z" fill="${p.blue}" stroke="${p.ink}" stroke-width="6"/>`,
        training: `<path d="M110 400h150M110 400v-100h150" fill="none" stroke="${p.ink}" stroke-width="8"/><path d="M90 430h40l-20-50zM210 430h40l-20-50z" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>`,
        island: `<path d="M60 380 C140 310 240 310 320 380" fill="${p.ground}" stroke="${p.ink}" stroke-width="6"/><path d="M90 375h140v-85l-70-50-70 50z" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/>`,
        play: `<path d="M70 390 C150 320 250 320 330 390" fill="${p.ground}" stroke="${p.ink}" stroke-width="6"/><circle cx="640" cy="90" r="40" fill="${p.sun}"/>`,
    };
    const label = String(zh || "").replace(/[<>&]/g, "");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 576">
<defs><linearGradient id="s" x1="0" x2="0" y1="0" y2="1"><stop stop-color="${p.sky}"/><stop offset="1" stop-color="${p.sky2}"/></linearGradient></defs>
<rect width="768" height="576" fill="url(#s)"/>
<ellipse cx="384" cy="520" rx="330" ry="58" fill="${p.ground}"/>
${extras[concept] || extras.play}
<g transform="translate(${boyX} 230)">
<path d="M58 148 l-24 70M104 148 l30 68" stroke="${p.ink}" stroke-width="16" stroke-linecap="round"/>
<path d="M42 84 h78 l20 70 H24z" fill="${p.red}" stroke="${p.ink}" stroke-width="6"/>
<circle cx="80" cy="50" r="38" fill="#f4c69b" stroke="${p.ink}" stroke-width="5"/>
<path d="M42 36 C50 2 100 -6 120 28 C98 16 80 26 66 16z" fill="#2b2118"/>
</g>
<g transform="translate(${ballX} 430)">
<circle r="30" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
<path d="M0 -16 L14 -4 L8 14 H-8 L-14 -4z" fill="${p.ink}"/>
</g>
<text x="384" y="548" text-anchor="middle" font-size="22" font-weight="700" fill="${p.ink}">${label}</text>
</svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function lineImageUrl(day, line, style) {
    const found = lessonBeat(day, line);
    const zh = found.beat && found.beat.sentence ? found.beat.sentence.zh : "";
    const scene = (found.beat && found.beat.scene) || found.scene;
    return instantSentenceSvg(zh, scene, style || state.style);
}

function loadClassroom() {
    try {
        const parsed = JSON.parse(localStorage.getItem(CLASSROOM_KEY) || "");
        if (parsed && Array.isArray(parsed.children) && parsed.progress && typeof parsed.progress === "object") {
            return parsed;
        }
    } catch (_) {}
    return { children: [], progress: {} };
}

function saveClassroom(room) {
    localStorage.setItem(CLASSROOM_KEY, JSON.stringify(room));
}

function emptyProgress(childId) {
    return { childId, currentDay: 1, completedDays: [], days: {} };
}

function addLocalChild(name, avatar) {
    name = String(name || "").replace(/\s+/g, "").slice(0, 12);
    if (!name) throw new Error("name required");
    if (!AVATARS.includes(avatar)) avatar = "⚽";
    const child = {
        id: "c" + Date.now().toString(16),
        name,
        avatar,
        createdAt: new Date().toISOString(),
    };
    const room = loadClassroom();
    room.children.push(child);
    room.progress[child.id] = emptyProgress(child.id);
    saveClassroom(room);
    return child;
}

function getLocalProgress(childId) {
    const room = loadClassroom();
    const progress = room.progress[childId];
    if (!progress) throw new Error("child not found");
    if (!progress.days) progress.days = {};
    if (!progress.completedDays) progress.completedDays = [];
    if (!progress.currentDay) progress.currentDay = 1;
    return progress;
}

function applyLocalProgress(childId, patch) {
    const day = Number(patch.day || 0);
    if (day < 1 || day > 30) throw new Error("day must be 1-30");
    const room = loadClassroom();
    const progress = room.progress[childId];
    if (!progress) throw new Error("child not found");
    if (!progress.days) progress.days = {};
    if (!progress.completedDays) progress.completedDays = [];
    if (day > 1) {
        const prev = progress.days[String(day - 1)];
        if (!prev || !prev.lessonDone) throw new Error("day " + day + " is locked");
    }
    const key = String(day);
    const dayState = progress.days[key] || { heard: [], lessonDone: false, gameDone: false, seconds: 0 };
    if (Array.isArray(patch.heard) && patch.heard.length) {
        dayState.heard = [...new Set([...(dayState.heard || []), ...patch.heard])];
    }
    if (Number(patch.seconds || 0) > (dayState.seconds || 0)) {
        dayState.seconds = Number(patch.seconds);
    }
    if (patch.lessonDone) {
        dayState.lessonDone = true;
        progress.completedDays = [...new Set([...(progress.completedDays || []), day])];
        if (day < 30 && (progress.currentDay || 1) < day + 1) progress.currentDay = day + 1;
        if (day === 30) progress.currentDay = 30;
    }
    if (patch.gameDone) {
        if (!dayState.lessonDone) throw new Error("先做完一轮测试，拿到9分满分");
        dayState.gameDone = true;
    }
    progress.days[key] = dayState;
    room.progress[childId] = progress;
    saveClassroom(room);
    return progress;
}

async function ensureStaticData() {
    if (staticCourse && staticGames) return;
    const [courseRes, gamesRes] = await Promise.all([
        fetch("data/course.json"),
        fetch("data/games.json"),
    ]);
    if (!courseRes.ok || !gamesRes.ok) {
        throw new Error("static course data missing");
    }
    staticCourse = await courseRes.json();
    staticGames = await gamesRes.json();
}

async function fetchApi(url, opts) {
    const res = await fetch(url, opts);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.detail || "error");
    return data;
}

function staticApi(url, opts) {
    const method = ((opts && opts.method) || "GET").toUpperCase();
    const parsed = new URL(url, "http://local.invalid");
    const path = parsed.pathname.replace(/\/+$/, "") || "/";
    if (path === "/api/children" && method === "GET") {
        return loadClassroom().children;
    }
    if (path === "/api/children" && method === "POST") {
        const body = JSON.parse((opts && opts.body) || "{}");
        return addLocalChild(body.name, body.avatar);
    }
    const progressMatch = path.match(/^\/api\/children\/([^/]+)\/progress$/);
    if (progressMatch && method === "GET") {
        return getLocalProgress(decodeURIComponent(progressMatch[1]));
    }
    if (progressMatch && method === "POST") {
        const body = JSON.parse((opts && opts.body) || "{}");
        return applyLocalProgress(decodeURIComponent(progressMatch[1]), body);
    }
    if (path === "/api/course" && method === "GET") {
        return staticCourse;
    }
    const dayMatch = path.match(/^\/api\/course\/day\/(\d+)$/);
    if (dayMatch && method === "GET") {
        const lesson = staticCourse.days[Number(dayMatch[1]) - 1];
        if (!lesson) throw new Error("day not found");
        return lesson;
    }
    const gameMatch = path.match(/^\/api\/game\/(\d+)$/);
    if (gameMatch && method === "GET") {
        const day = Number(gameMatch[1]);
        const childID = parsed.searchParams.get("child");
        if (childID) {
            const progress = getLocalProgress(childID);
            const st = progress.days[String(day)];
            if (!st || !st.lessonDone) throw new Error("先做完一轮测试，拿到9分满分");
        }
        const game = (staticGames || []).find((item) => item.day === day);
        if (!game) throw new Error("day not found");
        return game;
    }
    throw new Error("offline api missing");
}

function preloadCourseImages() {
    // Pictures are instant local SVGs. Do not prefetch the whole course.
    return;
}

function pickChineseVoice() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    const want = VoiceById(state.voice);
    const zh = voices.filter((v) => /zh|chinese|中文|普通话|台灣|台湾/i.test(`${v.name} ${v.lang}`));
    if (want.gender === "male") {
        return (
            zh.find((v) => /male|男|yun|kang|kangkang|yunyang|yunxi|yunjian/i.test(`${v.name} ${v.lang}`)) ||
            zh[0] ||
            null
        );
    }
    return (
        zh.find((v) => /female|女|ting|xiao|hui|yao|meijia/i.test(`${v.name} ${v.lang}`)) ||
        zh[0] ||
        null
    );
}

function VoiceById(id) {
    return (state.voices || []).find((v) => v.id === id) || { id: "xiaoxiao", gender: "female", pitch: 1.1, rate: 0.9 };
}

const ttsBlobs = new Map();
const ttsPending = new Map();

function ttsKey(text) {
    return `${state.voice}|${String(text || "").trim()}`;
}

function ttsApiUrl(text) {
    return `/api/tts?voice=${encodeURIComponent(state.voice)}&text=${encodeURIComponent(text)}`;
}

function releaseTtsUrl(url) {
    if (!url) return;
    if (state.audio && state.audio.src === url) return;
    try {
        URL.revokeObjectURL(url);
    } catch (_) {}
}

function rememberTts(key, url) {
    if (ttsBlobs.has(key)) {
        const old = ttsBlobs.get(key);
        ttsBlobs.delete(key);
        if (old !== url) releaseTtsUrl(old);
    }
    ttsBlobs.set(key, url);
    while (ttsBlobs.size > 80) {
        const oldest = ttsBlobs.keys().next().value;
        releaseTtsUrl(ttsBlobs.get(oldest));
        ttsBlobs.delete(oldest);
    }
}

function fetchTtsBlob(text) {
    text = String(text || "").trim();
    if (!text) return Promise.resolve("");
    const key = ttsKey(text);
    if (ttsBlobs.has(key)) return Promise.resolve(ttsBlobs.get(key));
    if (ttsPending.has(key)) return ttsPending.get(key);
    const pending = fetch(ttsApiUrl(text))
        .then((res) => {
            if (!res.ok) throw new Error("tts failed");
            return res.blob();
        })
        .then((blob) => {
            const url = URL.createObjectURL(blob);
            rememberTts(key, url);
            ttsPending.delete(key);
            return url;
        })
        .catch((err) => {
            ttsPending.delete(key);
            throw err;
        });
    ttsPending.set(key, pending);
    return pending;
}

function prefetchTts(texts) {
    const seen = new Set();
    (texts || []).forEach((text) => {
        text = String(text || "").trim();
        if (!text || seen.has(text)) return;
        seen.add(text);
        fetchTtsBlob(text).catch(() => {});
    });
}

function prefetchLessonAudio() {
    if (!state.lesson) return;
    const beat = currentBeat();
    const texts = [beat.sentence.zh];
    (beat.sentence.tokens || []).forEach((token) => texts.push(token.zh));
    const next = state.lesson.lines[state.index + 1];
    if (next) texts.push(next.sentence.zh);
    prefetchTts(texts);
}

function detachAudio(audio) {
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
    audio.oncanplay = null;
    audio.oncanplaythrough = null;
    try {
        audio.pause();
    } catch (_) {}
    try {
        audio.removeAttribute("src");
        audio.load();
    } catch (_) {}
}

function takeSpeakFinish() {
    const fn = state.speakFinish;
    state.speakFinish = null;
    if (fn) fn();
}

function stopSpeak(opts) {
    state.speakSeq += 1;
    if (!opts || !opts.keepSlow) state.slowRun += 1;
    detachAudio(state.audio);
    state.audio = null;
    if (window.speechSynthesis) speechSynthesis.cancel();
    takeSpeakFinish();
}

function speakWeb(text, onend, profile, seq) {
    if (!window.speechSynthesis || !text) {
        if (seq === state.speakSeq && onend) onend();
        return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    const voice = pickChineseVoice();
    utter.lang = voice ? voice.lang : "zh-CN";
    if (voice) utter.voice = voice;
    utter.rate = profile.rate || 0.88;
    utter.pitch = profile.pitch || 1;
    utter.onend = () => {
        if (seq !== state.speakSeq) return;
        if (onend) onend();
    };
    utter.onerror = () => {
        if (seq !== state.speakSeq) return;
        if (onend) onend();
    };
    speechSynthesis.speak(utter);
}

function playAudioSrc(src, text, onend, profile, seq) {
    const audio = new Audio();
    audio.preload = "auto";
    state.audio = audio;
    const alive = () => seq === state.speakSeq && state.audio === audio;
    const done = () => {
        if (!alive()) return;
        detachAudio(audio);
        if (state.audio === audio) state.audio = null;
        if (onend) onend();
    };
    audio.onended = done;
    audio.onerror = () => {
        if (!alive()) return;
        detachAudio(audio);
        if (state.audio === audio) state.audio = null;
        speakWeb(text, onend, profile, seq);
    };
    audio.src = src;
    const tryPlay = () => {
        if (!alive()) return;
        const play = audio.play();
        if (play && play.catch) {
            play.catch(() => {
                if (!alive()) return;
                const retry = () => {
                    if (!alive()) return;
                    audio.play().catch(() => {});
                };
                audio.addEventListener("canplay", retry, { once: true });
            });
        }
    };
    tryPlay();
}

function speakChinese(text, onend, opts) {
    stopSpeak(opts);
    const seq = state.speakSeq;
    const profile = VoiceById(state.voice);
    const finish = () => {
        if (state.speakFinish === finish) state.speakFinish = null;
        if (onend) {
            const cb = onend;
            onend = null;
            cb();
        }
    };
    state.speakFinish = finish;
    text = String(text || "").trim();
    if (!text) {
        finish();
        return;
    }
    const cached = ttsBlobs.get(ttsKey(text));
    if (staticMode) {
        speakWeb(text, finish, profile, seq);
        return;
    }
    playAudioSrc(cached || ttsApiUrl(text), text, finish, profile, seq);
    if (!cached) fetchTtsBlob(text).catch(() => {});
}

function markHeard(index) {
    state.heard.add(index);
    saveProgress({ heard: [...state.heard] });
    renderDots();
}

async function api(url, opts) {
    if (staticMode) return staticApi(url, opts);
    return fetchApi(url, opts);
}

async function loadKids() {
    if (!staticMode) {
        try {
            state.children = await fetchApi("/api/children");
            state.info = await fetchApi("/api/server-info").catch(() => null);
            state.voices = await fetchApi("/api/voices").catch(() => STATIC_VOICES);
            renderKids();
            renderVoices();
            return;
        } catch (_) {
            staticMode = true;
        }
    }
    await ensureStaticData();
    if (staticCourse) state.course = staticCourse;
    state.children = loadClassroom().children;
    state.voices = STATIC_VOICES;
    state.info = {
        hintJa: "このページはブラウザだけで開けるよ。進みはこの端末に保存されるよ。",
        hintZh: "平板可以直接打开。进度保存在这台设备上，不用开电脑。",
        lanUrls: [location.href.split("#")[0]],
    };
    renderKids();
    renderVoices();
}

function isStandaloneApp() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function setupTabletChrome() {
    const hint = $("install-hint");
    if (hint) hint.hidden = isStandaloneApp();
    if (!("serviceWorker" in navigator)) return;
    const local = location.hostname === "localhost" || location.hostname === "127.0.0.1";
    if (location.protocol !== "https:" && !local) return;
    navigator.serviceWorker.register("sw.js").catch(() => {});
}

function renderKids() {
    const grid = $("kid-grid");
    grid.innerHTML = "";
    const last = localStorage.getItem("learn-child");
    state.children.forEach((child) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "kid-card" + (child.id === last ? " last-child" : "");
        const face = document.createElement("span");
        face.className = "kid-face";
        face.textContent = AVATARS.includes(child.avatar) ? child.avatar : "⚽";
        const name = document.createElement("strong");
        name.textContent = child.name;
        btn.append(face, name);
        if (child.id === last) {
            const mark = document.createElement("small");
            mark.textContent = "前回";
            btn.append(mark);
        }
        btn.addEventListener("click", () => selectChild(child));
        grid.appendChild(btn);
    });
    if (!state.children.length) {
        grid.innerHTML = `<p class="muted">まだだれもいないよ。したからなまえを入れてね。</p>`;
    }
    if (state.info) {
        const urls = state.info.lanUrls || [];
        $("lan-hint").textContent = urls.length
            ? `${state.info.hintJa} ${urls.join("  ")}`
            : "手机/iPad打不开时：请确认和电脑在同一个 Wi-Fi，并用电脑的 Wi-Fi IP 打开，例如 http://192.168.x.x:8080。云端机器的 172.x 地址手机通常打不开。";
    } else {
        $("lan-hint").textContent = "";
    }
    const row = $("avatar-row");
    row.innerHTML = "";
    AVATARS.forEach((avatar) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "avatar-pick" + (avatar === state.avatar ? " active" : "");
        btn.textContent = avatar;
        btn.addEventListener("click", () => {
            state.avatar = avatar;
            renderKids();
        });
        row.appendChild(btn);
    });
}

function lessonFromCourse(day) {
    const list = (state.course && state.course.days) || (staticCourse && staticCourse.days) || [];
    return list.find((item) => Number(item.day) === Number(day)) || list[day - 1] || null;
}

function showCalendarError(message) {
    const lead = $("calendar-lead");
    if (lead) lead.textContent = message;
}

async function selectChild(child, startDay) {
    try {
        state.child = child;
        localStorage.setItem("learn-child", child.id);
        if (!state.course || !state.course.days) {
            state.course = staticCourse || (await api("/api/course"));
        }
        state.progress = await api(`/api/children/${child.id}/progress`);
        preloadCourseImages();
        renderCalendar();
        showScreen("calendar");
        if (startDay) await openDay(startDay);
    } catch (err) {
        console.error(err);
        showCalendarError("还没打开课程。再点一次头像，或刷新页面。");
        showScreen("calendar");
    }
}

function dayState(day) {
    return (state.progress && state.progress.days && state.progress.days[String(day)]) || null;
}

function isUnlocked(day) {
    if (day <= 1) return true;
    const prev = dayState(day - 1);
    return !!(prev && prev.lessonDone);
}

function renderCalendar() {
    $("calendar-title").textContent = `${state.child.avatar} ${state.child.name} の30日`;
    const done = ((state.progress && state.progress.completedDays) || []).length;
    const streak = studyStreak();
    const streakNote = streak >= 2 ? `　🔥 ${streak}日つづけてがんばってるね！` : "";
    $("calendar-lead").textContent = `クリア ${done} / 30日。一轮のあと9点テスト。満点でゲームと次の一轮。${streakNote}`;
    const startBtn = $("start-day-btn");
    if (startBtn) {
        const nextDay = done < 30 ? done + 1 : 1;
        startBtn.hidden = false;
        startBtn.textContent = nextDay === 1 ? "⚽ 第1天开始" : `⚽ 第${nextDay}天`;
        startBtn.onclick = () => openDay(nextDay);
    }
    const grid = $("month-grid");
    grid.innerHTML = "";
    const days = (state.course && state.course.days) || [];
    days.forEach((lesson) => {
        const st = dayState(lesson.day);
        const unlocked = isUnlocked(lesson.day);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "day-cell";
        if (!unlocked) btn.classList.add("locked");
        if (st && st.lessonDone) btn.classList.add("done");
        if (st && st.gameDone) btn.classList.add("played");
        btn.disabled = !unlocked;
        const mark = st && st.lessonDone ? `<i class="cell-sticker">${stickerFor(lesson.day)}</i>` : "";
        btn.innerHTML = `<em>${lesson.day}</em><span>${escapeHtml(lesson.title.ja)}</span>${mark}`;
        btn.addEventListener("click", () => openDay(lesson.day));
        grid.appendChild(btn);
    });
}

async function openDay(day) {
    try {
        const lesson = lessonFromCourse(day) || (await api(`/api/course/day/${day}`));
        if (!lesson || !lesson.lines || !lesson.lines.length) {
            throw new Error("day not found");
        }
        state.day = day;
        state.lesson = lesson;
        const st = dayState(day);
        state.index = 0;
        state.heard = new Set(st && st.heard ? st.heard : []);
        state.seconds = st && st.seconds ? st.seconds : 0;
        const isNewDay = !(st && st.lessonDone);
        if (isNewDay && day > 1 && startWarmup()) return;
        enterLesson();
    } catch (err) {
        console.error(err);
        showCalendarError("第" + day + "天暂时打不开。请刷新后再点一次。");
        showScreen("calendar");
    }
}

function enterLesson() {
    try {
        renderStyles();
        renderVoices();
        renderLesson();
        showScreen("lesson");
        if ($("timer-label")) $("timer-label").textContent = "听故事";
    } catch (err) {
        console.error(err);
        showCalendarError("课文打不开。请刷新页面后再试。");
        showScreen("calendar");
    }
}

// --- warm-up: 3 quick review questions from already-finished days ---------

function reviewableWords() {
    const doneDays = new Set(state.progress.completedDays || []);
    const seen = new Set();
    const words = [];
    (state.course.days || []).forEach((lesson) => {
        if (!doneDays.has(lesson.day)) return;
        (lesson.lines || []).forEach((beat) => {
            (beat.sentence.tokens || []).forEach((token) => {
                if (SKIP_WORDS.has(token.zh) || seen.has(token.zh) || !token.pinyin) return;
                seen.add(token.zh);
                words.push(token);
            });
        });
    });
    return words;
}

function startWarmup() {
    const candidates = reviewableWords();
    if (candidates.length < 4) return false;
    const stats = loadWordStats();
    const score = (token) => {
        const entry = stats[token.zh] || { hit: 0, miss: 0 };
        return entry.miss * 2 - entry.hit;
    };
    const ranked = [...candidates].sort((a, b) => score(b) - score(a));
    const weak = ranked.slice(0, 2);
    const rest = shuffle(candidates.filter((t) => !weak.includes(t)));
    const picks = shuffle(weak.concat(rest).slice(0, 3));
    state.warmup = picks.map((word) => {
        const others = shuffle(candidates.filter((t) => t.zh !== word.zh)).slice(0, 2).map((t) => t.zh);
        return { word, options: shuffle([word.zh, ...others]) };
    });
    state.warmupIndex = 0;
    renderWarmup();
    showScreen("warmup");
    return true;
}

function renderWarmup() {
    const item = state.warmup[state.warmupIndex];
    const card = $("warmup-card");
    if (!item) {
        const praise = pickPraise();
        speakChinese(praise.zh);
        enterLesson();
        return;
    }
    card.innerHTML = `<p class="practice-q">${state.warmupIndex + 1} / ${state.warmup.length}</p>
        <button type="button" class="primary-btn big" id="warmup-play">▶ 中国語を聞く</button>
        <p class="lead">${escapeHtml(item.word.ja || "")} はどれ？</p>
        <div class="choice-grid" id="warmup-choices"></div>`;
    $("warmup-play").addEventListener("click", () => speakChinese(item.word.zh));
    speakChinese(item.word.zh);
    const grid = $("warmup-choices");
    item.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
            if (opt === item.word.zh) {
                recordWordHit(item.word.zh);
                state.warmupIndex += 1;
                renderWarmup();
            } else {
                recordWordMiss(item.word.zh);
                btn.classList.add("wrong");
                speakChinese(item.word.zh);
            }
        });
        grid.appendChild(btn);
    });
}

// --- sticker album ---------------------------------------------------------

function learnedWordCount() {
    return reviewableWords().length;
}

function renderReport() {
    $("report-title").textContent = `${state.child.avatar} ${state.child.name} の保護者メモ`;
    const done = state.progress.completedDays || [];
    const words = reviewableWords();
    const stats = loadWordStats();
    const weak = words
        .map((token) => {
            const entry = stats[token.zh] || { hit: 0, miss: 0 };
            return { token, miss: entry.miss, hit: entry.hit, score: entry.miss * 2 - entry.hit };
        })
        .filter((row) => row.miss > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);
    const streak = studyStreak();
    const grid = $("report-grid");
    const weakLine = weak.length
        ? weak.map((row) => `${row.token.zh}（${row.token.ja || row.token.pinyin}）`).join("、")
        : "まだ苦手な語は記録されていません。";
    grid.innerHTML = `
        <article class="report-card"><h2>クリアした日</h2><p>${done.length} / 30日</p></article>
        <article class="report-card"><h2>おぼえたことば</h2><p>${words.length}こ</p></article>
        <article class="report-card"><h2>れんぞく</h2><p>${streak >= 2 ? streak + "日" : "まだこれから"}</p></article>
        <article class="report-card wide"><h2>もう一度聞きたい語</h2><p>${escapeHtml(weakLine)}</p></article>
        <p class="muted">このメモは親向けです。子どもが答えを間違えても減点しません。</p>`;
}

function renderAlbum() {
    $("album-title").textContent = `${state.child.avatar} ${state.child.name} のシールちょう`;
    const done = (state.progress.completedDays || []).length;
    const words = learnedWordCount();
    const streak = studyStreak();
    const parts = [`シール ${done} / 30`, `おぼえたことば ${words}こ`];
    if (streak >= 2) parts.push(`🔥 ${streak}日れんぞく`);
    $("album-lead").textContent = parts.join("　·　");
    const grid = $("album-grid");
    grid.innerHTML = "";
    const doneDays = new Set(state.progress.completedDays || []);
    state.course.days.forEach((lesson) => {
        const cell = document.createElement("div");
        cell.className = "sticker-cell" + (doneDays.has(lesson.day) ? " earned" : "");
        const face = doneDays.has(lesson.day) ? stickerFor(lesson.day) : "？";
        cell.innerHTML = `<span class="sticker-face">${face}</span><small>${lesson.day}日</small>`;
        grid.appendChild(cell);
    });
}

function startTimer() {
    // 15-minute gate removed: one story round + 9-point test instead.
}

function stopTimer() {
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
}

function updateTimer() {
    const m = String(Math.floor(state.seconds / 60)).padStart(2, "0");
    const s = String(state.seconds % 60).padStart(2, "0");
    $("timer-label").textContent = `${m}:${s}`;
}

function currentBeat() {
    return state.lesson.lines[state.index];
}

function renderStyles() {
    const bar = $("style-bar");
    bar.innerHTML = "";
    IMAGE_STYLES.forEach((id, i) => {
        const ja = ["まんが", "えほん", "リアル"][i];
        const icon = ["🎨", "📖", "🌿"][i];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "style-btn" + (id === state.style ? " active" : "");
        btn.innerHTML = `<span class="style-icon" aria-hidden="true">${icon}</span><span>${ja}</span>`;
        btn.addEventListener("click", () => {
            state.style = id;
            localStorage.setItem("learn-style", id);
            renderStyles();
            renderLesson();
        });
        bar.appendChild(btn);
    });
}

function renderVoices() {
    const bar = $("voice-bar");
    if (!bar) return;
    bar.innerHTML = "";
    (state.voices || []).forEach((voice) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "voice-btn" + (voice.id === state.voice ? " active" : "");
        btn.textContent = `${voice.gender === "female" ? "♀" : "♂"} ${voice.nameJa}`;
        btn.addEventListener("click", () => {
            state.voice = voice.id;
            localStorage.setItem("learn-voice", voice.id);
            renderVoices();
            prefetchLessonAudio();
            speakChinese("你好，我是" + voice.nameZh);
        });
        bar.appendChild(btn);
    });
}

function renderLesson() {
    const beat = currentBeat();
    const lesson = state.lesson;
    $("day-moral").textContent = `${lesson.title.ja}　${lesson.moral.ja}`;
    const frame = $("picture-frame");
    const loading = $("picture-loading");
    if (frame) frame.classList.remove("loading");
    if (loading) loading.hidden = true;
    if (typeof paintSentencePicture === "function") {
        paintSentencePicture($("scene-art"), beat.sentence.zh, beat.scene || lesson.scene, state.style);
    } else if ($("scene-art")) {
        $("scene-art").textContent = beat.sentence.zh;
    }
    const art = $("scene-art");
    if (art) art.setAttribute("aria-label", beat.sentence.zh);
    $("scene-caption").textContent = `${lesson.day}日目 · ${state.index + 1} / ${lesson.lines.length}　${beat.sentence.zh}`;
    if (state.index + 1 < lesson.lines.length) {
        /* pictures are inline SVG; no network preload */
    }
    $("pattern-card").innerHTML = `<div class="pattern-label">句型</div>
        <p class="pattern-zh">${escapeHtml(beat.pattern.zh)}</p>
        <p class="pattern-ja">${escapeHtml(beat.pattern.ja)}</p>`;
    $("sentence-pinyin").hidden = true;
    $("sentence-ja").textContent = beat.sentence.ja;
    $("sentence-words").innerHTML = "";
    (beat.sentence.tokens || []).forEach((token) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "word";
        btn.setAttribute("aria-label", `${token.zh} ${token.pinyin || ""}`.trim());
        btn.innerHTML = wordWithPinyin(token);
        btn.addEventListener("click", (event) => {
            event.stopPropagation();
            speakChinese(token.zh);
            markHeard(state.index);
        });
        $("sentence-words").appendChild(btn);
    });
    renderDots();
    $("prev-btn").disabled = state.index === 0;
    const last = state.index === lesson.lines.length - 1;
    const allHeard = lesson.lines.every((_, i) => state.heard.has(i));
    $("next-btn").textContent = last && allHeard ? "一轮测试へ" : last ? "ぜんぶ聞こう" : "つぎの文";
    prefetchLessonAudio();
}

function wordWithPinyin(token) {
    const pinyin = escapeHtml(token.pinyin || "");
    return `<span class="ruby-word"><span class="ruby-pinyin">${pinyin}</span><span class="ruby-zh">${escapeHtml(token.zh)}</span></span>`;
}

function renderDots() {
    const path = $("progress-path");
    path.innerHTML = "";
    state.lesson.lines.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "dot";
        if (i === state.index) dot.classList.add("current");
        if (state.heard.has(i)) dot.classList.add("done");
        dot.addEventListener("click", () => {
            state.index = i;
            renderLesson();
        });
        path.appendChild(dot);
    });
}

function go(delta) {
    const next = state.index + delta;
    if (next < 0) return;
    if (next >= state.lesson.lines.length) {
        const allHeard = state.lesson.lines.every((_, i) => state.heard.has(i));
        if (!allHeard) {
            speakChinese("再听一听。");
            return;
        }
        openPractice();
        return;
    }
    state.index = next;
    renderLesson();
}

const TEST_SIZE = 9;
const TEST_WORD_COUNT = 6;

function uniqueTokens(list) {
    const seen = new Set();
    const out = [];
    (list || []).forEach((token) => {
        if (!token || !token.zh || seen.has(token.zh)) return;
        seen.add(token.zh);
        out.push(token);
    });
    return out;
}

function testWordPool() {
    const today = [];
    (state.lesson.lines || []).forEach((beat) => {
        (beat.sentence.tokens || []).forEach((token) => {
            if (SKIP_WORDS.has(token.zh) || !token.pinyin) return;
            today.push(token);
        });
    });
    const primary = uniqueTokens(today);
    const seen = new Set(primary.map((token) => token.zh));
    const review = state.progress
        ? uniqueTokens(reviewableWords()).filter((token) => !seen.has(token.zh))
        : [];
    return primary.concat(review);
}

function buildNineTest() {
    const pool = testWordPool();
    const lines = (state.lesson.lines || []).filter((beat) => beat.sentence && beat.sentence.zh && beat.sentence.ja);
    const wordN = Math.min(TEST_WORD_COUNT, pool.length, TEST_SIZE);
    const items = [];
    shuffle(pool).slice(0, wordN).forEach((word) => {
        const options = [word.zh];
        shuffle(pool).forEach((other) => {
            if (other.zh !== word.zh && options.length < 4) options.push(other.zh);
        });
        items.push({
            kind: "word",
            speak: word.zh,
            prompt: `${word.ja || ""} はどれ？`,
            options: shuffle(options),
            answer: word.zh,
            word,
        });
    });
    const sentenceN = TEST_SIZE - items.length;
    const sentSource = shuffle(lines.slice());
    for (let i = 0; i < sentenceN && sentSource.length; i += 1) {
        const beat = sentSource[i % sentSource.length];
        const options = [beat.sentence.ja];
        shuffle(lines).forEach((other) => {
            if (other.sentence.ja !== beat.sentence.ja && options.length < 3) {
                options.push(other.sentence.ja);
            }
        });
        items.push({
            kind: "sentence",
            speak: beat.sentence.zh,
            prompt: "この文の意味はどれ？",
            options: shuffle(options),
            answer: beat.sentence.ja,
            word: (beat.sentence.tokens || []).find((token) => token.pinyin && !SKIP_WORDS.has(token.zh)) || null,
        });
    }
    let pad = 0;
    while (items.length < TEST_SIZE && lines.length) {
        const beat = lines[pad % lines.length];
        pad += 1;
        items.push({
            kind: "sentence",
            speak: beat.sentence.zh,
            prompt: "この文の意味はどれ？",
            options: [beat.sentence.ja],
            answer: beat.sentence.ja,
            word: null,
        });
    }
    return shuffle(items).slice(0, TEST_SIZE);
}

function paintTestLead() {
    const lead = $("test-lead");
    if (!lead) return;
    lead.textContent = `いま ${state.testScore} / ${TEST_SIZE}。第一次按的算分。9分才能玩游戏、进入下一轮。`;
}

function openPractice() {
    stopTimer();
    state.practice = buildNineTest();
    state.practiceIndex = 0;
    state.testScore = 0;
    paintTestLead();
    renderPractice();
    showScreen("practice");
}

function renderPractice() {
    const item = state.practice[state.practiceIndex];
    const card = $("practice-card");
    if (!item) {
        if (state.testScore >= TEST_SIZE) {
            finishLesson();
            return;
        }
        renderTestRetry();
        return;
    }
    paintTestLead();
    card.innerHTML = `<p class="practice-q">${state.practiceIndex + 1} / ${TEST_SIZE}　·　<span class="test-score">${state.testScore} 点</span></p>
        <button type="button" class="primary-btn big" id="practice-play">▶ 中国語を聞く</button>
        <p class="test-speak">${escapeHtml(item.speak)}</p>
        <p class="lead">${escapeHtml(item.prompt)}</p>
        <div class="choice-grid" id="practice-choices"></div>`;
    $("practice-play").addEventListener("click", () => speakChinese(item.speak));
    speakChinese(item.speak);
    const grid = $("practice-choices");
    item.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn" + (String(opt).length > 12 ? " long" : "");
        btn.textContent = opt;
        btn.addEventListener("click", () => gradeTestChoice(item, opt, btn, grid));
        grid.appendChild(btn);
    });
}

function gradeTestChoice(item, opt, btn, grid) {
    if (item.answered) return;
    item.answered = true;
    const ok = opt === item.answer;
    if (ok) {
        state.testScore += 1;
        if (item.word) recordWordHit(item.word.zh);
        btn.classList.add("ok");
    } else {
        if (item.word) recordWordMiss(item.word.zh);
        btn.classList.add("wrong");
        grid.querySelectorAll(".choice-btn").forEach((choice) => {
            if (choice.textContent === item.answer) choice.classList.add("ok");
        });
        speakChinese(item.speak);
    }
    paintTestLead();
    const q = cardQuery();
    if (q) q.innerHTML = `${state.practiceIndex + 1} / ${TEST_SIZE}　·　<span class="test-score">${state.testScore} 点</span>`;
    setTimeout(() => {
        state.practiceIndex += 1;
        renderPractice();
    }, 700);
}

function cardQuery() {
    const card = $("practice-card");
    return card ? card.querySelector(".practice-q") : null;
}

function renderTestRetry() {
    const card = $("practice-card");
    const lead = $("test-lead");
    if (lead) lead.textContent = "もう一回、耳をすませてみよう。";
    card.innerHTML = `<p class="practice-q">いまは ${state.testScore} / ${TEST_SIZE}</p>
        <p class="lead">9点になったら、ゲーム1回と次の一轮。</p>
        <button type="button" class="primary-btn big" id="retry-test">もう一回テスト</button>
        <button type="button" class="nav-btn" id="retry-listen">お話をもう一度聞く</button>`;
    $("retry-test").addEventListener("click", () => openPractice());
    $("retry-listen").addEventListener("click", () => enterLesson());
}

function goNextRound() {
    if (state.day < 30) {
        openDay(state.day + 1);
        return;
    }
    renderCalendar();
    showScreen("calendar");
}

async function finishLesson() {
    await saveProgress({
        heard: [...state.heard],
        lessonDone: true,
        seconds: state.seconds,
    });
    recordStudyDay();
    const praise = pickPraise();
    $("reward-title").textContent = "9分満点！";
    $("reward-moral").textContent = `${praise.ja}　${state.lesson.moral.ja}`;
    const stickerLine = $("reward-sticker");
    if (stickerLine) {
        stickerLine.hidden = false;
        stickerLine.textContent = `きょうのシール：${stickerFor(state.day)}　シールちょうにはったよ`;
    }
    const nextBtn = $("next-round-btn");
    if (nextBtn) nextBtn.textContent = state.day < 30 ? "继续下一轮" : "カレンダーへ";
    showScreen("reward");
    burstConfetti();
    speakChinese(praise.zh);
}

function burstConfetti() {
    const box = $("confetti");
    if (!box) return;
    box.innerHTML = "";
    const bits = ["⭐", "🎉", "⚽", "✨", "🌟"];
    for (let i = 0; i < 18; i++) {
        const bit = document.createElement("span");
        bit.className = "confetti-bit";
        bit.textContent = bits[i % bits.length];
        bit.style.left = `${Math.random() * 100}%`;
        bit.style.animationDelay = `${Math.random() * 0.6}s`;
        bit.style.fontSize = `${16 + Math.random() * 18}px`;
        box.appendChild(bit);
    }
    setTimeout(() => {
        box.innerHTML = "";
    }, 2600);
}

async function saveProgress(extra) {
    if (!state.child || !state.lesson) return;
    const patch = {
        day: state.day,
        seconds: state.seconds,
        ...extra,
    };
    try {
        state.progress = await api(`/api/children/${state.child.id}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(patch),
        });
    } catch (err) {
        console.error(err);
    }
}

async function openGame() {
    try {
        state.game = await api(`/api/game/${state.day}?child=${encodeURIComponent(state.child.id)}`);
    } catch (err) {
        $("game-hint").textContent = err.message;
        showScreen("game");
        return;
    }
    state.gameIndex = 0;
    state.buildPicked = [];
    $("game-title").textContent = state.game.title.ja;
    $("game-hint").textContent = state.game.hint.ja;
    renderGame();
    showScreen("game");
}

function renderGame() {
    const board = $("game-board");
    const item = state.game.items[state.gameIndex];
    if (!item) {
        board.innerHTML = `<p class="stamp">🎉</p><p class="lead">ゲームクリア！</p>
            <button type="button" class="primary-btn big" id="game-next-round">${state.day < 30 ? "继续下一轮" : "カレンダーへ"}</button>
            <button type="button" class="nav-btn" id="game-done">カレンダーへ</button>`;
        const afterGame = async () => {
            await saveProgress({ lessonDone: true, gameDone: true });
        };
        $("game-next-round").addEventListener("click", async () => {
            await afterGame();
            goNextRound();
        });
        $("game-done").addEventListener("click", async () => {
            await afterGame();
            renderCalendar();
            showScreen("calendar");
        });
        return;
    }
    if (state.game.kind === "build") {
        renderBuild(board, item);
        return;
    }
    board.innerHTML = `<p class="practice-q">${state.gameIndex + 1} / ${state.game.items.length}</p>
        <p class="game-prompt">${escapeHtml(item.prompt.zh)}</p>
        <p class="muted">${escapeHtml(item.prompt.ja)}</p>
        <button type="button" class="nav-btn" id="game-play">▶ 聞く</button>
        <div class="choice-grid" id="game-choices"></div>`;
    $("game-play").addEventListener("click", () => speakChinese(item.audioZh || item.prompt.zh));
    speakChinese(item.audioZh || item.prompt.zh);
    const grid = $("game-choices");
    item.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
            const isWordQuiz = state.game.kind === "listen-pick";
            if (i === item.answer) {
                if (isWordQuiz) recordWordHit(item.audioZh);
                state.gameIndex += 1;
                renderGame();
            } else {
                if (isWordQuiz) recordWordMiss(item.audioZh);
                btn.classList.add("wrong");
                speakChinese(item.audioZh || item.prompt.zh);
            }
        });
        grid.appendChild(btn);
    });
}

function renderBuild(board, item) {
    const picked = state.buildPicked;
    const target = (item.tokens || []).map((t) => t.zh).join("");
    board.innerHTML = `<p class="practice-q">${state.gameIndex + 1} / ${state.game.items.length}</p>
        <button type="button" class="nav-btn" id="game-play">▶ 文を聞く</button>
        <p class="build-line" id="build-line">${picked.join(" ") || "……"}</p>
        <div class="choice-grid" id="game-choices"></div>`;
    $("game-play").addEventListener("click", () => speakChinese(item.audioZh));
    const grid = $("game-choices");
    item.options.forEach((opt) => {
        const used = picked.filter((p) => p === opt).length;
        const total = item.options.filter((p) => p === opt).length;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "choice-btn";
        btn.textContent = opt;
        if (used >= total) btn.disabled = true;
        btn.addEventListener("click", () => {
            state.buildPicked.push(opt);
            if (state.buildPicked.join("") === target) {
                state.gameIndex += 1;
                state.buildPicked = [];
                renderGame();
                return;
            }
            if (state.buildPicked.join("").length >= target.length && state.buildPicked.join("") !== target) {
                state.buildPicked = [];
            }
            renderBuild(board, item);
        });
        grid.appendChild(btn);
    });
}

function escapeHtml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function onTap(id, fn) {
    const el = $(id);
    if (!el) return;
    el.addEventListener("click", fn);
}

$("add-kid").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = $("kid-name").value.trim();
    if (!name) return;
    try {
        const child = await api("/api/children", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, avatar: state.avatar }),
        });
        $("kid-name").value = "";
        await loadKids();
        await selectChild(child, 1);
    } catch (err) {
        console.error(err);
        if ($("lan-hint")) $("lan-hint").textContent = "名字保存失败。请再按一次「つくる」。";
    }
});

$("back-btn").addEventListener("click", () => {
    if (state.screen === "lesson" || state.screen === "practice" || state.screen === "reward" || state.screen === "game") {
        stopTimer();
        saveProgress({ seconds: state.seconds, heard: [...state.heard] });
        renderCalendar();
        showScreen("calendar");
        return;
    }
    if (state.screen === "warmup" || state.screen === "album" || state.screen === "report") {
        renderCalendar();
        showScreen("calendar");
        return;
    }
    showScreen("kids");
});

onTap("album-btn", () => {
    renderAlbum();
    showScreen("album");
});

onTap("report-btn", () => {
    renderReport();
    showScreen("report");
});

onTap("warmup-skip", () => enterLesson());

$("child-chip").addEventListener("click", () => showScreen("kids"));
$("sentence-card").addEventListener("click", () => {
    if (!state.lesson) return;
    speakChinese(currentBeat().sentence.zh);
    markHeard(state.index);
});
$("prev-btn").addEventListener("click", () => go(-1));
$("next-btn").addEventListener("click", () => go(1));
$("slow-btn").addEventListener("click", async () => {
    const beat = currentBeat();
    const runId = state.slowRun + 1;
    state.slowRun = runId;
    for (const token of beat.sentence.tokens || []) {
        if (runId !== state.slowRun) return;
        await new Promise((resolve) => speakChinese(token.zh, resolve, { keepSlow: true }));
        if (runId !== state.slowRun) return;
    }
    if (runId === state.slowRun) markHeard(state.index);
});
$("open-game-btn").addEventListener("click", openGame);
onTap("next-round-btn", goNextRound);
$("back-calendar-btn").addEventListener("click", () => {
    renderCalendar();
    showScreen("calendar");
});

document.addEventListener("keydown", (event) => {
    if (state.screen !== "lesson") return;
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
});

if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener("voiceschanged", () => pickChineseVoice());
}

setupTabletChrome();
loadKids().catch((err) => {
    $("lan-hint").textContent = "ページを開けなかったよ。下のタブレット用リンクを開いてね。";
    console.error(err);
});
