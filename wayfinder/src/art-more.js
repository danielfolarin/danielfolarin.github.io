/* Wayfinder — scene library for the eight journeys.
 * makeScene() builds a layered landscape from a short description, so each journey
 * can have its own settings without hand-writing every layer. person() draws any character. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const A = WF.art;
  const { ridge, scatter, tuft, rock, scrub, pathBand, grad, n } = A.lib;

  const yAt = (y, x) => (typeof y === 'function' ? y(x) : y);

  function shade(hex, amt = -0.25) {
    const v = parseInt(hex.slice(1), 16);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c * (1 + amt))));
    return `#${[(v >> 16) & 255, (v >> 8) & 255, v & 255].map((c) => f(c).toString(16).padStart(2, '0')).join('')}`;
  }

  /* ---------- characters ---------- */

  /** A standing figure facing right. Options pick colours and a few details. */
  function person(o = {}) {
    const cloak = o.cloak || '#6c6b40';
    const skin = o.skin || '#b9876a';
    const s = o.s || 1;
    let head;
    if (o.wrap) {
      head = `<path d="M-13,-80 C-18,-98 -6,-110 4,-108 C14,-106 17,-94 13,-80 C6,-74 -6,-74 -13,-80 Z" fill="${o.wrap}"/><ellipse cx="4" cy="-91" rx="6" ry="7.5" fill="${skin}"/>`;
      if (o.veil) head += `<path d="M-13,-80 C-16,-66 -20,-54 -22,-44 L-12,-46 C-12,-58 -10,-70 -8,-78 Z" fill="${o.wrap}"/>`;
    } else {
      head = `<ellipse cx="3" cy="-92" rx="7" ry="8.5" fill="${skin}"/>`;
      if (o.hair) head += `<path d="M-5,-94 C-6,-106 10,-108 12,-98 C8,-102 0,-100 -4,-90 Z" fill="${o.hair}"/>`;
      if (o.longHair) head += `<path d="M-5,-98 C-16,-90 -16,-62 -10,-50 L-3,-52 C-8,-66 -6,-86 -1,-96 Z" fill="${o.longHair}"/>`;
    }
    const beard = o.beard ? `<path d="M-1,-88 C0,-77 10,-75 12,-87 C9,-83 3,-83 -1,-88 Z" fill="${o.beard}"/>` : '';
    const staff = o.staff ? `<line x1="-24" y1="-112" x2="-22" y2="0" stroke="#7d5c3c" stroke-width="3.2" stroke-linecap="round"/><path d="M-11,-72 C-17,-66 -21,-62 -22,-58" stroke="${cloak}" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="-22.5" cy="-58" r="3.6" fill="${skin}"/>` : '';
    const arm = `<path d="M8,-72 C14,-62 16,-54 16,-48" stroke="${cloak}" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="16" cy="-47" r="3.6" fill="${skin}"/>`;
    return `<g class="figure" transform="scale(${s})">
      <ellipse cx="0" cy="2" rx="22" ry="5" fill="#000" opacity=".28"/>
      <path d="M-6,-24 L-7,-2 M6,-24 L7,-2" stroke="#2a251c" stroke-width="7" stroke-linecap="round"/>
      <path d="M-15,-82 C-24,-60 -27,-36 -23,-18 C-8,-14 10,-14 23,-18 C25,-40 21,-64 13,-82 Z" fill="${cloak}"/>
      <path d="M-15,-82 C-24,-60 -27,-36 -23,-18 C-17,-17 -13,-17 -10,-18 C-14,-40 -13,-62 -7,-82 Z" fill="${shade(cloak)}"/>
      <path d="M0,-78 C-2,-60 -1,-40 1,-20 L6,-20 C7,-40 6,-60 5,-78 Z" fill="${o.inner || '#e6d7bd'}" opacity=".7"/>
      ${o.belt ? `<path d="M-20,-46 L21,-48" stroke="${o.belt}" stroke-width="3"/>` : ''}
      ${head}${beard}${staff}${arm}${o.hold || ''}
    </g>`;
  }
  A.person = person;

  const CAST = {
    abiel: { cloak: '#5f6a3e', wrap: '#d9ccb0', beard: '#4a3524', skin: '#b07c5c', staff: true, belt: '#8a6a44' },
    purah: { cloak: '#7a5a3c', hair: '#2c2018', skin: '#a8765a', belt: '#4a3a2a', s: 0.92 },
    miri: { cloak: '#3f4a6e', wrap: '#b9b4c4', skin: '#b58a6c', veil: true },
    ruth: { cloak: '#8c5a4a', wrap: '#e2c9a6', skin: '#a8765a', veil: true, s: 0.95 },
    naomi: { cloak: '#4b4a55', wrap: '#cfc8bc', skin: '#b58a6c', veil: true, staff: true },
    woman1: { cloak: '#7a6a8c', wrap: '#e6dccb', skin: '#9e6e52', veil: true, s: 0.95 },
    woman2: { cloak: '#6f7a4c', wrap: '#d8c7a4', skin: '#b58a6c', veil: true, s: 0.9 },
    sefa: { cloak: '#a4553a', wrap: '#f1e6d2', skin: '#7a5038', veil: true, staff: true },
    hagar: { cloak: '#6a4a6e', wrap: '#e9dcc3', skin: '#7a5038', veil: true },
    iry: { cloak: '#e7dfcb', inner: '#c9b98f', skin: '#8a5c40', hair: '#1c1612', belt: '#c49a4a' },
    guard: { cloak: '#c9b98f', skin: '#8a5c40', hair: '#1c1612', belt: '#8a6a3a', staff: true },
    brother1: { cloak: '#6b4a3a', wrap: '#cbb89a', beard: '#3a2a1e', skin: '#a8765a' },
    brother2: { cloak: '#4e5a6a', hair: '#2a1e16', beard: '#2a1e16', skin: '#b07c5c', s: 0.96 },
    brother3: { cloak: '#7a6a3a', wrap: '#ddd0b4', beard: '#5a4a3a', skin: '#a8765a', s: 1.02 },
    yona: { cloak: '#384a72', wrap: '#d5cdbf', skin: '#a8765a', veil: true },
    fisher: { cloak: '#6a5a4a', hair: '#2a1e16', beard: '#2a1e16', skin: '#a8765a', belt: '#3a2a1e' },
    shoreMan: { cloak: '#efe6d4', inner: '#d9cdb4', hair: '#3a2a1e', beard: '#3a2a1e', skin: '#a8765a' },
    servantGirl: { cloak: '#7a5a6a', wrap: '#e2d4bc', skin: '#a8765a', veil: true, s: 0.9 },
    tavi: { cloak: '#7a3a44', hair: '#2a1e16', skin: '#b07c5c', belt: '#c49a4a' },
    nathan: { cloak: '#5a5a62', wrap: '#e2dccf', beard: '#d8d1c6', skin: '#b07c5c', staff: true },
    ziva: { cloak: '#4f6a3e', wrap: '#e6d7b8', skin: '#a8765a', veil: true },
    lord: { cloak: '#3a3a6a', hair: '#1c1612', beard: '#1c1612', skin: '#b07c5c', belt: '#d4a84a' },
  };
  A.cast = CAST;

  /* ---------- landscape painters ---------- */

  const P = {
    terraces(a, b, seed, y, { line, count = 4, gap = 9 }) {
      let out = '';
      for (let k = 1; k <= count; k++) {
        let d = '';
        for (let x = a; x <= b; x += 40) d += `${x === a ? 'M' : 'L'}${x},${n(yAt(y, x) + k * gap + Math.sin(x / 90 + k) * 1.5)}`;
        out += `<path d="${d}" fill="none" stroke="${line}" stroke-width="1.4" opacity=".7"/>`;
      }
      return out;
    },
    vines(a, b, seed, y, { color, post = '#4a3e34', grape }) {
      return scatter(a, b, seed, 70, (x, r) => {
        const yy = yAt(y, x) + 4;
        const g = grape && r() > 0.5 ? `<circle cx="4" cy="-14" r="3" fill="${grape}"/><circle cx="0" cy="-12" r="3" fill="${grape}"/>` : '';
        return `<g transform="translate(${n(x)},${n(yy)})"><path d="M0,0 V-30" stroke="${post}" stroke-width="2.5"/><ellipse cx="0" cy="-24" rx="${n(14 + r() * 6)}" ry="10" fill="${color}"/><ellipse cx="-8" cy="-18" rx="8" ry="7" fill="${color}"/>${g}</g>`;
      });
    },
    tents(a, b, seed, y, { color, fire, spacing = 120, s = 1, stripe }) {
      return scatter(a, b, seed, spacing, (x, r) => {
        const sc = s * (0.7 + r() * 0.5);
        const lit = fire && r() > 0.35;
        return `<g transform="translate(${n(x)},${n(yAt(y, x) + 4)}) scale(${n(sc)})">
          ${lit ? '<circle cx="40" cy="-4" r="26" fill="url(#wf-glow)"/>' : ''}
          <path d="M-34,0 L-10,-30 L0,-33 L10,-30 L34,0 Z" fill="${color}"/>
          ${stripe ? `<path d="M-24,-12 L24,-12" stroke="${stripe}" stroke-width="3" opacity=".6"/>` : ''}
          <path d="M-7,0 L0,-26 L7,0 Z" fill="#000" opacity=".4"/>
          ${lit ? '<circle cx="40" cy="-3" r="3" fill="#ffd27a"/>' : ''}</g>`;
      });
    },
    buildings(a, b, seed, y, { color, win, spacing = 60, hMin = 26, hMax = 70, dome }) {
      return scatter(a, b, seed, spacing, (x, r) => {
        const w = 30 + r() * 40;
        const hh = hMin + r() * (hMax - hMin);
        const yy = yAt(y, x) + 6;
        let windows = '';
        if (win) for (let i = 0; i < 3; i++) if (r() > 0.45) windows += `<rect x="${n(-w / 2 + 6 + r() * (w - 14))}" y="${n(-hh + 8 + r() * (hh - 18))}" width="4" height="6" rx="1" fill="${win}"/>`;
        const top = dome && r() > 0.8 ? `<path d="M${n(-w / 4)},${n(-hh)} A${n(w / 4)},${n(w / 4)} 0 0 1 ${n(w / 4)},${n(-hh)} Z" fill="${color}"/>` : '';
        return `<g transform="translate(${n(x)},${n(yy)})"><rect x="${n(-w / 2)}" y="${n(-hh)}" width="${n(w)}" height="${n(hh + 20)}" fill="${color}"/>${top}${windows}</g>`;
      });
    },
    palms(a, b, seed, y, { color, spacing = 240, s = 1 }) {
      return scatter(a, b, seed, spacing, (x, r) => {
        const sc = s * (0.8 + r() * 0.5);
        const lean = (r() - 0.5) * 30;
        let fr = '';
        for (let i = 0; i < 7; i++) {
          const ang = (i / 6) * Math.PI;
          const ex = Math.cos(ang) * 48;
          const ey = -Math.sin(ang) * 26 + 14;
          fr += `<path d="M${n(lean)},-120 Q${n(lean + ex * 0.5)},${n(-140 + ey * 0.2)} ${n(lean + ex)},${n(-120 + ey)}" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
        }
        return `<g transform="translate(${n(x)},${n(yAt(y, x) + 4)}) scale(${n(sc)})"><g class="sway slow"><path d="M-4,0 Q${n(lean * 0.3)},-60 ${n(lean)},-120" stroke="${color}" stroke-width="7" fill="none"/>${fr}</g></g>`;
      });
    },
    olives(a, b, seed, y, { color, trunk = '#3a3028', spacing = 180, s = 1 }) {
      return scatter(a, b, seed, spacing, (x, r) => {
        const sc = s * (0.7 + r() * 0.5);
        return `<g transform="translate(${n(x)},${n(yAt(y, x) + 4)}) scale(${n(sc)})"><path d="M-3,0 C-6,-14 4,-22 0,-34" stroke="${trunk}" stroke-width="6" fill="none"/><ellipse cx="0" cy="-44" rx="30" ry="16" fill="${color}"/><ellipse cx="-16" cy="-36" rx="16" ry="10" fill="${color}"/><ellipse cx="16" cy="-38" rx="18" ry="11" fill="${color}"/></g>`;
      });
    },
    water(a, b, top, { color, deep, shine, id }) {
      const gid = `${id}-water`;
      let out = `${grad(gid, [[0, color], [1, deep]])}<rect x="${a}" y="${top}" width="${b - a}" height="${700 - top}" fill="url(#${gid})"/>`;
      if (shine) out += scatter(a, b, 333, 50, (x, r) => `<path d="M${n(x)},${n(top + 6 + r() * 70)} h${n(10 + r() * 34)}" stroke="${shine}" stroke-width="1.5" opacity="${n(0.2 + r() * 0.4)}" stroke-linecap="round"/>`);
      return out;
    },
    wall(a, b, top, bottom, { color, line, id }) {
      let out = `<rect x="${a}" y="${top}" width="${b - a}" height="${bottom - top}" fill="${color}"/>`;
      let k = 0;
      for (let y = top + 28; y < bottom; y += 28) {
        out += `<path d="M${a},${y} H${b}" stroke="${line}" stroke-width="1.5" opacity=".5"/>`;
        const off = (k++ % 2) * 40;
        let d = '';
        for (let x = a + off; x < b; x += 80) d += `M${x},${y - 28} V${y} `;
        out += `<path d="${d}" stroke="${line}" stroke-width="1.2" opacity=".35"/>`;
      }
      return out;
    },
    columns(a, b, { spacing = 260, color, light, top = 60, bottom = 500, w = 36, lotus }) {
      let out = '';
      for (let x = a + spacing / 2; x < b; x += spacing) {
        out += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${bottom - top}" fill="${color}"/>`;
        out += `<rect x="${x - w / 2 + 4}" y="${top}" width="5" height="${bottom - top}" fill="${light}" opacity=".35"/>`;
        out += lotus
          ? `<path d="M${x - w / 2 - 12},${top} Q${x},${top - 46} ${x + w / 2 + 12},${top} Z" fill="${color}"/><path d="M${x - w / 2},${top + 30} H${x + w / 2}" stroke="${light}" stroke-width="4" opacity=".5"/>`
          : `<rect x="${x - w / 2 - 8}" y="${top - 12}" width="${w + 16}" height="14" fill="${color}"/>`;
        out += `<rect x="${x - w / 2 - 8}" y="${bottom - 8}" width="${w + 16}" height="12" fill="${shade(color, -0.2)}"/>`;
      }
      return out;
    },
    barley(a, b, seed, y, { color, head, spacing = 9, h = 34 }) {
      const r = WF.rng(seed);
      let d = '';
      let heads = '';
      for (let x = a; x < b; x += spacing * (0.6 + r())) {
        const yy = yAt(y, x) + 4 + r() * 10;
        const hh = h * (0.7 + r() * 0.5);
        const lean = (r() - 0.5) * 8;
        d += `M${n(x)},${n(yy)} q${n(lean / 2)},${n(-hh / 2)} ${n(lean)},${n(-hh)} `;
        heads += `<ellipse cx="${n(x + lean)}" cy="${n(yy - hh - 4)}" rx="2.2" ry="6" fill="${head}" transform="rotate(${n(lean * 2)} ${n(x + lean)} ${n(yy - hh - 4)})"/>`;
      }
      return `<g class="sway"><path d="${d}" stroke="${color}" stroke-width="1.4" fill="none"/>${heads}</g>`;
    },
    sheep(a, b, seed, y, { spacing = 120 }) {
      return scatter(a, b, seed, spacing, (x, r) => `<g transform="translate(${n(x)},${n(yAt(y, x) + 6)}) scale(${n(0.6 + r() * 0.3)})"><ellipse cx="0" cy="-10" rx="14" ry="8" fill="#ece5d6"/><circle cx="13" cy="-13" r="4.5" fill="#3a3028"/><path d="M-8,-4 V0 M8,-4 V0" stroke="#3a3028" stroke-width="2"/></g>`);
    },
  };
  A.paint = P;

  /* ---------- scene factory ---------- */

  function makeScene(def) {
    const layers = [];
    if (def.back) layers.push({ f: def.back.f || 0.06, draw: def.back.draw });
    const ridgeLayer = (f, spec) => layers.push({
      f,
      draw: (a, b) => {
        const rg = ridge(a, b, spec);
        return (spec.behind ? spec.behind(a, b, rg.y) : '') + `<path d="${rg.d}" fill="${spec.color}"${spec.opacity ? ` opacity="${spec.opacity}"` : ''}/>` + (spec.extra ? spec.extra(a, b, rg.y) : '');
      },
    });
    if (def.far) ridgeLayer(0.1, def.far);
    if (def.mid) ridgeLayer(0.3, def.mid);
    if (def.near) ridgeLayer(0.6, def.near);
    const g = def.ground;
    const seed = g.seed || 7;
    layers.push({
      f: 1,
      draw: (a, b) => {
        const id = `${def.id}-ground`;
        const rg = ridge(a, b, { seed, base: g.base || 482, amp: g.amp == null ? 8 : g.amp });
        let out = grad(id, [[0, g.colors[0]], [0.45, g.colors[1]], [1, g.colors[2]]]);
        if (g.under) out += g.under(a, b, rg.y);
        out += `<path d="${rg.d}" fill="url(#${id})"/>`;
        if (g.scrub) out += scatter(a, b, seed + 1, 170, (x, r) => scrub(x, rg.y(x) + 6, 0.5 + r() * 0.5, g.scrub, r));
        if (g.path) out += pathBand(a, b, seed + 2, g.path, g.pathLight);
        if (g.rock) out += scatter(a, b, seed + 4, 150, (x, r) => rock(x, 548 + r() * 30, 0.6 + r() * 0.5, g.rock, r));
        if (g.tuft) out += scatter(a, b, seed + 6, 140, (x, r) => tuft(x, 545 + r() * 40, 0.8 + r() * 0.4, g.tuft, r));
        if (g.extra) out += g.extra(a, b, rg.y);
        return out;
      },
    });
    if (def.fg) {
      layers.push({
        f: 1.35,
        draw: (a, b) => scatter(a, b, def.fg.seed || 9, def.fg.spacing || 420, (x, r) =>
          (def.fg.tuft === false ? '' : tuft(x, 604, 1.6 + r(), def.fg.color, r)) + rock(x + 50, 606, 1.4, def.fg.color, r)),
      });
    }
    return { mood: def.mood, label: def.label, groundFill: def.groundFill, sky: def.sky, layers };
  }
  A.makeScene = makeScene;

  /* ---------- skies ---------- */
  const SKY = {
    night: (moonX = 0.25) => ({ stops: [[-400, '#060a1c'], [60, '#111a3c'], [240, '#262c55'], [360, '#433f63'], [420, '#5e5470']], stars: 1.1, starLine: 330, moon: { x: moonX, y: 90, r: 14, shade: '#10183a' } }),
    predawn: { stops: [[-400, '#141b44'], [80, '#2c3564'], [230, '#5a5a86'], [330, '#b68a98'], [400, '#f0c7a4']], stars: 0.35, starLine: 160 },
    grey: { stops: [[-400, '#3a4258'], [120, '#5d6378'], [280, '#8d8c98'], [380, '#b9b1ad'], [420, '#d0c6bb']], stars: 0, starLine: 0, sun: { x: 0.7, y: 300, r: 30, color: '#efe6da', glow: '#ddd2c6' } },
    overcast: { stops: [[-400, '#4c5672'], [140, '#7a8199'], [300, '#aeaab2'], [420, '#d9d0c4']], stars: 0, starLine: 0 },
    gold: { stops: [[-400, '#2e4a7a'], [100, '#5a76a2'], [260, '#c9a982'], [360, '#f2cf8e'], [420, '#fbe7b8']], stars: 0, starLine: 0, sun: { x: 0.78, y: 250, r: 34, color: '#fff3d0', glow: '#ffd690' } },
    hot: { stops: [[-400, '#2f5b8f'], [100, '#5d8ab8'], [280, '#b9c4c2'], [380, '#f1dcb0'], [420, '#f8e8c4']], stars: 0, starLine: 0, sun: { x: 0.35, y: 120, r: 30, color: '#fffbe9', glow: '#fff2c4' } },
    oasis: { stops: [[-400, '#255a78'], [100, '#4d8aa0'], [260, '#a8c6b8'], [380, '#f0dfb2'], [420, '#f7ebc8']], stars: 0, starLine: 0, sun: { x: 0.8, y: 170, r: 28, color: '#fff6dc', glow: '#ffe7b0' } },
    ember: { stops: [[-400, '#1d1a44'], [80, '#3d2a5c'], [220, '#874467'], [330, '#d8735a'], [410, '#f1a868']], stars: 0.3, starLine: 150, sun: { x: 0.62, y: 395, r: 46, color: '#ffc68a', glow: '#ff9f6a' } },
    noon: { stops: [[-400, '#2b5d9a'], [100, '#5b8ec4'], [280, '#a9c8dc'], [400, '#e9e6d0']], stars: 0, starLine: 0, sun: { x: 0.5, y: 60, r: 26, color: '#fffbe9', glow: '#fff2c4' } },
    interior: (c1, c2) => ({ stops: [[-400, c1], [600, c2]], stars: 0, starLine: 0 }),
    lakeDawn: { stops: [[-400, '#2a3466'], [80, '#56578a'], [220, '#a5809c'], [320, '#f0b08a'], [400, '#fde3b8']], stars: 0.1, starLine: 60, sun: { x: 0.3, y: 398, r: 40, color: '#fff0c8', glow: '#ffcf8f' } },
    dusk: { stops: [[-400, '#141a40'], [60, '#2c2c5e'], [200, '#5c4377'], [310, '#b0647a'], [390, '#e89a66'], [420, '#f4c088']], stars: 0.5, starLine: 220 },
  };

  /* ---------- scenes ---------- */
  const S = A.scenes;

  // Gideon
  S.winepress = makeScene({
    id: 'winepress', mood: 'cave', label: 'A hidden winepress at night', groundFill: '#17181f', sky: SKY.night(0.22),
    far: { seed: 201, base: 380, amp: 40, color: '#283052', waves: [[900, 1], [300, 0.3]] },
    mid: { seed: 203, base: 420, amp: 28, color: '#252b40', extra: (a, b, y) => P.terraces(a, b, 205, y, { line: '#3b445c' }) },
    near: { seed: 207, base: 452, amp: 14, color: '#22272f', extra: (a, b, y) => P.vines(a, b, 209, y, { color: '#2f3a2c' }) },
    ground: { seed: 211, colors: ['#3a3b37', '#2a2b2f', '#15151d'], path: '#4c4744', pathLight: '#857c74', rock: '#1e1e26', tuft: '#3a4433' },
    fg: { color: '#0e0f15' },
  });
  S.threshing = makeScene({
    id: 'threshing', mood: 'dawn', label: 'A threshing floor before dawn', groundFill: '#3a3530', sky: SKY.predawn,
    far: { seed: 221, base: 388, amp: 30, color: '#4c4f7a', waves: [[1000, 1], [320, 0.3]] },
    mid: { seed: 223, base: 425, amp: 22, color: '#46496a', extra: (a, b, y) => P.olives(a, b, 225, y, { color: '#3a4054', spacing: 160, s: 0.7 }) },
    ground: { seed: 227, colors: ['#8b8170', '#5e574c', '#2e2a28'], path: '#a99a82', pathLight: '#d8cbb4', rock: '#4a4440', tuft: '#5b6448' },
    fg: { color: '#25211f' },
  });
  S.midian = makeScene({
    id: 'midian', mood: 'pass', label: 'Above the camp of Midian', groundFill: '#141322', sky: SKY.night(0.78),
    far: { seed: 231, base: 360, amp: 50, color: '#20264a', waves: [[700, 1], [250, 0.35]] },
    mid: { seed: 233, base: 440, amp: 8, color: '#1b1d36', extra: (a, b, y) => P.tents(a, b, 235, y, { color: '#3a3150', fire: true, spacing: 44, s: 0.55 }) },
    near: { seed: 237, base: 470, amp: 10, color: '#1a1a30', extra: (a, b, y) => P.tents(a, b, 239, y, { color: '#43385a', fire: true, spacing: 110, s: 0.8, stripe: '#7a5a4a' }) },
    ground: { seed: 241, base: 486, amp: 6, colors: ['#33304a', '#24223a', '#100f1e'], path: '#45405e', pathLight: '#827aa0', rock: '#1a1830', tuft: '#3a4040' },
    fg: { color: '#0b0a16' },
  });

  // Naomi
  S.moab = makeScene({
    id: 'moab', mood: 'quiet', label: 'Grey morning in Moab', groundFill: '#3a3a40', sky: SKY.grey,
    far: { seed: 301, base: 392, amp: 26, color: '#7a7d90', waves: [[1100, 1], [300, 0.2]] },
    mid: { seed: 303, base: 428, amp: 20, color: '#6a6b7a' },
    near: { seed: 305, base: 458, amp: 12, color: '#5e5d66', extra: (a, b, y) => scatter(a, b, 307, 220, (x, r) => scrub(x, y(x) + 4, 0.6, '#4d4f4a', r)) },
    ground: { seed: 309, colors: ['#7d776e', '#57534f', '#2e2c30'], path: '#9c9488', pathLight: '#c8bfb2', rock: '#4a4648', tuft: '#5d6052' },
    fg: { color: '#28272c' },
  });
  S.crossroads = makeScene({
    id: 'crossroads', mood: 'road', label: 'A crossroads on the road west', groundFill: '#4a4236', sky: SKY.overcast,
    far: { seed: 311, base: 398, amp: 30, color: '#8c8aa0', waves: [[900, 1], [280, 0.25]] },
    mid: { seed: 313, base: 432, amp: 22, color: '#8a7f78' },
    near: { seed: 315, base: 460, amp: 14, color: '#7d7060', extra: (a, b, y) => scatter(a, b, 317, 180, (x, r) => scrub(x, y(x) + 4, 0.7, '#666848', r)) },
    ground: { seed: 319, colors: ['#a8957a', '#7d6c58', '#3e3529'], path: '#c9b597', pathLight: '#ecdcc0', rock: '#5e5244', tuft: '#7a7a52' },
    fg: { color: '#352e25' },
  });
  S.harvest = makeScene({
    id: 'harvest', mood: 'dawn', label: 'Barley harvest near Bethlehem', groundFill: '#6a5426', sky: SKY.gold,
    far: { seed: 321, base: 380, amp: 34, color: '#a08f8a', waves: [[1000, 1], [300, 0.3]], extra: (a, b, y) => P.buildings(a, b, 323, (x) => y(x) - 6, { color: '#c4ab90', win: '#8a6a50', spacing: 40, hMin: 14, hMax: 30 }) },
    mid: { seed: 325, base: 426, amp: 18, color: '#c8a35a', extra: (a, b, y) => P.olives(a, b, 327, y, { color: '#6f7448', spacing: 260, s: 0.6 }) },
    near: { seed: 329, base: 458, amp: 10, color: '#d4ad5e', extra: (a, b, y) => P.barley(a, b, 331, y, { color: '#b8913e', head: '#e8c672', spacing: 7, h: 26 }) },
    ground: { seed: 333, colors: ['#c79f58', '#9a7a3e', '#5a4521'], path: '#e3c792', pathLight: '#f8e6bd', rock: '#8a6a3c', extra: (a, b) => P.barley(a, b, 335, 560, { color: '#a07c32', head: '#e2bd60', spacing: 10, h: 40 }) },
    fg: { color: '#5a4520' },
  });

  // Hagar
  S.tentcamp = makeScene({
    id: 'tentcamp', mood: 'juniper', label: 'A tent camp in the afternoon heat', groundFill: '#8a6a48', sky: SKY.hot,
    far: { seed: 401, base: 395, amp: 22, color: '#b8a69a', waves: [[1200, 1], [300, 0.2]] },
    mid: { seed: 403, base: 430, amp: 12, color: '#cdb08a', extra: (a, b, y) => P.tents(a, b, 405, y, { color: '#5a4434', spacing: 150, s: 0.7, stripe: '#a87a50' }) },
    near: { seed: 407, base: 462, amp: 8, color: '#d8b886', extra: (a, b, y) => P.tents(a, b, 409, y, { color: '#4a382c', spacing: 300, s: 1.1, stripe: '#c09060' }) },
    ground: { seed: 411, colors: ['#e2c18e', '#b8925e', '#7a5a3c'], path: '#efd6aa', pathLight: '#fff0d0', rock: '#a07a54', tuft: '#a09a5c' },
    fg: { color: '#6a4c32' },
  });
  S.spring = makeScene({
    id: 'spring', mood: 'dawn', label: 'A spring in the desert', groundFill: '#6a6a4a', sky: SKY.oasis,
    far: { seed: 421, base: 392, amp: 24, color: '#b8a690', waves: [[1100, 1], [300, 0.2]] },
    mid: { seed: 423, base: 428, amp: 14, color: '#c9ad82', extra: (a, b, y) => P.palms(a, b, 425, y, { color: '#4a6a4a', spacing: 220, s: 0.7 }) },
    near: { seed: 427, base: 455, amp: 6, color: '#a8a070', behind: (a, b) => P.water(a, b, 442, { color: '#6fb0b0', deep: '#3e7a8a', shine: '#e9fbf6', id: 'spring' }), extra: (a, b, y) => P.palms(a, b, 429, y, { color: '#3e5a3c', spacing: 380, s: 1 }) },
    ground: { seed: 431, colors: ['#b8a878', '#8a7c52', '#4a442e'], path: '#d8c79c', pathLight: '#f4e8c4', rock: '#7a6a48', tuft: '#6a8a4a' },
    fg: { color: '#3a3a26' },
  });
  S.wilderness = makeScene({
    id: 'wilderness', mood: 'road', label: 'The wilderness of Beersheba at evening', groundFill: '#4a2e2e', sky: SKY.ember,
    far: { seed: 441, base: 392, amp: 40, color: '#6a3e5c', clampTop: 0.5, waves: [[900, 1], [300, 0.3]] },
    mid: { seed: 443, base: 428, amp: 20, color: '#7a4650' },
    near: { seed: 445, base: 458, amp: 14, color: '#8a5048', extra: (a, b, y) => scatter(a, b, 447, 260, (x, r) => scrub(x, y(x) + 4, 0.6, '#5a3e36', r)) },
    ground: { seed: 449, colors: ['#a8644a', '#7a4438', '#3a2224'], path: '#c88a66', pathLight: '#e8b48a', rock: '#5a3430', tuft: '#7a6a44' },
    fg: { color: '#2e1a1c' },
  });

  // Joseph
  S.dothan = makeScene({
    id: 'dothan', mood: 'juniper', label: 'Pasture near Dothan', groundFill: '#4a5030', sky: SKY.noon,
    far: { seed: 501, base: 390, amp: 26, color: '#8aa0b0', waves: [[1000, 1], [300, 0.3]] },
    mid: { seed: 503, base: 425, amp: 18, color: '#8a9a5e', extra: (a, b, y) => P.olives(a, b, 505, y, { color: '#5a6a3e', spacing: 200, s: 0.6 }) + P.sheep(a, b, 507, y, { spacing: 160 }) },
    near: { seed: 509, base: 458, amp: 12, color: '#9aa266' },
    ground: { seed: 511, colors: ['#a8a66a', '#7a7a48', '#3e3e26'], path: '#cbbf8e', pathLight: '#ece2b8', rock: '#6a6448', tuft: '#6a7a3e' },
    fg: { color: '#2e3020' },
  });
  S.prison = makeScene({
    id: 'prison', mood: 'cave', label: 'A prison in Egypt', groundFill: '#1a1714', sky: SKY.interior('#0e0c10', '#1a1612'),
    back: { f: 0.25, draw: (a, b) => P.wall(a, b, -500, 470, { color: '#3a3128', line: '#1e1914' }) + scatter(a, b, 513, 520, (x) => `<g transform="translate(${n(x)},150)"><rect x="-34" y="-30" width="68" height="60" fill="#0b0d1c"/><path d="M-34,0 H34" stroke="#2a221a" stroke-width="4"/>${[-22, -8, 6, 20].map((bx) => `<rect x="${bx}" y="-30" width="4" height="60" fill="#2a221a"/>`).join('')}<path d="M-34,30 L-120,330 L120,330 L34,30 Z" fill="#cfd8ff" opacity=".07"/></g>`) },
    ground: { seed: 515, base: 486, amp: 2, colors: ['#4a3f34', '#2e2720', '#120f0c'], path: '#5a4c3e', pathLight: '#8a7a64', rock: '#241e18' },
    fg: { color: '#0c0a08', tuft: false },
  });
  S.palace = makeScene({
    id: 'palace', mood: 'dawn', label: 'A hall of grain in Egypt', groundFill: '#5a4026', sky: SKY.interior('#3a2614', '#6a4626'),
    back: { f: 0.15, draw: (a, b) => `<rect x="${a}" y="-500" width="${b - a}" height="980" fill="#a87a48"/>` + scatter(a, b, 517, 30, (x, r) => `<rect x="${n(x)}" y="${n(120 + r() * 10)}" width="${n(10 + r() * 14)}" height="6" fill="#7a4e2c" opacity=".5"/>`) + `<rect x="${a}" y="90" width="${b - a}" height="10" fill="#4a7a8a" opacity=".6"/><rect x="${a}" y="104" width="${b - a}" height="4" fill="#c49a4a"/>` },
    mid: { seed: 519, base: 470, amp: 0, color: '#8a5e36', behind: (a, b) => P.columns(a, b, { spacing: 300, color: '#c99a5e', light: '#f6dca8', top: 40, bottom: 470, w: 44, lotus: true }) },
    ground: { seed: 521, base: 486, amp: 1, colors: ['#c9a06a', '#8a6a42', '#3e2c1a'], path: '#e0c08a', pathLight: '#f8e4b8' },
    fg: { color: '#2e2012', tuft: false },
  });

  // Peter
  S.courtyard = makeScene({
    id: 'courtyard', mood: 'cave', label: 'A courtyard at night', groundFill: '#18151a', sky: SKY.night(0.7),
    far: { seed: 601, base: 360, amp: 10, color: '#1c1f38', extra: (a, b, y) => P.buildings(a, b, 603, y, { color: '#1c1f38', win: '#e8b46a', spacing: 50, hMin: 30, hMax: 90 }) },
    near: { seed: 605, base: 470, amp: 0, color: '#2a2530', behind: (a, b) => P.wall(a, b, 300, 480, { color: '#3a3238', line: '#1c181e' }) + scatter(a, b, 607, 600, (x) => `<path d="M${n(x - 50)},480 V360 A50,50 0 0 1 ${n(x + 50)},360 V480 Z" fill="#120f16"/>`) },
    ground: { seed: 609, base: 488, amp: 2, colors: ['#4a3e3a', '#2e2628', '#100c10'], path: '#5a4c48', pathLight: '#8a7a72', rock: '#201a1e' },
    fg: { color: '#0a080b', tuft: false },
  });
  S.lake = makeScene({
    id: 'lake', mood: 'pass', label: 'The lake at night', groundFill: '#141a2a', sky: SKY.night(0.66),
    far: { seed: 611, base: 392, amp: 34, color: '#1e2448', waves: [[900, 1], [300, 0.3]] },
    near: { seed: 613, base: 600, amp: 0, color: 'none', behind: (a, b) => P.water(a, b, 412, { color: '#1c2a52', deep: '#0c1430', shine: '#c9d4ff', id: 'lake' }) },
    ground: { seed: 615, base: 490, amp: 4, colors: ['#4a4a5a', '#2a2a3a', '#0e0e18'], path: '#5c5a6c', pathLight: '#9a96b0', rock: '#1a1a26' },
    fg: { color: '#08080f', tuft: false },
  });
  S.shore = makeScene({
    id: 'shore', mood: 'dawn', label: 'The shore at daybreak', groundFill: '#5a4e40', sky: SKY.lakeDawn,
    far: { seed: 621, base: 398, amp: 26, color: '#7a6a8c', waves: [[1000, 1], [300, 0.25]] },
    near: { seed: 623, base: 600, amp: 0, color: 'none', behind: (a, b) => P.water(a, b, 418, { color: '#c49a9a', deep: '#5a6a8a', shine: '#fff2dc', id: 'shore' }) },
    ground: { seed: 625, base: 488, amp: 4, colors: ['#c4ad8e', '#8a7860', '#3e3428'], path: '#dcc8a8', pathLight: '#f8ead0', rock: '#7a6a58', extra: (a, b) => scatter(a, b, 627, 40, (x, r) => `<ellipse cx="${n(x)}" cy="${n(530 + r() * 60)}" rx="${n(3 + r() * 5)}" ry="${n(2 + r() * 2)}" fill="#a8947a"/>`) },
    fg: { color: '#3a3024', tuft: false },
  });

  // David
  S.rooftop = makeScene({
    id: 'rooftop', mood: 'road', label: 'A palace rooftop at evening', groundFill: '#3a3040', sky: SKY.dusk,
    far: { seed: 701, base: 395, amp: 24, color: '#4a3e66' },
    mid: { seed: 703, base: 430, amp: 4, color: '#5a4a62', extra: (a, b, y) => P.buildings(a, b, 705, y, { color: '#5a4a62', win: '#f2c27a', spacing: 46, hMin: 30, hMax: 70, dome: true }) },
    near: { seed: 707, base: 468, amp: 2, color: '#6a5468', extra: (a, b, y) => P.buildings(a, b, 709, y, { color: '#6a5468', win: '#f6cf8e', spacing: 90, hMin: 20, hMax: 50 }) },
    ground: { seed: 711, base: 490, amp: 0, colors: ['#b8a090', '#8a7268', '#3e3236'], path: '#d0bca8', pathLight: '#efe0cc', extra: (a, b) => `<rect x="${a}" y="470" width="${b - a}" height="10" fill="#9a8478"/>` },
    fg: { color: '#2a2028', tuft: false },
  });
  S.hall = makeScene({
    id: 'hall', mood: 'quiet', label: 'A cedar hall in daylight', groundFill: '#3a2a1e', sky: SKY.interior('#2a1c12', '#4a3220'),
    back: { f: 0.15, draw: (a, b) => `<rect x="${a}" y="-500" width="${b - a}" height="980" fill="#6a4a32"/>` + scatter(a, b, 713, 26, (x, r) => `<rect x="${n(x)}" y="-500" width="3" height="980" fill="#4a3220" opacity="${n(0.3 + r() * 0.3)}"/>`) + scatter(a, b, 715, 420, (x) => `<rect x="${n(x - 40)}" y="120" width="80" height="140" fill="#f6dca8" opacity=".55"/><path d="M${n(x - 40)},260 L${n(x - 110)},480 L${n(x + 110)},480 L${n(x + 40)},260 Z" fill="#fff0c8" opacity=".12"/>`) },
    mid: { seed: 717, base: 480, amp: 0, color: 'none', behind: (a, b) => P.columns(a, b, { spacing: 360, color: '#5a3a24', light: '#c9925a', top: 20, bottom: 480, w: 40 }) },
    ground: { seed: 719, base: 488, amp: 0, colors: ['#8a6a4a', '#5a4230', '#22180f'], path: '#a8885e', pathLight: '#d8b88a' },
    fg: { color: '#1a120c', tuft: false },
  });
  S.nightroom = makeScene({
    id: 'nightroom', mood: 'cave', label: 'A palace room at night', groundFill: '#140f12', sky: SKY.interior('#0a080c', '#1a1216'),
    back: { f: 0.15, draw: (a, b) => `<rect x="${a}" y="-500" width="${b - a}" height="980" fill="#2a2026"/>` + scatter(a, b, 721, 480, (x) => `<path d="M${n(x - 36)},300 V170 A36,36 0 0 1 ${n(x + 36)},170 V300 Z" fill="#0c1230"/><circle cx="${n(x + 10)}" cy="200" r="1.4" fill="#fff"/><circle cx="${n(x - 12)}" cy="230" r="1" fill="#fff"/>`) },
    mid: { seed: 723, base: 480, amp: 0, color: 'none', behind: (a, b) => P.columns(a, b, { spacing: 420, color: '#3a2a30', light: '#8a6a5a', top: 30, bottom: 480, w: 36 }) },
    ground: { seed: 725, base: 488, amp: 0, colors: ['#3e3034', '#241c20', '#0c080a'], path: '#4e3e40', pathLight: '#8a7068' },
    fg: { color: '#080506', tuft: false },
  });

  // Samson
  S.vineyard = makeScene({
    id: 'vineyard', mood: 'juniper', label: 'The vineyards of Timnah', groundFill: '#4a4a2a', sky: SKY.noon,
    far: { seed: 801, base: 385, amp: 30, color: '#8a9ab0', waves: [[1000, 1], [300, 0.3]] },
    mid: { seed: 803, base: 420, amp: 22, color: '#7a8a4e', extra: (a, b, y) => P.terraces(a, b, 805, y, { line: '#5a6a3a', count: 5, gap: 7 }) },
    near: { seed: 807, base: 455, amp: 12, color: '#8a8a4e', extra: (a, b, y) => P.vines(a, b, 809, y, { color: '#4e6a32', post: '#5a4630', grape: '#5a3a6a' }) },
    ground: { seed: 811, colors: ['#a89a62', '#7a6e44', '#3a3420'], path: '#cbb88a', pathLight: '#ece0b8', rock: '#6a5e40', tuft: '#5e7a3a' },
    fg: { color: '#2e2a18' },
  });
  S.sorek = makeScene({
    id: 'sorek', mood: 'road', label: 'The valley of Sorek at evening', groundFill: '#3a2a30', sky: SKY.dusk,
    far: { seed: 821, base: 380, amp: 38, color: '#4a3a6a', waves: [[900, 1], [280, 0.3]] },
    mid: { seed: 823, base: 425, amp: 20, color: '#5a4060', extra: (a, b, y) => P.olives(a, b, 825, y, { color: '#3e3450', spacing: 170, s: 0.7 }) },
    near: { seed: 827, base: 458, amp: 10, color: '#5e4058', behind: (a, b) => P.water(a, b, 452, { color: '#a87088', deep: '#5a3a5a', shine: '#ffd8c0', id: 'sorek' }) },
    ground: { seed: 829, colors: ['#8a6460', '#5e4248', '#22161c'], path: '#a8807a', pathLight: '#d8aca0', rock: '#3a2830', tuft: '#5a5a3e' },
    fg: { color: '#1a1014' },
  });
  S.gaza = makeScene({
    id: 'gaza', mood: 'cave', label: 'Gaza at dusk', groundFill: '#2a2020', sky: SKY.ember,
    far: { seed: 831, base: 380, amp: 8, color: '#4a3048', extra: (a, b, y) => P.buildings(a, b, 833, y, { color: '#4a3048', win: '#f1a868', spacing: 38, hMin: 30, hMax: 90 }) },
    mid: { seed: 835, base: 470, amp: 0, color: '#3e2a36', behind: (a, b) => P.columns(a, b, { spacing: 340, color: '#6a4a48', light: '#d8a080', top: 140, bottom: 470, w: 50 }) },
    ground: { seed: 837, base: 488, amp: 2, colors: ['#7a5a4a', '#4a3430', '#1a1012'], path: '#94705a', pathLight: '#c49a7a', rock: '#3a2624' },
    fg: { color: '#140c0c', tuft: false },
  });

  /* ---------- props ---------- */
  const PR = A.props;
  const fig = (key, extra = {}) => () => person(Object.assign({}, CAST[key], extra));
  ['abiel', 'purah', 'miri', 'ruth', 'naomi', 'sefa', 'hagar', 'iry', 'guard', 'yona', 'fisher', 'shoreMan', 'servantGirl', 'tavi', 'nathan', 'ziva', 'lord'].forEach((k) => { PR[k] = fig(k); });

  PR.group = (keys, gap = 46) => keys.map((k, i) => `<g transform="translate(${(i - (keys.length - 1) / 2) * gap},0)">${person(CAST[k])}</g>`).join('');
  PR.brothers = () => PR.group(['brother1', 'brother2', 'brother3']);
  PR.women = () => PR.group(['woman1', 'woman2'], 40);
  PR.ruthNaomi = () => `<g transform="translate(-24,0)">${person(CAST.naomi)}</g><g transform="translate(24,0)">${person(CAST.ruth)}</g>`;

  PR.oak = () => `<ellipse cx="0" cy="4" rx="150" ry="14" fill="#000" opacity=".25"/>
    <path d="M-14,0 C-10,-60 -22,-110 -6,-150 L8,-150 C20,-110 12,-60 16,0 Z" fill="#3a2e26"/>
    <path d="M-4,-120 C-40,-150 -80,-150 -100,-170 M6,-130 C40,-160 80,-160 100,-185" stroke="#3a2e26" stroke-width="9" fill="none" stroke-linecap="round"/>
    <g class="sway slow" fill="#2c3a2a"><ellipse cx="-80" cy="-190" rx="70" ry="42"/><ellipse cx="0" cy="-220" rx="90" ry="54"/><ellipse cx="80" cy="-196" rx="72" ry="44"/><ellipse cx="-30" cy="-170" rx="60" ry="30" fill="#344432"/><ellipse cx="40" cy="-176" rx="60" ry="30" fill="#344432"/></g>`;
  PR.winepress = () => `<ellipse cx="0" cy="3" rx="70" ry="10" fill="#000" opacity=".3"/>
    <path d="M-62,0 C-62,-26 -40,-36 0,-36 C40,-36 62,-26 62,0 Z" fill="#5a5450"/>
    <path d="M-48,-4 C-48,-22 -30,-28 0,-28 C30,-28 48,-22 48,-4 Z" fill="#2a2624"/>
    <g fill="#d8b46a"><path d="M-30,-20 l6,-30 l4,30 Z"/><path d="M-20,-20 l4,-34 l6,34 Z"/><path d="M-10,-22 l6,-28 l4,28 Z"/></g>
    <path d="M20,-26 L50,-70" stroke="#8a6a44" stroke-width="4" stroke-linecap="round"/>`;
  PR.altar = () => `<ellipse cx="0" cy="3" rx="40" ry="7" fill="#000" opacity=".3"/>
    <g fill="#6e6874"><rect x="-30" y="-18" width="26" height="18" rx="4"/><rect x="2" y="-18" width="28" height="18" rx="4"/><rect x="-24" y="-36" width="22" height="18" rx="4"/><rect x="0" y="-36" width="24" height="18" rx="4"/><rect x="-14" y="-52" width="28" height="16" rx="4"/></g>
    <path d="M36,0 L58,-80" stroke="#4a3a2c" stroke-width="6"/><path d="M40,-30 L74,-50" stroke="#4a3a2c" stroke-width="4" opacity=".6"/>`;
  PR.fleece = (wet) => `<ellipse cx="0" cy="2" rx="46" ry="8" fill="#000" opacity=".2"/>
    <circle cx="0" cy="-30" r="60" fill="url(#wf-soft)" opacity="${wet ? 0.9 : 0.4}"/>
    <ellipse cx="0" cy="-4" rx="58" ry="8" fill="#9a8a72"/>
    <path d="M-36,-6 C-40,-18 -20,-22 -4,-20 C14,-24 34,-20 38,-8 C30,-2 -28,-2 -36,-6 Z" fill="#efe6d4"/>
    <g fill="#fff" opacity=".9">${wet ? '<circle cx="-14" cy="-14" r="2"/><circle cx="6" cy="-17" r="2"/><circle cx="22" cy="-12" r="2"/><circle cx="-24" cy="-10" r="1.6"/><circle cx="14" cy="-9" r="1.6"/>' : ''}</g>`;
  PR.tentGlow = () => `<circle cx="0" cy="-40" r="90" fill="url(#wf-glow)"/>
    <path d="M-80,0 L-24,-80 L0,-88 L24,-80 L80,0 Z" fill="#43385a"/><path d="M-60,-24 L60,-24" stroke="#7a5a4a" stroke-width="5" opacity=".7"/>
    <path d="M-18,0 L0,-66 L18,0 Z" fill="#ffcf7a" opacity=".55"/>`;
  PR.ledge = PR.ledge || (() => '');
  PR.graves = () => `<ellipse cx="0" cy="3" rx="110" ry="9" fill="#000" opacity=".2"/>` +
    [-70, 0, 70].map((x, i) => `<g transform="translate(${x},0) scale(${0.8 + (i === 0 ? 0.25 : 0)})"><ellipse cx="0" cy="-8" rx="28" ry="10" fill="#6a6870"/><ellipse cx="2" cy="-22" rx="20" ry="8" fill="#77757e"/><ellipse cx="-1" cy="-34" rx="12" ry="6" fill="#85838c"/></g>`).join('') +
    `<g fill="#e8d6dc">${[-40, -32, 38, 46, 100].map((x) => `<circle cx="${x}" cy="-4" r="2.4"/>`).join('')}</g>`;
  PR.lamentStone = () => `<ellipse cx="0" cy="3" rx="44" ry="7" fill="#000" opacity=".25"/><path d="M-40,0 C-44,-30 -20,-46 4,-44 C30,-42 44,-24 40,0 Z" fill="#6a6874"/><path d="M-20,-30 C-6,-36 10,-36 22,-28" stroke="#8a8894" stroke-width="2" fill="none"/>`;
  PR.signpost = () => `<rect x="-4" y="-110" width="8" height="110" fill="#6b5340"/>
    <path d="M4,-100 H58 L70,-90 L58,-80 H4 Z" fill="#8b6a4b"/><path d="M-4,-76 H-56 L-68,-66 L-56,-56 H-4 Z" fill="#7a5a3e"/>
    <path d="M14,-90 H50 M-14,-66 H-48" stroke="#f6efe2" stroke-width="2.5" opacity=".7" stroke-linecap="round"/>`;
  PR.sheaf = (gleaned) => `<ellipse cx="0" cy="3" rx="50" ry="7" fill="#000" opacity=".2"/>
    <g fill="#d8b058"><path d="M-30,0 L-22,-60 L-14,0 Z"/><path d="M-12,0 L-2,-70 L8,0 Z"/><path d="M10,0 L18,-58 L26,0 Z"/></g>
    <path d="M-28,-30 H24" stroke="#a07a32" stroke-width="4"/>
    <g fill="#e9c66c">${[-24, -16, -4, 2, 14, 20].map((x, i) => `<ellipse cx="${x}" cy="${-62 - (i % 2) * 8}" rx="3" ry="8"/>`).join('')}</g>
    ${gleaned ? '<g fill="#e9c66c"><ellipse cx="44" cy="-6" rx="3" ry="8" transform="rotate(60 44 -6)"/><ellipse cx="54" cy="-4" rx="3" ry="8" transform="rotate(75 54 -4)"/></g><circle cx="40" cy="-20" r="40" fill="url(#wf-glow)"/>' : ''}`;
  PR.townGate = () => `<rect x="-90" y="-150" width="180" height="150" fill="#b8a080"/><path d="M-36,0 V-80 A36,36 0 0 1 36,-80 V0 Z" fill="#4a3a2a"/>
    <rect x="-96" y="-160" width="192" height="14" fill="#a08868"/>${[-80, -50, -20, 10, 40, 70].map((x) => `<rect x="${x}" y="-176" width="16" height="16" fill="#b8a080"/>`).join('')}`;
  PR.tent = () => `<ellipse cx="0" cy="3" rx="90" ry="10" fill="#000" opacity=".25"/><path d="M-90,0 L-30,-90 L0,-96 L30,-90 L90,0 Z" fill="#4a382c"/>
    <path d="M-70,-20 L70,-20 M-50,-50 L50,-50" stroke="#a87a50" stroke-width="4" opacity=".6"/><path d="M-20,0 L0,-70 L22,0 Z" fill="#1a120c"/><path d="M22,0 L0,-70 L36,-10 Z" fill="#6a5240"/>`;
  PR.pool = () => `<ellipse cx="0" cy="-2" rx="80" ry="14" fill="#3e7a8a"/><ellipse cx="0" cy="-4" rx="70" ry="10" fill="#6fb0b0"/><path d="M-30,-6 h24 M10,-4 h30" stroke="#e9fbf6" stroke-width="1.5" opacity=".7"/>
    <g stroke="#4a6a3a" stroke-width="2.4" stroke-linecap="round">${[-74, -68, -62, 66, 72].map((x, i) => `<path d="M${x},-6 Q${x - 4},${-30 - i * 4} ${x + 2},${-50 - i * 3}"/>`).join('')}</g>
    <ellipse cx="-60" cy="-4" rx="14" ry="6" fill="#7a6a58"/><ellipse cx="54" cy="-2" rx="12" ry="5" fill="#7a6a58"/>`;
  PR.waterskin = (full) => `<ellipse cx="0" cy="3" rx="22" ry="4" fill="#000" opacity=".25"/><path d="M-18,0 C-26,-20 -14,-40 0,-38 C14,-40 24,-20 18,0 Z" fill="${full ? '#8a5a3a' : '#6a4a34'}"/><path d="M-4,-38 L-2,-48 L4,-48 L4,-38" fill="#5a3a24"/>${full ? '' : '<path d="M-14,-16 C-6,-12 6,-12 14,-18" stroke="#4a3424" stroke-width="2" fill="none"/>'}`;
  PR.shrub = () => `<ellipse cx="0" cy="3" rx="60" ry="8" fill="#000" opacity=".2"/><g stroke="#5a443a" stroke-width="2" fill="none">${Array.from({ length: 12 }, (_, i) => `<path d="M${i % 3 - 1},0 Q${(i - 6) * 6},-30 ${(i - 6) * 10},${-50 - (i % 4) * 10}"/>`).join('')}</g>`;
  PR.well = (open) => open
    ? `<circle cx="0" cy="-40" r="80" fill="url(#wf-soft)"/><ellipse cx="0" cy="2" rx="48" ry="8" fill="#000" opacity=".3"/><path d="M-40,0 V-30 H40 V0 Z" fill="#8a6a58"/><ellipse cx="0" cy="-30" rx="40" ry="9" fill="#9a7a66"/><ellipse cx="0" cy="-30" rx="30" ry="6" fill="#3e7a9a"/><path d="M-12,-31 h20" stroke="#dff" stroke-width="1.5"/>`
    : `<ellipse cx="0" cy="-6" rx="30" ry="6" fill="#5a3430" opacity=".6"/>`;
  PR.coat = () => `<ellipse cx="0" cy="3" rx="50" ry="7" fill="#000" opacity=".25"/><path d="M-44,0 C-46,-20 -30,-30 0,-30 C30,-30 46,-20 44,0 Z" fill="#7a6a5a"/>
    <path d="M-40,-14 C-30,-34 -6,-40 10,-34 L30,-40 C38,-30 42,-18 36,-8 L-36,-6 Z" fill="#b8504a"/><path d="M-30,-22 L32,-28 M-34,-14 L36,-18" stroke="#e8b44a" stroke-width="4"/><path d="M-26,-30 L30,-36" stroke="#3a6a9a" stroke-width="3"/><path d="M10,-34 L16,-20 L8,-12" stroke="#4a3a2e" stroke-width="2" fill="none"/>`;
  PR.cistern = () => `<ellipse cx="0" cy="2" rx="62" ry="12" fill="#5a5444"/><ellipse cx="0" cy="0" rx="46" ry="8" fill="#0a0806"/><ellipse cx="-50" cy="-2" rx="14" ry="6" fill="#6a6450"/><ellipse cx="48" cy="-4" rx="16" ry="7" fill="#6a6450"/>`;
  PR.tally = (more) => {
    let marks = '';
    const count = more ? 26 : 9;
    for (let i = 0; i < count; i++) {
      const gx = Math.floor(i / 5) * 26 + (i % 5) * 4;
      marks += (i % 5 === 4) ? `<path d="M${gx - 18},-74 L${gx + 2},-56" stroke="#c9b490" stroke-width="2"/>` : `<path d="M${gx},-78 V-52" stroke="#c9b490" stroke-width="2"/>`;
    }
    return `<rect x="-70" y="-110" width="160" height="90" rx="6" fill="#4a3e32"/><g transform="translate(-50,0)">${marks}</g>`;
  };
  PR.cup = () => `<ellipse cx="0" cy="3" rx="30" ry="5" fill="#000" opacity=".25"/><rect x="-26" y="-30" width="52" height="30" rx="4" fill="#5a4636"/><path d="M-8,-30 C-10,-46 10,-46 8,-30 Z M-2,-42 V-54 M-8,-54 C-8,-66 8,-66 8,-54 Z" fill="#d4a84a" stroke="#d4a84a" stroke-width="2"/><circle cx="14" cy="-34" r="5" fill="#c9a06a"/>`;
  PR.grain = () => `<ellipse cx="0" cy="4" rx="80" ry="9" fill="#000" opacity=".25"/>` + [-50, -10, 30].map((x, i) => `<g transform="translate(${x},0)"><path d="M-18,0 C-24,-26 -16,-48 0,-50 C16,-48 24,-26 18,0 Z" fill="${['#c9945a', '#b8844a', '#d4a46a'][i]}"/><ellipse cx="0" cy="-50" rx="8" ry="3" fill="#7a5430"/></g>`).join('') + '<g fill="#e8c672"><circle cx="60" cy="-4" r="3"/><circle cx="66" cy="-2" r="3"/><circle cx="62" cy="-8" r="3"/></g>';
  PR.fire = () => `<ellipse cx="0" cy="2" rx="44" ry="7" fill="#000" opacity=".3"/><circle cx="0" cy="-20" r="80" fill="url(#wf-glow)"/>
    <g fill="#4a3a38"><ellipse cx="-30" cy="-4" rx="10" ry="7"/><ellipse cx="30" cy="-4" rx="10" ry="7"/></g>
    <ellipse class="ember" cx="0" cy="-6" rx="24" ry="7" fill="url(#wf-coal)"/>
    <g class="flicker"><path d="M-12,-8 C-14,-26 -2,-30 0,-46 C6,-30 16,-24 12,-8 Z" fill="#ff9a3c"/><path d="M-5,-8 C-6,-18 0,-22 1,-30 C4,-20 8,-16 6,-8 Z" fill="#ffe08a"/></g>`;
  PR.shoreFire = () => PR.coals().replace('<ellipse cx="0" cy="-12" rx="18" ry="5.5" fill="#d9a865"/><ellipse cx="0" cy="-13.5" rx="14" ry="3.2" fill="#e9c189"/>', '<path d="M-20,-12 C-14,-18 0,-18 6,-12 L14,-17 L14,-7 L6,-12 C0,-6 -14,-6 -20,-12 Z" fill="#8aa0b0"/><ellipse cx="-2" cy="-15" rx="12" ry="3" fill="#e9c189"/>');
  PR.rooster = () => `<rect x="-3" y="-60" width="6" height="60" fill="#5a4636"/><g transform="translate(0,-60)"><ellipse cx="0" cy="-12" rx="14" ry="10" fill="#8a3a2a"/><circle cx="10" cy="-24" r="6" fill="#8a3a2a"/><path d="M10,-30 l3,-6 l3,6 Z" fill="#d43a2a"/><path d="M15,-24 l6,2 l-6,2 Z" fill="#e8b44a"/><path d="M-12,-14 C-26,-30 -22,-36 -10,-20" fill="#2a4a3a"/></g>`;
  PR.boat = (full) => `<path d="M-110,-6 C-90,20 90,20 120,-10 L96,-14 L-100,-12 Z" fill="#5a4030"/><path d="M-96,-12 L100,-14" stroke="#8a6a48" stroke-width="3"/>
    <path d="M0,-12 V-150" stroke="#4a3426" stroke-width="5"/><path d="M4,-146 L60,-30 L4,-30 Z" fill="#d8cdb8" opacity=".85"/>
    <g stroke="#a89a82" stroke-width="1.2" fill="none" opacity=".8"><path d="M-80,-12 C-90,10 -50,26 -30,8"/><path d="M-70,-12 L-48,14 M-56,-12 L-40,16 M-84,0 L-36,4"/></g>
    ${full ? '<g fill="#b8c4cc">' + Array.from({ length: 9 }, (_, i) => `<ellipse cx="${-76 + i * 6}" cy="${4 + (i % 3) * 4}" rx="5" ry="2"/>`).join('') + '</g>' : ''}`;
  PR.parapet = () => `<rect x="-80" y="-40" width="160" height="40" fill="#b8a090"/><rect x="-86" y="-46" width="172" height="8" fill="#d0bca8"/><path d="M-80,-20 H80" stroke="#8a7468" stroke-width="1.5" opacity=".6"/>`;
  PR.letter = () => `<rect x="-40" y="-40" width="80" height="6" fill="#6a4a32"/><path d="M-34,-34 V0 M34,-34 V0" stroke="#5a3e2a" stroke-width="5"/>
    <g transform="translate(0,-48) rotate(-6)"><rect x="-18" y="-6" width="36" height="12" rx="3" fill="#f4e8cc"/><circle cx="-18" cy="0" r="6" fill="#e3cfa4"/><circle cx="18" cy="0" r="6" fill="#e3cfa4"/><circle cx="0" cy="0" r="5" fill="#9a2a2a"/></g>`;
  PR.lamb = () => `<ellipse cx="0" cy="2" rx="26" ry="4" fill="#000" opacity=".2"/><ellipse cx="0" cy="-16" rx="20" ry="12" fill="#f4eee2"/><circle cx="18" cy="-24" r="7" fill="#f4eee2"/><circle cx="21" cy="-25" r="1.3" fill="#2a2a2a"/><path d="M-12,-6 V0 M12,-6 V0" stroke="#5a4a3a" stroke-width="3"/>`;
  PR.harp = () => `<rect x="-30" y="-46" width="60" height="6" fill="#5a3e2a"/><path d="M-26,-40 V0 M26,-40 V0" stroke="#4a3220" stroke-width="5"/>
    <g transform="translate(0,-46)"><path d="M-16,0 L-20,-60 M16,0 L22,-62 M-22,-58 L24,-62" stroke="#a87a48" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M-16,0 H16" stroke="#a87a48" stroke-width="7"/>${[-10, -4, 2, 8].map((x) => `<path d="M${x},-2 L${x + 1},-58" stroke="#f0e2c0" stroke-width=".9"/>`).join('')}</g>`;
  PR.lamp = () => `<circle cx="0" cy="-70" r="80" fill="url(#wf-glow)"/><path d="M-4,0 V-56 M4,0 V-56" stroke="#6a5040" stroke-width="3"/><rect x="-14" y="-4" width="28" height="4" fill="#6a5040"/>
    <path d="M-16,-56 C-16,-66 16,-66 18,-58 L26,-62 L22,-56 Z" fill="#a8664a"/><g class="flicker"><ellipse cx="24" cy="-68" rx="3.5" ry="7" fill="#ffcf7a"/></g>`;
  PR.carcass = () => `<ellipse cx="0" cy="3" rx="54" ry="7" fill="#000" opacity=".2"/><g stroke="#e8dcc4" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".85">
    <path d="M-40,-4 C-20,-10 20,-10 40,-4"/>${[-28, -18, -8, 2, 12, 22].map((x) => `<path d="M${x},-8 C${x - 4},-24 ${x + 6},-30 ${x + 8},-22"/>`).join('')}</g>
    <g fill="#d4a020">${[-6, 4, 12, -14, 20].map((x, i) => `<circle class="tw" cx="${x}" cy="${-34 - (i % 3) * 8}" r="1.8"/>`).join('')}</g>
    <path d="M-8,-18 l6,-4 l6,4 l0,6 l-6,4 l-6,-4 Z" fill="#e8b440"/>`;
  PR.post = (set) => `<ellipse cx="0" cy="3" rx="18" ry="4" fill="#000" opacity=".25"/><rect x="-5" y="-80" width="10" height="80" rx="2" fill="#6b4f39"/>
    <path d="M-5,-60 C-30,-56 -50,-50 -70,-44 M5,-60 C30,-56 50,-50 70,-44" stroke="#c9b48a" stroke-width="2.5" fill="none" opacity="${set ? 0.9 : 0.25}"/>
    ${set ? '<circle cx="0" cy="-90" r="40" fill="url(#wf-glow)"/><rect x="-7" y="-98" width="14" height="14" rx="3" fill="#ffd27a" stroke="#6b4a2c"/>' : '<rect x="-7" y="-98" width="14" height="14" rx="3" fill="#5a5048"/>'}`;
  PR.loom = () => `<rect x="-40" y="-110" width="6" height="110" fill="#5a4230"/><rect x="34" y="-110" width="6" height="110" fill="#5a4230"/><rect x="-44" y="-114" width="88" height="8" fill="#6b4f39"/>
    <g stroke="#d8cdb8" stroke-width="1">${Array.from({ length: 12 }, (_, i) => `<path d="M${-30 + i * 6},-106 V-30"/>`).join('')}</g><rect x="-34" y="-60" width="68" height="30" fill="#8a5a6a" opacity=".85"/>`;
  PR.mill = () => `<ellipse cx="0" cy="3" rx="70" ry="9" fill="#000" opacity=".3"/><ellipse cx="0" cy="-10" rx="56" ry="14" fill="#5a5050"/><ellipse cx="0" cy="-24" rx="44" ry="12" fill="#6a6060"/><rect x="-4" y="-50" width="8" height="26" fill="#4a3a2a"/><path d="M0,-48 L80,-60" stroke="#6b4f39" stroke-width="6" stroke-linecap="round"/>`;
  PR.pillars = () => `<circle cx="0" cy="-120" r="140" fill="url(#wf-soft)" opacity=".4"/>` + [-60, 60].map((x) => `<rect x="${x - 22}" y="-300" width="44" height="300" fill="#7a5a54"/><rect x="${x - 16}" y="-300" width="6" height="300" fill="#d8a080" opacity=".4"/><rect x="${x - 30}" y="-312" width="60" height="14" fill="#6a4a46"/>`).join('');
})();
