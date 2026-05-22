import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { CTAButtons } from "@/components/CTAButtons";
import { YouTubeShowcase } from "@/components/YouTubeShowcase";
import { clinic } from "@/data/clinic";
import { treatments } from "@/data/treatments";
import { locations } from "@/data/locations";
import { getAllColumns } from "@/lib/columns";
import { media } from "@/data/media";

export const metadata: Metadata = buildMetadata({
  title: `${clinic.name} | 매일감비환 다이어트·공진단·총명공진단`,
  description: `서울 중랑구 매일백세한의원 송원석 원장. 매일감비환 다이어트 한약, 공진단, 총명공진단, 통증 치료. 비대면 진료로 전국 어디서나 처방받으실 수 있습니다. 전화 02-2234-0102.`,
  path: "/",
  keywords: [
    "매일백세한의원",
    "송원석 원장",
    "매일감비환",
    "감비환",
    "공진단",
    "총명공진단",
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
    image: media.diet.hero,
    href: "/treatments/diet",
  },
  {
    slug: "gongjindan",
    badge: "GONGJINDAN",
    title: "공진단",
    subtitle: "정통 한방 보약",
    desc: "사향·녹용·당귀·산수유를 한의원에서 직접 제조. 유튜브 채널 '직접 만든 진짜 공진단'에서 과정을 공개합니다.",
    image: media.gongjindan.hero,
    href: "/treatments/gongjindan",
    dark: true,
  },
  {
    slug: "chongmyeong",
    badge: "CHONGMYEONG",
    title: "총명공진단",
    subtitle: "수험생 한방 처방",
    desc: "전통 공진단 처방에 원지·석창포를 더한 매일백세한의원 특화 처방. 수능·시험 시즌 컨디션 관리.",
    image: media.chongmyeong.hero,
    href: "/treatments/chongmyeong",
  },
];

const processSteps = [
  { step: "01", title: "문의", desc: "전화 또는 카카오톡 채널로 원하시는 진료를 알려주세요." },
  { step: "02", title: "설문 작성", desc: "구글 설문지(비대면) 또는 내원으로 체질·증상을 확인합니다." },
  { step: "03", title: "원장 상담", desc: "송원석 원장이 직접 전화 또는 대면 상담을 진행합니다." },
  { step: "04", title: "한약 발송", desc: "한약 제조 후 영업일 2~5일 이내 택배 발송, 또는 직접 수령." },
];

export default function HomePage() {
  const latestColumns = getAllColumns().slice(0, 3);
  return (
    <>
      {/* HERO */}
      <section className="relative bg-white border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[var(--brand-primary)] uppercase mb-4">
              <span className="w-8 h-px bg-[var(--brand-primary)]" />
              서울 중랑구 · 먹골역 도보 5분
            </p>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.15] text-[var(--foreground)] mb-5">
              매일감비환 다이어트
              <br />
              공진단 · 총명공진단
              <br />
              <span className="text-[var(--brand-primary)]">매일백세한의원</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--text-muted)] leading-relaxed mb-8 max-w-lg">
              송원석 원장이 직접 처방하는 한방 다이어트 한약, 정통 처방 그대로
              직접 만든 공진단, 수험생 총명공진단까지. 비대면 진료로 전국
              어디서나 처방받을 수 있습니다.
            </p>
            <CTAButtons />
          </div>

          <div className="order-1 md:order-2 relative aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden bg-[var(--brand-primary-light)]">
            <Image
              src={media.diet.hero}
              alt="매일감비환 다이어트 한약"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur rounded-xl px-4 py-3 flex items-center justify-between border border-[var(--border)]">
              <div>
                <p className="text-[10px] tracking-widest text-[var(--brand-primary)] font-bold mb-1">
                  CALL NOW
                </p>
                <p className="font-bold text-lg">{clinic.contact.phone}</p>
              </div>
              <a
                href={`tel:${clinic.contact.phoneClean}`}
                className="bg-black text-white text-xs font-bold px-3 py-2 rounded hover:bg-[var(--brand-primary)] transition"
              >
                전화하기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { num: "송원석", label: "대표원장 직접 처방" },
            { num: "전국", label: "비대면 진료 가능" },
            { num: "직접 제조", label: "사향·녹용 공진단" },
            { num: "3개", label: "유튜브 채널 운영" },
          ].map((s) => (
            <div key={s.label} className="border-l-2 border-[var(--brand-primary)] pl-4">
              <p className="text-xl md:text-2xl font-extrabold text-white">{s.num}</p>
              <p className="text-xs md:text-sm text-white/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-2">
                Our Practice
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                매일백세한의원의
                <br />
                3가지 시그니처 처방
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs">
              체질·생활습관·목표에 맞춘 맞춤형 한방 처방. 비대면 진료로
              전국에서 받아보실 수 있습니다.
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
                  <p
                    className={`text-[10px] tracking-[0.2em] font-bold mb-2 ${
                      p.dark ? "text-[var(--brand-primary)]" : "text-[var(--brand-primary)]"
                    }`}
                  >
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

      {/* YOUTUBE */}
      <section className="bg-[var(--surface-muted)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-2">
                YouTube
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
                송원석 원장이 직접
                <br />
                운영하는 3개 채널
              </h2>
            </div>
          </div>
          <YouTubeShowcase />
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-2">
              Process
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              비대면 진료 4단계
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

      {/* LOCATIONS */}
      <section className="bg-[var(--surface-muted)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-2">
              Locations
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
              어느 지역에서 오시나요?
            </h2>
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

      {/* COLUMNS */}
      {latestColumns.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-2">
                  Columns
                </p>
                <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  건강 칼럼
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
                  <p className="text-[10px] tracking-widest text-[var(--brand-primary)] font-bold mb-3">
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

      {/* FINAL CTA */}
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
