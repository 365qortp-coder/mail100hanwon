#!/usr/bin/env node
/**
 * Daily YouTube → Multi-angle Column Generator
 *
 * Each run picks up to COLUMNS_PER_RUN columns to generate. A video is
 * processed multiple times across the ANGLES array — each angle is a
 * different search intent (효능·복용법·비교·대상자·주의사항·비용·제조과정·FAQ),
 * producing distinct SEO columns from the same transcript. The first
 * non-exhausted video in the queue is used; if its remaining angles
 * don't fill the run, the next video is opened in the same execution.
 *
 * Tracking:
 *   queue.queue       — videos with no angle done yet
 *   queue.processed   — entry shape: { url, hint, videoId, angles: [{ id, slug, title, at }] }
 *                        - when angles.length >= ANGLES.length the entry is exhausted
 *                        - status: "no-transcript" entries are skipped
 *
 * Usage:
 *   node scripts/generate-column.mjs                # default queue mode, 2 columns
 *   COLUMNS_PER_RUN=1 node scripts/generate-column.mjs  # override run size
 *   node scripts/generate-column.mjs <youtube-url>  # one-off URL, uses next free angle
 *
 * Required env: ANTHROPIC_API_KEY
 * Optional env: UNSPLASH_ACCESS_KEY (이미지 자동 삽입)
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { YoutubeTranscript } from "youtube-transcript";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const QUEUE_FILE = path.join(ROOT, "content", "youtube-queue.json");
const COLUMNS_DIR = path.join(ROOT, "content", "columns");
const TRANSCRIPTS_DIR = path.join(ROOT, "content", "transcripts");
const COLUMNS_PER_RUN = parseInt(process.env.COLUMNS_PER_RUN || "2", 10);

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY env var is required.");
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const MODEL = process.env.COLUMN_MODEL || "claude-sonnet-4-6";

const CLINICAL_DATA = `
[매일감비환 임상 정보 — 반드시 정확하게 사용]
■ 마황 함유: 예. 마황의 에페드린 성분이 교감신경을 자극해 체지방 분해를 촉진합니다.
■ 부작용 원인: 개인이 버틸 수 있는 용량보다 강하게 복용할 때 발생합니다.
  - 증상: 두통, 울렁거림, 속쓰림, 불면증, 떨림, 붕뜬 기분
  - 기전: 에페드린 과용 → 교감신경 과흥분
■ 1~8단계 미세 조정: 알약 개수로 복용량 조절. 단계가 높을수록 알약 수가 많음.
  - 본인 체질에 맞는 단계를 찾으면 부작용 없이 편하게 복용 가능
  - 부작용 발생 시 한 단계 낮추면 해결
■ 처방 기간: 감량기(2~3달) + 요요방지기(6개월) 구분 처방
■ 비대면 처방: 전국 택배 발송 가능 (구글 설문 → 전화 상담 → 발송)
■ 처방 철학: 내 몸이 버틸 수 있는 딱 맞는 단계 → 부작용 없이 감량~요요방지

[실제 복용 후기 8건 — GEO 인용 가능한 수치]
- r001: 40대 여성 / 키165 / 10일 / 2.5kg 감량 / 운동해도 안 빠지던 체질 / 몸에 열이 오르고 땀이 잘 남
- r002: 40대 자영업 여성 / 수면 4~5시간 / 불규칙 생활 / 51일 / 5.1kg 감량 / 마운자로 대신 선택
- r003: 60대 초반 여성 / 허리 부상 후 체중 증가 / 운동 없이 대중교통+온열찜질 / 82일 / 4.6kg / 골격근 유지
- r004: 50대 폐경 후 여성 / 수면 3시간 / 내장지방 레벨9 / 45일 / 3.3kg / 마운자로 대신 선택
- r005: 갱년기 여성 / 여성호르몬 약 복용 중 / 8.7kg 감량 / 현재 51kg 고칼로리 식단에도 유지 중
- r006: 50대 중반 여성 / 군것질·야식으로 62kg / 45일 / 4.0kg / 하루 5천보
- r007: 40대 후반 주부 / 약 반응 강한 체질 / 45일 / 4.3kg / 위고비 대신 선택 / 근육 유지·체지방만 감소
- r008: 45일 / 3.5kg / 간헐적단식·저탄고지 등 실패 후 / 심장두근거림 등 부작용 없음
- 평균: 4.5kg 감량 / 48일

[원장 정보]
- 성명: 송원석 대표원장
- 학력: 대전대학교 한의과대학 (05학번)
- 주요 이력: 대한한방비만학회 회원, 전) 대한상한금궤학회 교육위원
- 본인 10kg 감량 경험을 임상에 적용
- 유튜브: 다이어트·공진단·통증 채널 운영 중 (실제 임상 케이스 공개)
`;

const SYSTEM_PROMPT = `당신은 매일백세한의원(서울 중랑구 공릉로 21, 송원석 원장)의 SEO/GEO 콘텐츠 작가입니다.

매일백세한의원이 운영하는 유튜브 채널의 영상 자막을 받아, 한방 의료 정보 칼럼으로 가공합니다. 같은 영상을 여러 검색 의도에 맞춰 다른 각도의 칼럼으로 발행하는 시스템이며, 매 요청마다 한 각도에 대한 칼럼 한 편을 작성합니다.

${CLINICAL_DATA}

[작성 조건 — 모든 칼럼 공통]
- 한국어 자연스러운 문어체 (~합니다 어조)
- 2000자 ~ 3000자 분량
- 검색 의도에 맞는 H2(##), H3(###) 헤딩 5~7개 포함
- 매일감비환·공진단·총명공진단·통증치료·비대면 진료 키워드 자연스럽게 포함 (해당 주제에 한해)
- 각 H2 첫 문장은 핵심 결론을 먼저 제시 (두괄식)
- 비교·나열은 표(|) 또는 불릿 리스트로 구성
- 본문 말미에 FAQ 섹션 포함: 자주 묻는 질문 3개 이상 (Q: / A: 형식, 각 답변은 두괄식 2~3문장)
- 외부 근거나 수치를 1개 이상 포함 (한의학 연구, 식약처 기준, 임상 통계 등)
- 실제 후기 수치(평균 48일 4.5kg 등)를 자연스럽게 1회 이상 인용
- 본문 마지막에 한 줄 안내: "자세한 상담은 매일백세한의원(02-2234-0102) 또는 카카오톡 채널을 이용해 주세요."
- 마황 관련 설명 시: 반드시 위 [임상 정보]의 내용을 정확히 사용 (마황 함유 사실, 1~8단계 조정 방식)

[출력 형식 — 반드시 JSON 한 개의 객체로만 응답하세요. 다른 텍스트 금지]
{
  "title": "60자 이내 SEO 친화 제목 (이번 각도에 맞춰 차별화)",
  "description": "150~160자 메타 설명",
  "category": "다이어트 | 공진단 | 총명공진단 | 통증치료 | 비대면 진료 | 한방건강 중 가장 적절한 1개",
  "keywords": ["키워드1", "키워드2", "..."],
  "body_markdown": "## 시작\\n\\n본문 markdown..."
}`;

// 가격 데이터 — cost 각도 instruction에 주입
const PRICE_TABLE_DIET = `
[다이어트 한약 — 매일감비환 가격표]
| 플랜 | 구성 | 가격 |
|------|------|------|
| 1달 감량 | 감비환 5통 | 110,000원 |
| 2달 감량 | 감비환 10통 | 179,000원 |
| 3달 감량 | 감비환 15통 | 259,000원 |
| 2달 감량 + 6개월 요요방지 | 감비환 20통 | 339,000원 |
| 3달 감량 + 6개월 요요방지 | 감비환 30통 | 479,000원 |

재진(재구매) 전용:
| 구성 | 가격 |
|------|------|
| 감비환 40통 + 보너스 8통 | 660,000원 |
| 감비환 60통 + 보너스 12통 | 936,000원 |
| 감비환 80통 + 보너스 16통 | 1,152,000원 |`;

const PRICE_TABLE_GONGJINDAN = `
[사향공진단 가격표] — 사향+녹용+당귀+산수유+꿀, 1구당 100mg 정품 사향
| 수량 | 가격 | 구당 단가 |
|------|------|---------|
| 30구 | 1,350,000원 | 45,000원 |
| 60구 | 2,400,000원 | 40,000원 |
| 100구 | 3,500,000원 | 35,000원 |
※ 처방 동시 조제, 1주~10일 소요

[녹용2배 공진단 가격표] — 녹용 2배+목향+산수유+당귀+꿀
| 수량 | 가격 | 구당 단가 |
|------|------|---------|
| 30구 | 420,000원 | 14,000원 |
| 60구 | 660,000원 | 11,000원 |
| 120구 | 1,200,000원 | 10,000원 |
※ 진료 후 바로 처방 가능

[총명공진단 가격표] — 녹용2배+원지+석창포+목향+산수유+당귀+꿀
| 수량 | 가격 | 구당 단가 |
|------|------|---------|
| 30구 | 450,000원 | 15,000원 |
| 60구 | 810,000원 | 13,500원 |
| 90구 | 1,080,000원 | 12,000원 |
※ 진료 후 바로 처방 가능`;

const ANGLES = [
  {
    id: "intro",
    name: "기본 안내",
    intent: "처음 검색하는 분이 핵심 정보를 한 번에 파악할 수 있도록",
    keywords: ["이란", "기본 안내", "효능", "어떤 분에게"],
    instruction: "기본 안내와 적합 대상 중심. 처음 검색하는 사람을 위한 1차 소개 톤.",
  },
  {
    id: "usage",
    name: "복용·관리",
    intent: "이미 처방받기로 마음먹은 분이 복용 시기·방법·기간을 알고 싶을 때",
    keywords: ["복용 방법", "복용 시기", "복용 기간", "보관 방법"],
    instruction: "복용 방법·시기·기간·보관·생활 관리 중심. 실용적 가이드 톤.",
  },
  {
    id: "comparison",
    name: "비교·차이",
    intent: "유사 제품·치료법과 비교하고 싶을 때",
    keywords: ["차이", "vs", "어느 쪽", "선택"],
    instruction: "유사한 처방·치료법과의 차이점 비교. 사향공진단 vs 녹용공진단, 한약 다이어트 vs 일반 다이어트, 직접제조 vs 시판 같은 비교 각도. 비교 표 필수 포함.",
  },
  {
    id: "for-who",
    name: "대상자·체질",
    intent: "본인 케이스(나이·체질·증상)에 맞는지 확인하고 싶을 때",
    keywords: ["산후", "갱년기", "수험생", "직장인", "엄마", "30대", "40대", "50대"],
    instruction: "어떤 체질·연령·증상의 분께 적합한지 페르소나별로 정리. 산후엄마/갱년기/수험생/직장인 등 구체적 케이스 사용. 대상별 표 또는 불릿 정리.",
  },
  {
    id: "side-effects",
    name: "주의사항·부작용",
    intent: "복용 전 안전성·금기·주의점을 미리 확인하고 싶을 때",
    keywords: ["부작용", "주의사항", "금기", "복용 주의"],
    instruction: "복용 전 알아야 할 주의사항·금기·부작용 가능성 중심. 일반적 안내 톤.",
  },
  {
    id: "cost",
    name: "비용·가격",
    intent: "비용을 가늠하고 싶을 때",
    keywords: ["가격", "비용", "얼마", "비싼 이유"],
    instruction: `가격에 영향을 주는 요인(한약재 품질·처방 기간·체질 맞춤도) 설명 후, 본문에 아래 실제 가격표를 칼럼 주제에 맞는 것만 선택해 반드시 마크다운 표로 삽입. 가격표 없는 cost 글 작성 금지.

${PRICE_TABLE_DIET}

${PRICE_TABLE_GONGJINDAN}`,
  },
  {
    id: "process",
    name: "제조·과정",
    intent: "한약재·제조 과정의 차이를 알고 싶을 때",
    keywords: ["직접 제조", "한약재", "사향", "녹용", "원지", "석창포", "정통"],
    instruction: "한약재 선별·원내 직접 제조 과정·인증 절차 중심. 매일백세한의원이 직접 만드는 차별점 강조.",
  },
  {
    id: "faq",
    name: "자주 묻는 질문",
    intent: "구체적 궁금증(부작용·기간·체질·가격)을 한 번에 해소하고 싶을 때",
    keywords: ["자주 묻는 질문", "FAQ", "궁금한 점", "Q&A"],
    instruction: `FAQ 형식으로 작성. 영상 주제와 관련해 실제 환자가 많이 묻는 질문 7~10개.

형식:
## 자주 묻는 질문

### Q. 질문 내용?
A. 핵심 답변 먼저 (두괄식). 2~4문장.

아래 유형을 반드시 커버:
- 가격·비용 (해당 제품 실제 가격 포함 — 다이어트: 감비환 11만원~, 공진단: 녹용2배 30구 42만원~, 사향 30구 135만원~, 총명 30구 45만원~)
- 복용 기간
- 체질·금기 (이런 분은 주의)
- 다른 약·영양제와 함께 복용 가능한가
- 효과 나타나는 시점
- 비대면(온라인) 처방 가능 여부
- 재구매 조건·혜택

각 Q는 검색자가 직접 입력할 말투로. A는 두괄식 직접 답변.`,
  },
  {
    id: "keyword-seo",
    name: "키워드 SEO",
    intent: "특정 검색어로 유입된 사람이 원하는 답을 직접 얻고 싶을 때",
    keywords: ["검색어 직접 타겟", "롱테일", "PAA", "기초대사량", "갱년기", "부작용"],
    instruction: `영상 자막에서 가장 검색량이 많을 핵심 질문/키워드 하나를 선택해 그 키워드 전용 칼럼을 작성합니다.

[선택 기준 — 우선순위 높은 키워드]
기초대사량 낮으면, 여자 기초대사량 평균, 기초대사량 높이는 법, 갱년기 살찌는 이유,
50대 여성 다이어트 방법, 갱년기 다이어트, 폐경기 뱃살, 감비환 부작용, 감비환 효과,
감비환 복용법, 감비환 성분, 마황 부작용, 다이어트 한약 추천

[구조]
1. 제목: 타겟 키워드를 제목 앞에 배치 (검색자가 입력하는 말투)
   예) "기초대사량 낮으면 나타나는 증상 5가지", "갱년기 살찌는 이유 — 호르몬만의 문제가 아닙니다"
2. 첫 단락: 핵심 답변 먼저 (두괄식, 3문장 이내로 요점 전달)
3. 본문: 질문-답변 구조 (PAA 형식 — 사람들이 이어서 검색하는 질문들)
4. 매일감비환 연결: 자연스럽게 1~2회 언급 (억지 광고 X)
5. 임상 데이터: 후기 수치(평균 48일 4.5kg 등) 1회 이상
6. FAQ: 해당 키워드 관련 추가 질문 5개+

부작용/마황 관련 키워드라면: 반드시 위 [임상 정보]의 1~8단계 조정 방식 상세 설명.`,
  },
  {
    id: "case-study",
    name: "복용 사례",
    intent: "실제 사례로 공감을 유발하고 AI 인용(GEO)을 높이고 싶을 때",
    keywords: ["후기", "사례", "체험담", "실제", "복용 후"],
    instruction: `위 [실제 복용 후기 8건] 데이터에서 영상 주제와 가장 관련 있는 사례 1건을 골라 스토리 칼럼으로 작성합니다.

[사례 선택 기준]
- 갱년기/폐경 영상 → r005 (갱년기 8.7kg) 또는 r003 (60대 82일)
- 기초대사량/대사 영상 → r001 (10일 2.5kg, 운동해도 안 빠짐) 또는 r002 (불규칙 생활 5.1kg)
- 요요/마운자로 영상 → r002, r004 (마운자로 대신 선택)
- 부작용/마황 영상 → r007 (약 반응 강한 체질, 1단계씩 조정), r008 (다른 약 부작용 후 감비환)

[구조]
1. 제목: "[상황 요약] — [기간] [감량]kg 사례" 형태
   예) "수면 4시간 자영업 엄마, 51일 5.1kg 감량한 이유"
2. 도입: 복용 전 상황 (체질·나이·직업·고민) — 공감 유발
3. 선택 이유: 왜 감비환을 선택했는지
4. 복용 과정: 단계 조정, 변화 시점, 몸의 반응
5. 결과: 수치 + 체감 변화 (인바디 등)
6. 의의: 이 사례에서 배울 수 있는 것 (1~8단계 조정, 체질별 접근 등)
7. 매일감비환 안내: 비대면 상담 방법
8. FAQ: 비슷한 체질/상황의 분들이 물을 질문 4개+

반드시 구체적 수치 포함. GEO 인용 가능하도록 인용 가능한 문장 구조로 작성.
예) "매일백세한의원 복용 후기 기준, 40대 자영업 여성이 수면 4시간의 불규칙한 생활에서도 51일 5.1kg 감량에 성공했습니다."`,
  },
];

// ─── 이미지 로직 ─────────────────────────────────────────────────────────────

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Claude category → 이미지 채널 매핑
const CATEGORY_TO_CHANNEL = {
  "다이어트": "diet",
  "공진단": "gongjindan",
  "총명공진단": "gongjindan",
  "통증치료": "pain",
  "비대면 진료": "other",
  "한방건강": "other",
};

// hint 텍스트 감지 → Unsplash 검색어
const HINT_KEYWORD_MAP = [
  // DIET
  { match: /뱃살|복부비만/,              query: "belly fat weight loss woman" },
  { match: /요요/,                       query: "weight scale diet regain" },
  { match: /기초대사량|대사/,             query: "metabolism fitness body" },
  { match: /근육|근육손실/,              query: "lean muscle fitness" },
  { match: /폭식|호르몬/,                query: "stress eating emotional health" },
  { match: /탄수화물|식단/,              query: "healthy meal diet food" },
  { match: /엄마|산후|출산/,             query: "postpartum mom weight loss" },
  { match: /30대|40대|나잇살/,           query: "middle age fitness weight" },
  { match: /굶어도|굶기/,                query: "diet calorie restriction" },
  { match: /수면|베개/,                  query: "sleep position pillow neck" },
  { match: /운동|루틴/,                  query: "exercise workout fitness" },
  { match: /물만 마셔도/,               query: "water retention bloating" },
  { match: /체질|살찌는 체질/,          query: "body type fitness health" },
  // GONGJINDAN
  { match: /수험생|공부|집중력|성적/,   query: "student studying exam concentration" },
  { match: /면역|감기/,                 query: "immune system health vitamin" },
  { match: /녹용/,                      query: "deer antler velvet supplement" },
  { match: /어르신|노인|부모님/,        query: "senior elderly health energy" },
  { match: /간|해독/,                   query: "liver health detox" },
  { match: /뇌|치매|기억력/,            query: "brain health cognitive memory" },
  { match: /피로|기운|기력/,            query: "fatigue energy exhaustion" },
  { match: /체력|스태미너/,             query: "stamina vitality energy" },
  { match: /수술|회복/,                 query: "recovery health rehabilitation" },
  { match: /지팡이|보행/,               query: "elderly walking rehabilitation" },
  // PAIN
  { match: /두통|머리 아/,              query: "headache migraine pain" },
  { match: /뇌졸중|뇌/,                query: "brain neurology health" },
  { match: /허리|디스크/,              query: "back pain spine" },
  { match: /협착증/,                   query: "spinal stenosis back exercise" },
  { match: /거북목/,                   query: "neck pain posture" },
  { match: /승모근|어깨/,              query: "shoulder tension neck" },
  { match: /무릎/,                     query: "knee pain joint" },
  { match: /소화|위장/,               query: "digestive health stomach" },
];

// category × angle 기본 풀 (HINT_KEYWORD_MAP 미감지 시 fallback)
const IMAGE_FALLBACK = {
  diet: {
    intro:          ["weight loss journey woman", "diet healthy lifestyle", "slim fitness woman"],
    usage:          ["herbal supplement morning routine", "daily health pill", "taking medicine"],
    comparison:     ["healthy food choice nutrition", "diet plan balance"],
    "for-who":      ["woman fitness postpartum", "office worker healthy", "middle age health"],
    "side-effects": ["diet fatigue nutrition", "body balance health"],
    cost:           ["wellness investment supplement", "healthy choice budget"],
    process:        ["weight loss transformation progress", "fitness body change"],
    faq:            ["diet question healthy guide", "weight loss advice"],
  },
  gongjindan: {
    intro:          ["herbal medicine traditional", "oriental supplement capsule", "herbal remedy"],
    usage:          ["taking supplement pill morning", "health routine daily"],
    comparison:     ["supplement comparison choice", "herbal medicine variety"],
    "for-who":      ["senior health elderly energy", "student studying focus", "man vitality"],
    "side-effects": ["medicine caution health balance"],
    cost:           ["premium supplement wellness", "health investment"],
    process:        ["traditional medicine preparation", "herbal remedy making"],
    faq:            ["supplement question health guide"],
  },
  pain: {
    intro:          ["back pain relief", "headache migraine", "body pain"],
    usage:          ["physical therapy treatment", "pain management stretching"],
    comparison:     ["pain treatment option health"],
    "for-who":      ["office worker back pain", "elderly joint health", "neck pain person"],
    "side-effects": ["chronic pain inflammation"],
    cost:           ["medical treatment healthcare"],
    process:        ["rehabilitation exercise recovery"],
    faq:            ["pain relief question health"],
  },
  other: {
    intro:          ["traditional medicine wellness", "herbal health natural"],
    usage:          ["health routine supplement daily"],
    comparison:     ["natural medicine choice health"],
    "for-who":      ["family health preventive care"],
    "side-effects": ["natural health caution"],
    cost:           ["healthcare investment wellness"],
    process:        ["health journey natural"],
    faq:            ["health question wellness guide"],
  },
};

// photos 폴더 fallback (Unsplash 실패 시)
const PHOTO_FALLBACK = {
  diet:       "/photos/diet-product.webp",
  gongjindan: "/photos/gongjindan-hero.webp",
  총명공진단: "/photos/chongmyeong-product.webp",
  pain:       "/photos/pain.webp",
  other:      "/photos/clinic-exterior.webp",
};

async function fetchUnsplashImage(query) {
  if (!UNSPLASH_KEY) return null;
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape&content_filter=high`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    if (!res.ok) {
      console.warn(`  unsplash ${res.status}: ${await res.text().catch(() => "")}`);
      return null;
    }
    const data = await res.json();
    const results = data.results || [];
    if (!results.length) return null;
    const pick = results[Math.floor(Math.random() * Math.min(5, results.length))];
    return {
      url: pick.urls.regular,
      alt: pick.alt_description || query,
      credit: `Photo by ${pick.user.name} on Unsplash`,
    };
  } catch (err) {
    console.warn(`  unsplash fetch error: ${err.message}`);
    return null;
  }
}

function pickImageQuery(channel, angleId, hint) {
  for (const { match, query } of HINT_KEYWORD_MAP) {
    if (match.test(hint || "")) return query;
  }
  const cat = IMAGE_FALLBACK[channel] || IMAGE_FALLBACK.other;
  const pool = cat[angleId] || cat.intro;
  return pool[Math.floor(Math.random() * pool.length)];
}

async function resolveImage(videoId, angleId, category, hint) {
  // intro 각도 → YouTube 썸네일 (영상당 대표 이미지 1개)
  if (angleId === "intro") {
    return {
      url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      alt: `${hint || "매일백세한의원"} 관련 영상 썸네일`,
      credit: null,
    };
  }

  const channel = CATEGORY_TO_CHANNEL[category] || "other";
  const query = pickImageQuery(channel, angleId, hint);
  console.log(`  image query: "${query}"`);

  const img = await fetchUnsplashImage(query);
  if (img) return img;

  // Unsplash 실패 → photos 폴더 fallback
  const fallbackUrl = PHOTO_FALLBACK[category] || PHOTO_FALLBACK[channel] || PHOTO_FALLBACK.other;
  return { url: fallbackUrl, alt: hint || "매일백세한의원", credit: null };
}

// ─── 유틸 ────────────────────────────────────────────────────────────────────

function extractVideoId(input) {
  if (!input) return null;
  const direct = input.match(/^[a-zA-Z0-9_-]{11}$/);
  if (direct) return input;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.slice(1);
    }
    const v = url.searchParams.get("v");
    if (v) return v;
    const shortsMatch = url.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];
  } catch {}
  return null;
}

function readQueue() {
  if (!fs.existsSync(QUEUE_FILE)) return { queue: [], processed: [] };
  return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
}

function writeQueue(data) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function slugFromTitle(title, videoId, angleId) {
  const base = title
    .toLowerCase()
    .replace(/[^\w\s가-힣ㄱ-ㅎㅏ-ㅣ-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
  return `${base || "column"}-${angleId}-${videoId.slice(0, 6)}`;
}

async function fetchTranscript(videoId) {
  const cacheFile = path.join(TRANSCRIPTS_DIR, `${videoId}.txt`);
  if (fs.existsSync(cacheFile)) {
    return fs.readFileSync(cacheFile, "utf8");
  }
  for (const opts of [{ lang: "ko" }, { lang: "en" }, {}]) {
    try {
      const items = await YoutubeTranscript.fetchTranscript(videoId, opts);
      if (items && items.length) {
        const text = items.map((i) => i.text).join(" ");
        fs.mkdirSync(TRANSCRIPTS_DIR, { recursive: true });
        fs.writeFileSync(cacheFile, text, "utf8");
        return text;
      }
    } catch (err) {
      console.warn(`  transcript fail (${opts.lang || "default"}): ${err.message}`);
    }
  }
  return null;
}

// ─── 칼럼 생성 ───────────────────────────────────────────────────────────────

async function generateColumn({ videoId, transcript, videoUrl, angle, hint }) {
  const today = new Date().toISOString().slice(0, 10);

  const userPrompt = `[이번 칼럼의 각도]
- 각도: ${angle.name}
- 검색 의도: ${angle.intent}
- 강조할 키워드 풀: ${angle.keywords.join(", ")}
- 작성 지침: ${angle.instruction}

[영상 자막]
${transcript.slice(0, 12000)}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 4000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "60자 이내 SEO 친화 제목" },
            description: { type: "string", description: "150~160자 메타 설명" },
            category: {
              type: "string",
              enum: ["다이어트", "공진단", "총명공진단", "통증치료", "비대면 진료", "한방건강"],
            },
            keywords: { type: "array", items: { type: "string" } },
            body_markdown: { type: "string", description: "markdown 본문" },
          },
          required: ["title", "description", "category", "keywords", "body_markdown"],
          additionalProperties: false,
        },
      },
    },
    messages: [{ role: "user", content: userPrompt }],
  });

  const u = response.usage;
  console.log(
    `  usage: in=${u.input_tokens} out=${u.output_tokens}` +
      ` cache_write=${u.cache_creation_input_tokens ?? 0}` +
      ` cache_read=${u.cache_read_input_tokens ?? 0}`,
  );

  const text = response.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");
  const parsed = JSON.parse(text);

  const slug = slugFromTitle(parsed.title, videoId, angle.id);
  const filePath = path.join(COLUMNS_DIR, `${slug}.md`);

  // 이미지 결정
  const img = await resolveImage(videoId, angle.id, parsed.category, hint);

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(parsed.title)}`,
    `description: ${JSON.stringify(parsed.description)}`,
    `date: "${today}"`,
    `category: ${JSON.stringify(parsed.category || "한방건강")}`,
    "keywords:",
    ...(parsed.keywords || []).map((k) => `  - ${JSON.stringify(k)}`),
    `image: ${JSON.stringify(img.url)}`,
    `imageAlt: ${JSON.stringify(img.alt)}`,
    ...(img.credit ? [`imageCredit: ${JSON.stringify(img.credit)}`] : []),
    "source:",
    "  type: youtube",
    `  url: ${JSON.stringify(videoUrl)}`,
    `  videoId: ${JSON.stringify(videoId)}`,
    `  angle: ${JSON.stringify(angle.id)}`,
    "---",
    "",
  ].join("\n");

  const body = parsed.body_markdown.trim() + "\n";

  fs.mkdirSync(COLUMNS_DIR, { recursive: true });
  fs.writeFileSync(filePath, frontmatter + body, "utf8");

  return { slug, filePath, title: parsed.title };
}

// ─── 큐 처리 ─────────────────────────────────────────────────────────────────

function isShorts(entry) {
  const h = (entry.hint || "").toLowerCase();
  // 제목에 shorts 키워드 포함되거나 제목 자체가 너무 짧은 영상 제외
  return h.includes("#shorts") || h.includes("shorts") || h.replace(/^\[.*?\]\s*/, "").length < 15;
}

