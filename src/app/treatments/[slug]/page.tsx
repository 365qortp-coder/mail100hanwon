import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import {
  treatmentSchema,
  faqSchema,
  jsonLdScript,
} from "@/lib/schema";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { treatments, getTreatment } from "@/data/treatments";
import { pricing, formatPrice } from "@/data/pricing";
import { clinic } from "@/data/clinic";

function formUrlFor(category: string) {
  if (category === "gongjindan" || category === "chongmyeong") {
    return clinic.contact.onlineFormGongjindan;
  }
  return clinic.contact.onlineForm;
}

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return {};

  const title = `${t.name} | 매일백세한의원 송원석 원장`;
  const description = `${t.summary} 전화 02-2234-0102, 비대면 진료 가능.`;

  return buildMetadata({
    title,
    description,
    path: `/treatments/${t.slug}`,
    keywords: t.keywords,
  });
}

export default async function TreatmentPage({ params }: { params: Params }) {
  const { slug } = await params;
  const t = getTreatment(slug);
  if (!t) return notFound();

  const showPricing = t.category === "diet";

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb
          items={[
            { name: "진료 안내", href: "/treatments/diet" },
            { name: t.name, href: `/treatments/${t.slug}` },
          ]}
        />
      </div>

      <Script
        id={`schema-treatment-${t.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(treatmentSchema(t))}
      />
      <Script
        id={`schema-faq-${t.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(faqSchema(t.faq))}
      />

      {/* HERO */}
      <section className="bg-gradient-to-br from-[var(--brand-primary-light)] to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <p className="text-xs font-semibold tracking-widest text-[var(--brand-primary)] uppercase mb-2">
            {t.category === "diet" && "다이어트 한약"}
            {t.category === "gongjindan" && "공진단 / 보약"}
            {t.category === "chongmyeong" && "수험생 · 시험"}
            {t.category === "pain" && "통증 치료"}
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{t.name}</h1>
          <p className="mt-5 text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            {t.intro}
          </p>
          <div className="mt-8 max-w-2xl">
            <CTAButtons formUrl={formUrlFor(t.category)} />
          </div>
        </div>
      </section>

      {/* 핵심 요약 */}
      <Section bg="white">
        <KeyFactsBox
          title={`${t.shortName} 핵심 안내`}
          facts={[
            { label: "처방 기관", value: clinic.name },
            { label: "주요 키워드", value: t.keywords.slice(0, 5).join(" · ") },
            {
              label: "진료 방식",
              value:
                t.category === "pain"
                  ? "내원 진료 중심 (침·약침·뜸)"
                  : "대면 + 비대면 진료 가능 (전국 처방)",
            },
            { label: "상담 전화", value: clinic.contact.phone },
          ]}
        />

        {/* 특징 */}
        <h2 className="text-2xl font-bold mt-12 mb-5">{t.shortName}의 특징</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {t.features.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]"
            >
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 절차 */}
        <h2 className="text-2xl font-bold mt-12 mb-5">진료 절차</h2>
        <ol className="space-y-3">
          {t.process.map((step, i) => (
            <li key={i} className="flex gap-4 p-4 bg-white rounded-lg border border-[var(--border)]">
              <span className="text-lg font-bold text-[var(--brand-primary)] w-8 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[var(--foreground)]">{step}</span>
            </li>
          ))}
        </ol>

        {/* 비용 */}
        {showPricing && (
          <>
            <h2 className="text-2xl font-bold mt-12 mb-5">비용 안내</h2>
            <div className="space-y-6">
              {pricing.map((group) => (
                <div key={group.label}>
                  <h3 className="font-bold mb-3">{group.label}</h3>
                  <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--surface-muted)]">
                        <tr>
                          <th className="text-left p-3 font-semibold">처방 구성</th>
                          <th className="text-right p-3 font-semibold">비용</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.packages.map((pkg) => (
                          <tr key={pkg.name} className="border-t border-[var(--border)]">
                            <td className="p-3">{pkg.name}</td>
                            <td className="p-3 text-right font-bold text-[var(--brand-primary-dark)]">
                              {formatPrice(pkg.price)}{pkg.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {group.note && (
                    <p className="mt-2 text-xs text-[var(--text-muted)]">※ {group.note}</p>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--text-muted)]">
              ※ 본 비용은 표시 시점 기준이며 변경될 수 있습니다. 자세한 처방은 상담 시 안내드립니다.
            </p>
          </>
        )}

        {/* FAQ */}
        <h2 className="text-2xl font-bold mt-12 mb-5">자주 묻는 질문</h2>
        <div className="space-y-3">
          {t.faq.map((f, i) => (
            <details
              key={i}
              className="group rounded-lg border border-[var(--border)] bg-white p-4 hover:border-[var(--brand-primary)] transition"
            >
              <summary className="cursor-pointer font-semibold flex items-start gap-2">
                <span className="text-[var(--brand-primary)]">Q.</span>
                <span className="flex-1">{f.q}</span>
              </summary>
              <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed pl-6">
                {f.a}
              </p>
            </details>
          ))}
        </div>

        {/* 다른 진료 */}
        <h2 className="text-2xl font-bold mt-12 mb-5">다른 진료 보기</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {treatments
            .filter((other) => other.slug !== t.slug)
            .map((other) => (
              <Link
                key={other.slug}
                href={`/treatments/${other.slug}`}
                className="block p-4 rounded-lg bg-white border border-[var(--border)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] transition"
              >
                <p className="font-semibold">{other.name}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">자세히 보기 →</p>
              </Link>
            ))}
        </div>

        <div className="mt-12">
          <CTAButtons formUrl={formUrlFor(t.category)} />
        </div>
      </Section>
    </>
  );
}
