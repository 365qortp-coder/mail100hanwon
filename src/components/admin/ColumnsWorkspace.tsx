"use client";

import { useState } from "react";
import type { ColumnMeta } from "@/lib/columns";
import type { QueueStats, UpcomingItem } from "@/lib/contentQueue";
import { ColumnsTab } from "./ColumnsTab";
import { QueueTab } from "./QueueTab";
import { IndexingTab } from "./IndexingTab";

/**
 * 칼럼 관리 안의 세 화면을 탭으로 묶습니다.
 * 목록 / 발행 큐 / 색인 현황 — 뒤의 둘은 이 사이트에만 있던 기능으로,
 * 표준 6개 메뉴 구조를 지키면서 잃지 않도록 칼럼 관리 안에 넣었습니다.
 */
const TABS = [
  { id: "list", label: "글 목록" },
  { id: "queue", label: "발행 큐" },
  { id: "indexing", label: "색인 현황" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ColumnsWorkspace({
  columns,
  queueStats,
  upcoming,
}: {
  columns: ColumnMeta[];
  queueStats: QueueStats;
  upcoming: UpcomingItem[];
}) {
  const [tab, setTab] = useState<TabId>("list");

  return (
    <div>
      <div className="mb-6 flex gap-2 border-b border-[var(--border)]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "border-[var(--brand-primary)] text-[var(--brand-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "list" && <ColumnsTab columns={columns} />}
      {tab === "queue" && <QueueTab stats={queueStats} upcoming={upcoming} />}
      {tab === "indexing" && <IndexingTab columns={columns} />}
    </div>
  );
}
