import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

/**
 * 카카오 로그인 완료 후 여기로 돌아옵니다.
 * 1) 받은 코드를 카카오 서버에서 실제 로그인 정보(ID 토큰)로 교환하고
 * 2) 그 ID 토큰으로 Supabase 로그인 세션을 만들고
 * 3) 처음 로그인이면 동의 화면으로, 아니면 원래 보려던 페이지로 보냅니다.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const kakaoError = searchParams.get("error");

  const cookieStore = await cookies();
  const nonce = cookieStore.get("kakao_oidc_nonce")?.value;
  const next = cookieStore.get("kakao_oidc_next")?.value ?? "/reviews";

  cookieStore.delete("kakao_oidc_nonce");
  cookieStore.delete("kakao_oidc_next");

  if (kakaoError || !code || !nonce) {
    return NextResponse.redirect(`${origin}/reviews?error=login_failed`);
  }

  try {
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY!,
        client_secret: process.env.KAKAO_CLIENT_SECRET!,
        redirect_uri: `${origin}/auth/kakao/callback`,
        code,
      }),
    });

    if (!tokenRes.ok) {
      return NextResponse.redirect(`${origin}/reviews?error=login_failed`);
    }

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;
    if (!idToken) {
      return NextResponse.redirect(`${origin}/reviews?error=login_failed`);
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "kakao",
      token: idToken,
      nonce,
    });

    if (error || !data.user) {
      return NextResponse.redirect(`${origin}/reviews?error=login_failed`);
    }

    const { data: consent } = await supabase
      .from("member_consents")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (!consent) {
      return NextResponse.redirect(`${origin}/auth/consent?next=${encodeURIComponent(next)}`);
    }
    return NextResponse.redirect(`${origin}${next}`);
  } catch {
    return NextResponse.redirect(`${origin}/reviews?error=login_failed`);
  }
}
