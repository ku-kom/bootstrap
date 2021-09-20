/*
 * Scroll progress indicator. Adds a progress bar at the top of the page and indicates scroll progress.
 */
document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    return;
  }
  let scrollPosition = 0;
  let tick = false;

  const scrollProgress = () => {
    let progressbar = document.getElementById('horizontal-scroll');
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scroll = (winScroll / height) * 100;
    scroll = Math.round(scroll);
    progressbar.setAttribute('aria-valuenow', scroll);
    progressbar.setAttribute('aria-valuetext', 'Scroll progress: ' + scroll + '%');
    progressbar.style.setProperty('--scrollPercentage', scroll + '%');
  }


  const appendProgressbar = () => {
    let target = document.querySelector('header:first-of-type');
    let bar = document.createElement('div');
    bar.classList.add('progress', 'scroll-indicator');
    bar.innerHTML = '<div class="progress-bar" id="horizontal-scroll" role="progressbar" aria-valuetext="Scroll progress: 0%" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" tabindex="-1"></div>';
    let fragment = document.createDocumentFragment();
    fragment.appendChild(bar);
    target.appendChild(fragment);
  }

  appendProgressbar();

  window.addEventListener('scroll', () => {
    scrollPosition = window.scrollY;
    if (!tick) {
      window.requestAnimationFrame(function() {
        scrollProgress();
        let top = window.pageYOffset || document.documentElement.scrollTop;
        let el = document.querySelector('.scroll-indicator');
        // Apply class to scroll progress bar after some scroll to make it visible...
        el.classList.toggle('in-view', top > 20);
        tick = false;
      });
      tick = true;
    }
  }, {
    capture: false,
    passive: true
  });
});
