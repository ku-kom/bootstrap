/* NEL, KU KOM Script to fetch images from Instagram by access token.
 * Login to Instagram to register an application and generate an access token using this url - replace with your values:
 * https://api.instagram.com/oauth/authorize/?client_id=CLIENT-ID&redirect_uri=REDIRECT-URI&response_type=token
 * Needs html like this: <div id="ig" data-account="university_of_copenhagen" data-token="xxxx" data-images="3" data-hidemobile="false" class="gridbox with-img size2">
   <div class="box1">
     <a href="https://www.instagram.com/university_of_copenhagen/">
       <div class="header">@university_of_copenhagen på Instagram</div>
     </a>
   </div>
     <div id="imageBox"></div>
 </div>
 The property data-account represents the account name to search for. data-images pepresents the number of images to display at a time. */
(function ($) {
  'use strict';
  $(document).ready(function () {
    var $wrapper = $("#ig");
    var $container = $wrapper.find("#imageBox");
    var $loading = $wrapper.find(".ku-loading");
    var $token = $wrapper.attr("data-token");
    var $user = $wrapper.attr("data-account");
    // $isMobile must be true or null and in mobile view to be true
    var $isMobile = (typeof $wrapper.attr("data-hidemobile") == null || true && (window.matchMedia('(max-width: 767px)').matches) === true) ? true : false;
    var $accountName = (typeof $user === 'undefined') ? 'university_of_copenhagen' : $user.trim();
    var $batchClass = "batch";
    var $number = $wrapper.attr("data-images");
    //$number = $number.toString();
    var $images = 12;
    // We always display 2 images on mobile
    var $numbers = (window.matchMedia('(max-width: 480px)').matches) ? 2 : parseInt($number, 10);
    var $cachedWidth = $('body').prop('clientWidth');



    function getInstagramByAccount(access_token) {
      // Fetch Instagram images by hashtag
      if ($isMobile === true) {
        return //Don't run on mobile
      }
      $container.empty();
      if (access_token) {
        var $url = "https://api.instagram.com/v1/users/self/media/recent/?access_token=" + encodeURIComponent(access_token);
        $.ajax({
          url: $url,
          type: 'GET',
          dataType: "jsonp",
          success: function (data) {
            //console.log(data);
            $loading.hide();
            for (var i = 0; i < $images; i++) {
              var img = data.data[i].images.standard_resolution.url;
              var link = data.data[i].link;
              var caption = data.data[i].caption.text;
              if (caption) {
                caption = caption.substring(0, 80) + '...'; // Only display max 80 chars.
              } else {
                caption = '';
              }
              $container.append('<a tabindex="-1" href="' + link + '" aria-label="' + caption + '" rel="noopener" target="_blank"><img src="' + img + '" alt="' + $user + '"></a>');
            }
            var batch;
            $('a', $container).each(function (k, e) {
              if (k % $numbers == 0) {
                batch = $('<div/>').addClass($batchClass).appendTo($container);
              }
              batch.append(e);
            });
            var wrap = "<div class='inner'></div>";
            $('.' + $batchClass).wrapInner(wrap);
          },
          error: function (xhr, status, error) {
            console.log(xhr.responseText);
          },
          complete: function () {
            $container.rotator();
          }
        });
      }
    }

    $.fn.rotator = function (options) {
      options = $.extend({
        blocks: $wrapper.find('.' + $batchClass),
        speed: 6000,
        fadeSpeed: 800
      }, options);
      var setZIndex = function (element) {
        var index = $(options.blocks, element).length;
        $(options.blocks, element).each(function () {
          index--;
          $(this).css('zIndex', index);
        });
      };
      var rotate = function (element) {
        var blocks = $(options.blocks, element),
          len = blocks.length,
          index = -1;
        blocks.fadeIn(options.fadeSpeed);
        var timer = setInterval(function () {
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
      return this.each(function () {
        var elem = $(this);
        setZIndex(elem);
        rotate(elem);
      });
    };

    if ($token) {
      // Init script
      getInstagramByAccount($token);
    } else {
      //console.log('Add Instagram access token and number of images to display using data-token="" and data-images="" on the container.');
    }

    // Action when gridbox arrow is clicked
    // clickable range - never changes
    // $wrapper.click(function (e) {
    //   var max = $(this).offset().top + $(this).outerHeight();
    //   var min = max - 30; // 30 is the height of the ::before arrow
    //
    //   var checkRange = function (y) {
    //     return (y >= min && y <= max);
    //   };
    //   if (checkRange(e.pageY)) {
    //     location.href = "https://www.instagram.com/" + $accountName;
    //   }
    // });

    //On resize, wait and reload function
    var it;

    window.onresize = function () {
      var $newWidth = $('body').prop('clientWidth');
      if ($newWidth !== $cachedWidth) {
        $loading.show();
        clearTimeout(it);
        it = setTimeout(function () {
          getInstagramByAccount($token);
        }, 200);
        $cachedWidth = $newWidth;
      }
    };
  });

})(jQuery);
