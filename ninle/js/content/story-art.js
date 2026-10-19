/* Simple, original SVG pictures for the storybook reflection pages. */
(function (N) {
  'use strict';
  const OL = '#3b2a3f';
  const sky = (a, b) => `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#fff6b0" stop-opacity=".95"/><stop offset="1" stop-color="#ffd54a" stop-opacity="0"/></radialGradient></defs>
    <rect width="320" height="160" fill="url(#sk)"/>`;
  const hills = (g1, g2) => `<path d="M0 112 Q70 80 150 104 T320 92 V160 H0Z" fill="${g1}" stroke="${OL}" stroke-width="2.5"/>
    <path d="M0 136 Q110 112 210 132 T320 124 V160 H0Z" fill="${g2}" stroke="${OL}" stroke-width="2.5"/>`;
  const sun = (x, y) => `<circle cx="${x}" cy="${y}" r="26" fill="url(#glow)"/><circle cx="${x}" cy="${y}" r="15" fill="#ffd84d" stroke="${OL}" stroke-width="2.5"/>`;
  function person(x, y, robe, skin, cloth, s, extra) {
    return `<g transform="translate(${x} ${y}) scale(${s || 1})">
      <path d="M-12 0 Q-14 -30 0 -34 Q14 -30 12 0Z" fill="${robe}" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>
      <path d="M-4 -30 L-2 -2 M4 -30 L2 -2" stroke="rgba(255,255,255,.35)" stroke-width="2"/>
      <circle cx="0" cy="-42" r="9" fill="${skin}" stroke="${OL}" stroke-width="2.5"/>
      <path d="M-11 -42 Q0 -60 11 -42 L11 -34 Q8 -44 0 -46 Q-8 -44 -11 -34Z" fill="${cloth}" stroke="${OL}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="-3" cy="-41" r="1.3" fill="${OL}"/><circle cx="3" cy="-41" r="1.3" fill="${OL}"/>
      ${extra || ''}</g>`;
  }
  const donkey = (x, y) => `<g transform="translate(${x} ${y})" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round">
      <path d="M-22 0 V-18 M-12 0 V-18 M10 0 V-18 M20 0 V-18" stroke-width="4"/>
      <ellipse cx="0" cy="-24" rx="26" ry="13" fill="#a7a3b8"/>
      <rect x="-16" y="-38" width="22" height="10" rx="3" fill="#e0675a"/>
      <path d="M20 -30 L30 -46 L40 -40 L30 -24Z" fill="#a7a3b8"/>
      <path d="M30 -46 L28 -58 L34 -48 M35 -44 L38 -56 L39 -43" fill="#a7a3b8"/>
      <circle cx="34" cy="-40" r="1.5" fill="${OL}" stroke="none"/></g>`;
  const heart = (x, y, s, fill) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 8 C-14 -2 -10 -14 0 -7 C10 -14 14 -2 0 8Z" fill="${fill || '#ff6b8a'}" stroke="${OL}" stroke-width="${2.2 / s}" stroke-linejoin="round"/>`;
  const lantern = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle r="22" fill="url(#glow)"/>
      <rect x="-9" y="-15" width="18" height="4" rx="2" fill="#5a4630" stroke="${OL}" stroke-width="2"/>
      <rect x="-7" y="-11" width="14" height="18" rx="4" fill="#ffe46b" stroke="${OL}" stroke-width="2"/>
      <rect x="-9" y="7" width="18" height="4" rx="2" fill="#5a4630" stroke="${OL}" stroke-width="2"/></g>`;
  const svg = body => `<svg viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg" role="img">${body}</svg>`;

  N.storyArt = {
    scroll: svg(sky('#bfe6ff', '#fff3d6') + sun(266, 36) + hills('#9fd772', '#7cc35a') + `
      <g transform="translate(160 84)">
        <rect x="-62" y="-36" width="124" height="66" rx="8" fill="#fff4d6" stroke="${OL}" stroke-width="3"/>
        <rect x="-72" y="-40" width="14" height="74" rx="7" fill="#d9a066" stroke="${OL}" stroke-width="3"/>
        <rect x="58" y="-40" width="14" height="74" rx="7" fill="#d9a066" stroke="${OL}" stroke-width="3"/>
        <path d="M-44 -18 H-6 M-44 -6 H-14 M-44 6 H-10 M-44 18 H-20" stroke="#c9a46a" stroke-width="3" stroke-linecap="round"/>
        ${heart(24, 0, 2.2)}</g>
      <g transform="translate(70 34)"><rect x="-38" y="-16" width="76" height="30" rx="14" fill="#fff" stroke="${OL}" stroke-width="2.5"/>
        <path d="M-6 14 L-14 26 L4 14" fill="#fff" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>
        <text x="0" y="6" text-anchor="middle" font-size="20" font-weight="900" fill="${OL}" font-family="sans-serif">?</text></g>`),

    road: svg(sky('#ffd9a8', '#fff3d6') + sun(60, 40) + hills('#c9d98a', '#a9c46e') + `
      <path d="M-10 160 Q120 120 160 128 T330 100" stroke="#f3dcaa" stroke-width="26" fill="none"/>
      <path d="M-10 160 Q120 120 160 128 T330 100" stroke="#d9b678" stroke-width="2" fill="none" stroke-dasharray="4 10"/>
      <g transform="translate(92 140) rotate(-80)">${person(0, 0, '#8fa6c8', '#c68a5e', '#e6e1d4', 0.9)}</g>
      ${person(250, 108, '#9b6bff', '#e8b48f', '#ffd36b', 0.7)}
      ${person(286, 100, '#4f8cff', '#8d5a3b', '#ffffff', 0.65)}
      <path d="M226 86 h-14 M228 94 h-18 M266 80 h-12 M268 88 h-16" stroke="${OL}" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>`),

    helper: svg(sky('#bfe6ff', '#fff3d6') + sun(276, 34) + hills('#9fd772', '#7cc35a') + `
      <g transform="translate(250 82)"><rect x="-22" y="-20" width="44" height="26" fill="#fff1d6" stroke="${OL}" stroke-width="2.5"/>
        <path d="M-28 -18 L0 -38 L28 -18Z" fill="#e0675a" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>
        <rect x="-6" y="-8" width="12" height="14" rx="5" fill="#7cc35a" stroke="${OL}" stroke-width="2"/></g>
      ${donkey(74, 138)}
      <g transform="translate(156 146) rotate(-82)">${person(0, 0, '#8fa6c8', '#c68a5e', '#e6e1d4', 0.85, '<rect x="-10" y="-26" width="20" height="6" rx="3" fill="#fff" stroke="#3b2a3f" stroke-width="2"/>')}</g>
      ${person(184, 140, '#2fbf8f', '#a86f47', '#ffcf4a', 0.95)}
      ${heart(170, 78, 1.4)}`),

    hearts: svg(sky('#ffe0ec', '#fff3d6') + hills('#9fd772', '#7cc35a') + `
      ${person(130, 140, '#ff7a59', '#8d5a3b', '#fff3c4', 0.95)}
      ${person(190, 140, '#4f8cff', '#f3c9a5', '#c9f0ff', 0.95)}
      <path d="M142 112 Q160 120 178 112" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${heart(160, 50, 2.4)}${heart(96, 66, 1.3, '#ffb347')}${heart(226, 62, 1.4, '#c59bff')}${heart(60, 40, 1, '#7bc86c')}${heart(262, 34, 1.1, '#4fb8e8')}`),

    lanterns: svg(sky('#5b4fa0', '#f7b58a') + `
      <path d="M0 116 Q70 90 150 110 T320 98 V160 H0Z" fill="#6cae6a" stroke="${OL}" stroke-width="2.5"/>
      <path d="M20 160 Q100 120 160 126 T300 96" stroke="#f3dcaa" stroke-width="18" fill="none"/>
      ${lantern(56, 128, 0.9)}${lantern(118, 112, 0.85)}${lantern(176, 112, 0.8)}${lantern(232, 104, 0.75)}${lantern(286, 92, 0.7)}
      <g transform="translate(160 52)"><circle r="26" fill="url(#glow)"/><ellipse cx="-6" cy="-8" rx="8" ry="5" fill="#e1f4ff" stroke="${OL}" stroke-width="2"/>
        <ellipse cx="6" cy="-9" rx="8" ry="5" fill="#e1f4ff" stroke="${OL}" stroke-width="2"/>
        <ellipse cx="-5" cy="4" rx="8" ry="7" fill="#ffe66b" stroke="${OL}" stroke-width="2"/><circle cx="4" cy="-1" r="8" fill="#7a5cb8" stroke="${OL}" stroke-width="2"/>
        <circle cx="2" cy="-2" r="1.6" fill="#fff"/><circle cx="7" cy="-2" r="1.6" fill="#fff"/></g>`),

    heart: svg(sky('#ffe9b8', '#fff8e8') + `
      <g transform="translate(160 84)"><circle r="70" fill="url(#glow)"/>
        <g stroke="#ffcf4a" stroke-width="5" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${Math.cos(a) * 48} ${Math.sin(a) * 48} L${Math.cos(a) * 64} ${Math.sin(a) * 64}"/>`; }).join('')}</g>
      </g>${heart(160, 86, 4.2)}
      ${lantern(54, 116, 1)}${lantern(266, 116, 1)}`)
  };
})(window.Ninle);
