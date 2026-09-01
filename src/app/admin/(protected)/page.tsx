import Link from "next/link";
import { getAllColumnsIncludingDrafts } from "@/lib/columns";
import {
  getButtonClickSummary,
  getBotVisitSummary,
  getReviewCount,
  getMemberCount,
  isSupabaseConfigured,
} from "@/lib/adminData";
import { GeoCheckTab } from "@/components/admin/GeoCheckTab";

export const dynamic = "force-dynamic";

const BUTTON_LABEL: Record<string, string> = {
  tel: "전화",
  kakao: "카카오톡",
  reserve: "네이버 예약",
};

export default async function AdminHomePage() {
  const configured = isSupabaseConfigured();
  const columns = getAllColumnsIncludingDrafts();
  const [clicks, bots, reviews, members] = await Promise.all([
    getButtonClickSummary(7),
    getBotVisitSummary(30),
    getReviewCount(),
    getMemberCount(),
  ]);

  const published = columns.filter((c) => c.status === "published").length;
  const drafts = columns.length - published;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">관리자 홈</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          매일백세한의원 홈페이지 관리 화면입니다.
        </p>
      </div>

      {!configured && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
          <p className="font-semibold text-amber-900">Supabase 연결이 아직 안 됐습니다.</p>
          <p className="mt-1 text-amber-800">
            병원 정보·팝업·후기·회원 기능은 Supabase 연결 후에 작동합니다. 칼럼 관리는
            지금도 그대로 쓰실 수 있습니다.
          </p>
        </div>
      )}

      {/* 요약 숫자 */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="발행된 칼럼" value={`${published}편`} sub={`초안 ${drafts}편`} href="/admin/columns" />
        <SummaryCard label="후기" value={`${reviews.published}개`} sub={`초안 ${reviews.draft}개`} href="/admin/reviews" />
        <SummaryCard label="회원" value={`${members}명`} sub="카카오 로그인" href="/admin/members" />
        <SummaryCard label="문의 버튼 클릭" value={`${clicks.total}회`} sub="최근 7일" />
      </section>

      {/* 문의 버튼 클릭 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-bold">문의 버튼 클릭 (최근 7일)</h2>
        {clicks.total === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            아직 기록이 없습니다. {configured ? "방문자가 버튼을 누르면 여기에 쌓입니다." : "Supabase 연결 후 쌓입니다."}
          </p>
        ) : (
          <>
            <div className="mt-3 flex flex-wrap gap-4">
              {Object.entries(clicks.byKey).map(([key, n]) => (
                <div key={key} className="text-sm">
                  <span className="text-[var(--text-muted)]">{BUTTON_LABEL[key] ?? key}</span>{" "}
                  <span className="font-bold">{n}회</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-end gap-1">
              {clicks.byDay.map((d) => {
                const max = Math.max(...clicks.byDay.map((x) => x.count), 1);
                return (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-1" title={`${d.day}: ${d.count}건`}>
                    <div
                      className="w-full rounded-t bg-[var(--brand-primary)]"
                      style={{ height: `${Math.max((d.count / max) * 60, 4)}px` }}
                    />
                    <span className="text-[10px] text-[var(--text-muted)]">{d.day.slice(5)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* AI 봇 방문 */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-base font-bold">AI가 우리 사이트를 읽어 갔나 (최근 30일)</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          챗GPT·클로드·퍼플렉시티 같은 AI가 우리 글을 읽어 가면 여기에 기록됩니다.
        </p>
        {bots.total === 0 ? (
          <p className="mt-3 text-sm text-[var(--text-muted)]">
            아직 기록이 없습니다. {configured ? "" : "Supabase 연결 후 쌓입니다."}
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--border)]">
            {bots.byBot.map((b) => (
              <li key={b.bot} className="flex items-center justify-between py-2 text-sm">
                <span>{b.bot}</span>
                <span className="text-[var(--text-muted)]">
                  {b.count}회 · 마지막 {String(b.lastVisit).slice(0, 10)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 사이트 점수 (이 사이트에만 있던 기능 — 그대로 유지) */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-3 text-base font-bold">사이트 점수 확인</h2>
        <GeoCheckTab />
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--brand-primary)]">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[var(--text-muted)]">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
