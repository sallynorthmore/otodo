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

				if (index == 2) {
					$('[data-panel="2"]').addClass('is-animated');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCJzbmFwVG8iLCJodWJBbmltYXRpb24iLCIkc2VjdGlvbiIsIiRob3VzZSIsIiRjYXJvdXNlbCIsIiRjYXJvdXNlbE5hdiIsInNsaWNrIiwiYXJyb3dzIiwicmVzcG9uc2l2ZSIsImJyZWFrcG9pbnQiLCJzZXR0aW5ncyIsImNoaWxkcmVuIiwib24iLCJpbmRleCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJ3aW5kb3ciLCJvbnJlc2l6ZSIsImlubmVyV2lkdGgiLCIkaXRlbSIsIiR0cmlnZ2VyIiwiZmluZCIsIiRjb250ZW50IiwicGFyZW50IiwidG9nZ2xlQ2xhc3MiLCIkaGlzdG9yeSIsIiRoaXN0b3J5SXRlbSIsIiRwYWdlIiwiJG92ZXJsYXkiLCIkb3ZlcmxheVRyaWdnZXIiLCIkb3ZlcmxheUNsb3NlIiwiJG92ZXJsYXlDYXJvdXNlbCIsIm92ZXJsYXlOdW1iZXIiLCJhdHRyIiwiZG90cyIsImV2ZW50IiwiY3VycmVudFNsaWRlIiwibmV4dFNsaWRlIiwicGFyZW50cyIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsInNjcm9sbFRvIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGEiLCJzZWN0aW9uIiwib25BZnRlciIsImN1ckNsYXNzIiwiJGNvbnRpbnVlQnRuIiwiJHBhcnRpY2lwYXRlQnRuIiwib3B0aW9ucyIsIiRtZW51IiwicGFuZWxTZWxlY3RvciIsIm5hbWVzcGFjZSIsIm9uU25hcFN0YXJ0IiwiJHRhcmdldCIsIm9uU25hcEZpbmlzaCIsInRyaWdnZXIiLCJkaXJlY3Rpb25UaHJlc2hvbGQiLCJzbGlkZVNwZWVkIiwiZWFzaW5nIiwib2Zmc2V0IiwibmF2aWdhdGlvbiIsImtleXMiLCJuZXh0S2V5IiwicHJldktleSIsImJ1dHRvbnMiLCIkbmV4dEJ1dHRvbiIsIiRwcmV2QnV0dG9uIiwid3JhcEFyb3VuZCIsInBhbmVsU25hcCIsImRvY3VtZW50IiwicmVhZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE1BQU07O0FBRVIsU0FBUSxTQUFTQyxJQUFULEdBQWdCO0FBQ3ZCLE9BQUtDLElBQUw7QUFDQSxPQUFLQyxRQUFMO0FBQ0EsT0FBS0MsT0FBTDs7QUFFQTtBQUNBLE1BQUlDLEVBQUUsTUFBRixFQUFVQyxRQUFWLENBQW1CLFNBQW5CLENBQUosRUFBbUM7QUFDbEM7QUFDQSxRQUFLQyxRQUFMO0FBQ0EsUUFBS0MsT0FBTDtBQUNBLFFBQUtDLE1BQUw7QUFDQSxRQUFLQyxZQUFMO0FBQ0E7QUFDRCxFQWZPOztBQWlCUixpQkFBZ0IsU0FBU0EsWUFBVCxHQUF1QjtBQUN0QyxNQUFJQyxXQUFXTixFQUFFLGtCQUFGLENBQWY7QUFBQSxNQUNFTyxTQUFTUCxFQUFFLG1CQUFGLENBRFg7QUFJQSxFQXRCTzs7QUF3QlIsYUFBWSxTQUFTRSxRQUFULEdBQW9CO0FBQzlCLE1BQUlNLFlBQVlSLEVBQUUsc0JBQUYsQ0FBaEI7QUFBQSxNQUNFUyxlQUFlVCxFQUFFLDBCQUFGLENBRGpCOztBQUdBUSxZQUFVRSxLQUFWLENBQWdCO0FBQ2ZDLFdBQVEsS0FETztBQUVmQyxlQUFZLENBQ1Q7QUFDRUMsZ0JBQVksR0FEZDtBQUVFQyxjQUFVO0FBRlosSUFEUztBQUZHLEdBQWhCOztBQVVBO0FBQ0FMLGVBQWFNLFFBQWIsR0FBd0JDLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DLFlBQVU7QUFDN0MsT0FBSUMsUUFBUWpCLEVBQUUsSUFBRixFQUFRaUIsS0FBUixFQUFaOztBQUVBUixnQkFBYU0sUUFBYixHQUF3QkcsV0FBeEIsQ0FBb0MsV0FBcEM7QUFDQWxCLEtBQUUsSUFBRixFQUFRbUIsUUFBUixDQUFpQixXQUFqQjtBQUNBWCxhQUFVRSxLQUFWLENBQWdCLFdBQWhCLEVB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QVo7O0FBRUEsUUFBSXBDLFNBQVMsQ0FBYixFQUFnQjtBQUNmakIsT0FBRSxpQkFBRixFQUFxQmtFLE9BQXJCLENBQTZCLE9BQTdCO0FBQ0E7O0FBRUQsUUFBSWpELFNBQVMsQ0FBYixFQUFnQjtBQUNmakIsT0FBRSxrQkFBRixFQUFzQm1CLFFBQXRCLENBQStCLGFBQS9CO0FBQ0E7QUFDRCxJQTNCVztBQTRCWmdELHVCQUFvQixDQTVCUjtBQTZCWkMsZUFBWSxHQTdCQTtBQThCWkMsV0FBUSxPQTlCSTtBQStCWkMsV0FBUSxDQS9CSTtBQWdDWkMsZUFBWTtBQUNYQyxVQUFNO0FBQ0xDLGNBQVMsRUFESjtBQUVMQyxjQUFTO0FBRkosS0FESztBQUtYQyxhQUFTO0FBQ1JDLGtCQUFhbkIsWUFETDtBQUVSb0Isa0JBQWE7QUFGTCxLQUxFO0FBU1hDLGdCQUFZO0FBVEQ7QUFoQ0EsR0FBZDs7QUE2Q0U5RSxJQUFFLE1BQUYsRUFBVStFLFNBQVYsQ0FBb0JwQixPQUFwQjtBQUNGO0FBdlFPLENBQVY7O0FBMlFBOzs7O0FBSUEzRCxFQUFFZ0YsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7O0FBRTNCdEYsS0FBSUMsSUFBSjtBQUNELENBSEQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXHRcdFx0dGhpcy5leHBhbmRlcigpO1xuXHRcdFx0dGhpcy5vdmVybGF5KCk7XG5cblx0XHRcdC8vIEluaXRpYWxpc2Ugc2Nyb2xsIG9uIGRlc2t0b3AgJiBhZGQgQ1NTXG5cdFx0XHRpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdkZXNrdG9wJykpIHtcblx0XHRcdFx0Ly8gaW5pdGlhbGlzZSBjYXJvdXNlbCAmIGhpc3RvcnkgY29tcG9uZW50c1xuXHRcdFx0XHR0aGlzLmNhcm91c2VsKCk7XG5cdFx0XHRcdHRoaXMuaGlzdG9yeSgpO1xuXHRcdFx0XHR0aGlzLnNuYXBUbygpO1xuXHRcdFx0XHR0aGlzLmh1YkFuaW1hdGlvbigpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnaHViQW5pbWF0aW9uJzogZnVuY3Rpb24gaHViQW5pbWF0aW9uKCl7XG5cdFx0XHR2YXIgJHNlY3Rpb24gPSAkKCdbZGF0YS1wYW5lbD1cIjJcIl0nKSxcblx0XHRcdFx0XHQkaG91c2UgPSAkKCdbZGF0YS1qcz1cImhvdXNlXCJdJyk7XG5cblxuXHRcdH0sXG5cblx0XHQnY2Fyb3VzZWwnOiBmdW5jdGlvbiBjYXJvdXNlbCgpIHtcblx0XHRcdFx0dmFyICRjYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWxcIl0nKSxcblx0XHRcdFx0XHRcdCRjYXJvdXNlbE5hdiA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWwtbmF2XCJdJyk7XG5cblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0ICAgIHtcblx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWRlcyByZXNwb25kIHRvIG5hdlxuXHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcblxuXHRcdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGljayByZWluaXQgd2hlbiBicm93c2VyIHNpemUgaW5jcmVhc2VkICYgaXQgaXNuJ3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0XHR3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA4NjAgJiYgISRjYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuXG5cdFx0XHRcdFx0XHQvLyBEZXN0cm95IGFuZCByZWluaXQgc2xpY2tcblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygndW5zbGljaycpO1xuXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdleHBhbmRlcic6IGZ1bmN0aW9uIGV4cGFuZGVyKCl7XG5cdFx0XHR2YXIgJGl0ZW0gPSAkKCdbZGF0YS1qcz1cImV4cGFuZGVyXCJdJyksXG5cdFx0XHRcdFx0JHRyaWdnZXIgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyVHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRjb250ZW50ID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlckNvbnRlbnRcIl0nKTtcblxuXHRcdFx0JHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdoaXN0b3J5JzogZnVuY3Rpb24gaGlzdG9yeSgpIHtcblx0XHRcdHZhciAkaGlzdG9yeSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtc1wiXScpLFxuXHRcdFx0XHRcdCRoaXN0b3J5SXRlbSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtXCJdJyk7XG5cblx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2lzLXNtYWxsJyk7XG5cblx0XHRcdCRoaXN0b3J5SXRlbS5vbignY2xpY2sgbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggISQodGhpcykuaGFzQ2xhc3MoJ2lzLWxhcmdlJykgKSB7XG5cdFx0XHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J292ZXJsYXknOiBmdW5jdGlvbiBvdmVybGF5KCkge1xuXHRcdFx0dmFyICRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXkgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheVRyaWdnZXIgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDbG9zZSA9ICQoJ1tkYXRhLWpzPVwiY2xvc2VPdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheS1jYXJvdXNlbFwiXScpO1xuXG5cblx0XHRcdCRvdmVybGF5VHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgb3ZlcmxheU51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS1vdmVybGF5Jyk7XG5cdFx0XHRcdCQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLmFkZENsYXNzKCdpcy1vdmVybGF5Jyk7XG5cblx0XHRcdFx0Ly8gSW5pdCBjYXJvdXNlbCBpZiBpdCBoYXMgb25lXG5cdFx0XHRcdGlmICggJCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmhhc0NsYXNzKCdpcy1jYXJvdXNlbCcpKSB7XG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRcdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0ICAgICAgICBhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdCAgICAgICAgZG90czogdHJ1ZVxuXHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdC8vIE9uIGJlZm9yZSBzbGlkZSBjaGFuZ2Vcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcblx0XHRcdFx0XHRcdGlmIChuZXh0U2xpZGUgPT0gMSkge1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5PdmVybGF5LWlubmVyJykuYWRkQ2xhc3MoJ2lzLXNlY29uZCcpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuT3ZlcmxheS1pbm5lcicpLnJlbW92ZUNsYXNzKCdpcy1zZWNvbmQnKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCRvdmVybGF5Q2xvc2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5yZW1vdmVDbGFzcygnaXMtb3ZlcmxheScpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bGluay5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnc2Nyb2xsVG8nOiBmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaW5kZXggPSAgICQodGhpcykuZGF0YSgnc2VjdGlvbicpLFxuXHRcdFx0XHRcdFx0c2VjdGlvbiA9IFwiI3NlY3Rpb24wXCIgKyBpbmRleDtcblxuXHRcdFx0XHQvLyAkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKHNlY3Rpb24sIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oXCIjc2VjdGlvbjAyXCIsIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzbmFwVG8nOiBmdW5jdGlvbiBzbmFwVG8oKSB7XG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIiksXG5cdFx0XHRcdFx0JGNvbnRpbnVlQnRuID0gJCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLFxuXHRcdFx0XHRcdCRwYXJ0aWNpcGF0ZUJ0biA9ICQoJ1tkYXRhLWpzPVwicGFydGljaXBhdGVcIl0nKTtcblxuXG5cdFx0XHR2YXIgb3B0aW9ucyA9IHtcblx0XHRcdFx0XHQkbWVudTogJCgnLk5hdmlnYXRpb24taXRlbXMnKSxcblx0XHRcdFx0XHRwYW5lbFNlbGVjdG9yOiAnLlNlY3Rpb24nLFxuXHRcdFx0XHRcdG5hbWVzcGFjZTogJy5wYW5lbFNuYXAnLFxuXHRcdFx0XHRcdG9uU25hcFN0YXJ0OiBmdW5jdGlvbigkdGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5kZXggPSAkdGFyZ2V0LmRhdGEoJ3BhbmVsJyk7XG5cblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0XHQkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHQkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0aGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0XHR2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG5cdFx0XHRcdFx0XHRoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG9uU25hcEZpbmlzaDogZnVuY3Rpb24oJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gJHRhcmdldC5kYXRhKCdwYW5lbCcpO1xuXG5cdFx0XHRcdFx0XHRpZiAoaW5kZXggPT0gNCkge1xuXHRcdFx0XHRcdFx0XHQkKCdbZGF0YS1pdGVtPVwiMVwiXScpLnRyaWdnZXIoJ2NsaWNrJyk7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmIChpbmRleCA9PSAyKSB7XG5cdFx0XHRcdFx0XHRcdCQoJ1tkYXRhLXBhbmVsPVwiMlwiXScpLmFkZENsYXNzKCdpcy1hbmltYXRlZCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZGlyZWN0aW9uVGhyZXNob2xkOiAwLFxuXHRcdFx0XHRcdHNsaWRlU3BlZWQ6IDUwMCxcblx0XHRcdFx0XHRlYXNpbmc6ICdzd2luZycsXG5cdFx0XHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0XHRcdG5hdmlnYXRpb246IHtcblx0XHRcdFx0XHRcdGtleXM6IHtcblx0XHRcdFx0XHRcdFx0bmV4dEtleTogNDAsXG5cdFx0XHRcdFx0XHRcdHByZXZLZXk6IDM4LFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGJ1dHRvbnM6IHtcblx0XHRcdFx0XHRcdFx0JG5leHRCdXR0b246ICRjb250aW51ZUJ0bixcblx0XHRcdFx0XHRcdFx0JHByZXZCdXR0b246IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHdyYXBBcm91bmQ6IGZhbHNlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdCAgICAkKCdib2R5JykucGFuZWxTbmFwKG9wdGlvbnMpO1xuXHRcdH1cbn07XG5cblxuLyoqXG4gKiBTVEFSVCBQT0lOVFxuKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0XHRhcHAuaW5pdCgpO1xufSk7XG4iXX0=