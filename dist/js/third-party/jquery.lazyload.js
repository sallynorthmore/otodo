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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90aGlyZC1wYXJ0eS9qcXVlcnkubGF6eWxvYWQuanMiXSwibmFtZXMiOlsiJCIsIndpbmRvdyIsImRvY3VtZW50IiwidW5kZWZpbmVkIiwiJHdpbmRvdyIsImZuIiwibGF6eWxvYWQiLCJvcHRpb25zIiwiZWxlbWVudHMiLCIkY29udGFpbmVyIiwic2V0dGluZ3MiLCJ0aHJlc2hvbGQiLCJmYWlsdXJlX2xpbWl0IiwiZXZlbnQiLCJlZmZlY3QiLCJjb250YWluZXIiLCJkYXRhX2F0dHJpYnV0ZSIsInNraXBfaW52aXNpYmxlIiwiYXBwZWFyIiwibG9hZCIsInBsYWNlaG9sZGVyIiwidXBkYXRlIiwiY291bnRlciIsImVhY2giLCIkdGhpcyIsImlzIiwiYWJvdmV0aGV0b3AiLCJsZWZ0b2ZiZWdpbiIsImJlbG93dGhlZm9sZCIsInJpZ2h0b2Zmb2xkIiwidHJpZ2dlciIsImZhaWx1cmVsaW1pdCIsImVmZmVjdHNwZWVkIiwiZWZmZWN0X3NwZWVkIiwiZXh0ZW5kIiwiaW5kZXhPZiIsImJpbmQiLCJzZWxmIiwiJHNlbGYiLCJsb2FkZWQiLCJhdHRyIiwib25lIiwiZWxlbWVudHNfbGVmdCIsImxlbmd0aCIsImNhbGwiLCJvcmlnaW5hbCIsImhpZGUiLCJjc3MiLCJ0ZW1wIiwiZ3JlcCIsImVsZW1lbnQiLCJ0ZXN0IiwibmF2aWdhdG9yIiwiYXBwVmVyc2lvbiIsIm9yaWdpbmFsRXZlbnQiLCJwZXJzaXN0ZWQiLCJyZWFkeSIsImZvbGQiLCJpbm5lckhlaWdodCIsImhlaWdodCIsInNjcm9sbFRvcCIsIm9mZnNldCIsInRvcCIsIndpZHRoIiwic2Nyb2xsTGVmdCIsImxlZnQiLCJpbnZpZXdwb3J0IiwiZXhwciIsImEiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQSxDQUFDLFVBQVNBLENBQVQsRUFBWUMsTUFBWixFQUFvQkMsUUFBcEIsRUFBOEJDLFNBQTlCLEVBQXlDO0FBQ3RDLFFBQUlDLFVBQVVK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QUFDcEUsRUFBRTZCLFdBQUYsQ0FBY3VDLENBQWQsRUFBaUIsRUFBQ3pELFdBQVksQ0FBYixFQUFqQixDQUFSO0FBQTRDO0FBVDNELEtBQXRCO0FBWUgsQ0FsT0QsRUFrT0cwRCxNQWxPSCxFQWtPV3BFLE1BbE9YLEVBa09tQkMsUUFsT25CIiwiZmlsZSI6ImpxdWVyeS5sYXp5bG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICogTGF6eSBMb2FkIC0galF1ZXJ5IHBsdWdpbiBmb3IgbGF6eSBsb2FkaW5nIGltYWdlc1xuICpcbiAqIENvcHlyaWdodCAoYykgMjAwNy0yMDE1IE1pa2EgVHV1cG9sYVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZTpcbiAqICAgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqXG4gKiBQcm9qZWN0IGhvbWU6XG4gKiAgIGh0dHA6Ly93d3cuYXBwZWxzaWluaS5uZXQvcHJvamVjdHMvbGF6eWxvYWRcbiAqXG4gKiBWZXJzaW9uOiAgMS45LjdcbiAqXG4gKi9cblxuKGZ1bmN0aW9uKCQsIHdpbmRvdywgZG9jdW1lbnQsIHVuZGVmaW5lZCkge1xuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpO1xuXG4gICAgJC5mbi5sYXp5bG9hZCA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gdGhpcztcbiAgICAgICAgdmFyICRjb250YWluZXI7XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHRocmVzaG9sZCAgICAgICA6IDAsXG4gICAgICAgICAgICBmYWlsdXJlX2xpbWl0ICAgOiAwLFxuICAgICAgICAgICAgZXZlbnQgICAgICAgICAgIDogXCJzY3JvbGxcIixcbiAgICAgICAgICAgIGVmZmVjdCAgICAgICAgICA6IFwic2hvd1wiLFxuICAgICAgICAgICAgY29udGFpbmVyICAgICAgIDogd2luZG93LFxuICAgICAgICAgICAgZGF0YV9hdHRyaWJ1dGUgIDogXCJvcmlnaW5hbFwiLFxuICAgICAgICAgICAgc2tpcF9pbnZpc2libGUgIDogZmFsc2UsXG4gICAgICAgICAgICBhcHBlYXIgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgbG9hZCAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyICAgICA6IFwiZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQUFYTlNSMElBcnM0YzZRQUFBQVJuUVUxQkFBQ3hqd3Y4WVFVQUFBQUpjRWhaY3dBQURzUUFBQTdFQVpVckRoc0FBQUFOU1VSQlZCaFhZemg4K1BCL0FBZmZBMG5OUHVDTEFBQUFBRWxGVGtTdVFtQ0NcIlxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcblxuICAgICAgICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5za2lwX2ludmlzaWJsZSAmJiAhJHRoaXMuaXMoXCI6dmlzaWJsZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgkLmFib3ZldGhldG9wKHRoaXMsIHNldHRpbmdzKSB8fFxuICAgICAgICAgICAgICAgICAgICAkLmxlZnRvZmJlZ2luKHRoaXMsIHNldHRpbmdzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogTm90aGluZy4gKi9cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEkLmJlbG93dGhlZm9sZCh0aGlzLCBzZXR0aW5ncykgJiZcbiAgICAgICAgICAgICAgICAgICAgISQucmlnaHRvZmZvbGQodGhpcywgc2V0dGluZ3MpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKFwiYXBwZWFyXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLyogaWYgd2UgZm91bmQgYW4gaW1hZ2Ugd2UnbGwgbG9hZCwgcmVzZXQgdGhlIGNvdW50ZXIgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgrK2NvdW50ZXIgPiBzZXR0aW5ncy5mYWlsdXJlX2xpbWl0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYob3B0aW9ucykge1xuICAgICAgICAgICAgLyogTWFpbnRhaW4gQkMgZm9yIGEgY291cGxlIG9mIHZlcnNpb25zLiAqL1xuICAgICAgICAgICAgaWYgKHVuZGVmaW5lZCAhPT0gb3B0aW9ucy5mYWlsdXJlbGltaXQpIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLmZhaWx1cmVfbGltaXQgPSBvcHRpb25zLmZhaWx1cmVsaW1pdDtcbiAgICAgICAgICAgICAgICBkZWxldGUgb3B0aW9ucy5mYWlsdXJlbGltaXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodW5kZWZpbmVkICE9PSBvcHRpb25zLmVmZmVjdHNwZWVkKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5lZmZlY3Rfc3BlZWQgPSBvcHRpb25zLmVmZmVjdHNwZWVkO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBvcHRpb25zLmVmZmVjdHNwZWVkO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkLmV4dGVuZChzZXR0aW5ncywgb3B0aW9ucyk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBDYWNoZSBjb250YWluZXIgYXMgalF1ZXJ5IGFzIG9iamVjdC4gKi9cbiAgICAgICAgJGNvbnRhaW5lciA9IChzZXR0aW5ncy5jb250YWluZXIgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgICAgICAgICAgICAgICAgIHNldHRpbmdzLmNvbnRhaW5lciA9PT0gd2luZG93KSA/ICR3aW5kb3cgOiAkKHNldHRpbmdzLmNvbnRhaW5lcik7XG5cbiAgICAgICAgLyogRmlyZSBvbmUgc2Nyb2xsIGV2ZW50IHBlciBzY3JvbGwuIE5vdCBvbmUgc2Nyb2xsIGV2ZW50IHBlciBpbWFnZS4gKi9cbiAgICAgICAgaWYgKDAgPT09IHNldHRpbmdzLmV2ZW50LmluZGV4T2YoXCJzY3JvbGxcIikpIHtcbiAgICAgICAgICAgICRjb250YWluZXIuYmluZChzZXR0aW5ncy5ldmVudCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICB2YXIgJHNlbGYgPSAkKHNlbGYpO1xuXG4gICAgICAgICAgICBzZWxmLmxvYWRlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvKiBJZiBubyBzcmMgYXR0cmlidXRlIGdpdmVuIHVzZSBkYXRhOnVyaS4gKi9cbiAgICAgICAgICAgIGlmICgkc2VsZi5hdHRyKFwic3JjXCIpID09PSB1bmRlZmluZWQgfHwgJHNlbGYuYXR0cihcInNyY1wiKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoJHNlbGYuaXMoXCJpbWdcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuYXR0cihcInNyY1wiLCBzZXR0aW5ncy5wbGFjZWhvbGRlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvKiBXaGVuIGFwcGVhciBpcyB0cmlnZ2VyZWQgbG9hZCBvcmlnaW5hbCBpbWFnZS4gKi9cbiAgICAgICAgICAgICRzZWxmLm9uZShcImFwcGVhclwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMubG9hZGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hcHBlYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50c19sZWZ0ID0gZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0dGluZ3MuYXBwZWFyLmNhbGwoc2VsZiwgZWxlbWVudHNfbGVmdCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQoXCI8aW1nIC8+XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAuYmluZChcImxvYWRcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWwgPSAkc2VsZi5hdHRyKFwiZGF0YS1cIiArIHNldHRpbmdzLmRhdGFfYXR0cmlidXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRzZWxmLmlzKFwiaW1nXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLmF0dHIoXCJzcmNcIiwgb3JpZ2luYWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJ1cmwoJ1wiICsgb3JpZ2luYWwgKyBcIicpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZltzZXR0aW5ncy5lZmZlY3RdKHNldHRpbmdzLmVmZmVjdF9zcGVlZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRlZCA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiBSZW1vdmUgaW1hZ2UgZnJvbSBhcnJheSBzbyBpdCBpcyBub3QgbG9vcGVkIG5leHQgdGltZS4gKi9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcCA9ICQuZ3JlcChlbGVtZW50cywgZnVuY3Rpb24oZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gIWVsZW1lbnQubG9hZGVkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRzID0gJCh0ZW1wKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZXR0aW5ncy5sb2FkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbGVtZW50c19sZWZ0ID0gZWxlbWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXR0aW5ncy5sb2FkLmNhbGwoc2VsZiwgZWxlbWVudHNfbGVmdCwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAuYXR0cihcInNyY1wiLCAkc2VsZi5hdHRyKFwiZGF0YS1cIiArIHNldHRpbmdzLmRhdGFfYXR0cmlidXRlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8qIFdoZW4gd2FudGVkIGV2ZW50IGlzIHRyaWdnZXJlZCBsb2FkIG9yaWdpbmFsIGltYWdlICovXG4gICAgICAgICAgICAvKiBieSB0cmlnZ2VyaW5nIGFwcGVhci4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgaWYgKDAgIT09IHNldHRpbmdzLmV2ZW50LmluZGV4T2YoXCJzY3JvbGxcIikpIHtcbiAgICAgICAgICAgICAgICAkc2VsZi5iaW5kKHNldHRpbmdzLmV2ZW50LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzZWxmLmxvYWRlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYudHJpZ2dlcihcImFwcGVhclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvKiBDaGVjayBpZiBzb21ldGhpbmcgYXBwZWFycyB3aGVuIHdpbmRvdyBpcyByZXNpemVkLiAqL1xuICAgICAgICAkd2luZG93LmJpbmQoXCJyZXNpemVcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLyogV2l0aCBJT1M1IGZvcmNlIGxvYWRpbmcgaW1hZ2VzIHdoZW4gbmF2aWdhdGluZyB3aXRoIGJhY2sgYnV0dG9uLiAqL1xuICAgICAgICAvKiBOb24gb3B0aW1hbCB3b3JrYXJvdW5kLiAqL1xuICAgICAgICBpZiAoKC8oPzppcGhvbmV8aXBvZHxpcGFkKS4qb3MgNS9naSkudGVzdChuYXZpZ2F0b3IuYXBwVmVyc2lvbikpIHtcbiAgICAgICAgICAgICR3aW5kb3cuYmluZChcInBhZ2VzaG93XCIsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50Lm9yaWdpbmFsRXZlbnQgJiYgZXZlbnQub3JpZ2luYWxFdmVudC5wZXJzaXN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudHJpZ2dlcihcImFwcGVhclwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvKiBGb3JjZSBpbml0aWFsIGNoZWNrIGlmIGltYWdlcyBzaG91bGQgYXBwZWFyLiAqL1xuICAgICAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyogQ29udmVuaWVuY2UgbWV0aG9kcyBpbiBqUXVlcnkgbmFtZXNwYWNlLiAgICAgICAgICAgKi9cbiAgICAvKiBVc2UgYXMgICQuYmVsb3d0aGVmb2xkKGVsZW1lbnQsIHt0aHJlc2hvbGQgOiAxMDAsIGNvbnRhaW5lciA6IHdpbmRvd30pICovXG5cbiAgICAkLmJlbG93dGhlZm9sZCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBmb2xkO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5jb250YWluZXIgPT09IHVuZGVmaW5lZCB8fCBzZXR0aW5ncy5jb250YWluZXIgPT09IHdpbmRvdykge1xuICAgICAgICAgICAgZm9sZCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgPyB3aW5kb3cuaW5uZXJIZWlnaHQgOiAkd2luZG93LmhlaWdodCgpKSArICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb2xkID0gJChzZXR0aW5ncy5jb250YWluZXIpLm9mZnNldCgpLnRvcCArICQoc2V0dGluZ3MuY29udGFpbmVyKS5oZWlnaHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb2xkIDw9ICQoZWxlbWVudCkub2Zmc2V0KCkudG9wIC0gc2V0dGluZ3MudGhyZXNob2xkO1xuICAgIH07XG5cbiAgICAkLnJpZ2h0b2Zmb2xkID0gZnVuY3Rpb24oZWxlbWVudCwgc2V0dGluZ3MpIHtcbiAgICAgICAgdmFyIGZvbGQ7XG5cbiAgICAgICAgaWYgKHNldHRpbmdzLmNvbnRhaW5lciA9PT0gdW5kZWZpbmVkIHx8IHNldHRpbmdzLmNvbnRhaW5lciA9PT0gd2luZG93KSB7XG4gICAgICAgICAgICBmb2xkID0gJHdpbmRvdy53aWR0aCgpICsgJHdpbmRvdy5zY3JvbGxMZWZ0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb2xkID0gJChzZXR0aW5ncy5jb250YWluZXIpLm9mZnNldCgpLmxlZnQgKyAkKHNldHRpbmdzLmNvbnRhaW5lcikud2lkdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb2xkIDw9ICQoZWxlbWVudCkub2Zmc2V0KCkubGVmdCAtIHNldHRpbmdzLnRocmVzaG9sZDtcbiAgICB9O1xuXG4gICAgJC5hYm92ZXRoZXRvcCA9IGZ1bmN0aW9uKGVsZW1lbnQsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBmb2xkO1xuXG4gICAgICAgIGlmIChzZXR0aW5ncy5jb250YWluZXIgPT09IHVuZGVmaW5lZCB8fCBzZXR0aW5ncy5jb250YWluZXIgPT09IHdpbmRvdykge1xuICAgICAgICAgICAgZm9sZCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb2xkID0gJChzZXR0aW5ncy5jb250YWluZXIpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb2xkID49ICQoZWxlbWVudCkub2Zmc2V0KCkudG9wICsgc2V0dGluZ3MudGhyZXNob2xkICArICQoZWxlbWVudCkuaGVpZ2h0KCk7XG4gICAgfTtcblxuICAgICQubGVmdG9mYmVnaW4gPSBmdW5jdGlvbihlbGVtZW50LCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZm9sZDtcblxuICAgICAgICBpZiAoc2V0dGluZ3MuY29udGFpbmVyID09PSB1bmRlZmluZWQgfHwgc2V0dGluZ3MuY29udGFpbmVyID09PSB3aW5kb3cpIHtcbiAgICAgICAgICAgIGZvbGQgPSAkd2luZG93LnNjcm9sbExlZnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZvbGQgPSAkKHNldHRpbmdzLmNvbnRhaW5lcikub2Zmc2V0KCkubGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmb2xkID49ICQoZWxlbWVudCkub2Zmc2V0KCkubGVmdCArIHNldHRpbmdzLnRocmVzaG9sZCArICQoZWxlbWVudCkud2lkdGgoKTtcbiAgICB9O1xuXG4gICAgJC5pbnZpZXdwb3J0ID0gZnVuY3Rpb24oZWxlbWVudCwgc2V0dGluZ3MpIHtcbiAgICAgICAgIHJldHVybiAhJC5yaWdodG9mZm9sZChlbGVtZW50LCBzZXR0aW5ncykgJiYgISQubGVmdG9mYmVnaW4oZWxlbWVudCwgc2V0dGluZ3MpICYmXG4gICAgICAgICAgICAgICAgISQuYmVsb3d0aGVmb2xkKGVsZW1lbnQsIHNldHRpbmdzKSAmJiAhJC5hYm92ZXRoZXRvcChlbGVtZW50LCBzZXR0aW5ncyk7XG4gICAgIH07XG5cbiAgICAvKiBDdXN0b20gc2VsZWN0b3JzIGZvciB5b3VyIGNvbnZlbmllbmNlLiAgICovXG4gICAgLyogVXNlIGFzICQoXCJpbWc6YmVsb3ctdGhlLWZvbGRcIikuc29tZXRoaW5nKCkgb3IgKi9cbiAgICAvKiAkKFwiaW1nXCIpLmZpbHRlcihcIjpiZWxvdy10aGUtZm9sZFwiKS5zb21ldGhpbmcoKSB3aGljaCBpcyBmYXN0ZXIgKi9cblxuICAgICQuZXh0ZW5kKCQuZXhwcltcIjpcIl0sIHtcbiAgICAgICAgXCJiZWxvdy10aGUtZm9sZFwiIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gJC5iZWxvd3RoZWZvbGQoYSwge3RocmVzaG9sZCA6IDB9KTsgfSxcbiAgICAgICAgXCJhYm92ZS10aGUtdG9wXCIgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gISQuYmVsb3d0aGVmb2xkKGEsIHt0aHJlc2hvbGQgOiAwfSk7IH0sXG4gICAgICAgIFwicmlnaHQtb2Ytc2NyZWVuXCI6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICQucmlnaHRvZmZvbGQoYSwge3RocmVzaG9sZCA6IDB9KTsgfSxcbiAgICAgICAgXCJsZWZ0LW9mLXNjcmVlblwiIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gISQucmlnaHRvZmZvbGQoYSwge3RocmVzaG9sZCA6IDB9KTsgfSxcbiAgICAgICAgXCJpbi12aWV3cG9ydFwiICAgIDogZnVuY3Rpb24oYSkgeyByZXR1cm4gJC5pbnZpZXdwb3J0KGEsIHt0aHJlc2hvbGQgOiAwfSk7IH0sXG4gICAgICAgIC8qIE1haW50YWluIEJDIGZvciBjb3VwbGUgb2YgdmVyc2lvbnMuICovXG4gICAgICAgIFwiYWJvdmUtdGhlLWZvbGRcIiA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICEkLmJlbG93dGhlZm9sZChhLCB7dGhyZXNob2xkIDogMH0pOyB9LFxuICAgICAgICBcInJpZ2h0LW9mLWZvbGRcIiAgOiBmdW5jdGlvbihhKSB7IHJldHVybiAkLnJpZ2h0b2Zmb2xkKGEsIHt0aHJlc2hvbGQgOiAwfSk7IH0sXG4gICAgICAgIFwibGVmdC1vZi1mb2xkXCIgICA6IGZ1bmN0aW9uKGEpIHsgcmV0dXJuICEkLnJpZ2h0b2Zmb2xkKGEsIHt0aHJlc2hvbGQgOiAwfSk7IH1cbiAgICB9KTtcblxufSkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiJdfQ==