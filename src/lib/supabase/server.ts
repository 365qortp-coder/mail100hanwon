import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버(Server Component)에서 쓰는 Supabase 연결 클라이언트입니다.
 * 요청에 담긴 로그인 쿠키를 읽어서, 로그인한 사람인지 서버에서 바로
 * 확인할 수 있게 해줍니다.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component에서 호출된 경우 쿠키를 못 씀 — middleware가
            // 세션 갱신을 대신 처리하므로 여기서는 무시해도 안전합니다.
          }
        },
      },
    }
  );
}
