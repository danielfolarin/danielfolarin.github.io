/* Wayfinder — automated play-tester (development only; not loaded by the game).
 *
 * Plays a journey from the journey-choices screen to the closing screen through the real UI,
 * choosing options in rotation (and never choosing crisis options), so you can check that
 * every journey can be completed after editing content.
 *
 * Usage (browser console, with the game open):
 *   await fetch('tools/autoplay.js').then(r => r.text()).then(eval);
 *   await WayfinderAutoplay.play('gideon', 0);      // variant 0 picks the first option, 1 the second…
 *   await WayfinderAutoplay.playAll([0, 1]);         // every journey, two variants each
 */
(() => {
  const WF = window.Wayfinder;
  const $ = (id) => document.getElementById(id);
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const CRISIS = /not safe|hurting me now|afraid I might hurt|ending my life/i;
  const errors = [];
  window.addEventListener('error', (e) => errors.push(String(e.message)));
  window.addEventListener('unhandledrejection', (e) => errors.push(String(e.reason)));

  const clickText = (root, re) => {
    const b = [...root.querySelectorAll('button')].find((x) => re.test(x.textContent) && !x.disabled && !x.hidden);
    if (b) b.click();
    return !!b;
  };

  async function play(journeyId, variant = 0, { timeout = 60000 } = {}) {
    WF.settings.reducedMotion = true;
    document.documentElement.classList.add('reduce-motion');
    const seen = {};
    const log = { journey: journeyId, variant, areas: [], choices: 0, pages: 0, result: 'incomplete' };
    const start = performance.now();
    const J = WF.journeys[journeyId];

    // Open journey choices and begin.
    if (!$('crisis').hidden) clickText($('crisis'), /return/i);
    if (!$('modal').hidden) WF.ui.closeModal();
    document.querySelector('#btn-home').click();
    await sleep(50);
    if (!$('modal').hidden) clickText($('modal'), /return home/i);
    await sleep(80);
    clickText($('screen'), /choose from all eight/i);
    await sleep(80);
    const begin = document.querySelector(`[aria-label="Begin ${J.title}"]`);
    if (!begin) { log.result = 'could not find Begin button'; return log; }
    begin.click();
    await sleep(80);
    clickText($('screen'), /^Set out$/);
    await sleep(80);

    const pump = () => {
      if (!$('crisis').hidden) { clickText($('crisis'), /return/i); return true; }
      if (!$('veil').hidden) { const b = $('veil').querySelector('button'); if (b) b.click(); return true; }
      if (!$('dialog').hidden && $('dialog').firstChild) {
        const card = $('dialog').firstChild;
        const choices = [...card.querySelectorAll('.choice')];
        if (choices.length) {
          const prompt = (card.querySelector('.choice-prompt') || {}).textContent || '';
          seen[prompt] = (seen[prompt] || 0) + 1;
          const safe = choices.filter((c) => !CRISIS.test(c.textContent));
          const pick = safe[(variant + seen[prompt] - 1) % safe.length];
          log.choices += 1;
          pick.click();
          if (pick.hasAttribute('aria-pressed')) {
            const ta = card.querySelector('textarea');
            if (ta && variant % 2) ta.value = 'Autoplay test words';
            card.querySelector('.btn.primary').click();
          }
          return true;
        }
        if (card.classList.contains('page-card')) log.pages += 1;
        const b = card.querySelector('.btn.primary');
        if (b) { b.click(); return true; }
      }
      return false;
    };

    let rot = 0;
    let lastArea = -1;
    while (performance.now() - start < timeout) {
      const S = WF.debug.state;
      if (S.step === 'close') break;
      if (pump()) { await sleep(15); continue; }
      if (S.step === 'adventure') {
        const w = WF.debug.world;
        if (!w || !w.enabled || document.body.classList.contains('scripting')) { await sleep(40); continue; }
        if (S.areaIndex !== lastArea) { lastArea = S.areaIndex; log.areas.push(w.area.id); }
        if (w.exitOpen()) { w.x = w.W - 60; w.frame(0.016); await sleep(120); continue; } // step the loop directly: background tabs pause animation frames
        const vis = w.hotspots.filter((hs) => w.isVisible(hs));
        let hs = vis.find((x) => !S.flags[`seen:${x.id}`]);
        if (!hs) hs = vis[rot++ % vis.length];
        w.x = hs.fx;
        w.onInteract(hs);
        await sleep(30);
        continue;
      }
      const screen = $('screen');
      if (screen.classList.contains('stillness-screen')) clickText(screen, /continue to scripture/i);
      else if (S.step === 'reflect') {
        screen.querySelectorAll('fieldset.question').forEach((fs) => { const c = fs.querySelectorAll('.choice'); if (c.length) c[variant % c.length].click(); });
        clickText(screen, /^Continue$/);
      } else if (S.step === 'scripture') {
        if (!clickText(screen, /Next passage/)) clickText(screen, /Choose a next step/);
      } else if (S.step === 'next') {
        const c = screen.querySelectorAll('.choice');
        c[variant % c.length].click();
        await sleep(20);
        clickText(screen, /Continue with this step/);
      }
      await sleep(40);
    }
    const S = WF.debug.state;
    if (S.step === 'close') {
      const h2 = $('screen').querySelector('h2');
      log.result = h2 && h2.textContent === J.closing.heading ? 'completed' : `close screen mismatch: ${h2 && h2.textContent}`;
      log.hasReturn = [...$('screen').querySelectorAll('button')].some((b) => /Return to journey choices/.test(b.textContent));
    } else {
      log.result = `timed out at step ${S.step}${S.step === 'adventure' ? ` (${WF.debug.world && WF.debug.world.area.id}, flags: ${Object.keys(S.flags).join(', ')})` : ''}`;
    }
    log.seconds = Math.round((performance.now() - start) / 100) / 10;
    log.errors = errors.splice(0);
    return log;
  }

  async function playAll(variants = [0]) {
    const out = [];
    for (const id of WF.journeyOrder) for (const v of variants) out.push(await play(id, v));
    return out;
  }

  window.WayfinderAutoplay = { play, playAll };
})();
