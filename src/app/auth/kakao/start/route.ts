import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * "카카오로 로그인" 버튼을 누르면 여기를 거쳐 카카오로 이동합니다.
 * Supabase의 기본 카카오 연동은 이메일 권한까지 무조건 요청해서, 이메일 권한이
 * 없는(사업자 인증 전) 앱에서는 항상 실패합니다(KOE205). 그래서 여기서는
 * 카카오의 OpenID Connect 방식으로 직접 로그인 요청을 만들어, 닉네임만
 * 요청하도록 좁혀서 보냅니다.
 */
export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const next = searchParams.get("next") ?? "/reviews";

  const nonce = crypto.randomUUID();
  const state = crypto.randomUUID();

  // Supabase는 "원본 nonce를 해시(SHA-256)한 값"이 ID 토큰 안에 들어있을 것으로 기대합니다.
  // 그래서 카카오에는 해시된 값을 보내고, 나중에 검증할 원본 값은 쿠키에 저장해둡니다.
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(nonce));
  const hashedNonce = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const cookieStore = await cookies();
  cookieStore.set("kakao_oidc_nonce", nonce, { httpOnly: true, maxAge: 300, path: "/" });
  cookieStore.set("kakao_oidc_next", next, { httpOnly: true, maxAge: 300, path: "/" });

  const authorizeUrl = new URL("https://kauth.kakao.com/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", process.env.KAKAO_REST_API_KEY!);
  authorizeUrl.searchParams.set("redirect_uri", `${origin}/auth/kakao/callback`);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "openid profile_nickname");
  authorizeUrl.searchParams.set("nonce", hashedNonce);
  authorizeUrl.searchParams.set("state", state);

  return NextResponse.redirect(authorizeUrl.toString());
}
