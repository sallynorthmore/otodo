// Utility for creating objects in older browsers
if (typeof Object.create !== 'function') {
  Object.create = function (obj) {

    function F() {}
    F.prototype = obj;
    return new F();
  };
}

/*!
 * jQuery panelSnap
 * Version 0.15.1
 *
 * Requires:
 * - jQuery 1.7 or higher (no jQuery.migrate needed)
 *
 * https://github.com/guidobouman/jquery-panelsnap
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Wed Feb 13 16:05:00 2013 +0100
 */
(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'panelSnap';
  var storageName = 'plugin_' + pluginName;

  var pluginObject = {

    isMouseDown: false,
    isSnapping: false,
    enabled: true,
    scrollOffset: 0,

    init: function (options, container) {

      var self = this;

      self.container = container;
      self.$container = $(container);

      self.$eventContainer = self.$container;
      self.$snapContainer = self.$container;

      if (self.$container.is('body')) {
        self.$eventContainer = $(document);
        self.$snapContainer = $(document.documentElement);

        var ua = navigator.userAgent;
        if (~ua.indexOf('WebKit')) {
          self.$snapContainer = $('body');
        }
      }

      self.options = $.extend(true, {}, $.fn.panelSnap.options, options);

      self.bind();

      if (self.options.$menu !== false && $('.active', self.options.$menu).length > 0) {
        $('.active', self.options.$menu).click();
      } else {
        var $target = self.getPanel(':first');
        self.activatePanel($target);
      }

      return self;
    },

    bind: function () {

      var self = this;

      self.bindProxied(self.$eventContainer, 'scrollstop', self.scrollStop);
      self.bindProxied(self.$eventContainer, 'mousewheel', self.mouseWheel);
      self.bindProxied(self.$eventContainer, 'mousedown', self.mouseDown);
      self.bindProxied(self.$eventContainer, 'mouseup', self.mouseUp);

      self.bindProxied($(window), 'resizestop', self.resize);

      if (self.options.$menu) {
        self.bindProxied(self.options.$menu, 'click', self.captureMenuClick, self.options.menuSelector);
      }

      if (self.options.navigation.keys.nextKey || self.options.navigation.keys.prevKey) {
        self.bindProxied($(window), 'keydown', self.keyDown);
      }

      if (self.options.navigation.buttons.$nextButton) {
        self.bindProxied(self.options.navigation.buttons.$nextButton, 'click', self.captureNextClick);
      }

      if (self.options.navigation.buttons.$prevButton) {
        self.bindProxied(self.options.navigation.buttons.$prevButton, 'click', self.capturePrevClick);
      }
    },

    bindProxied: function ($element, event, method, selector) {

      var self = this;

      selector = typeof selector === 'string' ? selector : null;

      $element.on(event + self.options.namespace, selector, $.proxy(function (e) {

        return method.call(self, e);
      }, self));
    },

    destroy: function () {

      var self = this;

      // Gotta love namespaced events!
      self.$eventContainer.off(self.options.namespace);

      $(window).off(self.options.namespace);

      if (self.options.$menu !== false) {
        $(self.options.menuSelector, self.options.$menu).off(self.options.namespace);
      }

      self.$container.removeData(storageName);
    },

    scrollStop: function (e) {

      var self = this;

      e.stopPropagation();

      if (self.isMouseDown) {
        return;
      }

      if (self.isSnapping) {
        return;
      }

      // Check if enabled or just 1 panel in viewport
      var panelsInViewPort = self.getPanelsInViewport();
      if (!self.enabled || panelsInViewPort.length < 2) {
        $target = panelsInViewPort.eq(0);
        if (!$target.is(self.getPanel('.active'))) {
          self.activatePanel($target);
        }

        return;
      }

      var offset = self.$snapContainer.scrollTop();
      var scrollDifference = offset - self.scrollOffset;
      var overThreshold = Math.abs(scrollDifference) > self.options.directionThreshold;

      var panelNumber;
      if (scrollDifference > 0) {
        panelNumber = overThreshold ? 1 : 0;
      } else if (scrollDifference < 0) {
        panelNumber = overThreshold ? 0 : 1;
      } else {
        // Nothing to scroll, get out.
        return;
      }

      var $target = panelsInViewPort.eq(panelNumber);
      var maxOffset = self.$container[0].scrollHeight - self.scrollInterval;

      if (offset <= 0 || offset >= maxOffset) {
        // Only activate, prevent stuttering
        self.activatePanel($target);
        // Set scrollOffset to a sane number for next scroll
        self.scrollOffset = offset <= 0 ? 0 : maxOffset;
      } else {
        self.snapToPanel($target);
      }
    },

    getPanelsInViewport: function () {

      var self = this;

      var viewport = { top: self.$snapContainer.scrollTop() };
      viewport.bottom = viewport.top + self.$snapContainer.height();

      var panels = self.getPanel().filter(function (_, el) {
        var $el = $(el);
        var bounds;

        if (self.$container.is('body')) {
          bounds = $el.offset();
        } else {
          bounds = $el.position();
          bounds.top += self.$snapContainer.scrollTop();
        }

        bounds.bottom = bounds.top + $el.outerHeight();

        return !(viewport.bottom < bounds.top || viewport.top > bounds.bottom);
      });

      return panels;
    },

    mouseWheel: function (e) {

      var self = this;

      // This event only fires when the user actually scrolls with their input device.
      // Be it a trackpad, legacy mouse or anything else.

      if (self.isSnapping) {
        self.scrollOffset = self.$snapContainer.scrollTop();
        self.$snapContainer.stop(true);
        self.isSnapping = false;
      }
    },

    mouseDown: function (e) {

      var self = this;

      self.isMouseDown = true;
    },

    mouseUp: function (e) {

      var self = this;

      self.isMouseDown = false;

      if (self.scrollOffset !== self.$snapContainer.scrollTop()) {
        self.scrollStop(e);
      }
    },

    keyDown: function (e) {

      var self = this;

      var nav = self.options.navigation;

      if (!self.enabled) {
        return;
      }

      switch (e.which) {
        case nav.keys.prevKey:
        case nav.keys.nextKey:
          e.preventDefault();
      }

      if (self.isSnapping) {
        return;
      }

      switch (e.which) {
        case nav.keys.prevKey:
          self.snapTo('prev', nav.wrapAround);
          break;
        case nav.keys.nextKey:
          self.snapTo('next', nav.wrapAround);
          break;
      }
    },

    captureNextClick: function (e) {

      var self = this;

      e.preventDefault();

      if (self.isSnapping) {
        return;
      }

      self.snapTo('next', self.options.navigation.wrapAround);
    },

    capturePrevClick: function (e) {

      var self = this;

      e.preventDefault();

      if (self.isSnapping) {
        return;
      }

      self.snapTo('prev', self.options.navigation.wrapAround);
    },

    resize: function (e) {

      var self = this;

      if (!self.enabled) {
        return;
      }

      var $target = self.getPanel('.active');

      self.snapToPanel($target);
    },

    captureMenuClick: function (e) {

      var self = this;

      var panel = $(e.currentTarget).data('panel');
      var $target = self.getPanel('[data-panel="' + panel + '"]');

      self.snapToPanel($target);

      return false;
    },

    snapToPanel: function ($target) {

      var self = this;

      if (!$target.jquery) {
        return;
      }

      self.isSnapping = true;

      self.options.onSnapStart.call(self, $target);
      self.$container.trigger('panelsnap:start', [$target]);

      var scrollTarget = 0;
      if (self.$container.is('body')) {
        scrollTarget = $target.offset().top;
      } else {
        scrollTarget = self.$snapContainer.scrollTop() + $target.position().top;
      }

      scrollTarget -= self.options.offset;

      self.$snapContainer.stop(true).delay(self.options.delay).animate({
        scrollTop: scrollTarget
      }, self.options.slideSpeed, self.options.easing, function () {

        // Set scrollOffset to scrollTop
        // (not to scrollTarget since on iPad those sometimes differ)
        self.scrollOffset = self.$snapContainer.scrollTop();
        self.isSnapping = false;

        // Call callback
        self.options.onSnapFinish.call(self, $target);
        self.$container.trigger('panelsnap:finish', [$target]);

        self.activatePanel($target);
      });
    },

    activatePanel: function ($target) {

      var self = this;

      self.getPanel('.active').removeClass('active');
      $target.addClass('active');

      if (self.options.$menu !== false) {
        var activeItemSelector = self.options.menuSelector + '.active';
        $(activeItemSelector, self.options.$menu).removeClass('active');

        var attribute = '[data-panel="' + $target.data('panel') + '"]';
        var itemSelector = self.options.menuSelector + attribute;
        var $itemToActivate = $(itemSelector, self.options.$menu);
        $itemToActivate.addClass('active');
      }

      var nav = self.options.navigation;

      if (!nav.wrapAround) {
        var $panels = self.getPanel();
        var index = $panels.index(self.getPanel('.active'));

        if (nav.buttons.$nextButton !== false) {
          $target = $panels.eq(index + 1);
          if ($target.length < 1) {
            $(nav.buttons.$nextButton).attr('aria-disabled', 'true');
            $(nav.buttons.$nextButton).addClass('disabled');
          } else {
            $(nav.buttons.$nextButton).attr('aria-disabled', 'false');
            $(nav.buttons.$nextButton).removeClass('disabled');
          }
        }

        if (nav.buttons.$prevButton !== false) {
          if (index < 1) {
            $(nav.buttons.$prevButton).attr('aria-disabled', 'true');
            $(nav.buttons.$prevButton).addClass('disabled');
          } else {
            $(nav.buttons.$prevButton).attr('aria-disabled', 'false');
            $(nav.buttons.$prevButton).removeClass('disabled');
          }
        }
      }

      self.options.onActivate.call(self, $target);
      self.$container.trigger('panelsnap:activate', [$target]);
    },

    getPanel: function (selector) {

      var self = this;

      if (typeof selector === 'undefined') {
        selector = '';
      }

      return $(self.options.panelSelector + selector, self.$container);
    },

    snapTo: function (target, wrap) {

      var self = this;

      if (typeof wrap !== 'boolean') {
        wrap = true;
      }

      var $panels = self.getPanel();
      var index = $panels.index(self.getPanel('.active'));
      var $target;

      switch (target) {
        case 'prev':

          $target = $panels.eq(index - 1);
          if (index < 1 && !wrap) {
            $target = []; // Clear target, because negative indexes wrap automatically
          }
          break;

        case 'next':

          $target = $panels.eq(index + 1);
          if ($target.length < 1 && wrap) {
            $target = $panels.filter(':first');
          }
          break;

        case 'first':

          $target = $panels.filter(':first');
          break;

        case 'last':

          $target = $panels.filter(':last');
          break;
      }

      if ($target.length > 0) {
        self.snapToPanel($target);
      }
    },

    enable: function () {

      var self = this;

      // Gather scrollOffset for next scroll
      self.scrollOffset = self.$snapContainer.scrollTop();

      self.enabled = true;
    },

    disable: function () {

      var self = this;

      self.enabled = false;
    },

    toggle: function () {

      var self = this;

      if (self.enabled) {
        self.disable();
      } else {
        self.enable();
      }
    }

  };

  $.fn[pluginName] = function (options) {

    var args = Array.prototype.slice.call(arguments);

    return this.each(function () {

      var pluginInstance = $.data(this, storageName);
      if (typeof options === 'object' || options === 'init' || !options) {
        if (!pluginInstance) {
          if (options === 'init') {
            options = args[1] || {};
          }

          pluginInstance = Object.create(pluginObject).init(options, this);
          $.data(this, storageName, pluginInstance);
        } else {
          $.error('Plugin is already initialized for this object.');
          return;
        }
      } else if (!pluginInstance) {
        $.error('Plugin is not initialized for this object yet.');
        return;
      } else if (pluginInstance[options]) {
        var method = options;
        options = args.slice(1);
        pluginInstance[method].apply(pluginInstance, options);
      } else {
        $.error('Method ' + options + ' does not exist on jQuery.panelSnap.');
        return;
      }
    });
  };

  $.fn[pluginName].options = {
    $menu: false,
    menuSelector: 'a',
    panelSelector: '> section',
    namespace: '.panelSnap',
    onSnapStart: function () {},
    onSnapFinish: function () {},
    onActivate: function () {},
    directionThreshold: 50,
    slideSpeed: 200,
    delay: 0,
    easing: 'linear',
    offset: 0,
    navigation: {
      keys: {
        nextKey: false,
        prevKey: false
      },
      buttons: {
        $nextButton: false,
        $prevButton: false
      },
      wrapAround: false
    }
  };
})(jQuery, window, document);

