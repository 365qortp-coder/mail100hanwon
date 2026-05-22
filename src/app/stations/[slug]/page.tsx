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

      <section className="bg-gradient-to-br from-[var(--brand-primary-light)] to-white">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <p className="text-xs font-semibold tracking-widest text-[var(--brand-primary)] uppercase mb-2">
            지하철 인근 한의원
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            {st.fullName} 한의원
            <br />
            <span className="text-[var(--brand-primary)]">매일백세한의원</span>
          </h1>
          <p className="mt-5 text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
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

        <h2 className="text-2xl font-bold mt-12 mb-5">
          {st.name} 인근에서 가장 가까운 한의원
        </h2>
        <p className="text-[var(--foreground)] leading-relaxed">
          매일백세한의원은 {clinic.address.full}에 있는 한의원입니다.
          {" "}{st.fullName} 인근에서 다이어트 한약(매일감비환), 공진단, 총명공진단,
          통증 치료를 받으실 수 있습니다.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-5">진료 항목</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {treatments.map((t) => (
            <Link
              key={t.slug}
              href={`/treatments/${t.slug}`}
              className="block p-5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border)] hover:border-[var(--brand-primary)] transition"
            >
              <h3 className="font-bold mb-1.5">{t.name}</h3>
              <p className="text-sm text-[var(--text-muted)] line-clamp-2">
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
