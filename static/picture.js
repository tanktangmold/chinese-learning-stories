// Instant, sentence-matched pictures. Inline SVG (no data: URLs) so iPad Safari shows them.

function picturePalette(style) {
    if (style === "picturebook") {
        return { sky: "#ffe7b0", sky2: "#c9ebff", ground: "#b7de8a", ink: "#4a3824", fill: "#fff8ec", sun: "#f4c14e", red: "#e85d4c", blue: "#5aa2d6", pink: "#f4a4c0", skin: "#f3c39a" };
    }
    if (style === "realistic") {
        return { sky: "#c5d6e4", sky2: "#efe6d4", ground: "#87ad6f", ink: "#2b261e", fill: "#f3eadb", sun: "#d4b05a", red: "#c24b40", blue: "#6a829c", pink: "#d9899c", skin: "#e8b892" };
    }
    return { sky: "#8ed8ff", sky2: "#ffe27a", ground: "#62c95c", ink: "#2c2419", fill: "#fffdf2", sun: "#ffd34d", red: "#ef4f3d", blue: "#4aa3ff", pink: "#ff8fb3", skin: "#f4c69b" };
}

function pictureKeyWord(zh) {
    const keys = ["小岛", "足球", "梦想", "爸爸", "妈妈", "爱", "哥哥", "球队", "教练", "训练", "里斯本", "想家", "手术", "进球", "英国", "曼联", "努力", "中文", "C罗"];
    return keys.find((key) => zh.includes(key)) || String(zh || "").slice(0, 2);
}

function pickPictureArt(zh) {
    const rules = [
        [/这是罗纳尔多|叫他C罗|这就是C罗/, "hello"],
        [/住在小岛|C罗住在小岛|岛在葡萄牙|小岛还在|没有忘记小岛|回到岛上|从小岛/, "island"],
        [/家很小/, "smallhouse"],
        [/家里人很多|家里的人还在/, "crowd"],
        [/足球梦|梦想很大|梦想给他|梦想可以|有梦想|更大的梦|有一个足球梦/, "dream"],
        [/爸爸/, "dad"],
        [/妈妈/, "mom"],
        [/钱不多/, "poor"],
        [/有爱|爱他的家|爱给了|爱还在|我们爱你|爱让他/, "hearts"],
        [/三岁|第一脚/, "toddler"],
        [/哥哥/, "brothers"],
        [/球是旧的/, "oldball"],
        [/街上|路很小/, "street"],
        [/天黑/, "night"],
        [/邻居/, "neighbors"],
        [/加入了球队|球队成了|更大的球队/, "team"],
        [/教练/, "coach"],
        [/第一个来/, "first"],
        [/最后一个走/, "last"],
        [/汗/, "sweat"],
        [/去里斯本|里斯本很大/, "city"],
        [/离开了家|离开家|十二岁离开/, "goodbye"],
        [/想家/, "homesick"],
        [/哭了|爱哭/, "cry"],
        [/口音|同学笑|同学笑他/, "tease"],
        [/打电话/, "phone"],
        [/两只脚/, "bothfeet"],
        [/手术|心跳|医生|医院/, "hospital"],
        [/害怕/, "scared"],
        [/站起来/, "standup"],
        [/过人/, "dribble"],
        [/射门/, "shoot"],
        [/进球|赢了/, "goal"],
        [/鼓掌/, "clap"],
        [/去英国|英国|曼联/, "england"],
        [/语言|学中文/, "language"],
        [/有名|足球明星/, "star"],
        [/帮助/, "help"],
        [/复习|今天我们复习|第三十天|每天十五分钟/, "review"],
        [/你也可以|你可以|你也开始/, "you"],
        [/不放弃|没有放弃|没有停|继续跑/, "brave"],
        [/训练|天天练|还在训练|每天都要练/, "train"],
        [/天天踢球|还在踢球|白天他踢球|足球让他|足球是/, "kick"],
        [/跑得很快|还在跑/, "kick"],
        [/笑得很开心|很开心|高兴/, "happy"],
        [/梦开始了|可是梦/, "dream"],
        [/别人回家了|想回家|回家了/, "home"],
        [/不怕累|不怕辛苦|不怕难|不怕学/, "brave"],
        [/他很小|可是他很认真|很认真/, "small"],
        [/进步|越来越好|技术|一点一点/, "progress"],
        [/很难过/, "sad"],
        [/把话变成力量|没有走|没有停/, "brave"],
        [/一个人住学校|住学校/, "school"],
        [/身体回来|心更强|更强的C罗/, "strong"],
        [/比赛来了|重要的比赛/, "match"],
        [/准备好了|下一步/, "ready"],
        [/新的国家|新的故事|新家/, "newplace"],
        [/故事很长|故事还没停|C罗的故事/, "story"],
        [/明天还可以学/, "you"],
        [/更瘦了|跑得更快/, "grow"],
        [/夜里他还想球/, "night"],
        [/勇气/, "brave"],
        [/继续踢球|还要踢球/, "kick"],
        [/他听见了/, "tease"],
        [/天赋不够/, "effort"],
        [/国家是新的|他天天学/, "language"],
        [/没有忘记家/, "hearts"],
        [/这很重要|没有忘记开始|这就是力量/, "story"],
        [/你们也可以|每天一点就好/, "you"],
        [/还想赢/, "goal"],
        [/不觉得够了/, "effort"],
        [/努力/, "effort"],
        [/十岁|十二岁|十五岁|十八岁/, "grow"],
    ];
    const hit = rules.find((rule) => rule[0].test(zh));
    return hit ? hit[1] : "play";
}

