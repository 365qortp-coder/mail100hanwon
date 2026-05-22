import Link from "next/link";
import Script from "next/script";
import { clinic } from "@/data/clinic";
import { breadcrumbSchema, jsonLdScript } from "@/lib/schema";

type Crumb = { name: string; href: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const schemaItems = items.map((it) => ({
    name: it.name,
    url: `${clinic.url}${it.href}`,
  }));

  return (
    <>
      <Script
        id={`breadcrumb-${items.map((i) => i.href).join("-")}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(breadcrumbSchema(schemaItems))}
      />
      <nav
        aria-label="breadcrumb"
        className="text-xs text-[var(--text-muted)] py-3"
      >
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link href="/" className="hover:text-[var(--brand-primary)]">
              홈
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              <span aria-hidden>›</span>
              {i === items.length - 1 ? (
                <span className="text-[var(--foreground)]">{item.name}</span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[var(--brand-primary)]"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
