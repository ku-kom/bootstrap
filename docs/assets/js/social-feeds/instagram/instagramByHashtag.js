/* NEL, KU KOM
 * Script to fetch images from Instagram by hashtag. Based on scrapung - may stop working at any time.
 * Needs html like this: <div id="instagram_hash" data-hashtag="blivstuderendepåKinastudier" data-images="6" data-hidemobile="false" class="instagram-box"></div>
 * data-hashtag represents the hashtag to search for.
 * data-images pepresents the number of images to display at a time. */
(function ($) {
  'use strict';
  $(document).ready(function () {
    var $cachedWidth = $('body').prop('clientWidth');
    var $wrapper = $('#ig_hashtag');
    var $container = $wrapper.find("#imageBox");
    // $isMobile must be true or null and in mobile view to be true
    var $isMobile = (typeof $wrapper.attr("data-hidemobile") == null || true && (window.matchMedia('(max-width: 767px)').matches) === true) ? true : false;
    var $hash = (typeof $wrapper.attr("data-hashtag") === 'undefined') ? null : $wrapper.attr("data-hashtag").toLowerCase().trim();
    var $batchClass = "batch";
    var $number = $wrapper.attr("data-images");
    //$number = $number.toString();
    var $images = 12;
    // We always display 2 images on mobile
    var $numbers = (window.matchMedia('(max-width: 480px)').matches) ? 2 : parseInt($number, 10);
    var $loading = $wrapper.find(".ku-loading");

    function htmlEntities(str) {
      // Encode html for safety
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function getInstagramByHash(hashtag) {
      // Fetch Instagram images by hashtag
      if ($isMobile === true) {
        return //Don't run on mobile
      }
      $container.empty();
      if (hashtag) {
        // This php script is scraping content from the Instagram tags page and serving it as json:
        var $url = "https://cms.secure.ku.dk/instacms/instagramByUserOrTag/instagramScrapeToJson.php";
        $.ajax({
          url: $url,
          type: 'post',
          dataType: "json",
          data: ({
            hashtag: $hash
          }),
          success: function (data) {
            //console.log(data);
            $loading.hide();
            var entry = data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.edges;
            $.each(entry, function (i, v) {
              var img = entry[i].node.thumbnail_src;
              var shortcode = entry[i].node.shortcode;
              var caption = entry[i].node.edge_media_to_caption.edges[0].node.text;
              if (caption) {
                caption = htmlEntities(caption.substring(0, 80) + '...'); // Only display max 80 chars.
              } else {
                caption = '';
              }
              $container.append('<a tabindex="-1" href="https://www.instagram.com/p/' + shortcode + ' " target="_blank" rel="noopener" aria-label="' + caption + '"><img src="' + img + '" alt="' + hashtag + '"></a>');
              return i < $images - 1;
            });
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

    // Init script
    if ($hash) {
      getInstagramByHash($hash);
    } else {
      //console.log('Add Instagram hashtag to search for and number of images to display using data-hashtag="" and data-images="" on the container');
    }

    //On resize, wait and reload function
    var it;

    window.onresize = function () {
      var $newWidth = $('body').prop('clientWidth');
      if ($newWidth !== $cachedWidth) {
        $loading.show();
        clearTimeout(it);
        it = setTimeout(function () {
          getInstagramByHash($hash);
        }, 200);
        $cachedWidth = $newWidth;
      }
    };
  });
})(jQuery);
