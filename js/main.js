/**
 * Date-a-Mario progressive enhancement.
 *
 * Profile content is loaded from data/profiles.json and rendered as a
 * variable-length card sequence. Decisions stay in memory and are never
 * stored or sent.
 */

document.documentElement.classList.add('js');

document.querySelectorAll('[data-current-year]').forEach((year) => {
  year.textContent = String(new Date().getFullYear());
});

const deck = document.querySelector('[data-profile-deck]');

if (deck && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

function resetScrollPositions() {
  window.scrollTo(0, 0);
  document.querySelectorAll('[data-profile-cards]').forEach((scroller) => {
    scroller.scrollTop = 0;
  });
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function createImage(card) {
  const image = document.createElement('img');
  image.src = card.image;
  image.alt = card.imageAlt;
  image.loading = 'lazy';
  image.decoding = 'async';
  image.draggable = false;
  if (card.imagePosition) image.style.objectPosition = card.imagePosition;
  return image;
}

function createCardPrompt(isFinalCard) {
  const prompt = createTextElement(
    'p',
    'profile-card__more',
    isFinalCard ? 'Left or right?' : 'Scroll for more ',
  );

  if (!isFinalCard) {
    const arrow = createTextElement('span', '', '↓');
    arrow.setAttribute('aria-hidden', 'true');
    prompt.append(arrow);
  }

  return prompt;
}

function renderProfileCard(card, isFinalCard) {
  const section = document.createElement('section');
  section.className = 'profile-card profile-card--profile';
  section.dataset.cardType = 'profile';

  const visual = document.createElement('div');
  visual.className = 'profile-card__visual';

  if (card.image) {
    visual.classList.add('profile-card__visual--photo');
    visual.append(createImage(card));
  } else {
    visual.setAttribute('role', 'img');
    visual.setAttribute('aria-label', card.imageAlt);
    const monogram = createTextElement('span', 'profile-card__monogram', card.name.charAt(0));
    monogram.setAttribute('aria-hidden', 'true');
    visual.append(monogram);
  }

  const body = document.createElement('div');
  body.className = 'profile-card__body';
  body.append(createTextElement('p', 'profile-card__type', card.callsign));

  const heading = createTextElement('h2', '', `${card.name} `);
  heading.append(createTextElement('span', '', card.age));
  body.append(heading);
  body.append(createTextElement('p', '', card.catchphrase));

  const tags = document.createElement('ul');
  tags.className = 'profile-tags';
  tags.setAttribute('aria-label', 'Interests');
  card.tags.forEach((tag) => tags.append(createTextElement('li', '', tag)));
  body.append(tags, createCardPrompt(isFinalCard));
  section.append(visual, body);

  return section;
}

function renderTextCard(card, headingId, isFinalCard) {
  const section = document.createElement('section');
  section.className = 'profile-card profile-card--text';
  section.dataset.cardType = 'text';
  section.setAttribute('aria-labelledby', headingId);

  const content = document.createElement('div');
  content.className = 'text-card__content';
  content.append(createTextElement('p', 'profile-card__type', card.callsign));

  const heading = createTextElement('h2', '', card.heading);
  heading.id = headingId;
  content.append(heading, createTextElement('p', '', card.body));
  section.append(content, createCardPrompt(isFinalCard));

  return section;
}

function renderImageTextCard(card, headingId, isFinalCard) {
  const section = document.createElement('section');
  section.className = 'profile-card profile-card--image-text';
  section.dataset.cardType = 'image-text';
  section.setAttribute('aria-labelledby', headingId);
  section.append(createImage(card));

  const copy = document.createElement('div');
  copy.className = 'profile-card__image-copy';
  copy.append(createTextElement('p', 'profile-card__type', card.callsign));

  const heading = createTextElement('h2', '', card.heading);
  heading.id = headingId;
  copy.append(heading, createTextElement('p', '', card.body));
  section.append(copy, createCardPrompt(isFinalCard));

  return section;
}

function renderImageCard(card, profileName, isFinalCard) {
  const section = document.createElement('section');
  section.className = 'profile-card profile-card--image';
  section.dataset.cardType = 'image';
  section.setAttribute('aria-label', `${profileName} image card`);
  section.append(createImage(card), createCardPrompt(isFinalCard));
  return section;
}

function renderSpotifyCard(card, headingId, isFinalCard) {
  const embedUrl = new URL(card.embedUrl);
  const isSupportedEmbed = embedUrl.origin === 'https://open.spotify.com'
    && /^\/embed\/(track|album|artist)\/[^/]+\/?$/.test(embedUrl.pathname);

  if (!isSupportedEmbed) {
    throw new Error(`Unsupported Spotify embed URL: ${card.embedUrl}`);
  }

  const section = document.createElement('section');
  section.className = 'profile-card profile-card--spotify';
  section.dataset.cardType = 'spotify';
  section.setAttribute('aria-labelledby', headingId);

  const player = document.createElement('div');
  player.className = 'spotify-card__player';

  const iframe = document.createElement('iframe');
  iframe.src = embedUrl.toString();
  iframe.title = card.title;
  iframe.loading = 'lazy';
  iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  iframe.setAttribute('allowfullscreen', '');

  const configuredHeight = Number(card.height);
  const defaultHeight = embedUrl.pathname.includes('/artist/') ? 420 : 380;
  const embedHeight = Number.isFinite(configuredHeight)
    ? Math.min(480, Math.max(300, configuredHeight))
    : defaultHeight;
  iframe.style.setProperty('--spotify-embed-height', `${embedHeight}px`);

  player.append(iframe);

  const copy = document.createElement('div');
  copy.className = 'spotify-card__copy';
  if (card.callsign) copy.append(createTextElement('p', 'profile-card__type', card.callsign));

  const heading = createTextElement('h2', '', card.heading || card.title);
  heading.id = headingId;
  copy.append(heading);
  if (card.body) copy.append(createTextElement('p', '', card.body));

  section.append(player, copy, createCardPrompt(isFinalCard));
  return section;
}

function renderCard(card, profile, cardIndex) {
  const headingId = `${profile.id}-card-${cardIndex}-heading`;
  const isFinalCard = cardIndex === profile.cards.length - 1;

  if (card.type === 'profile') return renderProfileCard(card, isFinalCard);
  if (card.type === 'text') return renderTextCard(card, headingId, isFinalCard);
  if (card.type === 'image-text') return renderImageTextCard(card, headingId, isFinalCard);
  if (card.type === 'image') return renderImageCard(card, profile.name, isFinalCard);
  if (card.type === 'spotify') return renderSpotifyCard(card, headingId, isFinalCard);
  throw new Error(`Unsupported card type: ${card.type}`);
}

function renderProfiles(configuration) {
  const status = deck.querySelector('[data-profile-status]');
  const fragment = document.createDocumentFragment();
  const profiles = [...configuration.profiles];

  if (configuration.shuffleProfiles) {
    profiles.sort(() => Math.random() - 0.5);
  }

  profiles.forEach((profile, profileIndex) => {
    const sequence = document.createElement('article');
    sequence.className = 'profile-sequence';
    sequence.dataset.profileIndex = String(profileIndex);
    sequence.setAttribute('aria-label', `${profile.name} profile`);
    sequence.style.setProperty('--profile-color', profile.accentColor);

    const cards = document.createElement('div');
    cards.className = 'profile-sequence__scroll';
    cards.dataset.profileCards = '';
    cards.tabIndex = -1;
    cards.setAttribute('aria-label', `${profile.name} cards`);
    profile.cards.forEach((card, cardIndex) => {
      cards.append(renderCard(card, profile, cardIndex));
    });

    sequence.append(cards);
    fragment.append(sequence);
  });

  deck.insertBefore(fragment, status);
  status.remove();
}

function initializeDeck() {
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

  resetScrollPositions();
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
      const isCurrent = index === activeIndex;
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

  resetButton?.addEventListener('click', () => {
    resetScrollPositions();
    window.location.replace('profiles.html');
  });
  updateStack();
}

if (deck) {
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    resetScrollPositions();
    window.location.reload();
  });

  fetch('data/profiles.json')
    .then((response) => response.json())
    .then((configuration) => {
      renderProfiles(configuration);
      initializeDeck();
    })
    .catch(() => {
      const status = deck.querySelector('[data-profile-status]');
      if (status) status.textContent = 'The profiles could not be loaded.';
    });
}
