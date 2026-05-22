import fs from "fs";
import path from "path";

export type Video = {
  videoId: string;
  url: string;
  title: string;
  channel: "diet" | "gongjindan" | "pain";
  thumbnail: string;
};

const QUEUE_FILE = path.join(process.cwd(), "content", "youtube-queue.json");

type QueueEntry = { url?: string; videoId?: string; hint?: string; title?: string; slug?: string };
type QueueFile = { queue: QueueEntry[]; processed: QueueEntry[] };

function extractVideoId(input?: string): string | null {
  if (!input) return null;
  const m = input.match(/v=([\w-]{11})|youtu\.be\/([\w-]{11})|\/shorts\/([\w-]{11})/);
  if (m) return m[1] || m[2] || m[3];
  return null;
}

function detectChannel(hint?: string): Video["channel"] {
  if (!hint) return "diet";
  if (hint.includes("[gongjindan]") || /공진단/.test(hint)) return "gongjindan";
  if (hint.includes("[pain]") || /통증|허리|관절|어깨/.test(hint)) return "pain";
  return "diet";
}

function cleanTitle(hint?: string, fallback?: string): string {
  if (!hint) return fallback ?? "";
  return hint.replace(/^\[(diet|gongjindan|pain)\]\s*/i, "").trim();
}

export function getAllVideos(): Video[] {
  if (!fs.existsSync(QUEUE_FILE)) return [];
  const data = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf8")) as QueueFile;
  const all = [...data.processed, ...data.queue];
  const seen = new Set<string>();
  const videos: Video[] = [];
  for (const entry of all) {
    const id = extractVideoId(entry.url) ?? entry.videoId;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    videos.push({
      videoId: id,
      url: entry.url ?? `https://www.youtube.com/watch?v=${id}`,
      title: cleanTitle(entry.hint, entry.title),
      channel: detectChannel(entry.hint),
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    });
  }
  return videos;
}

export function getVideosByChannel(channel: Video["channel"], limit = 12): Video[] {
  return getAllVideos().filter((v) => v.channel === channel).slice(0, limit);
}
