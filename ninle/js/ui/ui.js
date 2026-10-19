/* Everything on top of the game world: title screen, HUD, dialogue box,
   pause menu, storybook reflection, celebration and sticker book. */
(function (N) {
  'use strict';
  const $ = id => document.getElementById(id);
  const UI = N.ui = {};
  let game, dlgMode = null, onNext = null, onPick = null, curText = '', typing = null, typingFull = '';
  let refl = null, reflIdx = 0, reflDone = null, hintTimer = null;

  UI.init = function (g, handlers) {
    game = g;
    UI.h = handlers;
    buildAvatars();
    $('btnStart').addEventListener('click', () => handlers.start());
    $('btnBookTitle').addEventListener('click', () => UI.showBook());
    $('btnSoundTitle').addEventListener('click', () => handlers.toggleSound());
    $('btnReadTitle').addEventListener('click', () => handlers.toggleRead());

    $('btnHint').addEventListener('click', () => game.showHint());
    $('btnSound').addEventListener('click', () => handlers.toggleSound());
    $('btnPause').addEventListener('click', () => UI.openPause());
    $('btnAction').addEventListener('click', () => game.action());
    // In a run, the big button jumps the moment it is pressed (not on release)
    $('btnAction').addEventListener('pointerdown', e => {
      if (game.mode === 'platform' && game.runner && !game.story.active && !game.paused) { game.runner.jumpDown(); e.preventDefault(); }
    });
    const jumpRelease = () => { if (game.runner) game.runner.jumpUp(); };
    $('btnAction').addEventListener('pointerup', jumpRelease);
    $('btnAction').addEventListener('pointercancel', jumpRelease);
    $('btnLeaveRun').addEventListener('click', () => { hide('pause'); game.paused = false; game.endRun(false); });

    $('dlgNext').addEventListener('click', () => UI.next());
    $('dlgSpeak').addEventListener('click', () => N.speech.say(curText));
    $('dlgText').addEventListener('click', () => UI.next());
    $('portrait').addEventListener('click', () => UI.next());

    $('btnResume').addEventListener('click', () => UI.closePause());
    $('btnRestart').addEventListener('click', () => { hide('pause'); show('confirm'); $('btnConfirmNo').focus(); });
    $('btnConfirmNo').addEventListener('click', () => { hide('confirm'); UI.openPause(); });
    $('btnConfirmYes').addEventListener('click', () => { hide('confirm'); game.paused = false; handlers.restart(); });
    $('btnBook').addEventListener('click', () => { hide('pause'); UI.showBook(() => UI.openPause()); });
    $('btnSoundP').addEventListener('click', () => handlers.toggleSound());
    $('btnReadP').addEventListener('click', () => handlers.toggleRead());
    $('btnCalm').addEventListener('click', () => handlers.toggleCalm());
    $('btnHome').addEventListener('click', () => { hide('pause'); game.paused = false; handlers.home(); });

    $('storyBack').addEventListener('click', () => UI.reflPage(reflIdx - 1));
    $('storyNext').addEventListener('click', () => UI.reflPage(reflIdx + 1));
    $('storySpeak').addEventListener('click', () => N.speech.say(pageSpeech()));

    $('btnPlayAgain').addEventListener('click', () => handlers.restart());
    $('btnExplore').addEventListener('click', () => handlers.keepExploring());
    $('btnBookEnd').addEventListener('click', () => UI.showBook());
    $('btnBookClose').addEventListener('click', () => UI.closeBook());
    UI.syncToggles();
  };

  function show(id) { $(id).classList.remove('hidden'); }
  function hide(id) { $(id).classList.add('hidden'); }
  UI.show = show; UI.hide = hide;

  UI.screen = function (name) {
    ['screen-title', 'screen-end'].forEach(s => $(s).classList.toggle('active', s === 'screen-' + name));
    const inGame = name === 'game';
    $('hud').classList.toggle('hidden', !inGame);
    $('controls').classList.toggle('hidden', !inGame);
    if (!inGame) { hide('dialogue'); hide('controlsHint'); }
    if (name === 'title') { buildAvatars(); setTimeout(() => $('btnStart').focus({ preventScroll: true }), 50); }
  };

  UI.blocking = function () {
    return ['pause', 'confirm', 'reflection', 'book'].some(id => !$(id).classList.contains('hidden')) || $('screen-end').classList.contains('active');
  };
  UI.modalOpen = UI.blocking;

  /* ---------- explorer picker ---------- */
  function buildAvatars() {
    const box = $('avatars'); box.innerHTML = '';
    const wear = Object.assign({}, N.save.data.wear);
    for (const k in wear) if (!N.save.data.costumes[k]) delete wear[k];
    N.avatars.forEach((av, i) => {
      const b = document.createElement('button');
      b.className = 'avatar'; b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(N.save.data.avatar === i));
      b.setAttribute('aria-label', 'Explorer ' + av.label);
      const cv = document.createElement('canvas'); cv.width = 152; cv.height = 172;
      const c = cv.getContext('2d');
      c.scale(2, 2); c.translate(38, 80); c.scale(1.55, 1.55);
      N.art.drawPlayer(c, 0, 0, { avatar: av, t: 0, face: 'down', wear, calm: true });
      b.appendChild(cv);
      b.addEventListener('click', () => {
        N.save.set('avatar', i);
        box.querySelectorAll('.avatar').forEach((x, j) => x.setAttribute('aria-checked', String(j === i)));
        N.audio.init(); N.audio.play('choose');
      });
      box.appendChild(b);
    });
  }
  UI.buildAvatars = buildAvatars;

  UI.syncToggles = function () {
    const d = N.save.data;
    const setT = (id, on, label) => { const b = $(id); b.setAttribute('aria-pressed', String(on)); b.textContent = label + (on ? 'On' : 'Off'); };
    setT('btnSoundTitle', d.sound, 'Sound: '); setT('btnSoundP', d.sound, 'Sound: ');
    setT('btnReadTitle', d.readAloud, 'Read to me: '); setT('btnReadP', d.readAloud, 'Read to me: ');
    setT('btnCalm', N.save.calm(), 'Calm motion: ');
    $('btnSound').setAttribute('aria-pressed', String(d.sound));
    $('btnSound').setAttribute('aria-label', d.sound ? 'Sound on. Turn sound off' : 'Sound off. Turn sound on');
    $('soundWaves').style.display = d.sound ? '' : 'none';
    $('soundOff').style.display = d.sound ? 'none' : '';
    document.body.classList.toggle('calm', N.save.calm());
    if (!N.speech.available) { $('btnReadTitle').classList.add('hidden'); $('btnReadP').classList.add('hidden'); $('dlgSpeak').classList.add('hidden'); $('storySpeak').classList.add('hidden'); }
  };

  /* ---------- HUD ---------- */
  let lastGoal = '';
  UI.updateHud = function (h) {
    document.querySelectorAll('#sparkBox .spark-slot').forEach((s, i) => s.classList.toggle('on', i < h.sparks));
    $('sparkText').textContent = h.sparks + ' of 3 sparks';
    $('starCount').textContent = h.stars + '/' + h.starTotal;
    $('starBox').setAttribute('aria-label', 'Wonder Stars: ' + h.stars + ' of ' + h.starTotal);
    if (h.goal !== lastGoal) {
      const g = $('goal'); g.textContent = h.goal; lastGoal = h.goal;
      g.classList.remove('pulse'); void g.offsetWidth; g.classList.add('pulse');
    }
  };
  UI.pulseSparks = function () { const b = $('sparkBox'); b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); };
  UI.setAction = function (label) {
    if (game && game.mode === 'platform') return;
    const b = $('btnAction');
    b.classList.toggle('ready', !!label);
    $('actionLabel').textContent = label || 'Talk';
    b.setAttribute('aria-label', label ? label + ' (Space)' : 'Nobody nearby to talk to');
  };
  UI.setActionMode = function (mode) {
    const jump = mode === 'jump';
    $('actionIco').textContent = jump ? '⤒' : '✋';
    $('actionLabel').textContent = jump ? 'Jump' : 'Talk';
    $('btnAction').classList.toggle('ready', jump);
    $('btnAction').setAttribute('aria-label', jump ? 'Jump (Space)' : 'Nobody nearby to talk to');
  };
  UI.hideHudForCutscene = function (on) {
    $('hud').classList.toggle('hidden', on);
    $('controls').classList.toggle('hidden', on);
  };
  UI.showControlsHint = function () {
    const h = $('controlsHint'); h.classList.remove('hidden', 'fade');
    clearTimeout(hintTimer); hintTimer = setTimeout(UI.hideControlsHint, 15000);
  };
  UI.hideControlsHint = function () {
    const h = $('controlsHint'); if (h.classList.contains('hidden') || h.classList.contains('fade')) return;
    h.classList.add('fade'); setTimeout(() => h.classList.add('hidden'), 700);
  };

  /* ---------- toasts ---------- */
  UI.toast = function (html, opts) {
    const box = $('toasts');
    while (box.children.length >= 3) box.firstChild.remove();
    const t = document.createElement('div');
    t.className = 'toast' + (opts && opts.big ? ' big' : '');
    t.innerHTML = html;
    box.appendChild(t);
    setTimeout(() => t.remove(), 3100);
  };
  UI.stickerToast = function (st, isNew) {
    UI.toast(`<img src="${N.art.stickerURL(st)}" alt=""><span>Sticker: <b>${st.name}</b>${isNew ? ' — new!' : ''}</span>`, { big: true });
  };

  /* ---------- dialogue ---------- */
  function drawPortrait(who) {
    const cv = $('portrait'), c = cv.getContext('2d');
    c.clearRect(0, 0, cv.width, cv.height);
    c.drawImage(game.portraitFor(who), 0, 0, cv.width, cv.height);
  }
  function stopTyping() { if (typing) { clearInterval(typing); typing = null; } }
  UI.showLine = function (who, text, next) {
    stopTyping();
    dlgMode = 'line'; onNext = next; curText = text;
    const d = $('dialogue'); show('dialogue'); d.classList.remove('choosing');
    const ch = N.characters[who] || N.characters.ninle;
    $('dlgName').textContent = ch.name;
    drawPortrait(who);
    $('dlgChoices').innerHTML = '';
    const el = $('dlgText');
    if (N.save.calm()) el.textContent = text;
    else {
      typingFull = text; let i = 0; el.textContent = '';
      typing = setInterval(() => { i += 2; el.textContent = text.slice(0, i); if (i >= text.length) stopTyping(); }, 22);
    }
    N.audio.play('blip');
    if (N.save.data.readAloud) N.speech.say(text);
  };
  UI.next = function () {
    if (dlgMode !== 'line') return;
    if (typing) { stopTyping(); $('dlgText').textContent = typingFull; return; }
    N.audio.play('next');
    const f = onNext; onNext = null; dlgMode = null;
    if (f) f();
  };
  UI.showChoices = function (list, pick) {
    stopTyping();
    dlgMode = 'choose'; onPick = pick;
    const d = $('dialogue'); show('dialogue'); d.classList.add('choosing');
    $('dlgName').textContent = 'You';
    drawPortrait('player');
    curText = 'What will you do? ' + list.map((c, i) => 'Choice ' + (i + 1) + ': ' + c.text).join('. ');
    $('dlgText').textContent = 'What will you do?';
    const box = $('dlgChoices'); box.innerHTML = '';
    list.forEach((c, i) => {
      const b = document.createElement('button');
      b.className = 'btn choice';
      b.innerHTML = `<span class="num" aria-hidden="true">${i + 1}</span><span aria-hidden="true">${c.icon || ''}</span><span>${c.text}</span>`;
      b.addEventListener('click', () => UI.pick(i));
      box.appendChild(b);
    });
    setTimeout(() => { const f = box.querySelector('button'); if (f) f.focus({ preventScroll: true }); }, 30);
    if (N.save.data.readAloud) N.speech.say(curText);
  };
  UI.pick = function (i) {
    if (dlgMode !== 'choose') return;
    const btns = $('dlgChoices').querySelectorAll('button');
    if (i < 0 || i >= btns.length) return;
    dlgMode = null;
    const f = onPick; onPick = null;
    $('dlgChoices').innerHTML = '';
    if (document.activeElement) document.activeElement.blur();
    f(i);
  };
  UI.moveChoiceFocus = function (dir) {
    const btns = Array.from($('dlgChoices').querySelectorAll('button'));
    if (!btns.length) return;
    let i = btns.indexOf(document.activeElement);
    i = (i + dir + btns.length) % btns.length;
    btns[i].focus();
  };
  UI.dialogueMode = () => dlgMode;
  UI.hideDialogue = function () { stopTyping(); dlgMode = null; hide('dialogue'); };

  /* ---------- pause ---------- */
  UI.openPause = function () {
    if ((game.mode !== 'play' && game.mode !== 'platform') || UI.blocking()) return;
    game.paused = true; N.input.clear();
    $('btnLeaveRun').classList.toggle('hidden', game.mode !== 'platform');
    UI.syncToggles(); show('pause');
    $('btnResume').focus({ preventScroll: true });
  };
  UI.closePause = function () { hide('pause'); game.paused = false; };
  UI.isPaused = () => !$('pause').classList.contains('hidden') || !$('confirm').classList.contains('hidden');

  /* ---------- storybook reflection ---------- */
  UI.showReflection = function (r, done) {
    refl = r; reflDone = done; reflIdx = 0;
    show('reflection');
    UI.reflPage(0);
  };
  function helpedList() {
    return (refl.helped || []).filter(h => game.story.check(h.if));
  }
  function pageSpeech() {
    const p = refl.pages[reflIdx];
    let s = p.title + '. ' + (p.text || []).join(' ');
    if (p.type === 'helped') s += ' You helped ' + helpedList().map(h => h.name).join(', ') + '. ' + (p.after || []).join(' ');
    if (p.prayer) s += ' ' + p.prayer;
    if (p.question) s += ' ' + p.question;
    return s;
  }
  UI.reflPage = function (i) {
    if (!refl) return;
    if (i < 0) return;
    if (i >= refl.pages.length) {
      hide('reflection'); N.speech.stop();
      const d = reflDone; refl = null; reflDone = null;
      if (d) d();
      return;
    }
    reflIdx = i;
    const p = refl.pages[i];
    $('storyArt').innerHTML = N.storyArt[p.art] || '';
    $('storyRef').textContent = p.ref || '';
    $('storyTitle').textContent = p.title;
    let html = (p.text || []).map(t => `<p>${t}</p>`).join('');
    if (p.type === 'helped') {
      html += '<div class="helped">' + helpedList().map(h =>
        `<figure><img alt="" src="${N.art.portrait(h.char, Object.assign({ mood: 'happy' }, h.opts || {})).toDataURL()}"><figcaption>${h.name}</figcaption></figure>`).join('') + '</div>';
      html += (p.after || []).map(t => `<p>${t}</p>`).join('');
    }
    if (p.prayer) html += `<p class="prayer">${p.prayer}</p>`;
    if (p.question) html += `<p><b>${p.question}</b></p>`;
    $('storyText').innerHTML = html;
    $('storyDots').innerHTML = refl.pages.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('');
    $('storyBack').style.visibility = i === 0 ? 'hidden' : 'visible';
    $('storyNext').textContent = i === refl.pages.length - 1 ? 'Finish ★' : 'Next ▶';
    $('storyNext').focus({ preventScroll: true });
    $('reflection').scrollTop = 0;
    N.audio.play('next');
    if (N.save.data.readAloud) N.speech.say(pageSpeech());
  };
  UI.reflOpen = () => !!refl;

  /* ---------- celebration ---------- */
  UI.showEnding = function (d) {
    const box = $('rewards'); box.innerHTML = '';
    let k = 0;
    const add = (inner, label) => {
      const r = document.createElement('div'); r.className = 'reward'; r.style.animationDelay = (k++ * 0.12) + 's';
      r.innerHTML = inner + `<span>${label}</span>`; box.appendChild(r);
    };
    d.stickers.forEach(id => { const st = N.stickerById(id); add(`<img alt="" src="${N.art.stickerURL(st)}">`, st.name); });
    d.costumes.forEach(id => {
      const pc = N.art.portrait('player', { avatar: N.avatars[N.save.data.avatar], avatarIndex: N.save.data.avatar, wear: { [id]: true } });
      add(`<img alt="" style="border-radius:50%;border:4px solid #2f2342" src="${pc.toDataURL()}">`, 'New: ' + N.costumes[id].name);
    });
    add(`<div class="big-num"><span style="color:#ffbf1f">★</span>${d.stars}/${d.starTotal}</div>`, 'Wonder Stars');
    $('endSecret').textContent = d.secret;
    UI.screen('end');
    game.celebrate && game.celebrate();
    setTimeout(() => $('btnPlayAgain').focus({ preventScroll: true }), 100);
  };

  /* ---------- sticker book ---------- */
  let bookDone = null;
  UI.showBook = function (done) {
    bookDone = done || null;
    const grid = $('stickerGrid'); grid.innerHTML = '';
    N.stickers.forEach(st => {
      const have = !!N.save.data.stickers[st.id];
      const d = document.createElement('div'); d.className = 'sticker' + (have ? '' : ' missing');
      d.innerHTML = `<img alt="" src="${N.art.stickerURL(st)}"><span>${have ? st.name : '???'}</span><small>${have ? '' : st.hint}</small>`;
      grid.appendChild(d);
    });
    const cs = $('costumes'); cs.innerHTML = '';
    Object.keys(N.costumes).forEach(id => {
      if (!N.save.data.costumes[id]) return;
      const on = !!N.save.data.wear[id];
      const b = document.createElement('button'); b.className = 'btn toggle';
      b.setAttribute('aria-pressed', String(on));
      b.textContent = (on ? 'Wearing: ' : 'Wear: ') + N.costumes[id].name;
      b.addEventListener('click', () => { N.save.data.wear[id] = !N.save.data.wear[id]; N.save.write(); UI.showBook(bookDone); buildAvatars(); });
      cs.appendChild(b);
    });
    show('book');
    $('btnBookClose').focus({ preventScroll: true });
  };
  UI.closeBook = function () {
    hide('book');
    const d = bookDone; bookDone = null;
    if (d) d();
  };
  UI.bookOpen = () => !$('book').classList.contains('hidden');

  UI.fade = function (fn) {
    const f = $('fade');
    if (N.save.calm()) { fn(); return; }
    f.classList.add('on');
    setTimeout(() => { fn(); f.classList.remove('on'); }, 450);
  };
})(window.Ninle);
