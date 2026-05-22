import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const logoSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='520' height='140' viewBox='0 0 520 140'>
  <style>
    .badge { fill: #c0252d; }
    .badge-text { fill: white; font-family: 'Malgun Gothic','Noto Sans KR',sans-serif; font-weight: 900; font-size: 44px; }
    .main { fill: #111; font-family: 'Malgun Gothic','Noto Serif KR',serif; font-weight: 900; font-size: 82px; letter-spacing: -3px; }
  </style>
  <rect x='10' y='15' width='85' height='110' rx='7' class='badge'/>
  <text x='52' y='66' text-anchor='middle' class='badge-text'>매</text>
  <text x='52' y='115' text-anchor='middle' class='badge-text'>일</text>
  <text x='112' y='105' class='main'>백세한의원</text>
</svg>`;

await sharp(Buffer.from(logoSvg)).png().toFile(path.join("public", "logo.png"));

const ogSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='630' viewBox='0 0 1200 630'>
  <style>
    .bg { fill: #ffffff; }
    .badge { fill: #c0252d; }
    .badge-text { fill: white; font-family: 'Malgun Gothic','Noto Sans KR',sans-serif; font-weight: 900; font-size: 80px; }
    .main { fill: #111; font-family: 'Malgun Gothic','Noto Serif KR',serif; font-weight: 900; font-size: 120px; letter-spacing: -4px; }
    .tag { fill: #555; font-family: 'Malgun Gothic','Noto Sans KR',sans-serif; font-weight: 500; font-size: 36px; }
    .sub { fill: #888; font-family: 'Malgun Gothic','Noto Sans KR',sans-serif; font-weight: 400; font-size: 26px; }
  </style>
  <rect width='1200' height='630' class='bg'/>
  <rect x='260' y='180' width='150' height='190' rx='12' class='badge'/>
  <text x='335' y='258' text-anchor='middle' class='badge-text'>매</text>
  <text x='335' y='345' text-anchor='middle' class='badge-text'>일</text>
  <text x='435' y='325' class='main'>백세한의원</text>
  <text x='600' y='455' text-anchor='middle' class='tag'>매일감비환 · 공진단 · 총명공진단</text>
  <text x='600' y='510' text-anchor='middle' class='sub'>서울 중랑구 · 비대면 진료 전국 가능</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png().toFile(path.join("public", "og-default.png"));

console.log("logo:", fs.statSync("public/logo.png").size, "bytes");
console.log("og:  ", fs.statSync("public/og-default.png").size, "bytes");
