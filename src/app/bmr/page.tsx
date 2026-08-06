import Link from "next/link";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { BmrCalculator } from "@/components/BmrCalculator";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "기초대사량 계산기 | 성별·나이·활동량별 BMR·TDEE 계산",
  description:
    "Mifflin-St Jeor 공식 기반 무료 기초대사량(BMR) 계산기. 성별·연령대별 평균 비교, 활동대사량(TDEE)까지 한 번에 확인하세요.",
  path: "/bmr",
  keywords: ["기초대사량 계산기", "BMR 계산기", "TDEE 계산기", "기초대사량 평균", "활동대사량"],
});

const bmrSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${clinic.url}/bmr#webpage`,
      url: `${clinic.url}/bmr`,
      name: "기초대사량 계산기 | 매일백세한의원",
      description:
        "Mifflin-St Jeor 공식 기반 무료 기초대사량(BMR) 계산기. 성별·연령대별 평균 비교, 활동대사량(TDEE)까지 확인.",
      inLanguage: "ko-KR",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: clinic.name, item: clinic.url },
        { "@type": "ListItem", position: 2, name: "기초대사량 계산기", item: `${clinic.url}/bmr` },
      ],
    },
    {
      "@type": "SoftwareApplication",
      name: "기초대사량 계산기",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: `${clinic.url}/bmr`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    },
    {
      "@type": "HowTo",
      name: "기초대사량(BMR) 계산하는 법",
      step: [
        { "@type": "HowToStep", name: "성별·나이·키·몸무게 입력", text: "성별, 나이, 키(cm), 몸무게(kg)를 입력합니다." },
        {
          "@type": "HowToStep",
          name: "공식 적용",
          text: "Mifflin-St Jeor 공식으로 남성은 10×체중+6.25×키−5×나이+5, 여성은 10×체중+6.25×키−5×나이−161을 계산합니다.",
        },
        { "@type": "HowToStep", name: "결과 확인", text: "계산된 기초대사량(kcal)과 동일 연령대 평균치를 비교해 확인합니다." },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "기초대사량이란 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "아무 활동을 하지 않아도 호흡, 체온 조절, 심장박동 등 생명 유지에 최소한으로 소모되는 에너지량입니다. 하루 전체 소모 칼로리의 약 60~70%를 차지합니다.",
          },
        },
        {
          "@type": "Question",
          name: "기초대사량이 낮으면 어떻게 되나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "같은 양을 먹어도 소모되는 열량이 적어 체지방으로 쌓이기 쉽습니다. 나이가 들수록, 근육량이 줄어들수록 기초대사량은 자연히 낮아지는 경향이 있습니다.",
          },
        },
        {
          "@type": "Question",
          name: "계산기 결과와 인바디 측정값이 다른 이유는 무엇인가요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "이 계산기는 통계적 공식(Mifflin-St Jeor)으로 추정한 값이고, 인바디는 체성분을 직접 측정한 값이라 차이가 있을 수 있습니다. 체지방률을 알고 있다면 입력창에 추가로 입력해 Katch-McArdle 공식 기반의 더 정밀한 값을 확인할 수 있습니다.",
          },
        },
        {
          "@type": "Question",
          name: "기초대사량을 높이려면 어떻게 해야 하나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "근육량을 늘리는 저항 운동, 충분한 단백질 섭취, 무리한 절식을 피하는 것이 핵심입니다. 근육 1kg당 하루 약 13kcal를 추가로 소모합니다.",
          },
        },
        {
          "@type": "Question",
          name: "기초대사량이 평균보다 낮게 나왔다면 어떻게 해야 하나요?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "우선 근육량을 늘리는 생활습관 교정이 먼저입니다. 여러 방법을 시도해도 개선되지 않는다면 체질별 접근이 필요할 수 있어 전문 상담을 고려해볼 수 있습니다.",
          },
        },
      ],
    },
  ],
};

