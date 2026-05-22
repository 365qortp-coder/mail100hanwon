import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { CTAButtons } from "@/components/CTAButtons";
import { YouTubeThumbnailGallery } from "@/components/YouTubeThumbnailGallery";
import { clinic } from "@/data/clinic";
import { locations } from "@/data/locations";
import { getAllColumns } from "@/lib/columns";
import { faqs } from "@/data/faq";

export const metadata: Metadata = buildMetadata({
  title: `${clinic.name} | 매일감비환 다이어트·공진단·통증치료`,
  description: `서울 중랑구 매일백세한의원 송원석 원장. 매일감비환 다이어트 한약, 공진단, 통증치료. 비대면 진료로 전국 어디서나 처방받으실 수 있습니다. 전화 02-2234-0102.`,
  path: "/",
  keywords: [
    "매일백세한의원",
    "송원석 원장",
    "매일감비환",
    "감비환",
    "공진단",
    "통증치료",
    "비대면 한의원",
    "중랑구한의원",
    "먹골역한의원",
  ],
});

const products = [
  {
    slug: "diet",
    badge: "DIET",
    title: "매일감비환",
    subtitle: "다이어트 한약",
    desc: "체질에 맞춘 한방 다이어트. 무리한 절식 아닌 체지방 위주의 감량과 6개월 요요 관리까지.",
    image: "/photos/diet-product.webp",
    href: "/treatments/diet",
  },
  {
    slug: "gongjindan",
    badge: "GONGJINDAN",
    title: "공진단",
    subtitle: "정통 한방 보약",
    desc: "사향·녹용·당귀·산수유를 한의원에서 직접 제조. 원장이 직접 봉인한 인증서를 함께 드립니다.",
    image: "/photos/gongjindan-hero.webp",
    href: "/treatments/gongjindan",
    dark: true,
  },
  {
    slug: "pain",
    badge: "PAIN",
    title: "통증치료",
    subtitle: "한방 통증 진료",
    desc: "허리·어깨·관절 통증을 침·약침·물리치료와 한약 처방으로 진단부터 회복까지 함께 합니다.",
    image: "/photos/pain.webp",
    href: "/treatments/pain",
  },
];

const processSteps = [
  { step: "01", title: "문의", desc: "전화 또는 카카오톡 채널로 원하시는 진료를 알려주세요." },
  { step: "02", title: "설문 작성", desc: "구글 설문지(비대면) 또는 내원으로 체질·증상을 확인합니다." },
  { step: "03", title: "원장 상담", desc: "송원석 원장이 직접 전화 또는 대면 상담을 진행합니다." },
  { step: "04", title: "한약 발송", desc: "한약 제조 후 영업일 2~5일 이내 택배 발송, 또는 직접 수령." },
];

const personas = [
  {
    icon: "🍱",
    title: "운동·식단 다 해봤는데 안 빠지시는 분",
    desc: "기초대사가 떨어진 30~50대, 산후 엄마, 다이어트 정체기. 매일감비환으로 체질·대사부터 다시 잡습니다.",
  },
  {
    icon: "💊",
    title: "효과만 강조하는 한약 광고에 지치신 분",
    desc: "단정적 효과 표현 대신, 체질에 맞는지 솔직하게 말씀드립니다. 안 맞으면 권하지 않습니다.",
  },
  {
    icon: "🏥",
    title: "한의원 멀어서 못 가셨던 분",
    desc: "비대면 진료로 전국 어디서나 처방받으세요. 구글 설문 → 원장 전화 상담 → 한약 택배.",
  },
  {
    icon: "📚",
    title: "수험생 자녀 컨디션 걱정되시는 부모님",
    desc: "수능·시험 3~6개월 전부터 시작하는 총명공진단. 원지·석창포를 더한 매일백세 특화 처방.",
  },
  {
    icon: "🏋️",
    title: "허리·어깨·관절 통증으로 일상이 힘드신 분",
    desc: "침·약침·물리치료가 한 건물에서. 야간·토일·공휴일 진료로 직장인도 편하게 오십니다.",
  },
  {
    icon: "🌿",
    title: "정통 한방 보약을 받고 싶으신 분",
    desc: "사향·녹용 직접 제조 공진단. 매일백세한의원이 한약재 입고부터 환 제조까지 직접 관리합니다.",
  },
];

