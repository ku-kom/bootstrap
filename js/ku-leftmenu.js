/* ========================================================================
 * Bootstrap: v3.3.7
 * Custom menu script for University of Copenhagen: ku.dk
 * ======================================================================== */


+function ($) {
  'use strict';

  // Left menu expand sub level menu items

  $('#leftmenu .nav .hasSubs').click(function (e) {
    var $width = $('body').prop('clientWidth');

    if ($width < 750) {
      e.preventDefault();
      $(this).toggleClass('active');
      var $ul = $(this).next('ul');
      if ($ul.is(':visible')) {
        $ul.slideUp(300);
      } else {
        $ul.slideDown(300);
      }
    }
  });
}(jQuery);
