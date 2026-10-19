/* Wayfinder — voiced lines.
 * Voice clips are generated ahead of time (tools/voices.py, using Fish Audio) and shipped with
 * the game, so nothing a player writes or does is ever sent to a voice service.
 *
 * Every spoken line gets a stable id from its speaker and exact text. The generator and the game
 * both use WF.voice.id() and WF.voice.lines() from this file, so they always agree. Edit a line
 * and it simply gets a new id (and needs a new clip); unchanged lines keep their audio. */
(() => {
  'use strict';
  const WF = (window.Wayfinder = window.Wayfinder || {});
  const SEP = '␟';

  /** FNV-1a 32-bit hash → 8 hex chars. Stable across browsers and JavaScriptCore. */
  function id(speaker, text) {
    const s = `${speaker}${SEP}${text}`;
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(16).padStart(8, '0');
  }

  /** What the narrator reads for a story page. */
  function pageText(page) {
    return [page.title + '.', page.kjv, page.summary, page.reflection].filter(Boolean).join(' ');
  }

  /** Every voiced line in a journey, in play order, de-duplicated. */
  function lines(journey) {
    const out = [];
    const seen = new Set();
    const add = (speaker, text, where) => {
      if (!text) return;
      const key = id(speaker, text);
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ id: key, speaker, text, journey: journey.id, where });
    };
    const walk = (steps, where) => {
      (steps || []).forEach((st) => {
        if (st.say) add(st.say.speaker || 'narrator', st.say.text, where);
        if (st.page && journey.pages[st.page]) add('page', pageText(journey.pages[st.page]), where);
        if (st.choice) {
          add(st.choice.speaker || 'narrator', st.choice.prompt, where);
          st.choice.options.forEach((o) => walk(o.then, where));
        }
        if (st.rest) add('narrator', st.rest.text, where);
        if (st.storm) st.storm.forEach((p) => add('narrator', p.text, where));
        if (st.stillness) add('narrator', st.stillness.text, where);
      });
    };
    journey.areas.forEach((area) => {
      walk(area.intro, `${area.id}:intro`);
      area.hotspots.forEach((hs) => {
        walk(hs.steps, `${area.id}:${hs.id}`);
        walk(hs.again, `${area.id}:${hs.id}:again`);
      });
    });
    add('narrator', journey.closing && journey.closing.hope, 'closing');
    return out;
  }

  /* ---------- playback (browser only) ---------- */

  let current = null;

  function enabled() {
    return !!(WF.settings && WF.settings.sound && WF.settings.voice);
  }

  function stop() {
    if (current) {
      current.pause();
      // Detach the file without triggering a media error event.
      current.removeAttribute('src');
      current.load();
      current = null;
    }
  }

  /** Play the clip for this exact line if one was generated. Silently does nothing otherwise. */
  function play(speaker, text) {
    stop();
    if (!enabled() || !text || typeof Audio === 'undefined') return false;
    const file = (WF.voiceManifest || {})[id(speaker, text)];
    if (!file) return false;
    const audio = new Audio(`audio/voice/${file}`);
    audio.volume = 1;
    current = audio;
    audio.play().catch(() => { /* autoplay blocked or file missing: text is always on screen */ });
    return true;
  }

  /** Every voiced line in every registered journey (used by tools/voices.py). */
  function allLines() {
    const order = WF.journeyOrder || Object.keys(WF.journeys || {});
    return order.filter((jid) => WF.journeys[jid]).flatMap((jid) => lines(WF.journeys[jid]));
  }

  WF.voice = { id, pageText, lines, allLines, play, stop, enabled, count: () => Object.keys(WF.voiceManifest || {}).length };
})();
