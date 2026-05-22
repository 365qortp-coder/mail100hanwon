import type { Metadata } from "next";
import Script from "next/script";

import { buildMetadata } from "@/lib/seo";
import { faqSchema, jsonLdScript } from "@/lib/schema";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { faqs } from "@/data/faq";

export const metadata: Metadata = buildMetadata({
  title: "자주 묻는 질문",
  description:
    "매일백세한의원에 자주 묻는 질문 모음. 비대면 진료 방법, 매일감비환 다이어트 한약, 공진단, 총명공진단, 위치·예약 안내까지 한눈에 확인하세요.",
  path: "/faq",
  keywords: [
    "매일백세한의원 FAQ",
    "비대면 진료 방법",
    "감비환 자주 묻는 질문",
    "공진단 질문",
    "총명공진단 질문",
  ],
});

export default function FAQPage() {
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[{ name: "자주 묻는 질문", href: "/faq" }]} />
      </div>

      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdScript(
          faqSchema(faqs.map((f) => ({ q: f.q, a: f.a })))
        )}
      />

      <Section bg="white">
        <SectionTitle
          eyebrow="FAQ"
          title="자주 묻는 질문"
          subtitle="비대면 진료, 매일감비환, 공진단, 총명공진단 관련 자주 묻는 질문을 모았습니다."
        />

        <div className="space-y-10">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="text-xl font-bold mb-4 text-[var(--brand-primary-dark)]">
                {cat}
              </h2>
              <div className="space-y-3">
                {faqs
                  .filter((f) => f.category === cat)
                  .map((f, i) => (
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
            </div>
          ))}
        </div>

        <div className="mt-12">
          <CTAButtons />
        </div>
      </Section>
    </>
  );
}
