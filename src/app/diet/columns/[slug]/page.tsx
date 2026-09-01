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
  return getColumnsBySection("diet").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col || getColumnSection(col.category) !== "diet") return {};
  return buildMetadata({
    title: col.title,
    description: col.description,
    path: `/diet/columns/${col.slug}`,
    keywords: col.keywords,
    ogImage: getColumnImage(col),
  });
}

export default async function DietColumnDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col || getColumnSection(col.category) !== "diet") return notFound();

  const related = getColumnsBySection("diet")
    .filter((c) => c.slug !== col.slug)
    .slice(0, 3);

  return (
    <ColumnDetailPage
      col={col}
      related={related}
      section={{
        label: "매일감비환",
        href: "/diet",
        listHref: "/diet/columns",
        listLabel: "다이어트 칼럼",
        ctaLabel: "매일감비환 다이어트 처방 안내",
        formUrl: clinic.contact.onlineFormDiet,
      }}
    />
  );
}
