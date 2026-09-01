import Link from "next/link";
import { getAllColumnsIncludingDrafts } from "@/lib/columns";
import { getQueueStats, getUpcoming } from "@/lib/contentQueue";
import { ColumnsWorkspace } from "@/components/admin/ColumnsWorkspace";

export const dynamic = "force-dynamic";

export default function AdminColumnsPage() {
  const columns = getAllColumnsIncludingDrafts();
  const queueStats = getQueueStats();
  const upcoming = getUpcoming(6);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">칼럼 관리</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            글 {columns.length}편 · 발행{" "}
            {columns.filter((c) => c.status === "published").length}편 · 초안{" "}
            {columns.filter((c) => c.status !== "published").length}편
          </p>
        </div>
        <Link
          href="/admin/columns/new"
          className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-bold text-white"
        >
          + 새 글 쓰기
        </Link>
      </div>

      <ColumnsWorkspace columns={columns} queueStats={queueStats} upcoming={upcoming} />
    </div>
  );
}
