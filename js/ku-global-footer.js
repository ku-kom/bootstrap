/* ========================================================================
 * Bootstrap: v3.3.7
 * Custom script for University of Copenhagen: ku.dk
 * ======================================================================== */


+function ($) {
  'use strict';

  // Check if the page is responsive
  if ($('meta[name="viewport"]').length) {
    var $responsiveEnabled = true;
  }
  var $footerHeader = $('#globalfooter .footer-heading[data-heading="toggle"]');
  var $footerColumn = $('#globalfooter .footer-heading[data-heading="toggle"] + .footerlinks');
  var $cachedWidth = $('body').prop('clientWidth');

  var collapseFooter = function (el, ev) {
    // Collapse footer at lowest breakpoint
    if ($responsiveEnabled === true && window.matchMedia('(max-width: 767px)').matches) {
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
    var $newWidth = $('body').prop('clientWidth');
    if ($responsiveEnabled === true && $newWidth !== $cachedWidth) {
      $footerHeader.removeClass('open');
      $footerColumn.removeAttr('style');
      $cachedWidth = $newWidth;
    }
  });
}(jQuery);
