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
  // let throttleTimer;
  //
  // const throttle = (callback, time) => {
  //   if (throttleTimer) return;
  //
  //   throttleTimer = true;
  //   setTimeout(() => {
  //     callback();
  //     throttleTimer = false;
  //   }, time);
  // }

  const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;

    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
  };

  const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;

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

  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el);
      } else if (elementOutofView(el)) {
        hideScrollElement(el)
      }
    })
  }

  window.addEventListener('load', () => {
    handleScrollAnimation();
  });

  window.addEventListener('scroll', debounce(() => {
    handleScrollAnimation();
  }, 200));

  window.addEventListener('orientationchange', debounce(() => {
    handleScrollAnimation();
  }, 200));
}
