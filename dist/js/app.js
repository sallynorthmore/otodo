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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCJzbmFwVG8iLCJodWJBbmltYXRpb24iLCIkc2VjdGlvbiIsIiRob3VzZSIsIiRjYXJvdXNlbCIsIiRjYXJvdXNlbE5hdiIsInNsaWNrIiwiYXJyb3dzIiwicmVzcG9uc2l2ZSIsImJyZWFrcG9pbnQiLCJzZXR0aW5ncyIsImNoaWxkcmVuIiwib24iLCJpbmRleCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJ3aW5kb3ciLCJvbnJlc2l6ZSIsImlubmVyV2lkdGgiLCIkaXRlbSIsIiR0cmlnZ2VyIiwiZmluZCIsIiRjb250ZW50IiwicGFyZW50IiwidG9nZ2xlQ2xhc3MiLCIkaGlzdG9yeSIsIiRoaXN0b3J5SXRlbSIsIiRwYWdlIiwiJG92ZXJsYXkiLCIkb3ZlcmxheVRyaWdnZXIiLCIkb3ZlcmxheUNsb3NlIiwiJG92ZXJsYXlDYXJvdXNlbCIsIm92ZXJsYXlOdW1iZXIiLCJhdHRyIiwiZG90cyIsImV2ZW50IiwiY3VycmVudFNsaWRlIiwibmV4dFNsaWRlIiwicGFyZW50cyIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsInNjcm9sbFRvIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGEiLCJzZWN0aW9uIiwib25BZnRlciIsImN1ckNsYXNzIiwiJGNvbnRpbnVlQnRuIiwiJHBhcnRpY2lwYXRlQnRuIiwib3B0aW9ucyIsIiRtZW51IiwicGFuZWxTZWxlY3RvciIsIm5hbWVzcGFjZSIsIm9uU25hcFN0YXJ0IiwiJHRhcmdldCIsIm9uU25hcEZpbmlzaCIsInRyaWdnZXIiLCJkaXJlY3Rpb25UaHJlc2hvbGQiLCJzbGlkZVNwZWVkIiwiZWFzaW5nIiwib2Zmc2V0IiwibmF2aWdhdGlvbiIsImtleXMiLCJuZXh0S2V5IiwicHJldktleSIsImJ1dHRvbnMiLCIkbmV4dEJ1dHRvbiIsIiRwcmV2QnV0dG9uIiwid3JhcEFyb3VuZCIsInBhbmVsU25hcCIsImRvY3VtZW50IiwicmVhZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE1BQU07O0FBRVIsU0FBUSxTQUFTQyxJQUFULEdBQWdCO0FBQ3ZCLE9BQUtDLElBQUw7QUFDQSxPQUFLQyxRQUFMO0FBQ0EsT0FBS0MsT0FBTDs7QUFFQTtBQUNBLE1BQUlDLEVBQUUsTUFBRixFQUFVQyxRQUFWLENBQW1CLFNBQW5CLENBQUosRUFBbUM7QUFDbEM7QUFDQSxRQUFLQyxRQUFMO0FBQ0EsUUFBS0MsT0FBTDtBQUNBLFFBQUtDLE1BQUw7QUFDQSxRQUFLQyxZQUFMO0FBQ0E7QUFDRCxFQWZPOztBQWlCUixpQkFBZ0IsU0FBU0EsWUFBVCxHQUF1QjtBQUN0QyxNQUFJQyxXQUFXTixFQUFFLGtCQUFGLENBQWY7QUFBQSxNQUNFTyxTQUFTUCxFQUFFLG1CQUFGLENBRFg7QUFJQSxFQXRCTzs7QUF3QlIsYUFBWSxTQUFTRSxRQUFULEdBQW9CO0FBQzlCLE1BQUlNLFlBQVlSLEVBQUUsc0JBQUYsQ0FBaEI7QUFBQSxNQUNFUyxlQUFlVCxFQUFFLDBCQUFGLENBRGpCOztBQUdBUSxZQUFVRSxLQUFWLENBQWdCO0FBQ2ZDLFdBQVEsS0FETztBQUVmQyxlQUFZLENBQ1Q7QUFDRUMsZ0JBQVksR0FEZDtBQUVFQyxjQUFVO0FBRlosSUFEUztBQUZHLEdBQWhCOztBQVVBO0FBQ0FMLGVBQWFNLFFBQWIsR0FBd0JDLEVBQXhCLENBQTJCLE9BQTNCLEVBQW9DLFlBQVU7QUFDN0MsT0FBSUMsUUFBUWpCLEVBQUUsSUFBRixFQUFRaUIsS0FBUixFQUFaOztBQUVBUixnQkFBYU0sUUFBYixHQUF3QkcsV0FBeEIsQ0FBb0MsV0FBcEM7QUFDQWxCLEtBQUUsSUFBRixFQUFRbUIsUUFBUixDQUFpQixXQUFqQjtBQUNBWCxhQUFVRSxLQUFWLENBQWdCLFdBQWhCLEVB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QVo7O0FBRUEsUUFBSXBDLFNBQVMsQ0FBYixFQUFnQjtBQUNmakIsT0FBRSxpQkFBRixFQUFxQmtFLE9BQXJCLENBQTZCLE9BQTdCO0FBQ0E7QUFDRCxJQXZCVztBQXdCWkMsdUJBQW9CLENBeEJSO0FBeUJaQyxlQUFZLEdBekJBO0FBMEJaQyxXQUFRLE9BMUJJO0FBMkJaQyxXQUFRLENBM0JJO0FBNEJaQyxlQUFZO0FBQ1hDLFVBQU07QUFDTEMsY0FBUyxFQURKO0FBRUxDLGNBQVM7QUFGSixLQURLO0FBS1hDLGFBQVM7QUFDUkMsa0JBQWFuQixZQURMO0FBRVJvQixrQkFBYTtBQUZMLEtBTEU7QUFTWEMsZ0JBQVk7QUFURDtBQTVCQSxHQUFkOztBQXlDRTlFLElBQUUsTUFBRixFQUFVK0UsU0FBVixDQUFvQnBCLE9BQXBCO0FBQ0Y7QUFuUU8sQ0FBVjs7QUF1UUE7Ozs7QUFJQTNELEVBQUVnRixRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0J0RixLQUFJQyxJQUFKO0FBQ0QsQ0FIRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cdFx0XHR0aGlzLmV4cGFuZGVyKCk7XG5cdFx0XHR0aGlzLm92ZXJsYXkoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQvLyBpbml0aWFsaXNlIGNhcm91c2VsICYgaGlzdG9yeSBjb21wb25lbnRzXG5cdFx0XHRcdHRoaXMuY2Fyb3VzZWwoKTtcblx0XHRcdFx0dGhpcy5oaXN0b3J5KCk7XG5cdFx0XHRcdHRoaXMuc25hcFRvKCk7XG5cdFx0XHRcdHRoaXMuaHViQW5pbWF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdodWJBbmltYXRpb24nOiBmdW5jdGlvbiBodWJBbmltYXRpb24oKXtcblx0XHRcdHZhciAkc2VjdGlvbiA9ICQoJ1tkYXRhLXBhbmVsPVwiMlwiXScpLFxuXHRcdFx0XHRcdCRob3VzZSA9ICQoJ1tkYXRhLWpzPVwiaG91c2VcIl0nKTtcblxuXG5cdFx0fSxcblxuXHRcdCdjYXJvdXNlbCc6IGZ1bmN0aW9uIGNhcm91c2VsKCkge1xuXHRcdFx0XHR2YXIgJGNhcm91c2VsID0gJCgnW2RhdGEtanM9XCJjYXJvdXNlbFwiXScpLFxuXHRcdFx0XHRcdFx0JGNhcm91c2VsTmF2ID0gJCgnW2RhdGEtanM9XCJjYXJvdXNlbC1uYXZcIl0nKTtcblxuXHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHQgICAge1xuXHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpZGVzIHJlc3BvbmQgdG8gbmF2XG5cdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xuXG5cdFx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWNrIHJlaW5pdCB3aGVuIGJyb3dzZXIgc2l6ZSBpbmNyZWFzZWQgJiBpdCBpc24ndCBhbHJlYWR5IGluaXRpYWxpemVkXG5cdFx0XHRcdHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDg2MCAmJiAhJGNhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG5cblx0XHRcdFx0XHRcdC8vIERlc3Ryb3kgYW5kIHJlaW5pdCBzbGlja1xuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCd1bnNsaWNrJyk7XG5cblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRcdGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J2V4cGFuZGVyJzogZnVuY3Rpb24gZXhwYW5kZXIoKXtcblx0XHRcdHZhciAkaXRlbSA9ICQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJcIl0nKSxcblx0XHRcdFx0XHQkdHJpZ2dlciA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JGNvbnRlbnQgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyQ29udGVudFwiXScpO1xuXG5cdFx0XHQkdHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKFwiaXMtZXhwYW5kZWRcIik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J2hpc3RvcnknOiBmdW5jdGlvbiBoaXN0b3J5KCkge1xuXHRcdFx0dmFyICRoaXN0b3J5ID0gJCgnW2RhdGEtanM9XCJoaXN0b3J5LWl0ZW1zXCJdJyksXG5cdFx0XHRcdFx0JGhpc3RvcnlJdGVtID0gJCgnW2RhdGEtanM9XCJoaXN0b3J5LWl0ZW1cIl0nKTtcblxuXHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5hZGRDbGFzcygnaXMtc21hbGwnKTtcblxuXHRcdFx0JGhpc3RvcnlJdGVtLm9uKCdjbGljayBtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCAhJCh0aGlzKS5oYXNDbGFzcygnaXMtbGFyZ2UnKSApIHtcblx0XHRcdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb3ZlcmxheSc6IGZ1bmN0aW9uIG92ZXJsYXkoKSB7XG5cdFx0XHR2YXIgJHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheSA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5VHJpZ2dlciA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNsb3NlID0gJCgnW2RhdGEtanM9XCJjbG9zZU92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsID0gJCgnW2RhdGEtanM9XCJvdmVybGF5LWNhcm91c2VsXCJdJyk7XG5cblxuXHRcdFx0JG92ZXJsYXlUcmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBvdmVybGF5TnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLW92ZXJsYXknKTtcblx0XHRcdFx0JCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UuYWRkQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblxuXHRcdFx0XHQvLyBJbml0IGNhcm91c2VsIGlmIGl0IGhhcyBvbmVcblx0XHRcdFx0aWYgKCAkKCdbZGF0YS1vdmVybGF5bnVtYmVyPScrIG92ZXJsYXlOdW1iZXIgKyddJykuaGFzQ2xhc3MoJ2lzLWNhcm91c2VsJykpIHtcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdFx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IHtcblx0XHRcdFx0XHQgICAgICAgIGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0ICAgICAgICBkb3RzOiB0cnVlXG5cdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0Ly8gT24gYmVmb3JlIHNsaWRlIGNoYW5nZVxuXHRcdFx0XHRcdCRvdmVybGF5Q2Fyb3VzZWwub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xuXHRcdFx0XHRcdFx0aWYgKG5leHRTbGlkZSA9PSAxKSB7XG5cdFx0XHRcdFx0XHRcdCQodGhpcykucGFyZW50cygnLk92ZXJsYXktaW5uZXInKS5hZGRDbGFzcygnaXMtc2Vjb25kJyk7XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5PdmVybGF5LWlubmVyJykucmVtb3ZlQ2xhc3MoJ2lzLXNlY29uZCcpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JG92ZXJsYXlDbG9zZS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkb3ZlcmxheS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLnJlbW92ZUNsYXNzKCdpcy1vdmVybGF5Jyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J21lbnUnOiBmdW5jdGlvbiBtZW51KCkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9ICQoJ1tkYXRhLWpzPVwibmF2YnV0dG9uXCJdJyksXG5cdFx0XHRcdFx0cGFnZSA9ICQoJ1tkYXRhLWpzPVwicGFnZVwiXScpLFxuXHRcdFx0XHRcdGxpbmsgPSAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cblx0XHRcdGJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAob3Blbikge1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYWdlLmFkZENsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRsaW5rLnJlbW92ZUNsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzY3JvbGxUbyc6IGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBpbmRleCA9ICAgJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyksXG5cdFx0XHRcdFx0XHRzZWN0aW9uID0gXCIjc2VjdGlvbjBcIiArIGluZGV4O1xuXG5cdFx0XHRcdC8vICRjb250YWluZXIubW92ZVRvKHNlY3Rpb24pO1xuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oc2VjdGlvbiwgNTAwLCB7XG5cdFx0XHRcdFx0b25BZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuIFx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0LyogQ29udGludWUgYnV0dG9uICovXG5cdFx0XHQkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdCQod2luZG93KS5zY3JvbGxUbyhcIiNzZWN0aW9uMDJcIiwgNTAwLCB7XG5cdFx0XHRcdFx0b25BZnRlcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuIFx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuIFx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgIH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J3NuYXBUbyc6IGZ1bmN0aW9uIHNuYXBUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKSxcblx0XHRcdFx0XHQkY29udGludWVCdG4gPSAkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJyksXG5cdFx0XHRcdFx0JHBhcnRpY2lwYXRlQnRuID0gJCgnW2RhdGEtanM9XCJwYXJ0aWNpcGF0ZVwiXScpO1xuXG5cblx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdCRtZW51OiAkKCcuTmF2aWdhdGlvbi1pdGVtcycpLFxuXHRcdFx0XHRcdHBhbmVsU2VsZWN0b3I6ICcuU2VjdGlvbicsXG5cdFx0XHRcdFx0bmFtZXNwYWNlOiAnLnBhbmVsU25hcCcsXG5cdFx0XHRcdFx0b25TbmFwU3RhcnQ6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9ICR0YXJnZXQuZGF0YSgncGFuZWwnKTtcblxuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHRcdCQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdCQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHRoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHRcdHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcblx0XHRcdFx0XHRcdGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0b25TbmFwRmluaXNoOiBmdW5jdGlvbigkdGFyZ2V0KSB7XG5cdFx0XHRcdFx0XHR2YXIgaW5kZXggPSAkdGFyZ2V0LmRhdGEoJ3BhbmVsJyk7XG5cblx0XHRcdFx0XHRcdGlmIChpbmRleCA9PSA0KSB7XG5cdFx0XHRcdFx0XHRcdCQoJ1tkYXRhLWl0ZW09XCIxXCJdJykudHJpZ2dlcignY2xpY2snKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGRpcmVjdGlvblRocmVzaG9sZDogMCxcblx0XHRcdFx0XHRzbGlkZVNwZWVkOiA1MDAsXG5cdFx0XHRcdFx0ZWFzaW5nOiAnc3dpbmcnLFxuXHRcdFx0XHRcdG9mZnNldDogMCxcblx0XHRcdFx0XHRuYXZpZ2F0aW9uOiB7XG5cdFx0XHRcdFx0XHRrZXlzOiB7XG5cdFx0XHRcdFx0XHRcdG5leHRLZXk6IDQwLFxuXHRcdFx0XHRcdFx0XHRwcmV2S2V5OiAzOCxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRidXR0b25zOiB7XG5cdFx0XHRcdFx0XHRcdCRuZXh0QnV0dG9uOiAkY29udGludWVCdG4sXG5cdFx0XHRcdFx0XHRcdCRwcmV2QnV0dG9uOiBmYWxzZSxcblx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHR3cmFwQXJvdW5kOiBmYWxzZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fTtcblxuXHQgICAgJCgnYm9keScpLnBhbmVsU25hcChvcHRpb25zKTtcblx0XHR9XG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcbn0pO1xuIl19