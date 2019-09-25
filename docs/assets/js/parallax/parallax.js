// This file containd scroll progress functionality as well as parallax effects.

//<div class="campaign-block block-bg-fixed" style="background-image: url("background-image.jpg")">
//  <div class="block-content">
//    content
//  </div>
//</div>


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

  // Parallax variables:
  var $parallaxBlock = $('.block-bg-fixed');
  var scrolled = $(window).scrollTop();

  if (window.matchMedia('(min-width: 768px)').matches) {
    $parallaxBlock.each(function (index) {

      // Hide these as we set src in html and height in css:
      // var imageSrc = $(this).data('image-src')
      // $(this).css('background-image', 'url(' + imageSrc + ')')
      var imageHeight = $(this).data('height');
      $(this).css('height', imageHeight);
      // Adjust the background position.
      var initY = $(this).offset().top;
      var height = $(this).height();
      var diff = scrolled - initY;
      var ratio = Math.round((diff / height) * 100);
      $(this).css('background-position', 'center ' + parseInt(-(ratio * 1.5), 10) + 'px');
    });
  }

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

  animateMenu();
  animateProcessbar();

  function isInViewport(node) {
    // Check if the element is in the viewport.
    var rect = node.getBoundingClientRect()
    return (
      (rect.height > 0 || rect.width > 0) &&
      rect.bottom >= 0 &&
      rect.right >= 0 &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  $(window).scroll(function () {
    // Start parallax effect
    if (window.matchMedia('(min-width: 768px)').matches) {
      var scrolled = $(window).scrollTop()
      $parallaxBlock.each(function (index, element) {
        var initY = $(this).offset().top;
        var height = $(this).height();
        var endY = initY + $(this).height();

        // Check if the element is in the viewport.
        var visible = isInViewport(this);
        if (visible) {
          var diff = scrolled - initY;
          var ratio = Math.round((diff / height) * 100);
          $(this).css('background-position', 'center ' + parseInt(-(ratio * 1.5), 10) + 'px');
        }
      });
    }

    animateMenu();
    animateProcessbar();
  })
})


// Fixes jumpy scroll in IE11
if (navigator.userAgent.match(/Trident\/7\./)) {
  document.body.addEventListener('mousewheel', function () {
    event.preventDefault();
    var wd = event.wheelDelta;
    var po = window.pageYOffset;
    window.scrollTo(0, po - wd);
  });
}
