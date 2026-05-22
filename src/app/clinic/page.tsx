import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KeyFactsBox } from "@/components/KeyFactsBox";
import { clinic } from "@/data/clinic";

export const metadata: Metadata = buildMetadata({
  title: "오시는 길 · 진료시간",
  description: `매일백세한의원은 서울 중랑구 공릉로 21에 위치합니다. 7호선 먹골역 도보 5분, 6·7호선 태릉입구역 도보 10분. 평일 09:30~18:30, 토요일 09:30~13:00 진료. 전화 02-2234-0102.`,
  path: "/clinic",
  keywords: ["매일백세한의원 위치", "먹골역 한의원", "중랑구 공릉로 한의원", "한의원 진료시간"],
});

export default function ClinicPage() {
  const mapQuery = encodeURIComponent(clinic.address.full);
  return (
    <>
      <div className="mx-auto max-w-6xl px-4">
        <Breadcrumb items={[{ name: "오시는 길", href: "/clinic" }]} />
      </div>

      <Section bg="white">
        <SectionTitle
          eyebrow="오시는 길"
          title="서울 중랑구 공릉로 21"
          subtitle="7호선 먹골역에서 도보 5분 거리, 6·7호선 태릉입구역에서 도보 10분 거리에 위치해 있습니다."
        />

        <KeyFactsBox
          facts={[
            { label: "주소", value: clinic.address.full },
            { label: "전화", value: clinic.contact.phone },
            { label: "지하철", value: "7호선 먹골역 도보 5분 / 6·7호선 태릉입구역 도보 10분" },
            { label: "평일 진료", value: clinic.hours.weekday },
            { label: "토요일 진료", value: clinic.hours.saturday },
            { label: "일요일", value: clinic.hours.sunday },
            { label: "점심시간", value: clinic.hours.lunch },
          ]}
        />

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-3">지도</h3>
          <div className="aspect-[16/9] w-full rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-muted)]">
            <iframe
              src={`https://maps.google.com/maps?q=${mapQuery}&output=embed`}
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              style={{ border: 0 }}
              title="매일백세한의원 위치"
            />
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-[var(--brand-primary-light)] border border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--brand-primary-dark)] mb-3">
              대중교통 이용
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <b>7호선 먹골역</b> 1번/2번 출구 도보 5분
              </li>
              <li>
                <b>6·7호선 태릉입구역</b>에서 도보 10분
              </li>
              <li>
                <b>6호선 화랑대역</b>에서 차량 5분
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-[var(--brand-accent-light)] border border-[var(--border)]">
            <h3 className="text-lg font-bold text-[var(--foreground)] mb-3">
              자가용 이용
            </h3>
            <p className="text-sm">
              내비게이션에 <b>{clinic.address.full}</b>로 검색하시면 됩니다.
              인근 주차 안내는 전화로 문의해주세요.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <CTAButtons />
        </div>
      </Section>
    </>
  );
}
