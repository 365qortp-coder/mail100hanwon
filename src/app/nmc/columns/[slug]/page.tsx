import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getColumn, getColumnsBySection, getColumnImage, getColumnSection } from "@/lib/columns";
import { ColumnDetailPage } from "@/components/ColumnDetailPage";
import { clinic } from "@/data/clinic";

type Params = Promise<{ slug: string }>;

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
