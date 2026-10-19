# Ninle Bible Adventure Game

A gentle, colourful adventure game for children aged 6–12. Explore Lantern Valley with
Ninle the lantern-firefly, help friends, find secrets, and light up the Lantern Trail.

Adventure 1, **The Lantern Trail**, is complete and playable from start to finish.

---

## How to play it

**Easiest:** double-click `index.html`. It opens in your web browser and works offline.
Nothing needs to be installed.

**On a phone or tablet (same Wi-Fi as your computer):**

```bash
python3 -m http.server 8000
```

Then open `http://<your-computer's-IP-address>:8000` on the phone or tablet.
(On the computer itself you can use `http://localhost:8000`.)

To put it online for church or family use, upload the whole folder to any static web host.
There is no server code and no build step.

### Controls

| | Phones & tablets | Computers |
|---|---|---|
| Move | Drag the round pad (bottom-left) | Arrow keys or WASD |
| Talk / read / next | Big ✋ button, or tap the text | Space or Enter (E also works) |
| Choose | Tap a choice | Click, or press 1 / 2 |
| Help from Ninle | **?** button | H |
| Pause / restart | ⏸ button | P or Esc |
| Sound on/off | 🔊 button | M |
| **In the Temptation Tunnel** | ◀ ▶ buttons to run, big **Jump** button | ← → / A D to run, Space / ↑ / W to jump |

---

## What's in the adventure

The lanterns in Lantern Valley have gone dark. Find **3 glowing sparks** to light them again.

- **Bramble the Beaver** is hurt on the road. Honk the Goose and Percy the Peacock hurry
  past, but you can stop and help. Help him and he fixes the bridge (spark 1).
- **Moss the Hedgehog** feels left out. Invite Moss to play, or sit with Moss for a while
  (that choice also reveals a secret star). Then walk together to the pond friends (spark 2).
- **Juniper the Fox** broke Grandpa Theo's flower pot and is hiding. Help Juniper be brave
  and tell the truth. Theo forgives her and opens the gate to the **Hidden Hollow**.
  There is also a secret path into the Hollow for curious explorers.
- **The Temptation Tunnel** (spark 3) is a Mario-style side-scroller inside the Hollow's glowing
  tree. Run and jump past silly temptations:
  - ⏰ **Too-Busy Clocks** ("No time to help!")
  - 😠 **Grumble Thorns**
  - 🫧 **Fib Bubbles** ("Just tell a tiny fib!")
  - 🟢 **Grabby Goo** ("Mine! Mine!")
  - **Give-Up Gaps**

  Hop *on* clocks and bubbles to calm them into flowers. Bump kindness blocks for hearts,
  ride bounce flowers and light checkpoint lanterns on the way to the goal lantern. At the end,
  Ninle links it to Jesus facing temptation (Matthew 4:1–11). The run is gentle:
  - Bumping a temptation only bounces you back.
  - After 3 bumps the temptation makes way ("there's always a way through").
  - Ninle catches every fall, and falling twice in one stretch makes a bridge of light.

  The tunnel can be replayed for fun, and you can leave it from the Pause menu.
- **The funny surprise:** a bush in the bottom-right corner is not a bush. Meet Shrubbert,
  the sheep who has been playing hide-and-seek for three days.
- **6 Wonder Stars** are hidden in corners around the valley.
- **The finale:** bring the sparks to the Great Lantern. The trail lights up one lantern at a
  time, your friends gather, the gate opens, and the fog lifts to show the **Starlight Hills**.
- **The story Jesus told:** a short illustrated storybook retells the Good Samaritan
  (Luke 10:25–37). It reminds children that God loves them always, and that love is
  something we *do*. It ends with an optional short prayer.
- **Celebration:** stickers, a Lantern Hat costume, and a star count, with buttons to
  *Play Again* or *Keep Exploring* (the Starlight Hills can be walked into afterwards).

Choices change what characters say and do, but there is no wrong answer and nothing to lose.
There are no lives, no timers, and no enemies. Stickers celebrate discovery and kindness.
They are never a score of how "good" a child is.

### Child safety and privacy

- No accounts, chat, messaging, profiles, ads, purchases, location, or personal questions.
- Explorers are picked from four looks. No names are asked for.
- The only thing saved is sticker and settings progress, in the browser's local storage on
  this device. Nothing is ever sent anywhere, and the game makes no network requests.
- It plays fully with the sound off. "Read to me" uses the device's built-in voice.

### Accessibility

- Large text and buttons, strong contrast, and a visible focus ring for keyboard users.
- Fully playable with the keyboard alone.
- There are no flashing effects. **Calm motion** (in the Pause menu) turns off typewriter
  text, bobbing, confetti and camera sweeps. It switches on automatically when the device
  asks for reduced motion.
- **Read to me** reads every line and storybook page aloud. There is also a 🔈 button on each line.
- The game pauses itself when the browser tab is hidden.

---

## Project layout

