/* Wayfinder — core helpers and the journey registry.
 * Everything hangs off one global namespace so the game runs from file:// without a build step. */
(() => {
  'use strict';
  const WF = (window.Wayfinder = window.Wayfinder || {});

  WF.version = '0.1.0';
  WF.journeys = {};
  WF.journeyOrder = ['elijah', 'gideon', 'naomi', 'hagar', 'joseph', 'peter', 'david', 'samson'];

  WF.DEFAULT_HOWTO = [
    ['Walk', 'Hold ◀ ▶, use the arrow keys, or tap the path where you want to go.'],
    ['Look closer', 'When something glows, tap it or press Space.'],
    ['Pause', 'Use Pause (top right) or Esc whenever you like. Your place is kept.'],
  ];

  /** Register a journey (see README → "Adding a journey"). */
  WF.registerJourney = (journey) => {
    if (!journey || !journey.id) throw new Error('[Wayfinder] A journey needs an id.');
    ['title', 'companion', 'areas', 'reflect', 'scripture', 'nextSteps', 'closing'].forEach((key) => {
      if (!journey[key]) console.warn(`[Wayfinder] Journey "${journey.id}" is missing "${key}".`);
    });
    (journey.areas || []).forEach((area) => {
      if (!WF.art || !WF.art.scenes[area.scene]) console.warn(`[Wayfinder] Area "${area.id}" uses unknown scene "${area.scene}".`);
    });
    WF.journeys[journey.id] = journey;
  };

  /** Tiny DOM builder. Text is always set as textContent; `html` is only for trusted, authored strings. */
  WF.h = (tag, props, ...kids) => {
    const el = document.createElement(tag);
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v == null || v === false) continue;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k === 'html') el.innerHTML = v;
        else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
        else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
        else if (v === true) el.setAttribute(k, '');
        else el.setAttribute(k, v);
      }
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return el;
  };

  /** Split authored text on blank lines into <p> elements. */
  WF.paras = (text, cls) => String(text || '')
    .split(/\n\s*\n/)
    .filter(Boolean)
    .map((p) => WF.h('p', { class: cls, text: p.trim() }));

  WF.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  WF.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /** Deterministic random numbers so painted landscapes look the same every visit. */
  WF.rng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  /** Evaluate a content condition: { flags:[], notFlags:[], answer:{ key, in:[] } }. */
  WF.test = (cond, state) => {
    if (!cond) return true;
    const flags = state.flags || {};
    if (cond.flags && !cond.flags.every((f) => flags[f])) return false;
    if (cond.notFlags && cond.notFlags.some((f) => flags[f])) return false;
    if (cond.anyFlags && !cond.anyFlags.some((f) => flags[f])) return false;
    if (cond.answer) {
      const a = (state.answers || {})[cond.answer.key];
      if (!a || !cond.answer.in.includes(a.value)) return false;
    }
    return true;
  };
})();
