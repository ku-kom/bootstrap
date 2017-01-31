/* ========================================================================
 * Copyright 2014-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ========================================================================*/

// Fix viewport width on Windows Phone: http://getbootstrap.com/getting-started/#support-ie10-width

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  var msViewportStyle = document.createElement('style')
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  )
  document.querySelector('head').appendChild(msViewportStyle)
}

// Fix for select boxes on Android 4.1: http://getbootstrap.com/getting-started/#support-android-stock-browser
$(function () {
  var nua = navigator.userAgent
  var isAndroid = (nua.indexOf('Mozilla/5.0') > -1 && nua.indexOf('Android ') > -1 && nua.indexOf('AppleWebKit') > -1 && nua.indexOf('Chrome') === -1)
  if (isAndroid) {
    $('select.form-control').removeClass('form-control').css('width', '100%')
  }
})
