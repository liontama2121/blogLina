/** Reproduce reels inline al hacer click; pausa los demás. */
export function initReels() {
  const reels = Array.from(document.querySelectorAll<HTMLElement>('[data-reel]'));

  function pauseAll(except?: HTMLVideoElement) {
    reels.forEach((r) => {
      const v = r.querySelector<HTMLVideoElement>('.reel-video');
      if (v && v !== except && !v.paused) {
        v.pause();
        r.classList.remove('playing');
        const btn = r.querySelector<HTMLElement>('.reel-play');
        if (btn) btn.style.opacity = '1';
      }
    });
  }

  for (const reel of reels) {
    const video = reel.querySelector<HTMLVideoElement>('.reel-video');
    const playBtn = reel.querySelector<HTMLElement>('.reel-play');
    if (!video || !playBtn) continue;

    playBtn.addEventListener('click', () => {
      if (video.paused) {
        pauseAll(video);
        try { video.currentTime = 0; } catch {}
        video.muted = false;
        video.controls = true;
        video.play().catch(() => {
          // autoplay con sonido bloqueado: reintenta en silencio
          video.muted = true;
          video.play().catch(() => {});
        });
        reel.classList.add('playing');
        playBtn.style.opacity = '0';
        playBtn.style.pointerEvents = 'none';
      }
    });

    video.addEventListener('pause', () => {
      if (video.currentTime > 0 && !video.ended) return;
      playBtn.style.opacity = '1';
      playBtn.style.pointerEvents = '';
    });
    video.addEventListener('ended', () => {
      video.controls = false;
      playBtn.style.opacity = '1';
      playBtn.style.pointerEvents = '';
      reel.classList.remove('playing');
    });
  }
}
