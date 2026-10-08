/* Databuddy custom events. snake_case, low-cardinality properties, no PII. */
(function () {
  var path = location.pathname.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  var parts = path.split('/').filter(Boolean);
  var lang = /^[a-z]{2}(-[A-Za-z0-9]+)?$/.test(parts[0] || '') && parts[0] !== 'web' ? parts[0] : 'en';
  var rest = lang === 'en' ? parts : parts.slice(1);
  var section = rest[0] || 'home';
  var slug = rest[rest.length - 1] || 'home';

  function track(name, props) {
    try {
      var p = props || {};
      p.lang = lang;
      if (window.databuddy && window.databuddy.track) window.databuddy.track(name, p);
    } catch (e) {}
  }

  function placement(el) {
    if (el.id === 'appBtn') return 'web_tool';
    if (el.closest('.dl-btn, .dl-floating')) return 'floating';
    if (el.closest('nav, header')) return 'nav';
    if (el.closest('footer')) return 'footer';
    if (el.closest('.hero')) return 'hero';
    return 'body';
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;

    var store = t.closest('a[href*="apps.apple.com"], #appBtn');
    if (store) track('app_store_clicked', { section: section, page: slug, placement: placement(store) });

    var mail = t.closest('a[href^="mailto:"]');
    if (mail) track('email_link_clicked', { page: slug, target: mail.getAttribute('href').indexOf('support@') > -1 ? 'support' : 'other' });

    var langOpt = t.closest('[data-lang-option]');
    if (langOpt) track('language_changed', { to: langOpt.getAttribute('data-lang-option') });

    var wb = t.closest('#viewBtn, #symbolBtn, #colorBtn, #personBtn, #quoteBtn, #shareBtn, #bdayConfirm');
    if (wb) track('web_tool_action', { action: wb.id.replace(/Btn$/, '') });

    var rel = t.closest('.tool-related a');
    if (rel) track('related_tool_clicked', { from: slug });
  }, true);

  if (section === 'tools' && rest.length > 1) {
    var used = false;
    var widget = document.querySelector('.tool-widget');
    if (widget) {
      var fire = function () {
        if (used) return;
        used = true;
        track('tool_used', { tool: slug });
      };
      widget.addEventListener('change', fire, true);
      widget.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('button')) fire();
      }, true);
    }
  }

  if (section === '404') track('page_not_found', {});
})();
