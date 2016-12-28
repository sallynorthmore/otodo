var app = {

	'init': function init() {
		this.menu();
		this.expander();
		this.overlay();

		// Initialise scroll on desktop & add CSS
		if ($('html').hasClass('desktop')) {
			// initialise carousel & history components
			this.carousel();
			this.history();
			this.snapTo();
			this.hubAnimation();
		}
	},

	'hubAnimation': function hubAnimation() {
		var $section = $('[data-panel="2"]'),
		    $house = $('[data-js="house"]');

		$section.on("mousemove", function (event) {
			// detect mouse x
			if (event.pageX < 510) {
				$house.addClass("is-right");
				$house.removeClass("is-left");
			} else {
				$house.removeClass("is-right");
				$house.addClass("is-left");
			}
		});
	},

	'carousel': function carousel() {
		var $carousel = $('[data-js="carousel"]'),
		    $carouselNav = $('[data-js="carousel-nav"]');

		$carousel.slick({
			arrows: false,
			responsive: [{
				breakpoint: 860,
				settings: "unslick"
			}]
		});

		// Make slides respond to nav
		$carouselNav.children().on('click', function () {
			var index = $(this).index();

			$carouselNav.children().removeClass('is-active');
			$(this).addClass('is-active');
			$carousel.slick('slickGoTo', index);
		});

		// Make slick reinit when browser size increased & it isn't already initialized
		window.onresize = function () {

			if (window.innerWidth >= 860 && !$carousel.hasClass('slick-initialized')) {

				// Destroy and reinit slick
				$carousel.slick('unslick');

				$carousel.slick({
					arrows: false,
					responsive: [{
						breakpoint: 860,
						settings: "unslick"
					}]
				});
			}
		};
	},

	'expander': function expander() {
		var $item = $('[data-js="expander"]'),
		    $trigger = $item.find('[data-js="expanderTrigger"]'),
		    $content = $item.find('[data-js="expanderContent"]');

		$trigger.on('click', function () {
			$(this).parent().toggleClass("is-expanded");
		});
	},

	'history': function history() {
		var $history = $('[data-js="history-items"]'),
		    $historyItem = $('[data-js="history-item"]');

		$history.children().addClass('is-small');

		$historyItem.on('click mouseenter', function () {
			if (!$(this).hasClass('is-large')) {
				$history.children().removeClass('is-large');
				$(this).addClass('is-large');
			}
		});
	},

	'overlay': function overlay() {
		var $page = $('[data-js="page"]'),
		    $overlay = $('[data-js="overlay"]'),
		    $overlayTrigger = $('[data-js="overlayTrigger"]'),
		    $overlayClose = $('[data-js="closeOverlay"]'),
		    $overlayCarousel = $('[data-js="overlay-carousel"]');

		$overlayTrigger.on('click', function () {
			var overlayNumber = $(this).attr('data-overlay');
			$('[data-overlaynumber=' + overlayNumber + ']').addClass('is-active');
			$page.addClass('is-overlay');

			// Init carousel if it has one
			if ($('[data-overlaynumber=' + overlayNumber + ']').hasClass('is-carousel')) {
				$overlayCarousel.slick({
					arrows: true,
					dots: true,
					responsive: [{
						breakpoint: 860,
						settings: {
							arrows: false,
							dots: true
						}
					}]
				});

				// On before slide change
				$overlayCarousel.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
					if (nextSlide == 1) {
						$(this).parents('.Overlay-inner').addClass('is-second');
					} else {
						$(this).parents('.Overlay-inner').removeClass('is-second');
					}
				});
			}
		});

		$overlayClose.on('click', function () {
			$overlay.removeClass('is-active');
			$page.removeClass('is-overlay');
		});
	},

	'menu': function menu() {
		var button = $('[data-js="navbutton"]'),
		    page = $('[data-js="page"]'),
		    link = $('[data-js="navlink"]'),
		    open = false;

		button.on('click', function () {
			if (open) {
				page.removeClass("has-nav");
				open = false;
			} else {
				page.addClass("has-nav");
				open = true;
			}
		});

		link.on('click', function () {
			link.removeClass("is-active");
			$(this).addClass("is-active");
			page.removeClass("has-nav");
			open = false;
		});
	},

	'scrollTo': function scrollTo() {
		var $container = $('[data-js="scroll"]'),
		    $navLink = $('[data-js="navlink"]'),
		    header = $('[data-js="header"]'),
		    headerClass = $('[data-js="header"]').attr("class");

		/* Slide to section on nav link click */
		$navLink.on('click', function (event) {
			event.preventDefault();
			var index = $(this).data('section'),
			    section = "#section0" + index;

			// $container.moveTo(section);
			$(window).scrollTo(section, 500, {
				onAfter: function () {
					/* Update nav link class when section active */
					$('[data-js="navlink"]').removeClass('is-active');
					$('[data-section="' + index + '"]').addClass('is-active');
					header.attr('class', headerClass);

					/* Update nav container class when section active */
					var curClass = headerClass + " is-" + index;
					header.attr('class', curClass);
				}
			});
		});

		/* Continue button */
		$('[data-js="continue"]').on('click', function (event) {
			event.preventDefault();

			$(window).scrollTo("#section02", 500, {
				onAfter: function () {
					/* Update nav link class when section active */
					$('[data-js="navlink"]').removeClass('is-active');
					$('[data-section="' + index + '"]').addClass('is-active');
					header.attr('class', headerClass);

					/* Update nav container class when section active */
					var curClass = headerClass + " is-" + index;
					header.attr('class', curClass);
				}
			});
		});
	},

	'snapTo': function snapTo() {
		var $container = $('[data-js="scroll"]'),
		    $navLink = $('[data-js="navlink"]'),
		    header = $('[data-js="header"]'),
		    headerClass = $('[data-js="header"]').attr("class"),
		    $continueBtn = $('[data-js="continue"]'),
		    $participateBtn = $('[data-js="participate"]');

		var options = {
			$menu: $('.Navigation-items'),
			panelSelector: '.Section',
			namespace: '.panelSnap',
			onSnapStart: function ($target) {
				var index = $target.data('panel');

				/* Update nav link class when section active */
				$('[data-js="navlink"]').removeClass('is-active');
				$('[data-section="' + index + '"]').addClass('is-active');
				header.attr('class', headerClass);

				/* Update nav container class when section active */
				var curClass = headerClass + " is-" + index;
				header.attr('class', curClass);
			},
			onSnapFinish: function ($target) {
				var index = $target.data('panel');

				if (index == 4) {
					$('[data-item="1"]').trigger('click');
				}
			},
			directionThreshold: 0,
			slideSpeed: 500,
			easing: 'swing',
			offset: 0,
			navigation: {
				keys: {
					nextKey: 40,
					prevKey: 38
				},
				buttons: {
					$nextButton: $continueBtn,
					$prevButton: false
				},
				wrapAround: false
			}
		};

		$('body').panelSnap(options);
	}
};

