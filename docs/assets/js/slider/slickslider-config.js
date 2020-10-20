/*global debounce*/
/* NEL, KU KOM Script to fetch images from Instagram by account name and apply slick slider.*/
(function($) {
  'use strict';


  $(document).ready(function() {
    var $slideshow = $('.slick-slider');
    var $instaslider = $('.instaslider');
    var $newsslider = $('.row2');
    var $valueslider = $('.valueslider');
    var $user = $instaslider.attr('data-account');
    var $accountName = (typeof $user === 'undefined') ? 'university_of_copenhagen' : $user.trim();
    var $images = 12;
    var $button = '<button aria-label="Pause/play" class="play-pause-button" type="button">' +
      '<svg aria-hidden="true" class="video-controls" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg">' +
      '<path class="bi-play" d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>' +
      '<path class="bi-pause" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>' +
      '</svg>' +
      '</button>';
      
    // Settings for different kind of sliders
    var sliderSettings = {
      instagram: {
        slidesToShow: 3,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 1000,
        arrows: true,
        dots: false,
        responsive: [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              arrows: false,
              dots: false
            }
          }
        ]
      },
      news: {
        slidesToShow: 1,
        centerMode: true,
        arrows: false,
        dots: false,
        autoplay: false
      },
      value: {
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 1000,
        arrows: true,
        dots: true,
        responsive: [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              autoplay: true,
              dots: true,
              arrows: true
            }
          }
        ]
      }
    };

    function addplayPause(el) {
      // Add pause/play button
      if ($(el).children('.play-pause-button').length === 0) {
        $(el).on('init', function(event, slick) {
          if (slick.slideCount > 1 && slick.options.autoplay === true) {
            slick.$slider.append($button);
          }
        });
      }
    }

    function initInstaSlideshow() {
      addplayPause($instaslider);
      // Create Instagram slider
      $instaslider.not('.slick-initialized').slick(sliderSettings.instagram);
    }

    function destroySlideshow() {
      if ($slideshow.hasClass('slick-initialized')) {
        $slideshow.slick('destroy');
      }
    }

    function htmlEntities(str) {
      // Encode html for safety
      return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function getInstagramByAccount(account) {
      // Fetch Instagram images by account
      if (account) {
        var $url = 'https://www.instagram.com/' + encodeURIComponent($accountName) + '?__a=1';
        $.ajax({
            url: $url,
            type: 'GET'
          }).done(function(data) {
            //console.log(data);
            var entry = data.graphql.user.edge_owner_to_timeline_media.edges;
            if (entry) {
              $.each(entry, function(i, v) {
                var img = entry[i].node.thumbnail_src;
                var shortcode = entry[i].node.shortcode;
                var cap = (typeof entry[i].node.edge_media_to_caption.edges[0] === 'undefined') ? i + ': No caption' : entry[i].node.edge_media_to_caption.edges[0].node.text;
                var caption = (cap) ? htmlEntities(cap.substring(0, 50) + '...') : '';
                $instaslider.append('<a tabindex="-1" href="https://www.instagram.com/p/' + shortcode + ' " target="_blank" rel="noopener" aria-label="' + caption + '"><img src="' + img + '" alt="' + account + '"></a>');
                return i < $images - 1;
              });
              destroySlideshow();
              initInstaSlideshow();
            }
          })
          .fail(function(xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
          });
      }
    }

    function initSlideshows() {
      // TODO: Loop slider with one common slidername
      // Add buttons
      addplayPause($newsslider);
      // Loop news
      $newsslider.each(function(i, k) {
        var $slider = $(this);
        if ($slider.is('.newsslider')) {
          // Only slideshow on mobile
          if (window.matchMedia('(min-width: 991px)').matches) {
            if ($slider.hasClass('slick-initialized')) {
              $slider.slick('unslick');
            }
          } else {
            if (!$slider.hasClass('slick-initialized')) {
              $slider.slick(sliderSettings.news);
            }
          }
        }
      });
      // Loop value slider
      addplayPause($valueslider);
      $valueslider.each(function(i, k) {
        var $vslider = $(this);
        if ($vslider.is('.valueslider')) {
          $vslider.not('.slick-initialized').slick(sliderSettings.value);
        }
      });
    }

    // Init scripts
    if ($user) {
      getInstagramByAccount($user);
    } else {
      console.log('Add Instagram account to search for and number of images to display using data-account="" on the container');
    }
    initSlideshows();

    $(window).on('resize orientationchange', debounce(function() {
      destroySlideshow();
      initSlideshows();
      initInstaSlideshow();
    }, 250));

    $(document).on('click', '.play-pause-button', function() {
      var s = $(this).parent($slideshow);
      $(this).toggleClass('paused');
      if ($(this).hasClass('paused')) {
        s.slick('slickPause');
      } else {
        s.slick('slickPlay');
      }
    });
  });

})(jQuery);
