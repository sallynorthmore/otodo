var app = {

	'init': function init() {
		this.menu();
		this.expander();
		this.overlay();
		this.snapTo();

		// Initialise scroll on desktop & add CSS
		if ($('html').hasClass('desktop')) {
			// initialise carousel & history components
			this.carousel();
			this.history();
		}
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
			page.removeClass("has-nav");
			open = false;
		});
	},

	'onepage': function onepage() {

		var $container = $('[data-js="scroll"]'),
		    $navLink = $('[data-js="navlink"]'),
		    header = $('[data-js="header"]'),
		    headerClass = $('[data-js="header"]').attr("class");

		$container.onepage_scroll({
			sectionContainer: '[data-js="section"]',
			easing: "ease-out",
			animationTime: 500,
			pagination: false,
			updateURL: false,
			beforeMove: function (index) {
				/* Update nav link class when section active */
				$('[data-js="navlink"]').removeClass('is-active');
				$('[data-section="' + index + '"]').addClass('is-active');
				header.attr('class', headerClass);

				/* Update nav container class when section active */
				var curClass = headerClass + " is-" + index;
				header.attr('class', curClass);
			},
			loop: false,
			keyboard: true,
			responsiveFallback: 600,
			direction: "vertical"
		});

		/* Slide to section on nav link click */
		$navLink.on('click', function (event) {
			event.preventDefault();
			var section = $(this).data('section');
			$container.moveTo(section);
		});

		/* Continue button */
		$('[data-js="continue"]').on('click', function (event) {
			event.preventDefault();
			$container.moveTo(2);
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
		    $continueBtn = $('[data-js="continue"]');

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
			onSnapFinish: function () {},
			onActivate: function () {},
			directionThreshold: 400,
			slideSpeed: 400,
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

		/* Slide to section on nav link click */
		$navLink.on('click', function (event) {
			// event.preventDefault();
		});

		/* Continue button */
		$('[data-js="continue"]').on('click', function (event) {
			// event.preventDefault();
		});
	}
};

/**
 * START POINT
*/

$(document).ready(function () {

	app.init();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCJzbmFwVG8iLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJidXR0b24iLCJwYWdlIiwibGluayIsIm9wZW4iLCJvbmVwYWdlIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJvbmVwYWdlX3Njcm9sbCIsInNlY3Rpb25Db250YWluZXIiLCJlYXNpbmciLCJhbmltYXRpb25UaW1lIiwicGFnaW5hdGlvbiIsInVwZGF0ZVVSTCIsImJlZm9yZU1vdmUiLCJjdXJDbGFzcyIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzZWN0aW9uIiwiZGF0YSIsIm1vdmVUbyIsInNjcm9sbFRvIiwib25BZnRlciIsIiRjb250aW51ZUJ0biIsIm9wdGlvbnMiLCIkbWVudSIsInBhbmVsU2VsZWN0b3IiLCJuYW1lc3BhY2UiLCJvblNuYXBTdGFydCIsIiR0YXJnZXQiLCJvblNuYXBGaW5pc2giLCJvbkFjdGl2YXRlIiwiZGlyZWN0aW9uVGhyZXNob2xkIiwic2xpZGVTcGVlZCIsIm9mZnNldCIsIm5hdmlnYXRpb24iLCJrZXlzIiwibmV4dEtleSIsInByZXZLZXkiLCJidXR0b25zIiwiJG5leHRCdXR0b24iLCIkcHJldkJ1dHRvbiIsIndyYXBBcm91bmQiLCJwYW5lbFNuYXAiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixPQUFLQyxJQUFMO0FBQ0EsT0FBS0MsUUFBTDtBQUNBLE9BQUtDLE9BQUw7QUFDQSxPQUFLQyxNQUFMOztBQUVBO0FBQ0EsTUFBSUMsRUFBRSxNQUFGLEVBQVVDLFFBQVYsQ0FBbUIsU0FBbkIsQ0FBSixFQUFtQztBQUNsQztBQUNBLFFBQUtDLFFBQUw7QUFDQSxRQUFLQyxPQUFMO0FBQ0E7QUFDRCxFQWRPOztBQWdCUixhQUFZLFNBQVNELFFBQVQsR0FBb0I7QUFDOUIsTUFBSUUsWUFBWUosRUFBRSxzQkFBRixDQUFoQjtBQUFBLE1BQ0VLLGVBQWVMLEVBQUUsMEJBQUYsQ0FEakI7O0FBR0FJLFlBQVVFLEtBQVYsQ0FBZ0I7QUFDZkMsV0FBUSxLQURPO0FBRWZDLGVBQVksQ0FDVDtBQUNFQyxnQkFBWSxHQURkO0FBRUVDLGNBQVU7QUFGWixJQURTO0FBRkcsR0FBaEI7O0FBVUE7QUFDQUwsZUFBYU0sUUFBYixHQUF3QkMsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsWUFBVTtBQUM3QyxPQUFJQyxRQUFRYixFQUFFLElBQUYsRUFBUWEsS0FBUixFQUFaOztBQUVBUixnQkFBYU0sUUFBYixHQUF3QkcsV0FBeEIsQ0FBb0MsV0FBcEM7QUFDQWQsS0FBRSxJQUFGLEVBQVFlLFFBQVIsQ0FBaUIsV0FBakI7QUFDQVgsYUFBVUUsS0FBVixDQUFnQixXQUFoQixFQUE2Qk8sS0FBN0I7QUFDQSxHQU5EOztBQVFBO0FBQ0FHLFNBQU9DLFFBQVAsR0FBa0IsWUFBVzs7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QUFzQyxVQUFTNEMsS0FBVCxFQUFlO0FBQ3BEO0FBQ0EsR0FGRDtBQUdBO0FBalNPLENBQVY7O0FBcVNBOzs7O0FBSUF4RCxFQUFFb0YsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7O0FBRTNCM0YsS0FBSUMsSUFBSjtBQUNELENBSEQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXHRcdFx0dGhpcy5leHBhbmRlcigpO1xuXHRcdFx0dGhpcy5vdmVybGF5KCk7XG5cdFx0XHR0aGlzLnNuYXBUbygpO1xuXG5cdFx0XHQvLyBJbml0aWFsaXNlIHNjcm9sbCBvbiBkZXNrdG9wICYgYWRkIENTU1xuXHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnZGVza3RvcCcpKSB7XG5cdFx0XHRcdC8vIGluaXRpYWxpc2UgY2Fyb3VzZWwgJiBoaXN0b3J5IGNvbXBvbmVudHNcblx0XHRcdFx0dGhpcy5jYXJvdXNlbCgpO1xuXHRcdFx0XHR0aGlzLmhpc3RvcnkoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J2Nhcm91c2VsJzogZnVuY3Rpb24gY2Fyb3VzZWwoKSB7XG5cdFx0XHRcdHZhciAkY2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsXCJdJyksXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdCAgICB7XG5cdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGlkZXMgcmVzcG9uZCB0byBuYXZcblx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpY2sgcmVpbml0IHdoZW4gYnJvd3NlciBzaXplIGluY3JlYXNlZCAmIGl0IGlzbid0IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdFx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gODYwICYmICEkY2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRGVzdHJveSBhbmQgcmVpbml0IHNsaWNrXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3Vuc2xpY2snKTtcblxuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnZXhwYW5kZXInOiBmdW5jdGlvbiBleHBhbmRlcigpe1xuXHRcdFx0dmFyICRpdGVtID0gJCgnW2RhdGEtanM9XCJleHBhbmRlclwiXScpLFxuXHRcdFx0XHRcdCR0cmlnZ2VyID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlclRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkY29udGVudCA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJDb250ZW50XCJdJyk7XG5cblx0XHRcdCR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnaGlzdG9yeSc6IGZ1bmN0aW9uIGhpc3RvcnkoKSB7XG5cdFx0XHR2YXIgJGhpc3RvcnkgPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbXNcIl0nKSxcblx0XHRcdFx0XHQkaGlzdG9yeUl0ZW0gPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbVwiXScpO1xuXG5cdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLmFkZENsYXNzKCdpcy1zbWFsbCcpO1xuXG5cdFx0XHQkaGlzdG9yeUl0ZW0ub24oJ2NsaWNrIG1vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoICEkKHRoaXMpLmhhc0NsYXNzKCdpcy1sYXJnZScpICkge1xuXHRcdFx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J292ZXJsYXknOiBmdW5jdGlvbiBvdmVybGF5KCkge1xuXHRcdFx0dmFyICRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXkgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheVRyaWdnZXIgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDbG9zZSA9ICQoJ1tkYXRhLWpzPVwiY2xvc2VPdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheS1jYXJvdXNlbFwiXScpO1xuXG5cblx0XHRcdCRvdmVybGF5VHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgb3ZlcmxheU51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS1vdmVybGF5Jyk7XG5cdFx0XHRcdCQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLmFkZENsYXNzKCdpcy1vdmVybGF5Jyk7XG5cblx0XHRcdFx0Ly8gSW5pdCBjYXJvdXNlbCBpZiBpdCBoYXMgb25lXG5cdFx0XHRcdGlmICggJCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmhhc0NsYXNzKCdpcy1jYXJvdXNlbCcpKSB7XG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRcdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0ICAgICAgICBhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdCAgICAgICAgZG90czogdHJ1ZVxuXHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCRvdmVybGF5Q2xvc2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5yZW1vdmVDbGFzcygnaXMtb3ZlcmxheScpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdvbmVwYWdlJzogZnVuY3Rpb24gb25lcGFnZSgpIHtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpO1xuXG5cblx0XHRcdCRjb250YWluZXIub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0XHRzZWN0aW9uQ29udGFpbmVyOiAnW2RhdGEtanM9XCJzZWN0aW9uXCJdJyxcblx0XHRcdCAgIGVhc2luZzogXCJlYXNlLW91dFwiLFxuXHRcdFx0ICAgYW5pbWF0aW9uVGltZTogNTAwLFxuXHRcdFx0ICAgcGFnaW5hdGlvbjogZmFsc2UsXG5cdFx0XHQgICB1cGRhdGVVUkw6IGZhbHNlLFxuXHRcdFx0ICAgYmVmb3JlTW92ZTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCAkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cblx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdCB2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG5cdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0IH0sXG5cdFx0XHQgICBsb29wOiBmYWxzZSxcblx0XHRcdCAgIGtleWJvYXJkOiB0cnVlLFxuXHRcdFx0ICAgcmVzcG9uc2l2ZUZhbGxiYWNrOiA2MDAsXG5cdFx0XHQgICBkaXJlY3Rpb246IFwidmVydGljYWxcIlxuXHRcdFx0fSk7XG5cblx0XHRcdC8qIFNsaWRlIHRvIHNlY3Rpb24gb24gbmF2IGxpbmsgY2xpY2sgKi9cblx0XHRcdCRuYXZMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIHNlY3Rpb24gPSAkKHRoaXMpLmRhdGEoJ3NlY3Rpb24nKTtcblx0XHRcdFx0JGNvbnRhaW5lci5tb3ZlVG8oc2VjdGlvbik7XG5cdFx0XHR9KTtcblxuXHRcdFx0LyogQ29udGludWUgYnV0dG9uICovXG5cdFx0XHQkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkY29udGFpbmVyLm1vdmVUbygyKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnc2Nyb2xsVG8nOiBmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaW5kZXggPSAgICQodGhpcykuZGF0YSgnc2VjdGlvbicpLFxuXHRcdFx0XHRcdFx0c2VjdGlvbiA9IFwiI3NlY3Rpb24wXCIgKyBpbmRleDtcblxuXHRcdFx0XHQvLyAkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKHNlY3Rpb24sIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oXCIjc2VjdGlvbjAyXCIsIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzbmFwVG8nOiBmdW5jdGlvbiBzbmFwVG8oKSB7XG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIiksXG5cdFx0XHRcdFx0JGNvbnRpbnVlQnRuID0gJCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpO1xuXG5cdFx0XHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0XHRcdCRtZW51OiAkKCcuTmF2aWdhdGlvbi1pdGVtcycpLFxuXHRcdFx0XHQgICAgICBwYW5lbFNlbGVjdG9yOiAnLlNlY3Rpb24nLFxuXHRcdFx0XHQgICAgICBuYW1lc3BhY2U6ICcucGFuZWxTbmFwJyxcblx0XHRcdFx0XHRcdFx0b25TbmFwU3RhcnQ6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblx0XHRcdFx0XHRcdFx0XHR2YXIgaW5kZXggPSAkdGFyZ2V0LmRhdGEoJ3BhbmVsJyk7XG5cblx0XHRcdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdFx0XHRcdCQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdFx0XHQkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0XHRcdGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuXHRcdFx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG5cdFx0XHRcdFx0XHRcdFx0aGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXG5cdFx0ICAgICAgICAgIH0sXG5cdFx0XHRcdCAgICAgIG9uU25hcEZpbmlzaDogZnVuY3Rpb24oKXt9LFxuXHRcdFx0XHQgICAgICBvbkFjdGl2YXRlOiBmdW5jdGlvbigpe30sXG5cdFx0XHRcdCAgICAgIGRpcmVjdGlvblRocmVzaG9sZDogNDAwLFxuXHRcdFx0XHQgICAgICBzbGlkZVNwZWVkOiA0MDAsXG5cdFx0XHRcdCAgICAgIGVhc2luZzogJ3N3aW5nJyxcblx0XHRcdFx0ICAgICAgb2Zmc2V0OiAwLFxuXHRcdFx0XHQgICAgICBuYXZpZ2F0aW9uOiB7XG5cdFx0XHRcdFx0XHRcdFx0a2V5czoge1xuXHRcdFx0XHRcdFx0XHRcdFx0bmV4dEtleTogNDAsXG5cdFx0XHRcdFx0XHRcdFx0XHRwcmV2S2V5OiAzOCxcblx0XHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHQgICAgICAgIGJ1dHRvbnM6IHtcblx0XHRcdFx0ICAgICAgICAgICRuZXh0QnV0dG9uOiAkY29udGludWVCdG4sXG5cdFx0XHRcdCAgICAgICAgICAkcHJldkJ1dHRvbjogZmFsc2UsXG5cdFx0XHRcdCAgICAgICAgfSxcblx0XHRcdFx0ICAgICAgICB3cmFwQXJvdW5kOiBmYWxzZVxuXHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdCAgICB9O1xuXG5cdFx0ICAgICQoJ2JvZHknKS5wYW5lbFNuYXAob3B0aW9ucyk7XG5cblx0XHRcdC8qIFNsaWRlIHRvIHNlY3Rpb24gb24gbmF2IGxpbmsgY2xpY2sgKi9cblx0XHRcdCRuYXZMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0Ly8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KTtcblx0XHR9XG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcbn0pO1xuIl19