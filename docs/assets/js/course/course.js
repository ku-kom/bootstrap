/**
 * Scripts for EVU courses
 */

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  /**
   * Break if functions don't exist
   */
  if (typeof debounce !== 'function' && typeof throttle !== 'function') {
    return;
  }

  const isDesktop = window.matchMedia('(min-width: 992px)').matches;
  const watcher = document.querySelector('.evu-sticky-watcher');

  /**
   * Break if sticky element doesn't exist
   */
  if (watcher === null) {
    return;
  }

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

  /**
   * Add heading semantics to branding image heading if no h1 on page
   */
  const addHeading = () => {
    if (!document.querySelectorAll('h1').length) {
      const ariaHeading = document.querySelector('.ku-branding-text-major');
      if (ariaHeading) {
        ariaHeading.setAttribute('role', 'heading');
        ariaHeading.setAttribute('aria-level', '1');
      }
    }
  }

  /**
   * Reload Open Street Maps due to a bug
   */
  const reloadOpenStreetMap = (id) => {
    let buggyid = document.getElementById(id);
    if (buggyid) {
      buggyid.src = buggyid.src;
    }
  };

  addHeading();

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