function channelOf(entry) {
  const h = entry.hint || "";
  if (/\[gongjindan\]/i.test(h)) return "gongjindan";
  if (/\[pain\]/i.test(h)) return "pain";
  if (/\[diet\]/i.test(h)) return "diet";
  return "other";
}

function pickWork(queue, n) {
  const buckets = {};
  const push = (ch, prio, item) => {
    const key = `${prio}:${ch}`;
    (buckets[key] ||= []).push(item);
  };

  for (const entry of queue.queue) {
    if (isShorts(entry)) continue;
    const id = extractVideoId(entry.url || entry.videoId);
    if (!id) continue;
    const used = new Set((entry.angles || []).map((a) => a.id));
    const next = ANGLES.find((a) => !used.has(a.id));
    if (next) push(channelOf(entry), 0, { source: "queue", entry, videoId: id, angle: next });
  }
  for (const entry of queue.processed) {
    if (entry.status === "no-transcript") continue;
    if (isShorts(entry)) continue;
    const id = entry.videoId || extractVideoId(entry.url);
    if (!id) continue;
    const used = new Set((entry.angles || []).map((a) => a.id));
    for (const angle of ANGLES.filter((a) => !used.has(a.id))) {
      push(channelOf(entry), 1, { source: "processed", entry, videoId: id, angle });
    }
  }

  const channels = ["diet", "gongjindan", "pain", "other"];
  const work = [];
  for (const prio of [0, 1]) {
    let progress = true;
    while (work.length < n && progress) {
      progress = false;
      for (const ch of channels) {
        if (work.length >= n) break;
        const bucket = buckets[`${prio}:${ch}`];
        if (bucket && bucket.length > 0) {
          work.push(bucket.shift());
          progress = true;
        }
      }
    }
    if (work.length >= n) break;
  }
  return work;
}

