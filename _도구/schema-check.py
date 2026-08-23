# -*- coding: utf-8 -*-
"""
기계용 설명표(JSON-LD) 검사 — AI가 "이게 어느 한의원인지" 읽을 수 있는지 본다.

기계용 설명표란
  사람 눈에는 안 보이지만 페이지에 숨겨 넣는 설명표다.
  "이건 한의원이고 / 주소는 여기고 / 전화는 이 번호고 / 원장은 이 사람이다" 를
  기계가 헷갈리지 않게 적어둔 것. 이게 없으면 AI는 본문을 눈치로 읽어야 한다.

무엇을 보나
  ① 페이지 성격에 맞는 표가 있나   (홈=한의원 / 원장소개=한의사 / 자주묻는질문=FAQ …)
  ② 그 표에 꼭 있어야 할 칸이 찼나 (이름·주소·전화 …)
  ③ 있으면 좋은 칸이 찼나         (진료시간·지도좌표·네이버 플레이스 링크 …)
  ④ ★ 의료법에 걸릴 수 있는 칸이 켜져 있나  (후기·별점 — 점수는 오르지만 위험하다)
  ⑤ 상호·주소·전화가 페이지마다 다르지 않나 (다르면 신뢰가 깎이고 지역 검색에 나쁘다)

실행
  python schema-check.py <사이트폴더>
  python schema-check.py <사이트폴더> --type b          B형(랜딩 1장) 기준
  python schema-check.py <사이트폴더> --pages a.html
  python schema-check.py <사이트폴더> --json 결과.json
"""
import io, os, re, sys, glob, json, html, fnmatch, collections

CRIT, HIGH, MID, LAW = "치명", "높음", "중", "법위험"

# ── 유형별 규격 (한의원 기준) ──────────────────────────────────
# required 의 "a|b" 는 둘 중 하나만 있으면 통과
RULES = [
    (["MedicalClinic", "Hospital", "LocalBusiness", "MedicalBusiness", "Physician", "Dentist"],
     "한의원(장소)",
     ["name", "address", "telephone"],
     ["openingHoursSpecification", "geo", "url", "image", "medicalSpecialty",
      "areaServed", "sameAs", "priceRange", "@id"]),
    (["Person"], "사람(원장)",
     ["name"],
     ["jobTitle", "worksFor", "knowsAbout", "alumniOf", "image", "sameAs", "@id"]),
    (["MedicalProcedure", "MedicalTherapy", "Service"], "진료·시술",
     ["name"],
     ["provider", "description", "areaServed", "bodyLocation", "howPerformed"]),
    (["FAQPage"], "자주 묻는 질문", ["mainEntity"], []),
    (["BlogPosting", "Article", "MedicalWebPage", "NewsArticle"], "글(칼럼)",
     ["headline", "datePublished", "author"],
     ["dateModified", "publisher", "image", "description", "mainEntityOfPage"]),
    (["WebSite"], "사이트", ["name", "url"], ["publisher", "inLanguage"]),
    (["Organization"], "조직", ["name", "url"], ["logo", "sameAs", "address"]),
    (["BreadcrumbList"], "위치 표시(빵부스러기)", ["itemListElement"], []),
    (["WebPage", "AboutPage", "ContactPage"], "페이지",
     ["name|headline"], ["description", "isPartOf", "inLanguage"]),
]

# 의료법에 걸릴 수 있는 칸 — 점수는 오르지만 쓰면 안 된다
LAW_RISK = {
    "aggregateRating": "별점 평균 — 환자 후기·평가를 광고에 쓰는 것으로 해석될 수 있다",
    "review": "후기 — 치료경험담 광고 금지에 정면으로 걸린다",
    "Review": "후기 — 치료경험담 광고 금지에 정면으로 걸린다",
    "ratingValue": "별점 — 위와 같음",
    "reviewBody": "후기 본문 — 위와 같음",
    "testimonial": "추천사 — 위와 같음",
    "Product": "한약·진료를 **상품**으로 표시 — 의료법보다 **약사법**(재고 보유·판매) 쪽 문제가 된다",
    "availability": "**재고 있음** 표시 — 한약을 쌓아두고 판다는 뜻이 된다. 사실과도 다를 수 있다(거짓 광고)",
    "seller": "**판매자** 표시 — 한의원은 판매자가 아니라 처방·조제 주체다. provider로 바꾼다",
    "Offer": "판매 조건(가격·재고) — 비급여 **고지**와 상품 **판매**는 다르다",
    "priceCurrency": "판매 가격 표기 — 가격은 별도 '비급여 진료비용 안내' 페이지로 뺀다",
}

