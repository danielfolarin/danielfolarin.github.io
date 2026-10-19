/* Shared helpers. Everything in the game hangs off one global: window.Ninle */
window.Ninle = window.Ninle || {};
(function (N) {
  'use strict';
  N.TILE = 48;
  N.levels = N.levels || {};
  N.registerLevel = function (level) { N.levels[level.id] = level; };

  const U = N.util = {};
  U.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  U.lerp = (a, b, t) => a + (b - a) * t;
  U.dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
  U.easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  U.easeOut = t => 1 - Math.pow(1 - t, 3);
  // Deterministic random so the world looks the same every time.
  U.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  };
  U.hash = (x, y) => {
    let h = (x * 374761393 + y * 668265263) | 0;
    h = (h ^ (h >>> 13)) * 1274126177 | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  U.tileCenter = (t) => t * N.TILE + N.TILE / 2;
  U.osReducedMotion = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  U.stripEmoji = s => s.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu, '').replace(/\s+/g, ' ').trim();
  U.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
})(window.Ninle);
