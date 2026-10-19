/* Wayfinder — Journey: "The Winepress and the Fleece" (Judges 6–7).
 * Theme: uncertainty, fear, discerning next steps, finding courage.
 * Care point: the fleece is NOT presented as a method for decisions. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const N = (text) => ({ say: { speaker: 'narrator', text } });
  const AB = (text) => ({ say: { speaker: 'abiel', text } });

  const PAGES = {
    hiding: {
      title: 'Hiding the harvest',
      ref: 'Judges 6:1–11',
      kjv: 'And there came an angel of the LORD, and sat under an oak which was in Ophrah, that pertained unto Joash the Abiezrite: and his son Gideon threshed wheat by the winepress, to hide it from the Midianites.',
      kjvRef: 'Judges 6:11',
      summary: 'For seven years Midianite raiders swept through Israel at harvest time, taking crops and animals. People hid in mountain dens and caves. Gideon was threshing wheat down in a winepress — a pit meant for grapes — so no one would see.',
      reflection: 'This is where God finds Gideon: not on a battlefield, but hiding, trying to keep his family fed.',
    },
    valour: {
      title: 'Mighty man of valour?',
      ref: 'Judges 6:12–16',
      kjv: 'And the angel of the LORD appeared unto him, and said unto him, The LORD is with thee, thou mighty man of valour.',
      kjvRef: 'Judges 6:12',
      summary: 'Gideon answers with an honest, almost sharp question: “if the LORD be with us, why then is all this befallen us?” (6:13). He says his clan is the poorest and he is the least in his family (6:15). God’s reply is not a plan or a pep talk, but a promise: “Surely I will be with thee” (6:16).',
      reflection: 'God isn’t offended by Gideon’s question. Courage in this story begins with presence, not with Gideon feeling brave.',
    },
    altar: {
      title: 'Courage by night',
      ref: 'Judges 6:25–27',
      kjv: 'Then Gideon took ten men of his servants, and did as the LORD had said unto him: and so it was, because he feared his father’s household, and the men of the city, that he could not do it by day, that he did it by night.',
      kjvRef: 'Judges 6:27',
      summary: 'Gideon’s first task was close to home: tear down his father’s altar to Baal. He did it — but at night, because he was afraid of his family and his town.',
      reflection: 'Obedience and fear arrived together. Gideon did the right thing while still frightened, and the story doesn’t mock him for it.',
    },
    fleece: {
      title: 'The fleece',
      ref: 'Judges 6:36–40',
      summary: 'Gideon asked God for a sign: dew on a fleece but dry ground around it. Then he asked again, the other way round. Both times, God did it.',
      reflection: 'Notice that Gideon had already been told what to do (6:14, 16). The fleece wasn’t how he discovered God’s will; it was a frightened man asking for reassurance, and God was patient with him. Scripture never presents it as a method for making decisions, and Wayfinder doesn’t either.',
    },
    threehundred: {
      title: 'Whoever is afraid may go home',
      ref: 'Judges 7:2–7',
      summary: 'God told Gideon his army was too big, so Israel couldn’t boast that they had saved themselves. Anyone afraid was free to go home, and 22,000 left (7:3). In the end, three hundred remained.',
      reflection: 'Fear was named openly, and no one was shamed for it. The story keeps pointing away from human strength and toward God’s faithfulness.',
    },
    purah: {
      title: 'If you are afraid, take a friend',
      ref: 'Judges 7:9–11',
      kjv: 'But if thou fear to go down, go thou with Phurah thy servant down to the host:',
      kjvRef: 'Judges 7:10',
      summary: 'On the night before the battle, God told Gideon to go down to the enemy camp. Then God added: if you’re afraid, take your servant Purah with you, and listen to what they are saying.',
      reflection: 'God makes room for Gideon’s fear. The answer to it is not a lecture, but a companion and something to hear.',
    },
    dream: {
      title: 'A loaf of barley bread',
      ref: 'Judges 7:13–15',
      kjv: 'And it was so, when Gideon heard the telling of the dream, and the interpretation thereof, that he worshipped, and returned into the host of Israel, and said, Arise; for the LORD hath delivered into your hand the host of Midian.',
      kjvRef: 'Judges 7:15',
      summary: 'Creeping to the edge of the camp, Gideon overheard a soldier describing a dream: a loaf of barley bread tumbled into the camp and flattened a tent. His friend said it meant Gideon would win. Gideon worshipped, then went back to his people.',
      reflection: 'Gideon’s courage came from hearing, and he worshipped before he acted. His story doesn’t end tidily — later he made an ephod that became a snare to Israel (8:27) — but this night, fear and faith walked down the hill together.',
    },
  };

  const discernReplies = {
    sign: 'God was patient with Gideon’s fleece. But Gideon had already been told what to do; the fleece was for his fear. Signs aren’t promised for every choice. Wisdom, Scripture, prayer, and wise people are the usual way.',
    counsel: 'That’s how most of Israel’s wisdom worked. Proverbs says plans go wrong without counsel, and with many counsellors they are established (15:22).',
    scripture: 'Good. And ask for wisdom plainly — James says God gives it generously and doesn’t scold you for asking (James 1:5).',
    wait: 'Sometimes waiting is wise. But Gideon never stopped being afraid. Watch what God does with that fear tonight.',
  };

  WF.registerJourney({
    id: 'gideon',
    companion: 'gideon',
    title: 'The Winepress and the Fleece',
    tagline: 'For when you feel uncertain, afraid, or stuck before a decision',
    passage: 'Judges 6–7',
    length: 'About 9 minutes · no timer',
    pages: PAGES,
    speakers: { abiel: { name: 'Abiel', note: 'a farmer from Ophrah' } },
    prologue: {
      heading: 'Before you set out',
      text: 'You are not Gideon. You’ll walk your own road beside his story, with a neighbour who is hiding his harvest too.\n\nThis journey is about discernment and courage. It won’t tell you what God wants you to decide. It will invite you to pray, look to Scripture, and seek wise counsel — and to notice that courage can begin while you are still afraid.',
    },
    areas: [
      {
        id: 'winepress', title: 'The Hidden Winepress', scene: 'winepress', width: 2100,
        objective: 'Find the hidden winepress in the dark.',
        caption: '[Night insects; wind in the vines]',
        intro: [N('Night in the hill country of Manasseh. For seven harvests, raiders have come. Families hide grain in caves. You move quietly between the terraces, keeping low.')],
        exitRequires: ['seen:winepress', 'seen:oak', 'seen:abiel'],
        exitHint: 'Look into the winepress, sit under the oak, and speak with the man by the vines.',
        hotspots: [
          {
            id: 'winepress', x: 520, art: 'winepress', kind: 'place', label: 'The winepress', verb: 'Look in', glowR: 80, required: true,
            steps: [
              N('Someone has been threshing wheat down in the stone pit — out of sight, where no one would think to look.'),
              { page: 'hiding' },
              {
                choice: {
                  key: 'hiding', prompt: 'What are you keeping low about right now?', hint: 'Optional — choose one, or skip.',
                  options: [
                    { value: 'decision', label: 'A decision I’m afraid to make' },
                    { value: 'future', label: 'Where my life is going' },
                    { value: 'faith', label: 'Questions I’m afraid to ask out loud' },
                    { value: 'people', label: 'What other people might think' },
                    { value: 'unsure', label: 'I’m not sure' },
                  ],
                },
              },
              N('Hiding isn’t the same as having no courage. Sometimes it’s simply how frightened people survive.'),
            ],
            again: [N('The wheat is still there, half-threshed, waiting.')],
          },
          {
            id: 'oak', x: 1100, art: 'oak', kind: 'place', label: 'The oak at Ophrah', verb: 'Sit beneath', glowR: 120, glowY: 100, sparkY: 240, labelY: 260, required: true,
            steps: [
              N('Under this kind of oak, the story says, an angel of the LORD sat down — and spoke to a man who did not feel brave at all.'),
              { page: 'valour' },
              {
                choice: {
                  key: 'honest', prompt: 'Gideon answered with an honest question. What is yours?', hint: 'Optional. Choose, write your own, or skip.',
                  allowText: true, placeholder: 'Your question, in your own words (stays on this device)',
                  options: [
                    { value: 'why', label: 'If God is with me, why is this happening?' },
                    { value: 'me', label: 'Why would God use someone like me?' },
                    { value: 'how', label: 'How do I know what’s right?' },
                    { value: 'where', label: 'Where is God in this?' },
                  ],
                },
              },
              N('God didn’t rebuke Gideon’s question. The answer was “Surely I will be with thee” — not a full plan, but a presence.'),
              { light: 'A question honestly asked' },
            ],
            again: [N('The oak’s shade is wide and quiet.')],
          },
          {
            id: 'abiel', x: 1650, art: 'abiel', kind: 'character', label: 'A man by the vines', verb: 'Talk', flip: true, required: true,
            steps: [
              AB('You’re out late too. Hiding a harvest? Sit — quietly.'),
              {
                choice: {
                  key: 'abiel-talk', speaker: 'abiel', prompt: 'Abiel keeps one eye on the ridge.', loop: true,
                  options: [
                    { value: 'why', label: 'Why are you hiding?', then: [AB('Same as everyone. If they see the grain, they take it. If they take it, my children go hungry. Fear is just good sense, most days.')] },
                    { value: 'god', label: 'Do you think God is with us?', then: [AB('Some nights I’m sure. Some nights I ask Gideon’s question: then why is all this happening? I don’t think God minds the asking.')] },
                    { value: 'what', label: 'What should I do?', then: [AB('I can’t tell you that. Nobody should pretend they can hear God for you. But I can walk with you while you work it out.')] },
                    { value: 'done', label: 'Let’s go before dawn.', end: true },
                  ],
                },
              },
            ],
            again: [AB('Dawn’s coming. The threshing floor is up the hill.')],
          },
        ],
      },
      {
        id: 'threshing', title: 'The Threshing Floor', scene: 'threshing', width: 2200,
        objective: 'Walk with Abiel to the threshing floor before dawn.',
        caption: '[Cool pre-dawn air; a distant bird]',
        intro: [N('Up on the hill, the stone threshing floor lies open to the sky. Dew is beginning to settle.'), AB('This is where Gideon laid out the fleece. People argue about it to this day.')],
        exitRequires: ['seen:altar', 'fleece-wet', 'seen:page-300'],
        exitHint: 'Look at the broken altar, the fleece, and the page by the path.',
        hotspots: [
          {
            id: 'abiel-walk', x: 60, follow: true, art: 'abiel', kind: 'character', label: 'Abiel', verb: 'Talk',
            steps: [
              { if: { notFlags: ['fleece-wet'] }, ...AB('Take your time. Courage doesn’t come faster for being rushed.') },
              { if: { flags: ['fleece-wet'] }, ...AB('Whatever you decide, decide it with people who love you and with your Bible open. That’s been my way.') },
            ],
          },
          {
            id: 'altar', x: 480, art: 'altar', kind: 'place', label: 'A broken altar', verb: 'Look closer', required: true,
            steps: [
              { page: 'altar' },
              {
                choice: {
                  key: 'brave', prompt: 'Is there a right thing you could do, even while you’re still afraid?',
                  options: [
                    { value: 'yes', label: 'Yes — there’s something', then: [N('You don’t have to do it tonight. Just notice that fear and faithfulness can share the same hands.')] },
                    { value: 'maybe', label: 'Maybe' },
                    { value: 'notyet', label: 'Not yet', then: [N('That’s honest. Gideon’s courage grew one step at a time.')] },
                  ],
                },
              },
            ],
            again: [N('The broken altar lies where Gideon left it.')],
          },
          {
            id: 'fleece', x: 1120, art: 'fleece', kind: 'object', label: 'A fleece on the threshing floor', verb: 'Look closer', litFlag: 'fleece-wet', required: true,
            steps: [
              N('A woollen fleece lies on the stone. As the sky pales, it is soaked with dew — and the floor around it is dry.'),
              { set: 'fleece-wet' },
              { page: 'fleece' },
              {
                choice: {
                  key: 'discern', speaker: 'abiel', noSkip: true,
                  prompt: 'Abiel turns to you. “So — how do you think a person should decide what to do?”',
                  options: [
                    { value: 'sign', label: 'Ask God for a clear sign', then: [AB(discernReplies.sign)] },
                    { value: 'counsel', label: 'Talk it through with wise people', then: [AB(discernReplies.counsel)] },
                    { value: 'scripture', label: 'Pray and test it against Scripture', then: [AB(discernReplies.scripture)] },
                    { value: 'wait', label: 'Wait until I’m less afraid', then: [AB(discernReplies.wait)] },
                  ],
                },
              },
              { light: 'Dew on the fleece' },
            ],
            again: [N('The fleece is heavy with dew.')],
          },
          {
            id: 'page-300', x: 1750, art: 'page', kind: 'page', label: 'A page by the path', verb: 'Read', required: true,
            steps: [{ page: 'threehundred' }],
          },
        ],
      },
      {
        id: 'camp', title: 'Above the Camp of Midian', scene: 'midian', width: 2300,
        objective: 'Go down toward the camp. You won’t go alone.',
        caption: '[Distant voices; many small fires crackling below]',
        intro: [N('Night again. Below, the valley is full of tents and fires — the text says the camp lay “like grasshoppers for multitude” (Judges 7:12).')],
        exitRequires: ['seen:overlook', 'seen:tent', 'farewell'],
        exitHint: 'Look over the camp, listen at the tent, and say goodbye to Abiel.',
        hotspots: [
          {
            id: 'abiel-camp', x: 60, follow: true, art: 'abiel', kind: 'character', label: 'Abiel', verb: 'Talk',
            steps: [
              { if: { notFlags: ['seen:tent'] }, ...AB('Stay close. We only need to listen tonight.') },
              {
                if: { flags: ['seen:tent'] },
                say: { speaker: 'abiel', text: 'This is where I turn back. Gideon’s story isn’t tidy — there were battles ahead, and later mistakes. Courage once doesn’t make you finished. Keep walking with wise people, and keep listening.' },
              },
              { if: { flags: ['seen:tent'] }, set: 'farewell' },
            ],
          },
          {
            id: 'overlook', x: 520, art: 'ledge', kind: 'place', label: 'The edge of the hill', verb: 'Look down', glowR: 90, required: true,
            steps: [
              { page: 'purah' },
              { if: { answer: { key: 'discern', in: ['sign'] } }, ...AB('You said you might ask for a sign. Notice what God gave Gideon here instead of another sign: a companion, and something to listen to.') },
              { if: { answer: { key: 'discern', in: ['counsel'] } }, ...AB('You said wise people help you decide. Well — here’s one going down the hill with you.') },
              { if: { answer: { key: 'discern', in: ['scripture'] } }, ...AB('You said prayer and Scripture. Gideon’s courage tonight comes from hearing, not seeing. Let’s go and listen.') },
              { if: { answer: { key: 'discern', in: ['wait'] } }, ...AB('You said you’d wait until you were less afraid. God didn’t make Gideon wait for that. He said: if you’re afraid, take a friend.') },
            ],
            again: [N('The fires below flicker like stars on the ground.')],
          },
          {
            id: 'tent', x: 1350, art: 'tentGlow', kind: 'place', label: 'A lit tent', verb: 'Listen', glowR: 90, glowY: 50, labelY: 130, required: true,
            steps: [
              N('You crouch in the shadow of a tent. Inside, two soldiers are talking in low voices about a strange dream.'),
              { caption: '[Muffled voices inside the tent]' },
              { page: 'dream' },
              {
                choice: {
                  key: 'courage', prompt: 'What would a faithful next step look like, even with fear still here?',
                  hint: 'Optional.',
                  options: [
                    { value: 'decide', label: 'Make the decision I’ve been avoiding' },
                    { value: 'ask', label: 'Ask someone wise to help me think it through' },
                    { value: 'small', label: 'Take one small, brave step' },
                    { value: 'pray', label: 'Rest and pray before deciding' },
                  ],
                },
              },
              { light: 'Courage heard in the dark' },
            ],
            again: [N('The voices inside have gone quiet.')],
          },
        ],
      },
    ],
    reflect: {
      intro: 'Look back over the night. There are no right answers.',
      questions: [
        {
          key: 'stood-out', prompt: 'What stood out to you?', multi: true,
          options: [
            { value: 'named', label: 'God greeting Gideon as “mighty” before he felt it' },
            { value: 'questions', label: 'Gideon’s honest questions' },
            { value: 'afraid', label: 'Courage that was still afraid' },
            { value: 'patience', label: 'God’s patience with the fleece' },
            { value: 'friend', label: 'Not going down the hill alone' },
          ],
        },
        {
          key: 'true-now', prompt: 'What feels most true for you right now?',
          options: [
            { value: 'decide', label: 'I need to make a decision I’ve been avoiding' },
            { value: 'counsel', label: 'I need wise counsel' },
            { value: 'admit', label: 'I need to admit I’m afraid' },
            { value: 'trust', label: 'I need to trust that God is with me' },
            { value: 'unsure', label: 'I’m not sure yet' },
          ],
          allowText: true, placeholder: 'Anything else? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: 'Gideon heard “The LORD is with thee” before he felt brave. Jesus promised his followers, “I am with you alway” (Matthew 28:20). Breathe slowly, and pray if you’d like.',
        breathIn: 'Lord, you are with me…',
        breathOut: '…give me wisdom for the next step.',
        cycles: 4,
      },
    },
    scripture: [
      {
        ref: 'Judges 6:11–16', title: 'Found in hiding',
        quotes: [{ ref: 'Judges 6:12', text: 'And the angel of the LORD appeared unto him, and said unto him, The LORD is with thee, thou mighty man of valour.' }],
        context: 'Israel is being raided every harvest. God meets Gideon while he hides, greets him by who he will become, hears his honest complaint, and answers his sense of smallness with “Surely I will be with thee” (6:16).',
        question: 'What might it mean that God’s presence comes before your confidence?',
      },
      {
        ref: 'Judges 7:9–15', title: 'Room for fear',
        quotes: [{ ref: 'Judges 7:10', text: 'But if thou fear to go down, go thou with Phurah thy servant down to the host:' }],
        context: 'On the eve of battle, God anticipates Gideon’s fear and provides a companion and a word to hear. Gideon worships before he acts. The story later shows that Gideon still made serious mistakes (8:22–27) — courage is not the same as being finished.',
        question: 'Who could “go down the hill” with you as you face this decision?',
      },
      {
        ref: 'James 1:5 · Proverbs 15:22', title: 'How wisdom usually comes',
        quotes: [
          { ref: 'James 1:5', text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.' },
          { ref: 'Proverbs 15:22', text: 'Without counsel purposes are disappointed: but in the multitude of counsellors they are established.' },
        ],
        context: 'James writes to Christians facing trials and invites them to ask God for wisdom without fear of being scolded. Proverbs repeatedly connects wisdom with listening to others. Together they describe ordinary discernment: prayer, Scripture, and wise people — not waiting for a miraculous sign.',
        question: 'Who are two wise, steady people you could ask to help you think this through?',
      },
    ],
    nextSteps: [
      { id: 'name', label: 'Name the decision clearly', detail: 'Write the decision or fear in one sentence. Naming it often makes it smaller and clearer.', prompt: 'The decision in front of me:', placeholder: 'e.g. Whether to apply for the new role' },
      { id: 'ask', label: 'Ask one wise person to help me think it through', detail: 'Choose someone steady who loves you and loves God. Ask them to listen first and advise second.', prompt: 'Who and when:', placeholder: 'e.g. Coffee with Ama on Saturday' },
      { id: 'pray', label: 'Pray for wisdom', detail: 'A prayer based on James 1:5.', prayer: 'Lord God, I don’t know what to do, and I’m afraid. Thank you that you give wisdom generously and don’t scold me for asking. Be with me as you were with Gideon. Help me see through Scripture, through prayer, and through the wise people around me. Give me courage for the next faithful step, even if fear comes with me. In Jesus’ name, Amen.' },
      { id: 'step', label: 'Take one small, brave step', detail: 'Not the whole thing — one step. Send the email, make the call, have the first conversation.', prompt: 'My small step:', placeholder: 'e.g. Book the appointment tomorrow' },
      { id: 'support', label: 'Talk with a pastor or counsellor about anxiety', detail: 'If fear or worry is constant, affecting sleep or daily life, a counsellor or doctor can help — and that’s a wise, faithful choice.', prompt: 'Who I could contact:', placeholder: 'e.g. Ask my GP about support', showSupport: true },
      { id: 'later', label: 'Rest, and return to this later', detail: 'Some decisions are better made rested. That’s a real choice, not a failure.' },
    ],
    closing: {
      heading: 'You walked The Winepress and the Fleece',
      hope: 'Gideon didn’t stop being afraid before God used him. He was met in hiding, heard honestly, given a friend, and given something to hear. Your decision may still feel hard. But you don’t have to face it alone, or wait for perfect certainty, to take one faithful step.',
    },
  });
})();
