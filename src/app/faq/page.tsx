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

        <div className="space-y-12">
          {categories.map((cat) => (
            <div key={cat}>
              <h2 className="font-serif text-2xl tracking-[-0.025em] text-[#0a0a0a] mb-5">
                {cat}
              </h2>
              <div className="space-y-3">
                {faqs
                  .filter((f) => f.category === cat)
                  .map((f, i) => (
                    <details
                      key={i}
                      className="group rounded-2xl border border-black/[0.07] bg-white p-5 md:p-6 hover:border-black/[0.18] transition-colors duration-300"
                    >
                      <summary className="cursor-pointer flex items-start gap-3 list-none select-none">
                        <span className="text-[#0F0D0A] font-bold shrink-0 text-sm pt-0.5">Q.</span>
                        <span className="flex-1 font-semibold text-[#0a0a0a] text-sm md:text-[15px] leading-snug">
                          {f.q}
                        </span>
                        <span
                          className="text-[#888] shrink-0 text-xs mt-1 group-open:rotate-180"
                          style={{ transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)" }}
                          aria-hidden
                        >
                          ▾
                        </span>
                      </summary>
                      <p className="mt-4 text-sm text-[#525252] leading-[1.8] pl-7">
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
