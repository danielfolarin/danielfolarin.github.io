# The Curious Seekers — games page

The front page of <https://games.thecuriousseekers.com>: a short list of games, each a card
that links to the game.

- `index.html` is the page. `games.js` is the list of games on it. `images/` holds the pictures.
- To add a game: add a block to `games.js` and a picture to `images/`. That's all.

## How the address works

This repository is `danielfolarin/danielfolarin.github.io` on GitHub, with the custom domain
`games.thecuriousseekers.com`. Because it is the account's own Pages site, every other public
repository of this account that has GitHub Pages turned on (and no custom domain of its own)
appears as a folder under the same address:

| Repository | Address |
|---|---|
| `danielfolarin.github.io` (this one) | `games.thecuriousseekers.com/` |
| `church-mind` | `games.thecuriousseekers.com/church-mind/` |
| `pilgrims-progress` | `games.thecuriousseekers.com/pilgrims-progress/` |
| `ninle/` folder in this repository | `games.thecuriousseekers.com/ninle/` |

So a new game needs only its own repository with Pages on, plus a card here.
A small game can also live in a folder of this repository, like `ninle/` (Ninle: Adventure
of Life Kids). Its own README explains how it is built.
There is no build step for this page: GitHub Pages serves the files as they are.

## Player counts

`games.thecuriousseekers.com/stats` is a short address for the owner. It forwards to
the private Umami dashboard (sign-in needed), where visits and play events for the
hub and every game are counted. The page is `stats/index.html`.
Ninle is a children's game, so it counts nothing inside the game itself; only the
"game-opened" click on its card here is counted.
