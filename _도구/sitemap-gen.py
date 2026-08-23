# -*- coding: utf-8 -*-
"""
sitemap.xml · robots.txt 만들기 — 손으로 만든 HTML 사이트용.

왜 필요한가
  ① sitemap.xml = "우리 사이트에 이런 페이지들이 있습니다" 라고 건네는 목록.
     이게 없으면 검색사·AI가 페이지를 하나씩 우연히 발견해야 한다.
  ② robots.txt = 봇에게 주는 안내문. 여기에 **네이버 봇(Yeti)** 과 **AI 봇**을
     허용한다고 적어둔다. 사람이 매번 기억할 필요 없게 이 도구가 자동으로 넣는다.

  Next.js 같은 도구는 이걸 자동으로 만들어 주지만, 손으로 만든 HTML은 아무도 안 만들어 준다.

실행
  python sitemap-gen.py <사이트폴더> --url https://내주소.co.kr
  python sitemap-gen.py <사이트폴더> --url https://... --dry        만들지 말고 미리보기만
  python sitemap-gen.py <사이트폴더> --url https://... --pages a.html,b.html
  python sitemap-gen.py <사이트폴더> --url https://... --no-robots  sitemap만
  python sitemap-gen.py <사이트폴더> --url https://... --naver <소유확인코드>

이미 있는 파일은 덮어쓰기 전에 `.bak` 으로 백업한다.
"""
import io, os, re, sys, glob, time, shutil, fnmatch

# 봇 이름 — 최종 확인 2026-08-08. 새 AI 회사가 생기면 여기에 추가한다.
NAVER = ["Yeti", "NaverBot"]                      # 네이버 (한의원은 여기가 본진)
SEARCH = ["Googlebot", "Googlebot-Image", "Bingbot", "Daum", "Daumoa"]
AI = ["GPTBot", "OAI-SearchBot", "ChatGPT-User",   # 오픈AI
      "PerplexityBot", "Perplexity-User",          # 퍼플렉시티
      "ClaudeBot", "Claude-Web", "Claude-SearchBot", "anthropic-ai",  # 클로드
      "Google-Extended",                           # 제미나이 학습·인용
      "Applebot", "Applebot-Extended",             # 애플
      "Bytespider", "meta-externalagent", "CCBot"]  # 기타
BLOCK_PATHS = ["/admin", "/_", "/api/"]           # 색인시키면 안 되는 곳

COMMENT = re.compile(r"\s#(?![0-9A-Fa-f]{3,8}\b)")


def read_spec(site):
    spec, path = {}, os.path.join(site, "BRAND-SPEC.md")
    if not os.path.exists(path):
        return spec
    m = re.search(r"```설정\s*\n(.*?)```", io.open(path, encoding="utf-8").read(), re.S)
    if not m:
        return spec
    for line in m.group(1).splitlines():
        line = COMMENT.split(line)[0].strip()
        if "=" in line:
            k, v = line.split("=", 1)
            spec[k.strip()] = [x.strip() for x in v.split(",") if x.strip()]
    return spec


def pick_pages(site, spec):
    """규격서의 검사대상·제외를 그대로 따른다. 미리보기·시험용 파일은 기본 제외."""
    pats = [p for p in spec.get("검사대상", []) if p.endswith(".html")] or ["*.html"]
    skips = list(spec.get("제외", [])) + ["_*", "*preview*", "*test*", "*샘플*", "*.bak.html"]
    out = []
    for p in pats:
        for f in glob.glob(os.path.join(site, p)):
            name = os.path.basename(f)
            if any(fnmatch.fnmatch(name, s) for s in skips):
                continue
            out.append(name)
    return sorted(set(out))


def noindex(site, page):
    """meta robots에 noindex가 있는 페이지는 목록에 넣으면 안 된다(모순 신호)."""
    text = io.open(os.path.join(site, page), encoding="utf-8", errors="replace").read()
    m = re.search(r'<meta[^>]+name\s*=\s*["\']?robots["\']?[^>]*>', text, re.I)
    return bool(m and "noindex" in m.group(0).lower())


def url_of(base, page):
    return base + "/" if page.lower() in ("index.html", "home.html") else base + "/" + page


