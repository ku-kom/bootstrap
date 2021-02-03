  /*global JSON*/
  /* NEL, KU KOM Script to fetch images from Instagram by account nane.
   * Needs html like this: <div id="ig" data-account="university_of_copenhagen" data-token="xxxx" data-images="3" data-hidemobile="false" class="gridbox with-img size2">
     <div class="box1">
       <a href="https://www.instagram.com/university_of_copenhagen/">
         <div class="header">@university_of_copenhagen på Instagram</div>
       </a>
     </div>
       <div id="imageBox"></div>
   </div>
   The property data-account="" represents the account name to search for. data-images="" pepresents the number of images to display at a time. */
  (function($) {
    'use strict';
    $(document).ready(function() {
      var $wrapper = $("#ig");
      var $container = $wrapper.find("#imageBox");
      var $loading = $wrapper.find(".ku-loading");
      var $user = $wrapper.attr("data-account");
      // $isMobile must be true or null and in mobile view to be true
      var $isMobile = (typeof $wrapper.attr("data-hidemobile") == null || "true" && (window.matchMedia('(max-width: 767px)').matches) === true) ? true : false;
      var $accountName = (typeof $user === 'undefined') ? 'university_of_copenhagen' : $user.trim();
      var $batchClass = "batch";
      var $number = $wrapper.attr("data-images");
      var $images = 12;
      // Always display 2 images on mobile
      var $numbers = (window.matchMedia('(max-width: 480px)').matches) ? 2 : parseInt($number, 10);
      var $cachedWidth = $('body').prop('clientWidth');

      // Three static images as fallback if Instagram live feed fails
      var $insta_backup = '<a href="https://www.instagram.com/' + $accountName + '/" aria-label="Instagram 1" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/instagrambilleder/instagram-1.jpg" alt=""></a>' +
        '<a href="https://www.instagram.com/' + $accountName + '/" aria-label="Instagram 2" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/instagrambilleder/instagram-2.jpg" alt=""></a>' +
        '<a href="https://www.instagram.com/' + $accountName + '/" aria-label="Instagram 3" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/instagrambilleder/instagram-3.jpg" alt=""></a><a href="https://www.instagram.com/' + $accountName + '/" aria-label="Instagram 4" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/instagrambilleder/instagram-1.jpg" alt=""></a>' +
        '<a href="https://www.instagram.com/' + $accountName + '/" aria-label="Instagram 5" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/instagrambilleder/instagram-2.jpg" alt=""></a>' +
        '<a href="https://www.instagram.com/' + $accountName + '/" aria-label="Instagram 6" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/instagrambilleder/instagram-3.jpg" alt=""></a>';

      // Escape characters for safety
      var escape_map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
      };

      function escape_string(str) {
        return str.replace(/[&<>"'`=\/]/g, function(chars) {
          return escape_map[chars];
        });
      }

      function prepareRotator() {
        var batch;
        $('a', $container).each(function(k, e) {
          if (k % $numbers == 0) {
            batch = $('<div/>').addClass($batchClass).appendTo($container);
          }
          batch.append(e);
        });
        var wrap = "<div class='inner'></div>";
        $('.' + $batchClass).wrapInner(wrap);
        $container.rotator();
      }

      function instagramBackup() {
        // Fallback images if live feed fails
        $loading.hide();
        $($insta_backup).each(function(index, element) {
          $container.append($(this));
          return index < $images - 1;
        });
        // $container.append($insta_backup);
        $container.addClass('instagram_fallback');
        prepareRotator();
      }

      function getInstagramByAccount(account) {
        // Fetch Instagram images by account
        if ($isMobile === true) {
          $wrapper.empty();
          return //Don't run on mobile
        }
        $container.empty();
        if (account) {
          var $url = "https://www.instagram.com/" + encodeURIComponent($accountName) + "?__a=1";
          $.ajax({
              url: $url,
              type: 'GET',
              crossDomain: true
            }).done(function(data) {
              console.log(data);
              $loading.hide();
              var entry = data.graphql.user.edge_owner_to_timeline_media.edges;
              if (entry) {
                $.each(entry, function(i, v) {
                  var img = entry[i].node.thumbnail_src;
                  var shortcode = entry[i].node.shortcode;
                  var cap = (typeof entry[i].node.edge_media_to_caption.edges[0] === 'undefined') ? i + ': No caption' : entry[i].node.edge_media_to_caption.edges[0].node.text;
                  var caption = (cap) ? escape_string(cap.substring(0, 50) + '...') : '';
                  $container.append('<a tabindex="-1" href="https://www.instagram.com/p/' + shortcode + ' " target="_blank" rel="noopener" aria-label="' + caption + '"><img src="' + img + '" alt="' + account + '"></a>');
                  return i < $images - 1;
                });
                prepareRotator();
              } else {
                instagramBackup();
              }
            })
            .fail(function(xhr, textStatus, errorThrown) {
              instagramBackup();
              console.log(xhr.responseText);
            });
        }
      }

      $.fn.rotator = function(options) {
        options = $.extend({
          blocks: $wrapper.find('.' + $batchClass),
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

      // Init script
      if ($user) {
        getInstagramByAccount($user);
      } else {
        console.log('Add Instagram account to search for and number of images to display using data-account="" and data-images="" on the container');
      }

      //On resize, wait and reload function
      var it;

      window.onresize = function() {
        var $newWidth = $('body').prop('clientWidth');
        if ($newWidth !== $cachedWidth) {
          $loading.show();
          clearTimeout(it);
          it = setTimeout(function() {
            getInstagramByAccount($user);
          }, 200);
          $cachedWidth = $newWidth;
        }
      };
    });

  })(jQuery);
