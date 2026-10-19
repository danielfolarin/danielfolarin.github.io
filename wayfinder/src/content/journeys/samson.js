/* Wayfinder — Journey: "Strength and Boundaries" (Judges 13–16).
 * Theme: desire, boundaries, strength, compromised choices, consequences.
 * Care points: not "he loved the wrong woman"; Delilah is not blamed alone; Samson's death
 * is not presented as a model, and support is offered around it. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const N = (text) => ({ say: { speaker: 'narrator', text } });
  const ZI = (text) => ({ say: { speaker: 'ziva', text } });

  const PAGES = {
    nazirite: {
      title: 'Set apart from the womb',
      ref: 'Judges 13:2–5, 24–25',
      kjv: 'For, lo, thou shalt conceive, and bear a son; and no razor shall come on his head: for the child shall be a Nazarite unto God from the womb: and he shall begin to deliver Israel out of the hand of the Philistines.',
      kjvRef: 'Judges 13:5',
      summary: 'Before Samson was born, his parents were told he would be a Nazirite — set apart to God for life. Nazirites didn’t drink wine or eat grapes, didn’t cut their hair, and avoided contact with the dead (Numbers 6). As he grew, “the Spirit of the LORD began to move him” (13:25).',
      reflection: 'Samson’s strength was a gift, given for a purpose. His boundaries were part of the gift too — not rules to shrink him, but lines marking whose he was.',
    },
    honey: {
      title: 'He told not them',
      ref: 'Judges 14:5–9',
      kjv: 'And he took thereof in his hands, and went on eating, and came to his father and mother, and he gave them, and they did eat: but he told not them that he had taken the honey out of the carcase of the lion.',
      kjvRef: 'Judges 14:9',
      summary: 'Near the vineyards of Timnah, Samson killed a young lion with his bare hands. Later he found bees and honey in its carcass. He scooped it out, ate it, and gave some to his parents — without telling them where it came from.',
      reflection: 'Touching a carcass broke his Nazirite vow. The quiet detail is the hiding: he didn’t tell. Patterns often begin small, and secret.',
    },
    pattern: {
      title: 'Back to the edge, again',
      ref: 'Judges 14–16',
      summary: 'Samson’s story repeats: desire, anger, revenge, escape. He burned Philistine fields, killed many, visited a prostitute in Gaza and tore off the city gates (16:1–3). His strength kept getting him out of trouble — until it didn’t.',
      reflection: 'Great strength didn’t protect Samson from his own patterns. Sometimes being able to “handle it” is exactly what keeps us from asking for help.',
    },
    delilah: {
      title: 'Three times, and a fourth',
      ref: 'Judges 16:4–17',
      summary: 'Samson loved Delilah, who lived in the valley of Sorek. The Philistine rulers each offered her eleven hundred pieces of silver to discover the secret of his strength (16:5). Three times she asked; three times he gave a false answer, was tied up, and broke free. Still he stayed. The fourth time, he told her everything.',
      reflection: 'Delilah betrayed Samson for money, and powerful men schemed against him. Samson also walked back into danger again and again, and gave away what had been entrusted to him. Responsibility is shared — and his choices were still his own.',
    },
    departed: {
      title: 'He wist not',
      ref: 'Judges 16:18–21',
      kjv: 'And she said, The Philistines be upon thee, Samson. And he awoke out of his sleep, and said, I will go out as at other times before, and shake myself. And he wist not that the LORD was departed from him.',
      kjvRef: 'Judges 16:20',
      summary: 'While Samson slept, his hair was shaved. He woke expecting to escape “as at other times before” — but his strength was gone. The Philistines seized him, put out his eyes, and made him grind grain in prison in Gaza.',
      reflection: '“As at other times before.” Patterns convince us that this time will be like the last. The consequences here were devastating and real.',
    },
    grow: {
      title: 'The hair began to grow again',
      ref: 'Judges 16:21–22',
      kjv: 'Howbeit the hair of his head began to grow again after he was shaven.',
      kjvRef: 'Judges 16:22',
      summary: 'Blind, captive, and grinding at the mill, Samson’s hair began to grow back.',
      reflection: 'One small sentence of grace in the darkest place. It didn’t undo the consequences. But it says Samson was not abandoned.',
    },
    remember: {
      title: 'O Lord GOD, remember me',
      ref: 'Judges 16:23–31 · Hebrews 11:32',
      kjv: 'And Samson called unto the LORD, and said, O Lord GOD, remember me, I pray thee, and strengthen me, I pray thee, only this once, O God, that I may be at once avenged of the Philistines for my two eyes.',
      kjvRef: 'Judges 16:28',
      summary: 'At a Philistine festival, Samson was brought out to entertain the crowd. He prayed, pushed against the temple pillars, and the building fell, killing him along with many others. Hebrews 11:32 later names Samson among people of faith.',
      reflection: 'Samson’s story ends in tragedy as well as faith, and even his last prayer is tangled with revenge. It is not a model for violence or for ending a life. What it shows is that God still heard a broken man who cried “remember me.”',
    },
  };

  const planReplies = {
    tell: 'Tell someone right away — yes. Patterns lose power when they’re spoken out loud to someone safe. “Confess your faults one to another” (James 5:16).',
    leave: 'Leaving is wise. Joseph ran from temptation and left his coat behind (Genesis 39:12). That’s not weakness. It’s wisdom.',
    pray: 'Pause and pray — good. And let your prayer lead you to people, too. Samson prayed at the end; imagine if he’d prayed, and been honest with someone, at the beginning.',
    alone: 'Handle it alone, with willpower? Samson had more strength than anyone who ever lived. It didn’t keep him. Strength was never meant to be used alone.',
  };

  WF.registerJourney({
    id: 'samson',
    companion: 'samson',
    title: 'Strength and Boundaries',
    tagline: 'For when you are wrestling with a habit, desire, or dependency',
    passage: 'Judges 13–16',
    length: 'About 9 minutes · no timer',
    pages: PAGES,
    speakers: { ziva: { name: 'Ziva', note: 'keeps vineyards near Zorah' } },
    prologue: {
      heading: 'Before you set out',
      text: 'You are not Samson. You’ll walk your own road beside his story, with a vineyard keeper named Ziva.\n\nSamson’s story is about gifts, boundaries, and patterns that repeat. It isn’t “he loved the wrong woman”, and it doesn’t end tidily. Habits and dependencies are rarely overcome alone; this journey will point you toward people and help, not just willpower.',
    },
    areas: [
      {
        id: 'vineyard', title: 'The Vineyards of Timnah', scene: 'vineyard', width: 2100,
        objective: 'Walk the vineyards. Notice where the lines are.',
        caption: '[Bees humming; leaves in a warm breeze]',
        intro: [N('Bright day in the vineyards of Timnah. Grapes hang heavy on the vines — a strange place for someone who promised never to touch them.')],
        exitRequires: ['seen:vow', 'seen:carcass', 'seen:ziva'],
        exitHint: 'Read the vow, look at what’s in the rocks, and talk with the vineyard keeper.',
        hotspots: [
          {
            id: 'vow', x: 480, art: 'page', kind: 'page', label: 'A page among the vines', verb: 'Read', required: true,
            steps: [
              { page: 'nazirite' },
              {
                choice: {
                  key: 'gift', prompt: 'What strengths or gifts have you been given?', hint: 'Optional — choose one, or skip.',
                  options: [
                    { value: 'energy', label: 'Energy and drive' },
                    { value: 'people', label: 'Influence with people' },
                    { value: 'skill', label: 'A skill or talent' },
                    { value: 'resilience', label: 'Resilience — I can handle a lot' },
                    { value: 'unsure', label: 'I’m not sure' },
                  ],
                },
              },
              N('Gifts are good. Boundaries help protect them — and protect the people around us.'),
            ],
          },
          {
            id: 'carcass', x: 1100, art: 'carcass', kind: 'object', label: 'Something in the rocks', verb: 'Look closer', required: true,
            steps: [
              N('Old, sun-bleached bones in the rocks — and bees, and the gold glint of honey.'),
              { page: 'honey' },
              {
                choice: {
                  key: 'hide', prompt: 'Samson hid where the honey came from. What do you tend to keep hidden?', hint: 'Optional. Your answer stays on this device.',
                  options: [
                    { value: 'habit', label: 'A habit' },
                    { value: 'often', label: 'How often I do something' },
                    { value: 'effect', label: 'How it’s affecting me' },
                    { value: 'who', label: 'Who I’m with, or where I go' },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
              N('Secrecy is often the soil patterns grow in. You don’t have to tell everyone. But telling someone changes things.'),
            ],
            again: [N('The bees go on working.')],
          },
          {
            id: 'ziva', x: 1700, art: 'ziva', kind: 'character', label: 'A vineyard keeper', verb: 'Talk', flip: true, required: true,
            steps: [
              ZI('Funny place for a Nazirite to walk, a vineyard. Come on — I’ll show you the valley.'),
              {
                choice: {
                  key: 'ziva-talk', speaker: 'ziva', prompt: 'Ziva wipes her hands on her apron.', loop: true,
                  options: [
                    { value: 'what', label: 'What’s a Nazirite?', then: [ZI('Someone set apart. No wine or grapes, no razor, no touching the dead (Numbers 6). Lines drawn around a life — as a gift, not a cage.')] },
                    { value: 'why', label: 'Why would he come here?', then: [ZI('Why do any of us walk right up to the edge of what we said we wouldn’t do? Usually because part of us wants to.')] },
                    { value: 'will', label: 'Isn’t it just about willpower?', then: [ZI('Samson had more strength than anyone. It didn’t keep him. Strength is a gift. It’s a poor substitute for honesty and help.')] },
                    { value: 'done', label: 'Show me the valley.', end: true },
                  ],
                },
              },
            ],
            again: [ZI('The valley of Sorek is west of here.')],
          },
        ],
      },
      {
        id: 'sorek', title: 'The Valley of Sorek', scene: 'sorek', width: 2200,
        objective: 'Set a boundary at each post along the valley.',
        caption: '[A stream; evening birds]',
        intro: [N('Evening in the valley of Sorek. A stream runs through it. Wooden posts stand along the path, each with a lantern waiting to be lit.')],
        exitRequires: ['seen:page-delilah', 'post1', 'post2', 'seen:page-departed'],
        exitHint: 'Read the page, set a boundary at both posts, then read the page beyond them.',
        hotspots: [
          { id: 'ziva-walk', x: 60, follow: true, art: 'ziva', kind: 'character', label: 'Ziva', verb: 'Talk', steps: [ZI('A boundary isn’t a wall around your life. It’s a lantern on the path where you’ve fallen before.')] },
          {
            id: 'page-delilah', x: 420, art: 'page', kind: 'page', label: 'A page by the stream', verb: 'Read', required: true,
            steps: [{ page: 'delilah' }, { page: 'pattern' }],
          },
          {
            id: 'post-a', x: 950, art: 'post', kind: 'waymark', label: 'A boundary post', verb: 'Set a boundary', litFlag: 'post1', required: true,
            steps: [
              {
                choice: {
                  key: 'trigger', prompt: 'Where or when does your pattern usually begin?', hint: 'Optional — naming it is the first boundary.',
                  options: [
                    { value: 'night', label: 'Late at night' },
                    { value: 'alone', label: 'When I’m alone' },
                    { value: 'stress', label: 'When I’m stressed, tired, or hurt' },
                    { value: 'people', label: 'With certain people' },
                    { value: 'online', label: 'Online or on my phone' },
                    { value: 'unsure', label: 'I’m not sure' },
                  ],
                },
              },
              N('You hang the lantern on the post. Now you’ll see this place coming.'),
              { set: 'post1' },
              { light: 'A boundary named' },
            ],
            again: [N('The lantern glows steadily.')],
          },
          {
            id: 'post-b', x: 1500, art: 'post', kind: 'waymark', label: 'A second post', verb: 'Set a boundary', litFlag: 'post2', required: true,
            steps: [
              {
                choice: {
                  key: 'plan', noSkip: true, prompt: 'When the pattern starts again, what will you do?',
                  options: [
                    { value: 'tell', label: 'Tell someone right away', then: [ZI(planReplies.tell)] },
                    { value: 'leave', label: 'Leave the situation', then: [ZI(planReplies.leave)] },
                    { value: 'pray', label: 'Pause and pray', then: [ZI(planReplies.pray)] },
                    { value: 'alone', label: 'Handle it alone, with willpower', then: [ZI(planReplies.alone)] },
                  ],
                },
              },
              { set: 'post2' },
              { light: 'A plan made' },
            ],
            again: [N('Two lanterns now, along the dark path.')],
          },
          {
            id: 'page-departed', x: 1950, art: 'page', kind: 'page', label: 'A page in the dark', verb: 'Read', when: { flags: ['post2'] }, required: true,
            steps: [{ page: 'departed' }],
          },
        ],
      },
      {
        id: 'gaza', title: 'The Mill at Gaza', scene: 'gaza', width: 2100,
        objective: 'In the dark of Gaza, look for what grows back.',
        caption: '[Grinding stone; a distant festival crowd]',
        intro: [N('Gaza at dusk. Somewhere a crowd is celebrating. In a prison yard, a millstone turns and turns.')],
        exitRequires: ['seen:mill', 'seen:pillars', 'farewell'],
        exitHint: 'Stop at the mill, then the pillars, then find Ziva.',
        hotspots: [
          {
            id: 'mill', x: 500, art: 'mill', kind: 'object', label: 'A millstone', verb: 'Look closer', required: true,
            steps: [
              N('A heavy millstone, worn smooth by a blinded man walking in circles.'),
              { page: 'grow' },
              N('Consequences are real here — Samson remained blind and captive. And still: the hair began to grow again.'),
              { light: 'Something growing back' },
            ],
            again: [N('The stone keeps turning.')],
          },
          {
            id: 'pillars', x: 1150, art: 'pillars', kind: 'place', label: 'Two great pillars', verb: 'Stand between', glowR: 120, glowY: 140, labelY: 330, sparkY: 330, required: true,
            steps: [
              { page: 'remember' },
              { say: { speaker: 'note', text: 'If you’ve had thoughts of ending your life, or of hurting others, please talk to someone now. The Support button at the top has crisis lines.' } },
              {
                choice: {
                  key: 'remember', prompt: 'Samson’s last prayer was “remember me.” What would you ask God to remember?', hint: 'Optional.',
                  options: [
                    { value: 'me', label: 'Remember me — even here' },
                    { value: 'meant', label: 'Remember who I was meant to be' },
                    { value: 'hurt', label: 'Remember the people I’ve hurt' },
                    { value: 'help', label: 'Help me — I can’t do this alone' },
                    { value: 'nowords', label: 'I don’t know how to pray' },
                  ],
                },
              },
            ],
            again: [N('The pillars stand silent.')],
          },
          {
            id: 'ziva-end', x: 1750, art: 'ziva', kind: 'character', label: 'Ziva', verb: 'Talk', flip: true, required: true,
            steps: [
              { if: { answer: { key: 'plan', in: ['alone'] } }, ...ZI('You said you’d handle it alone. Samson tried that his whole life. Who could know about this — this week?') },
              { if: { answer: { key: 'plan', in: ['tell'] } }, ...ZI('You said you’d tell someone. That’s how chains start to loosen: out loud, with others.') },
              { if: { answer: { key: 'plan', in: ['leave'] } }, ...ZI('You said you’d leave the situation. Plan the exit before you need it — that’s what the lanterns are for.') },
              { if: { answer: { key: 'plan', in: ['pray'] } }, ...ZI('You said you’d pause and pray. Keep doing that — and let prayer send you toward people who can help.') },
              ZI('Your story isn’t Samson’s. Habits rarely change in one moment, and there may be setbacks. But hair grows back. Ask for help today — a friend, a support group, a doctor, a specialist service. Strength was never meant to be used alone.'),
              { set: 'farewell' },
            ],
            again: [ZI('Go gently. Light the lanterns ahead of time.')],
          },
        ],
      },
    ],
    reflect: {
      intro: 'Look back over the valley. Honesty here is just for you.',
      questions: [
        {
          key: 'stood-out', prompt: 'What stood out to you?', multi: true,
          options: [
            { value: 'gift', label: 'Strength and boundaries both as gifts' },
            { value: 'hidden', label: 'The small, hidden beginning' },
            { value: 'pattern', label: 'The pattern repeating' },
            { value: 'shared', label: 'Responsibility being shared, but still his' },
            { value: 'grow', label: '“The hair began to grow again”' },
          ],
        },
        {
          key: 'true-now', prompt: 'What feels most true for you right now?',
          options: [
            { value: 'tell', label: 'I need to tell someone about this' },
            { value: 'boundary', label: 'I need a clear boundary' },
            { value: 'help', label: 'I need specialist help' },
            { value: 'grace', label: 'I need to believe grace can grow back' },
            { value: 'unsure', label: 'I’m not sure yet' },
          ],
          allowText: true, placeholder: 'Anything else? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: 'Self-control — “temperance” — is listed as fruit of the Holy Spirit (Galatians 5:23): something grown with God’s help, not forced by willpower alone. Breathe slowly.',
        breathIn: 'Holy Spirit, be my strength…',
        breathOut: '…and lead me to help.',
        cycles: 4,
      },
    },
    scripture: [
      {
        ref: 'Judges 16:20–22, 28', title: 'Strength lost, grace growing back',
        quotes: [
          { ref: 'Judges 16:20', text: 'And she said, The Philistines be upon thee, Samson. And he awoke out of his sleep, and said, I will go out as at other times before, and shake myself. And he wist not that the LORD was departed from him.' },
          { ref: 'Judges 16:22', text: 'Howbeit the hair of his head began to grow again after he was shaven.' },
        ],
        context: 'After repeated compromises — and betrayal by Delilah and the Philistine rulers — Samson loses his strength, his sight, and his freedom. In captivity his hair begins to grow, and he cries out to God. His ending is tragic; it is not a model to follow, but it shows God still hearing him.',
        question: 'Where might you be assuming “this time will be like the other times”?',
      },
      {
        ref: '1 Corinthians 10:13 · Galatians 5:22–23', title: 'A way of escape, and the Spirit’s fruit',
        quotes: [
          { ref: '1 Corinthians 10:13', text: 'There hath no temptation taken you but such as is common to man: but God is faithful, who will not suffer you to be tempted above that ye are able; but will with the temptation also make a way to escape, that ye may be able to bear it.' },
          { ref: 'Galatians 5:22–23', text: 'But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law.' },
        ],
        context: 'Paul reminds the Corinthians that their struggles are shared by others and that God provides ways out — often practical ones. In Galatians, self-control (“temperance”) is fruit the Spirit grows, alongside love and patience, over time.',
        question: 'What practical “way of escape” could you plan before the next hard moment?',
      },
      {
        ref: 'James 5:16', title: 'Not alone',
        quotes: [{ ref: 'James 5:16', text: 'Confess your faults one to another, and pray one for another, that ye may be healed.' }],
        context: 'James writes to a community and links honesty with one another, prayer, and healing. Freedom from patterns is rarely a solo project.',
        question: 'Who is one person you could be honest with about this?',
      },
    ],
    nextSteps: [
      { id: 'trigger', label: 'Name one trigger and plan for it', detail: 'Write down where the pattern starts and what you’ll do instead.', prompt: 'When ___, I will ___:', placeholder: 'e.g. When I’m alone late at night, I’ll charge my phone outside my room' },
      { id: 'tell', label: 'Tell one trusted person', detail: 'Choose someone safe and steady. Ask them to check in with you regularly.', prompt: 'Who I could tell:', placeholder: 'e.g. My brother, this week' },
      { id: 'help', label: 'Contact a support group, doctor, or specialist service', detail: 'Especially for alcohol, drugs, gambling, or anything affecting your health or safety, specialist help makes a real difference. Asking is a sign of strength.', prompt: 'Who I could contact:', placeholder: 'e.g. Look up a local recovery group', showSupport: true },
      { id: 'boundary', label: 'Put a practical boundary in place', detail: 'Remove access, change a routine, use a blocker, avoid a place. Make the right thing easier.', prompt: 'My boundary:', placeholder: 'e.g. Delete the app tonight' },
      { id: 'pray', label: 'Pray for the Spirit’s strength', detail: 'A prayer you can use or change.', prayer: 'Lord, you gave me gifts, and I haven’t always protected them. You know the pattern I keep repeating, and you know what I hide. Holy Spirit, grow self-control in me — not by my willpower alone, but by your strength. Show me the way of escape, and give me courage to be honest with someone. Remember me, and let what was lost begin to grow again. Amen.' },
      { id: 'later', label: 'Rest, and return to this later', detail: 'If you do, consider telling someone in the meantime.' },
    ],
    closing: {
      heading: 'You walked Strength and Boundaries',
      hope: 'Samson’s gifts were real, and so were his patterns and their cost. Even in the dark at Gaza, his hair began to grow again, and God heard his cry. Change may be slow, with setbacks along the way. But you don’t have to rely on willpower alone. Light the lanterns, tell someone, get help — and keep asking God to remember you.',
    },
  });
})();
