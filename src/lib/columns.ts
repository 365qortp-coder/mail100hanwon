import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";

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

function toDateString(v: unknown): string {
  if (!v) return new Date().toISOString().slice(0, 10);
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

export function getColumnMeta(slug: string): ColumnMeta | null {
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
  };
}

export async function getColumn(slug: string): Promise<Column | null> {
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
