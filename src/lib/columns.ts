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

/**
 * 글의 공개 상태.
 * - published : 사이트에 보임 (frontmatter에 status가 없으면 이 값으로 취급 —
 *               기존 글 100여 개가 그대로 공개 상태로 유지되게 하기 위함)
 * - draft     : 관리 앱이 배달만 해 둔 초안. 목록·검색엔진·상세페이지 전부에서 감춤
 * - private   : 비공개 보관
 */
export type ColumnStatus = "published" | "draft" | "private";

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
  status: ColumnStatus;
  /** 관리 앱이 배달한 글이면 "app". 직접 쓴 글은 undefined */
  deliveredBy?: string;
  /** 관리 앱 쪽 글 번호 — 같은 글이 두 번 배달되는 것을 막는 데 씀 */
  sourceId?: string;
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

/** frontmatter의 status를 읽는다. 값이 없거나 이상하면 published로 본다. */
function toStatus(v: unknown): ColumnStatus {
  return v === "draft" || v === "private" ? v : "published";
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
    status: toStatus(data.status),
    deliveredBy: data.delivered_by,
    sourceId: data.source_id,
  };
}

/**
 * 글 하나를 본문까지 읽어 온다.
 * 기본적으로 **발행된 글만** 돌려준다 — 초안 주소를 직접 쳐서 들어와도
 * 상세 페이지가 404가 되게 하기 위함. 관리자 화면처럼 초안도 봐야 하는
 * 곳에서만 includeUnpublished를 켠다.
 */
export async function getColumn(
  slug: string,
  { includeUnpublished = false }: { includeUnpublished?: boolean } = {}
): Promise<Column | null> {
  slug = decodeSlug(slug);
  const filePath = path.join(COLUMNS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const status = toStatus(data.status);
  if (!includeUnpublished && status !== "published") return null;
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
    status,
    deliveredBy: data.delivered_by,
    sourceId: data.source_id,
    content,
    contentHtml: processed.toString(),
  };
}

/**
 * 사이트에 보여 줄 글 목록.
 * 목록·섹션별 목록·사이트맵·연관글이 전부 이 함수 하나를 거치므로,
 * 여기서 초안을 걸러 내면 사이트 전체에서 한 번에 감춰진다.
 */
export function getAllColumns(): ColumnMeta[] {
  return getAllColumnsIncludingDrafts().filter((c) => c.status === "published");
}

/**
 * 본문 원문(마크다운)만 빠르게 읽는다.
 * getColumn()은 HTML 변환까지 하므로, 목록을 통째로 내보낼 때는 이걸 쓴다.
 */
export function getColumnBody(slug: string): string {
  slug = decodeSlug(slug);
  const filePath = path.join(COLUMNS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return "";
  return matter(fs.readFileSync(filePath, "utf8")).content.trim();
}

/** 관리자 화면 전용 — 초안·비공개까지 전부 포함한 목록 */
export function getAllColumnsIncludingDrafts(): ColumnMeta[] {
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
