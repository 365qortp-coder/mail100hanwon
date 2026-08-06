import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Section } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { articleSchema, jsonLdScript } from "@/lib/schema";
import { clinic } from "@/data/clinic";
import { type Column, getColumnImage, getColumnUrl } from "@/lib/columns";

type SectionInfo = {
  label: string;
  href: string;
  listHref: string;
  listLabel: string;
  ctaLabel: string;
  formUrl?: string;
};

type Props = {
  col: Column;
  related: Column["slug"] extends string ? import("@/lib/columns").ColumnMeta[] : never;
  section: SectionInfo;
};

export function ColumnDetailPage({ col, related, section }: Props) {
  const img = getColumnImage(col);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4">
        <Breadcrumb
          items={[
            { name: section.label, href: section.href },
            { name: section.listLabel, href: section.listHref },
            { name: col.title, href: getColumnUrl(col) },
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
            canonicalPath: getColumnUrl(col),
          })
        )}
      />

      <article className="mx-auto max-w-3xl px-5 md:px-8 py-10 md:py-14">
        <header className="mb-10 pb-7 border-b border-black/[0.07]">
          <div className="flex items-center gap-2 text-xs text-[#888] mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F5] text-[#525252] font-bold">
              {col.category}
            </span>
            <time dateTime={col.date}>{col.date}</time>
          </div>
          <h1 className="font-serif text-3xl md:text-[2.6rem] tracking-[-0.025em] leading-[1.25] text-[#0a0a0a] mb-4">
            {col.title}
          </h1>
          <p className="text-lg text-[#525252] leading-[1.8]">{col.description}</p>
          <p className="mt-5 text-sm text-[#888]">
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
            prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-[-0.02em] prose-headings:text-[#0a0a0a]
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-a:text-[var(--brand-primary)] prose-a:underline
            prose-strong:text-[var(--foreground)]
            prose-ul:my-4 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: col.contentHtml }}
        />

        {col.source?.url && !col.source?.videoId && (
          <div className="mt-8 p-5 rounded-[18px] bg-[#FAFAFA] border border-black/[0.07] text-sm">
            <p className="font-semibold mb-1">원본 영상</p>
            <a href={col.source.url} target="_blank" rel="noopener noreferrer"
              className="text-[var(--brand-primary)] underline break-all">
              {col.source.url}
            </a>
          </div>
        )}

        {col.imageCredit && (
          <p className="mt-4 text-xs text-[var(--text-muted)]">{col.imageCredit}</p>
        )}

        {/* 서비스 페이지 역링크 */}
        <div className="mt-10 p-6 rounded-[20px] bg-[#FAFAFA] border border-black/[0.07] flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8A87] mb-1.5">관련 서비스</p>
            <p className="font-bold text-[#0a0a0a]">{section.ctaLabel}</p>
          </div>
          <Link
            href={section.href}
            className="rn-btn-primary shrink-0 px-5 py-2.5 rounded-full bg-[var(--brand-primary)] text-white text-sm font-bold"
          >
            자세히 보기 →
          </Link>
        </div>

        <div className="mt-6 p-6 md:p-7 rounded-[20px] bg-[#F8F6F2] border border-black/[0.07]">
          <h3 className="font-serif text-xl tracking-[-0.02em] text-[#0a0a0a] mb-3">상담·예약 안내</h3>
          <p className="text-sm text-[#525252] mb-5 leading-[1.8]">
            본 칼럼은 일반적인 한방 건강 정보를 담고 있으며, 개인 체질에 따라
            적합한 처방이 달라질 수 있습니다. 자세한 상담은 전화·카카오톡 또는
            비대면 진료 신청을 이용해 주세요.
          </p>
          <CTAButtons compact formUrl={section.formUrl} />
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h3 className="font-serif text-2xl tracking-[-0.025em] text-[#0a0a0a] mb-5">관련 칼럼</h3>
            <ul className="space-y-2.5">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={getColumnUrl(r)}
                    className="block p-4 rounded-2xl bg-white border border-black/[0.07] hover:border-black/20 transition-colors duration-300"
                  >
                    <p className="font-semibold text-[#0a0a0a]">{r.title}</p>
                    <p className="text-xs text-[#888] mt-1.5">{r.date}</p>
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
