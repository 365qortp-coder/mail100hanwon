import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { clinic } from "@/data/clinic";
import { getColumnsBySection, getColumnUrl, getColumnImage, type ColumnMeta } from "@/lib/columns";

export const metadata: Metadata = buildMetadata({
  title: "무릎관절 NMC | 염증 제어·가동성 회복·구조 재건 한방 치료",
  description:
    "매일백세한의원의 NMC 무릎 치료 프로토콜. N(염증 무력화)·M(가동성 회복)·C(구조 재건) 3단계. 침·한약 병행으로 무릎 통증의 근원을 다스립니다. 먹골역 도보 5분. 0507-1467-0195.",
  path: "/nmc",
  ogImage: "/photos/pain.webp",
  keywords: [
    "무릎 통증 한의원",
    "퇴행성관절염 한의원",
    "무릎 침 치료",
    "무릎 한약",
    "NMC 무릎",
    "중랑구 무릎 한의원",
    "먹골역 무릎 한의원",
    "무릎 초음파 진단",
    "관절염 한방 치료",
    "무릎 연골 한의원",
  ],
});

const faqs = [
  {
    q: "NMC 프로토콜이란 무엇인가요?",
    a: "NMC는 Neutralize(염증 무력화)·Mobility(가동성 회복)·Construct(구조 재건)의 약자입니다. 무릎 통증의 근원인 염증을 먼저 제어(N, 약 1.5개월)한 뒤, 근골격 구조를 강화(C, 약 3개월)해 통증 없이 걸을 수 있는 무릎(M)을 만드는 한방 치료 프로토콜입니다.",
  },
  {
    q: "침 치료와 한약을 함께 받아야 하나요?",
    a: "기본적으로 침 치료와 한약 처방을 병행합니다. 침 치료는 주 2회(염증 제어 단계) 또는 주 1회(구조 강화 단계)이며, 한약은 각 단계에 맞춘 처방을 드립니다. 상황에 따라 조정 가능하니 상담 시 안내드립니다.",
  },
  {
    q: "연골이 재생되나요?",
    a: "연골은 재생되지 않습니다. NMC 프로토콜의 목표는 '연골 재생'이 아닌 염증 제어를 통한 통증 감소, 활막 두께 감소, WOMAC 기능 스코어 개선, 연골 마모 속도를 늦추는 것입니다. 치료 효과는 개인에 따라 다를 수 있습니다.",
  },
  {
    q: "초음파 진단이 필요한가요?",
    a: "초음파 진단은 염증 상태(활막 두께, 관절 삼출)를 객관적으로 확인하고 치료 단계를 결정하는 데 도움이 됩니다. 자가진단(WOMAC 문진)과 초음파 진단을 함께 활용합니다.",
  },
  {
    q: "치료 기간은 얼마나 걸리나요?",
    a: "염증 제어 단계(N)가 약 1.5개월, 구조 강화 단계(C)가 약 3개월로 총 4~5개월이 기본입니다. 초음파 재측정과 WOMAC 재검사를 통해 단계 전환 시점을 결정하며, 개인 상태에 따라 달라질 수 있습니다.",
  },
];

