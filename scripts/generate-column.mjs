#!/usr/bin/env node
/**
 * Daily YouTube → Column Generator
 *
 * Picks the next unprocessed YouTube video from content/youtube-queue.json,
 * fetches its transcript, asks Claude to rewrite it as an SEO-optimized
 * Korean column, and saves the markdown to content/columns/.
 *
 * Usage:
 *   node scripts/generate-column.mjs                # pick next from queue
 *   node scripts/generate-column.mjs <youtube-url>  # process a specific URL
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

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY env var is required.");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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
  } catch {
    // fall through
  }
  return null;
}

function readQueue() {
  if (!fs.existsSync(QUEUE_FILE)) {
    return { queue: [], processed: [] };
  }
  return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
}

function writeQueue(data) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function slugFromTitle(title, videoId) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base || "column"}-${videoId.slice(0, 6)}`;
}

async function fetchTranscript(videoId) {
  const langs = ["ko", "en"];
  for (const lang of langs) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId, { lang });
      if (items && items.length) {
        return items.map((i) => i.text).join(" ");
      }
    } catch (err) {
      console.warn(`Transcript fetch failed for lang=${lang}: ${err.message}`);
    }
  }
  return null;
}

async function generateColumn({ videoId, transcript, videoUrl }) {
  const today = new Date().toISOString().slice(0, 10);

  const prompt = `당신은 매일백세한의원(서울 중랑구 공릉로 21, 송원석 원장)의 SEO 콘텐츠 작가입니다.

아래는 매일백세한의원이 운영하는 유튜브 채널의 영상 자막입니다. 이 자막을 바탕으로 한방 의료 정보를 전달하는 한국어 SEO 칼럼을 작성해 주세요.

[영상 자막]
${transcript.slice(0, 12000)}

[작성 조건]
- 한국어 자연스러운 문어체 (~합니다 / 어조)
- 1500자 ~ 2500자 분량
- 검색 의도에 맞는 H2(##), H3(###) 헤딩 5~7개 포함
- 매일감비환·공진단·총명공진단·통증·비대면 진료 키워드 자연스럽게 포함 (해당하는 주제에 한해)
- 의료법상 단정적 효과 표현 금지 ("100% 효과", "~을 치료한다", "최고", "유일") — 대신 "~에 도움이 될 수 있습니다", "~한 분들이 자주 찾으십니다" 형태 사용
- 환자 후기·전후 비교·치료 비용·할인 표현은 사용 금지
- 본문 마지막에 한 줄 안내: "자세한 상담은 매일백세한의원(02-2234-0102) 또는 카카오톡 채널을 이용해 주세요."

[출력 형식: 반드시 JSON 한 개의 객체로만 응답하세요. 다른 텍스트 X]
{
  "title": "60자 이내 SEO 친화 제목",
  "description": "150~160자 메타 설명",
  "category": "다이어트 | 공진단 | 총명공진단 | 통증 | 한방건강 중 가장 적절한 1개",
  "keywords": ["키워드1", "키워드2", "..."],
  "body_markdown": "## 시작\\n\\n본문 markdown..."
}
`;

  const response = await anthropic.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("\n");

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Claude response did not contain a JSON object.");
  }
  const parsed = JSON.parse(jsonMatch[0]);

  const slug = slugFromTitle(parsed.title, videoId);
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
    "---",
    "",
  ].join("\n");

  const body = parsed.body_markdown.trim() + "\n";

  fs.mkdirSync(COLUMNS_DIR, { recursive: true });
  fs.writeFileSync(filePath, frontmatter + body, "utf8");

  return { slug, filePath, title: parsed.title };
}

async function main() {
  const cliUrl = process.argv[2];
  const queue = readQueue();

  let videoEntry;
  if (cliUrl) {
    const id = extractVideoId(cliUrl);
    if (!id) {
      console.error("Invalid YouTube URL/ID:", cliUrl);
      process.exit(1);
    }
    videoEntry = { videoId: id, url: cliUrl };
  } else {
    if (queue.queue.length === 0) {
      console.log(
        "Queue is empty. Add YouTube URLs to content/youtube-queue.json under 'queue'."
      );
      return;
    }
    const entry = queue.queue[0];
    const id = extractVideoId(entry.url || entry.videoId);
    if (!id) {
      console.error("First queue entry has no valid videoId/url, skipping.");
      queue.queue.shift();
      writeQueue(queue);
      return;
    }
    videoEntry = { videoId: id, url: entry.url || `https://www.youtube.com/watch?v=${id}` };
  }

  console.log(`Fetching transcript for ${videoEntry.videoId} ...`);
  const transcript = await fetchTranscript(videoEntry.videoId);
  if (!transcript) {
    console.error("Could not fetch transcript. Skipping.");
    if (!cliUrl) {
      const skipped = queue.queue.shift();
      queue.processed.push({ ...skipped, status: "no-transcript", at: new Date().toISOString() });
      writeQueue(queue);
    }
    return;
  }

  console.log(`Transcript length: ${transcript.length} chars. Generating column ...`);
  const result = await generateColumn({
    videoId: videoEntry.videoId,
    videoUrl: videoEntry.url,
    transcript,
  });

  console.log(`Saved: ${result.filePath}`);

  if (!cliUrl) {
    const processed = queue.queue.shift();
    queue.processed.push({
      ...processed,
      slug: result.slug,
      title: result.title,
      at: new Date().toISOString(),
    });
    writeQueue(queue);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
