import { clinic } from "@/data/clinic";

type Channel = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  accent: "diet" | "gongjindan" | "pain";
};

const channels: Channel[] = [
  {
    name: "엄마들을 위한 다이어트",
    tagline: "DIET CHANNEL",
    description:
      "매일감비환 다이어트 한약과 한방 다이어트에 대한 송원석 원장의 실전 콘텐츠. 산후 다이어트, 요요 관리, 체질별 식습관 등을 다룹니다.",
    url: clinic.youtube.diet,
    accent: "diet",
  },
  {
    name: "직접 만든 진짜 공진단",
    tagline: "GONGJINDAN CHANNEL",
    description:
      "공진단을 직접 만드는 과정과 사향·녹용 등 한약재 이야기. 일반 공진단과 어떻게 다른지, 어떻게 보관하고 복용하는지를 공개합니다.",
    url: clinic.youtube.gongjindan,
    accent: "gongjindan",
  },
  {
    name: "매일백세한의원 통증",
    tagline: "PAIN CHANNEL",
    description:
      "허리·목·어깨·관절 통증 한방 치료 사례와 침·약침 시술 가이드. 한방 통증 치료를 어떻게 접근하는지 직접 보여드립니다.",
    url: clinic.youtube.pain,
    accent: "pain",
  },
];

const accentClasses: Record<Channel["accent"], string> = {
  diet: "from-[#fdecec] to-white",
  gongjindan: "from-black to-[#1a1a1a] text-white",
  pain: "from-[#fdecec] via-white to-black/5",
};

export function YouTubeShowcase() {
  return (
    <div className="-mx-4 px-4 overflow-x-auto snap-x snap-mandatory scroll-smooth">
      <div className="flex gap-4 min-w-min md:grid md:grid-cols-3 md:gap-5">
        {channels.map((c) => {
          const isDark = c.accent === "gongjindan";
          return (
            <a
              key={c.url}
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`snap-start shrink-0 w-[85vw] sm:w-[60vw] md:w-auto relative overflow-hidden rounded-2xl bg-gradient-to-br ${accentClasses[c.accent]} border border-[var(--border)] p-7 hover:shadow-xl hover:-translate-y-1 transition group`}
            >
              <div className="flex items-start justify-between mb-6">
                <span
                  className={`text-[10px] tracking-[0.2em] font-bold ${isDark ? "text-white/60" : "text-[var(--brand-primary)]"}`}
                >
                  {c.tagline}
                </span>
                <YouTubeLogo dark={isDark} />
              </div>

              <h3
                className={`text-xl md:text-2xl font-extrabold leading-snug mb-3 ${isDark ? "text-white" : "text-[var(--foreground)]"}`}
              >
                {c.name}
              </h3>
              <p
                className={`text-sm leading-relaxed ${isDark ? "text-white/70" : "text-[var(--text-muted)]"} mb-6 line-clamp-4`}
              >
                {c.description}
              </p>

              <div
                className={`inline-flex items-center gap-2 text-sm font-bold ${isDark ? "text-white" : "text-[var(--brand-primary)]"} group-hover:gap-3 transition-all`}
              >
                YouTube에서 보기
                <span aria-hidden>→</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

function YouTubeLogo({ dark }: { dark: boolean }) {
  return (
    <div
      className={`flex items-center justify-center w-10 h-7 rounded ${dark ? "bg-white" : "bg-[#FF0033]"}`}
    >
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <path
          d="M0 0 L16 5.5 L0 11 Z"
          fill={dark ? "#FF0033" : "white"}
        />
      </svg>
    </div>
  );
}
