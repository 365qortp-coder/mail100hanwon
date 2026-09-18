/**
 * 의료광고 자동 검사 (2026-09-18)
 *
 * 왜 붙였나: 지시문(프롬프트)에 "쓰지 마라"고 적어 두는 것만으로는 막히지 않았다.
 * 실제로 「매일감비환이란?」 글에 "평균 48일 약 4.5kg 감량", 환자 사례 나열, "부작용 없이"가
 * 그대로 발행돼 있었다(2026-09-18 발견·삭제). 그래서 발행 직전에 코드로 한 번 더 막는다.
 *
 * 걸리면 발행하지 않는다. 사람이 보고 고치는 편이 자동 수정보다 안전하다.
 */

/** 절대 금지 — 하나라도 걸리면 발행 중단 */
const HARD = [
  { name: "치료 결과 수치(감량 kg·%)", re: /\d+(\.\d+)?\s*(kg|킬로그램|킬로)\s*(이상\s*)?(감량|빠|줄|감소)/ },
  { name: "치료 결과 수치(%)", re: /\d+\s*%\s*(감량|감소|개선|호전)/ },
  { name: "환자 후기·체험담 인용", re: /(실제\s*후기|복용\s*후기|치료\s*후기|체험담|후기가\s*있습니다|사례가\s*있습니다)/ },
  { name: "부작용 없음 주장", re: /부작용\s*(이|은|는)?\s*없(이|음|습니다|다는|어요)/ },
  { name: "완치·보장", re: /(완치|100%\s*(효과|보장)|반드시\s*(낫|좋아))/ },
  { name: "최상급 표현", re: /(국내\s*최고|최고의\s*(병원|한의원|치료)|최상급|업계\s*1위|유일한\s*병원)/ },
  // 2026-09-18 추가 — 랜딩에서 실제로 살아 있던 표현들. 숫자 단위만 다를 뿐 같은 금지선이다.
  { name: "치료 결과 비율(체지방·감량 %)", re: /(\d+(\.\d+)?\s*%[^\n]{0,12}(체지방|감량)|(체지방|감량)[^\n]{0,12}\d+(\.\d+)?\s*%)/ },
  { name: "후기 기반 통계·인용", re: /(후기\s*평균|실제\s*후기|후기에서|후기\s*영상)/ },
  { name: "효과 체감 단정", re: /효과를\s*체감(한|하신|했)/ },
  { name: "전후 비교 언급", re: /(비포\s*애프터|전후\s*사진|before\s*&?\s*after)/i },
  { name: "타 의료기관 비교우위", re: /(다른\s*한의원|타\s*병원)(보다|에\s*비해)\s*(더|훨씬)?\s*(좋|우수|효과)/ },
];

/** 경고 — 발행은 하되 로그에 남긴다 */
const SOFT = [
  { name: "효능 단정", re: /(치료됩니다|(?:완전히|깨끗이|저절로)\s*낫습니다|(?:증상|통증|병)(?:이|은)\s*(?:낫습니다|없어집니다|사라집니다))/ },  // "~하는 편이 낫습니다"(=더 좋다)는 효능 단정이 아니다 — 오탐이라 문맥을 붙였다(2026-09-18)
  { name: "재촉·과장", re: /(지금\s*바로\s*예약|서두르|놓치지\s*마)/ },
];

export function checkAd(text) {
  // 걸린 것을 전부 돌려준다. 처음 한 건만 보여 주면 같은 종류가 여러 군데 있을 때
  // 한 건만 고치고 끝낸 것으로 착각한다 (2026-09-18 실제로 그랬다).
  const hits = (list) =>
    list.flatMap(({ name, re }) => {
      const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g");
      return [...String(text).matchAll(g)].slice(0, 5).map((m) => ({
        name,
        sample: String(text)
          .slice(Math.max(0, m.index - 30), m.index + 50)
          .replace(/\s+/g, " "),
      }));
    });
  return { violations: hits(HARD), warnings: hits(SOFT) };
}

/** 검색 결과 화면에서 잘리지 않는 길이인지 (탈잉 강의 기준: 제목 25~35자, 설명 70~80자) */
export function checkMeta({ title, description }) {
  const notes = [];
  const t = (title ?? "").length;
  const d = (description ?? "").length;
  if (t < 20 || t > 38) notes.push(`제목 ${t}자 (권장 25~35자 — 넘으면 검색 결과에서 잘립니다)`);
  if (d < 60 || d > 90) notes.push(`설명 ${d}자 (권장 70~80자)`);
  return notes;
}

/** AI가 인용하기 좋은 구조인지 — 탈잉 강의의 세 가지 기준 */
export function checkStructure(rawBody) {
  // 윈도우식 줄바꿈(캐리지 리턴이 섞인 파일)에서는 아래 정규식이 전부 빗나간다.
  // 그래서 표가 있는 글도 "표가 없습니다"로, 모든 글이 "첫 문단이 깁니다"로 잡혔다 (2026-09-18 수정)
  const body = String(rawBody).split("\r\n").join("\n");
  const notes = [];
  if (!/\n\|.*\|.*\n\|[\s:|-]+\|/.test(body)) notes.push("표가 없습니다 (비교·단계는 표로)");
  if (!/^##\s/m.test(body)) notes.push("## 소제목이 없습니다");
  if (!/(자주\s*묻는|FAQ|Q\.|\*\*Q)/.test(body)) notes.push("FAQ 단락이 없습니다");
  const first = body.trim().split("\n\n")[0] ?? "";
  if (first.length > 400) notes.push("첫 문단이 깁니다 (두괄식으로 결론부터 2~3문장)");
  return notes;
}
