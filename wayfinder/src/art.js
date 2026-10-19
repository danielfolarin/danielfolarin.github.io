/* Wayfinder — original procedural SVG illustration.
 * World units: the world is 600 units tall; feet stand on y = GROUND.
 * Scenes are layered silhouettes with parallax factors. Props and figures are drawn
 * around (0,0) = the spot where they meet the ground. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const H = 600;
  const GROUND = 500;
  WF.GROUND = GROUND;
  WF.WORLD_H = H;

  /* ---------- helpers ---------- */

  const n = (v) => Math.round(v * 10) / 10;

  function smooth(pts) {
    let d = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      d += ` C${n(p1[0] + (p2[0] - p0[0]) / 6)},${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)},${n(p2[1] - (p3[1] - p1[1]) / 6)} ${n(p2[0])},${n(p2[1])}`;
    }
    return d;
  }

  /** A ridge line: returns { d, y(x) }. opts: seed, base, amp, waves [[length, weight]], peaks, clampTop, step */
  function ridge(x0, x1, o) {
    const r = WF.rng(o.seed || 1);
    const waves = (o.waves || [[800, 1], [300, 0.4], [120, 0.15]]).map(([len, w]) => [len, w, r() * Math.PI * 2]);
    const y = (x) => {
      let v = 0;
      for (const [len, w, ph] of waves) {
        const s = Math.sin((x / len) * Math.PI * 2 + ph);
        v += w * (o.peaks ? (1 - Math.abs(s)) * 2 - 1 : s);
      }
      if (o.clampTop != null) v = Math.min(v, o.clampTop);
      return o.base - o.amp * v;
    };
    const step = o.step || 40;
    const pts = [];
    for (let x = x0 - step; x <= x1 + step; x += step) pts.push([x, y(x)]);
    const bottom = o.bottom || H + 60;
    const d = `M${pts[0][0]},${bottom} L${pts[0][0]},${n(pts[0][1])}${smooth(pts)} L${pts[pts.length - 1][0]},${bottom} Z`;
    return { d, y };
  }

  function scatter(x0, x1, seed, spacing, fn) {
    const r = WF.rng(seed);
    let out = '';
    for (let x = x0 + r() * spacing; x < x1; x += spacing * (0.5 + r())) out += fn(x, r);
    return out;
  }

  const grad = (id, stops, vertical = true) =>
    `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">${stops
      .map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a != null ? ` stop-opacity="${a}"` : ''}/>`)
      .join('')}</linearGradient>`;

  function scrub(x, y, s, color, r) {
    let out = `<g transform="translate(${n(x)},${n(y)}) scale(${n(s)})" fill="${color}">`;
    const count = 4 + Math.floor(r() * 4);
    for (let i = 0; i < count; i++) {
      out += `<ellipse cx="${n((r() - 0.5) * 34)}" cy="${n(-6 - r() * 12)}" rx="${n(8 + r() * 10)}" ry="${n(6 + r() * 6)}"/>`;
    }
    return out + '</g>';
  }

  function tuft(x, y, s, color, r, cls = '') {
    let out = `<g transform="translate(${n(x)},${n(y)}) scale(${n(s)})"><g class="sway ${cls}" style="animation-delay:${n(-r() * 6)}s"><g fill="none" stroke="${color}" stroke-linecap="round" stroke-width="2.2">`;
    const blades = 5 + Math.floor(r() * 5);
    for (let i = 0; i < blades; i++) {
      const bx = (r() - 0.5) * 18;
      const h = 14 + r() * 22;
      const lean = (r() - 0.5) * 20;
      out += `<path d="M${n(bx)},0 Q${n(bx + lean * 0.3)},${n(-h * 0.6)} ${n(bx + lean)},${n(-h)}"/>`;
    }
    return out + '</g></g></g>';
  }

  function rock(x, y, s, color, r) {
    const w = 20 + r() * 26;
    const h = 8 + r() * 14;
    return `<path transform="translate(${n(x)},${n(y)}) scale(${n(s)})" d="M${n(-w)},0 C${n(-w)},${n(-h)} ${n(-w * 0.3)},${n(-h * 1.3)} ${n(w * 0.2)},${n(-h * 1.1)} C${n(w * 0.8)},${n(-h)} ${n(w)},${n(-h * 0.4)} ${n(w)},0 Z" fill="${color}"/>`;
  }

  function pathBand(x0, x1, seed, color, light) {
    const r = WF.rng(seed);
    const ph = r() * 6;
    const top = [];
    const bot = [];
    for (let x = x0 - 60; x <= x1 + 60; x += 60) {
      const w = Math.sin(x / 420 + ph) * 4;
      top.push([x, GROUND - 12 + w]);
      bot.push([x, GROUND + 18 + w * 1.4]);
    }
    const back = bot.slice().reverse();
    const d = `M${top[0][0]},${n(top[0][1])}${smooth(top)} L${back[0][0]},${n(back[0][1])}${smooth(back)} Z`;
    let marks = '';
    if (light) {
      marks = scatter(x0, x1, seed + 3, 90, (x, rr) =>
        `<ellipse cx="${n(x)}" cy="${n(GROUND + 2 + rr() * 12)}" rx="${n(10 + rr() * 22)}" ry="1.6" fill="${light}" opacity="${n(0.2 + rr() * 0.25)}"/>`);
    }
    return `<path d="${d}" fill="${color}"/>${marks}`;
  }

  /* ---------- skies ---------- */

  /** Sky in world units. viewX/viewW: horizontal span; top/height: vertical span (top may be negative). */
  function sky(scene, id, viewW, top, height) {
    const s = scene.sky;
    const span = 1000; // gradient spans y = -400 … 600
    const stops = s.stops.map(([y, c]) => `<stop offset="${WF.clamp((y + 400) / span, 0, 1).toFixed(3)}" stop-color="${c}"/>`).join('');
    let out = `<defs><linearGradient id="${id}-sky" gradientUnits="userSpaceOnUse" x1="0" y1="-400" x2="0" y2="600">${stops}</linearGradient>`;
    if (s.sun) {
      out += `<radialGradient id="${id}-sunglow"><stop offset="0" stop-color="${s.sun.glow}" stop-opacity="1"/><stop offset="1" stop-color="${s.sun.glow}" stop-opacity="0"/></radialGradient>`;
    }
    out += `</defs><rect x="-10" y="${n(top - 10)}" width="${n(viewW + 20)}" height="${n(height + 20)}" fill="url(#${id}-sky)"/>`;
    if (s.stars) {
      const r = WF.rng(77);
      const count = Math.round((viewW * (s.starLine - top)) / 2600 * s.stars);
      for (let i = 0; i < count; i++) {
        const y = top + r() * (s.starLine - top);
        const fade = WF.clamp((s.starLine - y) / 200, 0.15, 1);
        const big = r() > 0.93;
        out += `<circle class="tw" style="animation-delay:${n(-r() * 5)}s" cx="${n(r() * viewW)}" cy="${n(y)}" r="${big ? 1.6 : n(0.5 + r() * 0.7)}" fill="#f6efe2" opacity="${n(fade * (0.35 + r() * 0.6))}"/>`;
      }
    }
    if (s.sun) {
      const x = viewW * s.sun.x;
      out += `<circle cx="${n(x)}" cy="${s.sun.y}" r="${s.sun.r * 5}" fill="url(#${id}-sunglow)" opacity=".7"/><circle cx="${n(x)}" cy="${s.sun.y}" r="${s.sun.r}" fill="${s.sun.color}"/>`;
    }
    if (s.moon) {
      const x = viewW * s.moon.x;
      out += `<circle cx="${n(x)}" cy="${s.moon.y}" r="${s.moon.r * 5}" fill="url(#wf-soft)" opacity=".35"/><circle cx="${n(x)}" cy="${s.moon.y}" r="${s.moon.r}" fill="#f3ead8"/><circle cx="${n(x + s.moon.r * 0.45)}" cy="${n(s.moon.y - s.moon.r * 0.2)}" r="${s.moon.r * 0.92}" fill="${s.moon.shade}"/>`;
    }
    return out;
  }

  /* ---------- scenes ---------- */
  // Each layer: { f: parallax factor, draw(x0, x1) => svg string }. f === 1 is the walkable world layer.

  const scenes = {};

  scenes.title = {
    mood: 'home',
    groundFill: '#1a1530',
    sky: {
      stops: [[-400, '#090c20'], [0, '#141a3a'], [150, '#2b2858'], [260, '#5a3f6f'], [330, '#a5627a'], [380, '#e39a62'], [420, '#f3c486']],
      stars: 1.1, starLine: 320,
      moon: { x: 0.18, y: 40, r: 16, shade: '#151b3c' },
    },
    layers: [
      { f: 0.15, draw: (a, b) => `<path d="${ridge(a, b, { seed: 3, base: 372, amp: 70, peaks: true, waves: [[620, 1], [240, 0.4]], step: 30 }).d}" fill="#3f3466"/>` },
      { f: 0.35, draw: (a, b) => `<path d="${ridge(a, b, { seed: 8, base: 410, amp: 28, waves: [[700, 1], [210, 0.3]] }).d}" fill="#2e2750"/>` },
      { f: 0.7, draw: (a, b) => `<path d="${ridge(a, b, { seed: 12, base: 445, amp: 22 }).d}" fill="#221d3e"/>` + scatter(a, b, 5, 170, (x, r) => scrub(x, 450 + r() * 8, 0.8, '#1a1631', r)) },
      {
        f: 1,
        draw: (a, b) => {
          const mid = (a + b) / 2;
          return `${grad('title-path', [[0, '#f0b96e', 0.75], [1, '#8d6a7c', 0.15]])}
          <path d="${ridge(a, b, { seed: 21, base: 470, amp: 10 }).d}" fill="#181430"/>
          <path d="M${mid - 210},600 C${mid - 90},545 ${mid + 70},530 ${mid + 20},500 C${mid - 30},475 ${mid + 120},462 ${mid + 160},452 L${mid + 168},452 C${mid + 140},466 ${mid + 10},480 ${mid + 60},502 C${mid + 120},530 ${mid + 40},560 ${mid + 120},600 Z" fill="url(#title-path)"/>
          <g transform="translate(${mid + 40},508) scale(.42)">${figures.traveller()}</g>`;
        },
      },
      { f: 1.3, draw: (a, b) => scatter(a, b, 31, 210, (x, r) => tuft(x, 600, 1.4, '#120f24', r)) },
    ],
  };

  scenes.road = {
    mood: 'road',
    label: 'Wilderness at evening',
    groundFill: '#2a2138',
    sky: {
      stops: [[-400, '#0e1330'], [40, '#1f2450'], [190, '#43356a'], [290, '#8e5677'], [360, '#d98c5f'], [410, '#f0bd7c']],
      stars: 0.4, starLine: 220,
      sun: { x: 0.72, y: 382, r: 44, color: '#ffd8a0', glow: '#ffb877' },
    },
    layers: [
      { f: 0.1, draw: (a, b) => `${grad('road-haze', [[0, '#d98c5f', 0], [1, '#d98c5f', 0.5]])}<path d="${ridge(a, b, { seed: 11, base: 392, amp: 58, clampTop: 0.5, waves: [[900, 1], [330, 0.35], [120, 0.1]] }).d}" fill="#5a4877"/><rect x="${a}" y="330" width="${b - a}" height="150" fill="url(#road-haze)"/>` },
      { f: 0.3, draw: (a, b) => `<path d="${ridge(a, b, { seed: 23, base: 424, amp: 24, waves: [[700, 1], [260, 0.4]] }).d}" fill="#45375f"/>` },
      {
        f: 0.6,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 37, base: 456, amp: 16 });
          return `<path d="${rg.d}" fill="#4f3d5a"/>` + scatter(a, b, 9, 140, (x, r) => scrub(x, rg.y(x) + 4, 0.7 + r() * 0.5, '#3b3343', r));
        },
      },
      {
        f: 1,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 41, base: 482, amp: 8, waves: [[600, 1], [180, 0.3]] });
          return `${grad('road-ground', [[0, '#6c5150'], [0.4, '#4a3a48'], [1, '#261f36']])}
            <path d="${rg.d}" fill="url(#road-ground)"/>
            ${scatter(a, b, 13, 120, (x, r) => scrub(x, rg.y(x) + 6, 0.6 + r() * 0.6, r() > 0.5 ? '#5e6340' : '#4b4e36', r))}
            ${pathBand(a, b, 17, '#9c7a66', '#d6b394')}
            ${scatter(a, b, 19, 160, (x, r) => rock(x, 545 + r() * 30, 0.6 + r() * 0.5, '#33283f', r))}
            ${scatter(a, b, 29, 130, (x, r) => tuft(x, 540 + r() * 40, 0.8 + r() * 0.5, '#5b5a3c', r))}`;
        },
      },
      { f: 1.35, draw: (a, b) => scatter(a, b, 43, 380, (x, r) => tuft(x, 604, 1.6 + r(), '#191427', r) + rock(x + 40, 606, 1.4, '#1b1528', r)) },
    ],
  };

  scenes.juniper = {
    mood: 'juniper',
    label: 'Desert shade in late afternoon',
    groundFill: '#5b4234',
    sky: {
      stops: [[-400, '#1d275a'], [80, '#384077'], [220, '#8a6487'], [310, '#e19d66'], [400, '#f7d9a0']],
      stars: 0, starLine: 0,
      sun: { x: 0.22, y: 215, r: 34, color: '#fff2cf', glow: '#ffd79a' },
    },
    layers: [
      { f: 0.1, draw: (a, b) => `<path d="${ridge(a, b, { seed: 51, base: 392, amp: 34, waves: [[1000, 1], [300, 0.25]] }).d}" fill="#9b7891" opacity=".9"/>` },
      { f: 0.3, draw: (a, b) => `<path d="${ridge(a, b, { seed: 53, base: 425, amp: 24, waves: [[800, 1], [260, 0.3]] }).d}" fill="#b07f74"/>` },
      {
        f: 0.6,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 57, base: 456, amp: 16 });
          return `<path d="${rg.d}" fill="#bf8c62"/>` + scatter(a, b, 61, 200, (x, r) => scrub(x, rg.y(x) + 4, 0.6, '#8f7a4c', r));
        },
      },
      {
        f: 1,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 63, base: 480, amp: 7 });
          return `${grad('jun-ground', [[0, '#cf9d68'], [0.45, '#a97650'], [1, '#6d4c3b']])}
            <path d="${rg.d}" fill="url(#jun-ground)"/>
            ${pathBand(a, b, 67, '#e3bf8c', '#f6dcae')}
            ${scatter(a, b, 71, 150, (x, r) => rock(x, 548 + r() * 30, 0.6 + r() * 0.5, '#8a5e45', r))}
            ${scatter(a, b, 73, 160, (x, r) => tuft(x, 545 + r() * 40, 0.8 + r() * 0.4, '#8c8a52', r))}`;
        },
      },
      { f: 1.35, draw: (a, b) => scatter(a, b, 79, 420, (x, r) => tuft(x, 604, 1.6 + r(), '#4b3428', r) + rock(x + 50, 606, 1.4, '#4e3628', r)) },
    ],
  };

  scenes.pass = {
    mood: 'pass',
    label: 'Mountain pass at nightfall',
    groundFill: '#1d1b33',
    sky: {
      stops: [[-400, '#060a1c'], [0, '#10173a'], [200, '#232859'], [320, '#4a3a6d'], [390, '#7b5176']],
      stars: 1.2, starLine: 330,
      moon: { x: 0.82, y: 70, r: 15, shade: '#121a3c' },
    },
    layers: [
      { f: 0.1, draw: (a, b) => `<path d="${ridge(a, b, { seed: 81, base: 330, amp: 105, peaks: true, waves: [[520, 1], [190, 0.35]], step: 24 }).d}" fill="#30366a"/><path d="${ridge(a, b, { seed: 81, base: 334, amp: 105, peaks: true, waves: [[520, 1], [190, 0.35]], step: 24 }).d}" fill="#262b58" opacity=".6"/>` },
      { f: 0.3, draw: (a, b) => `<path d="${ridge(a, b, { seed: 83, base: 392, amp: 64, peaks: true, waves: [[420, 1], [150, 0.3]], step: 24 }).d}" fill="#232650"/>` },
      { f: 0.6, draw: (a, b) => `<path d="${ridge(a, b, { seed: 87, base: 446, amp: 26 }).d}" fill="#1c1d40"/>` },
      {
        f: 1,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 89, base: 480, amp: 10 });
          return `${grad('pass-ground', [[0, '#3b3659'], [0.5, '#2a2746'], [1, '#17152b']])}
            <path d="${rg.d}" fill="url(#pass-ground)"/>
            ${pathBand(a, b, 91, '#4f4870', '#8d84b0')}
            ${scatter(a, b, 93, 120, (x, r) => rock(x, 550 + r() * 30, 0.6 + r() * 0.6, '#221f3a', r))}
            ${scatter(a, b, 97, 170, (x, r) => tuft(x, 545 + r() * 40, 0.8 + r() * 0.4, '#3f4a3a', r))}`;
        },
      },
      { f: 1.35, draw: (a, b) => scatter(a, b, 99, 400, (x, r) => rock(x, 606, 1.8, '#0f0e1f', r) + tuft(x + 60, 604, 1.6, '#0f0e1f', r)) },
    ],
  };

  scenes.cave = {
    mood: 'cave',
    label: 'Horeb at night',
    groundFill: '#141327',
    sky: {
      stops: [[-400, '#04071a'], [60, '#0b1132'], [260, '#1a1f4a'], [360, '#30295a'], [420, '#4a3463']],
      stars: 1.6, starLine: 360,
      moon: { x: 0.62, y: 110, r: 20, shade: '#0c1235' },
    },
    layers: [
      { f: 0.1, draw: (a, b) => `<path d="${ridge(a, b, { seed: 101, base: 372, amp: 80, peaks: true, waves: [[560, 1], [210, 0.4]], step: 24 }).d}" fill="#1e2350"/>` },
      { f: 0.35, draw: (a, b) => `<path d="${ridge(a, b, { seed: 103, base: 420, amp: 40, peaks: true, waves: [[460, 1], [160, 0.3]], step: 24 }).d}" fill="#171a3f"/>` },
      {
        f: 1,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 107, base: 482, amp: 8 });
          return `${grad('cave-ground', [[0, '#2c2846'], [0.5, '#1f1c37'], [1, '#100f22']])}
            <path d="${rg.d}" fill="url(#cave-ground)"/>
            ${pathBand(a, b, 109, '#3b355a', '#7a72a0')}
            ${scatter(a, b, 111, 110, (x, r) => rock(x, 550 + r() * 30, 0.7 + r() * 0.6, '#191731', r))}`;
        },
      },
      { f: 1.35, draw: (a, b) => scatter(a, b, 113, 380, (x, r) => rock(x, 606, 2, '#0a0918', r)) },
    ],
  };

  scenes.dawn = {
    mood: 'dawn',
    label: 'A valley at dawn',
    groundFill: '#3d3b28',
    sky: {
      stops: [[-400, '#252b5c'], [60, '#4d457a'], [200, '#a57492'], [300, '#eda57a'], [380, '#fbdcab'], [420, '#fff0d0']],
      stars: 0.15, starLine: 80,
      sun: { x: 0.55, y: 392, r: 52, color: '#fff0c8', glow: '#ffcf8f' },
    },
    layers: [
      { f: 0.1, draw: (a, b) => `<path d="${ridge(a, b, { seed: 121, base: 388, amp: 30, waves: [[1100, 1], [320, 0.3]] }).d}" fill="#9a84a6" opacity=".95"/>` },
      {
        f: 0.3,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 123, base: 424, amp: 22, waves: [[800, 1], [240, 0.3]] });
          let lights = '';
          const r = WF.rng(127);
          for (let i = 0; i < 140; i++) {
            const x = a + r() * (b - a);
            const y = rg.y(x) + 6 + r() * 22;
            const early = r() < 0.12;
            lights += `<circle class="vlight${early ? ' early' : ''}" style="transition-delay:${n(r() * 4)}s" cx="${n(x)}" cy="${n(y)}" r="${n(1.3 + r() * 1.4)}" fill="#ffd28a"/>`;
          }
          return `<path d="${rg.d}" fill="#757651"/>${lights}`;
        },
      },
      {
        f: 0.6,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 131, base: 458, amp: 14 });
          let furrows = '';
          for (let i = 0; i < 5; i++) furrows += `<path d="${ridge(a, b, { seed: 131, base: 464 + i * 7, amp: 14 }).d}" fill="none" stroke="#5d5f3c" stroke-width="1.2" opacity=".6"/>`;
          return `<path d="${rg.d}" fill="#6c6f45"/>${furrows}` + scatter(a, b, 133, 220, (x, r) => scrub(x, rg.y(x) + 3, 0.8, '#55583a', r));
        },
      },
      {
        f: 1,
        draw: (a, b) => {
          const rg = ridge(a, b, { seed: 137, base: 482, amp: 7 });
          return `${grad('dawn-ground', [[0, '#878452'], [0.45, '#66633f'], [1, '#3a3826']])}
            <path d="${rg.d}" fill="url(#dawn-ground)"/>
            ${pathBand(a, b, 139, '#c4a77a', '#f1d9ad')}
            ${scatter(a, b, 141, 90, (x, r) => tuft(x, 540 + r() * 45, 0.8 + r() * 0.5, '#7a8150', r))}
            ${scatter(a, b, 143, 140, (x, r) => `<circle cx="${n(x)}" cy="${n(548 + r() * 40)}" r="${n(2 + r() * 2)}" fill="${r() > 0.5 ? '#f3d6dd' : '#f6efe2'}" opacity=".85"/>`)}`;
        },
      },
      { f: 1.35, draw: (a, b) => scatter(a, b, 147, 360, (x, r) => tuft(x, 604, 1.7 + r(), '#3c3b26', r)) },
    ],
  };

  /* ---------- figures ---------- */

  const figures = {
    traveller() {
      return `<g class="figure traveller">
        <ellipse cx="0" cy="2" rx="22" ry="5" fill="#000" opacity=".28"/>
        <g class="leg leg-a"><path d="M-5,-28 L-6,-3" stroke="#251d34" stroke-width="7" stroke-linecap="round"/><path d="M-7,-2 L1,-1" stroke="#1b1527" stroke-width="5" stroke-linecap="round"/></g>
        <g class="leg leg-b"><path d="M5,-28 L6,-3" stroke="#2c2340" stroke-width="7" stroke-linecap="round"/><path d="M5,-2 L13,-1" stroke="#1b1527" stroke-width="5" stroke-linecap="round"/></g>
        <g class="body">
          <path d="M-14,-86 C-22,-64 -26,-40 -22,-22 C-8,-18 9,-18 21,-22 C24,-42 21,-66 13,-86 Z" fill="#4e3d74"/>
          <path d="M-14,-86 C-22,-64 -26,-40 -22,-22 C-16,-21 -12,-21 -9,-22 C-13,-44 -12,-66 -6,-86 Z" fill="#3b2c5b"/>
          <path d="M-1,-80 C-3,-60 -2,-40 0,-23 L6,-23 C7,-42 6,-62 5,-80 Z" fill="#e6d7bd" opacity=".85"/>
          <path d="M11,-82 L-10,-44" stroke="#7a5640" stroke-width="3"/>
          <rect x="-19" y="-48" width="14" height="13" rx="3" fill="#7a5640"/>
          <g class="lantern"><circle cx="-16" cy="-30" r="20" fill="url(#wf-lamp)"/><path d="M-16,-41 L-16,-37" stroke="#3a2b22" stroke-width="1.5"/><rect x="-19.5" y="-37" width="7" height="9" rx="2" fill="#ffd27a" stroke="#6b4a2c" stroke-width="1"/></g>
          <path d="M-12,-86 C-15,-104 -3,-114 6,-110 C15,-106 16,-93 12,-85 Z" fill="#5c4886"/>
          <ellipse cx="6" cy="-95" rx="5.5" ry="7" fill="#c99b78"/>
          <path d="M1,-104 C6,-108 12,-104 12,-97" stroke="#5c4886" stroke-width="3" fill="none"/>
          <line x1="22" y1="-116" x2="20" y2="0" stroke="#8a6a48" stroke-width="3" stroke-linecap="round"/>
          <path d="M11,-76 C17,-68 19,-60 20,-56" stroke="#4e3d74" stroke-width="7" stroke-linecap="round" fill="none"/>
          <circle cx="20.5" cy="-56" r="3.6" fill="#c99b78"/>
        </g>
      </g>`;
    },
    hanan() {
      return `<g class="figure hanan">
        <ellipse cx="0" cy="2" rx="22" ry="5" fill="#000" opacity=".28"/>
        <path d="M-6,-24 L-7,-2 M6,-24 L7,-2" stroke="#2f2a1f" stroke-width="7" stroke-linecap="round"/>
        <g class="body">
          <path d="M-15,-82 C-24,-60 -27,-36 -23,-18 C-8,-14 10,-14 23,-18 C25,-40 21,-64 13,-82 Z" fill="#6c6b40"/>
          <path d="M-15,-82 C-24,-60 -27,-36 -23,-18 C-17,-17 -13,-17 -10,-18 C-14,-40 -13,-62 -7,-82 Z" fill="#555430"/>
          <path d="M-20,-30 L22,-34" stroke="#a47a4f" stroke-width="3"/>
          <path d="M-13,-80 C-18,-98 -6,-110 4,-108 C14,-106 17,-94 13,-80 C6,-74 -6,-74 -13,-80 Z" fill="#e7dbc3"/>
          <ellipse cx="4" cy="-91" rx="6" ry="7.5" fill="#b9876a"/>
          <path d="M-1,-87 C0,-78 9,-76 11,-86 C9,-83 3,-83 -1,-87 Z" fill="#d8d1c6"/>
          <line x1="-24" y1="-112" x2="-22" y2="0" stroke="#7d5c3c" stroke-width="3.2" stroke-linecap="round"/>
          <path d="M-11,-72 C-17,-66 -21,-62 -22,-58" stroke="#6c6b40" stroke-width="7" stroke-linecap="round" fill="none"/>
          <circle cx="-22.5" cy="-58" r="3.6" fill="#b9876a"/>
        </g>
      </g>`;
    },
  };

  /* ---------- props (hotspot art) ---------- */

  const props = {
    pack: () => `<ellipse cx="0" cy="2" rx="36" ry="6" fill="#000" opacity=".25"/>
      <path d="M-26,0 C-30,-30 -24,-52 -6,-56 L10,-56 C26,-52 30,-30 26,0 Z" fill="#7a5640"/>
      <path d="M-22,-38 C-8,-46 8,-46 22,-38 L24,-22 C8,-30 -8,-30 -24,-22 Z" fill="#5f4232"/>
      <rect x="-4" y="-30" width="8" height="10" rx="2" fill="#d4ad72"/>
      <rect x="-31" y="-68" width="62" height="15" rx="7.5" fill="#9b8a6c"/><path d="M-12,-68 V-53 M12,-68 V-53" stroke="#6f6048" stroke-width="2"/>`,

    page: () => `<ellipse cx="0" cy="2" rx="28" ry="5" fill="#000" opacity=".25"/>
      <path d="M-26,0 C-24,-18 22,-20 28,0 Z" fill="#6d6274"/>
      <g transform="translate(0,-17) rotate(-8)">
        <rect x="-17" y="-6.5" width="34" height="13" rx="3" fill="#f4e8cc"/>
        <circle cx="-17" cy="0" r="6.5" fill="#e3cfa4"/><circle cx="17" cy="0" r="6.5" fill="#e3cfa4"/>
        <path d="M-10,-2.5 H10 M-10,1.5 H5" stroke="#a88f6a" stroke-width="1.2"/>
      </g>`,

    cairn: (lit) => `<ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity=".25"/>
      ${lit ? '<circle cx="0" cy="-60" r="70" fill="url(#wf-glow)"/>' : ''}
      <ellipse cx="0" cy="-8" rx="26" ry="10" fill="#6e6680"/>
      <ellipse cx="3" cy="-24" rx="20" ry="9" fill="#7c7490"/>
      <ellipse cx="-1" cy="-38" rx="15" ry="7" fill="#8a82a0"/>
      <ellipse cx="2" cy="-49" rx="10" ry="5" fill="#9a92b0"/>
      ${lit ? '<g class="flicker"><ellipse cx="2" cy="-62" rx="6" ry="9" fill="#ffcf7a"/><ellipse cx="2" cy="-60" rx="3" ry="5" fill="#fff4d0"/></g>' : '<ellipse cx="2" cy="-58" rx="5" ry="3" fill="#a59cb8"/>'}`,

    bloom: () => {
      const r = WF.rng(211);
      let out = '<ellipse cx="0" cy="2" rx="34" ry="5" fill="#000" opacity=".22"/><g stroke="#4a3b35" stroke-width="2" fill="none" stroke-linecap="round">';
      for (let i = 0; i < 10; i++) out += `<path d="M${n((r() - 0.5) * 10)},0 Q${n((r() - 0.5) * 40)},-20 ${n((r() - 0.5) * 60)},${n(-24 - r() * 28)}"/>`;
      out += '</g>';
      for (let i = 0; i < 22; i++) out += `<circle cx="${n((r() - 0.5) * 60)}" cy="${n(-18 - r() * 36)}" r="${n(2 + r() * 2)}" fill="${r() > 0.5 ? '#f2c6d2' : '#fbeef0'}"/>`;
      return out;
    },

    broomTree: () => {
      const r = WF.rng(311);
      let stems = '';
      let blossoms = '';
      for (let i = 0; i < 26; i++) {
        const bx = (r() - 0.5) * 22;
        const ex = (r() - 0.5) * 300;
        const ey = -150 - r() * 120;
        const cx = bx + ex * 0.15;
        const cy = ey * 0.55;
        stems += `<path d="M${n(bx)},0 Q${n(cx)},${n(cy)} ${n(ex)},${n(ey)}" stroke-width="${n(1.6 + r() * 3)}"/>`;
        for (let k = 0; k < 7; k++) {
          const t = 0.55 + r() * 0.45;
          const px = (1 - t) * (1 - t) * bx + 2 * (1 - t) * t * cx + t * t * ex;
          const py = (1 - t) * (1 - t) * 0 + 2 * (1 - t) * t * cy + t * t * ey;
          blossoms += `<circle cx="${n(px + (r() - 0.5) * 12)}" cy="${n(py + (r() - 0.5) * 12)}" r="${n(2 + r() * 2.6)}" fill="${r() > 0.6 ? '#f1d3dc' : '#fbf3ea'}" opacity="${n(0.75 + r() * 0.25)}"/>`;
        }
      }
      return `<ellipse cx="10" cy="4" rx="170" ry="16" fill="#000" opacity=".2"/>
        <g class="sway slow"><g stroke="#4f4038" fill="none" stroke-linecap="round">${stems}</g>${blossoms}</g>`;
    },

    coals: () => `<ellipse cx="0" cy="2" rx="40" ry="7" fill="#000" opacity=".3"/>
      <circle cx="0" cy="-10" r="60" fill="url(#wf-glow)" opacity=".7"/>
      <g fill="#5a4a48"><ellipse cx="-30" cy="-4" rx="10" ry="7"/><ellipse cx="30" cy="-4" rx="10" ry="7"/><ellipse cx="-14" cy="-2" rx="9" ry="6"/><ellipse cx="14" cy="-2" rx="9" ry="6"/></g>
      <ellipse class="ember" cx="0" cy="-6" rx="22" ry="7" fill="url(#wf-coal)"/>
      <ellipse cx="0" cy="-12" rx="18" ry="5.5" fill="#d9a865"/><ellipse cx="0" cy="-13.5" rx="14" ry="3.2" fill="#e9c189"/>
      <circle cx="-6" cy="-13" r="1.2" fill="#9b6a3a"/><circle cx="5" cy="-12" r="1.2" fill="#9b6a3a"/>
      <g class="smoke" fill="none" stroke="#f6efe2" stroke-width="3" stroke-linecap="round" opacity=".25"><path d="M-4,-22 C-12,-36 6,-44 -2,-60"/><path d="M6,-24 C0,-40 14,-48 6,-66"/></g>`,

    jar: () => `<ellipse cx="0" cy="2" rx="20" ry="4" fill="#000" opacity=".3"/>
      <path d="M-10,-44 L10,-44 L8,-38 C22,-30 22,-6 12,0 L-12,0 C-22,-6 -22,-30 -8,-38 Z" fill="#a9623f"/>
      <path d="M-12,-49 H12 V-43 H-12 Z" fill="#874a2f"/>
      <path d="M-17,-22 H17" stroke="#7a4128" stroke-width="2" opacity=".6"/>
      <path d="M-7,-32 C-13,-24 -13,-12 -9,-6" stroke="#dd9e70" stroke-width="3" fill="none" opacity=".7"/>
      <ellipse cx="0" cy="-48" rx="9" ry="2" fill="#2d4a66"/>`,

    hanan: () => figures.hanan(),

    caveMountain: () => {
      const r = WF.rng(401);
      let cracks = '';
      for (let i = 0; i < 9; i++) {
        const x = (r() - 0.5) * 520;
        const y = -80 - r() * 240;
        cracks += `<path d="M${n(x)},${n(y)} l${n((r() - 0.5) * 30)},${n(20 + r() * 40)}" stroke="#121027" stroke-width="2" fill="none" opacity=".6"/>`;
      }
      return `<path d="M-360,0 C-330,-90 -300,-170 -230,-230 C-180,-280 -120,-330 -40,-372 C10,-390 50,-376 90,-340 C160,-290 230,-210 290,-110 C320,-60 340,-20 360,0 Z" fill="#26234a"/>
        <path d="M-40,-372 C10,-390 50,-376 90,-340 C140,-300 180,-250 200,-210 C120,-260 40,-300 -40,-372 Z" fill="#3a3666" opacity=".7"/>
        ${cracks}
        <path d="M-58,0 C-60,-60 -40,-104 0,-108 C40,-104 60,-60 58,0 Z" fill="#06061a"/>
        <path d="M-40,0 C-40,-48 -24,-80 0,-82 C24,-80 40,-48 40,0 Z" fill="#0d0c26"/>
        <ellipse cx="0" cy="-4" rx="34" ry="6" fill="#2a2240" opacity=".8"/>`;
    },

    ledge: () => `<path d="M-90,0 C-86,-26 -60,-40 -20,-44 C20,-46 70,-40 92,-24 C100,-14 100,-4 96,0 Z" fill="#2b2848"/>
      <path d="M-70,-30 C-30,-42 30,-44 80,-30" stroke="#4a4570" stroke-width="3" fill="none" opacity=".7"/>
      ${tuft(-60, -36, 0.9, '#3a4235', WF.rng(9))}${tuft(64, -32, 0.8, '#3a4235', WF.rng(19))}`,

    overlook: () => `<path d="M-70,0 C-66,-18 -40,-28 0,-30 C40,-30 66,-20 72,0 Z" fill="#8c7d63"/>
      <path d="M-50,-22 C-20,-30 20,-30 50,-22" stroke="#b4a383" stroke-width="3" fill="none" opacity=".7"/>
      ${props.cairn(false).replace('<ellipse cx="0" cy="2" rx="30" ry="6" fill="#000" opacity=".25"/>', '').replace(/^/, '<g transform="translate(40,-26) scale(.55)">') + '</g>'}`,

    elisha: () => {
      const ox = (x) => `<g transform="translate(${x},0)" fill="#5b4636">
        <ellipse cx="0" cy="-30" rx="32" ry="16"/><path d="M26,-38 C38,-44 46,-38 48,-28 C46,-22 38,-22 32,-24 Z"/>
        <path d="M38,-42 C40,-50 46,-50 48,-48 M36,-42 C32,-50 28,-50 26,-48" stroke="#d9cbb0" stroke-width="2" fill="none"/>
        <path d="M-24,-20 V0 M-14,-18 V0 M16,-18 V0 M24,-20 V0" stroke="#4a382b" stroke-width="5" stroke-linecap="round"/></g>`;
      return `<ellipse cx="-30" cy="3" rx="120" ry="8" fill="#000" opacity=".2"/>
        ${ox(-110)}${ox(-40)}
        <path d="M-60,-40 H10" stroke="#7a5a3a" stroke-width="4"/>
        <path d="M10,-40 L44,-8 L58,-2 M30,-24 L50,-30" stroke="#7a5a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g transform="translate(70,0) scale(.95)"><path d="M-6,-24 L-7,-2 M6,-24 L7,-2" stroke="#2f2a1f" stroke-width="7" stroke-linecap="round"/>
          <path d="M-14,-80 C-22,-58 -24,-36 -20,-20 C-6,-16 8,-16 20,-20 C22,-38 19,-60 12,-80 Z" fill="#8d5f45"/>
          <path d="M-12,-80 C-15,-96 -4,-106 4,-104 C12,-102 14,-92 11,-80 Z" fill="#3a2a22"/>
          <ellipse cx="-2" cy="-90" rx="5.5" ry="7" fill="#b98a6a"/>
          <path d="M-10,-66 C-18,-56 -24,-48 -28,-44" stroke="#8d5f45" stroke-width="7" stroke-linecap="round" fill="none"/></g>`;
    },

    exitPost: () => `<circle cx="0" cy="-80" r="70" fill="url(#wf-glow)" class="exit-glow"/>
      <rect x="-4" y="-104" width="8" height="104" rx="3" fill="#6b4f39"/>
      <path d="M2,-96 H44 L56,-86 L44,-76 H2 Z" fill="#8b6a4b"/>
      <path d="M12,-86 H40" stroke="#f6efe2" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      <rect x="-8" y="-120" width="16" height="16" rx="3" fill="#ffd27a" stroke="#6b4a2c" stroke-width="1.5"/>`,
  };

  /* ---------- global defs (shared gradients) ---------- */

  function installDefs() {
    if (document.getElementById('wf-defs')) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', 'wf-defs');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML = `<defs>
      <radialGradient id="wf-glow"><stop offset="0" stop-color="#ffd896" stop-opacity=".7"/><stop offset=".45" stop-color="#f3b866" stop-opacity=".22"/><stop offset="1" stop-color="#f3b866" stop-opacity="0"/></radialGradient>
      <radialGradient id="wf-lamp"><stop offset="0" stop-color="#ffe2a6" stop-opacity=".8"/><stop offset="1" stop-color="#ffcf7a" stop-opacity="0"/></radialGradient>
      <radialGradient id="wf-coal"><stop offset="0" stop-color="#fff0b0"/><stop offset=".45" stop-color="#ff9a3c"/><stop offset="1" stop-color="#7a2a10" stop-opacity=".2"/></radialGradient>
      <radialGradient id="wf-soft"><stop offset="0" stop-color="#fff6e2" stop-opacity=".55"/><stop offset="1" stop-color="#fff6e2" stop-opacity="0"/></radialGradient>
      <linearGradient id="wf-veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#05071a" stop-opacity="0"/><stop offset=".22" stop-color="#05071a" stop-opacity=".88"/><stop offset="1" stop-color="#05071a" stop-opacity=".94"/></linearGradient>
    </defs>`;
    document.body.prepend(svg);
  }

  /** Static painted backdrop for menu screens. */
  function backdrop(sceneName) {
    const scene = scenes[sceneName] || scenes.title;
    const W = 1600;
    let inner = sky(scene, `bd-${sceneName}`, W, -320, 920);
    scene.layers.forEach((L) => { inner += L.draw(0, W); });
    return `<svg viewBox="0 -320 ${W} 920" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${inner}</svg>`;
  }

  /** Imagined, not-to-scale map for "Explore the World". */
  function worldMap() {
    return `<svg viewBox="0 0 700 640" class="map-svg" aria-hidden="true">
      <defs>
        ${grad('map-land', [[0, '#e9dcc2'], [1, '#cdb994']])}
        <pattern id="map-waves" width="28" height="12" patternUnits="userSpaceOnUse"><path d="M0,6 Q7,1 14,6 T28,6" stroke="#3b4f7a" stroke-width="1" fill="none" opacity=".5"/></pattern>
      </defs>
      <rect width="700" height="640" rx="20" fill="#1b2a52"/>
      <rect width="700" height="640" rx="20" fill="url(#map-waves)"/>
      <path d="M260,0 C250,70 238,140 240,200 C242,260 222,320 196,380 C170,440 120,480 70,520 C40,545 0,560 0,560 L0,640 L700,640 L700,0 Z" fill="url(#map-land)"/>
      <path d="M0,560 C60,540 130,520 180,540 C230,560 260,600 300,640 L0,640 Z" fill="#d8c6a0" opacity=".7"/>
      <path d="M470,70 C478,60 492,62 494,76 C496,92 484,104 474,98 C466,92 466,80 470,70 Z" fill="#3b5a8a"/>
      <path d="M484,104 C488,160 476,220 486,280 C490,300 488,320 486,334" stroke="#3b5a8a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M478,336 C490,330 500,346 498,370 C496,400 486,420 476,412 C468,400 470,350 478,336 Z" fill="#3b5a8a"/>
      <g fill="none" stroke="#8a7458" stroke-width="2" stroke-linecap="round" opacity=".7">
        <path d="M330,140 l10,-14 l10,14 M352,150 l8,-11 l8,11"/><path d="M400,250 l10,-14 l10,14 M420,262 l8,-11 l8,11"/>
        <path d="M560,240 l10,-14 l10,14 M580,252 l8,-11 l8,11"/><path d="M270,560 l12,-18 l12,18 M292,570 l9,-13 l9,13"/>
      </g>
      <g fill="#8a7458" opacity=".55">${Array.from({ length: 40 }, (_, i) => { const r = WF.rng(500 + i); return `<circle cx="${n(220 + r() * 300)}" cy="${n(430 + r() * 150)}" r="1.4"/>`; }).join('')}</g>
      <text x="96" y="250" fill="#8fa3cc" font-family="Georgia,serif" font-style="italic" font-size="18" opacity=".8">The Great Sea</text>
      <text x="610" y="626" fill="#6d5a42" font-family="Georgia,serif" font-style="italic" font-size="12" text-anchor="end">An imagined map — not to scale</text>
    </svg>`;
  }

  WF.art = { scenes, props, figures, sky, ridge, backdrop, worldMap, installDefs, tuft, lib: { ridge, scatter, tuft, rock, scrub, pathBand, grad, smooth, n } };
})();
