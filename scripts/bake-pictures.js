#!/usr/bin/env node
// Bake one built-in SVG per lesson sentence. Run: node scripts/bake-pictures.js

const fs = require("fs");
const path = require("path");
const { buildSentencePicture, pictureFileName, shotFor, EXACT_SHOT } = require("../static/picture.js");

const course = JSON.parse(fs.readFileSync(path.join(__dirname, "../static/data/course.json"), "utf8"));
const outDir = path.join(__dirname, "../static/pictures");
fs.mkdirSync(outDir, { recursive: true });

const manifest = [];
const missing = [];
let count = 0;

course.days.forEach((day) => {
    (day.lines || []).forEach((beat, line) => {
        const zh = beat.sentence.zh;
        if (!EXACT_SHOT[zh]) missing.push(zh);
        const svg = buildSentencePicture(zh, beat.scene || day.scene, "comic");
        const rel = pictureFileName(day.day, line);
        fs.writeFileSync(path.join(__dirname, "../static", rel), svg);
        manifest.push({ day: day.day, line, zh, file: rel, shot: shotFor(zh) });
        count += 1;
    });
});

fs.writeFileSync(
    path.join(__dirname, "../static/data/pictures.json"),
    JSON.stringify(manifest, null, 2) + "\n"
);

const uniqueMissing = [...new Set(missing)];
if (uniqueMissing.length) {
    console.warn("sentences without exact shot (" + uniqueMissing.length + "):");
    uniqueMissing.forEach((zh) => console.warn("  " + zh));
}
console.log("baked " + count + " pictures into static/pictures/");
