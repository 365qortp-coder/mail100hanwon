import sharp from "sharp";
import fs from "node:fs";
const targets = [
  "677e7b55-df3e-46b0-948b-8ceb96f7c708.tmp",
  "119205b4-d50e-40db-9a06-332661de237a.tmp",
];
for (const t of targets) {
  const full = "C:/Users/mong-/AppData/Local/Temp/" + t;
  const buf = fs.readFileSync(full);
  console.log("===", t, "size", buf.length);
  // Find ALL JPEG starts (FFD8FF) — extract each as separate JPEG
  const starts = [];
  for (let i = 0; i < buf.length - 3; i++) {
    if (buf[i] === 0xff && buf[i+1] === 0xd8 && buf[i+2] === 0xff) starts.push(i);
  }
  console.log("  JPEG start markers:", starts.length);
  // Pull each segment, measure dims
  for (let k = 0; k < starts.length; k++) {
    const start = starts[k];
    const end = starts[k+1] || buf.length;
    const seg = buf.slice(start, end);
    if (seg.length < 5000) continue;
    try {
      const m = await sharp(seg).metadata();
      console.log("  seg", k, "@", start, "size", seg.length, "→", m.width + "x" + m.height);
      if (m.width >= 600 && m.height >= 400) {
        const dest = "C:/Users/mong-/AppData/Local/Temp/extracted-" + t + "-" + k + ".webp";
        await sharp(seg).resize(1000, null, { withoutEnlargement: true }).webp({ quality: 80 }).toFile(dest);
        console.log("    saved peek →", dest);
      }
    } catch (e) {}
  }
}
