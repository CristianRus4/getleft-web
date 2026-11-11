// Links to pages that are still queued in i18n/publish-schedule.json.
//
// A live page may link to a queued page by marking the link with data-queued (the real
// target). Until the target's date the page shows a fallback; from that date the build
// turns the marker into a plain link. Two shapes, written exactly like this:
//
//   <a href="/blog/live-page" data-queued="/blog/queued-page">words</a>   fallback: another live link
//   <span data-queued="/blog/queued-page">words</span>                    fallback: just the words
//
// Both become <a href="/blog/queued-page">words</a> once the target is live (any other
// attributes on the <a> stay). Translation units are hashed on that final form
// (canonicalQueued), so a unit keeps its key and its translations on the day the link
// switches on; locale copies render the same fallback from the English page.

export const QUEUED_A_RE = /<a href="([^"]*)" data-queued="([^"]+)"([^>]*)>/g;
export const QUEUED_SPAN_RE = /<span data-queued="([^"]+)">([^<]*)<\/span>/g;
// Every data-queued attribute, whatever its shape (check-publish compares the counts).
export const QUEUED_ANY_RE = /\sdata-queued="([^"]*)"/g;

// '/blog/x', '/blog/x.html' → '/blog/x'
export const cleanPath = href => href.replace(/[?#].*$/, '').replace(/\.html$/, '').replace(/\/index$/, '/');

// The final form of every marker: what the unit is hashed and translated as.
export function canonicalQueued(html) {
  if (!html.includes('data-queued')) return html;
  return html
    .replace(QUEUED_A_RE, (m, href, target, rest) => `<a href="${target}"${rest}>`)
    .replace(QUEUED_SPAN_RE, (m, target, words) => `<a href="${target}">${words}</a>`);
}

// English source: markers whose target is live (isPending(path) false) become plain links.
// Returns { html, resolved: [targets] }.
export function resolveQueuedLinks(html, isPending) {
  const resolved = [];
  if (!html.includes('data-queued')) return { html, resolved };
  html = html
    .replace(QUEUED_A_RE, (m, href, target, rest) => {
      if (isPending(cleanPath(target))) return m;
      resolved.push(target);
      return `<a href="${target}"${rest}>`;
    })
    .replace(QUEUED_SPAN_RE, (m, target, words) => {
      if (isPending(cleanPath(target))) return m;
      resolved.push(target);
      return `<a href="${target}">${words}</a>`;
    });
  return { html, resolved };
}

// The fallbacks a page uses: target path → fallback href, or null for "just the words".
export function queuedFallbacks(html) {
  const map = new Map();
  if (!html.includes('data-queued')) return map;
  for (const m of html.matchAll(QUEUED_A_RE)) if (!map.has(cleanPath(m[2]))) map.set(cleanPath(m[2]), m[1]);
  for (const m of html.matchAll(QUEUED_SPAN_RE)) if (!map.has(cleanPath(m[1]))) map.set(cleanPath(m[1]), null);
  return map;
}

// Locale copy: the translated units carry the final link; show the English page's fallback
// instead while the target is queued. Run before internal links are localized.
export function renderQueuedFallbacks(html, fallbacks) {
  if (!fallbacks.size) return html;
  return html.replace(/<a href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (m, href, rest, inner) => {
    const path = cleanPath(href);
    if (!fallbacks.has(path) || inner.includes('<a')) return m;
    const fb = fallbacks.get(path);
    return fb === null ? inner : `<a href="${fb}"${rest}>${inner}</a>`;
  });
}
