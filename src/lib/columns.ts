import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import { CATEGORY_SECTION, getColumnSection, getColumnUrl } from "./columnUrl";
import type { ColumnSection } from "./columnUrl";

export { CATEGORY_SECTION, getColumnSection, getColumnUrl };
export type { ColumnSection };

const COLUMNS_DIR = path.join(process.cwd(), "content", "columns");

export type ColumnMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  modified?: string;
  category: string;
  keywords: string[];
  source?: { type: "youtube" | "original"; url?: string; videoId?: string };
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
};

export type Column = ColumnMeta & {
  content: string;
  contentHtml: string;
};

export function getColumnSlugs(): string[] {
  if (!fs.existsSync(COLUMNS_DIR)) return [];
  return fs
    .readdirSync(COLUMNS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function toDateString(v: unknown): string {
  if (!v) return new Date().toISOString().slice(0, 10);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

export function getColumnMeta(slug: string): ColumnMeta | null {
  slug = decodeSlug(slug);
  const filePath = path.join(COLUMNS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: toDateString(data.date),
    modified: data.modified ? toDateString(data.modified) : undefined,
    category: data.category ?? "건강",
    keywords: data.keywords ?? [],
    source: data.source,
    image: data.image,
    imageAlt: data.imageAlt,
    imageCredit: data.imageCredit,
  };
}

export async function getColumn(slug: string): Promise<Column | null> {
  slug = decodeSlug(slug);
  const filePath = path.join(COLUMNS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: toDateString(data.date),
    modified: data.modified ? toDateString(data.modified) : undefined,
    category: data.category ?? "건강",
    keywords: data.keywords ?? [],
    source: data.source,
    image: data.image,
    imageAlt: data.imageAlt,
    imageCredit: data.imageCredit,
    content,
    contentHtml: processed.toString(),
  };
}

export function getAllColumns(): ColumnMeta[] {
  return getColumnSlugs()
    .map((slug) => getColumnMeta(slug))
    .filter((m): m is ColumnMeta => m !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getColumnsBySection(section: ColumnSection): ColumnMeta[] {
  const all = getAllColumns();
  if (section === "columns") {
    return all.filter((c) => !CATEGORY_SECTION[c.category]);
  }
  const cats = Object.entries(CATEGORY_SECTION)
    .filter(([, s]) => s === section)
    .map(([cat]) => cat);
  return all.filter((c) => cats.includes(c.category));
}

// 깨진 YouTube placeholder 이미지 대체
const CATEGORY_FALLBACK_IMAGE: Record<string, string> = {
  "다이어트": "/photos/diet-product.webp",
  "공진단": "/photos/gongjindan-hero.webp",
  "총명공진단": "/photos/chongmyeong-product.webp",
  "통증치료": "/photos/pain.webp",
};

export function getColumnImage(col: ColumnMeta): string | undefined {
  if (col.image && !col.image.includes("/vi/unknown/")) return col.image;
  return CATEGORY_FALLBACK_IMAGE[col.category];
}
