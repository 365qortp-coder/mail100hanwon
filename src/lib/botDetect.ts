/**
 * User-Agent(방문자가 자기소개하는 문자열) 안에 AI 검색봇 이름이 있는지 확인합니다.
 * 여기 없는 새 봇이 나오면 이 목록에 한 줄만 추가하면 됩니다.
 */
const AI_BOT_SIGNATURES: { match: string; name: string }[] = [
  { match: "gptbot", name: "GPTBot (OpenAI)" },
  { match: "chatgpt-user", name: "ChatGPT-User (OpenAI)" },
  { match: "oai-searchbot", name: "OAI-SearchBot (OpenAI)" },
  { match: "claudebot", name: "ClaudeBot (Anthropic)" },
  { match: "claude-user", name: "Claude-User (Anthropic)" },
  { match: "claude-searchbot", name: "Claude-SearchBot (Anthropic)" },
  { match: "anthropic-ai", name: "Anthropic-AI" },
  { match: "perplexitybot", name: "PerplexityBot" },
  { match: "perplexity-user", name: "Perplexity-User" },
  { match: "google-extended", name: "Google-Extended (제미나이 학습용)" },
  { match: "bytespider", name: "Bytespider (바이트댄스)" },
  { match: "ccbot", name: "CCBot (Common Crawl)" },
  { match: "meta-externalagent", name: "Meta-ExternalAgent (메타 AI)" },
  { match: "applebot-extended", name: "Applebot-Extended (애플 AI)" },
  { match: "amazonbot", name: "Amazonbot" },
  { match: "diffbot", name: "Diffbot" },
  { match: "youbot", name: "YouBot" },
  { match: "cohere-ai", name: "Cohere-AI" },
];

export function detectAiBot(userAgent: string | null): string | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  const hit = AI_BOT_SIGNATURES.find((b) => ua.includes(b.match));
  return hit?.name ?? null;
}
