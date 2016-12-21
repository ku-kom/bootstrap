/* ======================================================================
 * Bootstrap: v3.3.7
 * Custom mobile menu script for University of Copenhagen: ku.dk
 * ====================================================================== */

+function ($) {
  'use strict';

  var $cachedWidth = $('body').prop('clientWidth');

  var $localMenuTitle = $('.ku-navbar-header').text(),
      $container = $('#localmenu'),
      $leftmenu = $container.find('li.leftmenu-menu').first(),
      $topbarmenu = $container.find('li.topbar-menu').first(),
      $navbarmenu = $container.find('li.navbar-menu').first();

  // Add title to local menu
  $leftmenu.find('span.title-placeholder').replaceWith($localMenuTitle);
  $leftmenu.append(
      $('#leftmenu_2').clone().attr('id', 'leftmenu2-clone')
  );
  $topbarmenu.append(
      $('#topbar_menu').clone().attr('id', 'topbar_menu-clone')
  );
  $navbarmenu.append(
      $('#navbar_menu').clone().attr('id', 'navbar_menu-clone')
  );
  $container.find('ul').removeClass('dropdown-menu');

  if ($.fn.mmenu) {
      var API = $container.mmenu({
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
