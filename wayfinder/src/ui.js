/* Wayfinder — shared UI pieces: dialogue, story pages, choices, rest and stillness moments,
 * modals, captions, toasts, and the crisis-support panel. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const { h } = WF;
  const $ = (id) => document.getElementById(id);

  const DEFAULT_SPEAKERS = {
    narrator: { name: null },
    note: { name: 'From Wayfinder', cls: 'note' },
  };

  const ui = {
    speakers: {},
    world: null, // set by main.js while an area is active
  };

  function speaker(id) {
    return ui.speakers[id] || DEFAULT_SPEAKERS[id] || { name: id };
  }

  /* ---------- captions & toasts ---------- */

  let captionTimer = 0;
  ui.caption = (text) => {
    if (!text || !WF.settings.captions) return;
    const el = $('captions');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(captionTimer);
    captionTimer = setTimeout(() => el.classList.remove('show'), 4800);
  };

  let toastTimer = 0;
  ui.toast = (text, ms = 2800) => {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), ms);
  };

  /* ---------- dialogue ---------- */

  function openDialog(card, focusSel) {
    const dlg = $('dialog');
    dlg.replaceChildren(card);
    dlg.hidden = false;
    document.body.classList.add('dialog-open');
    requestAnimationFrame(() => {
      const target = card.querySelector(focusSel || '.btn.primary, .choice, textarea');
      if (target) target.focus({ preventScroll: true });
    });
  }

  function closeDialog() {
    WF.voice.stop();
    const dlg = $('dialog');
    dlg.hidden = true;
    dlg.replaceChildren();
    dlg.className = 'dialog';
    document.body.classList.remove('dialog-open');
  }
  ui.closeDialog = closeDialog;

  function speakerHead(id) {
    const s = speaker(id);
    if (!s.name) return null;
    return h('div', { class: 'speaker' }, h('span', { class: 'speaker-name', text: s.name }), s.note ? h('span', { class: 'speaker-note', text: s.note }) : null);
  }

  /** A line of narration or speech. */
  ui.say = ({ speaker: who = 'narrator', text, label }) => new Promise((resolve) => {
    const s = speaker(who);
    const btn = h('button', { class: 'btn primary', type: 'button', text: 'Continue' });
    const card = h('div', { class: `dialog-card speaker-${who} ${s.cls || ''}` },
      speakerHead(who),
      label ? h('div', { class: 'dialog-label', text: label }) : null,
      h('div', { class: 'dialog-text' }, WF.paras(text)),
      h('div', { class: 'dialog-actions' }, btn));
    btn.addEventListener('click', () => { closeDialog(); resolve(); });
    openDialog(card);
    WF.voice.play(who, text);
  });

  /** A story page: Scripture (KJV), a labelled summary, and a labelled reflection. */
  ui.page = (page, { found = true } = {}) => new Promise((resolve) => {
    const btn = h('button', { class: 'btn primary', type: 'button', text: found ? 'Keep the page' : 'Close' });
    const card = h('article', { class: 'dialog-card page-card', 'aria-labelledby': 'page-title' },
      h('div', { class: 'page-eyebrow', text: found ? `Story page found · ${page.ref}` : page.ref }),
      h('h2', { id: 'page-title', class: 'page-title', text: page.title }),
      page.kjv ? h('section', { class: 'page-block scripture' },
        h('div', { class: 'block-label', text: `Scripture · ${page.kjvRef || page.ref} (KJV)` }),
        h('blockquote', { text: page.kjv })) : null,
      h('section', { class: 'page-block' },
        h('div', { class: 'block-label', text: 'What happens — Wayfinder’s summary' }),
        h('p', { text: page.summary })),
      page.reflection ? h('section', { class: 'page-block reflection' },
        h('div', { class: 'block-label', text: 'Reflection' }),
        h('p', { text: page.reflection })) : null,
      h('div', { class: 'dialog-actions' }, btn));
    btn.addEventListener('click', () => { closeDialog(); resolve(); });
    $('dialog').className = 'dialog is-page';
    openDialog(card);
    WF.voice.play('page', WF.voice.pageText(page));
  });

  /** A choice. Resolves { option, value, label, text } or { option: null } when skipped. */
  ui.choice = (c) => new Promise((resolve) => {
    const skippable = !!c.key && !c.noSkip && !c.options.some((o) => o.end);
    const selectMode = !!c.allowText;
    let selected = null;
    let textarea = null;
    const finish = (option) => {
      const text = textarea ? textarea.value.trim() : '';
      closeDialog();
      resolve({ option, value: option ? option.value : null, label: option ? option.label : null, text });
    };
    const optionBtns = c.options.map((o) => {
      const b = h('button', { class: 'choice', type: 'button', text: o.label, 'aria-pressed': selectMode ? 'false' : null });
      b.addEventListener('click', () => {
        if (!selectMode) return finish(o);
        selected = selected === o ? null : o;
        optionBtns.forEach((ob, i) => ob.setAttribute('aria-pressed', String(c.options[i] === selected)));
      });
      return b;
    });
    const actions = [];
    if (selectMode) {
      textarea = h('textarea', { class: 'free-text', rows: '2', maxlength: '600', placeholder: c.placeholder || 'In your own words (optional)', 'aria-label': c.placeholder || 'Your own words (optional)' });
      actions.push(h('button', { class: 'btn primary', type: 'button', text: 'Continue', onclick: () => finish(selected) }));
    }
    if (skippable) actions.push(h('button', { class: 'btn ghost', type: 'button', text: 'Skip', onclick: () => finish(null) }));
    const card = h('div', { class: `dialog-card choice-card speaker-${c.speaker || 'narrator'}` },
      speakerHead(c.speaker || 'narrator'),
      h('p', { class: 'choice-prompt', text: c.prompt }),
      c.hint ? h('p', { class: 'hint', text: c.hint }) : null,
      h('div', { class: 'choices', role: 'group', 'aria-label': c.prompt }, optionBtns),
      textarea,
      actions.length ? h('div', { class: 'dialog-actions' }, actions) : null);
    openDialog(card, '.choice');
    WF.voice.play(c.speaker || 'narrator', c.prompt);
  });

  /* ---------- rest, storm, stillness ---------- */

  ui.rest = ({ text, caption }) => new Promise((resolve) => {
    const veil = $('veil');
    const wake = h('button', { class: 'btn ghost wake', type: 'button', text: 'Wake' });
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(auto);
      WF.voice.stop();
      veil.classList.remove('show');
      setTimeout(() => { veil.hidden = true; veil.replaceChildren(); resolve(); }, WF.settings.reducedMotion ? 0 : 900);
    };
    wake.addEventListener('click', finish);
    veil.replaceChildren(h('div', { class: 'veil-inner rest' },
      h('div', { class: 'stars-soft', 'aria-hidden': 'true' }),
      h('p', { class: 'veil-text', text }),
      h('p', { class: 'veil-sub', text: 'Rest…' }),
      wake));
    veil.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('show')));
    ui.caption(caption);
    WF.audio.event('hush');
    WF.voice.play('narrator', text);
    setTimeout(() => { wake.classList.add('ready'); wake.focus({ preventScroll: true }); }, 1800);
    const auto = setTimeout(finish, 7000);
  });

  ui.storm = async (phases) => {
    for (const p of phases) {
      if (ui.world) ui.world.fx(p.fx, true);
      WF.audio.event(p.sound);
      ui.caption(p.caption);
      await ui.say({ speaker: 'narrator', text: p.text, label: p.label || '1 Kings 19:11–12 · retold' });
      if (ui.world) ui.world.fx(p.fx, false);
    }
  };

  ui.stillness = ({ text, seconds = 8, caption, doneText = '…and after the fire, a still small voice.' }) => new Promise((resolve) => {
    const veil = $('veil');
    const C = 2 * Math.PI * 52;
    const ring = h('div', { class: 'ring', 'aria-hidden': 'true', html: `<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="ring-track"/><circle cx="60" cy="60" r="52" class="ring-fill" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>` });
    const status = h('p', { class: 'veil-sub', text: 'Be still for a few breaths. Rest your hands — the circle fills on its own.' });
    const skip = h('button', { class: 'btn ghost', type: 'button', text: 'Skip the stillness' });
    const progress = h('div', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });
    veil.replaceChildren(h('div', { class: 'veil-inner stillness' }, h('p', { class: 'veil-text', text }), ring, status, progress, skip));
    veil.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add('show')));
    ui.caption(caption);
    WF.audio.event('hush');
    WF.voice.play('narrator', text);
    let t = 0;
    let moving = false;
    let last = performance.now();
    let raf = 0;
    let done = false;
    const onKey = (e) => {
      if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) {
        moving = e.type === 'keydown';
        if (moving) status.textContent = 'That’s alright. Take your time.';
      }
    };
    const finish = () => {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
      veil.classList.remove('show');
      setTimeout(() => { veil.hidden = true; veil.replaceChildren(); resolve(); }, WF.settings.reducedMotion ? 0 : 900);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    skip.addEventListener('click', finish);
    const tick = (now) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      if (!moving && !document.hidden) t += dt;
      const p = Math.min(1, t / seconds);
      ring.querySelector('.ring-fill').setAttribute('stroke-dashoffset', String(C * (1 - p)));
      if (p >= 1) {
        status.textContent = doneText;
        progress.textContent = 'The stillness is complete.';
        skip.textContent = 'Continue';
        skip.classList.replace('ghost', 'primary');
        skip.focus({ preventScroll: true });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });

  /* ---------- reusable choice block for full screens ---------- */

  ui.choiceBlock = (q) => {
    const chosen = new Set();
    const btns = q.options.map((o) => {
      const b = h('button', { class: 'choice', type: 'button', 'aria-pressed': 'false', text: o.label });
      b.addEventListener('click', () => {
        if (q.multi) {
          if (chosen.has(o)) chosen.delete(o); else chosen.add(o);
        } else {
          const was = chosen.has(o);
          chosen.clear();
          if (!was) chosen.add(o);
        }
        btns.forEach((bb, i) => bb.setAttribute('aria-pressed', String(chosen.has(q.options[i]))));
      });
      return b;
    });
    const textarea = q.allowText ? h('textarea', { class: 'free-text', rows: '3', maxlength: '800', placeholder: q.placeholder || 'In your own words (optional)', 'aria-label': q.placeholder || 'Your own words (optional)' }) : null;
    const el = h('fieldset', { class: 'question' },
      h('legend', { text: q.prompt }),
      h('p', { class: 'hint', text: q.multi ? 'Choose any that fit, or none.' : 'Choose one, or none.' }),
      h('div', { class: 'choices' }, btns),
      textarea);
    return {
      el,
      value: () => ({
        values: [...chosen].map((o) => o.value),
        labels: [...chosen].map((o) => o.label),
        text: textarea ? textarea.value.trim() : '',
      }),
    };
  };

  /* ---------- modal ---------- */

  let modalReturn = null;
  let modalClose = null;
  ui.openModal = (title, body, { onClose, wide } = {}) => {
    const modal = $('modal');
    const card = $('modal-card');
    if (!modal.hidden && modalClose) { const fn = modalClose; modalClose = null; fn(); }
    modalReturn = modalReturn || document.activeElement;
    modalClose = onClose || null;
    card.className = `modal-card${wide ? ' wide' : ''}`;
    card.replaceChildren(
      h('div', { class: 'modal-head' },
        h('h2', { id: 'modal-title', text: title }),
        h('button', { class: 'icon-btn close', type: 'button', 'aria-label': 'Close', html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>', onclick: () => ui.closeModal() })),
      h('div', { class: 'modal-body' }, body));
    modal.hidden = false;
    card.scrollTop = 0;
    requestAnimationFrame(() => {
      const target = card.querySelector('.modal-body button, .modal-body a, .modal-body input') || card.querySelector('.close');
      if (target) target.focus({ preventScroll: true });
    });
  };
  ui.closeModal = () => {
    const modal = $('modal');
    if (modal.hidden) return;
    modal.hidden = true;
    $('modal-card').replaceChildren();
    const fn = modalClose;
    modalClose = null;
    if (fn) fn();
    if (modalReturn && document.contains(modalReturn)) modalReturn.focus({ preventScroll: true });
    modalReturn = null;
  };
  ui.modalOpen = () => !$('modal').hidden;

  ui.confirm = (title, text, yes, no = 'Cancel') => new Promise((resolve) => {
    let answered = false;
    const answer = (v) => { answered = true; ui.closeModal(); resolve(v); };
    ui.openModal(title, [
      ...WF.paras(text),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', type: 'button', text: yes, onclick: () => answer(true) }),
        h('button', { class: 'btn ghost', type: 'button', text: no, onclick: () => answer(false) })),
    ], { onClose: () => { if (!answered) resolve(false); } });
  });

  /* ---------- crisis support ---------- */

  let crisisResolve = null;
  ui.crisisOpen = () => !$('crisis').hidden;

  /** Pause everything and show a calm, prominent path to real help. Resolves 'continue' or 'home'. */
  ui.crisis = ({ reason } = {}) => new Promise((resolve) => {
    const S = WF.support;
    const wrap = $('crisis');
    const card = $('crisis-card');
    crisisResolve = resolve;
    const close = (result) => {
      wrap.hidden = true;
      card.replaceChildren();
      document.body.classList.remove('crisis-open');
      const r = crisisResolve;
      crisisResolve = null;
      if (r) r(result);
    };
    const copy = {
      text: ['Let’s pause for a moment.', 'Something you wrote sounds like you might be in a lot of pain, or not safe. Your safety matters far more than finishing this.', 'I’m safe right now — return to Wayfinder'],
      menu: ['Support is here', 'If you’re struggling, you don’t have to handle it alone. The journey is paused while you look at this.', 'Return to Wayfinder'],
      choice: ['Let’s pause the journey.', 'Your safety matters far more than finishing this. Thank you for saying so.', 'I’m safe right now — return to Wayfinder'],
    }[reason || 'choice'];
    card.replaceChildren(
      h('div', { class: 'crisis-mark', 'aria-hidden': 'true', html: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/></svg>' }),
      h('h2', { id: 'crisis-title', text: copy[0] }),
      h('p', { class: 'lead', text: copy[1] }),
      h('p', { text: 'Wayfinder is a tool for reflection. It can’t keep you safe or respond in an emergency — but people can, right now.' }),
      h('section', { class: 'crisis-block urgent' },
        h('h3', { text: 'If you are in immediate danger' }),
        h('p', { text: S.emergency })),
      h('section', { class: 'crisis-block' },
        h('h3', { text: 'Talk to someone now — free and confidential' }),
        h('ul', { class: 'lines' }, S.lines.map((l) => h('li', {},
          h('span', { class: 'region', text: l.region }),
          h('a', { href: l.href, target: l.href.startsWith('http') ? '_blank' : null, rel: 'noopener', text: l.text }))))),
      h('section', { class: 'crisis-block' },
        h('h3', { text: 'Reach out to someone you trust' }),
        h('p', { text: S.trusted })),
      h('p', { class: 'crisis-prayer', text: S.prayer }),
      h('div', { class: 'row' },
        h('button', { class: 'btn primary', type: 'button', text: copy[2], onclick: () => close('continue') }),
        h('button', { class: 'btn ghost', type: 'button', text: 'Leave the journey and go home', onclick: () => close('home') })));
    wrap.hidden = false;
    document.body.classList.add('crisis-open');
    card.scrollTop = 0;
    requestAnimationFrame(() => {
      const title = card.querySelector('h2');
      title.tabIndex = -1;
      title.focus({ preventScroll: true });
    });
  });

  WF.ui = ui;
})();
