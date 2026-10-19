/* Wayfinder — Journey: "Breakfast on the Shore" (Luke 22; John 21).
 * Theme: failure, shame, restoration, renewed purpose.
 * Care points: restoration is real, and so are repair and consequences. Jesus is not voiced
 * as a game character; his words appear only as quoted Scripture. */
(() => {
  'use strict';
  const WF = window.Wayfinder;
  const N = (text) => ({ say: { speaker: 'narrator', text } });
  const YO = (text) => ({ say: { speaker: 'yona', text } });

  const PAGES = {
    warned: {
      title: 'I have prayed for thee',
      ref: 'Luke 22:31–34',
      kjv: 'But I have prayed for thee, that thy faith fail not: and when thou art converted, strengthen thy brethren.',
      kjvRef: 'Luke 22:32',
      summary: 'At the Last Supper, Jesus told Peter that he would deny him three times that night. Peter insisted he was ready to go to prison and death. Jesus had already prayed for him — and spoke of a future after the failure.',
      reflection: 'Before Peter failed, Jesus had already prayed for his restoration. The failure was not a surprise to him.',
    },
    denial: {
      title: 'I know him not',
      ref: 'Luke 22:54–60',
      kjv: 'And he denied him, saying, Woman, I know him not.',
      kjvRef: 'Luke 22:57',
      summary: 'After Jesus was arrested, Peter followed at a distance into the high priest’s courtyard and sat by a fire. A servant girl said he had been with Jesus. He denied it. Twice more, people recognised him; twice more he denied knowing Jesus.',
      reflection: 'Peter’s failure came from fear, in a cold courtyard, beside a warm fire. Most failures are not as dramatic as we imagine — just small, frightened words.',
    },
    looked: {
      title: 'The Lord turned, and looked',
      ref: 'Luke 22:60–62',
      kjv: 'And the Lord turned, and looked upon Peter. And Peter remembered the word of the Lord, how he had said unto him, Before the cock crow, thou shalt deny me thrice.',
      kjvRef: 'Luke 22:61',
      summary: 'As Peter spoke the third denial, the rooster crowed. Jesus turned and looked at him. Peter remembered — and went out and wept bitterly (22:62).',
      reflection: 'The story doesn’t describe the look as angry. But it was enough for Peter to see himself clearly. Real sorrow over what we have done is not the same as being destroyed by shame.',
    },
    fishing: {
      title: 'I go a fishing',
      ref: 'John 21:1–3',
      kjv: 'Simon Peter saith unto them, I go a fishing. They say unto him, We also go with thee. They went forth, and entered into a ship immediately; and that night they caught nothing.',
      kjvRef: 'John 21:3',
      summary: 'After the resurrection, Peter and several disciples were back in Galilee. Peter went back to what he knew: fishing. They worked all night and caught nothing.',
      reflection: 'After failure, it’s natural to go back to what feels safe and familiar. The story doesn’t scold Peter for it.',
    },
    rightside: {
      title: 'Cast the net on the right side',
      ref: 'John 21:4–8',
      kjv: 'And he said unto them, Cast the net on the right side of the ship, and ye shall find. They cast therefore, and now they were not able to draw it for the multitude of fishes.',
      kjvRef: 'John 21:6',
      summary: 'At dawn, a figure on the shore told them to cast on the right side. The net filled. John said, “It is the Lord.” Peter threw himself into the water and swam to shore; the others brought the boat and the net.',
      reflection: 'Different people came to Jesus in different ways that morning — some in a rush, some slowly with the work in their hands. All were welcomed.',
    },
    breakfast: {
      title: 'Come and dine',
      ref: 'John 21:9–14',
      kjv: 'As soon then as they were come to land, they saw a fire of coals there, and fish laid thereon, and bread.',
      kjvRef: 'John 21:9',
      summary: 'On the shore, Jesus had already made a fire of coals, with fish and bread on it. He said, “Come and dine” (21:12), and served them breakfast.',
      reflection: 'Peter had denied Jesus beside a fire of coals (John 18:18). Now Jesus meets him beside another one. Grace often returns us to the place of failure — not to shame us, but to make something new there.',
    },
    lovest: {
      title: 'Lovest thou me?',
      ref: 'John 21:15–17',
      kjv: 'He saith unto him the third time, Simon, son of Jonas, lovest thou me? Peter was grieved because he said unto him the third time, Lovest thou me? And he said unto him, Lord, thou knowest all things; thou knowest that I love thee. Jesus saith unto him, Feed my sheep.',
      kjvRef: 'John 21:17',
      summary: 'After breakfast, Jesus asked Peter three times — once for each denial — whether he loved him. Each time, Jesus gave him work to do: feed and tend his sheep. Then he said, “Follow me” (21:19).',
      reflection: 'The questions hurt (“Peter was grieved”). Restoration wasn’t pretending nothing happened. It faced it, three times, and then gave Peter a purpose again.',
    },
  };

  const approachReplies = {
    jump: 'You arrive dripping and out of breath, a little embarrassed. Nobody laughs. There’s already a fire.',
    boat: 'You drag the heavy net up the beach with the others — a hundred and fifty-three fish, the story says (John 21:11). There’s already a fire.',
    hesitate: 'You stay at the edge of the firelight, not sure you belong. Someone shifts over to make room for you.',
  };

  WF.registerJourney({
    id: 'peter',
    companion: 'peter',
    title: 'Breakfast on the Shore',
    tagline: 'For when you regret something you did, or carry shame',
    passage: 'Luke 22; John 21',
    length: 'About 9 minutes · no timer',
    pages: PAGES,
    speakers: { yona: { name: 'Yona', note: 'mends nets by the lake' } },
    prologue: {
      heading: 'Before you set out',
      text: 'You are not Peter. You’ll walk your own road beside his story — from a courtyard fire to a lakeshore at dawn — with a woman named Yona who mends fishing nets.\n\nThis journey is about failure and restoration. Restoration is real. So is repair: where our choices have hurt other people, grace often leads us toward making things right.',
    },
    areas: [
      {
        id: 'courtyard', title: 'The Courtyard Fire', scene: 'courtyard', width: 2000,
        objective: 'Warm yourself by the fire — and listen.',
        caption: '[A crackling fire; low voices in the dark]',
        intro: [N('Night in Jerusalem. A cold courtyard, a fire of coals, servants warming their hands. Something terrible is happening inside the house.')],
        exitRequires: ['seen:fire', 'seen:rooster', 'seen:yona'],
        exitHint: 'Sit by the fire, notice the rooster, and speak with the woman by the gate.',
        hotspots: [
          {
            id: 'fire', x: 520, art: 'fire', kind: 'place', label: 'The fire', verb: 'Sit down', glowR: 90, required: true,
            steps: [
              { page: 'warned' },
              N('A servant girl peers at a man across the fire. “This man was also with him.” He shakes his head.'),
              { page: 'denial' },
              {
                choice: {
                  key: 'fear', prompt: 'When have you kept quiet — or said something you regret — out of fear?', hint: 'Optional — choose one, or skip.',
                  options: [
                    { value: 'faith', label: 'About my faith' },
                    { value: 'friend', label: 'When a friend needed me' },
                    { value: 'wrong', label: 'When I saw something wrong' },
                    { value: 'myself', label: 'To protect myself' },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
            ],
            again: [N('The coals glow. People keep their eyes down.')],
          },
          {
            id: 'rooster', x: 1150, art: 'rooster', kind: 'object', label: 'A rooster on a post', verb: 'Listen', required: true,
            steps: [
              { caption: '[A rooster crows]' },
              { page: 'looked' },
              N('And Peter went out, and wept bitterly.'),
              {
                choice: {
                  key: 'regret', prompt: 'What do you regret?', hint: 'Optional. Choose, write, or skip.',
                  allowText: true, placeholder: 'In your own words (stays on this device)',
                  options: [
                    { value: 'said', label: 'Something I said' },
                    { value: 'hurt', label: 'Something I did that hurt someone' },
                    { value: 'failed', label: 'Something I failed to do' },
                    { value: 'become', label: 'Who I’ve been lately' },
                    { value: 'private', label: 'I’d rather not say' },
                  ],
                },
              },
              N('Sorrow over what we have done can be a gift. It means we see clearly. Shame says we are beyond repair. The rest of this story disagrees.'),
            ],
            again: [N('The rooster is quiet now. The sky is still dark.')],
          },
          {
            id: 'yona', x: 1700, art: 'yona', kind: 'character', label: 'A woman by the gate', verb: 'Talk', flip: true, required: true,
            steps: [
              YO('Come away from the fire. You look like someone who wants to disappear.'),
              {
                choice: {
                  key: 'yona-talk', speaker: 'yona', prompt: 'Yona pulls her shawl against the cold.', loop: true,
                  options: [
                    { value: 'where', label: 'Where are you going?', then: [YO('North, home to the lake. The fishermen have gone back there too. When men don’t know what to do, they go fishing.')] },
                    { value: 'fixed', label: 'Can something like this be fixed?', then: [YO('Not by pretending it didn’t happen. But I’ve seen worse mended than you’d think. Come and see.')] },
                    { value: 'done', label: 'I’ll come with you.', end: true },
                  ],
                },
              },
            ],
            again: [YO('The road north is long. Let’s go.')],
          },
        ],
      },
      {
        id: 'lake', title: 'The Empty Nets', scene: 'lake', width: 2100,
        objective: 'Go back to what you know — and listen for a voice from the shore.',
        caption: '[Water lapping against a hull]',
        intro: [N('The Sea of Galilee at night. Boats rock gently at the water’s edge. Fishing all night, and nothing to show for it.')],
        exitRequires: ['full', 'seen:shoreline'],
        exitHint: 'Cast the net from the boat, then decide how you’ll come to the shore.',
        hotspots: [
          { id: 'yona-lake', x: 60, follow: true, art: 'yona', kind: 'character', label: 'Yona', verb: 'Talk', steps: [YO('Every net I mend has been torn before. That’s what mending is for.')] },
          {
            id: 'boat', x: 650, art: 'boat', kind: 'object', label: 'A fishing boat', verb: 'Cast the net', litFlag: 'full', glowR: 120, glowY: 60, labelY: 180, required: true,
            steps: [
              { if: { notFlags: ['seen:boat'] }, page: 'fishing' },
              {
                if: { notFlags: ['full'] },
                choice: {
                  key: 'cast', noSkip: true, prompt: 'Grey light is creeping over the hills. Where will you cast the net?',
                  options: [
                    {
                      value: 'left', label: 'On the left, the way you always have',
                      then: [
                        N('Nothing. Again.'),
                        { caption: '[A voice calling across the water]' },
                        {
                          choice: {
                            prompt: 'A figure on the shore calls out: “Cast the net on the right side of the ship.”',
                            options: [{ value: 'right', label: 'Try the right side' }],
                          },
                        },
                      ],
                    },
                    { value: 'right', label: 'On the right, as the voice from the shore says', then: [{ caption: '[A voice calling across the water]' }] },
                  ],
                },
              },
              { if: { notFlags: ['full'] }, ...N('The net goes heavy — so heavy you can barely hold it. Silver fish, everywhere.') },
              { if: { notFlags: ['full'] }, page: 'rightside' },
              { set: 'full' },
              { light: 'A full net' },
            ],
            again: [N('The net is full to bursting.')],
          },
          {
            id: 'shoreline', x: 1500, art: 'ledge', kind: 'place', label: 'The water’s edge', verb: 'Come ashore', when: { flags: ['full'] }, glowR: 90, required: true,
            steps: [
              N('Someone in the boat says quietly, “It is the Lord.”'),
              {
                choice: {
                  key: 'approach', noSkip: true, prompt: 'How do you come to the shore?',
                  options: [
                    { value: 'jump', label: 'Jump in and swim — like Peter' },
                    { value: 'boat', label: 'Come slowly, with the boat and the nets' },
                    { value: 'hesitate', label: 'Hang back. I’m not sure I want to be seen' },
                  ],
                },
              },
              N('There’s no single right way to come back. The shore is the same either way.'),
            ],
            again: [N('Smoke rises from a fire on the beach.')],
          },
        ],
      },
      {
        id: 'shore', title: 'Breakfast on the Shore', scene: 'shore', width: 2100,
        objective: 'Come and have breakfast.',
        caption: '[Gentle waves; the crackle of a small fire]',
        intro: [N('Daybreak. Pebbles, gentle waves, and the smell of bread and fish cooking.')],
        exitRequires: ['seen:shorefire', 'seen:questions', 'farewell'],
        exitHint: 'Sit by the fire, read the three questions, and talk with Yona.',
        hotspots: [
          {
            id: 'shorefire', x: 600, art: 'shoreFire', kind: 'place', label: 'A fire of coals', verb: 'Sit down', glowR: 90, required: true,
            steps: [
              { if: { answer: { key: 'approach', in: ['jump'] } }, ...N(approachReplies.jump) },
              { if: { answer: { key: 'approach', in: ['boat'] } }, ...N(approachReplies.boat) },
              { if: { answer: { key: 'approach', in: ['hesitate'] } }, ...N(approachReplies.hesitate) },
              { page: 'breakfast' },
              N('A fire of coals — like the one in the courtyard. Some memories are met right where they happened.'),
              { light: 'Breakfast given' },
            ],
            again: [N('There’s more bread if you want it.')],
          },
          {
            id: 'questions', x: 1150, art: 'page', kind: 'page', label: 'A page by the fire', verb: 'Read', required: true,
            steps: [
              { page: 'lovest' },
              {
                choice: {
                  key: 'answer', prompt: 'If you were asked, “Do you love me?”, what might you say?', hint: 'Optional.',
                  options: [
                    { value: 'yes', label: 'Yes — you know I do' },
                    { value: 'failed', label: 'I want to, but I’ve failed' },
                    { value: 'unsure', label: 'I’m not sure anymore' },
                    { value: 'nowords', label: 'I don’t know what to say' },
                  ],
                },
              },
              N('Peter’s answer wasn’t a speech. “Thou knowest all things.” Jesus didn’t ask him to prove himself first. He gave him work: “Feed my sheep.”'),
            ],
          },
          {
            id: 'yona-shore', x: 1700, art: 'yona', kind: 'character', label: 'Yona', verb: 'Talk', flip: true, required: true,
            steps: [
              YO('Forgiven by Jesus — and still with things to put right with people. Both can be true at once. Peter’s restoration happened in front of the others, and he spent the rest of his life serving the people he’d let down.'),
              {
                choice: {
                  key: 'repair', prompt: '“Is there something to mend?” Yona asks.', hint: 'Optional.',
                  options: [
                    { value: 'apologise', label: 'I need to apologise to someone', then: [YO('Then keep it simple and honest. No excuses, no demands. Let them respond in their own time.')] },
                    { value: 'restore', label: 'I need to make something right', then: [YO('Good. Repair might cost you something. That’s part of what makes it real.')] },
                    { value: 'advice', label: 'I need wise help to repair it safely', then: [YO('That’s wise. Some situations need a pastor, a counsellor, or other help — especially if contact could hurt someone more.')] },
                    { value: 'none', label: 'There’s no one I need to repair with', then: [YO('Then receive the breakfast. Sometimes the person we most need to stop punishing is ourselves.')] },
                    { value: 'notready', label: 'I’m not ready yet', then: [YO('That’s honest. Keep the question near you.')] },
                  ],
                },
              },
              YO('Follow on from here. You’re not done — but you’re not finished, either.'),
              { set: 'farewell' },
            ],
            again: [YO('Go gently. Mend what you can.')],
          },
        ],
      },
    ],
    reflect: {
      intro: 'Look back from the courtyard to the shore.',
      questions: [
        {
          key: 'stood-out', prompt: 'What stood out to you?', multi: true,
          options: [
            { value: 'prayed', label: 'Jesus praying for Peter before he failed' },
            { value: 'wept', label: 'Peter weeping bitterly' },
            { value: 'familiar', label: 'Going back to what felt familiar' },
            { value: 'fire', label: 'A second fire of coals' },
            { value: 'purpose', label: '“Feed my sheep” — a new purpose' },
          ],
        },
        {
          key: 'true-now', prompt: 'What feels most true for you right now?',
          options: [
            { value: 'confess', label: 'I need to be honest with God about what I did' },
            { value: 'repair', label: 'I need to make something right with someone' },
            { value: 'shame', label: 'I need to stop living under shame' },
            { value: 'purpose', label: 'I need to believe I can still be useful' },
            { value: 'unsure', label: 'I’m not sure yet' },
          ],
          allowText: true, placeholder: 'Anything else? (optional, stays on this device)',
        },
      ],
      stillness: {
        heading: 'A moment of stillness',
        text: '1 John 1:9 says that if we confess our sins, God is faithful and just to forgive. Breathe slowly. You can bring the truth without hiding.',
        breathIn: 'Lord, you know all things…',
        breathOut: '…you know that I love you.',
        cycles: 4,
      },
    },
    scripture: [
      {
        ref: 'Luke 22:31–34, 54–62', title: 'Failure, foreseen and faced',
        quotes: [
          { ref: 'Luke 22:32', text: 'But I have prayed for thee, that thy faith fail not: and when thou art converted, strengthen thy brethren.' },
          { ref: 'Luke 22:62', text: 'And Peter went out, and wept bitterly.' },
        ],
        context: 'Jesus foresees Peter’s denial and prays for him before it happens, already speaking of a time when Peter will strengthen others. Peter’s grief afterwards is real and bitter.',
        question: 'What would it mean that Jesus is not surprised by your failure — and still prays for you?',
      },
      {
        ref: 'John 21:9–19', title: 'Restored, and sent',
        quotes: [
          { ref: 'John 21:9', text: 'As soon then as they were come to land, they saw a fire of coals there, and fish laid thereon, and bread.' },
          { ref: 'John 21:17', text: 'He saith unto him the third time, Simon, son of Jonas, lovest thou me? Peter was grieved because he said unto him the third time, Lovest thou me? And he said unto him, Lord, thou knowest all things; thou knowest that I love thee. Jesus saith unto him, Feed my sheep.' },
        ],
        context: 'The risen Jesus feeds his friends first, then speaks to Peter beside a fire like the one where he failed. Three questions answer three denials. Peter is grieved — restoration faces the past — and then he is given work and a call to follow.',
        question: 'Who are the “sheep” you might care for, even as you are being restored?',
      },
      {
        ref: '1 John 1:9 · Matthew 5:23–24', title: 'Confession and repair',
        quotes: [
          { ref: '1 John 1:9', text: 'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.' },
          { ref: 'Matthew 5:23–24', text: 'Therefore if thou bring thy gift to the altar, and there rememberest that thy brother hath ought against thee; Leave there thy gift before the altar, and go thy way; first be reconciled to thy brother, and then come and offer thy gift.' },
        ],
        context: 'John assures believers that confession meets God’s faithful forgiveness. In the Sermon on the Mount, Jesus teaches that worship and repairing what we have broken with others belong together.',
        question: 'Is there a relationship where a careful, humble step of repair would honour God?',
      },
    ],
    nextSteps: [
      { id: 'confess', label: 'Confess honestly to God', detail: 'A prayer you can use or change.', prayer: 'Lord Jesus, you know all things. You know what I did, and you know I wish I hadn’t. I won’t hide it from you. Thank you that you prayed for Peter before he failed, met him with breakfast, and gave him work again. Forgive me. Free me from shame that says I’m finished. Show me what I need to put right, and give me courage and humility to do it. Amen.' },
      { id: 'repair', label: 'Take a step of repair', detail: 'Apologise without excuses, make restitution, or change what caused harm. Respect the other person’s response and boundaries.', prompt: 'My repair step:', placeholder: 'e.g. Write an honest apology to J.' },
      { id: 'tell', label: 'Tell a trusted person what I’m carrying', detail: 'Shame grows in secret. Telling a wise friend or pastor can lighten it.', prompt: 'Who I could tell:', placeholder: 'e.g. My small-group leader' },
      { id: 'serve', label: 'Serve someone this week', detail: '“Feed my sheep.” Restoration often shows itself in quiet care for others.', prompt: 'How I could serve:', placeholder: 'e.g. Bring a meal to my neighbour' },
      { id: 'support', label: 'Talk with a pastor or counsellor', detail: 'If shame or guilt is overwhelming, constant, or affecting your health, please talk with someone trained to help.', prompt: 'Who I could contact:', placeholder: 'e.g. Book time with our pastor', showSupport: true },
      { id: 'later', label: 'Rest, and return to this later', detail: 'That’s a real choice, not avoidance.' },
    ],
    closing: {
      heading: 'You walked Breakfast on the Shore',
      hope: 'Peter’s failure was real, and so was his grief. Jesus met him with breakfast, faced the past with him three times, and gave him work to do. Your regret doesn’t have to be the last word. Grace may lead you toward honest repair — and it also says you are not finished.',
    },
  });
})();
