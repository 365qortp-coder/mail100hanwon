"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * 관리자 로그인 — Supabase 계정(이메일 + 비밀번호)으로 들어옵니다.
 *
 * 예전에는 공용 비밀번호 한 개(ADMIN_PASSWORD)를 쓰는 방식이었는데,
 * 그 방식으로는 DB 권한 규칙(is_admin())을 통과할 수 없어 바꿨습니다.
 * 계정 만드는 곳: Supabase 대시보드 → Authentication → Users → Add user
 */
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-bold mb-1">관리자 로그인</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        매일백세한의원 홈페이지 관리자 화면
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="username"
          autoFocus
          required
          className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[var(--brand-primary)] text-white text-sm font-bold py-2.5 disabled:opacity-50"
        >
          {loading ? "확인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