def backup(path):
    if os.path.exists(path):
        shutil.copy(path, path + ".bak")
        return True
    return False


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    site = os.path.abspath(sys.argv[1])
    args = sys.argv[2:]
    def opt(name, default=None):
        return args[args.index(name) + 1] if name in args else default

    base = opt("--url")
    if not base:
        sys.exit("사이트 주소가 필요합니다.\n  예) python sitemap-gen.py %s --url https://내주소.co.kr\n"
                 "  (아직 도메인이 없으면 배포 후 정해진 주소로 다시 돌리세요)" % site)
    base = base.rstrip("/")
    if not base.startswith("http"):
        sys.exit("주소는 https:// 로 시작해야 합니다: %s" % base)

    spec = read_spec(site)
    pages = opt("--pages")
    pages = [p.strip() for p in pages.split(",")] if pages else pick_pages(site, spec)
    if not pages:
        sys.exit("넣을 페이지가 없습니다: %s" % site)

    skipped = [p for p in pages if noindex(site, p)]
    pages = [p for p in pages if p not in skipped]

    # ── sitemap.xml ────────────────────────────────────────────
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for p in pages:
        mtime = time.strftime("%Y-%m-%d", time.localtime(os.path.getmtime(os.path.join(site, p))))
        pri = "1.0" if p.lower() in ("index.html", "home.html") else "0.8"
        lines += ["  <url>",
                  "    <loc>%s</loc>" % url_of(base, p),
                  "    <lastmod>%s</lastmod>" % mtime,
                  "    <changefreq>monthly</changefreq>",
                  "    <priority>%s</priority>" % pri,
                  "  </url>"]
    lines.append("</urlset>")
    sitemap = "\n".join(lines) + "\n"

    # ── robots.txt ─────────────────────────────────────────────
    def block(names, note):
        s = "# %s\n" % note
        for n in names:
            s += "User-agent: %s\n" % n
        s += "Allow: /\n"
        for b in BLOCK_PATHS:
            s += "Disallow: %s\n" % b
        return s + "\n"

    robots = "# 봇 안내문 — sitemap-gen.py 가 만듦 (기준 2026-08-08)\n"
    robots += "# 봇 이름은 바뀐다. 새 AI가 나오면 이 파일을 다시 만들 것.\n\n"
    robots += block(["*"], "기본 — 아래에 없는 봇 전부")
    robots += block(NAVER, "네이버 — 한의원 환자의 주 유입 경로")
    robots += block(SEARCH, "검색엔진")
    robots += block(AI, "AI 답변 엔진 (GEO) — 여기를 막으면 AI가 우리를 인용할 수 없다")
    robots += "Sitemap: %s/sitemap.xml\n" % base
    robots += "Host: %s\n" % base.split("//")[-1]

    # ── 쓰기 ───────────────────────────────────────────────────
    print("sitemap · robots 만들기 — %s" % site)
    print("주소 %s · 페이지 %d장" % (base, len(pages)))
    for p in pages:
        print("   %s" % url_of(base, p))
    if skipped:
        print("   (제외: noindex가 켜진 %d장 — %s)" % (len(skipped), ", ".join(skipped[:4])))

    naver_code = opt("--naver")
    if naver_code:
        print("\n네이버 소유확인 코드가 주어졌습니다. 아래 한 줄을 모든 페이지 <head> 안에 넣으세요:")
        print('   <meta name="naver-site-verification" content="%s" />' % naver_code)

    if "--dry" in args:
        print("\n[미리보기] --dry 라서 파일을 만들지 않았습니다.\n")
        print("─ sitemap.xml ─\n%s" % sitemap[:600])
        print("─ robots.txt ─\n%s" % robots)
        return

    sp = os.path.join(site, "sitemap.xml")
    if backup(sp):
        print("\n기존 sitemap.xml → sitemap.xml.bak 로 백업")
    io.open(sp, "w", encoding="utf-8").write(sitemap)
    print("만듦: %s" % sp)

    if "--no-robots" not in args:
        rp = os.path.join(site, "robots.txt")
        if backup(rp):
            print("기존 robots.txt → robots.txt.bak 로 백업")
        io.open(rp, "w", encoding="utf-8").write(robots)
        print("만듦: %s" % rp)

    print("\n다음에 할 일 — 04-런칭-절차.md")
    print("  1) 배포한 뒤 %s/robots.txt 와 /sitemap.xml 이 실제로 열리는지 확인" % base)
    print("  2) 구글 서치콘솔 · 네이버 서치어드바이저에 사이트맵 제출")


if __name__ == "__main__":
    main()
