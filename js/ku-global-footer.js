/* ========================================================================
 * Bootstrap: v3.3.7
 * Custom script for University of Copenhagen: ku.dk, NEL
 * ======================================================================== */


+ function($) {
  'use strict';

  // Check if the page is responsive
  var $isResponsive = ($('html').hasClass('non-responsive')) ? true : false;
  var $footerHeader = $('#globalfooter .footer-heading[data-heading="toggle"]');
  var $footerColumn = $('#globalfooter .footer-heading[data-heading="toggle"] + .footerlinks');
  var $cachedWidth = $('body').prop('clientWidth');

  // Set accessible attribute:
  if (window.matchMedia('(max-width: 767px)').matches) {
    $footerHeader.attr('aria-expanded', 'false');
  }

  var collapseFooter = function(el, ev) {
    // Collapse footer at lowest breakpoint
    if ($isResponsive === false && window.matchMedia('(max-width: 767px)').matches) {
      ev.preventDefault();
      $(el).next('ul').slideToggle();
      $(el).toggleClass('open');
      // Toggle accessible state:
      $(el).attr('aria-expanded', $(el).hasClass('open') ? 'true' : 'false');
    } else {
      // Desktop:
      $(el).next('ul').show();
    }
  };

  $footerHeader.click(function(e) {
    collapseFooter(this, e);
  });

  $(window).resize(function() {
    var $newWidth = $('body').prop('clientWidth');
    if ($isResponsive === false && $newWidth !== $cachedWidth) {
      $footerHeader.removeClass('open');
      $footerColumn.removeAttr('style aria-expanded');
      $cachedWidth = $newWidth;
    }
  });
}(jQuery);
