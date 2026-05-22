import Link from "next/link";
import { clinic } from "@/data/clinic";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/treatments/diet", label: "매일감비환" },
  { href: "/treatments/gongjindan", label: "공진단" },
  { href: "/treatments/chongmyeong", label: "총명공진단" },
  { href: "/treatments/pain", label: "통증치료" },
  { href: "/online", label: "비대면 진료" },
  { href: "/pricing", label: "비용 안내" },
  { href: "/about", label: "원장 소개" },
  { href: "/columns", label: "건강 칼럼" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur border-b border-[var(--border)]">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Logo />

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-2 text-sm text-[var(--foreground)] hover:text-[var(--brand-primary)] font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${clinic.contact.phoneClean}`}
            aria-label={`전화 ${clinic.contact.phone}`}
            className="inline-flex md:hidden items-center justify-center w-9 h-9 rounded-full bg-[var(--brand-primary-light)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>
          <a
            href={`tel:${clinic.contact.phoneClean}`}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] rounded transition"
          >
            {clinic.contact.phone}
          </a>
          <a
            href={clinic.contact.kakao}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="카카오톡 채널 상담"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold bg-[#FAE100] text-[#3C1E1E] rounded hover:brightness-95 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.83 1.84 5.32 4.62 6.78l-.94 3.43c-.08.3.25.55.51.39L10.4 19c.53.06 1.06.1 1.6.1 5.52 0 10-3.58 10-8s-4.48-8.1-10-8.1z"/>
            </svg>
            <span className="hidden sm:inline">카톡 상담</span>
          </a>
          <a
            href={clinic.contact.onlineForm}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center px-3 py-2 text-sm font-semibold bg-black text-white rounded hover:bg-[var(--brand-primary)] transition"
          >
            비대면 신청
          </a>
        </div>
      </div>

      <div className="lg:hidden border-t border-[var(--border)] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-2 flex gap-1 overflow-x-auto text-xs">
          {navItems.slice(0, 6).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3 py-1.5 rounded-full bg-[var(--surface-muted)] border border-[var(--border)] text-[var(--foreground)] font-medium whitespace-nowrap hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] transition"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
