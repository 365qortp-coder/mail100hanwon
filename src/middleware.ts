import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { detectAiBot } from "@/lib/botDetect";

/**
 * 모든 요청이 지나가는 문 앞입니다. 두 가지 일을 합니다.
 *
 * 1) AI 검색봇(챗GPT·클로드·퍼플렉시티 등)이 방문하면 기록을 남깁니다.
 *    방문자 화면 속도에 영향이 없도록, 응답을 먼저 보내고 나서(백그라운드) 기록합니다.
 * 2) /admin 으로 시작하는 주소는 **관리자인지**까지 확인합니다.
 *    로그인만 한 일반 회원(카카오)은 통과시키지 않습니다.
 */
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const path = request.nextUrl.pathname;

  // ── 1) AI 봇 방문 기록 ──────────────────────────────
  const botName = detectAiBot(request.headers.get("user-agent"));
  if (botName) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (supabaseUrl && anonKey) {
      event.waitUntil(
        fetch(`${supabaseUrl}/rest/v1/bot_visits`, {
          method: "POST",
          headers: {
            apikey: anonKey,
            Authorization: `Bearer ${anonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({ bot_name: botName, path }),
        }).catch(() => {
          // 통계 기록 실패가 방문에 영향을 주면 안 되므로 조용히 무시합니다.
        })
      );
    }
  }

  // ── 2) 관리자 화면 보호 ─────────────────────────────
  const isAdminArea = path.startsWith("/admin") || path.startsWith("/api/admin");
  if (!isAdminArea) {
    return NextResponse.next();
  }

  const isLoginPage = path === "/admin/login";
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase 설정이 아직 없으면(연결 전) 관리자 화면을 잠가 둡니다.
  // 설정이 없는 채로 통과시키면 누구나 들어올 수 있게 됩니다.
  if (!supabaseUrl || !anonKey) {
    if (isLoginPage) return NextResponse.next();
    if (path.startsWith("/api/admin")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인은 했지만 관리자 표식(role: admin)이 없는 사람 = 카카오로 로그인한 일반 회원.
  // 후기 보려고 로그인한 환자가 관리자 화면에 들어오는 걸 막습니다.
  const isAdmin = user?.app_metadata?.role === "admin";

  if (!isAdmin && !isLoginPage) {
    if (path.startsWith("/api/admin")) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (isAdmin && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  // 정적 파일(이미지·폰트·_next 빌드 산출물)은 제외하고 그 외 모든 페이지에서 실행
  // (AI 봇 방문 기록을 하려면 관리자 화면 밖에서도 돌아야 합니다)
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)"],
};
