/**
 * 깃허브에 글 파일을 읽고 쓰는 도구.
 *
 * 왜 깃허브를 거치나: 이 사이트의 칼럼은 데이터베이스가 아니라 `content/columns/`
 * 안의 글 파일(.md)입니다. 그런데 Vercel에 올라간 사이트는 자기 파일을 고칠 수
 * 없습니다(읽기 전용). 그래서 글을 새로 만들 때는 깃허브에 커밋하고, 그 커밋이
 * 자동 배포를 일으켜 사이트에 반영되는 방식을 씁니다.
 * (기존 삭제 기능 `api/admin/columns/delete`도 같은 방식입니다.)
 */

const OWNER = "365qortp-coder";
const REPO = "mail100hanwon";
const BRANCH = "main";
const COLUMNS_DIR = "content/columns";

function encodePath(filePath: string): string {
  return filePath.split("/").map(encodeURIComponent).join("/");
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };
}

/**
 * content/columns 안의 파일 이름 목록을 깃허브에서 직접 가져온다.
 *
 * 로컬 파일 목록을 쓰지 않는 이유: 방금 배달한 글은 아직 재배포 전이라
 * 서버의 로컬 파일에는 없습니다. 깃허브를 봐야 "직전에 배달한 글"까지
 * 확인할 수 있어 같은 글이 두 번 저장되는 것을 막습니다.
 */
export async function listColumnFilenames(token: string): Promise<string[]> {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodePath(
    COLUMNS_DIR
  )}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: headers(token), cache: "no-store" });
  if (!res.ok) {
    throw new Error(`글 목록을 가져오지 못했습니다 (HTTP ${res.status})`);
  }
  const items = (await res.json()) as { name: string; type: string }[];
  return items.filter((i) => i.type === "file" && i.name.endsWith(".md")).map((i) => i.name);
}

/** 글 파일 하나를 새로 만든다. 이미 있으면 예외를 던진다(덮어쓰지 않음). */
export async function createColumnFile(
  slug: string,
  contents: string,
  token: string,
  commitMessage: string
): Promise<void> {
  const filePath = `${COLUMNS_DIR}/${slug}.md`;
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodePath(filePath)}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message: commitMessage,
      // Buffer는 서버에서만 동작 — 이 파일은 서버 전용(라우트 핸들러)에서만 쓰인다
      content: Buffer.from(contents, "utf8").toString("base64"),
      branch: BRANCH,
      // sha를 주지 않으면 "새로 만들기"만 됩니다. 이미 있으면 깃허브가 422로 거절 →
      // 실수로 기존 글을 덮어쓸 수 없습니다.
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`저장 실패 (HTTP ${res.status}): ${body.slice(0, 200)}`);
  }
}
