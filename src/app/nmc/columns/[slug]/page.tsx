import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getColumn, getColumnsBySection, getColumnImage, getColumnSection } from "@/lib/columns";
import { ColumnDetailPage } from "@/components/ColumnDetailPage";
import { clinic } from "@/data/clinic";

type Params = Promise<{ slug: string }>;

// 목록에 없는 주소는 곧바로 404를 낸다.
// 이게 없으면 Next가 동적 렌더링을 시도하는데, 한글 경로에서
// x-next-cache-tags 헤더 문제로 500이 나 버린다.
export const dynamicParams = false;

export function generateStaticParams() {
  return getColumnsBySection("nmc").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col || getColumnSection(col.category) !== "nmc") return {};
  return buildMetadata({
    title: col.title,
    description: col.description,
    path: `/nmc/columns/${col.slug}`,
    keywords: col.keywords,
    ogImage: getColumnImage(col),
  });
}

export default async function NmcColumnDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col || getColumnSection(col.category) !== "nmc") return notFound();

  const related = getColumnsBySection("nmc")
    .filter((c) => c.slug !== col.slug)
    .slice(0, 3);

  return (
    <ColumnDetailPage
      col={col}
      related={related}
      section={{
        label: "NMC 무릎 치료",
        href: "/nmc",
        listHref: "/nmc/columns",
        listLabel: "무릎 치료 칼럼",
        ctaLabel: "NMC 무릎 치료 안내",
        formUrl: clinic.contact.onlineForm,
      }}
    />
  );
}
