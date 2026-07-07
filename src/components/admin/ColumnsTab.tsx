"use client";

import { useMemo, useState } from "react";
import type { ColumnMeta } from "@/lib/columns";
import { getColumnUrl } from "@/lib/columnUrl";

export function ColumnsTab({ columns: initialColumns }: { columns: ColumnMeta[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("전체");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const categories = useMemo(
    () => ["전체", ...Array.from(new Set(columns.map((c) => c.category))).sort()],
    [columns]
  );

  const filtered = columns.filter((c) => {
    if (category !== "전체" && c.category !== category) return false;
    const q = query.trim().toLowerCase();
    if (q && !c.title.toLowerCase().includes(q) && !c.slug.toLowerCase().includes(q)) return false;
    return true;
  });

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
      const results = data.results as { slug: string; ok: boolean; error?: string }[];
      const okSlugs = new Set(results.filter((r) => r.ok).map((r) => r.slug));
      const failed = results.filter((r) => !r.ok);
      setColumns((prev) => prev.filter((c) => !okSlugs.has(c.slug)));
      setSelected(new Set());
      setMessage(
        failed.length
          ? `${okSlugs.size}개 삭제 완료, ${failed.length}개 실패 (${failed.map((f) => f.slug).join(", ")})`
          : `${okSlugs.size}개 삭제 완료. Vercel 재배포까지 1~2분 걸립니다.`
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="제목·slug 검색"
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm flex-1 min-w-[200px]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={handleDelete}
          disabled={selected.size === 0 || deleting}
          className="rounded-lg bg-red-600 text-white text-sm font-bold px-4 py-1.5 disabled:opacity-40"
        >
          {deleting ? "삭제 중..." : `선택 삭제 (${selected.size})`}
        </button>
      </div>

      {message && <p className="text-sm mb-4 text-[var(--text-muted)]">{message}</p>}
      <p className="text-xs text-[var(--text-muted)] mb-2">
        {filtered.length}개 표시 중 / 전체 {columns.length}개
      </p>

      <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-muted)]">
            <tr>
              <th className="p-2 w-8"></th>
              <th className="p-2 text-left">제목</th>
              <th className="p-2 text-left whitespace-nowrap">카테고리</th>
              <th className="p-2 text-left whitespace-nowrap">날짜</th>
              <th className="p-2 text-left">URL</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.slug} className="border-t border-[var(--border)]">
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selected.has(c.slug)}
                    onChange={() => toggle(c.slug)}
                  />
                </td>
                <td className="p-2">{c.title}</td>
                <td className="p-2 whitespace-nowrap">{c.category}</td>
                <td className="p-2 whitespace-nowrap">{c.date}</td>
                <td className="p-2">
                  <a
                    href={getColumnUrl(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--brand-primary)] underline break-all"
                  >
                    {getColumnUrl(c)}
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-[var(--text-muted)]">
                  조건에 맞는 칼럼이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
