/*global debounce, JSON*/
/* NEL, KU KOM, 2020.
 * Scripts for ku.dk frontpage.
 */
(function($) {
  'use strict';


  $(document).ready(function() {
    var $lang = $('html').prop('lang') ? $('html').prop('lang') : 'en';
    var translations;
    if ($lang == 'da') {
      translations = {
        "pause": "Stop afspilning",
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

    var trackHero = $('.hero .video-container').next('a');
    var tracFeatures = $('.visuelt-element .visual-img').next('a');
    var $heroVideo = $('.hero-element');
    var $slideshow = $('.slick-slider');
    var $default_slideshow = $('.default_slideshow > .container > .row');
    var $instaslider = $('.instaslider');
    var $newsslider = $('.slide-columns > .container > .row');
    var $valueslider = $('.valueslider');
    var $user = $instaslider.attr('data-account');
    var $accountName = (typeof $user === 'undefined') ? 'university_of_copenhagen' : $user.trim();
    var $button = '<button aria-label="Pause/play" aria-pressed="false" class="play-pause-button" type="button">' +
      '<svg aria-hidden="true" class="video-controls" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg">' +
      '<path class="bi-play" d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>' +
      '<path class="bi-pause" d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>' +
      '</svg>' +
      '</button>';
    var $insta_backup = '<a href="https://www.instagram.com/' + $accountName + '/" alt="Instagram" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/insta_fallback1.jpg" alt=""></a>' +
      '<a href="https://www.instagram.com/' + $accountName + '/" alt="Instagram" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/insta_fallback2.jpg" alt=""></a>' +
      '<a href="https://www.instagram.com/' + $accountName + '/" alt="Instagram" target="_blank" rel="noopener"><img src="https://www.ku.dk/statisk-grafik/insta_fallback3.jpg" alt=""></a>';

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
              autoplay: true
            }
          }
        ]
      },
      standard: {
        autoplay: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplaySpeed: 5000,
        speed: 1000,
        dots: true,
        arrows: true,
        responsive: [
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1
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
          if (slick.options.autoplay === false) {
            slick.$slider.find('.play-pause-button').addClass('paused');
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
        $(btn).attr('aria-pressed', false);
        v.play();
      } else {
        $(btn).addClass('paused');
        $(btn).attr('aria-label', translations.play);
        $(btn).attr('aria-pressed', true);
        v.pause();
      }
    }

    function sliderButtons(el, btn) {
      // Slider buttons
      $(btn).toggleClass('paused');
      if ($(btn).hasClass('paused')) {
        $(btn).attr('aria-label', translations.play);
        $(btn).attr('aria-pressed', false);
        $(el).slick('slickPause');
      } else {
        $(btn).attr('aria-label', translations.pause);
        $(btn).attr('aria-pressed', true);
        $(el).slick('slickPlay');
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

    function instagramBackup() {
      // Fallback images if live feed fails
      $instaslider.append($insta_backup);
      $instaslider.addClass('instagram_fallback');
      initInstaSlideshow();
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
            $instaslider.empty();
            if (typeof data.graphql === "undefined") {
              // Insert fallback images if live feed fails
              instagramBackup();
              return;
            }
            var entry = data.graphql.user.edge_owner_to_timeline_media.edges;
            var html = '';
            var i;
            if (entry) {
              for (i = 0; i < entry.length; ++i) {
                var img = entry[i].node.thumbnail_src;
                var shortcode = entry[i].node.shortcode;
                var cap = (typeof entry[i].node.edge_media_to_caption.edges[0] === 'undefined') ? i + ': No caption' : entry[i].node.edge_media_to_caption.edges[0].node.text;
                var caption = (cap) ? escape_string(cap.substring(0, 50) + '...') : '';
                html += '<a tabindex="-1" href="https://www.instagram.com/p/' + shortcode + ' " target="_blank" rel="noopener" aria-label="' + caption + '"><img src="' + img + '" alt="' + account + '"></a>';
              }
              $instaslider.append(html);
              setTimeout(initInstaSlideshow, 2000);
            }
          })
          .fail(function(xhr, textStatus, errorThrown) {
            instagramBackup();
            console.log(xhr.responseText);
          });
      }
    }

    function initSlideshows() {
      // Add buttons
      addplayPause($newsslider);
      addplayPause($valueslider);
      addplayPause($default_slideshow);
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

      $default_slideshow.each(function(i, k) {
        // Default slideshows
        var $slider = $(this);
        $slider.not('.slick-initialized').slick(sliderSettings.standard);
      });
    }

    // Init scripts
    getInstagramByAccount($user);
    initSlideshows();

    // Add button to hero video
    $($button).insertAfter($heroVideo);


    $(document).on('click', '.hero .play-pause-button', function() {
      videoButton('#hero-video', $(this));
    });

    $(document).on('click', '.slick-slider .play-pause-button', function() {
      sliderButtons('.slick-slider', $(this));
    });

    $(window).on('resize orientationchange', debounce(function() {
      destroySlideshow();
      initSlideshows();
      initInstaSlideshow();
    }, 250));

    // Add classes for GTM tracking purposes
    trackHero.addClass('ku-topbanner');
    tracFeatures.addClass('ku-feature');

    // Add heading semantics to heading if no h1 or h1 roles on page
    if (!$('h1').length || !$('[aria-level="1"]').length) {
      var heading = $('.ku-branding-text-major');
      if (heading.length) {
        heading.attr('role', 'heading');
        heading.attr('aria-level', '1');
      }
    }

  });

})(jQuery);
