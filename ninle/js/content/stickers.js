/* Stickers celebrate discovery and kindness. They are never a score of how "good" someone is. */
(function (N) {
  'use strict';
  N.stickers = [
    { id: 'neighbour', name: 'Good Neighbour', color: '#ff8a5c', char: 'beaver', charOpts: { bandage: true }, hint: 'Stop to help someone on the road.' },
    { id: 'welcome',   name: 'Friend Maker',   color: '#7bc86c', char: 'hedgehog', hint: 'Help someone who feels left out.' },
    { id: 'brave',     name: 'Brave & True',   color: '#ffb347', char: 'fox', hint: 'Help a friend be brave and honest.' },
    { id: 'jumper',    name: 'Temptation Jumper', color: '#5ec8e5', icon: 'heart', hint: 'Run through the tunnel in the Hidden Hollow.' },
    { id: 'silly',     name: 'Hide-and-Seek Champ', color: '#b39ddb', char: 'sheep', hint: 'Some bushes are not what they seem…' },
    { id: 'stars',     name: 'Star Explorer',  color: '#ffd54f', icon: 'star', hint: 'Find all the Wonder Stars.' },
    { id: 'lantern',   name: 'Lantern Lighter', color: '#ffcf4a', icon: 'lantern', hint: 'Light the Lantern Trail.' }
  ];
  N.stickerById = id => N.stickers.find(s => s.id === id);
})(window.Ninle);
