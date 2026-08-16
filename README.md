# Date-a-Mario

Date-a-Mario is a playful, framework-free static website intended to be opened from a link on a physical card. It is a personal joke and reusable personal-site template, not a dating app or matchmaking product.

It includes a landing page, a configurable profile-card experience, a beginner-friendly customization guide, and printable and shareable card previews.

## Make your own

1. Fork the repository.
2. Replace every file under `assets/images/` before publishing, redistributing, or deploying your fork. Those images are not covered by the MIT License.
3. Customize the landing page in `index.html`, profile content in `data/profiles.js`, and card content in `data/card.js`.
4. Follow the full setup, publishing, and printing instructions in [Create your own](create-your-own.html).

## Local use and publishing

No build step, package installation, or local server is required. Open `index.html`, `profiles.html`, or `card.html` directly in a browser while editing. The vertical-card image and printing both work from `file://`.

For GitHub Pages, publish the repository root from the branch that contains the site. GitHub provides the published address after deployment; use that complete address as `destinationUrl` in `data/card.js`. See the [GitHub Pages publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for current GitHub settings.

## Project structure

- Root HTML files contain page structure and UI. `index.html` remains at the repository root for GitHub Pages.
- `create-your-own.html` is the complete customization, publishing, and printing guide.
- `css/styles.css` contains presentation and responsive rules.
- `data/profiles.js` contains profile-card content and order.
- `data/card.js` contains the printable horizontal card content, destination, colors, and artwork.
- `js/main.js` renders the profile cards and keeps decisions only in memory for the current run.
- `js/card.js` renders the printable card and generates its QR code locally.
- `assets/images/date-a-mario-vertical.png` is the fixed 4:5 card shown for sharing.
- `docs/plan.md` records the maintained scope and technical decisions.

## License

The source code, documentation, and other original non-image content are available under the [MIT License](LICENSE). Files under `assets/images/` are excluded from that license and may not be used, copied, redistributed, or deployed. Replace or remove them before making a fork public. Third-party names, trademarks, embedded content, and services—including Spotify content—remain subject to their owners’ terms.
