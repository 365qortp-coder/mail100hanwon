import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { CTAButtons } from "@/components/CTAButtons";
import { clinic } from "@/data/clinic";
import { getColumnsBySection, getColumnUrl, getColumnImage, type ColumnMeta } from "@/lib/columns";

export const metadata: Metadata = buildMetadata({
  title: "매일감비환 | 40~60대 엄마 기초대사량 회복 다이어트 한약",
  description:
    "40대~갱년기 엄마들을 위한 기초대사회복 다이어트 한약 매일감비환. 2026년 기준 7만건 이상 처방, 오프라인 내원 환자 89.9% 체지방 위주 감량. 후기 평균 48일 4.5kg. 1달 11만원~, 비대면 전국 처방. 02-2234-0102.",
  path: "/diet",
  ogImage: "/photos/diet-product.webp",
  keywords: [
    "감비환",
    "매일감비환",
    "다이어트한약",
    "한방다이어트",
    "기초대사량다이어트",
    "갱년기다이어트",
    "40대다이어트",
    "50대다이어트",
    "폐경후다이어트",
    "요요방지한약",
    "체지방감량한약",
    "비대면다이어트",
    "다이어트한약가격",
    "감비환효과",
    "감비환부작용",
  ],
});

const faqs = [
  {
    q: "감비환에 마황(에페드린)이 들어있나요?",
    a: "네, 매일감비환에는 마황이 포함됩니다. 마황의 에페드린 성분이 교감신경을 자극해 체지방 분해를 촉진하는 것이 핵심 작용입니다. 다이어트 한약 부작용(두통·울렁거림·불면증·떨림·붕뜬 기분 등)은 모두 내 몸이 버틸 수 있는 용량보다 강하게 복용했을 때 나타납니다. 매일감비환은 1~8단계 복용량 미세 조정(알약 개수로 조절)을 통해 본인에게 딱 맞는 단계를 찾기 때문에, 올바른 단계로 복용하면 부작용 없이 편하게 감량부터 요요방지까지 가능합니다.",
  },
  {
    q: "감비환 부작용(두통·울렁거림·불면증)이 왜 생기나요?",
    a: "감비환 부작용은 내 몸이 버틸 수 있는 용량보다 강하게 먹었을 때 생깁니다. 마황의 에페드린 성분이 교감신경을 과도하게 흥분시키면 두통·울렁거림·속쓰림·불면증·떨림·붕뜬 기분이 나타납니다. 매일감비환은 1~8단계 미세 조정이 가능해, 부작용이 생기면 한 단계 낮춰 알약 개수를 줄이면 해결됩니다. 상담 시 체질과 반응을 보면서 단계를 찾아드립니다.",
  },
  {
    q: "갱년기·폐경 후에도 효과가 있나요?",
    a: "네. 실제 후기에서 갱년기 여성호르몬 약 복용 중 8.7kg 감량, 폐경 후 60대 초반이 82일 4.6kg 감량한 사례가 있습니다. 갱년기·폐경 후 복부에 살이 급격히 찌기 시작한 분들께 특히 적합합니다. 개인 상태에 따라 처방 구성이 달라지므로 상담을 먼저 받으시길 권장합니다.",
  },
  {
    q: "마운자로·위고비 주사 대신 감비환을 써도 되나요?",
    a: "실제 후기에서 마운자로·위고비 대신 감비환을 선택한 사례가 다수입니다. GLP-1 계열 주사는 구역·구토·췌장염 등의 부작용 우려가 있고, 중단 후 요요가 잦습니다. 감비환은 주사 없이 복용량 조절이 가능하고 비용도 낮습니다. 다만 적합 여부는 체질에 따라 다르므로 상담 후 결정하시기 바랍니다.",
  },
  {
    q: "비대면으로 처방받을 수 있나요?",
    a: "가능합니다. 전화(02-2234-0102) 또는 카카오톡으로 문의 → 구글 설문지 작성 → 원장 송원석 전화 상담 → 처방 후 택배 발송(영업일 2~5일). 전국 어디서나 받으실 수 있습니다.",
  },
  {
    q: "얼마나 빨리 효과가 나타나나요?",
    a: "가장 빠른 사례는 10일 만에 2.5kg 감량입니다(40대 여성, 운동해도 안 빠지던 체질). 평균은 48일 4.5kg입니다. 체질·복용 환경·생활 패턴에 따라 차이가 있으며, 기초대사량이 많이 떨어진 분일수록 초기 효과가 느리게 나타날 수 있습니다.",
  },
  {
    q: "복용 중 식단·운동을 따로 해야 하나요?",
    a: "엄격한 식단 관리 없이도 감량 효과를 경험한 분들이 많습니다. 후기에서 수면 4~5시간, 운동 주 1회의 불규칙한 생활 중에도 51일 5.1kg 감량한 사례가 있습니다. 다만 일상에서 큰 변화 없이 복용하는 분들도 계시고, 가벼운 걷기만 병행해도 효과가 높아지는 경우가 많습니다.",
  },
  {
    q: "요요가 생기지 않나요?",
    a: "감비환은 감량기(2~3달)와 요요방지기(6개월)를 구분해 처방합니다. 기초대사량을 회복시켜 체중이 유지되는 체질로 전환하는 것이 목표입니다. 요요를 반복하신 분은 요요방지 플랜 포함 처방을 권장합니다.",
  },
];

