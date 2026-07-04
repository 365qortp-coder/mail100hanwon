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
    "매일백세한의원의 NMC 무릎 치료 프로토콜. N(염증 무력화)·M(가동성 회복)·C(구조 재건) 3단계. 침·한약 병행으로 무릎 통증의 근원을 다스립니다. 먹골역 도보 5분. 02-2234-0102.",
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

export default function NMCPage() {
  return (
    <>
      <JsonLd id="schema-nmc-faq" data={faqSchema(faqs)} />

      {/* 01 · HERO */}
      <section className="bg-white border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24 grid md:grid-cols-[1fr_1.1fr] gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--surface-muted)] order-2 md:order-1">
            <Image
              src="/photos/pain.webp"
              alt="매일백세한의원 무릎관절 NMC 치료"
              fill
              priority
              className="object-cover object-[center_20%]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[var(--brand-primary)] uppercase mb-5">
              <span className="w-8 h-px bg-[var(--brand-primary)]" />
              NMC 무릎 · 매일백세한의원
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.2] mb-5">
              연골은 재생되지 않습니다.
              <br />
              <span className="text-[var(--brand-primary)]">하지만 안 아프고</span>
              <br />
              <span className="text-[var(--brand-primary)]">튼튼할 수 있습니다.</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg">
              염증을 먼저 잡고(N), 근골격 구조를 강화해(C),
              통증 없이 걷는 무릎(M)을 목표로 합니다.
              침·한약 병행 NMC 프로토콜.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={clinic.contact.naverBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[var(--brand-primary)] text-white font-bold text-sm hover:bg-[var(--brand-primary-dark)] transition"
              >
                무릎 초음파 진단 예약
              </a>
              <a
                href="https://maeilbaeksae-knee.vercel.app/cheongnyeomdan_landing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[var(--border)] text-[var(--foreground)] font-bold text-sm hover:border-[var(--brand-primary)] transition"
              >
                무릎 자가진단 →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 02 · NMC 3단계 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Protocol
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              NMC 3단계 프로토콜
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-3 max-w-lg mx-auto">
              염증을 먼저 제어하지 않으면 구조 강화가 오히려 통증을 악화시킵니다.
              순서가 핵심입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {/* N */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-7 hover:border-[var(--brand-primary)] hover:shadow transition">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary-light)] flex items-center justify-center mb-5">
                <span className="text-2xl font-extrabold text-[var(--brand-primary)]">N</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] font-bold text-[var(--text-muted)] mb-2">STEP 1 · 약 1.5개월</p>
              <h3 className="text-xl font-extrabold mb-3">
                Neutralize
                <br />
                <span className="text-base font-bold text-[var(--brand-primary)]">염증 무력화</span>
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                활막 염증을 제어해 통증과 부종을 줄입니다.
                IL-1β·TNF-α 억제 한약재 병행.
              </p>
              <ul className="text-xs text-[var(--text-muted)] space-y-1.5">
                <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>침 치료 주 2회 · 30분</li>
                <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>소염 한약 처방</li>
                <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>4~6주 후 초음파 재측정</li>
              </ul>
            </div>

            {/* M */}
            <div className="bg-black text-white rounded-2xl border border-black p-7">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <span className="text-2xl font-extrabold text-[var(--brand-primary)]">M</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] font-bold text-white/40 mb-2">GOAL · 치료의 목표</p>
              <h3 className="text-xl font-extrabold mb-3">
                Mobility
                <br />
                <span className="text-base font-bold text-[var(--brand-primary)]">가동성 회복</span>
              </h3>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                통증 없이 다시 걷는 무릎.
                N과 C가 함께 향하는 결과입니다.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                계단 오르내리기, 장거리 보행, 앉았다 일어나기 — 일상으로 돌아가는 것이 목표입니다.
              </p>
            </div>

            {/* C */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-7 hover:border-[var(--brand-primary)] hover:shadow transition">
              <div className="w-12 h-12 rounded-xl bg-[var(--brand-primary-light)] flex items-center justify-center mb-5">
                <span className="text-2xl font-extrabold text-[var(--brand-primary)]">C</span>
              </div>
              <p className="text-[10px] tracking-[0.2em] font-bold text-[var(--text-muted)] mb-2">STEP 2 · 약 3개월</p>
              <h3 className="text-xl font-extrabold mb-3">
                Construct
                <br />
                <span className="text-base font-bold text-[var(--brand-primary)]">구조 재건</span>
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                대퇴사두근 강화로 관절 부하를 분산합니다.
                연골 마모 속도를 늦추는 것이 목표입니다.
              </p>
              <ul className="text-xs text-[var(--text-muted)] space-y-1.5">
                <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>침 치료 주 1회 + 근력 강화 경혈</li>
                <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>근골격 강화 한약 처방</li>
                <li className="flex gap-2"><span className="text-[var(--brand-primary)]">·</span>운동 처방 병행 (등척성 수축 등)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 03 · 치료 근거 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Evidence
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              논문 근거 기반 치료
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
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
            ].map((item) => (
              <div
                key={item.label}
                className="p-5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)]"
              >
                <p className="text-xs font-bold text-[var(--brand-primary)] mb-2">{item.label}</p>
                <p className="text-sm leading-relaxed text-[var(--foreground)] mb-2">{item.value}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.cite}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-5 text-center">
            ※ 치료 효과는 개인에 따라 다를 수 있습니다.
          </p>
        </div>
      </section>

      {/* 04 · 원장 스토리 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="bg-white rounded-2xl border border-[var(--border)] p-8 shadow-sm">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-4">
              Story
            </p>
            <blockquote className="text-base md:text-lg leading-relaxed text-[var(--foreground)] space-y-4">
              <p>
                저는 강직성 척추염 유전자를 보유하고 있어 젊어서부터 무릎과
                관절 통증을 달고 살았습니다.
              </p>
              <p>
                수년간 치료를 시도하던 중 <strong>형방패독산</strong>이 결정적인
                처방이 됐습니다. 만성 염증을 억제하는 기전이었습니다.
                이 처방을 무릎 만성 염증에 최적화해 NMC 프로토콜을 개발했습니다.
              </p>
              <p className="font-bold text-[var(--brand-primary)]">
                "제가 먹는 약을 처방합니다."
              </p>
            </blockquote>
            <p className="text-sm text-[var(--text-muted)] mt-5">— 송원석 원장 · 매일백세한의원</p>
          </div>
        </div>
      </section>

      {/* 05 · 자가진단 안내 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-3">
            Self Check
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            지금 내 무릎 상태,
            <br />
            14문항으로 확인해보세요
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            WOMAC 기반 자가진단으로 염증 단계와 치료 방향을 파악할 수 있습니다.
          </p>
          <a
            href="https://maeilbaeksae-knee.vercel.app/cheongnyeomdan_landing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[var(--brand-primary)] text-white font-bold text-sm hover:bg-[var(--brand-primary-dark)] transition"
          >
            무릎 자가진단 시작하기 →
          </a>
          <p className="text-xs text-[var(--text-muted)] mt-4">
            진단 결과는 참고용이며, 정확한 치료 방향은 내원 상담을 통해 확인합니다.
          </p>
        </div>
      </section>

      {/* 06 · 치료 흐름 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Process
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              치료 흐름
            </h2>
          </div>
          <ol className="space-y-3">
            {[
              { step: "01", title: "초음파 진단", desc: "활막 두께·관절 삼출을 확인해 염증 정도를 객관적으로 파악합니다." },
              { step: "02", title: "WOMAC 자가진단 검사", desc: "통증·강직·기능 3개 항목으로 현재 무릎 기능 수준을 수치화합니다." },
              { step: "03", title: "N단계 → 염증 제어 (약 1.5개월)", desc: "침 주 2회 + 소염 한약으로 활막 염증을 제어합니다." },
              { step: "04", title: "초음파 재측정 + WOMAC 재검사", desc: "염증 제어 확인 후 C단계로 전환 시점을 결정합니다." },
              { step: "05", title: "C단계 → 구조 강화 (약 3개월)", desc: "침 주 1회 + 근골격 강화 한약 + 등척성 운동 처방으로 관절 부하를 분산합니다." },
            ].map((item) => (
              <li key={item.step} className="flex gap-4 p-4 bg-white rounded-lg border border-[var(--border)]">
                <span className="text-lg font-bold text-[var(--brand-primary)] w-8 shrink-0">{item.step}</span>
                <div>
                  <p className="font-bold text-[var(--foreground)] mb-0.5">{item.title}</p>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 07 · FAQ */}
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

      {/* 07 · 무릎 치료 칼럼 */}
      <NmcColumnsSection />

      {/* 08 · FINAL CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-3">
            Appointment
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            무릎 초음파 진단
            <br />
            예약하기
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            초음파로 염증 상태를 먼저 확인합니다. 내원 후 상담·진단 가능합니다.
            평일 09:30~18:30, 토요일 09:30~13:00.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
            <a
              href={clinic.contact.naverBooking}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#03C75A] text-white font-bold text-sm hover:brightness-95 transition"
            >
              네이버 예약하기
            </a>
            <a
              href={clinic.contact.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#FAE100] text-[#3C1E1E] font-bold text-sm hover:brightness-95 transition"
            >
              카톡 상담
            </a>
            <a
              href={`tel:${clinic.contact.phoneClean}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg border border-white/20 text-white font-bold text-sm hover:border-white transition"
            >
              {clinic.contact.phone}
            </a>
          </div>
          <p className="mt-6 text-white/50 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분
          </p>
          <p className="mt-2 text-white/30 text-xs">
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
    <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">Column</p>
            <h2 className="text-xl md:text-2xl font-extrabold">무릎 치료 칼럼</h2>
          </div>
          <Link href="/nmc/columns" className="text-sm text-[var(--brand-primary)] font-semibold hover:underline">
            전체 보기 →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {cols.map((c: ColumnMeta) => {
            const img = getColumnImage(c);
            return (
              <Link key={c.slug} href={getColumnUrl(c)}
                className="block bg-white rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow transition overflow-hidden">
                {img && (
                  <div className="relative aspect-video w-full bg-[var(--border)]">
                    <Image src={img} alt={c.imageAlt ?? c.title} fill className="object-cover" sizes="33vw" unoptimized />
                  </div>
                )}
                <div className="p-4">
                  <p className="text-xs text-[var(--text-muted)] mb-1">{c.date}</p>
                  <p className="font-bold text-sm line-clamp-2">{c.title}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
