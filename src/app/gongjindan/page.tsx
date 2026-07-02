import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CTAButtons } from "@/components/CTAButtons";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "공진단 | 원장 직접 제조 · 사향공진단·녹용 2배·총명공진단",
  description:
    "매일백세한의원 송원석 원장이 직접 제조하는 공진단. 2025년 19,000구+ 원내 직접 조제, 재처방률 72%. 사향공진단·녹용 2배 공진단·총명공진단. 비대면 전국 처방 가능. 02-2234-0102.",
  path: "/gongjindan",
  ogImage: "/photos/gongjindan-hero.webp",
  keywords: [
    "공진단",
    "사향공진단",
    "녹용공진단",
    "녹용 2배 공진단",
    "총명공진단",
    "공진단 가격",
    "공진단 처방",
    "공진단 한의원",
    "비대면 공진단",
    "원장 직접 제조 공진단",
    "중랑구 공진단",
    "먹골역 공진단",
  ],
});

const faqs = [
  {
    q: "사향공진단·녹용 2배 공진단·총명공진단 차이가 뭔가요?",
    a: "사향공진단은 천연 사향 100mg이 포함된 정통 처방으로 기력 상승과 뇌기능 회복에 효과적입니다. 녹용 2배 공진단은 사향 대신 녹용을 두 배로 늘려 체력·면역력 회복에 적합하며 가격 부담이 낮습니다. 총명공진단은 녹용 2배에 원지·석창포를 더한 수험생·고시생 전용 처방입니다. 어느 것이 맞는지는 복용 목적과 체질에 따라 달라지므로 상담이 필요합니다.",
  },
  {
    q: "공진단 가격은 얼마인가요?",
    a: "사향공진단은 30구 135만 원, 100구 350만 원입니다. 녹용 2배 공진단은 30구 42만 원, 120구 120만 원, 총명공진단은 30구 45만 원, 90구 108만 원입니다. 처음엔 30구로 시작해 효과를 확인 후 연장하는 분들이 많습니다.",
  },
  {
    q: "시중 가짜 사향이 걱정됩니다",
    a: "매일백세한의원은 유튜브 채널 '직접 만든 진짜 공진단'에서 사향 조제 전 과정과 진품 확인법을 공개합니다. 식약처 인증 정품 사향만 사용하며, 원장이 직접 제조합니다.",
  },
  {
    q: "비대면으로 처방받을 수 있나요?",
    a: "네, 가능합니다. 카카오톡 또는 전화(02-2234-0102) 문의 → 구글 설문지 작성 → 원장 전화 상담 → 직접 제조 후 전국 택배 발송(영업일 2~5일). 재진 환자는 절차가 더 간소화됩니다.",
  },
  {
    q: "효과가 얼마나 빨리 나타나나요?",
    a: "체질에 따라 다르지만 복용 후 1~2주 이내 수면의 질 개선이나 피로 감소를 먼저 느끼는 분들이 많습니다. 기력 회복은 보통 1개월 이상 복용 후 체감합니다. 재처방률 72%는 효과를 경험한 환자들이 반복 처방을 선택한 비율입니다.",
  },
];

const products = [
  {
    name: "사향공진단",
    badge: "PREMIUM",
    tagline: "정통 처방 · 기력·뇌기능",
    ingredients: "천연 사향 100mg · 녹용 · 당귀 · 산수유",
    target: "만성피로·기력저하·뇌기능 회복·남성 스태미너",
    price: "30구 135만 원 · 100구 350만 원",
    dark: true,
    href: "/gongjindan/sahyang",
  },
  {
    name: "녹용 2배 공진단",
    badge: "POPULAR",
    tagline: "체력·면역력 · 합리적 선택",
    ingredients: "녹용 2배 · 목향 · 당귀 · 산수유",
    target: "체력·면역력 회복·수술 후·항암 후 회복",
    price: "30구 42만 원 · 120구 120만 원",
    dark: false,
    href: "/gongjindan/nokyong",
  },
  {
    name: "총명공진단",
    badge: "STUDY",
    tagline: "수험생·고시생 전용",
    ingredients: "녹용 2배 · 원지 · 석창포 · 당귀 · 산수유",
    target: "수능·공무원·고시·면접 집중력·기억력·체력",
    price: "30구 45만 원 · 90구 108만 원",
    dark: false,
    href: "/gongjindan/chongmyeong",
  },
];

