/* The story runner: checks conditions, runs dialogue lines and choices,
   and applies "effects" (do: {...}) written in the level file. */
(function (N) {
  'use strict';
  const arr = v => Array.isArray(v) ? v : [v];

  class Story {
    constructor(game) { this.g = game; this.active = false; this.lines = null; this.i = 0; this.after = []; }

    /* Conditions used in level files:
       flag, not, items, following, sparks, sparksBelow, allStars */
    check(c) {
      if (!c) return true;
      const s = this.g.state;
      if (c.flag !== undefined && !arr(c.flag).every(f => s.flags.has(f))) return false;
      if (c.not !== undefined && arr(c.not).some(f => s.flags.has(f))) return false;
      if (c.items) for (const k in c.items) if ((s.items[k] || 0) < c.items[k]) return false;
      if (c.following !== undefined && s.following !== c.following) return false;
      if (c.sparks !== undefined && s.sparks < c.sparks) return false;
      if (c.sparksBelow !== undefined && s.sparks >= c.sparksBelow) return false;
      if (c.allStars !== undefined && this.g.allStarsFound() !== c.allStars) return false;
      return true;
    }

    fmt(text) {
      const s = this.g.state;
      return text.replace(/\{(\w+)\}/g, (m, k) => k === 'sparks' ? s.sparks : k === 'stars' ? s.stars.size
        : k === 'hearts' ? (this.g.runner ? this.g.runner.hearts : (s.hearts || 0)) : (s.items[k] || 0));
    }

    /* Effects used in level files (inside do: {...}). */
    apply(fx) {
      if (!fx) return;
      if (Array.isArray(fx)) { fx.forEach(f => this.apply(f)); return; }
      const g = this.g, s = g.state;
      for (const k of Object.keys(fx)) {
        const v = fx[k];
        switch (k) {
          case 'set': arr(v).forEach(f => s.flags.add(f)); break;
          case 'unset': arr(v).forEach(f => s.flags.delete(f)); break;
          case 'give': for (const i in v) s.items[i] = (s.items[i] || 0) + v[i]; break;
          case 'take': for (const i in v) s.items[i] = Math.max(0, (s.items[i] || 0) - v[i]); break;
          case 'follow': g.follow(v); break;
          case 'unfollow': g.unfollow(); break;
          case 'walk': g.walkTo(v.id, v.to); break;
          case 'run': g.runEntity(v); break;
          case 'show': arr(v).forEach(id => g.showEntity(id, true)); break;
          case 'hide': arr(v).forEach(id => g.showEntity(id, false)); break;
          case 'door': g.openDoor(v); break;
          case 'sticker': g.giveSticker(v); break;
          case 'costume': g.giveCostume(v); break;
          case 'sfx': N.audio.play(v); break;
          case 'bubble': g.bubble(v); break;
          case 'reveal': g.reveal(v); break;
          case 'burst': g.burstAt(v[0], v[1]); break;
          case 'say': this.defer(() => this.say(v)); break;
          case 'finale': this.defer(() => g.startFinale()); break;
          case 'reflection': this.defer(() => g.showReflection()); break;
          case 'platform': this.defer(() => g.startRun(v)); break;
          case 'endRun': this.defer(() => g.endRun(true)); break;
          default: console.warn('Unknown effect', k);
        }
      }
      g.stateChanged();
    }
    defer(fn) { if (this.active) this.after.push(fn); else fn(); }

    say(id) {
      const lines = this.g.level.dialogues[id];
      if (!lines) { console.warn('Missing dialogue', id); return; }
      this.run(lines);
    }
    run(lines) {
      this.active = true; this.lines = lines; this.i = -1;
      this.g.onDialogueStart();
      this.advance();
    }
    advance() {
      if (!this.lines) return;
      this.i++;
      while (this.i < this.lines.length && !this.check(this.lines[this.i].if)) this.i++;
      if (this.i >= this.lines.length) { this.end(); return; }
      const line = this.lines[this.i];
      if (line.do) this.apply(line.do);
      if (line.choices) {
        const list = line.choices.filter(c => this.check(c.if));
        N.ui.showChoices(list.map(c => ({ icon: c.icon, text: this.fmt(c.text) })), idx => this.choose(list[idx]));
      } else {
        const text = this.fmt((N.input.touch && line.touch) || line.text);
        N.ui.showLine(line.who, text, () => this.advance());
      }
    }
    choose(c) {
      N.audio.play('choose');
      if (c.do) this.apply(c.do);
      if (c.go) {
        this.lines = this.g.level.dialogues[c.go]; this.i = -1;
        this.advance();
      } else this.advance();
    }
    end() {
      this.active = false; this.lines = null;
      N.ui.hideDialogue();
      this.g.onDialogueEnd();
      while (this.after.length && !this.active) this.after.shift()();
    }
  }
  N.Story = Story;
})(window.Ninle);
