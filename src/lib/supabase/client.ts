"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저(사용자 화면)에서 쓰는 Supabase 연결 클라이언트입니다.
 * 로그인 세션을 쿠키에 저장해서, 새로고침해도 로그인이 풀리지 않게 해줍니다.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
