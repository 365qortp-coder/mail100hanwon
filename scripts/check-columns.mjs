/**
 * 발행된 칼럼 전수 점검 (2026-09-18)
 *
 * 왜 만들었나: 발행기(generate-gap-column.mjs)는 새로 쓰는 글만 검사한다.
 * 이미 올라가 있는 글은 아무도 다시 보지 않아서, 본문이 중간에서 끊긴 글,
 * 옛 전화번호, 의료광고 금지 표현이 그대로 살아 있었다(2026-09-18 발견).
 *
 * 쓰는 법:
 *   node scripts/check-columns.mjs            ← 전체
 *   node scripts/check-columns.mjs 파일경로…  ← 일부만
 *
 * 보는 법: "통과"가 아닌 줄만 손보면 된다.
 *   ✖ = 의료광고 금지 표현 (발행하면 안 되는 것)
 *   ⚠ = 경고 (문맥을 보고 판단)
 *   메타/구조 = 검색·AI 인용에 불리한 상태
 */
import fs from "node:fs";
import path from "node:path";
import { checkAd, checkMeta, checkStructure } from "./lib/ad-compliance.mjs";

const DIR = path.join(process.cwd(), "content", "columns");
const OLD_PHONE = /02-2234-0102/; // 옛 대표번호 — 남아 있으면 전화가 닿지 않는다
const MIN_BODY = 1200; // 공백 제외. 이보다 짧으면 본문이 끊겼을 가능성이 크다

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => path.join(DIR, f));

let bad = 0;
for (const file of files) {
  const s = fs.readFileSync(file, "utf8");
  const name = path.basename(file);
  if (/^status:\s*["']?(draft|private)/m.test(s)) continue; // 공개되지 않은 글은 건너뛴다

  const body = s.startsWith("---") ? s.slice(s.indexOf("\n---", 3) + 4) : s;
  const title = (s.match(/^title: "(.*)"/m) || [])[1] || "";
  const description = (s.match(/^description: "(.*)"/m) || [])[1] || "";
  const chars = body.replace(/\s/g, "").length;

  const notes = [];
  const ad = checkAd(s);
  for (const v of ad.violations) notes.push("✖ " + v.name + " :: " + v.sample);
  for (const v of ad.warnings) notes.push("⚠ " + v.name + " :: " + v.sample);
  if (OLD_PHONE.test(s)) notes.push("✖ 옛 전화번호(02-2234-0102)가 남아 있습니다");
  if (chars < MIN_BODY) notes.push(`✖ 본문이 ${chars}자뿐입니다 — 중간에서 끊겼는지 확인하세요`);
  for (const n of checkMeta({ title, description })) notes.push("메타: " + n);
  for (const n of checkStructure(body)) notes.push("구조: " + n);

  if (notes.length) {
    bad++;
    console.log(`=== ${name}  (본문 ${chars}자 / 제목 ${title.length}자 / 설명 ${description.length}자)`);
    for (const n of notes) console.log("    " + n);
  }
}
console.log(bad ? `\n손볼 글 ${bad}편` : "\n전부 통과");
process.exit(0);
