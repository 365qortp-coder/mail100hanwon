import type { QueueStats, UpcomingItem } from "@/lib/contentQueue";

const CHANNEL_LABEL: Record<string, string> = {
  diet: "다이어트",
  gongjindan: "공진단",
  pain: "통증",
  other: "기타",
};

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-5">
      <p className="text-xs font-bold tracking-wide text-[var(--text-muted)] uppercase mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs text-[var(--text-muted)] mt-1">{sub}</p>}
    </div>
  );
}

export function QueueTab({ stats, upcoming }: { stats: QueueStats; upcoming: UpcomingItem[] }) {
  const totalQueued = Object.values(stats.perChannel).reduce((s, c) => s + c.queued, 0);
  const totalInProgress = Object.values(stats.perChannel).reduce((s, c) => s + c.inProgress, 0);

  return (
    <div>
      <p className="text-sm text-[var(--text-muted)] mb-6">
        실제 발행은 월·목 GitHub Action이 자동으로 처리합니다. 이 화면은 큐 상태를 보여주는
        미리보기 전용이며, 여기서 아무것도 변경되지 않습니다.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="대기 중인 영상" value={totalQueued} sub="아직 하나도 발행 안 함" />
        <StatCard label="진행 중인 영상" value={totalInProgress} sub="일부 각도만 발행됨" />
        <StatCard label="각도 소진" value={stats.exhausted} sub="10개 각도 전부 발행됨" />
        <StatCard label="스크립트 없음" value={stats.noTranscript} sub="자막 없어 건너뜀" />
      </div>

      <div className="rounded-xl border border-[var(--border)] p-5 mb-8">
        <p className="text-sm font-bold mb-3">채널별 현황</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {Object.entries(stats.perChannel).map(([ch, v]) => (
            <div key={ch}>
              <p className="font-semibold">{CHANNEL_LABEL[ch] || ch}</p>
              <p className="text-[var(--text-muted)]">
                대기 {v.queued} · 진행중 {v.inProgress}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm mt-4 pt-4 border-t border-[var(--border)]">
          잔여 발행 가능 슬롯 <span className="font-bold">{stats.remainingSlots}개</span> — 주 2회
          기준 약 <span className="font-bold">{stats.estimatedWeeksRemaining}주</span>분 남음
        </p>
      </div>

      <p className="text-sm font-bold mb-3">다음 발행 예정 (우선순위 순)</p>
      <div className="overflow-x-auto border border-[var(--border)] rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-[var(--surface-muted)]">
            <tr>
              <th className="p-2 text-left w-16">채널</th>
              <th className="p-2 text-left">영상</th>
              <th className="p-2 text-left whitespace-nowrap">각도</th>
            </tr>
          </thead>
          <tbody>
            {upcoming.map((item, i) => (
              <tr key={i} className="border-t border-[var(--border)]">
                <td className="p-2 whitespace-nowrap">{CHANNEL_LABEL[item.channel] || item.channel}</td>
                <td className="p-2">{item.hint}</td>
                <td className="p-2 whitespace-nowrap">{item.angleName}</td>
              </tr>
            ))}
            {upcoming.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-[var(--text-muted)]">
                  큐가 비어 있습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
