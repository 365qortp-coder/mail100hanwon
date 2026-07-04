import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { clinicSchema, directorSchema, websiteSchema, webPageSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
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

type Product = {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  image: string;
  imagePosition?: string;
  href: string;
  external?: boolean;
  dark?: boolean;
};

const products: Product[] = [
  {
    slug: "diet",
    badge: "DIET",
    title: "매일감비환",
    subtitle: "다이어트 한약",
    desc: "체질에 맞춘 한방 다이어트. 무리한 절식 아닌 체지방 위주의 감량과 6개월 요요 관리까지.",
    image: "/photos/diet-product.webp",
    href: "/diet",
  },
  {
    slug: "gongjindan",
    badge: "GONGJINDAN",
    title: "공진단",
    subtitle: "정통 한방 보약",
    desc: "사향·녹용·당귀·산수유를 한의원에서 직접 제조. 원장이 직접 봉인한 인증서를 함께 드립니다.",
    image: "/photos/gongjindan-hero.webp",
    href: "/gongjindan",
    dark: true,
  },
  {
    slug: "nmc",
    badge: "NMC KNEE",
    title: "무릎관절 NMC",
    subtitle: "한방 무릎 치료 프로토콜",
    desc: "염증 무력화(N)·가동성 회복(M)·구조 재건(C). 침·한약 병행으로 무릎 통증의 근원을 다스립니다.",
    image: "/photos/pain.webp",
    imagePosition: "object-[center_20%]",
    href: "/nmc",
  },
];

const personas = [
  {
    title: "운동·식단 다 해봤는데 안 빠지시는 분",
    desc: "기초대사가 떨어진 30~50대, 산후 엄마, 다이어트 정체기. 매일감비환으로 체질·대사부터 다시 잡습니다.",
  },
  {
    title: "효과만 강조하는 한약 광고에 지치신 분",
    desc: "단정적 효과 표현 대신, 체질에 맞는지 솔직하게 말씀드립니다. 안 맞으면 권하지 않습니다.",
  },
  {
    title: "한의원 멀어서 못 가셨던 분",
    desc: "비대면 진료로 전국 어디서나 처방받으세요. 구글 설문 → 원장 전화 상담 → 한약 택배.",
  },
  {
    title: "무릎 통증으로 계단·걷기가 힘드신 분",
    desc: "NMC 프로토콜로 염증부터 잡고 근골격 구조를 강화합니다. 연골 마모 속도를 늦추는 침·한약 병행 치료.",
  },
  {
    title: "허리·어깨·관절 통증으로 일상이 힘드신 분",
    desc: "침·약침·물리치료가 한 건물에서. 야간·토일·공휴일 진료로 직장인도 편하게 오십니다.",
  },
  {
    title: "정통 한방 보약을 받고 싶으신 분",
    desc: "사향·녹용 직접 제조 공진단. 매일백세한의원이 한약재 입고부터 환 제조까지 직접 관리합니다.",
  },
];

const eyebrow = (label: string, center = false) => (
  <div className={`inline-flex items-center gap-2.5 mb-6 ${center ? "justify-center" : ""}`}>
    <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
    <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--brand-primary)]">
      {label}
    </span>
  </div>
);

