<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 디자인 기준

**디자인 수정은 반드시 [DESIGN-BASELINE.md](DESIGN-BASELINE.md)를 먼저 읽을 것.**
기준은 `디자인리뉴얼\` 폴더(레퍼런스 전용, 배포 금지)이고, 실제 수정·배포는 `src/`(Next.js, git push 자동배포)에서만 한다. `vercel` CLI 배포는 어떤 폴더에서도 금지.
