/* ============================================================
   Adel & Roaa — Katb Ketab
   overlay · sprinkles · countdown · wish bubble galaxy
   ============================================================ */
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const NAVY = '#0d1f3c';
const COLORS = {
  starLightSections: ['#b9c2cf', '#a9cfe8'],
  starDarkSections: ['#c9ced6', '#a9cfe8', '#ffffff'],
  petal: '#a9cfe8',
  petalSoft: '#cfe5f5',
  flowerCenter: '#ffffff',
  flowerRing: '#c9ced6',
};

/* ============================================================
   1. INVITATION OPENING OVERLAY
   ============================================================ */

function buildOverlayStars() {
  const holder = $('#overlay-stars');
  if (!holder) return;
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.className = 'star-sprinkle';
    const size = 5 + Math.random() * 10;
    s.style.cssText = `
      left:${Math.random() * 100}%; top:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      --tw:${2 + Math.random() * 3}s; --twd:${Math.random() * 3}s;`;
    s.innerHTML = starSVG('#c9ced6');
    holder.appendChild(s);
  }
}

function buildBirds() {
  const holder = $('#birds');
  if (!holder) return;
  const tints = ['#a9cfe8', '#ffffff', '#c9ced6'];
  const count = 8;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.className = 'bird';
    const tint = tints[i % tints.length];
    b.style.setProperty('--top', `${10 + Math.random() * 55}%`);
    b.style.setProperty('--size', `${26 + Math.random() * 30}px`);
    b.style.setProperty('--dur', `${2.4 + Math.random() * 1.3}s`);
    b.style.setProperty('--del', `${Math.random() * 0.9}s`);
    b.style.setProperty('--lift', `${-(5 + Math.random() * 12)}vh`);
    b.style.setProperty('--lift2', `${-(10 + Math.random() * 16)}vh`);
    b.innerHTML = `
      <svg viewBox="0 0 48 24" aria-hidden="true">
        <path class="wing-l" d="M24 15 Q13 3 1 9 Q12 13 24 18 Z" fill="${tint}"/>
        <path class="wing-r" d="M24 15 Q35 3 47 9 Q36 13 24 18 Z" fill="${tint}"/>
        <ellipse cx="24" cy="16.2" rx="5" ry="3" fill="${tint}"/>
        <circle cx="28.5" cy="14.6" r="2" fill="${tint}"/>
      </svg>`;
    holder.appendChild(b);
  }
}

function initOverlay() {
  const overlay = $('#invite-overlay');
  if (!overlay) return;
  buildOverlayStars();
  document.body.classList.add('intro-pending');

  const revealHero = () => {
    document.body.classList.remove('intro-pending');
    document.body.classList.add('intro-done');
  };

  // reduced-motion guests get a short, gentle version of the intro
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const birdsLayer = $('#birds');
    if (birdsLayer) birdsLayer.remove();
    document.body.style.overflow = 'hidden';
    let quickOpened = false;
    const openQuick = () => {
      if (quickOpened) return;
      quickOpened = true;
      overlay.classList.add('open');
      setTimeout(() => {
        overlay.classList.add('done');
        revealHero();
        document.body.style.overflow = '';
        setTimeout(() => overlay.remove(), 600);
      }, 900);
    };
    overlay.addEventListener('click', openQuick);
    return;
  }

  buildBirds();

  document.body.style.overflow = 'hidden';
  let opened = false;

  const open = () => {
    if (opened) return;
    opened = true;
    overlay.classList.add('open');

    // once the card is fully out and read, birds sweep across
    // as the envelope fades into the hero, which rises bit by bit
    setTimeout(() => {
      overlay.classList.add('done');
      revealHero();
      const birds = $('#birds');
      if (birds) {
        birds.classList.add('fly');
        setTimeout(() => birds.remove(), 6500);
      }
      document.body.style.overflow = '';
    }, 4400);

    setTimeout(() => overlay.remove(), 6100);
  };

  overlay.addEventListener('click', open);
}

/* ============================================================
   2. SPRINKLED SILVER STARS & BABY FLOWERS
   ============================================================ */

