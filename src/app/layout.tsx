import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingCTA } from "@/components/FloatingCTA";
import { clinic } from "@/data/clinic";
import { clinicSchema, directorSchema, jsonLdScript } from "@/lib/schema";

const sans = Noto_Sans_KR({
  variable: "--font-pretendard",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
});

const serif = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#15803d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(clinic.url),
  title: {
    default: `${clinic.name} | 매일감비환 다이어트·공진단·총명공진단`,
    template: `%s | ${clinic.name}`,
  },
  description: `${clinic.name}은 서울 중랑구 공릉로 21에 위치한 한의원입니다. 매일감비환 다이어트 한약, 공진단, 총명공진단, 통증 치료를 진행하며 비대면 진료로 전국 어디서나 처방받을 수 있습니다.`,
  applicationName: clinic.name,
  authors: [{ name: clinic.director.name }],
  generator: "Next.js",
  keywords: [
    clinic.name,
    "매일감비환",
    "감비환",
    "다이어트 한약",
    "한약 다이어트",
    "공진단",
    "총명공진단",
    "수능 공진단",
    "비대면 한의원",
    "중랑구 한의원",
    "먹골역 한의원",
    "노원 한의원",
    "동대문 한의원",
    "남양주 한의원",
    "송원석 원장",
  ],
  creator: clinic.director.name,
  publisher: clinic.name,
  formatDetection: {
    email: false,
    telephone: true,
    address: true,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: clinic.url,
    siteName: clinic.name,
    title: `${clinic.name} | 매일감비환·공진단·총명공진단`,
    description: `서울 중랑구 매일백세한의원. 매일감비환 다이어트 한약, 공진단, 총명공진단 비대면 처방 가능.`,
    images: [
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
    title: clinic.name,
    description: "매일감비환 다이어트·공진단·총명공진단 비대면 처방",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "dpvKrv5OT1csWHy2WSDBoFPyjHsQ0w0Y6NVLD-GW8wE",
    other: {
      "naver-site-verification": "a51d61ffc56b56288bdb0c741de8f819dd8ff88a",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="schema-clinic"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={jsonLdScript([clinicSchema(), directorSchema()])}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <FloatingCTA />
      </body>
    </html>
  );
}
