import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getColumnsBySection } from "@/lib/columns";
import { ColumnListPage } from "@/components/ColumnListPage";

export const metadata: Metadata = buildMetadata({
  title: "공진단 칼럼 | 사향·녹용·총명공진단 정보",
  description:
    "매일백세한의원 송원석 원장이 직접 쓰는 공진단 칼럼. 사향공진단·녹용공진단·총명공진단의 효능·성분·가격·복용법을 정리합니다.",
  path: "/gongjindan/columns",
  keywords: ["공진단 칼럼", "사향공진단", "총명공진단", "녹용공진단", "공진단 효능"],
});

export default function GongjindanColumnsPage() {
  const columns = getColumnsBySection("gongjindan");
  return (
    <ColumnListPage
      columns={columns}
      section={{
        label: "공진단",
        href: "/gongjindan",
        listHref: "/gongjindan/columns",
        eyebrow: "공진단 칼럼",
        title: "사향·녹용·총명공진단 근거 정보",
        subtitle: "원장 직접 제조 공진단에 대한 성분·효능·복용법을 정리합니다.",
      }}
    />
  );
}
