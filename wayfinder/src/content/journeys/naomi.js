/* Wayfinder — Journey: "The Road Home to Bethlehem" (Ruth 1–4).
 * Theme: grief, loss, companionship, and the slow possibility of hope.
 * Care point: never rush or minimise grief. Lament is allowed to stand. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const N = (text) => ({ say: { speaker: 'narrator', text } });
  const MI = (text) => ({ say: { speaker: 'miri', text } });

  const PAGES = {
    moab: {
      title: 'Left of her two sons and her husband',
      ref: 'Ruth 1:1–5',
      kjv: 'And Mahlon and Chilion died also both of them; and the woman was left of her two sons and her husband.',
      kjvRef: 'Ruth 1:5',
      summary: 'During a famine, Naomi’s family moved from Bethlehem to Moab. There her husband Elimelech died. Her two sons married Moabite women, Orpah and Ruth. About ten years later, both sons died too.',
      reflection: 'The story begins with loss upon loss and doesn’t hurry past it. Naomi is defined, for a while, by who is missing.',
    },
    turning: {
      title: 'Turning toward home',
      ref: 'Ruth 1:6–14',
      kjv: 'And they lifted up their voice, and wept again: and Orpah kissed her mother in law; but Ruth clave unto her.',
      kjvRef: 'Ruth 1:14',
      summary: 'Naomi heard that the famine in Judah had ended and set out for home. She urged both daughters-in-law to go back to their own families. After much weeping, Orpah went home, as Naomi had asked. Ruth would not leave her.',
      reflection: 'Orpah isn’t blamed; she did what Naomi urged. Grief often pushes people away “for their own good”. Ruth simply stays.',
    },
    ruth: {
      title: 'Whither thou goest',
      ref: 'Ruth 1:16–18',
      kjv: 'And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God:',
      kjvRef: 'Ruth 1:16',
      summary: 'Ruth, a foreigner and a widow herself, bound her life to Naomi’s — her road, her home, her people, and her God. Naomi, the text says, stopped arguing.',
      reflection: 'Ruth doesn’t explain Naomi’s loss or try to cheer her up. Her comfort is presence: “I will go where you go.”',
    },
    mara: {
      title: 'Call me Mara',
      ref: 'Ruth 1:19–22',
      kjv: 'And she said unto them, Call me not Naomi, call me Mara: for the Almighty hath dealt very bitterly with me.',
      kjvRef: 'Ruth 1:20',
      summary: 'When they arrived in Bethlehem, the whole town stirred: “Is this Naomi?” She told them not to call her Naomi (“pleasant”) but Mara (“bitter”). She said she went away full and came back empty. They arrived at the beginning of barley harvest.',
      reflection: 'Scripture records Naomi’s bitterness — even toward God — without correcting her. Lament is a form of faith: she still speaks to and about God. And quietly, the story notes: it was harvest time.',
    },
    glean: {
      title: 'Under whose wings',
      ref: 'Ruth 2:1–16',
      kjv: 'The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust.',
      kjvRef: 'Ruth 2:12',
      summary: 'God’s law told farmers to leave the edges of their fields for the poor and the foreigner to gather (Leviticus 19:9–10). Ruth gleaned in the field of Boaz, a relative of Naomi’s husband. Boaz protected her, blessed her, and quietly told his workers to leave extra grain for her (2:16).',
      reflection: 'Hope arrives here in very ordinary forms: leftover barley, a kind word, someone noticing. Naomi’s first glimmer comes when Ruth brings the grain home (2:20).',
    },
    restorer: {
      title: 'A restorer of thy life',
      ref: 'Ruth 4:13–17',
      kjv: 'And he shall be unto thee a restorer of thy life, and a nourisher of thine old age: for thy daughter in law, which loveth thee, which is better to thee than seven sons, hath born him.',
      kjvRef: 'Ruth 4:15',
      summary: 'Boaz married Ruth, and they had a son, Obed. The same women who had heard Naomi’s bitterness now blessed God with her. Naomi held the child. Obed became the grandfather of King David.',
      reflection: 'The ending is beautiful — but it came over a long season, and it didn’t erase the graves in Moab. Hope grew alongside grief, through people who stayed.',
    },
  };

  WF.registerJourney({
    id: 'naomi',
    companion: 'naomi',
    title: 'The Road Home to Bethlehem',
    tagline: 'For when you are carrying grief or loss',
    passage: 'Ruth 1–4',
    length: 'About 9 minutes · no timer',
    pages: PAGES,
    speakers: { miri: { name: 'Miri', note: 'a widow on the same road' } },
    prologue: {
      heading: 'Before you set out',
      text: 'You are not Naomi. You’ll walk your own road beside her story, with a woman named Miri who is grieving too.\n\nThis journey won’t hurry you. There are places to stop and simply stay. Grief has no timetable, and nothing here will tell you how you should feel.',
    },
    areas: [
      {
        id: 'moab', title: 'The Graves in Moab', scene: 'moab', width: 1900,
        objective: 'Stay with what was lost. There’s no hurry.',
        caption: '[Quiet grey morning; soft wind]',
        intro: [N('Grey morning in the fields of Moab. Beside the road there are three heaps of stones. You have come to say goodbye before you leave.')],
        exitRequires: ['seen:graves', 'seen:stone', 'seen:miri'],
        exitHint: 'Stay a little by the graves and the stone, and speak with the woman nearby.',
        hotspots: [
          {
            id: 'graves', x: 520, art: 'graves', kind: 'place', label: 'Three graves', verb: 'Stand here', glowR: 110, required: true,
            steps: [
              N('Three markers of piled stones. Someone has left small flowers.'),
              { page: 'moab' },
              {
                choice: {
                  key: 'loss', prompt: 'If you could say something honest about your own loss, what would it be?',
                  hint: 'Optional. Choose, write, or simply skip.',
                  allowText: true, placeholder: 'In your own words (stays on this device)',
                  options: [
                    { value: 'miss', label: 'I miss them — or it — so much' },
                    { value: 'unfair', label: 'It isn’t fair' },
                    { value: 'angry', label: 'I’m angry, even with God' },
                    { value: 'numb', label: 'I feel numb' },
                    { value: 'nowords', label: 'I don’t have words' },
                  ],
                },
              },
              N('Whatever you said — or didn’t — can stand as it is. You don’t have to tidy it up for God.'),
            ],
            again: [N('The flowers by the graves stir in the wind.')],
          },
          {
            id: 'stone', x: 1000, art: 'lamentStone', kind: 'place', label: 'A flat stone', verb: 'Sit', required: true,
            steps: [
              N('A flat stone where travellers leave a pebble for those they have lost. You add one.'),
              { light: 'A pebble of remembrance' },
              {
                choice: {
                  prompt: 'How long would you like to stay?',
                  options: [
                    { value: 'stay', label: 'A little longer', then: [{ rest: { text: 'You sit by the stones. Nobody asks you to be anywhere else.', caption: '[Wind; a distant bell]' } }] },
                    { value: 'go', label: 'I’m ready to walk on' },
                  ],
                },
              },
            ],
            again: [N('Your pebble sits among the others.')],
          },
          {
            id: 'miri', x: 1450, art: 'miri', kind: 'character', label: 'A woman in grey', verb: 'Talk', flip: true, required: true,
            steps: [
              MI('I buried my husband in this ground two winters ago. I’m going home now — to Bethlehem. I hear there’s bread there again.'),
              {
                choice: {
                  key: 'miri-talk', speaker: 'miri', prompt: 'Miri pulls her shawl tighter.', loop: true,
                  options: [
                    { value: 'carry', label: 'How do you carry it?', then: [MI('Badly, some days. I’ve stopped pretending otherwise. That helped more than anything anyone said.')] },
                    { value: 'easier', label: 'Does it get easier?', then: [MI('It gets different. I won’t promise you more than that. People who promised me more didn’t help.')] },
                    { value: 'god', label: 'Where was God in it?', then: [MI('I’ve asked that too. Naomi asked it out loud, in front of the whole town. I think God can bear the question.')] },
                    { value: 'done', label: 'Shall we walk?', end: true },
                  ],
                },
              },
            ],
            again: [MI('The road west goes up through the hills. We can go slowly.')],
          },
        ],
      },
      {
        id: 'crossroads', title: 'The Parting at the Crossroads', scene: 'crossroads', width: 2000,
        objective: 'Decide how you’ll walk the road.',
        caption: '[Overcast; footsteps on dry earth]',
        intro: [N('The road climbs west toward Judah. At a crossroads, travellers part ways — some back to Moab, some on toward Bethlehem.')],
        exitRequires: ['seen:page-turning', 'seen:pair', 'seen:signpost'],
        exitHint: 'Read the page, listen to the two women, and decide at the signpost.',
        hotspots: [
          { id: 'page-turning', x: 450, art: 'page', kind: 'page', label: 'A page in the dust', verb: 'Read', required: true, steps: [{ page: 'turning' }] },
          {
            id: 'pair', x: 1000, art: 'ruthNaomi', kind: 'character', label: 'Two women on the road', verb: 'Listen', glowR: 80, required: true,
            steps: [
              N('An older woman and a younger one stand close together. The older one is still telling her to go back. The younger one shakes her head.'),
              { page: 'ruth' },
              N('Ruth doesn’t fix Naomi’s grief. She simply refuses to leave.'),
            ],
            again: [N('They walk on together, slowly.')],
          },
          {
            id: 'signpost', x: 1560, art: 'signpost', kind: 'place', label: 'The signpost', verb: 'Decide', required: true,
            steps: [
              MI('I’m going on to Bethlehem. Same way as you.'),
              {
                choice: {
                  key: 'walk', speaker: 'miri', noSkip: true,
                  prompt: 'Miri hesitates. “Shall we walk together?”',
                  options: [
                    { value: 'together', label: 'Yes — walk with me', then: [MI('Then we’ll go at the pace of whoever is slower that day.')] },
                    { value: 'alone', label: 'I need to walk alone for a while', then: [MI('That’s honest. I’ll be a little way behind, if you want me.')] },
                    { value: 'unsure', label: 'I’m not sure I want company', then: [MI('Then I won’t crowd you. Grief has its own pace.')] },
                  ],
                },
              },
              N('There is no wrong answer here. Some seasons we need company close; some seasons we need it at a distance.'),
            ],
            again: [N('The sign points west: Bethlehem.')],
          },
        ],
      },
      {
        id: 'harvest', title: 'Barley Harvest at Bethlehem', scene: 'harvest', width: 2300,
        objective: 'Come into Bethlehem at the beginning of harvest.',
        caption: '[Wind through barley; reapers singing far off]',
        intro: [N('Golden fields, and a small town on the hill. Reapers are already at work. It is the beginning of barley harvest.')],
        exitRequires: ['seen:gate', 'gleaned', 'farewell'],
        exitHint: 'Stop at the town gate, look at the edge of the field, and find Miri.',
        hotspots: [
          {
            id: 'miri-walk', x: 60, follow: true, art: 'miri', kind: 'character', label: 'Miri', verb: 'Talk', when: { answer: { key: 'walk', in: ['together'] } },
            steps: [
              { if: { notFlags: ['gleaned'] }, ...MI('I’m glad not to walk into town alone. They’ll all stare. Let them.') },
              { if: { flags: ['gleaned'] }, page: 'restorer' },
              { if: { flags: ['gleaned'] }, ...MI('Naomi held a grandson in the end. But she still had graves in Moab. Hope came slowly, alongside the grief — through people who stayed. I won’t tell you how your story will go. I’ll just say: keep letting people walk with you.') },
              { if: { flags: ['gleaned'] }, set: 'farewell' },
            ],
          },
          {
            id: 'gate', x: 520, art: 'townGate', kind: 'place', label: 'The town gate', verb: 'Go in', glowR: 100, glowY: 70, labelY: 200, required: true,
            steps: [
              { if: { answer: { key: 'walk', in: ['alone', 'unsure'] } }, ...N('Miri catches up, a little out of breath.') },
              { if: { answer: { key: 'walk', in: ['alone', 'unsure'] } }, ...MI('I followed at a distance. I hope that’s all right.') },
              N('Women at the gate turn and stare. “Is this Naomi?” someone whispers.'),
              { page: 'mara' },
              {
                choice: {
                  key: 'name', prompt: 'If you could name this season honestly, what would you call it?',
                  hint: 'Optional.', allowText: true, placeholder: 'One word or a sentence (stays on this device)',
                  options: [
                    { value: 'bitter', label: 'Bitter' },
                    { value: 'empty', label: 'Empty' },
                    { value: 'heavy', label: 'Heavy' },
                    { value: 'strange', label: 'Strange' },
                    { value: 'hoping', label: 'Still hoping' },
                  ],
                },
              },
              N('Naomi’s honest name for her season is part of Scripture. So is the quiet detail that follows: it was the beginning of harvest.'),
            ],
            again: [N('The women at the gate have gone back to their work.')],
          },
          {
            id: 'sheaf', x: 1250, art: 'sheaf', kind: 'object', label: 'Barley left at the edge', verb: 'Gather', litFlag: 'gleaned', required: true,
            steps: [
              N('At the edge of the field, stalks of barley have been left behind — on purpose.'),
              { page: 'glean' },
              {
                choice: {
                  key: 'kindness', prompt: 'Is there a small kindness you could let someone give you?',
                  hint: 'Optional.',
                  options: [
                    { value: 'practical', label: 'A meal, or help with something practical' },
                    { value: 'company', label: 'Someone sitting with me' },
                    { value: 'remember', label: 'Someone remembering with me' },
                    { value: 'prayer', label: 'Someone praying for me' },
                    { value: 'hard', label: 'I find receiving hard', then: [N('Many grieving people do. Ruth received leftover barley without having to earn it. That’s what it was left there for.')] },
                  ],
                },
              },
              { set: 'gleaned' },
              { light: 'Barley gathered' },
            ],
            again: [N('There’s still barley at the edges. There will be tomorrow, too.')],
          },
          {
            id: 'miri-end', x: 1950, art: 'miri', kind: 'character', label: 'Miri', verb: 'Talk', flip: true, when: { answer: { key: 'walk', in: ['alone', 'unsure'] } },
            steps: [
              { if: { notFlags: ['gleaned'] }, ...MI('Go and see the edges of the field first. Then come back.') },
              { if: { flags: ['gleaned'] }, page: 'restorer' },
              { if: { flags: ['gleaned'] }, ...MI('Naomi held a grandson in the end. But she still had graves in Moab. Hope came slowly, alongside the grief — through people who stayed, even at a distance. I won’t tell you how your story will go. Just keep letting people near, a little at a time.') },
              { if: { flags: ['gleaned'] }, set: 'farewell' },
            ],
          },
        ],
      },
    ],
    reflect: {
      intro: 'Look back over the road. Nothing here needs to be resolved.',
      questions: [
        {
          key: 'stood-out', prompt: 'What stood out to you?', multi: true,
          options: [
            { value: 'room', label: 'Grief given room, not rushed' },
            { value: 'stayed', label: 'Ruth staying' },
            { value: 'mara', label: 'Naomi’s honesty: “call me Mara”' },
            { value: 'edges', label: 'Kindness left at the edges of a field' },
            { value: 'slow', label: 'Hope coming slowly' },
          ],
        },
        {
          key: 'true-now', prompt: 'What feels most true for you right now?',
          options: [
            { value: 'lament', label: 'I need to be honest with God about my grief' },
            { value: 'company', label: 'I need someone to stay with me' },
            { value: 'receive', label: 'I need to let others help' },
            { value: 'remember', label: 'I need space to remember' },
            { value: 'unsure', label: 'I don’t know yet' },
          ],
          allowText: true, placeholder: 'Anything else? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: 'Jesus wept at the grave of his friend Lazarus (John 11:35). You don’t need to feel anything in particular. Breathe slowly, and bring whatever is true.',
        breathIn: 'Lord, you are near the broken-hearted…',
        breathOut: '…stay near me.',
        cycles: 4,
      },
    },
    scripture: [
      {
        ref: 'Ruth 1:16–21', title: 'Staying, and speaking honestly',
        quotes: [
          { ref: 'Ruth 1:16', text: 'And Ruth said, Intreat me not to leave thee, or to return from following after thee: for whither thou goest, I will go; and where thou lodgest, I will lodge: thy people shall be my people, and thy God my God:' },
          { ref: 'Ruth 1:20', text: 'And she said unto them, Call me not Naomi, call me Mara: for the Almighty hath dealt very bitterly with me.' },
        ],
        context: 'Two widows walk from Moab to Bethlehem. Ruth’s loyalty is costly — she is a foreigner going to a strange land. Naomi’s grief is spoken bluntly, even toward God, and Scripture lets it stand.',
        question: 'Who has stayed with you — and what would it be like to tell God, honestly, how this loss feels?',
      },
      {
        ref: 'Psalm 34:18 · John 11:33–35', title: 'God near in grief',
        quotes: [
          { ref: 'Psalm 34:18', text: 'The LORD is nigh unto them that are of a broken heart; and saveth such as be of a contrite spirit.' },
          { ref: 'John 11:35', text: 'Jesus wept.' },
        ],
        context: 'The psalm promises God’s nearness to the broken-hearted. In John 11, Jesus arrives after his friend Lazarus has died. He sees Mary weeping, is deeply moved, and weeps too — even though he is about to raise Lazarus. Jesus doesn’t skip grief on the way to hope.',
        question: 'What might it mean to you that Jesus grieved?',
      },
      {
        ref: 'Ruth 2:12 · 4:14–15', title: 'Hope, slowly',
        quotes: [
          { ref: 'Ruth 2:12', text: 'The LORD recompense thy work, and a full reward be given thee of the LORD God of Israel, under whose wings thou art come to trust.' },
          { ref: 'Ruth 4:15', text: 'And he shall be unto thee a restorer of thy life, and a nourisher of thine old age: for thy daughter in law, which loveth thee, which is better to thee than seven sons, hath born him.' },
        ],
        context: 'Through a harvest season of gleaning, kindness, and courage, Naomi’s emptiness begins to be filled. The restoration is real, but it comes gradually and through people, and her earlier losses remain part of her story.',
        question: 'What small, ordinary kindness might be a sign of care for you this week?',
      },
    ],
    nextSteps: [
      { id: 'tell', label: 'Tell someone about who or what I’ve lost', detail: 'Share a memory, a name, or simply how you are. You could say: “Can I tell you about them?”', prompt: 'Who I could tell:', placeholder: 'e.g. Call my cousin on Sunday' },
      { id: 'help', label: 'Let someone help with one practical thing', detail: 'A meal, a lift, help with paperwork. Receiving is part of being cared for.', prompt: 'One thing I could accept help with:', placeholder: 'e.g. Let Sam cook on Thursday' },
      { id: 'remember', label: 'Set aside time to remember', detail: 'Look at a photo, visit a place, light a candle, or write a few lines. Remembering is not “failing to move on”.', prompt: 'How I’ll remember:', placeholder: 'e.g. Walk to the park bench we loved' },
      { id: 'lament', label: 'Pray an honest lament', detail: 'A prayer you can use or change.', prayer: 'Lord, I am grieving. Some days I feel empty, and some days I feel bitter, and you know both. Thank you that you didn’t silence Naomi, and that Jesus wept. Stay near me in this. Send people who will stay. Help me receive small kindnesses, and hold on to hope even when I can’t feel it. Amen.' },
      { id: 'support', label: 'Talk with a grief counsellor, pastor, or doctor', detail: 'If grief feels unbearable, isn’t easing over time, or is affecting your health or safety, a grief counsellor, pastor, or doctor can help carry it with you.', prompt: 'Who I could contact:', placeholder: 'e.g. Ask my church about grief support', showSupport: true },
      { id: 'later', label: 'Rest, and return to this later', detail: 'Grief is tiring. Resting is a real choice, not a failure.' },
    ],
    closing: {
      heading: 'You walked The Road Home to Bethlehem',
      hope: 'Naomi came home empty and said so. Ruth stayed, the harvest came, and over a long season hope grew alongside her grief rather than replacing it. Your grief is not a problem to be solved quickly. May you find people who stay, small kindnesses at the edges, and the God who is near to the broken-hearted.',
    },
  });
})();
