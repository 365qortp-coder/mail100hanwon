/**
 * 네이버 검색광고 키워드도구 — 월간 검색수 조회 (2026-09-18)
 *
 * 왜 붙였나: 지금까지 주제를 "AI 팬아웃 갭"만 보고 골랐다. 그러다 보니
 * 아무도 검색하지 않는 질의로 글이 나갈 수 있었다(실측: "공진단 부작용"은 네이버 월 20회).
 * 갭이 있어도 수요가 없으면 쓰지 않는다 — 그 판단을 여기서 한다.
 *
 * env: NAVER_AD_CUSTOMER_ID, NAVER_AD_ACCESS_LICENSE, NAVER_AD_SECRET_KEY
 * 키가 없으면 조용히 null을 돌려준다(발행 파이프라인을 막지 않는다).
 */
import crypto from "node:crypto";

const BASE = "https://api.searchad.naver.com";

export function naverEnabled() {
  return Boolean(
    process.env.NAVER_AD_CUSTOMER_ID &&
      process.env.NAVER_AD_ACCESS_LICENSE &&
      process.env.NAVER_AD_SECRET_KEY,
  );
}

function sign(timestamp, method, uriPath) {
  return crypto
    .createHmac("sha256", process.env.NAVER_AD_SECRET_KEY)
    .update(`${timestamp}.${method}.${uriPath}`)
    .digest("base64");
}

const num = (v) => (typeof v === "number" ? v : parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0);

/** 키워드 하나의 월간 검색수(PC+모바일). 조회 실패·키 없음이면 null */
export async function monthlyVolume(keyword) {
  const map = await monthlyVolumes([keyword]);
  return map?.get(normalize(keyword)) ?? null;
}

const normalize = (s) => String(s || "").replace(/\s+/g, "").toLowerCase();

/**
 * 여러 키워드의 월간 검색수를 한 번에. Map<정규화키워드, 합계>
 * 네이버는 hintKeywords를 5개까지 받고, 연관 키워드를 함께 돌려준다 —
 * 그 연관 목록에서 우리가 물어본 키워드를 찾아 쓴다.
 */
export async function monthlyVolumes(keywords) {
  if (!naverEnabled() || !keywords?.length) return null;
  const out = new Map();
  for (let i = 0; i < keywords.length; i += 5) {
    const chunk = keywords.slice(i, i + 5);
    try {
      const timestamp = Date.now().toString();
      const uriPath = "/keywordstool";
      const url = new URL(BASE + uriPath);
      url.searchParams.set("hintKeywords", chunk.map((k) => String(k).replace(/\s+/g, "")).join(","));
      url.searchParams.set("showDetail", "1");
      const res = await fetch(url, {
        headers: {
          "X-Timestamp": timestamp,
          "X-API-KEY": process.env.NAVER_AD_ACCESS_LICENSE,
          "X-Customer": String(process.env.NAVER_AD_CUSTOMER_ID),
          "X-Signature": sign(timestamp, "GET", uriPath),
        },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        console.log(`· 네이버 검색량 조회 실패 ${res.status} — 검색량 없이 진행합니다.`);
        continue;
      }
      const data = await res.json();
      for (const k of data.keywordList ?? []) {
        out.set(normalize(k.relKeyword), num(k.monthlyPcQcCnt) + num(k.monthlyMobileQcCnt));
      }
    } catch (e) {
      console.log(`· 네이버 검색량 조회 오류(${String(e?.message ?? e).slice(0, 60)}) — 검색량 없이 진행합니다.`);
    }
  }
  return out;
}

/**
 * 질의 문장에서 검색어 후보를 뽑는다.
 * "공진단 먹으면 안 되는 사람 있나요?" → ["공진단 먹으면 안 되는 사람", "공진단"]
 * 긴 문장은 네이버에서 검색수가 0으로 나오므로 짧은 형태도 함께 본다.
 */
export function keywordCandidates(topic) {
  const clean = String(topic || "")
    .replace(/[?!.,·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = clean.split(" ");
  const cands = new Set();
  if (words.length <= 6) cands.add(clean);
  if (words.length >= 2) cands.add(words.slice(0, 2).join(" "));
  cands.add(words[0]);
  return [...cands].filter((w) => w && w.length >= 2);
}
