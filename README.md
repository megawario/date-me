# Date-me

Date-me is a small, playful GitHub Pages website. The idea is to hand a female friend a card with my name and a link to this page as a joke. It is a personal landing page, not a dating app, a matchmaking service, or a product.

The current prototype borrows the visual language of dating apps: visitors can drag a stack of cards left or right, or use the buttons below the cards. The cards currently contain jokes and placeholder content. Future cards may include a Spotify song, movie poster, or other personal recommendations.

## Local usage

No build step or package installation is required. Open `index.html` directly in a browser, or serve the repository with any local static file server:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Project structure

- `index.html` — semantic page entry point for GitHub Pages.
- `css/styles.css` — reset, tokens, typography, layout, components, responsive rules, and accessibility preferences.
- `js/main.js` — vanilla JavaScript for the swipe-card interaction and feedback.
- `assets/` — local placeholder imagery and future icons.
- `docs/plan.md` — current technical implementation plan.

The site is intended to work well when opened from a phone after following the link on the card. It intentionally excludes dating functionality, authentication, APIs, persistence, backend services, and deployment automation.
