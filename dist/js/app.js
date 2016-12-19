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
			onSnapFinish: function ($target) {
				var index = $target.data('panel');
				console.log('index, ', index);

				if (index == 4) {
					$('[data-item="1"]').trigger('click');
				}
			},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCJzbmFwVG8iLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJidXR0b24iLCJwYWdlIiwibGluayIsIm9wZW4iLCJzY3JvbGxUbyIsIiRjb250YWluZXIiLCIkbmF2TGluayIsImhlYWRlciIsImhlYWRlckNsYXNzIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGEiLCJzZWN0aW9uIiwib25BZnRlciIsImN1ckNsYXNzIiwiJGNvbnRpbnVlQnRuIiwib3B0aW9ucyIsIiRtZW51IiwicGFuZWxTZWxlY3RvciIsIm5hbWVzcGFjZSIsIm9uU25hcFN0YXJ0IiwiJHRhcmdldCIsIm9uU25hcEZpbmlzaCIsImNvbnNvbGUiLCJsb2ciLCJ0cmlnZ2VyIiwiZGlyZWN0aW9uVGhyZXNob2xkIiwic2xpZGVTcGVlZCIsImVhc2luZyIsIm9mZnNldCIsIm5hdmlnYXRpb24iLCJrZXlzIiwibmV4dEtleSIsInByZXZLZXkiLCJidXR0b25zIiwiJG5leHRCdXR0b24iLCIkcHJldkJ1dHRvbiIsIndy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Q3BEO0FBQ0EsR0FGRDtBQUdBO0FBOVBPLENBQVY7O0FBa1FBOzs7O0FBSUE3QyxFQUFFMkUsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7O0FBRTNCakYsS0FBSUMsSUFBSjtBQUNELENBSEQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXHRcdFx0dGhpcy5leHBhbmRlcigpO1xuXHRcdFx0dGhpcy5vdmVybGF5KCk7XG5cblx0XHRcdC8vIEluaXRpYWxpc2Ugc2Nyb2xsIG9uIGRlc2t0b3AgJiBhZGQgQ1NTXG5cdFx0XHRpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdkZXNrdG9wJykpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGlzZSBjYXJvdXNlbCAmIGhpc3RvcnkgY29tcG9uZW50c1xuXHRcdFx0XHR0aGlzLmNhcm91c2VsKCk7XG5cdFx0XHRcdHRoaXMuaGlzdG9yeSgpO1xuXHRcdFx0XHR0aGlzLnNuYXBUbygpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnY2Fyb3VzZWwnOiBmdW5jdGlvbiBjYXJvdXNlbCgpIHtcblx0XHRcdFx0dmFyICRjYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWxcIl0nKSxcblx0XHRcdFx0XHRcdCRjYXJvdXNlbE5hdiA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWwtbmF2XCJdJyk7XG5cblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0ICAgIHtcblx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWRlcyByZXNwb25kIHRvIG5hdlxuXHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcblxuXHRcdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGljayByZWluaXQgd2hlbiBicm93c2VyIHNpemUgaW5jcmVhc2VkICYgaXQgaXNuJ3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0XHR3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA4NjAgJiYgISRjYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuXG5cdFx0XHRcdFx0XHQvLyBEZXN0cm95IGFuZCByZWluaXQgc2xpY2tcblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygndW5zbGljaycpO1xuXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdleHBhbmRlcic6IGZ1bmN0aW9uIGV4cGFuZGVyKCl7XG5cdFx0XHR2YXIgJGl0ZW0gPSAkKCdbZGF0YS1qcz1cImV4cGFuZGVyXCJdJyksXG5cdFx0XHRcdFx0JHRyaWdnZXIgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyVHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRjb250ZW50ID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlckNvbnRlbnRcIl0nKTtcblxuXHRcdFx0JHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdoaXN0b3J5JzogZnVuY3Rpb24gaGlzdG9yeSgpIHtcblx0XHRcdHZhciAkaGlzdG9yeSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtc1wiXScpLFxuXHRcdFx0XHRcdCRoaXN0b3J5SXRlbSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtXCJdJyk7XG5cblx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2lzLXNtYWxsJyk7XG5cblx0XHRcdCRoaXN0b3J5SXRlbS5vbignY2xpY2sgbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggISQodGhpcykuaGFzQ2xhc3MoJ2lzLWxhcmdlJykgKSB7XG5cdFx0XHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb3ZlcmxheSc6IGZ1bmN0aW9uIG92ZXJsYXkoKSB7XG5cdFx0XHR2YXIgJHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheSA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5VHJpZ2dlciA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNsb3NlID0gJCgnW2RhdGEtanM9XCJjbG9zZU92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsID0gJCgnW2RhdGEtanM9XCJvdmVybGF5LWNhcm91c2VsXCJdJyk7XG5cblxuXHRcdFx0JG92ZXJsYXlUcmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBvdmVybGF5TnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLW92ZXJsYXknKTtcblx0XHRcdFx0JCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UuYWRkQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblxuXHRcdFx0XHQvLyBJbml0IGNhcm91c2VsIGlmIGl0IGhhcyBvbmVcblx0XHRcdFx0aWYgKCAkKCdbZGF0YS1vdmVybGF5bnVtYmVyPScrIG92ZXJsYXlOdW1iZXIgKyddJykuaGFzQ2xhc3MoJ2lzLWNhcm91c2VsJykpIHtcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdFx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IHtcblx0XHRcdFx0XHQgICAgICAgIGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0ICAgICAgICBkb3RzOiB0cnVlXG5cdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JG92ZXJsYXlDbG9zZS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkb3ZlcmxheS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLnJlbW92ZUNsYXNzKCdpcy1vdmVybGF5Jyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J21lbnUnOiBmdW5jdGlvbiBtZW51KCkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9ICQoJ1tkYXRhLWpzPVwibmF2YnV0dG9uXCJdJyksXG5cdFx0XHRcdFx0cGFnZSA9ICQoJ1tkYXRhLWpzPVwicGFnZVwiXScpLFxuXHRcdFx0XHRcdGxpbmsgPSAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cblx0XHRcdGJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAob3Blbikge1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYWdlLmFkZENsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRsaW5rLnJlbW92ZUNsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzY3JvbGxUbyc6IGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBpbmRleCA9ICAgJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyksXG5cdFx0XHRcdFx0XHRzZWN0aW9uID0gXCIjc2VjdGlvbjBcIiArIGluZGV4O1xuXG5cdFx0XHRcdC8vICRjb250YWluZXIubW92ZVRvKHNlY3Rpb24pO1xuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oc2VjdGlvbiwgNTAwLCB7XG5cdFx0XHRcdFx0b25BZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuIFx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0LyogQ29udGludWUgYnV0dG9uICovXG5cdFx0XHQkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdCQod2luZG93KS5zY3JvbGxUbyhcIiNzZWN0aW9uMDJcIiwgNTAwLCB7XG5cdFx0XHRcdFx0b25BZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuIFx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J3NuYXBUbyc6IGZ1bmN0aW9uIHNuYXBUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKSxcblx0XHRcdFx0XHQkY29udGludWVCdG4gPSAkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJyk7XG5cblxuXHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0JG1lbnU6ICQoJy5OYXZpZ2F0aW9uLWl0ZW1zJyksXG5cdFx0XHRcdFx0cGFuZWxTZWxlY3RvcjogJy5TZWN0aW9uJyxcblx0XHRcdFx0XHRuYW1lc3BhY2U6ICcucGFuZWxTbmFwJyxcblx0XHRcdFx0XHRvblNuYXBTdGFydDogZnVuY3Rpb24oJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gJHRhcmdldC5kYXRhKCdwYW5lbCcpO1xuXG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdFx0JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0JCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdFx0dmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdFx0aGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRvblNuYXBGaW5pc2g6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9ICR0YXJnZXQuZGF0YSgncGFuZWwnKTtcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdpbmRleCwgJywgaW5kZXgpO1xuXG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggPT0gNCkge1xuXHRcdFx0XHRcdFx0XHQkKCdbZGF0YS1pdGVtPVwiMVwiXScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRkaXJlY3Rpb25UaHJlc2hvbGQ6IDQwMCxcblx0XHRcdFx0XHRzbGlkZVNwZWVkOiA0MDAsXG5cdFx0XHRcdFx0ZWFzaW5nOiAnc3dpbmcnLFxuXHRcdFx0XHRcdG9mZnNldDogMCxcblx0XHRcdFx0XHRuYXZpZ2F0aW9uOiB7XG5cdFx0XHRcdFx0XHRrZXlzOiB7XG5cdFx0XHRcdFx0XHRcdG5leHRLZXk6IDQwLFxuXHRcdFx0XHRcdFx0XHRwcmV2S2V5OiAzOCxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRidXR0b25zOiB7XG5cdFx0XHRcdFx0XHRcdCRuZXh0QnV0dG9uOiAkY29udGludWVCdG4sXG5cdFx0XHRcdFx0XHRcdCRwcmV2QnV0dG9uOiBmYWxzZSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR3cmFwQXJvdW5kOiBmYWxzZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHQgICAgJCgnYm9keScpLnBhbmVsU25hcChvcHRpb25zKTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHQvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0Ly8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0pO1xuXHRcdH1cbn07XG5cblxuLyoqXG4gKiBTVEFSVCBQT0lOVFxuKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0XHRhcHAuaW5pdCgpO1xufSk7XG4iXX0=