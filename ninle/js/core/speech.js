/* Optional "Read to me" using the device's built-in voice. Works offline on most devices. */
(function (N) {
  'use strict';
  const ok = 'speechSynthesis' in window;
  let voice = null;
  function pickVoice() {
    if (!ok) return;
    // Only on-device voices, so nothing a child hears is ever sent online.
    const vs = speechSynthesis.getVoices().filter(v => /^en/i.test(v.lang) && v.localService);
    voice = vs.find(v => /samantha|karen|serena|moira|female/i.test(v.name)) || vs[0] || null;
  }
  if (ok) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  N.speech = {
    get available() { return ok && (voice || speechSynthesis.getVoices().length === 0); },
    say(text) {
      if (!ok || !text) return;
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(N.util.stripEmoji(text));
        if (!voice) return; // no on-device English voice available
        u.voice = voice;
        u.rate = 0.92; u.pitch = 1.1;
        speechSynthesis.speak(u);
      } catch (e) { /* ignore */ }
    },
    stop() { if (ok) try { speechSynthesis.cancel(); } catch (e) { } }
  };
})(window.Ninle);
