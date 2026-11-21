#!/usr/bin/env node
/**
 * IndexNow — 새 글·고친 글 주소를 검색엔진에 바로 알리기 (2026-11-21)
 *
 * IndexNow 는 "이 주소가 새로 생겼거나 바뀌었으니 와서 보라"고 먼저 알리는 공용 방식입니다.
 * 한 번 보내면 빙·네이버·얀덱스 등 참여 검색엔진이 서로 나눠 받습니다. 구글은 참여하지 않습니다
 * (구글은 사이트 지도를 스스로 다시 읽습니다).
 *
 * 확인 키: 사이트 맨 위의 <키>.txt 파일. 검색엔진이 그 파일을 열어 "주인이 보낸 요청"인지 확인합니다.
 * 공개되는 값이라 비밀이 아닙니다. 계정·비밀번호가 필요 없습니다.
 *
 * 이 파일은 공진단·본원·핀셋포인트 저장소에 같은 내용으로 들어 있습니다(꾸러미 없이 node만으로 돎).
 *
 * 쓰는 법
 *   node indexnow.mjs --host gongjindan.io.kr --key <키> https://gongjindan.io.kr/columns/a/ ...
 *   node indexnow.mjs --host gongjindan.io.kr --key <키> --sitemap --all
 *       → 사이트 지도의 주소 전부 (처음 한 번)
 *   node indexnow.mjs --host mail100hanwon.co.kr --key <키> --sitemap --days 2 --include /columns
 *       → 사이트 지도에서 최근 2일 안에 바뀐(lastmod) 주소만
 *   --exclude <정규식>  빼고 보낼 주소 (예: ^/gongjindan)
 *   --dry               보내지 않고 목록만 보여 줌
 */

const args = process.argv.slice(2);
const opt = (name, def = null) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith("--") ? args[i + 1] : def;
};
const flag = (name) => args.includes(`--${name}`);

const HOST = opt("host");
const KEY = opt("key");
const DRY = flag("dry");
if (!HOST || !KEY) {
  console.error("✖ --host 와 --key 가 필요합니다");
  process.exit(1);
}
const BASE = `https://${HOST}`;

/** 같은 내용을 여러 검색엔진에 직접 — 공유가 늦거나 빠지는 경우를 대비해 네이버에는 따로도 보냅니다 */
const ENDPOINTS = ["https://api.indexnow.org/indexnow", "https://searchadvisor.naver.com/indexnow"];

const valueArgs = new Set(["--host", "--key", "--days", "--include", "--exclude"].flatMap((f) => {
  const i = args.indexOf(f);
  return i >= 0 ? [i, i + 1] : [];
}));
const explicit = args.filter((a, i) => !valueArgs.has(i) && !a.startsWith("--"));

async function fromSitemap() {
  const res = await fetch(`${BASE}/sitemap.xml?t=${Date.now()}`, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`사이트 지도 응답 ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
    loc: (m[1].match(/<loc>\s*([^<\s]+)\s*<\/loc>/) || [])[1],
    lastmod: (m[1].match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/) || [])[1],
  }));
  let list = items.filter((x) => x.loc);
  const days = Number(opt("days", "0"));
  if (!flag("all") && days > 0) {
    const since = Date.now() - days * 86400e3;
    list = list.filter((x) => x.lastmod && new Date(x.lastmod).getTime() >= since);
  }
  return list.map((x) => x.loc);
}

async function main() {
  let urls = explicit.length ? explicit.map((u) => (u.startsWith("http") ? u : BASE + u)) : flag("sitemap") ? await fromSitemap() : [];
  const inc = opt("include");
  const exc = opt("exclude");
  const pathOf = (u) => {
    try {
      return decodeURI(new URL(u).pathname);
    } catch {
      return u;
    }
  };
  if (inc) urls = urls.filter((u) => new RegExp(inc).test(pathOf(u)));
  if (exc) urls = urls.filter((u) => !new RegExp(exc).test(pathOf(u)));
  urls = [...new Set(urls)].filter((u) => {
    try {
      return new URL(u).host === HOST;
    } catch {
      return false;
    }
  });

  console.log(`· ${HOST} — 알릴 주소 ${urls.length}개`);
  for (const u of urls.slice(0, 15)) console.log(`  - ${u}`);
  if (urls.length > 15) console.log(`  … 외 ${urls.length - 15}개`);
  if (!urls.length || DRY) return;

  // 확인 파일이 실제로 열리는지 먼저 — 안 열리면 검색엔진이 요청을 버립니다
  const keyRes = await fetch(`${BASE}/${KEY}.txt?t=${Date.now()}`, { signal: AbortSignal.timeout(20000) });
  const keyText = keyRes.ok ? (await keyRes.text()).trim() : "";
  if (keyText !== KEY) {
    console.error(`✖ 확인 파일 ${BASE}/${KEY}.txt 가 안 열리거나 내용이 다릅니다 (응답 ${keyRes.status}) — 보내지 않습니다`);
    process.exit(1);
  }

  let okCount = 0;
  for (const ep of ENDPOINTS) {
    // 한 번에 1만 개까지 받습니다
    for (let i = 0; i < urls.length; i += 10000) {
      const chunk = urls.slice(i, i + 10000);
      try {
        const res = await fetch(ep, {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${BASE}/${KEY}.txt`, urlList: chunk }),
          signal: AbortSignal.timeout(30000),
        });
        const note = { 200: "접수", 202: "접수(확인 대기)", 400: "형식 오류", 403: "키 확인 실패", 422: "주소가 사이트와 안 맞음", 429: "너무 자주 보냄" }[res.status] ?? "";
        console.log(`  → ${new URL(ep).host}: ${res.status} ${note} (${chunk.length}개)`);
        if (res.status === 200 || res.status === 202) okCount++;
      } catch (e) {
        console.log(`  → ${new URL(ep).host}: 연결 실패 (${String(e.message).slice(0, 80)})`);
      }
    }
  }
  if (!okCount) {
    console.error("✖ 어느 검색엔진도 접수하지 않았습니다");
    process.exit(1);
  }
  console.log("✔ 검색엔진에 알렸습니다");
}

main().catch((e) => {
  console.error(`✖ ${e?.message ?? e}`);
  process.exit(1);
});
