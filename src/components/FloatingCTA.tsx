import { clinic } from "@/data/clinic";

export function FloatingCTA() {
  return (
    <>
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white/95 backdrop-blur-md border-t border-black/[0.08] px-4 py-3">
        <div className="flex gap-2.5">
          <a
            href={`tel:${clinic.contact.phoneClean}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] text-sm font-bold rounded-xl hover:bg-[var(--brand-primary)] hover:text-white transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M19.95 21c-2.1 0-4.17-.46-6.2-1.37a17.2 17.2 0 0 1-5.4-3.98 17.2 17.2 0 0 1-3.98-5.4C3.46 8.22 3 6.15 3 4.05c0-.3.1-.55.3-.75.2-.2.45-.3.75-.3H8.1c.23 0 .44.08.62.24.18.16.29.35.32.57l.65 3.5c.03.27 .02.49-.05.68-.07.18-.17.34-.32.47L6.9 10.9c.33.62.73 1.21 1.19 1.79.46.57.97 1.12 1.52 1.65.52.52 1.06 1 1.63 1.44.57.44 1.17.85 1.81 1.21l2.35-2.35c.15-.15.34-.26.58-.34.24-.07.47-.09.7-.06l3.45.7c.23.07.42.19.57.36.15.17.22.37.22.6v4.05c0 .3-.1.55-.3.75-.2.2-.45.3-.75.3z"/>
            </svg>
            전화 상담
          </a>
          <a
            href={clinic.contact.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[var(--brand-primary)] text-white text-sm font-bold rounded-xl hover:bg-[var(--brand-primary-dark)] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.84 5.32 4.62 6.78l-.94 3.43c-.08.3.25.55.51.39L10.4 19c.53.06 1.06.1 1.6.1 5.52 0 10-3.58 10-8s-4.48-8.1-10-8.1z"/>
            </svg>
            카톡 상담
          </a>
        </div>
      </div>
      {/* 모바일 하단 바에 가리지 않도록 여백 확보 */}
      <div className="h-20 md:hidden" aria-hidden="true" />
    </>
  );
}
