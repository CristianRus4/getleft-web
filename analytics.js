// Consent banner and the one site event (download_click). Loaded by
// partials/analytics.html, which only the build inserts once a GA4 measurement
// ID exists. No other tracking: no fingerprinting, no scroll or engagement
// events, nothing on go.getleft.app (the inline loader never defines gtag there).
(function () {
  'use strict';

  var STORAGE_KEY = 'left.consent';
  var CONSENT_TIME_ZONES = [
    'Atlantic/Canary', 'Atlantic/Madeira', 'Atlantic/Azores', 'Atlantic/Reykjavik',
    'Atlantic/Faroe', 'Arctic/Longyearbyen', 'Atlantic/Jan_Mayen',
    // EU territory outside the Europe/ zones: Cyprus, Ceuta/Melilla and the
    // French outermost regions (their ISO codes are in the consent region list).
    'Asia/Nicosia', 'Asia/Famagusta', 'Africa/Ceuta', 'America/Cayenne',
    'America/Guadeloupe', 'America/Martinique', 'America/Marigot',
    'Indian/Reunion', 'Indian/Mayotte'
  ];

  function hasGtag() { return typeof window.gtag === 'function'; }

  // ───────── Consent ─────────

  function readChoice() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return v === 'granted' || v === 'denied' ? v : null;
    } catch (e) { return null; }
  }

  function needsConsentPrompt() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
    return tz.indexOf('Europe/') === 0 || CONSENT_TIME_ZONES.indexOf(tz) >= 0;
  }

  var CSS = [
    '.left-consent{',
    '--lc-bg:var(--bg-surface,#fff);--lc-text:var(--text,#0d0d0d);--lc-muted:var(--text-secondary,#6b6b6b);',
    '--lc-line:var(--hairline,rgba(0,0,0,.08));--lc-solid-bg:#0d0d0d;--lc-solid-text:#fff;',
    'position:fixed;z-index:1002;left:16px;right:16px;',
    'bottom:calc(env(safe-area-inset-bottom,0px) + 16px + var(--left-consent-lift,0px));',
    'box-sizing:border-box;max-width:420px;margin:0 auto;padding:16px;border-radius:16px;',
    'background:var(--lc-bg);color:var(--lc-text);border:1px solid var(--lc-line);',
    'box-shadow:0 12px 40px rgba(0,0,0,.14),0 2px 8px rgba(0,0,0,.06);',
    'font:inherit;font-size:14px;line-height:1.5;text-align:left}',
    '.left-consent[hidden]{display:none}',
    '.left-consent__text{margin:0;color:var(--lc-text);font:inherit}',
    '.left-consent__actions{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-top:12px}',
    '.left-consent__btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;',
    'padding:0 14px;border-radius:9999px;border:1px solid var(--lc-line);background:transparent;',
    'color:var(--lc-text);font:inherit;font-weight:600;cursor:pointer;-webkit-tap-highlight-color:transparent}',
    '.left-consent__btn--primary{background:var(--lc-solid-bg);color:var(--lc-solid-text);border-color:var(--lc-solid-bg)}',
    '.left-consent__link{display:inline-flex;align-items:center;min-height:44px;padding:0 6px;',
    'color:var(--lc-muted);text-decoration:underline;text-underline-offset:2px}',
    '.left-consent__btn:focus-visible,.left-consent__link:focus-visible{outline:2px solid #ff4f00;outline-offset:2px}',
    '@media (min-width:901px){.left-consent{right:auto;margin:0}}',
    '@media (prefers-color-scheme:dark){.left-consent{',
    '--lc-bg:var(--bg-surface,#1a1a1c);--lc-text:var(--text,#f5f5f5);--lc-muted:var(--text-secondary,#8a8a8a);',
    '--lc-line:var(--hairline,rgba(255,255,255,.12));--lc-solid-bg:#f5f5f5;--lc-solid-text:#0d0d0d;',
    'box-shadow:0 12px 40px rgba(0,0,0,.5),0 2px 8px rgba(0,0,0,.3)}}',
    '@media (prefers-reduced-motion:no-preference){',
    '.left-consent.is-entering{animation:left-consent-in .22s ease-out}',
    '@keyframes left-consent-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}}',
    '@media print{.left-consent{display:none!important}}'
  ].join('');

  var banner = document.getElementById('left-consent');
  var opener = null;
  var styled = false;

  function ensureStyle() {
    if (styled) return;
    styled = true;
    var style = document.createElement('style');
    style.setAttribute('data-left-consent', '');
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  // Keep the card above the mobile floating download button instead of on it.
  function updateLift() {
    if (!banner) return;
    var lift = 0;
    var floater = document.querySelector('.hero-floater');
    if (floater) {
      var cs = window.getComputedStyle(floater);
      if (cs.display !== 'none' && cs.position === 'fixed') {
        var h = floater.getBoundingClientRect().height;
        if (h > 0) lift = Math.ceil(h) + 12;
      }
    }
    banner.style.setProperty('--left-consent-lift', lift + 'px');
  }

  function showBanner(fromOpener) {
    if (!banner) return;
    ensureStyle();
    updateLift();
    var wasHidden = banner.hidden;
    banner.hidden = false;
    if (wasHidden) {
      banner.classList.remove('is-entering');
      void banner.offsetWidth;
      banner.classList.add('is-entering');
    }
    if (fromOpener) {
      var first = banner.querySelector('[data-consent-accept]');
      if (first) first.focus();
    }
  }

  function hideBanner() {
    if (!banner) return;
    var hadFocus = banner.contains(document.activeElement);
    banner.hidden = true;
    banner.classList.remove('is-entering');
    if (hadFocus && opener && document.contains(opener)) opener.focus();
    opener = null;
  }

  function choose(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* still applies to this page */ }
    if (hasGtag()) window.gtag('consent', 'update', { analytics_storage: value });
    hideBanner();
  }

  if (banner) {
    banner.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      if (t.closest('[data-consent-accept]')) { e.preventDefault(); choose('granted'); }
      else if (t.closest('[data-consent-decline]')) { e.preventDefault(); choose('denied'); }
    });
    banner.addEventListener('keydown', function (e) {
      // Escape dismisses a banner opened from "Cookie settings" or one that
      // already has a choice; an automatic first prompt waits for a choice.
      if (e.key === 'Escape' && (opener || readChoice() !== null)) { e.preventDefault(); hideBanner(); }
    });
    window.addEventListener('resize', function () { if (!banner.hidden) updateLift(); }, { passive: true });
  }

  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('[data-consent-open]') : null;
    if (!t || !banner) return;
    e.preventDefault();
    opener = t;
    showBanner(true);
  });

  if (banner && hasGtag() && readChoice() === null && needsConsentPrompt()) showBanner(false);

  // ───────── download_click ─────────

  var DOWNLOAD_SELECTOR = 'a[href*="apps.apple.com"], a[href^="/download"], a[href^="/app"], a[href^="/ios"], [data-cta]';
  var SHORT_LINK = /^\/(download|app|ios)(\.html)?\/?(?:[?#]|$)/;
  var LOCALE_PREFIX = /^\/[a-z]{2}(?:-[A-Za-z0-9]{2,4})?(?=\/|$)/;
  var PLACEMENTS = [
    ['.top-nav', 'nav'],
    ['.hero-floater', 'float'],
    ['.hero, header.hero', 'hero'],
    ['.download-block, .download-cta', 'end'],
    ['.site-footer', 'footer'],
    ['.tool-result, [data-tool-result]', 'result']
  ];

  function placementFor(el) {
    var explicit = el.getAttribute('data-cta');
    if (explicit) return explicit;
    for (var i = 0; i < PLACEMENTS.length; i++) {
      if (el.closest(PLACEMENTS[i][0])) return PLACEMENTS[i][1];
    }
    return 'inline';
  }

  function contentType() {
    var meta = document.querySelector('meta[name="left:content-type"]');
    var fromMeta = meta && meta.getAttribute('content');
    if (fromMeta) return fromMeta;
    var p = location.pathname.replace(LOCALE_PREFIX, '') || '/';
    if (p === '/' || p === '/index.html' || p === '/index') return 'home';
    var seg = p.split('/')[1].replace(/\.html$/, '');
    if (seg === 'blog') return 'blog';
    if (seg === 'tools') return 'tool';
    if (seg === 'support') return 'support';
    if (seg === 'privacy' || seg === 'terms') return 'legal';
    if (seg === 'press') return 'press';
    return 'landing';
  }

  function isDownloadLink(el) {
    if (el.hasAttribute('data-cta')) return true;
    var raw = el.getAttribute('href') || '';
    if (raw.charAt(0) === '/') return SHORT_LINK.test(raw);
    return /(^|\.)apps\.apple\.com$/.test(el.hostname || '');
  }

  document.addEventListener('click', function (e) {
    if (e.button !== 0 || !hasGtag()) return;
    var el = e.target && e.target.closest ? e.target.closest(DOWNLOAD_SELECTOR) : null;
    if (!el || !isDownloadLink(el)) return;
    var linkUrl = '';
    if (el.href) {
      try { var u = new URL(el.href, location.href); linkUrl = u.origin + u.pathname; } catch (err) {}
    }
    window.gtag('event', 'download_click', {
      placement: placementFor(el),
      locale: document.documentElement.lang || '',
      page_path: location.pathname,
      content_type: contentType(),
      link_url: linkUrl,
      transport_type: 'beacon'
    });
  }, true);
})();
