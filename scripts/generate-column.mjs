#!/usr/bin/env node
/**
 * Daily YouTube → Multi-angle Column Generator
 *
 * Each run picks up to COLUMNS_PER_RUN columns to generate. A video is
 * processed multiple times across the ANGLES array — each angle is a
 * different search intent (효능·복용법·비교·대상자·주의사항·비용·제조과정),
 * producing distinct SEO columns from the same transcript. The first
 * non-exhausted video in the queue is used; if its remaining angles
 * don't fill the run, the next video is opened in the same execution.
 *
 * Tracking:
 *   queue.queue       — videos with no angle done yet
 *   queue.processed   — entry shape: { url, hint, videoId, angles: [{ id, slug, title, at }] }
 *                        - when angles.length >= ANGLES.length the entry is exhausted
 *                        - status: "no-transcript" entries are skipped
 *
 * Usage:
 *   node scripts/generate-column.mjs                # default queue mode, 3 columns
 *   COLUMNS_PER_RUN=1 node scripts/generate-column.mjs  # override run size
 *   node scripts/generate-column.mjs <youtube-url>  # one-off URL, uses next free angle
 *
 * Required env: ANTHROPIC_API_KEY
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { YoutubeTranscript } from "youtube-transcript";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const QUEUE_FILE = path.join(ROOT, "content", "youtube-queue.json");
const COLUMNS_DIR = path.join(ROOT, "content", "columns");
const TRANSCRIPTS_DIR = path.join(ROOT, "content", "transcripts");
const COLUMNS_PER_RUN = parseInt(process.env.COLUMNS_PER_RUN || "3", 10);

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY env var is required.");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.COLUMN_MODEL || "claude-sonnet-4-6";

// Static prompt — identical across all 3 calls per run and across runs.
// Marked cache_control so subsequent calls within the 5-min TTL pay ~0.1×
// for this prefix instead of the full input rate.
//
// Sonnet 4.6 minimum cacheable prefix is 2048 tokens; the current prompt is
// well below that, so the cache will silently miss until this grows. The
// structure stays right either way — when ANGLES or output spec expand,
// caching will start activating without further code changes. We log
// `cache_read_input_tokens` per call so the cache status is visible.
const SYSTEM_PROMPT = `당신은 매일백세한의원(서울 중랑구 공릉로 21, 송원석 원장)의 SEO 콘텐츠 작가입니다.

매일백세한의원이 운영하는 유튜브 채널의 영상 자막을 받아, 한방 의료 정보 칼럼으로 가공합니다. 같은 영상을 여러 검색 의도에 맞춰 다른 각도의 칼럼으로 발행하는 시스템이며, 매 요청마다 한 각도에 대한 칼럼 한 편을 작성합니다.

[작성 조건 — 모든 칼럼 공통]
- 한국어 자연스러운 문어체 (~합니다 / 어조)
- 1500자 ~ 2500자 분량
- 검색 의도에 맞는 H2(##), H3(###) 헤딩 5~7개 포함
- 매일감비환·공진단·총명공진단·통증치료·비대면 진료 키워드 자연스럽게 포함 (해당 주제에 한해)
- 의료법상 단정적 효과 표현 금지 ("100% 효과", "~을 치료한다", "최고", "유일") — 대신 "~에 도움이 될 수 있습니다", "~한 분들이 자주 찾으십니다" 형태 사용
- 환자 후기·전후 비교·치료 비용 직접 명시·할인 표현 금지
- 본문 마지막에 한 줄 안내: "자세한 상담은 매일백세한의원(02-2234-0102) 또는 카카오톡 채널을 이용해 주세요."

[출력 형식 — 반드시 JSON 한 개의 객체로만 응답하세요. 다른 텍스트 금지]
{
  "title": "60자 이내 SEO 친화 제목 (이번 각도에 맞춰 차별화)",
  "description": "150~160자 메타 설명",
  "category": "다이어트 | 공진단 | 총명공진단 | 통증치료 | 비대면 진료 | 한방건강 중 가장 적절한 1개",
  "keywords": ["키워드1", "키워드2", "..."],
  "body_markdown": "## 시작\\n\\n본문 markdown..."
}`;

const ANGLES = [
  {
    id: "intro",
    name: "기본 안내",
    intent: "처음 검색하는 분이 핵심 정보를 한 번에 파악할 수 있도록",
    keywords: ["이란", "기본 안내", "효능", "어떤 분에게"],
    instruction: "기본 안내와 적합 대상 중심. 처음 검색하는 사람을 위한 1차 소개 톤. 의료법상 단정적 효과 표현 금지 — '~에 도움이 될 수 있습니다' 형태 사용.",
  },
  {
    id: "usage",
    name: "복용·관리",
    intent: "이미 처방받기로 마음먹은 분이 복용 시기·방법·기간을 알고 싶을 때",
    keywords: ["복용 방법", "복용 시기", "복용 기간", "보관 방법"],
    instruction: "복용 방법·시기·기간·보관·생활 관리 중심. 실용적 가이드 톤.",
  },
  {
    id: "comparison",
    name: "비교·차이",
    intent: "유사 제품·치료법과 비교하고 싶을 때",
    keywords: ["차이", "vs", "어느 쪽", "선택"],
    instruction: "유사한 처방·치료법과의 차이점 비교. 사향공진단 vs 녹용공진단, 한약 다이어트 vs 일반 다이어트, 직접제조 vs 시판 같은 비교 각도.",
  },
  {
    id: "for-who",
    name: "대상자·체질",
    intent: "본인 케이스(나이·체질·증상)에 맞는지 확인하고 싶을 때",
    keywords: ["산후", "갱년기", "수험생", "직장인", "엄마", "30대", "40대", "50대"],
    instruction: "어떤 체질·연령·증상의 분께 적합한지 페르소나별로 정리. 산후엄마/갱년기/수험생/직장인 등 구체적 케이스 사용.",
  },
  {
    id: "side-effects",
    name: "주의사항·부작용",
    intent: "복용 전 안전성·금기·주의점을 미리 확인하고 싶을 때",
    keywords: ["부작용", "주의사항", "금기", "복용 주의"],
    instruction: "복용 전 알아야 할 주의사항·금기·부작용 가능성 중심. 단정적 표현 금지, 일반적 안내 톤.",
  },
  {
    id: "cost",
    name: "비용·가격",
    intent: "비용을 가늠하고 싶을 때",
    keywords: ["가격", "비용", "얼마", "비싼 이유"],
    instruction: "가격에 영향을 주는 요인(한약재·기간·체질) 중심. 의료법상 직접 가격 명시 금지 — '상담 시 안내드립니다' 형태 사용.",
  },
  {
    id: "process",
    name: "제조·과정",
    intent: "한약재·제조 과정의 차이를 알고 싶을 때",
    keywords: ["직접 제조", "한약재", "사향", "녹용", "원지", "석창포", "정통"],
    instruction: "한약재 선별·원내 직접 제조 과정·인증 절차 중심. 매일백세한의원이 직접 만드는 차별점 강조.",
  },
];

function extractVideoId(input) {
  if (!input) return null;
  const direct = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (direct) return input;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1);
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];
  } catch {}
  return null;
}

function readQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return { queue: [], processed: [] };
  return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
}

function writeQueue(data) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function slugFromTitle(title, videoId, angleId) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
  return `${base || "column"}-${angleId}-${videoId.slice(0, 6)}`;
}

async function fetchTranscript(videoId) {
  // Disk cache first — populated by scripts/fetch-transcripts.mjs
  const cacheFile = path.join(TRANSCRIPTS_DIR, `${videoId}.txt`);
  if (fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile, "utf8");
  }
  // Live fetch fallback (also caches result for next time)
  for (const opts of [{ lang: "ko" }, { lang: "en" }, {}]) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId, opts);
      if (items && items.length) {
        const text = items.map((i) => i.text).join(" ");
        fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
        fs.writeFileSync(cacheFile, text, "utf8");
        return text;
      }
    } catch (err) {
      console.warn(`  transcript fail (${opts.lang || "default"}): ${err.message}`);
    }
  }
  return null;
}

async function generateColumn({ videoId, transcript, videoUrl, angle }) {
  const today = new Date().toISOString().slice(0, 10);

  const userPrompt = `[이번 칼럼의 각도]
- 각도: ${angle.name}
- 검색 의도: ${angle.intent}
- 강조할 키워드 풀: ${angle.keywords.join(", ")}
- 작성 지침: ${angle.instruction}

[영상 자막]
${transcript.slice(0, 12000)}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const u = response.usage;
  console.log(
    `  usage: in=${u.input_tokens} out=${u.output_tokens}` +
      ` cache_write=${u.cache_creation_input_tokens ?? 0}` +
      ` cache_read=${u.cache_read_input_tokens ?? 0}`,
  );

  const text = response.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Claude response did not contain a JSON object.");
  const parsed = JSON.parse(jsonMatch[0]);

  const slug = slugFromTitle(parsed.title, videoId, angle.id);
  const filePath = path.join(COLUMNS_DIR, `${slug}.md`);

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(parsed.title)}`,
    `description: ${JSON.stringify(parsed.description)}`,
    `date: "${today}"`,
    `category: ${JSON.stringify(parsed.category || "한방건강")}`,
    "keywords:",
    ...(parsed.keywords || []).map((k) => `  - ${JSON.stringify(k)}`),
    "source:",
    "  type: youtube",
    `  url: ${JSON.stringify(videoUrl)}`,
    `  videoId: ${JSON.stringify(videoId)}`,
    `  angle: ${JSON.stringify(angle.id)}`,
    "---",
    "",
  ].join("\n");

  const body = parsed.body_markdown.trim() + "\n";

  fs.mkdirSync(COLUMNS_DIR, { recursive: true });
  fs.writeFileSync(filePath, frontmatter + body, "utf8");

  return { slug, filePath, title: parsed.title };
}

/**
 * Pick the next units of work, where each unit is (entry, angle).
 *
 * Selection order:
 *   1. Round-robin across channels (diet / gongjindan / pain / other) so a
 *      single run publishes one of each — keeps topic variety on the feed.
 *   2. Within a channel, drain unstarted queue.queue entries first (each
 *      gets `intro` angle), then revisit queue.processed entries for any
 *      angle that hasn't been used yet.
 *
 * Channel detection: the hint prefix from RSS-seeded entries (e.g.
 *   "[diet] 엄마들 뱃살 안 빠지는 진짜 이유"). Manual entries without a
 * prefix bucket as "other".
 */
