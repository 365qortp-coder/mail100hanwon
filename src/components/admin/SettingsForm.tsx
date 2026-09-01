"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ClinicSettings } from "@/lib/adminData";

/**
 * 병원 기본 정보 수정 화면.
 * 여기서 고친 값이 홈페이지 하단·지도·구조화 데이터에 함께 반영됩니다.
 */
export default function SettingsForm({
  initial,
  configured,
}: {
  initial: ClinicSettings;
  configured: boolean;
}) {
  const [form, setForm] = useState<ClinicSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function set<K extends keyof ClinicSettings>(key: K, value: ClinicSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function setHour(i: number, key: "day" | "time", value: string) {
    setForm((f) => {
      const hours = f.hours.map((h, idx) => (idx === i ? { ...h, [key]: value } : h));
      return { ...f, hours };
    });
  }

  function addHour() {
    setForm((f) => ({ ...f, hours: [...f.hours, { day: "", time: "" }] }));
  }

  function removeHour(i: number) {
    setForm((f) => ({ ...f, hours: f.hours.filter((_, idx) => idx !== i) }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase
      .from("clinic_settings")
      .update({
        name: form.name,
        director: form.director,
        tel: form.tel,
        tel_href: form.tel_href,
        kakao_url: form.kakao_url,
        reserve_url: form.reserve_url,
        naver_review_url: form.naver_review_url,
        region: form.region,
        address: form.address,
        map_lat: form.map_lat,
        map_lng: form.map_lng,
        hours: form.hours,
        auth_kakao_enabled: form.auth_kakao_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);
    setSaving(false);
    setMessage(error ? `저장 실패: ${error.message}` : "저장했습니다.");
  }

  return (
    <div className="space-y-6">
      {!configured && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Supabase 연결 전이라 <b>저장은 되지 않습니다.</b> 지금 보이는 값은 코드에 들어 있는
          현재 값입니다.
        </div>
      )}

      <Card title="기본">
        <Field label="병원 이름" value={form.name} onChange={(v) => set("name", v)} />
        <Field label="원장 성함" value={form.director} onChange={(v) => set("director", v)} />
        <Field label="지역 표기" value={form.region} onChange={(v) => set("region", v)} hint="예: 서울 중랑구" />
        <Field label="주소" value={form.address} onChange={(v) => set("address", v)} />
      </Card>

      <Card title="연락처">
        <Field label="대표 전화" value={form.tel} onChange={(v) => set("tel", v)} hint="화면에 보이는 형태 (예: 0507-1467-0195)" />
        <Field label="전화 걸기 주소" value={form.tel_href} onChange={(v) => set("tel_href", v)} hint="예: tel:050714670195" />
        <Field label="카카오톡 채널" value={form.kakao_url} onChange={(v) => set("kakao_url", v)} />
        <Field label="네이버 예약" value={form.reserve_url} onChange={(v) => set("reserve_url", v)} />
        <Field label="네이버 리뷰/플레이스" value={form.naver_review_url} onChange={(v) => set("naver_review_url", v)} />
      </Card>

      <Card title="진료시간">
        <div className="space-y-2">
          {form.hours.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={h.day}
                onChange={(e) => setHour(i, "day", e.target.value)}
                placeholder="구분 (예: 평일)"
                className="w-32 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
              <input
                value={h.time}
                onChange={(e) => setHour(i, "time", e.target.value)}
                placeholder="시간 (예: 09:30 - 18:30)"
                className="flex-1 rounded-lg border border-[var(--border)] px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeHour(i)}
                className="rounded-lg border border-[var(--border)] px-3 text-sm text-[var(--text-muted)] hover:border-red-400 hover:text-red-600"
              >
                삭제
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addHour}
            className="rounded-lg border border-dashed border-[var(--border)] px-3 py-2 text-sm text-[var(--text-muted)]"
          >
            + 줄 추가
          </button>
        </div>
      </Card>

      <Card title="지도 좌표">
        <div className="flex gap-2">
          <Field
            label="위도"
            value={String(form.map_lat)}
            onChange={(v) => set("map_lat", Number(v) || 0)}
          />
          <Field
            label="경도"
            value={String(form.map_lng)}
            onChange={(v) => set("map_lng", Number(v) || 0)}
          />
        </div>
      </Card>

      <Card title="회원 로그인">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.auth_kakao_enabled}
            onChange={(e) => set("auth_kakao_enabled", e.target.checked)}
          />
          <span>카카오 로그인 켜기</span>
        </label>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          끄면 후기 페이지의 로그인 버튼이 사라집니다. 카카오 개발자센터 설정이 끝난 뒤에 켜세요.
        </p>
      </Card>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !configured}
          className="rounded-lg bg-[var(--brand-primary)] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50"
        >
          {saving ? "저장 중…" : "저장"}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-[var(--text-muted)]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[var(--border)] px-3 py-2"
      />
      {hint && <span className="mt-1 block text-xs text-[var(--text-muted)]">{hint}</span>}
    </label>
  );
}
