import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { stations, getStation } from "@/data/locations";
import { treatments } from "@/data/treatments";
import { clinic } from "@/data/clinic";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return stations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const st = getStation(slug);
  if (!st) return {};

  const title = `${st.name} 한의원 | 매일백세한의원`;
  const description = `${st.fullName} ${st.access}. 매일감비환 다이어트 한약, 공진단, 총명공진단 처방.`;

  return buildMetadata({
    title,
    description,
    path: `/stations/${st.slug}`,
    keywords: st.keywords,
  });
}

export default async function StationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const st = getStation(slug);
  if (!st) return notFound();

  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb
          items={[
            { name: "역세권 안내", href: "/stations/mokgol" },
            { name: st.name, href: `/stations/${st.slug}` },
          ]}
        />
      </div>

      <section className="bg-[#FAFAFA] border-b border-black/[0.05]">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-16 md:py-24">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-[var(--brand-primary)]" aria-hidden />
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--brand-primary)]">
              지하철 인근 한의원
            </span>
          </div>
          <h1 className="font-serif text-[2.25rem] md:text-[3.25rem] tracking-[-0.025em] leading-[1.14] text-[#0a0a0a]">
            {st.fullName} 한의원
            <br />
            <span className="text-[var(--brand-primary)]">매일백세한의원</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-[#525252] max-w-2xl leading-[1.8]">
            {st.description}
          </p>
          <div className="mt-8 max-w-2xl">
            <CTAButtons />
          </div>
        </div>
      </section>

      <Section bg="white">
        <KeyFactsBox
          facts={[
            { label: "역", value: st.fullName },
            { label: "한의원 주소", value: clinic.address.full },
            { label: "접근성", value: st.access },
            { label: "전화", value: clinic.contact.phone },
            { label: "진료 시간", value: `평일 ${clinic.hours.weekday} / 토요일 ${clinic.hours.saturday}` },
          ]}
        />

        <h2 className="font-serif text-3xl tracking-[-0.025em] text-[#0a0a0a] mt-14 mb-6">
          {st.name} 인근에서 가장 가까운 한의원
        </h2>
        <p className="text-[#525252] leading-[1.8]">
          매일백세한의원은 {clinic.address.full}에 있는 한의원입니다.
          {" "}{st.fullName} 인근에서 다이어트 한약(매일감비환), 공진단, 총명공진단,
          통증 치료를 받으실 수 있습니다.
        </p>

        <h2 className="font-serif text-3xl tracking-[-0.025em] text-[#0a0a0a] mt-14 mb-6">진료 항목</h2>
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
