/*
 * jQuery Superfish Menu Plugin
 * Copyright (c) 2013 Joel Birch
 *
 * Dual licensed under the MIT and GPL licenses:
 *	http://www.opensource.org/licenses/mit-license.php
 *	http://www.gnu.org/licenses/gpl.html
 */

(function($) {
  "use strict";

  var methods = (function() {
    // private properties and methods go here
    var c = {
        bcClass: 'sf-breadcrumb',
        menuClass: 'sf-js-enabled',
        anchorClass: 'sf-with-ul',
        menuArrowClass: 'sf-arrows'
      },
      ios = (function() {
        var ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (ios) {
          // iOS clicks only bubble as far as body children
          $(window).load(function() {
            $('body').children().on('click', $.noop);
          });
        }
        return ios;
      })(),
      wp7 = (function() {
        var style = document.documentElement.style;
        return ('behavior' in style && 'fill' in style && /iemobile/i.test(navigator.userAgent));
      })(),
      toggleMenuClasses = function($menu, o) {
        var classes = c.menuClass;
        if (o.cssArrows) {
          classes += ' ' + c.menuArrowClass;
        }
        $menu.toggleClass(classes);
      },
      setPathToCurrent = function($menu, o) {
        return $menu.find('li.' + o.pathClass).slice(0, o.pathLevels).addClass(o.hoverClass + ' ' + c.bcClass).filter(function() {
          return ($(this).children(o.popUpSelector).hide().show().length);
        }).removeClass(o.pathClass);
      },
      toggleAnchorClass = function($li) {
        $li.children('a').toggleClass(c.anchorClass);
      },
      toggleTouchAction = function($menu) {
        var touchAction = $menu.css('ms-touch-action');
        touchAction = (touchAction === 'pan-y') ?
          'auto' :
          'pan-y';
        $menu.css('ms-touch-action', touchAction);
      },
      applyHandlers = function($menu, o) {
        var targets = 'li:has(' + o.popUpSelector + ')';
        if ($.fn.hoverIntent && !o.disableHI) {
          $menu.hoverIntent(over, out, targets);
        } else {
          $menu.on('mouseenter.superfish', targets, over).on('mouseleave.superfish', targets, out);
        }
        var touchevent = 'MSPointerDown.superfish';
        if (!ios) {
          touchevent += ' touchend.superfish';
        }
        if (wp7) {
          touchevent += ' mousedown.superfish';
        }
        $menu.on('focusin.superfish', 'li', over).on('focusout.superfish', 'li', out).on(touchevent, 'a', o, touchHandler);
      },
      touchHandler = function(e) {
        var $this = $(this),
          $ul = $this.siblings(e.data.popUpSelector);

        if ($ul.length > 0 && $ul.is(':hidden')) {
          $this.one('click.superfish', false);
          if (e.type === 'MSPointerDown') {
            $this.trigger('focus');
          } else {
            $.proxy(over, $this.parent('li'))();
          }
        }
      },
      over = function() {
        var $this = $(this),
          o = getOptions($this);
        clearTimeout(o.sfTimer);
        $this.siblings().superfish('hide').end().superfish('show');
      },
      out = function() {
        var $this = $(this),
          o = getOptions($this);
        if (ios) {
          $.proxy(close, $this, o)();
        } else {
          clearTimeout(o.sfTimer);
          o.sfTimer = setTimeout($.proxy(close, $this, o), o.delay);
        }
      },
      close = function(o) {
        o.retainPath = ($.inArray(this[0], o.$path) > -1);
        this.superfish('hide');

        if (!this.parents('.' + o.hoverClass).length) {
          o.onIdle.call(getMenu(this));
          if (o.$path.length) {
            $.proxy(over, o.$path)();
          }
        }
      },
      getMenu = function($el) {
        return $el.closest('.' + c.menuClass);
      },
      getOptions = function($el) {
        return getMenu($el).data('sf-options');
      };

    return {
      // public methods
      hide: function(instant) {
        if (this.length) {
          var $this = this,
            o = getOptions($this);
          if (!o) {
            return this;
          }
          var not = (o.retainPath === true) ?
            o.$path :
            '',
            $ul = $this.find('li.' + o.hoverClass).add(this).not(not).removeClass(o.hoverClass).children(o.popUpSelector),
            speed = o.speedOut;

          if (instant) {
            $ul.show();
            speed = 0;
          }
          o.retainPath = false;
          o.onBeforeHide.call($ul);
          $ul.stop(true, true).animate(o.animationOut, speed, function() {
            var $this = $(this);
            o.onHide.call($this);
          });
        }
        return this;
      },
      show: function() {
        var o = getOptions(this);
        if (!o) {
          return this;
        }
        var $this = this.addClass(o.hoverClass),
          $ul = $this.children(o.popUpSelector);

        o.onBeforeShow.call($ul);
        $ul.stop(true, true).animate(o.animation, o.speed, function() {
          o.onShow.call($ul);
        });
        return this;
      },
      destroy: function() {
        return this.each(function() {
          var $this = $(this),
            o = $this.data('sf-options'),
            $hasPopUp;
          if (!o) {
            return false;
          }
          $hasPopUp = $this.find(o.popUpSelector).parent('li');
          clearTimeout(o.sfTimer);
          toggleMenuClasses($this, o);
          toggleAnchorClass($hasPopUp);
          toggleTouchAction($this);
          // remove event handlers
          $this.off('.superfish').off('.hoverIntent');
          // clear animation's inline display style
          $hasPopUp.children(o.popUpSelector).attr('style', function(i, style) {
            return style.replace(/display[^;]+;?/g, '');
          });
          // reset 'current' path classes
          o.$path.removeClass(o.hoverClass + ' ' + c.bcClass).addClass(o.pathClass);
          $this.find('.' + o.hoverClass).removeClass(o.hoverClass);
          o.onDestroy.call($this);
          $this.removeData('sf-options');
        });
      },
      init: function(op) {
        return this.each(function() {
          var $this = $(this);
          if ($this.data('sf-options')) {
            return false;
          }
          var o = $.extend({}, $.fn.superfish.defaults, op),
            $hasPopUp = $this.find(o.popUpSelector).parent('li');
          o.$path = setPathToCurrent($this, o);

          $this.data('sf-options', o);

          toggleMenuClasses($this, o);
          toggleAnchorClass($hasPopUp);
          toggleTouchAction($this);
          applyHandlers($this, o);

          $hasPopUp.not('.' + c.bcClass).superfish('hide', true);

          o.onInit.call(this);
        });
      }
    };
  })();

  $.fn.superfish = function(method, args) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      return $.error('Method ' + method + ' does not exist on jQuery.fn.superfish');
    }
  };

  $.fn.superfish.defaults = {
    popUpSelector: 'ul,.sf-mega', // within menu context
    hoverClass: 'sfHover',
    pathClass: 'overrideThisToUse',
    pathLevels: 1,
    delay: 800,
    animation: {
      opacity: 'show'
    },
    animationOut: {
      opacity: 'hide'
    },
    speed: 'normal',
    speedOut: 'fast',
    cssArrows: false,
    disableHI: false,
    onInit: $.noop,
    onBeforeShow: $.noop,
    onShow: $.noop,
    onBeforeHide: $.noop,
    onHide: $.noop,
    onIdle: $.noop,
    onDestroy: $.noop
  };

  // soon to be deprecated
  $.fn.extend({
    hideSuperfishUl: methods.hide,
    showSuperfishUl: methods.show
  });

})(jQuery);

