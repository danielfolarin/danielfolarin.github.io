/* Wayfinder — side-scrolling exploration engine.
 * Renders an area's scene in parallax layers, moves the traveller, tracks nearby hotspots,
 * and reports interactions back to the game. It knows nothing about story content. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const { h } = WF;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const MARGIN = 1400;     // extra drawn width on each side of every layer
  const SPEED = 250;       // world units per second
  const REACH = 115;       // how close you must be to interact
  const MIN_VIEW = 640;    // minimum visible world width (keeps phones readable)

  class World {
    /**
     * opts: { stage, area, state, onInteract(hs), onExit(), onBlocked(), onNear(hs|null), startX }
     */
    constructor(opts) {
      Object.assign(this, opts);
      this.scene = WF.art.scenes[this.area.scene];
      this.W = this.area.width || 2000;
      this.x = opts.startX || 110;
      this.camX = 0;
      this.keyDir = 0;
      this.btnDir = 0;
      this.target = null;
      this.pending = null;
      this.facing = 1;
      this.enabled = true;
      this.near = null;
      this.exited = false;
      this.lastBlocked = 0;
      this.hotspots = (this.area.hotspots || []).map((hs) => Object.assign({ fx: hs.x }, hs));
      this.raf = 0;
      this.last = 0;
      this.onResize = () => this.resize();
    }

    mount() {
      const stage = this.stage;
      stage.replaceChildren();
      stage.className = `stage scene-${this.area.scene}`;
      stage.style.setProperty('--ground-fill', this.scene.groundFill);
      stage.hidden = false;

      this.skyEl = h('div', { class: 'layer layer-sky' });
      stage.append(this.skyEl);

      this.layerEls = [];
      const x0 = -MARGIN;
      const x1 = this.W + MARGIN;
      this.scene.layers.forEach((L, i) => {
        const div = h('div', { class: `layer${L.f === 1 ? ' layer-world' : ''}${L.f > 1 ? ' layer-fg' : ''}` });
        let inner = L.draw(x0, x1);
        if (L.f === 1) inner += '<g class="hotspots"></g><g class="actors"></g><g class="veils"></g>';
        div.innerHTML = `<svg xmlns="${SVGNS}" viewBox="${x0} 0 ${x1 - x0} ${WF.WORLD_H}" preserveAspectRatio="none">${inner}</svg>`;
        stage.append(div);
        this.layerEls.push({ el: div, f: L.f, svg: div.firstChild });
        if (L.f === 1) this.worldSvg = div.firstChild;
      });

      this.fillEl = h('div', { class: 'ground-fill' });
      stage.append(this.fillEl);
      this.fxEl = h('div', { class: 'fx-layer' }, Array.from({ length: 14 }, (_, i) => h('i', { class: 'mote', style: { left: `${(i * 37) % 100}%`, top: `${20 + ((i * 53) % 60)}%`, animationDelay: `${-i * 1.7}s` } })));
      stage.append(this.fxEl);
      this.labelsEl = h('div', { class: 'labels' });
      stage.append(this.labelsEl);

      // Hotspots
      const hsGroup = this.worldSvg.querySelector('.hotspots');
      this.hotspots.forEach((hs) => {
        const g = document.createElementNS(SVGNS, 'g');
        g.setAttribute('class', `hs hs-${hs.kind || 'object'}`);
        g.dataset.id = hs.id;
        g.innerHTML = `<ellipse class="hs-glow" cx="0" cy="${-(hs.glowY || 30)}" rx="${hs.glowR || 60}" ry="${(hs.glowR || 60) * 0.8}" fill="url(#wf-soft)"/><g class="hs-art"></g><g class="hs-spark"><path d="M0,-6 L1.5,-1.5 L6,0 L1.5,1.5 L0,6 L-1.5,1.5 L-6,0 L-1.5,-1.5Z" fill="#fff4d6"/></g>`;
        g.querySelector('.hs-spark').setAttribute('transform', `translate(0,${-(hs.sparkY || 80)})`);
        g.addEventListener('click', (e) => { e.stopPropagation(); this.tapHotspot(hs); });
        hsGroup.append(g);
        hs.g = g;
        hs.labelEl = h('div', { class: 'hs-label', text: hs.label });
        this.labelsEl.append(hs.labelEl);
      });

      // Exit waymark
      const actors = this.worldSvg.querySelector('.actors');
      this.exitG = document.createElementNS(SVGNS, 'g');
      this.exitG.setAttribute('class', 'exit-post');
      this.exitG.setAttribute('transform', `translate(${this.W - 70},${WF.GROUND})`);
      this.exitG.innerHTML = WF.art.props.exitPost();
      actors.append(this.exitG);

      // Player
      this.playerG = document.createElementNS(SVGNS, 'g');
      this.playerG.setAttribute('class', 'player');
      this.playerG.innerHTML = `<g class="flip">${WF.art.figures.traveller()}</g>`;
      actors.append(this.playerG);
      this.flipG = this.playerG.firstChild;

      // Optional darkness veil (lifts as the player lights waymarks)
      if (this.area.veil) {
        const v = document.createElementNS(SVGNS, 'rect');
        v.setAttribute('x', this.area.veil.from);
        v.setAttribute('y', '-50');
        v.setAttribute('width', this.W - this.area.veil.from + MARGIN);
        v.setAttribute('height', '700');
        v.setAttribute('fill', 'url(#wf-veil)');
        v.setAttribute('class', 'veil-rect');
        this.worldSvg.querySelector('.veils').append(v);
        this.veilRect = v;
      }

      // Tap the ground to walk there
      stage.addEventListener('click', (e) => {
        if (!this.enabled) return;
        const rect = stage.getBoundingClientRect();
        this.target = WF.clamp(this.camX + (e.clientX - rect.left) / this.scale, 40, this.W - 40);
        this.pending = null;
      });

      window.addEventListener('resize', this.onResize);
      this.resize();
      this.refresh();
      this.updateCamera(true);
      this.last = performance.now();
      const loop = (t) => {
        this.frame(Math.min(0.05, (t - this.last) / 1000));
        this.last = t;
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }

    destroy() {
      cancelAnimationFrame(this.raf);
      window.removeEventListener('resize', this.onResize);
      this.stage.replaceChildren();
      this.stage.hidden = true;
    }

    resize() {
      const W = this.stage.clientWidth || window.innerWidth;
      const Hh = this.stage.clientHeight || window.innerHeight;
      const controlsH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--controls-h')) || 100;
      this.scale = Math.min(Hh / WF.WORLD_H, W / MIN_VIEW, 1.7);
      this.viewW = W / this.scale;
      // Keep the path above the touch controls; fill any gap below with ground colour.
      this.top = Math.min(Hh - WF.WORLD_H * this.scale, Hh - controlsH - 18 - WF.GROUND * this.scale);
      const worldH = WF.WORLD_H * this.scale;
      this.layerEls.forEach(({ el, svg }) => {
        el.style.top = `${this.top}px`;
        el.style.height = `${worldH}px`;
        svg.setAttribute('width', ((this.W + 2 * MARGIN) * this.scale).toFixed(1));
        svg.setAttribute('height', worldH.toFixed(1));
      });
      this.fillEl.style.top = `${this.top + worldH - 2}px`;
      // Sky in world units covering the whole stage.
      const skyTop = -this.top / this.scale;
      const skyH = Hh / this.scale;
      this.skyEl.innerHTML = `<svg xmlns="${SVGNS}" viewBox="0 ${skyTop.toFixed(1)} ${this.viewW.toFixed(1)} ${skyH.toFixed(1)}" preserveAspectRatio="none" width="100%" height="100%">${WF.art.sky(this.scene, `w-${this.area.id}`, this.viewW, skyTop, skyH)}</svg>`;
      this.updateCamera(true);
    }

    setKeyDir(d) { this.keyDir = d; if (d) { this.target = null; this.pending = null; } }
    setBtnDir(d) { this.btnDir = d; if (d) { this.target = null; this.pending = null; } }
    get moving() { return this.enabled && (this.keyDir || this.btnDir || this.target != null); }

    tapHotspot(hs) {
      if (!this.enabled || !this.isVisible(hs)) return;
      if (Math.abs(hs.fx - this.x) <= REACH) { this.onInteract(hs); return; }
      this.target = hs.fx + (hs.fx > this.x ? -60 : 60);
      this.pending = hs;
    }

    interactNear() {
      if (this.enabled && this.near) this.onInteract(this.near);
    }

    isVisible(hs) { return WF.test(hs.when, this.state); }
    isDone(hs) { return !!this.state.flags[`seen:${hs.id}`]; }

    /** Re-evaluate visibility and art after story state changes. */
    refresh() {
      this.hotspots.forEach((hs) => {
        const vis = this.isVisible(hs);
        hs.g.style.display = vis ? '' : 'none';
        if (!vis) hs.labelEl.classList.remove('show');
        const variant = hs.litFlag ? !!this.state.flags[hs.litFlag] : false;
        if (hs.variant !== variant || !hs.drawn) {
          const art = WF.art.props[hs.art];
          hs.g.querySelector('.hs-art').innerHTML = art ? art(variant) : '';
          hs.variant = variant;
          hs.drawn = true;
        }
        hs.g.classList.toggle('done', this.isDone(hs));
      });
      const open = this.exitOpen();
      this.exitG.classList.toggle('open', open);
      if (this.veilRect) {
        const need = this.area.veil.lifts;
        const lit = need.filter((f) => this.state.flags[f]).length;
        this.veilRect.style.opacity = String(1 - lit / need.length);
      }
    }

    exitOpen() { return WF.test({ flags: this.area.exitRequires || [] }, this.state); }

    frame(dt) {
      let dir = this.enabled ? (this.keyDir || this.btnDir) : 0;
      if (this.enabled && !dir && this.target != null) {
        const dx = this.target - this.x;
        if (Math.abs(dx) < 6) {
          this.target = null;
          if (this.pending) { const hs = this.pending; this.pending = null; this.onInteract(hs); }
        } else dir = Math.sign(dx);
      }
      if (dir) {
        this.facing = dir;
        this.x += dir * SPEED * dt;
        if (this.target != null && Math.sign(this.target - this.x) !== dir) this.x = this.target;
      }
      const open = this.exitOpen();
      const maxX = open ? this.W - 30 : this.W - 130;
      if (this.x > maxX) {
        this.x = maxX;
        this.target = null;
        if (!open && dir > 0 && performance.now() - this.lastBlocked > 3500) {
          this.lastBlocked = performance.now();
          this.onBlocked && this.onBlocked();
        }
      }
      if (this.x < 50) { this.x = 50; this.target = null; }
      if (open && !this.exited && this.x >= this.W - 75) {
        this.exited = true;
        this.enabled = false;
        this.onExit();
      }

      // Companion follows a little behind.
      this.hotspots.forEach((hs) => {
        if (!hs.follow || !this.isVisible(hs)) return;
        const want = this.x - this.facing * 95;
        hs.fx += (want - hs.fx) * Math.min(1, dt * 2.2);
        hs.g.setAttribute('transform', `translate(${hs.fx.toFixed(1)},${WF.GROUND}) scale(${this.x > hs.fx ? 1 : -1},1)`);
      });

      this.playerG.setAttribute('transform', `translate(${this.x.toFixed(1)},${WF.GROUND})`);
      this.flipG.setAttribute('transform', `scale(${this.facing},1)`);
      this.playerG.classList.toggle('walking', !!dir);
      this.updateCamera(false, dt);
      this.updateNear();
    }

    updateCamera(instant, dt = 0.016) {
      if (!this.scale) return;
      const maxCam = Math.max(0, this.W - this.viewW);
      let want = this.W <= this.viewW ? (this.W - this.viewW) / 2 : WF.clamp(this.x - this.viewW * 0.42, 0, maxCam);
      if (instant || WF.settings.reducedMotion) this.camX = want;
      else this.camX += (want - this.camX) * Math.min(1, dt * 5);
      this.layerEls.forEach(({ el, f }) => {
        const px = (-MARGIN - this.camX * f) * this.scale;
        el.style.transform = `translate3d(${px.toFixed(1)}px,0,0)`;
      });
      this.hotspots.forEach((hs) => {
        if (!hs.follow) hs.g.setAttribute('transform', `translate(${hs.x},${WF.GROUND})${hs.flip ? ' scale(-1,1)' : ''}`);
        const left = (hs.fx - this.camX) * this.scale;
        const top = this.top + (WF.GROUND - (hs.labelY || 130)) * this.scale;
        hs.labelEl.style.transform = `translate(${left.toFixed(1)}px, ${top.toFixed(1)}px) translate(-50%, -100%)`;
      });
    }

    updateNear() {
      let best = null;
      let bestD = REACH;
      this.hotspots.forEach((hs) => {
        if (!this.isVisible(hs)) return;
        const d = Math.abs(hs.fx - this.x);
        if (d <= bestD) { best = hs; bestD = d; }
      });
      if (best !== this.near) {
        if (this.near) { this.near.labelEl.classList.remove('show'); this.near.g.classList.remove('near'); }
        this.near = best;
        if (best) { best.labelEl.classList.add('show'); best.g.classList.add('near'); }
        this.onNear && this.onNear(best);
      }
    }

    /** Temporary visual effects: 'wind' | 'quake' | 'fire' | 'hush' | 'lights' */
    fx(name, on = true) {
      this.stage.classList.toggle(`fx-${name}`, on);
    }
  }

  WF.World = World;
})();
