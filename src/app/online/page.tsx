import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "비대면 진료 안내",
  description: `매일백세한의원의 비대면 진료는 구글 설문지 → 원장님 전화 상담 → 한약 택배 발송 순서로 진행됩니다. 매일감비환 다이어트 한약, 공진단, 총명공진단 모두 전국 어디서나 처방받으실 수 있습니다.`,
  path: "/online",
  keywords: [
    "비대면 진료",
    "비대면 한의원",
    "비대면 한약",
    "한약 택배",
    "비대면 다이어트 한약",
    "비대면 공진단",
    "총명공진단 비대면",
  ],
});

export default function OnlinePage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[{ name: "비대면 진료", href: "/online" }]} />
      </div>

      <Section bg="white">
        <SectionTitle
          eyebrow="비대면 진료"
          title="전국 어디서나 매일백세한의원의 한약을 받아보세요"
          subtitle="구글 설문지 → 전화 상담 → 택배 발송. 다이어트 한약 매일감비환, 공진단, 총명공진단 모두 비대면 처방이 가능합니다."
        />

        <KeyFactsBox
          title="비대면 진료 핵심 안내"
          facts={[
            { label: "진료 방식", value: "구글 설문지 작성 → 원장님 전화 상담 → 한약 택배 발송" },
            { label: "가능한 진료", value: "매일감비환(다이어트), 공진단, 총명공진단" },
            { label: "대상", value: "재진 환자 우선 (안전한 처방을 위한 가이드라인 준수)" },
            { label: "배송 기간", value: "처방 후 영업일 기준 2~5일 이내 발송" },
            { label: "결제", value: "상담 시 안내" },
          ]}
        />

        <div className="grid md:grid-cols-2 gap-6 mt-12">
          <div>
            <h3 className="text-xl font-bold mb-4">진료 4단계</h3>
            <ol className="space-y-5">
              {[
                {
                  step: "01",
                  title: "전화 또는 카카오톡 문의",
                  desc: "원하시는 진료(다이어트·공진단·총명공진단)와 비대면 진료 의사를 알려주세요.",
                },
                {
                  step: "02",
                  title: "구글 설문지 작성",
                  desc: "체질·생활습관·증상·복용 중인 약 등을 작성해주세요. 자세할수록 정확한 처방이 가능합니다.",
                },
                {
                  step: "03",
                  title: "원장님 전화 상담",
                  desc: "송원석 원장님이 직접 전화로 상담드리고, 필요한 정보를 추가 확인합니다.",
                },
                {
                  step: "04",
                  title: "한약 택배 발송",
                  desc: "처방 후 한약을 제조해 영업일 기준 2~5일 이내 택배로 발송합니다.",
                },
              ].map((s) => (
                <li key={s.step} className="flex gap-4">
                  <span className="text-2xl font-bold text-[var(--brand-primary)] w-12 shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <p className="font-bold">{s.title}</p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-xl bg-[var(--brand-primary-light)] border border-[var(--border)]">
              <h3 className="font-bold text-[var(--brand-primary-dark)] mb-2">
                비대면 진료 신청 (구글 설문)
              </h3>
              <p className="text-sm mb-4">
                아래 버튼을 누르시면 구글 설문지로 이동합니다. 내용을 작성해
                주시면 원장님이 확인 후 연락드립니다.
              </p>
              <a
                href={clinic.contact.onlineForm}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-3 rounded-md bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-dark)] transition"
              >
                📝 비대면 진료 신청하기
              </a>
            </div>

            <div className="p-6 rounded-xl bg-[var(--brand-accent-light)] border border-[var(--border)]">
              <h3 className="font-bold mb-2">먼저 카톡으로 물어볼래요</h3>
              <p className="text-sm mb-4">
                설문지 작성 전 간단한 질문이 있으시면 카카오톡 채널로 문의해
                주세요.
              </p>
              <a
                href={clinic.contact.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-5 py-3 rounded-md bg-[#FAE100] text-[#3C1E1E] font-semibold hover:brightness-95 transition"
              >
                💬 카카오톡 상담 시작
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]">
          <h3 className="font-bold mb-3">참고사항</h3>
          <ul className="text-sm text-[var(--text-muted)] space-y-1.5 list-disc pl-5">
            <li>비대면 진료는 정부 시범사업 가이드라인에 따라 운영되며, 안전한 처방을 위해 재진 환자분 위주로 진행됩니다.</li>
            <li>한약은 의료 행위에 따른 처방으로, 효과는 개인 체질에 따라 다를 수 있습니다.</li>
            <li>처음 진료받으시는 분은 가능하시면 내원을 권장드리며, 자세한 안내는 전화로 문의해주세요.</li>
          </ul>
        </div>
      </Section>
    </>
  );
}