const reviews = [
  {
    id: "r001",
    profile: "40대 여성 / 165cm / 운동해도 안 빠지던 체질",
    highlight: "10일만에 58.5kg 달성 — 탄수화물 줄여도 꿈쩍 않던 체중이 열흘 만에 변화. 몸에 열이 오르고 땀이 잘 나기 시작했습니다.",
    loss: "2.5kg",
    days: "10일",
    tag: "최단 효과",
  },
  {
    id: "r005",
    profile: "갱년기 여성 / 여성호르몬 약 복용 중 / 복부·등·팔뚝 급증",
    highlight: "호르몬 약 복용 중에도 8.7kg 감량. 현재 고칼로리 식단에도 51kg 유지. '30대 이상 호르몬 문제·식욕 못 참는 분들께 강추'",
    loss: "8.7kg",
    days: "2달+",
    tag: "최대 감량",
  },
  {
    id: "r002",
    profile: "40대 자영업 여성 / 수면 4~5시간 / 운동 주 1회",
    highlight: "수면 부족·불규칙 생활 중에도 51일 5.1kg 감량. 체지방 훅 감소, 근력도 유지. 마운자로 주사 대신 선택.",
    loss: "5.1kg",
    days: "51일",
    tag: "불규칙 생활",
  },
  {
    id: "r003",
    profile: "60대 초반 여성 / 허리 부상 2년 후 체중 증가 / 활동량 감소",
    highlight: "따로 운동 없이 대중교통 이용 + 주 3회 온열찜질만으로 82일 4.6kg 감량. 골격근 유지 확인. 예전 옷 다시 입을 수 있게 됨.",
    loss: "4.6kg",
    days: "82일",
    tag: "60대 사례",
  },
];

const targetGroups = [
  {
    title: "굶어도, 운동해도 체중이 꿈쩍 않는 분",
    desc: "탄수화물을 줄이고 운동도 했는데 살이 안 빠진다면 기초대사량이 떨어진 상태일 수 있습니다.",
  },
  {
    title: "갱년기·폐경 후 복부에 갑자기 살이 찌기 시작한 분",
    desc: "에스트로겐 감소 + 기초대사량 하락이 복합된 상황입니다. 식이 조절보다 대사 회복이 먼저입니다.",
  },
  {
    title: "마운자로·위고비 주사가 걱정되는 분",
    desc: "구역·구토·췌장염 부작용 우려, 주 1회 주사 부담, 중단 후 요요. 다른 방법을 찾으시는 분께 감비환을 권합니다.",
  },
  {
    title: "수면 부족·불규칙 생활이라 식단 관리가 어려운 분",
    desc: "수면 4~5시간, 운동 주 1회의 환경에서도 51일 5.1kg 감량한 사례가 있습니다.",
  },
  {
    title: "요요를 반복하는 분",
    desc: "굶어서 뺐다가 다시 찌는 패턴은 근육 손실 → 기초대사량 하락의 악순환입니다. 감량기 이후 6개월 요요방지 플랜을 함께 처방합니다.",
  },
  {
    title: "한의원이 멀어서 비대면을 원하는 분",
    desc: "전국 어디서나 전화·카카오톡 상담 후 택배로 수령 가능합니다.",
  },
];

