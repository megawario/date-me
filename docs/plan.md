# Date-a-Mario Static Site

## Summary

Date-a-Mario is a framework-free personal joke site for GitHub Pages. A visitor starts on a scrollable landing page, follows the “See profiles” link, reviews three facets of Mario—Mario Gonzalez, Filme Mario, and Fun Mario—and reaches an Instagram QR screen after making a temporary left-or-right decision on every profile.

## Page structure

- `index.html` is the root landing page and keeps the GitHub Pages entry point unchanged.
- `profiles.html` contains the focused profile deck and completion screen. It intentionally has no in-page back link.
- Each profile owns a variable-length sequence inside `[data-profile-cards]`. Sequences can contain profile, text, image, and image-with-text cards.
- Profile content is semantic HTML and remains readable without JavaScript. JavaScript turns the profile list into a one-profile-at-a-time deck while CSS makes each profile's cards vertically scrollable.
- Every non-final card in a multi-card profile should include the visible “Scroll for more ↓” cue. It makes the additional content discoverable on mobile, where the inner scrollbar may be hidden. The final card should omit the cue.

## Presentation and behavior

- `css/styles.css` uses mobile-first rules, fluid sizing, scroll snapping, visible focus states, and reduced-motion support.
- `js/main.js` activates the deck only when `[data-profile-deck]` is present. It adds pointer dragging, arrow-key decisions, keyboard card scrolling, progress, completion, and reset behavior.
- Swipe decisions exist only in memory for the current visit. Nothing is persisted or transmitted.
- Internal pages and assets use relative paths so the site works from the repository root on GitHub Pages.

## Assets and placeholders

Profile artwork and copy are placeholders for later refinement. The current profile facets are Gonzalez (creepy-cool), Filme (cinephile), and Fun (good times). Image and image-with-text cards use the local placeholder image until final photos are selected. The completion screen uses `assets/images/instagram-placeholder-qr.svg`, which encodes the placeholder URL `https://www.instagram.com/your_username/`. When the real Instagram profile is known, update both the QR asset and its link in `profiles.html`.

## Constraints

Keep the site deployable as plain static files. Do not add frameworks, packages, build tools, backend services, authentication, APIs, persistence, dating features, or matchmaking behavior. Final branding and visual direction remain open for future refinement.
