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
function shareURL(dest) {
  // Usage, e.g.: onclick="shareURL('facebook')"

  var urlMap = {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    linkedin: 'https://www.linkedin.com/shareArticle?mini=true&url=',
    twitter: 'https://twitter.com/home?status='
  };
  // Get current url
  var url = window.location.href;
  var param = dest.toLowerCase().trim();

  var media = $.map(urlMap, function (i, e) {
    // return keys
    return e;
  });

  if ($.inArray(param, media) !== -1) {
    // if supplied parameter matches one of the possible media channels, continue the execution.
    // LinkedIn has extra parametres appending the url:
    var docTitle = document.title || '';
    var source = location.hostname || '';
    var isLinkedin = (param == 'linkedin') ? true : false;
    var suffix = (isLinkedin === true) ? '&title=' + encodeURIComponent(docTitle) + '&summary=&source=' + encodeURI(source) : '';
    // Open in a new window:
    window.open(encodeURI(urlMap[param]) + encodeURI(url) + suffix);
  } else {
    console.log('Please call the function like this: onclick="shareURL(\'facebook)\'"');
  }
}

(function ($) {
  // Language of the current page - fallback to English
  var $lang = $('html').attr('lang') ? $('html').attr('lang') : 'en';

  var $editMode;
  if ($('html').hasClass('ku-bs')) {
    // False if in Obvius editor mode (Bootstrap templates has class .ku-bs but not in backend).
    // Use this variable to determine if certain stuff should run or load.
    $editMode = false;
  }

  // Toggle icon in accordions
  $('.panel-accordion').each(function () {
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

  // Truncate multiple lines of text in News in global menu
  var $chars = 70; // number of characters
  var $news = $('ul.dropdown-menu.nyheder li a');
  if ($news) {
    $news.each(function (i, v) {
      var $txt = $(this).text();
      if ($txt.length > $chars) {
        $(this).html($(this).html().substring(0, $chars) + '...');
        $(this).addClass('truncated');
      }
    });
  }

  // Function to make parent items in global menu clickable although they hold dropdown menus. Add class 'disabled':
  function makeGlobalMenuClickable() {
    var $menu = $('#navbar_menu li.dropdown');
    $menu.each(function () {
      $(this).children('.dropdown-toggle').addClass('disabled');
    });
  }
  makeGlobalMenuClickable();

  // Show/hide scroller if it exists
  function scrollFunction() {
    var $scroll = $('#scrolltop');
    // multiple checks for browser compatibility:
    var $scollPosition = window.pageYOffset !== 'undefined' ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
    if ($scroll) {
      if ($scollPosition > 60) {
        $scroll.addClass('in');
      } else {
        $scroll.removeClass('in');
      }
    }
  }

  // Init scroller
  scrollFunction();

  // Run on scroll
  window.onscroll = function () {
    scrollFunction()
  };

  // Smooth scrolling to top on click event

  $('#scrolltop').click(function () {
    var $root = $('html, body');
    $root.animate({
      scrollTop: 0
    }, 500);
    return false;
  });

})(jQuery);
