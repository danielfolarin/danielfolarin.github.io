/* Side-scrolling run (Mario-style), used for the Temptation Tunnel.
   Designed to be forgiving: generous jumps, no lives, no timer.
   Bumping a temptation just bounces you back; after a few bumps it makes way.
   Falling is caught by Ninle; fall twice and a bridge of light appears. */
(function (N) {
  'use strict';
  const T = N.TILE, U = N.util;
  const SOLID = new Set(['#', '=', '?']), ONEWAY = new Set(['-', '_']);
  const GRAV = 1700, JUMP = -660, RUN = 215, MAXFALL = 950, BOUNCE = -980, STOMP = -470;
  const HW = 11, PH = 40; // player half-width and height
  const BOX = { c: [15, 34], t: [18, 30], g: [22, 14] }; // half-width, height (feet-based)

  class Platformer {
    constructor(game, def, replay) {
      this.g = game; this.def = def; this.replay = replay;
      this.tiles = def.map.map(r => r.split(''));
      this.h = this.tiles.length; this.w = this.tiles[0].length;
      this.hearts = 0; this.time = 0;
      this.enemies = []; this.heartsList = []; this.flowers = []; this.checkpoints = []; this.blocks = {};
      this.particles = []; this.says = []; this.introduced = {}; this.falls = {}; this.bridged = {};
      let start = { x: T * 2, y: T * 10 };
      for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
        const ch = this.tiles[y][x], cx = x * T + T / 2, feet = (y + 1) * T;
        if (ch === '?') { this.blocks[x + ',' + y] = { used: false, b: 0 }; continue; }
        if ('SchtbgpLF'.includes(ch)) this.tiles[y][x] = '.';
        if (ch === 'S') start = { x: cx, y: feet };
        else if (ch === 'h') this.heartsList.push({ x: cx, y: y * T + T / 2, got: false });
        else if (ch === 'p') this.flowers.push({ x: cx, y: feet, squash: 0 });
        else if (ch === 'L') this.checkpoints.push({ x: cx, y: feet, lit: false });
        else if (ch === 'F') this.finish = { x: cx, y: feet };
        else if ('ctbg'.includes(ch)) this.enemies.push({ type: ch, x: cx, x0: cx, y: ch === 'b' ? y * T + T / 2 : feet, baseY: y * T + T / 2, dir: -1, calm: false, calmT: 0, bumps: 0, phase: x * 0.7 });
      }
      // Give-Up Gaps: columns with no floor
      this.gaps = [];
      for (let x = 1; x < this.w - 1; x++) {
        if (SOLID.has(this.get(x, this.h - 1))) continue;
        const last = this.gaps[this.gaps.length - 1];
        if (last && last.b === x - 1) last.b = x; else this.gaps.push({ a: x, b: x });
      }
      this.gaps.forEach(gp => { let y = 0; while (y < this.h && !SOLID.has(this.get(gp.a - 1, y))) y++; gp.top = y; });
      this.p = { x: start.x, y: start.y, vx: 0, vy: 0, face: 1, onGround: false, coyote: 0, buffer: 0, held: false, inv: 0, knock: 0, stuck: 0, prevY: start.y };
      this.respawn = { x: start.x, y: start.y }; this.cp = -1;
      this.ninle = { x: start.x - 30, y: start.y - 60 };
      this.cam = { x: 0, y: 0 };
      this.layout(); this.snap();
    }

    get(x, y) { if (x < 0 || x >= this.w) return '#'; if (y < 0 || y >= this.h) return '.'; return this.tiles[y][x]; }
    solid(x, y) { return SOLID.has(this.get(x, y)); }

    layout() {
      const g = this.g;
      // show about 9½ rows (the top rows are mostly sky, the camera follows up there)
      this.zoom = Math.min(1.5, g.vh / (9.5 * T), g.vw / (9 * T));
      this.viewW = g.vw / this.zoom; this.viewH = g.vh / this.zoom;
      // portrait phones have the buttons along the bottom; sideways ones have them at the sides
      this.bottomRoom = N.input.touch && g.vh > g.vw ? 170 / this.zoom : 0;
    }
    camGoal() {
      const W = this.w * T, H = this.h * T;
      const x = U.clamp(this.p.x - this.viewW * 0.38, 0, Math.max(0, W - this.viewW));
      // keep the action clear of the phone buttons and the dialogue box
      const room = Math.max(this.bottomRoom, this.g.dialogueRoom());
      let y;
      if (this.viewH >= H) y = H - this.viewH + Math.max(room, (this.viewH - H) / 2);
      else y = U.clamp(this.p.y - this.viewH * 0.66 + room / 2, 0, H - this.viewH + room);
      return { x, y };
    }
    snap() { const c = this.camGoal(); this.cam.x = c.x; this.cam.y = c.y; }

    goalText() { return `♥ ${this.hearts}  ·  ${this.def.lines.goal}`; }
    say(anchor, text, time) {
      this.says = this.says.filter(s => s.anchor !== anchor);
      this.says.push({ anchor, text, t: time || 2.6 });
    }
    hint() { this.say(this.ninle, N.input.touch ? this.def.lines.hintTouch : this.def.lines.hint, 4.5); }

    /* ---------- input ---------- */
    jumpDown() { if (this.done || this.g.story.active) return; this.p.buffer = 0.14; this.p.held = true; }
    jumpUp() { this.p.held = false; if (this.p.vy < -300) this.p.vy = -300; }

    /* ---------- update ---------- */
    update(dt) {
      const p = this.p, I = N.input, k = I.keys;
      this.time += dt;
      this.updateFx(dt);
      if (this.g.story.active) { this.updateCam(dt); return; }
      if (this.done) {
        p.vx *= 0.85; this.physics(dt);
        if (this.finishT > 0) { this.finishT -= dt; if (this.finishT <= 0) this.g.story.run(this.replay ? this.def.replayFinish : this.def.finish); }
        this.updateCam(dt); return;
      }
      p.prevY = p.y;
      const left = k.has('ArrowLeft') || k.has('KeyA') || I.held.left || I.stick.x < -0.3;
      const right = k.has('ArrowRight') || k.has('KeyD') || I.held.right || I.stick.x > 0.3;
      const dir = (right ? 1 : 0) - (left ? 1 : 0);
      if (p.knock > 0) p.knock -= dt;
      else {
        const top = RUN * (p.stuck > 0 ? 0.45 : 1);
        const acc = p.onGround ? 1900 : 1300;
        const target = dir * top;
        if (p.vx < target) p.vx = Math.min(target, p.vx + acc * dt); else if (p.vx > target) p.vx = Math.max(target, p.vx - acc * dt);
        if (dir) p.face = dir;
      }
      p.coyote = p.onGround ? 0.1 : p.coyote - dt;
      p.buffer -= dt;
      if (p.buffer > 0 && p.coyote > 0) { p.vy = JUMP; p.coyote = 0; p.buffer = 0; p.onGround = false; N.audio.play('jump'); }
      this.physics(dt);
      p.inv -= dt; p.stuck -= dt;
      this.updateEnemies(dt);
      this.collectStuff();
      if (p.y > this.h * T + 90) this.fall();
      if (this.finish && p.x > this.finish.x - 22 && Math.abs(p.y - this.finish.y) < 70) this.finishRun();
      this.updateCam(dt);
    }

    physics(dt) {
      const p = this.p;
      p.vy = Math.min(MAXFALL, p.vy + GRAV * dt);
      this.moveX(p.vx * dt);
      this.moveY(p.vy * dt);
    }
    moveX(dx) {
      const p = this.p; if (!dx) return;
      p.x += dx;
      const ty0 = Math.floor((p.y - PH + 2) / T), ty1 = Math.floor((p.y - 2) / T);
      const tx = Math.floor((dx > 0 ? p.x + HW : p.x - HW) / T);
      for (let ty = ty0; ty <= ty1; ty++) {
        if (!this.solid(tx, ty)) continue;
        p.x = dx > 0 ? tx * T - HW - 0.01 : (tx + 1) * T + HW + 0.01;
        p.vx = 0; break;
      }
    }
    moveY(dy) {
      const p = this.p, prev = p.y;
      p.y += dy; p.onGround = false;
      const tx0 = Math.floor((p.x - HW + 1) / T), tx1 = Math.floor((p.x + HW - 1) / T);
      if (dy >= 0) {
        const ty = Math.floor(p.y / T);
        for (let tx = tx0; tx <= tx1; tx++) {
          const ch = this.get(tx, ty);
          if (SOLID.has(ch) || (ONEWAY.has(ch) && prev <= ty * T + 1)) { p.y = ty * T; p.vy = 0; p.onGround = true; break; }
        }
      } else {
        const ty = Math.floor((p.y - PH) / T);
        const cx = Math.floor(p.x / T);
        for (let tx = tx0; tx <= tx1; tx++) {
          if (!this.solid(tx, ty)) continue;
          p.y = (ty + 1) * T + PH; p.vy = 0;
          const hit = this.get(cx, ty) === '?' ? cx : tx;
          if (this.get(hit, ty) === '?') this.bumpBlock(hit, ty);
          break;
        }
      }
    }

    bumpBlock(tx, ty) {
      const b = this.blocks[tx + ',' + ty]; if (!b) return;
      b.b = 1;
      if (b.used) { N.audio.play('bump'); return; }
      b.used = true;
      this.addHearts(1, tx * T + T / 2, ty * T - 10);
      this.burst(tx * T + T / 2, ty * T, 10, '#ffb3cf');
    }
    addHearts(n, x, y) {
      this.hearts += n;
      N.audio.play('heart');
      if (x != null) this.particles.push({ x, y, vx: 0, vy: -160, life: 0, max: 0.6, heart: true });
      this.g.stateChanged();
    }

    enemyBox(e) {
      if (e.type === 'b') return [e.x - 17, e.y - 17, e.x + 17, e.y + 17];
      const b = BOX[e.type]; return [e.x - b[0], e.y - b[1], e.x + b[0], e.y];
    }
    updateEnemies(dt) {
      const p = this.p, defs = this.def.temptations;
      const pb = [p.x - HW, p.y - PH, p.x + HW, p.y];
      for (const e of this.enemies) {
        if (e.calm) { e.calmT += dt; continue; }
        if (e.type === 'c') {
          e.x += e.dir * 55 * dt;
          const ax = Math.floor((e.x + e.dir * 16) / T), fy = Math.floor((e.y - 10) / T), gy = Math.floor((e.y + 2) / T);
          const tooFar = (e.x - e.x0) * e.dir > T * 2.6; // clocks patrol a short stretch
          if (this.solid(ax, fy) || !this.solid(ax, gy) || tooFar) e.dir = -e.dir;
        } else if (e.type === 'b') {
          e.y = e.baseY + Math.sin(this.time * 1.7 + e.phase) * 55;
        }
        // first time a kind of temptation comes into view: it introduces itself
        if (!this.introduced[e.type] && e.x < this.cam.x + this.viewW - 30 && e.x > this.cam.x + 30) {
          this.introduced[e.type] = true;
          const d = defs[e.type];
          this.say(e, d.says, 3.2);
          N.ui.toast(`<span><b>${d.name}!</b> ${d.tip}</span>`, { big: true });
        }
        const eb = this.enemyBox(e);
        if (pb[2] < eb[0] || pb[0] > eb[2] || pb[3] < eb[1] || pb[1] > eb[3]) continue;
        const d = defs[e.type];
        if (d.stompable && p.vy > 0 && p.prevY <= eb[1] + 12) { this.calm(e, true); continue; }
        if (p.inv <= 0) this.bump(e);
      }
    }
    calm(e, stomped) {
      const d = this.def.temptations[e.type];
      e.calm = true; e.calmT = 0;
      if (stomped) { this.p.vy = STOMP; this.p.onGround = false; }
      N.audio.play('calm');
      this.say(e, d.calm || 'Okay, okay… you can pass!', 2.4);
      this.burst(e.x, e.y - 14, 16);
      this.addHearts(1);
    }
    bump(e) {
      const p = this.p, lines = this.def.lines;
      const away = p.x < e.x ? -1 : 1;
      p.vx = away * 280; p.vy = -330; p.knock = 0.28; p.inv = 1.2; p.onGround = false;
      if (e.type === 'g') p.stuck = 0.9;
      e.bumps++;
      N.audio.play('oops');
      if (e.bumps >= 3) {
        e.calm = true; e.calmT = 0;
        this.burst(e.x, e.y - 14, 20);
        N.audio.play('calm');
        this.say(this.ninle, lines.wayThrough, 3);
        N.ui.toast('<span>✨ A way through!</span>');
      } else {
        this.say(this.ninle, lines.oops[(e.bumps + e.type.charCodeAt(0)) % lines.oops.length], 1.8);
      }
    }

    collectStuff() {
      const p = this.p;
      for (const h of this.heartsList) {
        if (h.got) continue;
        if (Math.abs(p.x - h.x) < 22 && p.y - PH < h.y + 12 && p.y > h.y - 12) { h.got = true; this.addHearts(1); this.burst(h.x, h.y, 8, '#ffb3cf'); }
      }
      for (const f of this.flowers) {
        f.squash = Math.max(0, f.squash - 0.06);
        const landed = p.vy >= 0 && Math.abs(p.x - f.x) < 22 && p.y >= f.y - 22 && p.prevY <= f.y - 12;
        const walkedOn = p.onGround && Math.abs(p.x - f.x) < 10 && Math.abs(p.y - f.y) < 2;
        if (landed || walkedOn) {
          p.y = f.y - 22; p.vy = BOUNCE; p.onGround = false; f.squash = 1; N.audio.play('boing');
        }
      }
      this.checkpoints.forEach((cp, i) => {
        if (cp.lit || Math.abs(p.x - cp.x) > 30) return;
        for (let j = 0; j <= i; j++) this.checkpoints[j].lit = true;
        this.respawn = { x: cp.x, y: cp.y }; this.cp = i;
        N.audio.play('lantern', 2 + i);
        this.burst(cp.x, cp.y - 40, 12);
      });
      for (const key in this.blocks) { const b = this.blocks[key]; if (b.b > 0) b.b = Math.max(0, b.b - 0.12); }
    }

    fall() {
      const p = this.p, lines = this.def.lines;
      const n = this.falls[this.cp] = (this.falls[this.cp] || 0) + 1;
      if (n >= 2 && !this.bridged[this.cp]) {
        this.bridged[this.cp] = true;
        const x0 = this.respawn.x, nextCp = this.checkpoints[this.cp + 1];
        const x1 = nextCp ? nextCp.x : this.w * T;
        this.gaps.forEach(gp => {
          if (gp.a * T < x0 || gp.a * T > x1) return;
          for (let x = gp.a; x <= gp.b; x++) this.tiles[gp.top][x] = '_';
        });
        N.ui.toast(`<span>🌟 ${lines.bridge}</span>`);
      }
      this.say(this.ninle, lines.firstFall, 2.6);
      p.x = this.respawn.x; p.y = this.respawn.y; p.vx = 0; p.vy = 0; p.inv = 1; p.knock = 0;
      this.ninle.x = p.x - 30; this.ninle.y = p.y - 60;
      N.audio.play('calm');
      this.burst(p.x, p.y - 20, 18);
      this.snap();
    }

    finishRun() {
      this.done = true; this.finishT = 0.9;
      this.p.face = 1;
      N.audio.play('spark');
      for (let i = 0; i < 4; i++) this.burst(this.finish.x, this.finish.y - 186 + i * 10, 14);
    }

    updateFx(dt) {
      const p = this.p, n = this.ninle;
      const k = 1 - Math.exp(-dt * 5);
      const bob = this.g.calm ? 0 : Math.sin(this.time * 2.6) * 5;
      n.x = U.lerp(n.x, p.x - p.face * 34, k); n.y = U.lerp(n.y, p.y - 62 + bob, k);
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const q = this.particles[i]; q.life += dt;
        if (q.life >= q.max) { this.particles.splice(i, 1); continue; }
        q.vy += (q.heart ? 0 : 300) * dt; q.x += q.vx * dt; q.y += q.vy * dt;
      }
      for (let i = this.says.length - 1; i >= 0; i--) { this.says[i].t -= dt; if (this.says[i].t <= 0) this.says.splice(i, 1); }
    }
    updateCam(dt) {
      const c = this.camGoal(), k = 1 - Math.exp(-dt * 6);
      this.cam.x = U.lerp(this.cam.x, c.x, k); this.cam.y = U.lerp(this.cam.y, c.y, k);
    }
    burst(x, y, n, color) {
      const count = this.g.calm ? Math.ceil(n / 3) : n;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 120;
        this.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: 0, max: 0.7 + Math.random() * 0.4, size: 2 + Math.random() * 3, color: color || ['#fff3a0', '#ffd54a', '#ffffff', '#ffb3cf'][i % 4] });
      }
    }

    /* ---------- drawing ---------- */
    render() {
      const g = this.g, c = g.ctx, R = N.art.run, t = this.time, calm = g.calm;
      const s = g.dpr * this.zoom;
      const camX = Math.round(this.cam.x * s) / s, camY = Math.round(this.cam.y * s) / s;
      c.setTransform(1, 0, 0, 1, 0, 0);
      R.background(c, camX, g.canvas.width, g.canvas.height, s, t, calm);
      c.setTransform(s, 0, 0, s, -camX * s, -camY * s);
      c.lineJoin = 'round'; c.lineCap = 'round';
      const x0 = Math.max(0, Math.floor(camX / T) - 1), x1 = Math.min(this.w - 1, Math.ceil((camX + this.viewW) / T) + 1);
      const inX = x => x > camX - 80 && x < camX + this.viewW + 80;
      for (let y = 0; y < this.h; y++) for (let x = x0; x <= x1; x++) {
        const ch = this.tiles[y][x];
        if (ch === '.') continue;
        const b = this.blocks[x + ',' + y];
        R.tile(c, ch, x, y, this.get(x, y - 1), b && b.used, b && b.b, t);
      }
      // the ground carries on below the course, and gaps look deep
      const yMax = Math.ceil((camY + this.viewH) / T);
      for (let y = this.h; y <= yMax; y++) for (let x = x0; x <= x1; x++) if (this.solid(x, this.h - 1)) R.tile(c, '#', x, y, '#', false, 0, t);
      c.fillStyle = 'rgba(35,25,70,.55)';
      this.gaps.forEach(gp => c.fillRect(gp.a * T, gp.top * T + 16, (gp.b - gp.a + 1) * T, (yMax - gp.top + 1) * T));
      this.gaps.forEach(gp => { const x = gp.a * T - 22; if (inX(x)) R.gapSign(c, x, gp.top * T, this.def.gapName); });
      this.checkpoints.forEach(cp => { if (inX(cp.x)) N.art.drawLanternPost(c, cp.x - 4, cp.y, cp.lit, t); });
      if (this.finish && inX(this.finish.x)) R.finish(c, this.finish.x, this.finish.y, t, !this.done && !this.replay, calm);
      this.flowers.forEach(f => { if (inX(f.x)) R.bounceFlower(c, f.x, f.y, f.squash); });
      this.heartsList.forEach(h => { if (!h.got && inX(h.x)) R.heart(c, h.x, h.y, t, calm); });
      for (const e of this.enemies) {
        if (!inX(e.x)) continue;
        if (e.calm) {
          const a = Math.min(1, e.calmT * 2);
          if (e.type === 'b') { if (e.calmT < 0.4) { c.globalAlpha = 1 - e.calmT / 0.4; R.bubble(c, e.x, e.y, t, { blink: true }); c.globalAlpha = 1; } }
          else R.calmFlowers(c, e.x, e.y, a);
          continue;
        }
        const blink = N.art.isBlink(t, e.phase);
        if (e.type === 'c') R.clock(c, e.x, e.y, t, e.dir, { blink });
        else if (e.type === 't') R.thorn(c, e.x, e.y, t, { blink, calm });
        else if (e.type === 'b') R.bubble(c, e.x, e.y, t, { blink });
        else if (e.type === 'g') R.goo(c, e.x, e.y, t, { blink, calm });
      }
      // player (see-through for a moment after a bump; never flashing)
      const p = this.p, wear = {};
      for (const k in N.save.data.wear) if (N.save.data.wear[k] && N.save.data.costumes[k]) wear[k] = true;
      if (p.inv > 0) c.globalAlpha = 0.55;
      N.art.drawPlayer(c, p.x, p.y, { avatar: N.avatars[N.save.data.avatar] || N.avatars[0], t, moving: p.onGround && Math.abs(p.vx) > 20, face: 'side', flip: p.face < 0, calm, wear, blink: N.art.isBlink(t, 1) });
      c.globalAlpha = 1;
      N.art.drawChar(c, 'ninle', this.ninle.x, this.ninle.y, { t, flip: p.face < 0, calm, blink: N.art.isBlink(t, 3) });
      for (const q of this.particles) {
        c.globalAlpha = Math.max(0, 1 - q.life / q.max);
        if (q.heart) R.heart(c, q.x, q.y, t, true);
        else { c.fillStyle = q.color; c.beginPath(); c.arc(q.x, q.y, q.size, 0, Math.PI * 2); c.fill(); }
      }
      c.globalAlpha = 1;
      for (const sb of this.says) {
        const a = sb.anchor;
        const ax = U.clamp(a.x, camX + 95, camX + this.viewW - 95);
        const ay = Math.max((a === this.ninle ? a.y - 12 : a.y - 40), camY + 110 / this.zoom);
        this.g.drawBubble(c, ax, ay, sb.text);
      }
    }
  }
  N.Platformer = Platformer;
})(window.Ninle);
