import { getVideosByChannel, type Video } from "@/lib/youtube";
import { clinic } from "@/data/clinic";

type Row = {
  channel: Video["channel"];
  label: string;
  caption: string;
  channelUrl: string;
};

const rows: Row[] = [
  {
    channel: "diet",
    label: "엄마들을 위한 다이어트",
    caption: "매일감비환 · 한방 다이어트",
    channelUrl: clinic.youtube.diet,
  },
  {
    channel: "gongjindan",
    label: "직접 만든 진짜 공진단",
    caption: "사향 · 녹용 공진단 제조 공개",
    channelUrl: clinic.youtube.gongjindan,
  },
  {
    channel: "pain",
    label: "매일백세한의원 통증",
    caption: "허리 · 어깨 · 관절 한방 치료",
    channelUrl: clinic.youtube.pain,
  },
];

export function YouTubeThumbnailGallery() {
  return (
    <div className="space-y-10">
      {rows.map((row) => {
        const videos = getVideosByChannel(row.channel, 12);
        if (videos.length === 0) return null;
        return (
          <div key={row.channel}>
            <div className="flex items-end justify-between mb-4 gap-3">
              <div>
                <p className="text-[10px] tracking-[0.2em] font-bold text-[var(--brand-primary)] uppercase mb-1">
                  YouTube
                </p>
                <h3 className="text-lg md:text-xl font-extrabold leading-snug">
                  {row.label}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {row.caption}
                </p>
              </div>
              <a
                href={row.channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[var(--brand-primary)] hover:underline shrink-0"
              >
                채널 전체 →
              </a>
            </div>

            <div
              className="-mx-4 px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth"
              role="region"
              aria-label={`${row.label} 영상 목록`}
            >
              <div className="flex gap-3 pb-2">
                {videos.map((v) => (
                  <a
                    key={v.videoId}
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="snap-start shrink-0 w-[60vw] sm:w-[40vw] md:w-[260px] group"
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
                      <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between gap-2">
                        <PlayIcon />
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-snug line-clamp-2 text-[var(--foreground)] group-hover:text-[var(--brand-primary)] transition">
                      {v.title}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlayIcon() {
  return (
    <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#FF0033] shadow-lg">
      <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden>
        <path d="M0 0 L12 7 L0 14 Z" fill="white" />
      </svg>
    </span>
  );
}
