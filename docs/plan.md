# Date-a-Mario Static Site

## Summary

Date-a-Mario is a framework-free personal joke site and reusable GitHub Pages template. A visitor can print a physical card that points to the landing page, follow the “See profiles” link, review a configurable set of profile facets, and reach a contact link after making a temporary left-or-right decision on every profile.

## Page structure

- `index.html` is the root landing page and keeps the GitHub Pages entry point unchanged. Its final section explains the real-world motivation and links to the source, setup guide, and printable physical card.
- `create-your-own.html` is a root-level, beginner-friendly setup guide. It explains forking, replacing protected images, customizing content and profile cards, configuring and printing the physical card, previewing, enabling GitHub Pages, publishing later changes, and common problems; it ends with reference links.
- `card.html` previews and prints one horizontal ISO ID-1 physical card at 85.60 × 53.98 mm, and displays a fixed 1080 × 1350 image for social sharing; the landing page links to it.
- `profiles.html` contains the focused profile deck and completion screen.
- Each profile owns a variable-length sequence configured in `data/profiles.js`. The root-level `shuffleProfiles` option randomizes profile order on each page load without changing card order within a profile. Sequences can contain profile, text, image, image-with-text, image-with-text-fade, and Spotify cards in any order. Image fields accept local still images or GIFs; animated cards can provide a static `reducedMotionImage` fallback for visitors who prefer reduced motion.
- JavaScript reads the configuration loaded by the page, renders semantic card markup, and turns the profile list into a one-profile-at-a-time deck while CSS makes each profile's cards vertically scrollable.
- Profile headers show artwork without numbered edition badges. The renderer adds a visible scroll cue to every non-final card and a decision prompt to each final card.

## Presentation and behavior

- `css/styles.css` uses mobile-first rules, fluid sizing, scroll snapping, visible focus states, and reduced-motion support.
- `js/main.js` activates the deck only when `[data-profile-deck]` is present. It renders the profile configuration, then adds pointer dragging, behind-card decision feedback, keyboard controls, progress, completion, and a clean page reload when starting again.
- Swipe decisions are counted as Yes or No only in memory for the current run, displayed on completion, and discarded when the flow restarts or is left. Nothing is persisted or transmitted.
- Internal pages and assets use relative paths so the site works from the repository root on GitHub Pages.
- `data/card.js` configures the printable card's brand, headline, prompt, destination and displayed URLs, QR label, theme colors, and optional local artwork. `js/card.js` applies that configuration with text-safe DOM APIs and creates a byte-mode QR code as SVG entirely in the browser.
- The QR keeps a fixed white quiet zone, sits apart from configurable copy and artwork, and has a printed URL fallback. Print styles hide page chrome and output only the exact-size card.
- The fixed vertical 4:5 image is shown directly on `card.html` for visitors to save or share with their device.

## Assets and placeholders

Profile artwork and copy are maintained in `data/profiles.js`. Each profile contains its identity, accent color, and ordered cards; the configuration can be updated without changing the deck markup. Profile and card field reference material belongs in the user-facing [customization guide](../create-your-own.html), so this plan stays focused on architecture and scope.

## Constraints

Keep the site deployable as plain static files. Configuration is provided by JavaScript files loaded before the page behavior, so every page also works when opened directly with `file://`. Portrait previews and printing work locally. Do not add frameworks, packages, build tools, backend services, authentication, APIs, persistence, dating features, or matchmaking behavior. Final branding and visual direction remain open for future refinement.
