"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/diet", label: "매일감비환" },
  { href: "/gongjindan", label: "공진단" },
  { href: "/nmc", label: "무릎관절 NMC" },
  { href: "/about", label: "원장 소개" },
  { href: "/columns", label: "건강 칼럼" },
];

export function Header() {
  // 헤더 높이를 CSS 변수로 내보낸다. 히어로가 이 높이만큼 위로 올라가
  // 헤더 뒤에 깔려야 사진 위에 헤더가 얹힌 모양이 된다.
  // (데스크탑 56px, 모바일은 아래 메뉴줄까지 있어 100px 안팎 — 재서 넘긴다)
  // 전체 화면 사진 히어로가 있는 페이지에서는 헤더가 사진 위에 투명하게 얹힌다.
  // 흰 띠가 얹히면 사진에 줄이 그어진 것처럼 보이고,
  // 계속 투명하면 아래 흰 섹션에서 메뉴가 사라진다. 그래서 지나면 흰 배경으로 바꾼다.
  // 히어로가 없는 페이지(#hz-track 없음)에서는 처음부터 흰 헤더다.
  const [ghost, setGhost] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () =>
      document.documentElement.style.setProperty("--hdr-h", `${el.offsetHeight}px`);
    apply();
    window.addEventListener("resize", apply, { passive: true });
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const track = document.getElementById("hz-track");
      if (!track) {
        setGhost(false);
        return;
      }
      const span = track.offsetHeight - window.innerHeight;
      const p = -track.getBoundingClientRect().top / (span || 1);
      setGhost(p <= 0.97);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      ref={ref}
      className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 ${
        ghost ? "hdr-ghost" : "bg-white border-black/[0.06]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 h-14 flex items-center justify-between gap-4">
        <div className={`shrink-0 transition-all duration-300 ${ghost ? "hdr-logo-plate" : ""}`}>
          <Logo size="small" />
        </div>

        <nav className="hidden lg:flex items-center gap-0.5" aria-label="주 메뉴">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                ghost
                  ? "text-white/90 hover:text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]"
                  : "text-[#525252] hover:text-[#0a0a0a] hover:bg-black/[0.04]"
              }`}
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

      <div
        className={`lg:hidden border-t transition-colors duration-300 ${
          ghost ? "border-transparent" : "border-black/[0.05] bg-white"
        }`}
      >
        <div className="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border whitespace-nowrap transition-all duration-200 ${
                ghost
                  ? "text-white bg-white/15 border-white/35 backdrop-blur-sm"
                  : "text-[#525252] bg-[#F5F5F5] border-black/[0.07] hover:border-black/20 hover:text-[#0F0D0A]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
