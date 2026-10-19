/* Wayfinder — check-in options and biblical story companions.
 * Reviewed, structured content. Each companion links to its playable journey (`journeyId`)
 * and also offers a short reading guide for reflecting on the passage directly. */
(() => {
  'use strict';
  const WF = window.Wayfinder;

  WF.companions = {
    elijah: {
      name: 'Elijah',
      title: 'Elijah in the wilderness',
      place: 'The Juniper Wilderness',
      ref: '1 Kings 19',
      themes: 'Exhaustion, discouragement, and receiving care',
      journeyId: 'elijah',
      map: { x: 300, y: 470 },
      summary:
        'Elijah was a prophet in Israel in the 9th century BC, in the reign of King Ahab. Just before this chapter, on Mount Carmel, he had stood publicly against the worship of Baal (1 Kings 18). Then Queen Jezebel threatened his life. Afraid, he fled south — first to Beersheba, then alone into the wilderness.',
      context:
        'This is not the story of a weak man, or of someone who simply needed more faith. It is an honest picture of someone who had given a great deal, was in real danger, and reached the end of himself — and of how God met him there: with sleep, food, water, presence, a truer view of things, a companion, and a next step.',
      questions: [
        'Before anything else, Elijah was given sleep and food. What does your body need from you this week?',
        'God asked Elijah, “What are you doing here?” How would you honestly answer?',
        'Elijah thought he was completely alone. Who might God be placing around you?',
      ],
    },
    gideon: {
      name: 'Gideon',
      title: 'Gideon at the winepress',
      place: 'The Winepress Valley',
      ref: 'Judges 6–7',
      themes: 'Uncertainty, fear, and discernment',
      journeyId: 'gideon',
      map: { x: 395, y: 205 },
      summary:
        'Israel was being raided by Midian. Gideon was threshing wheat in a winepress — out of sight — when the angel of the LORD greeted him as a “mighty man of valour”. Gideon answered with honest questions and fears, and asked for signs, including the fleece.',
      context:
        'Gideon’s fleece is often treated as a method for making decisions. In the story it reads more like the request of a frightened man whom God patiently met. This journey explores discernment through Scripture, prayer, and wise counsel — not through signs that promise certainty.',
      questions: [
        'Gideon is hiding when he is called. Where might fear be shaping your choices right now?',
        'God doesn’t mock Gideon’s questions. What honest question would you like to bring to God?',
        'Who are the wise, steady people you could ask to help you discern a next step?',
      ],
    },
    naomi: {
      name: 'Naomi',
      title: 'Naomi on the road home',
      place: 'The Road from Moab',
      ref: 'Ruth 1–4',
      themes: 'Grief, loss, and companionship',
      journeyId: 'naomi',
      map: { x: 565, y: 335 },
      summary:
        'After the deaths of her husband and both sons in Moab, Naomi returned to Bethlehem. She told the women there, “call me Mara” — bitter (Ruth 1:20). Her daughter-in-law Ruth refused to leave her, and the book slowly shows God’s kindness through ordinary, faithful people.',
      context:
        'The book of Ruth does not hurry Naomi out of grief or correct her for it. Her bitterness is spoken honestly, and companionship comes before understanding. This journey will make room for lament and slow hope.',
      questions: [
        'Naomi names her grief bluntly. What would it be like to tell God honestly how this loss feels?',
        'Ruth stays. Who has stayed with you — or who could you let come closer?',
        'What is one small kindness you could receive this week without having to repay it?',
      ],
    },
    hagar: {
      name: 'Hagar',
      title: 'Hagar at the spring',
      place: 'The Spring in the Desert',
      ref: 'Genesis 16; 21:8–21',
      themes: 'Feeling unseen, abandoned, or vulnerable',
      journeyId: 'hagar',
      map: { x: 175, y: 425 },
      summary:
        'Hagar was an Egyptian servant in Abram and Sarai’s household — used, then mistreated — and she fled into the wilderness. By a spring, the angel of the LORD found her and spoke with her. She gave God a name: “Thou God seest me” (Genesis 16:13).',
      context:
        'Hagar’s story involves real injustice, and Scripture lets her be the one who names God. This journey will treat that with care and never suggest that being mistreated is something to simply accept.',
      questions: [
        'Hagar is the only person in Scripture who gives God a name. What does “the God who sees me” mean to you today?',
        'Where do you feel overlooked? Is there someone safe you could tell?',
        'If you are being harmed by someone, who could help you get safe and supported?',
      ],
    },
    joseph: {
      name: 'Joseph',
      title: 'Joseph and the long wait',
      place: 'The Cistern & the Long Wait',
      ref: 'Genesis 37–50',
      themes: 'Betrayal, waiting, integrity, and hope',
      journeyId: 'joseph',
      map: { x: 120, y: 585 },
      summary:
        'Joseph was sold by his brothers, falsely accused, and forgotten in prison for years. Much later, facing those same brothers, he said, “ye thought evil against me; but God meant it unto good” (Genesis 50:20).',
      context:
        'Joseph’s words came after long years and real anguish — he wept repeatedly (Genesis 42–45). They are not a quick explanation for anyone else’s pain. This journey will hold waiting, honesty about harm, and hope together.',
      questions: [
        'Where have you been hurt by someone you trusted? What would it mean to name that honestly before God?',
        'Joseph kept his integrity in hidden places. What is one faithful thing you can keep doing while you wait?',
        'Reconciliation in Joseph’s story is slow and careful. What would wise boundaries look like for you?',
      ],
    },
    peter: {
      name: 'Peter',
      title: 'Peter on the shore',
      place: 'The Shore at Dawn',
      ref: 'Luke 22:54–62; John 21:1–19',
      themes: 'Failure, shame, restoration, and renewed purpose',
      journeyId: 'peter',
      map: { x: 455, y: 112 },
      summary:
        'On the night Jesus was arrested, Peter denied knowing him three times, then went out and wept bitterly. After the resurrection, Jesus met Peter on the shore with a charcoal fire and breakfast, asked him three times, “lovest thou me?”, and gave him work to do: “Feed my sheep.”',
      context:
        'Jesus doesn’t pretend the denial didn’t happen — and he doesn’t leave Peter in it. This journey will explore honest confession, grace, and repair.',
      questions: [
        'Peter wept. What would it be like to be honest with Jesus about what you regret?',
        'Jesus meets Peter with breakfast before conversation. What might grace look like for you this week?',
        'Is there someone you have hurt, where a careful step of repair would be wise?',
      ],
    },
    david: {
      name: 'David',
      title: 'David and Nathan',
      place: 'The Palace Rooftop',
      ref: '2 Samuel 11–12; Psalm 51',
      themes: 'Desire, harm, accountability, repentance, and consequences',
      journeyId: 'david',
      map: { x: 420, y: 330 },
      summary:
        'King David took Bathsheba and then arranged the death of her husband, Uriah. The prophet Nathan confronted him. David confessed, “I have sinned against the LORD” (2 Samuel 12:13). He was forgiven, and real consequences still followed. Psalm 51 is associated with this repentance.',
      context:
        'Bathsheba and Uriah were real people who were wronged by a powerful man — not background figures in David’s growth. This journey will take harm seriously, explore accountability, and never suggest that repentance erases the need for repair or protection of others.',
      questions: [
        'Nathan told David the truth. Who in your life is allowed to tell you the truth?',
        'Repentance in Psalm 51 is honest and specific. What would honesty before God look like for you?',
        'Has someone been harmed by your choices? What would taking responsibility involve — with wise help?',
      ],
    },
    samson: {
      name: 'Samson',
      title: 'Samson in the valley of Sorek',
      place: 'The Valley of Sorek',
      ref: 'Judges 13–16',
      themes: 'Desire, boundaries, strength, and the cost of compromised choices',
      journeyId: 'samson',
      map: { x: 300, y: 330 },
      summary:
        'Samson was set apart from birth and given great strength, yet he repeatedly crossed the boundaries of his calling, and his choices cost him dearly. At the end, captive and blinded, he prayed, “O Lord GOD, remember me” (Judges 16:28).',
      context:
        'Samson’s story is not a tidy moral lesson. It shows gifts and impulses tangled together, patterns repeated, and God still hearing a desperate prayer. This journey will explore boundaries and support — and point clearly to help for habits and dependencies.',
      questions: [
        'Samson’s pattern repeated many times. What pattern in your life would you like support with?',
        'What boundary would protect what matters most to you?',
        'Who could you be honest with about this — a trusted friend, a pastor, a support group, or a professional?',
      ],
    },
  };

  WF.checkin = {
    question: 'What feels closest to what you’re carrying today?',
    note: 'Choose whatever fits best — it doesn’t have to describe everything. You can skip this.',
    options: [
      {
        id: 'overwhelmed',
        label: 'I feel overwhelmed or exhausted',
        companions: ['elijah'],
        followup: {
          question: 'How long has it felt like this?',
          options: [
            { value: 'days', label: 'A few days' },
            { value: 'weeks', label: 'A few weeks' },
            { value: 'months', label: 'Months, or longer' },
            { value: 'unsure', label: 'I’m not sure' },
          ],
          notes: {
            months: 'Thank you for saying so. When heaviness lasts a long time, it’s wise to talk with a doctor or counsellor as well as people you trust. Exhaustion can have physical causes too. Seeking that help is a faithful step, not a lack of faith.',
          },
        },
        care: 'If tiredness has started to affect your sleep, eating, work, or safety, please also talk with a doctor, counsellor, or pastor. Wayfinder can walk alongside you; it can’t replace them.',
      },
      {
        id: 'uncertain',
        label: 'I feel uncertain or stuck',
        companions: ['gideon', 'elijah'],
        followup: {
          question: 'What kind of uncertainty is it?',
          options: [
            { value: 'decision', label: 'A decision in front of me' },
            { value: 'direction', label: 'Where my life is heading' },
            { value: 'faith', label: 'Questions about what I believe' },
            { value: 'unsure', label: 'Hard to say' },
          ],
        },
      },
      {
        id: 'grief',
        label: 'I am carrying grief or loss',
        companions: ['naomi', 'elijah'],
        followup: {
          question: 'Would you like to say what kind of loss?',
          options: [
            { value: 'death', label: 'Someone who died' },
            { value: 'relationship', label: 'A relationship that ended' },
            { value: 'hope', label: 'A hope or a dream' },
            { value: 'health', label: 'Health or ability' },
            { value: 'other', label: 'Something else' },
          ],
        },
        care: 'Grief has no timetable. If it feels unbearable or isn’t easing, a grief counsellor, pastor, or doctor can help carry it with you.',
      },
      {
        id: 'relationship',
        label: 'I am struggling with a relationship',
        companions: ['joseph', 'hagar'],
        followup: {
          question: 'Which relationship is it?',
          options: [
            { value: 'family', label: 'Family' },
            { value: 'friend', label: 'A friend' },
            { value: 'partner', label: 'Partner or marriage' },
            { value: 'church', label: 'Church' },
            { value: 'work', label: 'Work or school' },
          ],
        },
        care: 'If someone is hurting, threatening, or controlling you, your safety comes first. Please reach out to a trusted person, a local support service, or emergency services.',
      },
      {
        id: 'regret',
        label: 'I regret something I did',
        companions: ['peter', 'david'],
        followup: {
          question: 'If you’d like, what is the regret closest to?',
          options: [
            { value: 'said', label: 'Something I said' },
            { value: 'hurt', label: 'Something that hurt someone' },
            { value: 'failed', label: 'Something I failed to do' },
            { value: 'pattern', label: 'Something I keep doing' },
          ],
        },
        care: 'If your choices have harmed someone, a pastor or counsellor can help you take wise, safe steps of repair. Some situations also need professional or legal help.',
      },
      {
        id: 'lonely',
        label: 'I feel lonely or overlooked',
        companions: ['hagar', 'elijah'],
        followup: {
          question: 'What does it feel like most?',
          options: [
            { value: 'unseen', label: 'No one really sees me' },
            { value: 'alone', label: 'I’m physically on my own a lot' },
            { value: 'crowd', label: 'Alone even with people around' },
            { value: 'outside', label: 'Left out — including at church' },
          ],
        },
      },
      {
        id: 'waiting',
        label: 'I am waiting for change',
        companions: ['joseph', 'elijah'],
        followup: {
          question: 'What are you waiting for?',
          options: [
            { value: 'healing', label: 'Healing' },
            { value: 'relationship', label: 'A relationship' },
            { value: 'calling', label: 'Work or calling' },
            { value: 'answer', label: 'An answer to prayer' },
          ],
        },
      },
      {
        id: 'habit',
        label: 'I am wrestling with a habit or dependency',
        companions: ['samson', 'david'],
        followup: {
          question: 'You don’t need to say more. If you’d like, which is closest?',
          options: [
            { value: 'private', label: 'I’d rather keep it private' },
            { value: 'coping', label: 'Something I use to cope' },
            { value: 'substance', label: 'Alcohol, drugs, or other substances' },
            { value: 'screens', label: 'Screens, gambling, or spending' },
            { value: 'sexual', label: 'A sexual or relational pattern' },
          ],
        },
        care: 'Habits and dependencies are rarely overcome alone. Specialist services, support groups, and doctors can make a real difference — especially where substances, gambling, or safety are involved. Reaching out is a strong step, not a weak one.',
      },
      {
        id: 'explore',
        label: 'I want to explore without choosing a topic',
        companions: [],
      },
    ],
  };
})();
