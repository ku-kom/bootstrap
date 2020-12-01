/*global debounce, JSON*/
/* NEL, KU KOM Script to fetch images from Instagram by account name and apply slick slider.*/
(function($) {
  'use strict';


  $(document).ready(function() {
    var lang = $('html').prop('lang') ? $('html').prop('lang') : 'en';
    var translations;
    if (lang == 'da') {
      translations = {
        "pause": "Sæt på pause",
        "play": "Afspil"
      }
    } else { //English
      translations = {
        "pause": "Pause",
        "play": "Play"
      }
    }

    var escape_map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      '`': '&#x60;',
      '=': '&#x3D;'
    };

    var $slideshow = $('.slick-slider');
    var $instaslider = $('.instaslider');
    var $newsslider = $('.slide-columns > .container > .row');
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
        autoplay: false,
        autoplaySpeed: 4000,
        speed: 1000,
        arrows: true,
        responsive: [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1,
              arrows: false
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
              arrows: false
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

    function videoButton(el, btn) {
      // Video buttons
      var v = $(el).get(0);
      if (v.paused || v.ended) {
        $(btn).removeClass('paused');
        $(btn).attr('aria-label', translations.pause);
        v.play();
      } else {
        $(btn).addClass('paused');
        $(btn).attr('aria-label', translations.play);
        v.pause();
      }
    }

    function initInstaSlideshow() {
      addplayPause($instaslider);
      // Create Instagram slider
      $instaslider.not('.slick-initialized').slick(sliderSettings.instagram);
    }

    function destroySlideshow() {
      // Remove slide show
      $slideshow.each(function(i, k) {
        $(this).slick('unslick');
      });
    }

    function escape_string(str) {
      return str.replace(/[&<>"'`=\/]/g, function(chars) {
        return escape_map[chars];
      });
    }

    function maxChars(text, count) {
      return text.slice(0, count) + (text.length > count ? '...' : '');
    }

    function getInstagramByAccount(account) {
      // Fetch Instagram images by account
      if (account) {
        var $url = 'https://www.instagram.com/' + encodeURIComponent($accountName) + '/?__a=1';
        $.ajax({
            url: $url,
            type: 'GET'
          }).done(function(data) {
            //console.log(data);
            destroySlideshow();
            var entry = data.graphql.user.edge_owner_to_timeline_media.edges;
            var html = '';
            if (entry) {
              $.each(entry, function(i, v) {
                var img = entry[i].node.thumbnail_src;
                var shortcode = entry[i].node.shortcode;
                var cap = (typeof entry[i].node.edge_media_to_caption.edges[0] === 'undefined') ? i + ': No caption' : entry[i].node.edge_media_to_caption.edges[0].node.text;
                var caption = (cap) ? escape_string(cap.substring(0, 50) + '...') : '';
                html += '<a tabindex="-1" href="https://www.instagram.com/p/' + shortcode + ' " target="_blank" rel="noopener" aria-label="' + caption + '"><img src="' + img + '" alt="' + account + '"></a>';
                return i < $images - 1;
              });
              $instaslider.append(html);
              setTimeout(initInstaSlideshow, 1000);
            }
          })
          .fail(function(xhr, textStatus, errorThrown) {
            console.log(xhr.responseText);
          });
      }
    }

    function initSlideshows() {
      // Add buttons
      addplayPause($newsslider);
      addplayPause($valueslider);
      // Loop news and events
      $newsslider.each(function(i, k) {
        var $slider = $(this);
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
      });

      // Value slider
      $valueslider.not('.slick-initialized').slick(sliderSettings.value);
    }

    // Init scripts
    if ($user) {
      getInstagramByAccount($user);
    } else {
      console.log('Add Instagram account to search for and number of images to display using data-account="" on the container');
    }
    initSlideshows();

    $('.btn-video').click(function() {
      videoButton('#hero-video', '.btn-video');
    });

    $(window).on('resize orientationchange', debounce(function() {
      destroySlideshow();
      initSlideshows();
      initInstaSlideshow();
    }, 250));

    $(document).on('click', '.slick-slider .play-pause-button', function() {
      // Slider buttons
      var s = $(this).parent($slideshow);
      $(this).toggleClass('paused');
      if ($(this).hasClass('paused')) {
        $(this).attr('aria-label', translations.play);
        s.slick('slickPause');
      } else {
        $(this).attr('aria-label', translations.pause);
        s.slick('slickPlay');
      }
    });
  });

})(jQuery);
