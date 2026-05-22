import type { MetadataRoute } from "next";
import { clinic } from "@/data/clinic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Naver
      {
        userAgent: ["Yeti", "NaverBot"],
        allow: "/",
      },
      // Google
      {
        userAgent: "Googlebot",
        allow: "/",
      },
      // AI search crawlers
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "Google-Extended",
          "ClaudeBot",
          "Anthropic-AI",
          "CCBot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${clinic.url}/sitemap.xml`,
    host: clinic.url,
  };
}