function starSVG(color) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${color}" d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z"/></svg>`;
}

function flowerSVG(size) {
  const petals = [];
  for (let a = 0; a < 5; a++) {
    petals.push(
      `<ellipse cx="20" cy="10.5" rx="4.6" ry="8" fill="${a % 2 ? COLORS.petalSoft : COLORS.petal}" transform="rotate(${a * 72} 20 20)"/>`
    );
  }
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" aria-hidden="true">
    ${petals.join('')}
    <circle cx="20" cy="20" r="4.6" fill="${COLORS.flowerCenter}" stroke="${COLORS.flowerRing}" stroke-width="1.6"/>
  </svg>`;
}

function sprinkleSection(section, dark) {
  const area = section.offsetWidth * section.offsetHeight;
  const starCount = Math.min(16, Math.max(7, Math.round(area / 90000)));
  const flowerCount = Math.min(5, Math.max(2, Math.round(area / 260000)));
  const palette = dark ? COLORS.starDarkSections : COLORS.starLightSections;

  for (let i = 0; i < starCount; i++) {
    const s = document.createElement('span');
    s.className = 'star-sprinkle';
    const size = 6 + Math.random() * 12;
    s.style.cssText = `
      left:${2 + Math.random() * 96}%; top:${3 + Math.random() * 94}%;
      width:${size}px; height:${size}px;
      --tw:${2.2 + Math.random() * 3.4}s; --twd:${Math.random() * 4}s;`;
    s.innerHTML = starSVG(palette[Math.floor(Math.random() * palette.length)]);
    section.appendChild(s);
  }

  for (let i = 0; i < flowerCount; i++) {
    const f = document.createElement('span');
    f.className = 'flower-sprinkle';
    const size = 14 + Math.random() * 14;
    // keep flowers to the left/right edges so text stays readable
    const onLeft = Math.random() < 0.5;
    const xPct = onLeft ? 1 + Math.random() * 8 : 91 + Math.random() * 8;
    f.style.cssText = `
      left:${xPct}%; top:${6 + Math.random() * 82}%;
      width:${size}px; height:${size}px;
      --sw:${4.5 + Math.random() * 3.5}s;`;
    f.dataset.speed = (0.03 + Math.random() * 0.07).toFixed(3);
    f.innerHTML = flowerSVG(size);
    section.appendChild(f);
  }
}

function initSprinkles() {
  const darkSections = ['.hero', '.details-section', '.wishes-section', '.footer'];
  const lightSections = ['.countdown-section', '.gallery-section'];
  darkSections.forEach(sel => $$(sel).forEach(el => sprinkleSection(el, true)));
  lightSections.forEach(sel => $$(sel).forEach(el => sprinkleSection(el, false)));
}

function initParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const flowers = $$('.flower-sprinkle');
  if (!flowers.length) return;
  let ticking = false;

  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    for (const f of flowers) {
      const r = f.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) continue;
      const speed = parseFloat(f.dataset.speed || '0.05');
      const offset = (r.top + r.height / 2 - vh / 2) * speed * -1;
      f.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  };

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ============================================================
   3. SCROLL REVEALS
   ============================================================ */

function initReveals() {
  const items = $$('.reveal, .reveal-child');
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

/* ============================================================
   4. COUNTDOWN
   ============================================================ */

function initCountdown() {
  const target = new Date('2026-10-05T00:00:00');
  const els = {
    d: $('#cd-days'), h: $('#cd-hours'), m: $('#cd-mins'), s: $('#cd-secs'),
  };
  if (!els.d) return;

  const pad = n => String(n).padStart(2, '0');
  const tick = () => {
    let diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const mins = Math.floor(diff / 60000);
    diff -= mins * 60000;
    const secs = Math.floor(diff / 1000);
    els.d.textContent = days;
    els.h.textContent = pad(hours);
    els.m.textContent = pad(mins);
    els.s.textContent = pad(secs);
  };
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   5. LITTLE MOMENTS CAROUSEL
   ============================================================ */

function initCarousel() {
  const track = $('#carousel-track');
  if (!track) return;
  const slides = $$('.carousel-slide', track);
  const dotsBox = $('#car-dots');

  // landscape photos get object-fit: contain so nobody is cropped out
  $$('img', track).forEach(img => {
    const apply = () => {
      if (img.naturalWidth > img.naturalHeight) img.classList.add('wide');
    };
    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener('load', apply);
  });

  const current = () => Math.round(track.scrollLeft / track.clientWidth);
  const goTo = i => {
    const clamped = Math.min(slides.length - 1, Math.max(0, i));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  };

  const dots = slides.map((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', `Go to photo ${i + 1}`);
    if (i === 0) b.classList.add('active');
    b.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(b);
    return b;
  });

  $('#car-prev').addEventListener('click', () => goTo(current() - 1));
  $('#car-next').addEventListener('click', () => goTo(current() + 1));

  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const i = Math.min(slides.length - 1, Math.max(0, current()));
      dots.forEach((d, di) => d.classList.toggle('active', di === i));
    });
  }, { passive: true });

  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current() - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current() + 1); }
  });
}

