/* =========================================================================
   SIDE-SCROLLING RUN: THE TEMPTATION TUNNEL (inside the Hidden Hollow)
   A Mario-style dash past silly "temptations". Nobody can lose: bumping a
   temptation just bounces you back, and Ninle always catches you.
   Started from a level with the effect  do: { platform: 'hollow-run' }
   ========================================================================= */
(function (N) {
  'use strict';
  N.runs = N.runs || {};
  N.runs['hollow-run'] = {
    id: 'hollow-run',
    title: 'The Temptation Tunnel',
    reward: 'spark3',          // entity in the main level collected when you finish
    sticker: 'jumper',

    /* MAP KEY (side view)
       #  ground        =  wooden crate     -  log platform (jump up through it)
       ?  kindness block (bump it from below)          h  kindness heart
       p  bounce flower L  checkpoint lantern           F  finish lantern + spark
       S  start         c  Too-Busy Clock  t  Grumble Thorn
       b  Fib Bubble    g  Grabby Goo      (an empty bottom = a Give-Up Gap) */
    map: [
      '#..............................................................................................................#',
      '#..............................................................................................................#',
      '#..............................................................................................................#',
      '#..............................................................................................................#',
      '#........................................................hhh...................................................#',
      '#.......................................................-----.............h..........................h...h.....#',
      '#..............................................h.........................h.............................h....F..#',
      '#..........?.................hh......??h......h.h............b......hh....=....???...hh.....b.......--...=====.#',
      '#.............hh..=.........----.........................................==.............................======.#',
      '#.S...hhh........==..c.............c......L....t....t..p.........L..gg..===...c...c......L..h..t...c...=======.#',
      '########################..###################################..######################..#########################',
      '########################..###################################..######################..#########################'
    ],

    /* The temptations: what they say, and Ninle's tip the first time you meet one. */
    temptations: {
      c: { name: 'Too-Busy Clock', says: 'Hurry! Too busy to help anyone!', tip: 'Jump over it — or hop ON it to calm it down!', calm: 'Ding! …There’s always time to help.', stompable: true },
      t: { name: 'Grumble Thorn', says: 'Grumble grumble! Nothing is fair!', tip: 'Jump right over the grumbles!' },
      b: { name: 'Fib Bubble', says: 'Psst! Just tell a tiny fib!', tip: 'Hop on it to pop it — the truth is better!', calm: 'Pop! The truth is better!', stompable: true },
      g: { name: 'Grabby Goo', says: 'Mine! Mine! Keep it ALL for yourself!', tip: 'Jump over the greedy goo!' }
    },
    gapName: 'Give-Up Gap',

    lines: {
      firstFall: 'Ninle caught you! Never give up — try again!',
      bridge: 'Ninle made a bridge of light!',
      wayThrough: 'Don’t give up — there’s always a way through!',
      oops: ['Oops! Try again!', 'Boing! You can do it!', 'Almost! Jump again!'],
      hint: 'Jump with Space or ↑. Hop ON clocks and bubbles to calm them. Jump OVER thorns and goo!',
      hintTouch: 'Tap the big Jump button. Hop ON clocks and bubbles to calm them. Jump OVER thorns and goo!',
      goal: 'Reach the glow at the end!'
    },

    intro: [
      { who: 'ninle', text: 'Whoa! The Hidden Hollow is a long tree tunnel — and the glow is at the very end!' },
      { who: 'ninle', text: 'Watch out for TEMPTATIONS. They’re silly things that try to stop us doing what’s kind and true.' },
      { who: 'ninle', text: 'Use ← → to run and Space or ↑ to jump. Hop ON clocks and bubbles to calm them down!',
        touch: 'Use ◀ ▶ to run and the big Jump button to jump. Hop ON clocks and bubbles to calm them down!' },
      { who: 'ninle', text: 'If you bump into one, that’s okay. Just try again!' }
    ],
    finish: [
      { who: 'ninle', text: 'You did it! You jumped right past the temptations!' },
      { who: 'ninle', text: 'Jesus faced temptations too, out in the desert. Each time, He chose God’s way. (Matthew 4:1–11)' },
      { who: 'ninle', text: 'When something tempts us to be unkind, greedy or untruthful, we can ask God for help. He always helps us find a way through!' },
      { who: 'ninle', text: 'Now — let’s take that spark back to the valley!', do: { endRun: true } }
    ],
    replayFinish: [
      { who: 'ninle', text: 'Woohoo! What a run! You collected {hearts} kindness hearts!', do: { endRun: true } }
    ]
  };
})(window.Ninle);
