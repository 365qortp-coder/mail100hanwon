import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CTAButtons } from "@/components/CTAButtons";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "녹용 2배 공진단 | 체력·면역력 회복 · 가격·효능 총정리",
  description:
    "매일백세한의원 녹용 2배 공진단. 일반 공진단 대비 녹용 2배 함량. 30구 42만원, 120구 120만원. 수술 후·항암 후 체력 회복, 어르신·갱년기 면역력. 원장 직접 조제. 02-2234-0102.",
  path: "/gongjindan/nokyong",
  ogImage: "/photos/gongjindan-hero.webp",
  keywords: [
    "녹용 2배 공진단",
    "녹용공진단",
    "녹용공진단 효능",
    "녹용공진단 가격",
    "녹용공진단 추천",
    "녹용공진단 한의원",
    "체력회복 공진단",
    "면역력 공진단",
    "수술 후 공진단",
    "항암 후 공진단",
    "갱년기 공진단",
    "어르신 공진단",
  ],
});

const faqs = [
  {
    q: "녹용 2배 공진단 가격은 얼마인가요?",
    a: "30구 42만 원, 120구 120만 원입니다. 처음 시작하시는 분은 30구로 효과를 확인 후 연장 처방을 결정하시는 경우가 많습니다. 가격은 시점에 따라 변동될 수 있으므로 상담 시 확인 부탁드립니다.",
  },
  {
    q: "사향공진단과 어떻게 다른가요?",
    a: "녹용 2배 공진단은 사향 대신 녹용 함량을 2배로 늘린 처방입니다. 체력·면역력·조혈 기능 회복에 더 특화되어 있으며, 사향공진단보다 열성(熱性)이 낮아 평소 열이 많은 체질에도 더 잘 맞는 경우가 있습니다. 가격도 더 합리적입니다. 어느 것이 맞는지는 상담 후 결정합니다.",
  },
  {
    q: "수술 후 또는 항암 치료 후에 먹어도 되나요?",
    a: "녹용의 조혈 작용과 면역 회복 효과 때문에 수술 후·항암 후 원기 회복을 목적으로 찾으시는 분들이 많습니다. 다만 복용 중인 약과의 상호작용이 있을 수 있으므로, 반드시 현재 복용 중인 양방약과 상태를 알려주시고 상담 후 처방받으시기 바랍니다.",
  },
  {
    q: "녹용이란 어떤 약재인가요?",
    a: "녹용(鹿茸)은 어린 사슴 뿔 끝 부분으로, 성장 인자(IGF-1)가 가장 활성화된 상태의 약재입니다. 조혈(造血) 작용으로 빈혈 개선, 면역력 강화, 원기 보충에 활용됩니다. 동의보감에 「녹용은 허약한 몸을 보하고, 정기를 돋운다」고 기록되어 있습니다.",
  },
  {
    q: "부작용이 있나요?",
    a: "녹용 2배 공진단은 사향공진단보다 열성이 낮아 체질을 덜 탑니다. 다만 소화 기능이 약하신 분은 초기 복용 시 소화 불편이 생길 수 있습니다. 고열이 있거나 감기 중에는 복용을 잠시 중단하시길 권장합니다. 체질 확인 후 처방합니다.",
  },
  {
    q: "비대면으로 처방받을 수 있나요?",
    a: "가능합니다. 카카오톡 또는 전화(02-2234-0102) 문의 → 구글 설문지 작성 → 송원석 원장 직접 전화 상담 → 원내 직접 조제 후 전국 택배 발송(영업일 2~5일).",
  },
];

