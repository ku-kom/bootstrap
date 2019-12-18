// This file contains scroll progress functionality.
// Note: Include parallax.min.css along with this script.

$(function () {
  'use strict';

  // Insert progress bar
  var $topbar = $('.ku-topbar');
  var progressHtml = [
    '<div class="progress progress-fixed-top">',
      '<div id="scrollProgress" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
        '<span class="sr-only">0%</span>',
      '</div>',
    '</div>'
  ].join('');
  var $newProgressbar = $(progressHtml);
  $newProgressbar.insertBefore($topbar);

  // Progress bar and menu variables
  var $progressBar = $('.progress-fixed-top');
  var $progress = $('#scrollProgress');
  var $nav = $('.ku-nav');

  function animateProcessbar() {
    // Update progress bar
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var $scroll = Math.floor((winScroll / height) * 100);
    if ($progress) {
      $progress.prop('aria-valuenow', $scroll).css('width', $scroll + '%');
      var $sr = $progress.find('.sr-only');
      $sr.html($scroll + '%');
    }
  }

  function animateMenu() {
    // Move global menus down in order to make room for scroll progress bar
    var $pos = window.pageYOffset !== 'undefined' ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
    if ($pos > 38) {
      $topbar.addClass('ku-topbar-fixed-top');
      $nav.addClass('ku-nav-top');
      $progressBar.show();
    } else {
      $topbar.removeClass('ku-topbar-fixed-top');
      $nav.removeClass('ku-nav-top');
      $progressBar.hide();
    }
  }

  $('.slick-pause').on('click', function () {
    // Toggle play/pause button in video backgrounds
    var $video = $("[data-jarallax-video] video").get(0);
    var $pause = $(this).find('.glyphicon');
    if ($video.paused) {
      $video.play();
      $pause.toggleClass('glyphicon-play glyphicon-pause');
    } else {
      $video.pause();
      $pause.toggleClass('glyphicon-pause glyphicon-play');
    }
  });

  animateMenu();
  animateProcessbar();


  $(window).scroll(function () {
    animateMenu();
    animateProcessbar();
  })
})

// Fixes jumpy scroll in IE11 by disabling smooth scroll
if (navigator.userAgent.match(/Trident\/7\./)) {
  document.body.addEventListener('mousewheel', function () {
    event.preventDefault();
    var wd = event.wheelDelta;
    var po = window.pageYOffset;
    window.scrollTo(0, po - wd);
  });
  document.body.addEventListener('keydown', function (e) {
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
