import type { NextConfig } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// SEO-301 (2026-09-18) — 지워진 옛 칼럼 주소를 같은 주제의 살아 있는 글로 넘긴다.
// 서치콘솔 기준 미색인 333개 중 244개가 "없는 페이지"(404·5xx)였고, 전부 옛 칼럼 주소였다.
// 구글이 이미 알고 있는 주소이므로 301로 넘겨 색인 자산을 회수한다.
// 목록은 _도구/301-map.json (죽은 주소 132개 → 살아 있는 글 19곳, 2026-09-18 전수 확인).
type Redirect = { source: string; destination: string; permanent: boolean };
function legacyRedirects(): Redirect[] {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), "_도구", "301-map.json"), "utf8")) as Redirect[];
  } catch {
    return []; // 파일이 없어도 빌드는 깨지지 않게
  }
}

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self)",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.imweb.me" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
    ],
  },
  async redirects() {
    return legacyRedirects();
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
