import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/adminData";

export const dynamic = "force-dynamic";

type Member = {
  user_id: string;
  nickname: string | null;
  created_at: string;
};

type Consent = {
  user_id: string;
  agreed_required: boolean;
  agreed_marketing: boolean;
  agreed_at: string;
};

async function getMembers() {
  if (!isSupabaseConfigured()) return { members: [] as Member[], consents: [] as Consent[] };
  try {
    const supabase = await createClient();
    const [{ data: members }, { data: consents }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("member_consents").select("*"),
    ]);
    return {
      members: (members as Member[]) ?? [],
      consents: (consents as Consent[]) ?? [],
    };
  } catch {
    return { members: [] as Member[], consents: [] as Consent[] };
  }
}

export default async function AdminMembersPage() {
  const { members, consents } = await getMembers();
  const consentBy = new Map(consents.map((c) => [c.user_id, c]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">회원 관리</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          후기를 보려고 카카오로 로그인한 분들입니다. 총 {members.length}명.
        </p>
      </div>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        {members.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">
            아직 가입한 회원이 없습니다. (카카오 로그인을 연 뒤부터 쌓입니다)
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-left text-[var(--text-muted)]">
                  <th className="py-2 pr-4 font-medium">닉네임</th>
                  <th className="py-2 pr-4 font-medium">가입일</th>
                  <th className="py-2 pr-4 font-medium">필수 동의</th>
                  <th className="py-2 font-medium">마케팅 수신</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const c = consentBy.get(m.user_id);
                  return (
                    <tr key={m.user_id} className="border-b border-[var(--border)]">
                      <td className="py-2 pr-4">{m.nickname ?? "(이름 없음)"}</td>
                      <td className="py-2 pr-4 text-[var(--text-muted)]">
                        {String(m.created_at).slice(0, 10)}
                      </td>
                      <td className="py-2 pr-4">{c?.agreed_required ? "○" : "—"}</td>
                      <td className="py-2">{c?.agreed_marketing ? "○" : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <p className="text-xs text-[var(--text-muted)]">
        개인정보 보호를 위해 이름(닉네임)과 동의 기록만 보관합니다. 카카오 계정 정보는
        저장하지 않습니다.
      </p>
    </div>
  );
}
