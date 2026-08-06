import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { locations, getLocation } from "@/data/locations";
import { treatments } from "@/data/treatments";
import { clinic } from "@/data/clinic";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return {};

  const title = `${loc.name} 한의원 | 매일백세한의원`;
  const description = `${loc.name}에서 가까운 매일백세한의원. 매일감비환 다이어트 한약, 공진단, 총명공진단 처방. ${loc.access}. 비대면 진료도 가능합니다.`;

  return buildMetadata({
    title,
    description,
    path: `/locations/${loc.slug}`,
    keywords: loc.keywords,
  });
}

export default async function LocationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const loc = getLocation(slug);
  if (!loc) return notFound();

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb
          items={[
            { name: "지역 안내", href: "/locations/jungnang" },
            { name: loc.name, href: `/locations/${loc.slug}` },
          ]}
        />
      </div>

      {/* HERO */}
      <section className="bg-[#FAFAFA] border-b border-black/[0.05]">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-[var(--brand-primary)]" aria-hidden />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--brand-primary)]">
              {loc.type === "district" && "구 · 자치구"}
              {loc.type === "neighborhood" && "동 · 동네"}
              {loc.type === "city" && "시 · 인근 지역"}
              {loc.type === "station" && "지하철역"}
            </span>
          </div>
          <h1 className="font-serif text-[2.25rem] md:text-[3.25rem] tracking-[-0.025em] leading-[1.14] text-[#0a0a0a]">
            {loc.fullName} 한의원
            <br />
            <span className="text-[var(--brand-primary)]">매일백세한의원</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-[#525252] max-w-2xl leading-[1.8]">
            {loc.description}
          </p>
          <div className="mt-8 max-w-2xl">
            <CTAButtons />
          </div>
        </div>
      </section>

      <Section bg="white">
        <KeyFactsBox
          title={`${loc.name} 환자분께`}
          facts={[
            { label: "한의원 주소", value: clinic.address.full },
            { label: "접근성", value: loc.access },
            { label: "특징", value: loc.highlights.join(", ") },
            { label: "진료 항목", value: "매일감비환 · 공진단 · 총명공진단 · 통증" },
            { label: "비대면 가능", value: "다이어트 한약, 공진단, 총명공진단 (전국 택배)" },
          ]}
        />

        <h2 className="font-serif text-3xl tracking-[-0.025em] text-[#0a0a0a] mt-14 mb-6">
          {loc.name}에서 매일백세한의원을 찾으시는 이유
        </h2>
        <div className="prose max-w-none text-[var(--foreground)] leading-relaxed">
          <p>
            매일백세한의원은 {clinic.address.full}에 위치한 한의원입니다.
            {loc.name} 주민분들이 가장 자주 찾으시는 진료는 다이어트 한약{" "}
            <b>매일감비환</b>, 정통 한약재로 직접 제조한 <b>공진단</b>,
            수험생을 위한 <b>총명공진단</b>입니다.
          </p>
          <p>
            특히 {loc.name}에서는 다음과 같은 분들이 자주 내원하시거나 비대면
            진료를 신청하십니다.
          </p>
          <ul>
            <li>출산 후 다이어트가 필요한 엄마들 (매일감비환)</li>
            <li>업무·육아로 피로한 직장인 (공진단)</li>
            <li>수능·고시·면접을 준비하는 수험생 (총명공진단)</li>
            <li>허리·목·어깨 통증으로 일상이 불편하신 분 (통증 치료)</li>
          </ul>
          <p>
            {loc.type === "city" || loc.name === "서울 전역" ? (
              <>
                {loc.name}에서 직접 내원이 어렵다면 비대면 진료를 이용해
                보세요. 구글 설문지 작성 → 원장님 전화 상담 → 한약 택배 발송
                순서로 진행되며, 영업일 기준 2~5일 이내에 받아보실 수 있습니다.
              </>
            ) : (
              <>
                {loc.name}에서 매일백세한의원까지는 {loc.access} 거리이며,
                직접 내원이 부담스러우신 분은 비대면 진료를 이용하시면
                편리합니다.
              </>
            )}
          </p>
        </div>

        {/* 진료 안내 */}
        <h2 className="font-serif text-3xl tracking-[-0.025em] text-[#0a0a0a] mt-14 mb-6">진료 항목 안내</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {treatments.map((t) => (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              className="rn-card block p-6 rounded-[20px] bg-white border border-black/[0.07] hover:border-black/20"
            >
              <h3 className="font-bold text-[#0a0a0a] mb-2">{t.name}</h3>
              <p className="text-sm text-[#525252] leading-[1.7] line-clamp-2">
                {t.summary}
              </p>
              <span className="rn-arrow inline-flex items-center gap-2 text-xs font-bold text-[#0F0D0A] mt-3">
                자세히 보기 <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>

        {/* 다른 지역 */}
        <h2 className="font-serif text-3xl tracking-[-0.025em] text-[#0a0a0a] mt-14 mb-6">다른 지역에서 오시는 분</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {locations
            .filter((other) => other.slug !== loc.slug)
            .slice(0, 12)
            .map((other) => (
              <Link
                key={other.slug}
                href={`/locations/${other.slug}`}
                className="rn-pill px-3 py-3 text-sm font-semibold text-[#0a0a0a] bg-white rounded-xl border border-black/[0.08] text-center"
              >
                {other.name}
              </Link>
            ))}
        </div>

        <div className="mt-12">
          <CTAButtons />
        </div>
      </Section>
    </>
  );
}