function boySvg(x, y, mood, p) {
    const mouth = {
        smile: `M66 72 Q80 84 96 72`,
        sad: `M66 80 Q80 70 96 80`,
        wow: `M80 76 a7 8 0 1 0 0.1 0`,
        grit: `M68 76 H94`,
    }[mood] || `M66 72 Q80 84 96 72`;
    return `<g transform="translate(${x} ${y})">
        <ellipse cx="80" cy="210" rx="60" ry="14" fill="${p.ink}" opacity=".12"/>
        <path d="M58 150 l-22 62M104 150 l28 60" stroke="${p.ink}" stroke-width="16" stroke-linecap="round"/>
        <path d="M42 88 h78 l20 68 H24z" fill="${p.red}" stroke="${p.ink}" stroke-width="6"/>
        <circle cx="80" cy="50" r="38" fill="${p.skin}" stroke="${p.ink}" stroke-width="5"/>
        <path d="M42 38 C52 2 104 -8 122 30 C98 16 80 28 64 16z" fill="#2b2118"/>
        <circle cx="66" cy="52" r="4" fill="${p.ink}"/><circle cx="94" cy="52" r="4" fill="${p.ink}"/>
        <path d="${mouth}" fill="none" stroke="${p.ink}" stroke-width="4" stroke-linecap="round"/>
    </g>`;
}

