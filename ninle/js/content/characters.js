/* Who's who. `kind` chooses the drawing in js/art/characters.js.
   Characters can be reused by any adventure. */
(function (N) {
  'use strict';
  N.characters = {
    ninle:     { name: 'Ninle',            kind: 'ninle' },
    player:    { name: 'You',              kind: 'player' },
    sign:      { name: 'Signpost',         kind: 'sign' },
    bramble:   { name: 'Bramble the Beaver', kind: 'beaver' },
    honk:      { name: 'Honk the Goose',   kind: 'goose' },
    percy:     { name: 'Percy the Peacock', kind: 'peacock' },
    moss:      { name: 'Moss the Hedgehog', kind: 'hedgehog' },
    lily:      { name: 'Lily the Frog',    kind: 'frog' },
    dot:       { name: 'Dot the Duckling', kind: 'duck' },
    juniper:   { name: 'Juniper the Fox',  kind: 'fox' },
    theo:      { name: 'Grandpa Theo',     kind: 'tortoise' },
    shrubbert: { name: 'Shrubbert',        kind: 'sheep' },
    bush:      { name: 'A Bush?',          kind: 'sheep' }
  };

  /* Explorer looks the child can choose from. No names or personal details are asked for. */
  N.avatars = [
    { label: 'Sunny',  skin: '#8d5a3b', hair: '#2a1a12', style: 'puffs', outfit: '#ff7a59' },
    { label: 'Sky',    skin: '#f3c9a5', hair: '#d9822b', style: 'short', outfit: '#4f8cff' },
    { label: 'Violet', skin: '#c68a5e', hair: '#1f1410', style: 'long',  outfit: '#9b6bff' },
    { label: 'Mint',   skin: '#e8b48f', hair: '#3b2416', style: 'curly', outfit: '#2fbf8f' }
  ];

  /* Costume items the child can unlock and wear. */
  N.costumes = {
    scarf: { name: 'Woolly Scarf', from: 'A gift from Shrubbert' },
    hat:   { name: 'Lantern Hat',  from: 'For lighting the Lantern Trail' }
  };
})(window.Ninle);
