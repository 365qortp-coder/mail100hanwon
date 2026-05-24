#!/usr/bin/env node
/**
 * Telegram notification — fires after columns are published.
 *
 * Reads content/columns/ for entries with today's date in frontmatter,
 * formats a Markdown message, and POSTs to Telegram's sendMessage API.
 *
 * Required env:
 *   TELEGRAM_BOT_TOKEN  — from @BotFather when you created @wonsuk_brain_bot
 *   TELEGRAM_CHAT_ID    — destination (your personal chat, group, or channel)
 *
 * If either is missing the script no-ops with a warning (safe to keep
 * in the workflow even before secrets are configured).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const SITE = "https://mail100hanwon.co.kr";

if (!TOKEN || !CHAT_ID) {
  console.warn("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping notification");
  process.exit(0);
}

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const COLUMNS_DIR = path.join(ROOT, "content", "columns");

const today = new Date().toISOString().slice(0, 10);
const todays = [];

for (const file of fs.readdirSync(COLUMNS_DIR)) {
  if (!file.endsWith(".md")) continue;
  const text = fs.readFileSync(path.join(COLUMNS_DIR, file), "utf8");
  if (!text.includes(`date: "${today}"`)) continue;
  const titleMatch = text.match(/^title:\s*"(.+)"/m);
  const categoryMatch = text.match(/^category:\s*"(.+)"/m);
  if (!titleMatch) continue;
  todays.push({
    slug: file.replace(/\.md$/, ""),
    title: titleMatch[1],
    category: categoryMatch?.[1] ?? "한방건강",
  });
}

if (todays.length === 0) {
  console.log("No columns published today — skipping notification");
  process.exit(0);
}

// MarkdownV2 (Telegram) requires escaping these — simpler to use legacy Markdown
const lines = [
  `📢 *매일백세한의원 칼럼 ${todays.length}편 발행*`,
  `_${today}_`,
  "",
];
for (const c of todays) {
  const url = `${SITE}/columns/${encodeURIComponent(c.slug)}`;
  lines.push(`▸ [${c.category}] [${c.title}](${url})`);
}
lines.push("");
lines.push(`📚 [전체 칼럼 보기](${SITE}/columns)`);

const text = lines.join("\n");

const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: CHAT_ID,
    text,
    parse_mode: "Markdown",
    disable_web_page_preview: false,
  }),
});

if (!res.ok) {
  const body = await res.text();
  console.error("Telegram API error:", res.status, body);
  process.exit(1);
}

console.log(`✓ Telegram notification sent (${todays.length} columns)`);
