import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import { buildMetadata } from "@/lib/seo";
import { articleSchema, jsonLdScript } from "@/lib/schema";
import { Section } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { clinic } from "@/data/clinic";
import { getColumn, getColumnsBySection, getAllColumns, getColumnUrl, getColumnSection, getColumnImage } from "@/lib/columns";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  // "columns" 섹션(기타 건강)만 정적 생성 — diet/gongjindan/nmc는 동적으로 처리 후 301
  return getColumnsBySection("columns").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col) return {};

  return buildMetadata({
    title: col.title,
    description: col.description,
    path: `/columns/${col.slug}`,
    keywords: col.keywords,
    ogImage: col.image,
  });
}

export default async function ColumnDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const col = await getColumn(slug);
  if (!col) return notFound();

  // 카테고리별 전용 라우트로 301 영구 이전 (Korean URL → percent-encoded for HTTP header)
  const correctUrl = getColumnUrl(col);
  if (correctUrl !== `/columns/${col.slug}`) {
    permanentRedirect(encodeURI(correctUrl));
  }

  const img = getColumnImage(col);

  const related = getAllColumns()
    .filter((c) => c.slug !== col.slug && c.category === col.category)
    .slice(0, 3);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumb
          items={[
            { name: "건강 칼럼", href: "/columns" },
            { name: col.title, href: `/columns/${col.slug}` },
          ]}
        />
      </div>

      <Script
        id={`article-schema-${col.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          articleSchema({
            title: col.title,
            description: col.description,
            slug: col.slug,
            date: col.date,
            modified: col.modified,
            image: img,
            canonicalPath: `/columns/${col.slug}`,
          })
        )}
      />

      <article className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-8 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
            <span className="px-2 py-0.5 rounded bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)] font-semibold">
              {col.category}
            </span>
            <time dateTime={col.date}>{col.date}</time>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
            {col.title}
          </h1>
          <p className="text-lg text-[var(--text-muted)] leading-relaxed">
            {col.description}
          </p>
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            작성: {clinic.director.name} {clinic.director.title} · {clinic.name}
          </p>
        </header>

        {col.source?.videoId && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${col.source.videoId}`}
              title={col.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}

        {!col.source?.videoId && img && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 bg-[var(--border)]">
            <Image
              src={img}
              alt={col.imageAlt ?? col.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              unoptimized
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none text-[var(--foreground)] leading-relaxed
            prose-headings:font-bold prose-headings:text-[var(--foreground)]
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-a:text-[var(--brand-primary)] prose-a:underline
            prose-strong:text-[var(--foreground)]
            prose-ul:my-4 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: col.contentHtml }}
        />

        {col.source?.url && !col.source?.videoId && (
          <div className="mt-8 p-4 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-sm">
            <p className="font-semibold mb-1">원본 영상</p>
            <a
              href={col.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--brand-primary)] underline break-all"
            >
              {col.source.url}
            </a>
          </div>
        )}

        {col.imageCredit && (
          <p className="mt-4 text-xs text-[var(--text-muted)]">{col.imageCredit}</p>
        )}

        <div className="mt-10 p-6 rounded-xl bg-[var(--brand-primary-light)] border border-[var(--border)]">
          <h3 className="text-lg font-bold mb-3">상담·예약 안내</h3>
          <p className="text-sm mb-4 leading-relaxed">
            본 칼럼은 일반적인 한방 건강 정보를 담고 있으며, 개인 체질에 따라
            적합한 처방이 달라질 수 있습니다. 자세한 상담은 전화·카카오톡 또는
            비대면 진료 신청을 이용해 주세요.
          </p>
          <CTAButtons compact />
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-bold mb-4">관련 칼럼</h3>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/columns/${r.slug}`}
                    className="block p-3 rounded-md hover:bg-[var(--surface-muted)] transition"
                  >
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{r.date}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  );
}
