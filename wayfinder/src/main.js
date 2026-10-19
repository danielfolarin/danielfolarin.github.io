/* Wayfinder — game flow.
 * Arrive → Check in → Story companion → Adventure → Reflect → Scripture → Next step → Close. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const { h, ui } = WF;
  const $ = (id) => document.getElementById(id);

  const STEPS = [
    { id: 'arrive', label: 'Arrive' },
    { id: 'checkin', label: 'Check in' },
    { id: 'companion', label: 'Story companion' },
    { id: 'adventure', label: 'Adventure' },
    { id: 'reflect', label: 'Reflect' },
    { id: 'scripture', label: 'Scripture' },
    { id: 'next', label: 'Next step' },
    { id: 'close', label: 'Close' },
  ];

  const fresh = (extra) => Object.assign({
    step: 'arrive',
    topic: null,         // check-in option id
    followup: null,      // { value, label }
    journeyId: null,
    areaIndex: 0,
    flags: {},
    answers: {},         // key -> { value, label, prompt }
    texts: {},           // key -> { prompt, text }  (memory only unless the player saves)
    pages: [],           // page ids found
    lights: 0,
    reflect: null,
    next: null,          // { id, label, text }
    saved: false,
    abort: false,
  }, extra);

  let S = fresh();
  let world = null;
  let busy = false;

  const journey = () => WF.journeys[S.journeyId];
  const topicOption = () => WF.checkin.options.find((o) => o.id === S.topic);
  const btn = (text, cls, onclick, extra = {}) => h('button', Object.assign({ class: `btn ${cls || ''}`, type: 'button', text, onclick }, extra));

  /* =========================================================
   * Settings, sound, and chrome
   * ========================================================= */

  function applySettings() {
    const root = document.documentElement;
    root.classList.toggle('reduce-motion', !!WF.settings.reducedMotion);
    root.classList.toggle('large-text', !!WF.settings.largeText);
    root.classList.toggle('no-captions', !WF.settings.captions);
    const sb = $('btn-sound');
    sb.setAttribute('aria-pressed', String(!!WF.settings.sound));
    sb.classList.toggle('on', !!WF.settings.sound);
    sb.querySelector('.label').textContent = WF.settings.sound ? 'Sound on' : 'Sound off';
  }

  function toggleSound() {
    WF.settings.sound = !WF.settings.sound;
    const ok = WF.audio.setEnabled(WF.settings.sound);
    if (WF.settings.sound && !ok) {
      WF.settings.sound = false;
      ui.toast('Sound isn’t available in this browser. Everything still works without it.');
    } else {
      ui.toast(WF.settings.sound ? 'Gentle ambient sound on' : 'Sound off');
    }
    if (!WF.settings.sound) WF.voice.stop();
    WF.saveSettings();
    applySettings();
  }

  function setProgress(stepId) {
    const nav = $('progress');
    const idx = STEPS.findIndex((s) => s.id === stepId);
    document.body.dataset.step = stepId;
    nav.replaceChildren(
      h('ol', {}, STEPS.map((s, i) => h('li', {
        class: i < idx ? 'done' : i === idx ? 'current' : '',
        'aria-current': i === idx ? 'step' : null,
        title: s.label,
      }, h('span', { class: 'sr-only', text: `${s.label}${i < idx ? ' (done)' : i === idx ? ' (current)' : ''}` })))),
      h('span', { class: 'progress-label', text: idx >= 0 ? STEPS[idx].label : '' }));
  }

  let backdropScene = null;
  function setBackdrop(scene) {
    const bd = $('backdrop');
    bd.hidden = false;
    if (backdropScene === scene) return;
    backdropScene = scene;
    bd.innerHTML = WF.art.backdrop(scene);
  }

  /** Render a menu-style screen. */
  function show(step, scene, children, { cls = '' } = {}) {
    leaveWorld();
    S.step = step;
    setProgress(step);
    setBackdrop(scene);
    document.body.dataset.mode = 'screen';
    const screen = $('screen');
    screen.hidden = false;
    screen.className = `screen ${cls}`;
    screen.replaceChildren(h('div', { class: 'screen-inner' }, children));
    screen.scrollTop = 0;
    WF.audio.setMood((WF.art.scenes[scene] || {}).mood || 'home');
    requestAnimationFrame(() => {
      const heading = screen.querySelector('h1, h2');
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    });
  }

  function fadeThrough(fn) {
    if (WF.settings.reducedMotion) { fn(); return; }
    const app = $('app');
    app.classList.add('fading');
    setTimeout(() => {
      try { fn(); } finally { setTimeout(() => app.classList.remove('fading'), 30); }
    }, 420);
  }

  /* =========================================================
   * Saving
   * ========================================================= */

  function saveProgress() {
    if (!S.journeyId) return;
    // Choices and progress only. Free text is never autosaved.
    WF.store.set('progress', {
      v: 1,
      step: S.step, topic: S.topic, followup: S.followup, journeyId: S.journeyId, areaIndex: S.areaIndex,
      flags: S.flags, answers: S.answers, pages: S.pages, lights: S.lights,
      reflect: S.reflect ? { values: S.reflect.values, labels: S.reflect.labels } : null,
      next: S.next ? { id: S.next.id, label: S.next.label } : null,
      savedAt: new Date().toISOString(),
    });
  }
  const clearProgress = () => WF.store.remove('progress');

  function resume() {
    const p = WF.store.get('progress', null);
    if (!p || !WF.journeys[p.journeyId]) { clearProgress(); showTitle(); return; }
    S = fresh(p);
    ui.speakers = journey().speakers || {};
    const go = {
      adventure: () => enterArea(S.areaIndex || 0),
      reflect: showReflect,
      scripture: () => showScripture(0),
      next: showNextStep,
      close: showClose,
    }[p.step] || (() => enterArea(S.areaIndex || 0));
    fadeThrough(go);
  }

  /* =========================================================
   * 1. ARRIVE
   * ========================================================= */

  function showTitle() {
    S = fresh();
    const progress = WF.store.get('progress', null);
    const pj = progress && WF.journeys[progress.journeyId];
    const reflections = WF.reflections.all();
    const resumeArea = pj && progress.step === 'adventure' ? pj.areas[progress.areaIndex] : null;
    show('arrive', 'title', [
      h('div', { class: 'title-block' },
        h('p', { class: 'eyebrow', text: 'A Journey Through Life with God' }),
        h('h1', { class: 'title' }, 'Wayfinder'),
        h('p', { class: 'tagline', text: 'A quiet, story-shaped space for difficult and important seasons — with Scripture, prayer, and one wise next step.' })),
      pj ? h('div', { class: 'resume-card' },
        h('div', {},
          h('span', { class: 'resume-label', text: 'Continue where you left off' }),
          h('strong', { text: pj.title }),
          h('span', { class: 'resume-sub', text: resumeArea ? resumeArea.title : (STEPS.find((s) => s.id === progress.step) || {}).label })),
        btn('Continue', 'primary', resume)) : null,
      h('div', { class: 'stack title-actions' },
        btn('Begin a Journey', 'primary large', () => fadeThrough(showCheckin)),
        btn('Explore the World', 'ghost large', () => fadeThrough(showExplore))),
      h('p', { class: 'title-choose' }, btn('Or choose from all eight journeys', 'link', () => fadeThrough(showJourneys))),
      h('p', { class: 'reassure', text: 'You can skip any question, and you can leave whenever you wish. Nothing you write leaves this device.' }),
      h('div', { class: 'title-links' },
        reflections.length ? btn(`My Reflections (${reflections.length})`, 'link', showReflections) : null,
        btn('About Wayfinder', 'link', openAbout),
        btn('Settings', 'link', openSettings),
        h('a', { class: 'btn link', href: '../' }, 'More games')),
      h('p', { class: 'fineprint', text: WF.support.disclaimer }),
    ], { cls: 'title-screen' });
  }

  /* =========================================================
   * 2. CHECK IN
   * ========================================================= */

  function showCheckin() {
    S = fresh({ step: 'checkin' });
    const C = WF.checkin;
    show('checkin', 'road', [
      h('p', { class: 'eyebrow', text: 'Check in' }),
      h('h2', { text: C.question }),
      h('p', { class: 'hint', text: C.note }),
      h('div', { class: 'choices big' }, C.options.map((o) => h('button', {
        class: 'choice', type: 'button', text: o.label,
        onclick: () => {
          S.topic = o.id;
          if (o.id === 'explore') fadeThrough(showExplore);
          else if (o.followup) fadeThrough(() => showFollowup(o));
          else fadeThrough(showCompanion);
        },
      }))),
      h('div', { class: 'row' },
        btn('Skip this question', 'ghost', () => { S.topic = null; fadeThrough(showCompanion); }),
        btn('Back', 'link', () => fadeThrough(showTitle))),
    ]);
  }

  function showFollowup(option) {
    const f = option.followup;
    const noteBox = h('div', { class: 'care-note', hidden: true });
    const next = btn('Continue', 'primary', () => fadeThrough(showCompanion));
    show('checkin', 'road', [
      h('p', { class: 'eyebrow', text: 'Check in · optional' }),
      h('h2', { text: f.question }),
      h('p', { class: 'hint', text: 'Only if you’d like to say. This just helps Wayfinder choose gentle words — it isn’t an assessment.' }),
      h('div', { class: 'choices' }, f.options.map((o) => h('button', {
        class: 'choice', type: 'button', text: o.label,
        onclick: () => {
          S.followup = { value: o.value, label: o.label };
          const note = f.notes && f.notes[o.value];
          if (note) {
            noteBox.replaceChildren(h('p', { text: note }), next);
            noteBox.hidden = false;
            next.focus();
          } else fadeThrough(showCompanion);
        },
      }))),
      noteBox,
      h('div', { class: 'row' },
        btn('Skip', 'ghost', () => { S.followup = null; fadeThrough(showCompanion); }),
        btn('Back', 'link', () => fadeThrough(showCheckin))),
    ]);
  }

  /* =========================================================
   * 3. STORY COMPANION
   * ========================================================= */

  function companionCard(id, { primary = true, recommended = false } = {}) {
    const c = WF.companions[id];
    const J = WF.journeys[c.journeyId];
    return h('article', { class: `companion-card${primary ? ' primary' : ''}` },
      h('div', { class: 'companion-ref' }, `${c.ref} · ${c.themes}`, recommended ? h('span', { class: 'badge', text: 'May connect' }) : null),
      h('h3', { text: J ? J.title : c.title }),
      h('p', { class: 'companion-sub', text: `${c.name} · ${c.place}` }),
      h('p', { text: c.summary }),
      primary ? h('p', { class: 'muted', text: c.context }) : null,
      J ? h('div', { class: 'row' },
        btn('Begin this journey', primary ? 'primary' : 'ghost', () => fadeThrough(() => startJourney(J.id)), { 'aria-label': `Begin ${J.title}` }),
        h('span', { class: 'muted small', text: J.length })) : null,
      c.questions ? readingGuide(id) : null);
  }

  function readingGuide(id) {
    const c = WF.companions[id];
    return h('details', { class: 'reading-guide' },
      h('summary', { text: `Or read & reflect on ${c.ref} directly` }),
      h('p', { text: `Open your Bible to ${c.ref}, in whichever translation you prefer. Read slowly. Then, if it helps, sit with one of these questions:` }),
      h('ul', {}, c.questions.map((q) => h('li', { text: q }))),
      h('p', { class: 'muted', text: 'You don’t need answers. Noticing is enough.' }));
  }

  const recommendedIds = () => {
    const opt = topicOption();
    return opt && opt.companions.length ? opt.companions : [];
  };

  function showCompanion() {
    const opt = topicOption();
    const ids = recommendedIds().length ? recommendedIds() : ['elijah'];
    const blocks = [
      h('p', { class: 'eyebrow', text: 'Find a story companion' }),
      h('h2', { text: opt ? 'Stories that may connect with what you’re carrying' : 'A gentle place to begin' }),
      h('p', { class: 'hint', text: opt
        ? 'Your situation may connect with these stories. You aren’t being told you are like the person in them — choose whichever feels right, or look at all eight.'
        : 'Not choosing is completely fine. Many people find this story a good place to start, whatever they’re carrying — or you can look at all eight journeys.' }),
      ids.map((id, i) => companionCard(id, { primary: i === 0, recommended: !!opt })),
    ];
    if (opt && opt.care) blocks.push(h('div', { class: 'care-note' }, h('p', { text: opt.care })));
    blocks.push(
      h('p', { class: 'small muted' }, 'If you’re not safe right now, ', h('button', { class: 'btn link inline', type: 'button', text: 'find support here', onclick: () => ui.crisis({ reason: 'menu' }) }), '.'),
      h('div', { class: 'row' },
        btn('See all eight journeys', 'ghost', () => fadeThrough(showJourneys)),
        btn('Back', 'link', () => fadeThrough(opt && opt.followup ? () => showFollowup(opt) : showCheckin))));
    show('companion', 'juniper', blocks);
  }

  /** Journey choices: all eight journeys, with any recommendations from the check-in marked. */
  function showJourneys() {
    const rec = recommendedIds();
    const order = [...rec, ...WF.journeyOrder.filter((id) => !rec.includes(id))].filter((id) => WF.journeys[id]);
    show('companion', 'title', [
      h('p', { class: 'eyebrow', text: 'Journey choices' }),
      h('h2', { text: 'Choose a journey' }),
      h('p', { class: 'hint', text: rec.length
        ? 'Stories marked “May connect” relate to what you chose at check-in. Any of them is open to you, and you can come back here to walk another.'
        : 'Eight stories from Scripture, each its own journey. Choose whichever you’d like; you can come back here to walk another.' }),
      h('div', { class: 'journey-grid' }, order.map((id) => {
        const J = WF.journeys[id];
        const c = WF.companions[J.companion];
        return h('article', { class: `journey-card${rec.includes(id) ? ' recommended' : ''}` },
          h('div', { class: 'companion-ref' }, `${c.name} · ${J.passage}`, rec.includes(id) ? h('span', { class: 'badge', text: 'May connect' }) : null),
          h('h3', { text: J.title }),
          h('p', { class: 'muted small', text: J.tagline }),
          h('div', { class: 'row tight' },
            btn('Begin', 'primary', () => fadeThrough(() => startJourney(id)), { 'aria-label': `Begin ${J.title}` }),
            btn('About this story', 'link', () => fadeThrough(() => showExplore(J.companion)))));
      })),
      h('div', { class: 'row' },
        btn('Check in again', 'ghost', () => fadeThrough(showCheckin)),
        btn('Return home', 'link', () => fadeThrough(showTitle))),
    ], { cls: 'journeys-screen' });
  }

  /* =========================================================
   * Explore the World
   * ========================================================= */

  function showExplore(selectedId) {
    const detail = h('div', { class: 'map-detail', 'aria-live': 'polite' });
    const select = (id) => {
      document.querySelectorAll('.map-pin').forEach((p) => p.classList.toggle('selected', p.dataset.id === id));
      detail.replaceChildren(companionCard(id, { primary: true }));
    };
    const pins = Object.entries(WF.companions).map(([id, c]) => h('button', {
      class: 'map-pin open', type: 'button', 'data-id': id,
      style: { left: `${(c.map.x / 700) * 100}%`, top: `${(c.map.y / 640) * 100}%` },
      'aria-label': `${c.place}: ${c.name}`,
      onclick: () => { select(id); detail.scrollIntoView({ behavior: WF.settings.reducedMotion ? 'auto' : 'smooth', block: 'nearest' }); },
    }, h('span', { class: 'pin-dot' }), h('span', { class: 'pin-label', text: c.place })));
    show(S.topic === 'explore' ? 'checkin' : 'arrive', 'pass', [
      h('p', { class: 'eyebrow', text: 'Explore the World' }),
      h('h2', { text: 'Places along the way' }),
      h('p', { class: 'hint', text: 'Each place holds a story from Scripture and a journey you can walk. Choose a place to learn about it.' }),
      h('div', { class: 'map-wrap' }, h('div', { class: 'map', html: WF.art.worldMap() }), pins),
      detail,
      h('div', { class: 'row' },
        btn('See all journeys as a list', 'ghost', () => fadeThrough(showJourneys)),
        btn('Return home', 'link', () => fadeThrough(showTitle))),
    ], { cls: 'explore-screen' });
    select(typeof selectedId === 'string' ? selectedId : 'elijah');
  }

  /* =========================================================
   * 4. ADVENTURE
   * ========================================================= */

  function startJourney(id) {
    const topic = S.topic;
    const followup = S.followup;
    S = fresh({ topic, followup, journeyId: id });
    const J = journey();
    ui.speakers = J.speakers || {};
    const p = J.prologue;
    show('adventure', J.areas[0].scene, [
      h('p', { class: 'eyebrow', text: `${J.passage} · ${J.length}` }),
      h('h2', { text: J.title }),
      h('p', { class: 'tagline', text: J.tagline }),
      h('h3', { class: 'section-title', text: p.heading }),
      WF.paras(p.text),
      h('dl', { class: 'howto' }, (p.howTo || WF.DEFAULT_HOWTO).map(([k, v]) => [h('dt', { text: k }), h('dd', { text: v })])),
      h('div', { class: 'row' },
        btn('Set out', 'primary large', () => fadeThrough(() => enterArea(0))),
        btn('Back to journey choices', 'link', () => fadeThrough(showJourneys))),
    ]);
  }

  function leaveWorld() {
    WF.voice.stop();
    if (world) { world.destroy(); world = null; ui.world = null; }
    busy = false;
    document.body.classList.remove('scripting');
    ui.closeDialog();
    $('hud').hidden = true;
    $('controls').hidden = true;
    $('stage').hidden = true;
  }

  function enterArea(i) {
    const J = journey();
    const area = J.areas[i];
    leaveWorld();
    S.step = 'adventure';
    S.areaIndex = i;
    S.abort = false;
    saveProgress();
    setProgress('adventure');
    document.body.dataset.mode = 'world';
    $('screen').hidden = true;
    $('backdrop').hidden = true;
    $('hud').hidden = false;
    $('controls').hidden = false;
    world = new WF.World({
      stage: $('stage'),
      area,
      state: S,
      onInteract: interact,
      onExit: () => exitArea(),
      onBlocked: () => ui.toast(area.exitHint, 4200),
      onNear: setNear,
    });
    ui.world = world;
    world.mount();
    world.enabled = false; // held until the area's intro has played
    WF.audio.setMood(WF.art.scenes[area.scene].mood);
    updateHud();
    setNear(null);
    const banner = h('div', { class: 'area-banner', 'aria-hidden': 'true' },
      h('span', { text: `Part ${i + 1} of ${J.areas.length}` }), h('strong', { text: area.title }));
    $('stage').append(banner);
    setTimeout(() => banner.remove(), 3600);
    ui.caption(area.caption);
    setTimeout(() => { if (world && world.area === area) runScript(area.intro || []); }, WF.settings.reducedMotion ? 300 : 1400);
  }

  function exitArea() {
    const J = journey();
    const nextIndex = S.areaIndex + 1;
    fadeThrough(() => {
      if (nextIndex < J.areas.length) enterArea(nextIndex);
      else showReflect();
    });
  }

  function updateHud() {
    if (!world) return;
    const J = journey();
    const area = world.area;
    $('hud-area').textContent = `${S.areaIndex + 1}/${J.areas.length} · ${area.title}`;
    const open = world.exitOpen();
    const obj = $('hud-objective');
    obj.textContent = open ? 'The path continues east →' : area.objective;
    obj.classList.toggle('open', open);
    $('hud-finds').replaceChildren(
      h('span', { title: 'Story pages found' }, h('i', { class: 'ico-page', 'aria-hidden': 'true' }), `${S.pages.length} ${S.pages.length === 1 ? 'page' : 'pages'}`),
      h('span', { title: 'Lights gathered' }, h('i', { class: 'ico-light', 'aria-hidden': 'true' }), `${S.lights} ${S.lights === 1 ? 'light' : 'lights'}`));
  }

  function setNear(hs) {
    const act = $('ctrl-act');
    const verb = act.querySelector('.act-verb');
    const target = $('ctrl-act-target');
    if (hs) {
      act.disabled = false;
      verb.textContent = hs.verb || 'Look closer';
      target.textContent = hs.label;
      act.setAttribute('aria-label', `${hs.verb || 'Look closer'}: ${hs.label}`);
    } else {
      act.disabled = true;
      const open = world && world.exitOpen();
      verb.textContent = open ? 'Path open' : 'Explore';
      target.textContent = open ? 'Walk on to the east →' : 'Look for something glowing';
      act.removeAttribute('aria-label');
    }
  }

  async function interact(hs) {
    if (busy || !world) return;
    const seenKey = `seen:${hs.id}`;
    const steps = S.flags[seenKey] && hs.again ? hs.again : hs.steps;
    const w = world;
    await runScript(steps, () => { S.flags[seenKey] = true; });
    if (world === w) { world.refresh(); updateHud(); setNear(world.near); }
  }

  async function runScript(steps, onComplete) {
    if (!world || !steps || !steps.length) {
      if (onComplete) onComplete();
      if (world && !busy) world.enabled = !ui.modalOpen();
      return;
    }
    busy = true;
    world.enabled = false;
    document.body.classList.add('scripting');
    const w = world;
    await runSteps(steps);
    if (S.abort || world !== w) return;
    if (onComplete) onComplete();
    busy = false;
    document.body.classList.remove('scripting');
    world.enabled = !ui.modalOpen();
    world.refresh();
    updateHud();
  }

  async function runSteps(steps) {
    for (const st of steps) {
      if (S.abort) return;
      if (st.if && !WF.test(st.if, S)) continue;
      if (st.say) await ui.say(st.say);
      else if (st.page) await showPage(st.page);
      else if (st.choice) await runChoice(st.choice);
      else if (st.set) [].concat(st.set).forEach((f) => { S.flags[f] = true; });
      else if (st.light) { S.lights += 1; WF.audio.event('chime'); ui.toast(`✦ ${st.light}`); }
      else if (st.rest) await ui.rest(st.rest);
      else if (st.storm) await ui.storm(st.storm);
      else if (st.stillness) await ui.stillness(st.stillness);
      else if (st.fx && world) world.fx(st.fx, true);
      else if (st.caption) ui.caption(st.caption);
      else if (st.sound) WF.audio.event(st.sound);
      if (world) { world.refresh(); updateHud(); }
    }
  }

  async function showPage(id) {
    const page = journey().pages[id];
    if (!page) return;
    const first = !S.pages.includes(id);
    if (first) { S.pages.push(id); WF.audio.event('chime'); updateHud(); }
    await ui.page(page, { found: first });
  }

  async function runChoice(c) {
    const asked = new Set();
    for (;;) {
      const options = c.loop ? c.options.filter((o) => o.end || !asked.has(o.value)) : c.options;
      const res = await ui.choice(Object.assign({}, c, { options }));
      if (c.key) {
        if (res.option) S.answers[c.key] = { value: res.value, label: res.label, prompt: c.prompt };
        if (res.text) S.texts[c.key] = { prompt: c.prompt, text: res.text };
      }
      if (res.text && WF.support.detect(res.text)) { if (!(await safetyPause('text'))) return; }
      const o = res.option;
      if (o && o.crisis) { if (!(await safetyPause('choice'))) return; }
      if (o && o.set) [].concat(o.set).forEach((f) => { S.flags[f] = true; });
      if (o && o.then) await runSteps(o.then);
      if (S.abort) return;
      if (!c.loop || !o || o.end) return;
      asked.add(o.value);
      if (!c.options.some((x) => !x.end && !asked.has(x.value))) return;
    }
  }

  /** Show crisis support. Returns true to continue, false if the player went home. */
  async function safetyPause(reason) {
    const wasEnabled = world ? world.enabled : false;
    if (world) world.enabled = false;
    const result = await ui.crisis({ reason });
    if (result === 'home') {
      S.abort = true;
      fadeThrough(showTitle);
      return false;
    }
    if (world) world.enabled = wasEnabled;
    return true;
  }

  /* =========================================================
   * 5. REFLECT
   * ========================================================= */

  function showReflect() {
    const J = journey();
    S.step = 'reflect';
    saveProgress();
    const blocks = J.reflect.questions.map((q) => ui.choiceBlock(q));
    show('reflect', 'cave', [
      h('p', { class: 'eyebrow', text: 'Reflect' }),
      h('h2', { text: 'Looking back on the road' }),
      h('p', { class: 'hint', text: J.reflect.intro }),
      blocks.map((b) => b.el),
      h('div', { class: 'row' },
        btn('Continue', 'primary', async () => {
          const values = blocks.map((b) => b.value());
          S.reflect = {
            questions: J.reflect.questions.map((q, i) => ({ key: q.key, prompt: q.prompt, labels: values[i].labels, values: values[i].values, text: values[i].text })),
          };
          S.reflect.values = S.reflect.questions.map((q) => q.values);
          S.reflect.labels = S.reflect.questions.map((q) => q.labels);
          const allText = values.map((v) => v.text).join(' ');
          if (WF.support.detect(allText)) {
            const r = await ui.crisis({ reason: 'text' });
            if (r === 'home') { fadeThrough(showTitle); return; }
          }
          fadeThrough(showStillness);
        }),
        btn('Skip', 'ghost', () => fadeThrough(showStillness))),
    ]);
  }

  function showStillness() {
    const st = journey().reflect.stillness;
    const circle = h('div', { class: 'breath', 'aria-hidden': 'true' }, h('div', { class: 'breath-orb' }));
    const line = h('p', { class: 'breath-line', 'aria-live': 'polite', text: 'When you’re ready, begin.' });
    const startBtn = btn('Begin', 'primary', () => run());
    const doneBtn = btn('Continue to Scripture', 'ghost', () => { stop(); fadeThrough(() => showScripture(0)); });
    let timers = [];
    let running = false;
    const stop = () => { timers.forEach(clearTimeout); timers = []; running = false; circle.classList.remove('in', 'out'); };
    const run = () => {
      if (running) return;
      running = true;
      startBtn.hidden = true;
      WF.audio.event('hush');
      const IN = 4500;
      const OUT = 6000;
      let t = 0;
      for (let c = 0; c < st.cycles; c++) {
        timers.push(setTimeout(() => { circle.classList.add('in'); circle.classList.remove('out'); line.textContent = `Breathe in… ${st.breathIn}`; }, t));
        t += IN;
        timers.push(setTimeout(() => { circle.classList.add('out'); circle.classList.remove('in'); line.textContent = `Breathe out… ${st.breathOut}`; }, t));
        t += OUT;
      }
      timers.push(setTimeout(() => {
        running = false;
        circle.classList.remove('in', 'out');
        line.textContent = 'Amen. Stay as long as you like.';
        doneBtn.textContent = 'Continue to Scripture';
        doneBtn.className = 'btn primary';
        doneBtn.focus();
      }, t));
      doneBtn.textContent = 'Skip';
    };
    show('reflect', 'cave', [
      h('p', { class: 'eyebrow', text: 'Stillness · optional' }),
      h('h2', { text: st.heading }),
      h('p', { text: st.text }),
      circle,
      line,
      h('div', { class: 'row center' }, startBtn, doneBtn),
    ], { cls: 'stillness-screen' });
  }

  /* =========================================================
   * 6. SCRIPTURE
   * ========================================================= */

  function showScripture(i) {
    const J = journey();
    const list = J.scripture;
    const p = list[i];
    S.step = 'scripture';
    saveProgress();
    show('scripture', 'pass', [
      h('p', { class: 'eyebrow', text: `Scripture · ${i + 1} of ${list.length}` }),
      h('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Passages' }, list.map((x, k) => h('button', {
        class: `tab${k === i ? ' active' : ''}`, type: 'button', role: 'tab', 'aria-selected': String(k === i), text: x.ref,
        onclick: () => showScripture(k),
      }))),
      h('article', { class: 'scripture-card' },
        h('h2', { text: p.title }),
        h('p', { class: 'scripture-ref', text: p.ref }),
        p.quotes.map((q) => h('section', { class: 'page-block scripture' },
          h('div', { class: 'block-label', text: `Scripture · ${q.ref} (KJV)` }),
          h('blockquote', { text: q.text }))),
        h('section', { class: 'page-block' },
          h('div', { class: 'block-label', text: 'Context — Wayfinder’s summary' }),
          h('p', { text: p.context })),
        h('section', { class: 'page-block reflection' },
          h('div', { class: 'block-label', text: 'Reflect' }),
          h('p', { class: 'question-text', text: p.question }))),
      h('div', { class: 'row' },
        i > 0 ? btn('← Previous', 'ghost', () => showScripture(i - 1)) : null,
        i < list.length - 1
          ? btn('Next passage →', 'primary', () => showScripture(i + 1))
          : btn('Choose a next step', 'primary', () => fadeThrough(showNextStep))),
      h('p', { class: 'small muted', text: `Quotations: King James Version (public domain). Read the whole of ${J.passage} in your preferred translation for the full story.` }),
    ]);
  }

  /* =========================================================
   * 7. NEXT STEP
   * ========================================================= */

  function showNextStep() {
    const J = journey();
    S.step = 'next';
    saveProgress();
    let chosen = S.next && J.nextSteps.find((n) => n.id === S.next.id);
    let textarea = null;
    const panel = h('div', { class: 'next-panel', 'aria-live': 'polite' });
    const continueBtn = btn('Continue with this step', 'primary', async () => {
      const text = textarea ? textarea.value.trim() : '';
      if (text && WF.support.detect(text)) {
        const r = await ui.crisis({ reason: 'text' });
        if (r === 'home') { fadeThrough(showTitle); return; }
      }
      S.next = { id: chosen.id, label: chosen.label, text };
      fadeThrough(showClose);
    }, { disabled: !chosen });
    const options = J.nextSteps.map((n) => h('button', {
      class: 'choice', type: 'button', 'aria-pressed': String(chosen === n), text: n.label,
      onclick: (e) => {
        chosen = n;
        options.forEach((b) => b.setAttribute('aria-pressed', String(b === e.currentTarget)));
        renderPanel();
        continueBtn.disabled = false;
      },
    }));
    function renderPanel() {
      textarea = null;
      if (!chosen) { panel.replaceChildren(); return; }
      const kids = [h('p', { text: chosen.detail })];
      if (chosen.prayer) kids.push(h('blockquote', { class: 'prayer', text: chosen.prayer }), h('p', { class: 'small muted', text: 'A prayer written for Wayfinder. Use it as it is, change it, or pray in your own words.' }));
      if (chosen.showSupport) {
        kids.push(h('p', { class: 'small' }, 'If things feel urgent or unsafe, ', h('button', { class: 'btn link inline', type: 'button', text: 'see support options', onclick: () => ui.crisis({ reason: 'menu' }) }), '.'));
      }
      if (chosen.prompt) {
        textarea = h('textarea', { class: 'free-text', rows: '2', maxlength: '400', placeholder: chosen.placeholder || '', 'aria-label': chosen.prompt });
        if (S.next && S.next.id === chosen.id && S.next.text) textarea.value = S.next.text;
        kids.push(h('label', { class: 'field' }, h('span', { text: `${chosen.prompt} (optional — adapt it to fit you)` }), textarea));
      }
      panel.replaceChildren(h('div', { class: 'next-detail' }, kids));
    }
    renderPanel();
    show('next', 'dawn', [
      h('p', { class: 'eyebrow', text: 'Choose a next step' }),
      h('h2', { text: 'One small, wise step' }),
      h('p', { class: 'hint', text: 'Choose one that fits — or skip. Taking a step doesn’t mean everything is fixed; it’s simply a next step on the road.' }),
      h('div', { class: 'choices' }, options),
      panel,
      h('div', { class: 'row' }, continueBtn, btn('Skip for now', 'ghost', () => { S.next = null; fadeThrough(showClose); })),
    ]);
  }

  /* =========================================================
   * 8. CLOSE WITH HOPE
   * ========================================================= */

  function buildReflection() {
    const J = journey();
    const answers = Object.values(S.answers).filter((a) => a.label).map((a) => ({ prompt: a.prompt, answer: a.label }));
    const texts = Object.values(S.texts).map((t) => ({ prompt: t.prompt, text: t.text }));
    if (S.reflect && S.reflect.questions) {
      S.reflect.questions.forEach((q) => {
        if (q.labels.length) answers.push({ prompt: q.prompt, answer: q.labels.join('; ') });
        if (q.text) texts.push({ prompt: q.prompt, text: q.text });
      });
    }
    const topic = topicOption();
    return {
      id: `r${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      journeyId: J.id,
      journeyTitle: J.title,
      passage: J.passage,
      carrying: topic && topic.id !== 'explore' ? topic.label : null,
      areas: J.areas.map((a) => a.title),
      pages: S.pages.map((id) => `${J.pages[id].title} (${J.pages[id].ref})`),
      scripture: J.scripture.map((p) => p.ref),
      answers,
      texts,
      next: S.next ? { label: S.next.label, text: S.next.text } : null,
    };
  }

  function showClose() {
    const J = journey();
    S.step = 'close';
    clearProgress();
    const r = buildReflection();
    const saveBtn = btn('Save My Reflection', 'primary', () => {
      if (S.saved) return;
      if (WF.reflections.add(r)) {
        S.saved = true;
        saveBtn.textContent = 'Saved on this device ✓';
        saveBtn.disabled = true;
        savedNote.textContent = 'Saved privately in this browser. You can read, download, or delete it from My Reflections.';
      } else {
        savedNote.textContent = 'This browser didn’t allow saving. You could copy your next step somewhere safe instead.';
      }
    });
    const savedNote = h('p', { class: 'small muted', 'aria-live': 'polite', text: 'Saving is optional. If you don’t save, your written answers are cleared when you leave this page.' });
    show('close', 'dawn', [
      h('p', { class: 'eyebrow', text: 'Close' }),
      h('h2', { text: J.closing.heading }),
      h('p', { class: 'lead', text: J.closing.hope }),
      h('section', { class: 'summary' },
        r.carrying ? h('div', { class: 'summary-row' }, h('h3', { text: 'What you brought' }), h('p', { text: r.carrying })) : null,
        h('div', { class: 'summary-row' }, h('h3', { text: 'The road you walked' }), h('p', { text: r.areas.join(' → ') })),
        h('div', { class: 'summary-row' }, h('h3', { text: 'Story pages found' }), r.pages.length ? h('ul', {}, r.pages.map((p) => h('li', { text: p }))) : h('p', { class: 'muted', text: 'None this time.' })),
        h('div', { class: 'summary-row' }, h('h3', { text: 'Scripture you read' }), h('p', { text: r.scripture.join(' · ') })),
        h('div', { class: 'summary-row' }, h('h3', { text: 'Your next step' }),
          r.next ? [h('p', { text: r.next.label }), r.next.text ? h('p', { class: 'your-words', text: r.next.text }) : null] : h('p', { class: 'muted', text: 'You chose not to pick one today — that’s okay.' })),
        r.texts.length ? h('div', { class: 'summary-row' }, h('h3', { text: 'Your words' }), r.texts.map((t) => h('div', { class: 'your-words-block' }, h('span', { class: 'small muted', text: t.prompt }), h('p', { class: 'your-words', text: t.text })))) : null),
      h('p', { class: 'small muted', text: 'Wayfinder offers Christian reflection, not therapy or medical care. If things feel heavy or unsafe, please talk with someone you trust, a pastor, or a professional.' }),
      h('div', { class: 'stack close-actions' },
        saveBtn,
        savedNote,
        btn('Return to journey choices', 'ghost', () => fadeThrough(showJourneys)),
        btn('Walk this journey again', 'ghost', () => fadeThrough(() => startJourney(J.id))),
        btn('Return Home', 'link', () => fadeThrough(showTitle))),
    ]);
    WF.voice.play('narrator', J.closing.hope);
  }

  /* =========================================================
   * My Reflections
   * ========================================================= */

  function reflectionText(r) {
    const lines = [`Wayfinder — ${r.journeyTitle} (${r.passage})`, new Date(r.date).toLocaleString(), ''];
    if (r.carrying) lines.push(`What I brought: ${r.carrying}`);
    lines.push(`The road: ${r.areas.join(' → ')}`);
    if (r.pages.length) lines.push(`Story pages: ${r.pages.join('; ')}`);
    lines.push(`Scripture: ${r.scripture.join('; ')}`);
    r.answers.forEach((a) => lines.push(`${a.prompt} — ${a.answer}`));
    r.texts.forEach((t) => lines.push(`${t.prompt}\n  “${t.text}”`));
    lines.push(r.next ? `Next step: ${r.next.label}${r.next.text ? ` — ${r.next.text}` : ''}` : 'Next step: none chosen');
    return lines.join('\n');
  }

  function showReflections() {
    const list = WF.reflections.all();
    const download = () => {
      const blob = new Blob([list.map(reflectionText).join('\n\n———\n\n')], { type: 'text/plain' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'wayfinder-reflections.txt' });
      document.body.append(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    };
    show('arrive', 'dawn', [
      h('p', { class: 'eyebrow', text: 'Private to this device' }),
      h('h2', { text: 'My Reflections' }),
      list.length ? h('p', { class: 'hint', text: 'These are stored only in this browser. Nobody else can see them, and they are never uploaded.' }) : h('p', { text: 'You haven’t saved any reflections yet.' }),
      list.map((r) => h('details', { class: 'reflection-item' },
        h('summary', {}, h('strong', { text: r.journeyTitle }), h('span', { class: 'muted small', text: new Date(r.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) })),
        h('pre', { class: 'reflection-text', text: reflectionText(r) }),
        btn('Delete this reflection', 'link danger', async () => {
          if (await ui.confirm('Delete this reflection?', 'This can’t be undone.', 'Delete')) { WF.reflections.remove(r.id); showReflections(); }
        }))),
      list.length ? h('div', { class: 'row' },
        btn('Download as a text file', 'ghost', download),
        btn('Delete all reflections', 'link danger', async () => {
          if (await ui.confirm('Delete all reflections?', 'This removes every saved reflection from this device. It can’t be undone.', 'Delete all')) { WF.reflections.clear(); showReflections(); }
        })) : null,
      h('div', { class: 'row' }, btn('Return home', 'primary', () => fadeThrough(showTitle))),
    ]);
  }

  /* =========================================================
   * Pause menu, settings, about, story pages
   * ========================================================= */

  function pauseWorld() { if (world) world.enabled = false; }
  function unpauseWorld() { if (world && !busy) world.enabled = true; }

  function openMenu() {
    if (ui.crisisOpen()) return;
    pauseWorld();
    const inJourney = !!S.journeyId && !['arrive', 'close'].includes(S.step);
    ui.openModal('Paused', [
      h('p', { class: 'hint', text: 'Take whatever time you need. Nothing here is timed.' }),
      h('div', { class: 'stack' },
        btn('Resume', 'primary', () => ui.closeModal()),
        S.journeyId && S.pages.length ? btn(`Story pages (${S.pages.length})`, 'ghost', openPages) : null,
        btn('Settings', 'ghost', openSettings),
        inJourney ? btn('Restart this journey', 'ghost', async () => {
          const id = S.journeyId;
          if (await ui.confirm('Restart this journey?', 'You’ll begin again from the first part of the road. Saved reflections are not affected.', 'Restart')) {
            clearProgress();
            fadeThrough(() => startJourney(id));
          } else unpauseWorld();
        }) : null,
        btn('Journey choices', 'ghost', async () => {
          if (!inJourney || await ui.confirm('Go to journey choices?', 'Your place in this journey is kept on this device from the start of the current part.', 'Journey choices')) fadeThrough(showJourneys);
          else unpauseWorld();
        }),
        S.step !== 'arrive' ? btn('Return home', 'ghost', async () => {
          const msg = inJourney ? 'Your place is kept on this device from the start of the current part, so you can continue later. Written answers are not kept unless you save a reflection at the end.' : 'Go back to the title screen?';
          if (await ui.confirm('Return home?', msg, 'Return home')) fadeThrough(showTitle);
          else unpauseWorld();
        }) : null,
        btn('About Wayfinder', 'link', openAbout)),
    ], { onClose: unpauseWorld });
  }

  function openPages() {
    const J = journey();
    pauseWorld();
    ui.openModal('Story pages', [
      h('p', { class: 'hint', text: `Pages you’ve found from ${J.passage}.` }),
      S.pages.map((id) => {
        const p = J.pages[id];
        return h('details', { class: 'page-item' },
          h('summary', {}, h('strong', { text: p.title }), h('span', { class: 'muted small', text: p.ref })),
          p.kjv ? h('blockquote', { text: p.kjv }) : null,
          h('p', {}, h('em', { text: 'Summary: ' }), p.summary),
          h('p', { class: 'muted' }, h('em', { text: 'Reflection: ' }), p.reflection));
      }),
    ], { onClose: unpauseWorld, wide: true });
  }

  function toggleRow(label, desc, key, onChange) {
    const sw = h('button', { class: 'switch', type: 'button', role: 'switch', 'aria-checked': String(!!WF.settings[key]) }, h('span', { class: 'knob' }));
    sw.addEventListener('click', () => {
      if (onChange) onChange();
      else { WF.settings[key] = !WF.settings[key]; WF.saveSettings(); applySettings(); }
      sw.setAttribute('aria-checked', String(!!WF.settings[key]));
    });
    return h('div', { class: 'setting' }, h('div', {}, h('strong', { text: label }), h('p', { class: 'small muted', text: desc })), sw);
  }

  function openSettings() {
    pauseWorld();
    ui.openModal('Settings', [
      toggleRow('Sound', 'Gentle generated ambience. Off by default; never sudden or loud. Shortcut: M.', 'sound', toggleSound),
      toggleRow('Voices', WF.voice.count()
        ? 'Narrator and character voices read each line aloud. Plays when Sound is on; the words always stay on screen.'
        : 'Narrator and character voices. No voice clips are installed in this copy yet, so this has no effect.', 'voice', () => {
        WF.settings.voice = !WF.settings.voice;
        if (!WF.settings.voice) WF.voice.stop();
        WF.saveSettings();
      }),
      toggleRow('Captions', 'Short descriptions of sounds and atmosphere.', 'captions'),
      toggleRow('Reduce motion', 'Stops drifting, swaying, shaking, and camera easing.', 'reducedMotion'),
      toggleRow('Larger text', 'Increases text size throughout.', 'largeText'),
      h('div', { class: 'setting danger-zone' },
        h('div', {}, h('strong', { text: 'Clear everything saved on this device' }), h('p', { class: 'small muted', text: 'Removes progress, settings, and saved reflections from this browser.' })),
        btn('Clear', 'ghost danger', async () => {
          if (await ui.confirm('Clear everything?', 'This removes your progress, settings, and all saved reflections from this device. It can’t be undone.', 'Clear everything')) {
            WF.store.clearAll();
            WF.settings.sound = false;
            WF.audio.setEnabled(false);
            applySettings();
            ui.toast('Everything saved on this device has been cleared.');
            if (S.step === 'arrive') showTitle();
          }
        })),
    ], { onClose: unpauseWorld });
  }

  function openAbout() {
    pauseWorld();
    ui.openModal('About Wayfinder', [
      h('p', { class: 'lead', text: 'Wayfinder: A Journey Through Life with God is a Christian, story-driven reflection game for older teens and adults moving through difficult or important seasons.' }),
      h('p', { text: 'You choose what you’re carrying, walk an imaginative story shaped by a biblical narrative, reflect on Scripture, and leave with a practical next step. It is centred on Jesus Christ and invites prayer, honest lament, Christian community, and the comfort of the Holy Spirit.' }),
      h('h3', { text: 'What Wayfinder is not' }),
      h('p', { text: WF.support.disclaimer }),
      h('p', { text: 'Nothing in Wayfinder claims to speak for God or to know what God is saying to you personally. If a thought or impression feels significant, test it against Scripture, pray about it, and talk it through with wise, trusted people.' }),
      h('h3', { text: 'Your privacy' }),
      h('p', { text: WF.support.privacy }),
      h('h3', { text: 'About the content' }),
      h('p', { text: 'Character and narrator voices, where installed, are pre-recorded clips made with Fish Audio from the same reviewed script. They are played from this device; nothing you do or write is sent to a voice service.' }),
      h('p', { text: 'All journey content is written and reviewed in advance; no AI generates spiritual advice, Scripture interpretation, or crisis responses. Scripture quotations are from the King James Version (public domain). Summaries and reflections are Wayfinder’s own and are always labelled as such.' }),
      h('div', { class: 'row' }, btn('Support options', 'ghost', () => { ui.closeModal(); ui.crisis({ reason: 'menu' }); })),
      h('p', { class: 'small muted', text: `Prototype v${WF.version}` }),
    ], { onClose: unpauseWorld });
  }

  async function openSupport() {
    pauseWorld();
    if (ui.modalOpen()) ui.closeModal();
    const r = await ui.crisis({ reason: 'menu' });
    if (r === 'home') { S.abort = true; fadeThrough(showTitle); return; }
    unpauseWorld();
  }

  /* =========================================================
   * Input
   * ========================================================= */

  const keys = { left: false, right: false };
  function syncKeys() { if (world) world.setKeyDir((keys.right ? 1 : 0) - (keys.left ? 1 : 0)); }

  function onKeyDown(e) {
    if (ui.crisisOpen()) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ui.modalOpen()) ui.closeModal();
      else if (S.step !== 'arrive' || S.journeyId) openMenu();
      return;
    }
    if (ui.modalOpen()) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'input') return;
    if (e.key === 'm' || e.key === 'M') { toggleSound(); return; }
    if ((e.key === 'p' || e.key === 'P') && world) { openMenu(); return; }
    if (!world || busy || !$('dialog').hidden) return;
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') { keys.left = true; syncKeys(); e.preventDefault(); }
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') { keys.right = true; syncKeys(); e.preventDefault(); }
    else if (k === ' ' || k === 'Enter' || k === 'e' || k === 'E' || k === 'ArrowUp') {
      if ((k === ' ' || k === 'Enter') && e.target.closest && e.target.closest('button, a, summary')) return;
      e.preventDefault();
      world.interactNear();
    }
  }
  function onKeyUp(e) {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') keys.left = false;
    if (k === 'ArrowRight' || k === 'd' || k === 'D') keys.right = false;
    syncKeys();
  }

  function bindHold(el, dir) {
    const down = (e) => {
      if (!world) return;
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* not supported */ }
      el.classList.add('held');
      world.setBtnDir(dir);
    };
    const up = () => { el.classList.remove('held'); if (world) world.setBtnDir(0); };
    el.addEventListener('pointerdown', down);
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => el.addEventListener(t, up));
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    // Keyboard activation (Enter/Space on the focused button) takes a short step.
    el.addEventListener('click', (e) => {
      if (e.detail === 0 && world && world.enabled) world.target = WF.clamp(world.x + dir * 140, 40, world.W - 40);
    });
  }

  function init() {
    WF.art.installDefs();
    applySettings();
    // Browsers only allow audio after a gesture.
    const wake = () => { if (WF.settings.sound) WF.audio.setEnabled(true); window.removeEventListener('pointerdown', wake); window.removeEventListener('keydown', wake); };
    window.addEventListener('pointerdown', wake);
    window.addEventListener('keydown', wake);

    $('btn-sound').addEventListener('click', toggleSound);
    $('btn-support').addEventListener('click', openSupport);
    $('btn-menu').addEventListener('click', openMenu);
    $('btn-home').addEventListener('click', async () => {
      if (S.step === 'arrive' && !S.journeyId) { showTitle(); return; }
      pauseWorld();
      if (await ui.confirm('Return home?', 'Your place in a journey is kept on this device from the start of the current part. Written answers are only kept if you save a reflection.', 'Return home')) fadeThrough(showTitle);
      else unpauseWorld();
    });
    $('modal').addEventListener('click', (e) => { if (e.target === $('modal')) ui.closeModal(); });

    bindHold($('ctrl-left'), -1);
    bindHold($('ctrl-right'), 1);
    $('ctrl-act').addEventListener('click', () => { if (world) world.interactNear(); });

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', () => { keys.left = keys.right = false; syncKeys(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { keys.left = keys.right = false; syncKeys(); } });

    showTitle();
  }

  // Exposed for debugging and automated play-testing only.
  WF.debug = {
    get state() { return S; },
    get world() { return world; },
    /** Jump straight to an area, e.g. Wayfinder.debug.goto('gideon', 2). For authoring and testing. */
    goto(journeyId, areaIndex = 0) {
      S = fresh({ journeyId });
      ui.speakers = journey().speakers || {};
      enterArea(areaIndex);
    },
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
