(() => {
  const wall = document.querySelector('.rollout-wall');
  if (!wall) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pauseButton = document.querySelector('.wall-pause');
  let paused = reduce.matches;
  let visible = false;
  const wallVideos = [...wall.querySelectorAll('video')];
  const players = [...document.querySelectorAll('.paired-video')];
  const hydrate = video => {
    if (!video.dataset.src) return;
    video.src = video.dataset.src;
    delete video.dataset.src;
    video.load();
  };
  const updateWall = () => {
    const active = visible && !paused && !document.hidden;
    wallVideos.forEach(video => {
      if (active) {
        hydrate(video);
        video.play().catch(() => { /* The poster remains available if autoplay is blocked. */ });
      } else video.pause();
    });
    pauseButton.textContent = paused ? 'Play wall' : 'Pause wall';
    pauseButton.setAttribute('aria-pressed', String(paused));
  };
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    updateWall();
  }, { threshold: .05 }).observe(wall);
  pauseButton.addEventListener('click', () => { paused = !paused; updateWall(); });
  reduce.addEventListener('change', event => { paused = event.matches; updateWall(); });
  document.addEventListener('visibilitychange', updateWall);
  const playerObserver = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) hydrate(target);
      else target.pause();
    });
  }, { rootMargin: '100px 0px' });
  players.forEach(video => {
    playerObserver.observe(video);
    video.addEventListener('play', () => {
      players.forEach(other => { if (other !== video) other.pause(); });
      // Keep the comparison in focus instead of competing with the wall.
      if (!paused) { paused = true; updateWall(); }
    });
  });
  document.querySelectorAll('[data-wall-case]').forEach(button => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.wallCase);
      document.querySelectorAll('[data-wall-case]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      wallVideos.forEach(video => {
        const slug = video.dataset.event + '-' + index;
        video.pause();
        video.removeAttribute('src');
        video.poster = 'assets/demos/' + slug + '-wall.webp';
        video.dataset.src = 'assets/demos/' + slug + '-wall.mp4';
        video.load();
        video.closest('a').dataset.showDemo = slug;
      });
      updateWall();
    });
  });
  document.querySelectorAll('[data-demo-case]').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.event-card');
      const video = card.querySelector('video');
      const wasPlaying = !video.paused;
      card.querySelectorAll('[data-demo-case]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
      video.pause();
      video.removeAttribute('src');
      video.poster = 'assets/demos/' + button.dataset.demoCase + '-poster.webp';
      video.dataset.src = 'assets/demos/' + button.dataset.demoCase + '.mp4';
      card.querySelector('[data-download]').href = video.dataset.src;
      hydrate(video);
      if (wasPlaying) video.play().catch(() => {});
    });
  });
  wall.querySelectorAll('[data-show-demo]').forEach(tile => {
    tile.addEventListener('click', () => {
      document.querySelector('[data-demo-case="' + tile.dataset.showDemo + '"]')?.click();
    });
  });
  const requested = new URLSearchParams(location.search).get('demo');
  if (requested && /^[a-z0-9-]+$/.test(requested)) {
    document.querySelector('[data-demo-case="' + requested + '"]')?.click();
  }
  updateWall();
})();
