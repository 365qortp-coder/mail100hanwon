import Link from "next/link";
import { Section, SectionTitle } from "@/components/Section";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { clinic } from "@/data/clinic";
import { treatments } from "@/data/treatments";
import { locations } from "@/data/locations";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

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

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--brand-primary-light)] via-white to-[var(--brand-accent-light)]">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="text-sm font-semibold tracking-widest text-[var(--brand-primary)] mb-3">
            서울 중랑구 · 먹골역 도보 5분
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight text-[var(--foreground)]">
            매일감비환 다이어트 · 공진단
            <br />
            <span className="text-[var(--brand-primary)]">매일백세한의원</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
            송원석 원장이 직접 처방하는 한방 다이어트 한약 <b>매일감비환</b>,
            정통 처방 그대로 직접 만든 <b>공진단</b>, 수험생을 위한{" "}
            <b>총명공진단</b>까지. 비대면 진료로 전국 어디서나 처방받을 수
            있습니다.
          </p>

          <div className="mt-8 max-w-2xl">
            <CTAButtons />
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
            {[
              { num: "20+", label: "년 진료 경력" },
              { num: "전국", label: "비대면 진료" },
              { num: "3개", label: "유튜브 채널" },
              { num: "직접", label: "공진단 제조" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/80 backdrop-blur rounded-lg p-4 border border-[var(--border)]">
                <p className="text-2xl md:text-3xl font-bold text-[var(--brand-primary)]">
                  {stat.num}
                </p>
                <p className="text-xs md:text-sm text-[var(--text-muted)] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FACTS for AI / search */}
      <Section bg="white">
        <KeyFactsBox
          title="매일백세한의원 한눈에 보기"
          facts={[
            { label: "한의원명", value: clinic.name },
            { label: "대표원장", value: `${clinic.director.name} ${clinic.director.title}` },
            { label: "위치", value: clinic.address.full },
            { label: "전화", value: clinic.contact.phone },
            { label: "주력 진료", value: "매일감비환 다이어트 · 공진단 · 총명공진단 · 통증치료" },
            { label: "진료 방식", value: "대면 진료 + 비대면 진료 (전국 택배 발송)" },
            { label: "가까운 역", value: "7호선 먹골역 도보 5분, 6·7호선 태릉입구역 도보 10분" },
          ]}
        />
      </Section>

      {/* TREATMENTS */}
      <Section bg="muted">
        <SectionTitle
          eyebrow="진료 안내"
          title="매일백세한의원의 4가지 주력 진료"
          subtitle="체질·생활습관·목표를 고려한 한방 맞춤 진료를 제공합니다."
        />
        <div className="grid md:grid-cols-2 gap-5">
          {treatments.map((t) => (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              className="group block bg-white p-6 rounded-xl border border-[var(--border)] hover:border-[var(--brand-primary)] hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--brand-primary)]">
                  {t.name}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary-dark)] font-semibold whitespace-nowrap">
                  {t.category === "diet" && "다이어트"}
                  {t.category === "gongjindan" && "보약"}
                  {t.category === "chongmyeong" && "수험생"}
                  {t.category === "pain" && "통증"}
                </span>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {t.summary}
              </p>
              <p className="mt-4 text-sm font-semibold text-[var(--brand-primary)]">
                자세히 보기 →
              </p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 비대면 진료 */}
      <Section bg="white">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <SectionTitle
              eyebrow="전국 비대면 진료"
              title="멀리 계셔도 매일백세한의원의 처방을 받으실 수 있습니다"
              subtitle="구글 설문지 작성 → 원장님 전화 상담 → 한약 택배 발송. 다이어트 한약 매일감비환, 공진단, 총명공진단 모두 비대면 처방 가능합니다."
            />
            <Link
              href="/online"
              className="inline-flex items-center px-5 py-3 rounded-md bg-[var(--brand-primary)] text-white font-semibold hover:bg-[var(--brand-primary-dark)] transition"
            >
              비대면 진료 안내 보기
            </Link>
          </div>
          <ol className="bg-[var(--surface-muted)] rounded-xl p-6 space-y-4 border border-[var(--border)]">
            {[
              { step: "01", title: "전화 또는 카카오톡 문의", desc: "어떤 진료를 원하시는지 안내드립니다." },
              { step: "02", title: "구글 설문지 작성", desc: "체질·생활습관·증상을 작성해주세요." },
              { step: "03", title: "원장님 전화 상담", desc: "송원석 원장님이 직접 상담드립니다." },
              { step: "04", title: "한약 택배 발송", desc: "처방 후 한약을 제조해 택배로 보내드립니다." },
            ].map((s) => (
              <li key={s.step} className="flex gap-4">
                <span className="text-xl font-bold text-[var(--brand-primary)] w-10 shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-[var(--text-muted)] mt-0.5">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 지역 */}
      <Section bg="muted">
        <SectionTitle
          eyebrow="진료 가능 지역"
          title="중랑구·노원구·동대문구 외 전국 어디서나"
          subtitle="가까운 지역은 직접 방문, 멀리 계신 분들은 비대면 진료로 처방받으실 수 있습니다."
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {locations.slice(0, 16).map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="px-4 py-3 bg-white rounded-md border border-[var(--border)] hover:border-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] transition text-center"
            >
              <p className="text-sm font-semibold">{loc.name}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* 유튜브 */}
      <Section bg="white">
        <SectionTitle
          eyebrow="유튜브 채널"
          title="송원석 원장의 직접 진료 콘텐츠를 만나보세요"
          subtitle="다이어트·공진단·통증 3개 채널에서 진료 노하우와 한방 의학 정보를 공유합니다."
        />
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { url: clinic.youtube.diet, name: "엄마들을 위한 다이어트", desc: "매일감비환·다이어트 한약 영상" },
            { url: clinic.youtube.gongjindan, name: "직접 만든 진짜 공진단", desc: "공진단 제조 과정·정보 공개" },
            { url: clinic.youtube.pain, name: "매일백세한의원 통증", desc: "통증 치료 사례·노하우" },
          ].map((c) => (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-5 bg-[var(--surface-muted)] rounded-xl border border-[var(--border)] hover:border-red-500 hover:shadow transition"
            >
              <p className="text-xs font-semibold text-red-600 mb-2">YOUTUBE</p>
              <h3 className="font-bold mb-1">{c.name}</h3>
              <p className="text-sm text-[var(--text-muted)]">{c.desc}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* 최종 CTA */}
      <Section bg="brand">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            상담은 부담 없이, 처방은 책임 있게
          </h2>
          <p className="text-white/90 mb-6">
            전화·카카오톡·비대면 신청 모두 가능합니다. 평일 09:30~18:30 운영.
          </p>
          <div className="bg-white p-2 rounded-lg">
            <CTAButtons />
          </div>
        </div>
      </Section>
    </>
  );
}
