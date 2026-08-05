# 디자인 기준 (DESIGN BASELINE)

> **이 저장소의 디자인 기준은 `디자인리뉴얼\` 폴더다.**
> 디자인 수정 요청이 오면 무조건 `디자인리뉴얼\*.html`을 먼저 열어 해당 요소의 스타일을 확인하고, 그 스타일을 `src/`(Next.js 실사이트)에 적용한다.
> `디자인리뉴얼\`은 배포하지 않는다 — 디자인 원본(레퍼런스) 전용. (배포 규칙: git push → Vercel 자동빌드만, vercel CLI 금지)

## 역할 분담

| 폴더 | 역할 |
|---|---|
| `src/` | **실사이트** (mail100hanwon.co.kr) — 코드 수정은 여기, 배포는 git push |
| `디자인리뉴얼/` | **디자인 원본** — 색·카드·버튼·섹션 구조의 기준. 수정 대상 아님, 배포 금지 |

콘텐츠(칼럼·지역페이지·FAQ·데이터)는 실사이트 것이 기준이고, **디자인만** 리뉴얼을 따른다.

## 핵심 토큰 (디자인리뉴얼/index.html에서 추출)

### 색
- 배경 베이스: **화이트 `#ffffff`** (현행 src의 크림 `#FDFBF7` 전면 배경 ❌)
- 섹션 교차 배경: `#FAFAFA` / 아이보리 포인트 `#F5F2EC`, `#F8F6F2`
- 다크 섹션: `#0a0a0a` (STATS·대사량 훅·FINAL CTA·FOOTER)
- 브랜드: `#c0252d` / dark `#8c1820` / light `#fdecec`
- 본문 텍스트: `#525252`, 뉴트럴 eyebrow: `#8C8A87`
- 정보 카드 배경: `#F5F5F5`, 이미지 플레이스홀더: `#EBE7DF` · `#E8E3D9`
- 보더: `border-black/[0.07]` (카드) · `border-black/[0.05]` (섹션 구분)

### 타이포
- 본문 Pretendard, 헤드라인 **Noto Serif KR** (font-serif)
- eyebrow 패턴: `h-px w-6` 선 + `text-[11px] font-bold tracking-[0.2em] uppercase`
  - 히어로·다크 섹션 = 브랜드색, 일반 섹션 = `#8C8A87` + 선 `bg-black/20`
- H2: `font-serif text-3xl md:text-4xl tracking-[-0.025em]`

### 카드 (리뉴얼 스타일 — src의 "이중 베젤 프레임" ❌)
- `rounded-[22px] border border-black/[0.07] bg-white overflow-hidden`
- 호버: 떠오름 `translateY(-4px)` + `box-shadow 0 20px 60px rgba(0,0,0,0.08)` + 보더 진해짐
- 카드 내 이미지: 호버 시 `scale(1.05)` 줌 (0.8s)
- 공진단 카드는 다크 변형 (`bg-[#0a0a0a]` + 이미지 gradient 오버레이)

### 버튼
- 모두 `rounded-full`, primary는 브랜드색 + 호버 `translateY(-1px)` + 브랜드 그림자
- 카카오 `#FAE100`/`#3C1E1E`, 네이버 `#03C75A`, 고스트는 `border-black/[0.14]`
- 화살표 링크: `gap 0.4s` 트랜지션으로 호버 시 간격 벌어짐

### 모션
- reveal: `translateY(28px)` → 0, `0.75s cubic-bezier(0.16,1,0.3,1)`, 딜레이 계단식 (60~90ms)
- 전체 페이지에 grain 노이즈 오버레이 (opacity 0.025 SVG 터뷸런스)

### 레이아웃
- 컨테이너: `max-w-7xl px-5 md:px-8 lg:px-12`
- 섹션 패딩: `py-24 md:py-32` (스탯·지역 등 얇은 섹션은 `py-16 md:py-20`)
- 헤더: sticky, `h-14`, 이미지 로고(`/logo.png` h-9), 모바일은 하단에 가로 스크롤 pill 내비
- 모바일 하단 고정 CTA바 (전화·카톡·비대면)

### 아이콘
- 리뉴얼은 iconify(solar 세트) CDN 사용 → **Next.js에는 외부 스크립트 대신 동일 모양 인라인 SVG로 이식**

## 홈 섹션 순서 (리뉴얼 기준)

NAV → 01 HERO(화이트, 원장사진에 플로팅 이름배지+비대면 배지) → 02 STATS(다크) → 03 PRODUCTS(3카드, #FAFAFA) → **03B 기초대사량 훅(다크, 계산기 퍼널)** → 04 ABOUT(화이트) → 05 YOUTUBE → 06 PERSONAS(**아이보리** — 다크 ❌) → 07 COLUMNS → 08 LOCATIONS(#F5F2EC pill) → 09 FAQ → 10 FINAL CTA(다크) → FOOTER

## 확정 사항 (2026-08-05)

- 전화번호는 **0507-1467-0195** 하나만 쓴다 (리뉴얼 HTML의 02-2234-0102는 무시)
- 기초대사량 훅 섹션 + 계산기 페이지를 Next.js에 **이식한다**
- 적용 순서: 홈 먼저 배포·확인 → diet → gongjindan → nmc → about → columns
- 카피(문구)는 실사이트 현행 유지가 기본, 디자인 요소만 교체