```
index.html                 Page structure (screens, HUD, dialogue box, menus)
css/style.css              All styling; colours are variables at the top
js/core/                   util (helpers), save (on-device storage), audio (synth sounds
                           and music), speech (read aloud), input (keyboard and joystick)
js/art/characters.js       Every character drawn in code, plus portraits and stickers
js/art/world-art.js        Ground, water, paths, trees, house, lanterns, gate, collectables
js/content/                Shared content: characters, explorer looks, costumes,
                           stickers, storybook pictures (SVG)
js/levels/lantern-trail.js ALL story content for Adventure 1: map, characters, dialogue,
                           choices, hints, finale and reflection
js/levels/hollow-run.js    The Temptation Tunnel side-scroller: its map, temptations and lines
js/art/run-art.js          Side-scroller art: background, blocks, hearts, temptations
js/engine/world.js         Tile map and collision
js/engine/story.js         Runs dialogue, checks conditions and applies effects
js/engine/game.js          Movement, camera, drawing, pickups, triggers and the finale
js/engine/platformer.js    The side-scrolling run (physics, temptations, checkpoints)
js/ui/ui.js                Title, HUD, dialogue box, pause, storybook, ending, sticker book
js/main.js                 Starts everything, keyboard shortcuts and the game loop
```

All pictures are drawn with canvas or inline SVG, so there are no image files to lose.

---

## Adding a new adventure

Story content is separate from game logic, so a new adventure is mostly a new data file.

1. **Copy the level file.** Duplicate `js/levels/lantern-trail.js` as, for example,
   `js/levels/starlight-hills.js`, and change `id` and `title`.
2. **Draw the map.** Edit the `map` rows (all rows must be the same length). The key is at
   the top of the file. For example, `.` is grass, `=` is path, `~` is water, `T` is a tree and
   `s` is a secret bush you can walk through. Set `start: [x, y]`. Coordinates are
   `[column, row]`, counting from 0 at the top left.
3. **Place things** in `entities`:
   - `npc`: a character (`char` names an entry in `js/content/characters.js`), with `talk` rules
   - `sign`: a signpost (`text`)
   - `item`: something to collect (e.g. `item: 'plank'`); describe it in `items`
   - `spark`: a lantern spark, and `star`: a Wonder Star
   - `greatLantern`: where the finale starts

   Add `hidden: true` to make something appear later with the `show` effect.
4. **Write dialogue** in `dialogues`. Each line is `{ who, text }`. It can also have
   `touch` (different text on phones), `if` (only show when a condition is true) and
   `do` (effects). A `choices` line offers buttons. Each choice can `go` to another dialogue
   and/or `do` effects.
5. **Connect it up.** Use `talk` rules on characters (the first matching rule wins, and
   `mark: true` shows a "!"), `triggers` (walk into an area), `hints` (what Ninle suggests;
   the first match wins), `finale` and `reflection` (storybook pages).
6. **Load it.** Add `<script src="js/levels/starlight-hills.js"></script>` to `index.html`
   (before `js/engine/world.js`). Then set `LEVEL` in `js/main.js` to the new id, or add
   a level picker on the title screen.

### Adding a side-scrolling run

Copy `js/levels/hollow-run.js` and change its `id`. Draw the side-view `map`; the key is in the
file. An empty bottom row makes a Give-Up Gap, and `S` is the start and `F` is the finish.
Set `reward` (an entity in the main level, such as a spark, to collect when you finish) and,
if you like, `sticker`. Add a `<script>` tag for it. Then start it from any dialogue
with `do: { platform: 'your-run-id' }`. A `portal` entity (like `hollowDoor`) makes a
good glowing entrance.

**Conditions** (used in `if`): `flag`, `not` (a flag or a list of flags), `items: { plank: 3 }`,
`following: 'moss'` (or `null`), `sparks: 3`, `sparksBelow: 3`, `allStars: true`.

**Effects** (used in `do`): `set` / `unset` (flags), `give` / `take` (items), `follow` /
`unfollow`, `walk: { id, to }`, `run: { id, from, path, speed, delay, hideAtEnd }`,
`show` / `hide`, `door` (changes map tiles, defined in `doors`), `sticker`, `costume`,
`sfx`, `bubble: { id, text, time, delay }`, `reveal` (makes a star glow and points to it),
`burst: [x, y]` (sparkles), `say` (starts another dialogue), `finale`, `reflection`,
`platform` (starts a side-scrolling run), `endRun` (used inside a run's finish lines).

Picking up anything sets the flag `got_<id>` automatically (e.g. `got_spark1`).

**New characters:** add a drawing function to `DRAW` in `js/art/characters.js`. Draw it facing
right, with its feet at (0, 0). Then add it to `js/content/characters.js` and to the
`PORTRAIT` table so it gets a nice close-up.
**New stickers:** add them to `js/content/stickers.js`.
**New storybook pictures:** add them to `js/content/story-art.js`.
