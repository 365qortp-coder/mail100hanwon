import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { faqSchema, breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CTAButtons } from "@/components/CTAButtons";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "총명공진단 | 수험생·고시생 집중력·기억력 · 가격·효능 총정리",
  description:
    "매일백세한의원 총명공진단. 녹용 2배 + 원지·석창포 추가 처방. 30구 45만원, 90구 108만원. 수능·공무원·고시 수험생 집중력·기억력·체력 삼박자. 원장 직접 조제. 02-2234-0102.",
  path: "/gongjindan/chongmyeong",
  ogImage: "/photos/chongmyeong-product.webp",
  keywords: [
    "총명공진단",
    "수험생 공진단",
    "수능 공진단",
    "집중력 공진단",
    "기억력 공진단",
    "고시생 공진단",
    "총명공진단 효능",
    "총명공진단 가격",
    "총명공진단 부작용",
    "두뇌 공진단",
    "공무원시험 공진단",
    "석창포 원지 공진단",
  ],
});

const faqs = [
  {
    q: "총명공진단 가격은 얼마인가요?",
    a: "30구 45만 원, 90구 108만 원입니다. 수험 시즌(수능 3개월 전)에 시작하시는 분들이 많습니다. 가격은 시점에 따라 변동될 수 있으므로 상담 시 확인 부탁드립니다.",
  },
  {
    q: "원지와 석창포가 무엇인가요?",
    a: "원지(遠志)는 심신 안정, 기억력·집중력 강화에 쓰이는 약재입니다. 뇌세포 보호와 기억 형성에 도움을 준다는 연구가 있습니다. 석창포(石菖蒲)는 두뇌 각성, 집중력 향상, 안정감에 활용되는 약재로 '총명탕'의 핵심 성분입니다. 이 두 성분을 녹용 2배 공진단에 추가한 것이 총명공진단입니다.",
  },
  {
    q: "수능·시험 몇 달 전부터 복용해야 하나요?",
    a: "효과가 체감되기까지 보통 2~4주 소요됩니다. 수능 기준 3개월 전(8월경) 시작하면 시험 당일까지 꾸준한 효과를 기대할 수 있습니다. 30구(1개월분)로 먼저 시작해 효과를 확인 후 연장하는 방법을 권장합니다.",
  },
  {
    q: "초중고 학생도 복용할 수 있나요?",
    a: "중학생 이상이라면 일반적으로 복용 가능하지만, 성장기 어린이·청소년은 체질과 성장 상태에 따라 처방이 달라집니다. 반드시 상담 후 복용하도록 하세요.",
  },
  {
    q: "총명공진단 부작용이 있나요?",
    a: "원지는 위장을 자극할 수 있어 소화 기능이 약한 분은 복용 초기 소화 불편이 생길 수 있습니다. 석창포는 대체로 부작용이 적습니다. 열이 많은 체질이라면 상담 후 처방 여부를 결정합니다. 체질 확인 없이 처방하지 않습니다.",
  },
  {
    q: "녹용 2배 공진단과 어떻게 다른가요?",
    a: "총명공진단은 녹용 2배 공진단에 원지와 석창포를 추가한 처방입니다. 집중력·기억력·두뇌 활성화에 특화되어 있으며, 수험생이나 고시생처럼 장기간 뇌를 혹사하는 분께 더 적합합니다. 단순 체력·면역력 회복이 목적이라면 녹용 2배 공진단이 더 적합할 수 있습니다.",
  },
];

