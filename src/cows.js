(() => {
  const layer = document.querySelector('.shooting-star-layer');
  if (!layer) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  let starTimer;

  function stopStars() {
    window.clearTimeout(starTimer);
    layer.replaceChildren();
  }

  function spawnStar() {
    if (document.hidden || reducedMotion.matches) return;

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
    if (!document.hidden && !reducedMotion.matches) {
      starTimer = window.setTimeout(spawnStar, 900);
    }
  }

  document.addEventListener('visibilitychange', restartStars);
  reducedMotion.addEventListener('change', restartStars);
  window.addEventListener('pagehide', stopStars);
  window.addEventListener('pageshow', restartStars);
  restartStars();
})();