# ── 설명표 안 문장 검사 ────────────────────────────────────────
# 왜 필요한가: 표의 **종류**가 안전해도 그 안의 **문장**이 위반일 수 있다.
# 특히 FAQ 답변은 AI가 가장 잘 집어가는 자리라 본문보다 위험하다.
# (2026-08-08 실사례: FAQPage는 '권장 항목'으로만 보고 답변 본문을 한 글자도 검사하지 않아
#  "8.7kg 감량한 사례", "부작용 없이 감량 가능", "재처방률 72%" 를 전부 통과시켰다.)
TEXT_RISK = [
    (r"\d+(?:\.\d+)?\s*(?:kg|킬로|킬로그램)", "체중·수치 변화 제시 — 치료경험담으로 읽힌다"),
    (r"(사례|후기|체험담|경험담|환자분(?:들)?(?:이|은|께서))", "치료경험담 인용 — 의료광고 금지 유형에 정면으로 걸린다"),
    (r"부작용\s*(?:이|은)?\s*(?:없|전혀)", "부작용 없음 단정 — 효과·안전성 보장 표현"),
    (r"(재처방률|성공률|만족도|완치율|치료율)", "성공률·재처방률 — 치료 효과의 증거로 제시하는 형태"),
    (r"\d+(?:\.\d+)?\s*%", "비율 수치 — 효과 제시로 읽힐 수 있다(사람이 판정)"),
    (r"(완치|반드시|보장|확실히|100\s*%|틀림없)", "효과 보장·단정 표현"),
    (r"(마운자로|위고비|삭센다|오젬픽|GLP-?1|프로포폴)", "전문의약품 실명 거론 — 약사법 별도 검토 필요"),
    (r"(식약처|FDA|보건복지부|정부)[^.]{0,8}(인증|승인|허가|지정)", "인증·보증 표방 — 실제 제도가 있는지 확인 필요"),
    (r"(최고|최상|유일|1위|국내\s*최|가장\s*(?:좋|빠른|효과))", "최상급·우월성 표현 — 객관적 근거 필요"),
    (r"(요요\s*(?:방지|없|차단)|재발\s*(?:방지|없))", "재발·요요 방지 단정 — 결과 보장 표현"),
]

# 검사할 텍스트 칸 — 기계가 읽어가는 문장은 전부 본다
TEXT_FIELDS = ("name", "description", "text", "headline", "slogan", "articleBody",
               "howPerformed", "preparation", "followup", "disambiguatingDescription")

LOC_TYPES = {"MedicalClinic", "Hospital", "LocalBusiness", "MedicalBusiness", "Dentist", "Physician"}

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