/**
 * START POINT
*/

$(document).ready(function () {

	app.init();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCJzbmFwVG8iLCJodWJBbmltYXRpb24iLCIkc2VjdGlvbiIsIiRob3VzZSIsIm9uIiwiZXZlbnQiLCJwYWdlWCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsImluZGV4Iiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJwYXJlbnRzIiwiYnV0dG9uIiwicGFnZSIsImxpbmsiLCJvcGVuIiwic2Nyb2xsVG8iLCIkY29udGFpbmVyIiwiJG5hdkxpbmsiLCJoZWFkZXIiLCJoZWFkZXJDbGFzcyIsInByZXZlbnREZWZhdWx0IiwiZGF0YSIsInNlY3Rpb24iLCJvbkFmdGVyIiwiY3VyQ2xhc3MiLCIkY29udGludWVCdG4iLCIkcGFydGljaXBhdGVCdG4iLCJvcHRpb25zIiwiJG1lbnUiLCJwYW5lbFNlbGVjdG9yIiwibmFtZXNwYWNlIiwib25TbmFwU3RhcnQiLCIkdGFyZ2V0Iiwib25TbmFwRmluaXNoIiwidHJpZ2dlciIsImRpcmVjdGlvblRocmVzaG9sZCIsInNsaWRlU3BlZWQiLCJlYXNpbmciLCJvZmZzZXQiLCJuYXZpZ2F0aW9uIiwia2V5cyIsIm5leHRLZXkiLCJwcmV2S2V5IiwiYnV0dG9ucyIsIiRuZXh0QnV0dG9uIiwiJHByZXZCdXR0b24iLCJ3cmFwQXJvdW5kIiwicGFuZWxTbmFwIiwiZG9jdW1lbnQiLCJyZWFkeSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsTUFBTTs7QUFFUixTQUFRLFNBQVNDLElBQVQsR0FBZ0I7QUFDdkIsT0FBS0MsSUFBTDtBQUNBLE9BQUtDLFFBQUw7QUFDQSxPQUFLQyxPQUFMOztBQUVBO0FBQ0EsTUFBSUMsRUFBRSxNQUFGLEVBQVVDLFFBQVYsQ0FBbUIsU0FBbkIsQ0FBSixFQUFtQztBQUNsQztBQUNBLFFBQUtDLFFBQUw7QUFDQSxRQUFLQyxPQUFMO0FBQ0EsUUFBS0MsTUFBTDtBQUNBLFFBQUtDLFlBQUw7QUFDQTtBQUNELEVBZk87O0FBaUJSLGlCQUFnQixTQUFTQSxZQUFULEdBQXVCO0FBQ3RDLE1BQUlDLFdBQVdOLEVBQUUsa0JBQUYsQ0FBZjtBQUFBLE1BQ0VPLFNBQVNQLEVBQUUsbUJBQUYsQ0FEWDs7QUFHQU0sV0FBU0UsRUFBVCxDQUFZLFdBQVosRUFBeUIsVUFBU0MsS0FBVCxFQUFlO0FBQ3ZDO0FBQ0EsT0FBSUEsTUFBTUMsS0FBTixHQUFjLEdBQWxCLEVBQXVCO0FBQ3RCSCxXQUFPSSxRQUFQLENBQWdCLFVBQWhCO0FBQ0FKLFdBQU9LLFdBQVAsQ0FBbUIsU0FBbkI7QUFDQSxJQUhELE1BR087QUFDTkwsV0FBT0ssV0FBUCxDQUFtQixVQUFuQjtBQUNBTCxXQUFPSSxRQUFQLENBQWdCLFNBQWhCO0FBQ0E7QUFDRCxHQVREO0FBVUEsRUEvQk87O0FBaUNSLGFBQVksU0FBU1QsUUFBVCxHQUFvQjtBQUM5QixNQUFJVyxZQUFZYixFQUFFLHNCQUFGLENBQWhCO0FBQUEsTUFDRWMsZUFBZWQsRUFBRSwwQkFBRixDQURqQjs7QUFHQWEsWUFBVUUsS0FBVixDQUFnQjtBQUNmQyxXQUFRLEtBRE87QUFFZkMsZUFBWSxDQUNUO0FBQ0VDLGdCQUFZLEdBRGQ7QUFF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QW1DVixRQUFuQyxDQUE0QyxXQUE1QztBQUNBd0MsV0FBT1osSUFBUCxDQUFZLE9BQVosRUFBcUJhLFdBQXJCOztBQUVBO0FBQ0EsUUFBSUssV0FBV0wsY0FBYyxNQUFkLEdBQXVCL0IsS0FBdEM7QUFDQThCLFdBQU9aLElBQVAsQ0FBWSxPQUFaLEVBQXFCa0IsUUFBckI7QUFFQSxJQWhCVztBQWlCWlMsaUJBQWMsVUFBU0QsT0FBVCxFQUFrQjtBQUMvQixRQUFJNUMsUUFBUTRDLFFBQVFYLElBQVIsQ0FBYSxPQUFiLENBQVo7O0FBRUEsUUFBSWpDLFNBQVMsQ0FBYixFQUFnQjtBQUNmckIsT0FBRSxpQkFBRixFQUFxQm1FLE9BQXJCLENBQTZCLE9BQTdCO0FBQ0E7QUFDRCxJQXZCVztBQXdCWkMsdUJBQW9CLENBeEJSO0FBeUJaQyxlQUFZLEdBekJBO0FBMEJaQyxXQUFRLE9BMUJJO0FBMkJaQyxXQUFRLENBM0JJO0FBNEJaQyxlQUFZO0FBQ1hDLFVBQU07QUFDTEMsY0FBUyxFQURKO0FBRUxDLGNBQVM7QUFGSixLQURLO0FBS1hDLGFBQVM7QUFDUkMsa0JBQWFuQixZQURMO0FBRVJvQixrQkFBYTtBQUZMLEtBTEU7QUFTWEMsZ0JBQVk7QUFURDtBQTVCQSxHQUFkOztBQXlDRS9FLElBQUUsTUFBRixFQUFVZ0YsU0FBVixDQUFvQnBCLE9BQXBCO0FBQ0Y7QUE1UU8sQ0FBVjs7QUFnUkE7Ozs7QUFJQTVELEVBQUVpRixRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0J2RixLQUFJQyxJQUFKO0FBQ0QsQ0FIRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cdFx0XHR0aGlzLmV4cGFuZGVyKCk7XG5cdFx0XHR0aGlzLm92ZXJsYXkoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQvLyBpbml0aWFsaXNlIGNhcm91c2VsICYgaGlzdG9yeSBjb21wb25lbnRzXG5cdFx0XHRcdHRoaXMuY2Fyb3VzZWwoKTtcblx0XHRcdFx0dGhpcy5oaXN0b3J5KCk7XG5cdFx0XHRcdHRoaXMuc25hcFRvKCk7XG5cdFx0XHRcdHRoaXMuaHViQW5pbWF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdodWJBbmltYXRpb24nOiBmdW5jdGlvbiBodWJBbmltYXRpb24oKXtcblx0XHRcdHZhciAkc2VjdGlvbiA9ICQoJ1tkYXRhLXBhbmVsPVwiMlwiXScpLFxuXHRcdFx0XHRcdCRob3VzZSA9ICQoJ1tkYXRhLWpzPVwiaG91c2VcIl0nKTtcblxuXHRcdFx0JHNlY3Rpb24ub24oXCJtb3VzZW1vdmVcIiwgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHQvLyBkZXRlY3QgbW91c2UgeFxuXHRcdFx0XHRpZiggZXZlbnQucGFnZVggPCA1MTApIHtcblx0XHRcdFx0XHQkaG91c2UuYWRkQ2xhc3MoXCJpcy1yaWdodFwiKTtcblx0XHRcdFx0XHQkaG91c2UucmVtb3ZlQ2xhc3MoXCJpcy1sZWZ0XCIpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdCRob3VzZS5yZW1vdmVDbGFzcyhcImlzLXJpZ2h0XCIpO1xuXHRcdFx0XHRcdCRob3VzZS5hZGRDbGFzcyhcImlzLWxlZnRcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnY2Fyb3VzZWwnOiBmdW5jdGlvbiBjYXJvdXNlbCgpIHtcblx0XHRcdFx0dmFyICRjYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWxcIl0nKSxcblx0XHRcdFx0XHRcdCRjYXJvdXNlbE5hdiA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWwtbmF2XCJdJyk7XG5cblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0ICAgIHtcblx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWRlcyByZXNwb25kIHRvIG5hdlxuXHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcblxuXHRcdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGljayByZWluaXQgd2hlbiBicm93c2VyIHNpemUgaW5jcmVhc2VkICYgaXQgaXNuJ3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0XHR3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA4NjAgJiYgISRjYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuXG5cdFx0XHRcdFx0XHQvLyBEZXN0cm95IGFuZCByZWluaXQgc2xpY2tcblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygndW5zbGljaycpO1xuXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdleHBhbmRlcic6IGZ1bmN0aW9uIGV4cGFuZGVyKCl7XG5cdFx0XHR2YXIgJGl0ZW0gPSAkKCdbZGF0YS1qcz1cImV4cGFuZGVyXCJdJyksXG5cdFx0XHRcdFx0JHRyaWdnZXIgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyVHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRjb250ZW50ID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlckNvbnRlbnRcIl0nKTtcblxuXHRcdFx0JHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdoaXN0b3J5JzogZnVuY3Rpb24gaGlzdG9yeSgpIHtcblx0XHRcdHZhciAkaGlzdG9yeSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtc1wiXScpLFxuXHRcdFx0XHRcdCRoaXN0b3J5SXRlbSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtXCJdJyk7XG5cblx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2lzLXNtYWxsJyk7XG5cblx0XHRcdCRoaXN0b3J5SXRlbS5vbignY2xpY2sgbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggISQodGhpcykuaGFzQ2xhc3MoJ2lzLWxhcmdlJykgKSB7XG5cdFx0XHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J292ZXJsYXknOiBmdW5jdGlvbiBvdmVybGF5KCkge1xuXHRcdFx0dmFyICRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXkgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheVRyaWdnZXIgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDbG9zZSA9ICQoJ1tkYXRhLWpzPVwiY2xvc2VPdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheS1jYXJvdXNlbFwiXScpO1xuXG5cblx0XHRcdCRvdmVybGF5VHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgb3ZlcmxheU51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS1vdmVybGF5Jyk7XG5cdFx0XHRcdCQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLmFkZENsYXNzKCdpcy1vdmVybGF5Jyk7XG5cblx0XHRcdFx0Ly8gSW5pdCBjYXJvdXNlbCBpZiBpdCBoYXMgb25lXG5cdFx0XHRcdGlmICggJCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmhhc0NsYXNzKCdpcy1jYXJvdXNlbCcpKSB7XG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRcdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0ICAgICAgICBhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdCAgICAgICAgZG90czogdHJ1ZVxuXHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIE9uIGJlZm9yZSBzbGlkZSBjaGFuZ2Vcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcblx0XHRcdFx0XHRcdGlmIChuZXh0U2xpZGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5PdmVybGF5LWlubmVyJykuYWRkQ2xhc3MoJ2lzLXNlY29uZCcpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuT3ZlcmxheS1pbm5lcicpLnJlbW92ZUNsYXNzKCdpcy1zZWNvbmQnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCRvdmVybGF5Q2xvc2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5yZW1vdmVDbGFzcygnaXMtb3ZlcmxheScpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bGluay5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnc2Nyb2xsVG8nOiBmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaW5kZXggPSAgICQodGhpcykuZGF0YSgnc2VjdGlvbicpLFxuXHRcdFx0XHRcdFx0c2VjdGlvbiA9IFwiI3NlY3Rpb24wXCIgKyBpbmRleDtcblxuXHRcdFx0XHQvLyAkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKHNlY3Rpb24sIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oXCIjc2VjdGlvbjAyXCIsIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzbmFwVG8nOiBmdW5jdGlvbiBzbmFwVG8oKSB7XG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIiksXG5cdFx0XHRcdFx0JGNvbnRpbnVlQnRuID0gJCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLFxuXHRcdFx0XHRcdCRwYXJ0aWNpcGF0ZUJ0biA9ICQoJ1tkYXRhLWpzPVwicGFydGljaXBhdGVcIl0nKTtcblxuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHQkbWVudTogJCgnLk5hdmlnYXRpb24taXRlbXMnKSxcblx0XHRcdFx0XHRwYW5lbFNlbGVjdG9yOiAnLlNlY3Rpb24nLFxuXHRcdFx0XHRcdG5hbWVzcGFjZTogJy5wYW5lbFNuYXAnLFxuXHRcdFx0XHRcdG9uU25hcFN0YXJ0OiBmdW5jdGlvbigkdGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5kZXggPSAkdGFyZ2V0LmRhdGEoJ3BhbmVsJyk7XG5cblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0XHQkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHQkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0aGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0XHR2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG5cdFx0XHRcdFx0XHRoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9uU25hcEZpbmlzaDogZnVuY3Rpb24oJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gJHRhcmdldC5kYXRhKCdwYW5lbCcpO1xuXG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggPT0gNCkge1xuXHRcdFx0XHRcdFx0XHQkKCdbZGF0YS1pdGVtPVwiMVwiXScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkaXJlY3Rpb25UaHJlc2hvbGQ6IDAsXG5cdFx0XHRcdFx0c2xpZGVTcGVlZDogNTAwLFxuXHRcdFx0XHRcdGVhc2luZzogJ3N3aW5nJyxcblx0XHRcdFx0XHRvZmZzZXQ6IDAsXG5cdFx0XHRcdFx0bmF2aWdhdGlvbjoge1xuXHRcdFx0XHRcdFx0a2V5czoge1xuXHRcdFx0XHRcdFx0XHRuZXh0S2V5OiA0MCxcblx0XHRcdFx0XHRcdFx0cHJldktleTogMzgsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YnV0dG9uczoge1xuXHRcdFx0XHRcdFx0XHQkbmV4dEJ1dHRvbjogJGNvbnRpbnVlQnRuLFxuXHRcdFx0XHRcdFx0XHQkcHJldkJ1dHRvbjogZmFsc2UsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0d3JhcEFyb3VuZDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0ICAgICQoJ2JvZHknKS5wYW5lbFNuYXAob3B0aW9ucyk7XG5cdFx0fVxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG59KTtcbiJdfQ==