import { NextRequest, NextResponse } from "next/server";
import matter from "gray-matter";
import { getAllColumnsIncludingDrafts } from "@/lib/columns";
import { listColumnFilenames, createColumnFile } from "@/lib/githubContent";

/**
 * 관리자 화면에서 칼럼을 새로 쓸 때 저장하는 곳.
 *
 * 저장 방식은 관리 앱이 배달할 때(/api/inbox/columns)와 똑같습니다 —
 * Vercel은 자기 파일을 못 고치므로 깃허브에 커밋하고, 그 커밋이 자동 배포를
 * 일으켜 사이트에 반영됩니다.
 *
 * 로그인 확인은 middleware가 이미 하고 있습니다(/api/admin/* 보호).
 */

export const dynamic = "force-dynamic";

/**
 * 제목 → 주소용 이름.
 * ⚠️ \p{Letter} 같은 유니코드 속성 표기를 쓰면 배포본에서만 한글이 사라집니다.
 *    글자 범위를 직접 적어야 안전합니다. (실제로 겪은 문제)
 */
function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^가-힣ㄱ-ㅎㅏ-ㅣa-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  return base || "column";
}

type Body = {
  title?: string;
  description?: string;
  body?: string;
  category?: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  status?: string;
  date?: string;
};

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const payload = (await req.json().catch(() => ({}))) as Body;
  const title = payload.title?.trim();
  const body = payload.body?.trim();
  const category = payload.category?.trim() || "한방건강";

  if (!title || !body) {
    return NextResponse.json({ error: "제목과 본문을 입력해 주세요." }, { status: 400 });
  }

  const status =
    payload.status === "published" || payload.status === "private"
      ? payload.status
      : "draft";

  // 이름이 겹치면 뒤에 번호를 붙입니다.
  let filenames: string[];
  try {
    filenames = await listColumnFilenames(token);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
  const taken = new Set([
    ...filenames.map((f) => f.replace(/\.md$/, "")),
    ...getAllColumnsIncludingDrafts().map((c) => c.slug),
  ]);

  let slug = slugify(title);
  if (taken.has(slug)) {
    let n = 2;
    while (taken.has(`${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }

  const date = payload.date?.trim() || new Date().toISOString().slice(0, 10);
  const keywords = (payload.keywords ?? []).map((k) => k.trim()).filter(Boolean);

  // gray-matter가 따옴표·줄바꿈을 알아서 처리하므로 YAML을 손으로 짜지 않습니다.
  const fileContents = matter.stringify(body, {
    title,
    description: payload.description?.trim() ?? "",
    date,
    category,
    status,
    ...(keywords.length ? { keywords } : {}),
    ...(payload.image ? { image: payload.image.trim() } : {}),
    ...(payload.image ? { imageAlt: payload.imageAlt?.trim() || title } : {}),
  });

  try {
    await createColumnFile(
      slug,
      fileContents,
      token,
      `feat(admin): add column ${slug}`
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, slug, status });
}
