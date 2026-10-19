/* Boot: load saved settings, start the game loop, and wire up the keyboard. */
(function (N) {
  'use strict';
  const LEVEL = 'lantern-trail';
  const UI = N.ui;
  const save = N.save.load();
  N.audio.enabled = save.sound;
  N.art.buildSprites();

  const game = N.game = new N.Game(document.getElementById('game'));
  game.load(LEVEL);
  game.mode = 'title';

  function beginPlay() {
    UI.hideDialogue();
    ['pause', 'confirm', 'reflection', 'book'].forEach(UI.hide);
    game.load(LEVEL);
    game.mode = 'play';
    game.snapCamera();
    UI.screen('game');
    UI.setAction(null);
    setTimeout(() => {
      if (game.mode !== 'play' || game.story.active) return;
      game.story.say(game.level.intro);
      game.story.defer(() => UI.showControlsHint()); // show the picture controls once Ninle finishes talking
    }, 600);
  }

  const H = {
    start() {
      N.audio.init(); N.audio.setEnabled(save.sound);
      if (save.sound) N.audio.startMusic();
      UI.fade(beginPlay);
    },
    restart() { UI.fade(beginPlay); },
    home() {
      UI.fade(() => {
        UI.hideDialogue();
        game.load(LEVEL); game.mode = 'title';
        UI.screen('title');
      });
    },
    keepExploring() {
      UI.screen('game');
      game.mode = 'play';
      game.stateChanged();
    },
    toggleSound() {
      save.sound = !save.sound; N.save.write();
      N.audio.init(); N.audio.setEnabled(save.sound);
      if (save.sound) N.audio.startMusic();
      UI.syncToggles();
    },
    toggleRead() {
      save.readAloud = !save.readAloud; N.save.write();
      if (save.readAloud) N.speech.say('Okay! I will read to you.'); else N.speech.stop();
      UI.syncToggles();
    },
    toggleCalm() {
      save.calm = !N.save.calm(); N.save.write();
      UI.syncToggles();
    }
  };
  UI.init(game, H);
  UI.screen('title');

  /* ---------- keyboard ---------- */
  const MOVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
  const JUMP_KEYS = ['Space', 'ArrowUp', 'KeyW', 'Enter', 'NumpadEnter'];
  function onKeyUp(e) {
    if (game.mode === 'platform' && game.runner && JUMP_KEYS.includes(e.code)) { e.preventDefault(); game.runner.jumpUp(); }
  }
  function onKey(e) {
    const k = e.code;
    const onButton = document.activeElement && document.activeElement.tagName === 'BUTTON';
    if (UI.reflOpen()) {
      if (k === 'ArrowRight') { e.preventDefault(); document.getElementById('storyNext').click(); }
      if (k === 'ArrowLeft') { e.preventDefault(); document.getElementById('storyBack').click(); }
      return;
    }
    if (UI.bookOpen()) { if (k === 'Escape') UI.closeBook(); return; }
    if (UI.isPaused()) {
      if (k === 'Escape' || k === 'KeyP') {
        if (!document.getElementById('confirm').classList.contains('hidden')) { UI.hide('confirm'); UI.openPause(); }
        else UI.closePause();
      }
      return;
    }
    if (game.mode === 'title' || document.getElementById('screen-end').classList.contains('active')) return;
    if (game.mode !== 'play' && game.mode !== 'platform') { if (MOVE_KEYS.includes(k)) e.preventDefault(); return; }

    if (game.story.active) {
      const m = UI.dialogueMode();
      if (m === 'choose') {
        const n = /^(Digit|Numpad)([1-9])$/.exec(k);
        if (n) { e.preventDefault(); UI.pick(+n[2] - 1); return; }
        if (k === 'ArrowUp' || k === 'ArrowLeft' || k === 'KeyW' || k === 'KeyA') { e.preventDefault(); UI.moveChoiceFocus(-1); }
        if (k === 'ArrowDown' || k === 'ArrowRight' || k === 'KeyS' || k === 'KeyD') { e.preventDefault(); UI.moveChoiceFocus(1); }
        return;
      }
      if ((k === 'Space' || k === 'Enter' || k === 'NumpadEnter' || k === 'KeyE') && !onButton) {
        e.preventDefault(); if (!e.repeat) UI.next(); return;
      }
      if (k === 'Escape' || k === 'KeyP') UI.openPause();
      if (MOVE_KEYS.includes(k)) e.preventDefault();
      return;
    }
    if (game.mode === 'platform') { // side-scrolling run
      if (JUMP_KEYS.includes(k)) { e.preventDefault(); if (!e.repeat && game.runner) game.runner.jumpDown(); }
      else if (k === 'KeyH') game.showHint();
      else if (k === 'KeyP' || k === 'Escape') UI.openPause();
      else if (k === 'KeyM') H.toggleSound();
      if (MOVE_KEYS.includes(k)) e.preventDefault();
      return;
    }
    if ((k === 'Space' || k === 'Enter' || k === 'NumpadEnter' || k === 'KeyE') && !onButton) {
      e.preventDefault(); if (!e.repeat) game.action(); return;
    }
    if (k === 'KeyH') game.showHint();
    else if (k === 'KeyP' || k === 'Escape') UI.openPause();
    else if (k === 'KeyM') H.toggleSound();
    if (MOVE_KEYS.includes(k)) e.preventDefault();
  }
  N.input.init({ onKey, onKeyUp });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && (game.mode === 'play' || game.mode === 'platform') && !UI.blocking()) UI.openPause();
  });

  /* ---------- game loop ---------- */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    try { game.update(dt); game.render(); } catch (err) { console.error(err); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})(window.Ninle);
