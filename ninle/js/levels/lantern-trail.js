/* =========================================================================
   ADVENTURE 1: THE LANTERN TRAIL
   All story content for this level lives in this one file: the map, who is
   where, what they say, the choices, hints, and the Bible reflection.
   See README.md → "Adding a new adventure" to make another one.
   ========================================================================= */
(function (N) {
  'use strict';

  N.registerLevel({
    id: 'lantern-trail',
    title: 'The Lantern Trail',
    next: 'Starlight Hills',

    /* MAP KEY
       .  grass        ,  flowers      =  sandy path     ~  water
       T  tree         B  bush         s  secret bush (you can walk through!)
       R  rock         F  fence        G  garden gate     h  house
       X  broken bridge (fixed by a "door")              m  mushrooms
       H  lantern gate f  foggy Starlight Hills (opens at the end) */
    map: [
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
      'TffffffffffffffffffffffffffffffffffffffffffT',
      'TffffffffffffffffffffffffffffffffffffffffffT',
      'TffffffffffffffffffffffffffffffffffffffffffT',
      'TffffffffffffffffffffffffffffffffffffffffffT',
      'TTTTTTTTTTTTTTTTTTTTTHHTTTTTTTTTTTTTTTTTTTTT',
      'T..................======......FFFFFFFF...mT',
      'TT..........T...T..======.T..T.Fhhh,,,Fm...T',
      'T.B.~~~~~~.........,.==........Fhhh,,,G....T',
      'T.B~~~~~~~~......R...==.T.....TF,,,,,,F....T',
      'T.B~~~~~~~~....,..T..==,....T..F,,,,,,Fm..mT',
      'T...~~~~~~...T......R==...T....F,,,,,,F....T',
      'T....................==.T.....RFFF=FFFFTTsTT',
      'T.T..,..===========================....TTsTT',
      'T.........T...=.............T....,..T......T',
      'T~~~~~~~~~~~~~X~~~~~~~~~~~~~~~~~~~~~~~~~~~~T',
      'T~~~~~~~~~~~~~X~~~~~~~~~~~~~~~~~~~~~~~~~~~~T',
      'T.............=............,.............R.T',
      'T..,....,..,..=.....,...........T.....T..R.T',
      'T...,.T..,....=..T.......T...............R.T',
      'T....,........=...............T..,..T......T',
      'T,....,.T..T..=............................T',
      'T.,....,......========.........T...........T',
      'T..,..T.,............=.....T...............T',
      'T...,....,R.......,..=............BBBBBBBBBT',
      'T....,...............=.,..T.......B.....,..T',
      'TBBBB.,.........T....=............B.,......T',
      'T.,.B..,.............=..T.........s.......,T',
      'T..,B...,...T....,.=====....TTT...B........T',
      'T...B....,.........=====.,..T.....B..,.....T',
      'T....,.............T........T.....B,.......T',
      'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT'
    ],
    start: [21, 28],
    house: { x: 32, y: 7, w: 3, h: 2 },
    lanternGate: { x: 21, y: 5 },
    // How dusky the valley looks with 0, 1, 2, 3 sparks (0 = fully bright)
    dusk: [0.36, 0.27, 0.18, 0.1],

    items: { plank: { name: 'Plank', total: 3 } },

    /* Things that change the map. */
    doors: {
      bridge:      { tiles: [[14, 15], [14, 16]], to: 'b' },
      gardenGate:  { tiles: [[38, 8]], to: 'g' },
      lanternGate: { tiles: [[21, 5], [22, 5]], to: 'o' },
      hills:       { replace: 'f', to: 'k' }
    },

    /* Lantern posts, in order from the start of the trail to the Great Lantern. */
    lanterns: [[22, 26], [20, 24], [22, 22], [19, 21], [16, 23], [13, 21], [15, 19], [13, 17],
      [15, 14], [17, 14], [19, 12], [23, 11], [20, 9], [23, 8]],

    entities: [
      { id: 'greatLantern', type: 'greatLantern', x: 20, y: 6, talk: [
        { if: { sparks: 3, not: 'finale_done' }, say: 'lantern_ready', mark: true },
        { if: { flag: 'finale_done' }, say: 'lantern_lit' },
        { say: 'lantern_need' }
      ] },

      // --- south side ---
      { id: 'sign_start', type: 'sign', x: 23, y: 27, text: 'Welcome to the LANTERN TRAIL! Follow the sandy path. Find the sparks. Help your friends!' },
      { id: 'bramble', type: 'npc', char: 'bramble', x: 17, y: 22, face: -1,
        sad: { not: 'bramble_done' }, look: { bandage: { flag: 'bramble_leaf' } },
        idle: [{ if: { not: 'bramble_met' }, text: 'Ouch… my paw!' }, { if: { flag: 'bramble_done' }, text: 'What a fine bridge!' }],
        talk: [
          { if: { not: 'bramble_met' }, say: 'bramble_first', mark: true },
          { if: { not: 'bramble_done', items: { plank: 3 } }, say: 'bramble_fixes', mark: true },
          { if: { not: 'bramble_done' }, say: 'bramble_waiting' },
          { say: 'bramble_after' }
        ] },
      { id: 'honk', type: 'npc', char: 'honk', x: 9, y: 21, hidden: true, solid: false },
      { id: 'percy', type: 'npc', char: 'percy', x: 9, y: 21, hidden: true, solid: false },
      { id: 'plank1', type: 'item', item: 'plank', x: 11, y: 19 },
      { id: 'plank2', type: 'item', item: 'plank', x: 19, y: 25 },
      { id: 'plank3', type: 'item', item: 'plank', x: 9, y: 24 },
      { id: 'spark1', type: 'spark', x: 16, y: 21, hidden: true },
      { id: 'sign_bridge', type: 'sign', x: 15, y: 18, text: "BRAMBLE'S BRIDGE. Built with love (and lots of planks)." },
      { id: 'sign_sheep', type: 'sign', x: 32, y: 27, text: 'Nothing to see here. Definitely NOT a sheep.' },
      { id: 'shrubbert', type: 'npc', char: 'shrubbert', x: 39, y: 27, peek: true,
        look: { disguised: { not: 'found_shrubbert' } },
        talk: [{ if: { not: 'found_shrubbert' }, say: 'shrubbert_first' }, { say: 'shrubbert_after' }] },

      // --- north side ---
      { id: 'sign_fork', type: 'sign', x: 18, y: 12, text: '← POND        ORCHARD & GARDEN →        ↑ GREAT LANTERN' },
      { id: 'moss', type: 'npc', char: 'moss', x: 16, y: 8, sad: { not: 'moss_done' },
        idle: [{ if: { not: 'moss_met' }, text: 'Sigh…' }],
        talk: [
          { if: { not: 'moss_met' }, say: 'moss_first', mark: true },
          { if: { following: 'moss' }, say: 'moss_following' },
          { if: { not: 'moss_done' }, say: 'moss_again', mark: true },
          { say: 'moss_after' }
        ] },
      { id: 'lily', type: 'npc', char: 'lily', x: 5, y: 12,
        idle: [{ if: { not: 'moss_done' }, text: 'Ribbit! Who wants to play?' }],
        talk: [
          { if: { following: 'moss' }, say: 'pond_welcome', mark: true },
          { if: { not: 'moss_done' }, say: 'pond_first' },
          { say: 'pond_after' }
        ] },
      { id: 'dot', type: 'npc', char: 'dot', x: 9, y: 12, face: -1,
        talk: [
          { if: { following: 'moss' }, say: 'pond_welcome', mark: true },
          { if: { not: 'moss_done' }, say: 'pond_first' },
          { say: 'pond_after_dot' }
        ] },
      { id: 'spark2', type: 'spark', x: 7, y: 13, hidden: true },
      { id: 'juniper', type: 'npc', char: 'juniper', x: 28, y: 9, sad: { not: 'juniper_done' },
        idle: [{ if: { not: 'juniper_met' }, text: 'Sniff…' }],
        talk: [
          { if: { not: 'juniper_met' }, say: 'juniper_first', mark: true },
          { if: { following: 'juniper' }, say: 'juniper_following' },
          { if: { not: 'juniper_done' }, say: 'juniper_again', mark: true },
          { say: 'juniper_after' }
        ] },
      { id: 'theo', type: 'npc', char: 'theo', x: 35, y: 10, face: -1,
        talk: [
          { if: { following: 'juniper' }, say: 'theo_juniper', mark: true },
          { if: { not: ['juniper_done', 'theo_met'] }, say: 'theo_first' },
          { if: { not: 'juniper_done' }, say: 'theo_again' },
          { say: 'theo_after' }
        ] },
      { id: 'hollowDoor', type: 'portal', x: 40, y: 8, talk: [
        { if: { not: 'got_spark3' }, say: 'tunnel_enter', mark: true },
        { say: 'tunnel_again' }
      ] },
      { id: 'spark3', type: 'spark', x: 40, y: 9, hidden: true }, // won at the end of the Temptation Tunnel

      // --- Wonder Stars hidden around the valley ---
      { id: 'star_reeds', type: 'star', x: 1, y: 9 },
      { id: 'star_orchard', type: 'star', x: 30, y: 7 },
      { id: 'star_east', type: 'star', x: 42, y: 18 },
      { id: 'star_meadow', type: 'star', x: 2, y: 28 },
      { id: 'star_sheep', type: 'star', x: 41, y: 29 },
      { id: 'star_south', type: 'star', x: 29, y: 29 },

      { id: 'sign_hills', type: 'sign', x: 25, y: 3, text: 'STARLIGHT HILLS. The next adventure starts here… coming soon!' }
    ],

    /* Places that start something when you walk into them (x1, y1, x2, y2 in tiles). */
    triggers: [
      { id: 'road', area: [19, 23, 22, 25], if: { not: 'bramble_met' }, do: [
        { run: { id: 'honk', from: [9, 21], path: [[16, 21], [23, 21], [35, 21]], speed: 230, hideAtEnd: true } },
        { bubble: { id: 'honk', text: 'Too busy! Too busy! HONK!', time: 3 } },
        { sfx: 'honk' },
        { run: { id: 'percy', from: [9, 21], path: [[16, 21], [23, 21], [35, 21]], speed: 160, delay: 1.8, hideAtEnd: true } },
        { bubble: { id: 'percy', text: "Can't stop! My feathers might get dusty!", time: 4, delay: 1.8 } },
        { bubble: { id: 'bramble', text: 'Wait… could someone help me?', time: 4, delay: 4.2 } }
      ] },
      { id: 'bridge', area: [13, 17, 15, 18], if: { not: 'bramble_done' }, say: 'bridge_broken' },
      { id: 'north', area: [12, 13, 16, 14], say: 'north_arrive' },
      { id: 'hollow', area: [39, 6, 42, 11], say: 'hollow_arrive' },
      { id: 'hills', area: [1, 1, 42, 4], if: { flag: 'finale_done' }, say: 'hills_arrive' }
    ],

    /* Things that happen after events. First matching entry wins. */
    events: {
      spark: [{ if: { sparks: 3 }, say: 'all_sparks' }]
    },

    /* What Ninle suggests next. The first entry whose "if" matches is used. */
    hints: [
      { if: { flag: ['finale_done', 'found_shrubbert'], allStars: true }, goal: 'You found everything! Enjoy the glowing valley', hint: 'You found every secret in Lantern Valley. Amazing exploring!' },
      { if: { flag: 'finale_done', not: 'found_shrubbert' }, goal: 'Explore! Is that bush… watching you?', hint: 'Psst! Have you checked the bushes in the bottom-right corner? I heard a funny noise…', target: 'shrubbert' },
      { if: { flag: 'finale_done' }, goal: 'Explore! Find the Wonder Stars you missed', hint: 'There are still Wonder Stars hiding in corners. Let’s find them!', target: 'star' },
      { if: { sparks: 3 }, goal: 'Take the 3 sparks to the Great Lantern', hint: 'We have all 3 sparks! The Great Lantern is at the very top of the trail, by the big gate.', target: 'greatLantern' },
      { if: { following: 'moss' }, goal: 'Walk with Moss to the pond friends', hint: 'Lily and Dot are by the pond. Let’s bring Moss to them!', target: 'lily' },
      { if: { following: 'juniper' }, goal: 'Go with Juniper to Grandpa Theo', hint: 'Grandpa Theo lives in the garden with the white fence.', target: 'theo' },
      { if: { flag: 'moss_met', not: 'moss_done', following: null }, goal: 'Moss is waiting for you', hint: 'Moss is still waiting to go to the pond. Let’s go back for Moss!', target: 'moss' },
      { if: { flag: 'juniper_met', not: 'juniper_done', following: null }, goal: 'Juniper is waiting for you', hint: 'Juniper is still waiting to see Grandpa Theo. Let’s go back for her!', target: 'juniper' },
      { if: { flag: 'bramble_met', not: 'bramble_done', items: { plank: 3 } }, goal: 'Bring the planks back to Bramble', hint: 'We found all 3 planks! Let’s take them back to Bramble.', target: 'bramble' },
      { if: { flag: 'bramble_met', not: 'bramble_done' }, goal: 'Find Bramble’s planks ({plank}/3)', hint: 'Bramble’s planks rolled into the grass. Look for wooden boards near the road!', target: 'item:plank' },
      { if: { not: 'bramble_done' }, goal: 'Follow the sandy path', hint: 'Let’s follow the sandy path. I think someone up ahead needs a friend!', target: 'bramble' },
      { if: { flag: 'bramble_done', not: 'got_spark1' }, goal: 'Grab the glowing spark!', hint: 'Bramble found a spark! Let’s grab it.', target: 'spark1' },
      { if: { flag: 'moss_done', not: 'got_spark2' }, goal: 'Grab the glowing spark!', hint: 'Moss made the pond glow! Grab that spark!', target: 'spark2' },
      { if: { flag: 'juniper_done', not: 'got_spark3' }, goal: 'Find the glow in the Hidden Hollow', hint: 'Grandpa Theo’s back gate is open now. The Hidden Hollow is through there!', target: 'hollowDoor' },
      { if: { not: 'moss_done' }, goal: 'Find someone who feels left out', hint: 'I saw someone sitting all alone, not far from the pond…', target: 'moss' },
      { if: { not: 'juniper_done' }, goal: 'Someone is hiding in the orchard…', hint: 'I heard a little sniffle near the apple trees. Someone might be hiding!', target: 'juniper' },
      { if: { not: 'got_spark3' }, goal: 'Look for a hidden glow', hint: 'There’s one more spark hiding somewhere. Maybe behind a gate… or a secret path?', target: 'hollowDoor' },
      { goal: 'Explore the valley!', hint: 'Let’s explore!' }
    ],

    intro: 'intro',

    /* Text inside {braces} is filled in: {plank} {sparks} {stars} */
    dialogues: {
      intro: [
        { who: 'ninle', text: 'Hello, explorer! I’m Ninle, a little lantern-firefly. ✨' },
        { who: 'ninle', text: 'Welcome to Lantern Valley! But oh no… all the lanterns have gone dark.' },
        { who: 'ninle', text: 'Let’s find 3 glowing sparks to light them again! Use the arrow keys to move, and press Space to talk.',
          touch: 'Let’s find 3 glowing sparks to light them again! Drag the round pad to move, and tap ✋ to talk.' },
        { who: 'ninle', text: 'I’ll stay right beside you. If you get stuck, press H or click my ? button!',
          touch: 'I’ll stay right beside you. If you get stuck, tap my ? button!' }
      ],

      bridge_broken: [
        { who: 'ninle', text: 'Oh no, the bridge is broken! There’s a big gap in the middle.' },
        { who: 'ninle', text: 'Maybe someone nearby knows how to fix it…' }
      ],
      north_arrive: [
        { who: 'ninle', text: 'We made it across! I can see a pond, an orchard and a garden.' },
        { who: 'ninle', text: 'The Great Lantern is at the top of the path. But first — let’s explore!' }
      ],
      hollow_arrive: [{ who: 'ninle', text: 'Ooh… the Hidden Hollow! Look — a glowing tree tunnel!' }],
      tunnel_enter: [
        { who: 'ninle', text: 'The glow is coming from inside this hollow tree. It’s a tunnel!' },
        { who: 'ninle', text: 'I think it’s the Temptation Tunnel. Are you ready to run and jump?' },
        { choices: [
          { icon: '🏃', text: 'Let’s go in!', do: { platform: 'hollow-run' } },
          { icon: '🌳', text: 'Not yet', go: 'tunnel_wait' }
        ] }
      ],
      tunnel_again: [
        { who: 'ninle', text: 'Want to run through the Temptation Tunnel again, just for fun?' },
        { choices: [
          { icon: '🏃', text: 'Yes, again!', do: { platform: 'hollow-run' } },
          { icon: '🌳', text: 'Maybe later', go: 'tunnel_wait' }
        ] }
      ],
      tunnel_wait: [{ who: 'ninle', text: 'Okay! The tunnel will be right here.' }],
      hills_arrive: [
        { who: 'ninle', text: 'The Starlight Hills! Our next adventure will begin right here.' },
        { who: 'ninle', text: 'For now, let’s enjoy the view. Isn’t it beautiful?' }
      ],

      /* ---- Bramble: someone hurt on the road ---- */
      bramble_first: [
        { who: 'bramble', text: 'Ouch, ouch! I tripped and hurt my paw.', do: { set: 'bramble_met' } },
        { who: 'bramble', text: 'And my bridge planks went flying everywhere!' },
        { who: 'bramble', text: 'Honk and Percy hurried past. They were too busy to stop…' },
        { who: 'ninle', text: 'We’re not too busy! How can we help?' },
        { choices: [
          { icon: '🍃', text: 'Wrap his sore paw in a soft leaf', go: 'bramble_leaf' },
          { icon: '🪵', text: 'Look for his lost planks first', go: 'bramble_planks' }
        ] }
      ],
      bramble_leaf: [
        { who: 'ninle', text: 'You found a big, soft leaf and wrapped it gently around his paw. So kind!', do: { set: 'bramble_leaf', sfx: 'item' } },
        { who: 'bramble', text: 'Ahh, that feels much better. Thank you, friend!' },
        { who: 'bramble', text: 'Could you find my 3 planks? Then I can fix the bridge.' },
        { who: 'ninle', text: 'Let’s look in the grass near the road!' }
      ],
      bramble_planks: [
        { who: 'bramble', text: 'You’d really help me? Thank you! There are 3 planks.' },
        { who: 'bramble', text: 'When I have them all, I can fix the bridge over the river.' },
        { who: 'ninle', text: 'And we’ll look after that sore paw too!' }
      ],
      bramble_waiting: [
        { who: 'bramble', text: 'You found {plank} of my 3 planks. The others must be close by!' },
        { if: { flag: 'bramble_leaf' }, who: 'bramble', text: 'My paw feels better already, thanks to your leaf.' }
      ],
      bramble_fixes: [
        { who: 'bramble', text: 'My planks! You found them all! Hooray!' },
        { if: { not: 'bramble_leaf' }, who: 'ninle', text: 'Now let’s wrap that sore paw in a soft leaf.', do: { set: 'bramble_leaf', sfx: 'item' } },
        { if: { not: 'bramble_leaf_thanks' }, who: 'bramble', text: 'You are the kindest helper in the whole valley!', do: { set: 'bramble_leaf_thanks' } },
        { who: 'bramble', text: 'Now… stand back. Time to fix the bridge!', do: { door: 'bridge', sfx: 'build', set: 'bramble_done', take: { plank: 3 }, burst: [14, 15] } },
        { who: 'bramble', text: 'Ta-da! Good as new!' },
        { who: 'bramble', text: 'Oh! Something was glowing under my last plank. I think it’s for you!', do: { show: 'spark1', sfx: 'spark', burst: [16, 21] } },
        { who: 'ninle', text: 'A lantern spark! Go and grab it!', do: { sticker: 'neighbour' } }
      ],
      bramble_after: [
        { who: 'bramble', text: 'Thank you for stopping to help me. You were a true neighbour!' }
      ],

      /* ---- Moss: someone who feels left out ---- */
      moss_first: [
        { who: 'moss', text: 'Oh! H-hello. I’m Moss.', do: { set: 'moss_met' } },
        { who: 'moss', text: 'The pond friends are playing Skip-a-Stone.' },
        { who: 'moss', text: 'I wanted to play too… but I’m a bit prickly. Nobody asked me.' },
        { who: 'ninle', text: 'Feeling left out is a sad feeling. What could we do?' },
        { choices: [
          { icon: '🤝', text: 'Say, “Come and play with me!”', go: 'moss_invite' },
          { icon: '💛', text: 'Sit down beside Moss for a while', go: 'moss_sit' }
        ] }
      ],
      moss_invite: [
        { who: 'moss', text: 'Really? You want to play with ME?' },
        { who: 'moss', text: 'Nobody has ever invited me before. Okay — let’s go!', do: { follow: 'moss', set: 'moss_invited' } },
        { who: 'ninle', text: 'Let’s walk with Moss to the pond friends!' }
      ],
      moss_sit: [
        { who: 'ninle', text: 'You sat down next to Moss. It’s quiet and cosy.', do: { set: 'moss_sat' } },
        { who: 'moss', text: 'This is nice. Thank you for sitting with me.' },
        { who: 'moss', text: 'Want to know a secret? There’s a Wonder Star hiding behind the reeds, on the far side of the pond!', do: { reveal: 'star_reeds' } },
        { who: 'moss', text: 'I feel braver now. Will you come with me to the pond?', do: { follow: 'moss' } },
        { who: 'ninle', text: 'Let’s go together!' }
      ],
      moss_again: [
        { who: 'moss', text: 'Are we still going to the pond together?', do: { follow: 'moss' } },
        { who: 'ninle', text: 'Yes! Lily and Dot are by the pond.' }
      ],
      moss_following: [{ who: 'moss', text: 'I’m right behind you! The pond friends are just over there.' }],
      moss_after: [
        { who: 'moss', text: 'Thank you for helping me join in. I’m so glad you came!' },
        { if: { flag: 'moss_sat' }, who: 'moss', text: 'Did you find the star behind the reeds?' }
      ],

      pond_first: [
        { who: 'lily', text: 'Ribbit! We’re playing Skip-a-Stone!' },
        { who: 'dot', text: 'Quack! But our teams are uneven. We need one more player.' },
        { who: 'ninle', text: 'Hmm… I wonder who might like to play?' }
      ],
      pond_welcome: [
        { who: 'moss', text: 'Um… c-can I play too?' },
        { who: 'lily', text: 'Moss! Of course you can!' },
        { who: 'dot', text: 'We’re sorry we didn’t ask you. We didn’t know you wanted to play!' },
        { if: { flag: 'moss_invited' }, who: 'moss', text: 'My new friend invited me. So I came!' },
        { who: 'lily', text: 'Prickles and all — you’re welcome here!', do: { unfollow: true, walk: { id: 'moss', to: [7, 12] }, set: 'moss_done' } },
        { who: 'moss', text: 'Here goes… plip, plip, PLOP!', do: { sfx: 'splash', burst: [7, 10] } },
        { who: 'dot', text: 'Whoa! Look! Moss’s stone made the water glow!', do: { show: 'spark2', sfx: 'spark' } },
        { who: 'ninle', text: 'A lantern spark! When we welcome others, everything gets brighter!', do: { sticker: 'welcome' } }
      ],
      pond_after: [{ who: 'lily', text: 'Moss is the best stone-skipper in the whole valley! Ribbit!' }],
      pond_after_dot: [{ who: 'dot', text: 'Quack! Our teams are perfect now. Thanks for bringing Moss!' }],

      /* ---- Juniper & Theo: honesty, courage and forgiveness ---- */
      juniper_first: [
        { who: 'juniper', text: 'Shh! I’m hiding!', do: { set: 'juniper_met' } },
        { who: 'juniper', text: 'I was playing ball and… CRASH! I broke Grandpa Theo’s flower pot.' },
        { who: 'juniper', text: 'I’m scared he’ll be cross with me.' },
        { who: 'ninle', text: 'Hiding can make a worried feeling grow bigger. What could help?' },
        { choices: [
          { icon: '🦊', text: '“Let’s go and tell him together.”', go: 'juniper_together' },
          { icon: '💪', text: '“Telling the truth is brave. You can do it!”', go: 'juniper_brave' }
        ] }
      ],
      juniper_together: [
        { who: 'juniper', text: 'Together? …Okay. Things feel easier with a friend.', do: { follow: 'juniper', set: 'juniper_together' } },
        { who: 'ninle', text: 'Grandpa Theo lives in the garden with the white fence!' }
      ],
      juniper_brave: [
        { who: 'juniper', text: 'You really think I’m brave?' },
        { who: 'juniper', text: 'Then I’ll do it! Will you walk with me?', do: { follow: 'juniper' } },
        { who: 'ninle', text: 'Grandpa Theo lives in the garden with the white fence!' }
      ],
      juniper_again: [
        { who: 'juniper', text: 'Will you still walk with me to Grandpa Theo’s garden?', do: { follow: 'juniper' } },
        { who: 'ninle', text: 'Of course! It’s the garden with the white fence.' }
      ],
      juniper_following: [{ who: 'juniper', text: 'Is my tail shaking? I think my tail is shaking.' }],
      juniper_after: [{ who: 'juniper', text: 'Grandpa Theo forgave me! My tummy doesn’t feel wobbly anymore.' }],

      theo_first: [
        { who: 'theo', text: 'Well, hello there, young explorer! I’m Grandpa Theo.', do: { set: 'theo_met' } },
        { who: 'theo', text: 'I’ve been gardening for a hundred and forty years!' },
        { who: 'theo', text: 'Have you seen little Juniper? She ran off in such a hurry.' },
        { who: 'theo', text: 'And has anyone seen my glasses? I’ve looked everywhere!' },
        { who: 'ninle', text: '(Psst… I think his glasses are on his head!)' }
      ],
      theo_again: [{ who: 'theo', text: 'If you see Juniper, tell her I’m not cross. I just want to know she’s all right.' }],
      theo_juniper: [
        { who: 'juniper', text: 'Grandpa Theo… I broke your flower pot. I’m really, really sorry.' },
        { if: { flag: 'juniper_together' }, who: 'ninle', text: 'We came to tell you together.' },
        { who: 'theo', text: 'Oh, Juniper. Thank you for telling me the truth. That was very brave.' },
        { who: 'theo', text: 'I forgive you. Pots can be fixed — and you matter much more than a pot!' },
        { who: 'juniper', text: 'Phew! Can I help you plant new flowers?' },
        { who: 'theo', text: 'I’d love that!', do: { unfollow: true, walk: { id: 'juniper', to: [36, 10] }, set: 'juniper_done', sticker: 'brave' } },
        { who: 'theo', text: 'Oh! And look — my glasses were on my head all along! Ho ho ho!' },
        { who: 'theo', text: 'Explorer, I’ll open my back gate. It leads to the Hidden Hollow. Something glows in there at night!', do: { door: 'gardenGate', sfx: 'gate', burst: [38, 8] } }
      ],
      theo_after: [
        { if: { not: 'got_spark3' }, who: 'theo', text: 'The Hidden Hollow is through my back gate. Off you go!' },
        { if: { flag: 'got_spark3' }, who: 'theo', text: 'Juniper and I are planting sunflowers. Aren’t they splendid?' }
      ],

      /* ---- Shrubbert: the funny surprise ---- */
      shrubbert_first: [
        { who: 'bush', text: '…' },
        { who: 'bush', text: '… … …' },
        { who: 'shrubbert', text: 'BAAA! You found me!', do: { set: 'found_shrubbert', sfx: 'baa', burst: [39, 27] } },
        { who: 'shrubbert', text: 'I’m Shrubbert! I’ve been playing hide-and-seek for THREE WHOLE DAYS.' },
        { who: 'shrubbert', text: 'Is it my turn to count yet?' },
        { who: 'ninle', text: 'Um… I think everyone went home for lunch. Two days ago.' },
        { who: 'shrubbert', text: 'Oh! Then I’m the champion! Hooray for me!' },
        { who: 'shrubbert', text: 'Here, take my spare woolly scarf. It’s very cosy. And only a little bit itchy.', do: { costume: 'scarf', sticker: 'silly' } }
      ],
      shrubbert_after: [{ who: 'shrubbert', text: 'Shhh! I’m practising my hiding. Can you still see me?' }],

      /* ---- The Great Lantern ---- */
      lantern_need: [{ who: 'ninle', text: 'This is the Great Lantern. It needs 3 sparks to shine. We have {sparks}!' }],
      lantern_ready: [
        { who: 'ninle', text: 'We have all 3 sparks! Are you ready to light the Lantern Trail?' },
        { choices: [
          { icon: '✨', text: 'Yes! Light it up!', do: { finale: true } },
          { icon: '🧭', text: 'Not yet — I want to explore more', go: 'lantern_wait' }
        ] }
      ],
      lantern_wait: [{ who: 'ninle', text: 'Okay! Come back whenever you’re ready.' }],
      lantern_lit: [{ who: 'ninle', text: 'The Great Lantern is shining so bright. Thank you for lighting it!' }],
      all_sparks: [
        { who: 'ninle', text: 'That’s all 3 sparks! ✨ ✨ ✨' },
        { who: 'ninle', text: 'Let’s take them to the Great Lantern, at the top of the trail by the big gate!' }
      ],

      finale_talk: [
        { who: 'ninle', text: 'WOW! Look at the whole trail glowing!' },
        { who: 'bramble', text: 'Thank you for stopping to help me!' },
        { if: { flag: 'moss_done' }, who: 'moss', text: 'And for helping me feel welcome!' },
        { if: { flag: 'juniper_done' }, who: 'juniper', text: 'And for helping me be brave and tell the truth!' },
        { if: { flag: 'found_shrubbert' }, who: 'shrubbert', text: 'And for finding me! I’m still the champion!' },
        { who: 'ninle', text: 'The fog is gone! Look — the Starlight Hills! A brand-new place to explore… soon!' },
        { who: 'ninle', text: 'Jesus once told a story that’s a lot like today. Let’s read it together!', do: { reflection: true } }
      ]
    },

    /* The grand finale. */
    finale: {
      door: 'lanternGate',
      reveal: 'hills',
      dialogue: 'finale_talk',
      sticker: 'lantern',
      costume: 'hat',
      gather: [
        { id: 'bramble', x: 18, y: 7 },
        { id: 'moss', x: 24, y: 8, if: { flag: 'moss_done' } },
        { id: 'lily', x: 17, y: 8, if: { flag: 'moss_done' } },
        { id: 'dot', x: 25, y: 8, if: { flag: 'moss_done' } },
        { id: 'juniper', x: 19, y: 10, if: { flag: 'juniper_done' } },
        { id: 'theo', x: 24, y: 10, if: { flag: 'juniper_done' } },
        { id: 'shrubbert', x: 18, y: 9, if: { flag: 'found_shrubbert' } }
      ]
    },

    /* The Bible reflection: a short, friendly storybook. */
    reflection: {
      pages: [
        { title: 'A Story Jesus Told', ref: 'Luke 10:25–37', art: 'scroll',
          text: ['One day, a man asked Jesus a big question: “Who is my neighbour?”', 'Jesus answered by telling a story.'] },
        { title: 'Someone Was Hurt', ref: 'Luke 10:30–32', art: 'road',
          text: ['A traveller was hurt and left lying by the side of the road.', 'Two people saw him… but they hurried past.'] },
        { title: 'Someone Stopped', ref: 'Luke 10:33–35', art: 'helper',
          text: ['Then a Samaritan came along — someone people didn’t expect to be kind.', 'He stopped. He bandaged the man’s hurts, took him to an inn, and paid for him to get well.'] },
        { title: 'Go and Do the Same', ref: 'Luke 10:36–37', art: 'hearts',
          text: ['Jesus asked, “Which one was a good neighbour?”', 'The one who showed kindness! Then Jesus said, “Go and do the same.”'] },
        { type: 'helped', title: 'Love Is Something We Do', art: 'lanterns',
          text: ['Today, when others hurried past, you stopped to help.'],
          after: ['Jesus shows us that love is something we DO — like helping, welcoming, and telling the truth.'] },
        { title: 'God Loves You Always', art: 'heart',
          text: ['You don’t have to earn God’s love. God loves you always, no matter what!', 'When we love others, we share God’s light — just like the lanterns.'],
          prayer: 'A little prayer, if you’d like: “Dear God, thank you for loving me. Help me to be a good neighbour. Amen.”',
          question: 'Who could you be a good neighbour to this week?' }
      ],
      helped: [
        { if: { flag: 'bramble_done' }, char: 'beaver', name: 'Bramble', opts: { bandage: true } },
        { if: { flag: 'moss_done' }, char: 'hedgehog', name: 'Moss' },
        { if: { flag: 'juniper_done' }, char: 'fox', name: 'Juniper' }
      ]
    }
  });
})(window.Ninle);
