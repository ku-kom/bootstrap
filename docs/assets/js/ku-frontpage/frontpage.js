/*global GlueFrame*/
/* NEL, KU KOM, 2021.
 * Scripts for ku.dk frontpage.
 */
(function($) {
  'use strict';


  $(document).ready(function() {
    var $lang = $('html').prop('lang');

    var translations;
    if ($lang === 'da') {
      translations = {
        "pause": "Stop afspilning (brug Enter tast)",
        "play": "Afspil (brug Enter tast)"
      }
    } else {
      translations = {
        "pause": "Pause (use Enter key)",
        "play": "Play (use Enter bar)"
      }
    }

    // Returns false if the user has enabled reduced animations:
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // Tracking elements
    var trackHero = $('.hero .video-container').next('a');
    var tracFeatures = $('.visuelt-element .visual-img').next('a');
    // Sliders
    var $heroVideo = $('#hero-video');
    var $slideshow = $('.slick-slider');
    var $default_slideshow = $('.default_slideshow > .container > .row');
    var $instaslider = $('.instaslider');
    var $newsslider = $('.slide-columns > .container > .row');
    var $valueslider = $('.valueslider');
    // Playser / pause buttons
    var $button = '<button aria-label="' + translations.pause + '" class="play-pause-button" type="button"></button>';

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
        slide: '.slide-link',
        rows: 0, // Do not remove this, otherwise the above setting won't work.
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: (reduceMotion.matches) ? false : true,
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
        autoplay: (reduceMotion.matches) ? false : true,
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

    function videoButton(el, btn, state) {
      // Function to toggle video play/pause states.
      var v = $(el).get(0);
      if (!v) {
        return;
      }

      if (v.paused || v.ended) {
        $(btn).removeClass('paused');
        $(btn).prop('aria-label', translations.pause);
        v.play();
      } else {
        $(btn).addClass('paused');
        $(btn).prop('aria-label', translations.play);
        v.pause();
      }

    }

    if (reduceMotion.matches) {
      // Stop all videos if reduced motion is requested.
      $('video').each(function() {
        var v = $(this);
        v.get(0).pause();
        v.get(0).currentTime = 0;
        v.next('.play-pause-button').addClass('paused');
        v.next('.play-pause-button').prop('aria-label', translations.play);
      });
    }

    function sliderButtons(el, btn, state) {
      // Slider buttons
      $(btn).toggleClass('paused');
      if ($(btn).hasClass('paused')) {
        $(btn).prop('aria-label', translations.play);
        $(el).slick('slickPause');
      } else {
        $(btn).prop('aria-label', translations.pause);
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

      // tal og fakta-slider
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
      videoButton($heroVideo, $(this));
    });

    $(document).on('click', '.slick-slider .play-pause-button', function() {
      sliderButtons('.slick-slider', $(this));
    });

    // Rebuild page on screen size change
    $(window).on('resize orientationchange', debounce(function() {
      destroySlideshow();
      initSlideshows();
      initInstaSlideshow();
    }, 250));

    // Add classes for GTM tracking purposes
    trackHero.addClass('ku-topbanner');
    tracFeatures.addClass('ku-feature');

    // Fixing accessibility issue with mobile menu - until this issue is fixed:
    // https://github.com/FrDH/mmenu-js/issues/817
    $('.mm-menu').find('.mm-tabstart, .mm-tabend').prop('tabindex', '-1');

    // Add heading semantics to heading if no h1 or h1 roles on page
    if (!$('h1').length || !$('[aria-level="1"]').length) {
      var heading = $('.ku-branding-text-major');
      if (heading.length) {
        heading.prop('role', 'heading');
        heading.prop('aria-level', '1');
      }
    }

  });

})(jQuery);
