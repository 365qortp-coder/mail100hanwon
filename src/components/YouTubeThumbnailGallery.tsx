import { getAllVideos } from "@/lib/youtube";

const channelLabels: Record<string, string> = {
  diet: "다이어트",
  gongjindan: "공진단",
  pain: "통증",
};

export function YouTubeThumbnailGallery({ limit = 18 }: { limit?: number }) {
  // Interleave videos across channels so a single row mixes content
  const all = getAllVideos();
  const byChannel: Record<string, typeof all> = { diet: [], gongjindan: [], pain: [] };
  for (const v of all) byChannel[v.channel].push(v);

  const interleaved: typeof all = [];
  const order: Array<"diet" | "gongjindan" | "pain"> = ["diet", "gongjindan", "pain"];
  let i = 0;
  while (interleaved.length < limit) {
    const ch = order[i % order.length];
    const next = byChannel[ch].shift();
    if (next) interleaved.push(next);
    if (!byChannel.diet.length && !byChannel.gongjindan.length && !byChannel.pain.length) break;
    i++;
  }

  if (interleaved.length === 0) return null;

  return (
    <div
      className="-mx-4 px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
      role="region"
      aria-label="유튜브 영상 목록"
    >
      <div className="flex gap-3 pb-2">
        {interleaved.map((v) => (
          <a
            key={v.videoId}
            href={v.url}
            target="_blank"
            rel="noopener noreferrer"
            className="snap-start shrink-0 w-[60vw] sm:w-[40vw] md:w-[280px] group"
            title={v.title}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-[var(--surface-muted)] border border-[var(--border)] group-hover:border-[var(--brand-primary)] transition">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.thumbnail}
                alt={v.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-white/90 text-[var(--foreground)] rounded">
                {channelLabels[v.channel]}
              </span>
              <span className="absolute bottom-2 left-2 flex items-center justify-center w-9 h-9 rounded-full bg-[#FF0033] shadow-lg">
                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
                  <path d="M0 0 L12 7 L0 14 Z" fill="white" />
                </svg>
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold leading-snug line-clamp-2 text-[var(--foreground)] group-hover:text-[var(--brand-primary)] transition">
              {v.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