export default function NokyongPage() {
  return (
    <>
      <JsonLd id="ld-nokyong-breadcrumb" data={breadcrumbSchema([
        { name: "홈", url: clinic.url },
        { name: "공진단", url: `${clinic.url}/gongjindan` },
        { name: "녹용 2배 공진단", url: `${clinic.url}/gongjindan/nokyong` },
      ])} />
      <JsonLd id="ld-nokyong-faq" data={faqSchema(faqs)} />
      <JsonLd id="ld-nokyong-product" data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "녹용 2배 공진단",
        description: "일반 공진단 대비 녹용 2배 함량. 체력·면역력·조혈 기능 회복 특화. 원장 직접 조제.",
        image: `${clinic.url}/photos/gongjindan-hero.webp`,
        url: `${clinic.url}/gongjindan/nokyong`,
        brand: { "@type": "Brand", name: clinic.name },
        manufacturer: { "@id": `${clinic.url}#clinic` },
        offers: [
          {
            "@type": "Offer",
            name: "녹용 2배 공진단 30구",
            price: 420000,
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
            seller: { "@id": `${clinic.url}#clinic` },
          },
          {
            "@type": "Offer",
            name: "녹용 2배 공진단 120구",
            price: 1200000,
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
            seller: { "@id": `${clinic.url}#clinic` },
          },
        ],
      }} />

      {/* 브레드크럼 */}
      <nav className="mx-auto max-w-6xl px-4 pt-4 text-xs text-[var(--text-muted)] flex items-center gap-1.5">
        <Link href="/" className="hover:text-[var(--brand-primary)]">홈</Link>
        <span>/</span>
        <Link href="/gongjindan" className="hover:text-[var(--brand-primary)]">공진단</Link>
        <span>/</span>
        <span className="text-[var(--foreground)] font-semibold">녹용 2배 공진단</span>
      </nav>

      {/* 01 · HERO */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-4">
            녹용 2배 공진단 · 매일백세한의원
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            녹용 2배 공진단 —<br />
            <span className="text-[var(--brand-primary)]">체력·면역력 회복</span> 특화
          </h1>
          <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-2xl">
            일반 공진단 대비 녹용 함량을 2배로 늘렸습니다.
            조혈 작용으로 빈혈 개선, 면역력 강화, 수술 후·항암 후 원기 회복에 특화된 처방입니다.
            사향공진단보다 합리적인 가격으로 꾸준히 복용할 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { num: "2배", label: "녹용 함량" },
              { num: "30구~", label: "42만원부터" },
              { num: "120구", label: "120만원 (최대 효과)" },
              { num: "72%", label: "재처방률" },
            ].map((b) => (
              <div key={b.label} className="bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-center shadow-sm">
                <p className="text-xl font-extrabold text-[var(--brand-primary)]">{b.num}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{b.label}</p>
              </div>
            ))}
          </div>
          <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="녹용공진단 상담 신청" />
        </div>
      </section>

      {/* 02 · 녹용이란 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">Ingredient</p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">녹용(鹿茸)이란 무엇인가</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-[var(--surface-muted)] rounded-2xl p-7">
              <h3 className="text-lg font-extrabold mb-3">🦌 어린 사슴 뿔의 성장 인자</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                녹용은 아직 굳지 않은 어린 사슴 뿔 끝 부분입니다.
                성장 인자(IGF-1)가 가장 활성화된 상태로, 조혈 기능·세포 재생·면역 활성화에 도움을 줍니다.
                동의보감에 「녹용은 허약한 몸을 보하고 정기를 돋운다」고 기록되어 있습니다.
              </p>
            </div>
            <div className="bg-[var(--surface-muted)] rounded-2xl p-7">
              <h3 className="text-lg font-extrabold mb-3">🔬 2배 함량의 의미</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                일반 공진단 대비 녹용 함량을 2배로 늘린 처방입니다.
                사향공진단의 사향이 하는 뇌순환·기력 상승 역할을 녹용의 조혈·면역 강화 효과로
                보완합니다. 체력이 떨어지고 빈혈 경향이 있는 분께 더 적합합니다.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-extrabold mb-6">녹용 2배 공진단 성분 구성</h3>
          <div className="space-y-4">
            {[
              { name: "녹용(鹿茸) 2배", role: "군약(君藥)", desc: "조혈 작용, 면역력 강화, 원기 보충, 세포 재생 촉진. 일반 공진단의 2배 함량." },
              { name: "목향(木香)", role: "신약(臣藥)", desc: "기(氣) 흐름 조절, 소화 기능 강화. 녹용의 보기(補氣) 작용을 원활히 돕습니다." },
              { name: "당귀(當歸)", role: "신약(臣藥)", desc: "혈액 순환 개선, 빈혈 예방, 피로감 완화. 녹용의 조혈 작용과 시너지 효과." },
              { name: "산수유(山茱萸)", role: "좌사약(佐使藥)", desc: "신장 기능 보강, 과도한 보기(補氣) 완충. 부작용 방지 역할." },
            ].map((s) => (
              <div key={s.name} className="rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-extrabold text-base">{s.name}</h4>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-white text-[var(--text-muted)] shrink-0">{s.role}</span>
                </div>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · 추천 대상 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">For You</p>
            <h2 className="text-2xl md:text-4xl font-extrabold">이런 분께 녹용 2배 공진단을 권합니다</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🏥", title: "수술 후·항암 후 회복", desc: "큰 수술이나 항암 치료 후 체력·면역력 회복이 필요한 분" },
              { icon: "🩸", title: "빈혈·조혈 기능 저하", desc: "혈색이 나쁘고, 쉽게 피로하며 빈혈 경향이 있는 분" },
              { icon: "🌡️", title: "면역력 저하", desc: "감기를 자주 달고 살거나, 면역 기능이 전반적으로 약한 분" },
              { icon: "👵", title: "어르신·갱년기 체력저하", desc: "나이 들며 급격히 체력이 떨어진 어르신, 갱년기 여성" },
              { icon: "💊", title: "사향이 맞지 않는 분", desc: "평소 열이 많아 사향공진단이 부담스러운 분께 더 적합" },
              { icon: "💰", title: "합리적 가격 원하는 분", desc: "사향공진단보다 저렴하게 꾸준히 복용하고 싶은 분" },
            ].map((t) => (
              <div key={t.title} className="bg-white rounded-xl border border-[var(--border)] p-5">
                <p className="text-2xl mb-2">{t.icon}</p>
                <h3 className="font-bold mb-1">{t.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · 가격 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">Pricing</p>
            <h2 className="text-2xl md:text-4xl font-extrabold">녹용 2배 공진단 가격</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-7">
              <p className="text-xs font-bold text-[var(--text-muted)] mb-2">처음 시작 · 효과 확인용</p>
              <p className="text-4xl font-extrabold text-[var(--brand-primary-dark)] mb-1">42만원</p>
              <p className="text-sm text-[var(--text-muted)]">녹용 2배 공진단 30구</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-black text-white p-7">
              <p className="text-xs font-bold text-[var(--brand-primary)] mb-2">4개월 꾸준한 복용 · 최대 효과</p>
              <p className="text-4xl font-extrabold mb-1">120만원</p>
              <p className="text-sm text-white/60">녹용 2배 공진단 120구</p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center mb-4">
            ※ 가격은 표시 시점 기준이며 변경될 수 있습니다. 처방은 상담 후 결정됩니다.
          </p>
          <div className="bg-[var(--brand-primary-light)] border border-[var(--brand-primary)] rounded-xl p-5 text-center">
            <p className="text-sm font-semibold text-[var(--brand-primary-dark)]">
              사향공진단(30구 135만원) 대비 약 1/3 가격으로 꾸준한 복용이 가능합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 05 · E-E-A-T */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <div className="bg-white rounded-2xl border border-[var(--border)] p-7 flex flex-col sm:flex-row gap-6 items-start">
            <div className="shrink-0">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-white font-extrabold text-xl">송</div>
            </div>
            <div>
              <p className="font-extrabold text-lg mb-1">송원석 원장 · 매일백세한의원</p>
              <p className="text-sm text-[var(--text-muted)] mb-4">대전대학교 한의과대학 졸업(05학번) · 한의사 면허</p>
              <ul className="text-sm space-y-1.5 text-[var(--foreground)]">
                <li>✔ 공진단 연간 19,000구+ 원내 직접 조제 (2025년 기준)</li>
                <li>✔ 녹용 2배 공진단은 체력·면역력 회복에 맞게 직접 비율 조정한 처방</li>
                <li>✔ 조제 전 과정 유튜브 공개 운영</li>
                <li>✔ 재처방률 72% — 효과를 체감한 환자들의 재선택</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 06 · FAQ */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-extrabold">녹용 2배 공진단 자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-5 hover:border-[var(--brand-primary)] transition">
                <summary className="cursor-pointer font-semibold flex items-start gap-2 list-none">
                  <span className="text-[var(--brand-primary)] font-bold shrink-0">Q.</span>
                  <span className="flex-1">{f.q}</span>
                  <span className="text-[var(--text-muted)] group-open:rotate-180 transition shrink-0">▾</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed pl-6">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/gongjindan" className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
              ← 공진단 전체 라인업 보기 (사향공진단 · 총명공진단)
            </Link>
          </div>
        </div>
      </section>

      {/* 07 · CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-3">Contact</p>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            체질 확인 후 처방합니다
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            전화·카카오톡·비대면 신청 모두 가능합니다. 서울 중랑구 내원 또는 전국 택배 처방.
          </p>
          <div className="max-w-xl mx-auto">
            <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="녹용공진단 상담 신청" />
          </div>
          <p className="mt-6 text-white/50 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분 · {clinic.contact.phone}
          </p>
        </div>
      </section>
    </>
  );
}
