import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getAllColumns, getColumnUrl, getColumnImage } from "@/lib/columns";

export const metadata: Metadata = buildMetadata({
  title: "건강 칼럼 전체",
  description:
    "매일백세한의원이 발행하는 건강 칼럼 전체 목록. 다이어트·공진단·무릎 치료·한방 건강 정보를 매일 업데이트합니다.",
  path: "/columns",
  keywords: ["매일백세한의원 칼럼", "다이어트 한약 정보", "공진단 정보", "한방 건강 칼럼"],
});

const SECTION_LINKS = [
  { label: "다이어트 칼럼", href: "/diet/columns" },
  { label: "공진단 칼럼", href: "/gongjindan/columns" },
  { label: "무릎 치료 칼럼", href: "/nmc/columns" },
];

export default function ColumnsListPage() {
  const columns = getAllColumns();

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[{ name: "건강 칼럼", href: "/columns" }]} />
      </div>

      <Section bg="white">
        <SectionTitle
          eyebrow="건강 칼럼"
          title="매일백세한의원의 한방 건강 정보"
          subtitle="송원석 원장이 직접 운영하는 유튜브 채널 영상을 글로 정리한 콘텐츠를 매일 업데이트합니다."
        />

        <div className="flex flex-wrap gap-3 mb-10">
          {SECTION_LINKS.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="px-5 py-2 text-sm rounded-full border border-black/[0.14] text-[#0a0a0a] font-semibold hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors duration-300"
            >
              {s.label}
            </Link>
          ))}
        </div>

        {columns.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p className="text-lg mb-2">칼럼이 곧 게시됩니다.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {columns.map((c) => {
              const img = getColumnImage(c);
              return (
                <Link
                  key={c.slug}
                  href={getColumnUrl(c)}
                  className="rn-card group block bg-white rounded-[20px] border border-black/[0.07] hover:border-black/20 overflow-hidden"
                >
                  {img && (
                    <div className="relative aspect-video w-full overflow-hidden bg-[#EBE7DF]">
                      <Image
                        src={img}
                        alt={c.imageAlt ?? c.title}
                        fill
                        className="rn-zoom object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-[#888] mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F5] text-[#525252] font-bold">
                        {c.category}
                      </span>
                      <time dateTime={c.date}>{c.date}</time>
                    </div>
                    <h3 className="text-[17px] font-bold leading-snug mb-2 line-clamp-2 text-[#0a0a0a] group-hover:text-[var(--brand-primary)] transition-colors duration-200">
                      {c.title}
                    </h3>
                    <p className="text-sm text-[#525252] leading-[1.7] line-clamp-2">{c.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>
    </>
  );
}
