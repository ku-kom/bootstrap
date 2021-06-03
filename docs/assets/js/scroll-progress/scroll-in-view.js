/*global debounce */
/* NEL, KU KOM.
  Animate elements on scroll. Add class "js-scroll" to the element as well as either "fade-in", "fade-in-bottom", "slide-left" or "slide-right".
  Not compatible with IE11.
  Usage:
  var el = new AnimateOnScroll({
      element: ".js-scroll, .another-element",
  });
*/
function AnimateOnScroll(options) {
  'use strict';

  //let _this = this;
  var defaultOptions = {
    element: '.js-scroll',
  }

  // Use user-defined options, otherwise default options.
  options = Object.assign({}, defaultOptions, options);

  const scrollElements = document.querySelectorAll(options.element);

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;

    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;
    const bounding = el.getBoundingClientRect();
    return (
      elementTop > (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  const displayScrollElement = (element) => {
    element.classList.add('in-view');
  };

  const hideScrollElement = (element) => {
    element.classList.remove('in-view');
  };

  const isElementXPercentInViewport = function(element, percentVisible) {
    let
      rect = element.getBoundingClientRect(),
      windowHeight = (window.innerHeight || document.documentElement.clientHeight);

    return !(
      Math.floor(100 - (((rect.top >= 0 ? 0 : rect.top) / + -rect.height) * 100)) < percentVisible ||
      Math.floor(100 - ((rect.bottom - windowHeight) / rect.height) * 100) < percentVisible
    )
  };

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      // if (elementInView(el, 1.25)) {
      //   displayScrollElement(el);
      // } else if (elementOutofView(el)) {
      //   hideScrollElement(el)
      // }

      if (isElementXPercentInViewport(el, 75)) {
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
  }, 150));

  // debounce() is a global helper function
  window.addEventListener('orientationchange', debounce(() => {
    handleScrollAnimation();
  }, 200));
}
