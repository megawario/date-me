/**
 * Date-me swipe interaction.
 *
 * The cards are content-first HTML and remain readable without JavaScript.
 * JavaScript adds dragging, buttons, feedback, and card-stack progression.
 */

document.documentElement.classList.add('js');

const deck = document.querySelector('.swipe-deck');
const cards = deck ? [...deck.querySelectorAll('.swipe-card')] : [];
const controls = [...document.querySelectorAll('[data-swipe-direction]')];
const feedback = document.querySelector('.swipe-feedback');
const completeMessage = document.querySelector('.swipe-complete');
const resetButton = document.querySelector('.button--reset');
const currentYear = document.querySelector('#current-year');

let activeIndex = 0;
let pointerState = null;
let isAnimating = false;

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

function activeCard() {
  return cards[activeIndex];
}

function updateStack() {
  cards.forEach((card, index) => {
    const distance = index - activeIndex;
    const isCurrent = distance === 0;
    const isVisible = distance >= 0 && distance < 3;

    card.setAttribute('aria-hidden', String(!isCurrent));
    card.style.zIndex = String(cards.length - distance);
    card.style.opacity = isVisible ? '1' : '0';
    card.style.pointerEvents = isCurrent ? 'auto' : 'none';

    if (isCurrent) {
      card.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
    } else if (distance > 0) {
      card.style.transform = `translate3d(0, ${Math.min(distance * 0.8, 1.6)}rem, 0) scale(${1 - distance * 0.04})`;
    }
  });
}

function showFeedback(direction) {
  if (!feedback) return;

  const icon = feedback.querySelector('.swipe-feedback__icon');
  const message = feedback.querySelector('.swipe-feedback__message');
  const isLike = direction === 'right';

  feedback.classList.toggle('is-nope', !isLike);
  feedback.classList.remove('is-visible');
  icon.textContent = isLike ? '+1' : ':(';
  message.textContent = isLike ? 'Good sign.' : 'A tragic development.';
  requestAnimationFrame(() => feedback.classList.add('is-visible'));
}

function completeSwipe(direction) {
  const card = activeCard();
  if (!card || isAnimating) return;

  isAnimating = true;
  const sign = direction === 'right' ? 1 : -1;
  card.classList.add(`is-swiped-${direction === 'right' ? 'right' : 'left'}`);
  card.style.transform = `translate3d(${sign * 125}vw, 0, 0) rotate(${sign * 25}deg)`;
  showFeedback(direction);

  window.setTimeout(() => {
    activeIndex += 1;
    isAnimating = false;

    if (activeIndex >= cards.length) {
      cards.forEach((item) => {
        item.style.display = 'none';
      });
      if (completeMessage) completeMessage.hidden = false;
      return;
    }

    updateStack();
  }, 320);
}

function resetCardPosition(card) {
  card.classList.remove('is-dragging');
  card.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
  card.querySelector('.swipe-card__decision--like').style.opacity = '0';
  card.querySelector('.swipe-card__decision--nope').style.opacity = '0';
}

function handlePointerDown(event) {
  const card = activeCard();
  if (!card || isAnimating) return;

  pointerState = {
    card,
    startX: event.clientX,
    currentX: event.clientX,
  };
  card.classList.add('is-dragging');
  card.setPointerCapture(event.pointerId);
}

function handlePointerMove(event) {
  if (!pointerState) return;

  const { card, startX } = pointerState;
  const distance = event.clientX - startX;
  const progress = Math.min(Math.abs(distance) / 150, 1);
  const likeDecision = card.querySelector('.swipe-card__decision--like');
  const nopeDecision = card.querySelector('.swipe-card__decision--nope');

  pointerState.currentX = event.clientX;
  card.style.transform = `translate3d(${distance}px, ${Math.abs(distance) * 0.025}px, 0) rotate(${distance * 0.055}deg)`;
  likeDecision.style.opacity = distance > 0 ? String(progress) : '0';
  nopeDecision.style.opacity = distance < 0 ? String(progress) : '0';
}

function handlePointerUp(event) {
  if (!pointerState) return;

  const { card, startX } = pointerState;
  const distance = event.clientX - startX;
  pointerState = null;
  card.releasePointerCapture(event.pointerId);

  if (Math.abs(distance) >= 100) {
    completeSwipe(distance > 0 ? 'right' : 'left');
  } else {
    resetCardPosition(card);
  }
}

function resetDeck() {
  activeIndex = 0;
  isAnimating = false;
  cards.forEach((card) => {
    card.style.display = '';
    card.classList.remove('is-swiped-left', 'is-swiped-right', 'is-dragging');
    card.querySelector('.swipe-card__decision--like').style.opacity = '0';
    card.querySelector('.swipe-card__decision--nope').style.opacity = '0';
  });
  if (completeMessage) completeMessage.hidden = true;
  if (feedback) {
    feedback.classList.remove('is-visible', 'is-nope');
    feedback.querySelector('.swipe-feedback__icon').textContent = '';
    feedback.querySelector('.swipe-feedback__message').textContent = 'Swipe a card to make your decision.';
  }
  updateStack();
}

if (deck) {
  deck.addEventListener('pointerdown', handlePointerDown);
  deck.addEventListener('pointermove', handlePointerMove);
  deck.addEventListener('pointerup', handlePointerUp);
  deck.addEventListener('pointercancel', handlePointerUp);
}

controls.forEach((control) => {
  control.addEventListener('click', () => completeSwipe(control.dataset.swipeDirection));
});

if (resetButton) resetButton.addEventListener('click', resetDeck);

updateStack();
