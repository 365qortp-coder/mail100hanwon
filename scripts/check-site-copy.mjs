/**
 * 사이트 문구 의료광고 점검 (2026-09-18)
 *
 * 왜 만들었나: 칼럼만 검사하고 있었는데, 정작 랜딩 페이지(/diet)에
 * "실제 후기에서 8.7kg 감량", "평균 48일 4.5kg", "부작용 없이", "89.9% 체지방 위주 감량"이
 * 그대로 살아 있었다. 의료법 제56조가 금지하는 치료경험담·치료효과 오인 광고다.
 *
 * 쓰는 법:
 *   node scripts/check-site-copy.mjs              ← src 전체
 *   node scripts/check-site-copy.mjs src content  ← 폴더 지정
 *
 * X 가 하나라도 뜨면 배포 전에 고쳐야 한다.
 * 가격·처방 건수·안전성 수치(간수치 이상 발생률 등)는 허용 범위라 걸리지 않는다.
 */
import fs from "node:fs";
import path from "node:path";
import { checkAd } from "./lib/ad-compliance.mjs";

const walk = (d, out = []) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) {
      if (!/node_modules|[.]next|[.]git/.test(p)) walk(p, out);
    } else if (/[.](tsx?|json|md|html)$/.test(e.name)) out.push(p);
  }
  return out;
};

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
let bad = 0;
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root)) {
    const s = fs.readFileSync(f, "utf8");
    const { violations, warnings } = checkAd(s);
    const seen = new Set();
    const uniq = violations.filter((v) => !seen.has(v.sample) && seen.add(v.sample));
    if (uniq.length || warnings.length) {
      bad++;
      console.log("=== " + f.split(path.sep).join("/"));
      for (const v of uniq) console.log("   X " + v.name + " :: " + v.sample);
      for (const v of warnings.slice(0, 3)) console.log("   ! " + v.name + " :: " + v.sample);
    }
  }
}
console.log(bad ? `\n손볼 파일 ${bad}개` : "\n전부 통과");
process.exit(0);
