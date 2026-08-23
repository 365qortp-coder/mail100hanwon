# -*- coding: utf-8 -*-
"""
SEO·GEO 검사 — 만드는 중에, 배포하기 전에 돌린다.

왜 필요한가
  기존 진단기(geo-check)는 **인터넷에 올라간 주소**만 볼 수 있다.
  그래서 배포하고 나서야 빠뜨린 걸 알게 된다. 이 도구는 **내 컴퓨터 폴더**를 그대로 검사한다.

무엇을 보나 (등급: 치명 > 높음 > 중)
  페이지마다
    치명  모바일 설정(viewport) 없음 · 검색 금지(noindex)가 켜져 있음 · 제목(title) 없음
    높음  설명(description) 없음 · 대표주소(canonical) 없음 · 기계용 설명표(JSON-LD) 없음
          · 큰제목(H1) 없음 · 깨진 링크
    중    제목·설명 길이 · OG(공유 미리보기) · 이미지 대체글(alt) 빠짐 · 언어 표시(lang)
          · 글자수 부족 · 다른 페이지로 가는 링크 없음
  폴더 전체
    치명  robots.txt가 AI 봇이나 검색 봇을 막고 있음
    높음  robots.txt 없음 · sitemap.xml 없음 · **네이버 봇(Yeti) 허용이 없음**
    중    네이버·구글 소유확인 표시 없음

실행
  python seocheck.py <사이트폴더>                 A형(여러 장짜리 홈페이지) 기준
  python seocheck.py <사이트폴더> --type b        B형(랜딩 1장) 기준 — 링크·글자수 기준 완화
  python seocheck.py <사이트폴더> --pages a.html,b.html
  python seocheck.py <사이트폴더> --all           전체 목록 (기본은 항목당 12개)
  python seocheck.py <사이트폴더> --json 결과.json
  python seocheck.py <사이트폴더> --no-schema     스키마 검사는 건너뛰기

검사가 끝나면 schema-check.py(기계용 설명표 검사)를 이어서 돌린다.
"""
import io, os, re, sys, glob, json, html, fnmatch, subprocess, collections

HERE = os.path.dirname(os.path.abspath(__file__))

# 등급 — 숫자가 작을수록 급하다
CRIT, HIGH, MID = "치명", "높음", "중"

# 네이버·구글·AI 봇 이름 (2026-08-08 확인)
NAVER_BOTS = ["Yeti", "NaverBot"]
AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot",
           "ClaudeBot", "Claude-Web", "Anthropic-AI", "Google-Extended",
           "Applebot-Extended", "CCBot", "Bytespider", "meta-externalagent"]


# ── 규격서(BRAND-SPEC.md)의 검사대상·제외를 그대로 따른다 ──────────
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


def spec_pages(site, spec):
    pats = [p for p in spec.get("검사대상", []) if p.endswith(".html")] or ["*.html"]
    skips = spec.get("제외", [])
    out = []
    for p in pats:
        for f in glob.glob(os.path.join(site, p)):
            name = os.path.basename(f)
            if any(fnmatch.fnmatch(name, s) or fnmatch.fnmatch(p, s) for s in skips):
                continue
            out.append(name)
    return sorted(set(out))


# ── HTML에서 필요한 것만 꺼내기 ────────────────────────────────
RE_SCRIPT_STYLE = re.compile(r"<(script|style)\b[^>]*>.*?</\1>", re.S | re.I)
RE_TAG = re.compile(r"<[^>]+>")
RE_COMMENT_HTML = re.compile(r"<!--.*?-->", re.S)


def attr(tag, name):
    """태그 문자열에서 속성 값 하나. 따옴표 있든 없든."""
    m = re.search(r'%s\s*=\s*"([^"]*)"' % name, tag, re.I) \
        or re.search(r"%s\s*=\s*'([^']*)'" % name, tag, re.I) \
        or re.search(r"%s\s*=\s*([^\s>]+)" % name, tag, re.I)
    return html.unescape(m.group(1).strip()) if m else None


def meta_of(text, key, by="name"):
    for tag in re.findall(r"<meta\b[^>]*>", text, re.I):
        k = attr(tag, by)
        if k and k.lower() == key.lower():
            return attr(tag, "content") or ""
    return None


