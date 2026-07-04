/**
 * MD 칼럼 파일 → 정적 HTML 페이지 일괄 생성
 * 출력: 디자인리뉴얼/columns/[slug]/index.html + 디자인리뉴얼/columns.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const COLUMNS_SRC = path.join(ROOT, 'content', 'columns');
const OUT_DIR = path.join(ROOT, '디자인리뉴얼', 'columns');

// ── frontmatter 파서 ──────────────────────────────────────────────
function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  const yaml = m[1];
  let body = m[2];

  // title / description / date / category / image / imageAlt
  for (const key of ['title', 'description', 'date', 'category', 'image', 'imageAlt']) {
    const r = yaml.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, 'm'));
    if (r) meta[key] = r[1].trim();
  }

  // keywords array
  const kw = [...yaml.matchAll(/^\s+-\s+"?([^"]+)"?/gm)].map(r => r[1].trim());
  if (kw.length) meta.keywords = kw;

  // videoId from source section
  const vid = yaml.match(/videoId:\s*"?([^"\n]+)"?/);
  if (vid) meta.videoId = vid[1].trim();

  return { meta, body: body.trim() };
}

// ── 간단한 Markdown → HTML ────────────────────────────────────────
function mdToHtml(md) {
  const lines = md.split('\n');
  const result = [];
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { result.push('</ul>'); inUl = false; }
    if (inOl) { result.push('</ol>'); inOl = false; }
  };

  const inline = (s) => s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (/^### /.test(line)) {
      closeList();
      result.push(`<h3>${inline(line.slice(4))}</h3>`);
    } else if (/^## /.test(line)) {
      closeList();
      result.push(`<h2>${inline(line.slice(3))}</h2>`);
    } else if (/^# /.test(line)) {
      closeList();
      result.push(`<h2>${inline(line.slice(2))}</h2>`);
    } else if (/^\d+\. /.test(line)) {
      if (!inOl) { result.push('<ol>'); inOl = true; }
      result.push(`<li>${inline(line.replace(/^\d+\. /, ''))}</li>`);
    } else if (/^[-*] /.test(line)) {
      if (!inUl) { result.push('<ul>'); inUl = true; }
      result.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (line.trim() === '') {
      closeList();
      result.push('');
    } else {
      closeList();
      result.push(`<p>${inline(line)}</p>`);
    }
    i++;
  }
  closeList();

  return result
    .join('\n')
    .replace(/(<\/p>)\n(<p>)/g, '$1\n$2')
    .replace(/\n{3,}/g, '\n\n');
}

// ── 공통 NAV HTML ─────────────────────────────────────────────────
function navHtml(depth = 1) {
  const root = depth === 1 ? '../' : '../../';
  const idx  = depth === 1 ? `${root}index.html` : `${root}index.html`;
  return `<header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-black/[0.06]">
  <div class="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 h-16 flex items-center justify-between gap-6">
    <a href="${idx}" class="shrink-0" aria-label="매일백세한의원 홈">
      <img src="${root}assets/logo.png" alt="매일백세한의원" class="h-9 w-auto" loading="eager">
    </a>
    <nav class="hidden lg:flex items-center gap-1">
      <a href="${root}diet.html"        class="px-3.5 py-2 text-sm text-[#525252] hover:text-[#0a0a0a] font-medium rounded-lg hover:bg-black/[0.04] transition-colors duration-200">매일감비환</a>
      <a href="${root}gongjindan.html"  class="px-3.5 py-2 text-sm text-[#525252] hover:text-[#0a0a0a] font-medium rounded-lg hover:bg-black/[0.04] transition-colors duration-200">공진단</a>
      <a href="${root}nmc.html"         class="px-3.5 py-2 text-sm text-[#525252] hover:text-[#0a0a0a] font-medium rounded-lg hover:bg-black/[0.04] transition-colors duration-200">무릎관절 NMC</a>
      <a href="${root}about.html"       class="px-3.5 py-2 text-sm text-[#525252] hover:text-[#0a0a0a] font-medium rounded-lg hover:bg-black/[0.04] transition-colors duration-200">원장 소개</a>
      <a href="${root}columns.html"     class="px-3.5 py-2 text-sm text-[#0a0a0a] font-semibold rounded-lg bg-black/[0.05] transition-colors duration-200">건강 칼럼</a>
    </nav>
    <div class="flex items-center gap-2 shrink-0">
      <a href="tel:0222340102" aria-label="전화 02-2234-0102"
         class="inline-flex lg:hidden items-center justify-center w-9 h-9 rounded-full bg-[#FFF4F0] text-[#C8392B] hover:bg-[#C8392B] hover:text-white transition-colors duration-200">
        <iconify-icon icon="solar:phone-linear" width="17"></iconify-icon>
      </a>
      <a href="tel:0222340102"
         class="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-[#C8392B] hover:bg-[#FFF4F0] rounded-lg transition-colors duration-200">
        02-2234-0102
      </a>
      <a href="https://pf.kakao.com/_JEzRK/chat" target="_blank" rel="noopener"
         class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-[#FAE100] text-[#3C1E1E] rounded-lg hover:brightness-95 transition-all duration-200">
        <iconify-icon icon="solar:chat-line-bold" width="15"></iconify-icon>
        <span class="hidden sm:inline">카톡 상담</span>
      </a>
    </div>
  </div>
  <div class="lg:hidden border-t border-black/[0.05] bg-white">
    <div class="flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide">
      <a href="${root}diet.html"       class="shrink-0 px-3 py-1.5 text-xs font-semibold text-[#525252] bg-[#F5F5F5] rounded-full border border-black/[0.07] whitespace-nowrap">매일감비환</a>
      <a href="${root}gongjindan.html" class="shrink-0 px-3 py-1.5 text-xs font-semibold text-[#525252] bg-[#F5F5F5] rounded-full border border-black/[0.07] whitespace-nowrap">공진단</a>
      <a href="${root}nmc.html"        class="shrink-0 px-3 py-1.5 text-xs font-semibold text-[#525252] bg-[#F5F5F5] rounded-full border border-black/[0.07] whitespace-nowrap">무릎관절 NMC</a>
      <a href="${root}about.html"      class="shrink-0 px-3 py-1.5 text-xs font-semibold text-[#525252] bg-[#F5F5F5] rounded-full border border-black/[0.07] whitespace-nowrap">원장 소개</a>
      <a href="${root}columns.html"    class="shrink-0 px-3 py-1.5 text-xs font-semibold text-[#0a0a0a] bg-black/[0.08] rounded-full border border-black/[0.15] whitespace-nowrap">건강 칼럼</a>
    </div>
  </div>
</header>`;
}

// ── 공통 FOOTER HTML ──────────────────────────────────────────────
function footerHtml(root = '../') {
  return `<footer class="bg-[#0a0a0a] border-t border-white/[0.06]">
  <div class="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-12 md:py-14">
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-10">
      <div class="md:max-w-[240px]">
        <div class="logo-wrap mb-5">
          <span class="logo-badge" style="height:44px;width:32px;font-size:14px;">매<br>일</span>
          <span class="logo-name" style="color:white;font-size:24px;">백세한의원</span>
        </div>
        <address class="not-italic text-sm text-white/40 leading-[1.9]">
          서울특별시 중랑구 공릉로 21<br>먹골역 도보 5분 (7호선)<br>
          <a href="tel:0222340102" class="hover:text-white transition-colors duration-200">02-2234-0102</a>
        </address>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
        <div>
          <p class="text-[10px] font-bold tracking-[0.18em] text-white/30 uppercase mb-4">진료</p>
          <ul class="space-y-2.5">
            <li><a href="${root}diet.html"       class="text-sm text-white/55 hover:text-white transition-colors">매일감비환</a></li>
            <li><a href="${root}gongjindan.html" class="text-sm text-white/55 hover:text-white transition-colors">공진단</a></li>
            <li><a href="${root}nmc.html"        class="text-sm text-white/55 hover:text-white transition-colors">무릎관절 NMC</a></li>
          </ul>
        </div>
        <div>
          <p class="text-[10px] font-bold tracking-[0.18em] text-white/30 uppercase mb-4">한의원</p>
          <ul class="space-y-2.5">
            <li><a href="${root}about.html"   class="text-sm text-white/55 hover:text-white transition-colors">원장 소개</a></li>
            <li><a href="${root}columns.html" class="text-sm text-white/55 hover:text-white transition-colors">건강 칼럼</a></li>
          </ul>
        </div>
        <div>
          <p class="text-[10px] font-bold tracking-[0.18em] text-white/30 uppercase mb-4">상담</p>
          <ul class="space-y-2.5">
            <li><a href="tel:0222340102" class="text-sm text-white/55 hover:text-white transition-colors">전화 02-2234-0102</a></li>
            <li><a href="https://pf.kakao.com/_JEzRK/chat" target="_blank" rel="noopener" class="text-sm text-white/55 hover:text-white transition-colors">카카오톡 채널</a></li>
            <li><a href="https://docs.google.com/forms/d/1g2IhZ3c4dqW5nhrYuZBgguIPKBULiZZWI_PgroqlseQ/viewform" target="_blank" rel="noopener" class="text-sm text-white/55 hover:text-white transition-colors">비대면 신청</a></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="mt-12 pt-8 border-t border-white/[0.06] text-xs text-white/25">
      © 2026 매일백세한의원. 사업자등록번호 219-90-57763 · 의료기관 개설 허가 제140호<br>
      본 사이트의 정보는 의료 광고 심의 기준에 따라 작성되었습니다.
    </div>
  </div>
</footer>`;
}

// ── 공통 <head> ───────────────────────────────────────────────────
function headHtml({ title, description, keywords, root = '../', slug = '' }) {
  const canon = slug
    ? `https://mail100hanwon.co.kr/columns/${slug}`
    : 'https://mail100hanwon.co.kr/columns';
  return `<meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | 매일백세한의원</title>
  <meta name="description" content="${description || ''}">
  ${keywords ? `<meta name="keywords" content="${Array.isArray(keywords) ? keywords.join(', ') : keywords}">` : ''}
  <link rel="canonical" href="${canon}">
  <meta property="og:title" content="${title} | 매일백세한의원">
  <meta property="og:description" content="${description || ''}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canon}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css">
  <script src="https://code.iconify.design/iconify-icon/2.3.0/iconify-icon.min.js"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Pretendard', 'system-ui', 'sans-serif'] },
          colors: { brand: '#C8392B', 'brand-light': '#FFF4F0' }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Pretendard', system-ui, sans-serif; word-break: keep-all; }
    .logo-wrap { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .logo-badge { background:#C8392B; color:#fff; font-weight:800; font-size:13px; line-height:1.25;
                  display:flex; align-items:center; justify-content:center; text-align:center;
                  height:40px; width:30px; border-radius:6px; padding:2px 0; flex-shrink:0; }
    .logo-name { font-weight:700; color:#0a0a0a; font-size:22px; letter-spacing:-0.02em; line-height:1; }
    .prose h2 { font-size:1.5rem; font-weight:700; margin:2.5rem 0 1rem; color:#0a0a0a; line-height:1.3; }
    .prose h3 { font-size:1.2rem; font-weight:700; margin:2rem 0 0.75rem; color:#0a0a0a; line-height:1.4; }
    .prose p  { margin:0.9rem 0; line-height:1.85; color:#3a3a3a; }
    .prose ul, .prose ol { margin:1rem 0 1rem 1.5rem; }
    .prose li { margin:0.35rem 0; line-height:1.75; color:#3a3a3a; }
    .prose ul { list-style-type:disc; }
    .prose ol { list-style-type:decimal; }
    .prose strong { color:#0a0a0a; font-weight:600; }
    .prose code { background:#F5F5F5; padding:2px 6px; border-radius:4px; font-size:0.88em; }
    .prose a { color:#C8392B; text-decoration:underline; }
    ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#f1f1f1; }
    ::-webkit-scrollbar-thumb { background:#ccc; border-radius:3px; }
  </style>`;
}

// ── 관련 칼럼 섹션 HTML ───────────────────────────────────────────
function relatedColumnsHtml(col, allCols) {
  const related = allCols
    .filter(c => c.slug !== col.slug && c.meta.category === col.meta.category)
    .slice(0, 3);
  if (related.length === 0) return '';

  const root = '../../';
  const cards = related.map(c => {
    const imgUrl = (c.meta.image && !c.meta.image.includes('unknown'))
      ? c.meta.image
      : `https://picsum.photos/seed/${c.slug.slice(0, 8)}/400/225`;
    return `<a href="${root}columns/${c.slug}/index.html"
        class="flex gap-3 items-start p-3 rounded-xl border border-black/[0.07] hover:border-black/20 hover:bg-[#FAFAFA] transition-all duration-200 group">
      <img src="${imgUrl}" alt="${c.meta.title}" class="w-20 h-14 object-cover rounded-lg shrink-0 bg-[#F0EDE6]" loading="lazy">
      <div class="min-w-0">
        <p class="text-[10px] text-[#C8392B] font-bold tracking-wider uppercase mb-1">${c.meta.category || ''}</p>
        <p class="text-sm font-semibold text-[#0a0a0a] line-clamp-2 leading-snug group-hover:text-[#C8392B] transition-colors">${c.meta.title}</p>
      </div>
    </a>`;
  }).join('\n      ');

  return `<div class="mt-10 pt-8 border-t border-black/[0.07]">
    <h3 class="text-sm font-bold text-[#0a0a0a] mb-4">관련 칼럼</h3>
    <div class="space-y-3">
      ${cards}
    </div>
  </div>`;
}

// ── 개별 칼럼 페이지 생성 ─────────────────────────────────────────
function generateColumnPage(col, allCols = []) {
  const { meta, body } = col;
  const slug = col.slug;
  const contentHtml = mdToHtml(body);
  const root = '../../';

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": meta.title,
    "description": meta.description,
    "datePublished": meta.date,
    "author": {
      "@type": "Person",
      "name": "이원장",
      "affiliation": { "@type": "MedicalOrganization", "name": "매일백세한의원" }
    },
    "publisher": {
      "@type": "MedicalOrganization",
      "name": "매일백세한의원",
      "url": "https://mail100hanwon.co.kr"
    },
    "url": `https://mail100hanwon.co.kr/columns/${slug}`
  });

  const imgUrl = (meta.image && !meta.image.includes('unknown'))
    ? meta.image
    : `https://picsum.photos/seed/${slug.slice(0, 8)}/1200/630`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  ${headHtml({ title: meta.title, description: meta.description, keywords: meta.keywords, root, slug })}
  <script type="application/ld+json">${schemaJson}</script>
</head>
<body class="bg-white text-[#0a0a0a]">

${navHtml(2)}

<main>
  <!-- Breadcrumb -->
  <div class="max-w-3xl mx-auto px-5 md:px-8 pt-6 pb-2">
    <nav class="flex items-center gap-2 text-xs text-[#888]">
      <a href="${root}index.html" class="hover:text-[#0a0a0a] transition-colors">홈</a>
      <iconify-icon icon="solar:alt-arrow-right-linear" width="12" class="text-[#ccc]"></iconify-icon>
      <a href="${root}columns.html" class="hover:text-[#0a0a0a] transition-colors">건강 칼럼</a>
      <iconify-icon icon="solar:alt-arrow-right-linear" width="12" class="text-[#ccc]"></iconify-icon>
      <span class="text-[#525252] line-clamp-1">${meta.category || '칼럼'}</span>
    </nav>
  </div>

  <article class="max-w-3xl mx-auto px-5 md:px-8 py-10">
    <header class="mb-10 pb-8 border-b border-black/[0.07]">
      <div class="flex items-center gap-2 mb-4">
        <span class="px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase rounded-full bg-[#FFF4F0] text-[#C8392B]">${meta.category || '건강정보'}</span>
        ${meta.date ? `<time class="text-xs text-[#888]" datetime="${meta.date}">${meta.date}</time>` : ''}
      </div>
      <h1 class="text-2xl md:text-3xl font-bold leading-tight mb-4 text-[#0a0a0a]">${meta.title}</h1>
      ${meta.description ? `<p class="text-base text-[#525252] leading-relaxed">${meta.description}</p>` : ''}
      <p class="mt-5 text-sm text-[#888]">작성: 이원장 · 매일백세한의원</p>
    </header>

    ${meta.videoId
      ? `<div class="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 bg-black">
          <iframe src="https://www.youtube.com/embed/${meta.videoId}"
            title="${meta.title}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen class="absolute inset-0 w-full h-full"></iframe>
        </div>`
      : `<div class="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 bg-[#F5F5F5]">
          <img src="${imgUrl}" alt="${meta.imageAlt || meta.title}" class="w-full h-full object-cover" loading="eager">
        </div>`
    }

    <div class="prose max-w-none">
      ${contentHtml}
    </div>

    <!-- CTA -->
    <div class="mt-14 p-7 rounded-2xl bg-[#FFF4F0] border border-[#C8392B]/10">
      <h3 class="text-lg font-bold mb-2 text-[#0a0a0a]">상담·예약 안내</h3>
      <p class="text-sm text-[#525252] mb-5 leading-relaxed">
        본 칼럼은 일반적인 한방 건강 정보를 담고 있으며, 개인 체질에 따라 적합한 처방이 달라질 수 있습니다.<br>
        자세한 상담은 전화·카카오톡 또는 비대면 진료 신청을 이용해 주세요.
      </p>
      <div class="flex flex-wrap gap-3">
        <a href="tel:0222340102"
           class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8392B] text-white text-sm font-bold rounded-full hover:bg-[#a82e22] transition-colors">
          <iconify-icon icon="solar:phone-bold" width="15"></iconify-icon>
          02-2234-0102
        </a>
        <a href="https://pf.kakao.com/_JEzRK/chat" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FAE100] text-[#3C1E1E] text-sm font-bold rounded-full hover:brightness-95 transition-all">
          카카오톡 상담
        </a>
        <a href="https://docs.google.com/forms/d/1g2IhZ3c4dqW5nhrYuZBgguIPKBULiZZWI_PgroqlseQ/viewform" target="_blank" rel="noopener"
           class="inline-flex items-center gap-2 px-5 py-2.5 border border-black/20 text-[#0a0a0a] text-sm font-semibold rounded-full hover:bg-black/[0.04] transition-all">
          비대면 신청
        </a>
      </div>
    </div>

    ${relatedColumnsHtml(col, allCols)}

    <!-- Back link -->
    <div class="mt-10">
      <a href="${root}columns.html" class="inline-flex items-center gap-2 text-sm text-[#888] hover:text-[#0a0a0a] transition-colors">
        <iconify-icon icon="solar:alt-arrow-left-linear" width="15"></iconify-icon>
        건강 칼럼 목록으로
      </a>
    </div>
  </article>
</main>

${footerHtml(root)}
</body>
</html>`;
}

// ── 칼럼 목록 페이지 생성 ─────────────────────────────────────────
function generateListingPage(cols) {
  const categories = [...new Set(cols.map(c => c.meta.category).filter(Boolean))];

  const cardHtml = (col, delay = 0) => {
    const imgUrl = (col.meta.image && !col.meta.image.includes('unknown'))
      ? col.meta.image
      : `https://picsum.photos/seed/${col.slug.slice(0, 8)}/800/450`;
    return `<a href="columns/${col.slug}/index.html"
        class="group block rounded-[20px] overflow-hidden border border-black/[0.07] hover:border-black/[0.14] hover:shadow-lg hover:shadow-black/[0.05] transition-all duration-300 bg-white"
        data-cat="${col.meta.category || ''}">
      <div class="relative aspect-video overflow-hidden bg-[#F0EDE6]">
        <img src="${imgUrl}" alt="${col.meta.imageAlt || col.meta.title}"
             class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
             loading="lazy" decoding="async">
      </div>
      <div class="p-5">
        <p class="text-[10px] tracking-widest text-[#C8392B] font-bold mb-2 uppercase">${col.meta.category || '건강정보'}</p>
        <h3 class="text-[14px] font-bold mb-2 leading-snug line-clamp-2 text-[#0a0a0a]">${col.meta.title}</h3>
        <p class="text-sm text-[#525252] line-clamp-2 mb-4 leading-[1.7]">${col.meta.description || ''}</p>
        <time class="text-xs text-[#888]">${col.meta.date || ''}</time>
      </div>
    </a>`;
  };

  const catBtns = categories.map(cat =>
    `<button onclick="filterCat('${cat}')" data-cat="${cat}"
       class="cat-btn shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full border border-black/[0.1] text-[#525252] hover:border-black/30 hover:text-[#0a0a0a] transition-all duration-200 bg-white">
      ${cat}
    </button>`
  ).join('\n      ');

  const cards = cols.map((col, i) => cardHtml(col, (i % 3) * 65)).join('\n      ');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  ${headHtml({ title: '건강 칼럼', description: '매일백세한의원 원장이 직접 쓰는 한방 건강 정보. 다이어트, 공진단, 무릎관절, 갱년기까지 156개 칼럼.', root: '', slug: '' })}
</head>
<body class="bg-[#FAFAFA] text-[#0a0a0a]">

${navHtml(1)}

<main>
  <!-- Header -->
  <section class="bg-white border-b border-black/[0.06]">
    <div class="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-16 md:py-20">
      <div class="flex items-center gap-3 mb-5">
        <span class="h-px w-6 bg-black/20"></span>
        <span class="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8C8A87]">Columns</span>
      </div>
      <h1 class="font-serif text-3xl md:text-4xl lg:text-[2.6rem] text-[#0F0D0A] leading-tight tracking-[-0.025em] mb-4">
        매일백세 건강 칼럼
      </h1>
      <p class="text-[#5C5A57] max-w-xl leading-relaxed">
        원장이 직접 쓰는 한방 건강 정보. 다이어트·공진단·무릎관절·갱년기 등 ${cols.length}개 칼럼.
      </p>
    </div>
  </section>

  <!-- Filter -->
  <div class="bg-white border-b border-black/[0.06] sticky top-[4.5rem] z-30">
    <div class="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
      <button onclick="filterCat('전체')" data-cat="전체"
        class="cat-btn shrink-0 px-4 py-1.5 text-xs font-bold rounded-full border border-[#0a0a0a] text-[#0a0a0a] bg-white transition-all duration-200">
        전체
      </button>
      ${catBtns}
    </div>
  </div>

  <!-- Grid -->
  <div class="max-w-7xl mx-auto px-5 md:px-8 lg:px-12 py-12">
    <div id="col-grid" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      ${cards}
    </div>
    <p id="no-result" class="hidden text-center text-[#888] py-20">해당 카테고리의 칼럼이 없습니다.</p>
  </div>
</main>

${footerHtml('./')}

<script>
  let current = '전체';
  function filterCat(cat) {
    current = cat;
    document.querySelectorAll('.cat-btn').forEach(b => {
      const active = b.dataset.cat === cat;
      b.classList.toggle('bg-[#0a0a0a]', active);
      b.classList.toggle('text-white', active);
      b.classList.toggle('border-[#0a0a0a]', active);
      b.classList.toggle('border-black/[0.1]', !active);
      b.classList.toggle('text-[#525252]', !active);
    });
    const cards = document.querySelectorAll('#col-grid > a');
    let visible = 0;
    cards.forEach(c => {
      const show = cat === '전체' || c.dataset.cat === cat;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    document.getElementById('no-result').classList.toggle('hidden', visible > 0);
  }
</script>
</body>
</html>`;
}

// ── sitemap.xml 생성 ──────────────────────────────────────────────
function generateSitemap(cols) {
  const base = 'https://mail100hanwon.co.kr';
  const today = new Date().toISOString().split('T')[0];
  const staticPages = [
    { url: '/',           changefreq: 'weekly',  priority: '1.0', date: today },
    { url: '/diet',       changefreq: 'monthly', priority: '0.8', date: today },
    { url: '/gongjindan', changefreq: 'monthly', priority: '0.8', date: today },
    { url: '/nmc',        changefreq: 'monthly', priority: '0.8', date: today },
    { url: '/about',      changefreq: 'monthly', priority: '0.7', date: today },
    { url: '/columns',    changefreq: 'weekly',  priority: '0.9', date: today },
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const p of staticPages) {
    xml += `  <url><loc>${base}${p.url}</loc><lastmod>${p.date}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>\n`;
  }
  for (const col of cols) {
    const date = col.meta.date || today;
    xml += `  <url><loc>${base}/columns/${col.slug}</loc><lastmod>${date}</lastmod><changefreq>never</changefreq><priority>0.7</priority></url>\n`;
  }
  xml += '</urlset>';

  const sitemapPath = path.join(ROOT, '디자인리뉴얼', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf-8');
  console.log(`🗺  sitemap.xml 업데이트: ${6 + cols.length}개 URL`);
}

// ── 메인 실행 ─────────────────────────────────────────────────────
function run() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const files = fs.readdirSync(COLUMNS_SRC).filter(f => f.endsWith('.md'));
  const cols = [];

  for (const file of files) {
    const src = fs.readFileSync(path.join(COLUMNS_SRC, file), 'utf-8');
    const slug = file.replace(/\.md$/, '');
    const { meta, body } = parseFrontmatter(src);
    if (!meta.title) continue;
    cols.push({ slug, meta, body });
  }

  // 날짜 내림차순 정렬
  cols.sort((a, b) => (b.meta.date || '').localeCompare(a.meta.date || ''));

  // 개별 페이지 생성
  let count = 0;
  for (const col of cols) {
    const dir = path.join(OUT_DIR, col.slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), generateColumnPage(col, cols), 'utf-8');
    count++;
  }

  // 목록 페이지 생성
  const listingPath = path.join(ROOT, '디자인리뉴얼', 'columns.html');
  fs.writeFileSync(listingPath, generateListingPage(cols), 'utf-8');

  // sitemap.xml 업데이트
  generateSitemap(cols);

  console.log(`✅ 칼럼 ${count}개 생성 완료`);
  console.log(`📄 목록 페이지: 디자인리뉴얼/columns.html`);
}

run();
