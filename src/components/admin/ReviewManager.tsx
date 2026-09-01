"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Review = {
  id: string;
  image_url: string;
  image_alt: string | null;
  comment: string;
  status: "draft" | "published" | "private";
  published_date: string;
};

/**
 * 후기 관리 — A4 후기 사진 한 장 + 그 아래 코멘트.
 * 의료법 제56조에 따라 치료 경험담은 로그인한 회원에게만 보입니다.
 */
export function ReviewManager({
  initial,
  configured,
}: {
  initial: Review[];
  configured: boolean;
}) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function handleAdd() {
    if (!file) {
      setMessage("후기 사진을 선택해 주세요.");
      return;
    }
    if (!comment.trim()) {
      setMessage("코멘트를 입력해 주세요.");
      return;
    }
    setBusy(true);
    setMessage("");
    const supabase = createClient();

    const path = `${Date.now()}-${file.name.replace(/[^\w.-]/g, "")}`;
    const { error: upErr } = await supabase.storage.from("reviews").upload(path, file);
    if (upErr) {
      setBusy(false);
      setMessage(`사진 업로드 실패: ${upErr.message}`);
      return;
    }
    const imageUrl = supabase.storage.from("reviews").getPublicUrl(path).data.publicUrl;

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        image_url: imageUrl,
        image_alt: imageAlt.trim() || null,
        comment: comment.trim(),
        status,
      })
      .select()
      .single();

    setBusy(false);
    if (error) {
      setMessage(`등록 실패: ${error.message}`);
      return;
    }
    setReviews((r) => [data as Review, ...r]);
    setFile(null);
    setComment("");
    setImageAlt("");
    setMessage("등록했습니다.");
  }

  async function toggleStatus(r: Review) {
    const next = r.status === "published" ? "draft" : "published";
    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .update({ status: next, updated_at: new Date().toISOString() })
      .eq("id", r.id);
    if (error) {
      setMessage(`변경 실패: ${error.message}`);
      return;
    }
    setReviews((list) =>
      list.map((x) => (x.id === r.id ? { ...x, status: next } : x))
    );
  }

  async function remove(r: Review) {
    if (!confirm("이 후기를 삭제할까요?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("reviews").delete().eq("id", r.id);
    if (error) {
      setMessage(`삭제 실패: ${error.message}`);
      return;
    }
    setReviews((list) => list.filter((x) => x.id !== r.id));
  }

  return (
    <div className="space-y-6">
      {!configured && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Supabase 연결 전이라 등록·수정이 되지 않습니다.
        </div>
      )}

      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="mb-4 text-base font-bold">새 후기 등록</h2>
        <div className="space-y-3">
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">후기 사진 (인바디 결과지 등)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">사진 설명</span>
            <input
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="예: 2개월 복용 후 인바디 결과"
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-[var(--text-muted)]">코멘트 (사진 아래 들어갑니다)</span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
            />
          </label>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" checked={status === "draft"} onChange={() => setStatus("draft")} />
              <span>초안</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={status === "published"} onChange={() => setStatus("published")} />
              <span>바로 공개</span>
            </label>
          </div>
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
        <h2 className="mb-4 text-base font-bold">등록된 후기 ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">아직 없습니다.</p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-lg border border-[var(--border)] p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.image_url}
                  alt={r.image_alt ?? ""}
                  className="mb-2 w-full rounded object-cover"
                />
                <p className="text-sm">{r.comment}</p>
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                      r.status === "published"
                        ? "bg-[var(--brand-primary-light)] text-[var(--brand-primary)]"
                        : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
                    }`}
                  >
                    {r.status === "published" ? "공개 중" : "초안"}
                  </button>
                  <button
                    onClick={() => remove(r)}
                    className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] hover:border-red-400 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
