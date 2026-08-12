# Date-a-Mario

Date-a-Mario is a playful, framework-free static website intended to be opened from a link on a physical card. It is a personal joke, not a dating app or matchmaking product.

The experience has two pages:

- `index.html` — a scrollable landing page with the introduction and “See profiles” link.
- `profiles.html` — a mobile-first deck of placeholder Mario profiles. Each profile can contain a different number of vertically scrollable cards and can be swiped left or right at any point.

After every profile has been reviewed, the profiles page shows a locally stored Instagram QR code. Its current destination, `https://www.instagram.com/your_username/`, is intentionally a placeholder. Replace both the link in `profiles.html` and `assets/images/instagram-placeholder-qr.svg` when the real profile URL is available.

## Local usage

No build step or package installation is required. Open `index.html` directly, or serve the repository with any static file server.

## Project structure

- Root HTML files contain semantic page content.
- `css/styles.css` contains presentation and responsive rules.
- `js/main.js` progressively enhances the profile deck; decisions are temporary and never stored or transmitted.
- `assets/images/` contains local imagery and the placeholder QR asset.
- `docs/plan.md` documents the current static-site scope.

Profile sequences are authored directly in `profiles.html`. Add any number of cards inside a profile's `[data-profile-cards]` container. Supported card types are the main profile card, text, image, and image with overlaid text; each type is identified by its `data-card-type` value and matching CSS class.

Use the “Scroll for more ↓” cue on every card that has another card after it in the same profile. The cue is useful because vertical scrollbars may not be visible on mobile. Omit it from the final card in a profile sequence so visitors know they have reached the end.

Image templates reference their source directly through the `<img src>` attribute. The current examples use a remote Pexels image and do not store a copy in this repository.

The project intentionally excludes dependencies, build tooling, backend services, APIs, authentication, persistence, dating functionality, and matchmaking behavior.
