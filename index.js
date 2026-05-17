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

  // ───────── Scroll-text per-word highlight ─────────
  const scrollText = document.getElementById('scrollText');
  if (scrollText) {
    const raw = scrollText.textContent.trim();
    scrollText.textContent = '';
    raw.split(/\s+/).forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'scroll-word';
      span.textContent = w + ' ';
      scrollText.appendChild(span);
    });
    const words = scrollText.querySelectorAll('.scroll-word');
    const update = () => {
      const vh = window.innerHeight;
      words.forEach(w => {
        const r = w.getBoundingClientRect();
        const center = r.top + r.height / 2;
        // light up when the word's center is in the upper 60% of the viewport
        if (center < vh * 0.7 && center > vh * 0.15) w.classList.add('is-lit');
        else w.classList.remove('is-lit');
      });
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
  const SYMBOLS = { ahead: '⏳', habit: '✓', streak: '🔥' };

  const carouselTrack = document.getElementById('carouselTrack');
  if (carouselTrack) {
    fetch('/TemplateLibrary.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        // Shuffle & pick ~24
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 24);
        if (shuffled.length === 0) return;

        const html = shuffled.map(item => {
          const accent = COLORS[(item.color || 'orange').toLowerCase()] || COLORS.orange;
          const symbol = SYMBOLS[item.kind] || '•';
          // Convert Unsplash share URL → direct image URL
          let photo = item.photo || '';
          const m = photo.match(/photos\/([\w-]+)/);
          const src = m ? `https://source.unsplash.com/${m[1].split('-').pop()}/400x500`
                        : `https://source.unsplash.com/random/400x500/?${encodeURIComponent(item.category || item.kind || 'time')}`;
          const title = (item.title || '').replace(/</g, '&lt;');
          return `<div class="carousel-card" role="listitem" style="--card-accent:${accent}">
            <img src="${src}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none'" />
            <span class="card-accent" aria-hidden="true"></span>
            <div class="card-meta"><span>${title}</span><span class="symbol" aria-hidden="true">${symbol}</span></div>
          </div>`;
        }).join('');

        // Duplicate for infinite scroll loop
        carouselTrack.innerHTML = html + html;

        // Auto-play
        let offset = 0;
        const speed = 0.5; // px per frame ≈ 30px/s at 60fps
        let paused = false;
        const wrap = carouselTrack.parentElement;
        wrap.addEventListener('mouseenter', () => paused = true);
        wrap.addEventListener('mouseleave', () => paused = false);
        wrap.addEventListener('focusin', () => paused = true);
        wrap.addEventListener('focusout', () => paused = false);

        const halfWidth = () => carouselTrack.scrollWidth / 2;
        const tick = () => {
          if (!paused) {
            offset -= speed;
            const hw = halfWidth();
            if (-offset >= hw) offset += hw;
            carouselTrack.style.transform = `translate3d(${offset}px, 0, 0)`;
          }
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
        reviews.forEach((r, i) => cols[i % 3].push(r));

        const renderCard = (r) => {
          const star = (r.type === 'app-store' && r.rating) ? `<div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>` : '';
          const meta = `<div class="review-meta">${escapeHtml(r.type)}${r.author ? ' · ' + escapeHtml(r.author) : ''}</div>`;
          const title = r.title ? `<div class="review-title">${escapeHtml(r.title)}</div>` : '';
          return `<article class="review-card">${meta}${star}${title}<div>${escapeHtml(r.text || '')}</div></article>`;
        };

        const colClasses = ['reviews-col reviews-col-up', 'reviews-col', 'reviews-col reviews-col-down'];
        reviewsCols.innerHTML = cols.map((col, i) => {
          const inner = col.map(renderCard).join('') + col.map(renderCard).join(''); // duplicate for seamless scroll
          return `<div class="${colClasses[i]}">${inner}</div>`;
        }).join('');
      })
      .catch(() => { /* graceful */ });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c]);
  }

  // ───────── Footer counter ─────────
  const counter = document.getElementById('userCounter');
  if (counter) {
    const BASE_COUNT = 100000;
    const BASE_DATE = new Date('2026-01-01').getTime();
    const RATE = 1 / (7 * 60 * 1000); // ~1 new user per 7 min — same formula on all devices
    const fmt = new Intl.NumberFormat('en-US');
    let current = BASE_COUNT + Math.floor((Date.now() - BASE_DATE) * RATE);

    counter.textContent = fmt.format(current);

    // Tick +1 every 4–9 seconds to feel live
    const tick = () => {
      current += 1;
      counter.textContent = fmt.format(current);
      setTimeout(tick, 4000 + Math.random() * 5000);
    };
    setTimeout(tick, 4000 + Math.random() * 5000);
  }
})();
