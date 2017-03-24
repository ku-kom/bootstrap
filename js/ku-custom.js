/* ========================================================================
 * Copyright 2017
 * University of Copenhagen, FA Communications
 * ========================================================================*/

// Fix viewport width on Windows Phone: http://getbootstrap.com/getting-started/#support-ie10-width

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style');
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  );
  document.querySelector('head').appendChild(msViewportStyle);
}
  // Toggle icon in accordions
function flipArrow(e) {
  $(e.target)
    .prev('.panel-heading')
    .toggleClass('open');
}

$(function () {
  // Fix for select boxes on Android 4.1: http://getbootstrap.com/getting-started/#support-android-stock-browser
  var nua = navigator.userAgent;
  var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1);
  if (isAndroid) {
    $('select.form-control').removeClass('form-control').css('width', '100%');
  }

  // Toggle icon in accordions
  $('.panel-group').on('hide.bs.collapse', flipArrow);
  $('.panel-group').on('show.bs.collapse', flipArrow);

  // Open / close all accordions
  $('.closeall').click(function () {
    $('.panel-collapse.in')
      .collapse('hide');
  });
  $('.openall').click(function () {
    $('.panel-collapse:not(".in")')
      .collapse('show');
  });

  // Attach the `fileselect` event to all file inputs on the page
  $(document).on('change', ':file', function () {
    var $input = $(this),
      numFiles = $input.get(0).files ? $input.get(0).files.length : 1,
      label = $input.val().replace(/\\/g, '/').replace(/.*\//, '');
    $input.trigger('fileselect', [numFiles, label]);
  });

  // Watch for the custom `fileselect` event
  $(':file').on('fileselect', function (event, numFiles, label) {
    var input = $(this).parents('.input-group').find(':text'),
      log = numFiles > 1 ? numFiles + ' files selected' : label;
    if (input.length) {
      input.val(log);
      //} else {
      // if (log) console.log(log);
    }
  });

  // Truncate multiple lines of text in News in global menu
  var $chars = 80; // number of characters
  var $news = $('ul.dropdown-menu.nyheder li a');
  if ($news) {
    $news.each(function (i, v) {
      var txt = $(this).text();
      if (txt.length > $chars) {
        $(this).html($(this).html().substring(0, $chars) + '...');
      }
    });
  }
});