export default function HomePage() {
  const latestColumns = getAllColumns().slice(0, 3);
  const homePageDesc = `서울 중랑구 매일백세한의원 송원석 원장. 매일감비환 다이어트 한약, 공진단, 무릎관절 NMC. 비대면 진료로 전국 어디서나 처방받으실 수 있습니다. 전화 02-2234-0102.`;

  return (
    <>
      <JsonLd id="ld-clinic" data={clinicSchema()} />
      <JsonLd id="ld-website" data={websiteSchema()} />
      <JsonLd id="ld-director" data={directorSchema()} />
      <JsonLd id="ld-webpage" data={webPageSchema({ title: `${clinic.name} | 매일감비환 다이어트·공진단·무릎관절 NMC`, description: homePageDesc, path: "/" })} />
      <JsonLd id="ld-faq" data={faqSchema(faqs)} />

      {/* ── 01 · HERO ── */}
      <section className="bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 pt-16 pb-24 md:pt-20 md:pb-32 grid md:grid-cols-[1fr_400px] lg:grid-cols-[1fr_460px] gap-10 md:gap-14 items-end">
          {/* Left — headline */}
          <div className="sn-reveal">
            <div className="inline-flex items-center gap-2.5 mb-8">
              <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--brand-primary)]">
                서울 중랑구 매일백세한의원
              </span>
            </div>

            <h1 className="font-serif text-[2.75rem] md:text-[3.8rem] lg:text-[5rem] leading-[1.06] tracking-[-0.02em] text-[#0a0a0a] mb-8">
              직접 해보고
              <br />
              <span className="text-[var(--brand-primary)]">효과 있는 진료만</span>
              <br />
              권해드립니다
            </h1>

            <p className="text-base md:text-[1.05rem] text-[var(--text-muted)] leading-relaxed max-w-[420px] mb-10">
              다이어트·공진단·통증 모두 송원석 원장이 체질을 직접 확인한 뒤
              처방합니다. 비대면 진료로 전국 어디서나 받아보실 수 있습니다.
            </p>

            {/* Hero CTA — pill buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${clinic.contact.phoneClean}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[var(--brand-primary)] text-white text-sm font-semibold hover:bg-[var(--brand-primary-dark)] transition-colors duration-300"
              >
                전화 상담 →
              </a>
              <a
                href={clinic.contact.kakao}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#FAE100] text-[#3C1E1E] text-sm font-semibold hover:brightness-95 transition"
              >
                카카오톡 상담
              </a>
              <a
                href={clinic.contact.naverBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#0a0a0a]/20 text-[#0a0a0a] text-sm font-semibold hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition-colors duration-300"
              >
                네이버 예약하기
              </a>
            </div>
          </div>

          {/* Right — director photo */}
          <div className="order-first md:order-last sn-reveal" style={{ transitionDelay: "80ms" }}>
            <div className="p-1.5 bg-black/[0.04] ring-1 ring-black/[0.06] rounded-[1.75rem]">
              <div className="relative aspect-[3/4] rounded-[calc(1.75rem-6px)] overflow-hidden bg-[#E8E3D9] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
                <Image
                  src="/photos/director.webp"
                  alt={`${clinic.director.name} ${clinic.director.title}`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 80vw, 460px"
                />
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-[#0a0a0a] flex items-center gap-2">
              {clinic.director.name}
              <span className="text-xs text-[var(--text-muted)] font-normal border border-[#0a0a0a]/12 rounded-full px-2.5 py-0.5">
                {clinic.director.title}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ── 02 · STATS ── */}
      <section className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-16 md:py-20">
          <p className="text-[11px] tracking-[0.25em] font-bold text-[var(--brand-primary)] uppercase mb-10">
            By the Numbers
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { num: `${clinic.stats.yearsOpen}년+`, sub: "2016년 개원", note: "장기 운영 한의원" },
              { num: `${(clinic.stats.dietConsults / 10000).toFixed(0)}만+`, sub: "다이어트 누적 진료", note: "축적된 임상 경험" },
              { num: `${(clinic.stats.gongjindanUnits / 10000).toFixed(0)}만구+`, sub: "공진단 원내 제조", note: "직접 빚은 공진단" },
              { num: "전국", sub: "비대면 진료", note: "어디서나 처방 가능" },
            ].map((s, i) => (
              <div key={s.sub} className="sn-reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <p className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-2">{s.num}</p>
                <p className="text-sm font-semibold text-white/70 mb-1">{s.sub}</p>
                <p className="text-xs text-white/35">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · PRODUCTS ── */}
      <section className="bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-20 md:py-28 lg:py-32">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-14 sn-reveal">
            <div>
              {eyebrow("Our Practice")}
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] leading-tight tracking-tight text-[#0a0a0a]">
                매일백세한의원의
                <br />
                3가지 시그니처 진료
              </h2>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
              체질·생활습관·목표에 맞춘 맞춤형 한방 진료.
              <br />
              다이어트·공진단·통증 모두 한 곳에서.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-5">
            {products.map((p, i) => {
              const inner = (
                <>
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-[calc(1.25rem-6px)] ${p.dark ? "bg-[#0a0a0a]" : "bg-[#E8E3D9]"}`}>
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className={`object-cover ${p.imagePosition ?? ""} group-hover:scale-[1.04]`}
                      style={{ transition: "transform 0.7s cubic-bezier(0.16,1,0.3,1)" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    {p.dark && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-black/10" />
                    )}
                  </div>
                  <div className="p-6 md:p-7">
                    <p className="text-[10px] tracking-[0.2em] font-bold text-[var(--text-muted)] mb-3">
                      {p.badge}
                    </p>
                    <h3 className="font-serif text-xl md:text-2xl font-bold mb-1.5 text-[#0a0a0a]">
                      {p.title}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--text-muted)] mb-3">{p.subtitle}</p>
                    <p className="text-sm leading-relaxed text-[var(--text-muted)] mb-5">{p.desc}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary)] group-hover:gap-3"
                      style={{ transition: "gap 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                      자세히 보기 <span aria-hidden>→</span>
                    </span>
                  </div>
                </>
              );

              return (
                <div
                  key={p.slug}
                  className="sn-reveal p-1.5 bg-black/[0.04] ring-1 ring-black/[0.06] rounded-[1.25rem]"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  {p.external ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block rounded-[calc(1.25rem-6px)] overflow-hidden bg-white hover:ring-2 hover:ring-[var(--brand-primary)]/30"
                      style={{ transition: "box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)" }}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={p.href}
                      className="group block rounded-[calc(1.25rem-6px)] overflow-hidden bg-white hover:ring-2 hover:ring-[var(--brand-primary)]/30"
                      style={{ transition: "box-shadow 0.5s cubic-bezier(0.16,1,0.3,1)" }}
                    >
                      {inner}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 04 · YOUTUBE ── */}
      <section className="bg-[#F4F0E8] border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-20 md:py-28">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12 sn-reveal">
            <div>
              {eyebrow("YouTube")}
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[#0a0a0a]">
                글로 다 못 담는 이야기는
                <br />
                영상으로 보시면 됩니다
              </h2>
              <p className="text-sm text-[var(--text-muted)] mt-3 max-w-md leading-relaxed">
                다이어트·공진단 제조·통증 치료까지, 송원석 원장이
                실제 진료실에서 다루는 한방 이야기.
              </p>
            </div>
          </div>
          <YouTubeThumbnailGallery limit={8} />
        </div>
      </section>

      {/* ── 05 · ABOUT ── */}
      <section className="bg-[#FDFBF7] border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Clinic image — double-bezel */}
          <div className="sn-reveal p-1.5 bg-black/[0.04] ring-1 ring-black/[0.06] rounded-[1.75rem] order-2 md:order-1">
            <div className="relative aspect-[4/3] rounded-[calc(1.75rem-6px)] overflow-hidden bg-[#E8E3D9] shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
              <Image
                src="/photos/clinic-exterior.webp"
                alt="매일백세한의원 외관 - 서울 중랑구 공릉로 21"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>

          {/* Text */}
          <div className="order-1 md:order-2 sn-reveal" style={{ transitionDelay: "80ms" }}>
            {eyebrow("About")}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[#0a0a0a] mb-5">
              내원도 비대면도,
              <br />
              한 곳에서 받는 한방 진료
            </h2>
            <p className="text-base text-[var(--text-muted)] leading-relaxed mb-8">
              서울 중랑구 공릉로 21, 먹골역 도보 5분 거리의 매일백세한의원입니다.
              2·3층 한 건물에 진료실과 물리치료실이 있어 다이어트·공진단·통증 치료를
              한자리에서 받으실 수 있습니다. 야간·토·일·공휴일 진료로 직장인·학부모도
              편하게 오십니다.
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm mb-8">
              {[
                { label: "평일", value: clinic.hours.weekday },
                { label: "토요일", value: clinic.hours.saturday },
                { label: "전화", value: clinic.contact.phone, href: `tel:${clinic.contact.phoneClean}` },
                { label: "교통", value: "먹골역 도보 5분" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="p-3.5 rounded-xl bg-[#F4F0E8] border border-black/[0.06]"
                >
                  <dt className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase font-bold mb-1">
                    {row.label}
                  </dt>
                  <dd className="font-semibold text-[#0a0a0a] text-sm">
                    {row.href ? (
                      <a href={row.href} className="hover:text-[var(--brand-primary)]"
                        style={{ transition: "color 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
                        {row.value}
                      </a>
                    ) : row.value}
                  </dd>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={clinic.contact.naverBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#03C75A] text-white text-sm font-semibold"
                style={{ transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}
              >
                네이버 예약하기
              </a>
              <a
                href="https://map.naver.com/p/entry/place/1632908709?lng=127.0777837&lat=37.6126932&placePath=%2Freview%3FadditionalHeight%3D76%26fromPanelNum%3D1%26locale%3Dko%26svcName%3Dmap_pcv5%26timestamp%3D202607021653&searchType=place&c=15.00,0,0,0,dh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#0a0a0a]/15 text-[#0a0a0a] text-sm font-semibold hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
                style={{ transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)" }}
              >
                네이버 리뷰 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 06 · PERSONAS ── */}
      <section className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-20 md:py-28 lg:py-32">
          <div className="text-center mb-14 sn-reveal">
            <div className="inline-flex items-center gap-2.5 mb-6 justify-center">
              <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--brand-primary)]">
                For You
              </span>
              <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] text-white leading-tight tracking-tight">
              이런 분들이 매일백세를 찾으십니다
            </h2>
            <p className="text-sm text-white/40 mt-4 max-w-md mx-auto leading-relaxed">
              해당되신다면 상담 한 번 받아보세요. 안 맞으면 권하지 않습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personas.map((p, i) => (
              <div
                key={p.title}
                className="sn-reveal p-1.5 bg-white/[0.04] ring-1 ring-white/[0.08] rounded-[1.25rem]"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="p-6 rounded-[calc(1.25rem-6px)] bg-white/[0.02] h-full flex flex-col">
                  <p className="text-[11px] font-bold tracking-[0.18em] text-[var(--brand-primary)] mb-4">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="font-semibold text-white leading-snug mb-3">{p.title}</h3>
                  <p className="text-sm text-white/45 leading-relaxed flex-1">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 · COLUMNS ── */}
      {latestColumns.length > 0 && (
        <section className="bg-[#FDFBF7] border-t border-black/[0.05]">
          <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-20 md:py-28">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-12 sn-reveal">
              <div>
                {eyebrow("Columns")}
                <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[#0a0a0a]">
                  매일 올라오는 한방 건강 정보
                </h2>
              </div>
              <Link
                href="/columns"
                className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary)] hover:gap-3"
                style={{ transition: "gap 0.4s cubic-bezier(0.16,1,0.3,1)" }}
              >
                전체 보기 →
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-5">
              {latestColumns.map((c, i) => (
                <div
                  key={c.slug}
                  className="sn-reveal p-1.5 bg-black/[0.04] ring-1 ring-black/[0.06] rounded-[1.25rem]"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <Link
                    href={`/columns/${c.slug}`}
                    className="group block p-6 rounded-[calc(1.25rem-6px)] bg-white h-full hover:ring-2 hover:ring-[var(--brand-primary)]/20"
                    style={{ transition: "box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)" }}
                  >
                    <p className="text-[10px] tracking-widest text-[var(--text-muted)] font-bold mb-4 uppercase">
                      {c.category}
                    </p>
                    <h3 className="text-base font-bold mb-2 leading-snug line-clamp-2 text-[#0a0a0a] group-hover:text-[var(--brand-primary)]"
                      style={{ transition: "color 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
                      {c.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-5 leading-relaxed">
                      {c.description}
                    </p>
                    <time className="text-xs text-[var(--text-muted)]/60">{c.date}</time>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 08 · LOCATIONS ── */}
      <section className="bg-[#F4F0E8] border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-16 md:py-20">
          <div className="text-center mb-10 sn-reveal">
            <div className="inline-flex items-center gap-2.5 mb-5 justify-center">
              <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--brand-primary)]">Locations</span>
              <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
            </div>
            <h2 className="font-serif text-2xl md:text-3xl leading-tight tracking-tight text-[#0a0a0a] mb-3">
              어느 지역에서 오시나요?
            </h2>
            <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
              중랑·노원·동대문·광진·성북·남양주·구리·의정부에서 직접 찾아오시고,
              그 외 지역은 비대면 진료로 전국 어디서나 처방받으십니다.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {locations.slice(0, 18).map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="px-3 py-2.5 bg-white rounded-xl border border-black/[0.07] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] text-center text-sm font-medium text-[#0a0a0a]"
                style={{ transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)" }}
              >
                {loc.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 · FAQ ── */}
      <section className="bg-[#FDFBF7] border-t border-black/[0.05]">
        <div className="mx-auto max-w-4xl px-5 md:px-10 py-20 md:py-24">
          <div className="text-center mb-12 sn-reveal">
            <div className="inline-flex items-center gap-2.5 mb-5 justify-center">
              <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
              <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--brand-primary)]">FAQ</span>
              <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-tight text-[#0a0a0a]">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.slice(0, 5).map((f, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-black/[0.07] bg-white p-5 hover:border-[var(--brand-primary)]/40"
                style={{ transition: "border-color 0.3s cubic-bezier(0.16,1,0.3,1)" }}
              >
                <summary className="cursor-pointer font-semibold flex items-start gap-3 list-none text-[#0a0a0a]">
                  <span className="text-[var(--brand-primary)] font-bold shrink-0 text-sm pt-0.5">Q.</span>
                  <span className="flex-1 text-sm md:text-base leading-snug">{f.q}</span>
                  <span className="text-[var(--text-muted)] shrink-0 text-xs mt-1 group-open:rotate-180"
                    style={{ transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
                    ▾
                  </span>
                </summary>
                <p className="mt-4 text-sm text-[var(--text-muted)] leading-relaxed pl-7">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-primary)] hover:gap-3"
              style={{ transition: "gap 0.4s cubic-bezier(0.16,1,0.3,1)" }}
            >
              전체 FAQ 보기 →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10 · FINAL CTA ── */}
      <section className="bg-[#0a0a0a]">
        <div className="mx-auto max-w-7xl px-5 md:px-10 lg:px-16 py-24 md:py-32 text-center sn-reveal">
          <div className="inline-flex items-center gap-2.5 mb-8 justify-center">
            <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[var(--brand-primary)]">Contact</span>
            <span className="h-px w-5 bg-[var(--brand-primary)]" aria-hidden />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-[4.5rem] text-white leading-[1.06] tracking-tight mb-6">
            상담은 부담 없이,
            <br />
            <span className="text-[var(--brand-primary)]">처방은 책임 있게</span>
          </h2>
          <p className="text-white/40 mb-12 max-w-md mx-auto text-base leading-relaxed">
            전화·카카오톡·비대면 신청 모두 가능합니다.
            <br />
            평일 09:30–18:30, 토요일 09:30–13:00.
          </p>
          <div className="max-w-xl mx-auto">
            <CTAButtons />
          </div>
        </div>
      </section>

      {/* Reveal animation */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var o=new IntersectionObserver(function(e){e.forEach(function(i){if(i.isIntersecting){i.target.classList.add('sn-visible');o.unobserve(i.target)}})},{threshold:0.08,rootMargin:'0px 0px -32px 0px'});document.querySelectorAll('.sn-reveal').forEach(function(el){o.observe(el)})})()`,
        }}
      />
    </>
  );
}
