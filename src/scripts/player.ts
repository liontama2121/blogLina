/** Reproductor de entrevistas: cada [data-cue] carga su video en [data-player-video]. */
export function initPlayer() {
  document.querySelectorAll<HTMLElement>('[data-player]').forEach((root) => {
    const video = root.querySelector<HTMLVideoElement>('[data-player-video]');
    const cues = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-cue]'));
    if (!video) return;
    // Duotono mientras está quieto; color real al reproducir.
    const frame = root.querySelector<HTMLElement>('[data-player-frame]');
    video.addEventListener('play', () => frame?.classList.add('playing'));
    video.addEventListener('pause', () => frame?.classList.remove('playing'));
    for (const cue of cues) {
      cue.addEventListener('click', () => {
        cues.forEach((c) => c.setAttribute('aria-current', String(c === cue)));
        const label = cue.querySelector('[data-i18n]')?.textContent?.trim();
        if (label) video.setAttribute('aria-label', label);
        video.src = cue.dataset.cue!;
        video.play().catch(() => {});
        // En móvil la lista va debajo: lleva el reproductor a la vista.
        if (window.matchMedia('(max-width: 1023px)').matches) {
          video.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  });
}
