import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getAllColumns } from "@/lib/columns";

export const metadata: Metadata = buildMetadata({
  title: "건강 칼럼",
  description:
    "매일백세한의원이 발행하는 건강 칼럼. 매일감비환 다이어트 한약, 공진단, 총명공진단, 한방 건강 정보를 매일 업데이트합니다.",
  path: "/columns",
  keywords: [
    "매일백세한의원 칼럼",
    "다이어트 한약 정보",
    "공진단 정보",
    "한방 건강 칼럼",
  ],
});

export default function ColumnsListPage() {
  const columns = getAllColumns();
  const categories = Array.from(new Set(columns.map((c) => c.category)));

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

        {columns.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-muted)]">
            <p className="text-lg mb-2">칼럼이 곧 게시됩니다.</p>
            <p className="text-sm">유튜브 영상을 기반으로 한 한방 건강 정보가 매일 업데이트됩니다.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-xs rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)] font-semibold"
                >
                  #{cat}
                </span>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              {columns.map((c) => (
                <Link
                  key={c.slug}
                  href={`/columns/${c.slug}`}
                  className="block bg-[var(--surface-muted)] rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow transition overflow-hidden"
                >
                  {c.image && (
                    <div className="relative aspect-video w-full bg-[var(--border)]">
                      <Image
                        src={c.image}
                        alt={c.imageAlt ?? c.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-2">
                      <span className="px-2 py-0.5 rounded bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)] font-semibold">
                        {c.category}
                      </span>
                      <time dateTime={c.date}>{c.date}</time>
                    </div>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{c.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                      {c.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Section>
    </>
  );
}
