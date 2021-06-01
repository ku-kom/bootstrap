/* Based on https://codepen.io/tutsplus/pen/wvoNoMg - modified by NEL, KU KOM.
  Animate elements on scroll. Add class "js-scroll" to the element as well as either "fade-in", "fade-in-bottom", "slide-left" or "slide-right".
*/
const scrollElements = document.querySelectorAll('.js-scroll');

var throttleTimer;

const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
}

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
  element.classList.add('scrolled');
};

const hideScrollElement = (element) => {
  element.classList.remove('scrolled');
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

window.addEventListener('scroll', () => {
  throttle(() => {
    handleScrollAnimation();
  }, 200);
});

window.addEventListener('orientationchange', () => {
  throttle(() => {
    handleScrollAnimation();
  }, 200);
});
