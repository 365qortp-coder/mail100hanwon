// 순수 함수 모음 — fs 의존 없음. 클라이언트 컴포넌트에서도 안전하게 import 가능.

export type ColumnSection = "diet" | "gongjindan" | "nmc" | "columns";

// category → URL section 매핑
export const CATEGORY_SECTION: Record<string, string> = {
  "다이어트": "diet",
  "공진단": "gongjindan",
  "총명공진단": "gongjindan",
  "통증치료": "nmc",
};

export function getColumnSection(category: string): ColumnSection {
  return (CATEGORY_SECTION[category] as ColumnSection) ?? "columns";
}

export function getColumnUrl(col: { slug: string; category: string }): string {
  const section = getColumnSection(col.category);
  if (section === "columns") return `/columns/${col.slug}`;
  return `/${section}/columns/${col.slug}`;
}
