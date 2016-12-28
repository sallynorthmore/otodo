/*!
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2015 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.9.7
 *
 */

(function ($, window, document, undefined) {
    var $window = $(window);

    $.fn.lazyload = function (options) {
        var elements = this;
        var $container;
        var settings = {
            threshold: 0,
            failure_limit: 0,
            event: "scroll",
            effect: "show",
            container: window,
            data_attribute: "original",
            skip_invisible: false,
            appear: null,
            load: null,
            placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
        };

        function update() {
            var counter = 0;

            elements.each(function () {
                var $this = $(this);
                if (settings.skip_invisible && !$this.is(":visible")) {
                    return;
                }
                if ($.abovethetop(this, settings) || $.leftofbegin(this, settings)) {
                    /* Nothing. */
                } else if (!$.belowthefold(this, settings) && !$.rightoffold(this, settings)) {
                    $this.trigger("appear");
                    /* if we found an image we'll load, reset the counter */
                    counter = 0;
                } else {
                    if (++counter > settings.failure_limit) {
                        return false;
                    }
                }
            });
        }

        if (options) {
            /* Maintain BC for a couple of versions. */
            if (undefined !== options.failurelimit) {
                options.failure_limit = options.failurelimit;
                delete options.failurelimit;
            }
            if (undefined !== options.effectspeed) {
                options.effect_speed = options.effectspeed;
                delete options.effectspeed;
            }

            $.extend(settings, options);
        }

        /* Cache container as jQuery as object. */
        $container = settings.container === undefined || settings.container === window ? $window : $(settings.container);

        /* Fire one scroll event per scroll. Not one scroll event per image. */
        if (0 === settings.event.indexOf("scroll")) {
            $container.bind(settings.event, function () {
                return update();
            });
        }

        this.each(function () {
            var self = this;
            var $self = $(self);

            self.loaded = false;

            /* If no src attribute given use data:uri. */
            if ($self.attr("src") === undefined || $self.attr("src") === false) {
                if ($self.is("img")) {
                    $self.attr("src", settings.placeholder);
                }
            }

            /* When appear is triggered load original image. */
            $self.one("appear", function () {
                if (!this.loaded) {
                    if (settings.appear) {
                        var elements_left = elements.length;
                        settings.appear.call(self, elements_left, settings);
                    }
                    $("<img />").bind("load", function () {

                        var original = $self.attr("data-" + settings.data_attribute);
                        $self.hide();
                        if ($self.is("img")) {
                            $self.attr("src", original);
                        } else {
                            $self.css("background-image", "url('" + original + "')");
                        }
                        $self[settings.effect](settings.effect_speed);

                        self.loaded = true;

                        /* Remove image from array so it is not looped next time. */
                        var temp = $.grep(elements, function (element) {
                            return !element.loaded;
                        });
                        elements = $(temp);

                        if (settings.load) {
                            var elements_left = elements.length;
                            settings.load.call(self, elements_left, settings);
                        }
                    }).attr("src", $self.attr("data-" + settings.data_attribute));
                }
            });

            /* When wanted event is triggered load original image */
            /* by triggering appear.                              */
            if (0 !== settings.event.indexOf("scroll")) {
                $self.bind(settings.event, function () {
                    if (!self.loaded) {
                        $self.trigger("appear");
                    }
                });
            }
        });

        /* Check if something appears when window is resized. */
        $window.bind("resize", function () {
            update();
        });

        /* With IOS5 force loading images when navigating with back button. */
        /* Non optimal workaround. */
        if (/(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion)) {
            $window.bind("pageshow", function (event) {
                if (event.originalEvent && event.originalEvent.persisted) {
                    elements.each(function () {
                        $(this).trigger("appear");
                    });
                }
            });
        }

        /* Force initial check if images should appear. */
        $(document).ready(function () {
            update();
        });

        return this;
    };

    /* Convenience methods in jQuery namespace.           */
    /* Use as  $.belowthefold(element, {threshold : 100, container : window}) */

    $.belowthefold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = (window.innerHeight ? window.innerHeight : $window.height()) + $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top + $(settings.container).height();
        }

        return fold <= $(element).offset().top - settings.threshold;
    };

    $.rightoffold = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.width() + $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left + $(settings.container).width();
        }

        return fold <= $(element).offset().left - settings.threshold;
    };

    $.abovethetop = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollTop();
        } else {
            fold = $(settings.container).offset().top;
        }

        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };

    $.leftofbegin = function (element, settings) {
        var fold;

        if (settings.container === undefined || settings.container === window) {
            fold = $window.scrollLeft();
        } else {
            fold = $(settings.container).offset().left;
        }

        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };

    $.inviewport = function (element, settings) {
        return !$.rightoffold(element, settings) && !$.leftofbegin(element, settings) && !$.belowthefold(element, settings) && !$.abovethetop(element, settings);
    };

    /* Custom selectors for your convenience.   */
    /* Use as $("img:below-the-fold").something() or */
    /* $("img").filter(":below-the-fold").something() which is faster */

    $.extend($.expr[":"], {
        "below-the-fold": function (a) {
            return $.belowthefold(a, { threshold: 0 });
        },
        "above-the-top": function (a) {
            return !$.belowthefold(a, { threshold: 0 });
        },
        "right-of-screen": function (a) {
            return $.rightoffold(a, { threshold: 0 });
        },
        "left-of-screen": function (a) {
            return !$.rightoffold(a, { threshold: 0 });
        },
        "in-viewport": function (a) {
            return $.inviewport(a, { threshold: 0 });
        },
        /* Maintain BC for couple of versions. */
        "above-the-fold": function (a) {
            return !$.belowthefold(a, { threshold: 0 });
        },
        "right-of-fold": function (a) {
            return $.rightoffold(a, { threshold: 0 });
        },
        "left-of-fold": function (a) {
            return !$.rightoffold(a, { threshold: 0 });
        }
    });
})(jQuery, window, document);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90aGlyZC1wYXJ0eS9sYXp5LWxvYWQvanF1ZXJ5Lmxhenlsb2FkLmpzIl0sIm5hbWVzIjpbIiQiLCJ3aW5kb3ciLCJkb2N1bWVudCIsInVuZGVmaW5lZCIsIiR3aW5kb3ciLCJmbiIsImxhenlsb2FkIiwib3B0aW9ucyIsImVsZW1lbnRzIiwiJGNvbnRhaW5lciIsInNldHRpbmdzIiwidGhyZXNob2xkIiwiZmFpbHVyZV9saW1pdCIsImV2ZW50IiwiZWZmZWN0IiwiY29udGFpbmVyIiwiZGF0YV9hdHRyaWJ1dGUiLCJza2lwX2ludmlzaWJsZSIsImFwcGVhciIsImxvYWQiLCJwbGFjZWhvbGRlciIsInVwZGF0ZSIsImNvdW50ZXIiLCJlYWNoIiwiJHRoaXMiLCJpcyIsImFib3ZldGhldG9wIiwibGVmdG9mYmVnaW4iLCJiZWxvd3RoZWZvbGQiLCJyaWdodG9mZm9sZCIsInRyaWdnZXIiLCJmYWlsdXJlbGltaXQiLCJlZmZlY3RzcGVlZCIsImVmZmVjdF9zcGVlZCIsImV4dGVuZCIsImluZGV4T2YiLCJiaW5kIiwic2VsZiIsIiRzZWxmIiwibG9hZGVkIiwiYXR0ciIsIm9uZSIsImVsZW1lbnRzX2xlZnQiLCJsZW5ndGgiLCJjYWxsIiwib3JpZ2luYWwiLCJoaWRlIiwiY3NzIiwidGVtcCIsImdyZXAiLCJlbGVtZW50IiwidGVzdCIsIm5hdmlnYXRvciIsImFwcFZlcnNpb24iLCJvcmlnaW5hbEV2ZW50IiwicGVyc2lzdGVkIiwicmVhZHkiLCJmb2xkIiwiaW5uZXJIZWlnaHQiLCJoZWlnaHQiLCJzY3JvbGxUb3AiLCJvZmZzZXQiLCJ0b3AiLCJ3aWR0aCIsInNjcm9sbExlZnQiLCJsZWZ0IiwiaW52aWV3cG9ydCIsImV4cHIiLCJhIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsQ0FBQyxVQUFTQSxDQUFULEVBQVlDLE1BQVosRUFBb0JDLFFBQXBCLEVBQThCQyxTQUE5QixFQUF5QztBQUN0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O0FBQUUsbUJBQU8sQ0FBQ3BFLEVBQUU2QixXQUFGLENBQWN1QyxDQUFkLEVBQWlCLEVBQUN6RCxXQUFZLENBQWIsRUFBakIsQ0FBUjtBQUE0QztBQVQzRCxLQUF0QjtBQVlILENBbE9ELEVBa09HMEQsTUFsT0gsRUFrT1dwRSxNQWxPWCxFQWtPbUJDLFFBbE9uQiIsImZpbGUiOiJqcXVlcnkubGF6eWxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIExhenkgTG9hZCAtIGpRdWVyeSBwbHVnaW4gZm9yIGxhenkgbG9hZGluZyBpbWFnZXNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMDctMjAxNSBNaWthIFR1dXBvbGFcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2U6XG4gKiAgIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKlxuICogUHJvamVjdCBob21lOlxuICogICBodHRwOi8vd3d3LmFwcGVsc2lpbmkubmV0L3Byb2plY3RzL2xhenlsb2FkXG4gKlxuICogVmVyc2lvbjogIDEuOS43XG4gKlxuICovXG5cbihmdW5jdGlvbigkLCB3aW5kb3csIGRvY3VtZW50LCB1bmRlZmluZWQpIHtcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KTtcblxuICAgICQuZm4ubGF6eWxvYWQgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgIHZhciBlbGVtZW50cyA9IHRoaXM7XG4gICAgICAgIHZhciAkY29udGFpbmVyO1xuICAgICAgICB2YXIgc2V0dGluZ3MgPSB7XG4gICAgICAgICAgICB0aHJlc2hvbGQgICAgICAgOiAwLFxuICAgICAgICAgICAgZmFpbHVyZV9saW1pdCAgIDogMCxcbiAgICAgICAgICAgIGV2ZW50ICAgICAgICAgICA6IFwic2Nyb2xsXCIsXG4gICAgICAgICAgICBlZmZlY3QgICAgICAgICAgOiBcInNob3dcIixcbiAgICAgICAgICAgIGNvbnRhaW5lciAgICAgICA6IHdpbmRvdyxcbiAgICAgICAgICAgIGRhdGFfYXR0cmlidXRlICA6IFwib3JpZ2luYWxcIixcbiAgICAgICAgICAgIHNraXBfaW52aXNpYmxlICA6IGZhbHNlLFxuICAgICAgICAgICAgYXBwZWFyICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIGxvYWQgICAgICAgICAgICA6IG51bGwsXG4gICAgICAgICAgICBwbGFjZWhvbGRlciAgICAgOiBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFBWE5TUjBJQXJzNGM2UUFBQUFSblFVMUJBQUN4and2OFlRVUFBQUFKY0VoWmN3QUFEc1FBQUE3RUFaVXJEaHNBQUFBTlNVUkJWQmhYWXpoOCtQQi9BQWZmQTBuTlB1Q0xBQUFBQUVsRlRrU3VRbUNDXCJcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG5cbiAgICAgICAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3Muc2tpcF9pbnZpc2libGUgJiYgISR0aGlzLmlzKFwiOnZpc2libGVcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoJC5hYm92ZXRoZXRvcCh0aGlzLCBzZXR0aW5ncykgfHxcbiAgICAgICAgICAgICAgICAgICAgJC5sZWZ0b2ZiZWdpbih0aGlzLCBzZXR0aW5ncykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIE5vdGhpbmcuICovXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghJC5iZWxvd3RoZWZvbGQodGhpcywgc2V0dGluZ3MpICYmXG4gICAgICAgICAgICAgICAgICAgICEkLnJpZ2h0b2Zmb2xkKHRoaXMsIHNldHRpbmdzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcihcImFwcGVhclwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8qIGlmIHdlIGZvdW5kIGFuIGltYWdlIHdlJ2xsIGxvYWQsIHJlc2V0IHRoZSBjb3VudGVyICovXG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKytjb3VudGVyID4gc2V0dGluZ3MuZmFpbHVyZV9saW1pdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG9wdGlvbnMpIHtcbiAgICAgICAgICAgIC8qIE1haW50YWluIEJDIGZvciBhIGNvdXBsZSBvZiB2ZXJzaW9ucy4gKi9cbiAgICAgICAgICAgIGlmICh1bmRlZmluZWQgIT09IG9wdGlvbnMuZmFpbHVyZWxpbWl0KSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5mYWlsdXJlX2xpbWl0ID0gb3B0aW9ucy5mYWlsdXJlbGltaXQ7XG4gICAgICAgICAgICAgICAgZGVsZXRlIG9wdGlvbnMuZmFpbHVyZWxpbWl0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gb3B0aW9ucy5lZmZlY3RzcGVlZCkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuZWZmZWN0X3NwZWVkID0gb3B0aW9ucy5lZmZlY3RzcGVlZDtcbiAgICAgICAgICAgICAgICBkZWxldGUgb3B0aW9ucy5lZmZlY3RzcGVlZDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJC5leHRlbmQoc2V0dGluZ3MsIG9wdGlvbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogQ2FjaGUgY29udGFpbmVyIGFzIGpRdWVyeSBhcyBvYmplY3QuICovXG4gICAgICAgICRjb250YWluZXIgPSAoc2V0dGluZ3MuY29udGFpbmVyID09PSB1bmRlZmluZWQgfHxcbiAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5jb250YWluZXIgPT09IHdpbmRvdykgPyAkd2luZG93IDogJChzZXR0aW5ncy5jb250YWluZXIpO1xuXG4gICAgICAgIC8qIEZpcmUgb25lIHNjcm9sbCBldmVudCBwZXIgc2Nyb2xsLiBOb3Qgb25lIHNjcm9sbCBldmVudCBwZXIgaW1hZ2UuICovXG4gICAgICAgIGlmICgwID09PSBzZXR0aW5ncy5ldmVudC5pbmRleE9mKFwic2Nyb2xsXCIpKSB7XG4gICAgICAgICAgICAkY29udGFpbmVyLmJpbmQoc2V0dGluZ3MuZXZlbnQsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB1cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgdmFyICRzZWxmID0gJChzZWxmKTtcblxuICAgICAgICAgICAgc2VsZi5sb2FkZWQgPSBmYWxzZTtcblxuICAgICAgICAgICAgLyogSWYgbm8gc3JjIGF0dHJpYnV0ZSBnaXZlbiB1c2UgZGF0YTp1cmkuICovXG4gICAgICAgICAgICBpZiAoJHNlbGYuYXR0cihcInNyY1wiKSA9PT0gdW5kZWZpbmVkIHx8ICRzZWxmLmF0dHIoXCJzcmNcIikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCRzZWxmLmlzKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICRzZWxmLmF0dHIoXCJzcmNcIiwgc2V0dGluZ3MucGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLyogV2hlbiBhcHBlYXIgaXMgdHJpZ2dlcmVkIGxvYWQgb3JpZ2luYWwgaW1hZ2UuICovXG4gICAgICAgICAgICAkc2VsZi5vbmUoXCJhcHBlYXJcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MuYXBwZWFyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHNfbGVmdCA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmFwcGVhci5jYWxsKHNlbGYsIGVsZW1lbnRzX2xlZnQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkKFwiPGltZyAvPlwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmJpbmQoXCJsb2FkXCIsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9yaWdpbmFsID0gJHNlbGYuYXR0cihcImRhdGEtXCIgKyBzZXR0aW5ncy5kYXRhX2F0dHJpYnV0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkc2VsZi5pcyhcImltZ1wiKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5hdHRyKFwic3JjXCIsIG9yaWdpbmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsIFwidXJsKCdcIiArIG9yaWdpbmFsICsgXCInKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGZbc2V0dGluZ3MuZWZmZWN0XShzZXR0aW5ncy5lZmZlY3Rfc3BlZWQpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkZWQgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogUmVtb3ZlIGltYWdlIGZyb20gYXJyYXkgc28gaXQgaXMgbm90IGxvb3BlZCBuZXh0IHRpbWUuICovXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRlbXAgPSAkLmdyZXAoZWxlbWVudHMsIGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICFlbGVtZW50LmxvYWRlZDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50cyA9ICQodGVtcCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2V0dGluZ3MubG9hZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZWxlbWVudHNfbGVmdCA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MubG9hZC5jYWxsKHNlbGYsIGVsZW1lbnRzX2xlZnQsIHNldHRpbmdzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLmF0dHIoXCJzcmNcIiwgJHNlbGYuYXR0cihcImRhdGEtXCIgKyBzZXR0aW5ncy5kYXRhX2F0dHJpYnV0ZSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvKiBXaGVuIHdhbnRlZCBldmVudCBpcyB0cmlnZ2VyZWQgbG9hZCBvcmlnaW5hbCBpbWFnZSAqL1xuICAgICAgICAgICAgLyogYnkgdHJpZ2dlcmluZyBhcHBlYXIuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgIGlmICgwICE9PSBzZXR0aW5ncy5ldmVudC5pbmRleE9mKFwic2Nyb2xsXCIpKSB7XG4gICAgICAgICAgICAgICAgJHNlbGYuYmluZChzZXR0aW5ncy5ldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5sb2FkZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLnRyaWdnZXIoXCJhcHBlYXJcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogQ2hlY2sgaWYgc29tZXRoaW5nIGFwcGVhcnMgd2hlbiB3aW5kb3cgaXMgcmVzaXplZC4gKi9cbiAgICAgICAgJHdpbmRvdy5iaW5kKFwicmVzaXplXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8qIFdpdGggSU9TNSBmb3JjZSBsb2FkaW5nIGltYWdlcyB3aGVuIG5hdmlnYXRpbmcgd2l0aCBiYWNrIGJ1dHRvbi4gKi9cbiAgICAgICAgLyogTm9uIG9wdGltYWwgd29ya2Fyb3VuZC4gKi9cbiAgICAgICAgaWYgKCgvKD86aXBob25lfGlwb2R8aXBhZCkuKm9zIDUvZ2kpLnRlc3QobmF2aWdhdG9yLmFwcFZlcnNpb24pKSB7XG4gICAgICAgICAgICAkd2luZG93LmJpbmQoXCJwYWdlc2hvd1wiLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5vcmlnaW5hbEV2ZW50ICYmIGV2ZW50Lm9yaWdpbmFsRXZlbnQucGVyc2lzdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnRyaWdnZXIoXCJhcHBlYXJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLyogRm9yY2UgaW5pdGlhbCBjaGVjayBpZiBpbWFnZXMgc2hvdWxkIGFwcGVhci4gKi9cbiAgICAgICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qIENvbnZlbmllbmNlIG1ldGhvZHMgaW4galF1ZXJ5IG5hbWVzcGFjZS4gICAgICAgICAgICovXG4gICAgLyogVXNlIGFzICAkLmJlbG93dGhlZm9sZChlbGVtZW50LCB7dGhyZXNob2xkIDogMTAwLCBjb250YWluZXIgOiB3aW5kb3d9KSAqL1xuXG4gICAgJC5iZWxvd3RoZWZvbGQgPSBmdW5jdGlvbihlbGVtZW50LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZm9sZDtcblxuICAgICAgICBpZiAoc2V0dGluZ3MuY29udGFpbmVyID09PSB1bmRlZmluZWQgfHwgc2V0dGluZ3MuY29udGFpbmVyID09PSB3aW5kb3cpIHtcbiAgICAgICAgICAgIGZvbGQgPSAod2luZG93LmlubmVySGVpZ2h0ID8gd2luZG93LmlubmVySGVpZ2h0IDogJHdpbmRvdy5oZWlnaHQoKSkgKyAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9sZCA9ICQoc2V0dGluZ3MuY29udGFpbmVyKS5vZmZzZXQoKS50b3AgKyAkKHNldHRpbmdzLmNvbnRhaW5lcikuaGVpZ2h0KCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9sZCA8PSAkKGVsZW1lbnQpLm9mZnNldCgpLnRvcCAtIHNldHRpbmdzLnRocmVzaG9sZDtcbiAgICB9O1xuXG4gICAgJC5yaWdodG9mZm9sZCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBmb2xkO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5jb250YWluZXIgPT09IHVuZGVmaW5lZCB8fCBzZXR0aW5ncy5jb250YWluZXIgPT09IHdpbmRvdykge1xuICAgICAgICAgICAgZm9sZCA9ICR3aW5kb3cud2lkdGgoKSArICR3aW5kb3cuc2Nyb2xsTGVmdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9sZCA9ICQoc2V0dGluZ3MuY29udGFpbmVyKS5vZmZzZXQoKS5sZWZ0ICsgJChzZXR0aW5ncy5jb250YWluZXIpLndpZHRoKCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9sZCA8PSAkKGVsZW1lbnQpLm9mZnNldCgpLmxlZnQgLSBzZXR0aW5ncy50aHJlc2hvbGQ7XG4gICAgfTtcblxuICAgICQuYWJvdmV0aGV0b3AgPSBmdW5jdGlvbihlbGVtZW50LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZm9sZDtcblxuICAgICAgICBpZiAoc2V0dGluZ3MuY29udGFpbmVyID09PSB1bmRlZmluZWQgfHwgc2V0dGluZ3MuY29udGFpbmVyID09PSB3aW5kb3cpIHtcbiAgICAgICAgICAgIGZvbGQgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZm9sZCA9ICQoc2V0dGluZ3MuY29udGFpbmVyKS5vZmZzZXQoKS50b3A7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9sZCA+PSAkKGVsZW1lbnQpLm9mZnNldCgpLnRvcCArIHNldHRpbmdzLnRocmVzaG9sZCAgKyAkKGVsZW1lbnQpLmhlaWdodCgpO1xuICAgIH07XG5cbiAgICAkLmxlZnRvZmJlZ2luID0gZnVuY3Rpb24oZWxlbWVudCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGZvbGQ7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmNvbnRhaW5lciA9PT0gdW5kZWZpbmVkIHx8IHNldHRpbmdzLmNvbnRhaW5lciA9PT0gd2luZG93KSB7XG4gICAgICAgICAgICBmb2xkID0gJHdpbmRvdy5zY3JvbGxMZWZ0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb2xkID0gJChzZXR0aW5ncy5jb250YWluZXIpLm9mZnNldCgpLmxlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZm9sZCA+PSAkKGVsZW1lbnQpLm9mZnNldCgpLmxlZnQgKyBzZXR0aW5ncy50aHJlc2hvbGQgKyAkKGVsZW1lbnQpLndpZHRoKCk7XG4gICAgfTtcblxuICAgICQuaW52aWV3cG9ydCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNldHRpbmdzKSB7XG4gICAgICAgICByZXR1cm4gISQucmlnaHRvZmZvbGQoZWxlbWVudCwgc2V0dGluZ3MpICYmICEkLmxlZnRvZmJlZ2luKGVsZW1lbnQsIHNldHRpbmdzKSAmJlxuICAgICAgICAgICAgICAgICEkLmJlbG93dGhlZm9sZChlbGVtZW50LCBzZXR0aW5ncykgJiYgISQuYWJvdmV0aGV0b3AoZWxlbWVudCwgc2V0dGluZ3MpO1xuICAgICB9O1xuXG4gICAgLyogQ3VzdG9tIHNlbGVjdG9ycyBmb3IgeW91ciBjb252ZW5pZW5jZS4gICAqL1xuICAgIC8qIFVzZSBhcyAkKFwiaW1nOmJlbG93LXRoZS1mb2xkXCIpLnNvbWV0aGluZygpIG9yICovXG4gICAgLyogJChcImltZ1wiKS5maWx0ZXIoXCI6YmVsb3ctdGhlLWZvbGRcIikuc29tZXRoaW5nKCkgd2hpY2ggaXMgZmFzdGVyICovXG5cbiAgICAkLmV4dGVuZCgkLmV4cHJbXCI6XCJdLCB7XG4gICAgICAgIFwiYmVsb3ctdGhlLWZvbGRcIiA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICQuYmVsb3d0aGVmb2xkKGEsIHt0aHJlc2hvbGQgOiAwfSk7IH0sXG4gICAgICAgIFwiYWJvdmUtdGhlLXRvcFwiICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICEkLmJlbG93dGhlZm9sZChhLCB7dGhyZXNob2xkIDogMH0pOyB9LFxuICAgICAgICBcInJpZ2h0LW9mLXNjcmVlblwiOiBmdW5jdGlvbihhKSB7IHJldHVybiAkLnJpZ2h0b2Zmb2xkKGEsIHt0aHJlc2hvbGQgOiAwfSk7IH0sXG4gICAgICAgIFwibGVmdC1vZi1zY3JlZW5cIiA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICEkLnJpZ2h0b2Zmb2xkKGEsIHt0aHJlc2hvbGQgOiAwfSk7IH0sXG4gICAgICAgIFwiaW4tdmlld3BvcnRcIiAgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICQuaW52aWV3cG9ydChhLCB7dGhyZXNob2xkIDogMH0pOyB9LFxuICAgICAgICAvKiBNYWludGFpbiBCQyBmb3IgY291cGxlIG9mIHZlcnNpb25zLiAqL1xuICAgICAgICBcImFib3ZlLXRoZS1mb2xkXCIgOiBmdW5jdGlvbihhKSB7IHJldHVybiAhJC5iZWxvd3RoZWZvbGQoYSwge3RocmVzaG9sZCA6IDB9KTsgfSxcbiAgICAgICAgXCJyaWdodC1vZi1mb2xkXCIgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gJC5yaWdodG9mZm9sZChhLCB7dGhyZXNob2xkIDogMH0pOyB9LFxuICAgICAgICBcImxlZnQtb2YtZm9sZFwiICAgOiBmdW5jdGlvbihhKSB7IHJldHVybiAhJC5yaWdodG9mZm9sZChhLCB7dGhyZXNob2xkIDogMH0pOyB9XG4gICAgfSk7XG5cbn0pKGpRdWVyeSwgd2luZG93LCBkb2N1bWVudCk7XG4iXX0=