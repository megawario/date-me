/**
 * Minimal progressive-enhancement scaffold.
 *
 * The page is intentionally fully usable without JavaScript. Future phases
 * can add behavior here without changing the document's core structure.
 */

document.documentElement.classList.add('js');

const currentYear = document.querySelector('#current-year');

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
