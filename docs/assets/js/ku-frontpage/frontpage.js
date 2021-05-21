/*global debounce, JSON, GlueFrame*/
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
    } else { //English fallback
      translations = {
        "pause": "Pause (use space bar)",
        "play": "Play (use space bar)"
      }
    }

    // Escape characters for safety
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

    // Tracking elements
    var trackHero = $('.hero .video-container').next('a');
    var tracFeatures = $('.visuelt-element .visual-img').next('a');
    // Sliders
    var $heroVideo = $('.hero-element');
    var $slideshow = $('.slick-slider');
    var $default_slideshow = $('.default_slideshow > .container > .row');
    var $instaslider = $('.instaslider');
    var $newsslider = $('.slide-columns > .container > .row');
    var $valueslider = $('.valueslider');
    // Playser / pause buttons
    var $button = '<button aria-label="Pause/play" aria-pressed="false" class="play-pause-button" type="button"></button>';

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
        // centerMode: true,
        arrows: false,
        dots: false,
        autoplay: false,
        responsive: [
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 2
            }
          },
          {
            breakpoint: 767,
            settings: {
              slidesToShow: 1
            }
          }
        ]
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
      // Add pause/play button to sliders
      if ($(el).children('.play-pause-button').length === 0) {
        $(el).on('init', function(event, slick) {
          if (slick.slideCount > 1 && slick.options.autoplay === true) {
            slick.$slider.append($button);
          }
          if (slick.options.autoplay === false) {
            slick.$slider.find('.play-pause-button').addClass('paused');
          }
          // Update css variable to be the width of half a slide
          if (slick.$slider.is($newsslider)) {
            var slideWidth = Math.round($(slick.$slides).width() / 2) + 'px';
            document.body.style.setProperty('--slide-width', slideWidth);
          }
        });
      }
    }

    function videoButton(el, btn) {
      // Video buttons
      var v = $(el).get(0);
      if (!v) {
        return;
      }
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

    function pauseVideos(el) {
      // Pause videos from video23
      var frames = el;
      // Check if plugin is included in page:
      if (typeof(GlueFrame) !== 'undefined') {
        for (var i = 0; i < frames.length; i++) {
          var frame = frames[i];
          var Player = new GlueFrame(frame, "Player");
          // Stop playing video23 videos
          if (Player) {
            Player.set("playing", false);
          }
        }
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
        if (window.matchMedia('(min-width: 992px)').matches) {
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

      // Instagram:
      initInstaSlideshow();

      $default_slideshow.each(function(i, k) {
        // Default slideshows
        var $slider = $(this);
        $slider.not('.slick-initialized').slick(sliderSettings.standard);
      });
    }

    // Init scripts
    initSlideshows();

    // Add button to hero video
    $($button).insertAfter($heroVideo);

    $('.news-modal .modal').on('hide.bs.modal', function(e) {
      pauseVideos(e.target.querySelectorAll('iframe'));
    });

    $(document).on('click', '.hero .play-pause-button', function() {
      videoButton('#hero-video', $(this));
    });

    $(document).on('click', '.slick-slider .play-pause-button', function() {
      sliderButtons('.slick-slider', $(this));
    });

    $(document).keydown(function(event) {
      // Except when usen in input,select, etc.
      if ($(event.target).is('input, [contentEditable="true"]')) {
        return;
      }
      switch (event.keyCode) {
        // Pause hero video using space bar
        case 32:
          event.preventDefault();
          videoButton('#hero-video', '.hero .play-pause-button');
          break;
      }
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