/**
 * hoverIntent
 * @param  handlerIn   function OR configuration object
 * @param  handlerOut  function OR selector for delegation OR undefined
 * @param  selector    selector OR undefined
 * @author Brian Cherne <brian(at)cherne(dot)net>
 **/
(function($) {
  $.fn.hoverIntent = function(handlerIn, handlerOut, selector) {

    // default configuration values
    var cfg = {
      interval: 100,
      sensitivity: 7,
      timeout: 0
    };

    if (typeof handlerIn === "object") {
      cfg = $.extend(cfg, handlerIn);
    } else if ($.isFunction(handlerOut)) {
      cfg = $.extend(cfg, {
        over: handlerIn,
        out: handlerOut,
        selector: selector
      });
    } else {
      cfg = $.extend(cfg, {
        over: handlerIn,
        out: handlerIn,
        selector: handlerOut
      });
    }

    // instantiate variables
    // cX, cY = current X and Y position of mouse, updated by mousemove event
    // pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
    var cX,
      cY,
      pX,
      pY;

    // A private function for getting mouse position
    var track = function(ev) {
      cX = ev.pageX;
      cY = ev.pageY;
    };

    // A private function for comparing current and previous mouse position
    var compare = function(ev, ob) {
      ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
      // compare mouse positions to see if they've crossed the threshold
      if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
        $(ob).off("mousemove.hoverIntent", track);
        // set hoverIntent state to true (so mouseOut can be called)
        ob.hoverIntent_s = 1;
        return cfg.over.apply(ob, [ev]);
      } else {
        // set previous coordinates for next time
        pX = cX;
        pY = cY;
        // use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
        ob.hoverIntent_t = setTimeout(function() {
          compare(ev, ob);
        }, cfg.interval);
      }
    };

    // A private function for delaying the mouseOut function
    var delay = function(ev, ob) {
      ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
      ob.hoverIntent_s = 0;
      return cfg.out.apply(ob, [ev]);
    };

    // A private function for handling mouse 'hovering'
    var handleHover = function(e) {
      // copy objects to be passed into t (required for event object to be passed in IE)
      var ev = jQuery.extend({}, e);
      var ob = this;

      // cancel hoverIntent timer if it exists
      if (ob.hoverIntent_t) {
        ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
      }

      // if e.type == "mouseenter"
      if (e.type == "mouseenter") {
        // set "previous" X and Y position based on initial entry point
        pX = ev.pageX;
        pY = ev.pageY;
        // update "current" X and Y position based on mousemove
        $(ob).on("mousemove.hoverIntent", track);
        // start polling interval (self-calling timeout) to compare mouse coordinates over time
        if (ob.hoverIntent_s != 1) {
          ob.hoverIntent_t = setTimeout(function() {
            compare(ev, ob);
          }, cfg.interval);
        }

        // else e.type == "mouseleave"
      } else {
        // unbind expensive mousemove event
        $(ob).off("mousemove.hoverIntent", track);
        // if hoverIntent state is true, then call the mouseOut function after the specified delay
        if (ob.hoverIntent_s == 1) {
          ob.hoverIntent_t = setTimeout(function() {
            delay(ev, ob);
          }, cfg.timeout);
        }
      }
    };

    // listen for mouseenter and mouseleave
    return this.on({
      'mouseenter.hoverIntent': handleHover,
      'mouseleave.hoverIntent': handleHover
    }, cfg.selector);
  };
})(jQuery);
/*
 * jQuery Nivo Slider v3.2
 * http://nivo.dev7studios.com
 *
 * Copyright 2012, Dev7studios
 * Free to use and abuse under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($) {
  var NivoSlider = function(element, options) {
    // Defaults are below
    var settings = $.extend({}, $.fn.nivoSlider.defaults, options);

    // Useful variables. Play carefully.
    var vars = {
      currentSlide: 0,
      currentImage: '',
      totalSlides: 0,
      running: false,
      paused: false,
      stop: false,
      controlNavEl: false
    };

    // Get this slider
    var slider = $(element);
    slider.data('nivo:vars', vars).addClass('nivoSlider');

    // Find our slider children
    var kids = slider.children();
    kids.each(function() {
      var child = $(this);
      var link = '';
      if (!child.is('img')) {
        if (child.is('a')) {
          child.addClass('nivo-imageLink');
          link = child;
        }
        child = child.find('img:first');
      }
      // Get img width & height
      var childWidth = (childWidth === 0) ?
        child.attr('width') :
        child.width(),
        childHeight = (childHeight === 0) ?
        child.attr('height') :
        child.height();

      if (link !== '') {
        link.css('display', 'none');
      }
      child.css('display', 'none');
      vars.totalSlides++;
    });

    // If randomStart
    if (settings.randomStart) {
      settings.startSlide = Math.floor(Math.random() * vars.totalSlides);
    }

    // Set startSlide
    if (settings.startSlide > 0) {
      if (settings.startSlide >= vars.totalSlides) {
        settings.startSlide = vars.totalSlides - 1;
      }
      vars.currentSlide = settings.startSlide;
    }

    // Get initial image
    if ($(kids[vars.currentSlide]).is('img')) {
      vars.currentImage = $(kids[vars.currentSlide]);
    } else {
      vars.currentImage = $(kids[vars.currentSlide]).find('img:first');
    }

    // Show initial link
    if ($(kids[vars.currentSlide]).is('a')) {
      $(kids[vars.currentSlide]).css('display', 'block');
    }

    // Set first background
    var sliderImg = $('<img/>').addClass('nivo-main-image');
    sliderImg.attr('src', vars.currentImage.attr('src')).show();
    slider.append(sliderImg);

    // Detect Window Resize
    $(window).resize(function() {
      slider.children('img').width(slider.width());
      sliderImg.attr('src', vars.currentImage.attr('src'));
      sliderImg.stop().height('auto');
      $('.nivo-slice').remove();
      $('.nivo-box').remove();
    });

    //Create caption
    slider.append($('<div class="nivo-caption"></div>'));

    // Process caption function
    var processCaption = function(settings) {
      var nivoCaption = $('.nivo-caption', slider);
      if (vars.currentImage.attr('title') !== '' && vars.currentImage.attr('title') !== undefined) {
        var title = vars.currentImage.attr('title');
        if (title.substr(0, 1) == '#')
          title = $(title).html();

        if (nivoCaption.css('display') == 'block') {
          setTimeout(function() {
            nivoCaption.html(title);
          }, settings.animSpeed);
        } else {
          nivoCaption.html(title);
          nivoCaption.stop().fadeIn(settings.animSpeed);
        }
      } else {
        nivoCaption.stop().fadeOut(settings.animSpeed);
      }
    };

    //Process initial  caption
    processCaption(settings);

    // In the words of Super Mario "let's a go!"
    var timer = 0;
    if (!settings.manualAdvance && kids.length > 1) {
      timer = setInterval(function() {
        nivoRun(slider, kids, settings, false);
      }, settings.pauseTime);
    }

    // Add Direction nav
    if (settings.directionNav) {
      slider.append('<div class="nivo-directionNav"><a class="nivo-prevNav">' + settings.prevText + '</a><a class="nivo-nextNav">' + settings.nextText + '</a></div>');

      $(slider).on('click', 'a.nivo-prevNav', function() {
        if (vars.running) {
          return false;
        }
        clearInterval(timer);
        timer = '';
        vars.currentSlide -= 2;
        nivoRun(slider, kids, settings, 'prev');
      });

      $(slider).on('click', 'a.nivo-nextNav', function() {
        if (vars.running) {
          return false;
        }
        clearInterval(timer);
        timer = '';
        nivoRun(slider, kids, settings, 'next');
      });
    }

    // Add Control nav
    if (settings.controlNav) {
      vars.controlNavEl = $('<div class="nivo-controlNav"></div>');
      slider.after(vars.controlNavEl);
      for (var i = 0; i < kids.length; i++) {
        if (settings.controlNavThumbs) {
          vars.controlNavEl.addClass('nivo-thumbs-enabled');
          var child = kids.eq(i);
          if (!child.is('img')) {
            child = child.find('img:first');
          }
          if (child.attr('data-thumb'))
            vars.controlNavEl.append('<a class="nivo-control" rel="' + i + '"><img src="' + child.attr('data-thumb') + '" alt="" /></a>');
        } else {
          vars.controlNavEl.append('<a class="nivo-control" rel="' + i + '">' + (i + 1) + '</a>');
        }
      }

      //Set initial active link
      $('a:eq(' + vars.currentSlide + ')', vars.controlNavEl).addClass('active');

      $('a', vars.controlNavEl).bind('click', function() {
        if (vars.running)
          return false;
        if ($(this).hasClass('active'))
          return false;
        clearInterval(timer);
        timer = '';
        sliderImg.attr('src', vars.currentImage.attr('src'));
        vars.currentSlide = $(this).attr('rel') - 1;
        nivoRun(slider, kids, settings, 'control');
      });
    }

    //For pauseOnHover setting
    if (settings.pauseOnHover) {
      slider.hover(function() {
        vars.paused = true;
        clearInterval(timer);
        timer = '';
      }, function() {
        vars.paused = false;
        // Restart the timer
        if (timer === '' && !settings.manualAdvance) {
          timer = setInterval(function() {
            nivoRun(slider, kids, settings, false);
          }, settings.pauseTime);
        }
      });
    }

    // Event when Animation finishes
    slider.bind('nivo:animFinished', function() {
      sliderImg.attr('src', vars.currentImage.attr('src'));
      vars.running = false;
      // Hide child links
      $(kids).each(function() {
        if ($(this).is('a')) {
          $(this).css('display', 'none');
        }
      });
      // Show current link
      if ($(kids[vars.currentSlide]).is('a')) {
        $(kids[vars.currentSlide]).css('display', 'block');
      }
      // Restart the timer
      if (timer === '' && !vars.paused && !settings.manualAdvance) {
        timer = setInterval(function() {
          nivoRun(slider, kids, settings, false);
        }, settings.pauseTime);
      }
      // Trigger the afterChange callback
      settings.afterChange.call(this);
    });

    // Add slices for slice animations
    var createSlices = function(slider, settings, vars) {
      if ($(vars.currentImage).parent().is('a'))
        $(vars.currentImage).parent().css('display', 'block');
      $('img[src="' + vars.currentImage.attr('src') + '"]', slider).not('.nivo-main-image,.nivo-control img').width(slider.width()).css('visibility', 'hidden').show();
      var sliceHeight = ($('img[src="' + vars.currentImage.attr('src') + '"]', slider).not('.nivo-main-image,.nivo-control img').parent().is('a')) ?
        $('img[src="' + vars.currentImage.attr('src') + '"]', slider).not('.nivo-main-image,.nivo-control img').parent().height() :
        $('img[src="' + vars.currentImage.attr('src') + '"]', slider).not('.nivo-main-image,.nivo-control img').height();

      for (var i = 0; i < settings.slices; i++) {
        var sliceWidth = Math.round(slider.width() / settings.slices);

        if (i === settings.slices - 1) {
          slider.append($('<div class="nivo-slice" name="' + i + '"><img src="' + vars.currentImage.attr('src') + '" style="position:absolute; width:' + slider.width() + 'px; height:auto; display:block !important; top:0; left:-' + ((sliceWidth + (i * sliceWidth)) - sliceWidth) + 'px;" /></div>').css({
            left: (sliceWidth * i) + 'px',
            width: (slider.width() - (sliceWidth * i)) + 'px',
            height: sliceHeight + 'px',
            opacity: '0',
            overflow: 'hidden'
          }));
        } else {
          slider.append($('<div class="nivo-slice" name="' + i + '"><img src="' + vars.currentImage.attr('src') + '" style="position:absolute; width:' + slider.width() + 'px; height:auto; display:block !important; top:0; left:-' + ((sliceWidth + (i * sliceWidth)) - sliceWidth) + 'px;" /></div>').css({
            left: (sliceWidth * i) + 'px',
            width: sliceWidth + 'px',
            height: sliceHeight + 'px',
            opacity: '0',
            overflow: 'hidden'
          }));
        }
      }

      $('.nivo-slice', slider).height(sliceHeight);
      sliderImg.stop().animate({
        height: $(vars.currentImage).height()
      }, settings.animSpeed);
    };

    // Add boxes for box animations
    var createBoxes = function(slider, settings, vars) {
      if ($(vars.currentImage).parent().is('a'))
        $(vars.currentImage).parent().css('display', 'block');
      $('img[src="' + vars.currentImage.attr('src') + '"]', slider).not('.nivo-main-image,.nivo-control img').width(slider.width()).css('visibility', 'hidden').show();
      var boxWidth = Math.round(slider.width() / settings.boxCols),
        boxHeight = Math.round($('img[src="' + vars.currentImage.attr('src') + '"]', slider).not('.nivo-main-image,.nivo-control img').height() / settings.boxRows);

      for (var rows = 0; rows < settings.boxRows; rows++) {
        for (var cols = 0; cols < settings.boxCols; cols++) {
          if (cols === settings.boxCols - 1) {
            slider.append($('<div class="nivo-box" name="' + cols + '" rel="' + rows + '"><img src="' + vars.currentImage.attr('src') + '" style="position:absolute; width:' + slider.width() + 'px; height:auto; display:block; top:-' + (boxHeight * rows) + 'px; left:-' + (boxWidth * cols) + 'px;" /></div>').css({
              opacity: 0,
              left: (boxWidth * cols) + 'px',
              top: (boxHeight * rows) + 'px',
              width: (slider.width() - (boxWidth * cols)) + 'px'

            }));
            $('.nivo-box[name="' + cols + '"]', slider).height($('.nivo-box[name="' + cols + '"] img', slider).height() + 'px');
          } else {
            slider.append($('<div class="nivo-box" name="' + cols + '" rel="' + rows + '"><img src="' + vars.currentImage.attr('src') + '" style="position:absolute; width:' + slider.width() + 'px; height:auto; display:block; top:-' + (boxHeight * rows) + 'px; left:-' + (boxWidth * cols) + 'px;" /></div>').css({
              opacity: 0,
              left: (boxWidth * cols) + 'px',
              top: (boxHeight * rows) + 'px',
              width: boxWidth + 'px'
            }));
            $('.nivo-box[name="' + cols + '"]', slider).height($('.nivo-box[name="' + cols + '"] img', slider).height() + 'px');
          }
        }
      }

      sliderImg.stop().animate({
        height: $(vars.currentImage).height()
      }, settings.animSpeed);
    };

    // Private run method
    var nivoRun = function(slider, kids, settings, nudge) {
      // Get our vars
      var vars = slider.data('nivo:vars');

      // Trigger the lastSlide callback
      if (vars && (vars.currentSlide === vars.totalSlides - 1)) {
        settings.lastSlide.call(this);
      }

      // Stop
      if ((!vars || vars.stop) && !nudge) {
        return false;
      }

      // Trigger the beforeChange callback
      settings.beforeChange.call(this);

      // Set current background before change
      if (!nudge) {
        sliderImg.attr('src', vars.currentImage.attr('src'));
      } else {
        if (nudge === 'prev') {
          sliderImg.attr('src', vars.currentImage.attr('src'));
        }
        if (nudge === 'next') {
          sliderImg.attr('src', vars.currentImage.attr('src'));
        }
      }

      vars.currentSlide++;
      // Trigger the slideshowEnd callback
      if (vars.currentSlide === vars.totalSlides) {
        vars.currentSlide = 0;
        settings.slideshowEnd.call(this);
      }
      if (vars.currentSlide < 0) {
        vars.currentSlide = (vars.totalSlides - 1);
      }
      // Set vars.currentImage
      if ($(kids[vars.currentSlide]).is('img')) {
        vars.currentImage = $(kids[vars.currentSlide]);
      } else {
        vars.currentImage = $(kids[vars.currentSlide]).find('img:first');
      }

      // Set active links
      if (settings.controlNav) {
        $('a', vars.controlNavEl).removeClass('active');
        $('a:eq(' + vars.currentSlide + ')', vars.controlNavEl).addClass('active');
      }

      // Process caption
      processCaption(settings);

      // Remove any slices from last transition
      $('.nivo-slice', slider).remove();

      // Remove any boxes from last transition
      $('.nivo-box', slider).remove();

      var currentEffect = settings.effect,
        anims = '';

      // Generate random effect
      if (settings.effect === 'random') {
        anims = new Array('sliceDownRight', 'sliceDownLeft', 'sliceUpRight', 'sliceUpLeft', 'sliceUpDown', 'sliceUpDownLeft', 'fold', 'fade', 'boxRandom', 'boxRain', 'boxRainReverse', 'boxRainGrow', 'boxRainGrowReverse');
        currentEffect = anims[Math.floor(Math.random() * (anims.length + 1))];
        if (currentEffect === undefined) {
          currentEffect = 'fade';
        }
      }

      // Run random effect from specified set (eg: effect:'fold,fade')
      if (settings.effect.indexOf(',') !== -1) {
        anims = settings.effect.split(',');
        currentEffect = anims[Math.floor(Math.random() * (anims.length))];
        if (currentEffect === undefined) {
          currentEffect = 'fade';
        }
      }

      // Custom transition as defined by "data-transition" attribute
      if (vars.currentImage.attr('data-transition')) {
        currentEffect = vars.currentImage.attr('data-transition');
      }

      // Run effects
      vars.running = true;
      var timeBuff = 0,
        i = 0,
        slices = '',
        firstSlice = '',
        totalBoxes = '',
        boxes = '';

      if (currentEffect === 'sliceDown' || currentEffect === 'sliceDownRight' || currentEffect === 'sliceDownLeft') {
        createSlices(slider, settings, vars);
        timeBuff = 0;
        i = 0;
        slices = $('.nivo-slice', slider);
        if (currentEffect === 'sliceDownLeft') {
          slices = $('.nivo-slice', slider)._reverse();
        }

        slices.each(function() {
          var slice = $(this);
          slice.css({
            'top': '0px'
          });
          if (i === settings.slices - 1) {
            setTimeout(function() {
              slice.animate({
                opacity: '1.0'
              }, settings.animSpeed, '', function() {
                slider.trigger('nivo:animFinished');
              });
            }, (100 + timeBuff));
          } else {
            setTimeout(function() {
              slice.animate({
                opacity: '1.0'
              }, settings.animSpeed);
            }, (100 + timeBuff));
          }
          timeBuff += 50;
          i++;
        });
      } else if (currentEffect === 'sliceUp' || currentEffect === 'sliceUpRight' || currentEffect === 'sliceUpLeft') {
        createSlices(slider, settings, vars);
        timeBuff = 0;
        i = 0;
        slices = $('.nivo-slice', slider);
        if (currentEffect === 'sliceUpLeft') {
          slices = $('.nivo-slice', slider)._reverse();
        }

        slices.each(function() {
          var slice = $(this);
          slice.css({
            'bottom': '0px'
          });
          if (i === settings.slices - 1) {
            setTimeout(function() {
              slice.animate({
                opacity: '1.0'
              }, settings.animSpeed, '', function() {
                slider.trigger('nivo:animFinished');
              });
            }, (100 + timeBuff));
          } else {
            setTimeout(function() {
              slice.animate({
                opacity: '1.0'
              }, settings.animSpeed);
            }, (100 + timeBuff));
          }
          timeBuff += 50;
          i++;
        });
      } else if (currentEffect === 'sliceUpDown' || currentEffect === 'sliceUpDownRight' || currentEffect === 'sliceUpDownLeft') {
        createSlices(slider, settings, vars);
        timeBuff = 0;
        i = 0;
        var v = 0;
        slices = $('.nivo-slice', slider);
        if (currentEffect === 'sliceUpDownLeft') {
          slices = $('.nivo-slice', slider)._reverse();
        }

        slices.each(function() {
          var slice = $(this);
          if (i === 0) {
            slice.css('top', '0px');
            i++;
          } else {
            slice.css('bottom', '0px');
            i = 0;
          }

          if (v === settings.slices - 1) {
            setTimeout(function() {
              slice.animate({
                opacity: '1.0'
              }, settings.animSpeed, '', function() {
                slider.trigger('nivo:animFinished');
              });
            }, (100 + timeBuff));
          } else {
            setTimeout(function() {
              slice.animate({
                opacity: '1.0'
              }, settings.animSpeed);
            }, (100 + timeBuff));
          }
          timeBuff += 50;
          v++;
        });
      } else if (currentEffect === 'fold') {
        createSlices(slider, settings, vars);
        timeBuff = 0;
        i = 0;

        $('.nivo-slice', slider).each(function() {
          var slice = $(this);
          var origWidth = slice.width();
          slice.css({
            top: '0px',
            width: '0px'
          });
          if (i === settings.slices - 1) {
            setTimeout(function() {
              slice.animate({
                width: origWidth,
                opacity: '1.0'
              }, settings.animSpeed, '', function() {
                slider.trigger('nivo:animFinished');
              });
            }, (100 + timeBuff));
          } else {
            setTimeout(function() {
              slice.animate({
                width: origWidth,
                opacity: '1.0'
              }, settings.animSpeed);
            }, (100 + timeBuff));
          }
          timeBuff += 50;
          i++;
        });
      } else if (currentEffect === 'fade') {
        createSlices(slider, settings, vars);

        firstSlice = $('.nivo-slice:first', slider);
        firstSlice.css({
          'width': slider.width() + 'px'
        });

        firstSlice.animate({
          opacity: '1.0'
        }, (settings.animSpeed * 2), '', function() {
          slider.trigger('nivo:animFinished');
        });
      } else if (currentEffect === 'slideInRight') {
        createSlices(slider, settings, vars);

        firstSlice = $('.nivo-slice:first', slider);
        firstSlice.css({
          'width': '0px',
          'opacity': '1'
        });

        firstSlice.animate({
          width: slider.width() + 'px'
        }, (settings.animSpeed * 2), '', function() {
          slider.trigger('nivo:animFinished');
        });
      } else if (currentEffect === 'slideInLeft') {
        createSlices(slider, settings, vars);

        firstSlice = $('.nivo-slice:first', slider);
        firstSlice.css({
          'width': '0px',
          'opacity': '1',
          'left': '',
          'right': '0px'
        });

        firstSlice.animate({
          width: slider.width() + 'px'
        }, (settings.animSpeed * 2), '', function() {
          // Reset positioning
          firstSlice.css({
            'left': '0px',
            'right': ''
          });
          slider.trigger('nivo:animFinished');
        });
      } else if (currentEffect === 'boxRandom') {
        createBoxes(slider, settings, vars);

        totalBoxes = settings.boxCols * settings.boxRows;
        i = 0;
        timeBuff = 0;

        boxes = shuffle($('.nivo-box', slider));
        boxes.each(function() {
          var box = $(this);
          if (i === totalBoxes - 1) {
            setTimeout(function() {
              box.animate({
                opacity: '1'
              }, settings.animSpeed, '', function() {
                slider.trigger('nivo:animFinished');
              });
            }, (100 + timeBuff));
          } else {
            setTimeout(function() {
              box.animate({
                opacity: '1'
              }, settings.animSpeed);
            }, (100 + timeBuff));
          }
          timeBuff += 20;
          i++;
        });
      } else if (currentEffect === 'boxRain' || currentEffect === 'boxRainReverse' || currentEffect === 'boxRainGrow' || currentEffect === 'boxRainGrowReverse') {
        createBoxes(slider, settings, vars);

        totalBoxes = settings.boxCols * settings.boxRows;
        i = 0;
        timeBuff = 0;

        // Split boxes into 2D array
        var rowIndex = 0;
        var colIndex = 0;
        var box2Darr = [];
        box2Darr[rowIndex] = [];
        boxes = $('.nivo-box', slider);
        if (currentEffect === 'boxRainReverse' || currentEffect === 'boxRainGrowReverse') {
          boxes = $('.nivo-box', slider)._reverse();
        }
        boxes.each(function() {
          box2Darr[rowIndex][colIndex] = $(this);
          colIndex++;
          if (colIndex === settings.boxCols) {
            rowIndex++;
            colIndex = 0;
            box2Darr[rowIndex] = [];
          }
        });

        // Run animation
        for (var cols = 0; cols < (settings.boxCols * 2); cols++) {
          var prevCol = cols;
          for (var rows = 0; rows < settings.boxRows; rows++) {
            if (prevCol >= 0 && prevCol < settings.boxCols) {
              /* Due to some weird JS bug with loop vars
                            being used in setTimeout, this is wrapped
                            with an anonymous function call */
              (function(row, col, time, i, totalBoxes) {
                var box = $(box2Darr[row][col]);
                var w = box.width();
                var h = box.height();
                if (currentEffect === 'boxRainGrow' || currentEffect === 'boxRainGrowReverse') {
                  box.width(0).height(0);
                }
                if (i === totalBoxes - 1) {
                  setTimeout(function() {
                    box.animate({
                      opacity: '1',
                      width: w,
                      height: h
                    }, settings.animSpeed / 1.3, '', function() {
                      slider.trigger('nivo:animFinished');
                    });
                  }, (100 + time));
                } else {
                  setTimeout(function() {
                    box.animate({
                      opacity: '1',
                      width: w,
                      height: h
                    }, settings.animSpeed / 1.3);
                  }, (100 + time));
                }
              })(rows, prevCol, timeBuff, i, totalBoxes);
              i++;
            }
            prevCol--;
          }
          timeBuff += 100;
        }
      }
    };

    // Shuffle an array
    var shuffle = function(arr) {
      for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i, 10), x = arr[--i], arr[i] = arr[j], arr[j] = x)
      ;
      return arr;
    };

    // For debugging
    var trace = function(msg) {
      if (this.console && typeof console.log !== 'undefined') {
        console.log(msg);
      }
    };

    // Start / Stop
    this.stop = function() {
      if (!$(element).data('nivo:vars').stop) {
        $(element).data('nivo:vars').stop = true;
        trace('Stop Slider');
      }
    };

    this.start = function() {
      if ($(element).data('nivo:vars').stop) {
        $(element).data('nivo:vars').stop = false;
        trace('Start Slider');
      }
    };

    // Trigger the afterLoad callback
    settings.afterLoad.call(this);

    return this;
  };

  $.fn.nivoSlider = function(options) {
    return this.each(function(key, value) {
      var element = $(this);
      // Return early if this element already has a plugin instance
      if (element.data('nivoslider')) {
        return element.data('nivoslider');
      }
      // Pass options to plugin constructor
      var nivoslider = new NivoSlider(this, options);
      // Store plugin object in this element's data
      element.data('nivoslider', nivoslider);
    });
  };

  //Default settings
  $.fn.nivoSlider.defaults = {
    effect: 'fade',
    slices: 15,
    boxCols: 8,
    boxRows: 4,
    animSpeed: 500,
    pauseTime: 5000,
    startSlide: 0,
    directionNav: true,
    controlNav: true,
    controlNavThumbs: false,
    pauseOnHover: true,
    manualAdvance: false,
    prevText: 'Prev',
    nextText: 'Next',
    randomStart: true,
    beforeChange: function() {},
    afterChange: function() {},
    slideshowEnd: function() {},
    lastSlide: function() {},
    afterLoad: function() {}
  };

  $.fn._reverse = [].reverse;

})(jQuery);

