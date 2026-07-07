"use client";

import { useState } from "react";
import type { ColumnMeta } from "@/lib/columns";
import { ColumnsTab } from "./ColumnsTab";
import { IndexingTab } from "./IndexingTab";
import { GeoCheckTab } from "./GeoCheckTab";

const TABS = [
  { id: "columns", label: "칼럼 관리" },
  { id: "indexing", label: "색인 현황 확인" },
  { id: "geo", label: "사이트 점수 확인" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AdminDashboard({ columns }: { columns: ColumnMeta[] }) {
  const [tab, setTab] = useState<TabId>("columns");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">관리자</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--text-muted)] hover:underline"
        >
          로그아웃
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "columns" && <ColumnsTab columns={columns} />}
      {tab === "indexing" && <IndexingTab columns={columns} />}
      {tab === "geo" && <GeoCheckTab />}
    </div>
  );
}
