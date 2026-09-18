import fs from "node:fs";
import { checkAd, checkMeta, checkStructure } from "./scripts/lib/ad-compliance.mjs";

const files = process.argv.slice(2);
for (const f of files) {
  const s = fs.readFileSync(f, "utf8");
  const body = s.startsWith("---") ? s.slice(s.indexOf("\n---", 3) + 4) : s;
  const title = (s.match(/^title: "(.*)"/m) || [])[1] || "";
  const description = (s.match(/^description: "(.*)"/m) || [])[1] || "";
  const ad = checkAd(s);
  console.log("=== " + f);
  console.log("  본문 " + body.replace(/\s/g, "").length + "자 / 제목 " + title.length + "자 / 설명 " + description.length + "자");
  if (ad.violations.length) for (const v of ad.violations) console.log("  ✖ " + v.name + " :: " + v.sample);
  if (ad.warnings.length) for (const v of ad.warnings) console.log("  ⚠ " + v.name + " :: " + v.sample);
  const m = checkMeta({ title, description });
  const st = checkStructure(body);
  if (m.length) console.log("  메타: " + m.join(" | "));
  if (st.length) console.log("  구조: " + st.join(" | "));
  if (!ad.violations.length && !m.length && !st.length) console.log("  통과");
}
