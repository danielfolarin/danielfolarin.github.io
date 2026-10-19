/* Wayfinder — Journey: "The Long Road from the Pit" (Genesis 37–50).
 * Theme: betrayal, waiting, integrity, and hope.
 * Care points: betrayal and abuse are never called good or necessary. Forgiveness is not
 * the same as reconciliation; reconciliation requires safety and real change. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const N = (text) => ({ say: { speaker: 'narrator', text } });
  const IR = (text) => ({ say: { speaker: 'iry', text } });

  const PAGES = {
    pit: {
      title: 'The pit was empty',
      ref: 'Genesis 37:18–28',
      kjv: 'And they took him, and cast him into a pit: and the pit was empty, there was no water in it.',
      kjvRef: 'Genesis 37:24',
      summary: 'Joseph’s brothers saw him coming across the fields near Dothan. They stripped off the coat their father had given him, threw him into an empty cistern, sat down to eat, and then sold him to traders for twenty pieces of silver.',
      reflection: 'This was a betrayal by family — people who should have protected him. Scripture names it as cruelty, not as a misunderstanding.',
    },
    anguish: {
      title: 'The anguish of his soul',
      ref: 'Genesis 42:21',
      kjv: 'And they said one to another, We are verily guilty concerning our brother, in that we saw the anguish of his soul, when he besought us, and we would not hear; therefore is this distress come upon us.',
      kjvRef: 'Genesis 42:21',
      summary: 'Years later, the brothers remembered: Joseph had pleaded with them from the pit, and they had refused to listen.',
      reflection: 'Joseph’s pain was seen and ignored. The text lets that memory return — harm doesn’t simply disappear because time passes.',
    },
    dreams: {
      title: 'A favoured son',
      ref: 'Genesis 37:3–11',
      summary: 'Jacob loved Joseph more than his other sons and gave him a special coat. Joseph told his brothers about dreams in which they bowed down to him. Their resentment grew.',
      reflection: 'Joseph wasn’t perfect, and his family was complicated. None of that excuses what was done to him. People can be imperfect and still be wronged.',
    },
    egypt: {
      title: 'The LORD was with Joseph',
      ref: 'Genesis 39:1–23',
      kjv: 'But the LORD was with Joseph, and shewed him mercy, and gave him favour in the sight of the keeper of the prison.',
      kjvRef: 'Genesis 39:21',
      summary: 'In Egypt, Joseph served in Potiphar’s household and refused the advances of Potiphar’s wife. She falsely accused him, and he was thrown into prison. There he kept serving faithfully, and was given responsibility.',
      reflection: 'Joseph’s integrity didn’t protect him from injustice. Yet the text says, more than once, that the LORD was with him — in the prison, not only after it.',
    },
    forgot: {
      title: 'Forgotten',
      ref: 'Genesis 40:1–41:1',
      kjv: 'Yet did not the chief butler remember Joseph, but forgat him.',
      kjvRef: 'Genesis 40:23',
      summary: 'Joseph helped Pharaoh’s cupbearer understand a dream and asked only to be remembered. The cupbearer was restored to his position — and forgot him. Two full years passed.',
      reflection: 'Being forgotten is its own kind of pain. The story counts the time honestly: two full years.',
    },
    tested: {
      title: 'Has anything changed?',
      ref: 'Genesis 42–44',
      summary: 'In a famine, Joseph’s brothers came to Egypt for grain. Joseph — now governor — recognised them, but they didn’t recognise him. He tested them carefully. In the end Judah, who had once suggested selling Joseph, offered himself as a slave so that their youngest brother, Benjamin, could go free (44:33). Joseph wept more than once (42:24; 43:30).',
      reflection: 'Joseph didn’t rush to reconcile. He watched for real change, and he grieved. Wise caution is not the same as unforgiveness.',
    },
    revealed: {
      title: 'He wept aloud',
      ref: 'Genesis 45:1–15',
      kjv: 'And he wept aloud: and the Egyptians and the house of Pharaoh heard.',
      kjvRef: 'Genesis 45:2',
      summary: 'When Joseph saw Judah’s change of heart, he could no longer hold back. He sent everyone else out, wept so loudly that the Egyptians heard, and told his brothers who he was.',
      reflection: 'Reconciliation here is full of tears. It comes after years, after testing, and after the brothers had changed.',
    },
    meant: {
      title: 'Ye thought evil against me',
      ref: 'Genesis 50:15–21',
      kjv: 'But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.',
      kjvRef: 'Genesis 50:20',
      summary: 'After their father died, the brothers feared revenge. Joseph wept, reassured them, and promised to provide for their families.',
      reflection: 'Joseph names what they did as evil. He does not say the betrayal was good or necessary. He says God brought good through it — a conclusion he reached after many years, about his own story. It is not a quick explanation anyone should press on someone else’s pain.',
    },
  };

  const waitReplies = {
    faithful: 'Keep doing the next good thing — that’s what Joseph did. It won’t make the waiting fair, but it keeps you yourself.',
    bitter: 'I do that too. Replaying it over and over. Joseph must have, some nights. Maybe the first step is saying it out loud to God instead of only to the wall.',
    pray: 'Complaints count as prayers. Half the psalms are complaints. “How long, O LORD?” — that’s in the Bible.',
    numb: 'Numb gets you through a night. It doesn’t get you through years. Find one person you can feel things with.',
  };

  WF.registerJourney({
    id: 'joseph',
    companion: 'joseph',
    title: 'The Long Road from the Pit',
    tagline: 'For when you have been betrayed, or are waiting a long time for change',
    passage: 'Genesis 37–50',
    length: 'About 10 minutes · no timer',
    pages: PAGES,
    speakers: { iry: { name: 'Iry', note: 'a fellow prisoner' } },
    prologue: {
      heading: 'Before you set out',
      text: 'You are not Joseph. You’ll walk your own road beside his story — from a pasture, to a prison, to a hall of grain — and meet a fellow prisoner named Iry.\n\nJoseph was betrayed by his own family. Wayfinder will never suggest that betrayal or abuse is good, deserved, or necessary, or that you must reconcile with someone who is unsafe.',
    },
    areas: [
      {
        id: 'dothan', title: 'The Empty Cistern', scene: 'dothan', width: 2000,
        objective: 'Find what was left near the cistern.',
        caption: '[Sheep bleating; midday heat]',
        intro: [N('Open pasture near Dothan. Sheep graze on the hillside. Something bright lies on a rock by the path.')],
        exitRequires: ['seen:coat', 'seen:cistern', 'seen:page-dreams'],
        exitHint: 'Look at the coat, the cistern, and the page further along the path.',
        hotspots: [
          {
            id: 'coat', x: 480, art: 'coat', kind: 'object', label: 'A torn coat', verb: 'Look closer', required: true,
            steps: [
              N('A richly coloured coat, torn and dusty, thrown over a rock.'),
              { page: 'pit' },
              {
                choice: {
                  key: 'betrayed', prompt: 'Have you been hurt by someone you trusted?', hint: 'Optional — choose one, or skip.',
                  options: [
                    { value: 'family', label: 'Yes — by family' },
                    { value: 'friend', label: 'Yes — by a friend' },
                    { value: 'partner', label: 'Yes — by a partner' },
                    { value: 'community', label: 'Yes — by someone at church, work, or school' },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
            ],
            again: [N('The colours are still bright under the dust.')],
          },
          {
            id: 'cistern', x: 1100, art: 'cistern', kind: 'place', label: 'An empty cistern', verb: 'Look down', glowR: 70, required: true,
            steps: [
              N('A dry, dark pit in the ground. Your voice would echo down there — and up here, no one would answer.'),
              { page: 'anguish' },
              {
                choice: {
                  key: 'feel', prompt: 'How does that hurt sit with you now?', hint: 'Optional. Choose, write, or skip.',
                  allowText: true, placeholder: 'In your own words (stays on this device)',
                  options: [
                    { value: 'raw', label: 'Still raw' },
                    { value: 'angry', label: 'Angry' },
                    { value: 'buried', label: 'I’ve buried it' },
                    { value: 'scars', label: 'Mostly healed, but it left scars' },
                    { value: 'confused', label: 'Confused' },
                  ],
                },
              },
              N('What was done to Joseph was wrong. The story never says otherwise — and neither will we about what was done to you.'),
            ],
            again: [N('The cistern is still empty.')],
          },
          {
            id: 'page-dreams', x: 1650, art: 'page', kind: 'page', label: 'A page in the grass', verb: 'Read', required: true,
            steps: [{ page: 'dreams' }, N('In the distance, a caravan is heading south toward Egypt.')],
          },
        ],
      },
      {
        id: 'prison', title: 'The Prison Years', scene: 'prison', width: 2000,
        objective: 'Keep faith through the waiting.',
        caption: '[Dripping water; a door far off]',
        intro: [N('Stone walls, a barred window, a thin square of moonlight on the floor. Time moves slowly here.')],
        exitRequires: ['seen:iry', 'marked', 'seen:cup'],
        exitHint: 'Speak with Iry, mark the days on the wall, and look at the cup by the door.',
        hotspots: [
          {
            id: 'iry', x: 420, art: 'iry', kind: 'character', label: 'A fellow prisoner', verb: 'Talk', flip: true, required: true,
            steps: [
              IR('New here? I’m Iry. I scratch the days on the wall over there. It helps me remember time is still moving.'),
              {
                choice: {
                  key: 'iry-talk', speaker: 'iry', prompt: 'Iry leans back against the cold stone.', loop: true,
                  options: [
                    { value: 'why', label: 'Why are you here?', then: [IR('Someone with more power than me needed someone to blame. It happens. It still isn’t right.')] },
                    { value: 'joseph', label: 'Did you know the Hebrew, Joseph?', then: [IR('Everyone did. He kept working, kept helping, even in here. I never understood how he wasn’t bitter. Maybe he was, some nights.')] },
                    { value: 'done', label: 'Show me the wall.', end: true },
                  ],
                },
              },
            ],
            again: [IR('The wall is over there. Add a mark.')],
          },
          {
            id: 'tally', x: 950, art: 'tally', kind: 'object', label: 'Marks on the wall', verb: 'Add a mark', litFlag: 'marked', required: true,
            steps: [
              N('You scratch a mark beside the others. Then another. Then you stop counting.'),
              { page: 'egypt' },
              {
                choice: {
                  key: 'wait', noSkip: true, prompt: 'What do you tend to do with long waiting?',
                  options: [
                    { value: 'faithful', label: 'Keep doing the next good thing', then: [IR(waitReplies.faithful)] },
                    { value: 'bitter', label: 'Replay what happened, over and over', then: [IR(waitReplies.bitter)] },
                    { value: 'pray', label: 'Bring it to God — complaints and all', then: [IR(waitReplies.pray)] },
                    { value: 'numb', label: 'Try not to feel anything', then: [IR(waitReplies.numb)] },
                  ],
                },
              },
              { set: 'marked' },
              { light: 'Days counted' },
            ],
            again: [N('So many marks.')],
          },
          {
            id: 'cup', x: 1550, art: 'cup', kind: 'object', label: 'A cupbearer’s cup', verb: 'Look closer', required: true,
            steps: [
              N('A fine cup, left behind by someone who was released — and who promised to put in a good word.'),
              { page: 'forgot' },
              {
                choice: {
                  key: 'forgotten', prompt: 'Have you been forgotten by someone — or been afraid you would be?',
                  options: [
                    { value: 'yes', label: 'Yes', then: [N('That ache is real. Scripture doesn’t rush past it either: two full years.')] },
                    { value: 'afraid', label: 'I’m afraid of it', then: [N('Fear of being forgotten can be heavy to carry. God did not forget Joseph, even when people did.')] },
                    { value: 'no', label: 'Not really' },
                  ],
                },
              },
            ],
            again: [N('The cup gathers dust.')],
          },
        ],
      },
      {
        id: 'palace', title: 'The Hall of Grain', scene: 'palace', width: 2300,
        objective: 'Face the past in the hall of grain.',
        caption: '[Footsteps echo on stone; murmuring crowds]',
        intro: [N('Years later. A great hall in Egypt, full of grain stored up for a famine. Hungry travellers from Canaan have come to buy food.')],
        exitRequires: ['seen:grain', 'seen:brothers', 'farewell'],
        exitHint: 'Look at the grain stores, approach the travellers, and find Iry.',
        hotspots: [
          {
            id: 'grain', x: 450, art: 'grain', kind: 'object', label: 'The grain stores', verb: 'Look closer', required: true,
            steps: [N('Jars and sacks of grain, saved through seven good years. Enough to keep many people alive.'), { page: 'tested' }],
            again: [N('Enough grain for a whole region.')],
          },
          {
            id: 'brothers', x: 1150, art: 'brothers', kind: 'character', label: 'Travellers from Canaan', verb: 'Approach', glowR: 110, required: true,
            steps: [
              N('Three weathered men bow low, asking to buy grain. They don’t recognise the face in front of them.'),
              { page: 'revealed' },
              {
                choice: {
                  key: 'need', noSkip: true,
                  prompt: 'If the person who hurt you came back, what would you need?',
                  options: [
                    { value: 'safety', label: 'To know I’m safe', then: [N('Safety comes first. Forgiveness never requires putting yourself back in harm’s way.')] },
                    { value: 'change', label: 'To see real change', then: [N('Joseph looked for that too. He tested his brothers before he trusted them. That was wisdom, not bitterness.')] },
                    { value: 'truth', label: 'For them to admit what happened', then: [N('The brothers did, in the end: “We are verily guilty.” Truth-telling matters in repair.')] },
                    { value: 'distance', label: 'I’m not ready to see them', then: [N('That is allowed. Joseph kept his distance for a long time. Forgiveness and reconciliation are not the same thing.')] },
                    { value: 'unsure', label: 'I don’t know', then: [N('That’s honest. You don’t have to decide today.')] },
                  ],
                },
              },
            ],
            again: [N('The travellers wait, uneasy.')],
          },
          {
            id: 'iry-free', x: 1850, art: 'iry', kind: 'character', label: 'Iry', verb: 'Talk', flip: true, required: true,
            steps: [
              IR('They let me out too, in the end. I came to see the Hebrew’s hall.'),
              { page: 'meant' },
              { if: { answer: { key: 'wait', in: ['faithful'] } }, ...IR('You said you keep doing the next good thing. Joseph did that in the dark for years. It didn’t make the betrayal good — but it meant he was still himself when the doors opened.') },
              { if: { answer: { key: 'wait', in: ['bitter'] } }, ...IR('You said you replay it. Joseph named what his brothers did as evil — he didn’t pretend. But he wasn’t ruled by it forever. That took years, and tears. It may for you, too.') },
              { if: { answer: { key: 'wait', in: ['pray'] } }, ...IR('You said you bring it to God, complaints and all. Keep doing that. The God who was with Joseph in the prison can handle your honesty.') },
              { if: { answer: { key: 'wait', in: ['numb'] } }, ...IR('You said you try not to feel. Joseph wept — loudly, more than once. Feeling it was part of his healing, not a sign he’d failed.') },
              IR('Your story isn’t finished. Neither was his, in the pit. Go gently.'),
              { set: 'farewell' },
            ],
            again: [IR('Go gently, friend.')],
          },
        ],
      },
    ],
    reflect: {
      intro: 'Look back over the long road. There are no right answers.',
      questions: [
        {
          key: 'stood-out', prompt: 'What stood out to you?', multi: true,
          options: [
            { value: 'wrong', label: 'The betrayal named as wrong' },
            { value: 'with', label: '“The LORD was with Joseph” — in prison' },
            { value: 'forgot', label: 'Being forgotten for two full years' },
            { value: 'tested', label: 'Joseph testing before trusting' },
            { value: 'wept', label: 'Joseph weeping' },
          ],
        },
        {
          key: 'true-now', prompt: 'What feels most true for you right now?',
          options: [
            { value: 'name', label: 'I need to name what was done to me' },
            { value: 'wait', label: 'I need strength to keep waiting' },
            { value: 'boundary', label: 'I need a boundary, not reconciliation' },
            { value: 'hope', label: 'I need to believe my story isn’t over' },
            { value: 'unsure', label: 'I’m not sure yet' },
          ],
          allowText: true, placeholder: 'Anything else? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: 'Psalm 13 begins “How long, O LORD?” and ends with trust — without pretending the waiting was short. Breathe slowly, and bring your own “how long”.',
        breathIn: 'How long, O Lord…',
        breathOut: '…yet I will trust in your mercy.',
        cycles: 4,
      },
    },
    scripture: [
      {
        ref: 'Genesis 39:20–23 · 40:23', title: 'With him in the prison',
        quotes: [
          { ref: 'Genesis 39:21', text: 'But the LORD was with Joseph, and shewed him mercy, and gave him favour in the sight of the keeper of the prison.' },
          { ref: 'Genesis 40:23', text: 'Yet did not the chief butler remember Joseph, but forgat him.' },
        ],
        context: 'Falsely accused and imprisoned, Joseph keeps serving with integrity. The text insists God was with him there — and also records, plainly, that he was forgotten by the person who could have helped.',
        question: 'What would it look like to keep your integrity in this season of waiting?',
      },
      {
        ref: 'Genesis 45:1–5 · 50:19–21', title: 'Evil named, good brought through it',
        quotes: [
          { ref: 'Genesis 45:2', text: 'And he wept aloud: and the Egyptians and the house of Pharaoh heard.' },
          { ref: 'Genesis 50:20', text: 'But as for you, ye thought evil against me; but God meant it unto good, to bring to pass, as it is this day, to save much people alive.' },
        ],
        context: 'Joseph reconciles only after testing whether his brothers have changed, and with many tears. He calls their actions evil. His statement that God brought good through it is his own hard-won reflection on his own story — not a claim that betrayal is good, and not something to say lightly to another person in pain.',
        question: 'What do you need before trust could be rebuilt — and is rebuilding it safe or wise?',
      },
      {
        ref: 'Psalm 13:1–2, 5 · Romans 12:18', title: 'Honest waiting, wise peace',
        quotes: [
          { ref: 'Psalm 13:1', text: 'How long wilt thou forget me, O LORD? for ever? how long wilt thou hide thy face from me?' },
          { ref: 'Psalm 13:5', text: 'But I have trusted in thy mercy; my heart shall rejoice in thy salvation.' },
          { ref: 'Romans 12:18', text: 'If it be possible, as much as lieth in you, live peaceably with all men.' },
        ],
        context: 'Psalm 13 gives words for long waiting: complaint first, then trust. In Romans 12 Paul urges peace — but notice “if it be possible” and “as much as lieth in you”. Peace is not always possible, and it never requires accepting abuse.',
        question: 'What would your own “how long” prayer sound like?',
      },
    ],
    nextSteps: [
      { id: 'name', label: 'Name the hurt to someone safe', detail: 'Tell a trusted friend, pastor, or counsellor what happened, in plain words.', prompt: 'Who I could tell:', placeholder: 'e.g. My counsellor next session' },
      { id: 'lament', label: 'Write my own “How long?”', detail: 'Use Psalm 13 as a pattern: complaint, request, trust — even if the trust is small.', prompt: 'How long…', placeholder: 'e.g. How long will I feel this?' },
      { id: 'faithful', label: 'Choose one faithful thing to keep doing while I wait', detail: 'Something good that keeps you yourself: work done well, kindness, prayer, rest.', prompt: 'My faithful thing:', placeholder: 'e.g. Keep showing up to choir' },
      { id: 'boundary', label: 'Set or keep a healthy boundary', detail: 'Forgiveness doesn’t require access. A boundary can protect you while you heal.', prompt: 'A boundary I need:', placeholder: 'e.g. Only meet them with others present' },
      { id: 'support', label: 'Talk with a counsellor or pastor', detail: 'Especially where betrayal involved abuse, a trained counsellor can help. If you’re unsafe now, contact support services.', prompt: 'Who I could contact:', placeholder: 'e.g. Find a counsellor through my GP', showSupport: true },
      { id: 'later', label: 'Rest, and return to this later', detail: 'Healing takes time. Rest is part of it.' },
    ],
    closing: {
      heading: 'You walked The Long Road from the Pit',
      hope: 'Joseph’s brothers meant evil, and the story says so. Through long years of waiting, God was with him in the pit and the prison, and good grew in places no one expected. Your hurt matters, your waiting is seen, and your story is not finished. You don’t have to call what happened good — and you don’t have to walk the road alone.',
    },
  });
})();
