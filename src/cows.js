(() => {
  const layer = document.querySelector('.shooting-star-layer');
  const wishButton = document.querySelector('.wish-button');
  const wishPrompt = document.querySelector('.wish-prompt');
  const dialogue = document.querySelector('.wish-dialogue');
  const announcement = document.querySelector('.wish-announcement');
  const cow = document.querySelector('.jumping-cow');
  if (!layer || !wishButton || !wishPrompt || !dialogue || !announcement || !cow) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  let starTimer;
  let wishTimer;
  let state = 'idle';
  let restoreButtonFocus = false;
  const wish = 'I wish to see a cow jump over the moon.';

  function stopStars() {
    window.clearTimeout(starTimer);
    layer.replaceChildren();
  }

  function spawnStar() {
    if (state !== 'idle' || document.hidden || reducedMotion.matches) return;

    const position = document.createElementNS(svgNamespace, 'g');
    // Enter from beyond the top or left edge; the entire trail starts offscreen.
    const entersFromLeft = Math.random() < 0.5;
    const startX = entersFromLeft ? -12 : Math.floor(12 + Math.random() * 184);
    const startY = entersFromLeft ? Math.floor(Math.random() * 12) : -16;
    position.setAttribute('transform', `translate(${startX} ${startY})`);

    const star = document.createElementNS(svgNamespace, 'g');
    star.classList.add('shooting-star');

    // A long, tapered pixel trail follows the flight's shallow diagonal.
    for (let index = 11; index >= 0; index -= 1) {
      const pixel = document.createElementNS(svgNamespace, 'rect');
      pixel.setAttribute('x', String(-index * 6));
      pixel.setAttribute('y', String(-Math.round(index * 1.8)));
      pixel.setAttribute('width', index === 0 ? '2' : '5');
      pixel.setAttribute('height', index > 6 ? '1' : '2');
      pixel.setAttribute('fill', '#ffffff');
      pixel.setAttribute('opacity', String(1 - index * 0.065));
      star.append(pixel);
    }

    const halo = document.createElementNS(svgNamespace, 'path');
    halo.setAttribute('d', 'M-2 0h2v2h-2z M2 0h2v2H2z M0-2h2v2H0z M0 2h2v2H0z');
    halo.setAttribute('fill', '#ffffff');
    halo.setAttribute('opacity', '0.65');
    star.append(halo);

    position.append(star);
    layer.append(position);
    star.addEventListener('animationend', () => position.remove(), { once: true });
    starTimer = window.setTimeout(spawnStar, 2200 + Math.random() * 3000);
  }

  function restartStars() {
    stopStars();
    if (state === 'idle' && !document.hidden && !reducedMotion.matches) {
      starTimer = window.setTimeout(spawnStar, 900);
    }
  }

  function resetWish(restoreFocus = true) {
    window.clearTimeout(wishTimer);
    state = 'idle';
    cow.classList.remove('is-jumping', 'is-still');
    dialogue.hidden = true;
    dialogue.textContent = '';
    announcement.textContent = '';
    wishButton.hidden = false;
    wishPrompt.hidden = false;
    if (restoreFocus && restoreButtonFocus && document.activeElement === document.body) {
      wishButton.focus({ preventScroll: true });
    }
    restoreButtonFocus = false;
    restartStars();
  }

  function finishDialogue() {
    window.clearTimeout(wishTimer);
    state = 'reading';
    dialogue.textContent = wish;
    wishTimer = window.setTimeout(beginJump, 900);
  }

  function finishJump() {
    if (state !== 'jump') return;
    window.clearTimeout(wishTimer);
    state = 'pause';
    cow.classList.remove('is-jumping', 'is-still');
    announcement.textContent = 'Your wish came true! The cow jumped over the moon.';
    wishTimer = window.setTimeout(resetWish, 1000);
  }

  function showStillCow() {
    cow.classList.remove('is-jumping');
    cow.classList.add('is-still');
    window.clearTimeout(wishTimer);
    wishTimer = window.setTimeout(finishJump, 1800);
  }

  function beginJump() {
    state = 'jump';
    announcement.textContent = 'A cow is jumping over the moon.';
    if (reducedMotion.matches) {
      showStillCow();
    } else {
      cow.classList.add('is-jumping');
    }
  }

  cow.addEventListener('animationend', (event) => {
    if (event.animationName === 'cow-jump') finishJump();
  });

  function revealWish() {
    if (reducedMotion.matches || dialogue.textContent.length >= wish.length) {
      finishDialogue();
      return;
    }
    dialogue.textContent = wish.slice(0, dialogue.textContent.length + 1);
    wishTimer = window.setTimeout(revealWish, 45);
  }

  wishButton.addEventListener('click', () => {
    if (state !== 'idle') return;
    state = 'wish';
    restoreButtonFocus = document.activeElement === wishButton;
    stopStars();
    wishButton.hidden = true;
    wishPrompt.hidden = true;
    dialogue.hidden = false;
    dialogue.textContent = '';
    announcement.textContent = wish;
    revealWish();
  });

  document.addEventListener('visibilitychange', restartStars);
  reducedMotion.addEventListener('change', () => {
    if (state === 'wish' && reducedMotion.matches) finishDialogue();
    if (state === 'jump' && reducedMotion.matches) showStillCow();
    restartStars();
  });
  window.addEventListener('pagehide', () => {
    resetWish(false);
    stopStars();
  });
  window.addEventListener('pageshow', restartStars);
  wishButton.hidden = false;
  wishPrompt.hidden = false;
  restartStars();
})();
