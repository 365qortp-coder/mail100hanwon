import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "수능 총명공진단 안내",
  description:
    "수능을 앞둔 수험생을 위한 매일백세한의원의 총명공진단. 정통 처방에 기억력·집중력 관리를 더한 매일백세한의원 특화 처방입니다. 비대면 진료로 전국 어디서나 가능합니다.",
  path: "/event/suneung",
  keywords: [
    "수능 공진단",
    "수능 총명공진단",
    "수험생 공진단",
    "고3 공진단",
    "수능 한약",
    "수능 보약",
  ],
});

export default function SuneungPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb
          items={[
            { name: "수능 총명공진단", href: "/event/suneung" },
          ]}
        />
      </div>

      <section className="bg-gradient-to-br from-[var(--brand-accent-light)] to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-20">
          <p className="text-xs font-semibold tracking-widest text-[var(--brand-accent)] uppercase mb-2">
            수능 시즌 한정 안내
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            수능 수험생을 위한
            <br />
            <span className="text-[var(--brand-primary)]">총명공진단</span>
          </h1>
          <p className="mt-5 text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            장시간 공부에 필요한 체력 관리, 기억력·집중력 보강을 함께 고려한
            매일백세한의원의 총명공진단. 수능 3~6개월 전부터 시작하시는 분이
            많습니다. 비대면 진료로 전국 어디서나 처방받으실 수 있습니다.
          </p>
          <div className="mt-8 max-w-2xl">
            <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} />
          </div>
        </div>
      </section>

      <Section bg="white">
        <KeyFactsBox
          title="수능 총명공진단 핵심"
          facts={[
            { label: "대상", value: "수능 수험생 (고1~고3)" },
            { label: "복용 시작 시기", value: "수능 3~6개월 전 권장" },
            { label: "단기 복용", value: "수능 직전 단기 집중 처방도 가능" },
            { label: "진료 방식", value: "대면 + 비대면 (전국 택배)" },
            { label: "보호자 동반", value: "고등학생 미만은 보호자와 함께 상담 권장" },
          ]}
        />

        <SectionTitle
          eyebrow="총명공진단이란"
          title="기억력·집중력·체력을 함께 챙기는 처방"
          subtitle="총명공진단(聰明供辰丹)은 전통 공진단 처방에 기억력·집중력 관리에 좋다고 알려진 한약재를 더한 매일백세한의원의 특화 처방입니다."
        />

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            { title: "정통 한약재", desc: "사향·녹용 등 공진단 정통 처방을 그대로 따릅니다." },
            { title: "수험생 특화", desc: "장시간 공부에 필요한 체력 보강과 기억력·집중력 한약재를 함께 처방합니다." },
            { title: "체질별 조정", desc: "원장님 상담을 통해 체질·학습량·증상에 맞춰 조정됩니다." },
          ].map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]"
            >
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{f.desc}</p>
            </div>
          ))}
        </div>

        <SectionTitle
          eyebrow="복용 일정"
          title="언제부터 시작하면 좋은가요?"
        />
        <div className="space-y-4">
          {[
            { period: "수능 6개월 전", desc: "체력·기억력 장기 관리 시작. 가장 권장되는 시기입니다." },
            { period: "수능 3개월 전", desc: "표준적인 복용 시작 시기입니다." },
            { period: "수능 1~2개월 전", desc: "단기 집중 복용도 가능합니다." },
            { period: "수능 2주 전", desc: "최종 컨디션 조절용 단기 처방 가능." },
          ].map((item) => (
            <div
              key={item.period}
              className="flex flex-col md:flex-row gap-3 p-4 rounded-lg bg-white border border-[var(--border)]"
            >
              <p className="font-bold text-[var(--brand-primary)] md:w-40 shrink-0">
                {item.period}
              </p>
              <p className="text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} />
        </div>
      </Section>
    </>
  );
}
