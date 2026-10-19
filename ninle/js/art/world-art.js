/* World art: ground, water, paths, trees, buildings, lanterns and collectables.
   Static ground is painted once into an offscreen canvas for speed. */
(function (N) {
  'use strict';
  const T = N.TILE, TAU = Math.PI * 2, U = N.util;
  const art = N.art;
  const { circ, ell, rr, paint, fillOnly, OL } = art.helpers;

  /* ---------- sprite cache (trees, bushes, rocks) ---------- */
  const sprites = {};
  function makeSprite(w, h, ax, ay, draw) {
    const S = 2, cv = document.createElement('canvas');
    cv.width = w * S; cv.height = h * S;
    const c = cv.getContext('2d'); c.scale(S, S); c.translate(ax, ay); c.lineJoin = 'round';
    draw(c);
    return { cv, w, h, ax, ay };
  }
  function tree(greens, fruit) {
    return makeSprite(80, 110, 40, 100, c => {
      ell(c, 0, -2, 26, 8); fillOnly(c, 'rgba(40,30,60,.22)');
      rr(c, -6, -34, 12, 34, 4); paint(c, '#8a5a34');
      c.strokeStyle = '#6e4526'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(-1, -26); c.lineTo(-1, -6); c.stroke();
      const blobs = [[-16, -46, 18], [16, -46, 18], [0, -62, 22], [-10, -70, 15], [11, -72, 14], [0, -44, 18]];
      c.beginPath(); blobs.forEach(([x, y, r]) => { c.moveTo(x + r, y); c.arc(x, y, r, 0, TAU); });
      c.lineWidth = 4; c.strokeStyle = OL; c.stroke();
      c.fillStyle = greens[0]; c.fill();
      c.fillStyle = greens[1];
      [[-12, -52, 12], [8, -70, 11], [-4, -66, 13], [13, -50, 10]].forEach(([x, y, r]) => { circ(c, x, y, r); c.fill(); });
      c.fillStyle = greens[2];
      [[-14, -58, 5], [-2, -74, 5], [8, -60, 4]].forEach(([x, y, r]) => { circ(c, x, y, r); c.fill(); });
      if (fruit) [[-14, -42], [10, -48], [2, -60], [-6, -70], [16, -62]].forEach(([x, y]) => { circ(c, x, y, 3.6); paint(c, fruit, 1.2); circ(c, x - 1, y - 1, 1); fillOnly(c, 'rgba(255,255,255,.7)'); });
    });
  }
  function pine() {
    return makeSprite(70, 110, 35, 100, c => {
      ell(c, 0, -2, 22, 7); fillOnly(c, 'rgba(40,30,60,.22)');
      rr(c, -5, -22, 10, 22, 3); paint(c, '#7a4e2d');
      [[-24, -18, 24, -18, 0, -54], [-20, -40, 20, -40, 0, -74], [-15, -60, 15, -60, 0, -94]].forEach((p, i) => {
        c.beginPath(); c.moveTo(p[0], p[1]); c.quadraticCurveTo(0, p[1] + 6, p[2], p[3]); c.lineTo(p[4], p[5]); c.closePath();
        paint(c, ['#2f8f5b', '#38a066', '#45b373'][i], 3);
      });
      c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(-3, -90); c.lineTo(-12, -62); c.lineTo(-4, -64); c.closePath(); c.fill();
    });
  }
  function bush(secret) {
    return makeSprite(60, 52, 30, 46, c => {
      ell(c, 0, -2, 24, 7); fillOnly(c, 'rgba(40,30,60,.2)');
      const b = [[-12, -14, 12], [12, -14, 12], [0, -24, 14], [-4, -10, 12], [6, -10, 12]];
      c.beginPath(); b.forEach(([x, y, r]) => { c.moveTo(x + r, y); c.arc(x, y, r, 0, TAU); });
      c.lineWidth = 3.5; c.strokeStyle = OL; c.stroke(); c.fillStyle = secret ? '#5fae4e' : '#4f9e47'; c.fill();
      c.fillStyle = secret ? '#7bc866' : '#68b85a';
      [[-9, -20, 7], [5, -27, 7], [10, -16, 5]].forEach(([x, y, r]) => { circ(c, x, y, r); c.fill(); });
      if (!secret) [[-14, -12], [8, -8], [0, -20]].forEach(([x, y]) => { circ(c, x, y, 2.6); paint(c, '#e8506a', 1); });
      else [[-12, -10], [10, -22]].forEach(([x, y]) => { circ(c, x, y, 2.4); paint(c, '#fff0a8', 1); });
    });
  }
  function rock() {
    return makeSprite(56, 46, 28, 40, c => {
      ell(c, 0, -2, 22, 6); fillOnly(c, 'rgba(40,30,60,.2)');
      c.beginPath(); c.moveTo(-20, -2); c.quadraticCurveTo(-22, -22, -6, -28); c.quadraticCurveTo(12, -32, 19, -16); c.quadraticCurveTo(23, -4, 16, -1); c.closePath();
      paint(c, '#a7a3b8', 3);
      c.beginPath(); c.moveTo(-12, -18); c.quadraticCurveTo(-8, -26, 2, -26); c.lineWidth = 3; c.strokeStyle = 'rgba(255,255,255,.55)'; c.stroke();
      ell(c, 8, -24, 7, 3.5, 0.3); fillOnly(c, '#7fbf5e');
    });
  }
  art.buildSprites = function () {
    sprites.tree = [tree(['#4caf50', '#66c35b', '#8fdc72']), tree(['#43a65a', '#5dbb63', '#86d67a']), tree(['#3f9f55', '#58b85e', '#7fd16e'])];
    sprites.apple = tree(['#4caf50', '#66c35b', '#8fdc72'], '#ef4b5c');
    sprites.blossom = tree(['#f39ac0', '#ffb8d4', '#ffe0ec']);
    sprites.pine = pine();
    sprites.bush = bush(false);
    sprites.secret = bush(true);
    sprites.rock = rock();
  };
  function blit(c, sp, x, y) { c.drawImage(sp.cv, x - sp.ax, y - sp.ay, sp.w, sp.h); }

  /* ---------- ground ---------- */
  const isWater = ch => ch === '~' || ch === 'X' || ch === 'b';
  const isPath = ch => ch === '=' || ch === 'g' || ch === 'o';
  const isHills = ch => ch === 'f' || ch === 'k';

  function blobLayer(g, world, pred, r, color) {
    g.fillStyle = color;
    for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) {
      if (!pred(world.get(x, y))) continue;
      const cx = x * T + T / 2, cy = y * T + T / 2;
      g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
      const R = pred(world.get(x + 1, y)), D = pred(world.get(x, y + 1));
      if (R) g.fillRect(cx, cy - r, T, r * 2);
      if (D) g.fillRect(cx - r, cy, r * 2, T);
      if (R && D && pred(world.get(x + 1, y + 1))) g.fillRect(cx, cy, T, T);
    }
  }

  art.renderGround = function (world, scale) {
    const W = world.w * T, H = world.h * T;
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * scale); cv.height = Math.ceil(H * scale);
    const g = cv.getContext('2d'); g.scale(scale, scale);
    const rnd = U.rng(11);
    g.fillStyle = '#9fd772'; g.fillRect(0, 0, W, H);
    for (let i = 0; i < world.w * world.h * 0.5; i++) {
      g.fillStyle = rnd() < 0.5 ? 'rgba(130,200,95,.45)' : 'rgba(184,232,140,.4)';
      g.beginPath(); g.ellipse(rnd() * W, rnd() * H, 20 + rnd() * 40, 12 + rnd() * 22, 0, 0, TAU); g.fill();
    }
    // grass tufts and flowers
    for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) {
      const ch = world.get(x, y), h = U.hash(x, y);
      if (isHills(ch)) continue;
      const bx = x * T, by = y * T;
      g.strokeStyle = 'rgba(70,150,70,.55)'; g.lineWidth = 2; g.lineCap = 'round';
      for (let k = 0; k < 2; k++) {
        const tx = bx + 8 + U.hash(x * 3 + k, y) * 32, ty = by + 10 + U.hash(x, y * 3 + k) * 30;
        g.beginPath(); g.moveTo(tx - 3, ty - 5); g.lineTo(tx, ty); g.lineTo(tx + 3, ty - 6); g.stroke();
      }
      if (ch === ',' || (ch === '.' && h > 0.93)) {
        const cols = ['#ff8fb1', '#ffffff', '#ffd84d', '#c59bff', '#ff9f68'];
        const n = ch === ',' ? 4 : 1;
        for (let k = 0; k < n; k++) {
          const fx = bx + 8 + U.hash(x + k * 7, y) * 32, fy = by + 8 + U.hash(x, y + k * 7) * 32;
          g.fillStyle = cols[Math.floor(U.hash(x * 5 + k, y * 2) * cols.length)];
          for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; g.beginPath(); g.arc(fx + Math.cos(a) * 3, fy + Math.sin(a) * 3, 2.6, 0, TAU); g.fill(); }
          g.fillStyle = '#f5a623'; g.beginPath(); g.arc(fx, fy, 1.8, 0, TAU); g.fill();
        }
      }
      if (ch === 'm') {
        [[14, 30, 1], [30, 22, 0.8], [26, 36, 0.6]].forEach(([mx, my, s]) => {
          g.save(); g.translate(bx + mx, by + my); g.scale(s, s);
          rr(g, -3, -6, 6, 8, 2); paint(g, '#fff4e0', 1.5);
          g.beginPath(); g.arc(0, -6, 9, Math.PI, 0); g.closePath(); paint(g, '#ff6b6b', 1.8);
          g.fillStyle = '#fff'; [[-4, -9], [3, -11], [5, -7]].forEach(([a, b]) => { g.beginPath(); g.arc(a, b, 1.5, 0, TAU); g.fill(); });
          g.restore();
        });
      }
    }
    drawHills(g, world);
    // water with sandy shore
    blobLayer(g, world, isWater, 31, '#f2dca6');
    blobLayer(g, world, isWater, 27, '#5cc3ee');
    blobLayer(g, world, ch => isWater(ch), 20, '#4bb3e6');
    // lily pads and ripples
    for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) {
      if (world.get(x, y) !== '~') continue;
      const h = U.hash(x + 3, y + 9), cx = x * T + T / 2, cy = y * T + T / 2;
      if (h > 0.78) {
        g.save(); g.translate(cx + (h - 0.8) * 60, cy - 6);
        g.beginPath(); g.arc(0, 0, 8, 0.3, TAU - 0.3); g.lineTo(0, 0); g.closePath(); paint(g, '#5cbf6a', 1.5);
        if (h > 0.9) { g.fillStyle = '#ffb3cf'; for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; g.beginPath(); g.arc(Math.cos(a) * 2.5, Math.sin(a) * 2.5 - 1, 2.2, 0, TAU); g.fill(); } }
        g.restore();
      } else if (h < 0.35) {
        g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2;
        g.beginPath(); g.moveTo(cx - 8, cy + 4); g.quadraticCurveTo(cx, cy, cx + 8, cy + 4); g.stroke();
      }
    }
    // paths
    blobLayer(g, world, isPath, 22, '#d9b678');
    blobLayer(g, world, isPath, 18.5, '#f3dcaa');
    for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) {
      if (!isPath(world.get(x, y))) continue;
      for (let k = 0; k < 3; k++) {
        const px = x * T + 10 + U.hash(x * 9 + k, y) * 28, py = y * T + 10 + U.hash(x, y * 9 + k) * 28;
        g.fillStyle = 'rgba(190,150,95,.55)'; g.beginPath(); g.ellipse(px, py, 2.5, 1.8, 0, 0, TAU); g.fill();
      }
    }
    // bridges
    for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) {
      const ch = world.get(x, y);
      if (ch === 'b' || ch === 'X') drawBridgeTile(g, world, x, y, ch === 'X');
    }
    return cv;
  };

  function drawBridgeTile(g, world, x, y, broken) {
    const bx = x * T, by = y * T;
    g.fillStyle = 'rgba(30,60,90,.25)'; g.fillRect(bx + 2, by + 4, T - 4, T);
    const top = world.get(x, y - 1) !== 'b' && world.get(x, y - 1) !== 'X';
    const bottom = world.get(x, y + 1) !== 'b' && world.get(x, y + 1) !== 'X';
    for (let i = 0; i < 4; i++) {
      const py = by + i * 12;
      if (broken && ((top && i >= 2) || (bottom && i <= 1))) continue; // the gap!
      rr(g, bx - 2, py + 1, T + 4, 10, 3); paint(g, i % 2 ? '#c98f55' : '#d9a066', 2);
      g.fillStyle = '#6e4526'; g.beginPath(); g.arc(bx + 3, py + 6, 1.4, 0, TAU); g.arc(bx + T - 3, py + 6, 1.4, 0, TAU); g.fill();
    }
    if (broken && bottom) {
      g.save(); g.translate(bx + 30, by + 22); g.rotate(0.5); rr(g, -14, -4, 28, 8, 3); paint(g, '#c98f55', 2); g.restore();
    }
    // rails
    g.fillStyle = '#8a5a34';
    rr(g, bx - 6, by, 6, T, 2); paint(g, '#8a5a34', 2);
    rr(g, bx + T, by, 6, T, 2); paint(g, '#8a5a34', 2);
  }

  function drawHills(g, world) {
    // find the hills rectangle
    let minX = 1e9, minY = 1e9, maxX = -1, maxY = -1;
    for (let y = 0; y < world.h; y++) for (let x = 0; x < world.w; x++) if (isHills(world.get(x, y))) {
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
    if (maxX < 0) return;
    const x0 = minX * T, y0 = minY * T, w = (maxX - minX + 1) * T, h = (maxY - minY + 1) * T;
    g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
    const grd = g.createLinearGradient(0, y0, 0, y0 + h);
    grd.addColorStop(0, '#b9a6ff'); grd.addColorStop(0.45, '#a6e3c4'); grd.addColorStop(1, '#8fd99a');
    g.fillStyle = grd; g.fillRect(x0, y0, w, h);
    const rnd = U.rng(5);
    for (let i = 0; i < 14; i++) {
      const hx = x0 + rnd() * w, hy = y0 + h * (0.35 + rnd() * 0.5), r = 60 + rnd() * 90;
      g.beginPath(); g.ellipse(hx, hy + r * 0.5, r, r * 0.6, 0, Math.PI, 0); g.closePath();
      g.fillStyle = ['#7fcf8f', '#94dba0', '#6cc086', '#a9e6b0'][i % 4]; g.fill();
      g.lineWidth = 3; g.strokeStyle = 'rgba(59,42,63,.35)'; g.stroke();
    }
    // a winding path continuing north from the gate
    g.strokeStyle = '#f3dcaa'; g.lineWidth = 26; g.lineCap = 'round';
    const gx = 22 * T;
    g.beginPath(); g.moveTo(gx, y0 + h + 10); g.bezierCurveTo(gx + 120, y0 + h * 0.6, gx - 160, y0 + h * 0.4, gx + 40, y0 - 10); g.stroke();
    // twinkly star-flowers
    for (let i = 0; i < 90; i++) {
      const sx = x0 + rnd() * w, sy = y0 + rnd() * h;
      g.fillStyle = ['#fff3a0', '#ffffff', '#ffd1f0'][i % 3];
      g.beginPath();
      for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + k * Math.PI / 4, r = k % 2 ? 1.6 : 5; g.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r); }
      g.closePath(); g.fill();
    }
    g.restore();
  }

  /* ---------- per-frame details ---------- */
  art.waterShimmer = function (c, world, view, t) {
    c.strokeStyle = 'rgba(255,255,255,.45)'; c.lineWidth = 2; c.lineCap = 'round';
    for (let y = view.y0; y <= view.y1; y++) for (let x = view.x0; x <= view.x1; x++) {
      if (world.get(x, y) !== '~') continue;
      const h = U.hash(x, y + 50);
      if (h > 0.5) continue;
      const ph = (t * 0.6 + h * 10) % 1;
      const a = Math.sin(ph * Math.PI);
      c.globalAlpha = a * 0.8;
      const cx = x * T + 10 + h * 50, cy = y * T + 16 + ph * 14;
      c.beginPath(); c.moveTo(cx - 6, cy); c.quadraticCurveTo(cx, cy - 3, cx + 6, cy); c.stroke();
    }
    c.globalAlpha = 1;
  };

  art.drawFog = function (c, world, alpha, t, calm) {
    if (alpha <= 0.01) return;
    const x0 = T, y0 = T, w = (world.w - 2) * T, h = 4 * T;
    c.save();
    c.globalAlpha = alpha;
    const g = c.createLinearGradient(0, y0, 0, y0 + h + 30);
    g.addColorStop(0, 'rgba(236,232,255,.97)'); g.addColorStop(0.8, 'rgba(236,232,255,.9)'); g.addColorStop(1, 'rgba(236,232,255,0)');
    c.fillStyle = g; c.fillRect(x0, y0 - 20, w, h + 50);
    const rnd = U.rng(3);
    for (let i = 0; i < 26; i++) {
      const bx = x0 + rnd() * w + (calm ? 0 : Math.sin(t * 0.15 + i) * 30), by = y0 + rnd() * h, r = 40 + rnd() * 50;
      c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.arc(bx, by, r, 0, TAU); c.fill();
    }
    c.restore();
  };

  /* ---------- static objects built from the tile map ---------- */
  art.drawTileObject = function (c, world, x, y, ch) {
    const cx = x * T + T / 2, base = y * T + T;
    if (ch === 'T') {
      const h = U.hash(x, y);
      let sp;
      if (y === 0 || y === world.h - 1 || x === 0 || x === world.w - 1 || y === 5) sp = h > 0.45 ? sprites.pine : sprites.tree[Math.floor(h * 3) % 3];
      else if (x >= 23 && x <= 31 && y >= 6 && y <= 12) sp = sprites.apple;
      else sp = h > 0.82 ? sprites.blossom : (h > 0.6 ? sprites.pine : sprites.tree[Math.floor(h * 7) % 3]);
      blit(c, sp, cx + (h - 0.5) * 6, base - 2);
    } else if (ch === 'B') blit(c, sprites.bush, cx, base - 2);
    else if (ch === 's') blit(c, sprites.secret, cx, base - 2);
    else if (ch === 'R') blit(c, sprites.rock, cx, base - 4);
    else if (ch === 'F') drawFence(c, world, x, y);
    else if (ch === 'G' || ch === 'g') drawGardenGate(c, x, y, ch === 'g');
  };

  function fenceLike(ch) { return ch === 'F' || ch === 'G' || ch === 'g'; }
  function drawFence(c, world, x, y) {
    const bx = x * T, by = y * T;
    const L = fenceLike(world.get(x - 1, y)), R = fenceLike(world.get(x + 1, y));
    const U2 = fenceLike(world.get(x, y - 1)), D = fenceLike(world.get(x, y + 1));
    c.lineJoin = 'round';
    if (L || R) {
      const x0 = L ? bx : bx + T / 2, x1 = R ? bx + T : bx + T / 2;
      rr(c, x0, by + 18, x1 - x0, 5, 2); paint(c, '#fffaf0', 1.6);
      rr(c, x0, by + 30, x1 - x0, 5, 2); paint(c, '#fffaf0', 1.6);
      for (let i = 0; i < 3; i++) {
        const px = bx + 4 + i * 16;
        if (px < x0 - 2 || px > x1 - 6) continue;
        c.beginPath(); c.moveTo(px, by + 42); c.lineTo(px, by + 14); c.lineTo(px + 4, by + 9); c.lineTo(px + 8, by + 14); c.lineTo(px + 8, by + 42); c.closePath();
        paint(c, '#ffffff', 1.6);
      }
    }
    if (U2 || D) {
      const y0 = U2 ? by - 6 : by + 14, y1 = D ? by + T + 4 : by + 40;
      rr(c, bx + T / 2 - 4, y0, 8, y1 - y0, 3); paint(c, '#fffaf0', 1.6);
      rr(c, bx + T / 2 - 6, by + 8, 12, 34, 3); paint(c, '#ffffff', 1.6);
    }
  }
  function drawGardenGate(c, x, y, open) {
    const bx = x * T, by = y * T;
    rr(c, bx + T / 2 - 6, by - 4, 12, 10, 3); paint(c, '#ffffff', 1.6);
    rr(c, bx + T / 2 - 6, by + T - 8, 12, 12, 3); paint(c, '#ffffff', 1.6);
    if (!open) {
      rr(c, bx + T / 2 - 5, by + 4, 10, T - 10, 3); paint(c, '#ffd36b', 1.8);
      c.save(); c.translate(bx + T / 2, by + T / 2);
      c.beginPath(); c.moveTo(0, 5); c.bezierCurveTo(-7, -1, -3, -7, 0, -3); c.bezierCurveTo(3, -7, 7, -1, 0, 5); fillOnly(c, '#ff6b8a');
      c.restore();
    } else {
      c.save(); c.translate(bx + T / 2 + 4, by + 4); c.rotate(-1.1);
      rr(c, 0, 0, 10, T - 14, 3); paint(c, '#ffd36b', 1.8); c.restore();
    }
  }

  /* house for Theo, drawn over its 'h' tiles */
  art.drawHouse = function (c, x0, y0, wTiles, hTiles) {
    const X = x0 * T, Y = y0 * T, W = wTiles * T, H = hTiles * T;
    const base = Y + H;
    ell(c, X + W / 2, base - 2, W / 2 + 6, 10); fillOnly(c, 'rgba(40,30,60,.22)');
    rr(c, X + 6, base - 70, W - 12, 68, 8); paint(c, '#fff1d6', 3);
    c.fillStyle = 'rgba(214,170,120,.35)';
    for (let i = 0; i < 5; i++) c.fillRect(X + 10, base - 62 + i * 13, W - 20, 2);
    rr(c, X + W - 34, base - 130, 16, 40, 3); paint(c, '#c8796a', 3);
    c.beginPath(); c.moveTo(X - 8, base - 64); c.lineTo(X + W / 2, base - 136); c.lineTo(X + W + 8, base - 64); c.closePath(); paint(c, '#e0675a', 3);
    c.strokeStyle = 'rgba(120,40,40,.35)'; c.lineWidth = 2;
    for (let i = 1; i < 4; i++) { const yy = base - 64 - i * 17; const dx = (W / 2 + 8) * (1 - i / 4.2); c.beginPath(); c.moveTo(X + W / 2 - dx, yy); c.lineTo(X + W / 2 + dx, yy); c.stroke(); }
    c.beginPath(); c.arc(X + W / 2, base - 26, 13, Math.PI, 0); c.lineTo(X + W / 2 + 13, base - 2); c.lineTo(X + W / 2 - 13, base - 2); c.closePath(); paint(c, '#7cc35a', 3);
    circ(c, X + W / 2 + 7, base - 16, 2); fillOnly(c, '#ffd36b');
    [X + 24, X + W - 46].forEach(wx => {
      rr(c, wx, base - 56, 22, 20, 4); paint(c, '#bfe6ff', 2.5);
      c.strokeStyle = OL; c.lineWidth = 1.5; c.beginPath(); c.moveTo(wx + 11, base - 56); c.lineTo(wx + 11, base - 36); c.stroke();
      rr(c, wx - 3, base - 36, 28, 6, 2); paint(c, '#a46a3c', 1.5);
      [5, 12, 19].forEach(fx => { circ(c, wx + fx, base - 38, 3); fillOnly(c, ['#ff7eb6', '#ffd84d', '#c59bff'][fx % 3]); });
    });
    // the broken flower pot by the door (Juniper's accident)
    c.save(); c.translate(X + W / 2 + 26, base + 6);
    c.beginPath(); c.moveTo(-9, -12); c.lineTo(9, -12); c.lineTo(6, 0); c.lineTo(-6, 0); c.closePath(); paint(c, '#d9814e', 2);
    c.beginPath(); c.moveTo(-2, -12); c.lineTo(1, -6); c.lineTo(-3, 0); c.strokeStyle = OL; c.lineWidth = 1.5; c.stroke();
    c.save(); c.translate(14, -2); c.rotate(0.7); rr(c, -5, -3, 10, 6, 2); paint(c, '#d9814e', 1.5); c.restore();
    c.restore();
  };

  /* the big lantern gate at the top of the trail */
  art.drawLanternGate = function (c, x, y, openAmt, glow) {
    const X = x * T, Y = y * T, W = 2 * T, base = Y + T;
    // pillars
    [X - 14, X + W - 4].forEach(px => {
      rr(c, px, base - 104, 18, 104, 4); paint(c, '#c9c3d9', 3);
      c.fillStyle = 'rgba(59,42,63,.15)'; c.fillRect(px + 3, base - 80, 12, 2); c.fillRect(px + 3, base - 50, 12, 2);
      rr(c, px - 4, base - 112, 26, 10, 3); paint(c, '#b4add0', 3);
    });
    // arch
    c.beginPath(); c.moveTo(X - 14, base - 104); c.quadraticCurveTo(X + W / 2, base - 150, X + W + 14, base - 104);
    c.lineTo(X + W + 14, base - 92); c.quadraticCurveTo(X + W / 2, base - 134, X - 14, base - 92); c.closePath(); paint(c, '#d8d2e8', 3);
    art.drawLanternIcon(c, X + W / 2, base - 120, 1.1, glow);
    // doors
    const dw = W / 2 + 2;
    const shrink = 1 - openAmt * 0.82;
    rr(c, X + 4, base - 86, dw * shrink - 4, 84, 4); paint(c, '#9a6a3c', 3);
    rr(c, X + W - 4 - (dw * shrink - 4), base - 86, dw * shrink - 4, 84, 4); paint(c, '#9a6a3c', 3);
    if (openAmt < 0.2) {
      c.strokeStyle = 'rgba(59,42,63,.4)'; c.lineWidth = 2;
      for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(X + 6, base - 86 + i * 21); c.lineTo(X + W - 6, base - 86 + i * 21); c.stroke(); }
      circ(c, X + W / 2 - 6, base - 44, 3); paint(c, '#ffd36b', 1.5); circ(c, X + W / 2 + 6, base - 44, 3); paint(c, '#ffd36b', 1.5);
    }
  };

  /* small lantern posts along the trail */
  art.drawLanternPost = function (c, x, y, lit, t) {
    c.save(); c.translate(x, y);
    ell(c, 0, 0, 10, 3.5); fillOnly(c, 'rgba(40,30,60,.22)');
    rr(c, -3, -40, 6, 40, 2); paint(c, '#5a4630', 2);
    rr(c, -2, -44, 16, 4, 2); paint(c, '#5a4630', 1.6);
    art.drawLanternIcon(c, 10, -24, 0.95, lit);
    c.restore();
  };

  art.drawGreatLantern = function (c, x, y, lit, t) {
    c.save(); c.translate(x, y);
    ell(c, 0, 4, 24, 7); fillOnly(c, 'rgba(40,30,60,.25)');
    rr(c, -18, -18, 36, 22, 5); paint(c, '#c9c3d9', 3);
    rr(c, -13, -32, 26, 16, 4); paint(c, '#d8d2e8', 3);
    art.drawLanternIcon(c, 0, -52, 1.9, lit);
    c.restore();
  };

  /* the glowing hollow-tree tunnel that leads into a side-scrolling run */
  art.drawPortal = function (c, x, y, t, calm) {
    c.save(); c.translate(x, y);
    ell(c, 0, 0, 34, 9); fillOnly(c, 'rgba(40,30,60,.25)');
    [[-30, -6, -40, 2], [30, -6, 40, 2]].forEach(([a, b, cx2, cy2]) => { c.beginPath(); c.moveTo(a * 0.6, b); c.quadraticCurveTo(a, b, cx2, cy2); c.lineWidth = 7; c.strokeStyle = OL; c.stroke(); c.lineWidth = 4; c.strokeStyle = '#8a5a34'; c.stroke(); });
    rr(c, -30, -70, 60, 70, 12); paint(c, '#9a6a3c', 3);
    c.strokeStyle = 'rgba(59,42,63,.3)'; c.lineWidth = 2;
    [-18, 16].forEach(lx => { c.beginPath(); c.moveTo(lx, -62); c.lineTo(lx + 2, -6); c.stroke(); });
    ell(c, 0, -70, 30, 9); paint(c, '#c99a62', 3);
    c.strokeStyle = '#9a6a3c'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, -70, 18, 5, 0, 0, Math.PI * 2); c.stroke();
    const glow = calm ? 0.8 : 0.65 + Math.sin(t * 2) * 0.2;
    const g = c.createRadialGradient(0, -24, 2, 0, -24, 34);
    g.addColorStop(0, `rgba(255,240,170,${glow})`); g.addColorStop(1, 'rgba(255,200,90,0)');
    c.fillStyle = g; circ(c, 0, -24, 34); c.fill();
    c.beginPath(); c.moveTo(-14, -1); c.lineTo(-14, -30); c.arc(0, -30, 14, Math.PI, 0); c.lineTo(14, -1); c.closePath();
    paint(c, '#ffe9a6', 3);
    art.drawStar(c, 0, -26, 6, 2.6, '#fff7c2');
    ell(c, 18, -48, 7, 4, -0.3); paint(c, '#7cc35a', 1.5);
    c.restore();
  };

  /* collectables */
  art.drawStarPickup = function (c, x, y, t, calm, revealed) {
    const b = calm ? 0 : Math.sin(t * 2.4 + x) * 3;
    c.save(); c.translate(x, y - 10 + b);
    const g = c.createRadialGradient(0, 0, 1, 0, 0, revealed ? 30 : 20);
    g.addColorStop(0, 'rgba(255,240,150,.8)'); g.addColorStop(1, 'rgba(255,240,150,0)');
    c.fillStyle = g; circ(c, 0, 0, revealed ? 30 : 20); c.fill();
    if (!calm) c.rotate(Math.sin(t * 1.5 + x) * 0.15);
    art.drawStar(c, 0, 0, 11, 5, '#ffcf3a');
    circ(c, -3.5, -1, 1.3); fillOnly(c, OL); circ(c, 3.5, -1, 1.3); fillOnly(c, OL);
    c.restore();
  };
  art.drawSpark = function (c, x, y, t, calm) {
    const b = calm ? 0 : Math.sin(t * 2) * 4;
    c.save(); c.translate(x, y - 16 + b);
    const g = c.createRadialGradient(0, 0, 1, 0, 0, 34);
    g.addColorStop(0, 'rgba(255,250,200,1)'); g.addColorStop(0.35, 'rgba(255,214,90,.75)'); g.addColorStop(1, 'rgba(255,170,40,0)');
    c.fillStyle = g; circ(c, 0, 0, 34); c.fill();
    c.strokeStyle = 'rgba(255,230,140,.85)'; c.lineWidth = 2.5; c.lineCap = 'round';
    const rot = calm ? 0 : t * 0.6;
    for (let i = 0; i < 8; i++) { const a = rot + i * TAU / 8, r1 = 14, r2 = i % 2 ? 20 : 25; c.beginPath(); c.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); c.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); c.stroke(); }
    circ(c, 0, 0, 9); paint(c, '#fff3a6', 2);
    circ(c, -2.5, -2.5, 3); fillOnly(c, '#ffffff');
    c.restore();
  };
  art.drawPlank = function (c, x, y, t, calm) {
    c.save(); c.translate(x, y - 4); c.rotate(-0.35);
    ell(c, 0, 9, 18, 4); fillOnly(c, 'rgba(40,30,60,.2)');
    rr(c, -18, -5, 36, 11, 3); paint(c, '#d9a066', 2.2);
    c.strokeStyle = '#a8703c'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(-12, -1); c.lineTo(8, -1); c.moveTo(-6, 3); c.lineTo(12, 3); c.stroke();
    circ(c, -14, 0, 1.4); fillOnly(c, '#6e4526'); circ(c, 14, 0, 1.4); fillOnly(c, '#6e4526');
    const gl = calm ? 0.5 : (Math.sin(t * 3) + 1) / 2;
    c.globalAlpha = 0.35 + gl * 0.5; art.drawStar(c, 16, -9, 5, 2, '#fff7c2'); c.globalAlpha = 1;
    c.restore();
  };
  art.drawSignObj = function (c, x, y) {
    art.drawChar(c, 'sign', x, y, { t: 0, calm: true });
  };
})(window.Ninle);
