/* The game itself: moving around, collecting, talking, the camera,
   drawing the world, and the grand finale. Story content comes from js/levels/. */
(function (N) {
  'use strict';
  const T = N.TILE, U = N.util, tc = U.tileCenter;
  const PICKUPS = new Set(['star', 'spark', 'item']);
  const FONT = 'ui-rounded, "SF Pro Rounded", "Nunito", "Trebuchet MS", system-ui, sans-serif';

  class Game {
    constructor(canvas) {
      this.canvas = canvas; this.ctx = canvas.getContext('2d');
      this.light = document.createElement('canvas'); this.lctx = this.light.getContext('2d');
      this.mode = 'title'; // title | play | cutscene
      this.paused = false;
      this.time = 0;
      this.cam = { x: 0, y: 0 };
      this.story = new N.Story(this);
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    get calm() { return N.save.calm(); }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth, h = window.innerHeight;
      this.dpr = dpr; this.vw = w; this.vh = h;
      this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
      this.zoom = U.clamp(Math.min(w, h) / (T * 8.5), 0.72, 1.6);
      this.lightScale = dpr * 0.5;
      this.light.width = Math.ceil(w * this.lightScale); this.light.height = Math.ceil(h * this.lightScale);
      if (this.runner) this.runner.layout();
    }

    /* ---------------- setup ---------------- */
    load(levelId) {
      const L = this.level = N.levels[levelId];
      this.world = new N.World(L);
      this.state = {
        flags: new Set(), items: {}, sparks: 0, stars: new Set(), following: null,
        runStickers: [], newCostumes: [], fogA: 1, gateOpen: 0, dusk: L.dusk[0], greatLit: false
      };
      this.entities = L.entities.map(d => this.makeEntity(d));
      L.lanterns.forEach((p, i) => this.entities.push(this.makeEntity({ id: 'lantern' + i, type: 'lantern', x: p[0], y: p[1] })));
      this.byId = {};
      this.entities.forEach(e => { this.byId[e.id] = e; });
      this.starTotal = this.entities.filter(e => e.type === 'star').length;
      this.player = { x: tc(L.start[0]), y: tc(L.start[1]), r: 13, face: 'up', flip: false, moving: false };
      this.ninle = { x: this.player.x + 24, y: this.player.y - 46, flip: false };
      this.trail = [];
      this.fired = new Set();
      this.hintArrow = null;
      this.particles = [];
      this.cut = null;
      this.target = null;
      this.movedTime = 0;
      this.paused = false;
      this.runner = null;
      document.body.classList.remove('mode-run');
      if (N.ui.setActionMode) N.ui.setActionMode('talk');
      this.story = new N.Story(this);
      this.buildObjects();
      this.groundDirty = true;
      this.snapCamera();
      this.stateChanged();
    }

    makeEntity(d) {
      return Object.assign({}, d, {
        def: d, x: tc(d.x), y: tc(d.y), visible: !d.hidden,
        solid: d.solid !== undefined ? d.solid : ['npc', 'sign', 'lantern', 'greatLantern', 'portal'].includes(d.type),
        r: d.type === 'greatLantern' || d.type === 'portal' ? 24 : (d.type === 'lantern' ? 10 : 15),
        flip: d.face === -1, seed: (d.x * 7 + d.y * 13) % 10, bubble: null, idleCd: 2 + (d.x % 4),
        route: null, following: false, lit: false, revealed: false, moving: false
      });
    }

    buildObjects() {
      const w = this.world, L = this.level, list = [];
      for (let y = 0; y < w.h; y++) for (let x = 0; x < w.w; x++) {
        const ch = w.get(x, y);
        if ('TBsRFGg'.includes(ch)) list.push({ kind: 'tile', tx: x, ty: y, ch, x: x * T + T / 2, y: (y + 1) * T - ('FGg'.includes(ch) ? 8 : 2) });
      }
      if (L.house) list.push({ kind: 'house', x: (L.house.x + L.house.w / 2) * T, y: (L.house.y + L.house.h) * T });
      if (L.lanternGate) list.push({ kind: 'gate', x: (L.lanternGate.x + 1) * T, y: (L.lanternGate.y + 1) * T + 1 });
      this.objects = list;
      this.objVersion = w.version;
    }

    ensureGround() {
      const S = Math.round(Math.min(1.6, this.dpr * this.zoom) * 10) / 10;
      if (this.groundCache && !this.groundDirty && S === this.groundScale) return;
      this.groundScale = S;
      this.groundCache = N.art.renderGround(this.world, S);
      this.groundDirty = false;
    }

    /* ---------------- helpers used by the story ---------------- */
    showEntity(id, on) {
      const e = this.byId[id]; if (!e) return;
      e.visible = on;
      if (on && PICKUPS.has(e.type)) this.burstAt(e.def.x, e.def.y);
    }
    follow(id) {
      const e = this.byId[id]; if (!e) return;
      if (this.state.following && this.state.following !== id) this.unfollow(true);
      e.following = true; e.route = null;
      this.state.following = id;
      this.trail = [];
    }
    unfollow(wait) {
      const id = this.state.following, e = id && this.byId[id];
      if (e) {
        e.following = false; e.moving = false;
        if (wait) e.bubble = { text: 'I’ll wait right here!', t: 3, delay: 0 };
      }
      this.state.following = null;
    }
    walkTo(id, to) {
      const e = this.byId[id]; if (!e) return;
      e.route = { pts: [[tc(to[0]), tc(to[1])]], i: 0, speed: 120, delay: 0, hideAtEnd: false };
    }
    runEntity(v) {
      const e = this.byId[v.id]; if (!e) return;
      if (v.from) { e.x = tc(v.from[0]); e.y = tc(v.from[1]); }
      e.route = { pts: v.path.map(p => [tc(p[0]), tc(p[1])]), i: 0, speed: v.speed || 150, delay: v.delay || 0, hideAtEnd: !!v.hideAtEnd };
      e.visible = !(v.delay > 0);
    }
    bubble(v) {
      const e = this.byId[v.id]; if (!e) return;
      e.bubble = { text: v.text, t: v.time || 3, delay: v.delay || 0 };
    }
    openDoor(id) {
      const door = this.level.doors[id]; if (!door) return;
      this.world.applyDoor(door);
      this.groundDirty = true;
      this.buildObjects();
    }
    reveal(id) {
      const e = this.byId[id]; if (!e || !e.visible) return;
      e.revealed = true;
      this.hintArrow = { target: id, t: 8 };
    }
    giveSticker(id) {
      const st = N.stickerById(id); if (!st) return;
      const isNew = N.save.addSticker(id);
      if (!this.state.runStickers.includes(id)) this.state.runStickers.push(id);
      N.audio.play('sticker');
      N.ui.stickerToast(st, isNew);
    }
    giveCostume(id) {
      const isNew = N.save.addCostume(id);
      if (isNew && !this.state.newCostumes.includes(id)) this.state.newCostumes.push(id);
      N.ui.toast(isNew ? `<span>New costume: <b>${N.costumes[id].name}</b>!</span>` : `<span>Another cosy <b>${N.costumes[id].name}</b>!</span>`, { big: true });
    }
    burstAt(tx, ty, opts) {
      const o = opts || {};
      const n = this.calm ? 8 : (o.n || 22);
      const x = tc(tx), y = tc(ty);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = 40 + Math.random() * (this.calm ? 50 : 120);
        this.particles.push({ x, y: y - 10, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40, life: 0, max: 0.8 + Math.random() * 0.6,
          size: 2 + Math.random() * 3, color: o.color || ['#fff3a0', '#ffd54a', '#ffffff', '#ffb3cf'][i % 4], star: i % 3 === 0, grav: 60 });
      }
    }
    allStarsFound() { return this.state.stars.size >= this.starTotal; }

    entityMood(e) { return e && e.def.sad && this.story.check(e.def.sad) ? 'sad' : 'happy'; }
    entityLook(e) {
      const o = {};
      if (e && e.def.look) for (const k in e.def.look) o[k] = this.story.check(e.def.look[k]);
      return o;
    }
    portraitFor(who) {
      if (who === 'player') return N.art.portrait('player', { avatar: N.avatars[N.save.data.avatar], avatarIndex: N.save.data.avatar });
      const ch = N.characters[who] || N.characters.ninle;
      const e = this.byId[who];
      return N.art.portrait(ch.kind, Object.assign({ mood: this.entityMood(e) }, this.entityLook(e)));
    }

    /* ---------------- hints & HUD ---------------- */
    currentHint() {
      return this.level.hints.find(h => this.story.check(h.if)) || { goal: '' };
    }
    resolveTarget(target) {
      if (!target) return null;
      const p = this.player;
      const nearest = list => list.sort((a, b) => U.dist(a.x, a.y, p.x, p.y) - U.dist(b.x, b.y, p.x, p.y))[0] || null;
      if (target === 'star') return nearest(this.entities.filter(e => e.type === 'star' && e.visible));
      if (target.startsWith('item:')) { const it = target.slice(5); return nearest(this.entities.filter(e => e.type === 'item' && e.item === it && e.visible)); }
      const e = this.byId[target];
      return e && (e.visible || e.type !== 'spark') ? e : null;
    }
    showHint() {
      if (this.mode === 'platform' && this.runner && !this.story.active) { this.runner.hint(); return; }
      if (this.mode !== 'play' || this.story.active || this.paused) return;
      const h = this.currentHint();
      this.story.run([{ who: 'ninle', text: h.hint || 'Let’s explore!' }]);
      if (h.target) this.hintArrow = { target: h.target, t: 9 };
    }
    stateChanged() {
      const s = this.state, L = this.level;
      if (!s.flags.has('finale_done') && this.mode !== 'cutscene') s.duskTarget = L.dusk[Math.min(s.sparks, L.dusk.length - 1)];
      const h = this.currentHint();
      const goal = this.mode === 'platform' && this.runner ? this.runner.goalText() : (h.goal ? this.story.fmt(h.goal) : '');
      N.ui.updateHud({ sparks: s.sparks, stars: s.stars.size, starTotal: this.starTotal, goal });
    }

    /* ---------------- talking ---------------- */
    action() {
      if (this.paused) return;
      if (this.story.active) { N.ui.next(); return; }
      if (this.mode !== 'play') return;
      const e = this.target;
      if (!e) { N.audio.play('bump'); return; }
      N.audio.play('blip');
      if (e.type === 'npc') e.flip = this.player.x < e.x;
      if (e.type === 'sign') { this.story.run([{ who: 'sign', text: e.text }]); return; }
      const entry = (e.talk || []).find(t => this.story.check(t.if));
      if (entry) this.story.say(entry.say);
    }
    onDialogueStart() { N.input.clear(); this.player.moving = false; this.target = null; N.ui.setAction(null); }
    onDialogueEnd() { this.stateChanged(); }

    /* ---------------- update ---------------- */
    update(dt) {
      this.time += dt;
      if (this.paused) return;
      if (this.mode === 'platform' && this.runner) { this.runner.update(dt); return; }
      const playing = this.mode === 'play' && !this.story.active && !N.ui.blocking();
      if (playing) this.movePlayer(dt); else this.player.moving = false;
      this.updateEntities(dt);
      if (playing) { this.checkPickups(); this.checkTriggers(); }
      this.updateTarget(playing);
      this.updateNinle(dt);
      if (this.mode === 'cutscene') this.updateCut(dt);
      this.updateCamera(dt);
      const s = this.state;
      s.dusk = U.lerp(s.dusk, s.duskTarget == null ? s.dusk : s.duskTarget, 1 - Math.exp(-dt * 1.5));
      if (this.hintArrow) { this.hintArrow.t -= dt; if (this.hintArrow.t <= 0) this.hintArrow = null; }
      this.updateParticles(dt);
    }

    movePlayer(dt) {
      const d = N.input.dir(), p = this.player;
      const mag = Math.hypot(d.x, d.y);
      p.moving = mag > 0.12;
      if (!p.moving) return;
      const sp = 180 * Math.min(1, mag * 1.15);
      const nx = d.x / mag, ny = d.y / mag;
      this.tryMove(p, nx * sp * dt, 0);
      this.tryMove(p, 0, ny * sp * dt);
      if (Math.abs(d.x) > Math.abs(d.y) * 0.8) { p.face = 'side'; p.flip = d.x < 0; }
      else p.face = d.y < 0 ? 'up' : 'down';
      const last = this.trail[this.trail.length - 1];
      if (!last || U.dist(last.x, last.y, p.x, p.y) > 6) { this.trail.push({ x: p.x, y: p.y }); if (this.trail.length > 40) this.trail.shift(); }
      this.movedTime += dt;
      if (this.movedTime > 1.2) N.ui.hideControlsHint();
    }
    hits(x, y, r) {
      if (this.world.blocked(x, y, r)) return true;
      for (const e of this.entities) {
        if (!e.visible || !e.solid || e.following || e.route) continue;
        if (U.dist(x, y, e.x, e.y) < r + e.r) return e;
      }
      return false;
    }
    tryMove(p, dx, dy) {
      if (!dx && !dy) return;
      const nx = p.x + dx, ny = p.y + dy;
      const h = this.hits(nx, ny, p.r);
      if (!h) { p.x = nx; p.y = ny; return; }
      // Moving away from a character is always allowed (so you never get stuck).
      if (h !== true && U.dist(nx, ny, h.x, h.y) > U.dist(p.x, p.y, h.x, h.y)) { p.x = nx; p.y = ny; return; }
      // Gently slide around corners.
      const step = Math.abs(dx || dy);
      for (const off of [8, -8, 16, -16]) {
        const ox = dy ? off : 0, oy = dx ? off : 0;
        if (!this.hits(nx + ox, ny + oy, p.r) && !this.hits(p.x + Math.sign(ox) * step, p.y + Math.sign(oy) * step, p.r)) {
          p.x += Math.sign(ox) * step; p.y += Math.sign(oy) * step; return;
        }
      }
    }

    updateEntities(dt) {
      const p = this.player;
      for (const e of this.entities) {
        if (e.bubble) {
          if (e.bubble.delay > 0) e.bubble.delay -= dt;
          else { e.bubble.t -= dt; if (e.bubble.t <= 0) e.bubble = null; }
        }
        if (e.route) {
          const r = e.route;
          if (r.delay > 0) { r.delay -= dt; if (r.delay <= 0) e.visible = true; continue; }
          const [tx, ty] = r.pts[r.i];
          const d = U.dist(e.x, e.y, tx, ty), st = r.speed * dt;
          e.moving = true;
          if (Math.abs(tx - e.x) > 1) e.flip = tx < e.x;
          if (d <= st) { e.x = tx; e.y = ty; r.i++; if (r.i >= r.pts.length) { e.route = null; e.moving = false; if (r.hideAtEnd) e.visible = false; } }
          else { e.x += (tx - e.x) / d * st; e.y += (ty - e.y) / d * st; }
          continue;
        }
        if (e.following) {
          const tgt = this.trail.length > 8 ? this.trail[this.trail.length - 8] : null;
          const d = U.dist(e.x, e.y, p.x, p.y);
          e.moving = false;
          if (tgt && d > 40) {
            const dd = U.dist(e.x, e.y, tgt.x, tgt.y), st = Math.min(dd, 230 * dt);
            if (dd > 2) { e.x += (tgt.x - e.x) / dd * st; e.y += (tgt.y - e.y) / dd * st; e.moving = true; if (Math.abs(tgt.x - e.x) > 1) e.flip = tgt.x < e.x; }
          } else if (!tgt && d > 70) {
            const st = 200 * dt; e.x += (p.x - e.x) / d * st; e.y += (p.y - e.y) / d * st; e.moving = true; e.flip = p.x < e.x;
          }
          continue;
        }
        if (e.type === 'npc' && e.def.idle && e.visible && !e.bubble && !this.story.active && this.mode === 'play') {
          if (U.dist(e.x, e.y, p.x, p.y) < 260) {
            e.idleCd -= dt;
            if (e.idleCd <= 0) {
              const it = e.def.idle.find(i => this.story.check(i.if));
              if (it) e.bubble = { text: it.text, t: 2.8, delay: 0 };
              e.idleCd = 6;
            }
          }
        }
      }
    }

    checkPickups() {
      const p = this.player;
      for (const e of this.entities) {
        if (!e.visible || !PICKUPS.has(e.type)) continue;
        if (U.dist(p.x, p.y, e.x, e.y) < 32) this.collect(e);
      }
    }
    collect(e) {
      const s = this.state, L = this.level;
      e.visible = false;
      s.flags.add('got_' + e.id);
      this.burstAt(e.def.x, e.def.y, { n: e.type === 'spark' ? 36 : 18 });
      if (e.type === 'star') {
        s.stars.add(e.id); N.save.markStar(L.id, e.id);
        N.audio.play('star');
        N.ui.toast(`<span class="toast-star">★</span> Wonder Star! <b>${s.stars.size}/${this.starTotal}</b>`);
        if (this.allStarsFound()) this.giveSticker('stars');
      } else if (e.type === 'item') {
        s.items[e.item] = (s.items[e.item] || 0) + 1;
        const def = L.items[e.item];
        N.audio.play('item');
        N.ui.toast(`🪵 ${def.name} <b>${s.items[e.item]}/${def.total}</b>`);
      } else if (e.type === 'spark') {
        s.sparks++;
        N.audio.play('spark');
        N.ui.toast(`✨ A lantern spark! <b>${s.sparks}/3</b>`, { big: true });
        N.ui.pulseSparks();
      }
      if (e.def.do) this.story.apply(e.def.do);
      this.stateChanged();
      if (e.type === 'spark' && L.events && L.events.spark) {
        const ev = L.events.spark.find(x => this.story.check(x.if));
        if (ev) this.story.say(ev.say);
      }
    }

    checkTriggers() {
      const p = this.player, tx = Math.floor(p.x / T), ty = Math.floor(p.y / T);
      for (const tr of this.level.triggers || []) {
        if (this.fired.has(tr.id)) continue;
        const [x1, y1, x2, y2] = tr.area;
        if (tx < x1 || tx > x2 || ty < y1 || ty > y2) continue;
        if (!this.story.check(tr.if)) continue;
        this.fired.add(tr.id);
        if (tr.do) this.story.apply(tr.do);
        if (tr.say) { this.story.say(tr.say); return; }
      }
    }

    updateTarget(playing) {
      let best = null, bd = 1e9;
      if (playing) {
        const p = this.player;
        for (const e of this.entities) {
          if (!e.visible || e.following || e.route) continue;
          if (!(e.talk || e.text)) continue;
          const d = U.dist(p.x, p.y, e.x, e.y) - e.r;
          if (d < 60 && d < bd) { bd = d; best = e; }
        }
      }
      if (best !== this.target) {
        this.target = best;
        N.ui.setAction(best ? (best.type === 'sign' ? 'Read' : (best.type === 'greatLantern' || best.type === 'portal') ? 'Look' : 'Talk') : null, false);
      }
    }

    updateNinle(dt) {
      const p = this.player, n = this.ninle;
      const side = p.flip ? 1 : -1;
      const bob = this.calm ? 0 : Math.sin(this.time * 2.6) * 5;
      const tx = p.x + side * 26, ty = p.y - 50 + bob;
      const k = 1 - Math.exp(-dt * 4);
      if (Math.abs(tx - n.x) > 2) n.flip = tx < n.x;
      n.x = U.lerp(n.x, tx, k); n.y = U.lerp(n.y, ty, k);
    }

    viewSize() { return { w: this.vw / this.zoom, h: this.vh / this.zoom }; }
    camTarget() {
      if (this.mode === 'title') {
        const W = this.world.w * T;
        const t = this.calm ? 0 : this.time;
        return { x: W / 2 + Math.sin(t * 0.06) * W * 0.28, y: tc(14) + Math.sin(t * 0.045) * T * 5 };
      }
      if (this.mode === 'cutscene' && this.cut) return this.cut.focus;
      return { x: this.player.x, y: this.player.y - 20 + this.dialogueRoom() / 2 };
    }
    /* While the dialogue box is open, let the camera scroll a little past the
       bottom edge so the explorer is never hidden behind the box. */
    dialogueRoom() {
      if (this.mode === 'cutscene' || !this.story.active) return 0;
      const el = document.getElementById('dialogue');
      return el && !el.classList.contains('hidden') ? (el.offsetHeight + 20) / this.zoom : 0;
    }
    clampCam(c) {
      const v = this.viewSize(), W = this.world.w * T, H = this.world.h * T + this.dialogueRoom();
      c.x = v.w >= W ? (W - v.w) / 2 : U.clamp(c.x, 0, W - v.w);
      c.y = v.h >= H ? (H - v.h) / 2 : U.clamp(c.y, 0, H - v.h);
    }
    snapCamera() {
      const t = this.camTarget(), v = this.viewSize();
      this.cam.x = t.x - v.w / 2; this.cam.y = t.y - v.h / 2; this.clampCam(this.cam);
    }
    updateCamera(dt) {
      const t = this.camTarget(), v = this.viewSize();
      const goal = { x: t.x - v.w / 2, y: t.y - v.h / 2 }; this.clampCam(goal);
      const speed = this.mode === 'cutscene' ? 3 : (this.mode === 'title' ? 2 : 7);
      const k = 1 - Math.exp(-dt * speed);
      this.cam.x = U.lerp(this.cam.x, goal.x, k); this.cam.y = U.lerp(this.cam.y, goal.y, k);
    }

    updateParticles(dt) {
      const ps = this.particles;
      for (let i = ps.length - 1; i >= 0; i--) {
        const q = ps[i];
        q.life += dt;
        if (q.life >= q.max) { ps.splice(i, 1); continue; }
        if (q.home) {
          const k = Math.min(1, q.life / q.max); const e = U.easeInOut(k);
          q.x = U.lerp(q.sx, q.home.x, e) + Math.sin(k * Math.PI) * q.arc;
          q.y = U.lerp(q.sy, q.home.y, e) - Math.sin(k * Math.PI) * 60;
        } else {
          q.vy += (q.grav || 0) * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.97;
        }
      }
    }

    /* ---------------- the grand finale ---------------- */
    startFinale() {
      const L = this.level, p = this.player, gl = this.byId.greatLantern;
      this.mode = 'cutscene';
      this.unfollow();
      N.input.clear();
      N.ui.setAction(null, true);
      N.ui.hideHudForCutscene(true);
      N.audio.play('finale');
      this.cut = { phase: 'sparks', t: 0, idx: 0, focus: { x: (p.x + gl.x) / 2, y: gl.y }, next: 0 };
      for (let i = 0; i < 3; i++) {
        this.particles.push({ x: p.x, y: p.y - 30, sx: p.x + (i - 1) * 24, sy: p.y - 40, home: { x: gl.x, y: gl.y - 52 }, arc: (i - 1) * 50,
          life: -i * 0.2, max: 1.4, size: 9, color: '#ffe46b', glow: true });
      }
    }
    updateCut(dt) {
      const c = this.cut, L = this.level, s = this.state, gl = this.byId.greatLantern;
      const lanterns = this.entities.filter(e => e.type === 'lantern');
      c.t += dt;
      if (c.phase === 'sparks') {
        if (c.t > 1.8) {
          s.greatLit = true; s.duskTarget = 0.06;
          this.burstAt(gl.def.x, gl.def.y - 1, { n: 40 });
          N.audio.play('spark');
          c.phase = 'trail'; c.t = 0; c.idx = lanterns.length - 1; c.next = 0.5;
        }
      } else if (c.phase === 'trail') {
        if (this.calm) {
          lanterns.forEach(l => { l.lit = true; });
          c.idx = -1; N.audio.play('lantern', 4);
        }
        while (c.idx >= 0 && c.t >= c.next) {
          const l = lanterns[c.idx];
          l.lit = true; c.focus = { x: l.x, y: l.y };
          this.burstAt(l.def.x, l.def.y, { n: 10 });
          N.audio.play('lantern', lanterns.length - 1 - c.idx);
          c.idx--; c.next += 0.42;
        }
        if (c.idx < 0 && c.t >= c.next + 0.6) {
          // friends gather at the Great Lantern while the camera is away
          (L.finale.gather || []).forEach(g => {
            const e = this.byId[g.id];
            if (e && this.story.check(g.if)) { e.x = tc(g.x); e.y = tc(g.y); e.route = null; e.following = false; e.visible = true; e.flip = e.x > gl.x; }
          });
          const v = this.player;
          v.x = gl.x + 52; v.y = gl.y + 30; v.face = 'up';
          c.phase = 'return'; c.t = 0; c.focus = { x: tc(L.lanternGate.x) + T / 2, y: tc(7) };
        }
      } else if (c.phase === 'return') {
        if (c.t > (this.calm ? 0.6 : 1.8)) {
          this.openDoor(L.finale.door);
          if (L.finale.reveal) this.openDoor(L.finale.reveal);
          N.audio.play('gate');
          c.phase = 'reveal'; c.t = 0;
        }
      } else if (c.phase === 'reveal') {
        s.fogA = Math.max(0, 1 - c.t / 2.6);
        s.gateOpen = Math.min(1, c.t / 1.4);
        s.duskTarget = 0;
        if (c.t > 1 && c.t - dt <= 1) for (let i = 0; i < 6; i++) this.burstAt(14 + i * 3, 3, { n: 8 });
        c.focus = { x: tc(L.lanternGate.x) + T / 2, y: tc(5) };
        if (c.t > 3.2) {
          s.flags.add('finale_done');
          this.cut = null; this.mode = 'play';
          N.ui.hideHudForCutscene(false);
          this.stateChanged();
          this.story.say(L.finale.dialogue);
        }
      }
    }
    /* ---------------- side-scrolling runs ---------------- */
    startRun(id) {
      const def = N.runs && N.runs[id]; if (!def) return;
      const replay = this.state.flags.has('got_' + def.reward);
      N.ui.fade(() => {
        this.unfollow();
        N.input.clear();
        this.runner = new N.Platformer(this, def, replay);
        this.mode = 'platform';
        document.body.classList.add('mode-run');
        N.ui.setActionMode('jump');
        N.ui.hideControlsHint();
        this.stateChanged();
        this.story.run(def.intro);
        if (N.input.touch && this.vh > this.vw) this.story.defer(() => N.ui.toast('<span>📱 Tip: turn your device sideways for a bigger view!</span>'));
      });
    }
    endRun(success) {
      const def = this.runner && this.runner.def;
      if (!def) return;
      const hearts = this.runner.hearts;
      N.ui.fade(() => {
        this.runner = null;
        this.mode = 'play';
        document.body.classList.remove('mode-run');
        N.ui.setActionMode('talk');
        N.input.clear();
        this.state.hearts = Math.max(this.state.hearts || 0, hearts);
        const portal = this.entities.find(e => e.type === 'portal');
        if (portal) { this.player.x = portal.x; this.player.y = portal.y + 56; this.player.face = 'down'; }
        this.snapCamera();
        this.stateChanged();
        if (success) {
          if (def.sticker) this.giveSticker(def.sticker);
          const reward = this.byId[def.reward];
          if (reward && !this.state.flags.has('got_' + reward.id)) {
            reward.x = this.player.x; reward.y = this.player.y;
            this.collect(reward);
          }
        }
      });
    }

    celebrate() {
      if (this.calm) return;
      const v = this.viewSize(), cols = ['#ff7a59', '#ffcf4a', '#5cbf6a', '#4fb8e8', '#c59bff', '#ff8fb1'];
      for (let i = 0; i < 90; i++) {
        this.particles.push({ x: this.cam.x + Math.random() * v.w, y: this.cam.y - 20 - Math.random() * 200, vx: (Math.random() - 0.5) * 40,
          vy: 50 + Math.random() * 90, life: 0, max: 4 + Math.random() * 2, size: 3 + Math.random() * 3, color: cols[i % cols.length], star: i % 4 === 0, grav: 10 });
      }
    }
    showReflection() {
      N.ui.showReflection(this.level.reflection, () => this.finish());
    }
    finish() {
      const L = this.level;
      if (L.finale.sticker) { N.save.addSticker(L.finale.sticker); if (!this.state.runStickers.includes(L.finale.sticker)) this.state.runStickers.push(L.finale.sticker); }
      if (L.finale.costume && N.save.addCostume(L.finale.costume) && !this.state.newCostumes.includes(L.finale.costume)) this.state.newCostumes.push(L.finale.costume);
      N.save.data.completions = (N.save.data.completions || 0) + 1; N.save.write();
      N.audio.play('sticker');
      const missed = [];
      if (!this.state.flags.has('found_shrubbert')) missed.push('Psst… one of the bushes in the bottom-right corner looks a bit… woolly.');
      if (!this.allStarsFound()) missed.push(`There are still ${this.starTotal - this.state.stars.size} Wonder Stars hiding in the valley.`);
      if (!this.state.flags.has('juniper_done')) missed.push('Someone in the orchard could still use a friend.');
      N.ui.showEnding({ stickers: this.state.runStickers.slice(), costumes: this.state.newCostumes.slice(), stars: this.state.stars.size, starTotal: this.starTotal, secret: missed[0] || '' });
    }

    /* ---------------- drawing ---------------- */
    render() {
      const c = this.ctx, z = this.zoom, s = this.dpr * z;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.fillStyle = '#2f6b3c'; c.fillRect(0, 0, this.canvas.width, this.canvas.height);
      if (!this.world) return;
      if (this.mode === 'platform' && this.runner) { this.runner.render(); return; }
      this.ensureGround();
      if (this.objVersion !== this.world.version) this.buildObjects();
      const v = this.viewSize();
      const camX = Math.round(this.cam.x * s) / s, camY = Math.round(this.cam.y * s) / s;
      c.setTransform(s, 0, 0, s, -camX * s, -camY * s);
      c.imageSmoothingEnabled = true;

      const W = this.world.w * T, H = this.world.h * T, S = this.groundScale;
      const sx = Math.max(0, camX), sy = Math.max(0, camY);
      const sw = Math.min(W - sx, v.w + 2), sh = Math.min(H - sy, v.h + 2);
      if (sw > 0 && sh > 0) c.drawImage(this.groundCache, sx * S, sy * S, sw * S, sh * S, sx, sy, sw, sh);

      const view = { x0: Math.max(0, Math.floor(camX / T) - 1), y0: Math.max(0, Math.floor(camY / T) - 1),
        x1: Math.min(this.world.w - 1, Math.ceil((camX + v.w) / T)), y1: Math.min(this.world.h - 1, Math.ceil((camY + v.h) / T)) };
      if (!this.calm) N.art.waterShimmer(c, this.world, view, this.time);
      N.art.drawFog(c, this.world, this.state.fogA, this.time, this.calm);

      // depth-sorted things
      const list = [];
      const inView = (x, y, pad) => x > camX - pad && x < camX + v.w + pad && y > camY - 40 && y < camY + v.h + 170;
      for (const o of this.objects) if (inView(o.x, o.y, o.kind === 'tile' ? 70 : 200)) list.push(o);
      for (const e of this.entities) if (e.visible && inView(e.x, e.y, 80)) list.push({ kind: 'ent', e, y: e.y + (PICKUPS.has(e.type) ? -2 : 0) });
      if (this.mode !== 'title') list.push({ kind: 'player', y: this.player.y });
      list.sort((a, b) => a.y - b.y);
      for (const o of list) this.drawThing(c, o);

      if (this.mode !== 'title') N.art.drawChar(c, 'ninle', this.ninle.x, this.ninle.y, { t: this.time, flip: this.ninle.flip, calm: this.calm, blink: N.art.isBlink(this.time, 3) });
      this.drawParticles(c);
      this.drawOverlays(c);
      this.renderLighting(camX, camY);
    }

    drawThing(c, o) {
      const t = this.time, calm = this.calm, art = N.art;
      if (o.kind === 'tile') return art.drawTileObject(c, this.world, o.tx, o.ty, o.ch);
      if (o.kind === 'house') { const h = this.level.house; return art.drawHouse(c, h.x, h.y, h.w, h.h); }
      if (o.kind === 'gate') { const g = this.level.lanternGate; return art.drawLanternGate(c, g.x, g.y, this.state.gateOpen, this.state.greatLit); }
      if (o.kind === 'player') {
        const p = this.player, wear = {};
        for (const k in N.save.data.wear) if (N.save.data.wear[k] && N.save.data.costumes[k]) wear[k] = true;
        return art.drawPlayer(c, p.x, p.y + 10, { avatar: N.avatars[N.save.data.avatar] || N.avatars[0], t, moving: p.moving, face: p.face, flip: p.flip, calm, wear, blink: art.isBlink(t, 1) });
      }
      const e = o.e;
      switch (e.type) {
        case 'npc': {
          const look = this.entityLook(e);
          if (e.def.peek) look.peek = U.dist(this.player.x, this.player.y, e.x, e.y) < 130;
          art.drawChar(c, N.characters[e.char].kind, e.x, e.y + 12, Object.assign({ t, flip: e.flip, mood: this.entityMood(e), moving: e.moving, calm, seed: e.seed, blink: art.isBlink(t, e.seed) }, look));
          break;
        }
        case 'sign': art.drawSignObj(c, e.x, e.y + 12); break;
        case 'lantern': art.drawLanternPost(c, e.x - 4, e.y + 14, e.lit, t); break;
        case 'greatLantern': art.drawGreatLantern(c, e.x, e.y + 14, this.state.greatLit, t); break;
        case 'portal': art.drawPortal(c, e.x, e.y + 16, t, calm); break;
        case 'star': art.drawStarPickup(c, e.x, e.y, t, calm, e.revealed); break;
        case 'spark': art.drawSpark(c, e.x, e.y, t, calm); break;
        case 'item': art.drawPlank(c, e.x, e.y, t, calm); break;
      }
    }

    drawParticles(c) {
      for (const q of this.particles) {
        if (q.life < 0) continue;
        const a = q.home ? 1 : 1 - q.life / q.max;
        c.globalAlpha = Math.max(0, a);
        if (q.glow) {
          const g = c.createRadialGradient(q.x, q.y, 1, q.x, q.y, q.size * 3);
          g.addColorStop(0, 'rgba(255,250,210,1)'); g.addColorStop(1, 'rgba(255,200,60,0)');
          c.fillStyle = g; c.beginPath(); c.arc(q.x, q.y, q.size * 3, 0, Math.PI * 2); c.fill();
        } else if (q.star) {
          N.art.drawStar(c, q.x, q.y, q.size * 1.6, q.size * 0.7, q.color);
        } else {
          c.fillStyle = q.color; c.beginPath(); c.arc(q.x, q.y, q.size, 0, Math.PI * 2); c.fill();
        }
      }
      c.globalAlpha = 1;
    }

    drawOverlays(c) {
      const t = this.time, calm = this.calm;
      if (this.mode === 'title') return;
      // "!" above characters with something important to say
      if (!this.story.active && this.mode === 'play') {
        for (const e of this.entities) {
          if (!e.visible || !['npc', 'greatLantern', 'portal'].includes(e.type) || !e.talk || e.route || e.following) continue;
          const entry = e.talk.find(x => this.story.check(x.if));
          if (!entry || !entry.mark) continue;
          const by = e.y - (e.type === 'greatLantern' ? 104 : 62) + (calm ? 0 : Math.sin(t * 3 + e.seed) * 3);
          c.beginPath(); c.arc(e.x, by, 11, 0, Math.PI * 2); c.fillStyle = '#ffcf3a'; c.fill(); c.lineWidth = 2.5; c.strokeStyle = '#3b2a3f'; c.stroke();
          c.fillStyle = '#3b2a3f'; c.font = `900 16px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('!', e.x, by + 1);
        }
        // the talk target gets a soft ring
        if (this.target) {
          const e = this.target;
          c.beginPath(); c.ellipse(e.x, e.y + 14, e.r + 10, (e.r + 10) * 0.38, 0, 0, Math.PI * 2);
          c.lineWidth = 3; c.strokeStyle = 'rgba(255,207,58,.95)'; c.stroke();
        }
      }
      // speech bubbles
      for (const e of this.entities) {
        if (!e.bubble || e.bubble.delay > 0 || !e.visible) continue;
        const v = this.viewSize();
        this.drawBubble(c, U.clamp(e.x, this.cam.x + 95, this.cam.x + v.w - 95), Math.max(e.y - 58, this.cam.y + 120), e.bubble.text);
      }
      // hint arrow
      if (this.hintArrow && this.mode === 'play') {
        const tg = this.resolveTarget(this.hintArrow.target);
        if (tg) {
          const p = this.player;
          const d = U.dist(p.x, p.y, tg.x, tg.y);
          const pulse = calm ? 0 : Math.sin(t * 4) * 4;
          if (d > 110) {
            const a = Math.atan2(tg.y - p.y, tg.x - p.x);
            c.save(); c.translate(p.x + Math.cos(a) * (58 + pulse), p.y - 10 + Math.sin(a) * (58 + pulse)); c.rotate(a);
            c.beginPath(); c.moveTo(18, 0); c.lineTo(-4, -15); c.lineTo(-4, -6); c.lineTo(-16, -6); c.lineTo(-16, 6); c.lineTo(-4, 6); c.lineTo(-4, 15); c.closePath();
            c.fillStyle = '#ffcf3a'; c.fill(); c.lineWidth = 3; c.lineJoin = 'round'; c.strokeStyle = '#3b2a3f'; c.stroke();
            c.restore();
          }
          c.beginPath(); c.ellipse(tg.x, tg.y + 12, 30 + pulse, 12 + pulse * 0.4, 0, 0, Math.PI * 2);
          c.lineWidth = 3; c.setLineDash([6, 6]); c.strokeStyle = 'rgba(255,207,58,.95)'; c.stroke(); c.setLineDash([]);
        }
      }
    }

    drawBubble(c, x, y, text) {
      c.font = `800 14px ${FONT}`;
      const words = text.split(' '), lines = []; let cur = '';
      for (const w of words) { const test = cur ? cur + ' ' + w : w; if (c.measureText(test).width > 150 && cur) { lines.push(cur); cur = w; } else cur = test; }
      lines.push(cur);
      const lw = Math.max(...lines.map(l => c.measureText(l).width)) + 20, lh = lines.length * 17 + 12;
      const bx = x - lw / 2, by = y - lh;
      c.beginPath();
      const r = 10;
      c.moveTo(bx + r, by); c.arcTo(bx + lw, by, bx + lw, by + lh, r); c.arcTo(bx + lw, by + lh, bx, by + lh, r);
      c.lineTo(x + 6, by + lh); c.lineTo(x, by + lh + 9); c.lineTo(x - 6, by + lh);
      c.arcTo(bx, by + lh, bx, by, r); c.arcTo(bx, by, bx + lw, by, r); c.closePath();
      c.fillStyle = '#fffaf0'; c.fill(); c.lineWidth = 2.5; c.strokeStyle = '#3b2a3f'; c.stroke();
      c.fillStyle = '#2f2342'; c.textAlign = 'center'; c.textBaseline = 'top';
      lines.forEach((l, i) => c.fillText(l, x, by + 7 + i * 17));
    }

    renderLighting(camX, camY) {
      const s = this.state, a = s.dusk;
      const c = this.ctx, L = this.lctx, ls = this.lightScale * this.zoom;
      const lights = [];
      const p = this.player;
      if (this.mode !== 'title') lights.push([p.x, p.y - 10, 170, 1]);
      for (const e of this.entities) {
        if (!e.visible) continue;
        if (e.type === 'lantern' && e.lit) lights.push([e.x + 6, e.y - 10, 130, 1]);
        else if (e.type === 'greatLantern' && s.greatLit) lights.push([e.x, e.y - 40, 300, 1]);
        else if (e.type === 'spark') lights.push([e.x, e.y - 16, 110, 1]);
        else if (e.type === 'portal') lights.push([e.x, e.y - 10, 120, 1]);
        else if (e.type === 'star') lights.push([e.x, e.y - 10, e.revealed ? 80 : 55, 0.8]);
      }
      if (s.gateOpen > 0) lights.push([tc(22), tc(3), 420 * s.gateOpen, 1]);
      if (a > 0.01) {
        L.setTransform(1, 0, 0, 1, 0, 0);
        L.globalCompositeOperation = 'source-over';
        L.clearRect(0, 0, this.light.width, this.light.height);
        L.fillStyle = `rgba(40,26,92,${a.toFixed(3)})`;
        L.fillRect(0, 0, this.light.width, this.light.height);
        L.globalCompositeOperation = 'destination-out';
        for (const [x, y, r, k] of lights) {
          const sx = (x - camX) * ls, sy = (y - camY) * ls, sr = r * ls;
          if (sx < -sr || sy < -sr || sx > this.light.width + sr || sy > this.light.height + sr) continue;
          const g = L.createRadialGradient(sx, sy, 0, sx, sy, sr);
          g.addColorStop(0, `rgba(0,0,0,${k})`); g.addColorStop(0.55, `rgba(0,0,0,${k * 0.6})`); g.addColorStop(1, 'rgba(0,0,0,0)');
          L.fillStyle = g; L.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
        }
        L.globalCompositeOperation = 'source-over';
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.drawImage(this.light, 0, 0, this.canvas.width, this.canvas.height);
      }
      // warm glow from lit lanterns
      const z = this.zoom * this.dpr;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.globalCompositeOperation = 'lighter';
      for (const e of this.entities) {
        const lit = (e.type === 'lantern' && e.lit) || (e.type === 'greatLantern' && s.greatLit);
        if (!lit || !e.visible) continue;
        const r = (e.type === 'greatLantern' ? 120 : 60) * z;
        const sx = (e.x + (e.type === 'lantern' ? 6 : 0) - camX) * z, sy = (e.y - (e.type === 'lantern' ? 10 : 40) - camY) * z;
        if (sx < -r || sy < -r || sx > this.canvas.width + r || sy > this.canvas.height + r) continue;
        const g = c.createRadialGradient(sx, sy, 0, sx, sy, r);
        g.addColorStop(0, 'rgba(255,190,90,.28)'); g.addColorStop(1, 'rgba(255,190,90,0)');
        c.fillStyle = g; c.fillRect(sx - r, sy - r, r * 2, r * 2);
      }
      c.globalCompositeOperation = 'source-over';
    }
  }
  N.Game = Game;
})(window.Ninle);
