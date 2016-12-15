var app = {

	'init': function init() {
		this.menu();
		this.expander();
		this.overlay();

		// Initialise scroll on desktop & add CSS
		if ($('html').hasClass('desktop')) {
			// Add one-page scroll css & js
			// $("<link/>", {
			//    rel: "stylesheet",
			//    type: "text/css",
			//    href: "/css/onepage-scroll.css"
			// }).appendTo("head");
			// this.onepage();

			// initialise slickjs
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
					dots: true
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
	}
};

/**
 * START POINT
*/

$(document).ready(function () {

	app.init();
	console.log("%c   ***** Loaded ******   ", 'background-color: #0f0; color: #fff;');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJidXR0b24iLCJwYWdlIiwibGluayIsIm9wZW4iLCJvbmVwYWdlIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJvbmVwYWdlX3Njcm9sbCIsInNlY3Rpb25Db250YWluZXIiLCJlYXNpbmciLCJhbmltYXRpb25UaW1lIiwicGFnaW5hdGlvbiIsInVwZGF0ZVVSTCIsImJlZm9yZU1vdmUiLCJjdXJDbGFzcyIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzZWN0aW9uIiwiZGF0YSIsIm1vdmVUbyIsImRvY3VtZW50IiwicmVhZHkiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixPQUFLQyxJQUFMO0FBQ0EsT0FBS0Ms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NkIsT0FBN0IsRUFBc0MsVUFBUzRDLEtBQVQsRUFBZTtBQUNwREEsU0FBTUMsY0FBTjtBQUNBakIsY0FBV29CLE1BQVgsQ0FBa0IsQ0FBbEI7QUFDQSxHQUhEO0FBSUE7QUF6TE8sQ0FBVjs7QUE2TEE7Ozs7QUFJQTVELEVBQUU2RCxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0JuRSxLQUFJQyxJQUFKO0FBQ0FtRSxTQUFRQyxHQUFSLENBQVksNkJBQVosRUFBMkMsc0NBQTNDO0FBQ0QsQ0FKRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cdFx0XHR0aGlzLmV4cGFuZGVyKCk7XG5cdFx0XHR0aGlzLm92ZXJsYXkoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQvLyBBZGQgb25lLXBhZ2Ugc2Nyb2xsIGNzcyAmIGpzXG5cdFx0XHRcdC8vICQoXCI8bGluay8+XCIsIHtcblx0XHRcdFx0Ly8gICAgcmVsOiBcInN0eWxlc2hlZXRcIixcblx0XHRcdFx0Ly8gICAgdHlwZTogXCJ0ZXh0L2Nzc1wiLFxuXHRcdFx0XHQvLyAgICBocmVmOiBcIi9jc3Mvb25lcGFnZS1zY3JvbGwuY3NzXCJcblx0XHRcdFx0Ly8gfSkuYXBwZW5kVG8oXCJoZWFkXCIpO1xuXHRcdFx0XHQvLyB0aGlzLm9uZXBhZ2UoKTtcblxuXHRcdFx0XHQvLyBpbml0aWFsaXNlIHNsaWNranNcblx0XHRcdFx0dGhpcy5jYXJvdXNlbCgpO1xuXHRcdFx0XHR0aGlzLmhpc3RvcnkoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J2Nhcm91c2VsJzogZnVuY3Rpb24gY2Fyb3VzZWwoKSB7XG5cdFx0XHRcdHZhciAkY2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsXCJdJyksXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdCAgICB7XG5cdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGlkZXMgcmVzcG9uZCB0byBuYXZcblx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpY2sgcmVpbml0IHdoZW4gYnJvd3NlciBzaXplIGluY3JlYXNlZCAmIGl0IGlzbid0IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdFx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gODYwICYmICEkY2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRGVzdHJveSBhbmQgcmVpbml0IHNsaWNrXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3Vuc2xpY2snKTtcblxuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnZXhwYW5kZXInOiBmdW5jdGlvbiBleHBhbmRlcigpe1xuXHRcdFx0dmFyICRpdGVtID0gJCgnW2RhdGEtanM9XCJleHBhbmRlclwiXScpLFxuXHRcdFx0XHRcdCR0cmlnZ2VyID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlclRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkY29udGVudCA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJDb250ZW50XCJdJyk7XG5cblx0XHRcdCR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnaGlzdG9yeSc6IGZ1bmN0aW9uIGhpc3RvcnkoKSB7XG5cdFx0XHR2YXIgJGhpc3RvcnkgPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbXNcIl0nKSxcblx0XHRcdFx0XHQkaGlzdG9yeUl0ZW0gPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbVwiXScpO1xuXG5cdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLmFkZENsYXNzKCdpcy1zbWFsbCcpO1xuXG5cdFx0XHQkaGlzdG9yeUl0ZW0ub24oJ2NsaWNrIG1vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoICEkKHRoaXMpLmhhc0NsYXNzKCdpcy1sYXJnZScpICkge1xuXHRcdFx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J292ZXJsYXknOiBmdW5jdGlvbiBvdmVybGF5KCkge1xuXHRcdFx0dmFyICRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXkgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheVRyaWdnZXIgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDbG9zZSA9ICQoJ1tkYXRhLWpzPVwiY2xvc2VPdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheS1jYXJvdXNlbFwiXScpO1xuXG5cblx0XHRcdCRvdmVybGF5VHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgb3ZlcmxheU51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS1vdmVybGF5Jyk7XG5cdFx0XHRcdCQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLmFkZENsYXNzKCdpcy1vdmVybGF5Jyk7XG5cblx0XHRcdFx0Ly8gSW5pdCBjYXJvdXNlbCBpZiBpdCBoYXMgb25lXG5cdFx0XHRcdGlmICggJCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmhhc0NsYXNzKCdpcy1jYXJvdXNlbCcpKSB7XG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRcdFx0XHRkb3RzOiB0cnVlXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkb3ZlcmxheUNsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRvdmVybGF5LnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UucmVtb3ZlQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnbWVudSc6IGZ1bmN0aW9uIG1lbnUoKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnW2RhdGEtanM9XCJuYXZidXR0b25cIl0nKSxcblx0XHRcdFx0XHRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0bGluayA9ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblxuXHRcdFx0YnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChvcGVuKSB7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhZ2UuYWRkQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGluay5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb25lcGFnZSc6IGZ1bmN0aW9uIG9uZXBhZ2UoKSB7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXG5cdFx0XHQkY29udGFpbmVyLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogJ1tkYXRhLWpzPVwic2VjdGlvblwiXScsXG5cdFx0XHQgICBlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdCAgIGFuaW1hdGlvblRpbWU6IDUwMCxcblx0XHRcdCAgIHBhZ2luYXRpb246IGZhbHNlLFxuXHRcdFx0ICAgdXBkYXRlVVJMOiBmYWxzZSxcblx0XHRcdCAgIGJlZm9yZU1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCB9LFxuXHRcdFx0ICAgbG9vcDogZmFsc2UsXG5cdFx0XHQgICBrZXlib2FyZDogdHJ1ZSxcblx0XHRcdCAgIHJlc3BvbnNpdmVGYWxsYmFjazogNjAwLFxuXHRcdFx0ICAgZGlyZWN0aW9uOiBcInZlcnRpY2FsXCJcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBzZWN0aW9uID0gJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyk7XG5cdFx0XHRcdCRjb250YWluZXIubW92ZVRvKHNlY3Rpb24pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JGNvbnRhaW5lci5tb3ZlVG8oMik7XG5cdFx0XHR9KTtcblx0XHR9XG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcblx0XHRjb25zb2xlLmxvZyhcIiVjICAgKioqKiogTG9hZGVkICoqKioqKiAgIFwiLCAnYmFja2dyb3VuZC1jb2xvcjogIzBmMDsgY29sb3I6ICNmZmY7Jyk7XG59KTtcbiJdfQ==