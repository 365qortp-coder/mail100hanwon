import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { clinic } from "@/data/clinic";
import { getColumnsBySection, getColumnUrl, getColumnImage, type ColumnMeta } from "@/lib/columns";

export const metadata: Metadata = buildMetadata({
  title: "공진단 | 원장 직접 제조 · 사향공진단·녹용 2배·총명공진단",
  description:
    "매일백세한의원 송원석 원장이 직접 제조하는 공진단. 2025년 19,000구+ 원내 직접 조제, 재처방률 72%. 사향공진단·녹용 2배 공진단·총명공진단. 비대면 전국 처방 가능. 0507-1467-0195.",
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
    a: "네, 가능합니다. 카카오톡 또는 전화(0507-1467-0195) 문의 → 구글 설문지 작성 → 원장 전화 상담 → 직접 제조 후 전국 택배 발송(영업일 2~5일). 재진 환자는 절차가 더 간소화됩니다.",
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

const eyebrow = (label: string, opts?: { center?: boolean; brand?: boolean; dark?: boolean }) => {
  const line = opts?.brand ? "bg-[var(--brand-primary)]" : opts?.dark ? "bg-white/20" : "bg-black/20";
  const text = opts?.brand ? "text-[var(--brand-primary)]" : opts?.dark ? "text-white/35" : "text-[#8C8A87]";
  return (
    <div className={`inline-flex items-center gap-3 mb-6 ${opts?.center ? "justify-center" : ""}`}>
      <span className={`h-px w-6 ${line}`} aria-hidden />
      <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${text}`}>{label}</span>
      {opts?.center && <span className={`h-px w-6 ${line}`} aria-hidden />}
    </div>
  );
};

function ContactButtons({ formLabel, center }: { formLabel: string; center?: boolean }) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:flex-wrap gap-3 ${
        center ? "sm:justify-center" : ""
      }`}
    >
      <a
        href={`tel:${clinic.contact.phoneClean}`}
        className="rn-btn-primary inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--brand-primary)] text-white text-sm font-bold"
      >
        전화 상담
      </a>
      <a
        href={clinic.contact.kakao}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#FAE100] text-[#3C1E1E] text-sm font-bold hover:brightness-95 transition"
      >
        카카오톡 상담
      </a>
      <a
        href={clinic.contact.onlineFormGongjindan}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:border-white/50 transition-colors"
      >
        {formLabel}
      </a>
    </div>
  );
}

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

      {/* ── 01 · HERO ── */}
      <section className="bg-[#111110] text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 pt-16 pb-24 md:pt-20 md:pb-32 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="sn-reveal order-2 md:order-1">
            <div className="relative aspect-[4/3] md:aspect-square rounded-[28px] overflow-hidden bg-white/[0.05]">
              <Image
                src="/photos/gongjindan-hero.webp"
                alt="매일백세한의원 공진단 — 원장 직접 제조"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          <div className="order-1 md:order-2 sn-reveal" style={{ transitionDelay: "90ms" }}>
            {eyebrow("공진단 · 매일백세한의원", { brand: true })}

            <h1 className="font-serif text-[2.5rem] md:text-[3.25rem] lg:text-[4rem] leading-[1.1] tracking-[-0.025em] text-white mb-6">
              원장이 직접 만든
              <br />
              <span className="text-[var(--brand-primary)]">진짜 공진단</span>
            </h1>

            <p className="text-base md:text-lg text-white/60 leading-[1.75] max-w-[440px] mb-9">
              사향·녹용·당귀·산수유를 한의원에서 직접 조제합니다.
              원장이 직접 복용하고 가족에게도 처방하는 공진단.
              비대면으로 전국 어디서나 받아보실 수 있습니다.
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-9 max-w-[440px]">
              {[
                { num: "3,000회+", label: "누적 처방" },
                { num: "19,000구+", label: "2025년 직접 조제" },
                { num: "72%", label: "재처방률" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="border border-white/[0.15] rounded-2xl px-2 py-3 text-center"
                >
                  <p className="text-base sm:text-lg font-extrabold text-[var(--brand-primary)] whitespace-nowrap">
                    {b.num}
                  </p>
                  <p className="text-[11px] text-white/40 mt-1 leading-snug">{b.label}</p>
                </div>
              ))}
            </div>

            <ContactButtons formLabel="비대면 진료 신청" />
          </div>
        </div>
      </section>

      {/* ── 02 · TRUST STRIP ── */}
      <section className="bg-[var(--brand-primary)]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {[
              { num: "3,000회+", label: "누적 처방" },
              { num: "19,000구+", label: "2025년 직접 조제" },
              { num: "72%", label: "재처방률" },
              { num: "전국", label: "비대면 택배 처방" },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`pl-4 border-l border-white/30 ${i === 0 ? "border-l-0 pl-0 md:border-l md:pl-4" : ""}`}
              >
                <p className="font-serif text-2xl md:text-3xl font-bold text-white tracking-[-0.02em]">{s.num}</p>
                <p className="text-xs text-white/70 mt-1.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · 제품 라인업 ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32">
          <div className="text-center mb-14 sn-reveal">
            {eyebrow("Products", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              3가지 공진단 처방
            </h2>
            <p className="text-sm text-[#525252] mt-4 max-w-lg mx-auto leading-[1.75]">
              복용 목적과 체질에 따라 처방이 달라집니다. 어느 것이 맞는지 상담 후 결정합니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <div key={p.name} className="sn-reveal" style={{ transitionDelay: `${i * 85}ms` }}>
                <Link
                  href={p.href}
                  className={`rn-card group flex h-full flex-col rounded-[22px] border p-7 ${
                    p.dark
                      ? "bg-[#0a0a0a] text-white border-white/[0.07] hover:border-white/20"
                      : "bg-white border-black/[0.07] hover:border-black/20"
                  }`}
                >
                  <p className={`text-[10px] tracking-[0.22em] font-bold uppercase mb-4 ${p.dark ? "text-[var(--brand-primary)]" : "text-[#8C8A87]"}`}>
                    {p.badge}
                  </p>
                  <h3 className={`font-serif text-[1.45rem] font-bold mb-1.5 tracking-[-0.02em] ${p.dark ? "text-white" : "text-[#0a0a0a]"}`}>
                    {p.name}
                  </h3>
                  <p className={`text-sm font-semibold mb-6 ${p.dark ? "text-white/50" : "text-[#8C8A87]"}`}>
                    {p.tagline}
                  </p>

                  <dl className="space-y-4 text-sm flex-1">
                    <div>
                      <dt className={`text-[10px] font-bold tracking-[0.12em] uppercase mb-1 ${p.dark ? "text-white/30" : "text-[#8C8A87]"}`}>
                        주요 성분
                      </dt>
                      <dd className={`leading-[1.7] ${p.dark ? "text-white/80" : "text-[#525252]"}`}>{p.ingredients}</dd>
                    </div>
                    <div>
                      <dt className={`text-[10px] font-bold tracking-[0.12em] uppercase mb-1 ${p.dark ? "text-white/30" : "text-[#8C8A87]"}`}>
                        추천 대상
                      </dt>
                      <dd className={`leading-[1.7] ${p.dark ? "text-white/80" : "text-[#525252]"}`}>{p.target}</dd>
                    </div>
                    <div className={`pt-4 border-t ${p.dark ? "border-white/10" : "border-black/[0.06]"}`}>
                      <dt className={`text-[10px] font-bold tracking-[0.12em] uppercase mb-1 ${p.dark ? "text-white/30" : "text-[#8C8A87]"}`}>
                        가격
                      </dt>
                      <dd className={`font-bold ${p.dark ? "text-[var(--brand-primary)]" : "text-[var(--brand-primary-dark)]"}`}>
                        {p.price}
                      </dd>
                    </div>
                  </dl>

                  <span className={`rn-arrow mt-6 pt-5 border-t inline-flex items-center gap-2 text-sm font-bold ${
                    p.dark ? "border-white/10 text-white/70" : "border-black/[0.06] text-[#0F0D0A]"
                  }`}>
                    자세히 보기 <span aria-hidden>→</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#8C8A87] mt-6 text-center">
            ※ 가격은 표시 시점 기준이며 변경될 수 있습니다. 자세한 처방은 상담 시 안내드립니다.
          </p>
        </div>
      </section>

      {/* ── 04 · 원장 스토리 ── */}
      <section className="bg-[#F8F6F2] border-t border-black/[0.05]">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-24 md:py-32">
          <div className="text-center mb-12 sn-reveal">
            {eyebrow("Story", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl leading-[1.35] tracking-[-0.025em] text-[#0a0a0a]">
              "직접 빚고, <span className="whitespace-nowrap">직접 복용하고,</span>
              <br />
              우리 아이도 먹입니다"
            </h2>
          </div>

          <div className="sn-reveal bg-white rounded-[22px] border border-black/[0.07] p-8 md:p-10" style={{ transitionDelay: "80ms" }}>
            <div className="grid md:grid-cols-[180px_1fr] gap-8 md:gap-10 items-start">
              <div className="relative aspect-[3/4] rounded-[18px] overflow-hidden bg-[#EBE7DF] w-36 md:w-full mx-auto">
                <Image
                  src="/photos/director.webp"
                  alt="매일백세한의원 송원석 원장"
                  fill
                  className="object-cover"
                  sizes="200px"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#8C8A87] tracking-[0.2em] uppercase mb-5">
                  송원석 원장 · 매일백세한의원
                </p>
                <blockquote className="text-base md:text-[1.05rem] leading-[1.8] text-[#0a0a0a] space-y-5">
                  <p>
                    아버지가 심방세동으로 응급 상황에 처했을 때, 제가 직접 공진단을
                    처방해 회복을 도왔습니다. 그 경험이 공진단에 대한 확신이 됐습니다.
                  </p>
                  <p className="text-[#525252]">
                    사향은 유통 과정에서 가짜가 섞이는 일이 실제로 있습니다.
                    그래서 저는 유튜브 채널 <strong className="text-[#0a0a0a]">&#39;직접 만든 진짜 공진단&#39;</strong>에
                    조제 전 과정과 진품 확인법을 직접 공개합니다.
                  </p>
                  <p className="font-bold text-[var(--brand-primary)]">
                    가족에게 먹이는 기준으로 만듭니다.
                  </p>
                </blockquote>
                <div className="mt-7 flex flex-wrap gap-2">
                  <a
                    href={clinic.youtube.gongjindan}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F8F6F2] border border-black/[0.08] text-sm font-semibold text-[#0a0a0a] hover:border-black/25 transition-colors duration-300"
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
        </div>
      </section>

      {/* ── 05 · IMWEB 링크 배너 ── */}
      <section className="bg-[#0a0a0a] text-white overflow-hidden">
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-20 md:py-28 text-center sn-reveal">
          {eyebrow("More Info", { center: true, brand: true })}
          <h2 className="font-serif text-2xl md:text-[2.1rem] leading-[1.35] tracking-[-0.025em] mb-4">
            가격 상세·제조 갤러리·주문 안내
          </h2>
          <p className="text-sm md:text-base text-white/50 mb-10 max-w-md mx-auto leading-[1.8]">
            공진단 제조 과정 사진, 인증서 샘플, 상세 가격표, 구매 안내는
            공진단 전용 페이지에서 확인하실 수 있습니다.
          </p>
          <a
            href="https://mail100gongjindan.imweb.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="rn-btn-primary rn-arrow inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#0a0a0a] font-bold text-sm hover:bg-[var(--brand-primary)] hover:text-white"
          >
            공진단 상세 정보 보기 <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* ── 06 · FAQ ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-24 md:py-28">
          <div className="text-center mb-14 sn-reveal">
            {eyebrow("FAQ", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-3 sn-reveal" style={{ transitionDelay: "80ms" }}>
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-black/[0.07] bg-white p-5 md:p-6 hover:border-black/[0.18] transition-colors duration-300"
              >
                <summary className="cursor-pointer flex items-start gap-3 list-none select-none">
                  <span className="text-[#0F0D0A] font-bold shrink-0 text-sm pt-0.5">Q.</span>
                  <span className="flex-1 font-semibold text-[#0a0a0a] text-sm md:text-[15px] leading-snug">{f.q}</span>
                  <span
                    className="text-[#888] shrink-0 text-xs mt-1 group-open:rotate-180"
                    style={{ transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)" }}
                    aria-hidden
                  >
                    ▾
                  </span>
                </summary>
                <p className="mt-4 text-sm text-[#525252] leading-[1.8] pl-7">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 · 공진단 칼럼 ── */}
      <GongjindanColumnsSection />

      {/* ── 08 · FINAL CTA ── */}
      <section className="bg-[#0a0a0a] text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32 text-center sn-reveal">
          {eyebrow("Contact", { center: true, brand: true })}
          <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.15] tracking-[-0.025em] mb-6">
            상담은 부담 없이,
            <br />
            <span className="text-white/70">처방은 체질 확인 후</span>
          </h2>
          <p className="text-white/45 mb-12 max-w-xl mx-auto text-base leading-[1.8]">
            안 맞는 분께는 권하지 않습니다. 전화·카카오톡·비대면 신청 모두 가능합니다.
          </p>
          <ContactButtons formLabel="비대면 진료 신청" center />
          <p className="mt-10 text-white/35 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분 · {clinic.contact.phone}
          </p>
        </div>
      </section>


    </>
  );
}

function GongjindanColumnsSection() {
  const cols = getColumnsBySection("gongjindan").slice(0, 3);
  if (!cols.length) return null;
  return (
    <section className="bg-[#FAFAFA] border-t border-black/[0.05]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-20 md:py-28">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12 sn-reveal">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="h-px w-6 bg-black/20" aria-hidden />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8A87]">Column</span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              공진단 칼럼
            </h2>
          </div>
          <Link
            href="/gongjindan/columns"
            className="rn-arrow inline-flex items-center gap-2 text-sm font-bold text-[#0F0D0A] shrink-0"
          >
            전체 보기 <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {cols.map((c: ColumnMeta, i: number) => {
            const img = getColumnImage(c);
            return (
              <div key={c.slug} className="sn-reveal" style={{ transitionDelay: `${i * 85}ms` }}>
                <Link
                  href={getColumnUrl(c)}
                  className="rn-card group block h-full rounded-[22px] border border-black/[0.07] hover:border-black/20 bg-white overflow-hidden"
                >
                  {img && (
                    <div className="relative aspect-video w-full overflow-hidden bg-[#EBE7DF]">
                      <Image
                        src={img}
                        alt={c.imageAlt ?? c.title}
                        fill
                        className="rn-zoom object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-[#8C8A87] mb-2">{c.date}</p>
                    <p className="font-bold text-[15px] leading-snug line-clamp-2 text-[#0a0a0a] group-hover:text-[var(--brand-primary)] transition-colors duration-200">
                      {c.title}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
