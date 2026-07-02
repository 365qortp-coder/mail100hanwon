import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CTAButtons } from "@/components/CTAButtons";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "사향공진단 | CITES 인증 정품 사향 · 가격·효능·부작용 총정리",
  description:
    "매일백세한의원 사향공진단. CITES 부속서 I 인증 천연 사향 100mg 함유. 30구 135만원, 100구 350만원. 기력·뇌기능·남성 스태미너. 원장이 유튜브에 조제 전과정 공개. 02-2234-0102.",
  path: "/gongjindan/sahyang",
  ogImage: "/photos/gongjindan-hero.webp",
  keywords: [
    "사향공진단",
    "사향공진단 효능",
    "사향공진단 가격",
    "사향공진단 부작용",
    "진짜 사향공진단",
    "CITES 사향공진단",
    "사향 100mg 공진단",
    "사향공진단 추천",
    "사향공진단 한의원",
    "기력회복 공진단",
    "뇌기능 공진단",
    "남성 공진단",
  ],
});

const faqs = [
  {
    q: "사향공진단 가격은 얼마인가요?",
    a: "30구 135만 원, 100구 350만 원입니다. 처음 드시는 분은 30구로 효과를 확인 후 연장 처방을 결정하시는 경우가 많습니다. 가격은 시점에 따라 변동될 수 있으므로 상담 시 확인 부탁드립니다.",
  },
  {
    q: "사향이 진짜인지 어떻게 확인하나요?",
    a: "매일백세한의원은 유튜브 채널 '직접 만든 진짜 공진단'에서 사향 수령 → 검수 → 조제 전 과정을 영상으로 공개합니다. 식약처 인증 정품 사향만 사용하며, CITES(멸종위기에 처한 야생동식물의 국제거래에 관한 협약) 부속서 I 등재 원료임을 확인할 수 있습니다.",
  },
  {
    q: "사향공진단은 어떤 분께 맞나요?",
    a: "만성피로·기력저하가 심한 분, 뇌기능 회복이 필요한 분(중풍 후 재활, 집중력 저하), 남성 스태미너·활력 저하, 수술 후 원기 회복, 건강 선물용으로 많이 찾으십니다. 체질에 따라 맞지 않을 수 있으므로 상담 후 처방합니다.",
  },
  {
    q: "사향공진단 부작용이 있나요?",
    a: "사향공진단은 열성 약재가 포함되어 있어 화(火)가 많은 체질(평소 얼굴이 붉거나 열이 많은 분)에게는 두통, 안면 홍조가 나타날 수 있습니다. 임산부는 복용 전 반드시 상담이 필요합니다. 체질 확인 없이 처방하지 않습니다.",
  },
  {
    q: "녹용 2배 공진단과 어떻게 다른가요?",
    a: "사향공진단은 천연 사향 100mg이 핵심 성분으로, 기력·뇌기능 회복 효과가 더 강합니다. 가격은 높지만 효과의 체감 속도가 빠른 편입니다. 녹용 2배 공진단은 사향 대신 녹용 함량을 2배로 높여 체력·면역력 회복에 초점을 맞춘 합리적 대안입니다. 어느 것이 맞는지는 상담 후 결정합니다.",
  },
  {
    q: "비대면으로 처방받을 수 있나요?",
    a: "가능합니다. 카카오톡 또는 전화(02-2234-0102) 문의 → 구글 설문지 작성 → 송원석 원장 직접 전화 상담 → 원내 직접 조제 후 전국 택배 발송(영업일 2~5일). 재진 환자는 절차가 더 간소화됩니다.",
  },
];

