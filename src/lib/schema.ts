import { clinic } from "@/data/clinic";
import type { Treatment } from "@/data/treatments";

export function clinicSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "MedicalClinic", "LocalBusiness"],
    "@id": `${clinic.url}#clinic`,
    name: clinic.name,
    alternateName: [clinic.brands.diet, clinic.brands.chongmyeong, clinic.brands.gongjindan],
    url: clinic.url,
    telephone: clinic.contact.phoneInternational,
    image: `${clinic.url}/og-default.png`,
    logo: `${clinic.url}/logo.png`,
    description: `${clinic.name}은 서울 중랑구 공릉로에 위치한 한의원으로, 다이어트 한약(${clinic.brands.diet}), 공진단, 총명공진단, 통증 치료를 진행합니다. 대면 진료뿐 아니라 비대면 진료로 전국 어디서나 처방받을 수 있습니다.`,
    medicalSpecialty: ["TraditionalChinese", "AlternativeMedicine"],
    priceRange: "₩₩",
    currenciesAccepted: "KRW",
    paymentAccepted: ["Cash", "Credit Card"],
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.district,
      addressRegion: clinic.address.city,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: clinic.geo.latitude,
      longitude: clinic.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:30",
        closes: "18:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:30",
        closes: "13:00",
      },
    ],
    sameAs: [clinic.youtube.diet, clinic.youtube.gongjindan, clinic.youtube.pain],
    areaServed: [
      { "@type": "City", name: "서울" },
      { "@type": "AdministrativeArea", name: "중랑구" },
      { "@type": "AdministrativeArea", name: "노원구" },
      { "@type": "AdministrativeArea", name: "동대문구" },
      { "@type": "AdministrativeArea", name: "광진구" },
      { "@type": "AdministrativeArea", name: "성북구" },
      { "@type": "City", name: "남양주" },
      { "@type": "City", name: "구리" },
      { "@type": "City", name: "의정부" },
      { "@type": "Country", name: "대한민국" },
    ],
  };
}

export function directorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${clinic.url}#director`,
    name: clinic.director.name,
    jobTitle: clinic.director.title,
    worksFor: { "@id": `${clinic.url}#clinic` },
    affiliation: clinic.name,
    description: clinic.director.description,
  };
}

export function treatmentSchema(t: Treatment) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalTherapy",
    name: t.name,
    alternateName: t.shortName,
    description: t.summary,
    provider: { "@id": `${clinic.url}#clinic` },
    relevantSpecialty: "TraditionalChinese",
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleSchema(p: {
  title: string;
  description: string;
  slug: string;
  date: string;
  modified?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.modified ?? p.date,
    author: { "@id": `${clinic.url}#director` },
    publisher: { "@id": `${clinic.url}#clinic` },
    mainEntityOfPage: `${clinic.url}/columns/${p.slug}`,
    image: p.image ?? `${clinic.url}/og-default.png`,
  };
}

type JsonLdObject = Record<string, unknown>;

export function jsonLdScript(data: JsonLdObject | JsonLdObject[]) {
  return {
    __html: JSON.stringify(data),
  };
}
