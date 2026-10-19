/* Keyboard (arrows / WASD) and an on-screen joystick for phones and tablets. */
(function (N) {
  'use strict';
  const I = N.input = { keys: new Set(), stick: { x: 0, y: 0, active: false }, held: { left: false, right: false }, onKey: null, onKeyUp: null, touch: false };
  const R = 56; // joystick travel radius in CSS px

  I.setTouch = function (on) {
    I.touch = on;
    document.body.classList.toggle('touch', on);
  };

  I.init = function (opts) {
    I.onKey = opts.onKey; I.onKeyUp = opts.onKeyUp;
    I.setTouch(!!(window.matchMedia && matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window && navigator.maxTouchPoints > 0));

    window.addEventListener('keydown', e => {
      I.keys.add(e.code);
      if (I.onKey) I.onKey(e);
    });
    window.addEventListener('keyup', e => { I.keys.delete(e.code); if (I.onKeyUp) I.onKeyUp(e); });
    window.addEventListener('blur', () => { I.keys.clear(); release(); });
    window.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch' && !I.touch) I.setTouch(true);
      else if (e.pointerType === 'mouse' && I.touch && !matchMedia('(pointer: coarse)').matches) I.setTouch(false);
    }, true);

    const zone = document.getElementById('stickZone');
    const base = document.getElementById('stickBase');
    const knob = document.getElementById('stickKnob');
    let pid = null, cx = 0, cy = 0;

    zone.addEventListener('pointerdown', e => {
      // A new touch always takes over the pad, so it can never get stuck.
      pid = e.pointerId;
      cx = e.clientX; cy = e.clientY;
      try { zone.setPointerCapture(pid); } catch (err) { /* capture is optional */ }
      const zr = zone.getBoundingClientRect();
      base.style.left = (cx - zr.left) + 'px';
      base.style.bottom = (zr.bottom - cy) + 'px';
      I.stick.active = true;
      move(e);
      e.preventDefault();
    });
    // Listen on the window too, so lifting a finger anywhere stops movement.
    window.addEventListener('pointermove', e => { if (e.pointerId === pid) move(e); });
    const end = e => { if (e.pointerId === pid) release(); };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    function move(e) {
      let dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > R) { dx = dx / d * R; dy = dy / d * R; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      const m = Math.min(1, d / R);
      I.stick.x = m < 0.15 ? 0 : dx / R;
      I.stick.y = m < 0.15 ? 0 : dy / R;
    }
    function release() {
      pid = null;
      I.stick.x = I.stick.y = 0; I.stick.active = false;
      knob.style.transform = '';
      base.style.left = ''; base.style.bottom = '';
    }
    I.releaseStick = release;

    // Hold-to-run buttons for side-scrolling runs
    [['btnLeft', 'left'], ['btnRight', 'right']].forEach(([id, side]) => {
      const b = document.getElementById(id); let bp = null;
      const up = e => { if (e.pointerId !== bp) return; bp = null; I.held[side] = false; b.classList.remove('down'); };
      b.addEventListener('pointerdown', e => {
        bp = e.pointerId; I.held[side] = true; b.classList.add('down');
        try { b.setPointerCapture(bp); } catch (err) { /* optional */ }
        e.preventDefault();
      });
      window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
      b.addEventListener('contextmenu', e => e.preventDefault());
    });
  };

  I.dir = function () {
    const k = I.keys;
    let x = 0, y = 0;
    if (k.has('ArrowLeft') || k.has('KeyA')) x -= 1;
    if (k.has('ArrowRight') || k.has('KeyD')) x += 1;
    if (k.has('ArrowUp') || k.has('KeyW')) y -= 1;
    if (k.has('ArrowDown') || k.has('KeyS')) y += 1;
    if (x || y) { const d = Math.hypot(x, y); return { x: x / d, y: y / d }; }
    return { x: I.stick.x, y: I.stick.y };
  };
  I.clear = function () {
    I.keys.clear(); I.held.left = I.held.right = false;
    document.querySelectorAll('.run-btn.down').forEach(b => b.classList.remove('down'));
    if (I.releaseStick) I.releaseStick();
  };
})(window.Ninle);
