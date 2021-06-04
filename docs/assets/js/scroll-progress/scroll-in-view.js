/* NEL, KU KOM. 2021.
  Animate elements on scroll. Add class "js-scroll" to the element as well as either "fade-in", "fade-in-bottom", "slide-left" or "slide-right".

  Usage:
  var el = new AnimateOnScroll({
      element: ".js-scroll, .another-element",
  });
*/
function AnimateOnScroll(options) {
  'use strict';

  var defaultOptions = {
    element: '.js-scroll',
  }

  // Extend user-defined options, otherwise default options.
  options = Object.assign({}, defaultOptions, options);

  const scrollElements = document.querySelectorAll(options.element);

  const isElementXPercentInViewport = function(element, percentVisible) {
    // Check if an element is partially in view.
    // percentVisible is how much of the element is visible before we return true.
    let
      rect = element.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);

    return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / + -rect.height) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
    )
  };

  const displayScrollElement = (element) => {
    element.classList.add('in-view');
  };

  const hideScrollElement = (element) => {
    element.classList.remove('in-view');
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (isElementXPercentInViewport(el, 4)) { // Element is 4% visible...
        displayScrollElement(el);
      } else {
        hideScrollElement(el)
      }
    })
  }

  window.addEventListener('load', () => {
    handleScrollAnimation();
  });

  // debounce() is a global helper function
  window.addEventListener('scroll', debounce(() => {
    handleScrollAnimation();
  }, 100));

  // debounce() is a global helper function
  window.addEventListener('orientationchange', debounce(() => {
    handleScrollAnimation();
  }, 150));
}
