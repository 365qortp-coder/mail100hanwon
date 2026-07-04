import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getColumnsBySection } from "@/lib/columns";
import { ColumnListPage } from "@/components/ColumnListPage";

export const metadata: Metadata = buildMetadata({
  title: "무릎 치료 칼럼 | 퇴행성관절염·무릎 통증 한방 정보",
  description:
    "매일백세한의원 송원석 원장이 직접 쓰는 무릎 치료 칼럼. NMC 프로토콜, 퇴행성관절염, 무릎 통증 원인·치료법을 정리합니다.",
  path: "/nmc/columns",
  keywords: ["무릎 칼럼", "퇴행성관절염", "무릎 통증", "NMC 무릎", "무릎 한방 치료"],
});

export default function NmcColumnsPage() {
  const columns = getColumnsBySection("nmc");
  return (
    <ColumnListPage
      columns={columns}
      section={{
        label: "NMC 무릎 치료",
        href: "/nmc",
        listHref: "/nmc/columns",
        eyebrow: "무릎 치료 칼럼",
        title: "퇴행성관절염·무릎 통증 근거 정보",
        subtitle: "NMC 프로토콜 기반 무릎 치료에 대한 정보를 정리합니다.",
      }}
    />
  );
}