function channelOf(entry) {
  const h = entry.hint || "";
  if (/\[gongjindan\]/i.test(h)) return "gongjindan";
  if (/\[pain\]/i.test(h)) return "pain";
  if (/\[diet\]/i.test(h)) return "diet";
  return "other";
}

function pickWork(queue, n) {
  // Build per-(channel, priority) buckets so we can round-robin without
  // re-scanning the whole queue every iteration. priority 0 = fresh video
  // (queue.queue), priority 1 = revisit (queue.processed).
  const buckets = {};
  const push = (ch, prio, item) => {
    const key = `${prio}:${ch}`;
    (buckets[key] ||= []).push(item);
  };

  for (const entry of queue.queue) {
    const id = extractVideoId(entry.url || entry.videoId);
    if (!id) continue;
    const used = new Set((entry.angles || []).map((a) => a.id));
    const next = ANGLES.find((a) => !used.has(a.id));
    if (next) push(channelOf(entry), 0, { source: "queue", entry, videoId: id, angle: next });
  }
  for (const entry of queue.processed) {
    if (entry.status === "no-transcript") continue;
    const id = entry.videoId || extractVideoId(entry.url);
    if (!id) continue;
    const used = new Set((entry.angles || []).map((a) => a.id));
    for (const angle of ANGLES.filter((a) => !used.has(a.id))) {
      push(channelOf(entry), 1, { source: "processed", entry, videoId: id, angle });
    }
  }

  const channels = ["diet", "gongjindan", "pain", "other"];
  const work = [];
  // Try priority 0 first (fresh videos), then 1 (revisits)
  for (const prio of [0, 1]) {
    let progress = true;
    while (work.length < n && progress) {
      progress = false;
      for (const ch of channels) {
        if (work.length >= n) break;
        const bucket = buckets[`${prio}:${ch}`];
        if (bucket && bucket.length > 0) {
          work.push(bucket.shift());
          progress = true;
        }
      }
    }
    if (work.length >= n) break;
  }
  return work;
}

