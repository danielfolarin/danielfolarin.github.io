/* Wayfinder — gentle generated ambience (Web Audio, no audio files).
 * Off by default. Every change is a slow ramp: no sudden or loud sounds.
 * Each sound also has a caption (see main.js) so nothing essential depends on hearing it. */
(() => {
  'use strict';
  const WF = window.Wayfinder;

  // Soft pad chords (Hz) and wind level per mood.
  const MOODS = {
    home:    { chord: [110.0, 164.81, 220.0, 277.18], wind: 0.05, cutoff: 900 },
    road:    { chord: [98.0, 146.83, 196.0, 246.94], wind: 0.11, cutoff: 800 },
    juniper: { chord: [87.31, 130.81, 174.61, 220.0], wind: 0.07, cutoff: 950 },
    pass:    { chord: [73.42, 110.0, 146.83, 174.61], wind: 0.10, cutoff: 700 },
    cave:    { chord: [65.41, 98.0, 130.81, 155.56], wind: 0.05, cutoff: 600 },
    dawn:    { chord: [98.0, 146.83, 196.0, 293.66], wind: 0.04, cutoff: 1100 },
    quiet:   { chord: [130.81, 196.0, 261.63, 329.63], wind: 0.02, cutoff: 1000 },
  };
  const CHIME_NOTES = [523.25, 587.33, 659.25, 783.99, 880.0];

  let ctx = null;
  let master = null;
  let windGain = null;
  let windFilter = null;
  let pad = null; // { nodes, gain }
  let mood = 'home';
  let enabled = false;
  let chimeIndex = 0;

  function ensure() {
    if (ctx) {
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try {
      ctx = new AC();
    } catch (e) {
      return false;
    }
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    startWind();
    return true;
  }

  function noiseBuffer(seconds) {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      // Brownish noise: softer than white noise.
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      data[i] = last * 3.5;
    }
    return buf;
  }

  function startWind() {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(4);
    src.loop = true;
    windFilter = ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.value = 500;
    windFilter.Q.value = 0.6;
    windGain = ctx.createGain();
    windGain.gain.value = 0;
    const lfo = ctx.createOscillator();
    const lfoAmt = ctx.createGain();
    lfo.frequency.value = 0.07;
    lfoAmt.gain.value = 260;
    lfo.connect(lfoAmt).connect(windFilter.frequency);
    src.connect(windFilter).connect(windGain).connect(master);
    src.start();
    lfo.start();
  }

  function startPad(name) {
    const m = MOODS[name] || MOODS.home;
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(1, now + 4);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = m.cutoff;
    filter.connect(gain).connect(master);
    const nodes = [];
    m.chord.forEach((f, i) => {
      [0, 1].forEach((layer) => {
        const osc = ctx.createOscillator();
        osc.type = layer ? 'triangle' : 'sine';
        osc.frequency.value = f;
        osc.detune.value = layer ? 6 : -4;
        const g = ctx.createGain();
        g.gain.value = (layer ? 0.012 : 0.022) / (1 + i * 0.35);
        // Slow "breathing" on each voice.
        const lfo = ctx.createOscillator();
        const amt = ctx.createGain();
        lfo.frequency.value = 0.05 + i * 0.013;
        amt.gain.value = g.gain.value * 0.6;
        lfo.connect(amt).connect(g.gain);
        osc.connect(g).connect(filter);
        osc.start();
        lfo.start();
        nodes.push(osc, lfo);
      });
    });
    windGain.gain.cancelScheduledValues(now);
    windGain.gain.setValueAtTime(windGain.gain.value, now);
    windGain.gain.linearRampToValueAtTime(m.wind, now + 3);
    return { nodes, gain };
  }

  function stopPad(p) {
    if (!p) return;
    const now = ctx.currentTime;
    p.gain.gain.cancelScheduledValues(now);
    p.gain.gain.setValueAtTime(p.gain.gain.value, now);
    p.gain.gain.linearRampToValueAtTime(0, now + 3);
    setTimeout(() => p.nodes.forEach((n) => { try { n.stop(); } catch (e) { /* already stopped */ } }), 3500);
  }

  function rampWind(peak, up, down) {
    const now = ctx.currentTime;
    const base = (MOODS[mood] || MOODS.home).wind;
    windGain.gain.cancelScheduledValues(now);
    windGain.gain.setValueAtTime(windGain.gain.value, now);
    windGain.gain.linearRampToValueAtTime(peak, now + up);
    windGain.gain.linearRampToValueAtTime(base, now + up + down);
  }

  function rumble() {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 42;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.18, now + 1.5);
    g.gain.linearRampToValueAtTime(0, now + 5);
    osc.connect(g).connect(master);
    osc.start(now);
    osc.stop(now + 5.2);
  }

  function crackle() {
    const now = ctx.currentTime;
    const buf = noiseBuffer(0.08);
    for (let i = 0; i < 46; i++) {
      const t = now + Math.random() * 4.5;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1500 + Math.random() * 2500;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.05, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      src.connect(f).connect(g).connect(master);
      src.start(t);
    }
  }

  function chime() {
    const now = ctx.currentTime;
    const f = CHIME_NOTES[chimeIndex++ % CHIME_NOTES.length];
    [1, 2.01].forEach((mult, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = f * mult;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(i ? 0.012 : 0.04, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3);
      osc.connect(g).connect(master);
      osc.start(now);
      osc.stop(now + 3.1);
    });
  }

  WF.audio = {
    get enabled() { return enabled; },
    setEnabled(on) {
      enabled = !!on;
      if (enabled) {
        if (!ensure()) { enabled = false; return false; }
        if (!pad) pad = startPad(mood);
      }
      if (!ctx) return enabled;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(enabled ? 0.55 : 0, now + 1.5);
      return enabled;
    },
    setMood(name) {
      if (!MOODS[name] || name === mood) return;
      mood = name;
      if (!ctx || !enabled) { if (ctx && pad) { stopPad(pad); pad = null; } return; }
      stopPad(pad);
      pad = startPad(name);
    },
    event(name) {
      if (!ctx || !enabled) return;
      if (name === 'chime') chime();
      else if (name === 'wind') rampWind(0.32, 2.5, 5);
      else if (name === 'quake') rumble();
      else if (name === 'fire') crackle();
      else if (name === 'hush') rampWind(0.01, 3, 6);
    },
  };
})();
