/* The tile map: what is where, and what you can walk through. */
(function (N) {
  'use strict';
  const SOLID = new Set(['T', '~', 'X', 'R', 'B', 'F', 'G', 'H', 'h', 'f']);

  class World {
    constructor(level) {
      this.tiles = level.map.map(row => row.split(''));
      this.h = this.tiles.length;
      this.w = this.tiles[0].length;
      this.version = 0;
    }
    get(x, y) {
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 'T';
      return this.tiles[y][x];
    }
    set(x, y, ch) { if (this.get(x, y) !== ch) { this.tiles[y][x] = ch; this.version++; } }
    solid(x, y) { return SOLID.has(this.get(x, y)); }
    /* Is a round body of radius r at pixel (px, py) touching anything solid? */
    blocked(px, py, r) {
      const T = N.TILE;
      const x0 = Math.floor((px - r) / T), x1 = Math.floor((px + r) / T);
      const y0 = Math.floor((py - r) / T), y1 = Math.floor((py + r) / T);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (this.solid(x, y)) return true;
      return false;
    }
    applyDoor(door) {
      if (door.tiles) door.tiles.forEach(([x, y]) => this.set(x, y, door.to));
      if (door.replace) for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (this.tiles[y][x] === door.replace) this.set(x, y, door.to);
    }
  }
  N.World = World;
})(window.Ninle);
