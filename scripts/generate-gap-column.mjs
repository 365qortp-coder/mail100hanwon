#!/usr/bin/env node
/**
 * 실측(팬아웃 갭) 기반 칼럼 생성기 — HOMECOL-01 (2026-08-01)
 *
 * 기존 generate-column.mjs(유튜브 자막 다각도 양산)는 2026-07-14에 중단됐다.
 * 대신 핀셋포인트가 매일 측정하는 "AI가 실제로 검색한 하위 질의 중 우리 병원이 빠진 것"을
 * 주제로 받아 칼럼 1편을 쓴다. 즉 감이 아니라 실측 수요를 겨냥한다.
 *
 * 안전장치
 *  - 주간 예산: 핀셋포인트가 본진 색인률로 계산해 내려준다(색인이 따라오는 만큼만 발행).
 *    최근 7일 발행 수가 예산 이상이면 아무것도 쓰지 않고 정상 종료한다.
 *  - 중복 회피: 기존 칼럼 제목과 토큰이 겹치면 다음 주제로 넘어간다.
 *  - 의료광고법: 개인 치료후기·전후비교·완치·최상급 표현 금지. 임상 서술은
 *    상담→진단→원리→처방 방향까지만 쓰고 결과 앞에서 멈춘다(핀셋포인트 규칙과 동일).
 *
 * 필수 env: ANTHROPIC_API_KEY, PINCET_SECRET
 * 선택 env: PINCET_API(기본 https://pincetpoint-geo.vercel.app), PINCET_CLIENT(기본 mail100hanwon)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const COLUMNS_DIR = path.join(ROOT, "content", "columns");

const API = (process.env.PINCET_API || "https://pincetpoint-geo.vercel.app").replace(/\/$/, "");
const SECRET = process.env.PINCET_SECRET;
const CLIENT = process.env.PINCET_CLIENT || "mail100hanwon";
const MODEL = process.env.COLUMN_MODEL || "claude-sonnet-4-6";

const ALLOWED_CATEGORIES = ["다이어트", "공진단", "총명공진단", "통증치료", "한방건강"];

// 후기·감량 수치는 의도적으로 제외 (치료경험담 광고 금지) — 처방 원리와 원장 정보만.
const CLINICAL_DATA = `
[매일감비환 — 정확히 이 사실만 사용]
- 마황 함유. 에페드린이 교감신경을 자극해 체지방 분해를 돕는 기전.
- 부작용은 개인이 버틸 수 있는 용량보다 강하게 복용할 때 발생(두통·울렁거림·불면·떨림·두근거림).
- 1~8단계 미세 조정: 알약 개수로 복용량을 조절하며, 반응이 강하면 한 단계 낮춘다.
- 처방 기간은 감량기와 요요방지기를 구분해 설계한다.
- 비대면 처방 운영(설문 → 전화 상담 → 택배 발송).

[공진단]
- 사향·녹용·당귀·산수유 등 한약재로 원내에서 직접 제조. 총명공진단은 수험생·집중력 관리 목적의 변방.

[무릎·통증]
- 침·약침·한약을 함께 쓰는 접근. 퇴행성 변화의 단계와 동반 질환에 따라 방향이 달라진다.

[원장]
- 송원석 대표원장 / 대전대학교 한의과대학(05학번) / 대한한방비만학회 회원 / 전) 대한상한금궤학회 교육위원
- 매일백세한의원 · 서울 중랑구 공릉로 21 (7호선 먹골역 도보 5분)
`;

function fail(msg) {
  console.error(`✖ ${msg}`);
  process.exit(1);
}

const WIKI_LINKS_PER_COLUMN = 2;

// 본문에 등장하는 한방위키 용어에 링크를 건다 (WIKI-LINK-01).
// 실패해도 칼럼 발행은 그대로 진행한다 — 링크는 부가 기능이지 발행 조건이 아니다.
async function addWikiLinks(markdown) {
  let terms;
  try {
    const res = await fetch(`${API}/api/wiki/terms`, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return markdown;
    terms = (await res.json())?.terms;
  } catch {
    return markdown;
  }
  if (!Array.isArray(terms) || !terms.length) return markdown;

  let out = markdown;
  let linked = 0;
  for (const t of terms) {
    if (linked >= WIKI_LINKS_PER_COLUMN) break;
    const title = String(t.title ?? "");
    if (title.length < 2) continue;
    // 이미 링크 안에 들어간 텍스트는 건드리지 않는다 (중첩 링크 방지)
    const re = new RegExp(`(?<!\\[)${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?!\\])`);
    if (!re.test(out)) continue;
    out = out.replace(re, `[${title}](${t.url})`);
    linked++;
    console.log(`  ↳ 위키 링크: ${title} → ${t.url}`);
  }
  return out;
}
function skip(msg) {
  console.log(`↷ ${msg}`);
  process.exit(0);
}

// ── 기존 칼럼 읽기 (중복 회피 + 주간 발행 수 계산) ──
function readExistingColumns() {
  if (!fs.existsSync(COLUMNS_DIR)) return [];
  return fs
    .readdirSync(COLUMNS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(COLUMNS_DIR, f), "utf8").slice(0, 1200);
      const title = raw.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] ?? "";
      const date = raw.match(/^date:\s*"?(\d{4}-\d{2}-\d{2})"?/m)?.[1] ?? "";
      return { file: f, title, date };
    });
}

const tokens = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);

function alreadyCovered(topic, existing) {
  const t = new Set(tokens(topic));
  if (t.size === 0) return true;
  return existing.some((c) => {
    const overlap = tokens(c.title).filter((x) => t.has(x)).length;
    return overlap >= Math.min(3, Math.max(2, Math.floor(t.size * 0.6)));
  });
}

function slugify(title) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
  const stamp = Math.random().toString(36).slice(2, 8);
  return `${base || "column"}-geo-${stamp}`;
}

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) fail("ANTHROPIC_API_KEY 필요");
  if (!SECRET) skip("PINCET_SECRET 미설정 — 주제를 못 받아 이번 실행은 건너뜁니다.");

  // 1) 주제 + 주간 예산 받기
  const res = await fetch(`${API}/api/topics?client=${encodeURIComponent(CLIENT)}&limit=12&secret=${encodeURIComponent(SECRET)}`);
  if (!res.ok) skip(`주제 API 응답 ${res.status} — 이번 실행은 건너뜁니다.`);
  const data = await res.json();
  const topics = data.topics ?? [];
  console.log(`· 예산: ${data.budgetReason} / 후보 주제 ${topics.length}개`);
  if (!topics.length) skip("실측 갭이 없습니다 (현재 미노출 하위 질의 없음).");

  // 2) 주간 예산 확인 — 최근 7일 발행 수
  const existing = readExistingColumns();
  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
  const publishedThisWeek = existing.filter((c) => c.date && c.date >= weekAgo).length;
  if (publishedThisWeek >= (data.weeklyBudget ?? 1)) {
    skip(`주간 한도 도달 (최근 7일 ${publishedThisWeek}/${data.weeklyBudget}건) — 오늘은 쉽니다.`);
  }

  // 3) 아직 안 다룬 주제 선택
  const pick = topics.find((t) => !alreadyCovered(t.topic, existing));
  if (!pick) skip("후보 주제가 모두 기존 칼럼과 겹칩니다.");
  console.log(`· 주제: ${pick.topic}${pick.group ? ` (${pick.group})` : ""}`);

  // 4) 생성
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const system = [
    "당신은 매일백세한의원(서울 중랑구) 공식 홈페이지에 실릴 정보 칼럼을 쓰는 작가입니다.",
    "독자는 이 주제를 실제로 검색한 일반인이며, AI 검색엔진이 인용하기 좋게 써야 합니다.",
    "",
    "【구조 — 마크다운】",
    "- 첫 문단: 제목 질문에 대한 직접 답을 한 문장으로 먼저 제시(발췌돼도 말이 되게), 이어 2~3문장 부연.",
    "- ## 질문형 소제목 4~5개. 각 소제목 아래 2~3문단.",
    "- 비교·절차·단계는 마크다운 표로 1개 이상 정리.",
    "- ## 이런 경우 먼저 확인하세요 — 기저질환·복용약·임신 등 주의사항.",
    "- 마지막에 부담 없는 상담 안내 2~3문장(과장·재촉 금지).",
    "- 핵심 문구는 **굵게** 8~15개.",
    "",
    "【관점 — 정보 나열 금지】",
    "- 사실만 늘어놓지 말고 담당 의료진의 해석을 덧붙입니다(이 정보가 독자에게 무슨 의미인지).",
    "- 임상 사례를 쓸 때는 ①어떤 고민으로 오는가 ②무엇을 확인·판별하는가 ③왜 그렇게 보는가(원리)",
    "  ④어떤 방향으로 상담·처방을 설계하는가 까지만 쓰고 멈춥니다.",
    "  ★그 이후의 결과·호전·후기·전후 변화·'좋아졌다/나았다/했더니'는 절대 쓰지 않습니다(치료경험담 광고 금지).",
    "  ★특정 개인을 식별할 수 있는 실제 1인 사례 대신 '이런 고민으로 오시는 분들이 있습니다'로 일반화합니다.",
    "- 방법·성분·접근법 사이의 차이를 비교합니다. 다른 병원과의 비교·우열 주장은 금지.",
    "",
    "【의료광고법 필수】",
    "- 금지: 완치·보장·최고/최상급·1위·부작용 없음·환자 후기 인용·전후 사진 언급.",
    "- 효능은 단정하지 말고 '도움이 될 수 있다', '알려져 있다'로 쓰고 개인차·한계를 함께 적습니다.",
    "- 없는 수치·연구·URL을 지어내지 않습니다.",
    "",
    "【키워드】",
    "- 지역 키워드(서울 중랑구·먹골역 등)는 본문 전체 3~4회 이내. 기계적 반복 금지.",
    "",
    `category는 반드시 다음 중 하나: ${ALLOWED_CATEGORIES.join(", ")}`,
    "",
    "【출력 형식 — 아래 구분자를 그대로 쓰고 JSON·코드블록은 쓰지 마세요】",
    "===TITLE===",
    "(45자 이내, 검색자가 실제로 물을 법한 질문형 제목. 본문에 H1으로 반복하지 말 것)",
    "===DESCRIPTION===",
    "(140~160자 요약)",
    "===CATEGORY===",
    "(위 목록 중 하나)",
    "===KEYWORDS===",
    "(쉼표로 구분한 키워드 5~8개)",
    "===BODY===",
    "(마크다운 본문. ## 소제목부터 시작)",
  ].join("\n");

  const user = [
    `이 칼럼의 주제(AI 검색에서 우리 병원이 빠진 실제 질의): "${pick.topic}"`,
    pick.group ? `주제 그룹: ${pick.group}` : "",
    "",
    "병원 정보 — 이 사실만 사용하고 지어내지 마세요:",
    CLINICAL_DATA,
    "",
    `다시 강조: 이 글은 "${pick.topic}"에 답하는 글입니다.`,
  ].join("\n");

  const msg = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    temperature: 0.4,
    system,
    messages: [{ role: "user", content: user }],
  });

  const text = msg.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");

  // 구분자 파싱 — 마크다운 본문에 따옴표·줄바꿈이 들어가도 깨지지 않는다 (JSON 이스케이프 문제 회피)
  const section = (name, next) => {
    const re = next
      ? new RegExp(`===${name}===\\s*([\\s\\S]*?)\\s*===${next}===`)
      : new RegExp(`===${name}===\\s*([\\s\\S]*)$`);
    return (text.match(re)?.[1] ?? "").trim();
  };
  const parsed = {
    title: section("TITLE", "DESCRIPTION"),
    description: section("DESCRIPTION", "CATEGORY"),
    category: section("CATEGORY", "KEYWORDS"),
    keywords: section("KEYWORDS", "BODY")
      .split(/[,\n]/)
      .map((k) => k.trim().replace(/^[-•]\s*/, ""))
      .filter(Boolean),
    body_markdown: section("BODY"),
  };
  if (!parsed.title || parsed.body_markdown.length < 500) {
    fail(`생성 결과 형식 불량 (title=${parsed.title ? "O" : "X"}, body=${parsed.body_markdown.length}자) — 발행하지 않습니다.`);
  }

  // WIKI-LINK-01 (2026-08-03): 본문에 등장하는 한방위키 용어 1~2개에 링크를 건다.
  // 위키(hanbangwiki.kr)는 새 도메인이라 외부 링크가 거의 없어 구글이 URL을 발견조차 못 하고 있다
  // (실측: 발행 12편 중 6편이 "Google에는 아직 알려지지 않은 URL"). 본진은 색인률이 가장 높아
  // 구글이 자주 오는 사이트라, 여기서 거는 링크가 가장 빠른 발견 경로가 된다.
  // 2개로 제한하는 이유: 매 칼럼에 링크가 쏟아지면 자연스러운 참고 링크가 아니라 링크 심기로 읽힌다.
  parsed.body_markdown = await addWikiLinks(parsed.body_markdown);

  const category = ALLOWED_CATEGORIES.includes(parsed.category) ? parsed.category : "한방건강";
  const today = new Date().toISOString().slice(0, 10);
  const slug = slugify(parsed.title);

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(parsed.title)}`,
    `description: ${JSON.stringify(parsed.description ?? "")}`,
    `date: "${today}"`,
    `category: ${JSON.stringify(category)}`,
    "keywords:",
    ...(parsed.keywords ?? []).slice(0, 8).map((k) => `  - ${JSON.stringify(String(k))}`),
    "source:",
    "  type: geo-gap",
    `  query: ${JSON.stringify(pick.topic)}`,
    ...(pick.group ? [`  group: ${JSON.stringify(pick.group)}`] : []),
    "---",
    "",
  ].join("\n");

  fs.mkdirSync(COLUMNS_DIR, { recursive: true });
  fs.writeFileSync(path.join(COLUMNS_DIR, `${slug}.md`), frontmatter + parsed.body_markdown.trim() + "\n", "utf8");
  console.log(`✔ 발행: ${parsed.title}`);
  console.log(`  ${slug}.md · category=${category}`);
}

main().catch((e) => fail(String(e?.message ?? e)));