const eyebrow = (label: string, opts?: { center?: boolean; brand?: boolean; dark?: boolean }) => {
  const line = opts?.dark ? "bg-white/20" : opts?.brand ? "bg-[var(--brand-primary)]" : "bg-black/20";
  const text = opts?.dark ? "text-[var(--brand-primary)]" : opts?.brand ? "text-[var(--brand-primary)]" : "text-[#8C8A87]";
  return (
    <div className={`inline-flex items-center gap-3 mb-6 ${opts?.center ? "justify-center" : ""}`}>
      <span className={`h-px w-6 ${line}`} aria-hidden />
      <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${text}`}>{label}</span>
      {opts?.center && <span className={`h-px w-6 ${line}`} aria-hidden />}
    </div>
  );
};

const IconCalendar = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect width="18" height="18" x="3" y="4" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const IconStethoscope = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const IconPhone = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const process = [
  { step: "01", title: "초음파 진단", desc: "활막 두께·관절 삼출을 확인해 염증 정도를 객관적으로 파악합니다." },
  { step: "02", title: "WOMAC 자가진단 검사", desc: "통증·강직·기능 3개 항목으로 현재 무릎 기능 수준을 수치화합니다." },
  { step: "03", title: "N단계 → 염증 제어 (약 1.5개월)", desc: "침 주 2회 + 소염 한약으로 활막 염증을 제어합니다." },
  { step: "04", title: "초음파 재측정 + WOMAC 재검사", desc: "염증 제어 확인 후 C단계로 전환 시점을 결정합니다." },
  { step: "05", title: "C단계 → 구조 강화 (약 3개월)", desc: "침 주 1회 + 근골격 강화 한약 + 등척성 운동 처방으로 관절 부하를 분산합니다." },
];

const evidence = [
  {
    label: "침 치료 효과",
    value: "17 RCT · 4,774명 메타분석에서 통증 SMD 유의 개선",
    cite: "PMC6398067, 2019",
  },
  {
    label: "침 지속 효과",
    value: "단기 침 치료 후 4.5개월 통증 감소 유지",
    cite: "Curr Pain Headache Rep, 2024",
  },
  {
    label: "한약(56 RCTs)",
    value: "IL-1β·TNF-α 억제 한약재가 관절염 통증·기능에 유의 개선",
    cite: "PMC8759838, Liao et al. 2022",
  },
  {
    label: "운동 병행",
    value: "침+운동 병행이 단독 치료 대비 기능 스코어 더 크게 개선",
    cite: "J Orthop Surg Res, 2023",
  },
];

export default function NMCPage() {
  return (
    <>
      <JsonLd id="schema-nmc-faq" data={faqSchema(faqs)} />

      {/* ── 01 · HERO ── */}
      <section className="bg-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 pt-16 pb-24 md:pt-20 md:pb-32 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="order-2 md:order-1 sn-reveal">
            <div className="rounded-[24px] bg-black/[0.04] p-2 ring-1 ring-black/[0.06]">
              <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#E8E3D9] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
                <Image
                  src="/photos/pain.webp"
                  alt="매일백세한의원 무릎관절 NMC 치료"
                  fill
                  priority
                  className="object-cover object-[center_20%]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2 sn-reveal" style={{ transitionDelay: "80ms" }}>
            {eyebrow("NMC 무릎 · 매일백세한의원", { brand: true })}

            <h1 className="font-serif text-[1.85rem] sm:text-[2.35rem] md:text-[2.2rem] lg:text-[2.6rem] xl:text-[3.25rem] leading-[1.2] tracking-[-0.025em] text-[#0a0a0a] mb-6">
              재발하는 무릎 통증
              <br />
              <span className="text-[var(--brand-primary)]">청염과 강화가 답입니다</span>
            </h1>

            <p className="text-base md:text-[1.05rem] text-[#525252] leading-[1.75] max-w-[440px] mb-10">
              염증을 먼저 잡고(N), 근골격 구조를 강화해(C),
              통증 없이 걷는 무릎(M)을 목표로 합니다.
              침·한약 병행 NMC 프로토콜.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href={clinic.contact.naverBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="rn-btn-primary inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[var(--brand-primary)] text-white text-sm font-bold"
              >
                {IconCalendar}
                무릎 초음파 진단 예약
              </a>
              <a
                href="https://maeilbaeksae-knee.vercel.app/cheongnyeomdan_landing"
                target="_blank"
                rel="noopener noreferrer"
                className="rn-arrow inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-black/[0.14] text-[#0a0a0a] text-sm font-semibold hover:border-black/30 transition-colors duration-300"
              >
                무릎 자가진단 <span aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 · NMC 3단계 프로토콜 ── */}
      <section className="bg-[#F8F6F2] border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32">
          <div className="text-center mb-16 sn-reveal">
            {eyebrow("Protocol", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              NMC 3단계 프로토콜
            </h2>
            <p className="text-sm text-[#525252] mt-4 max-w-lg mx-auto leading-[1.75]">
              염증을 먼저 제어하지 않으면 구조 강화가 오히려 통증을 악화시킵니다.
              순서가 핵심입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* N */}
            <div className="sn-reveal">
              <div className="rn-card h-full flex flex-col rounded-[22px] border border-black/[0.07] bg-white p-7 hover:border-black/20">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary-light)] flex items-center justify-center mb-6">
                  <span className="font-serif text-2xl font-bold text-[var(--brand-primary)]">N</span>
                </div>
                <p className="text-[10px] tracking-[0.2em] font-bold text-[#8C8A87] uppercase mb-3">STEP 1 · 약 1.5개월</p>
                <h3 className="font-serif text-[1.35rem] font-bold text-[#0a0a0a] mb-1.5">Neutralize</h3>
                <p className="text-[15px] font-bold text-[var(--brand-primary)] mb-4">염증 무력화</p>
                <p className="text-sm text-[#525252] leading-[1.75] mb-6 flex-1">
                  활막 염증을 제어해 통증과 부종을 줄입니다.
                  IL-1β·TNF-α 억제 한약재 병행.
                </p>
                <ul className="text-xs text-[#525252] space-y-2 pt-5 border-t border-black/[0.06]">
                  <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>침 치료 주 2회 · 30분</li>
                  <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>소염 한약 처방</li>
                  <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>4~6주 후 초음파 재측정</li>
                </ul>
              </div>
            </div>

            {/* M */}
            <div className="sn-reveal" style={{ transitionDelay: "85ms" }}>
              <div className="rn-card h-full flex flex-col rounded-[22px] border border-white/[0.06] bg-[#0a0a0a] p-7 hover:border-white/20">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
                  <span className="font-serif text-2xl font-bold text-[var(--brand-primary)]">M</span>
                </div>
                <p className="text-[10px] tracking-[0.2em] font-bold text-white/35 uppercase mb-3">GOAL · 치료의 목표</p>
                <h3 className="font-serif text-[1.35rem] font-bold text-white mb-1.5">Mobility</h3>
                <p className="text-[15px] font-bold text-[var(--brand-primary)] mb-4">가동성 회복</p>
                <p className="text-sm text-white/55 leading-[1.75] mb-6 flex-1">
                  통증 없이 다시 걷는 무릎.
                  N과 C가 함께 향하는 결과입니다.
                </p>
                <p className="text-xs text-white/40 leading-[1.75] pt-5 border-t border-white/[0.08]">
                  계단 오르내리기, 장거리 보행, 앉았다 일어나기 — 일상으로 돌아가는 것이 목표입니다.
                </p>
              </div>
            </div>

            {/* C */}
            <div className="sn-reveal" style={{ transitionDelay: "170ms" }}>
              <div className="rn-card h-full flex flex-col rounded-[22px] border border-black/[0.07] bg-white p-7 hover:border-black/20">
                <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary-light)] flex items-center justify-center mb-6">
                  <span className="font-serif text-2xl font-bold text-[var(--brand-primary)]">C</span>
                </div>
                <p className="text-[10px] tracking-[0.2em] font-bold text-[#8C8A87] uppercase mb-3">STEP 2 · 약 3개월</p>
                <h3 className="font-serif text-[1.35rem] font-bold text-[#0a0a0a] mb-1.5">Construct</h3>
                <p className="text-[15px] font-bold text-[var(--brand-primary)] mb-4">구조 재건</p>
                <p className="text-sm text-[#525252] leading-[1.75] mb-6 flex-1">
                  대퇴사두근 강화로 관절 부하를 분산합니다.
                  연골 마모 속도를 늦추는 것이 목표입니다.
                </p>
                <ul className="text-xs text-[#525252] space-y-2 pt-5 border-t border-black/[0.06]">
                  <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>침 치료 주 1회 + 근력 강화 경혈</li>
                  <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>근골격 강화 한약 처방</li>
                  <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>운동 처방 병행 (등척성 수축 등)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 · 치료 근거 ── */}
      <section className="bg-white border-t border-black/[0.05]">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-24 md:py-32">
          <div className="text-center mb-14 sn-reveal">
            {eyebrow("Evidence", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              논문 근거 기반 치료
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {evidence.map((item, i) => (
              <div
                key={item.label}
                className="sn-reveal rounded-[20px] bg-[#F8F6F2] border border-black/[0.05] p-6 md:p-7 hover:border-black/[0.12] transition-colors duration-300"
                style={{ transitionDelay: `${(i % 2) * 70}ms` }}
              >
                <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[var(--brand-primary)] mb-3">{item.label}</p>
                <p className="text-sm leading-[1.75] text-[#0a0a0a] mb-3">{item.value}</p>
                <p className="text-xs text-[#8C8A87]">{item.cite}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#8C8A87] mt-6 text-center sn-reveal">
            ※ 치료 효과는 개인에 따라 다를 수 있습니다.
          </p>
        </div>
      </section>

      {/* ── 05 · 자가진단 안내 ── */}
      <section className="bg-white border-t border-black/[0.05]">
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-24 md:py-28 text-center sn-reveal">
          {eyebrow("Self Check", { center: true })}
          <h2 className="font-serif text-3xl md:text-4xl leading-[1.3] tracking-[-0.025em] text-[#0a0a0a] mb-5">
            지금 내 무릎 상태,
            <br />
            14문항으로 확인해보세요
          </h2>
          <p className="text-sm md:text-base text-[#525252] mb-10 max-w-md mx-auto leading-[1.8]">
            WOMAC 기반 자가진단으로 염증 단계와 치료 방향을 파악할 수 있습니다.
          </p>
          <a
            href="https://maeilbaeksae-knee.vercel.app/cheongnyeomdan_landing"
            target="_blank"
            rel="noopener noreferrer"
            className="rn-btn-primary inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[var(--brand-primary)] text-white text-sm font-bold"
          >
            {IconStethoscope}
            무릎 자가진단 시작하기 <span aria-hidden>→</span>
          </a>
          <p className="text-xs text-[#8C8A87] mt-6">
            진단 결과는 참고용이며, 정확한 치료 방향은 내원 상담을 통해 확인합니다.
          </p>
        </div>
      </section>

      {/* ── 06 · 치료 흐름 ── */}
      <section className="bg-[#FAFAFA] border-t border-black/[0.05]">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-24 md:py-28">
          <div className="text-center mb-14 sn-reveal">
            {eyebrow("Process", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              치료 흐름
            </h2>
          </div>

          <ol className="space-y-3">
            {process.map((item, i) => (
              <li
                key={item.step}
                className="sn-reveal flex gap-5 p-6 bg-white rounded-[20px] border border-black/[0.07] hover:border-black/[0.14] transition-colors duration-300"
                style={{ transitionDelay: `${i * 55}ms` }}
              >
                <span className="font-serif text-2xl font-bold text-[var(--brand-primary)]/25 w-10 shrink-0 leading-none pt-0.5">
                  {item.step}
                </span>
                <div>
                  <p className="font-bold text-[#0a0a0a] text-[15px] mb-1.5">{item.title}</p>
                  <p className="text-sm text-[#525252] leading-[1.75]">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 07 · FAQ ── */}
      <section className="bg-white border-t border-black/[0.05]">
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

      {/* ── 08 · 무릎 치료 칼럼 ── */}
      <NmcColumnsSection />

      {/* ── 09 · FINAL CTA ── */}
      <section className="bg-[#0a0a0a] overflow-hidden">
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-24 md:py-32 text-center sn-reveal">
          {eyebrow("Appointment", { center: true, dark: true })}
          <h2 className="font-serif text-3xl md:text-5xl text-white leading-[1.15] tracking-[-0.025em] mb-6">
            무릎 초음파 진단
            <br />
            예약하기
          </h2>
          <p className="text-white/45 mb-12 max-w-lg mx-auto text-base leading-[1.8]">
            초음파로 염증 상태를 먼저 확인합니다. 내원 후 상담·진단 가능합니다.
            평일 09:30~18:30, 토요일 09:30~13:00.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={clinic.contact.naverBooking}
              target="_blank"
              rel="noopener noreferrer"
              className="rn-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#03C75A] text-white text-[15px] font-bold"
            >
              네이버 예약하기
            </a>
            <a
              href={clinic.contact.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FAE100] text-[#3C1E1E] text-[15px] font-bold hover:brightness-95 transition"
            >
              카톡 상담
            </a>
            <a
              href={`tel:${clinic.contact.phoneClean}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-white/20 text-white text-[15px] font-semibold hover:bg-white/[0.08] transition-colors"
            >
              {IconPhone}
              {clinic.contact.phone}
            </a>
          </div>

          <p className="mt-10 text-white/35 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분
          </p>
          <p className="mt-2 text-white/20 text-xs">
            ※ 치료 효과는 개인에 따라 다를 수 있습니다.
          </p>
        </div>
      </section>


    </>
  );
}

function NmcColumnsSection() {
  const cols = getColumnsBySection("nmc").slice(0, 3);
  if (!cols.length) return null;
  return (
    <section className="bg-[#F5F2EC] border-t border-black/[0.05]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-20 md:py-24">
        <div className="flex items-end justify-between gap-6 flex-wrap mb-12 sn-reveal">
          <div>
            {eyebrow("Column")}
            <h2 className="font-serif text-2xl md:text-3xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              무릎 치료 칼럼
            </h2>
          </div>
          <Link
            href="/nmc/columns"
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
                  className="rn-card group block h-full rounded-[22px] overflow-hidden border border-black/[0.07] hover:border-[var(--brand-primary)]/25 bg-white"
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
                    <time className="text-xs text-[#888]">{c.date}</time>
                    <p className="mt-2 font-bold text-[15px] leading-snug line-clamp-2 text-[#0a0a0a] group-hover:text-[var(--brand-primary)] transition-colors duration-200">
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
