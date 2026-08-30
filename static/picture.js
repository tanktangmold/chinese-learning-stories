// Built-in, sentence-matched pictures. Each line has a baked SVG in pictures/.
// This file is also the generator: `node scripts/bake-pictures.js`.

function picturePalette(style) {
    if (style === "picturebook") {
        return { sky: "#ffe7b0", sky2: "#c9ebff", ground: "#b7de8a", ink: "#4a3824", fill: "#fff8ec", sun: "#f4c14e", red: "#e85d4c", blue: "#5aa2d6", pink: "#f4a4c0", skin: "#f3c39a", water: "#5ec4d6", night: "#1d3a6e" };
    }
    if (style === "realistic") {
        return { sky: "#c5d6e4", sky2: "#efe6d4", ground: "#87ad6f", ink: "#2b261e", fill: "#f3eadb", sun: "#d4b05a", red: "#c24b40", blue: "#6a829c", pink: "#d9899c", skin: "#e8b892", water: "#4f8ea3", night: "#24364a" };
    }
    return { sky: "#8ed8ff", sky2: "#ffe27a", ground: "#62c95c", ink: "#2c2419", fill: "#fffdf2", sun: "#ffd34d", red: "#ef4f3d", blue: "#4aa3ff", pink: "#ff8fb3", skin: "#f4c69b", water: "#3db7d4", night: "#1a3268" };
}

