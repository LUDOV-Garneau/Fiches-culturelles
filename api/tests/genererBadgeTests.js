import fs from "fs";

const raw = JSON.parse(fs.readFileSync("./coverage/coverage-final.json", "utf8"));
let covered = 0;
let total = 0;

for (const file of Object.values(raw)) {
  const s = file.s || {};
  total += Object.keys(s).length;
  covered += Object.values(s).filter(v => v > 0).length;
}

const pct = total === 0 ? 0 : Math.round((covered / total) * 100);

const color =
  pct >= 90 ? "brightgreen" :
  pct >= 80 ? "green" :
  pct >= 70 ? "yellowgreen" :
  pct >= 60 ? "yellow" :
  pct >= 50 ? "orange" : "red";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="130" height="20">
  <linearGradient id="a" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <rect rx="3" width="130" height="20" fill="#555"/>
  <rect rx="3" x="80" width="50" height="20" fill="${color}"/>
  <path fill="${color}" d="M80 0h4v20h-4z"/>
  <rect rx="3" width="130" height="20" fill="url(#a)"/>
  <g fill="#fff" text-anchor="middle"
     font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="40" y="15" fill="#010101" fill-opacity=".3">api coverage</text>
    <text x="40" y="14">api coverage</text>
    <text x="105" y="15" fill="#010101" fill-opacity=".3">${pct}%</text>
    <text x="105" y="14">${pct}%</text>
  </g>
</svg>
`;

fs.writeFileSync("./coverage-badge.svg", svg);