/* ============================================================
   6. WISH BUBBLE GALAXY
   ============================================================ */

const FALLBACK_WISHES = [
  { name: 'Adel & Roaa', message: 'Thank you for being part of the beginning of our forever.' },
  { name: 'The Families', message: 'Two hearts, one path — may your days be filled with baraka and joy.' },
];

class BubbleGalaxy {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bubbles = [];
    this.particles = [];
    this.bgStars = [];
    this.hover = null;
    this.running = true;
    this.visible = true;
    this.lastTrail = 0;

    this.resize = this.resize.bind(this);
    this.loop = this.loop.bind(this);

    this.resize();
    new ResizeObserver(this.resize).observe(canvas.parentElement);
    this.makeBgStars();
    this.bindPointer();
    this.bindVisibility();
    requestAnimationFrame(this.loop);
  }

  /* ---------- setup ---------- */

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    this.canvas.width = Math.round(this.w * dpr);
    this.canvas.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const b of this.bubbles) this.keepInBounds(b);
  }

  makeBgStars() {
    this.bgStars = [];
    for (let i = 0; i < 70; i++) {
      this.bgStars.push({
        x: Math.random(), y: Math.random(),
        r: 0.5 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
      });
    }
  }

  bindVisibility() {
    document.addEventListener('visibilitychange', () => {
      this.running = !document.hidden;
      if (this.running) requestAnimationFrame(this.loop);
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        const was = this.visible;
        this.visible = entries[0].isIntersecting;
        if (this.visible && !was) requestAnimationFrame(this.loop);
      }, { threshold: 0.02 }).observe(this.canvas);
    }
  }

  /* ---------- bubbles ---------- */

  layoutText(wish) {
    const ctx = this.ctx;
    const msgFont = size => `500 ${size}px Quicksand, sans-serif`;
    const msgSize = 14;
    const maxWidth = 168;

    ctx.font = msgFont(msgSize);
    const words = String(wish.message).split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
        if (lines.length === 5) break;
      } else {
        line = test;
      }
    }
    if (line && lines.length < 5) lines.push(line);
    if (words.join(' ') !== lines.join(' ')) {
      let last = lines[lines.length - 1] || '';
      while (ctx.measureText(last + '…').width > maxWidth && last.length) {
        last = last.slice(0, -1);
      }
      lines[lines.length - 1] = last.trim() + '…';
    }

    const lineH = 19;
    const textW = Math.max(...lines.map(l => ctx.measureText(l).width), 40);
    const name = `— ${wish.name}`;
    ctx.font = `600 12px Quicksand, sans-serif`;
    const nameW = ctx.measureText(name).width;
    const contentW = Math.max(textW, nameW);
    const contentH = lines.length * lineH + 20; // gap + name line

    const r = Math.max(52, Math.min(122, Math.max(contentW, contentH) / 2 + 26));
    return { lines, name, r, lineH, msgFont: msgFont(msgSize) };
  }

  addWish(wish, { pop = false } = {}) {
    const layout = this.layoutText(wish);
    const pos = this.findSpot(layout.r);
    const b = {
      ...layout,
      wish,
      x: pos.x,
      y: pos.y,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.22,
      phase: Math.random() * Math.PI * 2,
      scale: pop ? 0 : 1,
      targetScale: 1,
      speedMul: 1,
      born: performance.now(),
    };
    if (Math.abs(b.vx) < 0.06) b.vx = 0.06 * Math.sign(b.vx || 1);
    this.bubbles.push(b);
    if (pop) this.burst(b.x, b.y, 20);
    this.keepInBounds(b);
    return b;
  }

  // sample candidate spots and keep the one furthest from other bubbles
  findSpot(r) {
    let best = null;
    let bestScore = -Infinity;
    for (let i = 0; i < 16; i++) {
      const x = r + Math.random() * Math.max(1, this.w - r * 2);
      const y = r + Math.random() * Math.max(1, this.h - r * 2);
      let score = Infinity;
      for (const o of this.bubbles) {
        score = Math.min(score, Math.hypot(x - o.x, y - o.y) - o.r - r);
      }
      if (score > bestScore) { bestScore = score; best = { x, y }; }
    }
    return best;
  }

  keepInBounds(b) {
    b.x = Math.min(Math.max(b.x, b.r), Math.max(b.r, this.w - b.r));
    b.y = Math.min(Math.max(b.y, b.r), Math.max(b.r, this.h - b.r));
  }

  /* ---------- particles ---------- */

  burst(x, y, n = 14) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + Math.random() * 0.4;
      const sp = 1 + Math.random() * 2.2;
      this.particles.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 0, max: 46 + Math.random() * 30,
        size: 1.5 + Math.random() * 2.8,
        color: ['#c9ced6', '#a9cfe8', '#ffffff'][i % 3],
      });
    }
  }

  trail(x, y) {
    const now = performance.now();
    if (now - this.lastTrail < 46) return;
    this.lastTrail = now;
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.5,
        life: 0, max: 34 + Math.random() * 22,
        size: 1 + Math.random() * 2,
        color: ['#c9ced6', '#a9cfe8'][i % 2],
      });
    }
  }

  /* ---------- pointer ---------- */

  canvasPos(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  bindPointer() {
    const hint = $('#galaxy-hint');
    const hideHint = () => hint && hint.classList.add('hide');

    this.canvas.addEventListener('pointermove', e => {
      const { x, y } = this.canvasPos(e);
      this.pickBubble(x, y);
      this.trail(x, y);
      hideHint();
    });
    this.canvas.addEventListener('pointerdown', e => {
      const { x, y } = this.canvasPos(e);
      this.pickBubble(x, y);
      this.trail(x, y);
      hideHint();
    });
    this.canvas.addEventListener('pointerleave', () => this.setHover(null));
  }

  pickBubble(x, y) {
    let found = null;
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      const rr = b.r * b.scale + 6;
      if ((x - b.x) ** 2 + (y - b.y) ** 2 <= rr * rr) { found = b; break; }
    }
    this.setHover(found);
  }

  setHover(b) {
    if (this.hover === b) return;
    this.hover = b;
    this.canvas.style.cursor = b ? 'pointer' : 'default';
    for (const bub of this.bubbles) bub.targetScale = bub === b ? 1.5 : 1;
  }

  /* ---------- frame ---------- */

  loop(now) {
    if (!this.running || !this.visible) return;
    requestAnimationFrame(this.loop);
    const ctx = this.ctx;
    const t = now / 1000;

    ctx.clearRect(0, 0, this.w, this.h);

    // twinkling background stars
    for (const s of this.bgStars) {
      const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
      ctx.globalAlpha = a;
      ctx.fillStyle = '#c9ced6';
      ctx.beginPath();
      ctx.arc(s.x * this.w, s.y * this.h, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // bubbles — update all, then draw with the hovered one on top
    for (const b of this.bubbles) {
      // ease scale (pop-in overshoot for new wishes)
      const ease = b.scale < 1 && performance.now() - b.born < 700 ? 0.16 : 0.09;
      b.scale += (b.targetScale - b.scale) * ease;

      const hovered = this.hover === b;
      b.speedMul += ((hovered ? 0.08 : 1) - b.speedMul) * 0.08;

      b.x += (b.vx + Math.sin(t * 0.6 + b.phase) * 0.12) * b.speedMul;
      b.y += (b.vy + Math.cos(t * 0.5 + b.phase) * 0.1) * b.speedMul;

      // soft wrap around edges
      const m = b.r * b.scale + 4;
      if (b.x < -m) b.x = this.w + m; else if (b.x > this.w + m) b.x = -m;
      if (b.y < -m) b.y = this.h + m; else if (b.y > this.h + m) b.y = -m;
    }
    for (const b of this.bubbles) if (b !== this.hover) this.drawBubble(b);
    if (this.hover) this.drawBubble(this.hover);

    // particles
    this.particles = this.particles.filter(p => p.life < p.max);
    for (const p of this.particles) {
      p.life++;
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.985; p.vy *= 0.985;
      const k = 1 - p.life / p.max;
      ctx.globalAlpha = k;
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.life * 0.05);
      const s = p.size * (0.6 + 0.4 * k);
      ctx.beginPath();
      // tiny 4-point star
      ctx.moveTo(0, -s * 2);
      ctx.quadraticCurveTo(0, 0, s * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, s * 2);
      ctx.quadraticCurveTo(0, 0, -s * 2, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  drawBubble(b) {
    const ctx = this.ctx;
    const r = b.r * b.scale;
    if (r < 1) return;

    ctx.save();
    ctx.translate(b.x, b.y);

    // halo
    ctx.beginPath();
    ctx.arc(0, 0, r + 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(169, 207, 232, 0.10)';
    ctx.fill();

    // body
    const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.15, 0, 0, r);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.96)');
    g.addColorStop(0.72, 'rgba(234, 244, 251, 0.9)');
    g.addColorStop(1, 'rgba(169, 207, 232, 0.82)');
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = 'rgba(201, 206, 214, 0.9)';
    ctx.stroke();

    // glass highlight
    ctx.beginPath();
    ctx.arc(-r * 0.34, -r * 0.4, r * 0.32, Math.PI * 0.9, Math.PI * 1.7);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // text
    const totalH = b.lines.length * b.lineH + 18;
    let ty = -totalH / 2 + b.lineH * 0.72;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = b.msgFont;
    ctx.fillStyle = NAVY;
    for (const line of b.lines) {
      ctx.fillText(line, 0, ty);
      ty += b.lineH;
    }
    // writer name — small, under the wish
    ctx.font = '600 11.5px Quicksand, sans-serif';
    ctx.fillStyle = 'rgba(107, 116, 132, 0.95)';
    ctx.fillText(b.name, 0, ty + 4);

    ctx.restore();
  }
}

/* ============================================================
   7. WISHES — LOAD & SUBMIT
   ============================================================ */

async function loadWishes() {
  try {
    const res = await fetch('/api/wishes', { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('bad status');
    const data = await res.json();
    if (Array.isArray(data) && data.length) return data;
    return FALLBACK_WISHES;
  } catch {
    return FALLBACK_WISHES;
  }
}

async function postWish(wish) {
  const res = await fetch('/api/wishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(wish),
  });
  if (!res.ok) throw new Error('failed');
  return res.json().catch(() => ({}));
}

function initWishForm(galaxy) {
  const form = $('#wish-form');
  if (!form) return;
  const nameEl = $('#wish-name');
  const msgEl = $('#wish-message');
  const btn = $('#wish-submit');
  const feedback = $('#wish-feedback');
  const counter = $('#char-count');

  msgEl.addEventListener('input', () => {
    counter.textContent = `${msgEl.value.length} / 220`;
  });

  const say = (text, isError = false) => {
    feedback.textContent = text;
    feedback.classList.toggle('error', isError);
    feedback.classList.add('show');
    clearTimeout(say._t);
    say._t = setTimeout(() => feedback.classList.remove('show'), 5000);
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = nameEl.value.trim();
    const message = msgEl.value.trim();
    if (!name || !message) {
      say('Please add your name and a little wish first.', true);
      return;
    }
    btn.disabled = true;
    try {
      await postWish({ name, message });
      const b = galaxy.addWish({ name, message }, { pop: true });
      galaxy.setHover(b);
      form.reset();
      counter.textContent = '0 / 220';
      say('Your wish has joined our little galaxy — thank you!');
    } catch {
      say('The stars could not hear that just now — please try again.', true);
    } finally {
      btn.disabled = false;
    }
  });
}

/* ============================================================
   BOOT
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  initOverlay();
  initSprinkles();
  initParallax();
  initReveals();
  initCountdown();
  initCarousel();

  const canvas = $('#galaxy');
  if (canvas) {
    const galaxy = new BubbleGalaxy(canvas);
    const wishes = await loadWishes();
    wishes.forEach(w => galaxy.addWish(w));
    initWishForm(galaxy);
  }
});
