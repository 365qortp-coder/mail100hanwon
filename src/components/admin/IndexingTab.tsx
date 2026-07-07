"use client";

import { useMemo, useState } from "react";
import type { ColumnMeta } from "@/lib/columns";

type ParsedRow = {
  url: string;
  lastCrawled?: string;
  slug: string | null;
  daysSince: number | null;
};

function extractSlug(url: string): string | null {
  const marker = "/columns/";
  const idx = url.lastIndexOf(marker);
  if (idx === -1) return null;
  const raw = url.slice(idx + marker.length).split(/[?#]/)[0].replace(/\/$/, "");
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function parseInput(text: string): ParsedRow[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line): ParsedRow | null => {
      const [url, lastCrawled] = line.split("\t").map((s) => s?.trim());
      if (!url || !url.startsWith("http")) return null;
      const slug = extractSlug(url);
      let daysSince: number | null = null;
      if (lastCrawled) {
        const d = new Date(lastCrawled);
        if (!isNaN(d.getTime())) {
          daysSince = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
        }
      }
      return { url, lastCrawled, slug, daysSince };
    })
    .filter((r): r is ParsedRow => r !== null);
}

export function IndexingTab({ columns }: { columns: ColumnMeta[] }) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const columnSlugs = useMemo(() => new Set(columns.map((c) => c.slug)), [columns]);

  function handleParse() {
    setRows(parseInput(text));
    setSelected(new Set());
    setMessage("");
  }

  function toggle(slug: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }

  async function handleDelete() {
    if (selected.size === 0) return;
    if (!confirm(`선택한 ${selected.size}개 칼럼을 삭제할까요? 되돌릴 수 없습니다.`)) return;

    setDeleting(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/columns/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "삭제 요청 실패");
        return;
      }
      const results = data.results as { slug: string; ok: boolean }[];
      const okSlugs = new Set(results.filter((r) => r.ok).map((r) => r.slug));
      setRows((prev) => prev.filter((r) => !r.slug || !okSlugs.has(r.slug)));
      setSelected(new Set());
      setMessage(`${okSlugs.size}개 삭제 완료. Vercel 재배포까지 1~2분 걸립니다.`);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <p className="text-sm text-[var(--text-muted)] mb-3">
        서치콘솔 &quot;페이지 색인 생성&quot; 리포트에서 내보낸 표(URL, 최종 크롤링 — 탭으로
        구분된 두 열)를 그대로 복사해서 아래에 붙여넣으세요. 아직 리다이렉트가 반영 안 된 낡은
        데이터일 수 있으니, 최근에 다시 내보낸 표로 확인하는 걸 권장합니다.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        placeholder={"https://mail100hanwon.co.kr/columns/...\t2026-06-27"}
        className="w-full rounded-lg border border-[var(--border)] p-3 text-xs font-mono mb-3"
      />
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleParse}
          className="rounded-lg border border-[var(--border)] px-4 py-1.5 text-sm font-semibold"
        >
          분석하기
        </button>
        <button
          onClick={handleDelete}
          disabled={selected.size === 0 || deleting}
          className="rounded-lg bg-red-600 text-white text-sm font-bold px-4 py-1.5 disabled:opacity-40"
        >
          {deleting ? "삭제 중..." : `선택 삭제 (${selected.size})`}
        </button>
      </div>

      {message && <p className="text-sm mb-4 text-[var(--text-muted)]">{message}</p>}

      {rows.length > 0 && (
        <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[var(--surface-muted)]">
              <tr>
                <th className="p-2 w-8"></th>
                <th className="p-2 text-left">URL</th>
                <th className="p-2 text-left whitespace-nowrap">최종 크롤링</th>
                <th className="p-2 text-left whitespace-nowrap">경과일</th>
                <th className="p-2 text-left whitespace-nowrap">매칭</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const matched = r.slug ? columnSlugs.has(r.slug) : false;
                return (
                  <tr key={r.url} className="border-t border-[var(--border)]">
                    <td className="p-2">
                      {matched && (
                        <input
                          type="checkbox"
                          checked={selected.has(r.slug!)}
                          onChange={() => toggle(r.slug!)}
                        />
                      )}
                    </td>
                    <td className="p-2 break-all max-w-md">{r.url}</td>
                    <td className="p-2 whitespace-nowrap">{r.lastCrawled || "-"}</td>
                    <td className="p-2 whitespace-nowrap">
                      {r.daysSince != null ? `${r.daysSince}일 전` : "-"}
                    </td>
                    <td className="p-2 whitespace-nowrap">
                      {r.slug ? (matched ? "칼럼 O" : "칼럼 아님") : "URL 인식 불가"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
