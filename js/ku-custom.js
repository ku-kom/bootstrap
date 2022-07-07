/* ========================================================================
 * Copyright 2018
 * University of Copenhagen, FA Communications
 * Important!!: Alle functions to be run must be wrapped in:
 *
 * (function($) {
 *     Execute code...
 * })(jQuery);
 *
 * ========================================================================*/
/* A note about debounce and throttle:
A debounce is utilized when you only care about the final state. For example, waiting until a user stops typing to fetch typeahead search results. A throttle is best used when you want to handle all intermediate states but at a controlled rate. For example, track the screen width as a user resizes the window and rearrange page content while it changes instead of waiting until the user has finished.
*/

function debounce(func, wait, immediate) {
  // Use to delay function init, e.g. on window resizing or input autocomplete, etc..
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing. Usage, call with time, e.g. $(window).on('resize', debounce(myFunction, 250));
  var timeout;
  return function() {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function throttle(func, wait) {
  // Execute a function only every x ms to prevent clogging up events, e.g. during scroll, API calls, etc..
  var waiting = false; // Initially, we're not waiting
  return function() { // We return a throttled function
    if (!waiting) { // If we're not waiting
      func.apply(this, arguments); // Execute users function
      waiting = true; // Prevent future invocations
      setTimeout(function() { // After a period of time
        waiting = false; // And allow future invocations
      }, wait);
    }
  }
}

function shareURL(dest) {
  // Usage, e.g.: onclick="shareURL('facebook')"

  var urlMap = {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url=',
    twitter: 'https://twitter.com/intent/tweet?&url='
  };
  // Get current url
  var url = window.location.href;
  var param = dest.toLowerCase().trim();

  var media = $.map(urlMap, function(i, e) {
    // return keys
    return e;
  });

  if ($.inArray(param, media) !== -1) {
    // if supplied parameter matches one of the possible media channels, continue the execution.
    // LinkedIn has extra parametres appending the url:
    var docTitle = document.title || '';
    var source = location.hostname || '';
    var isLinkedin = (param == 'linkedin') ? true : false;
    var suffix = (isLinkedin === true) ? '&title=' + encodeURIComponent(docTitle) + '&summary=&source=' + encodeURIComponent(source) : '';
    // Open in a new window:
    window.open(encodeURI(urlMap[param]) + encodeURI(url) + suffix);
  } else {
    console.log('Please call the function like this: onclick="shareURL(\'facebook)\'"');
  }
}

function getCurrentScrollPosition() {
  return window.pageYOffset || document.documentElement.scrollTop;
}

(function($) {
  // Language of the current page - fallback to English
  var $lang = $('html').prop('lang') ? $('html').prop('lang') : 'en';

  // False if in Obvius editor mode (Bootstrap templates has class .ku-bs but not in backend).
  // Use this variable to determine if certain stuff should run or load.
  var $editMode = ($('html').hasClass('ku-bs') === false) ? false : true;

  // Toggle icon in accordions
  $('.panel-accordion').each(function() {
    if ($(this).find('.panel-heading').next('.panel-collapse').hasClass('in')) {
      $(this).find('.panel-heading').addClass('open');
    }
  });

  // Toggle class in accordions
  function toggleClass(e) {
    $(e.target).prev('.panel-heading').toggleClass('open');
  }

  $('.panel-accordion').on('hide.bs.collapse', toggleClass);
  $('.panel-accordion').on('show.bs.collapse', toggleClass);

  function trackNews() {
    // Add tracking params to global menu news list
    var $li = $('ul.nyheder li:not(.no-track)');
    if ($li) {
      $li.each(function(i, v) {
        // Get current urls from news
        var url = $(this).find('a').prop('href');
        // Create new url with params
        var urlWithParams = url + '?utm_source=Nyheder&utm_medium=Link&utm_campaign=kudk-globalmenu';
        // Set new herf value
        $(this).find('a').prop('href', urlWithParams);
      });
    }
  }
  trackNews();

  // Function to make parent items in global menu clickable although they hold dropdown menus. Add class 'disabled':
  function makeGlobalMenuClickable() {
    var $menu = $('#navbar_menu li.dropdown');
    $menu.each(function() {
      $(this).children('.dropdown-toggle').addClass('disabled');
    });
  }
  makeGlobalMenuClickable();

  // Show/hide scroller if it exists
  function scrollToTopIcon() {
    var scroll = document.getElementById('scrolltop');
    // multiple checks for browser compatibility:
    var scollPosition = window.pageYOffset || document.documentElement.scrollTop;
    if (scroll) {
      scroll.classList.toggle('in', scollPosition > 60);
    }
  }
  scrollToTopIcon();

  // Init scroller on scroll

  var lastScrollPosition = 0;
  var tick = false;
  window.addEventListener('scroll', function(e) {
    lastScrollPosition = window.scrollY;
    if (!tick) {
      window.requestAnimationFrame(function() {
        scrollToTopIcon();
        tick = false;
      });
      tick = true;
    }
  });

  function hasScrollbar() {
    // Check if page has scrollbar and if so add css variable. Used for full width styling.
    var body = document.body;
    if (body) {
      if (window.innerWidth > body.clientWidth) {
        body.classList.add('has-scrollbar');
        body.setAttribute('style', '--scroll-bar: ' + (window.innerWidth - body.clientWidth) + 'px');
      } else {
        body.classList.remove('has-scrollbar');
      }
    }
  }

  hasScrollbar();

  window.addEventListener('orientationchange', debounce(function() {
    hasScrollbar();
  }, 250));

  window.addEventListener('resize', debounce(function() {
    hasScrollbar();
  }, 250));

  function scrollToTop() {
    var $root = $('html, body');
    $root.animate({
      scrollTop: 0
    }, 500);
  }

  // Smooth scrolling to top on click event
  $('#scrolltop').click(function() {
    scrollToTop();
  });

  // Smooth scrolling enter key
  $('#scrolltop').on('keydown', function(event) {
    switch (event.keyCode) {
      // Click using [Enter]
      case 13:
        scrollToTop();
        break;
    }
  });

  $(window).on('load', function() {
    if (window.location.hash !== '') {
      // Open accordions based on the hash in the url
      var $accordion = window.location.hash.indexOf('collapse-') >= 0;
      if ($accordion) {
        var $acc = window.location.hash;
        $($acc).collapse('show');

        // $('html, body').animate({
        //   scrollTop: $($acc).offset().top - 50
        // }, 800);
      }
    }
  });

})(jQuery);
