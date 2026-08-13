# Date-a-Mario

Date-a-Mario is a playful, framework-free static website intended to be opened from a link on a physical card. It is a personal joke, not a dating app or matchmaking product.

The experience has three pages:

- `index.html` — a scrollable landing page with the introduction and “See profiles” link.
- `profiles.html` — a mobile-first deck of Mario Gonzalez, Filme Mario, and Fun Mario. Each profile can contain a different number of vertically scrollable cards and can be swiped left or right at any point. During a swipe, a red “Next” or green “Yes” surface appears behind the active profile before the next one is shown.
- `card.html` — an ISO ID-1 physical-card preview that creates its QR code locally and prints at 85.60 × 53.98 mm.

After every profile has been reviewed, the profiles page shows the Yes and No totals for the current run, adds a message based on the result, and links directly to `https://www.instagram.com/radioactive_space_hamster?igsh=MW5tOThuNzhhMnUzaA==`.

## Make your own

1. Fork this repository and enable GitHub Pages for your fork.
2. Remove or replace every file under `assets/images/`; the included images are not covered by the MIT license.
3. Edit `data/profiles.json` to define your profile variants, card order, copy, images, Spotify embeds, and whether profiles are shuffled.
4. Replace the landing-page name, introduction, story, links, and preview image in `index.html`.
5. Configure the printable physical card in `data/card.json`, then open `card.html` to print it or save it as a PDF.
6. Serve the files locally while editing, then publish the updated fork through GitHub Pages.

## Local usage

No build step or package installation is required. Serve the repository with any static file server so the profiles page can load `data/profiles.json`. The landing page can still be opened directly, but browsers do not reliably allow the profiles page to fetch JSON over `file://`.

## Project structure

- Root HTML files contain the page structure and application UI.
- `css/styles.css` contains presentation and responsive rules.
- `data/profiles.json` contains all profile and card content in display order.
- `data/card.json` contains the physical card copy, destination, colors, and optional artwork path.
- `js/main.js` renders the configured cards and runs the profile deck; Yes and No decisions are counted only for the current run and are never stored or transmitted. “Review again” discards the counts and cleanly reloads the profiles page with the page and every profile reset to its first card.
- `js/card.js` renders the printable card and generates its QR code as local SVG without an external service.
- `assets/images/` contains local profile imagery.
- `docs/plan.md` documents the current static-site scope.

Profile sequences are authored in `data/profiles.json`. Set the root-level `shuffleProfiles` option to `true` to randomize the profile order on every page load, or `false` to preserve the configured order. Each profile has an `id`, `name`, `accentColor`, and ordered `cards` list. Add, remove, reorder, or swap profiles and cards there without editing `profiles.html`; shuffling profiles does not change the order of cards within them.

Supported card types and fields are:

- `profile` — `image` (optional), `imageAlt`, `imagePosition` (optional), `callsign`, `name`, `age`, `catchphrase`, and `tags`.
- `text` — `callsign`, `heading`, and `body`.
- `image-text` — `image`, `imageAlt`, `imagePosition` (optional), `callsign`, `heading`, and `body`.
- `image` — `image`, `imageAlt`, and `imagePosition` (optional).
- `spotify` — `embedUrl`, accessible iframe `title`, `callsign` (optional), `heading` (optional), `body` (optional), and `height` (optional, clamped between 300 and 480 pixels). The URL must be an `https://open.spotify.com/embed/` track, album, or artist URL. Configured copy appears over the player without blocking its controls.

Image paths are relative to the site root. A profile card without an `image` uses the decorative monogram treatment. The renderer adds the visible “Scroll for more ↓” cue to every non-final card and “Left or right?” to the last card in each profile.

Profile headers use the profile artwork directly and do not display numbered edition badges.

Fun Mario uses `assets/images/fun-mario.jpg` and includes a Spotify album card configured in `data/profiles.json`; the remaining photo slots use the local placeholder image so real photos can be added later by changing only the configuration.

The project intentionally excludes dependencies, build tooling, backend services, APIs, authentication, persistence, dating functionality, and matchmaking behavior.

## Create and print a physical card

1. Fork the repository and replace every protected file in `assets/images/` with artwork you own or are permitted to use.
2. Edit `data/card.json`. Set `destinationUrl` to the complete public URL the QR should open, and use `displayUrl` for the shorter fallback address printed below it.
3. Customize `brand`, `headline`, `prompt`, `qrLabel`, `foregroundColor`, `backgroundColor`, and `accentColor`. Set `artwork` to a relative local image path, or to an empty string for no artwork.
4. Serve the repository with a static HTTP server and open `card.html`; browsers do not reliably load the JSON over `file://`.
5. Use “Print card,” select 100% or actual-size scaling, and disable browser headers and footers. Print on card stock or save the result as a PDF. To create an image, capture or convert the saved PDF at its original proportions.
6. Cut the card to the ISO ID-1 dimensions, 85.60 × 53.98 mm. The QR includes its own white quiet zone and the displayed URL remains available if scanning fails.

The local QR renderer accepts HTTP and HTTPS destinations up to 271 UTF-8 bytes. Always open the generated card before printing so the configured content is visible.

## License

The source code, documentation, and other original non-image content are available under the [MIT License](LICENSE). Files under `assets/images/` are excluded from that license and remain Copyright © 2026 Mário Pinto, all rights reserved. Forks and other redistributed or deployed derivatives must remove or replace those images. Third-party names, trademarks, embedded content, and services—including Spotify content—remain subject to their owners' terms.
