/* Wayfinder — local-only storage.
 * Nothing here is ever sent to a server. Everything lives in this browser's localStorage
 * and can be cleared from Settings. Written reflections are stored ONLY when the player
 * presses "Save My Reflection"; in-progress autosaves hold choices and progress, never free text. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const PREFIX = 'wayfinder.';
  const KEYS = ['settings', 'progress', 'reflections'];

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
    remove(key) {
      try { localStorage.removeItem(PREFIX + key); } catch (e) { /* storage unavailable */ }
    },
    clearAll() {
      KEYS.forEach((k) => store.remove(k));
    },
  };

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  WF.store = store;
  WF.settings = Object.assign(
    { sound: false, voice: true, captions: true, reducedMotion: !!prefersReduced, largeText: false },
    store.get('settings', {})
  );
  WF.saveSettings = () => store.set('settings', WF.settings);

  WF.reflections = {
    all: () => store.get('reflections', []),
    add(entry) {
      const list = store.get('reflections', []);
      list.unshift(entry);
      return store.set('reflections', list);
    },
    remove(id) {
      store.set('reflections', store.get('reflections', []).filter((r) => r.id !== id));
    },
    clear: () => store.remove('reflections'),
  };
})();
