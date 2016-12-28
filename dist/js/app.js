var app = {

	'init': function init() {
		this.menu();
		this.expander();
		this.overlay();
		this.lazyImages();

		// Initialise scroll on desktop & add CSS
		if ($('html').hasClass('desktop')) {
			// initialise carousel & history components
			this.carousel();
			this.history();
			this.snapTo();
			this.hubAnimation();
		}
	},

	'lazyImages': function lazyImages() {
		$(function () {
			$('[data-js="lazyload"]').lazyload();
		});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCJsYXp5SW1hZ2VzIiwiJCIsImhhc0NsYXNzIiwiY2Fyb3VzZWwiLCJoaXN0b3J5Iiwic25hcFRvIiwiaHViQW5pbWF0aW9uIiwibGF6eWxvYWQiLCIkc2VjdGlvbiIsIiRob3VzZSIsIm9uIiwiZXZlbnQiLCJwYWdlWCIsImFkZENsYXNzIiwicmVtb3ZlQ2xhc3MiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsImluZGV4Iiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJjdXJyZW50U2xpZGUiLCJuZXh0U2xpZGUiLCJwYXJlbnRzIiwiYnV0dG9uIiwicGFnZSIsImxpbmsiLCJvcGVuIiwic2Nyb2xsVG8iLCIkY29udGFpbmVyIiwiJG5hdkxpbmsiLCJoZWFkZXIiLCJoZWFkZXJDbGFzcyIsInByZXZlbnREZWZhdWx0IiwiZGF0YSIsInNlY3Rpb24iLCJvbkFmdGVyIiwiY3VyQ2xhc3MiLCIkY29udGludWVCdG4iLCIkcGFydGljaXBhdGVCdG4iLCJvcHRpb25zIiwiJG1lbnUiLCJwYW5lbFNlbGVjdG9yIiwibmFtZXNwYWNlIiwib25TbmFwU3RhcnQiLCIkdGFyZ2V0Iiwib25TbmFwRmluaXNoIiwidHJpZ2dlciIsImRpcmVjdGlvblRocmVzaG9sZCIsInNsaWRlU3BlZWQiLCJlYXNpbmciLCJvZmZzZXQiLCJuYXZpZ2F0aW9uIiwia2V5cyIsIm5leHRLZXkiLCJwcmV2S2V5IiwiYnV0dG9ucyIsIiRuZXh0QnV0dG9uIiwiJHByZXZCdXR0b24iLCJ3cmFwQXJvdW5kIiwicGFuZWxTbmFwIiwiZG9jdW1lbnQiLCJyZWFkeSJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsTUFBTTs7QUFFUixTQUFRLFNBQVNDLElBQVQsR0FBZ0I7QUFDdkIsT0FBS0MsSUFBTDtBQUNBLE9BQUtDLFFBQUw7QUFDQSxPQUFLQyxPQUFMO0FBQ0EsT0FBS0MsVUFBTDs7QUFFQTtBQUNBLE1BQUlDLEVBQUUsTUFBRixFQUFVQyxRQUFWLENBQW1CLFNBQW5CLENBQUosRUFBbUM7QUFDbEM7QUFDQSxRQUFLQyxRQUFMO0FBQ0EsUUFBS0MsT0FBTDtBQUNBLFFBQUtDLE1BQUw7QUFDQSxRQUFLQyxZQUFMO0FBQ0E7QUFDRCxFQWhCTzs7QUFrQlIsZUFBYyxTQUFTTixVQUFULEdBQXFCO0FBQ2xDQyxJQUFFLFlBQVc7QUFDVEEsS0FBRSxzQkFBRixFQUEwQk0sUUFBMUI7QUFDSCxHQUZEO0FBR0EsRUF0Qk87O0FBd0JSLGlCQUFnQixTQUFTRCxZQUFULEdBQXVCO0FBQ3RDLE1BQUlFLFdBQVdQLEVBQUUsa0JBQUYsQ0FBZjtBQUFBLE1BQ0VRLFNBQVNSLEVBQUUsbUJBQUYsQ0FEWDs7QUFHQU8sV0FBU0UsRUFBVCxDQUFZLFdBQVosRUFBeUIsVUFBU0MsS0FBVCxFQUFlO0FBQ3ZDO0FBQ0EsT0FBSUEsTUFBTUMsS0FBTixHQUFjLEdBQWxCLEVBQXVCO0FBQ3RCSCxXQUFPSSxRQUFQLENBQWdCLFVBQWhCO0FBQ0FKLFdBQU9LLFdBQVAsQ0FBbUIsU0FBbkI7QUFDQSxJQUhELE1BR087QUFDTkwsV0FBT0ssV0FBUCxDQUFtQixVQUFuQjtBQUNBTCxXQUFPSSxRQUFQLENBQWdCLFNBQWhCO0FBQ0E7QUFDRCxHQVREO0FBVUEsRUF0Q087O0FBd0NSLGFBQVksU0FBU1YsUUFBVCxHQUFvQjtBQUM5QixNQUFJWSxZQUFZZCxFQUFFLHNCQUFGLENBQWhCO0FBQUEsTUFDRWUsZUFBZWYsRUFBRSwwQkFBRixDQURqQjs7QUFHQWMsWUFBVUUsS0FBVixDQUFnQjtBQUNmQyxXQUFRLEtBRE87QUFFZkMsZUFBWSxDQUNUO0FBQ0VDLGdCQUFZLEdBRGQ7QUFFRUMsY0FBVTtBQUZaLElBRFM7QUFGRyxHQUFoQjs7QUFVQTtBQUNBTCxlQUFhTSxRQUFiLEdBQXdCWixFQUF4QixDQUEyQixPQUEzQixFQUFvQyxZQUFVO0FBQzdDLE9BQUlhLFFBQVF0QixFQUFFLElBQUYsRUFBUXNCLEtBQVIsRUFBWjs7QUFFQVAsZ0JBQWFNLFFBQWIsR0FBd0JSLFdBQXhCLENBQW9DLFdBQXBDO0FBQ0FiLEtBQUUsSUFBRixFQUFRWSxRQUFSLENBQWlCLFdBQWpCO0FBQ0FFLGFBQVVFLEtBQVYsQ0FBZ0IsV0FBaEIsRUFBNkJNLEtBQTdCO0FBQ0EsR0FORDs7QUFRQTtBQUNBQyxTQUFPQyxRQUFQLEdBQWtCLFlBQVc7O0FBRTVCLE9BQUlELE9BQU9FLFVBQVAsSUFBcUIsR0FBckIsSUFBNEIsQ0FBQ1gsVUFBVWIsUUFBVixDQUFtQixtQkFBbkIsQ0FBakMsRUFBMEU7O0FBRXpFO0FBQ0FhLGNBQVVFLEtBQVYsQ0FBZ0IsU0FBaEI7O0FBRUFGLGNBQVVFLEtBQVYsQ0FBZ0I7QUFDZkMsYUFBUSxLQURPO0FBRWZDLGlCQUFZLENBQ1Q7QUFDRUMsa0JBQVksR0FEZDtBQUVFQyxnQkFBVTtBQUZaLE1BRFM7QUFGRyxLQUFoQjtBQVNBO0FBQ0QsR0FqQkQ7QUFrQkQsRUFsRk87O0FBb0ZSLGFBQVksU0FBU3ZCLFFBQVQsR0FBbUI7QUFDOUIsTUFBSTZCLFFBQVExQixFQUFFLHNCQUFGLENBQVo7QUFBQSxNQUNFMkIsV0FBV0QsTUFBTUUsSUFBTixDQUFXLDZCQUFYLENBRGI7QUFBQSxNQUVFQyxXQUFXSCxNQUFNRSxJQUFOLENBQVcsNkJBQVgsQ0FGYjs7QUFJQUQsV0FBU2xCLEVBQVQsQ0FBWSxPQUFaLEVBQXFCLFlBQVU7QUFDOUJULEtBQUUsSUFBRixFQUFROEIsTUFBUixHQUFpQkMsV0FBakIsQ0FBNkIsYUFBN0I7QUFDQSxHQUZEO0FBR0EsRUE1Rk87O0FBOEZSLFlBQVcsU0FBUzVCLE9BQVQsR0FBbUI7QUFDN0IsTUFBSTZCLFdBQVdoQyxFQUFFLDJCQUFGLENBQWY7QUFBQSxNQUNFaUMsZUFBZWpDLEVBQUUsMEJBQUYsQ0FEakI7O0FBR0FnQyxXQUFTWCxRQUFULEdBQW9CVCxRQUFwQixDQUE2QixVQUE3Qjs7QUFFQXFCLGVBQWF4QixFQUFiLENBQWdCLGtCQUFoQixFQUFvQyxZQUFVO0FBQzdDLE9BQUssQ0FBQ1QsRUFBRSxJQUFGLEVBQVFDLFFBQVIsQ0FBaUIsVUFBakIsQ0FBTixFQUFxQztBQUNwQytCLGFBQVNYLFFBQVQsR0FBb0JSLFdBQXBCLENBQWdDLFVBQWhDO0FBQ0FiLE1BQUUsSUFBRixFQUFRWSxRQUFSLENBQWlCLFVBQWpCO0FBQ0E7QUFDRCxHQUxEO0FBTUEsRUExR087O0FBNEdSLFlBQVcsU0FBU2QsT0FBVCxHQUFtQjtBQUM3QixNQUFJb0MsUUFBUWxDLEVBQUUsa0JBQUYsQ0FBWjtBQUFBLE1BQ0VtQyxXQUFXbkMsRUFBRSxxQkFBRixDQURiO0FBQUEsTUFFRW9DLGtCQUFrQnBDLEVBQUUsNEJBQUYsQ0FGcEI7QUFBQSxNQUdFcUMsZ0JBQWdCckMsRUFBRSwwQkFBRixDQUhsQjtBQUFBLE1BSUVzQyxtQkFBbUJ0QyxFQUFFLDhCQUFGLENBSnJCOztBQU9Bb0Msa0JBQWdCM0IsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsWUFBVTtBQUNyQyxPQUFJOEIsZ0JBQWdCdkMsRUFBRSxJQUFGLEVBQVF3QyxJQUFSLENBQWEsY0FBYixDQUFwQjtBQUNBeEMsS0FBRSx5QkFBd0J1QyxhQUF4QixHQUF1QyxHQUF6QyxFQUE4QzNCLFFBQTlDLENBQXVELFdBQXZEO0FBQ0FzQixTQUFNdEIsUUFBTixDQUFlLFlBQWY7O0FBRUE7QUFDQSxPQUFLWixFQUFFLHlCQUF3QnVDLGFBQXhCLEdBQXVDLEdBQXpDLEVBQThDdEMsUUFBOUMsQ0FBdUQsYUFBdkQsQ0FBTCxFQUE0RTtBQUMzRXFDLHFCQUFpQnRCLEtBQWpCLENBQXVCO0FBQ3RCQyxhQUFRLElBRGM7QUFFdEJ3QixXQUFNLElBRmdCO0FBR3RCdkIsaUJBQVksQ0FDVDtBQUNFQyxrQkFBWSxHQURkO0FBRUVDLGdCQUFVO0FBQ1JILGVBQVEsS0FEQTtBQUVSd0IsYUFBTTtBQUZFO0FBRlosTUFEUztBQUhVLEtBQXZCOztBQWNBO0FBQ0FILHFCQUFpQjdCLEVBQWpCLENBQW9CLGNBQXBCLEVBQW9DLFVBQVNDLEtBQVQsRUFBZ0JNLEtBQWhCLEVBQXVCMEIsWUFBdkIsRUFBcUNDLFNBQXJDLEVBQStDO0FBQ2xGLFNBQUlBLGFBQWEsQ0FBakIsRUFBb0I7QUFDbkIzQyxRQUFFLElBQUYsRUFBUTRDLE9BQVIsQ0FBZ0IsZ0JBQWhCLEVBQWtDaEMsUUFBbEMsQ0FBMkMsV0FBM0M7QUFDQSxNQUZELE1BRU87QUFDTlosUUFBRSxJQUFGLEVBQVE0QyxPQUFSLENBQWdCLGdCQUFoQixFQUFrQy9CLFdBQWxDLENBQThDLFdBQTlDO0FBQ0E7QUFDRCxLQU5EO0FBT0E7QUFDRCxHQTlCRDs7QUFnQ0F3QixnQkFBYzVCLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsWUFBVTtBQUNuQzBCLFlBQVN0QixXQUFULENBQXFCLFdBQXJCO0FBQ0FxQixTQUFNckIsV0FBTixDQUFrQixZQUFsQjtBQUNBLEdBSEQ7QUFJQSxFQXhKTzs7QUEwSlIsU0FBUSxTQUFTakIsSUFBVCxHQUFnQjtBQUN2QixNQUFJaUQsU0FBUzdDLEVBQUUsdUJBQUYsQ0FBYjtBQUFBLE1BQ0U4QyxPQUFPOUMsRUFBRSxrQkFBRixDQURUO0FBQUEsTUFFRStDLE9BQU8vQyxFQUFFLHFCQUFGLENBRlQ7QUFBQSxNQUdFZ0QsT0FBTyxLQUhUOztBQUtBSCxTQUFPcEMsRUFBUCxDQUFVLE9BQVYsRUFBbUIsWUFBVTtBQUM1QixPQUFJdUMsSUFBSixFQUFVO0FBQ1RGLFNBQUtqQyxXQUFMLENBQWlCLFNBQWpCO0FBQ0FtQyxXQUFPLEtBQVA7QUFDQSxJQUhELE1BR087QUFDTkYsU0FBS2xDLFFBQUwsQ0FBYyxTQUFkO0FBQ0FvQyxXQUFPLElBQVA7QUFDQTtBQUNELEdBUkQ7O0FBVUFELE9BQUt0QyxFQUFMLENBQVEsT0FBUixFQUFpQixZQUFVO0FBQ3pCc0MsUUFBS2xDLFdBQUwsQ0FBaUIsV0FBakI7QUFDQWIsS0FBRSxJQUFGLEVBQVFZLFFBQVIsQ0FBaUIsV0FBakI7QUFDQWtDLFFBQUtqQyxXQUFMLENBQWlCLFNBQWpCO0FBQ0FtQyxVQUFPLEtBQVA7QUFDRCxHQUxEO0FBTUEsRUFoTE87O0FBa0xSLGFBQVksU0FBU0MsUUFBVCxHQUFvQjtBQUMvQixNQUFJQyxhQUFhbEQsRUFBRSxvQkFBRixDQUFqQjtBQUFBLE1BQ0VtRCxXQUFVbkQsRUFBRSxxQkFBRixDQURaO0FBQUEsTUFFRW9ELFNBQVNwRCxFQUFFLG9CQUFGLENBRlg7QUFBQSxNQUdJcUQsY0FBY3JELEVBQUUsb0JBQUYsRUFBd0J3QyxJQUF4QixDQUE2QixPQUE3QixDQUhsQjs7QUFLQTtBQUNBVyxXQUFTMUMsRUFBVCxDQUFZLE9BQVosRUFBcUIsVUFBU0MsS0FBVCxFQUFlO0FBQ25DQSxTQUFNNEMsY0FBTjtBQUNBLE9BQUloQyxRQUFVdEIsRUFBRSxJQUFGLEVBQVF1RCxJQUFSLENBQWEsU0FBYixDQUFkO0FBQUEsT0FDRUMsVUFBVSxjQUFjbEMsS0FEMUI7O0FBR0E7QUFDQXRCLEtBQUV1QixNQUFGLEVBQVUwQixRQUFWLENBQW1CTyxPQUFuQixFQUE0QixHQUE1QixFQUFpQztBQUNoQ0MsYUFBUyxZQUFXO0FBQ25CO0FBQ0N6RCxPQUFFLHFCQUFGLEVBQXlCYSxXQUF6QixDQUFxQyxXQUFyQztBQUNBYixPQUFFLG9CQUFvQnNCLEtBQXBCLEdBQTJCLElBQTdCLEVBQW1DVixRQUFuQyxDQUE0QyxXQUE1QztBQUNBd0MsWUFBT1osSUFBUCxDQUFZLE9BQVosRUFBcUJhLFdBQXJCOztBQUVBO0FBQ0EsU0FBSUssV0FBV0wsY0FBYyxNQUFkLEdBQXVCL0IsS0FBdEM7QUFDQThCLFlBQU9aLElBQVAsQ0FBWSxPQUFaLEVBQXFCa0IsUUFBckI7QUFDQTtBQVY4QixJQUFqQztBQVlBLEdBbEJEOztBQW9CQTtBQUNBMUQsSUFBRSxzQkFBRixFQUEwQlMsRUFBMUIsQ0FBNkIsT0FBN0IsRUFBc0MsVUFBU0MsS0FBVCxFQUFlO0FBQ3BEQSxTQUFNNEMsY0FBTjs7QUFFQXRELEtBQUV1QixNQUFGLEVBQVUwQixRQUFWLENBQW1CLFlBQW5CLEVBQWlDLEdBQWpDLEVBQXNDO0FBQ3JDUSxhQUFTLFlBQVc7QUFDbkI7QUFDQ3pELE9BQUUscUJBQUYsRUFBeUJhLFdBQXpCLENBQXFDLFdBQXJDO0FBQ0FiLE9BQUUsb0JBQW9Cc0IsS0FBcEIsR0FBMkIsSUFBN0IsRUFBbUNWLFFBQW5DLENBQTRDLFdBQTVDO0FBQ0F3QyxZQUFPWixJQUFQLENBQVksT0FBWixFQUFxQmEsV0FBckI7O0FBRUE7QUFDQSxTQUFJSyxXQUFXTCxjQUFjLE1BQWQsR0FBdUIvQixLQUF0QztBQUNBOEIsWUFBT1osSUFBUCxDQUFZLE9BQVosRUFBcUJrQixRQUFyQjtBQUNBO0FBVm1DLElBQXRDO0FBWUEsR0FmRDtBQWdCQSxFQTlOTzs7QUFnT1IsV0FBVSxTQUFTdEQsTUFBVCxHQUFrQjtBQUMzQixNQUFJOEMsYUFBYWxELEVBQUUsb0JBQUYsQ0FBakI7QUFBQSxNQUNFbUQsV0FBVW5ELEVBQUUscUJBQUYsQ0FEWjtBQUFBLE1BRUVvRCxTQUFTcEQsRUFBRSxvQkFBRixDQUZYO0FBQUEsTUFHSXFELGNBQWNyRCxFQUFFLG9CQUFGLEVBQXdCd0MsSUFBeEIsQ0FBNkIsT0FBN0IsQ0FIbEI7QUFBQSxNQUlFbUIsZUFBZTNELEVBQUUsc0JBQUYsQ0FKakI7QUFBQSxNQUtFNEQsa0JBQWtCNUQsRUFBRSx5QkFBRixDQUxwQjs7QUFRQSxNQUFJNkQsVUFBVTtBQUNaQyxVQUFPOUQsRUFBRSxtQkFBRixDQURLO0FBRVorRCxrQkFBZSxVQUZIO0FBR1pDLGNBQVcsWUFIQztBQUlaQyxnQkFBYSxVQUFTQyxPQUFULEVBQWtCO0FBQzlCLFFBQUk1QyxRQUFRNEMsUUFBUVgsSUFBUixDQUFhLE9BQWIsQ0FBWjs7QUFFQTtBQUNBdkQsTUFBRSxxQkFBRixFQUF5QmEsV0FBekIsQ0FBcUMsV0FBckM7QUFDQWIsTUFBRSxvQkFBb0JzQixLQUFwQixHQUEyQixJQUE3QixFQUFtQ1YsUUFBbkMsQ0FBNEMsV0FBNUM7QUFDQXdDLFdBQU9aLElBQVAsQ0FBWSxPQUFaLEVBQXFCYSxXQUFyQjs7QUFFQTtBQUNBLFFBQUlLLFdBQVdMLGNBQWMsTUFBZCxHQUF1Qi9CLEtBQXRDO0FBQ0E4QixXQUFPWixJQUFQLENBQVksT0FBWixFQUFxQmtCLFFBQXJCO0FBRUEsSUFoQlc7QUFpQlpTLGlCQUFjLFVBQVNELE9BQVQsRUFBa0I7QUFDL0IsUUFBSTVDLFFBQVE0QyxRQUFRWCxJQUFSLENBQWEsT0FBYixDQUFaOztBQUVBLFFBQUlqQyxTQUFTLENBQWIsRUFBZ0I7QUFDZnRCLE9BQUUsaUJBQUYsRUFBcUJvRSxPQUFyQixDQUE2QixPQUE3QjtBQUNBO0FBQ0QsSUF2Qlc7QUF3QlpDLHVCQUFvQixDQXhCUjtBQXlCWkMsZUFBWSxHQXpCQTtBQTBCWkMsV0FBUSxPQTFCSTtBQTJCWkMsV0FBUSxDQTNCSTtBQTRCWkMsZUFBWTtBQUNYQyxVQUFNO0FBQ0xDLGNBQVMsRUFESjtBQUVMQyxjQUFTO0FBRkosS0FESztBQUtYQyxhQUFTO0FBQ1JDLGtCQUFhbkIsWUFETDtBQUVSb0Isa0JBQWE7QUFGTCxLQUxFO0FBU1hDLGdCQUFZO0FBVEQ7QUE1QkEsR0FBZDs7QUF5Q0VoRixJQUFFLE1BQUYsRUFBVWlGLFNBQVYsQ0FBb0JwQixPQUFwQjtBQUNGO0FBblJPLENBQVY7O0FBdVJBOzs7O0FBSUE3RCxFQUFFa0YsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7O0FBRTNCekYsS0FBSUMsSUFBSjtBQUNELENBSEQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXHRcdFx0dGhpcy5leHBhbmRlcigpO1xuXHRcdFx0dGhpcy5vdmVybGF5KCk7XG5cdFx0XHR0aGlzLmxhenlJbWFnZXMoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQvLyBpbml0aWFsaXNlIGNhcm91c2VsICYgaGlzdG9yeSBjb21wb25lbnRzXG5cdFx0XHRcdHRoaXMuY2Fyb3VzZWwoKTtcblx0XHRcdFx0dGhpcy5oaXN0b3J5KCk7XG5cdFx0XHRcdHRoaXMuc25hcFRvKCk7XG5cdFx0XHRcdHRoaXMuaHViQW5pbWF0aW9uKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdsYXp5SW1hZ2VzJzogZnVuY3Rpb24gbGF6eUltYWdlcygpe1xuXHRcdFx0JChmdW5jdGlvbigpIHtcblx0XHRcdCAgICAkKCdbZGF0YS1qcz1cImxhenlsb2FkXCJdJykubGF6eWxvYWQoKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnaHViQW5pbWF0aW9uJzogZnVuY3Rpb24gaHViQW5pbWF0aW9uKCl7XG5cdFx0XHR2YXIgJHNlY3Rpb24gPSAkKCdbZGF0YS1wYW5lbD1cIjJcIl0nKSxcblx0XHRcdFx0XHQkaG91c2UgPSAkKCdbZGF0YS1qcz1cImhvdXNlXCJdJyk7XG5cblx0XHRcdCRzZWN0aW9uLm9uKFwibW91c2Vtb3ZlXCIsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0Ly8gZGV0ZWN0IG1vdXNlIHhcblx0XHRcdFx0aWYoIGV2ZW50LnBhZ2VYIDwgNTEwKSB7XG5cdFx0XHRcdFx0JGhvdXNlLmFkZENsYXNzKFwiaXMtcmlnaHRcIik7XG5cdFx0XHRcdFx0JGhvdXNlLnJlbW92ZUNsYXNzKFwiaXMtbGVmdFwiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQkaG91c2UucmVtb3ZlQ2xhc3MoXCJpcy1yaWdodFwiKTtcblx0XHRcdFx0XHQkaG91c2UuYWRkQ2xhc3MoXCJpcy1sZWZ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J2Nhcm91c2VsJzogZnVuY3Rpb24gY2Fyb3VzZWwoKSB7XG5cdFx0XHRcdHZhciAkY2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsXCJdJyksXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdCAgICB7XG5cdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGlkZXMgcmVzcG9uZCB0byBuYXZcblx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpY2sgcmVpbml0IHdoZW4gYnJvd3NlciBzaXplIGluY3JlYXNlZCAmIGl0IGlzbid0IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdFx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gODYwICYmICEkY2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRGVzdHJveSBhbmQgcmVpbml0IHNsaWNrXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3Vuc2xpY2snKTtcblxuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnZXhwYW5kZXInOiBmdW5jdGlvbiBleHBhbmRlcigpe1xuXHRcdFx0dmFyICRpdGVtID0gJCgnW2RhdGEtanM9XCJleHBhbmRlclwiXScpLFxuXHRcdFx0XHRcdCR0cmlnZ2VyID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlclRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkY29udGVudCA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJDb250ZW50XCJdJyk7XG5cblx0XHRcdCR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnaGlzdG9yeSc6IGZ1bmN0aW9uIGhpc3RvcnkoKSB7XG5cdFx0XHR2YXIgJGhpc3RvcnkgPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbXNcIl0nKSxcblx0XHRcdFx0XHQkaGlzdG9yeUl0ZW0gPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbVwiXScpO1xuXG5cdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLmFkZENsYXNzKCdpcy1zbWFsbCcpO1xuXG5cdFx0XHQkaGlzdG9yeUl0ZW0ub24oJ2NsaWNrIG1vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoICEkKHRoaXMpLmhhc0NsYXNzKCdpcy1sYXJnZScpICkge1xuXHRcdFx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdvdmVybGF5JzogZnVuY3Rpb24gb3ZlcmxheSgpIHtcblx0XHRcdHZhciAkcGFnZSA9ICQoJ1tkYXRhLWpzPVwicGFnZVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5ID0gJCgnW2RhdGEtanM9XCJvdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlUcmlnZ2VyID0gJCgnW2RhdGEtanM9XCJvdmVybGF5VHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5Q2xvc2UgPSAkKCdbZGF0YS1qcz1cImNsb3NlT3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5Q2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXktY2Fyb3VzZWxcIl0nKTtcblxuXG5cdFx0XHQkb3ZlcmxheVRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIG92ZXJsYXlOdW1iZXIgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3ZlcmxheScpO1xuXHRcdFx0XHQkKCdbZGF0YS1vdmVybGF5bnVtYmVyPScrIG92ZXJsYXlOdW1iZXIgKyddJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5hZGRDbGFzcygnaXMtb3ZlcmxheScpO1xuXG5cdFx0XHRcdC8vIEluaXQgY2Fyb3VzZWwgaWYgaXQgaGFzIG9uZVxuXHRcdFx0XHRpZiAoICQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5oYXNDbGFzcygnaXMtY2Fyb3VzZWwnKSkge1xuXHRcdFx0XHRcdCRvdmVybGF5Q2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0YXJyb3dzOiB0cnVlLFxuXHRcdFx0XHRcdFx0ZG90czogdHJ1ZSxcblx0XHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHQgICAgICBzZXR0aW5nczoge1xuXHRcdFx0XHRcdCAgICAgICAgYXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHQgICAgICAgIGRvdHM6IHRydWVcblx0XHRcdFx0XHQgICAgICB9XG5cdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHQvLyBPbiBiZWZvcmUgc2xpZGUgY2hhbmdlXG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbC5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG5cdFx0XHRcdFx0XHRpZiAobmV4dFNsaWRlID09IDEpIHtcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuT3ZlcmxheS1pbm5lcicpLmFkZENsYXNzKCdpcy1zZWNvbmQnKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdCQodGhpcykucGFyZW50cygnLk92ZXJsYXktaW5uZXInKS5yZW1vdmVDbGFzcygnaXMtc2Vjb25kJyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQkb3ZlcmxheUNsb3NlLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCRvdmVybGF5LnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UucmVtb3ZlQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnbWVudSc6IGZ1bmN0aW9uIG1lbnUoKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnW2RhdGEtanM9XCJuYXZidXR0b25cIl0nKSxcblx0XHRcdFx0XHRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0bGluayA9ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblxuXHRcdFx0YnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChvcGVuKSB7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhZ2UuYWRkQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGluay5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGxpbmsucmVtb3ZlQ2xhc3MoXCJpcy1hY3RpdmVcIik7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcyhcImlzLWFjdGl2ZVwiKTtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J3Njcm9sbFRvJzogZnVuY3Rpb24gc2Nyb2xsVG8oKSB7XG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIik7XG5cblx0XHRcdC8qIFNsaWRlIHRvIHNlY3Rpb24gb24gbmF2IGxpbmsgY2xpY2sgKi9cblx0XHRcdCRuYXZMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIGluZGV4ID0gICAkKHRoaXMpLmRhdGEoJ3NlY3Rpb24nKSxcblx0XHRcdFx0XHRcdHNlY3Rpb24gPSBcIiNzZWN0aW9uMFwiICsgaW5kZXg7XG5cblx0XHRcdFx0Ly8gJGNvbnRhaW5lci5tb3ZlVG8oc2VjdGlvbik7XG5cdFx0XHRcdCQod2luZG93KS5zY3JvbGxUbyhzZWN0aW9uLCA1MDAsIHtcblx0XHRcdFx0XHRvbkFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG4gXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCB2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKFwiI3NlY3Rpb24wMlwiLCA1MDAsIHtcblx0XHRcdFx0XHRvbkFmdGVyOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCAkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuIFx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG4gXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG4gXHRcdFx0XHRcdCB2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnc25hcFRvJzogZnVuY3Rpb24gc25hcFRvKCkge1xuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpLFxuXHRcdFx0XHRcdCRjb250aW51ZUJ0biA9ICQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKSxcblx0XHRcdFx0XHQkcGFydGljaXBhdGVCdG4gPSAkKCdbZGF0YS1qcz1cInBhcnRpY2lwYXRlXCJdJyk7XG5cblxuXHRcdFx0dmFyIG9wdGlvbnMgPSB7XG5cdFx0XHRcdFx0JG1lbnU6ICQoJy5OYXZpZ2F0aW9uLWl0ZW1zJyksXG5cdFx0XHRcdFx0cGFuZWxTZWxlY3RvcjogJy5TZWN0aW9uJyxcblx0XHRcdFx0XHRuYW1lc3BhY2U6ICcucGFuZWxTbmFwJyxcblx0XHRcdFx0XHRvblNuYXBTdGFydDogZnVuY3Rpb24oJHRhcmdldCkge1xuXHRcdFx0XHRcdFx0dmFyIGluZGV4ID0gJHRhcmdldC5kYXRhKCdwYW5lbCcpO1xuXG5cdFx0XHRcdFx0XHQvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdFx0JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdFx0JCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdFx0dmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdFx0aGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRvblNuYXBGaW5pc2g6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9ICR0YXJnZXQuZGF0YSgncGFuZWwnKTtcblxuXHRcdFx0XHRcdFx0aWYgKGluZGV4ID09IDQpIHtcblx0XHRcdFx0XHRcdFx0JCgnW2RhdGEtaXRlbT1cIjFcIl0nKS50cmlnZ2VyKCdjbGljaycpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZGlyZWN0aW9uVGhyZXNob2xkOiAwLFxuXHRcdFx0XHRcdHNsaWRlU3BlZWQ6IDUwMCxcblx0XHRcdFx0XHRlYXNpbmc6ICdzd2luZycsXG5cdFx0XHRcdFx0b2Zmc2V0OiAwLFxuXHRcdFx0XHRcdG5hdmlnYXRpb246IHtcblx0XHRcdFx0XHRcdGtleXM6IHtcblx0XHRcdFx0XHRcdFx0bmV4dEtleTogNDAsXG5cdFx0XHRcdFx0XHRcdHByZXZLZXk6IDM4LFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdGJ1dHRvbnM6IHtcblx0XHRcdFx0XHRcdFx0JG5leHRCdXR0b246ICRjb250aW51ZUJ0bixcblx0XHRcdFx0XHRcdFx0JHByZXZCdXR0b246IGZhbHNlLFxuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHdyYXBBcm91bmQ6IGZhbHNlXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXG5cdCAgICAkKCdib2R5JykucGFuZWxTbmFwKG9wdGlvbnMpO1xuXHRcdH1cbn07XG5cblxuLyoqXG4gKiBTVEFSVCBQT0lOVFxuKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0XHRhcHAuaW5pdCgpO1xufSk7XG4iXX0=