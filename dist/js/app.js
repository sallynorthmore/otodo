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
			} else {
				// $(this).removeClass('is-large');
			}
		});

		$(['data-js="participate"']).on('click', function (e) {});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCJzbmFwVG8iLCJodWJBbmltYXRpb24iLCIkc2VjdGlvbiIsIiRob3VzZSIsIm9uIiwiZXZlbnQiLCJwYWdlWCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsImluZGV4Iiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCJlIiwiJHBhZ2UiLCIkb3ZlcmxheSIsIiRvdmVybGF5VHJpZ2dlciIsIiRvdmVybGF5Q2xvc2UiLCIkb3ZlcmxheUNhcm91c2VsIiwib3ZlcmxheU51bWJlciIsImF0dHIiLCJkb3RzIiwiY3VycmVudFNsaWRlIiwibmV4dFNsaWRlIiwicGFyZW50cyIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsInNjcm9sbFRvIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGEiLCJzZWN0aW9uIiwib25BZnRlciIsImN1ckNsYXNzIiwiJGNvbnRpbnVlQnRuIiwiJHBhcnRpY2lwYXRlQnRuIiwib3B0aW9ucyIsIiRtZW51IiwicGFuZWxTZWxlY3RvciIsIm5hbWVzcGFjZSIsIm9uU25hcFN0YXJ0IiwiJHRhcmdldCIsIm9uU25hcEZpbmlzaCIsInRyaWdnZXIiLCJkaXJlY3Rpb25UaHJlc2hvbGQiLCJzbGlkZVNwZWVkIiwiZWFzaW5nIiwib2Zmc2V0IiwibmF2aWdhdGlvbiIsImtleXMiLCJuZXh0S2V5IiwicHJldktleSIsImJ1dHRvbnMiLCIkbmV4dEJ1dHRvbiIsIiRwcmV2QnV0dG9uIiwid3JhcEFyb3VuZCIsInBhbmVsU25hcCIsImRvY3VtZW50IiwicmVhZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE1BQU07O0FBRVIsU0FBUSxTQUFTQyxJQUFULEdBQWdCO0FBQ3ZCLE9BQUtDLElBQUw7QUFDQSxPQUFLQyxRQUFMO0FBQ0EsT0FBS0MsT0FBTDs7QUFFQTtBQUNBLE1BQUlDLEVBQUUsTUFBRixFQUFVQyxRQUFWLENBQW1CLFNBQW5CLENBQUosRUFBbUM7QUFDbEM7QUFDQSxRQUFLQyxRQUFMO0FBQ0EsUUFBS0MsT0FBTDtBQUNBLFFBQUtDLE1BQUw7QUFDQSxRQUFLQyxZQUFMO0FBQ0E7QUFDRCxFQWZPOztBQWlCUixpQkFBZ0IsU0FBU0EsWUFBVCxHQUF1QjtBQUN0QyxNQUFJQyxXQUFXTixFQUFFLGtCQUFGLENBQWY7QUFBQSxNQUNFTyxTQUFTUCxFQUFFLG1CQUFGLENBRFg7O0FBR0FNLFdBQVNFLEVBQVQsQ0FBWSxXQUFaLEVBQXlCLFVBQVNDLEtBQVQsRUFBZTtBQUN2QztBQUNBLE9BQUlBLE1BQU1DLEtBQU4sR0FBYyxHQUFsQixFQUF1QjtBQUN0QkgsV0FBT0ksUUFBUCxDQUFnQixVQUFoQjtBQUNBSixXQUFPSyxXQUFQLENBQW1CLFNBQW5CO0FBQ0EsSUFIRCxNQUdPO0FBQ05MLFdBQU9LLFdBQVAsQ0FBbUIsVUFBbkI7QUFDQUwsV0FBT0ksUUFBUCxDQUFnQixTQUFoQjtBQUNBO0FBQ0QsR0FURDtBQVVBLEVBL0JPOztBQWlDUixhQUFZLFNBQVNULFFBQVQsR0FBb0I7QUFDOUIsTUFBSVcsWUFBWWIsRUFBRSxzQkFBRixDQUFoQjtBQUFBLE1BQ0VjLGVBQWVkLEVBQUUsMEJBQUYsQ0FEakI7O0FBR0FhLFlBQVVFLEtBQVYsQ0FBZ0I7QUFDZkMsV0FBUSxLQURPO0FBRWZDLGVBQVksQ0FDVDtBQUNFQyxnQkFBWSxHQURk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UVgsSUFBUixDQUFhLE9BQWIsQ0FBWjs7QUFFQTtBQUNBdkQsTUFBRSxxQkFBRixFQUF5QlksV0FBekIsQ0FBcUMsV0FBckM7QUFDQVosTUFBRSxvQkFBb0JxQixLQUFwQixHQUEyQixJQUE3QixFQUFtQ1YsUUFBbkMsQ0FBNEMsV0FBNUM7QUFDQXlDLFdBQU9aLElBQVAsQ0FBWSxPQUFaLEVBQXFCYSxXQUFyQjs7QUFFQTtBQUNBLFFBQUlLLFdBQVdMLGNBQWMsTUFBZCxHQUF1QmhDLEtBQXRDO0FBQ0ErQixXQUFPWixJQUFQLENBQVksT0FBWixFQUFxQmtCLFFBQXJCO0FBRUEsSUFoQlc7QUFpQlpTLGlCQUFjLFVBQVNELE9BQVQsRUFBa0I7QUFDL0IsUUFBSTdDLFFBQVE2QyxRQUFRWCxJQUFSLENBQWEsT0FBYixDQUFaOztBQUVBLFFBQUlsQyxTQUFTLENBQWIsRUFBZ0I7QUFDZnJCLE9BQUUsaUJBQUYsRUFBcUJvRSxPQUFyQixDQUE2QixPQUE3QjtBQUNBO0FBQ0QsSUF2Qlc7QUF3QlpDLHVCQUFvQixDQXhCUjtBQXlCWkMsZUFBWSxHQXpCQTtBQTBCWkMsV0FBUSxPQTFCSTtBQTJCWkMsV0FBUSxDQTNCSTtBQTRCWkMsZUFBWTtBQUNYQyxVQUFNO0FBQ0xDLGNBQVMsRUFESjtBQUVMQyxjQUFTO0FBRkosS0FESztBQUtYQyxhQUFTO0FBQ1JDLGtCQUFhbkIsWUFETDtBQUVSb0Isa0JBQWE7QUFGTCxLQUxFO0FBU1hDLGdCQUFZO0FBVEQ7QUE1QkEsR0FBZDs7QUF5Q0VoRixJQUFFLE1BQUYsRUFBVWlGLFNBQVYsQ0FBb0JwQixPQUFwQjtBQUNGO0FBbFJPLENBQVY7O0FBc1JBOzs7O0FBSUE3RCxFQUFFa0YsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7O0FBRTNCeEYsS0FBSUMsSUFBSjtBQUNELENBSEQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXHRcdFx0dGhpcy5leHBhbmRlcigpO1xuXHRcdFx0dGhpcy5vdmVybGF5KCk7XG5cblx0XHRcdC8vIEluaXRpYWxpc2Ugc2Nyb2xsIG9uIGRlc2t0b3AgJiBhZGQgQ1NTXG5cdFx0XHRpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdkZXNrdG9wJykpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGlzZSBjYXJvdXNlbCAmIGhpc3RvcnkgY29tcG9uZW50c1xuXHRcdFx0XHR0aGlzLmNhcm91c2VsKCk7XG5cdFx0XHRcdHRoaXMuaGlzdG9yeSgpO1xuXHRcdFx0XHR0aGlzLnNuYXBUbygpO1xuXHRcdFx0XHR0aGlzLmh1YkFuaW1hdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnaHViQW5pbWF0aW9uJzogZnVuY3Rpb24gaHViQW5pbWF0aW9uKCl7XG5cdFx0XHR2YXIgJHNlY3Rpb24gPSAkKCdbZGF0YS1wYW5lbD1cIjJcIl0nKSxcblx0XHRcdFx0XHQkaG91c2UgPSAkKCdbZGF0YS1qcz1cImhvdXNlXCJdJyk7XG5cblx0XHRcdCRzZWN0aW9uLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0Ly8gZGV0ZWN0IG1vdXNlIHhcblx0XHRcdFx0aWYoIGV2ZW50LnBhZ2VYIDwgNTEwKSB7XG5cdFx0XHRcdFx0JGhvdXNlLmFkZENsYXNzKFwiaXMtcmlnaHRcIik7XG5cdFx0XHRcdFx0JGhvdXNlLnJlbW92ZUNsYXNzKFwiaXMtbGVmdFwiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaG91c2UucmVtb3ZlQ2xhc3MoXCJpcy1yaWdodFwiKTtcblx0XHRcdFx0XHQkaG91c2UuYWRkQ2xhc3MoXCJpcy1sZWZ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J2Nhcm91c2VsJzogZnVuY3Rpb24gY2Fyb3VzZWwoKSB7XG5cdFx0XHRcdHZhciAkY2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsXCJdJyksXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdCAgICB7XG5cdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGlkZXMgcmVzcG9uZCB0byBuYXZcblx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpY2sgcmVpbml0IHdoZW4gYnJvd3NlciBzaXplIGluY3JlYXNlZCAmIGl0IGlzbid0IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdFx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gODYwICYmICEkY2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRGVzdHJveSBhbmQgcmVpbml0IHNsaWNrXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3Vuc2xpY2snKTtcblxuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnZXhwYW5kZXInOiBmdW5jdGlvbiBleHBhbmRlcigpe1xuXHRcdFx0dmFyICRpdGVtID0gJCgnW2RhdGEtanM9XCJleHBhbmRlclwiXScpLFxuXHRcdFx0XHRcdCR0cmlnZ2VyID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlclRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkY29udGVudCA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJDb250ZW50XCJdJyk7XG5cblx0XHRcdCR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnaGlzdG9yeSc6IGZ1bmN0aW9uIGhpc3RvcnkoKSB7XG5cdFx0XHR2YXIgJGhpc3RvcnkgPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbXNcIl0nKSxcblx0XHRcdFx0XHQkaGlzdG9yeUl0ZW0gPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbVwiXScpO1xuXG5cdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLmFkZENsYXNzKCdpcy1zbWFsbCcpO1xuXG5cdFx0XHQkaGlzdG9yeUl0ZW0ub24oJ2NsaWNrIG1vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoICEkKHRoaXMpLmhhc0NsYXNzKCdpcy1sYXJnZScpICkge1xuXHRcdFx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JChbJ2RhdGEtanM9XCJwYXJ0aWNpcGF0ZVwiJ10pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuXG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J292ZXJsYXknOiBmdW5jdGlvbiBvdmVybGF5KCkge1xuXHRcdFx0dmFyICRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXkgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheVRyaWdnZXIgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDbG9zZSA9ICQoJ1tkYXRhLWpzPVwiY2xvc2VPdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheS1jYXJvdXNlbFwiXScpO1xuXG5cblx0XHRcdCRvdmVybGF5VHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgb3ZlcmxheU51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS1vdmVybGF5Jyk7XG5cdFx0XHRcdCQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLmFkZENsYXNzKCdpcy1vdmVybGF5Jyk7XG5cblx0XHRcdFx0Ly8gSW5pdCBjYXJvdXNlbCBpZiBpdCBoYXMgb25lXG5cdFx0XHRcdGlmICggJCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmhhc0NsYXNzKCdpcy1jYXJvdXNlbCcpKSB7XG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRcdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0ICAgICAgICBhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdCAgICAgICAgZG90czogdHJ1ZVxuXHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIE9uIGJlZm9yZSBzbGlkZSBjaGFuZ2Vcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcblx0XHRcdFx0XHRcdGlmIChuZXh0U2xpZGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5PdmVybGF5LWlubmVyJykuYWRkQ2xhc3MoJ2lzLXNlY29uZCcpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuT3ZlcmxheS1pbm5lcicpLnJlbW92ZUNsYXNzKCdpcy1zZWNvbmQnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCRvdmVybGF5Q2xvc2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5yZW1vdmVDbGFzcygnaXMtb3ZlcmxheScpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bGluay5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnc2Nyb2xsVG8nOiBmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaW5kZXggPSAgICQodGhpcykuZGF0YSgnc2VjdGlvbicpLFxuXHRcdFx0XHRcdFx0c2VjdGlvbiA9IFwiI3NlY3Rpb24wXCIgKyBpbmRleDtcblxuXHRcdFx0XHQvLyAkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKHNlY3Rpb24sIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oXCIjc2VjdGlvbjAyXCIsIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzbmFwVG8nOiBmdW5jdGlvbiBzbmFwVG8oKSB7XG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIiksXG5cdFx0XHRcdFx0JGNvbnRpbnVlQnRuID0gJCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLFxuXHRcdFx0XHRcdCRwYXJ0aWNpcGF0ZUJ0biA9ICQoJ1tkYXRhLWpzPVwicGFydGljaXBhdGVcIl0nKTtcblxuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHQkbWVudTogJCgnLk5hdmlnYXRpb24taXRlbXMnKSxcblx0XHRcdFx0XHRwYW5lbFNlbGVjdG9yOiAnLlNlY3Rpb24nLFxuXHRcdFx0XHRcdG5hbWVzcGFjZTogJy5wYW5lbFNuYXAnLFxuXHRcdFx0XHRcdG9uU25hcFN0YXJ0OiBmdW5jdGlvbigkdGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5kZXggPSAkdGFyZ2V0LmRhdGEoJ3BhbmVsJyk7XG5cblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0XHQkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHQkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0aGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0XHR2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG5cdFx0XHRcdFx0XHRoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9uU25hcEZpbmlzaDogZnVuY3Rpb24oJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gJHRhcmdldC5kYXRhKCdwYW5lbCcpO1xuXG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggPT0gNCkge1xuXHRcdFx0XHRcdFx0XHQkKCdbZGF0YS1pdGVtPVwiMVwiXScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkaXJlY3Rpb25UaHJlc2hvbGQ6IDAsXG5cdFx0XHRcdFx0c2xpZGVTcGVlZDogNTAwLFxuXHRcdFx0XHRcdGVhc2luZzogJ3N3aW5nJyxcblx0XHRcdFx0XHRvZmZzZXQ6IDAsXG5cdFx0XHRcdFx0bmF2aWdhdGlvbjoge1xuXHRcdFx0XHRcdFx0a2V5czoge1xuXHRcdFx0XHRcdFx0XHRuZXh0S2V5OiA0MCxcblx0XHRcdFx0XHRcdFx0cHJldktleTogMzgsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YnV0dG9uczoge1xuXHRcdFx0XHRcdFx0XHQkbmV4dEJ1dHRvbjogJGNvbnRpbnVlQnRuLFxuXHRcdFx0XHRcdFx0XHQkcHJldkJ1dHRvbjogZmFsc2UsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0d3JhcEFyb3VuZDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0ICAgICQoJ2JvZHknKS5wYW5lbFNuYXAob3B0aW9ucyk7XG5cdFx0fVxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG59KTtcbiJdfQ==