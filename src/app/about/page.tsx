import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
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

const subHeading = "font-serif text-xl md:text-2xl font-bold tracking-[-0.025em] text-[#0a0a0a]";

export default function AboutPage() {
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[{ name: "원장 소개", href: "/about" }]} />
      </div>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
          <blockquote className="relative max-w-3xl mx-auto text-center mb-14 md:mb-20 px-6">
            <span
              aria-hidden
              className="absolute -top-2 left-1/2 -translate-x-1/2 text-6xl md:text-7xl text-[var(--brand-primary)] leading-none font-serif"
            >
              &ldquo;
            </span>
            <p className="font-serif text-2xl md:text-[2.25rem] font-bold leading-[1.4] tracking-[-0.025em] text-[#0a0a0a] pt-10">
              {clinic.philosophy.umbrella}
            </p>
            <footer className="text-sm text-[#8C8A87] mt-5">
              — {clinic.director.name} {clinic.director.title}
            </footer>
          </blockquote>

          <div className="grid md:grid-cols-[300px_1fr] gap-8 md:gap-12 items-start mb-10">
            <div className="rounded-[24px] bg-black/[0.04] p-2 ring-1 ring-black/[0.06]">
              <DirectorPhoto
                src="/photos/director.webp"
                alt={`${clinic.director.name} ${clinic.director.title}`}
                className="w-full aspect-[3/4] rounded-[18px] object-cover"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="h-px w-6 bg-[var(--brand-primary)]" aria-hidden />
                <h1 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--brand-primary)]">
                  {clinic.director.name} {clinic.director.title}
                </h1>
              </div>
              <p className="text-base text-[#525252] leading-[1.8] max-w-2xl mb-8">
                대전대학교 한의과대학을 졸업한 송원석 원장이 모든 환자분의 체질과 증상을 직접
                확인한 뒤 한약을 처방합니다. 매일감비환·공진단·총명공진단 모두 원장이 직접
                제조 과정을 감독합니다.
              </p>

              <KeyFactsBox
                title="원장 약력"
                facts={[
                  { label: "출신", value: clinic.director.school },
                  { label: "현직", value: `${clinic.name} 대표원장` },
                  { label: "경력", value: `개원 ${clinic.stats.yearsOpen}년차 · 누적 진료 ${(clinic.stats.totalConsults / 10000).toFixed(0)}만건+` },
                  { label: "공진단", value: `한의원 내 직접 조제 ${(clinic.stats.gongjindanUnits / 10000).toFixed(0)}만구+` },
                  { label: "학회·단체", value: "대한한방비만학회 · 대한상한금궤학회(교육위원 전) · 열린의사회 · 국경없는의사회" },
                  { label: "진료 방식", value: "대면 + 비대면 (전국 처방 가능)" },
                ]}
              />
            </div>
          </div>

          <div className="mt-10">
            <h2 className={`${subHeading} mb-5`}>상세 약력</h2>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {clinic.director.credentials.map((c) => (
                <li
                  key={c}
                  className="px-4 py-3 rounded-xl bg-[#F5F5F5] border border-black/[0.05] text-sm font-medium text-[#0a0a0a]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 space-y-10 max-w-3xl">
            <div>
              <h2 className={`${subHeading} mb-3`}>진료 철학</h2>
              <p className="text-base text-[#525252] leading-[1.8]">
                한의학은 단순히 증상을 누르는 것이 아니라 환자의 체질을 이해하고
                생활습관과 함께 조율하는 의학입니다. 송원석 원장은 다이어트
                한약이든 공진단이든, 표준화된 처방을 그대로 내리기보다 환자 한 분의
                체질·생활·목표를 함께 보고 처방합니다.
              </p>
            </div>

            <div>
              <h2 className={`${subHeading} mb-3`}>유튜브 콘텐츠</h2>
              <p className="text-base text-[#525252] leading-[1.8] mb-4">
                매일백세한의원은 한방 의학 정보의 투명한 공유를 중요하게 생각합니다.
                세 개의 유튜브 채널을 통해 다이어트, 공진단 제조 과정, 통증 치료
                사례를 공개하고 있습니다.
              </p>
              <ul className="space-y-2">
                {[
                  { href: clinic.youtube.diet, label: "엄마들을 위한 다이어트 (다이어트 채널)" },
                  { href: clinic.youtube.gongjindan, label: "직접 만든 진짜 공진단" },
                  { href: clinic.youtube.pain, label: "매일백세한의원 통증" },
                ].map((y) => (
                  <li key={y.href}>
                    <a
                      href={y.href}
                      target="_blank"
                      rel="noopener"
                      className="rn-arrow inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary)]"
                    >
                      {y.label} <span aria-hidden>→</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className={`${subHeading} mb-3`}>비대면 진료에 대한 입장</h2>
              <p className="text-base text-[#525252] leading-[1.8]">
                매일백세한의원은 비대면 진료를 적극 운영하지만, 안전한 처방을 위해
                구글 설문지를 통한 자세한 체질·증상 확인과 원장님의 전화 상담을
                반드시 거칩니다. 멀리 계셔도 진료의 질이 떨어지지 않도록 운영하고
                있습니다.
              </p>
            </div>
          </div>

          {/* 한의원 위치 */}
          <div className="mt-14 border-t border-black/[0.05] pt-12">
            <h2 className={`${subHeading} mb-6`}>서울 중랑구 · 먹골역 도보 5분</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "주소", value: "서울특별시 중랑구 공릉로 21" },
                { label: "교통", value: "먹골역 (7호선) 도보 5분 · 태릉입구역 (6·7호선) 도보 10분" },
                { label: "평일", value: "09:30 – 18:30 (점심 13:00 – 14:00)" },
                { label: "토요일", value: "09:30 – 13:00 · 일요일 휴진" },
                { label: "전화", value: clinic.contact.phone },
              ].map((row) => (
                <div key={row.label} className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/[0.05]">
                  <dt className="text-[10px] tracking-widest text-[#888] uppercase font-bold mb-1.5">{row.label}</dt>
                  <dd className="font-bold text-[#0a0a0a]">{row.value}</dd>
                </div>
              ))}
            </div>
          </div>

          {/* 진료 항목 */}
          <div className="mt-12 border-t border-black/[0.05] pt-12">
            <h2 className={`${subHeading} mb-6`}>진료 항목</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { title: "매일감비환 다이어트", desc: "기초대사량 회복에 특화된 한방 다이어트. 비대면 전국 처방.", href: "/diet" },
                { title: "공진단 · 총명공진단", desc: "원장이 직접 제조하는 사향·녹용 공진단. 수험생·갱년기·기력회복.", href: "/gongjindan" },
                { title: "무릎관절 NMC", desc: "염증 무력화→구조 재건 한방 프로토콜. 침·한약 병행 치료.", href: "/nmc" },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rn-card group block p-6 rounded-[20px] border border-black/[0.07] bg-white hover:border-black/20"
                >
                  <h4 className="font-serif text-lg font-bold mb-1.5 text-[#0a0a0a]">{item.title}</h4>
                  <p className="text-sm text-[#525252] leading-[1.75] mb-4">{item.desc}</p>
                  <span className="rn-arrow inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary)]">
                    자세히 보기 <span aria-hidden>→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <CTAButtons />
          </div>
        </div>
      </section>
    </>
  );
}
