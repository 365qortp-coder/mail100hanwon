import type { MetadataRoute } from "next";
import { clinic } from "@/data/clinic";
import { treatments } from "@/data/treatments";
import { locations, stations } from "@/data/locations";
import { getAllColumns, getColumnUrl } from "@/lib/columns";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = clinic.url;
  const today = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: today, priority: 1.0, changeFrequency: "weekly" },
    { url: `${baseUrl}/diet`, lastModified: today, priority: 0.95, changeFrequency: "monthly" },
    { url: `${baseUrl}/diet/columns`, lastModified: today, priority: 0.85, changeFrequency: "daily" },
    { url: `${baseUrl}/gongjindan`, lastModified: today, priority: 0.95, changeFrequency: "monthly" },
    { url: `${baseUrl}/gongjindan/columns`, lastModified: today, priority: 0.85, changeFrequency: "daily" },
    { url: `${baseUrl}/gongjindan/sahyang`, lastModified: today, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/gongjindan/nokyong`, lastModified: today, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/gongjindan/chongmyeong`, lastModified: today, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/nmc`, lastModified: today, priority: 0.95, changeFrequency: "monthly" },
    { url: `${baseUrl}/nmc/columns`, lastModified: today, priority: 0.85, changeFrequency: "daily" },
    { url: `${baseUrl}/about`, lastModified: today, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/clinic`, lastModified: today, priority: 0.9, changeFrequency: "monthly" },
    { url: `${baseUrl}/faq`, lastModified: today, priority: 0.8, changeFrequency: "weekly" },
    { url: `${baseUrl}/columns`, lastModified: today, priority: 0.75, changeFrequency: "daily" },
    { url: `${baseUrl}/event/suneung`, lastModified: today, priority: 0.85, changeFrequency: "monthly" },
  ];

  const treatmentPages: MetadataRoute.Sitemap = treatments.map((t) => ({
    url: `${baseUrl}/treatments/${t.slug}`,
    lastModified: today,
    priority: 0.95,
    changeFrequency: "monthly" as const,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((l) => ({
    url: `${baseUrl}/locations/${l.slug}`,
    lastModified: today,
    priority: 0.85,
    changeFrequency: "monthly" as const,
  }));

  const stationPages: MetadataRoute.Sitemap = stations.map((s) => ({
    url: `${baseUrl}/stations/${s.slug}`,
    lastModified: today,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  // 카테고리별 올바른 URL로 생성 — 한글 slug는 사이트맵 규격상 퍼센트 인코딩 (encodeURI는 /는 보존)
  const columnPages: MetadataRoute.Sitemap = getAllColumns().map((c) => ({
    url: `${baseUrl}${encodeURI(getColumnUrl(c))}`,
    lastModified: new Date(c.modified ?? c.date),
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [
    ...staticPages,
    ...treatmentPages,
    ...locationPages,
    ...stationPages,
    ...columnPages,
  ];
}
