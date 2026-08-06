import Image from "next/image";
import Link from "next/link";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { type ColumnMeta, getColumnImage, getColumnUrl } from "@/lib/columns";

type Props = {
  columns: ColumnMeta[];
  section: {
    label: string;
    href: string;
    listHref: string;
    eyebrow: string;
    title: string;
    subtitle: string;
  };
};

export function ColumnListPage({ columns, section }: Props) {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb
          items={[
            { name: section.label, href: section.href },
            { name: "칼럼", href: section.listHref },
          ]}
        />
      </div>

      <Section bg="white">
        <SectionTitle
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
        />

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
