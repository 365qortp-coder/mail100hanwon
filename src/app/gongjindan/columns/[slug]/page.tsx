import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getColumn, getColumnsBySection, getColumnImage, getColumnSection } from "@/lib/columns";
import { ColumnDetailPage } from "@/components/ColumnDetailPage";
import { clinic } from "@/data/clinic";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getColumnsBySection("gongjindan").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col || getColumnSection(col.category) !== "gongjindan") return {};
  return buildMetadata({
    title: col.title,
    description: col.description,
    path: `/gongjindan/columns/${col.slug}`,
    keywords: col.keywords,
    ogImage: getColumnImage(col),
  });
}

export default async function GongjindanColumnDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col || getColumnSection(col.category) !== "gongjindan") return notFound();

  const related = getColumnsBySection("gongjindan")
    .filter((c) => c.slug !== col.slug)
    .slice(0, 3);

  return (
    <ColumnDetailPage
      col={col}
      related={related}
      section={{
        label: "공진단",
        href: "/gongjindan",
        listHref: "/gongjindan/columns",
        listLabel: "공진단 칼럼",
        ctaLabel: "공진단 처방 안내",
        formUrl: clinic.contact.onlineFormGongjindan,
      }}
    />
  );
}
