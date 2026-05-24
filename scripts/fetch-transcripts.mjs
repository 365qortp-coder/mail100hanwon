#!/usr/bin/env node
/**
 * Bulk transcript prefetcher.
 *
 * Walks every video in content/youtube-queue.json (both queue and processed),
 * tries multiple fetch strategies, and saves successful transcripts to
 * content/transcripts/{videoId}.txt. generate-column.mjs reads from this
 * cache first, falling back to a live fetch only when the file is missing.
 *
 * Run periodically (manually or via a separate Action) to refresh.
 *   node scripts/fetch-transcripts.mjs            # try uncached videos
 *   node scripts/fetch-transcripts.mjs --refresh  # re-fetch everything
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { YoutubeTranscript } from "youtube-transcript";

const __filename = fileURLToPath(import.meta.url);
const ROOT = path.resolve(path.dirname(__filename), "..");
const QUEUE_FILE = path.join(ROOT, "content", "youtube-queue.json");
const TRANSCRIPTS_DIR = path.join(ROOT, "content", "transcripts");
const REFRESH = process.argv.includes("--refresh");

fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });

function extractVideoId(input) {
  if (!input) return null;
  const direct = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (direct) return input;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    const v = url.searchParams.get("v");
    if (v) return v;
    const m = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
  } catch {}
  return null;
}

async function tryFetch(videoId) {
  // Strategy ladder: most specific first, then fall back to defaults.
  const attempts = [
    { lang: "ko" },
    { lang: "en" },
    {}, // library defaults — sometimes picks up auto-captions the lang-pinned call misses
  ];
  for (const opts of attempts) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId, opts);
      if (items && items.length) {
        return {
          text: items.map((i) => i.text).join(" "),
          method: opts.lang || "default",
        };
      }
    } catch {
      // try next strategy
    }
  }
  return null;
}

async function main() {
  const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
  const all = [...queue.queue, ...queue.processed];
  const seen = new Set();
  const targets = [];
  for (const e of all) {
    const id = e.videoId || extractVideoId(e.url);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    targets.push({ id, hint: e.hint || "" });
  }
  console.log(`Targets: ${targets.length} unique videos`);

  let ok = 0, cached = 0, failed = 0;
  const failures = [];
  for (const t of targets) {
    const file = path.join(TRANSCRIPTS_DIR, `${t.id}.txt`);
    if (!REFRESH && fs.existsSync(file)) {
      cached++;
      continue;
    }
    const result = await tryFetch(t.id);
    if (result) {
      fs.writeFileSync(file, result.text, "utf8");
      console.log(`✓ ${t.id} [${result.method}] ${result.text.length}ch · ${t.hint}`);
      ok++;
    } else {
      console.log(`✗ ${t.id} · ${t.hint}`);
      failed++;
      failures.push({ id: t.id, hint: t.hint });
    }
  }

  console.log(`\nSummary: ${ok} fetched, ${cached} already cached, ${failed} failed`);
  if (failures.length) {
    const log = path.join(TRANSCRIPTS_DIR, "_failures.json");
    fs.writeFileSync(log, JSON.stringify(failures, null, 2));
    console.log(`Failures logged to ${log}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
