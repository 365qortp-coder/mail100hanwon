# 배포 가이드 (사장님이 일어나신 후 따라하실 단계)

기준일: 2026-05-22
프로젝트 위치: `C:\claude\mail100hanwon`
로컬 커밋: 완료 (main 브랜치, 1개 커밋)
원격(remote): `https://github.com/365qortp-coder/mail100hanwon.git` 으로 미리 등록해뒀어요. (아직 GitHub에 repo 없음 — 아래 1단계 하시면 됩니다.)

---

## 1단계 · GitHub에 저장소 만들기 (2분)

1. https://github.com/new 접속
2. 다음과 같이 입력:
   - **Repository name**: `mail100hanwon`
   - **Description**: `매일백세한의원 공식 사이트` (선택)
   - **Public** 선택 (Vercel 무료 플랜에서 권장)
   - **README 추가 / .gitignore / license** 모두 체크 **해제** (이미 있음)
3. 초록색 `Create repository` 클릭

그리고 PowerShell 또는 Git Bash에서:

```powershell
cd C:\claude\mail100hanwon
git push -u origin main
```

푸시 중 로그인이 필요하면 GitHub 사용자명 + Personal Access Token (또는 OAuth) 입력.

---

## 2단계 · Vercel 연결 + 배포 (5분)

1. https://vercel.com/dashboard
2. `Add New...` → `Project`
3. `Import Git Repository` → `365qortp-coder/mail100hanwon` 선택 → `Import`
4. 설정은 모두 기본값 그대로:
   - Framework: Next.js (자동 인식)
   - Build Command: `next build`
   - Output: `.next`
5. **Environment Variables** 펼치기 → 다음 추가:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `ANTHROPIC_API_KEY` | (사장님이 받으신 sk-ant-... 키) | Production, Preview, Development |
   | `NEXT_PUBLIC_NAVER_VERIFICATION` | (비워두세요. 3단계 후 채움) | Production |
   | `NEXT_PUBLIC_GOOGLE_VERIFICATION` | (비워두세요. 3단계 후 채움) | Production |

6. `Deploy` 클릭

배포 완료되면 `xxxxx.vercel.app` 같은 임시 URL이 나옵니다. 미리 들어가서 확인.

---

## 3단계 · 도메인 mail100hanwon.co.kr 연결 (10분)

### Vercel 쪽 설정
1. Vercel 프로젝트 → `Settings` → `Domains`
2. `mail100hanwon.co.kr` 입력 → `Add`
3. Vercel이 알려주는 **A 레코드** 또는 **CNAME** 값 메모

### 가비아 쪽 설정
1. https://my.gabia.com → DNS 관리
2. mail100hanwon.co.kr 도메인 → DNS 정보 변경
3. Vercel이 알려준 값으로 A/CNAME 추가:
   - 일반적으로 `@` 호스트에 A 레코드 `76.76.21.21` 또는 Vercel이 제공한 IP
   - `www` 호스트에 CNAME `cname.vercel-dns.com.`
4. 저장

DNS 전파에 5분~24시간 걸립니다. 보통 30분 안에 됩니다.

---

## 4단계 · 검색엔진 등록 (각 10분)

### Google Search Console
1. https://search.google.com/search-console
2. `속성 추가` → `URL 접두어` → `https://mail100hanwon.co.kr`
3. 소유권 확인 → **HTML 태그** 방식 선택
4. `<meta name="google-site-verification" content="XXXX">` 의 `XXXX` 값 복사
5. Vercel → Settings → Environment Variables → `NEXT_PUBLIC_GOOGLE_VERIFICATION` 에 그 값 입력
6. Vercel 재배포 (자동)
7. Search Console에서 `확인` 클릭
8. 소유권 확인 후 → `Sitemaps` → `sitemap.xml` 제출

### Naver Search Advisor
1. https://searchadvisor.naver.com
2. `웹마스터 도구` → `사이트 등록` → `https://mail100hanwon.co.kr` 추가
3. 소유권 확인 → **HTML 태그** 방식
4. `<meta name="naver-site-verification" content="YYYY">` 의 `YYYY` 값을
   Vercel의 `NEXT_PUBLIC_NAVER_VERIFICATION` 에 입력 → 재배포
5. 소유권 확인 → `요청` → `사이트맵 제출` → `https://mail100hanwon.co.kr/sitemap.xml`
6. `요청` → `RSS 제출` (있다면)

---

## 5단계 · 자동 칼럼 활성화 (5분)

### GitHub Secrets 등록
1. https://github.com/365qortp-coder/mail100hanwon/settings/secrets/actions
2. `New repository secret`
3. Name: `ANTHROPIC_API_KEY`
4. Value: (사장님 API 키)
5. `Add secret`

### 변환할 유튜브 영상 큐 추가
`content/youtube-queue.json` 편집:

```json
{
  "queue": [
    { "url": "https://www.youtube.com/watch?v=영상ID1" },
    { "url": "https://www.youtube.com/watch?v=영상ID2" },
    { "url": "https://www.youtube.com/watch?v=영상ID3" }
  ],
  "processed": []
}
```

3개 채널의 좋은 영상 URL을 30~50개 정도 채워주시면, 매일 1편씩 한 달 이상 자동 칼럼 생성됩니다.

### 첫 실행 테스트 (선택)
GitHub repo → `Actions` 탭 → `Daily Column Generation` → `Run workflow` → `Run`
→ 1~2분 내 칼럼 1편이 자동 커밋 → Vercel 자동 배포

---

## 6단계 · 후속 SEO 작업

### 즉시
- [ ] Google Business Profile에 매일백세한의원 등록/최적화
- [ ] Naver Place에 매일백세한의원 등록 (또는 기존 정보 갱신)
- [ ] 유튜브 3채널 모두 채널 설명에 `https://mail100hanwon.co.kr` 추가

### 1주 내
- [ ] 카카오톡 채널 프로필에 사이트 링크 추가
- [ ] 인스타그램(있다면) 바이오에 사이트 링크 추가
- [ ] 기존 사이트(mail100diet.com 등)에서 새 사이트로 링크 연결

### 1개월 내
- [ ] 나무위키 "감비환" 항목 작성/보강 (자연스럽게)
- [ ] 네이버 지식iN 답변 시작 (의료인 인증)
- [ ] 헬스조선/코메디닷컴 등 의료매체 기고

---

## 운영 체크리스트

- 매일 자동 실행 시간: KST 오전 7시
- 칼럼 생성 비용: 영상 1편당 약 100~300원 (Claude API)
- Vercel 무료 한도: 한의원급 트래픽 평생 충분

문제 발생 시:
- Actions 실패 → GitHub repo Actions 탭에서 로그 확인
- Vercel 빌드 실패 → Vercel Dashboard → Deployments → 로그 확인
- 사이트 안 보임 → DNS 전파 확인 (https://dnschecker.org)
