// This file contains scroll progress functionality.
// Note: Include parallax.min.css along with this script.

// Fixes jumpy scroll in IE11 by disabling smooth scroll
if (navigator.userAgent.match(/Trident\/7\./)) {
  document.body.addEventListener('mousewheel', function(event) {
    event.preventDefault();
    var wd = event.wheelDelta;
    var po = window.pageYOffset;
    window.scrollTo(0, po - wd);
  });
  document.body.addEventListener('keydown', function(e) {
    var currentScrollPosition = window.pageYOffset;
    switch (e.which) {
      case 33: // page up
        e.preventDefault(); // prevent the default action (scroll / move caret)
        window.scrollTo(0, currentScrollPosition - 600);
        break;
      case 34: // page down
        e.preventDefault(); // prevent the default action (scroll / move caret)
        window.scrollTo(0, currentScrollPosition + 600);
        break;
      case 38: // up
        e.preventDefault(); // prevent the default action (scroll / move caret)
        window.scrollTo(0, currentScrollPosition - 120);
        break;
      case 40: // down
        e.preventDefault(); // prevent the default action (scroll / move caret)
        window.scrollTo(0, currentScrollPosition + 120);
        break;
      default:
        return; // exit this handler for other keys
    }
  });
}
