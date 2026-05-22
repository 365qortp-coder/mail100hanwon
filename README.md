# 매일백세한의원 공식 사이트

서울 중랑구 매일백세한의원의 SEO 최적화 공식 웹사이트.
Next.js 16 (App Router) + Tailwind 4 + TypeScript + Vercel 배포 구조.

## 기능

- 메인 / 원장소개 / 오시는 길 / 비용 안내
- 진료 안내: 매일감비환 다이어트 · 공진단 · 총명공진단 · 통증치료
- 지역 페이지 18개 (중랑구·노원·동대문·광진·성북·남양주·구리·의정부 등)
- 역세권 페이지 4개 (먹골·태릉입구·화랑대·상봉)
- 비대면 진료 안내
- 수능 총명공진단 시즌 페이지
- FAQ + 건강 칼럼 (자동 생성)
- Schema.org (MedicalBusiness/Person/MedicalTherapy/FAQPage/Article)
- llms.txt (AI 검색 노출용)
- sitemap.xml + robots.txt

## 디렉토리

```
src/
  app/          페이지
  components/   공통 UI
  data/         clinic / treatments / locations / pricing / faq
  lib/          seo / schema / columns
content/
  columns/      *.md (자동 생성된 칼럼)
  youtube-queue.json  변환 대기열
scripts/
  generate-column.mjs  유튜브 → 칼럼 변환
.github/workflows/
  daily-column.yml  매일 자동 칼럼 생성
  deploy.yml        빌드 체크
```

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # ANTHROPIC_API_KEY 등 입력
npm run dev
```

http://localhost:3000

## 칼럼 자동 생성

### 큐에 영상 추가

`content/youtube-queue.json` 의 `queue` 배열에 추가:

```json
{
  "queue": [
    { "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX" }
  ],
  "processed": []
}
```

### 수동 실행

```bash
npm run generate:column                       # 큐에서 다음 영상 처리
npm run generate:column -- <youtube-url>      # 특정 영상 처리
```

### 자동 실행 (GitHub Actions)

매일 KST 오전 7시 (UTC 22:00 전날) 자동 실행.

설정:
1. GitHub repo → Settings → Secrets and variables → Actions
2. New secret: `ANTHROPIC_API_KEY` = sk-ant-...

## 배포 (Vercel)

1. GitHub repo로 push
2. Vercel → Add New Project → GitHub repo 선택
3. Environment Variables에 추가:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_NAVER_VERIFICATION` (선택, 네이버 서치어드바이저 등록 후)
   - `NEXT_PUBLIC_GOOGLE_VERIFICATION` (선택, 구글 서치콘솔 등록 후)
4. Domain → mail100hanwon.co.kr 연결

## SEO 후속 작업 (사이트 배포 후)

1. **Google Search Console** 등록 → sitemap.xml 제출
2. **Naver Search Advisor** 등록 → sitemap.xml 제출
3. **Google Business Profile** 매일백세한의원 등록/최적화
4. **Naver Place** 매일백세한의원 등록/최적화
5. 의료광고 사전심의 확인 후 게시 콘텐츠 점검