export default function SahyangPage() {
  return (
    <>
      <JsonLd id="ld-sahyang-breadcrumb" data={breadcrumbSchema([
        { name: "홈", url: clinic.url },
        { name: "공진단", url: `${clinic.url}/gongjindan` },
        { name: "사향공진단", url: `${clinic.url}/gongjindan/sahyang` },
      ])} />
      <JsonLd id="ld-sahyang-faq" data={faqSchema(faqs)} />
      <JsonLd id="ld-sahyang-product" data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "사향공진단",
        description: "CITES 인증 천연 사향 100mg 함유 정통 공진단. 기력·뇌기능·남성 스태미너 회복. 원장 직접 조제.",
        image: `${clinic.url}/photos/gongjindan-hero.webp`,
        url: `${clinic.url}/gongjindan/sahyang`,
        brand: { "@type": "Brand", name: clinic.name },
        manufacturer: { "@id": `${clinic.url}#clinic` },
        offers: [
          {
            "@type": "Offer",
            name: "사향공진단 30구",
            price: 1350000,
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
            seller: { "@id": `${clinic.url}#clinic` },
          },
          {
            "@type": "Offer",
            name: "사향공진단 100구",
            price: 3500000,
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
        <span className="text-[var(--foreground)] font-semibold">사향공진단</span>
      </nav>

      {/* 01 · HERO */}
      <section className="bg-black text-white border-t border-white/10">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-4">
            사향공진단 · 매일백세한의원
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            사향공진단 —<br />
            <span className="text-[var(--brand-primary)]">CITES 인증 정품 사향</span> 100mg
          </h1>
          <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-2xl">
            멸종위기종 국제거래 협약(CITES) 부속서 I에 등재된 천연 사향을 사용합니다.
            조제 전 과정을 유튜브에 공개하며, 송원석 원장이 직접 빚습니다.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { num: "100mg", label: "1구당 사향 함량" },
              { num: "CITES I", label: "정품 인증 등급" },
              { num: "30구~", label: "135만원부터" },
              { num: "72%", label: "재처방률" },
            ].map((b) => (
              <div key={b.label} className="border border-white/20 rounded-xl px-4 py-3 text-center">
                <p className="text-xl font-extrabold text-[var(--brand-primary)]">{b.num}</p>
                <p className="text-xs text-white/60 mt-0.5">{b.label}</p>
              </div>
            ))}
          </div>
          <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="사향공진단 상담 신청" />
        </div>
      </section>

      {/* 02 · 사향이란 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">Ingredient</p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">사향(麝香)이란 무엇인가</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-[var(--surface-muted)] rounded-2xl p-7">
              <h3 className="text-lg font-extrabold mb-3">🦌 사향노루의 분비물</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                사향(麝香)은 사향노루(Moschus moschiferus) 수컷의 향낭에서 채취하는 천연 동물성 약재입니다.
                CITES(멸종위기에 처한 야생동식물의 국제거래에 관한 협약) 부속서 I에 등재된
                최고 보호 등급 원료로, 정품 유통에는 엄격한 인증이 필요합니다.
              </p>
            </div>
            <div className="bg-[var(--surface-muted)] rounded-2xl p-7">
              <h3 className="text-lg font-extrabold mb-3">📜 동의보감 기록</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                동의보감에 「사향은 중풍·간질을 치료하고, 심기(心氣)를 안정시키며,
                기를 통하게 하고 막힌 것을 열어준다」고 기록되어 있습니다.
                공진단의 군약(君藥, 핵심 성분)으로 전통 처방에서 수백 년간 사용되어 왔습니다.
              </p>
            </div>
          </div>

          <h3 className="text-xl font-extrabold mb-6">사향공진단 4가지 주요 성분</h3>
          <div className="space-y-4">
            {[
              {
                name: "사향(麝香) 100mg",
                role: "군약(君藥) — 핵심 성분",
                desc: "뇌혈관 순환 개선, 중추신경 안정, 기력 상승. 1구당 100mg 함유. CITES 부속서 I 인증 정품만 사용.",
                highlight: true,
              },
              {
                name: "녹용(鹿茸)",
                role: "신약(臣藥) — 보조 성분",
                desc: "조혈 작용, 면역력 강화, 원기 보충. 어린 사슴 뿔 끝 부분의 성장 인자가 활성화 상태.",
                highlight: false,
              },
              {
                name: "당귀(當歸)",
                role: "신약(臣藥) — 보조 성분",
                desc: "혈액 순환 개선, 빈혈 예방, 항산화 작용. 피로감 완화와 혈색 개선에 도움.",
                highlight: false,
              },
              {
                name: "산수유(山茱萸)",
                role: "좌사약(佐使藥) — 조절 성분",
                desc: "신장 기능 보강, 과도한 열 억제, 다른 약재의 균형 조절. 부작용 완충 역할.",
                highlight: false,
              },
            ].map((s) => (
              <div key={s.name} className={`rounded-xl p-5 border ${s.highlight ? "bg-black text-white border-[var(--brand-primary)]" : "bg-[var(--surface-muted)] border-[var(--border)]"}`}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h4 className="font-extrabold text-base">{s.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded shrink-0 ${s.highlight ? "bg-[var(--brand-primary)] text-white" : "bg-white text-[var(--text-muted)]"}`}>{s.role}</span>
                </div>
                <p className={`text-sm leading-relaxed ${s.highlight ? "text-white/70" : "text-[var(--text-muted)]"}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · 효능 & 추천 대상 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">For You</p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">이런 분께 사향공진단을 권합니다</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {[
              { icon: "😮‍💨", title: "만성피로·기력저하", desc: "충분히 자도 피로가 풀리지 않고, 기력이 전반적으로 떨어진 분" },
              { icon: "🧠", title: "뇌기능 회복", desc: "중풍 후 재활, 기억력 저하, 집중력 감소가 심한 분" },
              { icon: "💪", title: "남성 활력·스태미너", desc: "남성 호르몬 저하로 인한 활력 감소, 스태미너 회복이 필요한 분" },
              { icon: "🏥", title: "수술·항암 후 회복", desc: "큰 수술이나 항암 치료 후 원기 회복이 필요한 분" },
              { icon: "🎁", title: "건강 선물", desc: "부모님, 배우자 등 소중한 분께 드리는 최고급 건강 선물" },
              { icon: "👴", title: "어르신 원기보충", desc: "나이 들수록 줄어드는 기력을 보충하고 싶으신 어르신" },
            ].map((t) => (
              <div key={t.title} className="bg-white rounded-xl border border-[var(--border)] p-5">
                <p className="text-2xl mb-2">{t.icon}</p>
                <h3 className="font-bold mb-1">{t.title}</h3>
                <p className="text-sm text-[var(--text-muted)]">{t.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-[var(--brand-primary-light)] border border-[var(--brand-primary)] rounded-xl p-5">
            <p className="text-sm font-semibold text-[var(--brand-primary-dark)]">
              ⚠️ 체질에 따라 맞지 않을 수 있습니다. 평소 얼굴이 붉거나 열이 많은 분, 임산부는 반드시 상담 후 복용하세요.
              체질 확인 없이 처방하지 않습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 04 · 가격 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">Pricing</p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">사향공진단 가격</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-7">
              <p className="text-xs font-bold text-[var(--text-muted)] mb-2">처음 시작 · 효과 확인용</p>
              <p className="text-4xl font-extrabold text-[var(--brand-primary-dark)] mb-1">135만원</p>
              <p className="text-sm text-[var(--text-muted)]">사향공진단 30구</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-black text-white p-7">
              <p className="text-xs font-bold text-[var(--brand-primary)] mb-2">3개월+ 꾸준한 복용 · 최대 효과</p>
              <p className="text-4xl font-extrabold mb-1">350만원</p>
              <p className="text-sm text-white/60">사향공진단 100구</p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center">
            ※ 가격은 표시 시점 기준이며 변경될 수 있습니다. 처방은 상담 후 결정됩니다.
          </p>
        </div>
      </section>

      {/* 05 · E-E-A-T 원장 자격 */}
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
                <li>✔ 조제 전 과정 유튜브 공개 — "직접 만든 진짜 공진단" 채널 운영</li>
                <li>✔ 아버지 심방세동 회복에 직접 공진단 처방한 경험</li>
                <li>✔ 가족에게 먹이는 기준으로 제조</li>
                <li>✔ 식약처 인증 정품 사향 · CITES 부속서 I 원료만 사용</li>
              </ul>
              <a
                href={clinic.youtube.gongjindan}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-sm font-semibold hover:border-[var(--brand-primary)] transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-600" aria-hidden><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                사향 조제 과정 유튜브 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 06 · FAQ */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-extrabold">사향공진단 자주 묻는 질문</h2>
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
              ← 공진단 전체 라인업 보기 (녹용 2배 공진단 · 총명공진단)
            </Link>
          </div>
        </div>
      </section>

      {/* 07 · CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-3">Contact</p>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            체질 맞는 분께만 권합니다
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            사향공진단이 모든 분께 맞는 건 아닙니다. 상담 후 맞지 않으면 다른 처방을 안내드립니다.
            전화·카카오톡·비대면 신청 모두 가능합니다.
          </p>
          <div className="max-w-xl mx-auto">
            <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="사향공진단 상담 신청" />
          </div>
          <p className="mt-6 text-white/50 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분 · {clinic.contact.phone}
          </p>
        </div>
      </section>
    </>
  );
}
