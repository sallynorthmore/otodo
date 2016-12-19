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
	}
};

/**
 * START POINT
*/

$(document).ready(function () {

	app.init();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCJzbmFwVG8iLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCJlIiwiJHBhZ2UiLCIkb3ZlcmxheSIsIiRvdmVybGF5VHJpZ2dlciIsIiRvdmVybGF5Q2xvc2UiLCIkb3ZlcmxheUNhcm91c2VsIiwib3ZlcmxheU51bWJlciIsImF0dHIiLCJkb3RzIiwiYnV0dG9uIiwicGFnZSIsImxpbmsiLCJvcGVuIiwic2Nyb2xsVG8iLCIkY29udGFpbmVyIiwiJG5hdkxpbmsiLCJoZWFkZXIiLCJoZWFkZXJDbGFzcyIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJkYXRhIiwic2VjdGlvbiIsIm9uQWZ0ZXIiLCJjdXJDbGFzcyIsIiRjb250aW51ZUJ0biIsIiRwYXJ0aWNpcGF0ZUJ0biIsIm9wdGlvbnMiLCIkbWVudSIsInBhbmVsU2VsZWN0b3IiLCJuYW1lc3BhY2UiLCJvblNuYXBTdGFydCIsIiR0YXJnZXQiLCJvblNuYXBGaW5pc2giLCJ0cmlnZ2VyIiwiZGlyZWN0aW9uVGhyZXNob2xkIiwic2xpZGVTcGVlZCIsImVhc2luZyIsIm9mZnNldCIsIm5hdmlnYXRpb24iLCJrZXlzIiwibmV4dEtleSIsInByZXZLZXkiLCJidXR0b25zIiwiJG5leHRCdXR0b24iLCIkcHJldkJ1dHRvbiIsIndyYXBBcm91bmQiLCJwYW5lbFNuYXAiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixPQUFLQyxJQUFMO0FBQ0EsT0FBS0MsUUFBTDtBQUNBLE9BQUtDLE9BQUw7O0FBRUE7QUFDQSxNQUFJQyxFQUFFLE1BQUYsRUFBVUMsUUFBVixDQUFtQixTQUFuQixDQUFKLEVBQW1DO0FBQ2xDO0FBQ0EsUUFBS0MsUUFBTDtBQUNBLFFBQUtDLE9BQUw7QUFDQSxRQUFLQyxNQUFMO0FBQ0E7QUFDRCxFQWRPOztBQWdCUixhQUFZLFNBQVNGLFFBQVQsR0FBb0I7QUFDOUIsTUFBSUcsWUFBWUwsRUFBRSxzQkFBRixDQUFoQjtBQUFBLE1BQ0VNLGVBQWVOLEVBQUUsMEJBQUYsQ0FEakI7O0FBR0FLLFlBQVVFLEtBQVYsQ0FBZ0I7QUFDZkMsV0FBUSxLQURPO0FBRWZDLGVBQVksQ0FDVDtBQUNFQyxnQkFBWSxHQURkO0FBRUVDLGNBQVU7QUFGWixJQURTO0FBRkcsR0FBaEI7O0FBVUE7QUFDQUwsZUFBYU0sUUFBYixHQUF3QkMsRUFBeEIsQ0FBMkIsT0FBM0IsRUFBb0MsWUFBVTtBQUM3QyxPQUFJQyxRQUFRZCxFQUFFLElBQUYsRUFBUWMsS0FBUixFQUFaOztBQUVBUixnQkFBYU0sUUFBYixHQUF3QkcsV0FBeEIsQ0FBb0MsV0FBcEM7QUFDQWYsS0FBRSxJQUFGLEVBQVFnQixRQUFSLENBQWlCLFdBQWpCO0FBQ0FYLGFBQVVFLEtBQVYsQ0FBZ0IsV0FBaEIsRUFBNkJPLEtBQTdCO0FBQ0EsR0FORDs7QUFRQTtBQUNBRyxTQUFPQyxRQUFQLEdBQWtCLFlBQVc7O0FBRTVCLE9BQUlELE9BQU9FLFVBQVAsSUFBcUIsR0FBckIsSUFBNEIsQ0FBQ2QsVUFBVUosUUFBVixDQUFtQixtQkFBbkIsQ0FBakMsRUFBMEU7O0FBRXpFO0FBQ0FJLGNBQVVFLEtBQVYsQ0FBZ0IsU0FBaEI7O0FBRUFGLGNBQVVFLEtBQVYsQ0FBZ0I7QUFDZkMsYUFBUSxLQURPO0FBRWZDLGlCQUFZLENBQ1Q7QUFDRUMsa0JBQVksR0FEZDtBQUVFQyxnQkFBVTtBQUZaLE1BRFM7QUFGRyxLQUFoQjtBQVNBO0FBQ0QsR0FqQkQ7QUFrQkQsRUExRE87O0FBNERSLGFBQVksU0FBU2IsUUFBVCxHQUFtQjtBQUM5QixNQUFJc0IsUUFBUXBCLEVBQUUsc0JBQUYsQ0FBWjtBQUFBLE1BQ0VxQixXQUFXRCxNQUFNRSxJQUFOLENBQVcsNkJBQVgsQ0FEYjtBQUFBLE1BRUVDLFdBQVdILE1BQU1FLElBQU4sQ0FBVyw2QkFBWCxDQUZiOztBQUlBRCxXQUFTUixFQUFULENBQVksT0FBWixFQUFxQixZQUFVO0FBQzlCYixLQUFFLElBQUYsRUFBUXdCLE1BQVIsR0FBaUJDLFdBQWpCLENBQTZCLGFBQTdCO0FBQ0EsR0FGRDtBQUdBLEVBcEVPOztBQXNFUixZQUFXLFNBQVN0QixPQUFULEdBQW1CO0FBQzdCLE1BQUl1QixXQUFXMUIsRUFBRSwyQkFBRixDQUFmO0FBQUEsTUFDRTJCLGVBQWUzQixFQUFFLDBCQUFGLENBRGpCOztBQUdBMEIsV0FBU2QsUUFBVCxHQUFvQkksUUFBcEIsQ0FBNkIsVUFBN0I7O0FBRUFXLGVBQWFkLEVBQWIsQ0FBZ0Isa0JBQWhCLEVBQW9DLFlBQVU7QUFDN0MsT0FBSyxDQUFDYixFQUFFLElBQUYsRUFBUUMsUUFBUixDQUFpQixVQUFqQixDQUFOLEVBQXFDO0FBQ3BDeUIsYUFBU2QsUUFBVCxHQUFvQkcsV0FBcEIsQ0FBZ0MsVUFBaEM7QUFDQWYsTUFBRSxJQUFGLEVBQVFnQixRQUFSLENBQWlCLFVBQWpCO0FBQ0EsSUFIRCxNQUdPO0FBQ047QUFDQTtBQUNELEdBUEQ7O0FBU0FoQixJQUFFLENBQUMsdUJBQUQsQ0FBRixFQUE2QmEsRUFBN0IsQ0FBZ0MsT0FBaEMsRUFBeUMsVUFBU2UsQ0FBVCxFQUFXLENBRW5ELENBRkQ7QUFHQSxFQXhGTzs7QUEwRlIsWUFBVyxTQUFTN0IsT0FBVCxHQUFtQjtBQUM3QixNQUFJOEIsUUFBUTdCLEVBQUUsa0JBQUYsQ0FBWjtBQUFBLE1BQ0U4QixXQUFXOUIsRUFBRSxxQkFBRixDQURiO0FBQUEsTUFFRStCLGtCQUFrQi9CLEVBQUUsNEJBQUYsQ0FGcEI7QUFBQSxNQUdFZ0MsZ0JBQWdCaEMsRUFBRSwwQkFBRixDQUhsQjtBQUFBLE1BSUVpQyxtQkFBbUJqQyxFQUFFLDhCQUFGLENBSnJCOztBQU9BK0Isa0JBQWdCbEIsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsWUFBVTtBQUNyQyxPQUFJcUIsZ0JBQWdCbEMsRUFBRSxJQUFGLEVBQVFtQyxJQUFSLENBQWEsY0FBYixDQUFwQjtBQUNBbkMsS0FBRSx5QkFBd0JrQyxhQUF4QixHQUF1QyxHQUF6QyxFQUE4Q2xCLFFBQTlDLENBQXVELFdBQXZEO0FBQ0FhLFNBQU1iLFFBQU4sQ0FBZSxZQUFmOztBQUVBO0FBQ0EsT0FBS2hCLEVBQUUseUJBQXdCa0MsYUFBeEIsR0FBdUMsR0FBekMsRUFBOENqQyxRQUE5QyxDQUF1RCxhQUF2RCxDQUFMLEVBQTRFO0FBQzNFZ0MscUJBQWlCMUIsS0FBakIsQ0FBdUI7QUFDdEJDLGFBQVEsSUFEYztBQUV0QjRCLFdBQU0sSUFGZ0I7QUFHdEIzQixpQkFBWSxDQUNUO0FBQ0VDLGtCQUFZLEdBRGQ7QUFFRUMsZ0JBQVU7QUFDUkgsZUFBUSxLQURBO0FBRVI0QixhQUFNO0FBRkU7QUFGWixNQURTO0FBSFUsS0FBdkI7QUFhQTtBQUNELEdBckJEOztBQXVCQUosZ0JBQWNuQixFQUFkLENBQWlCLE9BQWpCLEVBQTBCLFlBQVU7QUFDbkNpQixZQUFTZixXQUFULENBQXFCLFdBQXJCO0FBQ0FjLFNBQU1kLFdBQU4sQ0FBa0IsWUFBbEI7QUFDQSxHQUhEO0FBSUEsRUE3SE87O0FBK0hSLFNBQVEsU0FBU2xCLElBQVQsR0FBZ0I7QUFDdkIsTUFBSXdDLFNBQVNyQyxFQUFFLHVCQUFGLENBQWI7QUFBQSxNQUNFc0MsT0FBT3RDLEVBQUUsa0JBQUYsQ0FEVDtBQUFBLE1BRUV1QyxPQUFPdkMsRUFBRSxxQkFBRixDQUZUO0FBQUEsTUFHRXdDLE9BQU8sS0FIVDs7QUFLQUgsU0FBT3hCLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLFlBQVU7QUFDNUIsT0FBSTJCLElBQUosRUFBVTtBQUNURixTQUFLdkIsV0FBTCxDQUFpQixTQUFqQjtBQUNBeUIsV0FBTyxLQUFQO0FBQ0EsSUFIRCxNQUdPO0FBQ05GLFNBQUt0QixRQUFMLENBQWMsU0FBZDtBQUNBd0IsV0FBTyxJQUFQO0FBQ0E7QUFDRCxHQVJEOztBQVVBRCxPQUFLMUIsRUFBTCxDQUFRLE9BQVIsRUFBaUIsWUFBVTtBQUN6QjBCLFFBQUt4QixXQUFMLENBQWlCLFdBQWpCO0FBQ0FmLEtBQUUsSUFBRixFQUFRZ0IsUUFBUixDQUFpQixXQUFqQjtBQUNBc0IsUUFBS3ZCLFdBQUwsQ0FBaUIsU0FBakI7QUFDQXlCLFVBQU8sS0FBUDtBQUNELEdBTEQ7QUFNQSxFQXJKTzs7QUF1SlIsYUFBWSxTQUFTQyxRQUFULEdBQW9CO0FBQy9CLE1BQUlDLGFBQWExQyxFQUFFLG9CQUFGLENBQWpCO0FBQUEsTUFDRTJDLFdBQVUzQyxFQUFFLHFCQUFGLENBRFo7QUFBQSxNQUVFNEMsU0FBUzVDLEVBQUUsb0JBQUYsQ0FGWDtBQUFBLE1BR0k2QyxjQUFjN0MsRUFBRSxvQkFBRixFQUF3Qm1DLElBQXhCLENBQTZCLE9BQTdCLENBSGxCOztBQUtBO0FBQ0FRLFdBQVM5QixFQUFULENBQVksT0FBWixFQUFxQixVQUFTaUMsS0FBVCxFQUFlO0FBQ25DQSxTQUFNQyxjQUFOO0FBQ0EsT0FBSWpDLFFBQVVkLEVBQUUsSUFBRixFQUFRZ0QsSUFBUixDQUFhLFNBQWIsQ0FBZDtBQUFBLE9BQ0VDLFVBQVUsY0FBY25DLEtBRDFCOztBQUdBO0FBQ0FkLEtBQUVpQixNQUFGLEVBQVV3QixRQUFWLENBQW1CUSxPQUFuQixFQUE0QixHQUE1QixFQUFpQztBQUNoQ0MsYUFBUyxZQUFXO0FBQ25CO0FBQ0NsRCxPQUFFLHFCQUFGLEVBQXlCZSxXQUF6QixDQUFxQyxXQUFyQztBQUNBZixPQUFFLG9CQUFvQmMsS0FBcEIsR0FBMkIsSUFBN0IsRUFBbUNFLFFBQW5DLENBQTRDLFdBQTVDO0FBQ0E0QixZQUFPVCxJQUFQLENBQVksT0FBWixFQUFxQlUsV0FBckI7O0FBRUE7QUFDQSxTQUFJTSxXQUFXTixjQUFjLE1BQWQsR0FBdUIvQixLQUF0QztBQUNBOEIsWUFBT1QsSUFBUCxDQUFZLE9BQVosRUFBcUJnQixRQUFyQjtBQUNBO0FBVjhCLElBQWpDO0FBWUEsR0FsQkQ7O0FBb0JBO0FBQ0FuRCxJQUFFLHNCQUFGLEVBQTBCYSxFQUExQixDQUE2QixPQUE3QixFQUFzQyxVQUFTaUMsS0FBVCxFQUFlO0FBQ3BEQSxTQUFNQyxjQUFOOztBQUVBL0MsS0FBRWlCLE1BQUYsRUFBVXdCLFFBQVYsQ0FBbUIsWUFBbkIsRUFBaUMsR0FBakMsRUFBc0M7QUFDckNTLGFBQVMsWUFBVztBQUNuQjtBQUNDbEQsT0FBRSxxQkFBRixFQUF5QmUsV0FBekIsQ0FBcUMsV0FBckM7QUFDQWYsT0FBRSxvQkFBb0JjLEtBQXBCLEdBQTJCLElBQTdCLEVBQW1DRSxRQUFuQyxDQUE0QyxXQUE1QztBQUNBNEIsWUFBT1QsSUFBUCxDQUFZLE9BQVosRUFBcUJVLFdBQXJCOztBQUVBO0FBQ0EsU0FBSU0sV0FBV04sY0FBYyxNQUFkLEdBQXVCL0IsS0FBdEM7QUFDQThCLFlBQU9ULElBQVAsQ0FBWSxPQUFaLEVBQXFCZ0IsUUFBckI7QUFDQTtBQVZtQyxJQUF0QztBQVlBLEdBZkQ7QUFnQkEsRUFuTU87O0FBcU1SLFdBQVUsU0FBUy9DLE1BQVQsR0FBa0I7QUFDM0IsTUFBSXNDLGFBQWExQyxFQUFFLG9CQUFGLENBQWpCO0FBQUEsTUFDRTJDLFdBQVUzQyxFQUFFLHFCQUFGLENBRFo7QUFBQSxNQUVFNEMsU0FBUzVDLEVBQUUsb0JBQUYsQ0FGWDtBQUFBLE1BR0k2QyxjQUFjN0MsRUFBRSxvQkFBRixFQUF3Qm1DLElBQXhCLENBQTZCLE9BQTdCLENBSGxCO0FBQUEsTUFJRWlCLGVBQWVwRCxFQUFFLHNCQUFGLENBSmpCO0FBQUEsTUFLRXFELGtCQUFrQnJELEVBQUUseUJBQUYsQ0FMcEI7O0FBUUEsTUFBSXNELFVBQVU7QUFDWkMsVUFBT3ZELEVBQUUsbUJBQUYsQ0FESztBQUVad0Qsa0JBQWUsVUFGSDtBQUdaQyxjQUFXLFlBSEM7QUFJWkMsZ0JBQWEsVUFBU0MsT0FBVCxFQUFrQjtBQUM5QixRQUFJN0MsUUFBUTZDLFFBQVFYLElBQVIsQ0FBYSxPQUFiLENBQVo7O0FBRUE7QUFDQWhELE1BQUUscUJBQUYsRUFBeUJlLFdBQXpCLENBQXFDLFdBQXJDO0FBQ0FmLE1BQUUsb0JBQW9CYyxLQUFwQixHQUEyQixJQUE3QixFQUFtQ0UsUUFBbkMsQ0FBNEMsV0FBNUM7QUFDQTRCLFdBQU9ULElBQVAsQ0FBWSxPQUFaLEVBQXFCVSxXQUFyQjs7QUFFQTtBQUNBLFFBQUlNLFdBQVdOLGNBQWMsTUFBZCxHQUF1Qi9CLEtBQXRDO0FBQ0E4QixXQUFPVCxJQUFQLENBQVksT0FBWixFQUFxQmdCLFFBQXJCO0FBRUEsSUFoQlc7QUFpQlpTLGlCQUFjLFVBQVNELE9BQVQsRUFBa0I7QUFDL0IsUUFBSTdDLFFBQVE2QyxRQUFRWCxJQUFSLENBQWEsT0FBYixDQUFaOztBQUVBLFFBQUlsQyxTQUFTLENBQWIsRUFBZ0I7QUFDZmQsT0FBRSxpQkFBRixFQUFxQjZELE9BQXJCLENBQTZCLE9BQTdCO0FBQ0E7QUFDRCxJQXZCVztBQXdCWkMsdUJBQW9CLEdBeEJSO0FBeUJaQyxlQUFZLEdBekJBO0FBMEJaQyxXQUFRLE9BMUJJO0FBMkJaQyxXQUFRLENBM0JJO0FBNEJaQyxlQUFZO0FBQ1hDLFVBQU07QUFDTEMsY0FBUyxFQURKO0FBRUxDLGNBQVM7QUFGSixLQURLO0FBS1hDLGFBQVM7QUFDUkMsa0JBQWFuQixZQURMO0FBRVJvQixrQkFBYTtBQUZMLEtBTEU7QUFTWEMsZ0JBQVk7QUFURDtBQTVCQSxHQUFkOztBQXlDRXpFLElBQUUsTUFBRixFQUFVMEUsU0FBVixDQUFvQnBCLE9BQXBCO0FBQ0Y7QUF4UE8sQ0FBVjs7QUE0UEE7Ozs7QUFJQXRELEVBQUUyRSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0JqRixLQUFJQyxJQUFKO0FBQ0QsQ0FIRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cdFx0XHR0aGlzLmV4cGFuZGVyKCk7XG5cdFx0XHR0aGlzLm92ZXJsYXkoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQvLyBpbml0aWFsaXNlIGNhcm91c2VsICYgaGlzdG9yeSBjb21wb25lbnRzXG5cdFx0XHRcdHRoaXMuY2Fyb3VzZWwoKTtcblx0XHRcdFx0dGhpcy5oaXN0b3J5KCk7XG5cdFx0XHRcdHRoaXMuc25hcFRvKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdjYXJvdXNlbCc6IGZ1bmN0aW9uIGNhcm91c2VsKCkge1xuXHRcdFx0XHR2YXIgJGNhcm91c2VsID0gJCgnW2RhdGEtanM9XCJjYXJvdXNlbFwiXScpLFxuXHRcdFx0XHRcdFx0JGNhcm91c2VsTmF2ID0gJCgnW2RhdGEtanM9XCJjYXJvdXNlbC1uYXZcIl0nKTtcblxuXHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHQgICAge1xuXHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRdXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpZGVzIHJlc3BvbmQgdG8gbmF2XG5cdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xuXG5cdFx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWNrIHJlaW5pdCB3aGVuIGJyb3dzZXIgc2l6ZSBpbmNyZWFzZWQgJiBpdCBpc24ndCBhbHJlYWR5IGluaXRpYWxpemVkXG5cdFx0XHRcdHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0XHRcdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDg2MCAmJiAhJGNhcm91c2VsLmhhc0NsYXNzKCdzbGljay1pbml0aWFsaXplZCcpKSB7XG5cblx0XHRcdFx0XHRcdC8vIERlc3Ryb3kgYW5kIHJlaW5pdCBzbGlja1xuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCd1bnNsaWNrJyk7XG5cblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRcdGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J2V4cGFuZGVyJzogZnVuY3Rpb24gZXhwYW5kZXIoKXtcblx0XHRcdHZhciAkaXRlbSA9ICQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJcIl0nKSxcblx0XHRcdFx0XHQkdHJpZ2dlciA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JGNvbnRlbnQgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyQ29udGVudFwiXScpO1xuXG5cdFx0XHQkdHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLnRvZ2dsZUNsYXNzKFwiaXMtZXhwYW5kZWRcIik7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J2hpc3RvcnknOiBmdW5jdGlvbiBoaXN0b3J5KCkge1xuXHRcdFx0dmFyICRoaXN0b3J5ID0gJCgnW2RhdGEtanM9XCJoaXN0b3J5LWl0ZW1zXCJdJyksXG5cdFx0XHRcdFx0JGhpc3RvcnlJdGVtID0gJCgnW2RhdGEtanM9XCJoaXN0b3J5LWl0ZW1cIl0nKTtcblxuXHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5hZGRDbGFzcygnaXMtc21hbGwnKTtcblxuXHRcdFx0JGhpc3RvcnlJdGVtLm9uKCdjbGljayBtb3VzZWVudGVyJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCAhJCh0aGlzKS5oYXNDbGFzcygnaXMtbGFyZ2UnKSApIHtcblx0XHRcdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gJCh0aGlzKS5yZW1vdmVDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoWydkYXRhLWpzPVwicGFydGljaXBhdGVcIiddKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcblxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdvdmVybGF5JzogZnVuY3Rpb24gb3ZlcmxheSgpIHtcblx0XHRcdHZhciAkcGFnZSA9ICQoJ1tkYXRhLWpzPVwicGFnZVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5ID0gJCgnW2RhdGEtanM9XCJvdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlUcmlnZ2VyID0gJCgnW2RhdGEtanM9XCJvdmVybGF5VHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5Q2xvc2UgPSAkKCdbZGF0YS1qcz1cImNsb3NlT3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5Q2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXktY2Fyb3VzZWxcIl0nKTtcblxuXG5cdFx0XHQkb3ZlcmxheVRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG92ZXJsYXlOdW1iZXIgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3ZlcmxheScpO1xuXHRcdFx0XHQkKCdbZGF0YS1vdmVybGF5bnVtYmVyPScrIG92ZXJsYXlOdW1iZXIgKyddJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5hZGRDbGFzcygnaXMtb3ZlcmxheScpO1xuXG5cdFx0XHRcdC8vIEluaXQgY2Fyb3VzZWwgaWYgaXQgaGFzIG9uZVxuXHRcdFx0XHRpZiAoICQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5oYXNDbGFzcygnaXMtY2Fyb3VzZWwnKSkge1xuXHRcdFx0XHRcdCRvdmVybGF5Q2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0YXJyb3dzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZG90czogdHJ1ZSxcblx0XHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHQgICAgICBzZXR0aW5nczoge1xuXHRcdFx0XHRcdCAgICAgICAgYXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHQgICAgICAgIGRvdHM6IHRydWVcblx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkb3ZlcmxheUNsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRvdmVybGF5LnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UucmVtb3ZlQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnbWVudSc6IGZ1bmN0aW9uIG1lbnUoKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnW2RhdGEtanM9XCJuYXZidXR0b25cIl0nKSxcblx0XHRcdFx0XHRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0bGluayA9ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblxuXHRcdFx0YnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChvcGVuKSB7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhZ2UuYWRkQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGluay5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGxpbmsucmVtb3ZlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J3Njcm9sbFRvJzogZnVuY3Rpb24gc2Nyb2xsVG8oKSB7XG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIik7XG5cblx0XHRcdC8qIFNsaWRlIHRvIHNlY3Rpb24gb24gbmF2IGxpbmsgY2xpY2sgKi9cblx0XHRcdCRuYXZMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIGluZGV4ID0gICAkKHRoaXMpLmRhdGEoJ3NlY3Rpb24nKSxcblx0XHRcdFx0XHRcdHNlY3Rpb24gPSBcIiNzZWN0aW9uMFwiICsgaW5kZXg7XG5cblx0XHRcdFx0Ly8gJGNvbnRhaW5lci5tb3ZlVG8oc2VjdGlvbik7XG5cdFx0XHRcdCQod2luZG93KS5zY3JvbGxUbyhzZWN0aW9uLCA1MDAsIHtcblx0XHRcdFx0XHRvbkFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG4gXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCB2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKFwiI3NlY3Rpb24wMlwiLCA1MDAsIHtcblx0XHRcdFx0XHRvbkFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG4gXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCB2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnc25hcFRvJzogZnVuY3Rpb24gc25hcFRvKCkge1xuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpLFxuXHRcdFx0XHRcdCRjb250aW51ZUJ0biA9ICQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKSxcblx0XHRcdFx0XHQkcGFydGljaXBhdGVCdG4gPSAkKCdbZGF0YS1qcz1cInBhcnRpY2lwYXRlXCJdJyk7XG5cblxuXHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0JG1lbnU6ICQoJy5OYXZpZ2F0aW9uLWl0ZW1zJyksXG5cdFx0XHRcdFx0cGFuZWxTZWxlY3RvcjogJy5TZWN0aW9uJyxcblx0XHRcdFx0XHRuYW1lc3BhY2U6ICcucGFuZWxTbmFwJyxcblx0XHRcdFx0XHRvblNuYXBTdGFydDogZnVuY3Rpb24oJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gJHRhcmdldC5kYXRhKCdwYW5lbCcpO1xuXG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdFx0JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0JCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdFx0dmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdFx0aGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRvblNuYXBGaW5pc2g6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9ICR0YXJnZXQuZGF0YSgncGFuZWwnKTtcblxuXHRcdFx0XHRcdFx0aWYgKGluZGV4ID09IDQpIHtcblx0XHRcdFx0XHRcdFx0JCgnW2RhdGEtaXRlbT1cIjFcIl0nKS50cmlnZ2VyKCdjbGljaycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZGlyZWN0aW9uVGhyZXNob2xkOiA0MDAsXG5cdFx0XHRcdFx0c2xpZGVTcGVlZDogNDAwLFxuXHRcdFx0XHRcdGVhc2luZzogJ3N3aW5nJyxcblx0XHRcdFx0XHRvZmZzZXQ6IDAsXG5cdFx0XHRcdFx0bmF2aWdhdGlvbjoge1xuXHRcdFx0XHRcdFx0a2V5czoge1xuXHRcdFx0XHRcdFx0XHRuZXh0S2V5OiA0MCxcblx0XHRcdFx0XHRcdFx0cHJldktleTogMzgsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YnV0dG9uczoge1xuXHRcdFx0XHRcdFx0XHQkbmV4dEJ1dHRvbjogJGNvbnRpbnVlQnRuLFxuXHRcdFx0XHRcdFx0XHQkcHJldkJ1dHRvbjogZmFsc2UsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0d3JhcEFyb3VuZDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0ICAgICQoJ2JvZHknKS5wYW5lbFNuYXAob3B0aW9ucyk7XG5cdFx0fVxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG59KTtcbiJdfQ==