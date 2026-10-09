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

So a new game needs only its own repository with Pages on, plus a card here.
There is no build step for this page: GitHub Pages serves the files as they are.
