import { ColumnForm } from "@/components/admin/ColumnForm";
import { getAllColumnsIncludingDrafts, CATEGORY_SECTION } from "@/lib/columns";

export const dynamic = "force-dynamic";

export default function NewColumnPage() {
  // 미리 정해 둔 카테고리 + 실제 글에 쓰인 카테고리를 합쳐서 보여줍니다.
  const used = new Set(getAllColumnsIncludingDrafts().map((c) => c.category));
  const categories = [...new Set([...Object.keys(CATEGORY_SECTION), ...used])];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">새 칼럼 쓰기</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          저장하면 글 파일이 만들어지고, 1~2분 뒤 사이트에 반영됩니다.
        </p>
      </div>
      <ColumnForm categories={categories} />
    </div>
  );
}
