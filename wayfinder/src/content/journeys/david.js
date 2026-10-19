/* Wayfinder — Journey: "The Rooftop and the Prophet" (2 Samuel 11–12; Psalm 51).
 * Theme: desire, harm, power, accountability, repentance, consequences.
 * Care points: this is an abuse of royal power, not a romance. Bathsheba and Uriah are
 * people who were wronged, never props. Repentance does not erase consequences or the
 * need to protect those harmed. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const N = (text) => ({ say: { speaker: 'narrator', text } });
  const TA = (text) => ({ say: { speaker: 'tavi', text } });
  const NA = (text) => ({ say: { speaker: 'nathan', text } });

  const PAGES = {
    tarried: {
      title: 'David tarried still at Jerusalem',
      ref: '2 Samuel 11:1',
      kjv: 'But David tarried still at Jerusalem.',
      kjvRef: '2 Samuel 11:1 (end of verse)',
      summary: 'In the spring, when kings went out to war, David sent his army out under Joab — and stayed home in his palace.',
      reflection: 'The story begins with a king comfortable, idle, and powerful. Nothing has happened yet. But the setting matters.',
    },
    took: {
      title: 'He sent messengers, and took her',
      ref: '2 Samuel 11:2–5',
      kjv: 'And David sent messengers, and took her; and she came in unto him, and he lay with her; for she was purified from her uncleanness: and she returned unto her house.',
      kjvRef: '2 Samuel 11:4',
      summary: 'From his roof, David saw a woman bathing. He found out she was Bathsheba, the wife of Uriah, one of his soldiers. He sent messengers to take her to the palace and slept with her. She became pregnant.',
      reflection: 'This is not a love story. David was the king; Bathsheba’s husband was away at David’s war. Every verb belongs to David — he saw, sent, took. Scripture places the responsibility on him.',
    },
    letter: {
      title: 'A letter carried by Uriah',
      ref: '2 Samuel 11:6–27',
      kjv: 'And when the mourning was past, David sent and fetched her to his house, and she became his wife, and bare him a son. But the thing that David had done displeased the LORD.',
      kjvRef: '2 Samuel 11:27',
      summary: 'To hide the pregnancy, David brought Uriah home, hoping he would sleep with his wife. Uriah, loyal to his fellow soldiers, refused. So David sent a letter — carried by Uriah himself — telling Joab to put Uriah where the fighting was fiercest and pull back. Uriah was killed. Bathsheba mourned her husband.',
      reflection: 'The cover-up was worse than the first wrong: a loyal, honourable man was murdered. Bathsheba lost her husband because of the king’s choices.',
    },
    parable: {
      title: 'The poor man’s lamb',
      ref: '2 Samuel 12:1–6',
      kjv: 'But the poor man had nothing, save one little ewe lamb, which he had bought and nourished up: and it grew up together with him, and with his children; it did eat of his own meat, and drank of his own cup, and lay in his bosom, and was unto him as a daughter.',
      kjvRef: '2 Samuel 12:3',
      summary: 'God sent the prophet Nathan to David. Nathan told a story: a rich man with many flocks took a poor man’s only, beloved lamb to feed a guest. David burned with anger and said the man deserved to die and must repay fourfold.',
      reflection: 'Nathan’s story makes the harm visible from the side of the one who was wronged. Power often hides that view.',
    },
    thouart: {
      title: 'Thou art the man',
      ref: '2 Samuel 12:7–12',
      kjv: 'And Nathan said to David, Thou art the man.',
      kjvRef: '2 Samuel 12:7',
      summary: 'Nathan turned the story on David: God had given him everything, yet he had despised God’s word, taken Uriah’s wife, and killed Uriah with the sword of the Ammonites. Nathan named consequences that would follow in David’s own house.',
      reflection: 'Truth was spoken to power, at real risk. Nathan named both the sexual sin and the murder — no softer words.',
    },
    confess: {
      title: 'I have sinned',
      ref: '2 Samuel 12:13–23',
      kjv: 'And David said unto Nathan, I have sinned against the LORD. And Nathan said unto David, The LORD also hath put away thy sin; thou shalt not die.',
      kjvRef: '2 Samuel 12:13',
      summary: 'David confessed without excuse. Nathan told him God had put away his sin — and that the child born to Bathsheba would die. The child became ill; David fasted and prayed, and the child died.',
      reflection: 'Forgiveness and consequences stand side by side here. The death of the child is painful and hard to understand; Wayfinder won’t explain it away. Repentance did not undo the harm David had done.',
    },
    bathsheba: {
      title: 'Her that had been the wife of Urias',
      ref: '2 Samuel 12:24 · Matthew 1:6',
      kjv: 'And Jesse begat David the king; and David the king begat Solomon of her that had been the wife of Urias;',
      kjvRef: 'Matthew 1:6',
      summary: 'Bathsheba mourned her husband and then her child. David comforted her (12:24), and she later bore Solomon. She became a woman of influence (1 Kings 1–2). Generations later, Matthew’s genealogy of Jesus names her — and pointedly remembers Uriah.',
      reflection: 'The story of David’s repentance is also the story of a woman who was wronged and grieved twice. Scripture doesn’t forget her, or Uriah. Neither should we.',
    },
  };

  const responseReplies = {
    defend: 'Explaining is the instinct of power. But listen to Psalm 51: no explanation. “I acknowledge my transgressions.” The way back begins with the truth, not with the reasons.',
    blame: 'Others had a part — Joab followed orders. But a confession that points elsewhere isn’t a confession yet. Each of us can only repent of our own part.',
    confess: 'Admitting it plainly is the hardest and best first step. It is only a first step. Repair, protection of others, and accountability come next.',
    freeze: 'Going silent is human. David hid this for months. Psalm 32 says that when he kept silence, his bones grew old. Speaking was the way out.',
  };

  WF.registerJourney({
    id: 'david',
    companion: 'david',
    title: 'The Rooftop and the Prophet',
    tagline: 'For when desire, power, or harm has led you somewhere you regret',
    passage: '2 Samuel 11–12; Psalm 51',
    length: 'About 10 minutes · no timer',
    pages: PAGES,
    speakers: {
      tavi: { name: 'Tavi', note: 'a court musician' },
      nathan: { name: 'Nathan', note: 'the prophet' },
    },
    prologue: {
      heading: 'Before you set out',
      text: 'You are not David. You’ll walk your own road beside his story, through a palace, with a court musician named Tavi.\n\nThis story involves the abuse of power, sexual sin, and murder. Wayfinder treats it seriously. Bathsheba and Uriah were real people who were wronged. Repentance matters deeply here — and so do accountability, consequences, and protecting anyone who has been harmed.',
    },
    areas: [
      {
        id: 'rooftop', title: 'The Palace Rooftop', scene: 'rooftop', width: 2000,
        objective: 'Walk the palace roof at evening.',
        caption: '[Evening city sounds; distant voices]',
        intro: [N('Evening in Jerusalem. The army is away at war. On the palace roof, the air is warm and the city spreads out below.')],
        exitRequires: ['seen:parapet', 'seen:letter', 'seen:tavi'],
        exitHint: 'Look over the parapet, look at the letter, and talk with the musician.',
        hotspots: [
          {
            id: 'parapet', x: 500, art: 'parapet', kind: 'place', label: 'The parapet', verb: 'Look out', glowR: 90, required: true,
            steps: [
              { page: 'tarried' },
              { page: 'took' },
              {
                choice: {
                  key: 'power', prompt: 'Where do you hold power or influence over other people?', hint: 'Optional — choose one, or skip.',
                  options: [
                    { value: 'home', label: 'At home or in my family' },
                    { value: 'work', label: 'At work or school' },
                    { value: 'church', label: 'In church or ministry' },
                    { value: 'relationship', label: 'In a relationship' },
                    { value: 'online', label: 'Online' },
                    { value: 'little', label: 'I don’t feel I have much' },
                  ],
                },
              },
              N('Power isn’t wrong in itself. But Jesus said, “unto whomsoever much is given, of him shall be much required” (Luke 12:48).'),
            ],
            again: [N('Lamps are being lit across the city.')],
          },
          {
            id: 'letter', x: 1100, art: 'letter', kind: 'object', label: 'A sealed letter', verb: 'Look closer', required: true,
            steps: [
              { page: 'letter' },
              {
                choice: {
                  key: 'cover', prompt: 'When something you’ve done goes wrong, what’s your first instinct?', hint: 'Optional.',
                  options: [
                    { value: 'hide', label: 'Hide it' },
                    { value: 'manage', label: 'Manage how it looks' },
                    { value: 'blame', label: 'Find someone else to blame' },
                    { value: 'own', label: 'Own it quickly' },
                    { value: 'depends', label: 'It depends' },
                  ],
                },
              },
              N('David’s instinct was to cover it up. Each step of the cover-up harmed someone else.'),
            ],
            again: [N('The seal is broken now.')],
          },
          {
            id: 'tavi', x: 1650, art: 'tavi', kind: 'character', label: 'A musician', verb: 'Talk', flip: true, required: true,
            steps: [
              TA('I play for the king. Everybody in the palace knew. Nobody said a word.'),
              {
                choice: {
                  key: 'tavi-talk', speaker: 'tavi', prompt: 'Tavi tightens a string on his lyre.', loop: true,
                  options: [
                    { value: 'silent', label: 'Why didn’t anyone speak up?', then: [TA('Who tells a king no? That’s what power does — it makes the truth expensive. So people stay quiet, and the harm grows.')] },
                    { value: 'bathsheba', label: 'What about Bathsheba?', then: [TA('She lost her husband, then her child. People talk about David’s sin and forget she was the one it happened to. Don’t forget her.')] },
                    { value: 'forgiven', label: 'Could David still be forgiven?', then: [TA('Wait for the prophet. Forgiveness is real in this story. But it doesn’t arrive the way a king would choose — and it doesn’t make the harm disappear.')] },
                    { value: 'done', label: 'Where is the prophet?', end: true },
                  ],
                },
              },
            ],
            again: [TA('The hall is below. Nathan has asked to see the king.')],
          },
        ],
      },
      {
        id: 'hall', title: 'Nathan’s Story', scene: 'hall', width: 2000,
        objective: 'Hear the prophet’s story.',
        caption: '[A quiet hall; a door closing]',
        intro: [N('A cedar hall, bright with daylight. An old prophet waits with his staff. He looks tired, and very calm.')],
        exitRequires: ['seen:nathan', 'seen:lamb'],
        exitHint: 'Hear Nathan’s story, then look at the little lamb.',
        hotspots: [
          { id: 'tavi-hall', x: 60, follow: true, art: 'tavi', kind: 'character', label: 'Tavi', verb: 'Talk', steps: [TA('Nathan could lose his life for this. Listen closely.')] },
          {
            id: 'nathan', x: 700, art: 'nathan', kind: 'character', label: 'Nathan the prophet', verb: 'Listen', flip: true, required: true,
            steps: [
              NA('Let me tell you a story. There were two men in one city: one rich, one poor.'),
              { page: 'parable' },
              {
                choice: {
                  key: 'verdict', speaker: 'nathan', prompt: '“What do you think of the rich man?” Nathan asks.',
                  options: [
                    { value: 'punish', label: 'He deserves to be punished' },
                    { value: 'repay', label: 'The poor man must be repaid' },
                    { value: 'who', label: 'I wonder who this is really about' },
                  ],
                },
              },
              { page: 'thouart' },
              {
                choice: {
                  key: 'response', noSkip: true,
                  prompt: 'Not as David, but as yourself: if someone confronted you with harm you had caused, what might your first instinct be?',
                  options: [
                    { value: 'defend', label: 'Explain why it wasn’t that bad', then: [NA(responseReplies.defend)] },
                    { value: 'blame', label: 'Point to someone else’s part', then: [NA(responseReplies.blame)] },
                    { value: 'confess', label: 'Admit it plainly', then: [NA(responseReplies.confess)] },
                    { value: 'freeze', label: 'Go silent', then: [NA(responseReplies.freeze)] },
                  ],
                },
              },
            ],
            again: [NA('The truth has been spoken. What happens next matters.')],
          },
          {
            id: 'lamb', x: 1350, art: 'lamb', kind: 'object', label: 'A little ewe lamb', verb: 'Look closer', required: true,
            steps: [
              N('A small lamb, the kind a poor family might raise like one of their own children.'),
              N('Nathan’s story makes us look from the side of the one who was harmed. Repentance that only thinks about our own guilt has not yet looked at them.'),
              {
                choice: {
                  key: 'harmed', prompt: 'Is there someone your choices have harmed?', hint: 'Optional. Your answer stays on this device.',
                  options: [
                    { value: 'yes', label: 'Yes', then: [N('Thank you for being honest. Their wellbeing matters most now: telling the truth, taking responsibility, and not making them carry your healing.')] },
                    { value: 'maybe', label: 'Possibly' },
                    { value: 'no', label: 'I don’t think so' },
                    { value: 'afraid', label: 'I’m afraid I might hurt someone', crisis: true, then: [{ say: { speaker: 'note', text: 'Thank you for saying so. Please reach out now — to emergency services if anyone is in danger, to a crisis line, or to a professional who can help you keep others and yourself safe.' } }] },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
              { light: 'Seeing the one who was harmed' },
            ],
            again: [N('The lamb nuzzles at the floor rushes.')],
          },
        ],
      },
      {
        id: 'night', title: 'The Psalm in the Night', scene: 'nightroom', width: 2000,
        objective: 'Find honest words in the night.',
        caption: '[A single lamp flickering; quiet]',
        intro: [N('Night. One lamp burning. In tradition, Psalm 51 is linked with this time — a prayer written after Nathan came.')],
        exitRequires: ['seen:lamp', 'seen:harp', 'seen:window'],
        exitHint: 'Read by the lamp, listen to the lyre, and stand at the window.',
        hotspots: [
          {
            id: 'lamp', x: 450, art: 'lamp', kind: 'object', label: 'A lamp', verb: 'Read by it', required: true,
            steps: [{ page: 'confess' }],
            again: [N('The lamp burns low and steady.')],
          },
          {
            id: 'harp', x: 1050, art: 'harp', kind: 'object', label: 'A lyre', verb: 'Listen', required: true,
            steps: [
              { caption: '[Soft notes on a lyre]' },
              N('Tavi plays quietly. The words are old: “Create in me a clean heart, O God; and renew a right spirit within me” (Psalm 51:10).'),
              { if: { answer: { key: 'response', in: ['defend'] } }, ...TA('You said your instinct might be to explain. Psalm 51 doesn’t explain. It just tells the truth. That’s where healing starts.') },
              { if: { answer: { key: 'response', in: ['blame'] } }, ...TA('You said you might point to others. This psalm only speaks for the one praying it. That’s the only confession any of us can make.') },
              { if: { answer: { key: 'response', in: ['confess'] } }, ...TA('You said you’d admit it plainly. Then this psalm is for you — and so is the work after it: repair, where it’s safe and wanted.') },
              { if: { answer: { key: 'response', in: ['freeze'] } }, ...TA('You said you might go silent. This psalm is what it sounds like when silence breaks.') },
              {
                choice: {
                  key: 'clean', prompt: 'What would you most want God to make new in you?', hint: 'Optional.',
                  options: [
                    { value: 'heart', label: 'A clean heart' },
                    { value: 'honesty', label: 'Honesty' },
                    { value: 'control', label: 'Self-control' },
                    { value: 'courage', label: 'Courage to make things right' },
                    { value: 'humility', label: 'Humility' },
                  ],
                },
              },
            ],
            again: [N('The lyre is quiet.')],
          },
          {
            id: 'window', x: 1600, art: 'page', kind: 'page', label: 'A page by the window', verb: 'Read', required: true,
            steps: [
              { page: 'bathsheba' },
              TA('Forgiven isn’t the same as consequence-free. David lived with what he’d done for the rest of his life. If you’ve harmed someone: tell the truth, take responsibility, protect them from more harm, and get wise help. And remember the people it happened to.'),
              { light: 'Remembering Bathsheba and Uriah' },
            ],
          },
        ],
      },
    ],
    reflect: {
      intro: 'Look back over the palace. Be as honest as you can — this stays with you.',
      questions: [
        {
          key: 'stood-out', prompt: 'What stood out to you?', multi: true,
          options: [
            { value: 'power', label: 'How power made the harm possible' },
            { value: 'coverup', label: 'How the cover-up made it worse' },
            { value: 'nathan', label: 'Nathan speaking the truth' },
            { value: 'confess', label: 'David’s plain confession' },
            { value: 'bathsheba', label: 'Remembering Bathsheba and Uriah' },
          ],
        },
        {
          key: 'true-now', prompt: 'What feels most true for you right now?',
          options: [
            { value: 'truth', label: 'I need to tell the truth about something' },
            { value: 'account', label: 'I need someone to hold me accountable' },
            { value: 'repair', label: 'I need to take responsibility for harm' },
            { value: 'clean', label: 'I need God to make my heart clean' },
            { value: 'unsure', label: 'I’m not sure yet' },
          ],
          allowText: true, placeholder: 'Anything else? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: 'Psalm 51 begins by appealing to God’s steadfast love, not to David’s own goodness. Breathe slowly and bring the truth.',
        breathIn: 'Have mercy on me, O God…',
        breathOut: '…create in me a clean heart.',
        cycles: 4,
      },
    },
    scripture: [
      {
        ref: '2 Samuel 12:1–13', title: 'Truth spoken to power',
        quotes: [
          { ref: '2 Samuel 12:7', text: 'And Nathan said to David, Thou art the man.' },
          { ref: '2 Samuel 12:13', text: 'And David said unto Nathan, I have sinned against the LORD. And Nathan said unto David, The LORD also hath put away thy sin; thou shalt not die.' },
        ],
        context: 'David used royal power to take Bathsheba and to have Uriah killed. Nathan confronts him through a parable that shows the harm from the victim’s side. David confesses and is forgiven — and serious consequences still follow.',
        question: 'Who in your life is allowed to tell you the truth — and would you listen?',
      },
      {
        ref: 'Psalm 51:1–4, 10–12', title: 'A clean heart',
        quotes: [
          { ref: 'Psalm 51:1', text: 'Have mercy upon me, O God, according to thy lovingkindness: according unto the multitude of thy tender mercies blot out my transgressions.' },
          { ref: 'Psalm 51:3', text: 'For I acknowledge my transgressions: and my sin is ever before me.' },
          { ref: 'Psalm 51:10', text: 'Create in me a clean heart, O God; and renew a right spirit within me.' },
        ],
        context: 'The psalm’s heading links it to Nathan’s visit. It appeals to God’s mercy, makes no excuses, and asks for inner renewal. When verse 4 says “against thee, thee only”, it is not denying that Bathsheba and Uriah were harmed; it confesses that all wrong is ultimately against God’s own justice.',
        question: 'What would it look like to pray this psalm honestly, without explanation?',
      },
      {
        ref: 'Micah 6:8 · Luke 12:48', title: 'Justice, mercy, humility',
        quotes: [
          { ref: 'Micah 6:8', text: 'He hath shewed thee, O man, what is good; and what doth the LORD require of thee, but to do justly, and to love mercy, and to walk humbly with thy God?' },
          { ref: 'Luke 12:48', text: 'For unto whomsoever much is given, of him shall be much required:' },
        ],
        context: 'Micah sums up what God asks of his people: justice, mercy, and humility. Jesus teaches that those entrusted with more — including power and influence — are held to greater account.',
        question: 'Where do you hold power, and how could you use it justly and humbly?',
      },
    ],
    nextSteps: [
      { id: 'confess', label: 'Confess honestly to God', detail: 'A prayer drawn from Psalm 51.', prayer: 'Have mercy on me, O God, according to your steadfast love. I won’t make excuses. I acknowledge what I have done, and I see that it has harmed others. Create in me a clean heart, and renew a right spirit within me. Give me courage to tell the truth, to take responsibility, and to put the wellbeing of those I have hurt before my own comfort. In Jesus’ name, Amen.' },
      { id: 'account', label: 'Tell an accountability partner or pastor', detail: 'Choose someone mature who will tell you the truth, like Nathan. Ask them to check in with you.', prompt: 'Who I could ask:', placeholder: 'e.g. Ask pastor Ruth to meet monthly' },
      { id: 'repair', label: 'Take responsibility and repair where it’s safe and wanted', detail: 'Repair may mean an honest apology, restitution, or changing what caused harm. Don’t force contact on someone you have hurt; respect their wishes and boundaries.', prompt: 'One responsible step:', placeholder: 'e.g. Talk to a counsellor about how to make amends' },
      { id: 'safeguard', label: 'Put a safeguard in place', detail: 'A practical boundary around power, desire, or the situations where harm happened.', prompt: 'My safeguard:', placeholder: 'e.g. Never meet one-to-one behind closed doors' },
      { id: 'support', label: 'Seek professional or legal advice where needed', detail: 'Some harm needs professional help, reporting, or legal responsibility. If anyone is at risk, their safety comes first — contact the appropriate services.', prompt: 'Who I could contact:', placeholder: 'e.g. A counsellor who works with this', showSupport: true },
      { id: 'later', label: 'Rest, and return to this later', detail: 'If you return, come back soon — truth-telling is easier sooner than later.' },
    ],
    closing: {
      heading: 'You walked The Rooftop and the Prophet',
      hope: 'David used his power to harm others, and Scripture says so plainly. When the truth was spoken, he confessed without excuse and was forgiven — and he still lived with real consequences. Bathsheba and Uriah are remembered. There is mercy for those who have done harm and turn honestly to God. That mercy leads toward truth, responsibility, and protecting others, not away from them.',
    },
  });
})();
