/* Wayfinder — Journey: "Under the Juniper Tree" (1 Kings 19).
 *
 * Content conventions (see README):
 *  - `kjv`        exact King James Version text (public domain). Never paraphrase inside `kjv`.
 *  - `summary`    Wayfinder's plain-language summary of what the text says. Clearly labelled in the UI.
 *  - `reflection` Wayfinder's reflection. Never presented as Scripture or as God speaking.
 *  - Story steps are data: say / page / choice / set / light / rest / storm / stillness / fx / caption.
 */
(() => {
  'use strict';
  const WF = window.Wayfinder;

  // Story pages are reused in-world and in the end-of-journey journal.
  const PAGES = {
    beersheba: {
      id: 'beersheba',
      title: 'Alone into the wilderness',
      ref: '1 Kings 19:3–4',
      kjv: 'And when he saw that, he arose, and went for his life, and came to Beersheba, which belongeth to Judah, and left his servant there.',
      kjvRef: '1 Kings 19:3',
      summary: 'After Jezebel’s threat, Elijah ran for his life to Beersheba, at the southern edge of Judah. He left his servant there and went on alone, a day’s journey into the wilderness.',
      reflection: 'Exhaustion and fear often come with withdrawal. Elijah left behind the one person travelling with him. If you have gone quiet with the people closest to you, you’re not unusual — and you’re not beyond reach.',
    },
    enough: {
      id: 'enough',
      title: 'It is enough',
      ref: '1 Kings 19:4',
      kjv: 'But he himself went a day’s journey into the wilderness, and came and sat down under a juniper tree: and he requested for himself that he might die; and said, It is enough; now, O LORD, take away my life; for I am not better than my fathers.',
      kjvRef: '1 Kings 19:4',
      summary: 'Elijah sat down under a desert shrub and asked God to take his life. He said he was no better than those who had gone before him.',
      reflection: 'Scripture doesn’t hide Elijah’s darkest words, and he speaks them to God. God’s response, as the story goes on, is not a rebuke. (“Juniper” is the older English rendering; most modern translations say “broom tree”, a desert shrub.)',
    },
    arise: {
      id: 'arise',
      title: 'Arise and eat',
      ref: '1 Kings 19:5–7',
      kjv: 'And as he lay and slept under a juniper tree, behold, then an angel touched him, and said unto him, Arise and eat. And he looked, and, behold, there was a cake baken on the coals, and a cruse of water at his head. And he did eat and drink, and laid him down again.',
      kjvRef: '1 Kings 19:5–6',
      summary: 'While Elijah slept, an angel touched him and told him to get up and eat. There was bread baked on hot stones and a jar of water. He ate, drank, and lay down again.',
      reflection: 'Before any conversation about what happened, God’s care comes as sleep, food, water, and a gentle touch.',
    },
    toogreat: {
      id: 'toogreat',
      title: 'The journey is too great',
      ref: '1 Kings 19:7–8',
      kjv: 'And the angel of the LORD came again the second time, and touched him, and said, Arise and eat; because the journey is too great for thee.',
      kjvRef: '1 Kings 19:7',
      summary: 'The angel came a second time with the same care, and named the truth: the journey ahead was too much for Elijah on his own. Strengthened, he travelled forty days and nights to Horeb.',
      reflection: 'Care was given twice, without impatience. “Too great for thee” isn’t an accusation of weakness. It’s simply honest.',
    },
    horeb: {
      id: 'horeb',
      title: 'The mountain of God',
      ref: '1 Kings 19:8–9',
      kjv: 'And he arose, and did eat and drink, and went in the strength of that meat forty days and forty nights unto Horeb the mount of God.',
      kjvRef: '1 Kings 19:8',
      summary: 'Elijah walked forty days and nights to Horeb — also called Sinai, where God had made his covenant with Israel generations before. There he went into a cave and spent the night.',
      reflection: 'Elijah’s recovery wasn’t instant. It was a long walk, one day at a time — back toward a place where God had met his people before.',
    },
    question: {
      id: 'question',
      title: 'What doest thou here?',
      ref: '1 Kings 19:9–10',
      kjv: 'And he came thither unto a cave, and lodged there; and, behold, the word of the LORD came to him, and he said unto him, What doest thou here, Elijah?',
      kjvRef: '1 Kings 19:9',
      summary: 'In the cave, God asked Elijah what he was doing there. Elijah answered honestly: he had served God passionately, Israel had abandoned the covenant and killed the prophets — “I, even I only, am left” — and now they wanted to kill him too.',
      reflection: 'God’s first word to Elijah at the mountain is a question, not a lecture. Elijah’s answer is raw, and partly shaped by exhaustion: he believed he was completely alone.',
    },
    still: {
      id: 'still',
      title: 'A still small voice',
      ref: '1 Kings 19:11–13',
      kjv: 'And after the earthquake a fire; but the LORD was not in the fire: and after the fire a still small voice.',
      kjvRef: '1 Kings 19:12',
      summary: 'God passed by. A great wind broke the rocks, then came an earthquake, then fire — but the LORD was not in them. Then came what modern translations render “a gentle whisper”, “a low whisper”, or “a sound of sheer silence”. Elijah wrapped his face in his cloak and stood at the mouth of the cave.',
      reflection: 'God’s presence isn’t always loud or dramatic. This story doesn’t promise you a voice or a particular feeling. It shows God coming near, quietly, to someone worn out.',
    },
    seventhousand: {
      id: 'seventhousand',
      title: 'Not the only one',
      ref: '1 Kings 19:15–18',
      kjv: 'Yet I have left me seven thousand in Israel, all the knees which have not bowed unto Baal, and every mouth which hath not kissed him.',
      kjvRef: '1 Kings 19:18',
      summary: 'God gave Elijah direction — go back the way you came, with real work to do — and a wider view: seven thousand in Israel had stayed faithful. Elijah was not the only one left.',
      reflection: 'Exhaustion can shrink our view until we feel completely alone. Sometimes part of the way forward is letting someone show us what we can’t see.',
    },
    elisha: {
      id: 'elisha',
      title: 'A companion for the road',
      ref: '1 Kings 19:19–21',
      summary: 'Elijah found Elisha ploughing with twelve yoke of oxen and threw his cloak over him — a sign of calling. Elisha said goodbye to his family, shared a meal with his people, and went with Elijah to serve him.',
      reflection: 'God’s care for Elijah included a companion. Elijah didn’t go back alone.',
    },
  };

  WF.registerJourney({
    id: 'elijah',
    companion: 'elijah',
    title: 'Under the Juniper Tree',
    tagline: 'For when you feel overwhelmed, discouraged, or depleted',
    passage: '1 Kings 19',
    length: 'About 10 minutes · no timer',
    pages: PAGES,
    // Characters who speak in this journey (narrator and Wayfinder notes are built in).
    speakers: {
      hanan: { name: 'Hanan', note: 'a fellow traveller' },
    },

    prologue: {
      heading: 'Before you set out',
      text: 'You are not Elijah. You’ll walk your own road beside his story — and meet a fellow traveller along the way.\n\nStory pages you find are drawn from 1 Kings 19. Quotations are from the King James Version (public domain). Everything else is Wayfinder’s retelling and reflection, and it’s labelled that way.',
      howTo: [
        ['Walk', 'Hold ◀ ▶, use the arrow keys, or tap the path where you want to go.'],
        ['Look closer', 'When something glows, tap it or press Space.'],
        ['Pause', 'Use Pause (top right) or Esc whenever you like. Your place is kept.'],
      ],
    },

    areas: [
      /* 1 ─────────────────────────────────────────────── */
      {
        id: 'road',
        title: 'The Long Road South',
        scene: 'road',
        width: 2300,
        objective: 'Walk the road. Notice what you’re carrying.',
        caption: '[Soft desert wind]',
        intro: [
          { say: { speaker: 'narrator', text: 'Evening in the wilderness. Wind moves through the scrub. You’ve been walking a long time — long enough that you’ve stopped noticing how tired you are.' } },
        ],
        exitRequires: ['seen:pack', 'seen:page-beersheba'],
        exitHint: 'Before you move on, look closer at your pack and the torn page by the road.',
        hotspots: [
          {
            id: 'pack', x: 430, art: 'pack', kind: 'object', label: 'Your pack', verb: 'Look closer', required: true,
            steps: [
              { say: { speaker: 'narrator', text: 'Your pack is heavier than it looks. You’ve carried it so long you hardly notice the weight anymore.' } },
              {
                choice: {
                  key: 'weight',
                  prompt: 'If you opened it, what might be weighing the most?',
                  hint: 'Optional — choose one, or skip.',
                  options: [
                    { value: 'responsibilities', label: 'Responsibilities that never seem to end' },
                    { value: 'others', label: 'Other people’s needs and expectations' },
                    { value: 'self', label: 'My own expectations of myself' },
                    { value: 'event', label: 'Something that happened that I can’t put down' },
                    { value: 'unnamed', label: 'I can’t really name it' },
                  ],
                },
              },
              { say: { speaker: 'narrator', text: 'You don’t need to sort it all out here. For now, it’s enough to notice it. You lift the pack back onto your shoulders.' } },
            ],
            again: [{ say: { speaker: 'narrator', text: 'Still heavy. Still yours to carry for now — but you don’t have to carry it alone.' } }],
          },
          {
            id: 'page-beersheba', x: 980, art: 'page', kind: 'page', label: 'A torn page', verb: 'Read', required: true,
            steps: [{ page: 'beersheba' }],
          },
          {
            id: 'cairn-road', x: 1420, art: 'cairn', kind: 'waymark', label: 'A waymark', verb: 'Add a stone', litFlag: 'lit:cairn-road',
            steps: [
              { say: { speaker: 'narrator', text: 'Someone stacked these stones to mark the way for travellers who would come after them. You add a stone of your own. A small light catches between the cracks.' } },
              { set: 'lit:cairn-road' },
              { light: 'A waymark is lit' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The little light is still burning. Someone else will see it after you.' } }],
          },
          {
            id: 'bloom', x: 1840, art: 'bloom', kind: 'object', label: 'A flowering thornbush', verb: 'Look closer',
            steps: [
              { say: { speaker: 'narrator', text: 'Even here, something is blooming — small and pale, on a thornbush in dry ground. You don’t have to feel better to notice it.' } },
              { light: 'Something beautiful noticed' },
            ],
          },
        ],
      },

      /* 2 ─────────────────────────────────────────────── */
      {
        id: 'juniper',
        title: 'Under the Juniper Tree',
        scene: 'juniper',
        width: 1900,
        objective: 'Find somewhere to rest.',
        caption: '[Warm, still air; a light breeze in thin branches]',
        intro: [
          { say: { speaker: 'narrator', text: 'The heat of the day lingers. There’s no town in sight — only sand, stones, and one shrub with pale blossoms casting a thin shade.' } },
        ],
        exitRequires: ['ate', 'drank', 'slept2'],
        exitHint: 'There’s no hurry. Eat, drink, and rest before you go on.',
        hotspots: [
          {
            id: 'tree', x: 900, art: 'broomTree', kind: 'place', label: 'The broom tree’s shade', verb: 'Sit down', glowR: 140, glowY: 110, sparkY: 200, labelY: 270, required: true,
            steps: [
              { say: { speaker: 'narrator', text: 'Its shade isn’t much. It’s enough to sit down. You let the pack slide off your shoulders.' } },
              { page: 'enough' },
              {
                choice: {
                  key: 'enough',
                  prompt: 'Have you ever felt something like “It is enough”?',
                  hint: 'Optional. Your answer stays on this device.',
                  options: [
                    {
                      value: 'yes', label: 'Yes — that’s close to how I feel',
                      then: [
                        { say: { speaker: 'note', text: 'Thank you for being honest. Tiredness like this is real, and it matters.' } },
                        {
                          choice: {
                            key: 'safety',
                            prompt: 'Elijah’s words went as far as wishing to die. If yours have gone there too, please don’t carry that alone. Are you safe right now?',
                            options: [
                              { value: 'safe', label: 'I’m safe right now' },
                              { value: 'unsafe', label: 'I’m having thoughts of ending my life, or I’m not safe', crisis: true },
                              { value: 'private', label: 'I’d rather not say', then: [{ say: { speaker: 'note', text: 'That’s okay. Support is always one tap away — the “Support” button at the top of the screen.' } }] },
                            ],
                          },
                        },
                      ],
                    },
                    { value: 'sometimes', label: 'Sometimes' },
                    { value: 'no', label: 'Not really' },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
              { rest: { text: 'You lie down in the thin shade and close your eyes.', caption: '[Quiet. Slow breathing.]' } },
              { set: 'slept1' },
              { say: { speaker: 'hanan', text: 'Wake up, friend. There’s bread on the coals here, and water. Get up and eat.' } },
              { say: { speaker: 'narrator', text: 'In Elijah’s story, an angel woke him with a touch and the words “Arise and eat.” On your road, it’s a fellow traveller — an older man named Hanan — who has kept a small fire going.' } },
              { page: 'arise' },
            ],
            again: [
              { if: { flags: ['ate', 'drank'], notFlags: ['slept2'] }, say: { speaker: 'narrator', text: 'The shade is waiting. Hanan thinks you should rest again — you could speak with him.' } },
              { if: { notFlags: ['ate', 'drank'] }, say: { speaker: 'narrator', text: 'The shade will still be here. First, there’s bread and water nearby.' } },
              { if: { flags: ['slept2'] }, say: { speaker: 'narrator', text: 'The shade is still here when you need it.' } },
            ],
          },
          {
            id: 'jar', x: 700, art: 'jar', kind: 'object', label: 'A jar of water', verb: 'Drink', when: { flags: ['slept1'] }, required: true,
            steps: [
              { caption: '[Water poured from a clay jar]' },
              { say: { speaker: 'narrator', text: 'Cool water. You hadn’t realised how thirsty you were. You drink slowly.' } },
              { set: 'drank' },
              { light: 'Water received' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'There’s still water in the jar. Nobody is rationing it.' } }],
          },
          {
            id: 'coals', x: 1090, art: 'coals', kind: 'object', label: 'Bread on the coals', verb: 'Eat', when: { flags: ['slept1'] }, required: true,
            steps: [
              { caption: '[Soft crackle of coals]' },
              { say: { speaker: 'narrator', text: 'Warm, plain bread, baked on hot stones. You eat. It’s better than you expected — or maybe you were hungrier than you knew.' } },
              { set: 'ate' },
              { light: 'Bread received' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The coals are still warm. There’s more if you want it.' } }],
          },
          {
            id: 'hanan', x: 1240, art: 'hanan', kind: 'character', label: 'Hanan', verb: 'Talk', flip: true, when: { flags: ['slept1'] },
            steps: [
              { if: { notFlags: ['ate'] }, say: { speaker: 'hanan', text: 'Eat first. Questions can wait.' } },
              { if: { flags: ['ate'], notFlags: ['drank'] }, say: { speaker: 'hanan', text: 'Have some water, too. The jar is by the tree.' } },
              {
                if: { flags: ['ate', 'drank'] },
                choice: {
                  key: 'hanan-talk',
                  speaker: 'hanan',
                  prompt: 'Hanan pokes at the coals. “Ask me anything you like.”',
                  loop: true,
                  options: [
                    { value: 'why', label: 'Why are you helping me?', then: [{ say: { speaker: 'hanan', text: 'Because the road is long, and nobody walks it well on an empty stomach. Besides — someone did this for me once.' } }] },
                    { value: 'deserve', label: 'I don’t think I deserve this.', then: [{ say: { speaker: 'hanan', text: 'Bread isn’t a prize. It’s bread. You’re hungry, so you eat. In the old story, Elijah wasn’t asked to earn his meal — or to explain himself first.' } }] },
                    { value: 'pray', label: 'Shouldn’t I be praying instead of sleeping?', then: [{ say: { speaker: 'hanan', text: 'Look at the story. Before anything else, Elijah was given sleep, food, and water — twice. Caring for your body isn’t a lack of faith. It can be part of trusting God.' } }] },
                    { value: 'fine', label: 'I’m fine, really.', then: [{ say: { speaker: 'hanan', text: 'Maybe. But I found you asleep under a bush in the middle of the wilderness. You don’t have to be fine with me.' } }] },
                    { value: 'done', label: 'That’s all for now.', end: true },
                  ],
                },
              },
              {
                if: { flags: ['ate', 'drank'], notFlags: ['slept2'] },
                choice: {
                  speaker: 'hanan',
                  prompt: '“Now — rest again. In the story, he ate, drank, and lay down again. Then care came a second time.”',
                  options: [
                    {
                      value: 'rest', label: 'Lie down again',
                      then: [
                        { rest: { text: 'You lie back down. Hanan banks the fire. Nobody needs anything from you for a while.', caption: '[Embers settling. A night bird, far off.]' } },
                        { page: 'toogreat' },
                        { say: { speaker: 'hanan', text: 'The road ahead is too much for you on your own. That’s not failure. It’s just true. Eat a little more — then, if you’ll have me, I’ll walk with you for a while.' } },
                        { set: ['slept2', 'companion'] },
                      ],
                    },
                    { value: 'later', label: 'In a moment', then: [{ say: { speaker: 'hanan', text: 'Take your time. I’ll be here.' } }] },
                  ],
                },
              },
              { if: { flags: ['slept2'] }, say: { speaker: 'hanan', text: 'Ready when you are. The path goes on to the east.' } },
            ],
          },
        ],
      },

      /* 3 ─────────────────────────────────────────────── */
      {
        id: 'pass',
        title: 'Forty Days to Horeb',
        scene: 'pass',
        width: 2700,
        objective: 'Walk on with Hanan. Light the waymarks to find the way through the dark.',
        caption: '[Mountain wind; footsteps on stone]',
        veil: { from: 1500, lifts: ['lit:cairn-a', 'lit:cairn-b', 'lit:cairn-c'] },
        intro: [
          { say: { speaker: 'narrator', text: 'In the strength of that food, Elijah travelled forty days and forty nights. Your road climbs into the mountains. Night is falling, and the far end of the pass is too dark to see.' } },
          { say: { speaker: 'hanan', text: 'Travellers leave waymarks along here. Light each one and the path ahead will show itself — one stretch at a time.' } },
        ],
        exitRequires: ['lit:cairn-a', 'lit:cairn-b', 'lit:cairn-c', 'seen:page-horeb'],
        exitHint: 'The way ahead is still dark. Light the three waymarks, then find the page beyond them.',
        hotspots: [
          {
            id: 'hanan-walk', x: 60, follow: true, art: 'hanan', kind: 'character', label: 'Hanan', verb: 'Talk', labelY: 135,
            steps: [
              {
                choice: {
                  speaker: 'hanan',
                  prompt: 'Hanan walks beside you, steady and unhurried.',
                  loop: true,
                  options: [
                    { value: 'how-long', label: 'How long did it take Elijah to recover?', then: [{ say: { speaker: 'hanan', text: 'The text says forty days and nights of walking just to reach Horeb. And when he got there, he still had hard questions. Healing that takes time isn’t a sign that God has stopped caring.' } }] },
                    { value: 'you', label: 'Do you ever feel like this?', then: [{ say: { speaker: 'hanan', text: 'More than I’d like. I’ve learned to say it out loud to a few people I trust — and to my doctor, once. That helped more than pretending.' } }] },
                    { value: 'wrong', label: 'Is it wrong to feel this tired as a Christian?', then: [{ say: { speaker: 'hanan', text: 'Elijah was one of the great prophets, and he came apart. Being tired is human. Jesus himself slept in a boat during a storm (Mark 4:38), and he told his friends to come away to a quiet place and rest a while (Mark 6:31).' } }] },
                    { value: 'done', label: 'Let’s keep walking.', end: true },
                  ],
                },
              },
            ],
          },
          {
            id: 'cairn-a', x: 520, art: 'cairn', kind: 'waymark', label: 'Waymark', verb: 'Add a stone', litFlag: 'lit:cairn-a', required: true,
            steps: [
              { say: { speaker: 'narrator', text: 'As you set your stone on the pile, Hanan says, “Every waymark is a remembering. Remember a time someone cared for you when you needed it.”' } },
              {
                choice: {
                  key: 'remember-care',
                  prompt: 'Can you think of a time someone cared for you?',
                  options: [
                    { value: 'yes', label: 'I can think of someone', then: [{ say: { speaker: 'narrator', text: 'Hold them in mind for a moment. That care was real — and it may be a clue about who to turn to now.' } }] },
                    { value: 'hard', label: 'It’s hard to think of anyone', then: [{ say: { speaker: 'narrator', text: 'That’s okay. Sometimes care has been hard to find, or hard to remember when we’re worn out. You can hold the question gently, without forcing an answer.' } }] },
                  ],
                },
              },
              { set: 'lit:cairn-a' },
              { light: 'The first waymark is lit' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The waymark glows steadily.' } }],
          },
          {
            id: 'cairn-b', x: 1150, art: 'cairn', kind: 'waymark', label: 'Waymark', verb: 'Add a stone', litFlag: 'lit:cairn-b', required: true,
            steps: [
              { say: { speaker: 'narrator', text: '“Another remembering,” says Hanan. “A time you came through something hard.”' } },
              {
                choice: {
                  key: 'remember-through',
                  prompt: 'Is there a hard time you came through?',
                  options: [
                    { value: 'yes', label: 'Yes, I remember one', then: [{ say: { speaker: 'narrator', text: 'You may not have come through it neatly, or alone. But you came through. That memory is a waymark too.' } }] },
                    { value: 'still', label: 'I feel like I’m still in it', then: [{ say: { speaker: 'narrator', text: 'Then this is a waymark for the middle of the road, not the end of it. Elijah was in the middle of his, too.' } }] },
                  ],
                },
              },
              { set: 'lit:cairn-b' },
              { light: 'The second waymark is lit' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The waymark glows steadily.' } }],
          },
          {
            id: 'cairn-c', x: 1760, art: 'cairn', kind: 'waymark', label: 'Waymark', verb: 'Add a stone', litFlag: 'lit:cairn-c', required: true,
            steps: [
              { say: { speaker: 'narrator', text: '“One more,” says Hanan. “What gives you real rest? Not just distraction — rest.”' } },
              {
                choice: {
                  key: 'rest-gives',
                  prompt: 'What gives you real rest?',
                  hint: 'Optional — choose one, write your own, or skip.',
                  allowText: true,
                  placeholder: 'In your own words (stays on this device)',
                  options: [
                    { value: 'sleep', label: 'Proper sleep' },
                    { value: 'outside', label: 'Time outside' },
                    { value: 'beauty', label: 'Music, art, or beauty' },
                    { value: 'people', label: 'Being with someone safe' },
                    { value: 'quiet', label: 'Quiet time with God' },
                  ],
                },
              },
              { say: { speaker: 'narrator', text: 'As the last stone settles, light runs along the path ahead. The way through the dark is open.' } },
              { set: 'lit:cairn-c' },
              { light: 'The third waymark is lit' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The path ahead is lit now.' } }],
          },
          {
            id: 'page-horeb', x: 2350, art: 'page', kind: 'page', label: 'A page by the path', verb: 'Read', when: { flags: ['lit:cairn-c'] }, required: true,
            steps: [{ page: 'horeb' }],
          },
        ],
      },

      /* 4 ─────────────────────────────────────────────── */
      {
        id: 'cave',
        title: 'The Cave on the Mountain',
        scene: 'cave',
        width: 1900,
        objective: 'Find shelter for the night.',
        caption: '[A cold, quiet night]',
        intro: [
          { say: { speaker: 'narrator', text: 'Horeb. The mountain rises dark against more stars than you can count. Hanan sits down on a rock to wait. “Go on,” he says. “Some of this you walk on your own.”' } },
        ],
        exitRequires: ['seen:cave', 'stillness'],
        exitHint: 'Find shelter in the cave, then go out and stand on the mountain.',
        hotspots: [
          {
            id: 'cave', x: 520, art: 'caveMountain', kind: 'place', label: 'The cave', verb: 'Go inside', glowR: 70, glowY: 50, sparkY: 130, labelY: 150, required: true,
            steps: [
              { say: { speaker: 'narrator', text: 'You step into the cave. It’s cold and very quiet. Outside, the stars are bright.' } },
              { page: 'question' },
              {
                choice: {
                  key: 'here',
                  prompt: 'If someone asked you gently, “What are you doing here?” — what might you say?',
                  hint: 'Optional. Choose, write, or skip.',
                  allowText: true,
                  placeholder: 'In your own words (stays on this device)',
                  options: [
                    { value: 'running', label: 'I’m running from something' },
                    { value: 'surviving', label: 'I’m just trying to get through' },
                    { value: 'alone', label: 'I’ve given so much, and I feel alone' },
                    { value: 'seeking', label: 'I’m looking for God' },
                    { value: 'unsure', label: 'I don’t know yet' },
                  ],
                },
              },
              { say: { speaker: 'narrator', text: 'However you answered, it’s allowed. Honest words are a place where prayer can begin.' } },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The cave is quiet. Outside, at the edge of the mountain, there’s a ledge under the stars.' } }],
          },
          {
            id: 'ledge', x: 1380, art: 'ledge', kind: 'place', label: 'Stand on the mountain', verb: 'Step out', when: { flags: ['seen:cave'] }, glowR: 90, labelY: 120, required: true,
            steps: [
              { say: { speaker: 'narrator', text: 'In the story, Elijah was told to go out and stand on the mountain, because the LORD was about to pass by. You step out onto the ledge.' } },
              {
                storm: [
                  { fx: 'wind', sound: 'wind', caption: '[A great wind rushes over the mountain]', text: 'A great and strong wind tore at the mountain and broke the rocks — but the LORD was not in the wind.' },
                  { fx: 'quake', sound: 'quake', caption: '[A deep, low rumble]', text: 'After the wind, an earthquake — but the LORD was not in the earthquake.' },
                  { fx: 'fire', sound: 'fire', caption: '[Distant crackling fire]', text: 'After the earthquake, a fire — but the LORD was not in the fire.' },
                ],
              },
              { stillness: { text: 'After the fire…', seconds: 8, caption: '[Silence]' } },
              { page: 'still' },
              { set: 'stillness' },
              { say: { speaker: 'narrator', text: 'You stand at the edge of the mountain a little longer. Nothing dramatic happens. The quiet is not empty.' } },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The night is calm now. Hanan is waiting further along the path.' } }],
          },
        ],
      },

      /* 5 ─────────────────────────────────────────────── */
      {
        id: 'dawn',
        title: 'Back the Way You Came',
        scene: 'dawn',
        width: 2300,
        objective: 'Walk down into the valley at dawn.',
        caption: '[Soft morning air; warmer music]',
        intro: [
          { say: { speaker: 'narrator', text: 'Dawn. The path winds down toward farmland. In the story, God gave Elijah renewed direction: go back the way you came. There was real work still to do — and he would not do it alone.' } },
        ],
        exitRequires: ['seen:overlook', 'seen:elisha', 'farewell'],
        exitHint: 'There’s still something to see from the overlook, someone in the field, and a goodbye to say.',
        hotspots: [
          {
            id: 'overlook', x: 560, art: 'overlook', kind: 'place', label: 'The overlook', verb: 'Look out', glowR: 80, required: true,
            steps: [
              { fx: 'lights' },
              { caption: '[Quiet morning; distant village sounds]' },
              { say: { speaker: 'narrator', text: 'Below, cooking fires are being lit in the villages, one after another — far more than you could count. You thought you were alone on this road. You weren’t.' } },
              { page: 'seventhousand' },
              { light: 'Lights in the valley' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The valley is full of small lights.' } }],
          },
          {
            id: 'elisha', x: 1300, art: 'elisha', kind: 'character', label: 'Someone ploughing', verb: 'Watch', glowR: 120, labelY: 140, required: true,
            steps: [
              { say: { speaker: 'narrator', text: 'A man is ploughing behind a team of oxen, steady and patient. He lifts a hand to you as you pass.' } },
              { page: 'elisha' },
              { light: 'A companion for the road' },
            ],
            again: [{ say: { speaker: 'narrator', text: 'The ploughman keeps working, row by row.' } }],
          },
          {
            id: 'hanan-farewell', x: 1880, art: 'hanan', kind: 'character', label: 'Hanan', verb: 'Say goodbye', flip: true,
            steps: [
              { say: { speaker: 'hanan', text: 'This is where our roads part, friend.' } },
              {
                choice: {
                  key: 'who',
                  speaker: 'hanan',
                  prompt: '“Before you go — who might walk the next stretch with you?”',
                  hint: 'Optional.',
                  options: [
                    { value: 'friend', label: 'A friend' },
                    { value: 'family', label: 'Family' },
                    { value: 'church', label: 'Someone at church' },
                    { value: 'pastor', label: 'A pastor' },
                    { value: 'professional', label: 'A counsellor or doctor' },
                    { value: 'unsure', label: 'I’m not sure yet', then: [{ say: { speaker: 'hanan', text: 'That’s an honest answer. Keep the question open. Sometimes it starts with one small, true conversation.' } }] },
                  ],
                },
              },
              { if: { answer: { key: 'who', in: ['friend', 'family', 'church', 'pastor', 'professional'] } }, say: { speaker: 'hanan', text: 'Then maybe one next step is letting them know how you’re really doing.' } },
              { say: { speaker: 'hanan', text: 'Elijah went back as the same man — still tired in places, with hard work ahead. But he had been fed, he had rested, he had been met, and he wasn’t going back alone. Go gently.' } },
              { set: 'farewell' },
            ],
            again: [{ say: { speaker: 'hanan', text: 'Go gently, friend. The path goes on.' } }],
          },
        ],
      },
    ],

    reflect: {
      intro: 'Take a moment to look back over the road. There are no right answers here, and everything is optional.',
      questions: [
        {
          key: 'stood-out',
          prompt: 'What stood out to you along the way?',
          multi: true,
          options: [
            { value: 'rest', label: 'Being allowed to rest' },
            { value: 'body', label: 'Bread and water — care for my body' },
            { value: 'honest', label: 'Elijah’s honest words under the tree' },
            { value: 'question', label: 'The question in the cave' },
            { value: 'quiet', label: 'The quiet after the storm' },
            { value: 'notalone', label: 'Not being alone' },
          ],
        },
        {
          key: 'true-now',
          prompt: 'What feels most true for you right now?',
          options: [
            { value: 'rest', label: 'I need more rest than I’ve admitted' },
            { value: 'tell', label: 'I need to tell someone how I’m really doing' },
            { value: 'pray', label: 'I want to bring my honest words to God' },
            { value: 'notalone', label: 'I need reminding that I’m not alone' },
            { value: 'unsure', label: 'I’m still not sure — and that’s okay' },
          ],
          allowText: true,
          placeholder: 'Anything else you noticed? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: 'If you’d like, take a minute to breathe and pray. You don’t have to feel anything in particular. Scripture says the Holy Spirit helps us in our weakness, even when we don’t know what to pray (Romans 8:26).',
        breathIn: 'Lord Jesus Christ…',
        breathOut: '…be near me in my tiredness.',
        cycles: 4,
      },
    },

    scripture: [
      {
        ref: '1 Kings 19:4–8',
        title: 'Care before anything else',
        quotes: [
          { ref: '1 Kings 19:5', text: 'And as he lay and slept under a juniper tree, behold, then an angel touched him, and said unto him, Arise and eat.' },
          { ref: '1 Kings 19:7', text: 'And the angel of the LORD came again the second time, and touched him, and said, Arise and eat; because the journey is too great for thee.' },
        ],
        context: 'Elijah has fled for his life after Jezebel’s threat. Under a broom tree, he has asked to die. God’s response is not an argument or a rebuke, but sleep, food, water, and touch — given twice. Only afterwards does Elijah travel on.',
        question: 'What would it look like to treat your body’s needs — sleep, food, rest — as part of your life with God, rather than a distraction from it?',
      },
      {
        ref: '1 Kings 19:9–18',
        title: 'Presence, a question, and a wider view',
        quotes: [
          { ref: '1 Kings 19:12', text: 'And after the earthquake a fire; but the LORD was not in the fire: and after the fire a still small voice.' },
          { ref: '1 Kings 19:18', text: 'Yet I have left me seven thousand in Israel, all the knees which have not bowed unto Baal, and every mouth which hath not kissed him.' },
        ],
        context: 'At Horeb — Sinai, where God once appeared with thunder, fire, and a quaking mountain (Exodus 19:16–18) — God now draws near quietly. God asks Elijah a question, listens to his honest answer, gives him renewed direction and a successor (Elisha), and corrects his belief that he is the only faithful one left.',
        question: 'Where might you be seeing only part of the picture right now? Who could help you see more of it?',
      },
      {
        ref: 'Matthew 11:28–30',
        title: 'Jesus’ invitation to the weary',
        quotes: [
          { ref: 'Matthew 11:28–30', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.' },
        ],
        context: 'Jesus speaks to ordinary people who are worn down — including by heavy religious demands. He offers himself, not a new list of tasks: “learn of me.” A yoke is still a yoke; life with Jesus isn’t empty of work. But it is shared, and it fits.',
        question: 'What burden would you like to bring to Jesus just as it is, without tidying it up first?',
      },
      {
        ref: 'Psalm 42:5 · Romans 8:26',
        title: 'Honest prayers, and help when words run out',
        quotes: [
          { ref: 'Psalm 42:5', text: 'Why art thou cast down, O my soul? and why art thou disquieted in me? hope thou in God: for I shall yet praise him for the help of his countenance.' },
          { ref: 'Romans 8:26', text: 'Likewise the Spirit also helpeth our infirmities: for we know not what we should pray for as we ought: but the Spirit itself maketh intercession for us with groanings which cannot be uttered.' },
        ],
        context: 'The psalmist speaks honestly to their own downcast soul and keeps reaching for hope, without pretending the sadness is gone; a similar refrain returns in Psalm 42:11 and 43:5. Paul, writing about a world still groaning as it waits for redemption, says the Holy Spirit helps us in weakness — even praying for us when we have no words.',
        question: 'If prayer feels hard right now, could you rest in the thought that you are not praying alone?',
      },
    ],

    nextSteps: [
      {
        id: 'rest',
        label: 'Rest on purpose',
        detail: 'Choose one concrete rest for the next few days: an earlier night, a proper meal, a walk outside, an hour without your phone. Elijah’s recovery began with sleep and food.',
        prompt: 'My rest step:',
        placeholder: 'e.g. In bed by 10:30 on Tuesday',
      },
      {
        id: 'tell',
        label: 'Tell someone trustworthy how I’m really doing',
        detail: 'You don’t need a perfect speech. You could say: “I’ve been more worn out than I’ve let on. Could we talk this week?”',
        prompt: 'Who I could tell, and when:',
        placeholder: 'e.g. Text my sister tonight',
      },
      {
        id: 'pray',
        label: 'Pray using a short guided prayer',
        detail: 'A prayer you can pray now or later, in your own words or these.',
        prayer: 'Lord Jesus, I’m tired. You know what I’m carrying, even the parts I can’t name. Thank you that you met Elijah with bread and water, with rest, and with your presence. Meet me too, in the way I need. Holy Spirit, help me when I don’t have words. Give me wisdom for one next step, the courage to take it, and the humility to let others help me. Amen.',
      },
      {
        id: 'support',
        label: 'Talk with a pastor, counsellor, or doctor',
        detail: 'Ongoing exhaustion, low mood, or poor sleep can have many causes, some of them physical. A doctor, counsellor, or pastor can help you understand what’s going on. Asking for help is a wise and faithful step, not a failure of faith.',
        prompt: 'Who I could contact:',
        placeholder: 'e.g. Book a GP appointment on Monday',
        showSupport: true,
      },
      {
        id: 'remember',
        label: 'Write down one thing I want to remember',
        detail: 'One sentence is enough.',
        prompt: 'What I want to remember:',
        placeholder: 'e.g. Care came twice.',
      },
      {
        id: 'later',
        label: 'Rest, and return to this later',
        detail: 'That’s a real choice, not a failure. Wayfinder will be here.',
      },
    ],

    closing: {
      heading: 'You walked Under the Juniper Tree',
      hope: 'Elijah’s story doesn’t end with everything fixed. It ends with a man who had been fed and rested, met by God in the quiet, shown he was not alone, and given a companion and a next step. Wherever you are on your own road, you don’t walk it alone. Go gently.',
    },
  });
})();
