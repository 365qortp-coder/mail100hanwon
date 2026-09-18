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
import { monthlyVolumes, keywordCandidates, naverEnabled } from "./lib/naver-volume.mjs";
import { checkAd, checkMeta, checkStructure } from "./lib/ad-compliance.mjs";

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
  const DRY = process.env.DRY_RUN === "1"; // 시험 실행: 예산 무시·파일 미생성
  if (!DRY && publishedThisWeek >= (data.weeklyBudget ?? 1)) {
    skip(`주간 한도 도달 (최근 7일 ${publishedThisWeek}/${data.weeklyBudget}건) — 오늘은 쉽니다.`);
  }

  // 3) 아직 안 다룬 주제만 남기고, 네이버 실제 검색량으로 줄을 세운다
  //    (KEYWORD-01 2026-09-18: 갭이 있어도 아무도 검색하지 않는 질의면 쓰지 않는다.
  //     실측 예 — "공진단 부작용"은 네이버 월 20회, "공진단 먹는법"은 3,880회)
  const fresh = topics.filter((t) => !alreadyCovered(t.topic, existing));
  if (!fresh.length) skip("후보 주제가 모두 기존 칼럼과 겹칩니다.");

  let ranked = fresh.map((t) => ({ ...t, volume: null, keyword: null }));
  if (naverEnabled()) {
    const cands = new Map(); // 주제 -> 후보 검색어들
    for (const t of fresh) cands.set(t.topic, keywordCandidates(t.topic));
    const all = [...new Set([...cands.values()].flat())];
    const vols = await monthlyVolumes(all);
    if (vols) {
      ranked = fresh.map((t) => {
        let best = { keyword: null, volume: 0 };
        for (const c of cands.get(t.topic) ?? []) {
          const v = vols.get(c.replace(/\s+/g, "").toLowerCase()) ?? 0;
          if (v > best.volume) best = { keyword: c, volume: v };
        }
        return { ...t, ...best };
      });
      ranked.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0));
      console.log("· 검색량 순위(네이버 월간, 상위 5):");
      for (const r of ranked.slice(0, 5)) {
        console.log(`    ${String(r.volume ?? 0).padStart(6)}  ${r.keyword ?? "-"}  ← ${r.topic.slice(0, 40)}`);
      }
    }
  } else {
    console.log("· 네이버 키 미설정 — 검색량 없이 갭 순서대로 진행합니다.");
  }

  // TRACK-01 (2026-09-18): 두 트랙으로 나눈다.
  //  · SEO 트랙 — 네이버에 실제 수요가 있는 주제(월 100회 이상). 검색 유입을 노린다.
  //  · GEO 트랙 — 검색량은 없지만 AI가 그 질문을 받았을 때 우리가 빠지는 주제. 인용을 노린다.
  //    (검색량으로만 자르면 GEO 갭이 통째로 버려진다. 핀셋포인트가 측정하는 값의 핵심이 그쪽이다.)
  const MIN_VOLUME = Number(process.env.MIN_SEARCH_VOLUME || 100);
  const seoTrack = ranked.filter((t) => (t.volume ?? 0) >= MIN_VOLUME);
  const geoTrack = ranked
    .filter((t) => (t.volume ?? 0) < MIN_VOLUME)
    .sort((a, b) => (b.missRate ?? 0) - (a.missRate ?? 0) || (b.frequency ?? 0) - (a.frequency ?? 0));

  // 최근 7일에 SEO 트랙으로만 썼다면 이번엔 GEO 트랙 차례 (한쪽만 쌓이지 않게 번갈아 간다)
  const recentTracks = existing
    .filter((c) => c.date && c.date >= weekAgo)
    .map((c) => (fs.readFileSync(path.join(COLUMNS_DIR, c.file), "utf8").match(/^\s*track:\s*"?(\w+)"?/m)?.[1] ?? "seo"));
  const geoTurn = geoTrack.length > 0 && (seoTrack.length === 0 || (recentTracks.length > 0 && recentTracks.every((t) => t === "seo")));

  const pick = geoTurn ? geoTrack[0] : (seoTrack[0] ?? geoTrack[0]);
  if (!pick) skip("쓸 만한 주제가 없습니다.");
  pick.track = geoTurn || !(pick.volume >= MIN_VOLUME) ? "geo" : "seo";

  console.log(`· 트랙: ${pick.track === "geo" ? "GEO(AI 인용 겨냥)" : "SEO(검색 유입 겨냥)"}  · 후보 SEO ${seoTrack.length} / GEO ${geoTrack.length}`);
  console.log(`· 주제: ${pick.topic}${pick.group ? ` (${pick.group})` : ""}`);
  if (pick.volume) console.log(`· 노리는 검색어: ${pick.keyword} (네이버 월 ${pick.volume.toLocaleString()}회)`);
  if (pick.missRate != null) console.log(`· AI 미노출률: ${pick.missRate}% (최근 14일 ${pick.frequency ?? 0}회 등장)`);
  if (pick.winners?.length) console.log(`· 지금 인용되는 곳: ${pick.winners.map((w) => w.domain + (w.isCompetitor ? "(경쟁)" : "")).join(", ")}`);

  // 4) 생성 — 탈잉 SEO 강의 7단계를 그대로 밟는다 (한 번에 쓰지 않는다)
  //    P1 검색 의도 분석 → P2 개요 검토 → P3 초안 → P4 4기준 검수 → P5 구조화 → P6 제목·설명 → P7 주소
  //    (2026-09-18: 이전에는 프롬프트 한 방으로 썼다. 그러다 보니 제목이 실제 검색어와 어긋나고
  //     구조가 밋밋해 "크롤링됐는데 색인 안 됨" 상태가 쌓였다.)
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const ask = async (system, user, maxTokens = 8000) => {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: maxTokens,
      temperature: 0.4,
      system,
      messages: [{ role: "user", content: user }],
    });
    return msg.content.filter((c) => c.type === "text").map((c) => c.text).join("");
  };
  const cut = (text, name, next) => {
    const re = next
      ? new RegExp(`===${name}===\\s*([\\s\\S]*?)\\s*===${next}===`)
      : new RegExp(`===${name}===\\s*([\\s\\S]*)$`);
    return (text.match(re)?.[1] ?? "").trim();
  };

  const RULES = [
    "【의료광고법 — 어기면 발행이 자동 차단됩니다】",
    "- 금지: 완치·보장·최고/최상급·1위·부작용 없음·환자 후기 인용·전후 사진·감량 수치(kg·%)·타 병원 비교우위.",
    "- 효능은 단정하지 말고 '도움이 될 수 있다', '알려져 있다'로 쓰고 개인차·한계를 함께 적습니다.",
    "- 임상 서술은 ①어떤 고민으로 오는가 ②무엇을 확인하는가 ③왜 그렇게 보는가 ④어떤 방향으로 설계하는가 까지만.",
    "  그 다음의 결과·호전·후기는 절대 쓰지 않습니다.",
    "- 없는 수치·연구·URL을 지어내지 않습니다.",
  ].join("\n");

  const TOPIC_LINE = [
    `이 글이 답해야 하는 질문: "${pick.topic}"`,
    pick.keyword && pick.volume ? `노리는 검색어: "${pick.keyword}" (네이버 월 ${pick.volume.toLocaleString()}회)` : "",
    // GEO 맥락 — AI가 이 질문을 받았을 때 우리를 인용하게 만드는 것이 목적이다
    pick.seedPrompt ? `사람이 AI에게 실제로 한 질문: "${pick.seedPrompt}"` : "",
    pick.missRate != null ? `현재 이 질의에서 우리 병원은 ${pick.missRate}%의 경우 언급되지 않습니다.` : "",
    pick.winners?.length
      ? `지금 그 자리에 인용되는 곳: ${pick.winners.map((w) => w.domain).join(", ")}. ` +
        `그 글들보다 더 정확하고 구체적으로 답해야 인용 대상이 바뀝니다. 다만 그 사이트를 언급하거나 비교·비방하지 마세요.`
      : "",
    pick.track === "geo"
      ? "이 글은 검색량보다 'AI 답변에 인용되는 것'이 목적입니다. 질문에 대한 답을 첫 문단에 한 문장으로 못 박고, " +
        "자주 묻는 질문에 위 질문과 같은 표현을 그대로 한 번 넣으세요."
      : "",
  ].filter(Boolean).join("\n");

  // ── P1+P2: 검색 의도 분석 → 개요 → 스스로 걸러내기 ──────────────────
  console.log("· [1/3] 검색 의도 분석과 개요 (P1·P2)");
  const step1 = await ask(
    [
      "당신은 15년 경력의 SEO 전략가이자 한의원 콘텐츠 기획자입니다.",
      "검색자가 왜 지금 이 검색을 했는지부터 파악한 뒤 글의 뼈대를 세웁니다.",
      RULES,
      "",
      "【출력 형식 — 구분자를 그대로 쓰고 JSON·코드블록은 쓰지 마세요】",
      "===INTENT===",
      "(검색자의 상황과 심리, 진짜 해결하고 싶은 것 3~5문장)",
      "===OUTLINE===",
      "(## 소제목 4~6개. 각 줄 끝에 ' — ' 뒤로 그 단락에서 다룰 내용 한 줄.",
      " 검색 의도와 먼 소제목은 스스로 빼고 남은 것만 적습니다.",
      " 마지막 두 개는 반드시 '## 이런 경우 먼저 확인하세요'와 '## 자주 묻는 질문'.)",
    ].join("\n"),
    [TOPIC_LINE, "", "병원 정보 — 이 사실만 사용하고 지어내지 마세요:", CLINICAL_DATA].join("\n"),
    3000,
  );
  const intent = cut(step1, "INTENT", "OUTLINE");
  const outline = cut(step1, "OUTLINE");
  if (!outline) fail("개요 생성 실패 — 발행하지 않습니다.");

  // ── P3+P4: 초안 + 4기준 자체 검수 ────────────────────────────────
  console.log("· [2/3] 본문 초안과 검수 (P3·P4)");
  const step2 = await ask(
    [
      "당신은 매일백세한의원(서울 중랑구) 공식 홈페이지에 실릴 정보 칼럼을 쓰는 작가입니다.",
      "독자는 이 주제를 실제로 검색한 일반인입니다.",
      RULES,
      "",
      "【쓰고 나서 스스로 네 가지를 검수하고, 걸리는 부분은 고쳐서 최종본만 출력합니다】",
      "1. 번역체가 아닌 자연스러운 한국어인가",
      "2. 이 병원의 관점과 판단이 들어갔는가 (사실 나열로 끝나지 않았는가)",
      "3. 독자가 뒤로 가기를 눌러 다른 글을 찾지 않아도 될 만큼 충분한가",
      "4. 어디서나 볼 수 있는 일반론이 아니라 이 글만의 설명이 있는가",
      "",
      "【분량】 공백 포함 2,500~4,000자. ## 소제목 아래 2~3문단.",
      "",
      "【출력 형식】",
      "===BODY===",
      "(마크다운 본문. ## 소제목부터 시작. 제목(H1)은 쓰지 않습니다)",
    ].join("\n"),
    [
      TOPIC_LINE,
      "",
      "[검색 의도]",
      intent,
      "",
      "[확정된 개요 — 이대로 씁니다]",
      outline,
      "",
      "병원 정보 — 이 사실만 사용하고 지어내지 마세요:",
      CLINICAL_DATA,
    ].join("\n"),
  );
  const draft = cut(step2, "BODY");
  if (draft.length < 800) fail(`초안이 너무 짧습니다 (${draft.length}자) — 발행하지 않습니다.`);

  // ── P5+P6+P7: AI가 인용하기 좋은 구조로 재정리 + 제목·설명·주소 ──────
  console.log("· [3/3] 구조 재정리와 제목·설명 (P5·P6·P7)");
  const step3 = await ask(
    [
      "당신은 AI 검색(구글 AI 개요·챗GPT·퍼플렉시티)에 인용되도록 글을 다듬는 편집자입니다.",
      "AI는 글을 처음부터 끝까지 읽지 않고 질문과 관련된 부분만 찾아 인용합니다.",
      "",
      "【이렇게 고칩니다 — 내용은 더하지 말고 구조만】",
      "- 첫 문단을 두괄식으로: 질문에 대한 답을 굵게 한 문장으로 먼저, 이어 2~3문장 부연.",
      "- 비교·단계·기준은 마크다운 표로 최소 1개.",
      "- 나열은 불릿으로 끊고, 핵심 문구는 **굵게** 8~15개.",
      "- 자주 묻는 질문은 **Q.** / 답변 형식으로 4~5개.",
      "- 문장을 짧게. 한 문장에 한 가지만.",
      RULES,
      "",
      "【제목·설명 규칙 — 검색 결과에서 잘리지 않는 길이】",
      "- 제목: 한글 25~35자. 노리는 검색어를 앞쪽에 넣고, 궁금증이 남게. 키워드만 나열하지 않습니다.",
      "- 설명: 한글 70~80자. 이 글이 무엇에 답하는지.",
      "",
      `category는 반드시 다음 중 하나: ${ALLOWED_CATEGORIES.join(", ")}`,
      "",
      "【출력 형식】",
      "===TITLE===",
      "===DESCRIPTION===",
      "===CATEGORY===",
      "===KEYWORDS===",
      "(쉼표로 구분 5~8개. 노리는 검색어를 맨 앞에)",
      "===SLUG===",
      "(영문 소문자·숫자·하이픈만, 3~6단어. 주제를 알아볼 수 있게)",
      "===BODY===",
    ].join("\n"),
    [TOPIC_LINE, "", "[다듬을 원고]", draft].join("\n"),
  );

  const parsed = {
    title: cut(step3, "TITLE", "DESCRIPTION"),
    description: cut(step3, "DESCRIPTION", "CATEGORY"),
    category: cut(step3, "CATEGORY", "KEYWORDS"),
    keywords: cut(step3, "KEYWORDS", "SLUG").split(/[,\n]/).map((k) => k.trim().replace(/^[-•]\s*/, "")).filter(Boolean),
    slug: cut(step3, "SLUG", "BODY").toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    body_markdown: cut(step3, "BODY"),
  };
  if (!parsed.title || parsed.body_markdown.length < 800) {
    fail(`생성 결과 형식 불량 (title=${parsed.title ? "O" : "X"}, body=${parsed.body_markdown.length}자) — 발행하지 않습니다.`);
  }

  // ── 발행 전 자동 검사 — 지시문만으로는 막히지 않는다(2026-09-18 실제 위반 발견) ──
  const ad = checkAd(`${parsed.title}\n${parsed.description}\n${parsed.body_markdown}`);
  if (ad.violations.length) {
    for (const v of ad.violations) console.error(`  ✖ ${v.name} → …${v.sample}…`);
    fail(`의료광고 금지 표현 ${ad.violations.length}건 — 발행하지 않습니다.`);
  }
  for (const w of ad.warnings) console.log(`  ⚠ ${w.name} → …${w.sample}…`);
  for (const n of checkMeta(parsed)) console.log(`  ⚠ ${n}`);
  for (const n of checkStructure(parsed.body_markdown)) console.log(`  ⚠ 구조: ${n}`);

  // WIKI-LINK-01 (2026-08-03): 본문에 등장하는 한방위키 용어 1~2개에 링크를 건다.
  // 위키(hanbangwiki.kr)는 새 도메인이라 외부 링크가 거의 없어 구글이 URL을 발견조차 못 하고 있다
  // (실측: 발행 12편 중 6편이 "Google에는 아직 알려지지 않은 URL"). 본진은 색인률이 가장 높아
  // 구글이 자주 오는 사이트라, 여기서 거는 링크가 가장 빠른 발견 경로가 된다.
  // 2개로 제한하는 이유: 매 칼럼에 링크가 쏟아지면 자연스러운 참고 링크가 아니라 링크 심기로 읽힌다.
  parsed.body_markdown = await addWikiLinks(parsed.body_markdown);

  const category = ALLOWED_CATEGORIES.includes(parsed.category) ? parsed.category : "한방건강";
  const today = new Date().toISOString().slice(0, 10);
  const slug = parsed.slug && parsed.slug.length >= 6 ? `${parsed.slug}-${Math.random().toString(36).slice(2, 6)}` : slugify(parsed.title);

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
    ...(pick.keyword ? [`  keyword: ${JSON.stringify(pick.keyword)}`, `  volume: ${pick.volume ?? 0}`] : []),
    `  track: ${JSON.stringify(pick.track ?? "seo")}`,
    ...(pick.missRate != null ? [`  missRate: ${pick.missRate}`] : []),
    ...(pick.seedPrompt ? [`  seedPrompt: ${JSON.stringify(pick.seedPrompt)}`] : []),
    ...(pick.group ? [`  group: ${JSON.stringify(pick.group)}`] : []),
    "---",
    "",
  ].join("\n");

  if (DRY) {
    console.log("--- 시험 실행(DRY_RUN=1) — 파일을 만들지 않습니다 ---");
    console.log(`  제목(${parsed.title.length}자): ${parsed.title}`);
    console.log(`  설명(${(parsed.description ?? "").length}자): ${parsed.description}`);
    console.log(`  본문 ${parsed.body_markdown.length}자 · slug=${slug} · category=${category}`);
    return;
  }
  fs.mkdirSync(COLUMNS_DIR, { recursive: true });
  fs.writeFileSync(path.join(COLUMNS_DIR, `${slug}.md`), frontmatter + parsed.body_markdown.trim() + "\n", "utf8");
  console.log(`✔ 발행: ${parsed.title}`);
  console.log(`  ${slug}.md · category=${category}`);
}

main().catch((e) => fail(String(e?.message ?? e)));
