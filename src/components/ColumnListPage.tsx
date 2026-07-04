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
                  className="block bg-[var(--surface-muted)] rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow transition overflow-hidden"
                >
                  {img && (
                    <div className="relative aspect-video w-full bg-[var(--border)]">
                      <Image
                        src={img}
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
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">{c.description}</p>
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
