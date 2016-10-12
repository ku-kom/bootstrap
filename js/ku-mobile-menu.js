/* ======================================================================
 * Bootstrap: v3.3.7
 * Custom menu script for University of Copenhagen: ku.dk
 * ====================================================================== */

+function ($) {
  'use strict';

  var $cachedWidth = $('body').prop('clientWidth');

  $(window).resize(function () {
    var $newWidth = $('body').prop('clientWidth');
    if ($newWidth !== $cachedWidth) {
        // Close mobile menu on resize
        var API = $('#mobileleftmenu').data('mmenu');
        API.close();
      $cachedWidth = $newWidth;
    }
  });
}(jQuery);