/*!
 * Special flavoured jQuery Mobile scrollstart & scrollstop events.
 * Version 0.1.3
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Wed Feb 13 16:05:00 2013 +0100
 */
(function ($) {

  // Also handles the scrollstop event
  $.event.special.scrollstart = {

    enabled: true,

    setup: function () {

      var thisObject = this;
      var $this = $(thisObject);
      var scrolling;
      var timer;
      var isTouching;

      $this.data('scrollwatch', true);

      function trigger(event, scrolling) {

        event.type = scrolling ? 'scrollstart' : 'scrollstop';
        $this.trigger(event);
      }

      $this.on('touchstart', function (event) {
        isTouching = true;
      });

      $this.on('touchleave touchcancel touchend', function (event) {
        isTouching = false;
        setTimeout(function () {
          clearTimeout(timer);
        }, 50);
      });

      $this.on('touchmove scroll', function (event) {

        if (isTouching) {
          return;
        }

        if (!$.event.special.scrollstart.enabled) {
          return;
        }

        if (!$.event.special.scrollstart.scrolling) {
          $.event.special.scrollstart.scrolling = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function () {
          $.event.special.scrollstart.scrolling = false;
          trigger(event, false);
        }, 50);
      });
    }

  };

  // Proxies scrollstart when needed
  $.event.special.scrollstop = {

    setup: function () {

      var thisObject = this;
      var $this = $(thisObject);

      if (!$this.data('scrollwatch')) {
        $(this).on('scrollstart', function () {});
      }
    }

  };
})(jQuery);

/*!
 * Resizestart and resizestop events.
 * Version 0.0.1
 *
 * Requires:
 * - jQuery 1.7.1 or higher (no jQuery.migrate needed)
 *
 * Copyright 2013, Guido Bouman
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: Fri Oct 25 15:05:00 2013 +0100
 */
(function ($) {

  // Also handles the resizestop event
  $.event.special.resizestart = {

    enabled: true,

    setup: function () {

      var thisObject = this;
      var $this = $(thisObject);
      var resizing;
      var timer;

      $this.data('resizewatch', true);

      function trigger(event, resizing) {

        event.type = resizing ? 'resizestart' : 'resizestop';
        $this.trigger(event);
      }

      $this.on('resize', function (event) {

        if (!$.event.special.resizestart.enabled) {
          return;
        }

        if (!$.event.special.resizestart.resizing) {
          $.event.special.resizestart.resizing = true;
          trigger(event, true);
        }

        clearTimeout(timer);
        timer = setTimeout(function () {
          $.event.special.resizestart.resizing = false;
          trigger(event, false);
        }, 200);
      });
    }

  };

  // Proxies resizestart when needed
  $.event.special.resizestop = {

    setup: function () {

      var thisObject = this;
      var $this = $(thisObject);

      if (!$this.data('resizewatch')) {
        $(this).on('resizestart', function () {});
      }
    }

  };
})(jQuery);

/*! Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 * Licensed under the MIT License (LICENSE.txt).
 *
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 * Thanks to: Seamus Leahy for adding deltaX and deltaY
 *
 * Version: 3.0.6
 *
 * Requires: 1.2.2+
 */
