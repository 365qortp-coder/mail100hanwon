"use client";

import { useState } from "react";
import Link from "next/link";

const femaleAvg: Array<[number, number]> = [[29, 1360], [39, 1320], [49, 1280], [999, 1230]];
const maleAvg: Array<[number, number]> = [[29, 1730], [39, 1680], [49, 1630], [999, 1580]];

function averageFor(gender: "male" | "female", age: number) {
  const table = gender === "male" ? maleAvg : femaleAvg;
  for (const [maxAge, avg] of table) {
    if (age <= maxAge) return avg;
  }
  return table[table.length - 1][1];
}

type Result = {
  bmr: number;
  label: string;
  compareText: string;
  tdee: number | null;
  showCta: boolean;
};

export function BmrCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [activity, setActivity] = useState("0");
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const calc = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const bf = parseFloat(bodyFat);
    const act = parseFloat(activity);

    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) {
      setError("나이, 키, 몸무게를 정확히 입력해주세요.");
      setResult(null);
      return;
    }
    setError("");

    let bmr: number;
    let label: string;
    if (bf && bf > 0 && bf < 70) {
      const lbm = w * (1 - bf / 100);
      bmr = 370 + 21.6 * lbm;
      label = "기초대사량 (Katch-McArdle · 체지방률 반영)";
    } else {
      bmr = gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
      label = "기초대사량 (Mifflin-St Jeor)";
    }
    bmr = Math.round(bmr);

    const avg = averageFor(gender, a);
    const diffPct = Math.round(((bmr - avg) / avg) * 100);
    const who = gender === "male" ? "남성" : "여성";
    let compareText: string;
    if (diffPct <= -5) {
      compareText = `동일 연령대 ${who} 평균(${avg}kcal)보다 ${Math.abs(diffPct)}% 낮습니다.`;
    } else if (diffPct >= 5) {
      compareText = `동일 연령대 ${who} 평균(${avg}kcal)보다 ${diffPct}% 높습니다.`;
    } else {
      compareText = `동일 연령대 ${who} 평균(${avg}kcal)과 비슷한 수준입니다.`;
    }

    setResult({
      bmr,
      label,
      compareText,
      tdee: act > 0 ? Math.round(bmr * act) : null,
      showCta: diffPct <= -5,
    });
  };

  const segBtn = (active: boolean) =>
    `py-3 rounded-xl border text-sm font-bold transition-colors ${
      active
        ? "bg-[#0a0a0a] text-white border-[#0a0a0a]"
        : "bg-white text-[#525252] border-black/10 hover:border-black/25"
    }`;
  const inputCls =
    "w-full px-3 py-3 rounded-xl border border-black/10 text-sm font-semibold text-center focus:outline-none focus:border-[var(--brand-primary)] bg-white";

  return (
    <div className="bg-[#F8F6F2] border border-black/[0.06] rounded-[26px] p-6 md:p-9">
      <div className="mb-5">
        <p className="text-xs font-bold text-[#8C8A87] mb-2.5">성별</p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className={segBtn(gender === "male")} onClick={() => setGender("male")}>
            남성
          </button>
          <button type="button" className={segBtn(gender === "female")} onClick={() => setGender("female")}>
            여성
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div>
          <label className="text-xs font-bold text-[#8C8A87] mb-2 block">나이</label>
          <input type="number" inputMode="numeric" placeholder="40" value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-bold text-[#8C8A87] mb-2 block">키(cm)</label>
          <input type="number" inputMode="numeric" placeholder="160" value={height} onChange={(e) => setHeight(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-bold text-[#8C8A87] mb-2 block">몸무게(kg)</label>
          <input type="number" inputMode="numeric" placeholder="60" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} />
        </div>
      </div>

      <details className="mb-6 group">
        <summary className="cursor-pointer text-xs font-bold text-[#8C8A87] flex items-center gap-1.5 list-none select-none">
          더 정확하게 계산하기 (선택)
          <span className="group-open:rotate-180" style={{ transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)" }} aria-hidden>
            ▾
          </span>
        </summary>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#8C8A87] mb-2 block">활동량</label>
            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full px-3 py-3 rounded-xl border border-black/10 text-sm font-semibold focus:outline-none focus:border-[var(--brand-primary)] bg-white"
            >
              <option value="0">선택 안 함</option>
              <option value="1.2">거의 안 움직임 (좌식)</option>
              <option value="1.375">가벼운 활동 (주 1~3회 운동)</option>
              <option value="1.55">보통 활동 (주 3~5회 운동)</option>
              <option value="1.725">활발한 활동 (주 6~7회 운동)</option>
              <option value="1.9">매우 활발 (매일 강도 높은 활동)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#8C8A87] mb-2 block">체지방률(%) — 인바디 참고</label>
            <input type="number" inputMode="decimal" placeholder="예: 28" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} className={inputCls} />
          </div>
        </div>
      </details>

      <button type="button" onClick={calc} className="rn-btn-primary w-full py-4 bg-[var(--brand-primary)] text-white text-sm font-bold rounded-full">
        계산하기
      </button>

      {error && <p className="mt-4 text-sm font-semibold text-[var(--brand-primary)]">{error}</p>}

      {result && (
        <div className="mt-7 pt-7 border-t border-black/[0.08]">
          <p className="text-xs font-bold text-[#8C8A87] mb-1">{result.label}</p>
          <p className="font-serif text-4xl md:text-5xl font-bold text-[#0a0a0a] mb-2">
            {result.bmr.toLocaleString()}
            <span className="text-lg font-sans font-semibold text-[#8C8A87]"> kcal</span>
          </p>
          <p className="text-sm text-[#525252] leading-relaxed mb-4">{result.compareText}</p>
          {result.tdee !== null && (
            <div className="bg-white rounded-xl border border-black/[0.06] px-4 py-3 mb-4">
              <p className="text-xs font-bold text-[#8C8A87] mb-1">활동대사량(TDEE) — 하루 총 소모 칼로리</p>
              <p className="font-serif text-2xl font-bold text-[var(--brand-primary)]">
                {result.tdee.toLocaleString()} <span className="text-sm font-sans text-[#8C8A87]">kcal</span>
              </p>
            </div>
          )}
          {result.showCta && (
            <div className="bg-[var(--brand-primary-light)] rounded-xl p-5 mt-2">
              <p className="text-sm font-bold text-[#0a0a0a] mb-3">
                기초대사량이 낮으면 같은 양을 먹어도 살이 찌기 쉽습니다.
                <br />
                대사 회복이 먼저입니다.
              </p>
              <Link
                href="/diet"
                className="rn-btn-primary inline-flex items-center gap-2 px-6 py-3 bg-[var(--brand-primary)] text-white text-sm font-bold rounded-full"
              >
                매일감비환 알아보기 <span aria-hidden>→</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