export default function DietPage() {
  return (
    <>
      <JsonLd id="schema-diet-faq" data={faqSchema(faqs)} />
      <JsonLd id="schema-diet-product" data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: "매일감비환",
        description: "40대~갱년기 엄마들을 위한 기초대사회복 다이어트 한약. 2026년 7만건 이상 처방, 오프라인 내원 89.9% 체지방 위주 감량. 2~3달 감량 + 6개월 요요방지.",
        brand: { "@type": "Brand", name: "매일백세한의원" },
        offers: {
          "@type": "Offer",
          price: "110000",
          priceCurrency: "KRW",
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: clinic.name },
        },
      }} />

      {/* ── 01 HERO ── */}
      <section className="bg-gradient-to-br from-[var(--brand-primary-light)] to-white border-b border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--brand-primary)] uppercase mb-3">
            다이어트 한약 · 매일백세한의원
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            굶을수록 살찌는 이유,
            <br />
            <span className="text-[var(--brand-primary)]">기초대사량</span>입니다
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed mb-8">
            40~60대 엄마들의 기초대사량 회복에 특화된 매일감비환.
            체지방 위주로 빼고, 근육은 지키며, 6개월 요요방지까지.
            비대면으로 전국 어디서나 처방받으실 수 있습니다.
          </p>
          {/* 수치 배지 */}
          <div className="flex flex-wrap gap-4 mb-10">
            {[
              { num: "7만건+", label: "2026년 누적 처방" },
              { num: "89.9%", label: "체지방 위주 감량" },
              { num: "7.2kg", label: "2달 평균 감량" },
              { num: "11만원~", label: "1달 처방 시작가" },
            ].map((b) => (
              <div
                key={b.label}
                className="bg-white border border-[var(--border)] rounded-xl px-5 py-3 text-center shadow-sm"
              >
                <p className="text-xl font-extrabold text-[var(--brand-primary)]">{b.num}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">{b.label}</p>
              </div>
            ))}
          </div>
          <CTAButtons formUrl={clinic.contact.onlineFormDiet} formLabel="비대면 진료 신청" />
        </div>
      </section>

      {/* ── 02 원장 스토리 ── */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20 grid md:grid-cols-[220px_1fr] gap-8 items-start">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--surface-muted)] mx-auto w-44 md:w-full">
            <Image
              src="/photos/director.webp"
              alt="매일백세한의원 송원석 원장"
              fill
              className="object-cover"
              sizes="220px"
            />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-4">
              Story · 송원석 원장
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-6">
              처음엔 저도 직접 다이어트하려고
              <br />
              아내가 산후에 살이 빠지지 않다고 해서
              <br />
              엄마들을 위한 다이어트한약으로{" "}
              <span className="text-[var(--brand-primary)]">더 좋게 만들었습니다</span>
            </h2>
            <div className="space-y-4 text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
              <p>
                출산 후 체중이 돌아오지 않는 아내를 보며 한방 다이어트 처방을 직접
                연구하기 시작했습니다. 굶어서 빠지는 것이 아닌, 기초대사량을 회복해
                체지방 위주로 빠지는 처방이 필요했습니다.
              </p>
              <p>
                10년 넘게 처방하고 개선해온 결과가 매일감비환입니다.
                효과 있는 진료만 권해드리겠다는 원칙을 지키기 위해,
                체질이 맞지 않으면 처방하지 않습니다.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={clinic.youtube.diet}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] text-sm font-semibold hover:border-[var(--brand-primary)] transition"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-red-600" aria-hidden>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                엄마들을 위한 다이어트 채널
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 누적 통계 ── */}
      <section className="bg-black text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <p className="text-[11px] tracking-[0.25em] font-bold text-[var(--brand-primary)] uppercase mb-6 text-center">
            40대~갱년기 엄마들의 기초대사회복 다이어트 · 2026년 기준
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <div className="border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-5xl font-extrabold text-[var(--brand-primary)]">70,000<span className="text-2xl">건+</span></p>
              <p className="text-sm text-white/60 mt-2">누적 처방 (2026년 기준)</p>
            </div>
            <div className="border border-white/10 rounded-2xl p-6 text-center">
              <p className="text-5xl font-extrabold text-[var(--brand-primary)]">89.9<span className="text-2xl">%</span></p>
              <p className="text-sm text-white/60 mt-2">체지방 위주 감량 <span className="text-white/40 text-xs">(오프라인 내원 기준)</span></p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { num: "7.2kg", label: "2달 평균 감량" },
              { num: "48일", label: "후기 평균 기간" },
              { num: "0.3%", label: "간수치 이상 발생률" },
              { num: "전국", label: "비대면 택배 처방" },
            ].map((s) => (
              <div key={s.label} className="border-l-2 border-[var(--brand-primary)] pl-4">
                <p className="text-xl md:text-2xl font-extrabold text-white">{s.num}</p>
                <p className="text-xs md:text-sm text-white/70 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 대상자 ── */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              For You
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              이런 분들께 매일감비환을 권합니다
            </h2>
            <p className="text-sm md:text-base text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
              해당되신다면 상담 한 번 받아보세요. 체질이 맞지 않으면 권하지 않습니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {targetGroups.map((g) => (
              <div
                key={g.title}
                className="bg-[var(--surface-muted)] p-6 rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow transition"
              >
                <h3 className="font-extrabold leading-snug mb-2">{g.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 원리 ── */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Why
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              왜 굶을수록 살이 찌는가
            </h2>
          </div>
          <ol className="space-y-5">
            {[
              {
                step: "01",
                title: "굶으면 지방보다 근육이 먼저 빠집니다",
                desc: "칼로리를 급격히 줄이면 우리 몸은 지방 대신 근육을 에너지원으로 사용합니다. 빠른 체중 감소처럼 보이지만, 빠진 것의 상당 부분이 근육입니다.",
              },
              {
                step: "02",
                title: "근육이 줄면 기초대사량이 하락합니다",
                desc: "기초대사량의 약 30%는 근육이 담당합니다. 근육이 줄면 아무것도 안 해도 소모하는 칼로리가 줄어들고, 조금만 먹어도 살찌는 체질로 바뀝니다.",
              },
              {
                step: "03",
                title: "매일감비환은 기초대사량 회복을 먼저 합니다",
                desc: "단순 식욕 억제나 수분 배출이 아닌, 체지방 위주로 빠지게 하면서 기초대사량을 회복시키는 데 초점을 맞춥니다. 감량 후에도 체중이 유지되는 체질로 전환하는 것이 목표입니다.",
              },
            ].map((item) => (
              <li
                key={item.step}
                className="flex gap-5 p-6 bg-white rounded-xl border border-[var(--border)] shadow-sm"
              >
                <span className="text-2xl font-extrabold text-[var(--brand-primary)] shrink-0 w-8">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 05 실제 후기 ── */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Reviews
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              실제 복용 후기
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
              환자 동의 하에 공개하는 실제 복용 사례입니다.
              개인 체질에 따라 결과는 다를 수 있습니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-6 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] hover:border-[var(--brand-primary)] transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary)]">
                    {r.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-[var(--brand-primary)]">{r.loss}</span>
                    <span className="text-xs text-[var(--text-muted)] ml-1">/ {r.days}</span>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mb-3 font-medium">{r.profile}</p>
                <p className="text-sm leading-relaxed text-[var(--foreground)]">{r.highlight}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[var(--text-muted)] mt-6">
            ※ 후기 8건 기준 평균 4.5kg / 48일. 개인 체질에 따라 결과는 다를 수 있습니다.
          </p>
        </div>
      </section>

      {/* ── 06 8단계 용량 조절 안전성 ── */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Safety
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              부작용 걱정?
              <br />
              <span className="text-[var(--brand-primary)]">복용량을 줄이면 됩니다</span>
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-3 max-w-xl mx-auto">
              두통·울렁거림·불면 등 부작용은 내 몸이 감당할 수 있는 것보다 강하게 복용했을 때 생깁니다.
              매일감비환은 1~8단계 알약 개수 조절로 본인에게 맞는 단계를 찾을 수 있습니다.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
              <p className="text-xs font-bold text-[var(--brand-primary)] tracking-widest mb-3">1~8단계 조절</p>
              <h3 className="font-extrabold text-lg mb-3">알약 개수로 미세 조정</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                부작용이 생기면 한 단계 낮춰 알약 개수를 줄이면 해결됩니다.
                상담 시 체질과 반응을 보면서 본인에게 딱 맞는 단계를 찾아드립니다.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
              <p className="text-xs font-bold text-[var(--brand-primary)] tracking-widest mb-3">간수치 안전 데이터</p>
              <h3 className="font-extrabold text-lg mb-3">17,089명 처방 기준</h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                간수치 문제 발생률 <strong>0.3% 이내</strong>. BMJ 2015 연구에서도
                마황 함유 한약의 간독성은 일반 의약품과 유사 수준임이 확인됐습니다.
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-3">※ BMJ, 2015</p>
            </div>
          </div>

          <div className="bg-[var(--brand-primary-light)] rounded-2xl border border-[var(--border)] p-6 text-center">
            <p className="text-sm font-semibold text-[var(--brand-primary-dark)]">
              마황(에페드린) 포함 사실을 투명하게 공개합니다.<br />
              체질이 맞지 않으면 처방하지 않고, 복용 중 이상 반응이 있으면 즉시 단계를 낮춥니다.
            </p>
          </div>
        </div>
      </section>

      {/* ── 07 비교표 ── */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Comparison
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
              마운자로·위고비 vs 매일감비환
            </h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm bg-white">
              <thead className="bg-[var(--surface-muted)]">
                <tr>
                  <th className="text-left p-4 font-bold">항목</th>
                  <th className="text-center p-4 font-bold text-[var(--brand-primary)]">매일감비환</th>
                  <th className="text-center p-4 font-bold text-[var(--text-muted)]">마운자로·위고비</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { item: "방식", ours: "한약 복용", theirs: "주사 (주 1회)" },
                  { item: "1달 비용", ours: "11만원~", theirs: "40~80만원" },
                  { item: "부작용", ours: "적음 (복용량 조절)", theirs: "구역·구토·췌장염 보고" },
                  { item: "근육 유지", ours: "체지방 위주 감량", theirs: "근육 손실 가능" },
                  { item: "중단 후", ours: "요요방지 6개월 플랜", theirs: "요요 잦음" },
                  { item: "비대면 처방", ours: "가능 (전국 택배)", theirs: "불가 (병원 내원 필수)" },
                  { item: "복용 조절", ours: "본인이 조절 가능", theirs: "의사 처방 필수" },
                ].map((row) => (
                  <tr key={row.item} className="border-t border-[var(--border)]">
                    <td className="p-4 font-medium text-[var(--text-muted)]">{row.item}</td>
                    <td className="p-4 text-center font-semibold text-[var(--brand-primary)]">{row.ours}</td>
                    <td className="p-4 text-center text-[var(--text-muted)]">{row.theirs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3 text-center">
            ※ 마운자로·위고비 가격은 시중 참고가 기준이며, 개인차가 있습니다.
          </p>
        </div>
      </section>

      {/* ── 08 가격표 (패키지 카드형) ── */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Pricing
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">비용 안내</h2>
            <p className="text-sm text-[var(--text-muted)] mt-3">기간이 길어질수록 가성비가 커져요</p>
          </div>

          {/* 추천 패키지 카드 */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="relative rounded-2xl border-2 border-[var(--brand-primary)] bg-[var(--brand-primary-light)] p-6">
              <p className="absolute -top-3 left-4 bg-[var(--brand-primary)] text-white text-xs font-bold px-3 py-1 rounded-full">추천</p>
              <p className="text-xs font-bold text-[var(--brand-primary)] tracking-widest mb-2">2달 감량 + 6개월 요요관리</p>
              <p className="text-3xl font-extrabold text-[var(--brand-primary-dark)] mb-1">339,000원</p>
              <p className="text-xs text-[var(--text-muted)]">감량 2달 + 요요방지 6개월 패키지</p>
            </div>
            <div className="relative rounded-2xl border-2 border-black bg-black text-white p-6">
              <p className="text-xs font-bold text-[var(--brand-primary)] tracking-widest mb-2">3달 감량 + 6개월 요요관리</p>
              <p className="text-3xl font-extrabold mb-1">479,000원</p>
              <p className="text-xs text-white/50">체중 많이 빼야 하는 분 · 최대 효과</p>
            </div>
          </div>

          {/* 단기 옵션 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-5 mb-4">
            <p className="text-xs font-bold text-[var(--text-muted)] mb-3">단기 옵션 (처음 시작하시는 분)</p>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <p className="font-bold">1달</p>
                <p className="text-[var(--brand-primary)] font-extrabold">110,000원</p>
              </div>
              <div>
                <p className="font-bold">2달</p>
                <p className="text-[var(--brand-primary)] font-extrabold">209,000원</p>
              </div>
              <div>
                <p className="font-bold">3달</p>
                <p className="text-[var(--brand-primary)] font-extrabold">299,000원</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[var(--text-muted)] mb-8">
            ※ 비용은 표시 시점 기준이며 변경될 수 있습니다. 자세한 처방은 상담 시 안내드립니다.
          </p>
          <CTAButtons formUrl={clinic.contact.onlineFormDiet} formLabel="비대면 진료 신청" />
        </div>
      </section>

      {/* ── 08 진료 절차 ── */}
      <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              Process
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">진료 절차</h2>
          </div>
          <ol className="space-y-3">
            {[
              "전화(02-2234-0102) 또는 카카오톡 채널로 문의",
              "구글 설문지 작성 (비대면) 또는 내원 (대면)",
              "원장 송원석 전화·대면 상담 (체질·생활 패턴 파악)",
              "처방 결정 후 감비환 제조",
              "영업일 2~5일 이내 전국 택배 발송 또는 직접 수령",
            ].map((step, i) => (
              <li
                key={i}
                className="flex gap-4 p-4 bg-white rounded-lg border border-[var(--border)]"
              >
                <span className="text-lg font-bold text-[var(--brand-primary)] w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[var(--foreground)]">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── 09 FAQ ── */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">
              FAQ
            </p>
            <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">자주 묻는 질문</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <details
                key={i}
                className="group rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4 hover:border-[var(--brand-primary)] transition"
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

      {/* ── 10 다이어트 칼럼 ── */}
      <DietColumnsSection />

      {/* ── 12 mail100diet.com 링크 배너 ── */}
      <section className="bg-white border-t border-[var(--border)]">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-3">
            More Info
          </p>
          <h2 className="text-xl md:text-2xl font-extrabold mb-2">
            유튜브 후기·상세 복용법이 궁금하시면
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-6">
            매일감비환 전용 홈페이지에서 실제 후기 영상, 복용 꿀팁, 다이어트 조언을 확인하세요.
          </p>
          <a
            href="https://mail100diet.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] font-bold text-sm hover:bg-[var(--brand-primary)] hover:text-white transition"
          >
            매일감비환 전용 홈페이지 보기 →
          </a>
        </div>
      </section>

      {/* ── 12 FINAL CTA ── */}
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
            평일 09:30~18:30, 토요일 09:30~13:00.
          </p>
          <div className="max-w-xl mx-auto">
            <CTAButtons formUrl={clinic.contact.onlineFormDiet} formLabel="비대면 진료 신청" />
          </div>
          <p className="mt-6 text-white/50 text-sm">
            서울 중랑구 공릉로 21 · 먹골역 도보 5분 · {clinic.contact.phone}
          </p>
        </div>
      </section>
    </>
  );
}

function DietColumnsSection() {
  const cols = getColumnsBySection("diet").slice(0, 3);
  if (!cols.length) return null;
  return (
    <section className="bg-[var(--surface-muted)] border-t border-[var(--border)]">
      <div className="mx-auto max-w-4xl px-4 py-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-[var(--text-muted)] uppercase mb-2">Column</p>
            <h2 className="text-xl md:text-2xl font-extrabold">다이어트 칼럼</h2>
          </div>
          <Link href="/diet/columns" className="text-sm text-[var(--brand-primary)] font-semibold hover:underline">
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
