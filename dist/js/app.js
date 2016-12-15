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
					dots: false,
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
	}
};

/**
 * START POINT
*/

$(document).ready(function () {

	app.init();
	console.log("%c   ***** Loaded ******   ", 'background-color: #0f0; color: #fff;');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCIkIiwiaGFzQ2xhc3MiLCJjYXJvdXNlbCIsImhpc3RvcnkiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiJGhpc3RvcnkiLCIkaGlzdG9yeUl0ZW0iLCIkcGFnZSIsIiRvdmVybGF5IiwiJG92ZXJsYXlUcmlnZ2VyIiwiJG92ZXJsYXlDbG9zZSIsIiRvdmVybGF5Q2Fyb3VzZWwiLCJvdmVybGF5TnVtYmVyIiwiYXR0ciIsImRvdHMiLCJidXR0b24iLCJwYWdlIiwibGluayIsIm9wZW4iLCJvbmVwYWdlIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJvbmVwYWdlX3Njcm9sbCIsInNlY3Rpb25Db250YWluZXIiLCJlYXNpbmciLCJhbmltYXRpb25UaW1lIiwicGFnaW5hdGlvbiIsInVwZGF0ZVVSTCIsImJlZm9yZU1vdmUiLCJjdXJDbGFzcyIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzZWN0aW9uIiwiZGF0YSIsIm1vdmVUbyIsImRvY3VtZW50IiwicmVhZHkiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixPQUFLQyxJQUFMO0FBQ0EsT0FBS0Ms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LENBQWEsU0FBYixDQUFkO0FBQ0FuQixjQUFXb0IsTUFBWCxDQUFrQkYsT0FBbEI7QUFDQSxHQUpEOztBQU1BO0FBQ0ExRCxJQUFFLHNCQUFGLEVBQTBCWSxFQUExQixDQUE2QixPQUE3QixFQUFzQyxVQUFTNEMsS0FBVCxFQUFlO0FBQ3BEQSxTQUFNQyxjQUFOO0FBQ0FqQixjQUFXb0IsTUFBWCxDQUFrQixDQUFsQjtBQUNBLEdBSEQ7QUFJQTtBQWxNTyxDQUFWOztBQXNNQTs7OztBQUlBNUQsRUFBRTZELFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUUzQm5FLEtBQUlDLElBQUo7QUFDQW1FLFNBQVFDLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxzQ0FBM0M7QUFDRCxDQUpEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSB7XG5cblx0XHQnaW5pdCc6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHR0aGlzLm1lbnUoKTtcblx0XHRcdHRoaXMuZXhwYW5kZXIoKTtcblx0XHRcdHRoaXMub3ZlcmxheSgpO1xuXG5cdFx0XHQvLyBJbml0aWFsaXNlIHNjcm9sbCBvbiBkZXNrdG9wICYgYWRkIENTU1xuXHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnZGVza3RvcCcpKSB7XG5cdFx0XHRcdC8vIEFkZCBvbmUtcGFnZSBzY3JvbGwgY3NzICYganNcblx0XHRcdFx0Ly8gJChcIjxsaW5rLz5cIiwge1xuXHRcdFx0XHQvLyAgICByZWw6IFwic3R5bGVzaGVldFwiLFxuXHRcdFx0XHQvLyAgICB0eXBlOiBcInRleHQvY3NzXCIsXG5cdFx0XHRcdC8vICAgIGhyZWY6IFwiL2Nzcy9vbmVwYWdlLXNjcm9sbC5jc3NcIlxuXHRcdFx0XHQvLyB9KS5hcHBlbmRUbyhcImhlYWRcIik7XG5cdFx0XHRcdC8vIHRoaXMub25lcGFnZSgpO1xuXG5cdFx0XHRcdC8vIGluaXRpYWxpc2Ugc2xpY2tqc1xuXHRcdFx0XHR0aGlzLmNhcm91c2VsKCk7XG5cdFx0XHRcdHRoaXMuaGlzdG9yeSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnY2Fyb3VzZWwnOiBmdW5jdGlvbiBjYXJvdXNlbCgpIHtcblx0XHRcdFx0dmFyICRjYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWxcIl0nKSxcblx0XHRcdFx0XHRcdCRjYXJvdXNlbE5hdiA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWwtbmF2XCJdJyk7XG5cblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0ICAgIHtcblx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWRlcyByZXNwb25kIHRvIG5hdlxuXHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcblxuXHRcdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGljayByZWluaXQgd2hlbiBicm93c2VyIHNpemUgaW5jcmVhc2VkICYgaXQgaXNuJ3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0XHR3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA4NjAgJiYgISRjYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuXG5cdFx0XHRcdFx0XHQvLyBEZXN0cm95IGFuZCByZWluaXQgc2xpY2tcblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygndW5zbGljaycpO1xuXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdleHBhbmRlcic6IGZ1bmN0aW9uIGV4cGFuZGVyKCl7XG5cdFx0XHR2YXIgJGl0ZW0gPSAkKCdbZGF0YS1qcz1cImV4cGFuZGVyXCJdJyksXG5cdFx0XHRcdFx0JHRyaWdnZXIgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyVHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRjb250ZW50ID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlckNvbnRlbnRcIl0nKTtcblxuXHRcdFx0JHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdoaXN0b3J5JzogZnVuY3Rpb24gaGlzdG9yeSgpIHtcblx0XHRcdHZhciAkaGlzdG9yeSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtc1wiXScpLFxuXHRcdFx0XHRcdCRoaXN0b3J5SXRlbSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtXCJdJyk7XG5cblx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2lzLXNtYWxsJyk7XG5cblx0XHRcdCRoaXN0b3J5SXRlbS5vbignY2xpY2sgbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggISQodGhpcykuaGFzQ2xhc3MoJ2lzLWxhcmdlJykgKSB7XG5cdFx0XHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb3ZlcmxheSc6IGZ1bmN0aW9uIG92ZXJsYXkoKSB7XG5cdFx0XHR2YXIgJHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheSA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5VHJpZ2dlciA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNsb3NlID0gJCgnW2RhdGEtanM9XCJjbG9zZU92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsID0gJCgnW2RhdGEtanM9XCJvdmVybGF5LWNhcm91c2VsXCJdJyk7XG5cblxuXHRcdFx0JG92ZXJsYXlUcmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBvdmVybGF5TnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLW92ZXJsYXknKTtcblx0XHRcdFx0JCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UuYWRkQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblxuXHRcdFx0XHQvLyBJbml0IGNhcm91c2VsIGlmIGl0IGhhcyBvbmVcblx0XHRcdFx0aWYgKCAkKCdbZGF0YS1vdmVybGF5bnVtYmVyPScrIG92ZXJsYXlOdW1iZXIgKyddJykuaGFzQ2xhc3MoJ2lzLWNhcm91c2VsJykpIHtcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdFx0XHRcdGRvdHM6IGZhbHNlLFxuXHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdCAgICB7XG5cdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiB7XG5cdFx0XHRcdFx0ICAgICAgICBhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdCAgICAgICAgZG90czogdHJ1ZVxuXHRcdFx0XHRcdCAgICAgIH1cblx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCRvdmVybGF5Q2xvc2Uub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JG92ZXJsYXkucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHQkcGFnZS5yZW1vdmVDbGFzcygnaXMtb3ZlcmxheScpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdvbmVwYWdlJzogZnVuY3Rpb24gb25lcGFnZSgpIHtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpO1xuXG5cblx0XHRcdCRjb250YWluZXIub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0XHRzZWN0aW9uQ29udGFpbmVyOiAnW2RhdGEtanM9XCJzZWN0aW9uXCJdJyxcblx0XHRcdCAgIGVhc2luZzogXCJlYXNlLW91dFwiLFxuXHRcdFx0ICAgYW5pbWF0aW9uVGltZTogNTAwLFxuXHRcdFx0ICAgcGFnaW5hdGlvbjogZmFsc2UsXG5cdFx0XHQgICB1cGRhdGVVUkw6IGZhbHNlLFxuXHRcdFx0ICAgYmVmb3JlTW92ZTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCAkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cblx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdCB2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG5cdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0IH0sXG5cdFx0XHQgICBsb29wOiBmYWxzZSxcblx0XHRcdCAgIGtleWJvYXJkOiB0cnVlLFxuXHRcdFx0ICAgcmVzcG9uc2l2ZUZhbGxiYWNrOiA2MDAsXG5cdFx0XHQgICBkaXJlY3Rpb246IFwidmVydGljYWxcIlxuXHRcdFx0fSk7XG5cblx0XHRcdC8qIFNsaWRlIHRvIHNlY3Rpb24gb24gbmF2IGxpbmsgY2xpY2sgKi9cblx0XHRcdCRuYXZMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIHNlY3Rpb24gPSAkKHRoaXMpLmRhdGEoJ3NlY3Rpb24nKTtcblx0XHRcdFx0JGNvbnRhaW5lci5tb3ZlVG8oc2VjdGlvbik7XG5cdFx0XHR9KTtcblxuXHRcdFx0LyogQ29udGludWUgYnV0dG9uICovXG5cdFx0XHQkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkY29udGFpbmVyLm1vdmVUbygyKTtcblx0XHRcdH0pO1xuXHRcdH1cbn07XG5cblxuLyoqXG4gKiBTVEFSVCBQT0lOVFxuKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0XHRhcHAuaW5pdCgpO1xuXHRcdGNvbnNvbGUubG9nKFwiJWMgICAqKioqKiBMb2FkZWQgKioqKioqICAgXCIsICdiYWNrZ3JvdW5kLWNvbG9yOiAjMGYwOyBjb2xvcjogI2ZmZjsnKTtcbn0pO1xuIl19