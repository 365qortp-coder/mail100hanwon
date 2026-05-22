import { clinic } from "@/data/clinic";

export function FloatingCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 md:bottom-6 md:right-6">
      <a
        href={`tel:${clinic.contact.phoneClean}`}
        aria-label="전화 상담"
        className="cta-pulse w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--brand-primary)] text-white flex items-center justify-center shadow-lg hover:bg-[var(--brand-primary-dark)] transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
      <a
        href={clinic.contact.kakao}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오톡 상담"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FAE100] text-[#3C1E1E] flex items-center justify-center shadow-lg hover:brightness-95 transition"
      >
        <span className="text-xs font-extrabold">카톡</span>
      </a>
      <a
        href={clinic.contact.onlineForm}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="비대면 진료 신청"
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-[var(--brand-accent)] text-white flex items-center justify-center shadow-lg hover:brightness-95 transition"
      >
        <span className="text-xs font-bold leading-tight text-center">
          비대면
          <br />
          신청
        </span>
      </a>
    </div>
  );
}
