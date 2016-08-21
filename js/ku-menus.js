
// jscs:disable
/* ======================================================================
 * Bootstrap: v3.3.7
 * Custom menu script for University of Copenhagen: ku.dk
 * ====================================================================== */


+function ($) {
  'use strict';

  var $kuNav = $('#kunav');
  var $cachedWidth = $('body').prop('clientWidth');
  if ($cachedWidth <= 768) {
    // Global menu folding
    $('#navbar').on('show.bs.collapse', function () {
      $kuNav.show();
    });
    $('#navbar').on('hide.bs.collapse', function () {
      $kuNav.hide();
    });

    // Clicking left menu button or content area closes global menu
    $('#btn_left, #content').click(function () {
      $('#navbar').collapse('hide');
    });
  }
  $(window).resize(function () {
    var $newWidth = $('body').prop('clientWidth');
    if ($newWidth !== $cachedWidth) {
      $kuNav.removeAttr('style'); // reset style
      $('#btn_right').addClass('collapsed'); // reset burger icon
      $cachedWidth = $newWidth;
    }
  });
}(jQuery);
