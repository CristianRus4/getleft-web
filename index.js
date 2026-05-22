/*
  index.js — homepage interactions.
  Vanilla JS only. All effects are progressive enhancements.
*/

(() => {
  'use strict';

  // ───────── Nav scroll reveal ─────────
  const nav = document.querySelector('.top-nav');
  if (nav) {
    const update = () => {
      if (window.scrollY > 80) nav.classList.add('is-visible');
      else nav.classList.remove('is-visible');
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  // ───────── Reveal-on-scroll ─────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ───────── Bento flip ─────────
  document.querySelectorAll('.bento-cell').forEach(cell => {
    let timer = null;
    const flip = () => {
      cell.classList.add('is-flipped');
      clearTimeout(timer);
      timer = setTimeout(() => cell.classList.remove('is-flipped'), 3000);
    };
    cell.addEventListener('click', flip);
    cell.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
    });
  });

  // ───────── Accordion FAQ ─────────
  document.querySelectorAll('.faq-grid').forEach(grid => {
    let closeTimer = null;
    grid.addEventListener('toggle', (event) => {
      const opened = event.target;
      if (!(opened instanceof HTMLDetailsElement) || !opened.open) return;
      clearTimeout(closeTimer);
      grid.querySelectorAll('details[open]').forEach(details => {
        if (details !== opened) details.open = false;
      });
      closeTimer = setTimeout(() => {
        opened.open = false;
      }, 3000);
    }, true);
  });

  // ───────── Actions preview ─────────
  document.querySelectorAll('[data-actions-showcase]').forEach(showcase => {
    const buttons = [...showcase.querySelectorAll('.action-step')];
    const image = showcase.querySelector('[data-actions-preview]');
    const mobileCopy = showcase.querySelector('[data-actions-mobile-copy]');
    if (!buttons.length || !image) return;

    const setActive = (button) => {
      buttons.forEach(b => {
        b.classList.toggle('is-active', b === button);
        b.setAttribute('aria-selected', b === button ? 'true' : 'false');
      });
      if (mobileCopy) {
        const title = button.querySelector('.action-step-title')?.textContent || '';
        const copy = button.querySelector('.action-step-copy')?.textContent || '';
        mobileCopy.innerHTML = `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p>`;
      }
      swapImage(image, button.dataset.actionImage, button.dataset.actionAlt);
    };

    buttons.forEach(button => {
      button.addEventListener('click', () => setActive(button));
    });

    const section = showcase.closest('[data-stepped-section="actions"]');
    if (section) {
      const updateFromScroll = () => {
        const rect = section.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        if (scrollable <= 0 || rect.top > 0 || rect.bottom < window.innerHeight) return;
        const progress = Math.min(0.999, Math.max(0, -rect.top / scrollable));
        const index = Math.min(buttons.length - 1, Math.floor(progress * buttons.length));
        setActive(buttons[index]);
      };
      updateFromScroll();
      window.addEventListener('scroll', updateFromScroll, { passive: true });
      window.addEventListener('resize', updateFromScroll);
    }
  });

  // ───────── Feature tag galleries ─────────
  document.querySelectorAll('[data-feature-gallery]').forEach(gallery => {
    const image = gallery.querySelector('.feature-image img');
    const tags = [...gallery.querySelectorAll('.feature-tag')];
    if (!image || !tags.length) return;

    let currentIndex = 0;
    let autoTimer = null;

    const activate = (index) => {
      currentIndex = index;
      tags.forEach((t, i) => t.classList.toggle('is-active', i === index));
      swapImage(image, tags[index].dataset.featureImage, tags[index].dataset.featureAlt);
    };

    const startAuto = () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => activate((currentIndex + 1) % tags.length), 8000);
    };

    tags.forEach((tag, i) => {
      tag.addEventListener('click', () => { activate(i); startAuto(); });
    });

    startAuto();
  });

  function swapImage(image, src, alt) {
    if (!src || image.getAttribute('src') === src) return;
    image.classList.add('is-swapping');
    window.setTimeout(() => {
      image.src = src;
      if (alt) image.alt = alt;
      image.classList.remove('is-swapping');
    }, 140);
  }

  // ───────── Scroll-text per-sentence highlight ─────────
  const scrollText = document.getElementById('scrollText');
  if (scrollText) {
    const raw = scrollText.textContent.trim();
    scrollText.textContent = '';
    const sentences = raw.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [raw];
    sentences.forEach((sentence, i) => {
      const span = document.createElement('span');
      span.className = 'scroll-sentence';
      const text = sentence.trim() + (i < sentences.length - 1 ? ' ' : '');
      if (text.includes('Left makes time matter.')) {
        span.innerHTML = text.replace('Left makes time matter.', '<em class="scroll-accent">Left makes time matter.</em>');
      } else {
        span.textContent = text;
      }
      scrollText.appendChild(span);
    });
    const sentenceSpans = scrollText.querySelectorAll('.scroll-sentence');
    const section = scrollText.closest('[data-stepped-section="copy"]');
    const update = () => {
      if (section) {
        const rect = section.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const progress = scrollable > 0 ? Math.min(0.999, Math.max(0, -rect.top / scrollable)) : 0;
        const activeIndex = Math.min(sentenceSpans.length - 1, Math.floor(progress * sentenceSpans.length));
        sentenceSpans.forEach((sentence, index) => sentence.classList.toggle('is-lit', index <= activeIndex));
        return;
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  // ───────── Template carousel ─────────
  const COLORS = {
    orange: '#FF6B24', blue: '#3B82F6', green: '#22C55E',
    purple: '#A855F7', red: '#EF4444', pink: '#EC4899',
    yellow: '#EAB308', teal: '#14B8A6', brown: '#92400E'
  };
  const SYMBOLS = { ahead: 'A', habit: 'H', streak: 'S' };

  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    fetch('/TemplateLibrary.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (!Array.isArray(data)) return;
        const shuffled = shuffle(data);
        if (shuffled.length === 0) return;

        const rows = Array.from({ length: 5 }, () => []);
        shuffled.forEach((item, index) => rows[index % rows.length].push(item));

        const renderCard = item => {
          const accent = COLORS[(item.color || 'orange').toLowerCase()] || COLORS.orange;
          const symbol = SYMBOLS[item.kind] || 'T';
          const src = templatePhotoUrl(item);
          const title = escapeHtml(item.title || 'Untitled');
          const subtitle = escapeHtml(templateSubtitle(item));
          return `<div class="carousel-card" role="listitem" style="--card-accent:${accent}">
            <img src="${src}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none'" />
            <span class="card-accent" aria-hidden="true"></span>
            <span class="symbol" aria-hidden="true">${symbol}</span>
            <div class="card-meta"><span class="card-subtitle">${subtitle}</span><span class="card-title">${title}</span></div>
          </div>`;
        };

        carouselTrack.innerHTML = rows.map((row, index) => {
          const cards = row.map(renderCard).join('');
          return `<div class="template-row" role="list" data-direction="${index % 2 === 0 ? 'right' : 'left'}">${cards}${cards}${cards}</div>`;
        }).join('');

        const rowState = [...carouselTrack.querySelectorAll('.template-row')].map((row, index) => {
          const state = {
            row,
            offset: index % 2 === 0 ? -row.scrollWidth / 3 : 0,
            speed: 0.22 + index * 0.035,
            direction: row.dataset.direction === 'right' ? 1 : -1,
            width: row.scrollWidth / 3,
            dragOffset: 0,
            pointerStartX: 0,
            dragStartOffset: 0,
            isDragging: false
          };

          row.addEventListener('pointerdown', (event) => {
            state.pointerStartX = event.clientX;
            state.dragStartOffset = state.dragOffset;
            state.isDragging = true;
            paused = true;
            wrap.classList.add('is-dragging');
            row.setPointerCapture?.(event.pointerId);
          });
          row.addEventListener('pointermove', (event) => {
            if (!state.isDragging) return;
            state.dragOffset = state.dragStartOffset + event.clientX - state.pointerStartX;
          });
          const finishDrag = (event) => {
            if (!state.isDragging) return;
            state.isDragging = false;
            wrap.classList.remove('is-dragging');
            row.releasePointerCapture?.(event.pointerId);
            paused = false;
          };
          row.addEventListener('pointerup', finishDrag);
          row.addEventListener('pointercancel', finishDrag);
          row.addEventListener('pointerleave', finishDrag);

          return state;
        });

        let paused = false;
        const wrap = carouselTrack.parentElement;
        wrap.addEventListener('mouseenter', () => paused = true);
        wrap.addEventListener('mouseleave', () => paused = false);
        wrap.addEventListener('focusin', () => paused = true);
        wrap.addEventListener('focusout', () => paused = false);

        const tick = () => {
          rowState.forEach(state => {
            if (!paused) state.offset += state.speed * state.direction;
            if (state.width > 0) {
              if (state.offset > 0) state.offset -= state.width;
              if (state.offset < -state.width * 2) state.offset += state.width;
            }
            state.row.style.transform = `translate3d(${state.offset + state.dragOffset}px, 0, 0)`;
          });
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      })
      .catch(() => { /* graceful: carousel hidden */ });
  }

  // ───────── Reviews ─────────
  const reviewsSection = document.getElementById('reviewsSection');
  const reviewsCols = document.getElementById('reviewsCols');
  if (reviewsCols) {
    fetch('/reviews.json')
      .then(r => r.ok ? r.json() : [])
      .then(reviews => {
        if (!Array.isArray(reviews) || reviews.length === 0) return;
        reviewsSection.hidden = false;

        // Distribute into 3 columns
        const cols = [[], [], []];
        shuffle(reviews).forEach((r, i) => cols[i % 3].push(r));

        const renderCard = (r) => {
          const star = ((r.type === 'store' || r.type === 'app-store') && r.rating) ? `<div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>` : '';
          const meta = `<div class="review-meta">${escapeHtml(r.type)}${r.author ? ' · ' + escapeHtml(r.author) : ''}</div>`;
          const title = r.title ? `<div class="review-title">${escapeHtml(r.title)}</div>` : '';
          const body = `<div class="review-body">${escapeHtml(r.description || r.text || '')}</div>`;
          const photoSrc = r.photo && !r.photo.startsWith('http') && !r.photo.startsWith('/') ? '/' + r.photo : r.photo;
          const photo = photoSrc ? `<img class="review-photo" src="${escapeHtml(photoSrc)}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none'" />` : '';
          const inner = `${meta}${star}${title}${body}${photo}`;
          if (r.link) {
            return `<a href="${escapeHtml(r.link)}" target="_blank" rel="noopener noreferrer" class="review-card">${inner}</a>`;
          }
          return `<article class="review-card">${inner}</article>`;
        };

        const colClasses = ['reviews-col reviews-col-up', 'reviews-col reviews-col-mid', 'reviews-col reviews-col-up'];
        reviewsCols.innerHTML = cols.map((col, i) => {
          const inner = col.map(renderCard).join('') + col.map(renderCard).join(''); // duplicate for seamless scroll
          return `<div class="${colClasses[i]}">${inner}</div>`;
        }).join('');
      })
      .catch(() => { /* graceful */ });
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function templateSubtitle(item) {
    if (item.kind === 'ahead') return `in ${randomInt(5, 420)} days`;
    if (item.kind === 'streak') return `${randomInt(7, 365)} days`;
    if (item.kind === 'habit') return `${randomInt(3, 42)} days`;
    return String(item.category || 'Template');
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function templatePhotoUrl(item) {
    const photo = String(item.photo || '');
    const match = photo.match(/photos\/([^/?#]+)(?:[/?#]|$)/);
    if (match) {
      const slug = match[1];
      const id = slug.slice(-11);
      return `https://unsplash.com/photos/${id}/download?force=true&w=520`;
    }
    const query = encodeURIComponent(item.category || item.title || item.kind || 'time');
    return `https://source.unsplash.com/520x680/?${query}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  // ───────── Footer counter ─────────
  const counter = document.getElementById('userCounter');
  if (counter) {
    const BASE_COUNT = 2100000;
    const BASE_DATE = new Date('2026-01-01').getTime();
    // ~600 new installs per day → 600 / (24*60*60*1000) per ms.
    const RATE_MS = 600 / 86400000;
    const fmt = new Intl.NumberFormat('en-US');
    const cycleRoot = counter.closest('[data-counter-cycle]');
    const suffixEl = cycleRoot ? cycleRoot.querySelector('[data-counter-suffix]') : null;

    const installs = () => BASE_COUNT + Math.floor((Date.now() - BASE_DATE) * RATE_MS);
    // Multipliers approximate how each metric scales relative to total installs.
    const modes = [
      { mult: 1.00, text: 'people making every moment count.' },
      { mult: 1.60, text: 'habits building better people.' },
      { mult: 1.40, text: 'special dates ahead to be fulfilled.' },
      { mult: 0.45, text: 'strong streaks that are kept running.' },
      { mult: 0.12, text: 'friends sharing their goals to stay accountable.' },
    ];
    let mode = 0;

    // Pull localised suffix strings from the inert <template> embedded in the page.
    // The i18n build replaces each span's text per locale, so this gives us
    // ready-made translations without any JS-side i18n bundle.
    if (cycleRoot) {
      const tpl = cycleRoot.querySelector('template[data-counter-suffixes]');
      if (tpl) {
        tpl.content.querySelectorAll('[data-counter-mode]').forEach(node => {
          const idx = parseInt(node.getAttribute('data-counter-mode'), 10);
          if (modes[idx] && node.textContent.trim()) modes[idx].text = node.textContent.trim();
        });
      }
    }

    const renderNumber = () => fmt.format(Math.floor(installs() * modes[mode].mult));
    const renderSuffix = () => modes[mode].text;

    const paint = () => {
      counter.textContent = renderNumber();
      if (suffixEl) suffixEl.textContent = renderSuffix();
    };

    paint();

    // Tick visibly every few seconds to simulate live growth.
    const tick = () => {
      paint();
      setTimeout(tick, 4000 + Math.random() * 5000);
    };
    setTimeout(tick, 4000 + Math.random() * 5000);

    // Rotate the message automatically so the footer remains passive navigation.
    if (cycleRoot) {
      setInterval(() => {
        mode = (mode + 1) % modes.length;
        paint();
      }, 12000);
    }
  }

  // ───────── Match QR card width to download button width (desktop) ─────────
  (() => {
    const sync = () => {
      document.querySelectorAll('.hero-download-group, .download-group').forEach(group => {
        const btn = group.querySelector('.dl-btn');
        const qr = group.querySelector('.qr-flip');
        if (!btn || !qr) return;
        const w = btn.getBoundingClientRect().width;
        if (w > 0) {
          qr.style.setProperty('width', `${w}px`, 'important');
          qr.style.setProperty('height', `${w}px`, 'important');
          qr.style.setProperty('min-height', `${w}px`, 'important');
        }
      });
    };
    sync();
    window.addEventListener('resize', sync, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
  })();

  // ───────── Mobile hero parallax (fade + blur + slow scroll) ─────────
  (() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const heroText = document.querySelector('.hero-text');
    const heroFloater = document.querySelector('.hero-floater');
    if (!heroText) return;
    const mqMobile = window.matchMedia('(max-width: 900px)');

    const clamp01 = (n) => Math.max(0, Math.min(1, n));
    const reset = (el) => {
      if (!el) return;
      el.style.opacity = '';
      el.style.filter = '';
      el.style.transform = '';
      el.style.pointerEvents = '';
    };

    const update = () => {
      const y = window.scrollY || 0;
      if (!mqMobile.matches) {
        reset(heroText);
        reset(heroFloater);
        return;
      }
      const start = 10, range = 220;
      const t = clamp01((y - start) / range);
      const blurMax = 8;
      const parallax = (y * 0.45).toFixed(1);
      const op = (1 - t).toFixed(3);
      const blur = (t * blurMax).toFixed(2);
      heroText.style.opacity = op;
      heroText.style.filter = `blur(${blur}px)`;
      heroText.style.transform = `translateY(${parallax}px)`;
      if (heroFloater) {
        const floaterRange = 90;
        const tf = clamp01((y - start) / floaterRange);
        const opF = (1 - tf).toFixed(3);
        const fallF = (tf * 20).toFixed(1);
        heroFloater.style.opacity = opF;
        heroFloater.style.transform = `translate(-50%, ${fallF}px)`;
        heroFloater.style.pointerEvents = tf >= 1 ? 'none' : '';
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    mqMobile.addEventListener?.('change', update);
  })();

  // ───────── Time Between: days to Dec 31 ─────────
  (() => {
    const midEl = document.querySelector('.ba-tb-mid');
    if (!midEl) return;
    const now = new Date();
    const dec31 = new Date(now.getFullYear(), 11, 31);
    const msPerDay = 86400000;
    const days = Math.ceil((dec31 - now) / msPerDay);
    midEl.textContent = '+ ' + days + ' days';
  })();

  // ───────── Phone dot scan animation ─────────
  (() => {
    const dotsEl = document.querySelector('.ba-phone-dots');
    if (!dotsEl) return;

    const COLS = 10, ROWS = 20;
    const total = COLS * ROWS;
    const dots = [];

    for (let i = 0; i < total; i++) {
      const s = document.createElement('span');
      dotsEl.appendChild(s);
      dots.push(s);
    }

    let idx = 0;
    const MS_PER_DOT = 220;
    const PAUSE_MS = 1200;

    function tick() {
      if (idx < total) {
        dots[idx].classList.add('dim');
        idx++;
        setTimeout(tick, MS_PER_DOT);
      } else {
        setTimeout(() => {
          dots.forEach(d => d.classList.remove('dim'));
          idx = 0;
          setTimeout(tick, 400);
        }, PAUSE_MS);
      }
    }
    tick();
  })();
})();