const bmrFaqs = [
  {
    q: "기초대사량이란 무엇인가요?",
    a: (
      <>아무 활동을 하지 않아도 호흡, 체온 조절, 심장박동 등 생명 유지에 최소한으로 소모되는 에너지량입니다. 하루 전체 소모 칼로리의 약 60~70%를 차지합니다.</>
    ),
  },
  {
    q: "기초대사량이 낮으면 어떻게 되나요?",
    a: (
      <>같은 양을 먹어도 소모되는 열량이 적어 체지방으로 쌓이기 쉽습니다. 나이가 들수록, 근육량이 줄어들수록 기초대사량은 자연히 낮아지는 경향이 있습니다.</>
    ),
  },
  {
    q: "계산기 결과와 인바디 측정값이 다른 이유는?",
    a: (
      <>이 계산기는 통계적 공식(Mifflin-St Jeor)으로 추정한 값이고, 인바디는 체성분을 직접 측정한 값이라 차이가 있을 수 있습니다. 체지방률을 알고 있다면 위 계산기 &ldquo;더 정확하게 계산하기&rdquo;에 입력해 Katch-McArdle 공식 기반의 더 정밀한 값을 확인하세요.</>
    ),
  },
  {
    q: "기초대사량을 높이려면 어떻게 해야 하나요?",
    a: (
      <>근육량을 늘리는 저항 운동, 충분한 단백질 섭취, 무리한 절식을 피하는 것이 핵심입니다. 근육 1kg당 하루 약 13kcal를 추가로 소모합니다. 관련 정보는{" "}<Link href="/columns" className="text-[var(--brand-primary)] font-semibold underline">건강 칼럼</Link>을 참고하세요.</>
    ),
  },
  {
    q: "기초대사량이 평균보다 낮게 나왔다면 어떻게 해야 하나요?",
    a: (
      <>우선 근육량을 늘리는 생활습관 교정이 먼저입니다. 여러 방법을 시도해도 개선되지 않는다면 체질별 접근이 필요할 수 있어,{" "}<Link href="/diet" className="text-[var(--brand-primary)] font-semibold underline">매일감비환 다이어트 한약</Link> 상담을 고려해볼 수 있습니다.</>
    ),
  },
];