export default function GongjindanPage() {
  return (
    <>
      <JsonLd id="schema-gongjindan-faq" data={faqSchema(faqs)} />
      <JsonLd id="schema-gongjindan-product" data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "공진단",
        description: "매일백세한의원 송원석 원장이 직접 제조하는 정통 공진단. 사향공진단·녹용 2배 공진단·총명공진단.",
        brand: { "@type": "Brand", name: "매일백세한의원" },
        offers: {
          "@type": "Offer",
          price: "420000",
          priceCurrency: "KRW",
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: clinic.name },
        },
      }} />

      {/* 01 · HERO */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24 grid md:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white/10 order-2 md:order-1">
            <Image
              src="/photos/gongjindan-hero.webp"
              alt="매일백세한의원 공진단 — 원장 직접 제조"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[var(--brand-primary)] uppercase mb-5">
              <span className="w-8 h-px bg-[var(--brand-primary)]" />
              공진단 · 매일백세한의원
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.2] mb-5">
              원장이 직접 만든
              <br />
              <span className="text-[var(--brand-primary)]">진짜 공진단</span>
            </h1>
            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              사향·녹용·당귀·산수유를 한의원에서 직접 조제합니다.
              원장이 직접 복용하고 가족에게도 처방하는 공진단.
              비대면으로 전국 어디서나 받아보실 수 있습니다.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { num: "3,000회+", label: "누적 처방" },
                { num: "19,000구+", label: "2025년 직접 조제" },
                { num: "72%", label: "재처방률" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="border border-white/20 rounded-xl px-4 py-3 text-center"
                >
                  <p className="text-xl font-extrabold text-[var(--brand-primary)]">{b.num}</p>
                  <p className="text-xs text-white/60 mt-0.5">{b.label}</p>
                </div>
              ))}
            </div>
            <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="비대면 진료 신청" />
          </div>
        </div>
      </section>

      {/* 02 · TRUST STRIP */}
      <section className="bg-[var(--brand-primary)]">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "3,000회+", label: "누적 처방" },
              { num: "19,000구+", label: "2025년 직접 조제" },
              { num: "72%", label: "재처방률" },
              { num: "전국", label: "비대면 택배 처방" },
            ].map((s) => (
              <div key={s.label} className="border-l border-white/30 pl-4 text-left first:border-l-0 first:pl-0">
                <p className="text-xl md:text-2xl font-extrabold text-white">{s.num}</p>
                <p className="text-xs md:text-sm text-white/80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 · 제품 라인업 */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Products
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              3가지 공진단 처방
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-3 max-w-lg mx-auto">
              복용 목적과 체질에 따라 처방이 달라집니다. 어느 것이 맞는지 상담 후 결정합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {products.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className={`rounded-2xl border p-7 flex flex-col hover:ring-2 hover:ring-[var(--brand-primary)] transition ${
                  p.dark
                    ? "bg-black text-white border-white/10"
                    : "bg-[var(--surface-muted)] border-[var(--border)]"
                }`}
              >
                <p className={`text-[10px] tracking-[0.2em] font-bold mb-3 ${p.dark ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)]"}`}>
                  {p.badge}
                </p>
                <h3 className="text-2xl font-extrabold mb-1">{p.name}</h3>
                <p className={`text-sm font-semibold mb-5 ${p.dark ? "text-white/60" : "text-[var(--text-muted)]"}`}>
                  {p.tagline}
                </p>
                <dl className="space-y-3 text-sm flex-1">
                  <div>
                    <dt className={`text-xs font-bold mb-0.5 ${p.dark ? "text-white/40" : "text-[var(--text-muted)]"}`}>주요 성분</dt>
                    <dd className={p.dark ? "text-white/80" : "text-[var(--foreground)]"}>{p.ingredients}</dd>
                  </div>
                  <div>
                    <dt className={`text-xs font-bold mb-0.5 ${p.dark ? "text-white/40" : "text-[var(--text-muted)]"}`}>추천 대상</dt>
                    <dd className={p.dark ? "text-white/80" : "text-[var(--foreground)]"}>{p.target}</dd>
                  </div>
                  <div className="pt-3 border-t border-white/10">
                    <dt className={`text-xs font-bold mb-0.5 ${p.dark ? "text-white/40" : "text-[var(--text-muted)]"}`}>가격</dt>
                    <dd className={`font-bold ${p.dark ? "text-[var(--brand-primary)]" : "text-[var(--brand-primary-dark)]"}`}>{p.price}</dd>
                  </div>
                </dl>
                <p className={`mt-4 text-xs font-bold ${p.dark ? "text-white/40" : "text-[var(--text-muted)]"}`}>
                  자세히 보기 →
                </p>
              </Link>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
            ※ 가격은 표시 시점 기준이며 변경될 수 있습니다. 자세한 처방은 상담 시 안내드립니다.
          </p>
        </div>
      </section>

      {/* 04 · 원장 스토리 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Story
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              "직접 빚고, 직접 복용하고,
              <br />
              우리 아이도 먹입니다"
            </h2>
          </div>

          <div className="grid md:grid-cols-[200px_1fr] gap-8 items-start bg-white p-8 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[var(--surface-muted)] mx-auto w-40 md:w-full md:aspect-[3/4]">
              <Image
                src="/photos/director.webp"
                alt="매일백세한의원 송원석 원장"
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-muted)] tracking-widest mb-4">
                송원석 원장 · 매일백세한의원
              </p>
              <blockquote className="text-base md:text-lg leading-relaxed text-[var(--foreground)] space-y-4">
                <p>
                  아버지가 심방세동으로 응급 상황에 처했을 때, 제가 직접 공진단을
                  처방해 회복을 도왔습니다. 그 경험이 공진단에 대한 확신이 됐습니다.
                </p>
                <p>
                  사향은 유통 과정에서 가짜가 섞이는 일이 실제로 있습니다.
                  그래서 저는 유튜브 채널 <strong>&#39;직접 만든 진짜 공진단&#39;</strong>에
                  조제 전 과정과 진품 확인법을 직접 공개합니다.
                </p>
                <p>
                  가족에게 먹이는 기준으로 만듭니다.
                </p>
              </blockquote>
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={clinic.youtube.gongjindan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-sm font-semibold hover:border-[var(--brand-primary)] transition"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-600" aria-hidden>
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  직접 만든 진짜 공진단
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 · IMWEB 링크 배너 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-12 md:py-16 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-3">
            More Info
          </p>
          <h2 className="text-xl md:text-2xl font-extrabold mb-3">
            가격 상세·제조 갤러리·주문 안내
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-md mx-auto">
            공진단 제조 과정 사진, 인증서 샘플, 상세 가격표, 구매 안내는
            공진단 전용 페이지에서 확인하실 수 있습니다.
          </p>
          <a
            href="https://mail100gongjindan.imweb.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-black text-white font-bold text-sm hover:bg-[var(--brand-primary)] transition"
          >
            공진단 상세 정보 보기 <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* 06 · FAQ */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              FAQ
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              자주 묻는 질문
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-lg border border-[var(--border)] bg-white p-5 hover:border-[var(--brand-primary)] transition"
              >
                <summary className="cursor-pointer font-semibold flex items-start gap-2 list-none">
                  <span className="text-[var(--brand-primary)] font-bold shrink-0">Q.</span>
                  <span className="flex-1">{f.q}</span>
                  <span className="text-[var(--text-muted)] group-open:rotate-180 transition shrink-0">▾</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed pl-6">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 07 · FINAL CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-3">
            Contact
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            상담은 부담 없이,
            <br />
            처방은 체질 확인 후
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            안 맞는 분께는 권하지 않습니다. 전화·카카오톡·비대면 신청 모두 가능합니다.
          </p>
          <div className="max-w-xl mx-auto">
            <CTAButtons formUrl={clinic.contact.onlineFormGongjindan} formLabel="비대면 진료 신청" />
          </div>
          <p className="mt-6 text-white/50 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분 · {clinic.contact.phone}
          </p>
        </div>
      </section>
    </>
  );
}
