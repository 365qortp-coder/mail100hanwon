#!/usr/bin/env node
/**
 * 기존 MD 파일에 image 필드 소급 삽입
 *
 * - image 필드가 없는 칼럼에만 적용
 * - intro 각도 → YouTube 썸네일
 * - 나머지 각도 → Unsplash API (UNSPLASH_ACCESS_KEY 없으면 photos 폴더 fallback)
 *
 * Usage:
 *   node scripts/backfill-images.mjs          # 전체 소급
 *   node scripts/backfill-images.mjs --dry    # 변경 내용만 출력, 파일 저장 안 함
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const COLUMNS_DIR = path.join(ROOT, "content", "columns");
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const DRY_RUN = process.argv.includes("--dry");

// ─── 이미지 로직 (generate-column.mjs와 동일) ────────────────────────────────

const CATEGORY_TO_CHANNEL = {
  "다이어트": "diet",
  "공진단": "gongjindan",
  "총명공진단": "gongjindan",
  "통증치료": "pain",
  "비대면 진료": "other",
  "한방건강": "other",
};

const HINT_KEYWORD_MAP = [
  { match: /뱃살|복부비만/,              query: "belly fat weight loss woman" },
  { match: /요요/,                       query: "weight scale diet regain" },
  { match: /기초대사량|대사/,             query: "metabolism fitness body" },
  { match: /근육|근육손실/,              query: "lean muscle fitness" },
  { match: /폭식|호르몬/,                query: "stress eating emotional health" },
  { match: /탄수화물|식단/,              query: "healthy meal diet food" },
  { match: /엄마|산후|출산/,             query: "postpartum mom weight loss" },
  { match: /30대|40대|나잇살/,           query: "middle age fitness weight" },
  { match: /굶어도|굶기/,                query: "diet calorie restriction" },
  { match: /수면|베개/,                  query: "sleep position pillow neck" },
  { match: /운동|루틴/,                  query: "exercise workout fitness" },
  { match: /수험생|공부|집중력|성적/,   query: "student studying exam concentration" },
  { match: /면역|감기/,                  query: "immune system health vitamin" },
  { match: /녹용/,                       query: "deer antler velvet supplement" },
  { match: /어르신|노인|부모님/,         query: "senior elderly health energy" },
  { match: /간|해독/,                    query: "liver health detox" },
  { match: /뇌|치매|기억력/,             query: "brain health cognitive memory" },
  { match: /피로|기운|기력/,             query: "fatigue energy exhaustion" },
  { match: /체력|스태미너/,              query: "stamina vitality energy" },
  { match: /두통|머리 아/,               query: "headache migraine pain" },
  { match: /허리|디스크/,               query: "back pain spine" },
  { match: /거북목/,                    query: "neck pain posture" },
  { match: /승모근|어깨/,               query: "shoulder tension neck" },
  { match: /무릎/,                      query: "knee pain joint" },
  { match: /소화|위장/,                 query: "digestive health stomach" },
];

const IMAGE_FALLBACK = {
  diet: {
    intro: ["weight loss journey woman", "diet healthy lifestyle"],
    usage: ["herbal supplement morning routine", "taking medicine daily"],
    comparison: ["healthy food choice nutrition"],
    "for-who": ["woman fitness postpartum", "middle age health"],
    "side-effects": ["diet fatigue nutrition"],
    cost: ["wellness investment supplement"],
    process: ["weight loss transformation progress"],
    faq: ["diet question healthy guide"],
  },
  gongjindan: {
    intro: ["herbal medicine traditional", "oriental supplement capsule"],
    usage: ["taking supplement pill morning"],
    comparison: ["supplement comparison choice"],
    "for-who": ["senior health elderly energy", "student studying focus"],
    "side-effects": ["medicine caution health"],
    cost: ["premium supplement wellness"],
    process: ["traditional medicine preparation"],
    faq: ["supplement question health guide"],
  },
  pain: {
    intro: ["back pain relief", "headache migraine"],
    usage: ["physical therapy treatment"],
    comparison: ["pain treatment option"],
    "for-who": ["office worker back pain", "elderly joint"],
    "side-effects": ["chronic pain inflammation"],
    cost: ["medical treatment healthcare"],
    process: ["rehabilitation exercise recovery"],
    faq: ["pain relief question"],
  },
  other: {
    intro: ["traditional medicine wellness"],
    usage: ["health routine supplement"],
    comparison: ["natural medicine choice"],
    "for-who": ["family health preventive"],
    "side-effects": ["natural health caution"],
    cost: ["healthcare investment"],
    process: ["health journey"],
    faq: ["health question wellness"],
  },
};

const PHOTO_FALLBACK = {
  diet: "/photos/diet-product.webp",
  gongjindan: "/photos/gongjindan-hero.webp",
  "총명공진단": "/photos/chongmyeong-product.webp",
  pain: "/photos/pain.webp",
  other: "/photos/clinic-exterior.webp",
};

async function fetchUnsplashImage(query) {
  if (!UNSPLASH_KEY) return null;
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&content_filter=high`;
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.results || [];
    if (!results.length) return null;
    const pick = results[Math.floor(Math.random() * Math.min(5, results.length))];
    return {
      url: pick.urls.regular,
      alt: pick.alt_description || query,
      credit: `Photo by ${pick.user.name} on Unsplash`,
    };
  } catch {
    return null;
  }
}

function pickImageQuery(channel, angleId, hint) {
  for (const { match, query } of HINT_KEYWORD_MAP) {
    if (match.test(hint || "")) return query;
  }
  const cat = IMAGE_FALLBACK[channel] || IMAGE_FALLBACK.other;
  const pool = cat[angleId] || cat.intro;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function resolveImage(videoId, angleId, category, hint) {
  if (angleId === "intro") {
    return {
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      alt: `${hint || "매일백세한의원"} 관련 영상 썸네일`,
      credit: null,
    };
  }
  const channel = CATEGORY_TO_CHANNEL[category] || "other";
  const query = pickImageQuery(channel, angleId, hint || "");
  const img = await fetchUnsplashImage(query);
  if (img) return img;
  const fallbackUrl = PHOTO_FALLBACK[category] || PHOTO_FALLBACK[channel] || PHOTO_FALLBACK.other;
  return { url: fallbackUrl, alt: hint || "매일백세한의원", credit: null };
}

// ─── frontmatter 파서/직렬화 ─────────────────────────────────────────────────

function parseFrontmatter(raw) {
  // \r\n (Windows) 와 \n (Unix) 모두 처리
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  return { fm: match[1], body: match[2] };
}

function getFmValue(fm, key) {
  const re = new RegExp(`^${key}:\\s*(.+)$`, "m");
  const m = fm.match(re);
  if (!m) return null;
  return m[1].replace(/^["']|["']$/g, "").trim();
}

function getFmBlock(fm, key) {
  const re = new RegExp(`^${key}:\\s*\\n([\\s\\S]*?)(?=\\n\\S|$)`, "m");
  const m = fm.match(re);
  return m ? m[1] : null;
}

function injectImageFields(fm, img) {
  // image / imageAlt / imageCredit 을 source: 블록 바로 앞에 삽입
  const imageLines = [
    `image: ${JSON.stringify(img.url)}`,
    `imageAlt: ${JSON.stringify(img.alt)}`,
    ...(img.credit ? [`imageCredit: ${JSON.stringify(img.credit)}`] : []),
  ].join("\n");

  if (fm.includes("source:")) {
    return fm.replace(/^source:/m, `${imageLines}\nsource:`);
  }
  return fm + "\n" + imageLines;
}

// ─── 메인 ────────────────────────────────────────────────────────────────────

async function main() {
  const files = fs.readdirSync(COLUMNS_DIR).filter((f) => f.endsWith(".md"));
  console.log(`총 ${files.length}개 MD 파일 확인 중...`);

  let updated = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(COLUMNS_DIR, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = parseFrontmatter(raw);
    if (!parsed) { console.warn(`  skip (no frontmatter): ${file}`); skipped++; continue; }

    const { fm, body } = parsed;

    // 이미 image 필드 있으면 스킵
    if (/^image:/m.test(fm)) { skipped++; continue; }

    const category = getFmValue(fm, "category") || "한방건강";
    const angle = getFmValue(fm, "  angle") || getFmValue(fm, "angle") || "intro";
    const videoId = getFmValue(fm, "  videoId") || getFmValue(fm, "videoId") || "";
    // hint는 파일명에서 유추 (없으면 빈 문자열)
    const hint = path.basename(file, ".md").replace(/-[a-zA-Z\-]+$/, "").replace(/-/g, " ");

    console.log(`\n${file}`);
    console.log(`  category=${category}, angle=${angle}, videoId=${videoId}`);

    const img = await resolveImage(videoId || "unknown", angle, category, hint);
    console.log(`  → image: ${img.url.slice(0, 60)}...`);

    if (!DRY_RUN) {
      const newFm = injectImageFields(fm, img);
      const newRaw = `---\n${newFm}\n---\n${body}`;
      fs.writeFileSync(filePath, newRaw, "utf8");
    }
    updated++;

    // Unsplash rate limit 보호 (50 req/hour) — 1초 간격
    if (UNSPLASH_KEY && angle !== "intro") {
      await new Promise((r) => setTimeout(r, 1200));
    }
  }

  console.log(`\n완료: ${updated}개 업데이트, ${skipped}개 스킵${DRY_RUN ? " (dry run)" : ""}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
