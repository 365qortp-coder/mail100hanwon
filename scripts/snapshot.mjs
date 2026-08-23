/**
 * 회귀 검증기 — 리팩터링 전후 HTML이 같은지 자동 비교한다.
 *
 * 사이트 팩토리 전환(geo-saas/TENANT-01.md 1단계)은 이미 색인된 라이브를 건드리므로,
 * 눈으로 보이는 디자인이 같아도 title·스키마·본문·URL이 바뀌면 색인이 흔들린다.
 * 이 스크립트가 그 안전망이다.
 *
 *   node scripts/snapshot.mjs save  <baseUrl> [파일명]   지문 저장
 *   node scripts/snapshot.mjs diff  <baseUrl> [파일명]   저장본과 비교
 *
 * 예) 배포 전:  node scripts/snapshot.mjs save https://mail100hanwon.co.kr
 *     리팩터 후: node scripts/snapshot.mjs diff http://localhost:3210
 */
import fs from "fs";
import path from "path";

const MODE = process.argv[2];
const BASE = (process.argv[3] || "").replace(/\/$/, "");
const FILE = path.join(process.cwd(), "scripts", process.argv[4] || "snapshot.json");

if (!["save", "diff"].includes(MODE) || !BASE) {
  console.error("사용법: node scripts/snapshot.mjs <save|diff> <baseUrl> [파일명]");
  process.exit(1);
}

/** 사이트맵에서 검사 대상 URL을 모은다 (경로만 남김). */
async function collectPaths() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  const paths = locs.map((u) => {
    try {
      return decodeURIComponent(new URL(u).pathname);
    } catch {
      return u;
    }
  });
  return [...new Set(paths)].sort();
}

const pick = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

/** 표시 텍스트만 남긴다 (스크립트·스타일·태그 제거). */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** JSON-LD를 @type 기준으로 정규화 — 순서가 바뀌어도 같은 것으로 본다. */
function schemaTypes(html) {
  const blocks = [...html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (node && typeof node === "object") {
      if (node["@type"]) types.push(String(node["@type"]));
      if (node["@graph"]) walk(node["@graph"]);
    }
  };
  for (const b of blocks) {
    try {
      walk(JSON.parse(b[1]));
    } catch {
      types.push("PARSE_ERROR");
    }
  }
  return types.sort();
}

function headings(html) {
  const out = [];
  for (const lv of [1, 2, 3]) {
    const re = new RegExp(`<h${lv}\\b[^>]*>([\\s\\S]*?)</h${lv}>`, "gi");
    for (const m of html.matchAll(re)) {
      out.push(`h${lv}:${visibleText(m[1])}`);
    }
  }
  return out;
}

function internalLinks(html) {
  const hrefs = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map((m) => m[1]);
  return [...new Set(hrefs)].sort();
}

async function fingerprint(p) {
  const res = await fetch(`${BASE}${p}`, { redirect: "follow" });
  const html = await res.text();
  const text = visibleText(html);
  return {
    status: res.status,
    title: pick(html, /<title>([\s\S]*?)<\/title>/i),
    description: pick(html, /name="description"\s+content="([^"]*)"/i),
    canonical: pick(html, /rel="canonical"\s+href="([^"]*)"/i),
    ogTitle: pick(html, /property="og:title"\s+content="([^"]*)"/i),
    robots: pick(html, /name="robots"\s+content="([^"]*)"/i),
    schemaTypes: schemaTypes(html),
    headings: headings(html),
    links: internalLinks(html),
    textLength: text.length,
    textHead: text.slice(0, 400),
  };
}

const CONCURRENCY = 6;
async function mapLimit(items, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        try {
          out[idx] = await fn(items[idx]);
        } catch (e) {
          out[idx] = { error: String(e) };
        }
      }
    })
  );
  return out;
}

const paths = await collectPaths();
console.log(`대상 ${paths.length}개 · ${BASE}`);
const results = await mapLimit(paths, fingerprint);
const snapshot = Object.fromEntries(paths.map((p, i) => [p, results[i]]));

if (MODE === "save") {
  fs.writeFileSync(FILE, JSON.stringify({ base: BASE, savedAt: new Date().toISOString(), snapshot }, null, 1));
  console.log(`저장 완료 → ${FILE}`);
  process.exit(0);
}

/* ── diff ── */
if (!fs.existsSync(FILE)) {
  console.error(`저장본이 없다: ${FILE} — 먼저 save를 실행할 것`);
  process.exit(1);
}
const prev = JSON.parse(fs.readFileSync(FILE, "utf8"));
const old = prev.snapshot;

const problems = [];
const arrDiff = (a = [], b = []) => ({
  gone: a.filter((x) => !b.includes(x)),
  added: b.filter((x) => !a.includes(x)),
});

for (const p of Object.keys(old)) {
  const o = old[p];
  const n = snapshot[p];
  if (!n) {
    problems.push({ path: p, level: "치명", what: "URL 사라짐 (사이트맵에서 빠짐)" });
    continue;
  }
  if (n.status !== o.status) problems.push({ path: p, level: "치명", what: `상태코드 ${o.status} → ${n.status}` });
  for (const f of ["title", "description", "canonical", "robots"]) {
    if (o[f] !== n[f]) {
      problems.push({ path: p, level: f === "canonical" ? "치명" : "높음", what: `${f} 변경`, before: o[f], after: n[f] });
    }
  }
  const st = arrDiff(o.schemaTypes, n.schemaTypes);
  if (st.gone.length || st.added.length) {
    problems.push({ path: p, level: "높음", what: `JSON-LD 스키마 변경 (빠짐:${st.gone.join(",") || "-"} / 추가:${st.added.join(",") || "-"})` });
  }
  const hd = arrDiff(o.headings, n.headings);
  if (hd.gone.length || hd.added.length) {
    problems.push({ path: p, level: "중간", what: `헤딩 ${hd.gone.length}개 빠짐 / ${hd.added.length}개 추가`, before: hd.gone.slice(0, 3), after: hd.added.slice(0, 3) });
  }
  const lk = arrDiff(o.links, n.links);
  if (lk.gone.length) problems.push({ path: p, level: "높음", what: `내부링크 사라짐: ${lk.gone.join(", ")}` });
  const drop = o.textLength ? (o.textLength - n.textLength) / o.textLength : 0;
  if (drop > 0.1) {
    problems.push({ path: p, level: "높음", what: `본문 ${Math.round(drop * 100)}% 감소 (${o.textLength}→${n.textLength}자)` });
  }
}
const newPaths = Object.keys(snapshot).filter((p) => !old[p]);

console.log("");
if (!problems.length) {
  console.log("✓ 회귀 없음 — title·canonical·스키마·헤딩·링크·본문량 모두 동일");
} else {
  const order = { 치명: 0, 높음: 1, 중간: 2 };
  problems.sort((a, b) => order[a.level] - order[b.level]);
  for (const p of problems) {
    console.log(`[${p.level}] ${p.path} — ${p.what}`);
    if (p.before !== undefined) console.log(`    before: ${JSON.stringify(p.before)}`);
    if (p.after !== undefined) console.log(`    after : ${JSON.stringify(p.after)}`);
  }
  console.log(`\n총 ${problems.length}건 (치명 ${problems.filter((x) => x.level === "치명").length})`);
}
if (newPaths.length) console.log(`\n신규 URL ${newPaths.length}개: ${newPaths.join(", ")}`);

process.exit(problems.some((p) => p.level === "치명") ? 1 : 0);
