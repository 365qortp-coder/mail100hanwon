import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import matter from "gray-matter";
import { getAllColumnsIncludingDrafts } from "@/lib/columns";
import { listColumnFilenames, createColumnFile } from "@/lib/githubContent";

/**
 * 칼럼 받는 문 — 관리 앱이 글을 배달하는 곳.
 * 규격: `마케팅의 정석 홈페이지 CMS 연결 규격.md` 3장
 *
 * 이 사이트는 Supabase가 아니라 글 파일(.md)로 칼럼을 보관하므로,
 * 규격서의 "columns 표에 저장" 부분만 "깃허브에 글 파일 커밋"으로 바뀝니다.
 * 주소·보내는 형식·돌려주는 형식은 규격서와 100% 같습니다.
 *
 * 안전 규칙 (규격서 3장):
 *  1. 열쇠는 timing-safe 비교, 20자 미만이면 무조건 거절
 *  2. 이 파일이 손대는 것은 content/columns 안의 글 파일뿐
 *  3. source_id가 이미 있으면 저장하지 않고 건너뜀 (손으로 고친 글 보호)
 *  4. slug가 겹치면 뒤에 번호를 붙임
 *  5. 삭제 기능 없음
 */

export const dynamic = "force-dynamic";

const MIN_KEY_LENGTH = 20;

/** 길이를 노출하지 않는 열쇠 비교 */
function keyMatches(given: string | null, expected: string): boolean {
  if (!given) return false;
  const a = crypto.createHash("sha256").update(given).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

function checkKey(req: NextRequest): NextResponse | null {
  const expected = process.env.INBOX_KEY;
  if (!expected || expected.length < MIN_KEY_LENGTH) {
    return NextResponse.json(
      { ok: false, error: "이 홈페이지에 INBOX_KEY가 설정되지 않았습니다." },
      { status: 500 }
    );
  }
  if (!keyMatches(req.headers.get("x-inbox-key"), expected)) {
    return NextResponse.json({ ok: false, error: "열쇠가 맞지 않습니다." }, { status: 401 });
  }
  return null;
}

/**
 * 제목 → 주소용 이름. 기존 글들과 같은 "한글-대시" 방식.
 *
 * 한글을 \p{Script=Hangul}(유니코드 속성 표기)로 쓰지 않는 이유:
 * 로컬에서는 되지만 배포본에서는 빌드 과정의 코드 변환을 거치면서 한글이
 * 통째로 걸러져 slug가 "column-xxxxxx"로만 나오는 문제가 있었습니다.
 * 글자 범위를 직접 적으면 어떤 변환을 거쳐도 안전합니다.
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

/** source_id에서 6글자 꼬리표를 만든다 — 같은 글인지 파일 이름만으로 알아보기 위함 */
function suffixFor(sourceId: string): string {
  return crypto.createHash("sha1").update(sourceId).digest("hex").slice(0, 6);
}

type InboxBody = {
  source_id?: string;
  title?: string;
  summary?: string;
  body?: string;
  category?: string;
  category_label?: string;
  image_url?: string;
  image_alt?: string;
  slug?: string;
  status?: string;
  published_date?: string;
};

/** GET — 연결 시험. 아무것도 저장하지 않는다. */
export async function GET(req: NextRequest) {
  const denied = checkKey(req);
  if (denied) return denied;

  return NextResponse.json({
    ok: true,
    ready: Boolean(process.env.GITHUB_TOKEN),
    columns_count: getAllColumnsIncludingDrafts().length,
    storage: "markdown+github",
    ...(process.env.GITHUB_TOKEN
      ? {}
      : { warning: "GITHUB_TOKEN이 없어 글 저장은 아직 안 됩니다." }),
  });
}

/** POST — 칼럼 한 편 배달받아 저장 */
export async function POST(req: NextRequest) {
  const denied = checkKey(req);
  if (denied) return denied;

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "GITHUB_TOKEN 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const payload = (await req.json().catch(() => ({}))) as InboxBody;
  const title = payload.title?.trim();
  const body = payload.body?.trim();
  if (!title || !body) {
    return NextResponse.json(
      { ok: false, error: "title과 body는 반드시 있어야 합니다." },
      { status: 400 }
    );
  }

  const sourceId = payload.source_id?.trim();

  // 규칙 3 — 이미 배달된 글이면 건너뛴다 (이미 배포된 글들 기준 확인)
  if (sourceId) {
    const already = getAllColumnsIncludingDrafts().find((c) => c.sourceId === sourceId);
    if (already) {
      return NextResponse.json({
        ok: true,
        action: "skipped",
        reason: "이미 배달된 글입니다.",
        slug: already.slug,
      });
    }
  }

  const status =
    payload.status === "published" || payload.status === "private" ? payload.status : "draft";

  // 카테고리: 이 사이트는 한글 이름을 그대로 쓴다("다이어트"·"공진단"·"통증치료"…)
  const category = (payload.category_label || payload.category || "건강").trim();

  let filenames: string[];
  try {
    filenames = await listColumnFilenames(token);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
  const taken = new Set(filenames.map((f) => f.replace(/\.md$/, "")));

  // 주소용 이름 정하기
  let slug: string;
  if (payload.slug?.trim()) {
    slug = payload.slug.trim();
  } else {
    slug = slugify(title);
    // source_id가 있으면 꼬리표를 붙여, 재배포 전에 같은 글이 또 와도 알아볼 수 있게 한다
    if (sourceId) slug = `${slug}-${suffixFor(sourceId)}`;
  }

  // 규칙 3(보강) — 재배포 전이라 위 목록엔 없지만 깃허브엔 이미 있는 경우
  if (sourceId && taken.has(slug)) {
    return NextResponse.json({
      ok: true,
      action: "skipped",
      reason: "이미 배달된 글입니다.",
      slug,
    });
  }

  // 규칙 4 — 이름이 겹치면 뒤에 번호를 붙인다
  if (taken.has(slug)) {
    let n = 2;
    while (taken.has(`${slug}-${n}`)) n += 1;
    slug = `${slug}-${n}`;
  }

  const publishedDate = payload.published_date?.trim() || new Date().toISOString().slice(0, 10);

  // gray-matter가 따옴표·줄바꿈을 알아서 처리하므로 YAML을 손으로 짜지 않는다
  const fileContents = matter.stringify(body, {
    title,
    description: payload.summary?.trim() ?? "",
    date: publishedDate,
    category,
    status,
    ...(payload.image_url ? { image: payload.image_url } : {}),
    ...(payload.image_url ? { imageAlt: payload.image_alt?.trim() || title } : {}),
    delivered_by: "app",
    ...(sourceId ? { source_id: sourceId } : {}),
  });

  try {
    await createColumnFile(
      slug,
      fileContents,
      token,
      `feat(inbox): add column ${slug}${sourceId ? ` (source_id=${sourceId})` : ""}`
    );
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin
  ).replace(/\/$/, "");

  return NextResponse.json({
    ok: true,
    action: "created",
    id: slug,
    slug,
    status,
    url: `${siteUrl}/columns/${encodeURIComponent(slug)}`,
  });
}
