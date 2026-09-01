"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * 칼럼 새로 쓰기 화면.
 * 저장하면 깃허브에 글 파일이 만들어지고, 자동 배포로 사이트에 반영됩니다.
 * (반영까지 보통 1~2분 걸립니다)
 */
export function ColumnForm({ categories }: { categories: string[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "한방건강");
  const [keywords, setKeywords] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    if (!title.trim() || !body.trim()) {
      setMessage("제목과 본문을 입력해 주세요.");
      return;
    }
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/columns/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        category,
        keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean),
        image,
        imageAlt,
        body,
        status,
      }),
    });

    setSaving(false);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMessage(data.error || "저장에 실패했습니다.");
      return;
    }

    setMessage(
      `저장했습니다. 주소: ${data.slug} — 사이트 반영까지 1~2분 걸립니다.`
    );
    setTimeout(() => router.push("/admin/columns"), 1500);
  }

  return (
    <div className="space-y-5">
      <Card title="글 정보">
        <Field label="제목" value={title} onChange={setTitle} required />
        <Field
          label="요약 (검색결과에 나오는 설명)"
          value={description}
          onChange={setDescription}
          hint="한두 문장. 비워 두면 검색결과에서 불리합니다."
        />
        <label className="block text-sm">
          <span className="mb-1 block text-[var(--text-muted)]">카테고리</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <span className="mt-1 block text-xs text-[var(--text-muted)]">
            카테고리에 따라 글 주소가 달라집니다 (다이어트 → /diet/columns/…)
          </span>
        </label>
        <Field
          label="검색 키워드"
          value={keywords}
          onChange={setKeywords}
          hint="쉼표로 구분. 예: 마황 부작용, 다이어트 한약"
        />
      </Card>

      <Card title="대표 사진 (선택)">
        <Field label="사진 주소" value={image} onChange={setImage} hint="예: /photos/diet-product.webp" />
        <Field label="사진 설명" value={imageAlt} onChange={setImageAlt} hint="눈이 안 보이는 분과 검색엔진이 읽습니다" />
      </Card>

      <Card title="본문">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={18}
          placeholder={"마크다운으로 씁니다.\n\n## 소제목\n\n본문 내용...\n\n**굵게** 쓰려면 별표 두 개로 감쌉니다."}
          className="w-full rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-sm leading-relaxed"
        />
      </Card>

      <Card title="공개 설정">
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={status === "draft"}
              onChange={() => setStatus("draft")}
            />
            <span>초안으로 저장 (사이트에 안 보임)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={status === "published"}
              onChange={() => setStatus("published")}
            />
            <span>바로 발행</span>
          </label>
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
        <button
          onClick={() => router.push("/admin/columns")}
          className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm"
        >
          취소
        </button>
        {message && <span className="text-sm text-[var(--text-muted)]">{message}</span>}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <h2 className="mb-4 text-base font-bold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-[var(--text-muted)]">
        {label}
        {required && <span className="text-[var(--brand-primary)]"> *</span>}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
      />
      {hint && <span className="mt-1 block text-xs text-[var(--text-muted)]">{hint}</span>}
    </label>
  );
}
