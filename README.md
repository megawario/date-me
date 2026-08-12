# Date-a-Mario

Date-a-Mario is a playful, framework-free static website intended to be opened from a link on a physical card. It is a personal joke, not a dating app or matchmaking product.

The experience has two pages:

- `index.html` — a scrollable landing page with the introduction and “See profiles” link.
- `profiles.html` — a mobile-first deck of Mario Gonzalez, Filme Mario, and Fun Mario. Each profile can contain a different number of vertically scrollable cards and can be swiped left or right at any point. During a swipe, a red “Next” or green “Yes” surface appears behind the active profile before the next one is shown.

After every profile has been reviewed, the profiles page links directly to `https://www.instagram.com/radioactive_space_hamster?igsh=MW5tOThuNzhhMnUzaA==`.

## Local usage

No build step or package installation is required. Serve the repository with any static file server so the profiles page can load `data/profiles.json`. The landing page can still be opened directly, but browsers do not reliably allow the profiles page to fetch JSON over `file://`.

## Project structure

- Root HTML files contain the page structure and application UI.
- `css/styles.css` contains presentation and responsive rules.
- `data/profiles.json` contains all profile and card content in display order.
- `js/main.js` renders the configured cards and runs the profile deck; decisions are temporary and never stored or transmitted.
- `assets/images/` contains local profile imagery.
- `docs/plan.md` documents the current static-site scope.

Profile sequences are authored in `data/profiles.json`. Each profile has an `id`, `name`, `accentColor`, and ordered `cards` list. Add, remove, reorder, or swap profiles and cards there without editing `profiles.html`.

Supported card types and fields are:

- `profile` — `image` (optional), `imageAlt`, `imagePosition` (optional), `callsign`, `name`, `age`, `catchphrase`, and `tags`.
- `text` — `callsign`, `heading`, and `body`.
- `image-text` — `image`, `imageAlt`, `imagePosition` (optional), `callsign`, `heading`, and `body`.
- `image` — `image`, `imageAlt`, and `imagePosition` (optional).

Image paths are relative to the site root. A profile card without an `image` uses the decorative monogram treatment. The renderer adds the visible “Scroll for more ↓” cue to every non-final card and “Left or right?” to the last card in each profile.

Profile headers use the profile artwork directly and do not display numbered edition badges.

Fun Mario uses `assets/images/fun-mario.jpg`; the remaining photo slots use the local placeholder image so real photos can be added later by changing only the configuration.

The project intentionally excludes dependencies, build tooling, backend services, APIs, authentication, persistence, dating functionality, and matchmaking behavior.
