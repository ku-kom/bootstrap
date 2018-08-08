/* ========================================================================
 * Copyright 2017
 * University of Copenhagen, FA Communications
 * Important!!: Alle functions to be run must be wrapped in:
 *
 * (function($) {
 *     Execute code...
 * })(jQuery);
*
 * ========================================================================*/

(function($) {

  var editMode;
  if ($('html').hasClass('ku-bs')) {
    // False if in Obvius editor mode (Bootstrap templates has class .ku-bs but not in backend).
    // Use this variable to determine if certain stuff should run or load.
    editMode = false;
  }

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

  // Open / close all accordions
  $('.closeall').click(function() {
    $('.panel-collapse.in').collapse('hide');
  });
  $('.openall').click(function() {
    $('.panel-collapse:not(".in")').collapse('show');
  });

  // Truncate multiple lines of text in News in global menu
  var $chars = 80; // number of characters
  var $news = $('ul.dropdown-menu.nyheder li a');
  if ($news) {
    $news.each(function(i, v) {
      var txt = $(this).text();
      if (txt.length > $chars) {
        $(this).html($(this).html().substring(0, $chars) + '...');
      }
    });
  }

  // Element to click for smooth scroll to top
  var $scroller = '<div class=\'scrolltop fade\' id=\'scrolltop\' title=\'Top\'><span class=\'glyphicon-menu-up\'></span></div>';

  // Add scroller after last element
  if (editMode === false) {
    $($scroller).appendTo('#globalfooter');
  }

  // Init scroller
  scrollFunction();

  // Run on scroll
  window.onscroll = function() {
    scrollFunction()
  };

  // Show/hide scroller
  function scrollFunction() {
    var $scroll = $('#scrolltop');
    if (editMode === false && $scroll) {
      if (document.documentElement.scrollTop > 60) {
        $scroll.addClass('in');
      } else {
        $scroll.removeClass('in');
      }
    }
  }

  // Smooth scrolling to top on click event
  $('#scrolltop').click(function() {
    $('html, body').animate({
      scrollTop: 0
    }, 500);
    return false;
  });

  // Animate scrolling on anchors in general
  $('a[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length
        ? target
        : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });

 })(jQuery);
