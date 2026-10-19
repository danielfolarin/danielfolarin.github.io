/* Character art, drawn with canvas shapes (no image files needed).
   Every character is drawn facing right with its feet at (0,0). */
(function (N) {
  'use strict';
  const TAU = Math.PI * 2;
  const OL = '#3b2a3f';
  const art = N.art = N.art || {};

  /* ---------- tiny drawing helpers ---------- */
  function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, TAU); }
  function ell(c, x, y, rx, ry, rot) { c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, TAU); }
  function rr(c, x, y, w, h, r) {
    c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  function paint(c, fill, lw) { c.fillStyle = fill; c.fill(); c.lineWidth = lw == null ? 2 : lw; c.strokeStyle = OL; if (c.lineWidth) c.stroke(); }
  function fillOnly(c, fill) { c.fillStyle = fill; c.fill(); }
  function shadow(c, w) { ell(c, 0, 0, w, w * 0.32); fillOnly(c, 'rgba(40,30,60,.22)'); }
  function eyes(c, xs, y, r, o) {
    const blink = o.blink;
    xs.forEach((x, i) => {
      if (blink) {
        c.beginPath(); c.moveTo(x - r, y); c.quadraticCurveTo(x, y + r * 0.8, x + r, y);
        c.lineWidth = 2; c.strokeStyle = OL; c.stroke();
      } else {
        ell(c, x, y, r * 0.82, r); fillOnly(c, OL);
        circ(c, x - r * 0.3, y - r * 0.4, r * 0.36); fillOnly(c, '#fff');
      }
      if (o.mood === 'sad') {
        const inner = i === 0 ? 1 : -1; // inner side of the brow points up
        c.beginPath(); c.moveTo(x - inner * r * 1.2, y - r * 1.6); c.lineTo(x + inner * r * 0.9, y - r * 2.3);
        c.lineWidth = 1.8; c.strokeStyle = OL; c.stroke();
      }
    });
  }
  function mouth(c, x, y, w, mood) {
    c.beginPath();
    if (mood === 'sad') c.arc(x, y + w * 0.7, w * 0.6, 1.2 * Math.PI, 1.8 * Math.PI);
    else if (mood === 'o') { ell(c, x, y, w * 0.3, w * 0.38); fillOnly(c, OL); return; }
    else c.arc(x, y - w * 0.25, w * 0.6, 0.15 * Math.PI, 0.85 * Math.PI);
    c.lineWidth = 2; c.strokeStyle = OL; c.lineCap = 'round'; c.stroke();
  }
  function blush(c, x, y, s) { ell(c, x, y, 3 * (s || 1), 2 * (s || 1)); fillOnly(c, 'rgba(255,110,140,.45)'); }
  art.helpers = { circ, ell, rr, paint, fillOnly, shadow, OL };

  /* ---------- the characters ---------- */
  const DRAW = {};

  DRAW.beaver = function (c, o) { // Bramble the Beaver, bridge builder
    shadow(c, 16);
    c.save(); c.translate(-12, -6); c.rotate(-0.55); ell(c, 0, 0, 7, 12); paint(c, '#6b4226');
    c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 1;
    for (let i = -8; i <= 8; i += 4) { c.beginPath(); c.moveTo(-6, i); c.lineTo(6, i + 3); c.stroke(); }
    c.restore();
    ell(c, -6, -2, 5, 3); paint(c, '#5a3820'); ell(c, 7, -2, 5, 3); paint(c, '#5a3820');
    ell(c, 0, -14, 13, 13); paint(c, '#a8693c');
    ell(c, 1, -12, 8, 9); fillOnly(c, '#efcf9f');
    ell(c, -11, -16, 4, 6, 0.4); paint(c, '#96592f');
    ell(c, 12, -16, 4, 6, -0.4); paint(c, '#96592f');
    if (o.bandage) { ell(c, 13, -15, 6, 3.5, -0.7); paint(c, '#6cc24a', 1.5); c.beginPath(); c.moveTo(9, -12); c.lineTo(17, -18); c.strokeStyle = '#3f8f2c'; c.lineWidth = 1; c.stroke(); }
    circ(c, -9, -40, 4); paint(c, '#96592f'); circ(c, 9, -40, 4); paint(c, '#96592f');
    circ(c, 0, -31, 12); paint(c, '#a8693c');
    c.beginPath(); c.arc(0, -38, 10, Math.PI, 0); c.closePath(); paint(c, '#ffcf3a');
    rr(c, -13, -40, 26, 4, 2); paint(c, '#f5a623', 1.5);
    ell(c, 2, -27, 7, 5); paint(c, '#efcf9f', 1.5);
    ell(c, 3, -30, 3, 2); fillOnly(c, OL);
    rr(c, 0.5, -26, 5, 4.5, 1); paint(c, '#fff', 1.2);
    eyes(c, [-4, 6], -34, 2.6, o);
    blush(c, -8, -28); blush(c, 10, -28);
    if (o.mood === 'sad') { c.beginPath(); c.moveTo(-12, -32); c.quadraticCurveTo(-14, -28, -12, -26); c.quadraticCurveTo(-10, -28, -12, -32); fillOnly(c, '#7fd0ff'); }
  };

  DRAW.goose = function (c, o) { // Honk the Goose — always in a hurry
    shadow(c, 15);
    const sw = o.moving ? Math.sin(o.t * 22) * 5 : 0;
    c.strokeStyle = '#ff9a2e'; c.lineWidth = 3; c.lineCap = 'round';
    c.beginPath(); c.moveTo(-3, -8); c.lineTo(-3 + sw, 0); c.moveTo(4, -8); c.lineTo(4 - sw, 0); c.stroke();
    ell(c, -3 + sw, 0, 4, 2); fillOnly(c, '#ff9a2e'); ell(c, 4 - sw, 0, 4, 2); fillOnly(c, '#ff9a2e');
    c.beginPath(); c.moveTo(-14, -15); c.lineTo(-21, -21); c.lineTo(-12, -20); c.closePath(); paint(c, '#fbfbff', 1.5);
    ell(c, -2, -14, 15, 10, -0.15); paint(c, '#fbfbff');
    ell(c, -5, -15, 9, 6, -0.3); paint(c, '#e6e6f2', 1.5);
    c.beginPath(); c.moveTo(6, -18); c.quadraticCurveTo(13, -26, 9, -34);
    c.lineWidth = 10; c.strokeStyle = OL; c.stroke(); c.lineWidth = 6.5; c.strokeStyle = '#fbfbff'; c.stroke();
    rr(c, 3, -24, 10, 5, 2); paint(c, '#4f8cff', 1.5);
    circ(c, 10, -36, 7); paint(c, '#fbfbff');
    c.beginPath(); c.moveTo(15, -39); c.lineTo(25, -35); c.lineTo(15, -32); c.closePath(); paint(c, '#ff9a2e', 1.5);
    eyes(c, [11], -38, 2.2, o);
  };

  DRAW.peacock = function (c, o) { // Percy the Peacock — very proud of his feathers
    shadow(c, 16);
    const sw = o.moving ? Math.sin(o.t * 20) * 4 : 0;
    for (let i = -3; i <= 3; i++) {
      c.save(); c.translate(-6, -14); c.rotate(-0.55 + i * 0.3);
      ell(c, 0, -19, 6.5, 16); paint(c, '#2bb39a', 1.5);
      ell(c, 0, -27, 3.5, 4.5); fillOnly(c, '#1f5fbf'); circ(c, 0, -27, 1.6); fillOnly(c, '#ffd166');
      c.restore();
    }
    c.strokeStyle = '#8a8a9a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-2, -6); c.lineTo(-2 + sw, 0); c.moveTo(3, -6); c.lineTo(3 - sw, 0); c.stroke();
    ell(c, 0, -14, 10, 11); paint(c, '#2f6fd6');
    c.beginPath(); c.moveTo(2, -20); c.quadraticCurveTo(7, -24, 5, -29); c.lineWidth = 8; c.strokeStyle = OL; c.stroke(); c.lineWidth = 5; c.strokeStyle = '#2f6fd6'; c.stroke();
    circ(c, 5, -31, 6.5); paint(c, '#2f6fd6');
    c.strokeStyle = OL; c.lineWidth = 1.2;
    [[-2, -44], [4, -46], [10, -44]].forEach(([x, y]) => { c.beginPath(); c.moveTo(5, -37); c.lineTo(x, y); c.stroke(); circ(c, x, y, 2); paint(c, '#2bb39a', 1); });
    ell(c, 8, -32, 3, 2); fillOnly(c, '#fff');
    c.beginPath(); c.moveTo(10, -32); c.lineTo(17, -30); c.lineTo(10, -28); c.closePath(); paint(c, '#f7c948', 1.2);
    eyes(c, [7], -33, 2, o);
  };

  DRAW.hedgehog = function (c, o) { // Moss the Hedgehog — feels left out
    shadow(c, 15);
    ell(c, -6, -2, 4, 2.5); paint(c, '#6d5a3c', 1.5); ell(c, 7, -2, 4, 2.5); paint(c, '#6d5a3c', 1.5);
    c.beginPath();
    const cx = -2, cy = -14, rx = 14, ry = 12;
    const a0 = Math.PI * 0.75, a1 = Math.PI * 2.05, n = 13;
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      const r = i % 2 ? 1.6 : 1;
      const x = cx + Math.cos(a) * rx * r * (i % 2 ? 0.82 : 1), y = cy + Math.sin(a) * ry * r * (i % 2 ? 0.82 : 1);
      if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
    }
    c.closePath(); paint(c, '#7d6b4a');
    ell(c, -2, -14, 12, 10); fillOnly(c, '#8f7c58');
    c.strokeStyle = '#a7c46e'; c.lineWidth = 1.4;
    for (let i = 0; i < 6; i++) { const a = Math.PI * (1.05 + i * 0.15); c.beginPath(); c.moveTo(cx + Math.cos(a) * 7, cy + Math.sin(a) * 6); c.lineTo(cx + Math.cos(a) * 14, cy + Math.sin(a) * 12); c.stroke(); }
    ell(c, 6, -12, 10, 9); paint(c, '#f2dcb3');
    ell(c, -3, -29, 5.5, 3, -0.5); paint(c, '#7cc35a', 1.5);
    eyes(c, [5, 11], -15, 2.2, o);
    circ(c, 16, -12, 2.6); paint(c, '#ff8fa3', 1.2);
    blush(c, 3, -10, 0.8); blush(c, 13, -9, 0.8);
    mouth(c, 9, -9, 4, o.mood);
  };

  DRAW.frog = function (c, o) { // Lily the Frog
    shadow(c, 16);
    ell(c, -11, -4, 7, 4); paint(c, '#4fae55'); ell(c, 11, -4, 7, 4); paint(c, '#4fae55');
    ell(c, 0, -12, 15, 12); paint(c, '#6cc860');
    ell(c, 0, -8, 10, 6.5); fillOnly(c, '#d9f2a6');
    circ(c, -7, -23, 6.5); paint(c, '#6cc860'); circ(c, 7, -23, 6.5); paint(c, '#6cc860');
    circ(c, -7, -24, 4); fillOnly(c, '#fff'); circ(c, 7, -24, 4); fillOnly(c, '#fff');
    if (o.blink) { c.fillStyle = '#6cc860'; circ(c, -7, -24, 4.2); c.fill(); circ(c, 7, -24, 4.2); c.fill(); }
    else { circ(c, -6, -24, 2.3); fillOnly(c, OL); circ(c, 8, -24, 2.3); fillOnly(c, OL); }
    mouth(c, 0, -14, 10, o.mood);
    blush(c, -9, -13); blush(c, 9, -13);
    for (let i = 0; i < 5; i++) { const a = i / 5 * TAU; circ(c, 12 + Math.cos(a) * 3, -31 + Math.sin(a) * 3, 2.6); paint(c, '#ff9ec4', 1); }
    circ(c, 12, -31, 1.8); fillOnly(c, '#ffd84d');
    ell(c, -6, -2, 4, 2.5); paint(c, '#4fae55', 1.5); ell(c, 6, -2, 4, 2.5); paint(c, '#4fae55', 1.5);
  };

  DRAW.duck = function (c, o) { // Dot the Duckling
    shadow(c, 13);
    ell(c, -4, -1, 4, 2); paint(c, '#ff9a2e', 1.2); ell(c, 4, -1, 4, 2); paint(c, '#ff9a2e', 1.2);
    c.beginPath(); c.moveTo(-12, -14); c.lineTo(-17, -19); c.lineTo(-10, -18); c.closePath(); paint(c, '#ffe066', 1.5);
    ell(c, -1, -11, 12, 9.5); paint(c, '#ffe066');
    ell(c, -4, -11, 7, 5, -0.3); paint(c, '#ffd23f', 1.5);
    circ(c, 5, -24, 8.5); paint(c, '#ffe066');
    ell(c, 14, -22, 6, 3); paint(c, '#ff9a2e', 1.5);
    eyes(c, [7], -26, 2.2, o);
    blush(c, 4, -20);
    c.save(); c.translate(1, -33);
    c.beginPath(); c.moveTo(0, 0); c.lineTo(-7, -4); c.lineTo(-7, 4); c.closePath(); paint(c, '#ff7eb6', 1.3);
    c.beginPath(); c.moveTo(0, 0); c.lineTo(7, -4); c.lineTo(7, 4); c.closePath(); paint(c, '#ff7eb6', 1.3);
    circ(c, -4.5, -0.5, 1); fillOnly(c, '#fff'); circ(c, 4.5, 0.5, 1); fillOnly(c, '#fff');
    circ(c, 0, 0, 2); paint(c, '#ff7eb6', 1.2);
    c.restore();
  };

  DRAW.fox = function (c, o) { // Juniper the Fox cub
    shadow(c, 14);
    c.save(); c.translate(-13, -13); c.rotate(-0.9 + (o.calm ? 0 : Math.sin(o.t * 3) * 0.08));
    ell(c, 0, -2, 6.5, 12); paint(c, '#f28a2e');
    ell(c, 0, -11, 4, 4.5); fillOnly(c, '#fff4e6'); c.restore();
    ell(c, -5, -2, 3.5, 2.5); paint(c, '#5a3a2a', 1.2); ell(c, 5, -2, 3.5, 2.5); paint(c, '#5a3a2a', 1.2);
    ell(c, 0, -12, 10, 10); paint(c, '#f28a2e');
    ell(c, 3, -11, 5, 7); fillOnly(c, '#fff4e6');
    c.beginPath(); c.moveTo(-7, -33); c.lineTo(-8, -46); c.lineTo(1, -37); c.closePath(); paint(c, '#f28a2e');
    c.beginPath(); c.moveTo(4, -37); c.lineTo(10, -47); c.lineTo(12, -34); c.closePath(); paint(c, '#f28a2e');
    c.beginPath(); c.moveTo(-6, -36); c.lineTo(-7, -43); c.lineTo(-2, -38); c.closePath(); fillOnly(c, '#5a3a2a');
    circ(c, 2, -28, 10.5); paint(c, '#f28a2e');
    ell(c, 7, -24, 7, 4.5); paint(c, '#fff4e6', 1.4);
    circ(c, 13, -25, 2.2); fillOnly(c, OL);
    eyes(c, [-1, 7], -30, 2.3, o);
    blush(c, -3, -24, 0.8);
    mouth(c, 8, -21, 3.5, o.mood);
  };

  DRAW.tortoise = function (c, o) { // Old Theo the Tortoise — glasses on his head
    shadow(c, 21);
    [[-12, -2], [-4, -1], [6, -1], [13, -2]].forEach(([x, y]) => { ell(c, x, y, 4, 3); paint(c, '#9cbf6e', 1.5); });
    ell(c, 14, -11, 6, 5); paint(c, '#a9c97a');
    c.beginPath(); c.ellipse(-1, -10, 18, 15, 0, Math.PI, 0); c.closePath(); paint(c, '#6f9e4f');
    c.strokeStyle = '#4f7a37'; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(-6, -19); c.lineTo(4, -19); c.lineTo(8, -12); c.moveTo(-6, -19); c.lineTo(-10, -12);
    c.moveTo(-6, -19); c.lineTo(-4, -24); c.moveTo(4, -19); c.lineTo(3, -24); c.moveTo(8, -12); c.lineTo(15, -14); c.moveTo(-10, -12); c.lineTo(-17, -14); c.stroke();
    rr(c, -20, -12, 38, 5, 2.5); paint(c, '#d9b26b', 1.5);
    circ(c, 19, -20, 7.5); paint(c, '#a9c97a');
    eyes(c, [21], -21, 2.2, o);
    mouth(c, 21, -16, 4, o.mood);
    c.strokeStyle = OL; c.lineWidth = 1.6;
    circ(c, 16, -28, 3); c.stroke(); circ(c, 23, -28, 3); c.stroke();
    c.beginPath(); c.moveTo(19, -28); c.lineTo(20, -28); c.stroke();
    c.fillStyle = 'rgba(200,235,255,.6)'; circ(c, 16, -28, 2.2); c.fill(); circ(c, 23, -28, 2.2); c.fill();
  };

  DRAW.sheep = function (c, o) { // Shrubbert the Sheep — hide-and-seek champion
    shadow(c, 17);
    if (o.disguised) {
      [[-9, -12, 9], [9, -12, 9], [0, -20, 11], [-4, -8, 9], [5, -8, 9]].forEach(([x, y, r]) => { circ(c, x, y, r); paint(c, '#4f9e47'); });
      [[-6, -20], [6, -16], [-2, -11], [8, -24]].forEach(([x, y]) => { circ(c, x, y, 3.2); fillOnly(c, '#6cc260'); });
      if (o.peek) eyes(c, [-3, 4], -14, 2, o);
      return;
    }
    c.fillStyle = '#4a4050'; [-8, -3, 4, 9].forEach(x => { rr(c, x - 1.5, -8, 3.5, 8, 1.5); c.fill(); });
    [[-10, -14, 8], [0, -21, 9], [10, -15, 8], [-6, -8, 8], [6, -8, 8], [0, -13, 9], [-3, -23, 6]].forEach(([x, y, r]) => { circ(c, x, y, r); paint(c, '#fbfaf6'); });
    ell(c, 0, -14, 12, 8); fillOnly(c, '#fbfaf6');
    ell(c, -6, -20, 3.5, 2, 0.6); paint(c, '#6cc260', 1.2); ell(c, 8, -11, 3, 1.8, -0.4); paint(c, '#6cc260', 1.2);
    ell(c, 14, -18, 6.5, 8); paint(c, '#4a4050');
    ell(c, 9, -24, 4.5, 2.2, -0.4); paint(c, '#4a4050', 1.3);
    if (o.blink) { c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(12, -20); c.lineTo(15, -20); c.moveTo(17, -20); c.lineTo(19.5, -20); c.stroke(); }
    else { circ(c, 13.5, -20, 2); fillOnly(c, '#fff'); circ(c, 18, -20, 2); fillOnly(c, '#fff'); circ(c, 14, -20, 1); fillOnly(c, OL); circ(c, 18.5, -20, 1); fillOnly(c, OL); }
    c.beginPath(); c.arc(16, -15, 2.5, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = '#fff'; c.lineWidth = 1.5; c.stroke();
    circ(c, 3, -28, 4); paint(c, '#fbfaf6', 1.3);
  };

  DRAW.ninle = function (c, o) { // Ninle the lantern-firefly, your guide (drawn centred, not on feet)
    const flap = o.calm ? 0.6 : 0.5 + Math.abs(Math.sin(o.t * 18)) * 0.6;
    const g = c.createRadialGradient(-3, 2, 1, -3, 2, 20);
    g.addColorStop(0, 'rgba(255,236,120,.75)'); g.addColorStop(1, 'rgba(255,236,120,0)');
    c.fillStyle = g; circ(c, -3, 2, 20); c.fill();
    ell(c, -5, -8, 7, 4 * flap, -0.5); paint(c, 'rgba(225,244,255,.9)', 1.3);
    ell(c, 4, -9, 7, 4 * flap, 0.5); paint(c, 'rgba(225,244,255,.9)', 1.3);
    ell(c, -5, 3, 6.5, 5.5, 0.3); paint(c, '#ffe66b', 1.5);
    circ(c, 3, -1, 6.5); paint(c, '#7a5cb8', 1.5);
    c.strokeStyle = OL; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(2, -7); c.quadraticCurveTo(0, -12, -1, -14); c.moveTo(6, -6); c.quadraticCurveTo(9, -11, 10, -13); c.stroke();
    circ(c, -1, -14, 1.6); fillOnly(c, '#ffe66b'); circ(c, 10, -13, 1.6); fillOnly(c, '#ffe66b');
    if (o.blink) { c.beginPath(); c.moveTo(0.5, -1.5); c.lineTo(3, -1.5); c.moveTo(5, -1.5); c.lineTo(7.5, -1.5); c.strokeStyle = '#fff'; c.lineWidth = 1.2; c.stroke(); }
    else { circ(c, 2, -1.5, 1.5); fillOnly(c, '#fff'); circ(c, 6.5, -1.5, 1.5); fillOnly(c, '#fff'); }
    c.beginPath(); c.arc(4.5, 1.5, 1.8, 0.15 * Math.PI, 0.85 * Math.PI); c.strokeStyle = '#fff'; c.lineWidth = 1.1; c.stroke();
  };

  DRAW.sign = function (c) {
    shadow(c, 12);
    rr(c, -3, -26, 6, 26, 2); paint(c, '#9a6a3c');
    rr(c, -17, -38, 34, 18, 4); paint(c, '#e6b878');
    c.strokeStyle = '#a9773f'; c.lineWidth = 1.5;
    c.beginPath(); c.moveTo(-11, -32); c.lineTo(11, -32); c.moveTo(-11, -27); c.lineTo(6, -27); c.stroke();
  };

  /* ---------- the player (an explorer the child picks) ---------- */
  art.drawPlayer = function (c, x, y, o) {
    const av = o.avatar, t = o.t, mv = o.moving && !o.calm;
    const swing = mv ? Math.sin(t * 13) : 0;
    const bob = mv ? Math.abs(Math.sin(t * 13)) * 1.6 : 0;
    c.save(); c.translate(x, y);
    shadow(c, 12);
    if (o.flip) c.scale(-1, 1);
    c.translate(0, -bob);
    const side = o.face === 'side', up = o.face === 'up';
    // legs
    c.fillStyle = '#3d3550';
    rr(c, -6, -11 + Math.max(0, swing) * 2, 5, 10, 2); c.fill();
    rr(c, 1, -11 + Math.max(0, -swing) * 2, 5, 10, 2); c.fill();
    ell(c, -3.5, -1 + Math.max(0, swing) * 2, 4, 2.4); fillOnly(c, '#2a2238');
    ell(c, 3.5, -1 + Math.max(0, -swing) * 2, 4, 2.4); fillOnly(c, '#2a2238');
    // backpack
    if (up) { rr(c, -8, -27, 16, 14, 4); paint(c, '#c77d3a'); }
    else if (side) { rr(c, -14, -26, 7, 13, 3); paint(c, '#c77d3a'); }
    // body + arms
    rr(c, -9, -25, 18, 16, 6); paint(c, av.outfit);
    if (!up) { c.strokeStyle = '#c77d3a'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(-6, -24); c.lineTo(-6, -13); c.moveTo(6, -24); c.lineTo(6, -13); c.stroke(); }
    ell(c, -10.5, -17 + swing * 1.5, 3.5, 6, 0.25); paint(c, av.skin, 1.5);
    ell(c, 10.5, -17 - swing * 1.5, 3.5, 6, -0.25); paint(c, av.skin, 1.5);
    if (o.wear && o.wear.scarf) {
      rr(c, -9, -27, 18, 5, 2.5); paint(c, '#e85d75', 1.5);
      c.fillStyle = '#fff'; c.fillRect(-4, -26, 2, 3); c.fillRect(2, -26, 2, 3);
      rr(c, -8, -24, 5, 9, 2); paint(c, '#e85d75', 1.5);
    }
    // head + hair
    const hx = side ? 2 : 0;
    if (av.style === 'long') { rr(c, -13 + hx, -40, 6, 19, 3); paint(c, av.hair); rr(c, 7 + hx, -40, 6, 19, 3); paint(c, av.hair); }
    if (av.style === 'puffs') { circ(c, -11 + hx, -43, 6.5); paint(c, av.hair); circ(c, 11 + hx, -43, 6.5); paint(c, av.hair); }
    circ(c, hx, -35, 11); paint(c, av.skin);
    if (up) {
      circ(c, hx, -36, 11.5); paint(c, av.hair);
    } else {
      c.beginPath(); c.arc(hx, -36, 11.5, Math.PI * 1.02, -0.02);
      c.quadraticCurveTo(hx + 6, -38, hx + 2, -41); c.quadraticCurveTo(hx - 4, -37, hx - 11.5, -37); c.closePath();
      paint(c, av.hair);
      if (av.style === 'curly') {
        [[-10, -40], [-5, -46], [1, -48], [7, -46], [11, -40]].forEach(([px, py]) => { circ(c, px + hx, py, 4.5); paint(c, av.hair, 1.5); });
      }
      const ex = side ? 4 : 0;
      eyes(c, [hx - 4 + ex, hx + 4 + ex], -33, 2.3, o);
      blush(c, hx - 7 + ex, -29); blush(c, hx + 7 + ex, -29);
      mouth(c, hx + ex, -28.5, 4, 'happy');
    }
    if (o.wear && o.wear.hat) {
      ell(c, hx, -45, 12, 3.5); paint(c, '#ff9f43', 1.6);
      c.beginPath(); c.moveTo(hx - 8, -45); c.lineTo(hx - 5, -52); c.lineTo(hx + 5, -52); c.lineTo(hx + 8, -45); c.closePath(); paint(c, '#ff9f43', 1.6);
      rr(c, hx - 3.5, -61, 7, 9, 2); paint(c, '#ffe46b', 1.5);
      c.fillStyle = '#5a4630'; c.fillRect(hx - 4.5, -62.5, 9, 2);
    }
    c.restore();
  };

  /* ---------- public draw entry ---------- */
  art.drawChar = function (c, kind, x, y, o) {
    const f = DRAW[kind]; if (!f) return;
    c.save(); c.translate(x, y);
    if (o.flip) c.scale(-1, 1);
    if (o.scale) c.scale(o.scale, o.scale);
    if (!o.calm && kind !== 'ninle') {
      const breathe = o.moving ? -Math.abs(Math.sin(o.t * 14)) * 2 : Math.sin(o.t * 2.2 + (o.seed || 0)) * 0.6;
      c.translate(0, breathe);
    }
    c.lineJoin = 'round'; c.lineCap = 'round';
    f(c, o);
    c.restore();
  };
  art.isBlink = (t, seed) => ((t * 1000 + (seed || 0) * 977) % 4200) < 130;

  /* ---------- portraits & stickers (rendered once, then cached) ---------- */
  const cache = {};
  const PORTRAIT = { // where to place each kind in a 120×120 frame
    beaver: [60, 112, 2.1], goose: [52, 118, 2.0], peacock: [62, 120, 1.8], hedgehog: [52, 102, 2.6],
    frog: [60, 104, 2.6], duck: [54, 106, 2.6], fox: [56, 114, 2.0], tortoise: [46, 100, 2.4],
    sheep: [50, 100, 2.6], ninle: [58, 64, 3.6], sign: [60, 108, 2.3]
  };
  const BG = { beaver: '#ffe6c7', goose: '#e2f1ff', peacock: '#dff7f1', hedgehog: '#eaf6d9', frog: '#e1f8e6', duck: '#fff6cf', fox: '#ffe9d6', tortoise: '#eef7dc', sheep: '#efe9ff', ninle: '#2f2a5a', sign: '#f6ead6', player: '#e9f6ff' };

  art.portrait = function (kind, opts) {
    const o = Object.assign({ t: 0, mood: 'happy' }, opts || {});
    const key = 'p:' + kind + ':' + o.mood + ':' + (o.bandage ? 1 : 0) + (o.disguised ? 1 : 0) + (o.avatarIndex != null ? o.avatarIndex : '') + JSON.stringify(o.wear || {});
    if (cache[key]) return cache[key];
    const cv = document.createElement('canvas'); cv.width = cv.height = 240;
    const c = cv.getContext('2d'); c.scale(2, 2);
    const g = c.createLinearGradient(0, 0, 0, 120);
    const bg = BG[kind] || '#e9f6ff';
    g.addColorStop(0, bg); g.addColorStop(1, kind === 'ninle' ? '#4b3f86' : '#ffffff');
    c.fillStyle = g; c.fillRect(0, 0, 120, 120);
    if (kind === 'player') {
      c.save(); c.translate(60, 114); const ps = o.wear && o.wear.hat ? 1.7 : 2.2; c.scale(ps, ps); art.drawPlayer(c, 0, 0, { avatar: o.avatar, t: 0, face: 'down', wear: o.wear }); c.restore();
    } else {
      const p = PORTRAIT[kind] || [60, 110, 2];
      art.drawChar(c, kind, p[0], p[1], Object.assign({}, o, { scale: p[2], calm: true }));
    }
    cache[key] = cv; return cv;
  };

  art.sticker = function (st) {
    const key = 's:' + st.id;
    if (cache[key]) return cache[key];
    const cv = document.createElement('canvas'); cv.width = cv.height = 200;
    const c = cv.getContext('2d'); c.scale(2, 2);
    c.translate(50, 50);
    // scalloped badge
    c.beginPath();
    for (let i = 0; i <= 48; i++) {
      const a = i / 48 * TAU, r = i % 2 ? 44 : 47;
      c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    c.closePath(); paint(c, st.color, 3);
    circ(c, 0, 0, 36); paint(c, '#fffaf0', 2.5);
    c.save(); circ(c, 0, 0, 34); c.clip();
    if (st.char) {
      const p = PORTRAIT[st.char] || [0, 20, 1.6];
      art.drawChar(c, st.char, (p[0] - 60) * 0.62, 26 + (p[1] - 110) * 0.3, Object.assign({ t: 0, mood: 'happy', calm: true, scale: p[2] * 0.62 }, st.charOpts || {}));
    } else if (st.icon === 'star') {
      drawStar(c, 0, 2, 24, 11, '#ffcf3a');
      circ(c, -8, -2, 2.3); fillOnly(c, OL); circ(c, 8, -2, 2.3); fillOnly(c, OL);
      mouth(c, 0, 5, 5, 'happy');
    } else if (st.icon === 'heart') {
      c.strokeStyle = 'rgba(59,42,63,.45)'; c.lineWidth = 2.5; c.setLineDash([3, 5]);
      c.beginPath(); c.arc(0, 18, 26, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); c.setLineDash([]);
      c.beginPath(); c.moveTo(0, 16); c.bezierCurveTo(-26, -2, -15, -24, 0, -9); c.bezierCurveTo(15, -24, 26, -2, 0, 16);
      paint(c, '#ff6b8a', 2.5);
      circ(c, -6, -4, 2); fillOnly(c, OL); circ(c, 6, -4, 2); fillOnly(c, OL);
      mouth(c, 0, 2, 5, 'happy');
    } else if (st.icon === 'lantern') {
      drawLanternIcon(c, 0, 4, 1.25, true);
    }
    c.restore();
    cache[key] = cv; return cv;
  };
  art.stickerURL = function (st) {
    const key = 'u:' + st.id;
    if (!cache[key]) cache[key] = art.sticker(st).toDataURL();
    return cache[key];
  };

  function drawStar(c, x, y, R, r, fill) {
    c.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5, rad = i % 2 ? r : R;
      c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
    }
    c.closePath(); c.lineJoin = 'round'; paint(c, fill, 2.5);
  }
  art.drawStar = drawStar;

  function drawLanternIcon(c, x, y, s, lit) {
    c.save(); c.translate(x, y); c.scale(s, s);
    if (lit) { const g = c.createRadialGradient(0, -2, 1, 0, -2, 22); g.addColorStop(0, 'rgba(255,220,100,.8)'); g.addColorStop(1, 'rgba(255,220,100,0)'); c.fillStyle = g; circ(c, 0, -2, 22); c.fill(); }
    c.strokeStyle = OL; c.lineWidth = 2; c.beginPath(); c.arc(0, -18, 4, Math.PI, 0); c.stroke();
    rr(c, -9, -15, 18, 4, 2); paint(c, '#5a4630');
    rr(c, -7, -11, 14, 18, 4); paint(c, lit ? '#ffe46b' : '#5b5f86');
    if (lit) { ell(c, 0, -1, 3, 5); fillOnly(c, '#fff7c2'); }
    c.strokeStyle = 'rgba(59,42,63,.6)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -11); c.lineTo(0, 7); c.stroke();
    rr(c, -9, 7, 18, 4, 2); paint(c, '#5a4630');
    c.restore();
  }
  art.drawLanternIcon = drawLanternIcon;
})(window.Ninle);
