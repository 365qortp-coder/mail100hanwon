import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { DirectorPhoto } from "@/components/DirectorPhoto";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "송원석 원장 소개",
  description: `매일백세한의원 송원석 원장은 다이어트 한약 매일감비환, 정통 공진단, 총명공진단을 처방하는 한의사입니다. 유튜브 채널 3개를 통해 한방 의학 콘텐츠를 공유하고 있습니다.`,
  path: "/about",
  keywords: ["송원석 원장", "매일백세한의원 원장", "한의사", "다이어트 한약 처방 한의사"],
});

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[{ name: "원장 소개", href: "/about" }]} />
      </div>

      <Section bg="white">
        <blockquote className="relative max-w-3xl mx-auto text-center mb-12 md:mb-16 px-6">
          <span aria-hidden className="absolute -top-2 left-1/2 -translate-x-1/2 text-6xl md:text-7xl text-[var(--brand-primary)] leading-none font-serif">
            &ldquo;
          </span>
          <p className="text-2xl md:text-3xl font-extrabold leading-tight pt-8">
            {clinic.philosophy.umbrella}
          </p>
          <footer className="text-sm text-[var(--text-muted)] mt-4">
            — {clinic.director.name} {clinic.director.title}
          </footer>
        </blockquote>

        <div className="grid md:grid-cols-[280px_1fr] gap-8 items-start mb-10">
          <DirectorPhoto
            src="/photos/director.webp"
            alt={`${clinic.director.name} ${clinic.director.title}`}
            className="w-full aspect-[3/4] rounded-2xl object-cover border border-[var(--border)]"
          />
          <div>
            <SectionTitle
              eyebrow={`${clinic.director.name} ${clinic.director.title}`}
              title="환자 한 분 한 분을 직접 상담합니다"
              subtitle="대전대학교 한의과대학을 졸업한 송원석 원장이 모든 환자분의 체질과 증상을 직접 확인한 뒤 한약을 처방합니다. 매일감비환·공진단·총명공진단 모두 원장이 직접 제조 과정을 감독합니다."
            />
          </div>
        </div>

        <KeyFactsBox
          title="원장 약력"
          facts={[
            { label: "출신", value: clinic.director.school },
            { label: "현직", value: `${clinic.name} 대표원장` },
            { label: "경력", value: `개원 ${clinic.stats.yearsOpen}년차 · 다이어트 진료 ${(clinic.stats.dietConsults / 10000).toFixed(0)}만건 누적` },
            { label: "공진단", value: `한의원 내 직접 조제 ${clinic.stats.yearsMakingGongjindan}년` },
            { label: "학회·단체", value: "대한한방비만학회 · 대한상한금궤학회(교육위원 전) · 열린의사회 · 국경없는의사회" },
            { label: "진료 방식", value: "대면 + 비대면 (전국 처방 가능)" },
          ]}
        />

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">상세 약력</h3>
          <ul className="space-y-2 pl-5 list-disc text-[var(--foreground)]">
            {clinic.director.credentials.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div className="prose prose-lg max-w-none mt-8 text-[var(--foreground)] leading-relaxed">
          <h3 className="text-xl font-bold mt-8 mb-3">진료 철학</h3>
          <p>
            한의학은 단순히 증상을 누르는 것이 아니라 환자의 체질을 이해하고
            생활습관과 함께 조율하는 의학입니다. 송원석 원장은 다이어트
            한약이든 공진단이든, 표준화된 처방을 그대로 내리기보다 환자 한 분의
            체질·생활·목표를 함께 보고 처방합니다.
          </p>

          <h3 className="text-xl font-bold mt-8 mb-3">유튜브 콘텐츠</h3>
          <p>
            매일백세한의원은 한방 의학 정보의 투명한 공유를 중요하게 생각합니다.
            세 개의 유튜브 채널을 통해 다이어트, 공진단 제조 과정, 통증 치료
            사례를 공개하고 있습니다.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <a href={clinic.youtube.diet} target="_blank" rel="noopener" className="text-[var(--brand-primary)] underline">
                엄마들을 위한 다이어트 (다이어트 채널)
              </a>
            </li>
            <li>
              <a href={clinic.youtube.gongjindan} target="_blank" rel="noopener" className="text-[var(--brand-primary)] underline">
                직접 만든 진짜 공진단
              </a>
            </li>
            <li>
              <a href={clinic.youtube.pain} target="_blank" rel="noopener" className="text-[var(--brand-primary)] underline">
                매일백세한의원 통증
              </a>
            </li>
          </ul>

          <h3 className="text-xl font-bold mt-8 mb-3">비대면 진료에 대한 입장</h3>
          <p>
            매일백세한의원은 비대면 진료를 적극 운영하지만, 안전한 처방을 위해
            구글 설문지를 통한 자세한 체질·증상 확인과 원장님의 전화 상담을
            반드시 거칩니다. 멀리 계셔도 진료의 질이 떨어지지 않도록 운영하고
            있습니다.
          </p>
        </div>

        <div className="mt-12">
          <CTAButtons />
        </div>
      </Section>
    </>
  );
}
