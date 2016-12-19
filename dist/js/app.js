var app = {

	'init': function init() {
		this.menu();
		this.expander();
		this.overlay();
		// this.scrollTo();
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
			$menu: $('[data-js="navitems"]'),
			menuSelector: '.Navigation-link',
			panelSelector: '.Section',
			namespace: '.panelSnap',
			onSnapStart: function ($target) {
				var index = $target.data('section');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCJzbmFwVG8iLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJidXR0b24iLCJwYWdlIiwibGluayIsIm9wZW4iLCJvbmVwYWdlIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJvbmVwYWdlX3Njcm9sbCIsInNlY3Rpb25Db250YWluZXIiLCJlYXNpbmciLCJhbmltYXRpb25UaW1lIiwicGFnaW5hdGlvbiIsInVwZGF0ZVVSTCIsImJlZm9yZU1vdmUiLCJjdXJDbGFzcyIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzZWN0aW9uIiwiZGF0YSIsIm1vdmVUbyIsInNjcm9sbFRvIiwib25BZnRlciIsIiRjb250aW51ZUJ0biIsIm9wdGlvbnMiLCIkbWVudSIsIm1lbnVTZWxlY3RvciIsInBhbmVsU2VsZWN0b3IiLCJuYW1lc3BhY2UiLCJvblNuYXBTdGFydCIsIiR0YXJnZXQiLCJvblNuYXBGaW5pc2giLCJvbkFjdGl2YXRlIiwiZGlyZWN0aW9uVGhyZXNob2xkIiwic2xpZGVTcGVlZCIsIm9mZnNldCIsIm5hdmlnYXRpb24iLCJrZXlzIiwibmV4dEtleSIsInByZXZLZXkiLCJidXR0b25zIiwiJG5leHRCdXR0b24iLCIkcHJldkJ1dHRvbiIsIndyYXBBcm91bmQiLCJwYW5lbFNuYXAiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixPQUFLQyxJQUFMO0FBQ0EsT0FBS0MsUUFBTDtBQUNBLE9BQUtDLE9BQUw7QUFDQTtBQUNBLE9BQUtDLE1BQUw7O0FBRUE7QUFDQSxNQUFJQyxFQUFFLE1BQUYsRUFBVUMsUUFBVixDQUFtQixTQUFuQixDQUFKLEVBQW1DO0FBQ2xDO0FBQ0EsUUFBS0MsUUFBTDtBQUNBLFFBQUtDLE9BQUw7QUFDQTtBQUNELEVBZk87O0FBaUJSLGFBQVksU0FBU0QsUUFBVCxHQUFvQjtBQUM5QixNQUFJRSxZQUFZSixFQUFFLHNCQUFGLENBQWhCO0FBQUEsTUFDRUssZUFBZUwsRUFBRSwwQkFBRixDQURqQjs7QUFHQUksWUFBVUUsS0FBVixDQUFnQjtBQUNmQyxXQUFRLEtBRE87QUFFZkMsZUFBWSxDQUNUO0FBQ0VDLGdCQUFZLEdBRGQ7QUFFRUMsY0FBVTtBQUZaLElBRFM7QUFGRyxHQUFoQjs7QUFVQTtBQUNBTCxlQUFhTSxRQUFiLEdBQXdCQyxFQUF4QixDQUEyQixPQUEzQixFQUFvQyxZQUFVO0FBQzdDLE9BQUlDLFFBQVFiLEVBQUUsSUFBRixFQUFRYSxLQUFSLEVBQVo7O0FBRUFSLGdCQUFhTSxRQUFiLEdBQXdCRyxXQUF4QixDQUFvQyxXQUFwQztBQUNBZCxLQUFFLElBQUYsRUFBUWUsUUFBUixDQUFpQixXQUFqQjtBQUNBWCxhQUFVRSxLQUFWLENBQWdCLFdBQWhCLEVBQTZCTyxLQUE3QjtBQUNBLEdBTkQ7O0FBUUE7QUFDQUcsU0FB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LElBQUUsc0JBQUYsRUFBMEJZLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDLFVBQVM0QyxLQUFULEVBQWU7QUFDcEQ7QUFDQSxHQUZEO0FBR0E7QUFuU08sQ0FBVjs7QUF1U0E7Ozs7QUFJQXhELEVBQUVxRixRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0I1RixLQUFJQyxJQUFKO0FBQ0QsQ0FIRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cdFx0XHR0aGlzLmV4cGFuZGVyKCk7XG5cdFx0XHR0aGlzLm92ZXJsYXkoKTtcblx0XHRcdC8vIHRoaXMuc2Nyb2xsVG8oKTtcblx0XHRcdHRoaXMuc25hcFRvKCk7XG5cblx0XHRcdC8vIEluaXRpYWxpc2Ugc2Nyb2xsIG9uIGRlc2t0b3AgJiBhZGQgQ1NTXG5cdFx0XHRpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdkZXNrdG9wJykpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGlzZSBjYXJvdXNlbCAmIGhpc3RvcnkgY29tcG9uZW50c1xuXHRcdFx0XHR0aGlzLmNhcm91c2VsKCk7XG5cdFx0XHRcdHRoaXMuaGlzdG9yeSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnY2Fyb3VzZWwnOiBmdW5jdGlvbiBjYXJvdXNlbCgpIHtcblx0XHRcdFx0dmFyICRjYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWxcIl0nKSxcblx0XHRcdFx0XHRcdCRjYXJvdXNlbE5hdiA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWwtbmF2XCJdJyk7XG5cblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0ICAgIHtcblx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWRlcyByZXNwb25kIHRvIG5hdlxuXHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcblxuXHRcdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGljayByZWluaXQgd2hlbiBicm93c2VyIHNpemUgaW5jcmVhc2VkICYgaXQgaXNuJ3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0XHR3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA4NjAgJiYgISRjYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuXG5cdFx0XHRcdFx0XHQvLyBEZXN0cm95IGFuZCByZWluaXQgc2xpY2tcblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygndW5zbGljaycpO1xuXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdleHBhbmRlcic6IGZ1bmN0aW9uIGV4cGFuZGVyKCl7XG5cdFx0XHR2YXIgJGl0ZW0gPSAkKCdbZGF0YS1qcz1cImV4cGFuZGVyXCJdJyksXG5cdFx0XHRcdFx0JHRyaWdnZXIgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyVHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRjb250ZW50ID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlckNvbnRlbnRcIl0nKTtcblxuXHRcdFx0JHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdoaXN0b3J5JzogZnVuY3Rpb24gaGlzdG9yeSgpIHtcblx0XHRcdHZhciAkaGlzdG9yeSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtc1wiXScpLFxuXHRcdFx0XHRcdCRoaXN0b3J5SXRlbSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtXCJdJyk7XG5cblx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2lzLXNtYWxsJyk7XG5cblx0XHRcdCRoaXN0b3J5SXRlbS5vbignY2xpY2sgbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggISQodGhpcykuaGFzQ2xhc3MoJ2lzLWxhcmdlJykgKSB7XG5cdFx0XHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb3ZlcmxheSc6IGZ1bmN0aW9uIG92ZXJsYXkoKSB7XG5cdFx0XHR2YXIgJHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheSA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5VHJpZ2dlciA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNsb3NlID0gJCgnW2RhdGEtanM9XCJjbG9zZU92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsID0gJCgnW2RhdGEtanM9XCJvdmVybGF5LWNhcm91c2VsXCJdJyk7XG5cblxuXHRcdFx0JG92ZXJsYXlUcmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBvdmVybGF5TnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLW92ZXJsYXknKTtcblx0XHRcdFx0JCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UuYWRkQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblxuXHRcdFx0XHQvLyBJbml0IGNhcm91c2VsIGlmIGl0IGhhcyBvbmVcblx0XHRcdFx0aWYgKCAkKCdbZGF0YS1vdmVybGF5bnVtYmVyPScrIG92ZXJsYXlOdW1iZXIgKyddJykuaGFzQ2xhc3MoJ2lzLWNhcm91c2VsJykpIHtcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdFx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IHtcblx0XHRcdFx0XHQgICAgICAgIGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0ICAgICAgICBkb3RzOiB0cnVlXG5cdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JG92ZXJsYXlDbG9zZS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkb3ZlcmxheS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLnJlbW92ZUNsYXNzKCdpcy1vdmVybGF5Jyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J21lbnUnOiBmdW5jdGlvbiBtZW51KCkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9ICQoJ1tkYXRhLWpzPVwibmF2YnV0dG9uXCJdJyksXG5cdFx0XHRcdFx0cGFnZSA9ICQoJ1tkYXRhLWpzPVwicGFnZVwiXScpLFxuXHRcdFx0XHRcdGxpbmsgPSAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cblx0XHRcdGJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAob3Blbikge1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYWdlLmFkZENsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J29uZXBhZ2UnOiBmdW5jdGlvbiBvbmVwYWdlKCkge1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIik7XG5cblxuXHRcdFx0JGNvbnRhaW5lci5vbmVwYWdlX3Njcm9sbCh7XG5cdFx0XHRcdHNlY3Rpb25Db250YWluZXI6ICdbZGF0YS1qcz1cInNlY3Rpb25cIl0nLFxuXHRcdFx0ICAgZWFzaW5nOiBcImVhc2Utb3V0XCIsXG5cdFx0XHQgICBhbmltYXRpb25UaW1lOiA1MDAsXG5cdFx0XHQgICBwYWdpbmF0aW9uOiBmYWxzZSxcblx0XHRcdCAgIHVwZGF0ZVVSTDogZmFsc2UsXG5cdFx0XHQgICBiZWZvcmVNb3ZlOiBmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdCAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcblx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgfSxcblx0XHRcdCAgIGxvb3A6IGZhbHNlLFxuXHRcdFx0ICAga2V5Ym9hcmQ6IHRydWUsXG5cdFx0XHQgICByZXNwb25zaXZlRmFsbGJhY2s6IDYwMCxcblx0XHRcdCAgIGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiXG5cdFx0XHR9KTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgc2VjdGlvbiA9ICQodGhpcykuZGF0YSgnc2VjdGlvbicpO1xuXHRcdFx0XHQkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCRjb250YWluZXIubW92ZVRvKDIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzY3JvbGxUbyc6IGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBpbmRleCA9ICAgJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyksXG5cdFx0XHRcdFx0XHRzZWN0aW9uID0gXCIjc2VjdGlvbjBcIiArIGluZGV4O1xuXG5cdFx0XHRcdC8vICRjb250YWluZXIubW92ZVRvKHNlY3Rpb24pO1xuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oc2VjdGlvbiwgNTAwLCB7XG5cdFx0XHRcdFx0b25BZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuIFx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0LyogQ29udGludWUgYnV0dG9uICovXG5cdFx0XHQkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdCQod2luZG93KS5zY3JvbGxUbyhcIiNzZWN0aW9uMDJcIiwgNTAwLCB7XG5cdFx0XHRcdFx0b25BZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuIFx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J3NuYXBUbyc6IGZ1bmN0aW9uIHNuYXBUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKSxcblx0XHRcdFx0XHQkY29udGludWVCdG4gPSAkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJyk7XG5cblx0XHRcdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHRcdFx0JG1lbnU6ICQoJ1tkYXRhLWpzPVwibmF2aXRlbXNcIl0nKSxcblx0XHRcdFx0XHRcdFx0bWVudVNlbGVjdG9yOiAnLk5hdmlnYXRpb24tbGluaycsXG5cdFx0XHRcdCAgICAgIHBhbmVsU2VsZWN0b3I6ICcuU2VjdGlvbicsXG5cdFx0XHRcdCAgICAgIG5hbWVzcGFjZTogJy5wYW5lbFNuYXAnLFxuXHRcdFx0XHRcdFx0XHRvblNuYXBTdGFydDogZnVuY3Rpb24oJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0XHRcdHZhciBpbmRleCA9ICR0YXJnZXQuZGF0YSgnc2VjdGlvbicpO1xuXG5cdFx0XHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHRcdFx0XHQkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHRcdFx0JCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdFx0XHRoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cblx0XHRcdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdFx0XHRcdGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblxuXHRcdCAgICAgICAgICB9LFxuXHRcdFx0XHQgICAgICBvblNuYXBGaW5pc2g6IGZ1bmN0aW9uKCl7fSxcblx0XHRcdFx0ICAgICAgb25BY3RpdmF0ZTogZnVuY3Rpb24oKXt9LFxuXHRcdFx0XHQgICAgICBkaXJlY3Rpb25UaHJlc2hvbGQ6IDQwMCxcblx0XHRcdFx0ICAgICAgc2xpZGVTcGVlZDogNDAwLFxuXHRcdFx0XHQgICAgICBlYXNpbmc6ICdzd2luZycsXG5cdFx0XHRcdCAgICAgIG9mZnNldDogMCxcblx0XHRcdFx0ICAgICAgbmF2aWdhdGlvbjoge1xuXHRcdFx0XHRcdFx0XHRcdGtleXM6IHtcblx0XHRcdFx0XHRcdFx0XHRcdG5leHRLZXk6IDQwLFxuXHRcdFx0XHRcdFx0XHRcdFx0cHJldktleTogMzgsXG5cdFx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0ICAgICAgICBidXR0b25zOiB7XG5cdFx0XHRcdCAgICAgICAgICAkbmV4dEJ1dHRvbjogJGNvbnRpbnVlQnRuLFxuXHRcdFx0XHQgICAgICAgICAgJHByZXZCdXR0b246IGZhbHNlLFxuXHRcdFx0XHQgICAgICAgIH0sXG5cdFx0XHRcdCAgICAgICAgd3JhcEFyb3VuZDogZmFsc2Vcblx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHQgICAgfTtcblxuXHRcdCAgICAkKCdib2R5JykucGFuZWxTbmFwKG9wdGlvbnMpO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0LyogQ29udGludWUgYnV0dG9uICovXG5cdFx0XHQkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHQvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSk7XG5cdFx0fVxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG59KTtcbiJdfQ==