import { NextRequest, NextResponse } from "next/server";
import { getAllColumns, getColumnBody, getColumnImage, getColumnUrl } from "@/lib/columns";
import { clinic } from "@/data/clinic";

/**
 * 발행된 칼럼 내보내기 — 관리 앱이 "원장이 손으로 고친 최종본"을 읽어 가는 문.
 * 규격: `마케팅의 정석 홈페이지 CMS 연결 규격.md` 4장
 *
 * 초안·비공개는 나가지 않습니다. 공개 정보라 열쇠가 필요 없습니다.
 * (getAllColumns가 이미 발행된 글만 돌려주므로 여기서 또 거르지 않아도 됩니다.)
 */

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 200;
const MAX_LIMIT = 1000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const since = searchParams.get("since");
  const limitRaw = Number(searchParams.get("limit"));
  const limit =
    Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, MAX_LIMIT) : DEFAULT_LIMIT;

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || clinic.url || new URL(req.url).origin
  ).replace(/\/$/, "");

  const items = getAllColumns()
    .filter((c) => !since || c.date >= since)
    .slice(0, limit)
    .map((c) => ({
      id: c.slug,
      slug: c.slug,
      category: c.category,
      title: c.title,
      summary: c.description,
      body: getColumnBody(c.slug),
      image_url: getColumnImage(c) ?? null,
      image_alt: c.imageAlt ?? null,
      // 이 글이 어디서 왔는지 — 관리 앱이 배달한 글이면 "app", 사이트에서 직접 쓴 글이면 "site"
      source: c.deliveredBy === "app" ? "app" : "site",
      source_id: c.sourceId ?? null,
      published_date: c.date,
      updated_at: c.modified ?? c.date,
      url: `${siteUrl}${getColumnUrl(c)}`,
    }));

  return NextResponse.json({ ok: true, count: items.length, items });
}
