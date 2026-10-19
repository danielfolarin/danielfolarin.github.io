/* Progress is saved ONLY on this device (localStorage). No accounts, nothing is sent anywhere. */
(function (N) {
  'use strict';
  const KEY = 'ninle.save.v1';
  const defaults = () => ({
    avatar: 0, sound: true, readAloud: false, calm: null,
    stickers: {}, costumes: {}, wear: {}, stars: {}, completions: 0
  });
  const S = N.save = { data: defaults() };

  S.load = function () {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) S.data = Object.assign(defaults(), JSON.parse(raw));
    } catch (e) { /* private mode or blocked storage: play without saving */ }
    return S.data;
  };
  S.write = function () {
    try { localStorage.setItem(KEY, JSON.stringify(S.data)); } catch (e) { /* ignore */ }
  };
  S.set = function (k, v) { S.data[k] = v; S.write(); };
  S.addSticker = function (id) {
    const isNew = !S.data.stickers[id];
    S.data.stickers[id] = true; S.write();
    return isNew;
  };
  S.addCostume = function (id) {
    const isNew = !S.data.costumes[id];
    S.data.costumes[id] = true;
    if (isNew) S.data.wear[id] = true; // put new costume on straight away
    S.write();
    return isNew;
  };
  S.markStar = function (levelId, starId) {
    const k = levelId + ':' + starId;
    S.data.stars[k] = true; S.write();
  };
  S.calm = function () { return S.data.calm == null ? N.util.osReducedMotion() : !!S.data.calm; };
})(window.Ninle);
