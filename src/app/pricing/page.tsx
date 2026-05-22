import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { pricing, formatPrice } from "@/data/pricing";

export const metadata: Metadata = buildMetadata({
  title: "비용 안내",
  description: `매일백세한의원의 매일감비환 다이어트 한약 비용을 안내합니다. 1개월 110,000원부터 장기 처방까지 다양한 패키지를 제공합니다. 자세한 처방은 상담 시 안내드립니다.`,
  path: "/pricing",
  keywords: ["매일감비환 가격", "다이어트 한약 가격", "한약 비용", "공진단 가격"],
});

export default function PricingPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[{ name: "비용 안내", href: "/pricing" }]} />
      </div>

      <Section bg="white">
        <SectionTitle
          eyebrow="비용 안내"
          title="매일감비환 다이어트 한약 비용"
          subtitle="아래 비용은 매일감비환(다이어트 한약) 기준 일반 처방 비용이며, 자세한 처방은 체질·증상 상담 후 결정됩니다."
        />

        <div className="space-y-8">
          {pricing.map((group) => (
            <div key={group.label}>
              <h3 className="text-xl font-bold mb-4">{group.label}</h3>
              <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--surface-muted)]">
                    <tr>
                      <th className="text-left p-4 font-semibold">처방 구성</th>
                      <th className="text-right p-4 font-semibold">비용</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.packages.map((pkg) => (
                      <tr key={pkg.name} className="border-t border-[var(--border)] hover:bg-[var(--brand-primary-light)]/40 transition">
                        <td className="p-4">{pkg.name}</td>
                        <td className="p-4 text-right font-bold text-[var(--brand-primary-dark)]">
                          {formatPrice(pkg.price)}{pkg.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {group.note && (
                <p className="mt-3 text-xs text-[var(--text-muted)]">※ {group.note}</p>
              )}
            </div>
          ))}

          <div className="p-6 rounded-xl bg-[var(--brand-primary-light)] border border-[var(--border)]">
            <h3 className="font-bold mb-2">공진단 / 총명공진단 비용</h3>
            <p className="text-sm">
              공진단·총명공진단은 한약재 구성과 처방량에 따라 비용이 달라지므로,
              상담 시 자세히 안내드립니다. 전화(
              <a href="tel:0222340102" className="underline font-semibold">
                02-2234-0102
              </a>
              ) 또는 카카오톡으로 문의해주세요.
            </p>
          </div>

          <div className="text-xs text-[var(--text-muted)] leading-relaxed">
            <p>
              ※ 본 비용은 표시 시점 기준이며 변경될 수 있습니다. 진료 시
              안내되는 비용을 기준으로 합니다.
            </p>
            <p>
              ※ 한약은 의료 행위에 따른 처방으로, 효과는 개인 체질에 따라 다를
              수 있습니다.
            </p>
          </div>

          <CTAButtons />
        </div>
      </Section>
    </>
  );
}
