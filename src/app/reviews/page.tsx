import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";
import { Section, SectionTitle } from "@/components/Section";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTAButtons } from "@/components/CTAButtons";
import { KakaoLoginButton, LogoutButton } from "@/components/ReviewsGate";
import { createClient } from "@/lib/supabase/server";
import { getClinicSettings, isSupabaseConfigured } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "치료 후기",
  description:
    "매일백세한의원 실제 치료 후기입니다. 의료법에 따라 회원 인증을 거친 분께만 공개합니다.",
  path: "/reviews",
  keywords: ["매일백세한의원 후기", "매일감비환 후기", "다이어트 한약 후기"],
});

type Review = {
  id: string;
  image_url: string;
  image_alt: string | null;
  comment: string;
  published_date: string;
};

export default async function ReviewsPage() {
  const clinic = await getClinicSettings();
  const configured = isSupabaseConfigured();

  let loggedIn = false;
  let agreed = false;
  let reviews: Review[] = [];

  if (configured) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      loggedIn = Boolean(user);

      if (user) {
        const { data: consent } = await supabase
          .from("member_consents")
          .select("agreed_required")
          .eq("user_id", user.id)
          .maybeSingle();
        agreed = Boolean(consent?.agreed_required);

        if (agreed) {
          const { data } = await supabase
            .from("reviews")
            .select("id, image_url, image_alt, comment, published_date")
            .eq("status", "published")
            .order("published_date", { ascending: false });
          reviews = (data as Review[]) ?? [];
        }
      }
    } catch {
      // 연결 문제로 화면 전체가 죽지 않게 합니다.
    }
  }

  const unlocked = loggedIn && agreed;

  return (
    <>
      <Breadcrumb items={[{ name: "치료 후기", href: "/reviews" }]} />

      <Section>
        <div className="flex items-start justify-between gap-4">
          <SectionTitle
            eyebrow="REAL RESULTS"
            title="실제 치료 후기"
            subtitle="환자분 개인정보 보호와 의료법 준수를 위해, 실제 후기는 로그인 후에 확인하실 수 있습니다."
          />
          {unlocked && <LogoutButton />}
        </div>

        {!unlocked ? (
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <p className="text-xs font-bold tracking-widest text-[var(--brand-primary)]">
              회원 전용
            </p>
            <h3 className="mt-2 text-lg font-bold">
              로그인하고 실제 후기를 확인하세요
            </h3>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              카카오 계정으로 간편하게 로그인하면 전체 후기를 열람하실 수 있습니다.
            </p>

            <div className="mt-6">
              {!configured ? (
                <p className="text-sm text-[var(--text-muted)]">
                  로그인 기능을 준비 중입니다.
                </p>
              ) : !clinic.auth_kakao_enabled ? (
                <p className="text-sm text-[var(--text-muted)]">
                  로그인 기능을 준비 중입니다. 조금만 기다려 주세요.
                </p>
              ) : loggedIn && !agreed ? (
                <a
                  href="/auth/consent"
                  className="inline-flex items-center justify-center rounded-lg bg-[var(--brand-primary)] px-6 py-3 text-sm font-bold text-white"
                >
                  약관에 동의하고 계속하기
                </a>
              ) : (
                <KakaoLoginButton next="/reviews" />
              )}
            </div>

            <p className="mt-6 text-xs leading-relaxed text-[var(--text-muted)]">
              의료법 제56조에 따라, 실제 환자의 치료 경험담은 회원 인증을 거친
              이용자에게만 제한적으로 제공됩니다.
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <p className="mt-10 text-center text-sm text-[var(--text-muted)]">
            아직 등록된 후기가 없습니다.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r) => (
              <article
                key={r.id}
                className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.image_url}
                  alt={r.image_alt ?? "매일백세한의원 치료 후기"}
                  loading="lazy"
                  className="w-full object-cover"
                />
                <div className="p-4">
                  <p className="text-sm leading-relaxed">{r.comment}</p>
                  <p className="mt-3 text-xs text-[var(--text-muted)]">
                    {r.published_date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-[var(--text-muted)]">
          치료 결과는 개인의 체질·기저질환·생활습관에 따라 다르게 나타날 수 있습니다.
        </p>
      </Section>

      <CTAButtons />
    </>
  );
}
