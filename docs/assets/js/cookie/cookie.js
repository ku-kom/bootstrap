// Functions to rcreate, read and delete cookies.
// Usage:
// Set cookie: createCookie("some-name", "value", 30); (name, value and number of days)
// Read cookie:
// if (readCookie("some-name") === null) {
//   Do something if it doesn't esist
// }
(function () {
  'use strict';

  // Create cookie
  function createCookie(name, value, days) {
    var expires;
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
  }

  // Read cookie
  function readCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  // Erase cookie
  function eraseCookie(name) {
    createCookie(name, '', -1);
  }
})();
