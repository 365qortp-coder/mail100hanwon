import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/adminAuth";
import { legacyRedirects } from "@/lib/legacy-redirects";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    // SEO-301: 지워진 옛 칼럼 주소를 살아 있는 글로 넘기기 위해 칼럼 경로도 본다
    "/columns/:path*",
    "/diet/columns/:path*",
    "/gongjindan/columns/:path*",
    "/nmc/columns/:path*",
  ],
};

// 죽은 주소 → 살아 있는 글. next.config 의 redirects 는 한글 주소가 부호화돼 들어오면
// 규칙과 맞지 않아 걸리지 않는다(2026-09-18 배포 후 실측). 그래서 여기서 직접 처리한다.
const LEGACY = new Map(legacyRedirects.map((r) => [r.source, r.destination]));

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api/admin")) {
    let decoded = pathname;
    try {
      decoded = decodeURIComponent(pathname);
    } catch {
      // 잘못 부호화된 주소는 그대로 둔다
    }
    const dest = LEGACY.get(decoded) ?? LEGACY.get(pathname);
    if (dest) {
      return NextResponse.redirect(new URL(dest, req.url), 301);
    }
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_PASSWORD;
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authorized = secret ? await verifyAdminSessionToken(token, secret) : false;

  if (authorized) return NextResponse.next();

  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const loginUrl = new URL("/admin/login", req.url);
  return NextResponse.redirect(loginUrl);
}