export default function HomePage() {
  const latestColumns = getAllColumns().slice(0, 3);
  return (
    <>
      {/* 01 · HERO — 원장 + 우산 인용문 */}
      <section className="relative bg-white border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24 grid md:grid-cols-[minmax(260px,1fr)_1.2fr] gap-8 md:gap-14 items-center">
          <div className="relative order-1 md:order-1 mx-auto md:mx-0 w-full max-w-sm md:max-w-none">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] shadow-sm">
              <Image
                src="/photos/director.webp"
                alt={`${clinic.director.name} ${clinic.director.title}`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 38vw"
              />
            </div>
            <p className="mt-3 text-center md:text-left text-sm font-semibold text-[var(--foreground)]">
              {clinic.director.name} <span className="text-[var(--text-muted)] font-normal">{clinic.director.title}</span>
            </p>
          </div>
          <div className="order-2 md:order-2">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[var(--text-muted)] uppercase mb-5">
              <span className="w-8 h-px bg-[var(--border)]" />
              서울 중랑구 매일백세한의원
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.2] text-[var(--foreground)] mb-6">
              직접 해보고
              <br />
              <span className="text-[var(--brand-primary)]">효과 있는 진료만</span>
              <br />
              합니다
            </h1>
            <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg">
              다이어트·공진단·통증 모두 송원석 원장이 체질을 직접 확인한 뒤
              처방합니다. 비대면 진료로 한의원 방문 없이도 받아보실 수 있습니다.
            </p>
            <CTAButtons />
          </div>
        </div>
      </section>

      {/* 02 · 부정 후킹 (톤다운: 라이트 베이지) */}
      <section className="bg-[var(--surface-muted)] border-y border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-center gap-2 text-sm md:text-base font-medium text-center text-[var(--foreground)]">
          <span className="text-[var(--brand-primary)] font-bold">·</span>
          <span>
            <strong className="text-[var(--brand-primary)]">안 맞는 한약은 권하지 않습니다</strong>
            <span className="text-[var(--text-muted)]"> — 체질에 맞는지 솔직하게 말씀드리는 한의원</span>
          </span>
        </div>
      </section>

      {/* 03 · TRUST STRIP */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
          <p className="text-[11px] tracking-[0.25em] font-bold text-[var(--brand-primary)] uppercase mb-5 text-center">
            By the Numbers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { num: `${clinic.stats.yearsOpen}년`, label: "개원 후 연속 진료" },
              { num: `${(clinic.stats.dietConsults / 10000).toFixed(0)}만건+`, label: "다이어트 진료 누적" },
              { num: `${clinic.stats.yearsMakingGongjindan}년`, label: "공진단 원내 직접 조제" },
              { num: "전국", label: "비대면 진료 처방" },
            ].map((s) => (
              <div key={s.label} className="border-l-2 border-[var(--brand-primary)] pl-4">
                <p className="text-xl md:text-2xl font-extrabold text-white">{s.num}</p>
                <p className="text-xs md:text-sm text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 04 · PRODUCTS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
                Our Practice
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                매일백세한의원의
                <br />
                3가지 시그니처 진료
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              체질·생활습관·목표에 맞춘 맞춤형 한방 진료. 다이어트·공진단·통증
              모두 한 곳에서 받으실 수 있습니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={p.href}
                className={`group block rounded-2xl overflow-hidden border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow-2xl hover:-translate-y-1 transition ${
                  p.dark ? "bg-black text-white" : "bg-white"
                }`}
              >
                <div className="relative aspect-[4/3] bg-[var(--surface-muted)] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <p className="text-[10px] tracking-[0.2em] font-bold mb-2 text-[var(--text-muted)]">
                    {p.badge}
                  </p>
                  <h3 className="text-xl md:text-2xl font-extrabold mb-1">
                    {p.title}
                  </h3>
                  <p
                    className={`text-sm font-semibold mb-3 ${
                      p.dark ? "text-white/70" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {p.subtitle}
                  </p>
                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      p.dark ? "text-white/80" : "text-[var(--foreground)]"
                    }`}
                  >
                    {p.desc}
                  </p>
                  <span
                    className={`inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-2.5 transition-all ${
                      p.dark ? "text-white" : "text-[var(--brand-primary)]"
                    }`}
                  >
                    자세히 보기 <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 05 · PHILOSOPHY TILES — 처방별 인용문 */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {clinic.philosophy.byTreatment.map((p) => (
              <Link
                key={p.slug}
                href={`/treatments/${p.slug}`}
                className="group block p-6 md:p-7 rounded-2xl border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow-lg bg-white transition"
              >
                <span className="text-[10px] tracking-[0.2em] font-bold text-[var(--text-muted)] uppercase">
                  {p.label}
                </span>
                <p className="text-lg md:text-xl font-extrabold leading-snug mt-3 mb-4 text-[var(--foreground)]">
                  &ldquo;{p.quote}&rdquo;
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--brand-primary)] group-hover:gap-2 transition-all">
                  자세히 보기 <span aria-hidden>→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 06 · CLINIC INTRO */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/5] md:aspect-[4/3] rounded-2xl overflow-hidden bg-[var(--surface-muted)] order-2 md:order-1">
            <Image
              src="/photos/clinic-exterior.webp"
              alt="매일백세한의원 외관 - 서울 중랑구 공릉로 21"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="order-1 md:order-2">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              About
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-5">
              내원도 비대면도,
              <br />
              한 곳에서 받는 한방 진료
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed mb-6">
              서울 중랑구 공릉로 21, 먹골역 도보 5분 거리에 자리한
              {" "}매일백세한의원입니다. 2~3층 한 건물에 진료실과 물리치료실이
              나뉘어 있어 다이어트·공진단·통증 치료까지 한자리에서 받으실 수
              있습니다. 야간 진료와 토요일·일요일·공휴일 진료도 운영하고 있어
              직장인·학부모분들도 편하게 오십니다.
            </p>
            <dl className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <dt className="text-[var(--text-muted)] mb-1">평일</dt>
                <dd className="font-bold">{clinic.hours.weekday}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)] mb-1">토요일</dt>
                <dd className="font-bold">{clinic.hours.saturday}</dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)] mb-1">전화</dt>
                <dd className="font-bold">
                  <a href={`tel:${clinic.contact.phoneClean}`} className="hover:text-[var(--brand-primary)]">
                    {clinic.contact.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--text-muted)] mb-1">교통</dt>
                <dd className="font-bold">먹골역 도보 5분</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <a
                href={clinic.contact.naverBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-[#03C75A] text-white text-sm font-bold hover:brightness-95 transition"
              >
                네이버 예약하기
              </a>
              <a
                href={clinic.contact.naverBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded border border-[var(--border)] text-[var(--foreground)] text-sm font-bold hover:border-[var(--brand-primary)] transition"
              >
                네이버 플레이스 리뷰 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 07 · DIET HOOK — 옛 히어로 카피, 유튜브 직전 위치 */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-3">
              Diet
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight mb-5">
              운동·식단 다 해봤는데
              <br />
              <span className="text-[var(--brand-primary)]">살이 안 빠지시나요?</span>
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed mb-6 max-w-lg">
              송원석 원장이 체질을 직접 분석해 처방하는 <strong className="text-[var(--foreground)]">매일감비환</strong>.
              한약으로 식욕·대사를 함께 잡고, 6개월 요요 관리까지.
              비대면 진료로 한의원 방문 없이도 받아보실 수 있습니다.
            </p>
            <ul className="mb-6 grid grid-cols-2 gap-2 max-w-md text-sm">
              <li className="flex items-center gap-2"><Check />체질·대사 맞춤 처방</li>
              <li className="flex items-center gap-2"><Check />무리한 절식 없이</li>
              <li className="flex items-center gap-2"><Check />6개월 요요 관리</li>
              <li className="flex items-center gap-2"><Check />전국 택배 발송</li>
            </ul>
            <Link
              href="/treatments/diet"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary)] hover:underline"
            >
              매일감비환 자세히 보기 <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="relative aspect-square md:aspect-[4/5] rounded-2xl overflow-hidden bg-[var(--surface-muted)]">
            <Image
              src="/photos/diet-product.webp"
              alt="매일감비환 다이어트 한약"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      {/* 08 · YOUTUBE */}
      <section className="bg-[var(--surface-muted)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
                YouTube
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                글로 다 못 담는 이야기는
                <br />
                영상으로 보시면 됩니다
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-2 max-w-md">
                다이어트·공진단 제조·통증 치료까지, 송원석 원장이
                실제 진료실에서 다루는 한방 이야기.
              </p>
            </div>
          </div>
          <YouTubeThumbnailGallery />
        </div>
      </section>

      {/* 09 · PERSONAS (Process 바로 위로 이동) */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              For You
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              이런 분들이 매일백세를 찾으십니다
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
              해당되신다면 상담 한 번 받아보세요. 안 맞으면 권하지 않습니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personas.map((p) => (
              <div
                key={p.title}
                className="bg-[var(--surface-muted)] p-6 rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow transition"
              >
                <div className="text-3xl mb-3" aria-hidden>{p.icon}</div>
                <h3 className="font-extrabold leading-snug mb-2">{p.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10 · PROCESS */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Process
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              처음이신가요?
              <br />
              진료 받으시는 4단계
            </h2>
            <p className="text-base text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
              구글 설문 작성 → 원장님 전화 상담 → 한약 택배 발송. 전국 어디서나
              동일하게 진행됩니다.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {processSteps.map((s, i) => (
              <div
                key={s.step}
                className="relative bg-white border border-[var(--border)] rounded-xl p-5 hover:border-[var(--brand-primary)] transition"
              >
                <span className="absolute -top-3 left-5 bg-[var(--brand-primary)] text-white text-xs font-bold px-2 py-1 rounded">
                  STEP {s.step}
                </span>
                <h3 className="text-lg font-extrabold mt-3 mb-2">{s.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {s.desc}
                </p>
                {i < processSteps.length - 1 && (
                  <span className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-[var(--border)]" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 max-w-2xl mx-auto">
            <CTAButtons />
          </div>
        </div>
      </section>

      {/* 11 · COLUMNS */}
      {latestColumns.length > 0 && (
        <section className="bg-white border-t border-[var(--border)]">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
                  Columns
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  매일 올라오는 한방 건강 정보
                </h2>
              </div>
              <Link
                href="/columns"
                className="text-sm font-bold text-[var(--brand-primary)] hover:underline"
              >
                전체 보기 →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {latestColumns.map((c) => (
                <Link
                  key={c.slug}
                  href={`/columns/${c.slug}`}
                  className="block p-6 bg-[var(--surface-muted)] rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] transition"
                >
                  <p className="text-[10px] tracking-widest text-[var(--text-muted)] font-bold mb-3">
                    {c.category.toUpperCase()}
                  </p>
                  <h3 className="text-lg font-extrabold mb-2 leading-snug line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">
                    {c.description}
                  </p>
                  <time className="text-xs text-[var(--text-muted)]">
                    {c.date}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 12 · LOCATIONS */}
      <section className="bg-[var(--surface-muted)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Locations
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              어느 지역에서 오시나요?
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
              중랑·노원·동대문·광진·성북·남양주·구리·의정부에서 직접 찾아오시고,
              그 외 지역은 비대면 진료로 전국 어디서나 처방받으십니다.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {locations.slice(0, 18).map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="px-3 py-2.5 bg-white rounded border border-[var(--border)] hover:border-black text-center text-sm font-medium transition"
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 13 · FAQ */}
      <section className="bg-white border-t border-[var(--border)]">
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
            {faqs.slice(0, 5).map((f, i) => (
              <details
                key={i}
                className="group rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-5 hover:border-[var(--brand-primary)] transition"
              >
                <summary className="cursor-pointer font-semibold flex items-start gap-2 list-none">
                  <span className="text-[var(--brand-primary)] font-bold">Q.</span>
                  <span className="flex-1">{f.q}</span>
                  <span className="text-[var(--text-muted)] group-open:rotate-180 transition shrink-0">▾</span>
                </summary>
                <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed pl-6">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/faq" className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
              전체 FAQ 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* 14 · FINAL CTA */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-3">
            Contact
          </p>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4">
            상담은 부담 없이,
            <br />
            처방은 책임 있게
          </h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">
            전화·카카오톡·비대면 신청 모두 가능합니다. 평일 09:30~18:30,
            토요일 09:30~13:00 진료.
          </p>
          <div className="max-w-xl mx-auto">
            <CTAButtons />
          </div>
        </div>
      </section>
    </>
  );
}

function Check() {
  return (
    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--brand-primary)] text-white shrink-0">
      <svg width="11" height="9" viewBox="0 0 11 9" fill="none" aria-hidden>
        <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}
