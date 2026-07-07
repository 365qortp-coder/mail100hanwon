import { NextRequest, NextResponse } from "next/server";

// 이 repo 고정값 (git remote: github.com/365qortp-coder/mail100hanwon)
const OWNER = "365qortp-coder";
const REPO = "mail100hanwon";
const BRANCH = "main";

function encodePath(filePath: string): string {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

async function githubDeleteFile(slug: string, token: string): Promise<void> {
  const filePath = `content/columns/${slug}.md`;
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodePath(filePath)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };

  const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, { headers, cache: "no-store" });
  if (!getRes.ok) {
    throw new Error(`파일을 찾을 수 없습니다 (HTTP ${getRes.status})`);
  }
  const { sha } = (await getRes.json()) as { sha: string };

  const delRes = await fetch(apiUrl, {
    method: "DELETE",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `chore(admin): delete column ${slug}`,
      sha,
      branch: BRANCH,
    }),
  });
  if (!delRes.ok) {
    const body = await delRes.text();
    throw new Error(`삭제 실패 (HTTP ${delRes.status}): ${body.slice(0, 200)}`);
  }
}

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN 환경변수가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  const { slugs } = (await req.json().catch(() => ({}))) as { slugs?: string[] };
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return NextResponse.json({ error: "삭제할 slug가 없습니다." }, { status: 400 });
  }

  // GitHub Contents API는 같은 브랜치에 동시 커밋 시 충돌 가능 — 순차 처리
  const results: { slug: string; ok: boolean; error?: string }[] = [];
  for (const slug of slugs) {
    try {
      await githubDeleteFile(slug, token);
      results.push({ slug, ok: true });
    } catch (e) {
      results.push({ slug, ok: false, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return NextResponse.json({ results });
}