function markAngleUsed(entry, angle, result) {
  entry.angles = entry.angles || [];
  entry.angles.push({ id: angle.id, slug: result.slug, title: result.title, at: new Date().toISOString() });
}

function maybeMoveToProcessed(queue, entry) {
  const queueIdx = queue.queue.indexOf(entry);
  if (queueIdx >= 0) {
    queue.queue.splice(queueIdx, 1);
    queue.processed.push(entry);
  }
}

async function processWork(queue, item) {
  const { entry, videoId, angle } = item;
  console.log(`\n→ ${entry.hint || videoId} [${angle.id} · ${angle.name}]`);

  let transcript = entry._transcriptCache;
  if (!transcript) {
    transcript = await fetchTranscript(videoId);
    if (!transcript) {
      console.warn("  no transcript, marking entry skipped");
      entry.status = "no-transcript";
      entry.at = new Date().toISOString();
      maybeMoveToProcessed(queue, entry);
      return false;
    }
    entry._transcriptCache = transcript;
  }

  console.log(`  transcript ${transcript.length} chars · generating...`);
  const result = await generateColumn({
    videoId,
    transcript,
    videoUrl: entry.url || `https://www.youtube.com/watch?v=${videoId}`,
    angle,
    hint: entry.hint || "",
  });
  console.log(`  saved ${result.slug}`);

  if (!entry.videoId) entry.videoId = videoId;
  markAngleUsed(entry, angle, result);
  maybeMoveToProcessed(queue, entry);
  return true;
}

