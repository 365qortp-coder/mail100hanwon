import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 로그인 여부와 상관없는 "공개 데이터"만 읽을 때 쓰는 가벼운 클라이언트입니다.
 * (예: layout.tsx의 GA4 측정 ID 조회) next/headers의 cookies()를 쓰지 않기
 * 때문에, 이 클라이언트를 쓰는 페이지는 정적으로 미리 만들어둘 수 있어
 * 사이트가 더 빠르게 뜹니다. 로그인 세션이 필요한 화면(관리자 페이지)에는
 * 쓰지 마세요 — 그때는 lib/supabase/server.ts를 씁니다.
 */
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
