/* ========================================================================
 * Bootstrap: v3.3.7
 * Custom script for University of Copenhagen: ku.dk
 * ======================================================================== */


+function ($) {
  'use strict';

  var $footerHeader = $('.globalfooter .footer-heading[data-heading="toggle"]');
  var $footerColumn = $('.globalfooter .footer-heading[data-heading="toggle"] + .footerlinks');
  var $cachedWidth = $(window).width();

  var collapseFooter = function (el, ev) {
    if ($cachedWidth < 768) {
      ev.preventDefault();
      $(el).next('ul').slideToggle();
      $(el).toggleClass('open');
    } else {
      $(el).next('ul').show();
    }
  };

  $footerHeader.click(function (e) {
    collapseFooter(this, e);
  });

  $(window).resize(function () {
    var $newWidth = $(window).width();
    if ($newWidth !== $cachedWidth) {
      $footerHeader.removeClass('open');
      if ($(window).width() < 768) {
        $footerColumn.css('display', 'none');
      } else {
        $footerColumn.css('display', 'block');
      }
      $cachedWidth = $newWidth;
    }
  });
}(jQuery);
