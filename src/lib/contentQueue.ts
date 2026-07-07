import fs from "fs";
import path from "path";

// 이 파일은 scripts/generate-column.mjs의 선정 로직(ANGLES id/name, isShorts,
// channelOf, pickWork)을 미리보기 전용으로 최소 복제한 것이다. 실제 발행 순서를
// 바꾸려면 반드시 저 스크립트도 같이 고쳐야 한다 — 이 파일은 읽기 전용 미리보기만
// 담당하고 큐 파일을 절대 쓰지 않는다.

const QUEUE_FILE = path.join(process.cwd(), "content", "youtube-queue.json");

export const ANGLE_NAMES: Record<string, string> = {
  intro: "기본 안내",
  usage: "복용·관리",
  comparison: "비교·차이",
  "for-who": "대상자·체질",
  "side-effects": "주의사항·부작용",
  cost: "비용·가격",
  process: "제조·과정",
  faq: "자주 묻는 질문",
  "keyword-seo": "키워드 SEO",
  "case-study": "복용 사례",
};
const ANGLE_IDS = Object.keys(ANGLE_NAMES);

type QueueEntry = {
  url?: string;
  hint?: string;
  videoId?: string;
  status?: string;
  angles?: { id: string }[];
};
type QueueFile = { queue: QueueEntry[]; processed: QueueEntry[] };

type Channel = "diet" | "gongjindan" | "pain" | "other";
const CHANNELS: Channel[] = ["diet", "gongjindan", "pain", "other"];

function readQueueFile(): QueueFile {
  if (!fs.existsSync(QUEUE_FILE)) return { queue: [], processed: [] };
  return JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8"));
}

function isShorts(entry: QueueEntry): boolean {
  const h = (entry.hint || "").toLowerCase();
  return h.includes("#shorts") || h.includes("shorts") || h.replace(/^\[.*?\]\s*/, "").length < 15;
}

function channelOf(entry: QueueEntry): Channel {
  const h = entry.hint || "";
  if (/\[gongjindan\]/i.test(h)) return "gongjindan";
  if (/\[pain\]/i.test(h)) return "pain";
  if (/\[diet\]/i.test(h)) return "diet";
  return "other";
}

export type QueueStats = {
  perChannel: Record<Channel, { queued: number; inProgress: number }>;
  exhausted: number;
  noTranscript: number;
  remainingSlots: number;
  estimatedWeeksRemaining: number;
};

export function getQueueStats(): QueueStats {
  const data = readQueueFile();
  const perChannel: QueueStats["perChannel"] = {
    diet: { queued: 0, inProgress: 0 },
    gongjindan: { queued: 0, inProgress: 0 },
    pain: { queued: 0, inProgress: 0 },
    other: { queued: 0, inProgress: 0 },
  };

  let remainingSlots = 0;
  let exhausted = 0;
  let noTranscript = 0;

  for (const entry of data.queue) {
    if (isShorts(entry)) continue;
    perChannel[channelOf(entry)].queued++;
    remainingSlots += ANGLE_IDS.length; // 새 영상, 각도 전부 미사용
  }

  for (const entry of data.processed) {
    if (entry.status === "no-transcript") {
      noTranscript++;
      continue;
    }
    if (isShorts(entry)) continue;
    const used = new Set((entry.angles || []).map((a) => a.id));
    const remaining = ANGLE_IDS.filter((id) => !used.has(id)).length;
    if (remaining === 0) {
      exhausted++;
      continue;
    }
    perChannel[channelOf(entry)].inProgress++;
    remainingSlots += remaining;
  }

  // 발행 주기: 주 2회 (daily-column.yml 기준)
  const estimatedWeeksRemaining = Math.round(remainingSlots / 2);

  return { perChannel, exhausted, noTranscript, remainingSlots, estimatedWeeksRemaining };
}

export type UpcomingItem = {
  hint: string;
  channel: Channel;
  angleId: string;
  angleName: string;
};

// scripts/generate-column.mjs의 pickWork()와 동일한 우선순위 규칙(읽기 전용 미리보기)
export function getUpcoming(n = 6): UpcomingItem[] {
  const data = readQueueFile();
  const buckets: Record<string, UpcomingItem[]> = {};
  const push = (ch: Channel, prio: number, item: UpcomingItem) => {
    const key = `${prio}:${ch}`;
    (buckets[key] ||= []).push(item);
  };

  for (const entry of data.queue) {
    if (isShorts(entry)) continue;
    const used = new Set((entry.angles || []).map((a) => a.id));
    const nextAngle = ANGLE_IDS.find((id) => !used.has(id));
    if (nextAngle) {
      push(channelOf(entry), 0, {
        hint: entry.hint || entry.url || "(제목 없음)",
        channel: channelOf(entry),
        angleId: nextAngle,
        angleName: ANGLE_NAMES[nextAngle],
      });
    }
  }
  for (const entry of data.processed) {
    if (entry.status === "no-transcript" || isShorts(entry)) continue;
    const used = new Set((entry.angles || []).map((a) => a.id));
    for (const angleId of ANGLE_IDS.filter((id) => !used.has(id))) {
      push(channelOf(entry), 1, {
        hint: entry.hint || entry.url || "(제목 없음)",
        channel: channelOf(entry),
        angleId,
        angleName: ANGLE_NAMES[angleId],
      });
    }
  }

  const result: UpcomingItem[] = [];
  for (const prio of [0, 1]) {
    let progress = true;
    while (result.length < n && progress) {
      progress = false;
      for (const ch of CHANNELS) {
        if (result.length >= n) break;
        const bucket = buckets[`${prio}:${ch}`];
        if (bucket && bucket.length > 0) {
          result.push(bucket.shift()!);
          progress = true;
        }
      }
    }
    if (result.length >= n) break;
  }
  return result;
}