# ── 설명표 뽑아내기 ────────────────────────────────────────────
def entities_of(text):
    """페이지 안의 JSON-LD를 전부 평평하게 편다. @graph·배열·중첩 모두."""
    ents, errs = [], []
    for block in re.findall(
            r'<script[^>]+type\s*=\s*["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            text, re.S | re.I):
        raw = html.unescape(block).strip()
        try:
            data = json.loads(raw)
        except Exception as e:
            errs.append(str(e)[:60])
            continue

        def walk(node):
            if isinstance(node, list):
                for x in node:
                    walk(x)
            elif isinstance(node, dict):
                if "@graph" in node:
                    walk(node["@graph"])
                if "@type" in node:
                    ents.append(node)
                for v in node.values():          # 중첩된 표도 찾는다
                    if isinstance(v, (list, dict)):
                        walk(v)
        walk(data)
    # 같은 표가 중첩 때문에 두 번 잡히는 걸 막는다
    seen, uniq = set(), []
    for e in ents:
        key = json.dumps(e, sort_keys=True, ensure_ascii=False)[:400]
        if key not in seen:
            seen.add(key)
            uniq.append(e)
    return uniq, errs


def types_of(ent):
    t = ent.get("@type")
    return [t] if isinstance(t, str) else list(t or [])


def has(ent, field):
    for key in field.split("|"):
        v = ent.get(key)
        if v not in (None, "", [], {}):
            return True
    return False


def rule_for(ent):
    ts = set(types_of(ent))
    for match, label, req, rec in RULES:
        if ts & set(match):
            return label, req, rec
    return None, None, None


def law_risk(ent):
    """후기·별점·상품 계열이 켜져 있는지. 중첩된 것도 문자열로 훑어 찾는다."""
    blob = json.dumps(ent, ensure_ascii=False)
    hits = {k for k in LAW_RISK if re.search(r'"%s"' % k, blob)}
    # 값이 0원인 제공물은 판매가 아니다 (무료 계산기 등) — 판매 관련 지적을 뺀다
    if re.search(r'"price"\s*:\s*"?0"?[,}]', blob):
        hits -= {"Offer", "priceCurrency", "availability", "seller", "Product"}
    return sorted(hits)


def texts_of(ent):
    """이 표에서 기계가 읽어갈 문장들. 답변(acceptedAnswer)까지 반드시 포함한다."""
    out = []
    for k in TEXT_FIELDS:
        v = ent.get(k)
        if isinstance(v, str) and v.strip():
            out.append((k, v.strip()))
    ans = ent.get("acceptedAnswer")
    if isinstance(ans, dict) and isinstance(ans.get("text"), str):
        out.append(("acceptedAnswer.text", ans["text"].strip()))
    elif isinstance(ans, str):
        out.append(("acceptedAnswer", ans.strip()))
    return out


def claim_risk(ent):
    """설명표 **안의 문장**에 위반 소지가 있는지.
       표 종류가 안전해도 문장이 위험할 수 있다 — FAQ 답변이 대표적이다."""
    found = []
    for field, text in texts_of(ent):
        for pat, why in TEXT_RISK:
            m = re.search(pat, text)
            if m:
                snip = text[max(0, m.start() - 20):m.start() + 45].replace("\n", " ")
                found.append((field, why, "…%s…" % snip.strip()))
    # 같은 이유가 여러 번 나오면 하나로
    seen, uniq = set(), []
    for f, why, snip in found:
        if why in seen:
            continue
        seen.add(why)
        uniq.append((f, why, snip))
    return uniq


# ── 페이지 성격 추정 ───────────────────────────────────────────
def guess_kind(page, text):
    name = page.lower()
    body = text.lower()
    if name in ("index.html", "home.html") or name.endswith("landing.html"):
        return "홈"
    if any(k in name for k in ("doctor", "원장", "about", "brand", "profile")):
        return "원장소개"
    if any(k in name for k in ("faq", "qna", "질문")):
        return "자주묻는질문"
    if any(k in name for k in ("location", "map", "contact", "오시는", "booking", "reserv")):
        return "오시는길"
    if any(k in name for k in ("column", "blog", "post", "칼럼")):
        return "칼럼"
    if "<article" in body or "datepublished" in body:
        return "칼럼"
    return "일반"


EXPECT = {
    "홈": (LOC_TYPES, "한의원(MedicalClinic/LocalBusiness) 표"),
    "원장소개": ({"Person", "Physician"}, "원장(Person/Physician) 표"),
    "자주묻는질문": ({"FAQPage"}, "FAQPage 표"),
    "오시는길": (LOC_TYPES, "한의원(주소·전화) 표"),
    "칼럼": ({"BlogPosting", "Article", "MedicalWebPage", "NewsArticle"}, "글(BlogPosting) 표"),
}

RE_TEL = re.compile(r"\b0\d{1,2}[-.\s]?\d{3,4}[-.\s]?\d{4}\b")
RE_TAG = re.compile(r"<[^>]+>")
RE_SS = re.compile(r"<(script|style)\b[^>]*>.*?</\1>", re.S | re.I)


def q_headings(text):
    """물음표로 끝나는 소제목 개수 — FAQ 표를 넣을 만한 자리인지 본다."""
    n = 0
    for m in re.finditer(r"<h[2-4]\b[^>]*>(.*?)</h[2-4]>", text, re.S | re.I):
        t = re.sub(r"\s+", " ", RE_TAG.sub("", m.group(1))).strip()
        if t.endswith(("?", "나요", "까요", "은가요", "인가요")):
            n += 1
    return n


# ── 본체 ──────────────────────────────────────────────────────
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
    spec = read_spec(site)
    pages = opt("--pages")
    pages = [p.strip() for p in pages.split(",")] if pages else spec_pages(site, spec)
    if not pages:
        sys.exit("검사할 html이 없습니다: %s" % site)

    print("기계용 설명표(JSON-LD) 검사 — %s" % site)
    print("페이지 %d장 · %s형 기준\n" % (len(pages), form.upper()))

    rows, probs, naps, tels = [], [], collections.defaultdict(set), collections.Counter()

    for page in pages:
        text = io.open(os.path.join(site, page), encoding="utf-8", errors="replace").read()
        ents, errs = entities_of(text)
        kind = guess_kind(page, text)

        for e in errs:
            probs.append((CRIT, page, "표가 깨짐", "JSON 문법 오류로 기계가 못 읽는다 — %s" % e))

        got, req_ok, req_all, rec_ok, rec_all = [], 0, 0, 0, 0
        for ent in ents:
            label, req, rec = rule_for(ent)
            ts = "/".join(types_of(ent))
            got.append(ts)

            # 법 검사는 규격에 없는 표(Product 등)에도 반드시 돌린다.
            # 규격 밖이라고 건너뛰면 정작 제일 위험한 표를 놓친다.
            for k in law_risk(ent):
                probs.append((LAW, page, k, LAW_RISK[k]))
            for field, why, snip in claim_risk(ent):
                probs.append((LAW, page, "문구:%s" % field.split(".")[0][:12],
                              "%s  %s" % (why, snip)))

            if not label:
                continue
            miss_req = [f for f in req if not has(ent, f)]
            miss_rec = [f for f in rec if not has(ent, f)]
            req_all += len(req); req_ok += len(req) - len(miss_req)
            rec_all += len(rec); rec_ok += len(rec) - len(miss_rec)
            if miss_req:
                probs.append((HIGH, page, "%s 필수칸" % label,
                              "%s 표에 %s 없음 — 이게 없으면 표가 있으나 마나다"
                              % (ts, ", ".join(miss_req))))
            if miss_rec and label == "한의원(장소)":
                probs.append((MID, page, "한의원 권장칸",
                              "있으면 좋은 칸이 빔: %s" % ", ".join(miss_rec)))
            # 상호·주소·전화 모으기
            if set(types_of(ent)) & LOC_TYPES:
                if ent.get("name"):
                    naps["상호"].add(str(ent["name"]).strip())
                if ent.get("telephone"):
                    naps["전화"].add(str(ent["telephone"]).strip())
                ad = ent.get("address")
                if isinstance(ad, dict):
                    ad = " ".join(str(ad.get(k, "")) for k in
                                  ("addressRegion", "addressLocality", "streetAddress"))
                if ad:
                    naps["주소"].add(re.sub(r"\s+", " ", str(ad)).strip())

        # 페이지 성격에 맞는 표가 있나
        if kind in EXPECT:
            want, label = EXPECT[kind]
            if not any(set(t.split("/")) & want for t in got):
                lv = HIGH if kind in ("홈", "칼럼") else MID
                probs.append((lv, page, "%s 표 없음" % kind, "%s가 필요하다" % label))

        # FAQ 기회
        qn = q_headings(text)
        if qn >= 3 and not any("FAQPage" in t for t in got):
            probs.append((MID, page, "FAQ 기회",
                          "질문형 소제목이 %d개인데 FAQPage 표가 없다 — AI가 그대로 인용할 자리를 놓치고 있다" % qn))

        # 본문 전화번호 (스키마 밖 표기까지 일치하는지)
        body = RE_TAG.sub(" ", RE_SS.sub(" ", text))
        for t in RE_TEL.findall(body):
            tels[re.sub(r"[^\d]", "", t)] += 1

        score = 0
        if req_all or rec_all:
            score = round((req_ok / max(req_all, 1)) * 70 + (rec_ok / max(rec_all, 1)) * 30)
        rows.append((page, kind, len(ents), ", ".join(sorted(set(got)))[:40], score))

    # 같은 문장이 여러 표에 중첩돼 있으면(질문 표 안의 답변 표 등) 한 번만 센다
    seen_p, uniq_p = set(), []
    for p in probs:
        key = (p[0], p[1], p[3][:70])
        if key in seen_p:
            continue
        seen_p.add(key)
        uniq_p.append(p)
    probs = uniq_p

    # 표
    print("%-34s %-10s %4s %6s   %s" % ("페이지", "성격", "표수", "점수", "들어있는 표"))
    print("-" * 104)
    for page, kind, n, got, score in rows:
        print("%-34s %-10s %4d %5d점   %s" % (page[:34], kind, n, score, got or "—"))

    # 상호·주소·전화 일관성
    print("\n── 상호·주소·전화 일치 ────────────────────────────────")
    for key in ("상호", "주소", "전화"):
        vals = naps.get(key, set())
        if not vals:
            print("   %s: 설명표에 없음" % key)
        elif len(vals) > 1:
            print("   %s: ★ 페이지마다 다름 → %s" % (key, " / ".join(list(vals)[:4])))
            probs.append((HIGH, "(사이트)", "%s 불일치" % key,
                          "설명표의 %s가 여러 가지다 — 네이버 플레이스를 원본으로 삼아 하나로 맞춘다" % key))
        else:
            print("   %s: %s" % (key, list(vals)[0]))
    if len(tels) > 1:
        top = ", ".join("%s(%d곳)" % (t, n) for t, n in tels.most_common(4))
        print("   본문에 적힌 전화번호가 여러 개: %s" % top)
        probs.append((MID, "(사이트)", "본문 전화 불일치",
                      "화면에 보이는 전화번호가 여러 개다 — 옛 번호가 남아 있는지 확인"))

    # 등급별 상세
    limit = 10 ** 9 if "--all" in args else 12
    for lv in (CRIT, LAW, HIGH, MID):
        rs = [p for p in probs if p[0] == lv]
        if not rs:
            continue
        head = "★ 의료법 위험" if lv == LAW else lv
        print("\n── %s %d건 ──────────────────────────────" % (head, len(rs)))
        if lv == LAW:
            print("   점수는 오르지만 쓰면 안 되는 칸이다. 지우고, 대신 05-의료법-충돌.md 의 대체안을 쓴다.")
        for _, page, item, why in rs[:limit]:
            print("   %-34s %-16s %s" % (page[:34], item, why))
        if len(rs) > limit:
            print("   … 그 외 %d건 (--all 로 전체)" % (len(rs) - limit))

    c = collections.Counter(p[0] for p in probs)
    print("\n합계 — 치명 %d · 법위험 %d · 높음 %d · 중 %d"
          % (c[CRIT], c[LAW], c[HIGH], c[MID]))
    if c[LAW]:
        print("★ 법위험이 있으면 점수보다 그걸 먼저 지운다. 최종 판정은 medical-ad-review.")

    if "--json" in args:
        out = opt("--json")
        io.open(out, "w", encoding="utf-8").write(json.dumps(
            {"사이트": site,
             "페이지": [{"페이지": a, "성격": b, "표수": c_, "표": d, "점수": e} for a, b, c_, d, e in rows],
             "문제": [{"등급": a, "페이지": b, "항목": c_, "설명": d} for a, b, c_, d in probs]},
            ensure_ascii=False, indent=1))
        print("JSON 저장: %s" % out)


if __name__ == "__main__":
    main()
