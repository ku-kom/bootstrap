/**
 * Scripts for EVU courses
 */

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  /**
   * Check if functions exist
   */
  if (typeof debounce !== 'function' && typeof throttle !== 'function') {
    return;
  }

  const isDesktop = window.matchMedia('(min-width: 992px)').matches;
  const watcher = document.querySelector('.evu-sticky-watcher');
  /**
   * Observe element to make it sticky
   */
  const createObserver = () => {
    const config = {
      root: null,
      trackVisibility: true,
      delay: 100,
      threshold: [.9]
    }

    const handler = (entries) => {
      entries.forEach((entry) => {
        entry.target.nextElementSibling.classList.toggle('sticky', !entry.isIntersecting && window.scrollY >= entry.boundingClientRect.top);
      })
    }

    if (isDesktop && 'IntersectionObserver' in window) {
      const observer = new window.IntersectionObserver(handler, config);
      observer.observe(watcher);

    }
  };

  const reloadOpenStreetMap = (id) => {
    let buggyid = document.getElementById(id);
    buggyid.src = buggyid.src;
  };

  window.addEventListener('load', () => {
    createObserver();
    setTimeout(reloadOpenStreetMap, 500, 'map');
  }, false);

  window.addEventListener('scroll', throttle(() => {
    createObserver();
  }, {
    capture: true,
    passive: true
  }, 200));

  ['orientationchange', 'resize'].forEach(debounce((e) => {
    createObserver();
  }, 150));

}, false);