function esc(text) {
    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function person(x, y, p, opt) {
    opt = opt || {};
    const s = opt.scale == null ? 1 : opt.scale;
    const mood = opt.mood || "smile";
    const shirt = opt.shirt || p.red;
    const hair = opt.hair || "#2b2118";
    const pose = opt.pose || "stand";
    const mouth = {
        smile: "M-14 10 Q0 20 14 10",
        sad: "M-14 16 Q0 6 14 16",
        wow: "M0 12 a6 7 0 1 0 .1 0",
        grit: "M-12 12 H12",
    }[mood] || "M-14 10 Q0 20 14 10";
    let legs = `<path d="M-16 78 l-10 52M16 78 l16 50" stroke="${p.ink}" stroke-width="14" stroke-linecap="round"/>`;
    let arms = `<path d="M-28 28 l-18 40M28 28 l22 38" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/>`;
    if (pose === "kick") {
        legs = `<path d="M-16 78 l-8 52M18 78 l48 8" stroke="${p.ink}" stroke-width="14" stroke-linecap="round"/>`;
    } else if (pose === "run") {
        legs = `<path d="M-10 78 l-28 40M14 78 l30 36" stroke="${p.ink}" stroke-width="14" stroke-linecap="round"/>`;
        arms = `<path d="M-24 30 l-28 8M26 28 l26 -8" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/>`;
    } else if (pose === "wave") {
        arms = `<path d="M-28 28 l-16 40M28 24 l8 -46" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/>`;
    } else if (pose === "work") {
        arms = `<path d="M-26 32 l-6 36M26 30 l34 8" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/>`;
    } else if (pose === "sit") {
        legs = `<path d="M-18 86 h28 l8 28M16 86 l22 10" stroke="${p.ink}" stroke-width="14" stroke-linecap="round"/>`;
    } else if (pose === "point") {
        arms = `<path d="M-28 28 l-16 40M28 26 l40 -6" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/>`;
    }
    const tears = mood === "sad"
        ? `<circle cx="-18" cy="8" r="3" fill="${p.blue}"/><circle cx="18" cy="10" r="3" fill="${p.blue}"/>`
        : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">
        <ellipse cx="0" cy="138" rx="46" ry="10" fill="${p.ink}" opacity=".14"/>
        ${legs}
        <path d="M-32 8 h64 l16 72 h-96z" fill="${shirt}" stroke="${p.ink}" stroke-width="5"/>
        ${arms}
        <circle cx="0" cy="-18" r="30" fill="${p.skin}" stroke="${p.ink}" stroke-width="5"/>
        <path d="M-28 -28 C-18 -58 22 -62 32 -24 C12 -36 0 -24 -14 -38z" fill="${hair}"/>
        <circle cx="-10" cy="-18" r="3.4" fill="${p.ink}"/><circle cx="10" cy="-18" r="3.4" fill="${p.ink}"/>
        <path d="${mouth}" fill="none" stroke="${p.ink}" stroke-width="3.5" stroke-linecap="round"/>
        ${tears}
    </g>`;
}

function ball(x, y, p, opt) {
    opt = opt || {};
    const s = opt.scale == null ? 1 : opt.scale;
    const patch = opt.old
        ? `<path d="M-8 -4 q8 -10 16 0" fill="none" stroke="${p.red}" stroke-width="3"/>`
        : "";
    return `<g transform="translate(${x} ${y}) scale(${s})">
        <circle r="26" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
        <path d="M0 -14 L12 -4 L7 12 H-7 L-12 -4z" fill="${p.ink}"/>
        ${patch}
    </g>`;
}

function house(x, y, p, opt) {
    opt = opt || {};
    const w = opt.tiny ? 90 : 160;
    const h = opt.tiny ? 70 : 110;
    return `<g transform="translate(${x} ${y})">
        <path d="M${-w / 2} 0 h${w} v${-h} l${-w / 2} ${-h * 0.55} ${-w / 2} ${h * 0.55}z" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/>
        <rect x="${-18}" y="${-52}" width="28" height="48" fill="${p.blue}" stroke="${p.ink}" stroke-width="4"/>
        <rect x="16" y="${-70}" width="22" height="22" fill="${p.sky}" stroke="${p.ink}" stroke-width="4"/>
    </g>`;
}

function palm(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <path d="M0 0 v-90" stroke="#6b4a2b" stroke-width="10" stroke-linecap="round"/>
        <path d="M0 -88 q-50 -10 -60 20M0 -88 q50 -10 60 20M0 -92 q-20 -40 10 -48M0 -92 q20 -40 -4 -50" fill="none" stroke="#2f8a3a" stroke-width="8" stroke-linecap="round"/>
    </g>`;
}

function sea(p) {
    return `<path d="M0 390 C120 340 220 430 360 380 C500 330 620 420 768 360 V576 H0z" fill="${p.water}"/>
        <path d="M0 430 C180 400 300 470 480 420 C620 380 700 450 768 410" fill="none" stroke="#fff" stroke-width="8" opacity=".35"/>`;
}

function goal(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <path d="M0 160 V0 H150 V160" fill="none" stroke="${p.ink}" stroke-width="10"/>
        <path d="M0 0 H150 V160" fill="${p.fill}" opacity=".25"/>
    </g>`;
}

function captionBar(zh, p) {
    return `<rect y="500" width="768" height="76" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
        <text x="384" y="548" text-anchor="middle" font-size="30" font-weight="800" fill="${p.ink}">${esc(zh)}</text>`;
}

function skyGround(p, kind) {
    if (kind === "night") {
        return `<rect width="768" height="576" fill="${p.night}"/>
            <circle cx="640" cy="80" r="28" fill="#f7f1c8"/>
            <circle cx="120" cy="70" r="3" fill="#fff"/><circle cx="200" cy="40" r="2" fill="#fff"/>
            <circle cx="480" cy="50" r="2.5" fill="#fff"/><circle cx="300" cy="90" r="2" fill="#fff"/>
            <ellipse cx="384" cy="530" rx="360" ry="70" fill="#2a4a32"/>`;
    }
    if (kind === "sunset") {
        return `<rect width="768" height="576" fill="#ffb36b"/>
            <rect y="180" width="768" height="200" fill="#ff7a6a" opacity=".45"/>
            <circle cx="620" cy="150" r="46" fill="#ffd36a"/>
            <ellipse cx="384" cy="530" rx="360" ry="70" fill="#4a7a3a"/>`;
    }
    if (kind === "dream") {
        return `<rect width="768" height="576" fill="#2a1b6b"/>
            <circle cx="120" cy="80" r="3" fill="#fff"/><circle cx="300" cy="40" r="2" fill="#fff"/>
            <circle cx="520" cy="70" r="2.5" fill="#fff"/><circle cx="680" cy="110" r="3" fill="#fff"/>
            <circle cx="600" cy="90" r="34" fill="#f7e48a"/>
            <ellipse cx="384" cy="530" rx="360" ry="70" fill="#3d2a7a"/>`;
    }
    return `<rect width="768" height="576" fill="${p.sky}"/>
        <rect y="220" width="768" height="200" fill="${p.sky2}" opacity=".35"/>
        <circle cx="640" cy="86" r="40" fill="${p.sun}"/>
        <ellipse cx="384" cy="530" rx="360" ry="70" fill="${p.ground}"/>`;
}

function flagPT(x, y) {
    return `<g transform="translate(${x} ${y})">
        <rect width="70" height="42" fill="#006600" stroke="#2c2419" stroke-width="4"/>
        <rect x="28" width="42" height="42" fill="#cc0000"/>
        <circle cx="28" cy="21" r="8" fill="#ffd34d"/>
    </g>`;
}

function flagUK(x, y) {
    return `<g transform="translate(${x} ${y})">
        <rect width="70" height="42" fill="#012169" stroke="#2c2419" stroke-width="4"/>
        <path d="M0 0 L70 42 M70 0 L0 42" stroke="#fff" stroke-width="8"/>
        <path d="M0 0 L70 42 M70 0 L0 42" stroke="#c8102e" stroke-width="4"/>
        <path d="M35 0 V42 M0 21 H70" stroke="#fff" stroke-width="12"/>
        <path d="M35 0 V42 M0 21 H70" stroke="#c8102e" stroke-width="6"/>
    </g>`;
}

function plane(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <path d="M0 0 h90 l30 -12 h20 l-10 18 h-40 l-20 22 h-16 l12 -22 H0z" fill="${p.fill}" stroke="${p.ink}" stroke-width="4"/>
    </g>`;
}

function phone(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <rect x="-16" y="-28" width="32" height="54" rx="8" fill="${p.ink}"/>
        <rect x="-12" y="-22" width="24" height="36" fill="${p.sky}"/>
    </g>`;
}

function book(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <path d="M-40 20 L-40 -20 L0 -28 L0 12z" fill="${p.red}" stroke="${p.ink}" stroke-width="4"/>
        <path d="M40 20 L40 -20 L0 -28 L0 12z" fill="${p.fill}" stroke="${p.ink}" stroke-width="4"/>
    </g>`;
}

function hearts(x, y, p) {
    return `<g transform="translate(${x} ${y})" fill="${p.red}" stroke="${p.ink}" stroke-width="4">
        <path d="M0 18 C-24 -8 -28 -22 -12 -28 C-2 -32 0 -18 0 -10 C0 -18 2 -32 12 -28 C28 -22 24 -8 0 18z"/>
    </g>`;
}

function trophy(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <path d="M-18 -8 h36 v-28 q20 8 20 28 h-76 q0 -20 20 -28z" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>
        <rect x="-8" y="-8" width="16" height="18" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>
        <rect x="-16" y="10" width="32" height="10" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>
    </g>`;
}

function suitcase(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <rect x="-28" y="-18" width="56" height="36" rx="6" fill="${p.blue}" stroke="${p.ink}" stroke-width="4"/>
        <path d="M-10 -18 v-10 h20 v10" fill="none" stroke="${p.ink}" stroke-width="4"/>
    </g>`;
}

function bed(x, y, p) {
    return `<g transform="translate(${x} ${y})">
        <rect x="-80" y="-10" width="160" height="36" rx="8" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
        <rect x="-80" y="-40" width="40" height="30" rx="8" fill="${p.pink}" stroke="${p.ink}" stroke-width="4"/>
    </g>`;
}

function buildings(p, tall) {
    const h1 = tall ? 260 : 180;
    return `<rect x="40" y="${400 - h1}" width="70" height="${h1}" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
        <rect x="120" y="${400 - h1 - 40}" width="80" height="${h1 + 40}" fill="${p.blue}" stroke="${p.ink}" stroke-width="5"/>
        <rect x="210" y="${400 - h1 + 20}" width="64" height="${h1 - 20}" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>`;
}

function street(p) {
    return `<rect x="0" y="400" width="768" height="50" fill="#8d8a82"/>
        <path d="M20 424 H748" stroke="#fff" stroke-width="6" stroke-dasharray="24 18"/>`;
}

function hospitalWall(p) {
    return `<rect x="40" y="200" width="260" height="220" rx="12" fill="${p.fill}" stroke="${p.ink}" stroke-width="6"/>
        <rect x="146" y="250" width="36" height="90" fill="${p.red}"/>
        <rect x="118" y="278" width="92" height="36" fill="${p.red}"/>`;
}

function shotFor(zh) {
    const t = String(zh || "");
    const exact = EXACT_SHOT[t];
    if (exact) return exact;
    if (/这是罗纳尔多|这就是C罗/.test(t)) return "hello";
    if (/叫他C罗|大家都叫/.test(t)) return "nickname";
    if (/岛在葡萄牙/.test(t)) return "portugal";
    if (/住在小岛|小岛还在|回到岛上|从小岛|C罗住在小岛/.test(t)) return "island";
    if (/家很小/.test(t)) return "tinyhouse";
    if (/家里人很多|家里的人还在/.test(t)) return "crowd";
    if (/足球梦|梦想很大|梦想可以|更大的梦|梦想给他|有梦想/.test(t)) return "dream";
    if (/爸爸很忙|爸爸在那里/.test(t)) return "dadbusy";
    if (/妈妈很辛苦|想妈妈/.test(t)) return "mom";
    if (/钱不多/.test(t)) return "poor";
    if (/家里有爱|爱他的家|爱给了|爱还在|爱让他|我们爱你/.test(t)) return "love";
    if (/三岁|第一脚很小/.test(t)) return "toddler";
    if (/哥哥/.test(t)) return "brothers";
    if (/球是旧的/.test(t)) return "oldball";
    if (/街上|路很小/.test(t)) return "streetkick";
    if (/天黑/.test(t)) return "nightrun";
    if (/邻居/.test(t)) return "neighbors";
    if (/加入了球队|更大的球队|球队成了/.test(t)) return "team";
    if (/教练/.test(t)) return "coach";
    if (/第一个来/.test(t)) return "first";
    if (/最后一个走/.test(t)) return "last";
    if (/汗/.test(t)) return "sweat";
    if (/里斯本/.test(t)) return "lisbon";
    if (/离开了家|离开家|十二岁离开/.test(t)) return "goodbye";
    if (/想家/.test(t)) return "homesick";
    if (/哭了|爱哭/.test(t)) return "cry";
    if (/口音|同学笑/.test(t)) return "tease";
    if (/打电话/.test(t)) return "phone";
    if (/两只脚/.test(t)) return "twofeet";
    if (/手术|心跳|医生|医院/.test(t)) return "hospital";
    if (/害怕/.test(t)) return "scared";
    if (/站起来/.test(t)) return "standup";
    if (/过人/.test(t)) return "dribble";
    if (/射门/.test(t)) return "shoot";
    if (/进球|赢了/.test(t)) return "goal";
    if (/鼓掌/.test(t)) return "clap";
    if (/英国|曼联/.test(t)) return "england";
    if (/语言|学中文|天天学/.test(t)) return "language";
    if (/有名|足球明星/.test(t)) return "star";
    if (/帮助/.test(t)) return "help";
    if (/复习|第三十天|每天十五分钟/.test(t)) return "review";
    if (/你也可以|你可以|你也开始|明天还可以/.test(t)) return "you";
    if (/训练|天天练|每天都要练/.test(t)) return "train";
    if (/踢球|跑得/.test(t)) return "kick";
    if (/住学校/.test(t)) return "school";
    if (/努力/.test(t)) return "effort";
    return "play";
}

const EXACT_SHOT = {
    "这是罗纳尔多。": "hello",
    "大家都叫他C罗。": "nickname",
    "他住在小岛上。": "island",
    "岛在葡萄牙。": "portugal",
    "他的家很小。": "tinyhouse",
    "家里人很多。": "crowd",
    "他有一个足球梦。": "dream",
    "梦想很大。": "dreambig",
    "他的爸爸很忙。": "dadbusy",
    "他的妈妈很辛苦。": "mom",
    "家里钱不多。": "poor",
    "可是家里有爱。": "love",
    "他爱他的家。": "lovehome",
    "他想让家里高兴。": "makehappy",
    "所以他很努力。": "effort",
    "爱给了他力量。": "lovepower",
    "他三岁开始踢足球。": "toddler",
    "他和哥哥一起玩。": "brothers",
    "球是旧的。": "oldball",
    "他天天踢球。": "kick",
    "他笑得很开心。": "happy",
    "足球让他高兴。": "happyball",
    "第一脚很小。": "firstkick",
    "可是梦开始了。": "dreamstart",
    "他天天在街上踢球。": "streetkick",
    "路很小。": "narrow",
    "他跑得很快。": "run",
    "邻居都看见他。": "neighbors",
    "天黑了他还跑。": "nightrun",
    "别人回家了。": "othershome",
    "他还在踢球。": "alonekick",
    "他不怕累。": "notired",
    "他加入了球队。": "team",
    "爸爸在那里工作。": "dadclub",
    "他很小。": "smallboy",
    "可是他很认真。": "serious",
    "教练看见他。": "coachsee",
    "教练说他很快。": "coachfast",
    "他天天训练。": "train",
    "球队成了他的家。": "teamhome",
    "他还在训练。": "trainnight",
    "他是最后一个走。": "last",
    "他也是第一个来。": "first",
    "汗很多。": "sweat",
    "他不怕辛苦。": "notired",
    "努力成了习惯。": "habit",
    "这就是C罗。": "portrait",
    "今天我们复习。": "review",
    "C罗住在小岛上。": "island",
    "他天天很努力。": "effort",
    "梦想给他力量。": "dreampower",
    "他十岁了。": "age10",
    "他去了更大的球队。": "bigteam",
    "他进步很快。": "progress",
    "教练喜欢他。": "coachlike",
    "因为他很努力。": "effort",
    "球越来越好。": "betterball",
    "他会过人。": "dribble",
    "更大的梦来了。": "dreambig",
    "他十二岁了。": "age12",
    "他离开了家。": "goodbye",
    "他去里斯本。": "golisbon",
    "里斯本很大。": "lisbon",
    "他想家。": "homesick",
    "他哭了。": "cry",
    "离开家很难。": "goodbyehard",
    "可是他不放弃。": "nogiveup",
    "同学笑他的口音。": "tease",
    "他很难过。": "sad",
    "他想回家。": "wanthome",
    "可是他没有走。": "stayed",
    "他把话变成力量。": "wordpower",
    "他更努力。": "effort",
    "足球是他的朋友。": "ballfriend",
    "他不放弃。": "nogiveup",
    "他一个人住学校。": "school",
    "晚上他想妈妈。": "nightmom",
    "白天他踢球。": "kick",
    "足球是好朋友。": "ballfriend",
    "他给家里打电话。": "phone",
    "他说我会努力。": "sayeffort",
    "妈妈说我们爱你。": "momlove",
    "爱让他站起来。": "lovestand",
    "他更瘦了。": "thin",
    "他跑得更快。": "run",
    "他用两只脚踢球。": "twofeet",
    "两只脚都会。": "twofeet",
    "夜里他还想球。": "nightball",
    "技术越来越好。": "progress",
    "他会射门。": "shoot",
    "每天一点进步。": "progress",
    "他常常想家。": "homesick",
    "想家很难过。": "homesicksad",
    "可是他没有停。": "nogiveup",
    "汗给他力量。": "sweatpower",
    "教练看见努力。": "coacheffort",
    "梦想比想家更大。": "dreamgt",
    "他继续跑。": "run",
    "他十二岁离开家。": "goodbye",
    "同学笑他。": "tease",
    "勇气成了力量。": "courage",
    "他十五岁了。": "age15",
    "他的心跳太快。": "heartbeat",
    "医生看见他。": "doctor",
    "医生说要手术。": "surgerytalk",
    "他害怕。": "scared",
    "可是他没有放弃。": "nogiveup",
    "他想继续踢球。": "wantplay",
    "梦比害怕更大。": "dreamfear",
    "他做了手术。": "surgery",
    "手术不大。": "surgerysmall",
    "他很快站起来。": "standup",
    "他说我还要踢球。": "wantplay",
    "教练说慢慢来。": "coachslow",
    "他很快又训练。": "train",
    "身体回来了。": "bodyback",
    "心更强了。": "heartstrong",
    "有人叫他爱哭。": "crybaby",
    "他听见了。": "heard",
    "他第一个来。": "first",
    "他最后一个走。": "last",
    "努力回答了话。": "effortanswer",
    "他说天赋不够。": "talent",
    "每天都要练。": "train",
    "一点一点进步。": "progress",
    "他不怕难。": "brave",
    "别人看见汗。": "seesweat",
    "汗比话更重要。": "sweatwords",
    "比赛来了。": "match",
    "他进球了。": "goal",
    "大家都鼓掌。": "clap",
    "努力看见了光。": "effortlight",
    "教练信任他。": "trust",
    "因为他天天训练。": "train",
    "信任来自努力。": "trusteffort",
    "他没有停。": "nogiveup",
    "心跳的故事过去了。": "heartpast",
    "更强的C罗来了。": "strongcr7",
    "他准备好了。": "ready",
    "下一步很大。": "nextstep",
    "他十五岁做了手术。": "surgery",
    "可是他站起来。": "standup",
    "每天都要努力。": "effort",
    "他十八岁了。": "age18",
    "他去英国。": "england",
    "他加入了曼联。": "united",
    "新的国家很大。": "newcountry",
    "新的语言很难。": "language",
    "他不怕学。": "study",
    "新的故事开始了。": "newstory",
    "语言是新的。": "language",
    "国家是新的。": "newcountry",
    "他天天学。": "study",
    "他天天练。": "train",
    "一点一点会了。": "progress",
    "努力帮助他。": "efforthelp",
    "新家慢慢来了。": "newhome",
    "有一场重要的比赛。": "match",
    "他很认真。": "serious",
    "他过人了。": "dribble",
    "他射门了。": "shoot",
    "小岛上的孩子赢了。": "islandwin",
    "他成了有名的球员。": "famous",
    "他成了足球明星。": "star",
    "他没有忘记小岛。": "rememberisland",
    "他没有忘记家。": "rememberhome",
    "他帮助家里。": "helphome",
    "他也帮助孩子。": "helpkids",
    "这很重要。": "important",
    "小岛还在。": "island",
    "他回到岛上。": "returnisland",
    "他帮助孩子踢球。": "helpkids",
    "他说你们也可以。": "youcan",
    "每天一点就好。": "littleday",
    "爱还在。": "love",
    "家里的人还在。": "crowd",
    "梦想可以很大。": "dreambig",
    "他没有忘记开始。": "rememberstart",
    "他说努力最重要。": "effortmost",
    "天赋不够。": "talent",
    "他现在还在跑。": "run",
    "他还想赢。": "wantwin",
    "他不觉得够了。": "notenough",
    "故事还没停。": "storygo",
    "你也可以有梦想。": "youdream",
    "你可以慢慢学。": "youslow",
    "你可以每天一点。": "littleday",
    "学中文也难。": "chinese",
    "可是你不放弃。": "younogiveup",
    "这就是力量。": "power",
    "他十五岁站起来。": "standup",
    "他十八岁去英国。": "england",
    "他一直很努力。": "effort",
    "故事很长。": "storylong",
    "每天十五分钟。": "fifteen",
    "今天是第三十天。": "day30",
    "C罗的故事很长。": "storylong",
    "从小岛到世界。": "islandworld",
    "从三岁到今天。": "timeline",
    "他没有放弃。": "nogiveup",
    "你也开始了。": "youstart",
    "明天还可以学。": "tomorrow",
    "努力最重要。": "effortmost",
};

function drawShot(id, p) {
    const boy = (x, y, extra) => person(x, y, p, Object.assign({ shirt: p.red }, extra));
    const dad = (x, y, extra) => person(x, y, p, Object.assign({ shirt: p.blue, scale: 1.15, hair: "#3b2a18" }, extra));
    const mom = (x, y, extra) => person(x, y, p, Object.assign({ shirt: p.pink, hair: "#5a2a18" }, extra));
    const coach = (x, y, extra) => person(x, y, p, Object.assign({ shirt: p.sun, scale: 1.1 }, extra));
    const kid = (x, y, extra) => person(x, y, p, Object.assign({ shirt: p.blue, scale: 0.72 }, extra));
    switch (id) {
        case "hello":
            return `${skyGround(p, "day")}${boy(300, 300, { pose: "wave", mood: "smile" })}${ball(500, 430, p)}
                <rect x="470" y="200" width="220" height="54" rx="18" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
                <text x="580" y="236" text-anchor="middle" font-size="26" font-weight="800" fill="${p.ink}">罗纳尔多</text>`;
        case "nickname":
            return `${skyGround(p, "day")}${boy(380, 300, { mood: "smile" })}${kid(120, 330, { pose: "point" })}${kid(230, 340, { shirt: p.sun, pose: "point" })}
                <rect x="500" y="180" width="140" height="56" rx="18" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
                <text x="570" y="218" text-anchor="middle" font-size="32" font-weight="800" fill="${p.ink}">C罗</text>`;
        case "island":
            return `${skyGround(p, "day")}${sea(p)}${palm(160, 400, p)}${house(220, 400, p, { tiny: true })}${boy(460, 300, { mood: "smile" })}${ball(600, 430, p)}`;
        case "portugal":
            return `${skyGround(p, "day")}${sea(p)}${palm(200, 400, p)}${house(280, 400, p, { tiny: true })}${flagPT(520, 160)}${boy(500, 310, { mood: "wow" })}`;
        case "tinyhouse":
            return `${skyGround(p, "day")}${house(250, 420, p, { tiny: true })}${boy(480, 260, { scale: 1.15, mood: "smile" })}`;
        case "crowd":
            return `${skyGround(p, "day")}${house(240, 430, p, { tiny: true })}${dad(140, 340, { scale: 0.7 })}${mom(200, 350, { scale: 0.68 })}${boy(280, 360, { scale: 0.62 })}${kid(340, 370, { scale: 0.55, shirt: p.sun })}${kid(400, 375, { scale: 0.5, shirt: p.pink })}`;
        case "dream":
            return `${skyGround(p, "dream")}${boy(220, 320, { mood: "wow", pose: "sit" })}${ball(500, 220, p, { scale: 2.2 })}
                <path d="M360 300 Q420 240 470 230" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="8 8"/>`;
        case "dreambig":
            return `${skyGround(p, "dream")}${boy(180, 340, { mood: "wow" })}
                <polygon points="500,80 530,170 620,170 548,220 576,310 500,250 424,310 452,220 380,170 470,170" fill="${p.sun}" stroke="${p.ink}" stroke-width="5"/>
                ${ball(620, 360, p, { scale: 1.4 })}`;
        case "dadbusy":
            return `${skyGround(p, "day")}${dad(200, 280, { pose: "work", mood: "grit" })}
                <rect x="320" y="360" width="70" height="50" fill="${p.fill}" stroke="${p.ink}" stroke-width="4"/>
                <rect x="400" y="330" width="54" height="80" fill="${p.blue}" stroke="${p.ink}" stroke-width="4"/>
                ${boy(520, 320, { mood: "wow" })}`;
        case "mom":
            return `${skyGround(p, "day")}
                <rect x="80" y="280" width="160" height="140" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                <ellipse cx="160" cy="300" rx="28" ry="12" fill="${p.ink}"/>
                <path d="M140 300 v-30 h40 v30" fill="${p.red}" stroke="${p.ink}" stroke-width="4"/>
                ${mom(200, 300, { pose: "work", mood: "grit" })}${boy(480, 320, { mood: "smile" })}`;
        case "poor":
            return `${skyGround(p, "day")}${house(180, 420, p, { tiny: true })}${boy(430, 310, { mood: "sad" })}
                <ellipse cx="600" cy="360" rx="34" ry="22" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>
                <text x="600" y="368" text-anchor="middle" font-size="28" font-weight="800" fill="${p.ink}">0</text>`;
        case "love":
            return `${skyGround(p, "day")}${house(180, 420, p)}${dad(120, 330, { scale: 0.75 })}${mom(200, 340, { scale: 0.72 })}${boy(430, 310, { mood: "smile" })}${hearts(560, 220, p)}${hearts(620, 280, p)}`;
        case "lovehome":
            return `${skyGround(p, "day")}${house(300, 420, p)}${boy(300, 300, { mood: "smile" })}${hearts(480, 220, p)}`;
        case "makehappy":
            return `${skyGround(p, "day")}${mom(160, 320, { mood: "smile" })}${dad(250, 310, { mood: "smile", scale: 1.05 })}${boy(480, 300, { pose: "wave" })}${ball(560, 430, p)}`;
        case "lovepower":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit" })}${hearts(180, 220, p)}
                <path d="M230 240 L270 300" stroke="${p.red}" stroke-width="6"/>
                <path d="M430 260 l20 -40 l20 40 h-40" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>`;
        case "toddler":
            return `${skyGround(p, "day")}${boy(280, 360, { scale: 0.55, pose: "kick", mood: "smile" })}${ball(420, 450, p, { scale: 1.15 })}
                <text x="560" y="250" font-size="36" font-weight="800" fill="${p.ink}">3岁</text>`;
        case "brothers":
            return `${skyGround(p, "day")}${boy(220, 340, { scale: 0.7, pose: "kick" })}${boy(400, 300, { scale: 0.95, shirt: p.blue, mood: "smile" })}${ball(340, 430, p)}`;
        case "oldball":
            return `${skyGround(p, "day")}${boy(240, 310, { mood: "smile" })}${ball(480, 400, p, { old: true, scale: 1.5 })}`;
        case "kick":
            return `${skyGround(p, "day")}${boy(220, 300, { pose: "kick", mood: "grit" })}${ball(460, 360, p)}
                <path d="M500 340 q40 -20 70 -10" fill="none" stroke="${p.ink}" stroke-width="5"/>`;
        case "happy":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "smile", pose: "wave" })}${ball(160, 430, p)}${hearts(520, 220, p)}`;
        case "happyball":
            return `${skyGround(p, "day")}${boy(260, 300, { mood: "smile" })}${ball(500, 320, p, { scale: 1.6 })}${hearts(560, 200, p)}`;
        case "firstkick":
            return `${skyGround(p, "day")}${boy(300, 370, { scale: 0.5, pose: "kick" })}${ball(400, 460, p, { scale: 0.7 })}`;
        case "dreamstart":
            return `${skyGround(p, "dream")}${boy(240, 360, { scale: 0.6, mood: "wow" })}${ball(420, 430, p)}
                <polygon points="560,120 575,160 620,160 585,185 598,230 560,200 522,230 535,185 500,160 545,160" fill="${p.sun}"/>`;
        case "streetkick":
            return `${skyGround(p, "day")}${street(p)}
                <rect x="40" y="220" width="90" height="180" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                <rect x="640" y="200" width="90" height="200" fill="${p.blue}" stroke="${p.ink}" stroke-width="5"/>
                ${boy(300, 300, { pose: "kick" })}${ball(470, 400, p)}`;
        case "narrow":
            return `${skyGround(p, "day")}
                <rect x="180" y="160" width="70" height="280" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                <rect x="520" y="140" width="80" height="300" fill="${p.blue}" stroke="${p.ink}" stroke-width="5"/>
                ${street(p)}${boy(360, 310, { scale: 0.85 })}${ball(430, 420, p)}`;
        case "run":
            return `${skyGround(p, "day")}${boy(240, 300, { pose: "run", mood: "grit" })}${ball(520, 390, p)}
                <path d="M80 360 h70M70 390 h80" stroke="${p.ink}" stroke-width="5" opacity=".4"/>`;
        case "neighbors":
            return `${skyGround(p, "day")}
                <rect x="60" y="200" width="200" height="200" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                <rect x="90" y="230" width="50" height="50" fill="${p.sky}" stroke="${p.ink}" stroke-width="4"/>
                <rect x="170" y="230" width="50" height="50" fill="${p.sky}" stroke="${p.ink}" stroke-width="4"/>
                <circle cx="115" cy="255" r="10" fill="${p.skin}"/><circle cx="195" cy="255" r="10" fill="${p.skin}"/>
                ${boy(430, 300, { pose: "kick" })}${ball(560, 400, p)}`;
        case "nightrun":
            return `${skyGround(p, "night")}${boy(260, 300, { pose: "run", mood: "grit" })}${ball(500, 390, p)}`;
        case "othershome":
            return `${skyGround(p, "sunset")}${house(140, 400, p)}${house(300, 400, p)}${kid(160, 340, { scale: 0.55 })}${kid(300, 340, { scale: 0.55, shirt: p.pink })}${boy(540, 300, { pose: "kick" })}${ball(640, 400, p)}`;
        case "alonekick":
            return `${skyGround(p, "sunset")}${boy(300, 300, { pose: "kick", mood: "grit" })}${ball(500, 370, p)}`;
        case "notired":
            return `${skyGround(p, "day")}${boy(280, 300, { mood: "grit", pose: "run" })}
                <circle cx="430" cy="210" r="8" fill="${p.blue}"/><circle cx="450" cy="230" r="6" fill="${p.blue}"/>${ball(540, 400, p)}`;
        case "team":
            return `${skyGround(p, "day")}${boy(180, 320, { shirt: p.red })}${boy(320, 310, { shirt: p.red })}${boy(460, 320, { shirt: p.red })}${ball(600, 420, p)}`;
        case "dadclub":
            return `${skyGround(p, "day")}${dad(180, 290, { pose: "work" })}${boy(400, 320, { mood: "wow" })}
                <rect x="520" y="240" width="160" height="180" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                <text x="600" y="340" text-anchor="middle" font-size="22" font-weight="800">队</text>`;
        case "smallboy":
            return `${skyGround(p, "day")}${boy(200, 360, { scale: 0.55 })}${person(380, 280, p, { shirt: p.blue, scale: 1.2 })}${person(540, 270, p, { shirt: p.sun, scale: 1.25 })}${ball(280, 450, p)}`;
        case "serious":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit" })}${ball(500, 420, p)}`;
        case "coachsee":
            return `${skyGround(p, "day")}${coach(160, 290, { pose: "point" })}${boy(430, 310, { pose: "run" })}${ball(580, 400, p)}`;
        case "coachfast":
            return `${skyGround(p, "day")}${coach(140, 290, { pose: "point", mood: "wow" })}${boy(400, 300, { pose: "run" })}
                <path d="M500 300 h80M500 330 h70" stroke="${p.ink}" stroke-width="5"/>`;
        case "train":
            return `${skyGround(p, "day")}
                <rect x="120" y="390" width="18" height="50" fill="${p.sun}" stroke="${p.ink}" stroke-width="3"/>
                <rect x="180" y="390" width="18" height="50" fill="${p.sun}" stroke="${p.ink}" stroke-width="3"/>
                ${boy(300, 300, { pose: "run", mood: "grit" })}${ball(500, 400, p)}`;
        case "teamhome":
            return `${skyGround(p, "day")}${house(140, 420, p)}${boy(300, 320)}${boy(400, 320, { shirt: p.blue })}${boy(500, 320, { shirt: p.sun })}${hearts(600, 220, p)}`;
        case "trainnight":
            return `${skyGround(p, "night")}${boy(300, 300, { pose: "kick", mood: "grit" })}${ball(500, 380, p)}`;
        case "last":
            return `${skyGround(p, "sunset")}${goal(520, 220, p)}${boy(240, 300, { mood: "grit" })}${ball(400, 420, p)}`;
        case "first":
            return `${skyGround(p, "day")}<circle cx="140" cy="90" r="50" fill="#ffd89a"/>
                ${boy(300, 300, { pose: "run" })}${ball(500, 400, p)}`;
        case "sweat":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit", pose: "run" })}
                <circle cx="420" cy="200" r="9" fill="${p.blue}"/><circle cx="450" cy="230" r="7" fill="${p.blue}"/><circle cx="400" cy="240" r="6" fill="${p.blue}"/>`;
        case "habit":
            return `${skyGround(p, "day")}
                <rect x="80" y="180" width="200" height="220" fill="${p.fill}" stroke="${p.ink}" stroke-width="5"/>
                <text x="180" y="280" text-anchor="middle" font-size="28" font-weight="800">一二三</text>
                ${boy(460, 300, { mood: "grit" })}`;
        case "portrait":
            return `${skyGround(p, "day")}${boy(320, 280, { scale: 1.25, mood: "smile" })}${ball(560, 420, p)}
                <rect x="80" y="200" width="120" height="50" rx="16" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
                <text x="140" y="234" text-anchor="middle" font-size="28" font-weight="800">C罗</text>`;
        case "review":
            return `${skyGround(p, "day")}${book(260, 280, p)}${boy(480, 310, { mood: "smile" })}`;
        case "dreampower":
            return `${skyGround(p, "dream")}${boy(240, 320, { mood: "grit" })}${ball(500, 240, p, { scale: 1.6 })}${hearts(420, 180, p)}`;
        case "age10":
            return `${skyGround(p, "day")}${boy(300, 300, { scale: 0.9 })}${ball(500, 420, p)}
                <text x="140" y="240" font-size="40" font-weight="800" fill="${p.ink}">10</text>`;
        case "bigteam":
            return `${skyGround(p, "day")}${boy(160, 340, { scale: 0.7 })}${person(340, 280, p, { shirt: p.red, scale: 1.15 })}${person(500, 270, p, { shirt: p.red, scale: 1.2 })}${ball(640, 420, p)}`;
        case "progress":
            return `${skyGround(p, "day")}
                <path d="M80 420 h80 v-50 h80 v-50 h80 v-50 h80" fill="none" stroke="${p.ink}" stroke-width="8"/>
                ${boy(500, 250, { mood: "smile" })}${ball(620, 400, p)}`;
        case "coachlike":
            return `${skyGround(p, "day")}${coach(180, 290, { mood: "smile" })}${boy(430, 310, { mood: "smile" })}${hearts(560, 210, p)}`;
        case "betterball":
            return `${skyGround(p, "day")}${boy(220, 310, { mood: "smile" })}${ball(500, 320, p, { scale: 1.8 })}
                <polygon points="500,160 510,190 540,190 516,208 526,238 500,218 474,238 484,208 460,190 490,190" fill="${p.sun}"/>`;
        case "dribble":
            return `${skyGround(p, "day")}${boy(180, 300, { pose: "run", mood: "grit" })}${ball(340, 400, p)}${person(520, 300, p, { shirt: p.blue, mood: "wow" })}`;
        case "age12":
            return `${skyGround(p, "day")}${boy(300, 290, { scale: 1 })}${suitcase(500, 400, p)}
                <text x="140" y="240" font-size="40" font-weight="800">12</text>`;
        case "goodbye":
            return `${skyGround(p, "sunset")}${house(160, 420, p)}${mom(140, 330, { pose: "wave", mood: "sad" })}${boy(420, 310, { mood: "sad" })}${suitcase(540, 400, p)}`;
        case "goodbyehard":
            return `${skyGround(p, "sunset")}${house(180, 420, p)}${boy(400, 310, { mood: "sad" })}${suitcase(540, 400, p)}`;
        case "golisbon":
            return `${skyGround(p, "day")}${buildings(p, false)}${boy(500, 310, { pose: "run" })}${suitcase(620, 400, p)}
                <text x="160" y="180" font-size="28" font-weight="800">里斯本</text>`;
        case "lisbon":
            return `${skyGround(p, "day")}${buildings(p, true)}${boy(520, 340, { scale: 0.7, mood: "wow" })}`;
        case "homesick":
            return `${skyGround(p, "night")}${boy(240, 320, { mood: "sad", pose: "sit" })}${house(520, 400, p)}`;
        case "homesicksad":
            return `${skyGround(p, "night")}${boy(300, 320, { mood: "sad" })}${house(140, 400, p)}${hearts(520, 220, p)}`;
        case "cry":
            return `${skyGround(p, "night")}${boy(340, 300, { mood: "sad" })}`;
        case "nogiveup":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit", pose: "run" })}${ball(520, 400, p)}`;
        case "tease":
            return `${skyGround(p, "day")}${boy(180, 330, { mood: "sad" })}${kid(400, 300, { pose: "point", mood: "smile" })}${kid(520, 310, { pose: "point", shirt: p.sun })}
                <rect x="560" y="180" width="140" height="50" rx="16" fill="#fff" stroke="${p.ink}" stroke-width="4"/>
                <text x="630" y="214" text-anchor="middle" font-size="22" font-weight="800">口音?</text>`;
        case "sad":
            return `${skyGround(p, "day")}${boy(340, 300, { mood: "sad" })}`;
        case "wanthome":
            return `${skyGround(p, "night")}${boy(240, 320, { mood: "sad" })}${house(500, 400, p)}`;
        case "stayed":
            return `${skyGround(p, "day")}${house(120, 420, p)}${boy(420, 300, { mood: "grit" })}${ball(560, 420, p)}`;
        case "wordpower":
            return `${skyGround(p, "day")}${boy(280, 300, { mood: "grit" })}
                <rect x="470" y="180" width="180" height="50" rx="14" fill="#fff" stroke="${p.ink}" stroke-width="4"/>
                <text x="560" y="214" text-anchor="middle" font-size="22" font-weight="800">话→力</text>`;
        case "ballfriend":
            return `${skyGround(p, "day")}${boy(260, 310, { mood: "smile" })}${ball(480, 360, p, { scale: 1.5 })}${hearts(560, 220, p)}`;
        case "school":
            return `${skyGround(p, "night")}${hospitalWall(p)}${bed(220, 400, p)}${boy(400, 320, { mood: "sad", pose: "sit" })}`;
        case "nightmom":
            return `${skyGround(p, "night")}${bed(220, 400, p)}${boy(260, 330, { pose: "sit", mood: "sad" })}${mom(520, 220, { scale: 0.7 })}`;
        case "phone":
            return `${skyGround(p, "night")}${boy(260, 310, { mood: "smile" })}${phone(420, 280, p)}${house(560, 400, p)}`;
        case "sayeffort":
            return `${skyGround(p, "day")}${boy(300, 300, { pose: "wave" })}
                <rect x="470" y="190" width="200" height="54" rx="16" fill="#fff" stroke="${p.ink}" stroke-width="5"/>
                <text x="570" y="226" text-anchor="middle" font-size="24" font-weight="800">我会努力</text>`;
        case "momlove":
            return `${skyGround(p, "day")}${mom(180, 300, { mood: "smile" })}${boy(400, 310)}${hearts(560, 210, p)}`;
        case "lovestand":
            return `${skyGround(p, "day")}${boy(320, 300, { mood: "grit" })}${hearts(180, 220, p)}${hearts(500, 200, p)}`;
        case "thin":
            return `${skyGround(p, "day")}${boy(300, 300, { scale: 0.75, mood: "grit" })}${ball(500, 420, p)}`;
        case "twofeet":
            return `${skyGround(p, "day")}${boy(240, 300, { pose: "kick" })}${ball(430, 400, p)}${ball(560, 400, p)}`;
        case "nightball":
            return `${skyGround(p, "night")}${boy(260, 320, { pose: "sit", mood: "wow" })}${ball(500, 260, p, { scale: 1.4 })}`;
        case "shoot":
            return `${skyGround(p, "day")}${boy(160, 300, { pose: "kick", mood: "grit" })}${ball(400, 280, p)}${goal(520, 220, p)}`;
        case "sweatpower":
            return `${skyGround(p, "day")}${boy(280, 300, { mood: "grit" })}
                <circle cx="430" cy="210" r="8" fill="${p.blue}"/>${hearts(520, 220, p)}`;
        case "coacheffort":
            return `${skyGround(p, "day")}${coach(160, 290, { pose: "point" })}${boy(420, 300, { pose: "run", mood: "grit" })}
                <circle cx="540" cy="210" r="7" fill="${p.blue}"/>`;
        case "dreamgt":
            return `${skyGround(p, "dream")}${house(140, 400, p)}${boy(320, 320, { mood: "wow" })}${ball(560, 220, p, { scale: 1.8 })}`;
        case "courage":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit" })}
                <path d="M480 260 l18 -50 l18 50 h-36" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>`;
        case "age15":
            return `${skyGround(p, "day")}${boy(300, 290, { scale: 1.05 })}${ball(520, 420, p)}
                <text x="140" y="240" font-size="40" font-weight="800">15</text>`;
        case "heartbeat":
            return `${skyGround(p, "day")}${boy(260, 310, { mood: "wow" })}
                <path d="M430 260 h30 l12 -30 l16 60 l14 -40 h40" fill="none" stroke="${p.red}" stroke-width="8"/>`;
        case "doctor":
            return `${skyGround(p, "day")}${hospitalWall(p)}${person(200, 300, p, { shirt: "#fff", mood: "smile" })}${boy(460, 310, { mood: "wow" })}`;
        case "surgerytalk":
            return `${skyGround(p, "day")}${hospitalWall(p)}${person(200, 300, p, { shirt: "#fff", pose: "point" })}${boy(480, 310, { mood: "wow" })}
                <rect x="520" y="180" width="180" height="50" rx="14" fill="#fff" stroke="${p.ink}" stroke-width="4"/>
                <text x="610" y="214" text-anchor="middle" font-size="22" font-weight="800">要手术</text>`;
        case "scared":
            return `${skyGround(p, "night")}${boy(340, 300, { mood: "wow" })}${hospitalWall(p)}`;
        case "wantplay":
            return `${skyGround(p, "day")}${boy(280, 300, { mood: "grit", pose: "kick" })}${ball(500, 400, p)}`;
        case "dreamfear":
            return `${skyGround(p, "dream")}${boy(220, 330, { mood: "wow" })}${ball(520, 240, p, { scale: 1.7 })}`;
        case "surgery":
            return `${skyGround(p, "day")}${hospitalWall(p)}${bed(220, 400, p)}${boy(240, 340, { pose: "sit", mood: "wow", scale: 0.8 })}`;
        case "surgerysmall":
            return `${skyGround(p, "day")}${hospitalWall(p)}${boy(480, 310, { mood: "smile", scale: 0.9 })}`;
        case "standup":
            return `${skyGround(p, "day")}${bed(160, 420, p)}${boy(380, 280, { mood: "grit" })}${ball(560, 420, p)}`;
        case "coachslow":
            return `${skyGround(p, "day")}${coach(180, 290, { pose: "point" })}${boy(430, 320, { scale: 0.9 })}
                <text x="560" y="230" font-size="24" font-weight="800">慢慢来</text>`;
        case "bodyback":
            return `${skyGround(p, "day")}${boy(300, 290, { mood: "smile", pose: "run" })}${ball(520, 400, p)}`;
        case "heartstrong":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit" })}${hearts(500, 220, p)}`;
        case "crybaby":
            return `${skyGround(p, "day")}${boy(220, 320, { mood: "sad" })}${kid(460, 300, { pose: "point" })}
                <rect x="520" y="180" width="170" height="50" rx="14" fill="#fff" stroke="${p.ink}" stroke-width="4"/>
                <text x="605" y="214" text-anchor="middle" font-size="22" font-weight="800">爱哭</text>`;
        case "heard":
            return `${skyGround(p, "day")}${boy(320, 300, { mood: "sad" })}
                <path d="M480 220 a40 40 0 0 1 0 70" fill="none" stroke="${p.ink}" stroke-width="6"/>
                <path d="M510 200 a70 70 0 0 1 0 110" fill="none" stroke="${p.ink}" stroke-width="6"/>`;
        case "effortanswer":
            return `${skyGround(p, "day")}${boy(260, 300, { mood: "grit", pose: "run" })}
                <rect x="470" y="190" width="200" height="50" rx="14" fill="#fff" stroke="${p.ink}" stroke-width="4"/>
                <text x="570" y="224" text-anchor="middle" font-size="22" font-weight="800">努力！</text>`;
        case "talent":
            return `${skyGround(p, "day")}${boy(260, 310, { mood: "grit" })}
                <text x="500" y="250" font-size="28" font-weight="800">天赋 ≠ 够</text>${ball(560, 420, p)}`;
        case "brave":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit" })}${ball(520, 420, p)}`;
        case "seesweat":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "grit", pose: "run" })}${kid(120, 330, { mood: "wow" })}
                <circle cx="430" cy="200" r="8" fill="${p.blue}"/>`;
        case "sweatwords":
            return `${skyGround(p, "day")}${boy(240, 300, { mood: "grit" })}
                <circle cx="400" cy="210" r="9" fill="${p.blue}"/>
                <text x="520" y="250" font-size="26" font-weight="800">汗 &gt; 话</text>`;
        case "match":
            return `${skyGround(p, "day")}${goal(500, 210, p)}${boy(200, 300, { pose: "run", mood: "grit" })}${ball(400, 400, p)}
                <rect x="40" y="160" width="120" height="40" fill="${p.red}"/><text x="100" y="188" text-anchor="middle" font-size="18" fill="#fff" font-weight="800">比赛</text>`;
        case "goal":
            return `${skyGround(p, "day")}${goal(480, 200, p)}${ball(560, 300, p)}${boy(180, 300, { mood: "smile", pose: "wave" })}`;
        case "clap":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "smile" })}${kid(80, 330, { pose: "wave" })}${kid(180, 340, { pose: "wave", shirt: p.sun })}${kid(560, 330, { pose: "wave" })}`;
        case "effortlight":
            return `${skyGround(p, "sunset")}${boy(280, 300, { mood: "smile" })}
                <circle cx="520" cy="180" r="50" fill="${p.sun}"/>`;
        case "trust":
            return `${skyGround(p, "day")}${coach(180, 290, { mood: "smile" })}${boy(430, 310, { mood: "smile" })}`;
        case "trusteffort":
            return `${skyGround(p, "day")}${coach(160, 290)}${boy(400, 300, { pose: "run", mood: "grit" })}`;
        case "heartpast":
            return `${skyGround(p, "day")}${hospitalWall(p)}${boy(500, 300, { mood: "smile", pose: "run" })}${ball(640, 420, p)}`;
        case "strongcr7":
            return `${skyGround(p, "day")}${boy(320, 270, { scale: 1.2, mood: "grit" })}${ball(560, 420, p)}`;
        case "ready":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "wow", pose: "wave" })}${suitcase(500, 400, p)}${ball(600, 420, p)}`;
        case "nextstep":
            return `${skyGround(p, "day")}${boy(200, 320, { pose: "run" })}${plane(420, 180, p)}${flagUK(560, 220)}`;
        case "age18":
            return `${skyGround(p, "day")}${boy(300, 280, { scale: 1.15 })}${plane(500, 180, p)}
                <text x="140" y="240" font-size="40" font-weight="800">18</text>`;
        case "england":
            return `${skyGround(p, "day")}${plane(180, 160, p)}${flagUK(420, 180)}${boy(500, 310, { mood: "wow" })}`;
        case "united":
            return `${skyGround(p, "day")}${boy(280, 300, { shirt: "#da291c", mood: "smile" })}${flagUK(80, 160)}
                <text x="500" y="230" font-size="26" font-weight="800">曼联</text>${ball(560, 420, p)}`;
        case "newcountry":
            return `${skyGround(p, "day")}${buildings(p, true)}${flagUK(80, 150)}${boy(520, 330, { mood: "wow", scale: 0.85 })}`;
        case "language":
            return `${skyGround(p, "day")}${boy(240, 310, { mood: "wow" })}
                <text x="480" y="240" font-size="40" font-weight="800">A</text>
                <text x="560" y="300" font-size="40" font-weight="800">文</text>
                ${book(500, 380, p)}`;
        case "study":
            return `${skyGround(p, "day")}${boy(260, 310, { mood: "smile" })}${book(480, 300, p)}`;
        case "newstory":
            return `${skyGround(p, "day")}${book(180, 280, p)}${boy(420, 300, { pose: "wave" })}${plane(560, 160, p)}`;
        case "efforthelp":
            return `${skyGround(p, "day")}${boy(240, 300, { mood: "grit" })}${kid(500, 340, { mood: "smile" })}${hearts(400, 200, p)}`;
        case "newhome":
            return `${skyGround(p, "day")}${house(400, 420, p)}${boy(220, 310, { mood: "smile" })}${suitcase(140, 400, p)}`;
        case "islandwin":
            return `${skyGround(p, "day")}${sea(p)}${palm(120, 400, p)}${boy(360, 300, { mood: "smile", pose: "wave" })}${trophy(560, 280, p)}`;
        case "famous":
            return `${skyGround(p, "day")}${boy(300, 280, { scale: 1.15, mood: "smile" })}${trophy(520, 260, p)}`;
        case "star":
            return `${skyGround(p, "dream")}${boy(260, 300, { mood: "smile" })}
                <polygon points="520,90 540,150 600,150 550,185 570,245 520,205 470,245 490,185 440,150 500,150" fill="${p.sun}"/>`;
        case "rememberisland":
            return `${skyGround(p, "day")}${sea(p)}${palm(160, 400, p)}${house(240, 400, p, { tiny: true })}${boy(500, 300, { mood: "smile" })}`;
        case "rememberhome":
            return `${skyGround(p, "day")}${house(200, 420, p)}${boy(430, 300, { mood: "smile" })}${hearts(560, 210, p)}`;
        case "helphome":
            return `${skyGround(p, "day")}${house(180, 420, p)}${mom(160, 330, { mood: "smile" })}${boy(420, 300, { pose: "wave" })}${hearts(560, 210, p)}`;
        case "helpkids":
            return `${skyGround(p, "day")}${boy(200, 280, { scale: 1.1, mood: "smile" })}${kid(400, 350, { pose: "kick" })}${kid(520, 360, { shirt: p.sun })}${ball(460, 450, p)}`;
        case "important":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "smile" })}${hearts(500, 220, p)}`;
        case "returnisland":
            return `${skyGround(p, "day")}${sea(p)}${palm(140, 400, p)}${house(230, 400, p, { tiny: true })}${boy(480, 300, { pose: "wave" })}${suitcase(600, 400, p)}`;
        case "youcan":
            return `${skyGround(p, "day")}${boy(200, 290, { pose: "point" })}${kid(430, 340, { mood: "wow", shirt: p.blue })}${kid(540, 350, { shirt: p.pink })}${ball(480, 450, p)}`;
        case "littleday":
            return `${skyGround(p, "day")}${book(200, 300, p)}${kid(420, 320, { mood: "smile", shirt: p.blue })}
                <text x="560" y="240" font-size="26" font-weight="800">每天一点</text>`;
        case "rememberstart":
            return `${skyGround(p, "day")}${boy(180, 360, { scale: 0.55, pose: "kick" })}${boy(480, 280, { scale: 1.1, mood: "smile" })}${ball(280, 450, p)}`;
        case "effortmost":
            return `${skyGround(p, "day")}${boy(280, 300, { mood: "grit" })}
                <text x="520" y="250" font-size="28" font-weight="800">努力</text>${ball(560, 420, p)}`;
        case "wantwin":
            return `${skyGround(p, "day")}${goal(500, 210, p)}${boy(200, 300, { pose: "run", mood: "grit" })}${trophy(420, 240, p)}`;
        case "notenough":
            return `${skyGround(p, "day")}${boy(260, 300, { mood: "grit" })}${trophy(480, 260, p)}
                <text x="600" y="250" font-size="40" font-weight="800">?</text>`;
        case "storygo":
            return `${skyGround(p, "day")}${book(180, 280, p)}${boy(430, 300, { pose: "run" })}${ball(600, 420, p)}`;
        case "youdream":
            return `${skyGround(p, "dream")}${kid(240, 330, { mood: "wow", shirt: p.blue })}${ball(500, 240, p, { scale: 1.6 })}`;
        case "youslow":
            return `${skyGround(p, "day")}${kid(300, 320, { shirt: p.blue, mood: "smile" })}${book(500, 300, p)}`;
        case "chinese":
            return `${skyGround(p, "day")}${kid(260, 320, { shirt: p.blue, mood: "wow" })}
                <text x="500" y="250" font-size="48" font-weight="800">文</text>${book(520, 360, p)}`;
        case "younogiveup":
            return `${skyGround(p, "day")}${kid(300, 320, { shirt: p.blue, mood: "grit", pose: "run" })}${book(520, 300, p)}`;
        case "power":
            return `${skyGround(p, "day")}${kid(260, 320, { shirt: p.blue, mood: "grit" })}
                <path d="M460 260 l20 -50 l20 50 h-40" fill="${p.sun}" stroke="${p.ink}" stroke-width="4"/>`;
        case "storylong":
            return `${skyGround(p, "day")}${book(200, 260, p)}${boy(180, 380, { scale: 0.5 })}${boy(420, 300, { scale: 1 })}${trophy(600, 260, p)}`;
        case "fifteen":
            return `${skyGround(p, "day")}${kid(280, 320, { shirt: p.blue, mood: "smile" })}${book(480, 300, p)}
                <text x="140" y="230" font-size="32" font-weight="800">15分</text>`;
        case "day30":
            return `${skyGround(p, "day")}${boy(300, 300, { mood: "smile" })}${trophy(520, 260, p)}
                <text x="140" y="230" font-size="40" font-weight="800">30</text>`;
        case "islandworld":
            return `${skyGround(p, "day")}${sea(p)}${palm(80, 400, p)}${house(140, 400, p, { tiny: true })}${boy(360, 300, { pose: "run" })}${buildings(p, false)}`;
        case "timeline":
            return `${skyGround(p, "day")}${boy(80, 380, { scale: 0.45, pose: "kick" })}${boy(260, 330, { scale: 0.75 })}${boy(440, 290, { scale: 1 })}${trophy(620, 260, p)}`;
        case "youstart":
            return `${skyGround(p, "day")}${kid(300, 320, { shirt: p.blue, pose: "wave", mood: "smile" })}${book(500, 300, p)}`;
        case "tomorrow":
            return `${skyGround(p, "day")}${kid(280, 320, { shirt: p.blue, mood: "smile" })}${book(480, 300, p)}
                <text x="140" y="230" font-size="32" font-weight="800">明天</text>`;
        case "effort":
            return `${skyGround(p, "day")}${boy(280, 300, { mood: "grit", pose: "run" })}${ball(520, 400, p)}`;
        case "play":
        default:
            return `${skyGround(p, "day")}${boy(280, 300, { mood: "smile" })}${ball(500, 400, p)}`;
    }
}

function pictureFileName(day, line) {
    const d = String(day).padStart(2, "0");
    const n = String(Number(line) + 1).padStart(2, "0");
    return `pictures/d${d}-l${n}.svg`;
}

function buildSentencePicture(zh, scene, style) {
    const p = picturePalette(style || "comic");
    const shot = shotFor(zh);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 576" role="img" aria-label="${esc(zh)}">
        ${drawShot(shot, p)}
        ${captionBar(zh, p)}
    </svg>`;
}

function paintSentencePicture(box, zh, scene, style, day, line) {
    if (!box) return;
    const file = day ? pictureFileName(day, line) : "";
    if (file) {
        box.innerHTML = `<img class="baked-art style-${esc(style || "comic")}" alt="${esc(zh)}" src="${file}">`;
        const img = box.querySelector("img");
        if (img) {
            img.onerror = function () {
                box.innerHTML = buildSentencePicture(zh, scene, style);
            };
        }
        return;
    }
    box.innerHTML = buildSentencePicture(zh, scene, style);
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        buildSentencePicture,
        pictureFileName,
        shotFor,
        EXACT_SHOT,
    };
}