// ─── 진입점 ──────────────────────────────────────────────────────────────────

async function main() {
  const cliUrl = process.argv[2];
  const queue = readQueue();

  if (cliUrl) {
    const id = extractVideoId(cliUrl);
    if (!id) { console.error("Invalid YouTube URL/ID:", cliUrl); process.exit(1); }
    let entry =
      queue.queue.find((e) => extractVideoId(e.url) === id) ||
      queue.processed.find((e) => (e.videoId || extractVideoId(e.url)) === id);
    if (!entry) {
      entry = { url: cliUrl, videoId: id };
      queue.processed.push(entry);
    }
    const used = new Set((entry.angles || []).map((a) => a.id));
    const angle = ANGLES.find((a) => !used.has(a.id));
    if (!angle) { console.log("All angles already used for this video."); return; }
    await processWork(queue, { entry, videoId: id, angle });
    writeQueue(stripCache(queue));
    return;
  }

  const works = pickWork(queue, COLUMNS_PER_RUN);
  if (works.length === 0) {
    console.log("No work to do — queue empty and all processed entries exhausted.");
    return;
  }
  console.log(`Planned ${works.length}/${COLUMNS_PER_RUN} columns this run.`);

  let success = 0;
  for (const item of works) {
    try {
      const ok = await processWork(queue, item);
      if (ok) success++;
    } catch (err) {
      console.error(`  ✗ failed: ${err.message}`);
    }
  }
  writeQueue(stripCache(queue));
  console.log(`\nDone. ${success}/${works.length} columns published.`);
}

function stripCache(queue) {
  const clone = JSON.parse(JSON.stringify(queue, (k, v) => (k === "_transcriptCache" ? undefined : v)));
  return clone;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
