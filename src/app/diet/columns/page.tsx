import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getColumnsBySection } from "@/lib/columns";
import { ColumnListPage } from "@/components/ColumnListPage";

export const metadata: Metadata = buildMetadata({
  title: "다이어트 칼럼 | 감비환·기초대사량·갱년기 다이어트 정보",
  description:
    "매일백세한의원 송원석 원장이 직접 쓰는 다이어트 한방 칼럼. 감비환 효능·부작용·복용법, 갱년기 다이어트, 기초대사량 회복 정보를 정리합니다.",
  path: "/diet/columns",
  keywords: ["감비환 칼럼", "다이어트 한약 정보", "갱년기 다이어트", "기초대사량", "감비환 부작용"],
});

export default function DietColumnsPage() {
  const columns = getColumnsBySection("diet");
  return (
    <ColumnListPage
      columns={columns}
      section={{
        label: "매일감비환",
        href: "/diet",
        listHref: "/diet/columns",
        eyebrow: "다이어트 칼럼",
        title: "감비환·갱년기·기초대사량 정보",
        subtitle: "송원석 원장이 직접 정리하는 한방 다이어트 근거 정보입니다.",
      }}
    />
  );
}
