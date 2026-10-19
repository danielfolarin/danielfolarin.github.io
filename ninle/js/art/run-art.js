/* Art for the side-scrolling runs: background, ground, blocks, hearts and the
   silly (never scary) "temptation" characters. All drawn in code. */
(function (N) {
  'use strict';
  const T = N.TILE, TAU = Math.PI * 2, U = N.util;
  const { circ, ell, rr, paint, fillOnly, OL } = N.art.helpers;
  const R = N.art.run = {};

  /* ---------- background (screen space, gentle parallax) ---------- */
  R.background = function (c, camX, w, h, s, t, calm) {
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#3e3577'); g.addColorStop(0.55, '#8a66b8'); g.addColorStop(1, '#f5b38a');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    // far hills
    const off1 = -(camX * s * 0.15) % (700 * s);
    c.fillStyle = '#6a5aa8';
    for (let k = -1; k < w / (700 * s) + 2; k++) {
      const bx = off1 + k * 700 * s;
      c.beginPath(); c.moveTo(bx, h);
      c.bezierCurveTo(bx + 120 * s, h * 0.45, bx + 260 * s, h * 0.5, bx + 350 * s, h * 0.62);
      c.bezierCurveTo(bx + 450 * s, h * 0.42, bx + 600 * s, h * 0.5, bx + 700 * s, h);
      c.fill();
    }
    // tree trunks and round canopies
    const off2 = -(camX * s * 0.38) % (420 * s);
    for (let k = -1; k < w / (420 * s) + 2; k++) {
      const bx = off2 + k * 420 * s;
      [[60, 1], [250, 0.8]].forEach(([dx, sc]) => {
        const x = bx + dx * s, top = h * (0.38 + (1 - sc) * 0.2);
        c.fillStyle = '#3d4f74'; c.fillRect(x - 14 * s * sc, top, 28 * s * sc, h - top);
        c.fillStyle = '#4a6a86';
        [[0, 0, 70], [-50, 30, 50], [50, 28, 54]].forEach(([ox, oy, r]) => { c.beginPath(); c.arc(x + ox * s * sc, top + oy * s * sc, r * s * sc, 0, TAU); c.fill(); });
      });
    }
    // fireflies
    const rnd = U.rng(9);
    for (let i = 0; i < 26; i++) {
      const fx = ((rnd() * w * 1.5 - camX * s * 0.5) % (w * 1.5) + w * 1.5) % (w * 1.5) - w * 0.25;
      const fy = rnd() * h * 0.75;
      const a = calm ? 0.6 : 0.35 + 0.35 * Math.sin(t * 1.3 + i);
      c.fillStyle = `rgba(255,236,140,${a.toFixed(2)})`;
      c.beginPath(); c.arc(fx, fy, (2 + rnd() * 2) * s, 0, TAU); c.fill();
    }
  };

  /* ---------- tiles ---------- */
  R.tile = function (c, ch, tx, ty, above, used, bounce, t) {
    const x = tx * T, y = ty * T;
    if (ch === '#') {
      c.fillStyle = '#a8703c'; c.fillRect(x, y, T + 0.5, T + 0.5);
      c.fillStyle = 'rgba(90,50,20,.25)';
      const h = U.hash(tx, ty);
      c.beginPath(); c.ellipse(x + 12 + h * 20, y + 30, 5, 3, 0, 0, TAU); c.fill();
      c.beginPath(); c.ellipse(x + 34 - h * 10, y + 14 + h * 20, 3, 2, 0, 0, TAU); c.fill();
      if (above !== '#') {
        c.fillStyle = '#6cc860'; c.fillRect(x, y, T + 0.5, 13);
        c.fillStyle = '#58b04f'; c.fillRect(x, y + 11, T + 0.5, 4);
        c.strokeStyle = OL; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x, y + 1); c.lineTo(x + T, y + 1); c.stroke();
        c.strokeStyle = '#4e9e46'; c.lineWidth = 2;
        for (let k = 0; k < 3; k++) { const gx = x + 8 + k * 15; c.beginPath(); c.moveTo(gx, y + 1); c.lineTo(gx + 2, y - 5); c.stroke(); }
      }
    } else if (ch === '=') {
      rr(c, x + 1, y + 1, T - 2, T - 2, 5); paint(c, '#d9a066', 2.5);
      c.strokeStyle = '#a8703c'; c.lineWidth = 2.5;
      c.beginPath(); c.moveTo(x + 6, y + 6); c.lineTo(x + T - 6, y + T - 6); c.moveTo(x + T - 6, y + 6); c.lineTo(x + 6, y + T - 6); c.stroke();
      rr(c, x + 4, y + 4, T - 8, T - 8, 3); c.lineWidth = 2; c.stroke();
    } else if (ch === '-') {
      rr(c, x - 1, y + 2, T + 2, 14, 7); paint(c, '#b07a45', 2.5);
      c.strokeStyle = 'rgba(255,255,255,.25)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 4, y + 6); c.lineTo(x + T - 4, y + 6); c.stroke();
    } else if (ch === '_') {
      c.fillStyle = 'rgba(255,236,140,.35)'; c.fillRect(x, y - 6, T, 22);
      rr(c, x, y + 2, T, 10, 5); c.fillStyle = 'rgba(255,240,170,.9)'; c.fill();
    } else if (ch === '?') {
      const by = y - (bounce || 0) * 10;
      rr(c, x + 2, by + 2, T - 4, T - 4, 7); paint(c, used ? '#c9a46a' : '#ffcf3a', 3);
      if (!used) {
        c.save(); c.translate(x + T / 2, by + T / 2 + 1); c.scale(1.4, 1.4);
        c.beginPath(); c.moveTo(0, 7); c.bezierCurveTo(-11, -1, -6, -10, 0, -4); c.bezierCurveTo(6, -10, 11, -1, 0, 7);
        paint(c, '#ff6b8a', 1.6); c.restore();
        c.fillStyle = 'rgba(255,255,255,.55)'; c.fillRect(x + 7, by + 7, 8, 4);
      } else { c.fillStyle = 'rgba(90,60,30,.35)'; [[12, 12], [36, 12], [12, 36], [36, 36]].forEach(([a, b]) => { c.beginPath(); c.arc(x + a, by + b, 2.5, 0, TAU); c.fill(); }); }
    }
  };

  /* ---------- the temptations ---------- */
  function face(c, x, y, o) {
    o.blink ? (c.strokeStyle = OL, c.lineWidth = 2, c.beginPath(), c.moveTo(x - 7, y), c.lineTo(x - 2, y), c.moveTo(x + 2, y), c.lineTo(x + 7, y), c.stroke())
      : (circ(c, x - 4.5 + (o.look || 0), y, 2.4), fillOnly(c, OL), circ(c, x + 4.5 + (o.look || 0), y, 2.4), fillOnly(c, OL));
  }

  R.clock = function (c, x, y, t, dir, o) { // Too-Busy Clock: always rushing
    c.save(); c.translate(x, y); if (dir > 0) c.scale(-1, 1);
    ell(c, 0, 0, 15, 4); fillOnly(c, 'rgba(40,30,60,.25)');
    const step = o.calm ? 0 : Math.sin(t * 16) * 4;
    ell(c, -6 + step, -3, 5, 3); paint(c, '#5a4630', 1.5); ell(c, 6 - step, -3, 5, 3); paint(c, '#5a4630', 1.5);
    circ(c, -10, -34, 6); paint(c, '#ffd36b', 2); circ(c, 10, -34, 6); paint(c, '#ffd36b', 2);
    circ(c, 0, -19, 16); paint(c, '#ff7a7a', 2.5);
    circ(c, 0, -19, 11.5); paint(c, '#fffaf0', 2);
    c.strokeStyle = OL; c.lineCap = 'round';
    const a = o.calm ? -1.2 : t * 7;
    c.lineWidth = 2; c.beginPath(); c.moveTo(0, -19); c.lineTo(Math.cos(a) * 8, -19 + Math.sin(a) * 8); c.stroke();
    c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, -19); c.lineTo(Math.cos(a / 12) * 5, -19 + Math.sin(a / 12) * 5); c.stroke();
    face(c, 0, -23, { blink: o.blink, look: -1.5 });
    ell(c, 0, -13, 2.5, 2.8); fillOnly(c, OL);
    if (!o.calm) { c.beginPath(); c.moveTo(13, -30); c.quadraticCurveTo(16, -25, 13, -23); c.quadraticCurveTo(10, -25, 13, -30); fillOnly(c, '#7fd0ff');
      c.strokeStyle = 'rgba(59,42,63,.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(20, -20); c.lineTo(28, -20); c.moveTo(19, -12); c.lineTo(25, -12); c.stroke(); }
    c.restore();
  };

  R.thorn = function (c, x, y, t, o) { // Grumble Thorn: a grumpy bramble with soft round spikes
    c.save(); c.translate(x, y + (o.calm ? 0 : Math.sin(t * 3) * 0.6));
    ell(c, 0, 0, 18, 4.5); fillOnly(c, 'rgba(40,30,60,.25)');
    c.beginPath();
    for (let i = 0; i <= 14; i++) {
      const ang = Math.PI + (i / 14) * Math.PI, r = i % 2 ? 22 : 16;
      c.lineTo(Math.cos(ang) * r * 1.05, -2 + Math.sin(ang) * r * 1.2);
    }
    c.closePath(); paint(c, '#9c7bd1', 2.5);
    ell(c, 0, -10, 13, 10); fillOnly(c, '#b49ae0');
    face(c, 0, -14, o);
    c.strokeStyle = OL; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-9, -21); c.lineTo(-2, -18); c.moveTo(9, -21); c.lineTo(2, -18); c.stroke();
    c.beginPath(); c.moveTo(-5, -6); c.lineTo(-2, -8); c.lineTo(1, -6); c.lineTo(4, -8); c.stroke();
    c.restore();
  };

  R.bubble = function (c, x, y, t, o) { // Fib Bubble: a cheeky floating bubble
    c.save(); c.translate(x, y);
    circ(c, 0, 0, 18); c.fillStyle = 'rgba(170,220,255,.6)'; c.fill(); c.lineWidth = 2.5; c.strokeStyle = '#4b8fc2'; c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.85)'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 12, 3.6, 4.6); c.stroke();
    face(c, 0, -2, { blink: o.blink, look: 2.5 });
    c.beginPath(); c.moveTo(-4, 6); c.quadraticCurveTo(2, 9, 7, 4); c.strokeStyle = OL; c.lineWidth = 2; c.stroke();
    c.restore();
  };

  R.goo = function (c, x, y, t, o) { // Grabby Goo: "Mine! Mine!"
    c.save(); c.translate(x, y);
    const wv = o.calm ? 0 : Math.sin(t * 5);
    c.strokeStyle = OL; c.lineWidth = 2.5; c.lineCap = 'round';
    [[-12, -1], [12, 1]].forEach(([hx, s]) => {
      c.beginPath(); c.moveTo(hx, -8); c.lineTo(hx + s * 4, -20 - wv * 3 * s); c.strokeStyle = '#8fb336'; c.lineWidth = 6; c.stroke();
      c.strokeStyle = OL; c.lineWidth = 1.5; c.stroke();
      circ(c, hx + s * 4, -22 - wv * 3 * s, 4.5); paint(c, '#c4e05a', 2);
    });
    c.beginPath(); c.moveTo(-23, 0); c.quadraticCurveTo(-22, -14, -6, -14); c.quadraticCurveTo(10, -16, 20, -10); c.quadraticCurveTo(26, -4, 23, 0); c.closePath();
    paint(c, '#b6d94c', 2.5);
    c.fillStyle = '#d6ee86'; c.beginPath(); c.ellipse(-6, -10, 8, 2.5, 0, 0, TAU); c.fill();
    circ(c, -5, -8, 3.4); fillOnly(c, '#fff'); circ(c, 5, -8, 3.4); fillOnly(c, '#fff');
    if (!o.blink) { circ(c, -4, -8, 1.8); fillOnly(c, OL); circ(c, 6, -8, 1.8); fillOnly(c, OL); }
    c.beginPath(); c.arc(0, -4, 5, 0.1 * Math.PI, 0.9 * Math.PI); c.strokeStyle = OL; c.lineWidth = 2; c.stroke();
    c.restore();
  };

  R.calmFlowers = function (c, x, y, alpha) { // what a calmed temptation turns into
    c.save(); c.globalAlpha = alpha; c.translate(x, y);
    [[-10, -16, '#ff8fb1'], [0, -24, '#ffd84d'], [10, -15, '#c59bff']].forEach(([fx, fy, col]) => {
      c.strokeStyle = '#4e9e46'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(fx * 0.5, 0); c.lineTo(fx, fy); c.stroke();
      c.fillStyle = col; for (let p = 0; p < 5; p++) { const a = p / 5 * TAU; c.beginPath(); c.arc(fx + Math.cos(a) * 4, fy + Math.sin(a) * 4, 3.4, 0, TAU); c.fill(); }
      c.fillStyle = '#f5a623'; c.beginPath(); c.arc(fx, fy, 2.4, 0, TAU); c.fill();
    });
    c.restore();
  };

  /* ---------- goodies & scenery ---------- */
  R.heart = function (c, x, y, t, calm) {
    c.save(); c.translate(x, y + (calm ? 0 : Math.sin(t * 3 + x * 0.05) * 2.5));
    const g = c.createRadialGradient(0, 0, 1, 0, 0, 18); g.addColorStop(0, 'rgba(255,190,210,.7)'); g.addColorStop(1, 'rgba(255,190,210,0)');
    c.fillStyle = g; circ(c, 0, 0, 18); c.fill();
    c.beginPath(); c.moveTo(0, 9); c.bezierCurveTo(-14, -1, -8, -13, 0, -5); c.bezierCurveTo(8, -13, 14, -1, 0, 9);
    paint(c, '#ff6b8a', 2.2);
    circ(c, -4.5, -4, 2); fillOnly(c, 'rgba(255,255,255,.8)');
    c.restore();
  };
  R.bounceFlower = function (c, x, y, squash) {
    c.save(); c.translate(x, y);
    c.strokeStyle = '#4e9e46'; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -12); c.stroke();
    ell(c, -8, -6, 7, 3.5, -0.5); paint(c, '#6cc860', 1.5); ell(c, 8, -6, 7, 3.5, 0.5); paint(c, '#6cc860', 1.5);
    c.translate(0, -14); c.scale(1 + squash * 0.25, 1 - squash * 0.4);
    for (let i = 0; i < 6; i++) { const a = Math.PI + i / 5 * Math.PI; ell(c, Math.cos(a) * 12, Math.sin(a) * 7 - 2, 8, 5.5, a); paint(c, '#ff8fb1', 2); }
    ell(c, 0, -2, 15, 5); paint(c, '#ffd84d', 2);
    c.restore();
  };
  R.gapSign = function (c, x, y, text) {
    c.save(); c.translate(x, y);
    rr(c, -2.5, -30, 5, 30, 2); paint(c, '#8a5a34', 1.8);
    c.font = '800 10px ui-rounded, "Trebuchet MS", system-ui, sans-serif';
    const w = c.measureText(text).width + 12;
    rr(c, -w / 2, -46, w, 18, 4); paint(c, '#e6b878', 2);
    c.fillStyle = OL; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, 0, -36.5);
    c.restore();
  };
  R.finish = function (c, x, y, t, sparkThere, calm) {
    c.save(); c.translate(x, y);
    ell(c, 0, 0, 16, 5); fillOnly(c, 'rgba(40,30,60,.25)');
    rr(c, -4, -150, 8, 150, 3); paint(c, '#5a4630', 2.5);
    rr(c, -14, -10, 28, 10, 3); paint(c, '#c9c3d9', 2);
    N.art.drawLanternIcon(c, 0, -150, 1.6, true);
    c.restore();
    if (sparkThere) N.art.drawSpark(c, x, y - 186, t, calm);
  };
})(window.Ninle);
