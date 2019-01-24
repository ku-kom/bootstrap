/* NEL, KU KOM
 * Script to fetch images from Instagram by hashtag.
 * Needs html like this: <div id="instagram_hash" data-hashtag="blivstuderendepåKinastudier" data-images="6" class="instagram-box"></div>
 * data-hashtag represents the hashtag to search for.
 * data-images pepresents the number of images to display at a time. */
$(document).ready(function () {
  var $cachedWidth = $('body').prop('clientWidth');
  var $wrapper = $('#instagram_hash');
  var $hash = $wrapper.attr("data-hashtag").toLowerCase().trim();
  var $batchClass = "batch";
  var $loading = $(".ku-loading");

  function getInstagramByHash(hashtag) {
    // Fetch Instagram images by hashtag
    var $number = $wrapper.attr("data-images");
    var $images = 12;
    var $numbers = (window.matchMedia('(max-width: 500px)').matches) ? 1 : parseInt($number);
    $wrapper.empty();
    if (hashtag) {
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
          var entry = data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.edges;
          $.each(entry, function (i, v) {
            var img = entry[i].node.thumbnail_src;
            var shortcode = entry[i].node.shortcode;
            $wrapper.append('<a href="https://www.instagram.com/p/' + shortcode + ' " target="_blank"><img src="' + img + '" alt="' + hashtag + '"></a>');
            return i < $images - 1;
          });
          var batch;
          $('a', $wrapper).each(function (k, e) {
            if (k % $numbers == 0) {
              batch = $('<div/>').addClass($batchClass).appendTo($wrapper);
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
          $loading.hide();
          $wrapper.rotator();
          $wrapper.css('visibility', 'visible');
        }
      });
    }
  }
  $.fn.rotator = function (options) {
    options = $.extend({
      blocks: '.' + $batchClass,
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

  if ($hash) {
    // Init script
    getInstagramByHash($hash);
  } else {
    console.log('Add Instagram hashtag and number of images to display using data-hashtag="" and data-images="" on the container');
  }

  $wrapper.click(function (e) {
    // Action when gridbox arrow is clicked
    // clickable range - never changes
    var max = $(this).offset().top + $(this).outerHeight();
    var min = max - 30; // 30 is the height of the ::before arrow

    var checkRange = function (y) {
      return (y >= min && y <= max);
    };
    if (checkRange(e.pageY)) {
      // do click action
      location.href = "https://www.instagram.com/" + $accountName;
    }
  });

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