export default function BmrPage() {
  return (
    <>
      <JsonLd id="ld-bmr" data={bmrSchema} />

      {/* ── 01 HERO + CALCULATOR ── */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto px-5 md:px-8 pt-14 pb-6 md:pt-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-px w-6 bg-[var(--brand-primary)]" aria-hidden />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--brand-primary)]">
              무료 건강 계산기 · 매일백세한의원
            </span>
            <span className="h-px w-6 bg-[var(--brand-primary)]" aria-hidden />
          </div>
          <h1 className="font-serif text-[2.1rem] md:text-[2.9rem] leading-[1.18] tracking-[-0.02em] text-[#0a0a0a] mb-4">
            기초대사량 계산기
          </h1>
          <p className="text-[#525252] text-base md:text-lg leading-[1.75] max-w-[46ch] mx-auto">
            Mifflin-St Jeor 공식으로 내 기초대사량(BMR)과 활동대사량(TDEE)을 확인하고,
            같은 연령대 평균과 비교해보세요.
          </p>
        </div>

        <div className="max-w-xl mx-auto px-5 md:px-8 pb-16 md:pb-20">
          <BmrCalculator />
          <p className="text-xs text-[#8C8A87] text-center mt-4 leading-relaxed">
            본 계산기는 통계 공식 기반 추정치로 참고용입니다. 정확한 체성분 측정은 인바디 검사를,
            건강 상담은 전문의를 통해 받으시기 바랍니다.
          </p>
        </div>
      </section>

      {/* ── 02 공식 설명 ── */}
      <section className="bg-[#FAFAFA] border-t border-black/[0.05]">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-8">기초대사량 계산 공식</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
              <p className="text-xs font-bold text-[var(--brand-primary)] mb-3 uppercase tracking-wide">
                Mifflin-St Jeor (본 계산기 기본값)
              </p>
              <p className="text-sm text-[#525252] leading-[1.9] font-mono">
                남성: 10×체중(kg) + 6.25×키(cm) − 5×나이 + 5
                <br />
                여성: 10×체중(kg) + 6.25×키(cm) − 5×나이 − 161
              </p>
              <p className="text-xs text-[#8C8A87] mt-3">현재 임상영양학에서 가장 널리 쓰이는 표준 공식.</p>
            </div>
            <div className="bg-white rounded-2xl border border-black/[0.06] p-6">
              <p className="text-xs font-bold text-[#8C8A87] mb-3 uppercase tracking-wide">해리스-베네딕트 (참고)</p>
              <p className="text-sm text-[#525252] leading-[1.9] font-mono">
                남성: 66.47 + 13.75×체중 + 5×키 − 6.76×나이
                <br />
                여성: 655.1 + 9.56×체중 + 1.85×키 − 4.68×나이
              </p>
              <p className="text-xs text-[#8C8A87] mt-3">1990년 개정판. Mifflin-St Jeor보다 다소 높게 추정되는 경향.</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-black/[0.06] p-6 mt-5">
            <p className="text-xs font-bold text-[#8C8A87] mb-3 uppercase tracking-wide">
              Katch-McArdle (체지방률을 아는 경우)
            </p>
            <p className="text-sm text-[#525252] leading-[1.9] font-mono">
              제지방량 = 체중 × (1 − 체지방률)
              <br />
              기초대사량 = 370 + 21.6 × 제지방량
            </p>
            <p className="text-xs text-[#8C8A87] mt-3">
              체지방률을 반영해 근육량이 많거나 적은 체형에서 더 정확합니다. 인바디 결과지의 체지방률을 위 계산기에
              입력하면 자동 적용됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 03 평균 기초대사량 표 ── */}
      <section className="bg-white border-t border-black/[0.05]">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-2">성별·연령대별 평균 기초대사량</h2>
          <p className="text-sm text-[#525252] mb-8">
            평균 신장·체중 기준 참고치입니다. 개인 체성분에 따라 차이가 있을 수 있습니다.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "여성 평균 기초대사량",
                rows: [["20대", "약 1,360kcal"], ["30대", "약 1,320kcal"], ["40대", "약 1,280kcal"], ["50대 이상", "약 1,230kcal"]],
              },
              {
                title: "남성 평균 기초대사량",
                rows: [["20대", "약 1,730kcal"], ["30대", "약 1,680kcal"], ["40대", "약 1,630kcal"], ["50대 이상", "약 1,580kcal"]],
              },
            ].map((t) => (
              <div key={t.title} className="bg-[#F8F6F2] rounded-2xl border border-black/[0.05] overflow-hidden">
                <p className="text-sm font-bold text-[#0a0a0a] px-5 pt-5 pb-3">{t.title}</p>
                <table className="w-full text-sm">
                  <tbody>
                    {t.rows.map(([age, kcal]) => (
                      <tr key={age} className="border-t border-black/[0.06]">
                        <td className="px-5 py-3 text-[#525252]">{age}</td>
                        <td className="px-5 py-3 text-right font-bold text-[#0a0a0a]">{kcal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 FAQ ── */}
      <section className="bg-[#F8F6F2] border-t border-black/[0.05]">
        <div className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-20">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#0a0a0a] mb-8">자주 묻는 질문</h2>
          <div className="space-y-3">
            {bmrFaqs.map((f, i) => (
              <details key={i} className="group bg-white rounded-xl border border-black/[0.06] p-5">
                <summary className="cursor-pointer font-semibold flex items-start gap-2 list-none select-none">
                  <span className="text-[var(--brand-primary)] font-bold shrink-0">Q.</span>
                  <span className="flex-1 text-[#0a0a0a]">{f.q}</span>
                  <span
                    className="text-[#8C8A87] shrink-0 group-open:rotate-180"
                    style={{ transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)" }}
                    aria-hidden
                  >
                    ▾
                  </span>
                </summary>
                <p className="mt-3 text-sm text-[#525252] leading-relaxed pl-6">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 FINAL CTA ── */}
      <section className="bg-[#111110] text-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
          <p className="text-[10px] font-bold tracking-[0.25em] text-[var(--brand-primary)] uppercase mb-4">매일감비환</p>
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 leading-snug">
            기초대사량 회복이 필요하다면,
            <br />
            매일감비환
          </h2>
          <p className="text-white/60 mb-10 max-w-lg mx-auto text-base leading-relaxed">
            40~60대 엄마들의 기초대사량 회복에 특화된 다이어트 한약. 체지방 위주로 빼고 근육은 지키며, 비대면으로 전국
            어디서나 처방받을 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/diet"
              className="rn-btn-primary inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--brand-primary)] text-white font-bold rounded-full text-sm"
            >
              매일감비환 자세히 보기
            </Link>
            <a
              href={`tel:${clinic.contact.phoneClean}`}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-bold rounded-full text-sm hover:border-white/50 transition-colors"
            >
              {clinic.contact.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
