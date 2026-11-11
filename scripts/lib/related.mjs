// The Related list at the end of every live blog post (scripts/build-related.mjs writes the
// English one; scripts/build-i18n.mjs renders it in each language).
//
// One list per post, in the support articles' "Related guides" component, between
// <!-- left:related:start --> and <!-- left:related:end -->, placed before the download block:
//   - the post's own links first (data-manual on the section): the old hand-written
//     "Related reads" sections and "Related reading:" lines are folded into it, so every
//     link they had is kept. An entry whose page is still queued shows from its date.
//   - then the 3 newest live posts on the same topic, so a new post is linked from older
//     related posts the day it goes live.
// Titles are the target pages' h1s; a locale copy shows an item only where the target has
// a copy in that language and a translated h1.

export const START = '<!-- left:related:start -->';
export const END = '<!-- left:related:end -->';
export const AUTO_COUNT = 3;
const BLOCK_RE = /[ \t]*<!-- left:related:start -->[\s\S]*?<!-- left:related:end -->\n?/;

// Topics, matched as word stems against a post's slug and h1.
const TOPICS = {
  countdown: ['countdown', 'until', 'birthday', 'anniversary', 'retirement', 'wedding', 'vacation', 'trip', 'holiday', 'christmas', 'event', 'graduation', 'release', 'party', 'launch'],
  habits: ['habit', 'streak', 'routine', 'consisten', 'daily', 'challenge', 'quit', 'sobriety', 'sober', 'smoking'],
  goals: ['goal', 'aim', 'resolution', 'motivat', 'achieve', 'accountab', 'smart', 'progress-tracker', 'milestone'],
  focus: ['focus', 'productiv', 'pomodoro', 'timer', 'time-blocking', 'procrastinat', 'planner', 'plan', 'structured', 'tiimo', 'calendar', 'deadline', 'task', 'schedule', 'project', 'time-management', 'break'],
  time: ['year-progress', 'year', 'life', 'weeks', 'time-left', 'awareness', 'memento', 'days-left', 'month', 'percentage', 'progress-bar', 'day-counter', 'days-since', 'date'],
  widgets: ['widget', 'wallpaper', 'home-screen', 'lock-screen', 'aesthetic', 'standby', 'customize', 'theme', 'widgetsmith', 'widgy', 'screensaver', 'clock'],
  health: ['fasting', 'weight', 'sleep', 'health', 'fitness', 'marathon', 'sobriety', 'smoking', 'mood', 'run'],
  study: ['student', 'study', 'exam', 'school', 'semester', 'academic', 'assignment', 'graduation', 'term'],
  adhd: ['adhd', 'executive', 'neurodiver', 'body-doubling', 'time-blindness'],
  watch: ['apple-watch', 'watch'],
};

const words = s => ` ${s.toLowerCase().replace(/&[a-z#0-9]+;/g, ' ').replace(/[^a-z0-9]+/g, '-')} `.replace(/-/g, ' ');

export function topicsOf(slug, title) {
  const hay = `${words(slug)} ${words(title)}`;
  const joined = `-${slug}-`;
  const out = new Set();
  for (const [topic, stems] of Object.entries(TOPICS)) {
    for (const stem of stems) {
      if (stem.includes('-') ? joined.includes(stem) : new RegExp(`\\s${stem}`).test(hay)) { out.add(topic); break; }
    }
  }
  return out;
}

export const plainText = html => String(html).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
export const h1Inner = html => (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] ?? null;

// posts: [{ path: '/blog/x', slug, title, date, topics }] live and indexable.
// Picks the newest posts that share the most topics with `post` (at least 2 shared topics
// while there are enough of those, else at least 1), skipping `exclude`.
export function pickRelated(post, posts, exclude = new Set(), n = AUTO_COUNT) {
  const scored = posts
    .filter(p => p.path !== post.path && !exclude.has(p.path))
    .map(p => ({ p, score: [...p.topics].filter(t => post.topics.has(t)).length }))
    .filter(x => x.score > 0);
  const byNewest = (a, b) => b.p.date.localeCompare(a.p.date) || a.p.slug.localeCompare(b.p.slug);
  const out = [];
  for (const min of [2, 1]) {
    for (const x of scored.filter(x => x.score >= min).sort(byNewest)) {
      if (out.length >= n) break;
      if (!out.includes(x.p)) out.push(x.p);
    }
  }
  return out;
}

// Hand-written related links in a post: the old sections (removed from the page) and the
// section's data-manual. Returns { html, manual: ['/blog/x', ...] } with the sections gone.
export function takeManual(html) {
  const manual = [];
  const add = s => {
    for (const m of s.matchAll(/href="(\/[^"#?]*)/g)) {
      const p = m[1].replace(/\.html$/, '');
      if (!manual.includes(p)) manual.push(p);
    }
  };
  const block = html.match(BLOCK_RE);
  if (block) {
    const attr = block[0].match(/\sdata-manual="([^"]*)"/);
    if (attr) for (const p of attr[1].split(/\s+/).filter(Boolean)) if (!manual.includes(p)) manual.push(p);
  }
  html = html.replace(/\n?[ \t]*<h2>Related reads<\/h2>\s*<p>([\s\S]*?)<\/p>[ \t]*(?=\n)/g, (m, p) => { add(p); return ''; });
  html = html.replace(/\n?[ \t]*<p>Related reading: ([\s\S]*?)<\/p>[ \t]*(?=\n)/g, (m, p) => { add(p); return ''; });
  return { html, manual };
}

const escapeAttr = s => String(s).replace(/&(?![a-z#0-9]+;)/gi, '&amp;').replace(/"/g, '&quot;');

export function blockHtml({ manual, items, heading = 'Related guides' }) {
  const lines = [
    `      ${START}`,
    `      <section class="support-related"${manual.length ? ` data-manual="${escapeAttr(manual.join(' '))}"` : ''}>`,
    `        <h2 class="support-related-h2" data-i18n="common.support_article.related_heading">${heading}</h2>`,
    `        <div class="support-related-items">`,
    ...items.map(i => `          <a class="support-related-item" href="${i.href}">${i.title}</a>`),
    `        </div>`,
    `      </section>`,
    `      ${END}`,
  ];
  return lines.join('\n') + '\n';
}

// Puts the block before the download block (else before </article>), replacing any old one.
export function upsertBlock(html, block) {
  html = html.replace(BLOCK_RE, '').replace(/\n{3,}(?=[ \t]*<section\s+class="download-block")/, '\n\n');
  if (/<section\s+class="download-block"/.test(html)) {
    return html.replace(/([ \t]*)(<section\s+class="download-block")/, (m, indent, tag) => `${block}\n${indent}${tag}`);
  }
  return html.replace(/([ \t]*)<\/article>/, (m, indent) => `${block}${indent}</article>`);
}

// Locale copy: keep the items `titleFor(href)` can title in that language, with that title;
// drop the block when none are left. The heading is translated through its data-i18n key.
export function localizeBlock(html, titleFor) {
  const block = html.match(BLOCK_RE);
  if (!block) return html;
  let kept = 0;
  const out = block[0]
    .replace(/\sdata-manual="[^"]*"/, '')
    .replace(/\n[ \t]*<a class="support-related-item" href="([^"]+)">[\s\S]*?<\/a>/g, (m, href) => {
      const title = titleFor(href);
      if (!title) return '';
      kept++;
      return m.replace(/>[\s\S]*?<\/a>$/, `>${plainText(title)}</a>`);
    });
  return html.replace(BLOCK_RE, kept ? out : '');
}
