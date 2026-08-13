# Date-a-Mario Static Site

## Summary

Date-a-Mario is a framework-free personal joke site for GitHub Pages. A visitor can print a physical card that points to the landing page, then follow the “See profiles” link, review three facets of Mario—Mario Gonzalez, Filme Mario, and Fun Mario—and reach an Instagram QR screen after making a temporary left-or-right decision on every profile.

## Page structure

- `index.html` is the root landing page and keeps the GitHub Pages entry point unchanged.
- `card.html` previews and prints one ISO ID-1 physical card at 85.60 × 53.98 mm; the landing page links to it.
- `profiles.html` contains the focused profile deck and completion screen. It intentionally has no in-page back link.
- Each profile owns a variable-length sequence configured in `data/profiles.json`. The root-level `shuffleProfiles` option randomizes profile order on each page load without changing card order within a profile. Sequences can contain profile, text, image, image-with-text, and Spotify cards in any order.
- JavaScript loads the configuration, renders semantic card markup, and turns the profile list into a one-profile-at-a-time deck while CSS makes each profile's cards vertically scrollable.
- Profile headers show artwork without numbered edition badges.
- The renderer adds the visible “Scroll for more ↓” cue to every non-final card and the “Left or right?” decision prompt to every final card.

## Presentation and behavior

- `css/styles.css` uses mobile-first rules, fluid sizing, scroll snapping, visible focus states, and reduced-motion support.
- `js/main.js` activates the deck only when `[data-profile-deck]` is present. It renders the JSON configuration, then adds pointer dragging, behind-card decision feedback, arrow-key decisions, keyboard card scrolling, progress, completion, and page-reload behavior for starting again.
- Swipe decisions exist only in memory for the current visit. Nothing is persisted or transmitted.
- Internal pages and assets use relative paths so the site works from the repository root on GitHub Pages.
- `data/card.json` configures the physical card's brand, headline, prompt, destination and displayed URLs, QR label, theme colors, and optional local artwork. `js/card.js` applies that configuration with text-safe DOM APIs and creates a byte-mode QR code as SVG entirely in the browser.
- The QR keeps a fixed white quiet zone, sits apart from configurable copy and artwork, and has a printed URL fallback. Print styles hide page chrome and output only the exact-size card.

## Assets and placeholders

Profile artwork and copy are maintained in `data/profiles.json`. A profile entry contains its identity, accent color, and ordered cards. Profile cards configure identity copy and tags; text cards configure a callsign, heading, and body; image cards configure an image and alternative text; image-with-text cards combine those image fields with a callsign, heading, and body. Images may also set an optional focal position. Spotify cards configure an accessible title, a track, album, or artist embed URL, an optional height, and optional callsign, heading, and body copy displayed over the player without blocking its controls.

The current profile facets are Gonzalez (creepy-cool), Filme (cinephile), and Fun (good times). Fun Mario uses `assets/images/fun-mario.jpg` and a configured Spotify album embed; the other image cards still use the local placeholder image until final photos are selected. The completion screen links directly to `https://www.instagram.com/radioactive_space_hamster?igsh=MW5tOThuNzhhMnUzaA==`.

## Constraints

Keep the site deployable as plain static files. Use a static HTTP server for local profile development because browsers do not reliably load JSON configuration from `file://`. Do not add frameworks, packages, build tools, backend services, authentication, APIs, persistence, dating features, or matchmaking behavior. Final branding and visual direction remain open for future refinement.
