/* NEL, KU KOM Script to fetch images from Instagram by access token.
 * Login to Instagram to register an application and generate an access token using this url - replace with your values:
 * https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=code
 * Needs html like this: <div id="ig" data-account="university_of_copenhagen" data-token="xxxx" data-images="3" class="gridbox with-img subcolor_6 size2">
   <div class="box1">
   <a href="https://www.instagram.com/university_of_copenhagen/">
     <div class="header">@university_of_copenhagen på Instagram</div>
   </a>
   </div>
   <div class="ig_box2">
     <div class="ku-loading"></div>
     <div id="imageBox"></div>
   </div>
 </div>
 The property data-account represents the account name to search for. data-images pepresents the number of images to display at a time. */
(function($) {
  'use strict';
  $(document).ready(function () {
  var $wrapper = $("#ig");
  var $container = $("#imageBox");
  var $token = $wrapper.attr("data-token");
  console.log($token);
  var $user = $wrapper.attr("data-account").trim();
  var $accountName = (typeof $user === 'undefined') ? 'university_of_copenhagen' : $user;
  var $batchClass = "batch";

  function getInstagramByHash(access_token) {
    // Fetch Instagram images by hashtag
    var $number = $wrapper.attr("data-images");
    var $images = 12;
    var $numbers = (window.matchMedia('(max-width: 480px)').matches) ? 1 : parseInt($number);
    $container.empty();
    if (access_token) {
      var $url = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + access_token;
      $.ajax({
        url: $url,
        type: 'GET',
        success: function(response) {
          //console.log(response);
          for (var i = 0; i < $images; i++) {
            var img = response.data[i].images.standard_resolution.url;
            var link = response.data[i].link;
            var desc = response.data[i].caption.text;
            $container.append('<a href="' + link + '" target="_blank"><img src="' + img + '"></a>');
          }
          var batch;
          $('a', $container).each(function(k, e) {
            if (k % $numbers == 0) {
              batch = $('<div/>').addClass($batchClass).appendTo($container);
            }
            batch.append(e);
          });
          var wrap = "<div class='inner'></div>";
          $('.' + $batchClass).wrapInner(wrap);
        },
        error: function(xhr, status, error) {
          console.log(xhr.responseText);
        },
        complete: function() {
          $container.rotator();
          $wrapper.css('visibility', 'visible');
        }
      });
    }
  }

  $.fn.rotator = function(options) {
    options = $.extend({
      blocks: '.' + $batchClass,
      speed: 6000,
      fadeSpeed: 800
    }, options);
    var setZIndex = function(element) {
      var index = $(options.blocks, element).length;
      $(options.blocks, element).each(function() {
        index--;
        $(this).css('zIndex', index);
      });
    };
    var rotate = function(element) {
      var blocks = $(options.blocks, element),
        len = blocks.length,
        index = -1;
      blocks.fadeIn(options.fadeSpeed);
      var timer = setInterval(function() {
        index++;
        var block = blocks.eq(index);
        if (index == len) {
          clearInterval(timer);
          rotate(element);
        }
        if (block.index() != (len - 1)) {
          block.fadeOut(options.fadeSpeed);
        }
      }, options.speed);
    };
    return this.each(function() {
      var elem = $(this);
      setZIndex(elem);
      rotate(elem);
    });
  };

  if ($token) {
    getInstagramByHash($token);
  } else {
    console.log('Add Instagram access token and number of images to display using data-token="" and data-images="" on the container');
  }

  // Action when gridbox arrow is clicked
  // clickable range - never changes
  var max = $wrapper.offset().top + $wrapper.outerHeight();
  var min = max - 30; // 30 is the height of the ::before

  var checkRange = function(y) {
    return (y >= min && y <= max);
  };

  $wrapper.click(function(e) {
    if (checkRange(e.pageY)) {
      // do click action
      location.href = "https://www.instagram.com/" + $accountName;
    }
  });

  //On resize, wait and reload function
  var it;

  function resizedw() {
    getInstagramByHash($token);
  }
  window.onresize = function() {
    clearTimeout(it);
    it = setTimeout(function() {
      resizedw();
    }, 200);
  };
  });

})(jQuery);
