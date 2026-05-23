import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const logoSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='140' viewBox='0 0 600 140'>
  <style>
    .badge { fill: #c0252d; }
    .badge-text { fill: white; font-family: 'Malgun Gothic','Noto Sans KR',sans-serif; font-weight: 900; font-size: 42px; }
    .main { fill: #111; font-family: 'Malgun Gothic','Noto Serif KR',serif; font-weight: 900; font-size: 92px; letter-spacing: -3px; }
  </style>
  <rect x='10' y='15' width='85' height='110' rx='7' class='badge'/>
  <text x='52' y='60' text-anchor='middle' class='badge-text'>매</text>
  <text x='52' y='110' text-anchor='middle' class='badge-text'>일</text>
  <text x='112' y='108' class='main'>백세한의원</text>
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

// Favicon — red circle + white ㅁㅇ (매일 initials)
const faviconSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
  <circle cx='256' cy='256' r='256' fill='#c0252d'/>
  <g font-family='Malgun Gothic,Noto Sans KR,sans-serif' font-weight='900' font-size='250' fill='white' text-anchor='middle'>
    <text x='150' y='342'>ㅁ</text>
    <text x='362' y='342'>ㅇ</text>
  </g>
</svg>`;

await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(path.join("public", "favicon.png"));
await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile(path.join("public", "apple-touch-icon.png"));
await sharp(Buffer.from(faviconSvg)).resize(512, 512).png().toFile(path.join("public", "icon-512.png"));

console.log("logo:        ", fs.statSync("public/logo.png").size, "bytes");
console.log("og:          ", fs.statSync("public/og-default.png").size, "bytes");
console.log("favicon:     ", fs.statSync("public/favicon.png").size, "bytes");
console.log("apple-touch: ", fs.statSync("public/apple-touch-icon.png").size, "bytes");
console.log("icon-512:    ", fs.statSync("public/icon-512.png").size, "bytes");
