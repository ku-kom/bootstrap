/* ======================================================================
 * Bootstrap: v3.3.7
 * Custom mobile menu script for University of Copenhagen: ku.dk
 * ====================================================================== */

+function ($) {
  'use strict';

  var $cachedWidth = $('body').prop('clientWidth');

  // Merging global and left menu
  var $localMenuTitle = $('.ku-navbar-header').text();
  var $leftmenu = $('#leftmenu').clone();
  var $leftmenu2 = $('#leftmenu_2').clone();
  var $globalMenu = $('#topbar_menu').children().clone();
  var $globalMenu2 = $('#navbar_menu').children().clone();
  var $mobimenu = $('#mobileleftmenu');
  var $menuitems = $mobimenu.append($leftmenu2).append($globalMenu2).append($globalMenu);

  if ($.fn.mmenu) {
      $mobimenu.append($menuitems);
      $mobimenu.wrapInner('<ul id="localmenu">').prepend('<li class="local-menu">' + $localMenuTitle + '</li>');
      $mobimenu.find('ul').removeClass('dropdown-menu');
      var API = $mobimenu.mmenu({
        offCanvas: {
          position: 'right',
          zposition: 'front'
        },
        extensions: ['multiline', 'pagedim-black'],
        slidingSubmenus: false,
        currentItem: {
          find: true
        },
        setSelected: {
          parent: true,
          current: 'detect'
        },
        onClick: {
          setSelected: true
      },
      screenReader: true
      })
      .data('mmenu');

      // Open sub menu items on load
      $('#localmenu > li').addClass('mm-opened');
      $('#leftmenu_2 > li').addClass('mm-opened');
  }

  $(window).resize(function () {
    var $newWidth = $('body').prop('clientWidth');
    if ($newWidth !== $cachedWidth) {
        // Close mobile menu on resize
        API.close();
        $cachedWidth = $newWidth;
    }
  });
}(jQuery);