function ballSvg(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <circle r="28" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
        <path d="M0 -15 L13 -4 L8 13 H-8 L-13 -4z" fill="${p.ink}"/>
    </g>`;
}

function bubbleSvg(x, y, word, p) {
    const w = Math.max(90, String(word).length * 36);
    return `<g transform="translate(${x} ${y})">
        <rect x="${-w / 2}" y="-38" width="${w}" height="56" rx="22" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
        <text text-anchor="middle" y="2" font-size="28" font-weight="800" fill="${p.ink}">${word}</text>
    </g>`;
}

function pictureBackdrop(art, p) {
    const night = art === "night" || art === "homesick" || art === "dream" || art === "star";
    const sky = night ? "#1d3a6e" : p.sky;
    const sky2 = night ? "#6d4aa8" : p.sky2;
    const sun = night
        ? `<circle cx="620" cy="90" r="28" fill="#f7f1c8"/>`
        : `<circle cx="640" cy="86" r="42" fill="${p.sun}"/>`;
    return `<rect width="768" height="576" fill="${sky}"/>
        <rect y="240" width="768" height="336" fill="${sky2}" opacity=".35"/>
        <ellipse cx="384" cy="530" rx="340" ry="60" fill="${p.ground}"/>
        ${sun}`;
}

function pictureProps(art, p) {
    switch (art) {
        case "hello":
            return `${boySvg(250, 200, "smile", p)}${ballSvg(470, 430, p)}<text x="560" y="210" font-size="72">👋</text>`;
        case "island":
            return `<path d="M40 420 C160 300 280 300 400 420" fill="${p.blue}" opacity=".55"/>
                <path d="M90 400 C150 330 250 330 310 400" fill="${p.ground}" stroke="${p.ink}" stroke-width="5"/>
                <path d="M120 390 h120 v-80 l-60 -48 -60 48z" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                ${boySvg(430, 210, "smile", p)}${ballSvg(620, 430, p)}<text x="70" y="180" font-size="64">🏝️</text>`;
        case "smallhouse":
            return `<path d="M220 420 h180 v-110 l-90 -70 -90 70z" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/>
                ${boySvg(430, 210, "smile", p)}<text x="90" y="250" font-size="70">🏠</text>`;
        case "crowd":
            return `${boySvg(180, 220, "smile", p)}${boySvg(330, 230, "smile", p)}${boySvg(480, 220, "smile", p)}<text x="80" y="180" font-size="56">👨‍👩‍👧‍👦</text>`;
        case "dream":
            return `${boySvg(180, 220, "wow", p)}<text x="430" y="250" font-size="110">⭐</text><text x="540" y="360" font-size="70">⚽</text>`;
        case "dad":
            return `<g transform="translate(90 180)"><circle cx="50" cy="40" r="34" fill="${p.skin}" stroke="${p.ink}" stroke-width="5"/><path d="M18 90 h64 l16 90 H4z" fill="${p.blue}" stroke="${p.ink}" stroke-width="5"/></g>
                ${boySvg(360, 210, "smile", p)}<text x="560" y="230" font-size="70">🔧</text>`;
        case "mom":
            return `<g transform="translate(90 180)"><circle cx="50" cy="40" r="34" fill="${p.skin}" stroke="${p.ink}" stroke-width="5"/><path d="M18 90 h64 l16 90 H4z" fill="${p.pink}" stroke="${p.ink}" stroke-width="5"/></g>
                ${boySvg(360, 210, "smile", p)}<text x="560" y="240" font-size="70">🍲</text>`;
        case "poor":
            return `${boySvg(220, 210, "sad", p)}<text x="470" y="280" font-size="90">🪙</text><text x="560" y="360" font-size="48">…</text>`;
        case "hearts":
            return `${boySvg(200, 210, "smile", p)}<text x="430" y="240" font-size="90">❤️</text><text x="540" y="340" font-size="70">🏠</text>`;
        case "toddler":
            return `<g transform="scale(.72) translate(180 220)">${boySvg(0, 0, "smile", p)}</g>${ballSvg(430, 450, p)}<text x="500" y="250" font-size="80">👶</text>`;
        case "brothers":
            return `${boySvg(140, 220, "smile", p)}${boySvg(360, 190, "smile", p)}${ballSvg(620, 430, p)}`;
        case "oldball":
            return `${boySvg(180, 210, "smile", p)}${ballSvg(500, 400, p)}<text x="560" y="260" font-size="64">🩹</text>`;
        case "street":
            return `<rect x="80" y="390" width="600" height="28" fill="${p.ink}" opacity=".18"/>
                ${boySvg(220, 200, "grit", p)}${ballSvg(520, 420, p)}<text x="80" y="220" font-size="64">🏘️</text>`;
        case "night":
            return `${boySvg(240, 210, "grit", p)}${ballSvg(500, 430, p)}<text x="80" y="160" font-size="64">🌙</text>`;
        case "neighbors":
            return `${boySvg(280, 210, "smile", p)}<text x="80" y="240" font-size="70">👀</text>${ballSvg(560, 430, p)}`;
        case "team":
            return `${boySvg(120, 220, "smile", p)}${boySvg(300, 210, "smile", p)}${boySvg(480, 220, "smile", p)}<text x="80" y="170" font-size="60">👕</text>`;
        case "coach":
            return `<g transform="translate(80 170)"><circle cx="50" cy="40" r="34" fill="${p.skin}" stroke="${p.ink}" stroke-width="5"/><path d="M18 90 h64 l16 90 H4z" fill="${p.sun}" stroke="${p.ink}" stroke-width="5"/></g>
                ${boySvg(360, 210, "wow", p)}<text x="80" y="150" font-size="56">📣</text>`;
        case "first":
            return `${boySvg(240, 200, "grit", p)}<text x="80" y="220" font-size="72">1️⃣</text>${ballSvg(560, 430, p)}`;
        case "last":
            return `${boySvg(240, 200, "grit", p)}<text x="80" y="220" font-size="72">🌙</text>${ballSvg(560, 430, p)}`;
        case "sweat":
            return `${boySvg(230, 200, "grit", p)}<text x="500" y="230" font-size="80">💦</text>${ballSvg(430, 440, p)}`;
        case "city":
            return `<rect x="80" y="220" width="70" height="200" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                <rect x="170" y="170" width="80" height="250" fill="${p.blue}" stroke="${p.ink}" stroke-width="5"/>
                <rect x="270" y="210" width="64" height="210" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                ${boySvg(430, 210, "wow", p)}`;
        case "goodbye":
            return `<path d="M70 400 h150 v-90 l-75 -52 -75 52z" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                ${boySvg(360, 210, "sad", p)}<text x="560" y="250" font-size="70">🎒</text>`;
        case "homesick":
            return `${boySvg(220, 210, "sad", p)}<text x="470" y="250" font-size="90">🏠</text><text x="80" y="180" font-size="60">🌙</text>`;
        case "cry":
            return `${boySvg(240, 210, "sad", p)}<text x="500" y="260" font-size="80">😢</text>`;
        case "tease":
            return `${boySvg(160, 220, "sad", p)}${boySvg(400, 190, "smile", p)}<text x="560" y="220" font-size="64">👉</text>`;
        case "phone":
            return `${boySvg(220, 210, "smile", p)}<text x="500" y="270" font-size="90">📞</text>`;
        case "bothfeet":
            return `${boySvg(200, 200, "grit", p)}${ballSvg(500, 430, p)}<text x="80" y="250" font-size="64">🦶🦶</text>`;
        case "hospital":
            return `<rect x="70" y="230" width="200" height="170" rx="16" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/>
                <rect x="150" y="270" width="36" height="80" fill="${p.red}"/><rect x="128" y="292" width="80" height="36" fill="${p.red}"/>
                ${boySvg(400, 210, "wow", p)}`;
        case "scared":
            return `${boySvg(240, 210, "wow", p)}<text x="500" y="260" font-size="80">😨</text>`;
        case "standup":
            return `${boySvg(240, 180, "grit", p)}<text x="80" y="260" font-size="70">💪</text>${ballSvg(560, 430, p)}`;
        case "dribble":
            return `${boySvg(160, 200, "grit", p)}${ballSvg(430, 420, p)}${boySvg(500, 210, "wow", p)}`;
        case "shoot":
            return `${boySvg(120, 200, "grit", p)}${ballSvg(400, 300, p)}<rect x="560" y="220" width="140" height="200" fill="none" stroke="${p.ink}" stroke-width="10"/>`;
        case "goal":
            return `<rect x="480" y="180" width="200" height="230" fill="none" stroke="${p.ink}" stroke-width="10"/>
                ${boySvg(120, 200, "smile", p)}${ballSvg(540, 390, p)}<text x="80" y="180" font-size="64">🎉</text>`;
        case "clap":
            return `${boySvg(240, 210, "smile", p)}<text x="80" y="230" font-size="70">👏</text><text x="520" y="240" font-size="70">👏</text>`;
        case "england":
            return `${boySvg(220, 210, "wow", p)}<text x="80" y="220" font-size="70">✈️</text><text x="500" y="250" font-size="70">🇬🇧</text>`;
        case "language":
            return `${boySvg(200, 210, "wow", p)}<text x="470" y="240" font-size="56">Aa</text><text x="540" y="330" font-size="56">文</text>`;
        case "star":
            return `${boySvg(200, 210, "smile", p)}<text x="470" y="240" font-size="100">🌟</text>`;
        case "help":
            return `${boySvg(140, 190, "smile", p)}<g transform="scale(.7) translate(420 220)">${boySvg(0, 0, "smile", p)}</g><text x="80" y="180" font-size="60">🤝</text>`;
        case "review":
            return `${boySvg(220, 210, "smile", p)}<text x="480" y="260" font-size="90">📖</text>`;
        case "you":
            return `${boySvg(220, 210, "smile", p)}<text x="500" y="250" font-size="80">👉</text><text x="80" y="200" font-size="60">✨</text>`;
        case "brave":
            return `${boySvg(230, 200, "grit", p)}<text x="500" y="250" font-size="80">🔥</text>`;
        case "train":
            return `${boySvg(200, 200, "grit", p)}<rect x="470" y="300" width="28" height="110" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>
                <rect x="530" y="300" width="28" height="110" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>${ballSvg(420, 440, p)}`;
        case "kick":
            return `${boySvg(160, 200, "grit", p)}${ballSvg(480, 360, p)}<text x="560" y="230" font-size="64">💨</text>`;
        case "happy":
            return `${boySvg(220, 200, "smile", p)}<text x="500" y="250" font-size="80">😄</text>${ballSvg(160, 440, p)}`;
        case "home":
            return `<path d="M90 400 h150 v-90 l-75 -52 -75 52z" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                ${boySvg(360, 210, "smile", p)}<text x="80" y="200" font-size="60">🚪</text>`;
        case "small":
            return `<g transform="scale(.68) translate(160 260)">${boySvg(0, 0, "grit", p)}</g>${ballSvg(500, 440, p)}<text x="480" y="230" font-size="64">✨</text>`;
        case "progress":
            return `${boySvg(160, 220, "smile", p)}<text x="430" y="250" font-size="80">📈</text>`;
        case "sad":
            return `${boySvg(240, 210, "sad", p)}<text x="500" y="260" font-size="80">💧</text>`;
        case "school":
            return `<rect x="70" y="230" width="220" height="170" rx="14" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/>
                ${boySvg(400, 210, "sad", p)}<text x="80" y="200" font-size="56">🏫</text>`;
        case "strong":
            return `${boySvg(220, 190, "grit", p)}<text x="500" y="250" font-size="80">❤️‍🔥</text>`;
        case "match":
            return `${boySvg(160, 200, "grit", p)}<rect x="500" y="200" width="180" height="210" fill="none" stroke="${p.ink}" stroke-width="10"/>${ballSvg(420, 360, p)}`;
        case "ready":
            return `${boySvg(220, 200, "wow", p)}<text x="500" y="250" font-size="80">🚀</text>`;
        case "newplace":
            return `${boySvg(200, 210, "wow", p)}<text x="80" y="220" font-size="64">🗺️</text><text x="500" y="250" font-size="64">🏡</text>`;
        case "story":
            return `${boySvg(200, 210, "smile", p)}<text x="480" y="260" font-size="90">📘</text>`;
        case "effort":
            return `${boySvg(220, 200, "grit", p)}<text x="500" y="250" font-size="80">💪</text>`;
        case "grow":
            return `${boySvg(160, 240, "smile", p)}${boySvg(380, 170, "smile", p)}<text x="80" y="200" font-size="56">📏</text>`;
        default:
            return `${boySvg(220, 200, "smile", p)}${ballSvg(500, 420, p)}<text x="80" y="200" font-size="64">⚽</text>`;
    }
}

function buildSentencePicture(zh, scene, style) {
    const p = picturePalette(style);
    const art = pickPictureArt(String(zh || ""));
    const word = pictureKeyWord(String(zh || ""));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 576" role="img" aria-label="${String(zh || "").replace(/"/g, "")}">
        ${pictureBackdrop(art, p)}
        ${pictureProps(art, p)}
        ${bubbleSvg(384, 78, word, p)}
    </svg>`;
}

function paintSentencePicture(box, zh, scene, style) {
    if (!box) return;
    box.innerHTML = buildSentencePicture(zh, scene, style);
}
