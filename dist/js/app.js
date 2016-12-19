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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCJzbmFwVG8iLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJidXR0b24iLCJwYWdlIiwibGluayIsIm9wZW4iLCJzY3JvbGxUbyIsIiRjb250YWluZXIiLCIkbmF2TGluayIsImhlYWRlciIsImhlYWRlckNsYXNzIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsImRhdGEiLCJzZWN0aW9uIiwib25BZnRlciIsImN1ckNsYXNzIiwiJGNvbnRpbnVlQnRuIiwib3B0aW9ucyIsIiRtZW51IiwicGFuZWxTZWxlY3RvciIsIm5hbWVzcGFjZSIsIm9uU25hcFN0YXJ0IiwiJHRhcmdldCIsImRpcmVjdGlvblRocmVzaG9sZCIsInNsaWRlU3BlZWQiLCJlYXNpbmciLCJvZmZzZXQiLCJuYXZpZ2F0aW9uIiwia2V5cyIsIm5leHRLZXkiLCJwcmV2S2V5IiwiYnV0dG9ucyIsIiRuZXh0QnV0dG9uIiwiJHByZXZCdXR0b24iLCJ3cmFwQXJvdW5kIiwicGFuZWxTbmFwIiwiZG9jdW1lbnQiLCJyZWFkeSJd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QTtBQUNBL0MsTUFBRSxxQkFBRixFQUF5QmUsV0FBekIsQ0FBcUMsV0FBckM7QUFDQWYsTUFBRSxvQkFBb0JjLEtBQXBCLEdBQTJCLElBQTdCLEVBQW1DRSxRQUFuQyxDQUE0QyxXQUE1QztBQUNBMkIsV0FBT1QsSUFBUCxDQUFZLE9BQVosRUFBcUJVLFdBQXJCOztBQUVBO0FBQ0EsUUFBSU0sV0FBV04sY0FBYyxNQUFkLEdBQXVCOUIsS0FBdEM7QUFDQTZCLFdBQU9ULElBQVAsQ0FBWSxPQUFaLEVBQXFCZ0IsUUFBckI7QUFFQSxJQWhCVztBQWlCWlEsdUJBQW9CLEdBakJSO0FBa0JaQyxlQUFZLEdBbEJBO0FBbUJaQyxXQUFRLE9BbkJJO0FBb0JaQyxXQUFRLENBcEJJO0FBcUJaQyxlQUFZO0FBQ1hDLFVBQU07QUFDTEMsY0FBUyxFQURKO0FBRUxDLGNBQVM7QUFGSixLQURLO0FBS1hDLGFBQVM7QUFDUkMsa0JBQWFoQixZQURMO0FBRVJpQixrQkFBYTtBQUZMLEtBTEU7QUFTWEMsZ0JBQVk7QUFURDtBQXJCQSxHQUFkOztBQWtDRXJFLElBQUUsTUFBRixFQUFVc0UsU0FBVixDQUFvQmxCLE9BQXBCOztBQUVGO0FBQ0FWLFdBQVM3QixFQUFULENBQVksT0FBWixFQUFxQixVQUFTZ0MsS0FBVCxFQUFlO0FBQ25DO0FBQ0EsR0FGRDs7QUFJQTtBQUNBN0MsSUFBRSxzQkFBRixFQUEwQmEsRUFBMUIsQ0FBNkIsT0FBN0IsRUFBc0MsVUFBU2dDLEtBQVQsRUFBZTtBQUNwRDtBQUNBLEdBRkQ7QUFHQTtBQXRQTyxDQUFWOztBQTBQQTs7OztBQUlBN0MsRUFBRXVFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUUzQjdFLEtBQUlDLElBQUo7QUFDRCxDQUhEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSB7XG5cblx0XHQnaW5pdCc6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHR0aGlzLm1lbnUoKTtcblx0XHRcdHRoaXMuZXhwYW5kZXIoKTtcblx0XHRcdHRoaXMub3ZlcmxheSgpO1xuXG5cdFx0XHQvLyBJbml0aWFsaXNlIHNjcm9sbCBvbiBkZXNrdG9wICYgYWRkIENTU1xuXHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnZGVza3RvcCcpKSB7XG5cdFx0XHRcdC8vIGluaXRpYWxpc2UgY2Fyb3VzZWwgJiBoaXN0b3J5IGNvbXBvbmVudHNcblx0XHRcdFx0dGhpcy5jYXJvdXNlbCgpO1xuXHRcdFx0XHR0aGlzLmhpc3RvcnkoKTtcblx0XHRcdFx0dGhpcy5zbmFwVG8oKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J2Nhcm91c2VsJzogZnVuY3Rpb24gY2Fyb3VzZWwoKSB7XG5cdFx0XHRcdHZhciAkY2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsXCJdJyksXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdCAgICB7XG5cdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGlkZXMgcmVzcG9uZCB0byBuYXZcblx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpY2sgcmVpbml0IHdoZW4gYnJvd3NlciBzaXplIGluY3JlYXNlZCAmIGl0IGlzbid0IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdFx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gODYwICYmICEkY2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRGVzdHJveSBhbmQgcmVpbml0IHNsaWNrXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3Vuc2xpY2snKTtcblxuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnZXhwYW5kZXInOiBmdW5jdGlvbiBleHBhbmRlcigpe1xuXHRcdFx0dmFyICRpdGVtID0gJCgnW2RhdGEtanM9XCJleHBhbmRlclwiXScpLFxuXHRcdFx0XHRcdCR0cmlnZ2VyID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlclRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkY29udGVudCA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJDb250ZW50XCJdJyk7XG5cblx0XHRcdCR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnaGlzdG9yeSc6IGZ1bmN0aW9uIGhpc3RvcnkoKSB7XG5cdFx0XHR2YXIgJGhpc3RvcnkgPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbXNcIl0nKSxcblx0XHRcdFx0XHQkaGlzdG9yeUl0ZW0gPSAkKCdbZGF0YS1qcz1cImhpc3RvcnktaXRlbVwiXScpO1xuXG5cdFx0XHQkaGlzdG9yeS5jaGlsZHJlbigpLmFkZENsYXNzKCdpcy1zbWFsbCcpO1xuXG5cdFx0XHQkaGlzdG9yeUl0ZW0ub24oJ2NsaWNrIG1vdXNlZW50ZXInLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoICEkKHRoaXMpLmhhc0NsYXNzKCdpcy1sYXJnZScpICkge1xuXHRcdFx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHQvLyAkKHRoaXMpLnJlbW92ZUNsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J292ZXJsYXknOiBmdW5jdGlvbiBvdmVybGF5KCkge1xuXHRcdFx0dmFyICRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXkgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheVRyaWdnZXIgPSAkKCdbZGF0YS1qcz1cIm92ZXJsYXlUcmlnZ2VyXCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDbG9zZSA9ICQoJ1tkYXRhLWpzPVwiY2xvc2VPdmVybGF5XCJdJyksXG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheS1jYXJvdXNlbFwiXScpO1xuXG5cblx0XHRcdCRvdmVybGF5VHJpZ2dlci5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHR2YXIgb3ZlcmxheU51bWJlciA9ICQodGhpcykuYXR0cignZGF0YS1vdmVybGF5Jyk7XG5cdFx0XHRcdCQoJ1tkYXRhLW92ZXJsYXludW1iZXI9Jysgb3ZlcmxheU51bWJlciArJ10nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLmFkZENsYXNzKCdpcy1vdmVybGF5Jyk7XG5cblx0XHRcdFx0Ly8gSW5pdCBjYXJvdXNlbCBpZiBpdCBoYXMgb25lXG5cdFx0XHRcdGlmICggJCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmhhc0NsYXNzKCdpcy1jYXJvdXNlbCcpKSB7XG5cdFx0XHRcdFx0JG92ZXJsYXlDYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0XHRhcnJvd3M6IHRydWUsXG5cdFx0XHRcdFx0XHRkb3RzOiB0cnVlLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0ICAgICAgICBhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdCAgICAgICAgZG90czogdHJ1ZVxuXHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCRvdmVybGF5Q2xvc2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5yZW1vdmVDbGFzcygnaXMtb3ZlcmxheScpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0bGluay5yZW1vdmVDbGFzcyhcImlzLWFjdGl2ZVwiKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKFwiaXMtYWN0aXZlXCIpO1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnc2Nyb2xsVG8nOiBmdW5jdGlvbiBzY3JvbGxUbygpIHtcblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgaW5kZXggPSAgICQodGhpcykuZGF0YSgnc2VjdGlvbicpLFxuXHRcdFx0XHRcdFx0c2VjdGlvbiA9IFwiI3NlY3Rpb24wXCIgKyBpbmRleDtcblxuXHRcdFx0XHQvLyAkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKHNlY3Rpb24sIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oXCIjc2VjdGlvbjAyXCIsIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiBcdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cbiBcdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cbiBcdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcbiBcdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0ICB9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzbmFwVG8nOiBmdW5jdGlvbiBzbmFwVG8oKSB7XG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIiksXG5cdFx0XHRcdFx0JGNvbnRpbnVlQnRuID0gJCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpO1xuXG5cblx0XHRcdHZhciBvcHRpb25zID0ge1xuXHRcdFx0XHRcdCRtZW51OiAkKCcuTmF2aWdhdGlvbi1pdGVtcycpLFxuXHRcdFx0XHRcdHBhbmVsU2VsZWN0b3I6ICcuU2VjdGlvbicsXG5cdFx0XHRcdFx0bmFtZXNwYWNlOiAnLnBhbmVsU25hcCcsXG5cdFx0XHRcdFx0b25TbmFwU3RhcnQ6IGZ1bmN0aW9uKCR0YXJnZXQpIHtcblx0XHRcdFx0XHRcdHZhciBpbmRleCA9ICR0YXJnZXQuZGF0YSgncGFuZWwnKTtcblxuXHRcdFx0XHRcdFx0LyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHRcdCQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHRcdCQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0XHRoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cblx0XHRcdFx0XHRcdC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHRcdHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcblx0XHRcdFx0XHRcdGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0ZGlyZWN0aW9uVGhyZXNob2xkOiA0MDAsXG5cdFx0XHRcdFx0c2xpZGVTcGVlZDogNDAwLFxuXHRcdFx0XHRcdGVhc2luZzogJ3N3aW5nJyxcblx0XHRcdFx0XHRvZmZzZXQ6IDAsXG5cdFx0XHRcdFx0bmF2aWdhdGlvbjoge1xuXHRcdFx0XHRcdFx0a2V5czoge1xuXHRcdFx0XHRcdFx0XHRuZXh0S2V5OiA0MCxcblx0XHRcdFx0XHRcdFx0cHJldktleTogMzgsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0YnV0dG9uczoge1xuXHRcdFx0XHRcdFx0XHQkbmV4dEJ1dHRvbjogJGNvbnRpbnVlQnRuLFxuXHRcdFx0XHRcdFx0XHQkcHJldkJ1dHRvbjogZmFsc2UsXG5cdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0d3JhcEFyb3VuZDogZmFsc2Vcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH07XG5cblx0ICAgICQoJ2JvZHknKS5wYW5lbFNuYXAob3B0aW9ucyk7XG5cblx0XHRcdC8qIFNsaWRlIHRvIHNlY3Rpb24gb24gbmF2IGxpbmsgY2xpY2sgKi9cblx0XHRcdCRuYXZMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0Ly8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KTtcblx0XHR9XG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcbn0pO1xuIl19