"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Popup = {
  id: string;
  title: string;
  image_url: string | null;
  link_url: string | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

/**
 * 팝업 관리 — 홈페이지 첫 화면에 뜨는 안내창을 등록·수정합니다.
 * 사진은 Supabase 저장소(popups 버킷)에 올라갑니다.
 */
export function PopupManager({
  initial,
  configured,
}: {
  initial: Popup[];
  configured: boolean;
}) {
  const [popups, setPopups] = useState<Popup[]>(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    title: "",
    link_url: "",
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
  });
  const [file, setFile] = useState<File | null>(null);

  async function handleAdd() {
    if (!form.title.trim()) {
      setMessage("제목을 입력해 주세요.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createClient();

    let imageUrl: string | null = null;
    if (file) {
      const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "")}`;
      const { error: upErr } = await supabase.storage.from("popups").upload(path, file);
      if (upErr) {
        setBusy(false);
        setMessage(`사진 업로드 실패: ${upErr.message}`);
        return;
      }
      imageUrl = supabase.storage.from("popups").getPublicUrl(path).data.publicUrl;
    }

    const { data, error } = await supabase
      .from("popups")
      .insert({
        title: form.title.trim(),
        link_url: form.link_url.trim() || null,
        image_url: imageUrl,
        start_date: form.start_date,
        end_date: form.end_date,
        is_active: true,
      })
      .select()
      .single();

    setBusy(false);
    if (error) {
      setMessage(`등록 실패: ${error.message}`);
      return;
    }
    setPopups((p) => [data as Popup, ...p]);
    setForm({ ...form, title: "", link_url: "" });
    setFile(null);
    setMessage("등록했습니다.");
  }

  async function toggleActive(p: Popup) {
    const supabase = createClient();
    const { error } = await supabase
      .from("popups")
      .update({ is_active: !p.is_active })
      .eq("id", p.id);
    if (error) {
      setMessage(`변경 실패: ${error.message}`);
      return;
    }
    setPopups((list) =>
      list.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x))
    );
  }

  async function remove(p: Popup) {
    if (!confirm(`"${p.title}" 팝업을 삭제할까요?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("popups").delete().eq("id", p.id);
    if (error) {
      setMessage(`삭제 실패: ${error.message}`);
      return;
    }
    setPopups((list) => list.filter((x) => x.id !== p.id));
  }

  return (
    <div className="space-y-6">
      {!configured && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Supabase 연결 전이라 등록·수정이 되지 않습니다.
        </div>
      )}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 text-base font-bold">새 팝업 등록</h2>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">제목</span>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">누르면 갈 주소 (선택)</span>
            <input
              value={form.link_url}
              onChange={(e) => setForm({ ...form, link_url: e.target.value })}
              placeholder="https://…"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </label>
          <div className="flex gap-3">
            <label className="block flex-1 text-sm">
              <span className="mb-1 block text-[var(--text-muted)]">시작일</span>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </label>
            <label className="block flex-1 text-sm">
              <span className="mb-1 block text-[var(--text-muted)]">종료일</span>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">사진 (선택)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              disabled={busy || !configured}
              className="rounded-lg bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
            >
              {busy ? "등록 중…" : "등록"}
            </button>
            {message && <span className="text-sm text-[var(--text-muted)]">{message}</span>}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 text-base font-bold">등록된 팝업 ({popups.length})</h2>
        {popups.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">아직 없습니다.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {popups.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt="" className="h-12 w-12 rounded object-cover" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {p.start_date} ~ {p.end_date}
                    {p.link_url ? " · 링크 있음" : ""}
                  </p>
                </div>
                <button
                  onClick={() => toggleActive(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    p.is_active
                      ? "bg-[var(--brand-primary-light)] text-[var(--brand-primary)]"
                      : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                  }`}
                >
                  {p.is_active ? "노출 중" : "꺼짐"}
                </button>
                <button
                  onClick={() => remove(p)}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:border-red-400 hover:text-red-600"
                >
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
