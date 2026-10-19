# Wayfinder — A Journey Through Life with God

A Christian, story-driven reflection game for older teens and adults moving through difficult or important seasons. Standalone prototype (not part of Church Mind or Ninle).

A player says what they're carrying, gets one or more story suggestions (never "you are this character"), walks a short illustrated adventure shaped by a biblical narrative, reflects, reads Scripture in context, and chooses a practical next step.

## Run it
No build step, no dependencies, no network requests.

```bash
python3 tools/serve.py
```
Then open http://localhost:5173. (`tools/serve.py` is a plain static server with caching turned off, so edits show up on reload.) You can also open `index.html` directly from disk.

## The eight journeys
Each journey has its own setting, guide character, three playable areas, a choice that changes later dialogue, story pages, 3 Scripture passages, a reflection and stillness moment, next steps, a closing, and a link back to the journey choices.

| Journey | Passage | For when… | Guide | Choice that changes the story |
|---|---|---|---|---|
| Under the Juniper Tree | 1 Kings 19 | overwhelmed, exhausted | Hanan | who will walk the next stretch with you |
| The Winepress and the Fleece | Judges 6–7 | uncertain, afraid, deciding | Abiel | how you discern → Abiel's words above the camp |
| The Road Home to Bethlehem | Ruth 1–4 | grief and loss | Miri | walk together or alone → Miri beside you or catching up later |
| The God Who Sees | Genesis 16; 21 | unseen, abandoned, vulnerable | Sefa | what you want God to see → Sefa's words in the wilderness |
| The Long Road from the Pit | Genesis 37–50 | betrayal, long waiting | Iry | what you do with waiting → Iry's words in the hall |
| Breakfast on the Shore | Luke 22; John 21 | regret, shame | Yona | casting the net, and how you come ashore → the breakfast scene |
| The Rooftop and the Prophet | 2 Samuel 11–12; Psalm 51 | desire, harm, power | Tavi, Nathan | your instinct when confronted → Tavi at the lyre |
| Strength and Boundaries | Judges 13–16 | habits, dependency | Ziva | your plan when the pattern starts → Ziva's farewell |

## Structure
```
index.html                         App shell (top bar, stage, HUD, controls, dialog, modals, crisis panel)
styles/main.css                    Visual identity, responsive layout, reduced-motion & large-text modes
src/core.js                        Namespace, DOM helper, journey registry & order, condition tester
src/storage.js                     localStorage only (settings, progress, saved reflections)
src/support.js                     Disclaimer, privacy text, crisis lines, local free-text safety check
src/audio.js                       Generated Web Audio ambience (off by default, slow ramps only)
src/art.js                         Core SVG painters, Elijah scenes, props, map
src/art-more.js                    Scene factory (makeScene), 21 more scenes, cast of characters, props
src/world.js                       Side-scrolling exploration engine (parallax, hotspots, tap-to-walk)
src/ui.js                          Dialogue, story pages, choices, rest/stillness, modals, crisis panel
src/main.js                        Game flow and screens (title, check-in, journey choices, map, adventure, reflect, Scripture, next step, close)
src/content/companions.js          Check-in options (with recommended journeys) and the 8 story companions
src/content/journeys/*.js          One file per journey
src/voice.js                       Voiced-line ids and clip playback (shared with tools/voices.py)
audio/voice/                       Generated voice clips + manifest.js (+ script.json for review)
tools/voices.py                    Fish Audio clip generator
tools/voices.json                  Speaker → Fish Audio voice ID mapping
tools/serve.py                     No-cache dev server
tools/autoplay.js                  Automated play-tester (dev only)
```

## Adding or editing a journey
1. Copy an existing journey file in `src/content/journeys/` (e.g. `gideon.js`) and call `Wayfinder.registerJourney({...})`. Fields: `id, companion, title, tagline, passage, length, pages, speakers, prologue, areas, reflect, scripture, nextSteps, closing`.
2. Add a `<script>` tag for it in `index.html` (after the other journeys) and its id to `WF.journeyOrder` in `src/core.js`.
3. Add or update the companion in `src/content/companions.js` with `journeyId`, and list it in the relevant check-in options' `companions` arrays so it gets recommended.
4. Pick a `scene` for each area from `src/art.js` / `src/art-more.js`, or create one with `makeScene({...})`. Hotspot `art` names map to `Wayfinder.art.props`; characters can be added to `CAST` in `art-more.js`.