export default function ChongmyeongPage() {
  return (
    <>
      <JsonLd id="ld-chongmyeong-breadcrumb" data={breadcrumbSchema([
        { name: "홈", url: clinic.url },
        { name: "공진단", url: `${clinic.url}/gongjindan` },
        { name: "총명공진단", url: `${clinic.url}/gongjindan/chongmyeong` },
      ])} />
      <JsonLd id="ld-chongmyeong-faq" data={faqSchema(faqs)} />
      <JsonLd id="ld-chongmyeong-product" data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "총명공진단",
        description: "수험생·고시생 전용 공진단. 녹용 2배 + 원지·석창포 추가. 집중력·기억력·체력 삼박자. 원장 직접 조제.",
        image: `${clinic.url}/photos/chongmyeong-product.webp`,
        url: `${clinic.url}/gongjindan/chongmyeong`,
        brand: { "@type": "Brand", name: clinic.name },
        manufacturer: { "@id": `${clinic.url}#clinic` },
        offers: [
          {
            "@type": "Offer",
            name: "총명공진단 30구",
            price: 450000,
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
            seller: { "@id": `${clinic.url}#clinic` },
          },
          {
            "@type": "Offer",
            name: "총명공진단 90구",
            price: 1080000,
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
        <span className="text-[var(--foreground)] font-semibold">총명공진단</span>
      </nav>

      {/* 01 · HERO */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-14 md:py-20">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-4">
            총명공진단 · 매일백세한의원
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            총명공진단 —<br />
            <span className="text-[var(--brand-primary)]">수험생·고시생</span> 집중력·기억력·체력
          </h1>
          <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-2xl">
            녹용 2배 공진단에 원지(遠志)와 석창포(石菖蒲)를 추가한 수험생 전용 처방입니다.
            집중력·기억력·체력 삼박자를 한 번에. 수능·공무원·고시·면접 준비생에게 적합합니다.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { num: "녹용 2배", label: "체력·면역" },
              { num: "원지", label: "기억력 강화" },
              { num: "석창포", label: "집중력 향상" },
              { num: "30구~", label: "45만원부터" },
            ].map((b) => (
              <div key={b.label} className="bg-white border border-[var(--border)] rounded-xl px-4 py-3 text-center shadow-sm">
                <p className="text-lg font-extrabold text-[var(--brand-primary)]">{b.num}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{b.label}</p>
              </div>
            ))}
          </div>
          <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="총명공진단 상담 신청" />
        </div>
      </section>

      {/* 02 · 성분 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">Ingredient</p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">총명공진단 5가지 성분</h2>
            <p className="text-sm text-[var(--text-muted)] mt-3">녹용 2배 공진단 기본 구성 + 두뇌 특화 성분 2종 추가</p>
          </div>

          <div className="space-y-4">
            {[
              { name: "원지(遠志)", role: "두뇌 특화", desc: "심신 안정과 기억력·집중력 강화에 쓰이는 약재. 뇌세포 보호와 기억 형성에 도움을 줍니다. 총명탕의 핵심 성분 중 하나.", highlight: true },
              { name: "석창포(石菖蒲)", role: "두뇌 특화", desc: "두뇌 각성, 집중력 향상, 심신 안정에 활용. 오랜 공부로 지친 뇌를 활성화하고 안정감을 줍니다. 총명탕의 핵심 성분.", highlight: true },
              { name: "녹용(鹿茸) 2배", role: "체력·면역", desc: "조혈 작용, 면역력 강화, 원기 보충. 공부와 체력 소모가 큰 수험생에게 필수적인 체력 기반." },
              { name: "당귀(當歸)", role: "혈액 순환", desc: "혈액 순환 개선, 빈혈 예방. 장시간 앉아 공부하는 수험생의 혈액 순환 개선." },
              { name: "산수유(山茱萸)", role: "균형 조절", desc: "신장 기능 보강, 다른 약재의 균형 조절. 과도한 자극 억제." },
            ].map((s) => (
              <div key={s.name} className={`rounded-xl border p-5 ${s.highlight ? "bg-black text-white border-[var(--brand-primary)]" : "bg-[var(--surface-muted)] border-[var(--border)]"}`}>
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

      {/* 03 · 추천 대상 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">For You</p>
            <h2 className="text-2xl md:text-4xl font-extrabold">이런 분께 총명공진단을 권합니다</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "📚", title: "수능 수험생", desc: "수능 3개월 전부터 복용해 집중력·기억력·체력을 끌어올리고 싶은 고3·재수생" },
              { icon: "📝", title: "공무원·고시 준비생", desc: "장기간 수험 생활로 뇌가 지치고 집중력이 떨어진 공시생·고시생" },
              { icon: "🧑‍💻", title: "직장인 자격증 준비", desc: "직장 생활과 병행하며 자격증 공부하는 분들의 두뇌 피로 회복" },
              { icon: "🎓", title: "대학원생·연구직", desc: "논문 작성, 연구 집중 등 고강도 뇌 활동이 필요한 분" },
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
            <h2 className="text-2xl md:text-4xl font-extrabold">총명공진단 가격</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-7">
              <p className="text-xs font-bold text-[var(--text-muted)] mb-2">1개월 · 효과 확인용</p>
              <p className="text-4xl font-extrabold text-[var(--brand-primary-dark)] mb-1">45만원</p>
              <p className="text-sm text-[var(--text-muted)]">총명공진단 30구</p>
            </div>
            <div className="rounded-2xl border-2 border-black bg-black text-white p-7">
              <p className="text-xs font-bold text-[var(--brand-primary)] mb-2">3개월 수험 완주 · 최대 효과</p>
              <p className="text-4xl font-extrabold mb-1">108만원</p>
              <p className="text-sm text-white/60">총명공진단 90구</p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)] text-center">
            ※ 가격은 표시 시점 기준이며 변경될 수 있습니다. 처방은 상담 후 결정됩니다.
          </p>
        </div>
      </section>

      {/* 05 · FAQ */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">FAQ</p>
            <h2 className="text-2xl md:text-3xl font-extrabold">총명공진단 자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details key={i} className="group rounded-lg border border-[var(--border)] bg-white p-5 hover:border-[var(--brand-primary)] transition">
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
              ← 공진단 전체 라인업 보기 (사향공진단 · 녹용 2배 공진단)
            </Link>
          </div>
        </div>
      </section>

      {/* 06 · CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-3">Contact</p>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            수험 시즌 시작 전 상담하세요
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            수능 3개월 전이 최적 시작 시기입니다. 체질 확인 후 처방합니다.
            전화·카카오톡·비대면 신청 모두 가능합니다.
          </p>
          <div className="max-w-xl mx-auto">
            <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="총명공진단 상담 신청" />
          </div>
          <p className="mt-6 text-white/50 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분 · {clinic.contact.phone}
          </p>
        </div>
      </section>
    </>
  );
}
