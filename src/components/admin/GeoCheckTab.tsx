"use client";

import { useState } from "react";

const GEO_CHECK_BASE = "https://geo-check-xi.vercel.app";
const QUICK_LINKS = [
  { label: "홈페이지", url: "https://mail100hanwon.co.kr/" },
  { label: "다이어트", url: "https://mail100hanwon.co.kr/diet" },
  { label: "공진단", url: "https://mail100hanwon.co.kr/gongjindan" },
  { label: "무릎관절 NMC", url: "https://mail100hanwon.co.kr/nmc" },
];

type ScoreResult = {
  score: number;
  grade: string;
  todos?: { text: string; detail: string; gain: number }[];
  error?: string;
};

function ScoreCard({ title, result }: { title: string; result: ScoreResult | null }) {
  if (!result) return null;
  return (
    <div className="rounded-xl border border-[var(--border)] p-5 flex-1 min-w-[260px]">
      <p className="text-xs font-bold tracking-wide text-[var(--text-muted)] uppercase mb-1">
        {title}
      </p>
      <p className="text-3xl font-bold mb-1">
        {result.score}
        <span className="text-base font-normal text-[var(--text-muted)]"> / 100 · {result.grade}</span>
      </p>
      {result.todos && result.todos.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm">
          {result.todos.slice(0, 5).map((t, i) => (
            <li key={i} className="text-[var(--text-muted)]">
              · {t.text} <span className="text-xs">(+{t.gain}점)</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function GeoCheckTab() {
  const [url, setUrl] = useState(QUICK_LINKS[0].url);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geo, setGeo] = useState<ScoreResult | null>(null);
  const [seo, setSeo] = useState<ScoreResult | null>(null);

  async function handleCheck() {
    setLoading(true);
    setError("");
    setGeo(null);
    setSeo(null);
    try {
      const [geoRes, seoRes] = await Promise.all([
        fetch(`${GEO_CHECK_BASE}/api/geo?url=${encodeURIComponent(url)}`),
        fetch(`${GEO_CHECK_BASE}/api/seo?url=${encodeURIComponent(url)}`),
      ]);
      const [geoData, seoData] = await Promise.all([geoRes.json(), seoRes.json()]);
      if (!geoRes.ok) throw new Error(geoData.error || "GEO 점수 조회 실패");
      if (!seoRes.ok) throw new Error(seoData.error || "SEO 점수 조회 실패");
      setGeo(geoData);
      setSeo(seoData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "조회 실패");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_LINKS.map((l) => (
          <button
            key={l.url}
            onClick={() => setUrl(l.url)}
            className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold"
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="flex gap-3 mb-6">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          className="rounded-lg bg-[var(--brand-primary)] text-white text-sm font-bold px-5 py-2 disabled:opacity-50"
        >
          {loading ? "확인 중..." : "점수 확인"}
        </button>
      </div>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
      <div className="flex flex-wrap gap-4">
        <ScoreCard title="GEO 점수" result={geo} />
        <ScoreCard title="SEO 점수" result={seo} />
      </div>
    </div>
  );
}
