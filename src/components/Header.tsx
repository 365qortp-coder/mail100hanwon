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
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-[var(--brand-primary)] hover:bg-[var(--brand-primary-light)] rounded transition"
          >
            {clinic.contact.phone}
          </a>
          <a
            href={clinic.contact.onlineForm}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 text-sm font-semibold bg-black text-white rounded hover:bg-[var(--brand-primary)] transition"
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
