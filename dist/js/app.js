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

		$historyItem.on('click', function () {
			if ($(this).hasClass('is-small')) {
				$history.children().addClass('is-small');
				$(this).removeClass('is-small');
			} else {
				$(this).addClass('is-small');
			}
		});
	},

	'overlay': function overlay() {
		var $page = $('[data-js="page"]'),
		    $overlay = $('[data-js="overlay"]'),
		    $overlayTrigger = $('[data-js="overlayTrigger"]'),
		    $overlayClose = $('[data-js="closeOverlay"]');

		$overlayTrigger.on('click', function () {
			var overlayNumber = $(this).attr('data-overlay');
			$('[data-overlaynumber=' + overlayNumber + ']').addClass('is-active');
			$page.addClass('is-overlay');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIm92ZXJsYXlOdW1iZXIiLCJhdHRyIiwiYnV0dG9uIiwicGFnZSIsImxpbmsiLCJvcGVuIiwib25lcGFnZSIsIiRjb250YWluZXIiLCIkbmF2TGluayIsImhlYWRlciIsImhlYWRlckNsYXNzIiwib25lcGFnZV9zY3JvbGwiLCJzZWN0aW9uQ29udGFpbmVyIiwiZWFzaW5nIiwiYW5pbWF0aW9uVGltZSIsInBhZ2luYXRpb24iLCJ1cGRhdGVVUkwiLCJiZWZvcmVNb3ZlIiwiY3VyQ2xhc3MiLCJsb29wIiwia2V5Ym9hcmQiLCJyZXNwb25zaXZlRmFsbGJhY2siLCJkaXJlY3Rpb24iLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwic2VjdGlvbiIsImRhdGEiLCJtb3ZlVG8iLCJkb2N1bWVudCIsInJlYWR5IiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsTUFBTTs7QUFFUixTQUFRLFNBQVNDLElBQVQsR0FBZ0I7QUFDdkIsT0FBS0MsSUFBTDtBQUNBLE9BQUtDLFFBQUw7QUFDQSxPQUFLQyxPQUFMOztBQUVB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QVksNkJBQVosRUFBMkMsc0NBQTNDO0FBQ0QsQ0FKRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cdFx0XHR0aGlzLmV4cGFuZGVyKCk7XG5cdFx0XHR0aGlzLm92ZXJsYXkoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQvLyBBZGQgb25lLXBhZ2Ugc2Nyb2xsIGNzcyAmIGpzXG5cdFx0XHRcdC8vICQoXCI8bGluay8+XCIsIHtcblx0XHRcdFx0Ly8gICAgcmVsOiBcInN0eWxlc2hlZXRcIixcblx0XHRcdFx0Ly8gICAgdHlwZTogXCJ0ZXh0L2Nzc1wiLFxuXHRcdFx0XHQvLyAgICBocmVmOiBcIi9jc3Mvb25lcGFnZS1zY3JvbGwuY3NzXCJcblx0XHRcdFx0Ly8gfSkuYXBwZW5kVG8oXCJoZWFkXCIpO1xuXHRcdFx0XHQvLyB0aGlzLm9uZXBhZ2UoKTtcblxuXHRcdFx0XHQvLyBpbml0aWFsaXNlIHNsaWNranNcblx0XHRcdFx0dGhpcy5jYXJvdXNlbCgpO1xuXHRcdFx0XHR0aGlzLmhpc3RvcnkoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J2Nhcm91c2VsJzogZnVuY3Rpb24gY2Fyb3VzZWwoKSB7XG5cdFx0XHRcdHZhciAkY2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsXCJdJyksXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdCAgICB7XG5cdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGlkZXMgcmVzcG9uZCB0byBuYXZcblx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpY2sgcmVpbml0IHdoZW4gYnJvd3NlciBzaXplIGluY3JlYXNlZCAmIGl0IGlzbid0IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdFx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gODYwICYmICEkY2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRGVzdHJveSBhbmQgcmVpbml0IHNsaWNrXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3Vuc2xpY2snKTtcblxuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnZXhwYW5kZXInOiBmdW5jdGlvbiBleHBhbmRlcigpe1xuXHRcdFx0dmFyICRpdGVtID0gJCgnW2RhdGEtanM9XCJleHBhbmRlclwiXScpLFxuXHRcdFx0XHRcdCR0cmlnZ2VyID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlclRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkY29udGVudCA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJDb250ZW50XCJdJyk7XG5cblx0XHRcdCR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnaGlzdG9yeSc6IGZ1bmN0aW9uIGhpc3RvcnkoKSB7XG5cdFx0XHR2YXIgJGhpc3RvcnkgPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbXNcIl0nKSxcblx0XHRcdFx0XHQkaGlzdG9yeUl0ZW0gPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbVwiXScpO1xuXG5cdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLmFkZENsYXNzKCdpcy1zbWFsbCcpO1xuXG5cdFx0XHQkaGlzdG9yeUl0ZW0ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCAkKHRoaXMpLmhhc0NsYXNzKCdpcy1zbWFsbCcpICkge1xuXHRcdFx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2lzLXNtYWxsJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtc21hbGwnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1zbWFsbCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdH0sXG5cblx0XHQnb3ZlcmxheSc6IGZ1bmN0aW9uIG92ZXJsYXkoKSB7XG5cdFx0XHR2YXIgJHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheSA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5VHJpZ2dlciA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNsb3NlID0gJCgnW2RhdGEtanM9XCJjbG9zZU92ZXJsYXlcIl0nKTtcblxuXHRcdFx0JG92ZXJsYXlUcmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBvdmVybGF5TnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLW92ZXJsYXknKTtcblx0XHRcdFx0JCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UuYWRkQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkb3ZlcmxheUNsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRvdmVybGF5LnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UucmVtb3ZlQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnbWVudSc6IGZ1bmN0aW9uIG1lbnUoKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnW2RhdGEtanM9XCJuYXZidXR0b25cIl0nKSxcblx0XHRcdFx0XHRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0bGluayA9ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblxuXHRcdFx0YnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChvcGVuKSB7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhZ2UuYWRkQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGluay5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb25lcGFnZSc6IGZ1bmN0aW9uIG9uZXBhZ2UoKSB7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXG5cdFx0XHQkY29udGFpbmVyLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogJ1tkYXRhLWpzPVwic2VjdGlvblwiXScsXG5cdFx0XHQgICBlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdCAgIGFuaW1hdGlvblRpbWU6IDUwMCxcblx0XHRcdCAgIHBhZ2luYXRpb246IGZhbHNlLFxuXHRcdFx0ICAgdXBkYXRlVVJMOiBmYWxzZSxcblx0XHRcdCAgIGJlZm9yZU1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCB9LFxuXHRcdFx0ICAgbG9vcDogZmFsc2UsXG5cdFx0XHQgICBrZXlib2FyZDogdHJ1ZSxcblx0XHRcdCAgIHJlc3BvbnNpdmVGYWxsYmFjazogNjAwLFxuXHRcdFx0ICAgZGlyZWN0aW9uOiBcInZlcnRpY2FsXCJcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBzZWN0aW9uID0gJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyk7XG5cdFx0XHRcdCRjb250YWluZXIubW92ZVRvKHNlY3Rpb24pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JGNvbnRhaW5lci5tb3ZlVG8oMik7XG5cdFx0XHR9KTtcblx0XHR9XG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcblx0XHRjb25zb2xlLmxvZyhcIiVjICAgKioqKiogTG9hZGVkICoqKioqKiAgIFwiLCAnYmFja2dyb3VuZC1jb2xvcjogIzBmMDsgY29sb3I6ICNmZmY7Jyk7XG59KTtcbiJdfQ==