/* Global footer for ku.dk */
jQuery(function($) {
  // Check if the page is responsive
  if ($('meta[name="viewport"]').length) {
    var $responsiveEnabled = true;
  }

  var $footerHeader = $('#globalfooter .footer-heading[data-heading="toggle"]');
  var $footerColumn = $('#globalfooter .footer-heading[data-heading="toggle"] + .footerlinks');
  var $cachedWidth = $('body').prop('clientWidth');

  $footerHeader.click(function(e) {
    collapseFooter(this, e);
  });

  var collapseFooter = function(el, ev) {
    if ($responsiveEnabled === true && $cachedWidth < 768) {
      ev.preventDefault();
      $(el).next('ul').slideToggle();
      $(el).toggleClass('open');
    } else {
      $(el).next('ul').show();
    }
  };
  $(window).resize(function() {
    var $newWidth = $('body').prop('clientWidth');
    if ($responsiveEnabled === true && $newWidth !== $cachedWidth) {
      $footerHeader.removeClass('open');
      $footerColumn.removeAttr('style');
      $cachedWidth = $newWidth;
    }
  });

  //News in global menu
  /* Truncate multiple lines of text */
  var char = 80; // number of characters
  var news = $('.sf-menu ul.nyheder li a');
  if (news) {
    news.each(function(i, v) {
      var txt = $(this).text();
      if (txt.length > char) {
        $(this).html($(this).html().substring(0, char) + '...');
      }
    });
  }

  function trackNews() {
    // Add tracking params to global menu news list
    var $li = $('.sf-menu .nyheder li:not(.no-track)');
    if ($li) {
      $li.each(function (i, v) {
        // Get current urls from news
        var url = $(this).find('a').attr("href");
        // Create new url with params
        var urlWithParams = url + "?utm_source=Nyheder&utm_medium=Link&utm_campaign=kudk-globalmenu";
        // Set new herf value
        $(this).find('a').attr("href", urlWithParams);
      });
    }
  }
  trackNews();

  /* Navnetraek with sub head fix */
  var brandingUnit = $('#branding-unit');
  var subhead = $('#subhead');
  var hasSubhead = brandingUnit.has(subhead).length ? true : false;
  if (hasSubhead === true) {
    brandingUnit.find('h2').addClass('with-subhead');
  }

  /* Animate scrolling on anchors */
  $('a[href*="#"]:not([href="#"]):not([href^=#collapse])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });

  // Tooltips
  $('[data-toggle="popover"]').on('click mouseover', function() {
    $('.tooltiptext').remove();
    var tooltext = $(this).attr("data-content");
    tooltipTemplate = [
    '<span',
    ' class="tooltiptext">',
    '', tooltext, '',
    '</span>',
  ].join("");
    $(this).append(tooltipTemplate);
  }).mouseout(function() {
    $(this).find('.tooltiptext').css('display', 'none');
  });
});

function shareURL(dest) {
  // Usage, e.g.: onclick="shareURL('facebook')"

  var urlMap = {
    facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
    linkedin: 'http://www.linkedin.com/shareArticle?mini=true&amp;url=',
    twitter: 'https://twitter.com/home?status='
  };
  // Get current url
  var url = window.location.href;
  var param = dest.toLowerCase().trim();

  var media = $.map(urlMap, function (i, e) {
    // return keys
    return e;
  });

  if ($.inArray(param, media) !== -1) {
    // if supplied parameter matches one of the possible media channels, continue the execution.
    // LinkedIn has extra parametres appending the url:
    var docTitle = document.title || '';
    var source = location.hostname || '';
    var isLinkedin = (param == 'linkedin') ? true : false;
    var suffix = (isLinkedin === true) ? '&title=' + encodeURIComponent(docTitle) + '&summary=&source=' + encodeURI(source) : '';
    // Open in a new window:
    window.open(encodeURI(urlMap[param]) + encodeURI(url) + suffix);
  } else {
    console.log('Please call the function like this: onclick="shareURL(\'facebook)\'"');
  }
}