(function ($) {

  var types = ['DOMMouseScroll', 'mousewheel'];

  if ($.event.fixHooks) {
    for (var i = types.length; i;) {
      $.event.fixHooks[types[--i]] = $.event.mouseHooks;
    }
  }

  $.event.special.mousewheel = {
    setup: function () {
      if (this.addEventListener) {
        for (var i = types.length; i;) {
          this.addEventListener(types[--i], handler, false);
        }
      } else {
        this.onmousewheel = handler;
      }
    },

    teardown: function () {
      if (this.removeEventListener) {
        for (var i = types.length; i;) {
          this.removeEventListener(types[--i], handler, false);
        }
      } else {
        this.onmousewheel = null;
      }
    }
  };

  $.fn.extend({
    mousewheel: function (fn) {
      return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
    },

    unmousewheel: function (fn) {
      return this.unbind('mousewheel', fn);
    }
  });

  function handler(event) {
    var orgEvent = event || window.event,
        args = [].slice.call(arguments, 1),
        delta = 0,
        returnValue = true,
        deltaX = 0,
        deltaY = 0;

    event = $.event.fix(orgEvent);
    event.type = 'mousewheel';

    // Old school scrollwheel delta
    if (orgEvent.wheelDelta) {
      delta = orgEvent.wheelDelta / 120;
    }
    if (orgEvent.detail) {
      delta = -orgEvent.detail / 3;
    }

    // New school multidimensional scroll (touchpads) deltas
    deltaY = delta;

    // Gecko
    if (orgEvent.axis !== undefined && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
      deltaY = 0;
      deltaX = -1 * delta;
    }

    // Webkit
    if (orgEvent.wheelDeltaY !== undefined) {
      deltaY = orgEvent.wheelDeltaY / 120;
    }
    if (orgEvent.wheelDeltaX !== undefined) {
      deltaX = -1 * orgEvent.wheelDeltaX / 120;
    }

    // Add event and delta to the front of the arguments
    args.unshift(event, delta, deltaX, deltaY);

    return ($.event.dispatch || $.event.handle).apply(this, args);
  }
})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90aGlyZC1wYXJ0eS9wYW5lbHNuYXAvanF1ZXJ5LnBhbmVsU25hcC5qcyJdLCJuYW1lcyI6WyJPYmplY3QiLCJjcmVhdGUiLCJvYmoiLCJGIiwicHJvdG90eXBlIiwiJCIsIndpbmRvdyIsImRvY3VtZW50IiwidW5kZWZpbmVkIiwicGx1Z2luTmFtZSIsInN0b3JhZ2VOYW1lIiwicGx1Z2luT2JqZWN0IiwiaXNNb3VzZURvd24iLCJpc1NuYXBwaW5nIiwiZW5hYmxlZCIsInNjcm9sbE9mZnNldCIsImluaXQiLCJvcHRpb25zIiwiY29udGFpbmVyIiwic2VsZiIsIiRjb250YWluZXIiLCIkZXZlbnRDb250YWluZXIiLCIkc25hcENvbnRhaW5lciIsImlzIiwiZG9jdW1lbnRFbGVtZW50IiwidWEiLCJuYXZpZ2F0b3IiLCJ1c2VyQWdlbnQiLCJpbmRleE9mIiwiZXh0ZW5kIiwiZm4iLCJwYW5lbFNuYXAiLCJiaW5kIiwiJG1lbnUiLCJsZW5ndGgiLCJjbGljayIsIiR0YXJnZXQiLCJnZXRQYW5lbCIsImFjdGl2YXRlUGFuZWwiLCJiaW5kUHJveGllZCIsInNjcm9sbFN0b3AiLCJtb3VzZVdoZWVsIiwibW91c2VEb3duIiwibW91c2VVcCIsInJlc2l6ZSIsImNhcHR1cmVNZW51Q2xpY2siLCJtZW51U2VsZWN0b3IiLCJuYXZpZ2F0aW9uIiwia2V5cyIsIm5leHRLZXkiLCJwcmV2S2V5Iiwia2V5RG93biIsImJ1dHRvbnMiLCIkbmV4dEJ1dHRvbiIsImNhcHR1cmVOZXh0Q2xpY2siLCIkcHJldkJ1dHRvbiIsImNhcHR1cmVQcmV2Q2xpY2siLCIkZWxlbWVudCIsImV2ZW50IiwibWV0aG9kIiwic2VsZWN0b3IiLCJvbiIsIm5hbWVzcGFjZSIsInByb3h5IiwiZSIsImNhbGwiLCJkZXN0cm95Iiwib2ZmIiwicmVtb3ZlRGF0YSIsInN0b3BQcm9wYWdhdGlvbiIsInBhbmVsc0luVmlld1BvcnQiLCJnZXRQYW5lbHNJblZpZXdwb3J0IiwiZXEiLCJvZmZzZXQiLCJzY3JvbGxUb3AiLCJzY3JvbGxEaWZmZXJlbmNlIiwib3ZlclRocmVzaG9sZCIsIk1hdGgiLCJhYnMiLCJkaXJlY3Rpb25UaHJlc2hvbGQiLCJwYW5lbE51bWJlciIsIm1heE9mZnNldCIsInNjcm9sbEhlaWdodCIsInNjcm9sbEludGVydmFsIiwic25hcFRvUGFuZWwiLCJ2aWV3cG9ydCIsInRvcCIsImJvdHRvbSIsImhlaWdodCIsInBhbmVscyIsImZpbHRlciIsIl8iLCJlbCIsIiRlbCIsImJvdW5kcyIsInBvc2l0aW9uIiwib3V0ZXJIZWlnaHQiLCJzdG9wIiwibmF2Iiwid2hpY2giLCJwcmV2ZW50RGVmYXVsdCIsInNuYXBUbyIsIndyYXBBcm91bmQiLCJwYW5lbCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhIiwianF1ZXJ5Iiwib25TbmFwU3RhcnQiLCJ0cmlnZ2VyIiwic2Nyb2xsVGFyZ2V0IiwiZGVsYXkiLCJhbmltYXRlIiwic2xpZGVTcGVlZCIsImVhc2luZyIsIm9uU25hcEZpbmlzaCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJhY3RpdmVJdGVtU2VsZWN0b3IiLCJhdHRyaWJ1dGUiLCJpdGVtU2VsZWN0b3IiLCIkaXRlbVRvQWN0aXZhdGUiLCIkcGFuZWxzIiwiaW5kZXgiLCJhdHRyIiwib25BY3RpdmF0ZSIsInBhbmVsU2VsZWN0b3IiLCJ0YXJnZXQiLCJ3cmFwIiwiZW5hYmxlIiwiZGlzYWJsZSIsInRvZ2dsZSIsImFyZ3MiLCJBcnJheSIsInNsaWNlIiwiYXJndW1lbnRzIiwiZWFjaCIsInBsdWdpbkluc3RhbmNlIiwiZXJyb3IiLCJhcHBseSIsImpRdWVyeSIsInNwZWNpYWwiLCJzY3JvbGxzdGFydCIsInNldHVwIiwidGhpc09iamVjdCIsIiR0aGlzIiwic2Nyb2xsaW5nIiwidGltZXIiLCJpc1RvdWNoaW5nIiwidHlwZSIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJzY3JvbGxzdG9wIiwicmVzaXplc3RhcnQiLCJyZXNpemluZyIsInJlc2l6ZXN0b3AiLCJ0eXBlcyIsImZpeEhvb2tzIiwiaSIsIm1vdXNlSG9va3MiLCJtb3VzZXdoZWVsIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZXIiLCJvbm1vdXNld2hlZWwiLCJ0ZWFyZG93biIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJ1bm1vdXNld2hlZWwiLCJ1bmJpbmQiLCJvcmdFdmVudCIsImRlbHRhIiwicmV0dXJuVmFsdWUiLCJkZWx0YVgiLCJkZWx0YVkiLCJmaXgiLCJ3aGVlbERlbHRhIiwiZGV0YWlsIiwiYXhpcyIsIkhPUklaT05UQUxfQVhJUyIsIndoZWVsRGVsdGFZIiwid2hlZWxEZWx0YVgiLCJ1bnNoaWZ0IiwiZGlzcGF0Y2giLCJoYW5kbGUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0EsSUFBSyxPQUFPQSxPQUFPQyxNQUFkLEtBQXlCLFVBQTlCLEVBQTJDO0FBQ3pDRCxTQUFPQyxNQUFQLEdBQWdCLFVBQVVDLEdBQVYsRUFBZ0I7O0FBRTlCLGFBQVNDLENBQVQsR0FBYSxDQUFFO0FBQ2ZBLE1BQUVDLFNBQUYsR0FBY0YsR0FBZDtBQUNBLFdBQU8sSUFBSUMsQ0FBSixFQUFQO0FBRUQsR0FORDtBQU9EOztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBK0JBLENBQUMsVUFBU0UsQ0FBVCxFQUFZQyxNQUFaLEVBQW9CQyxRQUFwQixFQUE4QkMsU0FBOUIsRUFBeUM7QUFDeEM7O0FBRUEsTUFBSUMsYUFBYSxXQUFqQjtBQUNBLE1BQUlDLGNBQWMsWUFBWUQsVUFBOUI7O0FBRUEsTUFBSUUsZUFBZTs7QUFFakJDLGlCQUFhLEtBRkk7QUFHakJDLGdCQUFZLEtBSEs7QUFJakJDLGFBQVMsSUFKUTtBQUtqQkMsa0JBQWMsQ0FMRzs7QUFPakJDLFVBQU0sVUFBU0MsT0FBVCxFQUFrQkMsU0FBbEIsRUFBNkI7O0FBRWpDLFVBQUlDLE9BQU8sSUFBWDs7QUFFQUEsV0FBS0QsU0FBTCxHQUFpQkEsU0FBakI7QUFDQUMsV0FBS0MsVUFBTCxHQUFrQmYsRUFBRWEsU0FBRixD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QVMsQ0FMYjs7QUFPQWpILFlBQVFyRCxFQUFFcUQsS0FBRixDQUFRa0gsR0FBUixDQUFZTCxRQUFaLENBQVI7QUFDQTdHLFVBQU0wRixJQUFOLEdBQWEsWUFBYjs7QUFFQTtBQUNBLFFBQUttQixTQUFTTSxVQUFkLEVBQTJCO0FBQUVMLGNBQVFELFNBQVNNLFVBQVQsR0FBb0IsR0FBNUI7QUFBa0M7QUFDL0QsUUFBS04sU0FBU08sTUFBZCxFQUEyQjtBQUFFTixjQUFRLENBQUNELFNBQVNPLE1BQVYsR0FBaUIsQ0FBekI7QUFBNkI7O0FBRTFEO0FBQ0FILGFBQVNILEtBQVQ7O0FBRUE7QUFDQSxRQUFLRCxTQUFTUSxJQUFULEtBQWtCdkssU0FBbEIsSUFBK0IrSixTQUFTUSxJQUFULEtBQWtCUixTQUFTUyxlQUEvRCxFQUFpRjtBQUMvRUwsZUFBUyxDQUFUO0FBQ0FELGVBQVMsQ0FBQyxDQUFELEdBQUdGLEtBQVo7QUFDRDs7QUFFRDtBQUNBLFFBQUtELFNBQVNVLFdBQVQsS0FBeUJ6SyxTQUE5QixFQUEwQztBQUFFbUssZUFBU0osU0FBU1UsV0FBVCxHQUFxQixHQUE5QjtBQUFvQztBQUNoRixRQUFLVixTQUFTVyxXQUFULEtBQXlCMUssU0FBOUIsRUFBMEM7QUFBRWtLLGVBQVMsQ0FBQyxDQUFELEdBQUdILFNBQVNXLFdBQVosR0FBd0IsR0FBakM7QUFBdUM7O0FBRW5GO0FBQ0EvQyxTQUFLZ0QsT0FBTCxDQUFhekgsS0FBYixFQUFvQjhHLEtBQXBCLEVBQTJCRSxNQUEzQixFQUFtQ0MsTUFBbkM7O0FBRUEsV0FBTyxDQUFDdEssRUFBRXFELEtBQUYsQ0FBUTBILFFBQVIsSUFBb0IvSyxFQUFFcUQsS0FBRixDQUFRMkgsTUFBN0IsRUFBcUMzQyxLQUFyQyxDQUEyQyxJQUEzQyxFQUFpRFAsSUFBakQsQ0FBUDtBQUNEO0FBRUYsQ0E1RUQsRUE0RUdRLE1BNUVIIiwiZmlsZSI6ImpxdWVyeS5wYW5lbFNuYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBVdGlsaXR5IGZvciBjcmVhdGluZyBvYmplY3RzIGluIG9sZGVyIGJyb3dzZXJzXG5pZiAoIHR5cGVvZiBPYmplY3QuY3JlYXRlICE9PSAnZnVuY3Rpb24nICkge1xuICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24oIG9iaiApIHtcblxuICAgIGZ1bmN0aW9uIEYoKSB7fVxuICAgIEYucHJvdG90eXBlID0gb2JqO1xuICAgIHJldHVybiBuZXcgRigpO1xuXG4gIH07XG59XG5cbi8qIVxuICogalF1ZXJ5IHBhbmVsU25hcFxuICogVmVyc2lvbiAwLjE1LjFcbiAqXG4gKiBSZXF1aXJlczpcbiAqIC0galF1ZXJ5IDEuNyBvciBoaWdoZXIgKG5vIGpRdWVyeS5taWdyYXRlIG5lZWRlZClcbiAqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vZ3VpZG9ib3VtYW4vanF1ZXJ5LXBhbmVsc25hcFxuICpcbiAqIENvcHlyaWdodCAyMDEzLCBHdWlkbyBCb3VtYW5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqIERhdGU6IFdlZCBGZWIgMTMgMTY6MDU6MDAgMjAxMyArMDEwMFxuICovXG4oZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCwgdW5kZWZpbmVkKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICB2YXIgcGx1Z2luTmFtZSA9ICdwYW5lbFNuYXAnO1xuICB2YXIgc3RvcmFnZU5hbWUgPSAncGx1Z2luXycgKyBwbHVnaW5OYW1lO1xuXG4gIHZhciBwbHVnaW5PYmplY3QgPSB7XG5cbiAgICBpc01vdXNlRG93bjogZmFsc2UsXG4gICAgaXNTbmFwcGluZzogZmFsc2UsXG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBzY3JvbGxPZmZzZXQ6IDAsXG5cbiAgICBpbml0OiBmdW5jdGlvbihvcHRpb25zLCBjb250YWluZXIpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxmLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICAgIHNlbGYuJGNvbnRhaW5lciA9ICQoY29udGFpbmVyKTtcblxuICAgICAgc2VsZi4kZXZlbnRDb250YWluZXIgPSBzZWxmLiRjb250YWluZXI7XG4gICAgICBzZWxmLiRzbmFwQ29udGFpbmVyID0gc2VsZi4kY29udGFpbmVyO1xuXG4gICAgICBpZihzZWxmLiRjb250YWluZXIuaXMoJ2JvZHknKSkge1xuICAgICAgICBzZWxmLiRldmVudENvbnRhaW5lciA9ICQoZG9jdW1lbnQpO1xuICAgICAgICBzZWxmLiRzbmFwQ29udGFpbmVyID0gJChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpO1xuXG4gICAgICAgIHZhciB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgICAgIGlmKH51YS5pbmRleE9mKCdXZWJLaXQnKSkge1xuICAgICAgICAgIHNlbGYuJHNuYXBDb250YWluZXIgPSAkKCdib2R5Jyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sICQuZm4ucGFuZWxTbmFwLm9wdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgICBzZWxmLmJpbmQoKTtcblxuICAgICAgaWYoc2VsZi5vcHRpb25zLiRtZW51ICE9PSBmYWxzZSAmJiAkKCcuYWN0aXZlJywgc2VsZi5vcHRpb25zLiRtZW51KS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoJy5hY3RpdmUnLCBzZWxmLm9wdGlvbnMuJG1lbnUpLmNsaWNrKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgJHRhcmdldCA9IHNlbGYuZ2V0UGFuZWwoJzpmaXJzdCcpO1xuICAgICAgICBzZWxmLmFjdGl2YXRlUGFuZWwoJHRhcmdldCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuXG4gICAgfSxcblxuICAgIGJpbmQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi4kZXZlbnRDb250YWluZXIsICdzY3JvbGxzdG9wJywgc2VsZi5zY3JvbGxTdG9wKTtcbiAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi4kZXZlbnRDb250YWluZXIsICdtb3VzZXdoZWVsJywgc2VsZi5tb3VzZVdoZWVsKTtcbiAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi4kZXZlbnRDb250YWluZXIsICdtb3VzZWRvd24nLCBzZWxmLm1vdXNlRG93bik7XG4gICAgICBzZWxmLmJpbmRQcm94aWVkKHNlbGYuJGV2ZW50Q29udGFpbmVyLCAnbW91c2V1cCcsIHNlbGYubW91c2VVcCk7XG5cbiAgICAgIHNlbGYuYmluZFByb3hpZWQoJCh3aW5kb3cpLCAncmVzaXplc3RvcCcsIHNlbGYucmVzaXplKTtcblxuICAgICAgaWYoc2VsZi5vcHRpb25zLiRtZW51KSB7XG4gICAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi5vcHRpb25zLiRtZW51LCAnY2xpY2snLCBzZWxmLmNhcHR1cmVNZW51Q2xpY2ssIHNlbGYub3B0aW9ucy5tZW51U2VsZWN0b3IpO1xuICAgICAgfVxuXG4gICAgICBpZihzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi5rZXlzLm5leHRLZXkgfHwgc2VsZi5vcHRpb25zLm5hdmlnYXRpb24ua2V5cy5wcmV2S2V5KSB7XG4gICAgICAgIHNlbGYuYmluZFByb3hpZWQoJCh3aW5kb3cpLCAna2V5ZG93bicsIHNlbGYua2V5RG93bik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi5idXR0b25zLiRuZXh0QnV0dG9uKSB7XG4gICAgICAgIHNlbGYuYmluZFByb3hpZWQoc2VsZi5vcHRpb25zLm5hdmlnYXRpb24uYnV0dG9ucy4kbmV4dEJ1dHRvbiwgJ2NsaWNrJywgc2VsZi5jYXB0dXJlTmV4dENsaWNrKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNlbGYub3B0aW9ucy5uYXZpZ2F0aW9uLmJ1dHRvbnMuJHByZXZCdXR0b24pIHtcbiAgICAgICAgc2VsZi5iaW5kUHJveGllZChzZWxmLm9wdGlvbnMubmF2aWdhdGlvbi5idXR0b25zLiRwcmV2QnV0dG9uLCAnY2xpY2snLCBzZWxmLmNhcHR1cmVQcmV2Q2xpY2spO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIGJpbmRQcm94aWVkOiBmdW5jdGlvbigkZWxlbWVudCwgZXZlbnQsIG1ldGhvZCwgc2VsZWN0b3IpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxlY3RvciA9IHR5cGVvZiBzZWxlY3RvciA9PT0gJ3N0cmluZycgPyBzZWxlY3RvciA6IG51bGw7XG5cbiAgICAgICRlbGVtZW50Lm9uKGV2ZW50ICsgc2VsZi5vcHRpb25zLm5hbWVzcGFjZSwgc2VsZWN0b3IsICQucHJveHkoZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIHJldHVybiBtZXRob2QuY2FsbChzZWxmLCBlKTtcblxuICAgICAgfSwgc2VsZikpO1xuXG4gICAgfSxcblxuICAgIGRlc3Ryb3k6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIEdvdHRhIGxvdmUgbmFtZXNwYWNlZCBldmVudHMhXG4gICAgICBzZWxmLiRldmVudENvbnRhaW5lci5vZmYoc2VsZi5vcHRpb25zLm5hbWVzcGFjZSk7XG5cbiAgICAgICQod2luZG93KS5vZmYoc2VsZi5vcHRpb25zLm5hbWVzcGFjZSk7XG5cbiAgICAgIGlmKHNlbGYub3B0aW9ucy4kbWVudSAhPT0gZmFsc2UpIHtcbiAgICAgICAgJChzZWxmLm9wdGlvbnMubWVudVNlbGVjdG9yLCBzZWxmLm9wdGlvbnMuJG1lbnUpLm9mZihzZWxmLm9wdGlvbnMubmFtZXNwYWNlKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi4kY29udGFpbmVyLnJlbW92ZURhdGEoc3RvcmFnZU5hbWUpO1xuXG4gICAgfSxcblxuICAgIHNjcm9sbFN0b3A6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZihzZWxmLmlzTW91c2VEb3duKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYoc2VsZi5pc1NuYXBwaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgZW5hYmxlZCBvciBqdXN0IDEgcGFuZWwgaW4gdmlld3BvcnRcbiAgICAgIHZhciBwYW5lbHNJblZpZXdQb3J0ID0gc2VsZi5nZXRQYW5lbHNJblZpZXdwb3J0KCk7XG4gICAgICBpZiAoIXNlbGYuZW5hYmxlZCB8fCBwYW5lbHNJblZpZXdQb3J0Lmxlbmd0aCA8IDIpIHtcbiAgICAgICAgJHRhcmdldCA9IHBhbmVsc0luVmlld1BvcnQuZXEoMCk7XG4gICAgICAgIGlmKCEkdGFyZ2V0LmlzKHNlbGYuZ2V0UGFuZWwoJy5hY3RpdmUnKSkpIHtcbiAgICAgICAgICBzZWxmLmFjdGl2YXRlUGFuZWwoJHRhcmdldCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBvZmZzZXQgPSBzZWxmLiRzbmFwQ29udGFpbmVyLnNjcm9sbFRvcCgpO1xuICAgICAgdmFyIHNjcm9sbERpZmZlcmVuY2UgPSBvZmZzZXQgLSBzZWxmLnNjcm9sbE9mZnNldDtcbiAgICAgIHZhciBvdmVyVGhyZXNob2xkID0gTWF0aC5hYnMoc2Nyb2xsRGlmZmVyZW5jZSkgPiBzZWxmLm9wdGlvbnMuZGlyZWN0aW9uVGhyZXNob2xkO1xuXG4gICAgICB2YXIgcGFuZWxOdW1iZXI7XG4gICAgICBpZihzY3JvbGxEaWZmZXJlbmNlID4gMCkge1xuICAgICAgICBwYW5lbE51bWJlciA9IG92ZXJUaHJlc2hvbGQgPyAxIDogMDtcbiAgICAgIH0gZWxzZSBpZihzY3JvbGxEaWZmZXJlbmNlIDwgMCkge1xuICAgICAgICBwYW5lbE51bWJlciA9IG92ZXJUaHJlc2hvbGQgPyAwIDogMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vdGhpbmcgdG8gc2Nyb2xsLCBnZXQgb3V0LlxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciAkdGFyZ2V0ID0gcGFuZWxzSW5WaWV3UG9ydC5lcShwYW5lbE51bWJlcik7XG4gICAgICB2YXIgbWF4T2Zmc2V0ID0gc2VsZi4kY29udGFpbmVyWzBdLnNjcm9sbEhlaWdodCAtIHNlbGYuc2Nyb2xsSW50ZXJ2YWw7XG5cbiAgICAgIGlmIChvZmZzZXQgPD0gMCB8fCBvZmZzZXQgPj0gbWF4T2Zmc2V0KSB7XG4gICAgICAgIC8vIE9ubHkgYWN0aXZhdGUsIHByZXZlbnQgc3R1dHRlcmluZ1xuICAgICAgICBzZWxmLmFjdGl2YXRlUGFuZWwoJHRhcmdldCk7XG4gICAgICAgIC8vIFNldCBzY3JvbGxPZmZzZXQgdG8gYSBzYW5lIG51bWJlciBmb3IgbmV4dCBzY3JvbGxcbiAgICAgICAgc2VsZi5zY3JvbGxPZmZzZXQgPSBvZmZzZXQgPD0gMCA/IDAgOiBtYXhPZmZzZXQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLnNuYXBUb1BhbmVsKCR0YXJnZXQpO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIGdldFBhbmVsc0luVmlld3BvcnQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHZhciB2aWV3cG9ydCA9IHsgdG9wOiBzZWxmLiRzbmFwQ29udGFpbmVyLnNjcm9sbFRvcCgpIH07XG4gICAgICB2aWV3cG9ydC5ib3R0b20gPSB2aWV3cG9ydC50b3AgKyBzZWxmLiRzbmFwQ29udGFpbmVyLmhlaWdodCgpO1xuXG4gICAgICB2YXIgcGFuZWxzID0gc2VsZi5nZXRQYW5lbCgpLmZpbHRlcihmdW5jdGlvbiAoXywgZWwpIHtcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICB2YXIgYm91bmRzO1xuXG4gICAgICAgIGlmKHNlbGYuJGNvbnRhaW5lci5pcygnYm9keScpKSB7XG4gICAgICAgICAgYm91bmRzID0gJGVsLm9mZnNldCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJvdW5kcyA9ICRlbC5wb3NpdGlvbigpO1xuICAgICAgICAgIGJvdW5kcy50b3AgKz0gc2VsZi4kc25hcENvbnRhaW5lci5zY3JvbGxUb3AoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJvdW5kcy5ib3R0b20gPSBib3VuZHMudG9wICsgJGVsLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgcmV0dXJuICEodmlld3BvcnQuYm90dG9tIDwgYm91bmRzLnRvcCB8fCB2aWV3cG9ydC50b3AgPiBib3VuZHMuYm90dG9tKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gcGFuZWxzO1xuICAgIH0sXG5cbiAgICBtb3VzZVdoZWVsOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gVGhpcyBldmVudCBvbmx5IGZpcmVzIHdoZW4gdGhlIHVzZXIgYWN0dWFsbHkgc2Nyb2xscyB3aXRoIHRoZWlyIGlucHV0IGRldmljZS5cbiAgICAgIC8vIEJlIGl0IGEgdHJhY2twYWQsIGxlZ2FjeSBtb3VzZSBvciBhbnl0aGluZyBlbHNlLlxuXG4gICAgICBpZihzZWxmLmlzU25hcHBpbmcpIHtcbiAgICAgICAgc2VsZi5zY3JvbGxPZmZzZXQgPSBzZWxmLiRzbmFwQ29udGFpbmVyLnNjcm9sbFRvcCgpO1xuICAgICAgICBzZWxmLiRzbmFwQ29udGFpbmVyLnN0b3AodHJ1ZSk7XG4gICAgICAgIHNlbGYuaXNTbmFwcGluZyA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgfSxcblxuICAgIG1vdXNlRG93bjogZnVuY3Rpb24oZSkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuaXNNb3VzZURvd24gPSB0cnVlO1xuXG4gICAgfSxcblxuICAgIG1vdXNlVXA6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBzZWxmLmlzTW91c2VEb3duID0gZmFsc2U7XG5cbiAgICAgIGlmKHNlbGYuc2Nyb2xsT2Zmc2V0ICE9PSBzZWxmLiRzbmFwQ29udGFpbmVyLnNjcm9sbFRvcCgpKSB7XG4gICAgICAgIHNlbGYuc2Nyb2xsU3RvcChlKTtcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICBrZXlEb3duOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgdmFyIG5hdiA9IHNlbGYub3B0aW9ucy5uYXZpZ2F0aW9uO1xuXG4gICAgICBpZighc2VsZi5lbmFibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoKGUud2hpY2gpIHtcbiAgICAgICAgY2FzZSBuYXYua2V5cy5wcmV2S2V5OlxuICAgICAgICBjYXNlIG5hdi5rZXlzLm5leHRLZXk6XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2VsZi5pc1NuYXBwaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc3dpdGNoKGUud2hpY2gpIHtcbiAgICAgICAgY2FzZSBuYXYua2V5cy5wcmV2S2V5OlxuICAgICAgICAgIHNlbGYuc25hcFRvKCdwcmV2JywgbmF2LndyYXBBcm91bmQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIG5hdi5rZXlzLm5leHRLZXk6XG4gICAgICAgICAgc2VsZi5zbmFwVG8oJ25leHQnLCBuYXYud3JhcEFyb3VuZCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICB9LFxuXG4gICAgY2FwdHVyZU5leHRDbGljazogZnVuY3Rpb24oZSkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKHNlbGYuaXNTbmFwcGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuc25hcFRvKCduZXh0Jywgc2VsZi5vcHRpb25zLm5hdmlnYXRpb24ud3JhcEFyb3VuZCk7XG5cbiAgICB9LFxuXG4gICAgY2FwdHVyZVByZXZDbGljazogZnVuY3Rpb24oZSkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYgKHNlbGYuaXNTbmFwcGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuc25hcFRvKCdwcmV2Jywgc2VsZi5vcHRpb25zLm5hdmlnYXRpb24ud3JhcEFyb3VuZCk7XG5cbiAgICB9LFxuXG4gICAgcmVzaXplOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYoIXNlbGYuZW5hYmxlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciAkdGFyZ2V0ID0gc2VsZi5nZXRQYW5lbCgnLmFjdGl2ZScpO1xuXG4gICAgICBzZWxmLnNuYXBUb1BhbmVsKCR0YXJnZXQpO1xuXG4gICAgfSxcblxuICAgIGNhcHR1cmVNZW51Q2xpY2s6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICB2YXIgcGFuZWwgPSAkKGUuY3VycmVudFRhcmdldCkuZGF0YSgncGFuZWwnKTtcbiAgICAgIHZhciAkdGFyZ2V0ID0gc2VsZi5nZXRQYW5lbCgnW2RhdGEtcGFuZWw9XCInICsgcGFuZWwgKyAnXCJdJyk7XG5cbiAgICAgIHNlbGYuc25hcFRvUGFuZWwoJHRhcmdldCk7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIH0sXG5cbiAgICBzbmFwVG9QYW5lbDogZnVuY3Rpb24oJHRhcmdldCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmICghJHRhcmdldC5qcXVlcnkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBzZWxmLmlzU25hcHBpbmcgPSB0cnVlO1xuXG4gICAgICBzZWxmLm9wdGlvbnMub25TbmFwU3RhcnQuY2FsbChzZWxmLCAkdGFyZ2V0KTtcbiAgICAgIHNlbGYuJGNvbnRhaW5lci50cmlnZ2VyKCdwYW5lbHNuYXA6c3RhcnQnLCBbJHRhcmdldF0pO1xuXG4gICAgICB2YXIgc2Nyb2xsVGFyZ2V0ID0gMDtcbiAgICAgIGlmKHNlbGYuJGNvbnRhaW5lci5pcygnYm9keScpKSB7XG4gICAgICAgIHNjcm9sbFRhcmdldCA9ICR0YXJnZXQub2Zmc2V0KCkudG9wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2Nyb2xsVGFyZ2V0ID0gc2VsZi4kc25hcENvbnRhaW5lci5zY3JvbGxUb3AoKSArICR0YXJnZXQucG9zaXRpb24oKS50b3A7XG4gICAgICB9XG5cbiAgICAgIHNjcm9sbFRhcmdldCAtPSAgc2VsZi5vcHRpb25zLm9mZnNldDtcblxuICAgICAgc2VsZi4kc25hcENvbnRhaW5lci5zdG9wKHRydWUpLmRlbGF5KHNlbGYub3B0aW9ucy5kZWxheSkuYW5pbWF0ZSh7XG4gICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsVGFyZ2V0XG4gICAgICB9LCBzZWxmLm9wdGlvbnMuc2xpZGVTcGVlZCwgc2VsZi5vcHRpb25zLmVhc2luZywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgLy8gU2V0IHNjcm9sbE9mZnNldCB0byBzY3JvbGxUb3BcbiAgICAgICAgLy8gKG5vdCB0byBzY3JvbGxUYXJnZXQgc2luY2Ugb24gaVBhZCB0aG9zZSBzb21ldGltZXMgZGlmZmVyKVxuICAgICAgICBzZWxmLnNjcm9sbE9mZnNldCA9IHNlbGYuJHNuYXBDb250YWluZXIuc2Nyb2xsVG9wKCk7XG4gICAgICAgIHNlbGYuaXNTbmFwcGluZyA9IGZhbHNlO1xuXG4gICAgICAgIC8vIENhbGwgY2FsbGJhY2tcbiAgICAgICAgc2VsZi5vcHRpb25zLm9uU25hcEZpbmlzaC5jYWxsKHNlbGYsICR0YXJnZXQpO1xuICAgICAgICBzZWxmLiRjb250YWluZXIudHJpZ2dlcigncGFuZWxzbmFwOmZpbmlzaCcsIFskdGFyZ2V0XSk7XG5cbiAgICAgICAgc2VsZi5hY3RpdmF0ZVBhbmVsKCR0YXJnZXQpO1xuICAgICAgfSk7XG5cbiAgICB9LFxuXG4gICAgYWN0aXZhdGVQYW5lbDogZnVuY3Rpb24oJHRhcmdldCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuZ2V0UGFuZWwoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAkdGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgICAgaWYoc2VsZi5vcHRpb25zLiRtZW51ICE9PSBmYWxzZSkge1xuICAgICAgICB2YXIgYWN0aXZlSXRlbVNlbGVjdG9yID0gc2VsZi5vcHRpb25zLm1lbnVTZWxlY3RvciArICcuYWN0aXZlJztcbiAgICAgICAgJChhY3RpdmVJdGVtU2VsZWN0b3IsIHNlbGYub3B0aW9ucy4kbWVudSkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG4gICAgICAgIHZhciBhdHRyaWJ1dGUgPSAnW2RhdGEtcGFuZWw9XCInICsgJHRhcmdldC5kYXRhKCdwYW5lbCcpICsgJ1wiXSc7XG4gICAgICAgIHZhciBpdGVtU2VsZWN0b3IgPSBzZWxmLm9wdGlvbnMubWVudVNlbGVjdG9yICsgYXR0cmlidXRlO1xuICAgICAgICB2YXIgJGl0ZW1Ub0FjdGl2YXRlID0gJChpdGVtU2VsZWN0b3IsIHNlbGYub3B0aW9ucy4kbWVudSk7XG4gICAgICAgICRpdGVtVG9BY3RpdmF0ZS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBuYXYgPSBzZWxmLm9wdGlvbnMubmF2aWdhdGlvbjtcblxuICAgICAgaWYoIW5hdi53cmFwQXJvdW5kKSB7XG4gICAgICAgIHZhciAkcGFuZWxzID0gc2VsZi5nZXRQYW5lbCgpO1xuICAgICAgICB2YXIgaW5kZXggPSAkcGFuZWxzLmluZGV4KHNlbGYuZ2V0UGFuZWwoJy5hY3RpdmUnKSk7XG5cbiAgICAgICAgaWYgKG5hdi5idXR0b25zLiRuZXh0QnV0dG9uICE9PSBmYWxzZSApIHtcbiAgICAgICAgICAkdGFyZ2V0ID0gJHBhbmVscy5lcShpbmRleCArIDEpO1xuICAgICAgICAgIGlmKCR0YXJnZXQubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgJChuYXYuYnV0dG9ucy4kbmV4dEJ1dHRvbikuYXR0cignYXJpYS1kaXNhYmxlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAkKG5hdi5idXR0b25zLiRuZXh0QnV0dG9uKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJChuYXYuYnV0dG9ucy4kbmV4dEJ1dHRvbikuYXR0cignYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuICAgICAgICAgICAgJChuYXYuYnV0dG9ucy4kbmV4dEJ1dHRvbikucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5hdi5idXR0b25zLiRwcmV2QnV0dG9uICE9PSBmYWxzZSApIHtcbiAgICAgICAgICBpZihpbmRleCA8IDEpIHtcbiAgICAgICAgICAgICQobmF2LmJ1dHRvbnMuJHByZXZCdXR0b24pLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgJChuYXYuYnV0dG9ucy4kcHJldkJ1dHRvbikuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQobmF2LmJ1dHRvbnMuJHByZXZCdXR0b24pLmF0dHIoJ2FyaWEtZGlzYWJsZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICQobmF2LmJ1dHRvbnMuJHByZXZCdXR0b24pLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBzZWxmLm9wdGlvbnMub25BY3RpdmF0ZS5jYWxsKHNlbGYsICR0YXJnZXQpO1xuICAgICAgc2VsZi4kY29udGFpbmVyLnRyaWdnZXIoJ3BhbmVsc25hcDphY3RpdmF0ZScsIFskdGFyZ2V0XSk7XG5cbiAgICB9LFxuXG4gICAgZ2V0UGFuZWw6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYodHlwZW9mIHNlbGVjdG9yID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBzZWxlY3RvciA9ICcnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJChzZWxmLm9wdGlvbnMucGFuZWxTZWxlY3RvciArIHNlbGVjdG9yLCBzZWxmLiRjb250YWluZXIpO1xuXG4gICAgfSxcblxuICAgIHNuYXBUbzogZnVuY3Rpb24odGFyZ2V0LCB3cmFwKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYodHlwZW9mIHdyYXAgIT09ICdib29sZWFuJykge1xuICAgICAgICB3cmFwID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyICRwYW5lbHMgPSBzZWxmLmdldFBhbmVsKCk7XG4gICAgICB2YXIgaW5kZXggPSAkcGFuZWxzLmluZGV4KHNlbGYuZ2V0UGFuZWwoJy5hY3RpdmUnKSk7XG4gICAgICB2YXIgJHRhcmdldDtcblxuICAgICAgc3dpdGNoKHRhcmdldCkge1xuICAgICAgICBjYXNlICdwcmV2JzpcblxuICAgICAgICAgICR0YXJnZXQgPSAkcGFuZWxzLmVxKGluZGV4IC0gMSk7XG4gICAgICAgICAgaWYoaW5kZXggPCAxICYmICF3cmFwKVxuICAgICAgICAgIHtcbiAgICAgICAgICAgICR0YXJnZXQgPSBbXTsgLy8gQ2xlYXIgdGFyZ2V0LCBiZWNhdXNlIG5lZ2F0aXZlIGluZGV4ZXMgd3JhcCBhdXRvbWF0aWNhbGx5XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ25leHQnOlxuXG4gICAgICAgICAgJHRhcmdldCA9ICRwYW5lbHMuZXEoaW5kZXggKyAxKTtcbiAgICAgICAgICBpZigkdGFyZ2V0Lmxlbmd0aCA8IDEgJiYgd3JhcClcbiAgICAgICAgICB7XG4gICAgICAgICAgICAkdGFyZ2V0ID0gJHBhbmVscy5maWx0ZXIoJzpmaXJzdCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdmaXJzdCc6XG5cbiAgICAgICAgICAkdGFyZ2V0ID0gJHBhbmVscy5maWx0ZXIoJzpmaXJzdCcpO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgJ2xhc3QnOlxuXG4gICAgICAgICAgJHRhcmdldCA9ICRwYW5lbHMuZmlsdGVyKCc6bGFzdCcpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBpZigkdGFyZ2V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2VsZi5zbmFwVG9QYW5lbCgkdGFyZ2V0KTtcbiAgICAgIH1cblxuICAgIH0sXG5cbiAgICBlbmFibGU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIEdhdGhlciBzY3JvbGxPZmZzZXQgZm9yIG5leHQgc2Nyb2xsXG4gICAgICBzZWxmLnNjcm9sbE9mZnNldCA9IHNlbGYuJHNuYXBDb250YWluZXIuc2Nyb2xsVG9wKCk7XG5cbiAgICAgIHNlbGYuZW5hYmxlZCA9IHRydWU7XG5cbiAgICB9LFxuXG4gICAgZGlzYWJsZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgc2VsZi5lbmFibGVkID0gZmFsc2U7XG5cbiAgICB9LFxuXG4gICAgdG9nZ2xlOiBmdW5jdGlvbigpIHtcblxuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBpZihzZWxmLmVuYWJsZWQpIHtcbiAgICAgICAgc2VsZi5kaXNhYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmLmVuYWJsZSgpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gIH07XG5cbiAgJC5mbltwbHVnaW5OYW1lXSA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblxuICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciBwbHVnaW5JbnN0YW5jZSA9ICQuZGF0YSh0aGlzLCBzdG9yYWdlTmFtZSk7XG4gICAgICBpZih0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgfHwgb3B0aW9ucyA9PT0gJ2luaXQnIHx8ICEgb3B0aW9ucykge1xuICAgICAgICBpZighcGx1Z2luSW5zdGFuY2UpIHtcbiAgICAgICAgICBpZihvcHRpb25zID09PSAnaW5pdCcpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSBhcmdzWzFdIHx8IHt9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBsdWdpbkluc3RhbmNlID0gT2JqZWN0LmNyZWF0ZShwbHVnaW5PYmplY3QpLmluaXQob3B0aW9ucywgdGhpcyk7XG4gICAgICAgICAgJC5kYXRhKHRoaXMsIHN0b3JhZ2VOYW1lLCBwbHVnaW5JbnN0YW5jZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJC5lcnJvcignUGx1Z2luIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQgZm9yIHRoaXMgb2JqZWN0LicpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmKCFwbHVnaW5JbnN0YW5jZSkge1xuICAgICAgICAkLmVycm9yKCdQbHVnaW4gaXMgbm90IGluaXRpYWxpemVkIGZvciB0aGlzIG9iamVjdCB5ZXQuJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSBpZihwbHVnaW5JbnN0YW5jZVtvcHRpb25zXSkge1xuICAgICAgICB2YXIgbWV0aG9kID0gb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IGFyZ3Muc2xpY2UoMSk7XG4gICAgICAgIHBsdWdpbkluc3RhbmNlW21ldGhvZF0uYXBwbHkocGx1Z2luSW5zdGFuY2UsIG9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJC5lcnJvcignTWV0aG9kICcgKyAgb3B0aW9ucyArICcgZG9lcyBub3QgZXhpc3Qgb24galF1ZXJ5LnBhbmVsU25hcC4nKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgfSk7XG5cbiAgfTtcblxuICAkLmZuW3BsdWdpbk5hbWVdLm9wdGlvbnMgPSB7XG4gICAgJG1lbnU6IGZhbHNlLFxuICAgIG1lbnVTZWxlY3RvcjogJ2EnLFxuICAgIHBhbmVsU2VsZWN0b3I6ICc+IHNlY3Rpb24nLFxuICAgIG5hbWVzcGFjZTogJy5wYW5lbFNuYXAnLFxuICAgIG9uU25hcFN0YXJ0OiBmdW5jdGlvbigpe30sXG4gICAgb25TbmFwRmluaXNoOiBmdW5jdGlvbigpe30sXG4gICAgb25BY3RpdmF0ZTogZnVuY3Rpb24oKXt9LFxuICAgIGRpcmVjdGlvblRocmVzaG9sZDogNTAsXG4gICAgc2xpZGVTcGVlZDogMjAwLFxuICAgIGRlbGF5OiAwLFxuICAgIGVhc2luZzogJ2xpbmVhcicsXG4gICAgb2Zmc2V0OiAwLFxuICAgIG5hdmlnYXRpb246IHtcbiAgICAgIGtleXM6IHtcbiAgICAgICAgbmV4dEtleTogZmFsc2UsXG4gICAgICAgIHByZXZLZXk6IGZhbHNlXG4gICAgICB9LFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICAkbmV4dEJ1dHRvbjogZmFsc2UsXG4gICAgICAgICRwcmV2QnV0dG9uOiBmYWxzZVxuICAgICAgfSxcbiAgICAgIHdyYXBBcm91bmQ6IGZhbHNlXG4gICAgfVxuICB9O1xuXG59KShqUXVlcnksIHdpbmRvdywgZG9jdW1lbnQpO1xuXG4vKiFcbiAqIFNwZWNpYWwgZmxhdm91cmVkIGpRdWVyeSBNb2JpbGUgc2Nyb2xsc3RhcnQgJiBzY3JvbGxzdG9wIGV2ZW50cy5cbiAqIFZlcnNpb24gMC4xLjNcbiAqXG4gKiBSZXF1aXJlczpcbiAqIC0galF1ZXJ5IDEuNy4xIG9yIGhpZ2hlciAobm8galF1ZXJ5Lm1pZ3JhdGUgbmVlZGVkKVxuICpcbiAqIENvcHlyaWdodCAyMDEzLCBHdWlkbyBCb3VtYW5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqIERhdGU6IFdlZCBGZWIgMTMgMTY6MDU6MDAgMjAxMyArMDEwMFxuICovXG4oZnVuY3Rpb24oJCkge1xuXG4gIC8vIEFsc28gaGFuZGxlcyB0aGUgc2Nyb2xsc3RvcCBldmVudFxuICAkLmV2ZW50LnNwZWNpYWwuc2Nyb2xsc3RhcnQgPSB7XG5cbiAgICBlbmFibGVkOiB0cnVlLFxuXG4gICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgdGhpc09iamVjdCA9IHRoaXM7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXNPYmplY3QpO1xuICAgICAgdmFyIHNjcm9sbGluZztcbiAgICAgIHZhciB0aW1lcjtcbiAgICAgIHZhciBpc1RvdWNoaW5nO1xuXG4gICAgICAkdGhpcy5kYXRhKCdzY3JvbGx3YXRjaCcsIHRydWUpO1xuXG4gICAgICBmdW5jdGlvbiB0cmlnZ2VyKGV2ZW50LCBzY3JvbGxpbmcpIHtcblxuICAgICAgICBldmVudC50eXBlID0gc2Nyb2xsaW5nID8gJ3Njcm9sbHN0YXJ0JyA6ICdzY3JvbGxzdG9wJztcbiAgICAgICAgJHRoaXMudHJpZ2dlcihldmVudCk7XG5cbiAgICAgIH1cblxuICAgICAgJHRoaXMub24oJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpc1RvdWNoaW5nID0gdHJ1ZTtcbiAgICAgIH0pO1xuXG4gICAgICAkdGhpcy5vbigndG91Y2hsZWF2ZSB0b3VjaGNhbmNlbCB0b3VjaGVuZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlzVG91Y2hpbmcgPSBmYWxzZTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgfSwgNTApO1xuICAgICAgfSk7XG5cbiAgICAgICR0aGlzLm9uKCd0b3VjaG1vdmUgc2Nyb2xsJywgZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBpZiAoaXNUb3VjaGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCEkLmV2ZW50LnNwZWNpYWwuc2Nyb2xsc3RhcnQuZW5hYmxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCEkLmV2ZW50LnNwZWNpYWwuc2Nyb2xsc3RhcnQuc2Nyb2xsaW5nKSB7XG4gICAgICAgICAgJC5ldmVudC5zcGVjaWFsLnNjcm9sbHN0YXJ0LnNjcm9sbGluZyA9IHRydWU7XG4gICAgICAgICAgdHJpZ2dlcihldmVudCwgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgJC5ldmVudC5zcGVjaWFsLnNjcm9sbHN0YXJ0LnNjcm9sbGluZyA9IGZhbHNlO1xuICAgICAgICAgIHRyaWdnZXIoZXZlbnQsIGZhbHNlKTtcbiAgICAgICAgfSwgNTApO1xuXG4gICAgICB9KTtcblxuICAgIH1cblxuICB9O1xuXG4gIC8vIFByb3hpZXMgc2Nyb2xsc3RhcnQgd2hlbiBuZWVkZWRcbiAgJC5ldmVudC5zcGVjaWFsLnNjcm9sbHN0b3AgPSB7XG5cbiAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG5cbiAgICAgIHZhciB0aGlzT2JqZWN0ID0gdGhpcztcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpc09iamVjdCk7XG5cbiAgICAgIGlmKCEkdGhpcy5kYXRhKCdzY3JvbGx3YXRjaCcpKSB7XG4gICAgICAgICQodGhpcykub24oJ3Njcm9sbHN0YXJ0JywgZnVuY3Rpb24oKXt9KTtcbiAgICAgIH1cblxuICAgIH1cblxuICB9O1xuXG59KShqUXVlcnkpO1xuXG4vKiFcbiAqIFJlc2l6ZXN0YXJ0IGFuZCByZXNpemVzdG9wIGV2ZW50cy5cbiAqIFZlcnNpb24gMC4wLjFcbiAqXG4gKiBSZXF1aXJlczpcbiAqIC0galF1ZXJ5IDEuNy4xIG9yIGhpZ2hlciAobm8galF1ZXJ5Lm1pZ3JhdGUgbmVlZGVkKVxuICpcbiAqIENvcHlyaWdodCAyMDEzLCBHdWlkbyBCb3VtYW5cbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbiAqIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbiAqIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuICogRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4gKiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4gKiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuICogT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuICogVEhFIFNPRlRXQVJFLlxuICpcbiAqIERhdGU6IEZyaSBPY3QgMjUgMTU6MDU6MDAgMjAxMyArMDEwMFxuICovXG4oZnVuY3Rpb24oJCkge1xuXG4gIC8vIEFsc28gaGFuZGxlcyB0aGUgcmVzaXplc3RvcCBldmVudFxuICAkLmV2ZW50LnNwZWNpYWwucmVzaXplc3RhcnQgPSB7XG5cbiAgICBlbmFibGVkOiB0cnVlLFxuXG4gICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgdGhpc09iamVjdCA9IHRoaXM7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXNPYmplY3QpO1xuICAgICAgdmFyIHJlc2l6aW5nO1xuICAgICAgdmFyIHRpbWVyO1xuXG4gICAgICAkdGhpcy5kYXRhKCdyZXNpemV3YXRjaCcsIHRydWUpO1xuXG4gICAgICBmdW5jdGlvbiB0cmlnZ2VyKGV2ZW50LCByZXNpemluZykge1xuXG4gICAgICAgIGV2ZW50LnR5cGUgPSByZXNpemluZyA/ICdyZXNpemVzdGFydCcgOiAncmVzaXplc3RvcCc7XG4gICAgICAgICR0aGlzLnRyaWdnZXIoZXZlbnQpO1xuXG4gICAgICB9XG5cbiAgICAgICR0aGlzLm9uKCdyZXNpemUnLCBmdW5jdGlvbihldmVudCkge1xuXG4gICAgICAgIGlmKCEkLmV2ZW50LnNwZWNpYWwucmVzaXplc3RhcnQuZW5hYmxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCEkLmV2ZW50LnNwZWNpYWwucmVzaXplc3RhcnQucmVzaXppbmcpIHtcbiAgICAgICAgICAkLmV2ZW50LnNwZWNpYWwucmVzaXplc3RhcnQucmVzaXppbmcgPSB0cnVlO1xuICAgICAgICAgIHRyaWdnZXIoZXZlbnQsIHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICAgICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICQuZXZlbnQuc3BlY2lhbC5yZXNpemVzdGFydC5yZXNpemluZyA9IGZhbHNlO1xuICAgICAgICAgIHRyaWdnZXIoZXZlbnQsIGZhbHNlKTtcbiAgICAgICAgfSwgMjAwKTtcblxuICAgICAgfSk7XG5cbiAgICB9XG5cbiAgfTtcblxuICAvLyBQcm94aWVzIHJlc2l6ZXN0YXJ0IHdoZW4gbmVlZGVkXG4gICQuZXZlbnQuc3BlY2lhbC5yZXNpemVzdG9wID0ge1xuXG4gICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuXG4gICAgICB2YXIgdGhpc09iamVjdCA9IHRoaXM7XG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXNPYmplY3QpO1xuXG4gICAgICBpZighJHRoaXMuZGF0YSgncmVzaXpld2F0Y2gnKSkge1xuICAgICAgICAkKHRoaXMpLm9uKCdyZXNpemVzdGFydCcsIGZ1bmN0aW9uKCl7fSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgfTtcblxufSkoalF1ZXJ5KTtcblxuLyohIENvcHlyaWdodCAoYykgMjAxMSBCcmFuZG9uIEFhcm9uIChodHRwOi8vYnJhbmRvbmFhcm9uLm5ldClcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTElDRU5TRS50eHQpLlxuICpcbiAqIFRoYW5rcyB0bzogaHR0cDovL2Fkb21hcy5vcmcvamF2YXNjcmlwdC1tb3VzZS13aGVlbC8gZm9yIHNvbWUgcG9pbnRlcnMuXG4gKiBUaGFua3MgdG86IE1hdGhpYXMgQmFuayhodHRwOi8vd3d3Lm1hdGhpYXMtYmFuay5kZSkgZm9yIGEgc2NvcGUgYnVnIGZpeC5cbiAqIFRoYW5rcyB0bzogU2VhbXVzIExlYWh5IGZvciBhZGRpbmcgZGVsdGFYIGFuZCBkZWx0YVlcbiAqXG4gKiBWZXJzaW9uOiAzLjAuNlxuICpcbiAqIFJlcXVpcmVzOiAxLjIuMitcbiAqL1xuKGZ1bmN0aW9uKCQpIHtcblxuICB2YXIgdHlwZXMgPSBbJ0RPTU1vdXNlU2Nyb2xsJywgJ21vdXNld2hlZWwnXTtcblxuICBpZiAoJC5ldmVudC5maXhIb29rcykge1xuICAgIGZvciAoIHZhciBpPXR5cGVzLmxlbmd0aDsgaTsgKSB7XG4gICAgICAkLmV2ZW50LmZpeEhvb2tzWyB0eXBlc1stLWldIF0gPSAkLmV2ZW50Lm1vdXNlSG9va3M7XG4gICAgfVxuICB9XG5cbiAgJC5ldmVudC5zcGVjaWFsLm1vdXNld2hlZWwgPSB7XG4gICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCB0aGlzLmFkZEV2ZW50TGlzdGVuZXIgKSB7XG4gICAgICAgIGZvciAoIHZhciBpPXR5cGVzLmxlbmd0aDsgaTsgKSB7XG4gICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKCB0eXBlc1stLWldLCBoYW5kbGVyLCBmYWxzZSApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm9ubW91c2V3aGVlbCA9IGhhbmRsZXI7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHRlYXJkb3duOiBmdW5jdGlvbigpIHtcbiAgICAgIGlmICggdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyICkge1xuICAgICAgICBmb3IgKCB2YXIgaT10eXBlcy5sZW5ndGg7IGk7ICkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lciggdHlwZXNbLS1pXSwgaGFuZGxlciwgZmFsc2UgKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbm1vdXNld2hlZWwgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAkLmZuLmV4dGVuZCh7XG4gICAgbW91c2V3aGVlbDogZnVuY3Rpb24oZm4pIHtcbiAgICAgIHJldHVybiBmbiA/IHRoaXMuYmluZCgnbW91c2V3aGVlbCcsIGZuKSA6IHRoaXMudHJpZ2dlcignbW91c2V3aGVlbCcpO1xuICAgIH0sXG5cbiAgICB1bm1vdXNld2hlZWw6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICByZXR1cm4gdGhpcy51bmJpbmQoJ21vdXNld2hlZWwnLCBmbik7XG4gICAgfVxuICB9KTtcblxuICBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50KSB7XG4gICAgdmFyIG9yZ0V2ZW50ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50LFxuICAgICAgICBhcmdzID0gW10uc2xpY2UuY2FsbCggYXJndW1lbnRzLCAxICksXG4gICAgICAgIGRlbHRhID0gMCxcbiAgICAgICAgcmV0dXJuVmFsdWUgPSB0cnVlLFxuICAgICAgICBkZWx0YVggPSAwLFxuICAgICAgICBkZWx0YVkgPSAwO1xuXG4gICAgZXZlbnQgPSAkLmV2ZW50LmZpeChvcmdFdmVudCk7XG4gICAgZXZlbnQudHlwZSA9ICdtb3VzZXdoZWVsJztcblxuICAgIC8vIE9sZCBzY2hvb2wgc2Nyb2xsd2hlZWwgZGVsdGFcbiAgICBpZiAoIG9yZ0V2ZW50LndoZWVsRGVsdGEgKSB7IGRlbHRhID0gb3JnRXZlbnQud2hlZWxEZWx0YS8xMjA7IH1cbiAgICBpZiAoIG9yZ0V2ZW50LmRldGFpbCAgICAgKSB7IGRlbHRhID0gLW9yZ0V2ZW50LmRldGFpbC8zOyB9XG5cbiAgICAvLyBOZXcgc2Nob29sIG11bHRpZGltZW5zaW9uYWwgc2Nyb2xsICh0b3VjaHBhZHMpIGRlbHRhc1xuICAgIGRlbHRhWSA9IGRlbHRhO1xuXG4gICAgLy8gR2Vja29cbiAgICBpZiAoIG9yZ0V2ZW50LmF4aXMgIT09IHVuZGVmaW5lZCAmJiBvcmdFdmVudC5heGlzID09PSBvcmdFdmVudC5IT1JJWk9OVEFMX0FYSVMgKSB7XG4gICAgICBkZWx0YVkgPSAwO1xuICAgICAgZGVsdGFYID0gLTEqZGVsdGE7XG4gICAgfVxuXG4gICAgLy8gV2Via2l0XG4gICAgaWYgKCBvcmdFdmVudC53aGVlbERlbHRhWSAhPT0gdW5kZWZpbmVkICkgeyBkZWx0YVkgPSBvcmdFdmVudC53aGVlbERlbHRhWS8xMjA7IH1cbiAgICBpZiAoIG9yZ0V2ZW50LndoZWVsRGVsdGFYICE9PSB1bmRlZmluZWQgKSB7IGRlbHRhWCA9IC0xKm9yZ0V2ZW50LndoZWVsRGVsdGFYLzEyMDsgfVxuXG4gICAgLy8gQWRkIGV2ZW50IGFuZCBkZWx0YSB0byB0aGUgZnJvbnQgb2YgdGhlIGFyZ3VtZW50c1xuICAgIGFyZ3MudW5zaGlmdChldmVudCwgZGVsdGEsIGRlbHRhWCwgZGVsdGFZKTtcblxuICAgIHJldHVybiAoJC5ldmVudC5kaXNwYXRjaCB8fCAkLmV2ZW50LmhhbmRsZSkuYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxufSkoalF1ZXJ5KTtcbiJdfQ==