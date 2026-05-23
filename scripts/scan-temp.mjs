import sharp from "sharp";
import fs from "node:fs";
const dir = "C:/Users/mong-/AppData/Local/Temp/";
const files = fs.readdirSync(dir)
  .filter(f => f.endsWith(".tmp"))
  .map(f => ({ f, s: fs.statSync(dir + f) }))
  .filter(x => x.s.size > 500000)
  .sort((a, b) => b.s.mtimeMs - a.s.mtimeMs);
for (const { f, s } of files.slice(0, 12)) {
  const buf = fs.readFileSync(dir + f);
  const magic = buf.slice(0, 12).toString("hex");
  let fmt = "?";
  if (magic.startsWith("89504e47")) fmt = "png";
  else if (magic.startsWith("ffd8ff")) fmt = "jpeg";
  else if (magic.startsWith("52494646") && buf.slice(8, 12).toString("ascii") === "WEBP") fmt = "webp";
  else if (magic.startsWith("28b52ffd")) fmt = "zstd";
  else if (magic.startsWith("47494638")) fmt = "gif";
  console.log(f, s.size, fmt, magic, s.mtime.toISOString().slice(11, 19));
  if (["png", "jpeg", "webp", "gif"].includes(fmt)) {
    try {
      const meta = await sharp(buf).metadata();
      console.log("  →", meta.width + "x" + meta.height);
      await sharp(buf).resize(800, null, { withoutEnlargement: true }).webp({ quality: 78 }).toFile(dir + "peek-" + f + ".webp");
    } catch (e) { console.log("  ERR", e.message.slice(0, 60)); }
  }
}
