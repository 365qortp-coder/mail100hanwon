"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { clinic } from "@/data/clinic";

function ConsentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/reviews";

  const [agreedRequired, setAgreedRequired] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreedRequired) {
      setMessage("[필수] 개인정보 수집·이용 동의는 꼭 체크해주셔야 다음으로 넘어갈 수 있습니다.");
      return;
    }

    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setSaving(false);
      setMessage("로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    const { error } = await supabase.from("member_consents").insert({
      user_id: user.id,
      agreed_required: agreedRequired,
      agreed_marketing: agreedMarketing,
    });

    setSaving(false);

    if (error) {
      setMessage(`저장 실패: ${error.message}`);
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--surface-muted)] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-semibold text-[var(--foreground)]">회원가입 동의</h1>
        <p className="mb-6 text-sm text-[var(--text-muted)]">{clinic.name} 후기 열람을 위해 아래 내용에 동의해주세요.</p>

        <label className="mb-3 flex items-start gap-3 rounded-lg border border-[var(--border)] p-3.5 text-sm">
          <input
            type="checkbox"
            checked={agreedRequired}
            onChange={(e) => setAgreedRequired(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand-primary)]"
          />
          <span>
            <strong className="text-[var(--foreground)]">[필수]</strong> 개인정보 수집·이용에 동의합니다.
            <span className="mt-1 block text-xs leading-relaxed text-[var(--text-muted)]">
              수집 항목: 카카오 계정 식별정보(닉네임) · 이용 목적: 후기 열람 회원 확인 · 보유 기간: 회원 탈퇴 시까지
            </span>
          </span>
        </label>

        <label className="mb-6 flex items-start gap-3 rounded-lg border border-[var(--border)] p-3.5 text-sm">
          <input
            type="checkbox"
            checked={agreedMarketing}
            onChange={(e) => setAgreedMarketing(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--brand-primary)]"
          />
          <span>
            <strong className="text-[var(--foreground)]">[선택]</strong> 마케팅 정보 수신에 동의합니다.
            <span className="mt-1 block text-xs leading-relaxed text-[var(--text-muted)]">
              이벤트·혜택 안내 문자를 받아보실 수 있습니다. 동의하지 않아도 후기 열람에는 제한이 없습니다.
            </span>
          </span>
        </label>

        {message && <p className="mb-4 text-sm text-[var(--brand-primary)]">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-[var(--brand-primary)] py-2.5 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "처리 중…" : "동의하고 계속하기"}
        </button>
      </form>
    </main>
  );
}

export default function ConsentPage() {
  return (
    <Suspense fallback={null}>
      <ConsentForm />
    </Suspense>
  );
}