### Story steps (in `intro`, hotspot `steps` / `again`, and choice `then`)
`say {speaker,text}` · `page '<pageId>'` · `choice {key,prompt,options,allowText,loop,noSkip}` · `set 'flag'|[...]` · `light 'message'` · `rest {text}` · `storm [phases]` · `stillness {text,seconds,doneText}` · `fx 'name'` · `caption '[sound]'`.
Any step may carry `if: {flags, notFlags, answer:{key,in}}`. That is how an earlier choice changes later dialogue. Hotspots can use `when:` the same way to appear or disappear.
Options may include `crisis: true` (pauses the game and shows support), `end: true` (ends a looping conversation), `then: [steps]`.
Hotspots get a `seen:<id>` flag after first use; an area's exit opens when every flag in `exitRequires` is set.

### Testing a journey
With the game open in a browser, run in the console:
```js
await fetch('tools/autoplay.js').then(r => r.text()).then(eval);
await WayfinderAutoplay.play('naomi', 0);   // variant 0, 1, 2… choose different options
Wayfinder.debug.goto('naomi', 2);           // jump straight to an area to look at it
```
`play` drives the real UI from the journey choices to the closing screen (never choosing crisis options) and reports whether it completed, the areas visited, and any errors.

### Content rules
- `kjv` fields hold exact King James Version text only (public domain). Summaries and reflections are always labelled as Wayfinder's own.
- Never write content that speaks for God, diagnoses, promises healing, or says the player "is" a Bible character. Jesus is not voiced as a game character; his words appear only as quoted Scripture.
- Treat every person in a story in their own right: Bathsheba, Uriah, Hagar, Delilah, Joseph's brothers are never props.
- Serious topics should point to trusted people and professionals. No generative AI for spiritual advice, Scripture interpretation, or crisis responses.

## Voices (Fish Audio)
Narration and character dialogue can be voiced with [Fish Audio](https://fish.audio). Clips are generated **ahead of time** and shipped in `audio/voice/`, so players never contact Fish Audio and nothing they write is ever spoken or sent anywhere. The words always stay on screen; voices play only when the player has Sound on (and can be turned off under Settings → Voices).

1. **Pick voices.** In `tools/voices.json`, paste a Fish Audio voice model ID next to each speaker: `narrator`, the guides (`hanan`, `abiel`, `miri`, `sefa`, `iry`, `yona`, `tavi`, `nathan`, `ziva`). `page` (story pages read aloud) and `note` (Wayfinder's gentle notes) use the narrator's voice if left empty. You can reuse the voice IDs from your other games.
2. **Check the script and size.**
   ```bash
   python3 tools/voices.py list
   ```
   This shows every voiced line per journey and speaker (currently 426 lines, about 62,500 characters) and writes the full script to `audio/voice/script.json` for review.
3. **Try a few lines first,** then generate the rest. Set your key in the terminal only; it is never saved to disk.
   ```bash
   export FISH_API_KEY=your-key-here
   python3 tools/voices.py generate --journey elijah --limit 5
   python3 tools/voices.py generate
   ```
   Re-running only makes clips that are missing. If you edit a line, it gets a new id and only that clip is regenerated; `python3 tools/voices.py prune` deletes clips for lines that no longer exist.
4. Reload the game, turn Sound on, and play.

Options in `tools/voices.json`: `model` (Fish Audio model header, e.g. `s2.1-pro` or `s1`), `speed`, `language`, `mp3_bitrate`. For a free robotic preview of the pipeline on macOS, use `--engine say` (delete those `.m4a` files before shipping).

Line ids come from `src/voice.js`, which both the game and the generator use, so they always match. Extraction runs the content files through macOS JavaScriptCore; on another OS, run `copy(JSON.stringify(Wayfinder.voice.allLines()))` in the browser console, save it to a file, and pass `--script that-file.json`.

## Privacy & safety
No accounts, chat, ads, purchases, analytics, or network requests. Free text is never autosaved; it is stored only if the player presses "Save My Reflection", and only in this browser. The Support button is always available, choosing a crisis option or typing words that suggest danger pauses the game with emergency and crisis-line information, and crisis numbers live in `src/support.js` (review them periodically).
