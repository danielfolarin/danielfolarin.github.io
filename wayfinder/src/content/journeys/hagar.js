/* Wayfinder — Journey: "The God Who Sees" (Genesis 16; 21:8–21).
 * Theme: feeling unseen, abandoned, or vulnerable; God who sees and hears.
 * Care points: Hagar's mistreatment is real and named. Genesis 16:9 is never used to
 * suggest anyone should stay where they are being harmed. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const N = (text) => ({ say: { speaker: 'narrator', text } });
  const SE = (text) => ({ say: { speaker: 'sefa', text } });

  const PAGES = {
    given: {
      title: 'Used for someone else’s plan',
      ref: 'Genesis 16:1–4',
      summary: 'Sarai could not have children. Following a custom of the time, she gave her Egyptian servant Hagar to Abram so that Hagar would bear a child for them. Hagar conceived, and tension grew between the two women.',
      reflection: 'Hagar is a foreigner and a servant. The text never records her being asked what she wanted. She is used to solve other people’s problem.',
    },
    fled: {
      title: 'She fled from her face',
      ref: 'Genesis 16:5–6',
      kjv: 'But Abram said unto Sarai, Behold, thy maid is in thy hand; do to her as it pleaseth thee. And when Sarai dealt hardly with her, she fled from her face.',
      kjvRef: 'Genesis 16:6',
      summary: 'When conflict came, Abram stepped back and left Hagar in Sarai’s power. Sarai treated her harshly, and Hagar — pregnant and alone — ran into the wilderness.',
      reflection: 'The people with power failed her. Scripture tells this honestly; it doesn’t make Abram and Sarai heroes in this moment.',
    },
    found: {
      title: 'Found by a spring',
      ref: 'Genesis 16:7–8',
      kjv: 'And the angel of the LORD found her by a fountain of water in the wilderness, by the fountain in the way to Shur.',
      kjvRef: 'Genesis 16:7',
      summary: 'The angel of the LORD found Hagar by a spring on the road toward Egypt. He called her by name and asked two questions: “whence camest thou? and whither wilt thou go?” She answered honestly that she was running from her mistress.',
      reflection: 'This is the first time in the Bible that the angel of the LORD appears to anyone — and it is to a runaway, foreign, pregnant servant. She is addressed by name and invited to tell her own story.',
    },
    hard: {
      title: 'A hard word, and a promise',
      ref: 'Genesis 16:9–12',
      kjv: 'And the angel of the LORD said unto her, Behold, thou art with child, and shalt bear a son, and shalt call his name Ishmael; because the LORD hath heard thy affliction.',
      kjvRef: 'Genesis 16:11',
      summary: 'Hagar was told to go back and submit to Sarai — and promised descendants too many to count. Her son would be named Ishmael, which means “God hears”, because the LORD had heard her affliction.',
      reflection: 'This is a hard passage, and Christians have wrestled with it. It describes what happened to one woman in a particular time; it is not an instruction that anyone should stay where they are being harmed. What the text insists on is that God heard her suffering.',
    },
    seest: {
      title: 'Thou God seest me',
      ref: 'Genesis 16:13–14',
      kjv: 'And she called the name of the LORD that spake unto her, Thou God seest me: for she said, Have I also here looked after him that seeth me?',
      kjvRef: 'Genesis 16:13',
      summary: 'Hagar gave God a name: El Roi, “the God who sees me.” The well was named after the encounter: Beer-lahai-roi, “the well of the Living One who sees me.”',
      reflection: 'Hagar is the only person in Scripture who gives God a name. The one nobody saw became the one who named God as the One who sees.',
    },
    sentaway: {
      title: 'Sent away with bread and water',
      ref: 'Genesis 21:9–14',
      summary: 'Years later, after Isaac was born, Sarah demanded that Hagar and her son be driven out. Abraham was grieved (21:11) but sent them into the wilderness of Beersheba with some bread and a skin of water.',
      reflection: 'Hagar is abandoned a second time — this time with a child to protect. The story doesn’t soften how little they were given.',
    },
    heard: {
      title: 'God heard the voice of the lad',
      ref: 'Genesis 21:15–17',
      kjv: 'And God heard the voice of the lad; and the angel of God called to Hagar out of heaven, and said unto her, What aileth thee, Hagar? fear not; for God hath heard the voice of the lad where he is.',
      kjvRef: 'Genesis 21:17',
      summary: 'When the water ran out, Hagar laid her son under a shrub and sat a bowshot away, because she could not bear to watch him die. She wept. God heard — “where he is.”',
      reflection: 'God meets them in the exact place of despair — “where he is” — not after they have found their own way out.',
    },
    well: {
      title: 'Her eyes were opened',
      ref: 'Genesis 21:19–21',
      kjv: 'And God opened her eyes, and she saw a well of water; and she went, and filled the bottle with water, and gave the lad drink.',
      kjvRef: 'Genesis 21:19',
      summary: 'God opened Hagar’s eyes, and she saw a well. She filled the skin and gave her son a drink. God was with the boy as he grew up in the wilderness.',
      reflection: 'The well may have been there all along. Sometimes what changes first is not our circumstances, but what we are able to see.',
    },
  };

  const seenReplies = {
    pain: 'You said you’d want God to see how much it hurts. Here, God hears a boy crying and a mother weeping a bowshot away — and answers them where they are.',
    effort: 'You said how hard you’ve been trying. Hagar had nothing left to try with. God came anyway.',
    fear: 'You said how afraid you are. The first words here are “fear not” — not a rebuke, but a promise that she isn’t alone.',
    whole: 'You said all of you, even what you hide. That’s what “the God who sees me” means: nothing about you is hidden from his care.',
  };

  WF.registerJourney({
    id: 'hagar',
    companion: 'hagar',
    title: 'The God Who Sees',
    tagline: 'For when you feel unseen, overlooked, abandoned, or vulnerable',
    passage: 'Genesis 16; 21',
    length: 'About 9 minutes · no timer',
    pages: PAGES,
    speakers: { sefa: { name: 'Sefa', note: 'keeper of a desert spring' } },
    prologue: {
      heading: 'Before you set out',
      text: 'You are not Hagar. You’ll walk your own road beside her story, with an older woman named Sefa who keeps a spring in the desert.\n\nHagar’s story includes real mistreatment by people with power over her. Wayfinder takes that seriously. If anyone is hurting, threatening, or controlling you now, your safety matters most — the Support button at the top is always there.',
    },
    areas: [
      {
        id: 'camp', title: 'The Tent Camp', scene: 'tentcamp', width: 2000,
        objective: 'Notice what is happening in the camp.',
        caption: '[Hot wind; goats and voices in the distance]',
        intro: [N('Afternoon heat over a camp of tents. Everyone is busy. No one looks at you.')],
        exitRequires: ['seen:tent', 'seen:page-fled', 'seen:sefa'],
        exitHint: 'Look at the tent, read the page, and speak with the woman at the camp’s edge.',
        hotspots: [
          {
            id: 'tent', x: 520, art: 'tent', kind: 'place', label: 'The large tent', verb: 'Look closer', glowR: 100, glowY: 50, labelY: 140, required: true,
            steps: [
              { page: 'given' },
              {
                choice: {
                  key: 'unseen', prompt: 'Where have you felt unseen, used, or overlooked?', hint: 'Optional — choose one, or skip.',
                  options: [
                    { value: 'home', label: 'At home or in my family' },
                    { value: 'work', label: 'At work or school' },
                    { value: 'church', label: 'At church' },
                    { value: 'relationship', label: 'In a relationship' },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
              N('Being overlooked or used is a real wound. It isn’t a sign that you matter less.'),
            ],
            again: [N('The tent flap moves in the hot wind.')],
          },
          {
            id: 'page-fled', x: 1100, art: 'page', kind: 'page', label: 'A page by the tent ropes', verb: 'Read', required: true,
            steps: [
              { page: 'fled' },
              {
                choice: {
                  key: 'safe', prompt: 'Hagar ran from harsh treatment. Is anyone hurting, threatening, or controlling you now?',
                  hint: 'Optional. Your answer stays on this device.',
                  options: [
                    { value: 'no', label: 'No' },
                    { value: 'past', label: 'In the past, not now', then: [{ say: { speaker: 'note', text: 'Thank you for telling us. Past harm can still affect us a great deal. A counsellor or pastor you trust can help you carry it.' } }] },
                    { value: 'now', label: 'Yes — someone is hurting me now', crisis: true, then: [{ say: { speaker: 'note', text: 'You deserve to be safe. Domestic abuse and harm services can help you make a safety plan — your local emergency number or helplines can connect you. None of this story means you should stay where you are being hurt.' } }] },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
            ],
            again: [N('The page is weighed down with a small stone.')],
          },
          {
            id: 'sefa', x: 1650, art: 'sefa', kind: 'character', label: 'A woman at the camp’s edge', verb: 'Talk', flip: true, required: true,
            steps: [
              SE('You look like someone who’s leaving. I keep a spring on the road to Shur. Walk with me, if you like.'),
              {
                choice: {
                  key: 'sefa-talk', speaker: 'sefa', prompt: 'Sefa shades her eyes from the sun.', loop: true,
                  options: [
                    { value: 'why', label: 'Why are you out here?', then: [SE('Someone once left me out in this wilderness. I lived. I stayed to help the next one.')] },
                    { value: 'notice', label: 'Does God notice people like us?', then: [SE('That’s the question this road answers. Come and see.')] },
                    { value: 'done', label: 'Let’s go.', end: true },
                  ],
                },
              },
            ],
            again: [SE('The spring is south, along the road.')],
          },
        ],
      },
      {
        id: 'spring', title: 'The Spring on the Way to Shur', scene: 'spring', width: 2100,
        objective: 'Find the spring on the road to Shur.',
        caption: '[Running water; palm leaves rustling]',
        intro: [N('The road south is long and bright. Then — green. Palms, reeds, and the sound of water.')],
        exitRequires: ['seen:pool', 'seen:page-hard', 'seen:naming'],
        exitHint: 'Rest by the pool, read the hard page, and stop at the stone by the spring.',
        hotspots: [
          { id: 'sefa-walk', x: 60, follow: true, art: 'sefa', kind: 'character', label: 'Sefa', verb: 'Talk', steps: [SE('Drink, rest. Nobody here will send you away.')] },
          {
            id: 'pool', x: 700, art: 'pool', kind: 'place', label: 'The spring', verb: 'Rest here', glowR: 100, required: true,
            steps: [
              { caption: '[Cool water over stones]' },
              { page: 'found' },
              {
                choice: {
                  key: 'where', prompt: 'Where have you come from — and where are you going?', hint: 'Optional. Choose, write, or skip.',
                  allowText: true, placeholder: 'In your own words (stays on this device)',
                  options: [
                    { value: 'pain', label: 'From something painful, toward I don’t know' },
                    { value: 'belong', label: 'From a place I didn’t belong' },
                    { value: 'between', label: 'I’m stuck somewhere in between' },
                    { value: 'unknown', label: 'I don’t know yet' },
                  ],
                },
              },
              N('Hagar was asked to tell her own story — and she was listened to.'),
              { light: 'Water at the spring' },
            ],
            again: [N('The water is cool and clear.')],
          },
          {
            id: 'page-hard', x: 1250, art: 'page', kind: 'page', label: 'A page by the reeds', verb: 'Read', required: true,
            steps: [
              { page: 'hard' },
              SE('If someone is harming you, God’s care for Hagar is not a reason to stay unsafe. Getting safe and getting help is right. Hear the promise in it: God heard her.'),
            ],
          },
          {
            id: 'naming', x: 1760, art: 'lamentStone', kind: 'place', label: 'A stone by the spring', verb: 'Look closer', required: true,
            steps: [
              N('Someone has carved a few words into the stone: “the One who sees me.”'),
              { page: 'seest' },
              {
                choice: {
                  key: 'seen', noSkip: true,
                  prompt: 'If God truly sees you, what would you most want him to see?',
                  options: [
                    { value: 'pain', label: 'How much it hurts' },
                    { value: 'effort', label: 'How hard I’ve been trying' },
                    { value: 'fear', label: 'How afraid I am' },
                    { value: 'whole', label: 'All of me — even what I hide' },
                  ],
                },
              },
              N('You don’t have to prove any of it. Being seen by God doesn’t depend on being noticed by anyone else.'),
            ],
            again: [N('“The One who sees me.”')],
          },
        ],
      },
      {
        id: 'wilderness', title: 'The Well in the Wilderness', scene: 'wilderness', width: 2200,
        objective: 'The water has run out. Look for what you cannot yet see.',
        caption: '[Dry wind over sand]',
        intro: [N('Years pass in the story. Hagar is sent away again — this time with her son, a little bread, and one skin of water — into the wilderness of Beersheba.')],
        exitRequires: ['seen:skin', 'eyes', 'farewell'],
        exitHint: 'Find the empty water skin, stay by the shrub, and look for the well.',
        hotspots: [
          { id: 'sefa-desert', x: 60, follow: true, art: 'sefa', kind: 'character', label: 'Sefa', verb: 'Talk', when: { notFlags: ['eyes'] }, steps: [SE('Keep going. I know this part of the road.')] },
          {
            id: 'skin', x: 450, art: 'waterskin', kind: 'object', label: 'A water skin', verb: 'Pick up', required: true,
            steps: [
              N('The skin is empty. You shake it. Nothing.'),
              { page: 'sentaway' },
            ],
            again: [N('Still empty.')],
          },
          {
            id: 'shrub', x: 1050, art: 'shrub', kind: 'place', label: 'A desert shrub', verb: 'Sit down', glowR: 80, required: true,
            steps: [
              N('Thin shade under a desert shrub. A bowshot away, a mother once sat and wept.'),
              { page: 'heard' },
              { if: { answer: { key: 'seen', in: ['pain'] } }, say: { speaker: 'sefa', text: seenReplies.pain } },
              { if: { answer: { key: 'seen', in: ['effort'] } }, say: { speaker: 'sefa', text: seenReplies.effort } },
              { if: { answer: { key: 'seen', in: ['fear'] } }, say: { speaker: 'sefa', text: seenReplies.fear } },
              { if: { answer: { key: 'seen', in: ['whole'] } }, say: { speaker: 'sefa', text: seenReplies.whole } },
              { stillness: { text: 'Lift your eyes…', seconds: 6, caption: '[Wind dying down]', doneText: '…and there was a well of water.' } },
              { set: 'eyes' },
            ],
            again: [N('The shade is still here.')],
          },
          {
            id: 'well', x: 1650, art: 'well', kind: 'place', label: 'A well', verb: 'Draw water', litFlag: 'eyes', when: { flags: ['eyes'] }, glowR: 90, required: true,
            steps: [
              { caption: '[Water drawn up from a well]' },
              { page: 'well' },
              N('You fill the skin. Nothing about the wilderness has changed. But there is water for the next part of the road.'),
              { light: 'A well in the wilderness' },
              SE('I’ll go back to my spring now. Go gently — and tell someone what you’ve seen. Being seen by God often starts with letting one person see you too.'),
              { set: 'farewell' },
            ],
            again: [N('Cool water, deep in the stone.')],
          },
        ],
      },
    ],
    reflect: {
      intro: 'Look back over the road. Everything here is optional.',
      questions: [
        {
          key: 'stood-out', prompt: 'What stood out to you?', multi: true,
          options: [
            { value: 'named', label: 'Hagar being called by name' },
            { value: 'questions', label: '“Where have you come from? Where are you going?”' },
            { value: 'elroi', label: 'Hagar naming God: “the God who sees me”' },
            { value: 'heard', label: 'God hearing the boy “where he is”' },
            { value: 'eyes', label: 'Her eyes being opened to the well' },
          ],
        },
        {
          key: 'true-now', prompt: 'What feels most true for you right now?',
          options: [
            { value: 'seen', label: 'I need to know I’m seen' },
            { value: 'safe', label: 'I need to get safe or get help' },
            { value: 'tell', label: 'I need to let someone see how I really am' },
            { value: 'eyes', label: 'I need my eyes opened to what’s already there' },
            { value: 'unsure', label: 'I’m not sure yet' },
          ],
          allowText: true, placeholder: 'Anything else? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: 'Psalm 139 says God knows when we sit down and when we rise up. Breathe slowly. You don’t need to feel anything in particular.',
        breathIn: 'You are the God who sees me…',
        breathOut: '…and I am not forgotten.',
        cycles: 4,
      },
    },
    scripture: [
      {
        ref: 'Genesis 16:7–13', title: 'The God who sees me',
        quotes: [{ ref: 'Genesis 16:13', text: 'And she called the name of the LORD that spake unto her, Thou God seest me: for she said, Have I also here looked after him that seeth me?' }],
        context: 'A foreign servant, mistreated and pregnant, runs away. God finds her first, calls her by name, listens to her, promises a future, and names her son “God hears”. She names God in return. The instruction to return (16:9) is hard and specific to her situation; it is not a rule that anyone must stay in harm.',
        question: 'What would it mean for you to be seen by God, even if few people notice you?',
      },
      {
        ref: 'Genesis 21:15–19', title: 'Heard where you are',
        quotes: [
          { ref: 'Genesis 21:17', text: 'And God heard the voice of the lad; and the angel of God called to Hagar out of heaven, and said unto her, What aileth thee, Hagar? fear not; for God hath heard the voice of the lad where he is.' },
          { ref: 'Genesis 21:19', text: 'And God opened her eyes, and she saw a well of water; and she went, and filled the bottle with water, and gave the lad drink.' },
        ],
        context: 'Abandoned again, with nothing left, Hagar expects her son to die. God hears the boy’s cry “where he is” and opens Hagar’s eyes to a well. God then stays with the boy as he grows.',
        question: 'Is there something sustaining in your life that you might not be able to see yet?',
      },
      {
        ref: 'Psalm 139:1–3 · Psalm 56:8', title: 'Known completely',
        quotes: [
          { ref: 'Psalm 139:1–3', text: 'O LORD, thou hast searched me, and known me. Thou knowest my downsitting and mine uprising, thou understandest my thought afar off. Thou compassest my path and my lying down, and art acquainted with all my ways.' },
          { ref: 'Psalm 56:8', text: 'Thou tellest my wanderings: put thou my tears into thy bottle: are they not in thy book?' },
        ],
        context: 'Psalm 139 marvels that God knows a person completely. Psalm 56 is a prayer from a time of fear and danger; the poet trusts that God keeps count of their wanderings and tears.',
        question: 'Which of your tears would you like to trust God to keep?',
      },
    ],
    nextSteps: [
      { id: 'tell', label: 'Let one trusted person see how I really am', detail: 'Choose someone safe. You could say: “I’ve been feeling invisible lately. Can I tell you about it?”', prompt: 'Who I could tell:', placeholder: 'e.g. My aunt, this weekend' },
      { id: 'safety', label: 'Get safe, or get help', detail: 'If someone is hurting, threatening, or controlling you, contact a local abuse support service, a helpline, or emergency services. You can also tell a pastor or doctor you trust.', prompt: 'One safe step:', placeholder: 'e.g. Call a support line when I’m alone', showSupport: true },
      { id: 'write', label: 'Write one sentence: “God sees…”', detail: 'Finish the sentence honestly. It can be a hope rather than a feeling.', prompt: 'God sees…', placeholder: 'e.g. how tired I am of being overlooked' },
      { id: 'belong', label: 'Find one place where I can be known', detail: 'A small group, a friend, a counsellor, a community. Being seen by God is often experienced through being seen by people.', prompt: 'One place I could try:', placeholder: 'e.g. The Tuesday small group' },
      { id: 'pray', label: 'Pray to the God who sees', detail: 'A prayer you can use or change.', prayer: 'God who sees me, you found Hagar by the spring and heard her son in the wilderness. You see me too — what hurts, what I hide, and what I can’t say. Thank you that I am not forgotten. Open my eyes to the care you have already placed around me. Give me courage to be seen by safe people, and to get help where I need it. Amen.' },
      { id: 'later', label: 'Rest, and return to this later', detail: 'That’s a real choice. You can come back any time.' },
    ],
    closing: {
      heading: 'You walked The God Who Sees',
      hope: 'Hagar’s circumstances stayed hard. But she was found by name, heard where she was, and her eyes were opened to water for the road. Whatever others have overlooked in you, you are not unseen by God. May you find safe people who see you too — and the next well on your road.',
    },
  });
})();
