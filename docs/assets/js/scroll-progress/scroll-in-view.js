/* NEL, KU KOM. 2021.
  Animate elements on scroll. Add class "js-scroll" to the element as well as either "fade-in", "fade-in-bottom", "slide-left" or "slide-right".

  Usage:
  var el = new AnimateOnScroll({
      element: ".js-scroll, .another-element",
      visible: 4 // Optional - probably not necessary to change: Percent scroll passed element before stuff happens
  });
*/
function AnimateOnScroll(options = {}) {
  'use strict';

  const defaults = {
    element: '.js-scroll',
    visible: 4
  }

  // Extend user-defined options, otherwise use default options.
  options = Object.assign({}, defaults, options);

  const scrollElements = document.querySelectorAll(options.element);

  const isElementXPercentInViewport = function(element, percentVisible) {
    // Returns true if an element is partially in view by a percentage.
    let rect = element.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);

    return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / + -rect.height) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
    )
  };

  const displayScrollElement = (element) => {
    element.classList.add('js-in-view');
  };

  const hideScrollElement = (element) => {
    element.classList.remove('js-in-view');
  };

  const handleScroll = () => {
    scrollElements.forEach((el) => {
      if (isElementXPercentInViewport(el, options.visible)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el)
      }
    })
  }

  window.addEventListener('load', () => {
    handleScroll();
  });

  // throttle() is a global helper function
  window.addEventListener('scroll', throttle(() => {
    handleScroll();
  }, 100));

  // debounce() is a global helper function
  window.addEventListener('orientationchange', debounce(() => {
    handleScroll();
  }, 150));
}
