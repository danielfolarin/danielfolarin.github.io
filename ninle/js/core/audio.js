/* All sounds are made live with the Web Audio API — no sound files needed.
   The game is fully playable with sound off. */
(function (N) {
  'use strict';
  const A = N.audio = { enabled: true, ctx: null };
  let master, sfxBus, musicBus, musicTimer = null, nextNoteTime = 0, step = 0;

  A.init = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    A.ctx = new AC();
    master = A.ctx.createGain(); master.gain.value = A.enabled ? 1 : 0; master.connect(A.ctx.destination);
    sfxBus = A.ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(master);
    musicBus = A.ctx.createGain(); musicBus.gain.value = 0.55; musicBus.connect(master);
  };

  A.setEnabled = function (on) {
    A.enabled = on;
    if (master) master.gain.setTargetAtTime(on ? 1 : 0, A.ctx.currentTime, 0.05);
  };

  function tone(freq, start, dur, opts) {
    if (!A.ctx) return;
    const o = opts || {};
    const osc = A.ctx.createOscillator();
    const g = A.ctx.createGain();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    if (o.slide) osc.frequency.exponentialRampToValueAtTime(o.slide, start + dur);
    if (o.vibrato) {
      const lfo = A.ctx.createOscillator(), lg = A.ctx.createGain();
      lfo.frequency.value = o.vibrato; lg.gain.value = freq * 0.06;
      lfo.connect(lg); lg.connect(osc.frequency); lfo.start(start); lfo.stop(start + dur + 0.05);
    }
    const vol = o.vol == null ? 0.15 : o.vol;
    const att = o.attack || 0.01;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + att);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g); g.connect(o.bus || sfxBus);
    osc.start(start); osc.stop(start + dur + 0.05);
  }
  function noise(start, dur, vol, freq) {
    const len = Math.floor(A.ctx.sampleRate * dur);
    const buf = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = A.ctx.createBufferSource(); src.buffer = buf;
    const f = A.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq || 900; f.Q.value = 0.8;
    const g = A.ctx.createGain(); g.gain.value = vol;
    src.connect(f); f.connect(g); g.connect(sfxBus); src.start(start);
  }

  const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5, 1568, 1760];
  const SFX = {
    blip: t => tone(740, t, 0.07, { type: 'triangle', vol: 0.05 }),
    next: t => tone(880, t, 0.06, { type: 'triangle', vol: 0.06 }),
    choose: t => { tone(660, t, 0.1, { type: 'triangle', vol: 0.09 }); tone(990, t + 0.07, 0.14, { type: 'triangle', vol: 0.08 }); },
    star: t => [1046.5, 1318.5, 1568, 2093].forEach((f, i) => tone(f, t + i * 0.06, 0.25, { vol: 0.09 })),
    item: t => { tone(330, t, 0.12, { type: 'triangle', vol: 0.14 }); tone(494, t + 0.08, 0.16, { type: 'triangle', vol: 0.12 }); },
    spark: t => [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, t + i * 0.09, 0.9, { vol: 0.08, attack: 0.03 })),
    sticker: t => [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.09, 0.3, { type: 'triangle', vol: 0.09 })),
    build: t => { for (let i = 0; i < 3; i++) { tone(140, t + i * 0.18, 0.1, { type: 'square', vol: 0.06 }); noise(t + i * 0.18, 0.08, 0.25, 600); } },
    honk: t => { tone(330, t, 0.22, { type: 'sawtooth', vol: 0.05, slide: 220 }); tone(330, t + 0.28, 0.22, { type: 'sawtooth', vol: 0.05, slide: 230 }); },
    baa: t => tone(392, t, 0.7, { type: 'sawtooth', vol: 0.045, vibrato: 9, slide: 330 }),
    splash: t => { noise(t, 0.35, 0.3, 1500); tone(900, t, 0.2, { vol: 0.05, slide: 500 }); },
    poof: t => noise(t, 0.3, 0.3, 2400),
    gate: t => { tone(196, t, 1.6, { type: 'triangle', vol: 0.1, attack: 0.3 }); tone(293.7, t + 0.2, 1.6, { type: 'triangle', vol: 0.08, attack: 0.3 }); },
    finale: t => [261.6, 329.6, 392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, t + i * 0.12, 2.2, { vol: 0.07, attack: 0.05 })),
    bump: t => tone(180, t, 0.08, { type: 'sine', vol: 0.05 }),
    jump: t => tone(420, t, 0.16, { type: 'triangle', vol: 0.07, slide: 760 }),
    boing: t => tone(260, t, 0.35, { type: 'triangle', vol: 0.1, slide: 980 }),
    heart: t => { tone(988, t, 0.1, { type: 'triangle', vol: 0.07 }); tone(1319, t + 0.07, 0.16, { type: 'triangle', vol: 0.07 }); },
    oops: t => tone(520, t, 0.3, { type: 'triangle', vol: 0.08, slide: 300 }),
    calm: t => [784, 988, 1175].forEach((f, i) => tone(f, t + i * 0.07, 0.4, { vol: 0.07 }))
  };

  A.play = function (name, arg) {
    if (!A.ctx || !A.enabled) return;
    const t = A.ctx.currentTime + 0.01;
    if (name === 'lantern') { const f = PENTA[(arg || 0) % PENTA.length]; tone(f, t, 1.2, { vol: 0.08 }); tone(f * 2, t, 0.6, { vol: 0.03 }); return; }
    const fn = SFX[name]; if (fn) fn(t);
  };

  /* ---- gentle background tune (C major pentatonic, loops) ---- */
  const N5 = { C: 523.25, D: 587.33, E: 659.25, G: 783.99, A: 880, c: 1046.5 };
  const MELODY = ['E', 0, 'G', 0, 'A', 'G', 'E', 0, 'D', 0, 'E', 0, 'G', 0, 0, 0,
    'C', 0, 'D', 'E', 'G', 0, 'E', 0, 'D', 0, 0, 0, 'C', 0, 0, 0,
    'E', 0, 'G', 0, 'A', 0, 'c', 0, 'A', 0, 'G', 0, 'E', 0, 0, 0,
    'D', 0, 'E', 'G', 'A', 0, 'G', 0, 'E', 0, 'D', 0, 'C', 0, 0, 0];
  const BASS = [130.8, 98, 110, 82.4, 87.3, 130.8, 98, 73.4]; // per half-bar
  const STEP = 60 / 92 / 2; // eighth notes at 92 bpm

  function schedule() {
    while (nextNoteTime < A.ctx.currentTime + 0.25) {
      const m = MELODY[step % MELODY.length];
      if (m) tone(N5[m], nextNoteTime, STEP * 2.2, { type: 'triangle', vol: 0.045, bus: musicBus, attack: 0.02 });
      if (step % 4 === 0) {
        const b = BASS[Math.floor(step / 8) % BASS.length];
        tone(b, nextNoteTime, STEP * 3.6, { type: 'sine', vol: 0.07, bus: musicBus, attack: 0.03 });
      }
      if (step % 16 === 8) tone(1568, nextNoteTime, 0.6, { vol: 0.012, bus: musicBus });
      nextNoteTime += STEP; step++;
    }
  }
  A.startMusic = function () {
    if (!A.ctx || musicTimer) return;
    nextNoteTime = A.ctx.currentTime + 0.1; step = 0;
    musicTimer = setInterval(schedule, 90);
  };
  A.stopMusic = function () { clearInterval(musicTimer); musicTimer = null; };
})(window.Ninle);
