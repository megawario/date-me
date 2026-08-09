# Date-me Static Site Foundation

## Summary

Create a framework-free personal landing page for GitHub Pages using semantic HTML, organized CSS, and minimal JavaScript scaffolding.

The page will be linked from a physical card handed to female friends as a playful joke. It is not a dating app, matchmaking service, or product. This phase focuses on technical structure, maintainability, and a mobile-friendly baseline. Final visual design and wording remain open for later iteration.

## Project structure

```text
date-me/
├── index.html
├── css/styles.css
├── js/main.js
├── assets/images/
├── assets/icons/
├── docs/plan.md
├── AGENTS.md
├── .gitignore
└── README.md
```

## Technical approach

- Keep `index.html` at the repository root for GitHub Pages compatibility.
- Use semantic HTML elements and separate content, presentation, and behavior.
- Store styles in `css/styles.css` and JavaScript in `js/main.js`.
- Load JavaScript with `defer`.
- Use CSS custom properties and relative internal paths.
- Avoid frameworks, bundlers, package dependencies, and backend services.
- Keep the site deployable as plain static files.

## Initial page structure

The first page contains a site header with branding and navigation placeholders, a semantic main area with a neutral introduction, a reusable card-based placeholder section, and a footer with basic metadata. Content and assets are placeholders only and may be replaced as the joke and visual direction develop.

## Initial JavaScript scope

JavaScript is limited to a progressive-enhancement scaffold. It contains no authentication, dating or matching logic, API calls, data loading, forms, persistence, user accounts, or backend integration. The page remains usable without JavaScript.

## Responsive and mobile-friendly behavior

The site must remain readable and usable on a phone, since the primary entry point is a link from a physical card. Layouts collapse at narrow widths, spacing and type use fluid values where useful, links have comfortable targets, and content does not require JavaScript or horizontal scrolling.

## CSS organization

The stylesheet is organized into CSS reset and base styles, global custom properties, typography, layout primitives, component styles, utility classes, responsive rules, and accessibility preferences. Class names describe purpose or component behavior.

## Accessibility principles

The implementation uses semantic structure, a logical heading hierarchy, keyboard-friendly links, visible focus states, descriptive image alt text, sufficient contrast, reduced-motion support, and core content that does not depend on JavaScript.

## Explicit exclusions and future scope

This phase excludes QA processes, test plans, automated tests, browser validation workflows, deployment automation, dating features, matchmaking, authentication, database integration, API integration, and final branding decisions. Future work may refine the joke, copy, illustrations, layout, and overall visual direction. Future card types may include Spotify songs, movie posters, and other media without changing the static-site foundation.

## GitHub Pages assumptions

The repository is served from its root on GitHub Pages. `index.html` is the entry point; no build command or generated output directory is required. The published URL can be printed or encoded on the card that points friends to the page.