function markAngleUsed(entry, angle, result) {
  entry.angles = entry.angles || [];
  entry.angles.push({ id: angle.id, slug: result.slug, title: result.title, at: new Date().toISOString() });
}

function maybeMoveToProcessed(queue, entry) {
  // After ANY successful angle, a queue entry belongs in processed
  const queueIdx = queue.queue.indexOf(entry);
  if (queueIdx >= 0) {
    queue.queue.splice(queueIdx, 1);
    queue.processed.push(entry);
  }
}

async function processWork(queue, item) {
  const { entry, videoId, angle } = item;
  console.log(`\n→ ${entry.hint || videoId} [${angle.id} · ${angle.name}]`);

  let transcript = entry._transcriptCache;
  if (!transcript) {
    transcript = await fetchTranscript(videoId);
    if (!transcript) {
      console.warn("  no transcript, marking entry skipped");
      entry.status = "no-transcript";
      entry.at = new Date().toISOString();
      maybeMoveToProcessed(queue, entry);
      return false;
    }
    entry._transcriptCache = transcript; // in-memory only, won't be written
  }

  console.log(`  transcript ${transcript.length} chars · generating...`);
  const result = await generateColumn({
    videoId,
    transcript,
    videoUrl: entry.url || `https://www.youtube.com/watch?v=${videoId}`,
    angle,
  });
  console.log(`  saved ${result.slug}`);

  if (!entry.videoId) entry.videoId = videoId;
  markAngleUsed(entry, angle, result);
  maybeMoveToProcessed(queue, entry);
  return true;
}

