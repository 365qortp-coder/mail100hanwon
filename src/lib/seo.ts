import type { Metadata } from "next";
import { clinic } from "@/data/clinic";

type SEOInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
};

export function buildMetadata({
  title,
  description,
  path = "",
  keywords = [],
  ogImage,
  noIndex,
}: SEOInput): Metadata {
  const url = `${clinic.url}${path}`;
  const fullTitle = title.includes(clinic.name)
    ? title
    : `${title} | ${clinic.name}`;
  const allKeywords = [
    clinic.name,
    clinic.brands.diet,
    clinic.brands.chongmyeong,
    clinic.brands.gongjindan,
    "중랑구한의원",
    "먹골역한의원",
    "다이어트 한약",
    "공진단",
    "비대면 한의원",
    ...keywords,
  ];

  return {
    title: { absolute: fullTitle },
    description,
    keywords: allKeywords,
    metadataBase: new URL(clinic.url),
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: clinic.name,
      locale: "ko_KR",
      type: "website",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }]
        : [
            {
              url: "/og-default.png",
              width: 1200,
              height: 630,
              alt: clinic.name,
            },
          ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : ["/og-default.png"],
    },
    other: {
      "naver-site-verification": process.env.NEXT_PUBLIC_NAVER_VERIFICATION ?? "",
      "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? "",
    },
  };
}
