/**
 * Date-a-Mario progressive enhancement.
 *
 * Each profile owns a variable-length, vertically scrollable card sequence.
 * JavaScript adds horizontal swiping between profiles; decisions stay in
 * memory and are never stored or sent.
 */

document.documentElement.classList.add('js');

document.querySelectorAll('[data-current-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

const deck = document.querySelector('[data-profile-deck]');

if (deck) {
  const profiles = [...deck.querySelectorAll('[data-profile-index]')];
  const decisionLayer = deck.querySelector('[data-swipe-decision]');
  const decisionLabel = decisionLayer?.querySelector('[data-swipe-decision-label]');
  const feedbackRegion = document.querySelector('[data-swipe-feedback]');
  const feedback = feedbackRegion?.querySelector('.swipe-feedback__message');
  const completePanel = document.querySelector('[data-profile-complete]');
  const resetButton = document.querySelector('[data-reset-deck]');
  const activeProfile = document.querySelector('[data-active-profile]');
  const profileTotal = document.querySelector('[data-profile-total]');

  let activeIndex = 0;
  let pointerState = null;
  let isAnimating = false;
  const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  if (profileTotal) profileTotal.textContent = String(profiles.length);

  function currentProfile() {
    return profiles[activeIndex];
  }

  function clearDecisionLayer() {
    if (!decisionLayer) return;
    decisionLayer.classList.remove('is-like', 'is-nope');
    decisionLayer.style.opacity = '0';
    if (decisionLabel) decisionLabel.textContent = '';
  }

  function showDecisionLayer(direction, progress = 1) {
    if (!decisionLayer || !decisionLabel) return;
    const isLike = direction === 'right';
    decisionLayer.classList.toggle('is-like', isLike);
    decisionLayer.classList.toggle('is-nope', !isLike);
    decisionLayer.style.opacity = String(Math.max(0, Math.min(progress, 1)));
    decisionLabel.textContent = isLike ? 'Yes' : 'Next';
  }

  function updateStack() {
    profiles.forEach((profile, index) => {
      const distance = index - activeIndex;
      const isCurrent = distance === 0;

      profile.setAttribute('aria-hidden', String(!isCurrent));
      profile.style.zIndex = isCurrent ? '2' : '0';
      profile.style.pointerEvents = isCurrent ? 'auto' : 'none';

      if (isCurrent) {
        profile.style.opacity = '1';
        profile.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
      } else {
        profile.style.opacity = '0';
        profile.style.transform = 'translate3d(0, 0, 0)';
      }
    });

    clearDecisionLayer();
    if (activeProfile) activeProfile.textContent = String(activeIndex + 1);
  }

  function showFeedback(direction) {
    if (!feedback) return;
    feedback.textContent = direction === 'right'
      ? 'A promising Mario. Moving on…'
      : 'Not this Mario. Continuing the search…';
  }

  function finishDeck() {
    deck.hidden = true;
    if (feedbackRegion) feedbackRegion.hidden = true;
    if (completePanel) completePanel.hidden = false;
    if (activeProfile) activeProfile.textContent = String(profiles.length);
    completePanel?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  }

  function completeSwipe(direction) {
    const profile = currentProfile();
    if (!profile || isAnimating) return;

    isAnimating = true;
    const sign = direction === 'right' ? 1 : -1;

    showDecisionLayer(direction);
    profile.classList.add(`is-swiped-${direction === 'right' ? 'right' : 'left'}`);
    profile.style.transform = `translate3d(${sign * 125}vw, 0, 0) rotate(${sign * 24}deg)`;
    showFeedback(direction);

    window.setTimeout(() => {
      activeIndex += 1;
      isAnimating = false;

      if (activeIndex >= profiles.length) {
        finishDeck();
        return;
      }

      updateStack();
    }, 320);
  }

  function resetProfilePosition(profile) {
    profile.classList.remove('is-dragging');
    profile.style.transform = 'translate3d(0, 0, 0) rotate(0deg)';
    clearDecisionLayer();
  }

  function handlePointerDown(event) {
    const profile = currentProfile();
    if (!profile || isAnimating || event.button !== 0) return;

    pointerState = {
      profile,
      pointerId: event.pointerId,
      startX: event.clientX,
      currentX: event.clientX,
    };
    profile.classList.add('is-dragging');
    profile.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!pointerState || event.pointerId !== pointerState.pointerId) return;

    const { profile, startX } = pointerState;
    const distance = event.clientX - startX;
    const progress = Math.min(Math.abs(distance) / 140, 1);

    pointerState.currentX = event.clientX;
    profile.style.transform = `translate3d(${distance}px, ${Math.abs(distance) * 0.025}px, 0) rotate(${distance * 0.05}deg)`;
    if (Math.abs(distance) > 4) {
      showDecisionLayer(distance > 0 ? 'right' : 'left', progress);
    } else {
      clearDecisionLayer();
    }
  }

  function handlePointerUp(event) {
    if (!pointerState || event.pointerId !== pointerState.pointerId) return;

    const { profile, startX, currentX, pointerId } = pointerState;
    const endX = Number.isFinite(event.clientX) ? event.clientX : currentX;
    const distance = endX - startX;
    pointerState = null;

    if (profile.hasPointerCapture(pointerId)) profile.releasePointerCapture(pointerId);
    profile.classList.remove('is-dragging');

    if (Math.abs(distance) >= 95) {
      completeSwipe(distance > 0 ? 'right' : 'left');
    } else {
      resetProfilePosition(profile);
    }
  }

  function cancelPointer(event) {
    if (!pointerState || event.pointerId !== pointerState.pointerId) return;
    const { profile, pointerId } = pointerState;
    pointerState = null;
    if (profile.hasPointerCapture(pointerId)) profile.releasePointerCapture(pointerId);
    resetProfilePosition(profile);
  }

  function scrollCurrentProfile(direction) {
    const scroller = currentProfile()?.querySelector('[data-profile-cards]');
    if (!scroller) return;
    scroller.scrollBy({ top: direction * scroller.clientHeight, behavior: scrollBehavior });
  }

  function resetDeck() {
    activeIndex = 0;
    pointerState = null;
    isAnimating = false;

    profiles.forEach((profile) => {
      profile.classList.remove('is-swiped-left', 'is-swiped-right', 'is-dragging');
      const scroller = profile.querySelector('[data-profile-cards]');
      if (scroller) scroller.scrollTop = 0;
    });

    deck.hidden = false;
    if (feedbackRegion) feedbackRegion.hidden = false;
    if (completePanel) completePanel.hidden = true;
    if (feedback) feedback.textContent = 'Swipe left or right when you are ready.';
    clearDecisionLayer();
    updateStack();
    deck.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: scrollBehavior });
  }

  deck.addEventListener('pointerdown', handlePointerDown);
  deck.addEventListener('pointermove', handlePointerMove);
  deck.addEventListener('pointerup', handlePointerUp);
  deck.addEventListener('pointercancel', cancelPointer);
  deck.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      completeSwipe(event.key === 'ArrowRight' ? 'right' : 'left');
    }

    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      scrollCurrentProfile(1);
    }

    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      scrollCurrentProfile(-1);
    }
  });

  resetButton?.addEventListener('click', resetDeck);
  updateStack();
}
