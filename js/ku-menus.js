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
      var mmenu = $('#mobileleftmenu').mmenu().data('mmenu');
      mmenu.close();
      $cachedWidth = $newWidth;
    }
  });
}(jQuery);
