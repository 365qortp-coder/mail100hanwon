import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { clinicSchema, directorSchema, websiteSchema, webPageSchema, faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { YouTubeThumbnailGallery } from "@/components/YouTubeThumbnailGallery";
import { HeroZoom } from "@/components/HeroZoom";
import { clinic } from "@/data/clinic";
import { locations } from "@/data/locations";
import { getAllColumns, getColumnUrl } from "@/lib/columns";
import { faqs } from "@/data/faq";

export const metadata: Metadata = buildMetadata({
  title: `${clinic.name} | 매일감비환 다이어트·공진단·통증치료`,
  description: `서울 중랑구 매일백세한의원 송원석 원장. 매일감비환 다이어트 한약, 공진단, 통증치료. 비대면 진료로 전국 어디서나 처방받으실 수 있습니다. 전화 0507-1467-0195.`,
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
    imagePosition: "object-[center_25%]",
    href: "/nmc",
  },
];

const personaIcons = [
  // activity
  <svg key="i1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  // shield-check
  <svg key="i2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>,
  // smartphone
  <svg key="i3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>,
  // user
  <svg key="i4" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
  // heart
  <svg key="i5" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.05 3 5.5l7 7Z" /></svg>,
  // pill
  <svg key="i6" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" /></svg>,
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

const eyebrow = (label: string, opts?: { center?: boolean; brand?: boolean; dark?: boolean }) => {
  const line = opts?.dark ? "bg-white/20" : opts?.brand ? "bg-[var(--brand-primary)]" : "bg-black/20";
  const text = opts?.dark ? "text-white/35" : opts?.brand ? "text-[var(--brand-primary)]" : "text-[#8C8A87]";
  return (
    <div className={`inline-flex items-center gap-3 mb-6 ${opts?.center ? "justify-center" : ""}`}>
      <span className={`h-px w-6 ${line}`} aria-hidden />
      <span className={`text-[11px] font-bold tracking-[0.2em] uppercase ${text}`}>{label}</span>
      {opts?.center && <span className={`h-px w-6 ${line}`} aria-hidden />}
    </div>
  );
};

export default function HomePage() {
  const latestColumns = getAllColumns().slice(0, 3);
  const homePageDesc = `서울 중랑구 매일백세한의원 송원석 원장. 매일감비환 다이어트 한약, 공진단, 무릎관절 NMC. 비대면 진료로 전국 어디서나 처방받으실 수 있습니다. 전화 0507-1467-0195.`;

  return (
    <>
      <JsonLd id="ld-clinic" data={clinicSchema()} />
      <JsonLd id="ld-website" data={websiteSchema()} />
      <JsonLd id="ld-director" data={directorSchema()} />
      <JsonLd id="ld-webpage" data={webPageSchema({ title: `${clinic.name} | 매일감비환 다이어트·공진단·무릎관절 NMC`, description: homePageDesc, path: "/" })} />
      <JsonLd id="ld-faq" data={faqSchema(faqs)} />

      {/* ── 01 · HERO — 줌인 시작 + 스크롤 2막 전환 ── */}
      {/* 규칙: C:\claude\홈페이지\홈페이지디자인\규칙\히어로-줌인트로.md */}
      <HeroZoom />

      {/* 01B · 한 줄 소개 — AI가 답을 만들 때 상단 문단을 쓴다.
          눈에 띄게 둘 필요는 없다. 크기·색은 검색·AI 인용에 영향이 없다.
          (다만 배경색과 같은 색이나 1px처럼 숨기면 '숨긴 텍스트'로 감점된다) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[760px] px-5 md:px-8 py-9 md:py-11 text-center sn-reveal">
          <p className="text-[13px] md:text-[14px] leading-[1.9] text-[#8C8A87]">
            매일백세한의원은 서울 중랑구에서 다이어트 한약(매일감비환)·공진단· 청염단(NMC Protocol)을 처방합니다.
            송원석 원장이 직접 확인한 한약을 처방하며, 비대면 진료로 전국 어디서나 받아보실 수 있습니다.
          </p>
        </div>
      </section>

      {/* ── 02 · STATS ── */}
      <section className="bg-[#0a0a0a] overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-16 md:py-20">
          <p className="text-[10px] tracking-[0.28em] font-bold text-white/35 uppercase mb-10">
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
                <p className="font-serif text-5xl md:text-6xl text-white tracking-tight mb-2">{s.num}</p>
                <p className="text-sm font-semibold text-white/60 mb-1">{s.sub}</p>
                <p className="text-xs text-white/30 leading-relaxed">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 · PRODUCTS ── */}
      <section className="bg-[#FAFAFA]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sn-reveal">
            <div>
              {eyebrow("Our Practice")}
              <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] leading-tight tracking-[-0.025em] text-[#0a0a0a]">
                매일백세한의원의
                <br />
                3가지 집중 진료
              </h2>
            </div>
            <p className="text-sm text-[#525252] max-w-[280px] leading-[1.75]">
              체질·생활습관·목표에 맞춘 맞춤형 한방 진료.
              <br />
              다이어트·공진단·통증 모두 한 곳에서.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {products.map((p, i) => (
              <div key={p.slug} className="sn-reveal" style={{ transitionDelay: `${i * 85}ms` }}>
                <Link
                  href={p.href}
                  className={`rn-card group block rounded-[22px] overflow-hidden border ${
                    p.dark
                      ? "bg-[#0a0a0a] border-white/[0.06] hover:border-white/20"
                      : "bg-white border-black/[0.07] hover:border-black/20"
                  }`}
                >
                  <div className={`relative aspect-[4/3] overflow-hidden ${p.dark ? "bg-[#161616]" : "bg-[#EBE7DF]"}`}>
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className={`rn-zoom object-cover ${p.imagePosition ?? ""}`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </div>
                  <div className="p-7">
                    <p className={`text-[10px] tracking-[0.22em] font-bold uppercase mb-3 ${p.dark ? "text-white/35" : "text-[#888]"}`}>
                      {p.badge}
                    </p>
                    <h3 className={`font-serif text-[1.35rem] font-bold mb-1.5 ${p.dark ? "text-white" : "text-[#0a0a0a]"}`}>
                      {p.title}
                    </h3>
                    <p className={`text-sm font-semibold mb-3 ${p.dark ? "text-white/50" : "text-[#525252]"}`}>{p.subtitle}</p>
                    <p className={`text-sm leading-[1.75] mb-6 ${p.dark ? "text-white/40" : "text-[#525252]"}`}>{p.desc}</p>
                    <span className={`rn-arrow inline-flex items-center gap-2 text-sm font-bold ${p.dark ? "text-white/70" : "text-[#0F0D0A]"}`}>
                      자세히 보기 <span aria-hidden>→</span>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · ABOUT ── */}
      <section className="bg-white border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="sn-reveal order-2 md:order-1">
            <div className="rounded-[24px] bg-black/[0.04] p-2 ring-1 ring-black/[0.06]">
              <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#E8E3D9] shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
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
          </div>

          <div className="order-1 md:order-2 sn-reveal" style={{ transitionDelay: "80ms" }}>
            {eyebrow("About")}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a] mb-5">
              야간·주말·공휴일 진료,
              <br />
              비대면 처방까지 <span className="whitespace-nowrap">한 곳에서</span>
            </h2>
            <p className="text-base text-[#525252] leading-[1.8] mb-8">
              서울 중랑구 공릉로 21, 먹골역 도보 5분 거리의 매일백세한의원입니다.
              2·3층 한 건물에 진료실과 물리치료실이 있어 다이어트·공진단·통증 치료를
              한자리에서 받으실 수 있습니다. 야간·토·일·공휴일 진료로 직장인·학부모도
              편하게 오십니다.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: "평일", value: clinic.hours.weekday },
                { label: "토요일", value: clinic.hours.saturday },
                { label: "전화", value: clinic.contact.phone, href: `tel:${clinic.contact.phoneClean}` },
                { label: "교통", value: "먹골역 도보 5분" },
              ].map((row) => (
                <div key={row.label} className="p-4 rounded-2xl bg-[#F5F5F5] border border-black/[0.05]">
                  <dt className="text-[10px] tracking-widest text-[#888] uppercase font-bold mb-1.5">{row.label}</dt>
                  <dd className="font-bold text-[#0a0a0a] text-sm">
                    {row.href ? (
                      <a href={row.href} className="hover:text-[#525252] transition-colors duration-200">
                        {row.value}
                      </a>
                    ) : (
                      row.value
                    )}
                  </dd>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={clinic.contact.naverBooking}
                target="_blank"
                rel="noopener noreferrer"
                className="rn-btn-primary inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#03C75A] text-white text-sm font-bold"
              >
                네이버 예약하기
              </a>
              <a
                href="https://map.naver.com/p/entry/place/1632908709?lng=127.0777837&lat=37.6126932&placePath=%2Freview%3FadditionalHeight%3D76%26fromPanelNum%3D1%26locale%3Dko%26svcName%3Dmap_pcv5%26timestamp%3D202607021653&searchType=place&c=15.00,0,0,0,dh"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-black/[0.13] text-[#0a0a0a] text-sm font-semibold hover:border-black/25 transition-colors duration-300"
              >
                네이버 리뷰 보기
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 · YOUTUBE ── */}
      <section className="bg-[#F5F2EC] border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 sn-reveal">
            <div>
              {eyebrow("YouTube")}
              <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
                글로 다 못 담는 이야기는
                <br />
                영상으로 보시면 됩니다
              </h2>
              <p className="text-sm text-[#525252] mt-3 max-w-md leading-[1.75]">
                다이어트·공진단 제조·통증 치료까지, 송원석 원장이
                실제 진료실에서 다루는 한방 이야기.
              </p>
            </div>
            <a
              href={clinic.youtube.diet}
              target="_blank"
              rel="noopener noreferrer"
              className="rn-arrow inline-flex items-center gap-2 text-sm font-bold text-[#0F0D0A] shrink-0"
            >
              채널 바로가기 <span aria-hidden>→</span>
            </a>
          </div>
          <YouTubeThumbnailGallery limit={8} />
        </div>
      </section>

      {/* ── 06 · PERSONAS ── */}
      <section className="bg-[#F8F6F2] border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32">
          <div className="text-center mb-16 sn-reveal">
            {eyebrow("For You", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl lg:text-[2.6rem] text-[#0F0D0A] leading-tight tracking-[-0.025em]">
              이런 분들이 매일백세를 찾으십니다
            </h2>
            <p className="text-sm text-[#5C5A57] mt-4 max-w-md mx-auto leading-[1.75]">
              해당되신다면 상담 한 번 받아보세요. 안 맞으면 권하지 않습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personas.map((p, i) => (
              <div
                key={p.title}
                className="sn-reveal group bg-white border border-black/[0.07] rounded-[20px] p-7 hover:border-black/[0.14] hover:shadow-lg hover:shadow-black/[0.04] transition-all duration-300"
                style={{ transitionDelay: `${(i % 3) * 65}ms` }}
              >
                <div className="w-11 h-11 bg-black/[0.05] rounded-xl flex items-center justify-center mb-5 text-[#5C5A57]">
                  {personaIcons[i]}
                </div>
                <p className="text-[11px] font-bold tracking-[0.2em] text-[#8C8A87] mb-3">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-semibold text-[#0F0D0A] text-[15px] leading-snug mb-3">{p.title}</h3>
                <p className="text-sm text-[#5C5A57] leading-[1.75]">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 07 · COLUMNS ── */}
      {latestColumns.length > 0 && (
        <section className="bg-white border-t border-black/[0.05]">
          <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-24 md:py-32">
            <div className="flex items-end justify-between gap-6 flex-wrap mb-14 sn-reveal">
              <div>
                {eyebrow("Columns")}
                <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
                  매일 올라오는 <span className="whitespace-nowrap">한방 건강 정보</span>
                </h2>
              </div>
              <Link
                href="/columns"
                className="rn-arrow inline-flex items-center gap-2 text-sm font-bold text-[#0F0D0A] shrink-0"
              >
                전체 보기 <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {latestColumns.map((c, i) => (
                <div key={c.slug} className="sn-reveal" style={{ transitionDelay: `${i * 85}ms` }}>
                  <Link
                    href={getColumnUrl(c)}
                    className="rn-card group block rounded-[22px] overflow-hidden border border-black/[0.07] hover:border-[var(--brand-primary)]/25 bg-white h-full"
                  >
                    <div className="p-6">
                      <p className="text-[10px] tracking-widest text-[#888] font-bold mb-4 uppercase">{c.category}</p>
                      <h3 className="text-[15px] font-bold mb-2 leading-snug line-clamp-2 text-[#0a0a0a] group-hover:text-[var(--brand-primary)] transition-colors duration-200">
                        {c.title}
                      </h3>
                      <p className="text-sm text-[#525252] line-clamp-2 mb-5 leading-[1.7]">{c.description}</p>
                      <time className="text-xs text-[#888]">{c.date}</time>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 08 · LOCATIONS ── */}
      <section className="bg-[#F5F2EC] border-t border-black/[0.05]">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-16 md:py-20">
          <div className="text-center mb-10 sn-reveal">
            {eyebrow("Locations", { center: true })}
            <h2 className="font-serif text-2xl md:text-3xl leading-tight tracking-[-0.025em] text-[#0a0a0a] mb-3">
              어느 지역에서 오시나요?
            </h2>
            <p className="text-sm text-[#525252] max-w-lg mx-auto leading-[1.75]">
              중랑·노원·동대문·광진·성북·남양주·구리·의정부에서 직접 찾아오시고,
              그 외 지역은 비대면 진료로 전국 어디서나 처방받으십니다.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sn-reveal" style={{ transitionDelay: "80ms" }}>
            {locations.slice(0, 18).map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className="rn-pill px-3 py-3 bg-white rounded-xl border border-black/[0.08] text-center text-sm font-semibold text-[#0a0a0a]"
              >
                {loc.name}
              </Link>
            ))}
            <a
              href={clinic.contact.onlineForm}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-3 bg-[#0F0D0A] text-white rounded-xl border border-black text-center text-sm font-bold hover:bg-[#2a2a2a] transition-colors duration-300"
            >
              전국 비대면
            </a>
          </div>
        </div>
      </section>

      {/* ── 09 · FAQ ── */}
      <section className="bg-white border-t border-black/[0.05]">
        <div className="mx-auto max-w-3xl px-5 md:px-8 py-24 md:py-28">
          <div className="text-center mb-14 sn-reveal">
            {eyebrow("FAQ", { center: true })}
            <h2 className="font-serif text-3xl md:text-4xl leading-tight tracking-[-0.025em] text-[#0a0a0a]">
              자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-3 sn-reveal" style={{ transitionDelay: "80ms" }}>
            {faqs.slice(0, 5).map((f, i) => (
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

          <div className="mt-8 text-center sn-reveal" style={{ transitionDelay: "120ms" }}>
            <Link href="/faq" className="rn-arrow inline-flex items-center gap-2 text-sm font-bold text-[#0F0D0A]">
              전체 FAQ 보기 <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 10 · FINAL CTA ── */}
      <section id="contact" className="bg-[#0a0a0a] overflow-hidden scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 py-28 md:py-36 text-center sn-reveal">
          {eyebrow("Contact", { center: true, dark: true })}
          <h2 className="font-serif text-4xl md:text-6xl lg:text-[4.75rem] text-white leading-[1.06] tracking-[-0.025em] mb-6">
            상담은 부담 없이,
            <br />
            <span className="text-white/70">처방은 책임 있게</span>
          </h2>
          <p className="text-white/40 mb-14 max-w-md mx-auto text-base leading-[1.8]">
            전화·카카오톡·네이버 예약 모두 가능합니다.
            <br />
            평일 {clinic.hours.weekday}, 토요일 {clinic.hours.saturday}.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${clinic.contact.phoneClean}`}
              className="rn-btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[var(--brand-primary)] text-white text-[15px] font-bold rounded-full"
            >
              {clinic.contact.phone} 전화 상담
            </a>
            <a
              href={clinic.contact.kakao}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#FAE100] text-[#3C1E1E] text-[15px] font-bold rounded-full hover:brightness-95 transition"
            >
              카카오톡으로 문의하기
            </a>
            <a
              href={clinic.contact.naverBooking}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#03C75A] text-white text-[15px] font-bold rounded-full hover:brightness-95 transition"
            >
              네이버 예약하기
            </a>
          </div>
        </div>
      </section>


    </>
  );
}