async function main() {
  const cliUrl = process.argv[2];
  const queue = readQueue();

  if (cliUrl) {
    const id = extractVideoId(cliUrl);
    if (!id) { console.error("Invalid YouTube URL/ID:", cliUrl); process.exit(1); }
    let entry =
      queue.queue.find((e) => extractVideoId(e.url) === id) ||
      queue.processed.find((e) => (e.videoId || extractVideoId(e.url)) === id);
    if (!entry) {
      entry = { url: cliUrl, videoId: id };
      queue.processed.push(entry);
    }
    const used = new Set((entry.angles || []).map((a) => a.id));
    const angle = ANGLES.find((a) => !used.has(a.id));
    if (!angle) { console.log("All angles already used for this video."); return; }
    await processWork(queue, { entry, videoId: id, angle });
    writeQueue(stripCache(queue));
    return;
  }

  const works = pickWork(queue, COLUMNS_PER_RUN);
  if (works.length === 0) {
    console.log("No work to do — queue empty and all processed entries exhausted.");
    return;
  }
  console.log(`Planned ${works.length}/${COLUMNS_PER_RUN} columns this run.`);

  let success = 0;
  for (const item of works) {
    try {
      const ok = await processWork(queue, item);
      if (ok) success++;
    } catch (err) {
      console.error(`  ✗ failed: ${err.message}`);
    }
  }
  writeQueue(stripCache(queue));
  console.log(`\nDone. ${success}/${works.length} columns published.`);
}

function stripCache(queue) {
  // Avoid persisting the in-memory transcript cache
  const clone = JSON.parse(JSON.stringify(queue, (k, v) => (k === "_transcriptCache" ? undefined : v)));
  return clone;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