def visible_text(text):
    t = RE_COMMENT_HTML.sub(" ", text)
    t = RE_SCRIPT_STYLE.sub(" ", t)
    t = RE_TAG.sub(" ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def headings(text):
    return [(int(m.group(1)), visible_text(m.group(2))[:60])
            for m in re.finditer(r"<h([1-6])\b[^>]*>(.*?)</h\1>", text, re.S | re.I)]


# ── 페이지 한 장 검사 ──────────────────────────────────────────
def check_page(site, page, form):
    path = os.path.join(site, page)
    text = io.open(path, encoding="utf-8", errors="replace").read()
    bad = []                                   # (등급, 항목, 설명)
    def hit(level, item, why):
        bad.append((level, item, why))

    # 제목
    m = re.search(r"<title[^>]*>(.*?)</title>", text, re.S | re.I)
    title = visible_text(m.group(1)) if m else ""
    if not title:
        hit(CRIT, "제목없음", "<title>이 없다 — 검색 결과에 표시될 문구가 없다")
    else:
        n = len(title)
        if n < 12:
            hit(MID, "제목짧음", "%d자 — 15~35자 권장 (지역·증상·한의원명이 다 들어가야 한다)" % n)
        elif n > 45:
            hit(MID, "제목김", "%d자 — 검색 결과에서 뒤가 잘린다 (35자 안쪽 권장)" % n)

    # 설명
    desc = meta_of(text, "description")
    if not desc:
        hit(HIGH, "설명없음", "meta description 없음 — 검색 결과 밑에 붙는 소개문이 없다")
    else:
        n = len(desc)
        if n < 40:
            hit(MID, "설명짧음", "%d자 — 70~120자 권장" % n)
        elif n > 160:
            hit(MID, "설명김", "%d자 — 뒤가 잘린다 (120자 안쪽 권장)" % n)

    # 검색 금지가 켜져 있는지 (실수로 막아두는 사고가 잦다)
    robots_meta = (meta_of(text, "robots") or "").lower()
    if "noindex" in robots_meta:
        hit(CRIT, "검색금지", "meta robots에 noindex — 이 페이지는 검색에 절대 안 나온다")

    # 대표주소
    if not re.search(r'<link[^>]+rel\s*=\s*["\']?canonical', text, re.I):
        hit(HIGH, "대표주소없음", "canonical 없음 — 같은 내용이 여러 주소로 잡히면 서로 깎아먹는다")

    # 모바일·언어·문자셋
    if not meta_of(text, "viewport"):
        hit(CRIT, "모바일설정없음", "viewport 없음 — 휴대폰에서 PC 화면이 축소돼 나온다")
    if not re.search(r"<html[^>]+lang\s*=", text, re.I):
        hit(MID, "언어표시없음", '<html lang="ko"> 없음')
    if not re.search(r'charset\s*=\s*["\']?utf-8', text, re.I):
        hit(MID, "문자셋없음", "UTF-8 선언 없음 — 한글이 깨질 수 있다")

    # 공유 미리보기
    for og in ("og:title", "og:image"):
        if meta_of(text, og, by="property") is None and meta_of(text, og) is None:
            hit(MID, "OG없음", "%s 없음 — 카톡·SNS에 링크를 붙이면 밋밋하게 나온다" % og)

    # 큰제목
    hs = headings(text)
    h1 = [h for h in hs if h[0] == 1]
    if not h1:
        hit(HIGH, "H1없음", "큰제목(H1) 없음 — 이 페이지의 주제를 기계가 못 잡는다")
    elif len(h1) > 1:
        hit(MID, "H1여러개", "H1이 %d개 — 주제가 하나여야 한다" % len(h1))
    # 계층 건너뜀 (h2 없이 h3)
    levels = [h[0] for h in hs]
    for i in range(1, len(levels)):
        if levels[i] - levels[i - 1] >= 2:
            hit(MID, "제목계층", "H%d 다음에 H%d — 단계를 건너뛰었다" % (levels[i - 1], levels[i]))
            break

    # 기계용 설명표
    ld = re.findall(r'<script[^>]+type\s*=\s*["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                    text, re.S | re.I)
    if not ld:
        hit(HIGH, "설명표없음", "JSON-LD 없음 — AI가 '이게 한의원이고 주소가 여기'인 걸 못 읽는다")

    # 이미지 대체글
    imgs = re.findall(r"<img\b[^>]*>", text, re.I)
    noalt = [t for t in imgs if attr(t, "alt") is None or attr(t, "alt") == ""]
    if noalt:
        hit(MID, "이미지대체글", "%d/%d장에 alt 없음 — 이미지 검색에 안 잡히고 접근성도 나쁘다"
            % (len(noalt), len(imgs)))

    # 링크
    hrefs = [attr(t, "href") or "" for t in re.findall(r"<a\b[^>]*>", text, re.I)]
    inner, broken, unknown = [], [], []
    for h in hrefs:
        if not h or h.startswith(("#", "mailto:", "tel:", "javascript:", "http://", "https://", "//")):
            continue
        inner.append(h)
        target = h.split("#")[0].split("?")[0]
        if not target:
            continue
        # `/diet` 처럼 슬래시로 시작하는 건 **서버 기준 경로**다.
        # 파일이 있나 없나로 판정하면 안 된다(배포하면 정상인데 깨졌다고 잡힌다).
        if target.startswith("/"):
            if not os.path.exists(os.path.join(site, target.lstrip("/").replace("/", os.sep))):
                unknown.append(h)
            continue
        if not os.path.exists(os.path.join(site, target.replace("/", os.sep))):
            broken.append(h)
    if broken:
        hit(HIGH, "깨진링크", "%d개 — %s" % (len(broken), ", ".join(broken[:3])))
    if unknown:
        hit(MID, "링크확인불가",
            "%d개가 서버 기준 경로(/…)라 파일로는 확인할 수 없다 — 배포 후 눌러서 확인" % len(unknown))
    if not inner and form == "a":
        hit(MID, "내부링크없음", "다른 페이지로 가는 링크가 없다 — 외딴 페이지가 되어 색인이 늦다")

    # 글자수
    body = visible_text(text)
    least = 300 if form == "b" else 600
    if len(body) < least:
        hit(MID, "글자부족", "본문 %d자 — %d자 이상 권장 (내용이 적으면 색인이 잘 안 붙는다)"
            % (len(body), least))

    return {
        "제목": title, "제목자수": len(title),
        "설명자수": len(desc) if desc else 0,
        "H1": len(h1), "이미지": len(imgs), "대체글없음": len(noalt),
        "내부링크": len(inner), "깨진링크": len(broken),
        "설명표": len(ld), "글자수": len(body),
        "문제": bad,
    }


# ── 폴더 전체 검사 (robots·sitemap·네이버) ─────────────────────
def check_site(site):
    bad = []
    def hit(level, item, why):
        bad.append((level, item, why))

    rp = os.path.join(site, "robots.txt")
    if not os.path.exists(rp):
        hit(HIGH, "robots.txt없음",
            "봇에게 주는 안내문이 없다 — sitemap 위치도 못 알린다 (sitemap-gen.py로 생성)")
        robots = ""
    else:
        robots = io.open(rp, encoding="utf-8", errors="replace").read()
        low = robots.lower()

        # 전체 차단
        for block in re.finditer(r"user-agent\s*:\s*\*(.*?)(?=user-agent\s*:|$)", low, re.S):
            if re.search(r"disallow\s*:\s*/\s*$", block.group(1), re.M):
                hit(CRIT, "전체차단", "robots.txt가 사이트 전체를 막고 있다 (Disallow: /)")
                break
        # 네이버
        if not any(b.lower() in low for b in NAVER_BOTS):
            hit(HIGH, "네이버봇없음",
                "Yeti(네이버 봇) 허용이 없다 — 한의원 환자는 네이버에서 온다")
        # AI 봇 차단
        blocked = []
        for m in re.finditer(r"user-agent\s*:\s*([^\n]+)(.*?)(?=user-agent\s*:|$)", low, re.S):
            name, block = m.group(1).strip(), m.group(2)
            if re.search(r"disallow\s*:\s*/\s*$", block, re.M):
                for b in AI_BOTS:
                    if b.lower() == name:
                        blocked.append(b)
        if blocked:
            hit(CRIT, "AI봇차단", "AI 봇을 막고 있다: %s — GEO가 원천 봉쇄된다" % ", ".join(blocked))
        if "sitemap:" not in low:
            hit(MID, "사이트맵안내없음", "robots.txt에 Sitemap: 줄이 없다")

    if not glob.glob(os.path.join(site, "sitemap*.xml")):
        hit(HIGH, "sitemap없음", "sitemap.xml 없음 — 어떤 페이지가 있는지 알릴 방법이 없다")

    # 소유확인 표시 (등록을 했다는 흔적)
    index = os.path.join(site, "index.html")
    head = io.open(index, encoding="utf-8", errors="replace").read() if os.path.exists(index) else ""
    if not meta_of(head, "naver-site-verification"):
        hit(MID, "네이버미등록",
            "네이버 소유확인 표시가 없다 — 서치어드바이저 등록을 아직 안 했을 가능성 (04-런칭-절차.md)")
    if not meta_of(head, "google-site-verification"):
        hit(MID, "구글확인표시없음",
            "구글 소유확인 표시가 없다 (DNS·파일 방식으로 했으면 없어도 정상)")
    return bad, robots


# ── 보고 ──────────────────────────────────────────────────────
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

    form = (opt("--type", "a") or "a").lower()
    limit = 10 ** 9 if "--all" in args else 12

    spec = read_spec(site)
    pages = opt("--pages")
    pages = [p.strip() for p in pages.split(",")] if pages else spec_pages(site, spec)
    if not pages:
        sys.exit("검사할 html이 없습니다: %s" % site)

    print("SEO·GEO 검사 — %s" % site)
    print("페이지 %d장 · %s형 기준\n" % (len(pages), form.upper()))

    rep, allbad = {}, []
    for page in pages:
        r = check_page(site, page, form)
        rep[page] = r
        for lv, item, why in r["문제"]:
            allbad.append((lv, page, item, why))

    # 페이지별 요약표
    print("%-38s %5s %5s %4s %6s %6s %6s   %s" %
          ("페이지", "제목", "설명", "H1", "설명표", "깨진", "글자", "치명/높음/중"))
    print("-" * 104)
    for page, r in rep.items():
        c = collections.Counter(lv for lv, _, _ in r["문제"])
        print("%-38s %5d %5d %4d %6d %6d %6d   %d / %d / %d" % (
            page[:38], r["제목자수"], r["설명자수"], r["H1"], r["설명표"],
            r["깨진링크"], r["글자수"], c[CRIT], c[HIGH], c[MID]))

    # 폴더 검사
    sitebad, _ = check_site(site)
    print("\n── 사이트 전체 (robots·sitemap·네이버) ────────────────────")
    if not sitebad:
        print("   문제 없음")
    for lv, item, why in sitebad:
        print("   [%s] %s — %s" % (lv, item, why))

    # 등급별 상세
    for lv in (CRIT, HIGH, MID):
        rows = [b for b in allbad if b[0] == lv]
        if not rows:
            continue
        kinds = collections.Counter(r[2] for r in rows)
        print("\n── %s %d건 ──────────────────────────────" % (lv, len(rows)))
        print("   종류: " + ", ".join("%s×%d" % (k, n) for k, n in kinds.most_common(10)))
        for _, page, item, why in rows[:limit]:
            print("   %-34s %-12s %s" % (page[:34], item, why))
        if len(rows) > limit:
            print("   … 그 외 %d건 (--all 로 전체)" % (len(rows) - limit))

    c = collections.Counter(b[0] for b in allbad) + collections.Counter(b[0] for b in sitebad)
    print("\n합계 — 치명 %d · 높음 %d · 중 %d" % (c[CRIT], c[HIGH], c[MID]))
    if c[CRIT]:
        print("★ 치명이 하나라도 있으면 배포하지 말 것. 그대로 올리면 검색에 아예 안 나온다.")

    if "--json" in args:
        out = opt("--json")
        io.open(out, "w", encoding="utf-8").write(json.dumps(
            {"사이트": site, "형": form,
             "페이지": {p: {k: v for k, v in r.items() if k != "문제"} for p, r in rep.items()},
             "문제": [{"등급": a, "페이지": b, "항목": c_, "설명": d} for a, b, c_, d in allbad],
             "사이트문제": [{"등급": a, "항목": b, "설명": c_} for a, b, c_ in sitebad]},
            ensure_ascii=False, indent=1))
        print("JSON 저장: %s" % out)

    # 스키마 검사 이어서
    if "--no-schema" not in args:
        print("\n" + "=" * 104)
        sys.stdout.flush()
        sc = os.path.join(HERE, "schema-check.py")
        cmd = [sys.executable, sc, site, "--type", form]
        if "--pages" in args:
            cmd += ["--pages", opt("--pages")]
        subprocess.run(cmd)


if __name__ == "__main__":
    main()
