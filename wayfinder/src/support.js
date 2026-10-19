/* Wayfinder — safety and support content.
 * Reviewed, fixed text. No generated responses are used for crisis support.
 * Check these numbers periodically; services change. Last reviewed: October 2026. */
(() => {
  'use strict';
  const WF = window.Wayfinder;

  WF.support = {
    disclaimer:
      'Wayfinder is a tool for Christian reflection and formation. It is not God’s voice, and it is not therapy, medical care, or crisis care. It can’t replace a pastor, counsellor, doctor, or the people who love you.',

    privacy:
      'Wayfinder has no accounts, chat, ads, or purchases, and sends nothing you write to any server. Progress and any reflections you choose to save stay in this browser on this device, and you can delete them at any time in Settings.',

    emergency:
      'If you or someone else is in immediate danger, contact your local emergency number now — for example 911 (US and Canada), 999 (UK), 112 (EU and many other countries) or 000 (Australia).',

    lines: [
      { region: 'United States', text: '988 Suicide & Crisis Lifeline — call or text 988', href: 'tel:988' },
      { region: 'Canada', text: '9-8-8 Suicide Crisis Helpline — call or text 988', href: 'tel:988' },
      { region: 'UK & Ireland', text: 'Samaritans — call 116 123, free, any time', href: 'tel:116123' },
      { region: 'Australia', text: 'Lifeline — call 13 11 14', href: 'tel:131114' },
      { region: 'Anywhere else', text: 'Find a free local helpline at findahelpline.com', href: 'https://findahelpline.com' },
    ],

    trusted:
      'Reach out to someone you trust — a friend, family member, or pastor — and tell them plainly: “I’m not okay, and I need you with me right now.” You don’t have to find perfect words.',

    prayer: 'You don’t need the right words to pray. “Lord, help me” is enough. You are not a burden for asking for help.',

    // Simple, local pattern check on free text. Nothing is sent anywhere.
    // It errs on the side of gently offering support; the player can always continue.
    patterns: [
      /\bkill(ing)?\s+(my\s*self|myself)\b/i,
      /\bsuicid/i,
      /\bend(ing)?\s+(my\s+life|it\s+all|everything)\b/i,
      /\b(want|wanted|wanting)\s+to\s+die\b/i,
      /\bwish\s+i\s+(was|were)\s+dead\b/i,
      /\b(hurt|harm|cut)(ing)?\s+(my\s*self|myself)\b/i,
      /\bself[\s-]?harm/i,
      /\bno\s+reason\s+to\s+live\b/i,
      /\bbetter\s+off\s+(dead|without\s+me)\b/i,
      /\b(hurt|kill|harm)\s+(him|her|them|someone|somebody|people|others)\b/i,
      /\bnot\s+safe\b/i,
      /\boverdos/i,
    ],
    detect(text) {
      if (!text) return false;
      return WF.support.patterns.some((re) => re.test(text));
    },
  };
})();
