/* ===========================================================
 * jquery-onepage-scroll.js v1.3.1
 * ===========================================================
 * Copyright 2013 Pete Rojwongsuriya.
 * http://www.thepetedesign.com
 *
 * Create an Apple-like website that let user scroll
 * one page at a time
 *
 * Credit: Eike Send for the awesome swipe event
 * https://github.com/peachananr/onepage-scroll
 *
 * License: GPL v3
 *
 * ========================================================== */

!function ($) {

  var defaults = {
    sectionContainer: "section",
    easing: "ease",
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    keyboard: true,
    beforeMove: null,
    afterMove: null,
    loop: true,
    responsiveFallback: false,
    direction: 'vertical'
  };

  /*------------------------------------------------*/
  /*  Credit: Eike Send for the awesome swipe event */
  /*------------------------------------------------*/

  $.fn.swipeEvents = function () {
    return this.each(function () {

      var startX,
          startY,
          $this = $(this);

      $this.bind('touchstart', touchstart);

      function touchstart(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          startX = touches[0].pageX;
          startY = touches[0].pageY;
          $this.bind('touchmove', touchmove);
        }
      }

      function touchmove(event) {
        var touches = event.originalEvent.touches;
        if (touches && touches.length) {
          var deltaX = startX - touches[0].pageX;
          var deltaY = startY - touches[0].pageY;

          if (deltaX >= 50) {
            $this.trigger("swipeLeft");
          }
          if (deltaX <= -50) {
            $this.trigger("swipeRight");
          }
          if (deltaY >= 50) {
            $this.trigger("swipeUp");
          }
          if (deltaY <= -50) {
            $this.trigger("swipeDown");
          }
          if (Math.abs(deltaX) >= 50 || Math.abs(deltaY) >= 50) {
            $this.unbind('touchmove', touchmove);
          }
        }
      }
    });
  };

  $.fn.onepage_scroll = function (options) {
    var settings = $.extend({}, defaults, options),
        el = $(this),
        sections = $(settings.sectionContainer);
    total = sections.length, status = "off", topPos = 0, leftPos = 0, lastAnimation = 0, quietPeriod = 500, paginationList = "";

    $.fn.transformPage = function (settings, pos, index) {
      if (typeof settings.beforeMove == 'function') settings.beforeMove(index);

      // Just a simple edit that makes use of modernizr to detect an IE8 browser and changes the transform method into
      // an top animate so IE8 users can also use this script.
      if ($('html').hasClass('ie8')) {
        if (settings.direction == 'horizontal') {
          var toppos = el.width() / 100 * pos;
          $(this).animate({ left: toppos + 'px' }, settings.animationTime);
        } else {
          var toppos = el.height() / 100 * pos;
          $(this).animate({ top: toppos + 'px' }, settings.animationTime);
        }
      } else {
        $(this).css({
          "-webkit-transform": settings.direction == 'horizontal' ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
          "-webkit-transition": "all " + settings.animationTime + "ms " + settings.easing,
          "-moz-transform": settings.direction == 'horizontal' ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
          "-moz-transition": "all " + settings.animationTime + "ms " + settings.easing,
          "-ms-transform": settings.direction == 'horizontal' ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
          "-ms-transition": "all " + settings.animationTime + "ms " + settings.easing,
          "transform": settings.direction == 'horizontal' ? "translate3d(" + pos + "%, 0, 0)" : "translate3d(0, " + pos + "%, 0)",
          "transition": "all " + settings.animationTime + "ms " + settings.easing
        });
      }
      $(this).one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
        if (typeof settings.afterMove == 'function') settings.afterMove(index);
      });
    };

    $.fn.moveDown = function () {
      var el = $(this);
      index = $(settings.sectionContainer + ".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index + 1) + "']");
      if (next.length < 1) {
        if (settings.loop == true) {
          pos = 0;
          next = $(settings.sectionContainer + "[data-index='1']");
        } else {
          return;
        }
      } else {
        pos = index * 100 * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
      current.removeClass("active");
      next.addClass("active");
      if (settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }

      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-" + next.data("index"));

      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index + 1);
        history.pushState({}, document.title, href);
      }
      el.transformPage(settings, pos, next.data("index"));
    };

    $.fn.moveUp = function () {
      var el = $(this);
      index = $(settings.sectionContainer + ".active").data("index");
      current = $(settings.sectionContainer + "[data-index='" + index + "']");
      next = $(settings.sectionContainer + "[data-index='" + (index - 1) + "']");

      if (next.length < 1) {
        if (settings.loop == true) {
          pos = (total - 1) * 100 * -1;
          next = $(settings.sectionContainer + "[data-index='" + total + "']");
        } else {
          return;
        }
      } else {
        pos = (next.data("index") - 1) * 100 * -1;
      }
      if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
      current.removeClass("active");
      next.addClass("active");
      if (settings.pagination == true) {
        $(".onepage-pagination li a" + "[data-index='" + index + "']").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + next.data("index") + "']").addClass("active");
      }
      $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
      $("body").addClass("viewing-page-" + next.data("index"));

      if (history.replaceState && settings.updateURL == true) {
        var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (index - 1);
        history.pushState({}, document.title, href);
      }
      el.transformPage(settings, pos, next.data("index"));
    };

    $.fn.moveTo = function (page_index) {
      current = $(settings.sectionContainer + ".active");
      next = $(settings.sectionContainer + "[data-index='" + page_index + "']");
      if (next.length > 0) {
        if (typeof settings.beforeMove == 'function') settings.beforeMove(next.data("index"));
        current.removeClass("active");
        next.addClass("active");
        $(".onepage-pagination li a" + ".active").removeClass("active");
        $(".onepage-pagination li a" + "[data-index='" + page_index + "']").addClass("active");
        $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
        $("body").addClass("viewing-page-" + next.data("index"));

        pos = (page_index - 1) * 100 * -1;

        if (history.replaceState && settings.updateURL == true) {
          var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + (page_index - 1);
          history.pushState({}, document.title, href);
        }
        el.transformPage(settings, pos, page_index);
      }
    };

    function responsive() {
      //start modification
      var valForTest = false;
      var typeOfRF = typeof settings.responsiveFallback;

      if (typeOfRF == "number") {
        valForTest = $(window).width() < settings.responsiveFallback;
      }
      if (typeOfRF == "boolean") {
        valForTest = settings.responsiveFallback;
      }
      if (typeOfRF == "function") {
        valFunction = settings.responsiveFallback();
        valForTest = valFunction;
        typeOFv = typeof valForTest;
        if (typeOFv == "number") {
          valForTest = $(window).width() < valFunction;
        }
      }

      //end modification
      if (valForTest) {
        $("body").addClass("disabled-onepage-scroll");
        $(document).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
        el.swipeEvents().unbind("swipeDown swipeUp");
      } else {
        if ($("body").hasClass("disabled-onepage-scroll")) {
          $("body").removeClass("disabled-onepage-scroll");
          $("html, body, .wrapper").animate({ scrollTop: 0 }, "fast");
        }

        el.swipeEvents().bind("swipeDown", function (event) {
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveUp();
        }).bind("swipeUp", function (event) {
          if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
          el.moveDown();
        });

        $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (event) {
          event.preventDefault();
          var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
          init_scroll(event, delta);
        });
      }
    }

    function init_scroll(event, delta) {
      deltaOfInterest = delta;
      var timeNow = new Date().getTime();
      // Cancel scroll if currently animating or within quiet period
      if (timeNow - lastAnimation < quietPeriod + settings.animationTime) {
        event.preventDefault();
        return;
      }

      if (deltaOfInterest < 0) {
        el.moveDown();
      } else {
        el.moveUp();
      }
      lastAnimation = timeNow;
    }

    // Prepare everything before binding wheel scroll

    el.addClass("onepage-wrapper").css("position", "relative");
    $.each(sections, function (i) {
      $(this).css({
        position: "absolute",
        top: topPos + "%"
      }).addClass("section").attr("data-index", i + 1);

      $(this).css({
        position: "absolute",
        left: settings.direction == 'horizontal' ? leftPos + "%" : 0,
        top: settings.direction == 'vertical' || settings.direction != 'horizontal' ? topPos + "%" : 0
      });

      if (settings.direction == 'horizontal') leftPos = leftPos + 100;else topPos = topPos + 100;

      if (settings.pagination == true) {
        paginationList += "<li><a data-index='" + (i + 1) + "' href='#" + (i + 1) + "'></a></li>";
      }
    });

    el.swipeEvents().bind("swipeDown", function (event) {
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveUp();
    }).bind("swipeUp", function (event) {
      if (!$("body").hasClass("disabled-onepage-scroll")) event.preventDefault();
      el.moveDown();
    });

    // Create Pagination and Display Them
    if (settings.pagination == true) {
      if ($('ul.onepage-pagination').length < 1) $("<ul class='onepage-pagination'></ul>").prependTo("body");

      if (settings.direction == 'horizontal') {
        posLeft = el.find(".onepage-pagination").width() / 2 * -1;
        el.find(".onepage-pagination").css("margin-left", posLeft);
      } else {
        posTop = el.find(".onepage-pagination").height() / 2 * -1;
        el.find(".onepage-pagination").css("margin-top", posTop);
      }
      $('ul.onepage-pagination').html(paginationList);
    }

    if (window.location.hash != "" && window.location.hash != "#1") {
      init_index = window.location.hash.replace("#", "");

      if (parseInt(init_index) <= total && parseInt(init_index) > 0) {
        $(settings.sectionContainer + "[data-index='" + init_index + "']").addClass("active");
        $("body").addClass("viewing-page-" + init_index);
        if (settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");

        next = $(settings.sectionContainer + "[data-index='" + init_index + "']");
        if (next) {
          next.addClass("active");
          if (settings.pagination == true) $(".onepage-pagination li a" + "[data-index='" + init_index + "']").addClass("active");
          $("body")[0].className = $("body")[0].className.replace(/\bviewing-page-\d.*?\b/g, '');
          $("body").addClass("viewing-page-" + next.data("index"));
          if (history.replaceState && settings.updateURL == true) {
            var href = window.location.href.substr(0, window.location.href.indexOf('#')) + "#" + init_index;
            history.pushState({}, document.title, href);
          }
        }
        pos = (init_index - 1) * 100 * -1;
        el.transformPage(settings, pos, init_index);
      } else {
        $(settings.sectionContainer + "[data-index='1']").addClass("active");
        $("body").addClass("viewing-page-1");
        if (settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
      }
    } else {
      $(settings.sectionContainer + "[data-index='1']").addClass("active");
      $("body").addClass("viewing-page-1");
      if (settings.pagination == true) $(".onepage-pagination li a" + "[data-index='1']").addClass("active");
    }

    if (settings.pagination == true) {
      $(".onepage-pagination li a").click(function () {
        var page_index = $(this).data("index");
        el.moveTo(page_index);
      });
    }

    $(document).bind('mousewheel DOMMouseScroll MozMousePixelScroll', function (event) {
      event.preventDefault();
      var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
      if (!$("body").hasClass("disabled-onepage-scroll")) init_scroll(event, delta);
    });

    if (settings.responsiveFallback != false) {
      $(window).resize(function () {
        responsive();
      });

      responsive();
    }

    if (settings.keyboard == true) {
      $(document).keydown(function (e) {
        var tag = e.target.tagName.toLowerCase();

        if (!$("body").hasClass("disabled-onepage-scroll")) {
          switch (e.which) {
            case 38:
              if (tag != 'input' && tag != 'textarea') el.moveUp();
              break;
            case 40:
              if (tag != 'input' && tag != 'textarea') el.moveDown();
              break;
            case 32:
              //spacebar
              if (tag != 'input' && tag != 'textarea') el.moveDown();
              break;
            case 33:
              //pageg up
              if (tag != 'input' && tag != 'textarea') el.moveUp();
              break;
            case 34:
              //page dwn
              if (tag != 'input' && tag != 'textarea') el.moveDown();
              break;
            case 36:
              //home
              el.moveTo(1);
              break;
            case 35:
              //end
              el.moveTo(total);
              break;
            default:
              return;
          }
        }
      });
    }
    return false;
  };
}(window.jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy90aGlyZC1wYXJ0eS9vbmVwYWdlLXNjcm9sbC9qcXVlcnkub25lcGFnZS1zY3JvbGwuanMiXSwibmFtZXMiOlsiJCIsImRlZmF1bHRzIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwia2V5Ym9hcmQiLCJiZWZvcmVNb3ZlIiwiYWZ0ZXJNb3ZlIiwibG9vcCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsImZuIiwic3dpcGVFdmVudHMiLCJlYWNoIiwic3RhcnRYIiwic3RhcnRZIiwiJHRoaXMiLCJiaW5kIiwidG91Y2hzdGFydCIsImV2ZW50IiwidG91Y2hlcyIsIm9yaWdpbmFsRXZlbnQiLCJsZW5ndGgiLCJwYWdlWCIsInBhZ2VZIiwidG91Y2htb3ZlIiwiZGVsdGFYIiwiZGVsdGFZIiwidHJpZ2dlciIsIk1hdGgiLCJhYnMiLCJ1bmJpbmQiLCJvbmVwYWdlX3Njcm9sbCIsIm9wdGlvbnMiLCJzZXR0aW5ncyIsImV4dGVuZCIsImVsIiwic2VjdGlvbnMiLCJ0b3RhbCIsInN0YXR1cyIsInRvcFBvcyIsImxlZnRQb3MiLCJsYXN0QW5pbWF0aW9uIiwicXVpZXRQZXJpb2QiLCJwYWdpbmF0aW9uTGlzdCIsInRyYW5zZm9ybVBhZ2UiLCJwb3MiLCJpbmRleCIsImhhc0NsYXNzIiwidG9wcG9zIiwid2lkdGgiLCJhbmltYXRlIiwibGVmdCIsImhlaWdodCIsInRvcCIsImNzcyIsIm9uZSIsImUiLCJtb3ZlRG93biIsImRhdGEiLCJjdXJyZW50IiwibmV4dCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJjbGFzc05hbWUiLCJyZXBsYWNlIiwiaGlzdG9yeSIsInJlcGxhY2VTdGF0ZSIsImhyZWYiLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInN1YnN0ciIsImluZGV4T2YiLCJwdXNoU3RhdGUiLCJkb2N1bWVudCIsInRpdGxlIiwibW92ZVVwIiwibW92ZVRvIiwicGFnZV9pbmRleCIsInJlc3BvbnNpdmUiLCJ2YWxGb3JUZXN0IiwidHlwZU9mUkYiLCJ2YWxGdW5jdGlvbiIsInR5cGVPRnYiLCJzY3JvbGxUb3AiLCJwcmV2ZW50RGVmYXVsdCIsImRlbHRhIiwid2hlZWxEZWx0YSIsImRldGFpbCIsImluaXRfc2Nyb2xsIiwiZGVsdGFPZkludGVyZXN0IiwidGltZU5vdyIsIkRhdGUiLCJnZXRUaW1lIiwiaSIsInBvc2l0aW9uIiwiYXR0ciIsInByZXBlbmRUbyIsInBvc0xlZnQiLCJmaW5kIiwicG9zVG9wIiwiaHRtbCIsImhhc2giLCJpbml0X2luZGV4IiwicGFyc2VJbnQiLCJjbGljayIsInJlc2l6ZSIsImtleWRvd24iLCJ0YWciLCJ0YXJnZXQiLCJ0YWdOYW1lIiwidG9Mb3dlckNhc2UiLCJ3aGljaCIsImpRdWVyeSJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQkEsQ0FBQyxVQUFTQSxDQUFULEVBQVc7O0FBRVYsTUFBSUMsV0FBVztBQUNiQyxzQkFBa0IsU0FETDtBQUViQyxZQUFRLE1BRks7QUFHYkMsbUJBQWUsSUFIRjtBQUliQyxnQkFBWSxJQUpDO0FBS2JDLGVBQVcsS0FMRTtBQU1iQyxjQUFVLElBTkc7QUFPYkMsZ0JBQVksSUFQQztBQVFiQyxlQUFXLElBUkU7QUFTYkMsVUFBTSxJQVRPO0FBVWJDLHdCQUFvQixLQVZQO0FBV2JDLGVBQVk7QUFYQyxHQUFmOztBQWNBO0FBQ0E7QUFDQTs7QUFFQVosSUFBRWEsRUFBRixDQUFLQyxXQUFMLEdBQW1CLFlBQVc7QUFDMUIsV0FBTyxLQUFLQyxJQUFMLENBQVUsWUFBVzs7QUFFMUIsVUFBSUMsTUFBSjtBQUFBLFVBQ0lDLE1BREo7QUFBQSxVQUVJQyxRQUFRbEIsRUFBRSxJQUFGLENBRlo7O0FBSUFrQixZQUFNQyxJQUFOLENBQVcsWUFBWCxFQUF5QkMsVUFBekI7O0FBRUEsZUFBU0EsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkI7QUFDekIsWUFBSUMsVUFBVUQs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aUJDLFdBQWpCLEVBQVY7O0FBRUEsWUFBSSxDQUFDakgsRUFBRSxNQUFGLEVBQVVrRCxRQUFWLENBQW1CLHlCQUFuQixDQUFMLEVBQW9EO0FBQ2xELGtCQUFPUyxFQUFFdUQsS0FBVDtBQUNFLGlCQUFLLEVBQUw7QUFDRSxrQkFBSUosT0FBTyxPQUFQLElBQWtCQSxPQUFPLFVBQTdCLEVBQXlDeEUsR0FBR3dDLE1BQUg7QUFDM0M7QUFDQSxpQkFBSyxFQUFMO0FBQ0Usa0JBQUlnQyxPQUFPLE9BQVAsSUFBa0JBLE9BQU8sVUFBN0IsRUFBeUN4RSxHQUFHc0IsUUFBSDtBQUMzQztBQUNBLGlCQUFLLEVBQUw7QUFBUztBQUNQLGtCQUFJa0QsT0FBTyxPQUFQLElBQWtCQSxPQUFPLFVBQTdCLEVBQXlDeEUsR0FBR3NCLFFBQUg7QUFDM0M7QUFDQSxpQkFBSyxFQUFMO0FBQVM7QUFDUCxrQkFBSWtELE9BQU8sT0FBUCxJQUFrQkEsT0FBTyxVQUE3QixFQUF5Q3hFLEdBQUd3QyxNQUFIO0FBQzNDO0FBQ0EsaUJBQUssRUFBTDtBQUFTO0FBQ1Asa0JBQUlnQyxPQUFPLE9BQVAsSUFBa0JBLE9BQU8sVUFBN0IsRUFBeUN4RSxHQUFHc0IsUUFBSDtBQUMzQztBQUNBLGlCQUFLLEVBQUw7QUFBUztBQUNQdEIsaUJBQUd5QyxNQUFILENBQVUsQ0FBVjtBQUNGO0FBQ0EsaUJBQUssRUFBTDtBQUFTO0FBQ1B6QyxpQkFBR3lDLE1BQUgsQ0FBVXZDLEtBQVY7QUFDRjtBQUNBO0FBQVM7QUF0Qlg7QUF3QkQ7QUFFRixPQTlCRDtBQStCRDtBQUNELFdBQU8sS0FBUDtBQUNELEdBcFZEO0FBdVZELENBelpBLENBeVpDK0IsT0FBTzRDLE1BelpSLENBQUQiLCJmaWxlIjoianF1ZXJ5Lm9uZXBhZ2Utc2Nyb2xsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAqIGpxdWVyeS1vbmVwYWdlLXNjcm9sbC5qcyB2MS4zLjFcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gKiBDb3B5cmlnaHQgMjAxMyBQZXRlIFJvandvbmdzdXJpeWEuXG4gKiBodHRwOi8vd3d3LnRoZXBldGVkZXNpZ24uY29tXG4gKlxuICogQ3JlYXRlIGFuIEFwcGxlLWxpa2Ugd2Vic2l0ZSB0aGF0IGxldCB1c2VyIHNjcm9sbFxuICogb25lIHBhZ2UgYXQgYSB0aW1lXG4gKlxuICogQ3JlZGl0OiBFaWtlIFNlbmQgZm9yIHRoZSBhd2Vzb21lIHN3aXBlIGV2ZW50XG4gKiBodHRwczovL2dpdGh1Yi5jb20vcGVhY2hhbmFuci9vbmVwYWdlLXNjcm9sbFxuICpcbiAqIExpY2Vuc2U6IEdQTCB2M1xuICpcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuIWZ1bmN0aW9uKCQpe1xuXG4gIHZhciBkZWZhdWx0cyA9IHtcbiAgICBzZWN0aW9uQ29udGFpbmVyOiBcInNlY3Rpb25cIixcbiAgICBlYXNpbmc6IFwiZWFzZVwiLFxuICAgIGFuaW1hdGlvblRpbWU6IDEwMDAsXG4gICAgcGFnaW5hdGlvbjogdHJ1ZSxcbiAgICB1cGRhdGVVUkw6IGZhbHNlLFxuICAgIGtleWJvYXJkOiB0cnVlLFxuICAgIGJlZm9yZU1vdmU6IG51bGwsXG4gICAgYWZ0ZXJNb3ZlOiBudWxsLFxuICAgIGxvb3A6IHRydWUsXG4gICAgcmVzcG9uc2l2ZUZhbGxiYWNrOiBmYWxzZSxcbiAgICBkaXJlY3Rpb24gOiAndmVydGljYWwnXG4gIH07XG5cbiAgLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xuICAvKiAgQ3JlZGl0OiBFaWtlIFNlbmQgZm9yIHRoZSBhd2Vzb21lIHN3aXBlIGV2ZW50ICovXG4gIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuICAkLmZuLnN3aXBlRXZlbnRzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzdGFydFgsXG4gICAgICAgICAgICBzdGFydFksXG4gICAgICAgICAgICAkdGhpcyA9ICQodGhpcyk7XG5cbiAgICAgICAgJHRoaXMuYmluZCgndG91Y2hzdGFydCcsIHRvdWNoc3RhcnQpO1xuXG4gICAgICAgIGZ1bmN0aW9uIHRvdWNoc3RhcnQoZXZlbnQpIHtcbiAgICAgICAgICB2YXIgdG91Y2hlcyA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQudG91Y2hlcztcbiAgICAgICAgICBpZiAodG91Y2hlcyAmJiB0b3VjaGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgc3RhcnRYID0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICAgIHN0YXJ0WSA9IHRvdWNoZXNbMF0ucGFnZVk7XG4gICAgICAgICAgICAkdGhpcy5iaW5kKCd0b3VjaG1vdmUnLCB0b3VjaG1vdmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvdWNobW92ZShldmVudCkge1xuICAgICAgICAgIHZhciB0b3VjaGVzID0gZXZlbnQub3JpZ2luYWxFdmVudC50b3VjaGVzO1xuICAgICAgICAgIGlmICh0b3VjaGVzICYmIHRvdWNoZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgZGVsdGFYID0gc3RhcnRYIC0gdG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICAgIHZhciBkZWx0YVkgPSBzdGFydFkgLSB0b3VjaGVzWzBdLnBhZ2VZO1xuXG4gICAgICAgICAgICBpZiAoZGVsdGFYID49IDUwKSB7XG4gICAgICAgICAgICAgICR0aGlzLnRyaWdnZXIoXCJzd2lwZUxlZnRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVsdGFYIDw9IC01MCkge1xuICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKFwic3dpcGVSaWdodFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChkZWx0YVkgPj0gNTApIHtcbiAgICAgICAgICAgICAgJHRoaXMudHJpZ2dlcihcInN3aXBlVXBcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZGVsdGFZIDw9IC01MCkge1xuICAgICAgICAgICAgICAkdGhpcy50cmlnZ2VyKFwic3dpcGVEb3duXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKGRlbHRhWCkgPj0gNTAgfHwgTWF0aC5hYnMoZGVsdGFZKSA+PSA1MCkge1xuICAgICAgICAgICAgICAkdGhpcy51bmJpbmQoJ3RvdWNobW92ZScsIHRvdWNobW92ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH07XG5cblxuICAkLmZuLm9uZXBhZ2Vfc2Nyb2xsID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgdmFyIHNldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBvcHRpb25zKSxcbiAgICAgICAgZWwgPSAkKHRoaXMpLFxuICAgICAgICBzZWN0aW9ucyA9ICQoc2V0dGluZ3Muc2VjdGlvbkNvbnRhaW5lcilcbiAgICAgICAgdG90YWwgPSBzZWN0aW9ucy5sZW5ndGgsXG4gICAgICAgIHN0YXR1cyA9IFwib2ZmXCIsXG4gICAgICAgIHRvcFBvcyA9IDAsXG4gICAgICAgIGxlZnRQb3MgPSAwLFxuICAgICAgICBsYXN0QW5pbWF0aW9uID0gMCxcbiAgICAgICAgcXVpZXRQZXJpb2QgPSA1MDAsXG4gICAgICAgIHBhZ2luYXRpb25MaXN0ID0gXCJcIjtcblxuICAgICQuZm4udHJhbnNmb3JtUGFnZSA9IGZ1bmN0aW9uKHNldHRpbmdzLCBwb3MsIGluZGV4KSB7XG4gICAgICBpZiAodHlwZW9mIHNldHRpbmdzLmJlZm9yZU1vdmUgPT0gJ2Z1bmN0aW9uJykgc2V0dGluZ3MuYmVmb3JlTW92ZShpbmRleCk7XG5cbiAgICAgIC8vIEp1c3QgYSBzaW1wbGUgZWRpdCB0aGF0IG1ha2VzIHVzZSBvZiBtb2Rlcm5penIgdG8gZGV0ZWN0IGFuIElFOCBicm93c2VyIGFuZCBjaGFuZ2VzIHRoZSB0cmFuc2Zvcm0gbWV0aG9kIGludG9cbiAgICAgIC8vIGFuIHRvcCBhbmltYXRlIHNvIElFOCB1c2VycyBjYW4gYWxzbyB1c2UgdGhpcyBzY3JpcHQuXG4gICAgICBpZigkKCdodG1sJykuaGFzQ2xhc3MoJ2llOCcpKXtcbiAgICAgICAgaWYgKHNldHRpbmdzLmRpcmVjdGlvbiA9PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICB2YXIgdG9wcG9zID0gKGVsLndpZHRoKCkvMTAwKSpwb3M7XG4gICAgICAgICAgJCh0aGlzKS5hbmltYXRlKHtsZWZ0OiB0b3Bwb3MrJ3B4J30sc2V0dGluZ3MuYW5pbWF0aW9uVGltZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRvcHBvcyA9IChlbC5oZWlnaHQoKS8xMDApKnBvcztcbiAgICAgICAgICAkKHRoaXMpLmFuaW1hdGUoe3RvcDogdG9wcG9zKydweCd9LHNldHRpbmdzLmFuaW1hdGlvblRpbWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2V7XG4gICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICBcIi13ZWJraXQtdHJhbnNmb3JtXCI6ICggc2V0dGluZ3MuZGlyZWN0aW9uID09ICdob3Jpem9udGFsJyApID8gXCJ0cmFuc2xhdGUzZChcIiArIHBvcyArIFwiJSwgMCwgMClcIiA6IFwidHJhbnNsYXRlM2QoMCwgXCIgKyBwb3MgKyBcIiUsIDApXCIsXG4gICAgICAgICBcIi13ZWJraXQtdHJhbnNpdGlvblwiOiBcImFsbCBcIiArIHNldHRpbmdzLmFuaW1hdGlvblRpbWUgKyBcIm1zIFwiICsgc2V0dGluZ3MuZWFzaW5nLFxuICAgICAgICAgXCItbW96LXRyYW5zZm9ybVwiOiAoIHNldHRpbmdzLmRpcmVjdGlvbiA9PSAnaG9yaXpvbnRhbCcgKSA/IFwidHJhbnNsYXRlM2QoXCIgKyBwb3MgKyBcIiUsIDAsIDApXCIgOiBcInRyYW5zbGF0ZTNkKDAsIFwiICsgcG9zICsgXCIlLCAwKVwiLFxuICAgICAgICAgXCItbW96LXRyYW5zaXRpb25cIjogXCJhbGwgXCIgKyBzZXR0aW5ncy5hbmltYXRpb25UaW1lICsgXCJtcyBcIiArIHNldHRpbmdzLmVhc2luZyxcbiAgICAgICAgIFwiLW1zLXRyYW5zZm9ybVwiOiAoIHNldHRpbmdzLmRpcmVjdGlvbiA9PSAnaG9yaXpvbnRhbCcgKSA/IFwidHJhbnNsYXRlM2QoXCIgKyBwb3MgKyBcIiUsIDAsIDApXCIgOiBcInRyYW5zbGF0ZTNkKDAsIFwiICsgcG9zICsgXCIlLCAwKVwiLFxuICAgICAgICAgXCItbXMtdHJhbnNpdGlvblwiOiBcImFsbCBcIiArIHNldHRpbmdzLmFuaW1hdGlvblRpbWUgKyBcIm1zIFwiICsgc2V0dGluZ3MuZWFzaW5nLFxuICAgICAgICAgXCJ0cmFuc2Zvcm1cIjogKCBzZXR0aW5ncy5kaXJlY3Rpb24gPT0gJ2hvcml6b250YWwnICkgPyBcInRyYW5zbGF0ZTNkKFwiICsgcG9zICsgXCIlLCAwLCAwKVwiIDogXCJ0cmFuc2xhdGUzZCgwLCBcIiArIHBvcyArIFwiJSwgMClcIixcbiAgICAgICAgIFwidHJhbnNpdGlvblwiOiBcImFsbCBcIiArIHNldHRpbmdzLmFuaW1hdGlvblRpbWUgKyBcIm1zIFwiICsgc2V0dGluZ3MuZWFzaW5nXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgJCh0aGlzKS5vbmUoJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MuYWZ0ZXJNb3ZlID09ICdmdW5jdGlvbicpIHNldHRpbmdzLmFmdGVyTW92ZShpbmRleCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAkLmZuLm1vdmVEb3duID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwgPSAkKHRoaXMpXG4gICAgICBpbmRleCA9ICQoc2V0dGluZ3Muc2VjdGlvbkNvbnRhaW5lciArXCIuYWN0aXZlXCIpLmRhdGEoXCJpbmRleFwiKTtcbiAgICAgIGN1cnJlbnQgPSAkKHNldHRpbmdzLnNlY3Rpb25Db250YWluZXIgKyBcIltkYXRhLWluZGV4PSdcIiArIGluZGV4ICsgXCInXVwiKTtcbiAgICAgIG5leHQgPSAkKHNldHRpbmdzLnNlY3Rpb25Db250YWluZXIgKyBcIltkYXRhLWluZGV4PSdcIiArIChpbmRleCArIDEpICsgXCInXVwiKTtcbiAgICAgIGlmKG5leHQubGVuZ3RoIDwgMSkge1xuICAgICAgICBpZiAoc2V0dGluZ3MubG9vcCA9PSB0cnVlKSB7XG4gICAgICAgICAgcG9zID0gMDtcbiAgICAgICAgICBuZXh0ID0gJChzZXR0aW5ncy5zZWN0aW9uQ29udGFpbmVyICsgXCJbZGF0YS1pbmRleD0nMSddXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcG9zID0gKGluZGV4ICogMTAwKSAqIC0xO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5iZWZvcmVNb3ZlID09ICdmdW5jdGlvbicpIHNldHRpbmdzLmJlZm9yZU1vdmUoIG5leHQuZGF0YShcImluZGV4XCIpKTtcbiAgICAgIGN1cnJlbnQucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIilcbiAgICAgIG5leHQuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICBpZihzZXR0aW5ncy5wYWdpbmF0aW9uID09IHRydWUpIHtcbiAgICAgICAgJChcIi5vbmVwYWdlLXBhZ2luYXRpb24gbGkgYVwiICsgXCJbZGF0YS1pbmRleD0nXCIgKyBpbmRleCArIFwiJ11cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICQoXCIub25lcGFnZS1wYWdpbmF0aW9uIGxpIGFcIiArIFwiW2RhdGEtaW5kZXg9J1wiICsgbmV4dC5kYXRhKFwiaW5kZXhcIikgKyBcIiddXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgfVxuXG4gICAgICAkKFwiYm9keVwiKVswXS5jbGFzc05hbWUgPSAkKFwiYm9keVwiKVswXS5jbGFzc05hbWUucmVwbGFjZSgvXFxidmlld2luZy1wYWdlLVxcZC4qP1xcYi9nLCAnJyk7XG4gICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInZpZXdpbmctcGFnZS1cIituZXh0LmRhdGEoXCJpbmRleFwiKSlcblxuICAgICAgaWYgKGhpc3RvcnkucmVwbGFjZVN0YXRlICYmIHNldHRpbmdzLnVwZGF0ZVVSTCA9PSB0cnVlKSB7XG4gICAgICAgIHZhciBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3Vic3RyKDAsd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignIycpKSArIFwiI1wiICsgKGluZGV4ICsgMSk7XG4gICAgICAgIGhpc3RvcnkucHVzaFN0YXRlKCB7fSwgZG9jdW1lbnQudGl0bGUsIGhyZWYgKTtcbiAgICAgIH1cbiAgICAgIGVsLnRyYW5zZm9ybVBhZ2Uoc2V0dGluZ3MsIHBvcywgbmV4dC5kYXRhKFwiaW5kZXhcIikpO1xuICAgIH1cblxuICAgICQuZm4ubW92ZVVwID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZWwgPSAkKHRoaXMpXG4gICAgICBpbmRleCA9ICQoc2V0dGluZ3Muc2VjdGlvbkNvbnRhaW5lciArXCIuYWN0aXZlXCIpLmRhdGEoXCJpbmRleFwiKTtcbiAgICAgIGN1cnJlbnQgPSAkKHNldHRpbmdzLnNlY3Rpb25Db250YWluZXIgKyBcIltkYXRhLWluZGV4PSdcIiArIGluZGV4ICsgXCInXVwiKTtcbiAgICAgIG5leHQgPSAkKHNldHRpbmdzLnNlY3Rpb25Db250YWluZXIgKyBcIltkYXRhLWluZGV4PSdcIiArIChpbmRleCAtIDEpICsgXCInXVwiKTtcblxuICAgICAgaWYobmV4dC5sZW5ndGggPCAxKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy5sb29wID09IHRydWUpIHtcbiAgICAgICAgICBwb3MgPSAoKHRvdGFsIC0gMSkgKiAxMDApICogLTE7XG4gICAgICAgICAgbmV4dCA9ICQoc2V0dGluZ3Muc2VjdGlvbkNvbnRhaW5lciArIFwiW2RhdGEtaW5kZXg9J1wiK3RvdGFsK1wiJ11cIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgIH1lbHNlIHtcbiAgICAgICAgcG9zID0gKChuZXh0LmRhdGEoXCJpbmRleFwiKSAtIDEpICogMTAwKSAqIC0xO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBzZXR0aW5ncy5iZWZvcmVNb3ZlID09ICdmdW5jdGlvbicpIHNldHRpbmdzLmJlZm9yZU1vdmUobmV4dC5kYXRhKFwiaW5kZXhcIikpO1xuICAgICAgY3VycmVudC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKVxuICAgICAgbmV4dC5hZGRDbGFzcyhcImFjdGl2ZVwiKVxuICAgICAgaWYoc2V0dGluZ3MucGFnaW5hdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgICQoXCIub25lcGFnZS1wYWdpbmF0aW9uIGxpIGFcIiArIFwiW2RhdGEtaW5kZXg9J1wiICsgaW5kZXggKyBcIiddXCIpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAkKFwiLm9uZXBhZ2UtcGFnaW5hdGlvbiBsaSBhXCIgKyBcIltkYXRhLWluZGV4PSdcIiArIG5leHQuZGF0YShcImluZGV4XCIpICsgXCInXVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICAgICQoXCJib2R5XCIpWzBdLmNsYXNzTmFtZSA9ICQoXCJib2R5XCIpWzBdLmNsYXNzTmFtZS5yZXBsYWNlKC9cXGJ2aWV3aW5nLXBhZ2UtXFxkLio/XFxiL2csICcnKTtcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwidmlld2luZy1wYWdlLVwiK25leHQuZGF0YShcImluZGV4XCIpKVxuXG4gICAgICBpZiAoaGlzdG9yeS5yZXBsYWNlU3RhdGUgJiYgc2V0dGluZ3MudXBkYXRlVVJMID09IHRydWUpIHtcbiAgICAgICAgdmFyIGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIoMCx3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcjJykpICsgXCIjXCIgKyAoaW5kZXggLSAxKTtcbiAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCBkb2N1bWVudC50aXRsZSwgaHJlZiApO1xuICAgICAgfVxuICAgICAgZWwudHJhbnNmb3JtUGFnZShzZXR0aW5ncywgcG9zLCBuZXh0LmRhdGEoXCJpbmRleFwiKSk7XG4gICAgfVxuXG4gICAgJC5mbi5tb3ZlVG8gPSBmdW5jdGlvbihwYWdlX2luZGV4KSB7XG4gICAgICBjdXJyZW50ID0gJChzZXR0aW5ncy5zZWN0aW9uQ29udGFpbmVyICsgXCIuYWN0aXZlXCIpXG4gICAgICBuZXh0ID0gJChzZXR0aW5ncy5zZWN0aW9uQ29udGFpbmVyICsgXCJbZGF0YS1pbmRleD0nXCIgKyAocGFnZV9pbmRleCkgKyBcIiddXCIpO1xuICAgICAgaWYobmV4dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2V0dGluZ3MuYmVmb3JlTW92ZSA9PSAnZnVuY3Rpb24nKSBzZXR0aW5ncy5iZWZvcmVNb3ZlKG5leHQuZGF0YShcImluZGV4XCIpKTtcbiAgICAgICAgY3VycmVudC5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKVxuICAgICAgICBuZXh0LmFkZENsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICQoXCIub25lcGFnZS1wYWdpbmF0aW9uIGxpIGFcIiArIFwiLmFjdGl2ZVwiKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgJChcIi5vbmVwYWdlLXBhZ2luYXRpb24gbGkgYVwiICsgXCJbZGF0YS1pbmRleD0nXCIgKyAocGFnZV9pbmRleCkgKyBcIiddXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAkKFwiYm9keVwiKVswXS5jbGFzc05hbWUgPSAkKFwiYm9keVwiKVswXS5jbGFzc05hbWUucmVwbGFjZSgvXFxidmlld2luZy1wYWdlLVxcZC4qP1xcYi9nLCAnJyk7XG4gICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwidmlld2luZy1wYWdlLVwiK25leHQuZGF0YShcImluZGV4XCIpKVxuXG4gICAgICAgIHBvcyA9ICgocGFnZV9pbmRleCAtIDEpICogMTAwKSAqIC0xO1xuXG4gICAgICAgIGlmIChoaXN0b3J5LnJlcGxhY2VTdGF0ZSAmJiBzZXR0aW5ncy51cGRhdGVVUkwgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIoMCx3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcjJykpICsgXCIjXCIgKyAocGFnZV9pbmRleCAtIDEpO1xuICAgICAgICAgICAgaGlzdG9yeS5wdXNoU3RhdGUoIHt9LCBkb2N1bWVudC50aXRsZSwgaHJlZiApO1xuICAgICAgICB9XG4gICAgICAgIGVsLnRyYW5zZm9ybVBhZ2Uoc2V0dGluZ3MsIHBvcywgcGFnZV9pbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzcG9uc2l2ZSgpIHtcbiAgICAgIC8vc3RhcnQgbW9kaWZpY2F0aW9uXG4gICAgICB2YXIgdmFsRm9yVGVzdCA9IGZhbHNlO1xuICAgICAgdmFyIHR5cGVPZlJGID0gdHlwZW9mIHNldHRpbmdzLnJlc3BvbnNpdmVGYWxsYmFja1xuXG4gICAgICBpZih0eXBlT2ZSRiA9PSBcIm51bWJlclwiKXtcbiAgICAgICAgdmFsRm9yVGVzdCA9ICQod2luZG93KS53aWR0aCgpIDwgc2V0dGluZ3MucmVzcG9uc2l2ZUZhbGxiYWNrO1xuICAgICAgfVxuICAgICAgaWYodHlwZU9mUkYgPT0gXCJib29sZWFuXCIpe1xuICAgICAgICB2YWxGb3JUZXN0ID0gc2V0dGluZ3MucmVzcG9uc2l2ZUZhbGxiYWNrO1xuICAgICAgfVxuICAgICAgaWYodHlwZU9mUkYgPT0gXCJmdW5jdGlvblwiKXtcbiAgICAgICAgdmFsRnVuY3Rpb24gPSBzZXR0aW5ncy5yZXNwb25zaXZlRmFsbGJhY2soKTtcbiAgICAgICAgdmFsRm9yVGVzdCA9IHZhbEZ1bmN0aW9uO1xuICAgICAgICB0eXBlT0Z2ID0gdHlwZW9mIHZhbEZvclRlc3Q7XG4gICAgICAgIGlmKHR5cGVPRnYgPT0gXCJudW1iZXJcIil7XG4gICAgICAgICAgdmFsRm9yVGVzdCA9ICQod2luZG93KS53aWR0aCgpIDwgdmFsRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy9lbmQgbW9kaWZpY2F0aW9uXG4gICAgICBpZiAodmFsRm9yVGVzdCkge1xuICAgICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcImRpc2FibGVkLW9uZXBhZ2Utc2Nyb2xsXCIpO1xuICAgICAgICAkKGRvY3VtZW50KS51bmJpbmQoJ21vdXNld2hlZWwgRE9NTW91c2VTY3JvbGwgTW96TW91c2VQaXhlbFNjcm9sbCcpO1xuICAgICAgICBlbC5zd2lwZUV2ZW50cygpLnVuYmluZChcInN3aXBlRG93biBzd2lwZVVwXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoJChcImJvZHlcIikuaGFzQ2xhc3MoXCJkaXNhYmxlZC1vbmVwYWdlLXNjcm9sbFwiKSkge1xuICAgICAgICAgICQoXCJib2R5XCIpLnJlbW92ZUNsYXNzKFwiZGlzYWJsZWQtb25lcGFnZS1zY3JvbGxcIik7XG4gICAgICAgICAgJChcImh0bWwsIGJvZHksIC53cmFwcGVyXCIpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IDAgfSwgXCJmYXN0XCIpO1xuICAgICAgICB9XG5cblxuICAgICAgICBlbC5zd2lwZUV2ZW50cygpLmJpbmQoXCJzd2lwZURvd25cIiwgIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICBpZiAoISQoXCJib2R5XCIpLmhhc0NsYXNzKFwiZGlzYWJsZWQtb25lcGFnZS1zY3JvbGxcIikpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZWwubW92ZVVwKCk7XG4gICAgICAgIH0pLmJpbmQoXCJzd2lwZVVwXCIsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICBpZiAoISQoXCJib2R5XCIpLmhhc0NsYXNzKFwiZGlzYWJsZWQtb25lcGFnZS1zY3JvbGxcIikpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZWwubW92ZURvd24oKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkuYmluZCgnbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCBNb3pNb3VzZVBpeGVsU2Nyb2xsJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHZhciBkZWx0YSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSB8fCAtZXZlbnQub3JpZ2luYWxFdmVudC5kZXRhaWw7XG4gICAgICAgICAgaW5pdF9zY3JvbGwoZXZlbnQsIGRlbHRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBpbml0X3Njcm9sbChldmVudCwgZGVsdGEpIHtcbiAgICAgICAgZGVsdGFPZkludGVyZXN0ID0gZGVsdGE7XG4gICAgICAgIHZhciB0aW1lTm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgIC8vIENhbmNlbCBzY3JvbGwgaWYgY3VycmVudGx5IGFuaW1hdGluZyBvciB3aXRoaW4gcXVpZXQgcGVyaW9kXG4gICAgICAgIGlmKHRpbWVOb3cgLSBsYXN0QW5pbWF0aW9uIDwgcXVpZXRQZXJpb2QgKyBzZXR0aW5ncy5hbmltYXRpb25UaW1lKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlbHRhT2ZJbnRlcmVzdCA8IDApIHtcbiAgICAgICAgICBlbC5tb3ZlRG93bigpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWwubW92ZVVwKClcbiAgICAgICAgfVxuICAgICAgICBsYXN0QW5pbWF0aW9uID0gdGltZU5vdztcbiAgICB9XG5cbiAgICAvLyBQcmVwYXJlIGV2ZXJ5dGhpbmcgYmVmb3JlIGJpbmRpbmcgd2hlZWwgc2Nyb2xsXG5cbiAgICBlbC5hZGRDbGFzcyhcIm9uZXBhZ2Utd3JhcHBlclwiKS5jc3MoXCJwb3NpdGlvblwiLFwicmVsYXRpdmVcIik7XG4gICAgJC5lYWNoKCBzZWN0aW9ucywgZnVuY3Rpb24oaSkge1xuICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxuICAgICAgICB0b3A6IHRvcFBvcyArIFwiJVwiXG4gICAgICB9KS5hZGRDbGFzcyhcInNlY3Rpb25cIikuYXR0cihcImRhdGEtaW5kZXhcIiwgaSsxKTtcblxuXG4gICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gICAgICAgIGxlZnQ6ICggc2V0dGluZ3MuZGlyZWN0aW9uID09ICdob3Jpem9udGFsJyApXG4gICAgICAgICAgPyBsZWZ0UG9zICsgXCIlXCJcbiAgICAgICAgICA6IDAsXG4gICAgICAgIHRvcDogKCBzZXR0aW5ncy5kaXJlY3Rpb24gPT0gJ3ZlcnRpY2FsJyB8fCBzZXR0aW5ncy5kaXJlY3Rpb24gIT0gJ2hvcml6b250YWwnIClcbiAgICAgICAgICA/IHRvcFBvcyArIFwiJVwiXG4gICAgICAgICAgOiAwXG4gICAgICB9KTtcblxuICAgICAgaWYgKHNldHRpbmdzLmRpcmVjdGlvbiA9PSAnaG9yaXpvbnRhbCcpXG4gICAgICAgIGxlZnRQb3MgPSBsZWZ0UG9zICsgMTAwO1xuICAgICAgZWxzZVxuICAgICAgICB0b3BQb3MgPSB0b3BQb3MgKyAxMDA7XG5cblxuICAgICAgaWYoc2V0dGluZ3MucGFnaW5hdGlvbiA9PSB0cnVlKSB7XG4gICAgICAgIHBhZ2luYXRpb25MaXN0ICs9IFwiPGxpPjxhIGRhdGEtaW5kZXg9J1wiKyhpKzEpK1wiJyBocmVmPScjXCIgKyAoaSsxKSArIFwiJz48L2E+PC9saT5cIlxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZWwuc3dpcGVFdmVudHMoKS5iaW5kKFwic3dpcGVEb3duXCIsICBmdW5jdGlvbihldmVudCl7XG4gICAgICBpZiAoISQoXCJib2R5XCIpLmhhc0NsYXNzKFwiZGlzYWJsZWQtb25lcGFnZS1zY3JvbGxcIikpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlbC5tb3ZlVXAoKTtcbiAgICB9KS5iaW5kKFwic3dpcGVVcFwiLCBmdW5jdGlvbihldmVudCl7XG4gICAgICBpZiAoISQoXCJib2R5XCIpLmhhc0NsYXNzKFwiZGlzYWJsZWQtb25lcGFnZS1zY3JvbGxcIikpIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBlbC5tb3ZlRG93bigpO1xuICAgIH0pO1xuXG4gICAgLy8gQ3JlYXRlIFBhZ2luYXRpb24gYW5kIERpc3BsYXkgVGhlbVxuICAgIGlmIChzZXR0aW5ncy5wYWdpbmF0aW9uID09IHRydWUpIHtcbiAgICAgIGlmICgkKCd1bC5vbmVwYWdlLXBhZ2luYXRpb24nKS5sZW5ndGggPCAxKSAkKFwiPHVsIGNsYXNzPSdvbmVwYWdlLXBhZ2luYXRpb24nPjwvdWw+XCIpLnByZXBlbmRUbyhcImJvZHlcIik7XG5cbiAgICAgIGlmKCBzZXR0aW5ncy5kaXJlY3Rpb24gPT0gJ2hvcml6b250YWwnICkge1xuICAgICAgICBwb3NMZWZ0ID0gKGVsLmZpbmQoXCIub25lcGFnZS1wYWdpbmF0aW9uXCIpLndpZHRoKCkgLyAyKSAqIC0xO1xuICAgICAgICBlbC5maW5kKFwiLm9uZXBhZ2UtcGFnaW5hdGlvblwiKS5jc3MoXCJtYXJnaW4tbGVmdFwiLCBwb3NMZWZ0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBvc1RvcCA9IChlbC5maW5kKFwiLm9uZXBhZ2UtcGFnaW5hdGlvblwiKS5oZWlnaHQoKSAvIDIpICogLTE7XG4gICAgICAgIGVsLmZpbmQoXCIub25lcGFnZS1wYWdpbmF0aW9uXCIpLmNzcyhcIm1hcmdpbi10b3BcIiwgcG9zVG9wKTtcbiAgICAgIH1cbiAgICAgICQoJ3VsLm9uZXBhZ2UtcGFnaW5hdGlvbicpLmh0bWwocGFnaW5hdGlvbkxpc3QpO1xuICAgIH1cblxuICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoICE9IFwiXCIgJiYgd2luZG93LmxvY2F0aW9uLmhhc2ggIT0gXCIjMVwiKSB7XG4gICAgICBpbml0X2luZGV4ID0gIHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UoXCIjXCIsIFwiXCIpXG5cbiAgICAgIGlmIChwYXJzZUludChpbml0X2luZGV4KSA8PSB0b3RhbCAmJiBwYXJzZUludChpbml0X2luZGV4KSA+IDApIHtcbiAgICAgICAgJChzZXR0aW5ncy5zZWN0aW9uQ29udGFpbmVyICsgXCJbZGF0YS1pbmRleD0nXCIgKyBpbml0X2luZGV4ICsgXCInXVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKVxuICAgICAgICAkKFwiYm9keVwiKS5hZGRDbGFzcyhcInZpZXdpbmctcGFnZS1cIisgaW5pdF9pbmRleClcbiAgICAgICAgaWYoc2V0dGluZ3MucGFnaW5hdGlvbiA9PSB0cnVlKSAkKFwiLm9uZXBhZ2UtcGFnaW5hdGlvbiBsaSBhXCIgKyBcIltkYXRhLWluZGV4PSdcIiArIGluaXRfaW5kZXggKyBcIiddXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuXG4gICAgICAgIG5leHQgPSAkKHNldHRpbmdzLnNlY3Rpb25Db250YWluZXIgKyBcIltkYXRhLWluZGV4PSdcIiArIChpbml0X2luZGV4KSArIFwiJ11cIik7XG4gICAgICAgIGlmKG5leHQpIHtcbiAgICAgICAgICBuZXh0LmFkZENsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICAgaWYoc2V0dGluZ3MucGFnaW5hdGlvbiA9PSB0cnVlKSAkKFwiLm9uZXBhZ2UtcGFnaW5hdGlvbiBsaSBhXCIgKyBcIltkYXRhLWluZGV4PSdcIiArIChpbml0X2luZGV4KSArIFwiJ11cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgJChcImJvZHlcIilbMF0uY2xhc3NOYW1lID0gJChcImJvZHlcIilbMF0uY2xhc3NOYW1lLnJlcGxhY2UoL1xcYnZpZXdpbmctcGFnZS1cXGQuKj9cXGIvZywgJycpO1xuICAgICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwidmlld2luZy1wYWdlLVwiK25leHQuZGF0YShcImluZGV4XCIpKVxuICAgICAgICAgIGlmIChoaXN0b3J5LnJlcGxhY2VTdGF0ZSAmJiBzZXR0aW5ncy51cGRhdGVVUkwgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGhyZWYgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIoMCx3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcjJykpICsgXCIjXCIgKyAoaW5pdF9pbmRleCk7XG4gICAgICAgICAgICBoaXN0b3J5LnB1c2hTdGF0ZSgge30sIGRvY3VtZW50LnRpdGxlLCBocmVmICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHBvcyA9ICgoaW5pdF9pbmRleCAtIDEpICogMTAwKSAqIC0xO1xuICAgICAgICBlbC50cmFuc2Zvcm1QYWdlKHNldHRpbmdzLCBwb3MsIGluaXRfaW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChzZXR0aW5ncy5zZWN0aW9uQ29udGFpbmVyICsgXCJbZGF0YS1pbmRleD0nMSddXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpXG4gICAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwidmlld2luZy1wYWdlLTFcIilcbiAgICAgICAgaWYoc2V0dGluZ3MucGFnaW5hdGlvbiA9PSB0cnVlKSAkKFwiLm9uZXBhZ2UtcGFnaW5hdGlvbiBsaSBhXCIgKyBcIltkYXRhLWluZGV4PScxJ11cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgfWVsc2V7XG4gICAgICAkKHNldHRpbmdzLnNlY3Rpb25Db250YWluZXIgKyBcIltkYXRhLWluZGV4PScxJ11cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIilcbiAgICAgICQoXCJib2R5XCIpLmFkZENsYXNzKFwidmlld2luZy1wYWdlLTFcIilcbiAgICAgIGlmKHNldHRpbmdzLnBhZ2luYXRpb24gPT0gdHJ1ZSkgJChcIi5vbmVwYWdlLXBhZ2luYXRpb24gbGkgYVwiICsgXCJbZGF0YS1pbmRleD0nMSddXCIpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgIH1cblxuICAgIGlmKHNldHRpbmdzLnBhZ2luYXRpb24gPT0gdHJ1ZSkgIHtcbiAgICAgICQoXCIub25lcGFnZS1wYWdpbmF0aW9uIGxpIGFcIikuY2xpY2soZnVuY3Rpb24gKCl7XG4gICAgICAgIHZhciBwYWdlX2luZGV4ID0gJCh0aGlzKS5kYXRhKFwiaW5kZXhcIik7XG4gICAgICAgIGVsLm1vdmVUbyhwYWdlX2luZGV4KTtcbiAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgJChkb2N1bWVudCkuYmluZCgnbW91c2V3aGVlbCBET01Nb3VzZVNjcm9sbCBNb3pNb3VzZVBpeGVsU2Nyb2xsJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgZGVsdGEgPSBldmVudC5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEgfHwgLWV2ZW50Lm9yaWdpbmFsRXZlbnQuZGV0YWlsO1xuICAgICAgaWYoISQoXCJib2R5XCIpLmhhc0NsYXNzKFwiZGlzYWJsZWQtb25lcGFnZS1zY3JvbGxcIikpIGluaXRfc2Nyb2xsKGV2ZW50LCBkZWx0YSk7XG4gICAgfSk7XG5cblxuICAgIGlmKHNldHRpbmdzLnJlc3BvbnNpdmVGYWxsYmFjayAhPSBmYWxzZSkge1xuICAgICAgJCh3aW5kb3cpLnJlc2l6ZShmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzcG9uc2l2ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHJlc3BvbnNpdmUoKTtcbiAgICB9XG5cbiAgICBpZihzZXR0aW5ncy5rZXlib2FyZCA9PSB0cnVlKSB7XG4gICAgICAkKGRvY3VtZW50KS5rZXlkb3duKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIHRhZyA9IGUudGFyZ2V0LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcblxuICAgICAgICBpZiAoISQoXCJib2R5XCIpLmhhc0NsYXNzKFwiZGlzYWJsZWQtb25lcGFnZS1zY3JvbGxcIikpIHtcbiAgICAgICAgICBzd2l0Y2goZS53aGljaCkge1xuICAgICAgICAgICAgY2FzZSAzODpcbiAgICAgICAgICAgICAgaWYgKHRhZyAhPSAnaW5wdXQnICYmIHRhZyAhPSAndGV4dGFyZWEnKSBlbC5tb3ZlVXAoKVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDQwOlxuICAgICAgICAgICAgICBpZiAodGFnICE9ICdpbnB1dCcgJiYgdGFnICE9ICd0ZXh0YXJlYScpIGVsLm1vdmVEb3duKClcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzMjogLy9zcGFjZWJhclxuICAgICAgICAgICAgICBpZiAodGFnICE9ICdpbnB1dCcgJiYgdGFnICE9ICd0ZXh0YXJlYScpIGVsLm1vdmVEb3duKClcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzMzogLy9wYWdlZyB1cFxuICAgICAgICAgICAgICBpZiAodGFnICE9ICdpbnB1dCcgJiYgdGFnICE9ICd0ZXh0YXJlYScpIGVsLm1vdmVVcCgpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzQ6IC8vcGFnZSBkd25cbiAgICAgICAgICAgICAgaWYgKHRhZyAhPSAnaW5wdXQnICYmIHRhZyAhPSAndGV4dGFyZWEnKSBlbC5tb3ZlRG93bigpXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzY6IC8vaG9tZVxuICAgICAgICAgICAgICBlbC5tb3ZlVG8oMSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMzU6IC8vZW5kXG4gICAgICAgICAgICAgIGVsLm1vdmVUbyh0b3RhbCk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG5cbn0od2luZG93LmpRdWVyeSk7XG4iXX0=