# Date-me

Date-me is a framework-free static site foundation for a future experience centered on meaningful connections.

## Local usage

No build step or package installation is required. Open `index.html` directly in a browser, or serve the repository with any local static file server:

```sh
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Project structure

- `index.html` — semantic page entry point for GitHub Pages.
- `css/styles.css` — reset, tokens, typography, layout, components, responsive rules, and accessibility preferences.
- `js/main.js` — intentionally minimal progressive-enhancement scaffold.
- `assets/` — local placeholder imagery and future icons.
- `docs/plan.md` — current technical implementation plan.

This phase intentionally excludes dating functionality, authentication, APIs, persistence, backend services, testing workflows, and deployment automation.
