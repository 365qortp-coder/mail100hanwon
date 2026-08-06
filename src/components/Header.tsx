import Link from "next/link";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/diet", label: "매일감비환" },
  { href: "/gongjindan", label: "공진단" },
  { href: "/nmc", label: "무릎관절 NMC" },
  { href: "/about", label: "원장 소개" },
  { href: "/columns", label: "건강 칼럼" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-black/[0.06]">
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-14 flex items-center justify-between gap-4">
        <div className="shrink-0">
          <Logo size="small" />
        </div>

        <nav className="hidden lg:flex items-center gap-0.5" aria-label="주 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-2 text-sm text-[#525252] hover:text-[#0a0a0a] font-medium rounded-lg hover:bg-black/[0.04] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/#contact"
            className="inline-flex items-center px-4 py-2 text-sm font-semibold bg-[#0a0a0a] text-white rounded-lg hover:bg-[#2a2a2a] transition-colors duration-200"
          >
            상담문의
          </Link>
        </div>
      </div>

      <div className="lg:hidden border-t border-black/[0.05] bg-white">
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold text-[#525252] bg-[#F5F5F5] rounded-full border border-black/[0.07] whitespace-nowrap hover:border-black/20 hover:text-[#0F0D0A] transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
