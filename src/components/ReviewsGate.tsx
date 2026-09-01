"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * 후기 페이지의 카카오 로그인 버튼.
 *
 * Supabase의 기본 카카오 연동은 쓰지 않습니다 — 이메일 권한까지 무조건
 * 요청해서 사업자 인증 전에는 항상 실패(KOE205)하기 때문입니다.
 * 대신 /auth/kakao/start 로 보내 닉네임만 요청하는 방식으로 처리합니다.
 */
export function KakaoLoginButton({ next = "/reviews" }: { next?: string }) {
  return (
    <a
      href={`/auth/kakao/start?next=${encodeURIComponent(next)}`}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FEE500] px-6 py-3 text-sm font-bold text-[#191600] transition hover:brightness-95"
    >
      카카오로 로그인
    </a>
  );
}

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-[var(--text-muted)] transition hover:text-[var(--brand-primary)]"
    >
      로그아웃
    </button>
  );
}
