import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { clinic } from "@/data/clinic";

/**
 * 관리자 화면이 쓰는 데이터 읽기 도구 모음.
 *
 * Supabase 연결이 아직 안 되어 있어도 화면이 죽지 않도록, 모든 함수가
 * "값이 없으면 기본값"을 돌려줍니다. (연결 전에도 화면 모양을 볼 수 있게)
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export type ClinicSettings = {
  name: string;
  director: string;
  tel: string;
  tel_href: string;
  kakao_url: string;
  reserve_url: string;
  naver_review_url: string;
  region: string;
  address: string;
  map_lat: number;
  map_lng: number;
  hours: { day: string; time: string }[];
  auth_kakao_enabled: boolean;
};

/** 코드에 박혀 있는 지금 값 — Supabase 연결 전까지 이 값이 쓰입니다. */
export const CLINIC_FALLBACK: ClinicSettings = {
  name: clinic.name,
  director: clinic.director.name,
  tel: clinic.contact.phone,
  tel_href: `tel:${clinic.contact.phoneClean}`,
  kakao_url: clinic.contact.kakao,
  reserve_url: clinic.contact.naverBooking,
  naver_review_url: "https://map.naver.com/p/entry/place/1632908709",
  region: `${clinic.address.region} ${clinic.address.district}`,
  address: clinic.address.full,
  map_lat: clinic.geo.latitude,
  map_lng: clinic.geo.longitude,
  hours: [
    { day: "평일", time: clinic.hours.weekday },
    { day: "점심", time: clinic.hours.lunch },
    { day: "토요일", time: clinic.hours.saturday },
    { day: "휴진", time: clinic.hours.sunday },
  ],
  auth_kakao_enabled: false,
};

/** 병원 정보 한 줄 읽기 (로그인 세션 불필요 — 공개 정보) */
export async function getClinicSettings(): Promise<ClinicSettings> {
  if (!isSupabaseConfigured()) return CLINIC_FALLBACK;
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("clinic_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();
    return data ? { ...CLINIC_FALLBACK, ...data } : CLINIC_FALLBACK;
  } catch {
    return CLINIC_FALLBACK;
  }
}

export type ButtonClickSummary = {
  total: number;
  byKey: Record<string, number>;
  byDay: { day: string; count: number }[];
};

/** 최근 N일간 문의 버튼 클릭 요약 */
export async function getButtonClickSummary(days = 7): Promise<ButtonClickSummary> {
  const empty: ButtonClickSummary = { total: 0, byKey: {}, byDay: [] };
  if (!isSupabaseConfigured()) return empty;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("button_clicks")
      .select("button_key, clicked_at")
      .gte("clicked_at", since);
    if (!data) return empty;

    const byKey: Record<string, number> = {};
    const dayMap: Record<string, number> = {};
    for (const row of data) {
      byKey[row.button_key] = (byKey[row.button_key] ?? 0) + 1;
      const d = String(row.clicked_at).slice(0, 10);
      dayMap[d] = (dayMap[d] ?? 0) + 1;
    }
    const byDay = Object.entries(dayMap)
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([day, count]) => ({ day, count }));

    return { total: data.length, byKey, byDay };
  } catch {
    return empty;
  }
}

export type BotVisitSummary = {
  total: number;
  byBot: { bot: string; count: number; lastVisit: string }[];
};

/** 최근 N일간 AI 봇 방문 요약 */
export async function getBotVisitSummary(days = 30): Promise<BotVisitSummary> {
  const empty: BotVisitSummary = { total: 0, byBot: [] };
  if (!isSupabaseConfigured()) return empty;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("bot_visits")
      .select("bot_name, visited_at")
      .gte("visited_at", since)
      .order("visited_at", { ascending: false });
    if (!data) return empty;

    const map: Record<string, { count: number; lastVisit: string }> = {};
    for (const row of data) {
      const cur = map[row.bot_name];
      if (cur) cur.count += 1;
      else map[row.bot_name] = { count: 1, lastVisit: String(row.visited_at) };
    }
    const byBot = Object.entries(map)
      .map(([bot, v]) => ({ bot, count: v.count, lastVisit: v.lastVisit }))
      .sort((a, b) => b.count - a.count);

    return { total: data.length, byBot };
  } catch {
    return empty;
  }
}

/** 후기 개수 (관리자 홈 요약용) */
export async function getReviewCount(): Promise<{ published: number; draft: number }> {
  if (!isSupabaseConfigured()) return { published: 0, draft: 0 };
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("reviews").select("status");
    if (!data) return { published: 0, draft: 0 };
    return {
      published: data.filter((r) => r.status === "published").length,
      draft: data.filter((r) => r.status !== "published").length,
    };
  } catch {
    return { published: 0, draft: 0 };
  }
}

/** 회원 수 (관리자 홈 요약용) */
export async function getMemberCount(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("profiles")
      .select("user_id", { count: "exact", head: true });
    return count ?? 0;
  } catch {
    return 0;
  }
}
