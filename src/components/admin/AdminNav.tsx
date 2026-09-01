"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * 관리자 상단 메뉴 — 마케팅의 정석 표준 6개 모듈.
 * (순서·이름을 다른 병원 사이트와 똑같이 맞춥니다)
 */
const links = [
  { href: "/admin", label: "홈", exact: true },
  { href: "/admin/settings", label: "병원 정보" },
  { href: "/admin/popups", label: "팝업 관리" },
  { href: "/admin/columns", label: "칼럼 관리" },
  { href: "/admin/reviews", label: "후기 관리" },
  { href: "/admin/members", label: "회원 관리" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <nav className="flex flex-wrap items-center gap-1">
          {links.map((l) => {
            const active = l.exact
              ? pathname === l.href
              : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  active
                    ? "bg-[var(--brand-primary-light)] font-semibold text-[var(--brand-primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface-muted)]"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleLogout}
          className="text-sm text-[var(--text-muted)] transition hover:text-[var(--brand-primary)]"
        >
          로그아웃
        </button>
      </div>
    </header>
  );
}
