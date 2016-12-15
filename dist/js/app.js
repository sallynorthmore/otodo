var app = {

	'init': function init() {
		this.menu();
		this.expander();
		this.overlay();
		this.scrollTo();

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
			var section = "#section0" + $(this).data('section');
			console.log("nav link click and section is " + section);
			// $container.moveTo(section);
			$(window).scrollTo(section, 500, {
				onAfter: function () {
					console.log("after!");
				}
			});
		});

		/* Continue button */
		$('[data-js="continue"]').on('click', function (event) {
			event.preventDefault();
			// $container.moveTo(2);
			$(window).scrollTo("#section02", 500, {
				onAfter: function () {
					console.log("after!");
				}
			});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIm92ZXJsYXkiLCJzY3JvbGxUbyIsIiQiLCJoYXNDbGFzcyIsImNhcm91c2VsIiwiaGlzdG9yeSIsIiRjYXJvdXNlbCIsIiRjYXJvdXNlbE5hdiIsInNsaWNrIiwiYXJyb3dzIiwicmVzcG9uc2l2ZSIsImJyZWFrcG9pbnQiLCJzZXR0aW5ncyIsImNoaWxkcmVuIiwib24iLCJpbmRleCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCJ3aW5kb3ciLCJvbnJlc2l6ZSIsImlubmVyV2lkdGgiLCIkaXRlbSIsIiR0cmlnZ2VyIiwiZmluZCIsIiRjb250ZW50IiwicGFyZW50IiwidG9nZ2xlQ2xhc3MiLCIkaGlzdG9yeSIsIiRoaXN0b3J5SXRlbSIsIiRwYWdlIiwiJG92ZXJsYXkiLCIkb3ZlcmxheVRyaWdnZXIiLCIkb3ZlcmxheUNsb3NlIiwiJG92ZXJsYXlDYXJvdXNlbCIsIm92ZXJsYXlOdW1iZXIiLCJhdHRyIiwiZG90cyIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsIm9uZXBhZ2UiLCIkY29udGFpbmVyIiwiJG5hdkxpbmsiLCJoZWFkZXIiLCJoZWFkZXJDbGFzcyIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImN1ckNsYXNzIiwibG9vcCIsImtleWJvYXJkIiwicmVzcG9uc2l2ZUZhbGxiYWNrIiwiZGlyZWN0aW9uIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInNlY3Rpb24iLCJkYXRhIiwibW92ZVRvIiwiY29uc29sZSIsImxvZyIsIm9uQWZ0ZXIiLCJkb2N1bWVudCIsInJlYWR5Il0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixP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QXNDO0FBQ3JDZ0UsYUFBUyxZQUFXO0FBQ2pCRixhQUFRQyxHQUFSLENBQVksUUFBWjtBQUNEO0FBSG1DLElBQXRDO0FBS0EsR0FSRDtBQVNBOztBQWxPTyxDQUFWOztBQXdPQTs7OztBQUlBOUQsRUFBRWdFLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUUzQnZFLEtBQUlDLElBQUo7QUFDQWtFLFNBQVFDLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxzQ0FBM0M7QUFDRCxDQUpEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSB7XG5cblx0XHQnaW5pdCc6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHR0aGlzLm1lbnUoKTtcblx0XHRcdHRoaXMuZXhwYW5kZXIoKTtcblx0XHRcdHRoaXMub3ZlcmxheSgpO1xuXHRcdFx0dGhpcy5zY3JvbGxUbygpO1xuXG5cdFx0XHQvLyBJbml0aWFsaXNlIHNjcm9sbCBvbiBkZXNrdG9wICYgYWRkIENTU1xuXHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnZGVza3RvcCcpKSB7XG5cdFx0XHRcdC8vIEFkZCBvbmUtcGFnZSBzY3JvbGwgY3NzICYganNcblx0XHRcdFx0Ly8gJChcIjxsaW5rLz5cIiwge1xuXHRcdFx0XHQvLyAgICByZWw6IFwic3R5bGVzaGVldFwiLFxuXHRcdFx0XHQvLyAgICB0eXBlOiBcInRleHQvY3NzXCIsXG5cdFx0XHRcdC8vICAgIGhyZWY6IFwiL2Nzcy9vbmVwYWdlLXNjcm9sbC5jc3NcIlxuXHRcdFx0XHQvLyB9KS5hcHBlbmRUbyhcImhlYWRcIik7XG5cdFx0XHRcdC8vIHRoaXMub25lcGFnZSgpO1xuXG5cdFx0XHRcdC8vIGluaXRpYWxpc2Ugc2xpY2tqc1xuXHRcdFx0XHR0aGlzLmNhcm91c2VsKCk7XG5cdFx0XHRcdHRoaXMuaGlzdG9yeSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnY2Fyb3VzZWwnOiBmdW5jdGlvbiBjYXJvdXNlbCgpIHtcblx0XHRcdFx0dmFyICRjYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWxcIl0nKSxcblx0XHRcdFx0XHRcdCRjYXJvdXNlbE5hdiA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWwtbmF2XCJdJyk7XG5cblx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdHJlc3BvbnNpdmU6IFtcblx0XHRcdFx0ICAgIHtcblx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHQgICAgICBzZXR0aW5nczogXCJ1bnNsaWNrXCJcblx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHQvLyBNYWtlIHNsaWRlcyByZXNwb25kIHRvIG5hdlxuXHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpbmRleCA9ICQodGhpcykuaW5kZXgoKTtcblxuXHRcdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3NsaWNrR29UbycsIGluZGV4KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGljayByZWluaXQgd2hlbiBicm93c2VyIHNpemUgaW5jcmVhc2VkICYgaXQgaXNuJ3QgYWxyZWFkeSBpbml0aWFsaXplZFxuXHRcdFx0XHR3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA+PSA4NjAgJiYgISRjYXJvdXNlbC5oYXNDbGFzcygnc2xpY2staW5pdGlhbGl6ZWQnKSkge1xuXG5cdFx0XHRcdFx0XHQvLyBEZXN0cm95IGFuZCByZWluaXQgc2xpY2tcblx0XHRcdFx0XHRcdCRjYXJvdXNlbC5zbGljaygndW5zbGljaycpO1xuXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRcdFx0XHRhcnJvd3M6IGZhbHNlLFxuXHRcdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0XHQgICAge1xuXHRcdFx0XHRcdFx0ICAgICAgYnJlYWtwb2ludDogODYwLFxuXHRcdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdFx0XHQgICAgfSxcblx0XHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdleHBhbmRlcic6IGZ1bmN0aW9uIGV4cGFuZGVyKCl7XG5cdFx0XHR2YXIgJGl0ZW0gPSAkKCdbZGF0YS1qcz1cImV4cGFuZGVyXCJdJyksXG5cdFx0XHRcdFx0JHRyaWdnZXIgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyVHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRjb250ZW50ID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlckNvbnRlbnRcIl0nKTtcblxuXHRcdFx0JHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdoaXN0b3J5JzogZnVuY3Rpb24gaGlzdG9yeSgpIHtcblx0XHRcdHZhciAkaGlzdG9yeSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtc1wiXScpLFxuXHRcdFx0XHRcdCRoaXN0b3J5SXRlbSA9ICQoJ1tkYXRhLWpzPVwiaGlzdG9yeS1pdGVtXCJdJyk7XG5cblx0XHRcdCRoaXN0b3J5LmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2lzLXNtYWxsJyk7XG5cblx0XHRcdCRoaXN0b3J5SXRlbS5vbignY2xpY2sgbW91c2VlbnRlcicsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggISQodGhpcykuaGFzQ2xhc3MoJ2lzLWxhcmdlJykgKSB7XG5cdFx0XHRcdFx0JGhpc3RvcnkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtbGFyZ2UnKTtcblx0XHRcdFx0XHQkKHRoaXMpLmFkZENsYXNzKCdpcy1sYXJnZScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdC8vICQodGhpcykucmVtb3ZlQ2xhc3MoJ2lzLWxhcmdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb3ZlcmxheSc6IGZ1bmN0aW9uIG92ZXJsYXkoKSB7XG5cdFx0XHR2YXIgJHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheSA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVwiXScpLFxuXHRcdFx0XHRcdCRvdmVybGF5VHJpZ2dlciA9ICQoJ1tkYXRhLWpzPVwib3ZlcmxheVRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNsb3NlID0gJCgnW2RhdGEtanM9XCJjbG9zZU92ZXJsYXlcIl0nKSxcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsID0gJCgnW2RhdGEtanM9XCJvdmVybGF5LWNhcm91c2VsXCJdJyk7XG5cblxuXHRcdFx0JG92ZXJsYXlUcmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBvdmVybGF5TnVtYmVyID0gJCh0aGlzKS5hdHRyKCdkYXRhLW92ZXJsYXknKTtcblx0XHRcdFx0JCgnW2RhdGEtb3ZlcmxheW51bWJlcj0nKyBvdmVybGF5TnVtYmVyICsnXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JHBhZ2UuYWRkQ2xhc3MoJ2lzLW92ZXJsYXknKTtcblxuXHRcdFx0XHQvLyBJbml0IGNhcm91c2VsIGlmIGl0IGhhcyBvbmVcblx0XHRcdFx0aWYgKCAkKCdbZGF0YS1vdmVybGF5bnVtYmVyPScrIG92ZXJsYXlOdW1iZXIgKyddJykuaGFzQ2xhc3MoJ2lzLWNhcm91c2VsJykpIHtcblx0XHRcdFx0XHQkb3ZlcmxheUNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdGFycm93czogdHJ1ZSxcblx0XHRcdFx0XHRcdGRvdHM6IHRydWUsXG5cdFx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHQgICAgICBicmVha3BvaW50OiA4NjAsXG5cdFx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IHtcblx0XHRcdFx0XHQgICAgICAgIGFycm93czogZmFsc2UsXG5cdFx0XHRcdFx0ICAgICAgICBkb3RzOiB0cnVlXG5cdFx0XHRcdFx0ICAgICAgfVxuXHRcdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdFx0XVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JG92ZXJsYXlDbG9zZS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHQkb3ZlcmxheS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRwYWdlLnJlbW92ZUNsYXNzKCdpcy1vdmVybGF5Jyk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J21lbnUnOiBmdW5jdGlvbiBtZW51KCkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9ICQoJ1tkYXRhLWpzPVwibmF2YnV0dG9uXCJdJyksXG5cdFx0XHRcdFx0cGFnZSA9ICQoJ1tkYXRhLWpzPVwicGFnZVwiXScpLFxuXHRcdFx0XHRcdGxpbmsgPSAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cblx0XHRcdGJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAob3Blbikge1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYWdlLmFkZENsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J29uZXBhZ2UnOiBmdW5jdGlvbiBvbmVwYWdlKCkge1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdGhlYWRlciA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJyksXG4gIFx0XHQgXHRcdGhlYWRlckNsYXNzID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKS5hdHRyKFwiY2xhc3NcIik7XG5cblxuXHRcdFx0JGNvbnRhaW5lci5vbmVwYWdlX3Njcm9sbCh7XG5cdFx0XHRcdHNlY3Rpb25Db250YWluZXI6ICdbZGF0YS1qcz1cInNlY3Rpb25cIl0nLFxuXHRcdFx0ICAgZWFzaW5nOiBcImVhc2Utb3V0XCIsXG5cdFx0XHQgICBhbmltYXRpb25UaW1lOiA1MDAsXG5cdFx0XHQgICBwYWdpbmF0aW9uOiBmYWxzZSxcblx0XHRcdCAgIHVwZGF0ZVVSTDogZmFsc2UsXG5cdFx0XHQgICBiZWZvcmVNb3ZlOiBmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGxpbmsgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdCAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0ICQoJ1tkYXRhLXNlY3Rpb249XCInICsgaW5kZXggKydcIl0nKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGhlYWRlckNsYXNzKTtcblxuXHRcdFx0XHRcdCAvKiBVcGRhdGUgbmF2IGNvbnRhaW5lciBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0IHZhciBjdXJDbGFzcyA9IGhlYWRlckNsYXNzICsgXCIgaXMtXCIgKyBpbmRleDtcblx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgY3VyQ2xhc3MpO1xuXHRcdFx0XHQgfSxcblx0XHRcdCAgIGxvb3A6IGZhbHNlLFxuXHRcdFx0ICAga2V5Ym9hcmQ6IHRydWUsXG5cdFx0XHQgICByZXNwb25zaXZlRmFsbGJhY2s6IDYwMCxcblx0XHRcdCAgIGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiXG5cdFx0XHR9KTtcblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgc2VjdGlvbiA9ICQodGhpcykuZGF0YSgnc2VjdGlvbicpO1xuXHRcdFx0XHQkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCRjb250YWluZXIubW92ZVRvKDIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdzY3JvbGxUbyc6IGZ1bmN0aW9uIHNjcm9sbFRvKCkge1xuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBzZWN0aW9uID0gXCIjc2VjdGlvbjBcIiArICAkKHRoaXMpLmRhdGEoJ3NlY3Rpb24nKTtcblx0XHRcdFx0Y29uc29sZS5sb2coXCJuYXYgbGluayBjbGljayBhbmQgc2VjdGlvbiBpcyBcIiArIHNlY3Rpb24pO1xuXHRcdFx0XHQvLyAkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvKHNlY3Rpb24sIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQgICAgY29uc29sZS5sb2coXCJhZnRlciFcIik7XG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdC8vICRjb250YWluZXIubW92ZVRvKDIpO1xuXHRcdFx0XHQkKHdpbmRvdykuc2Nyb2xsVG8oXCIjc2VjdGlvbjAyXCIsIDUwMCwge1xuXHRcdFx0XHRcdG9uQWZ0ZXI6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQgICAgY29uc29sZS5sb2coXCJhZnRlciFcIik7XG5cdFx0XHRcdCAgfVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH1cblxuXG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcblx0XHRjb25zb2xlLmxvZyhcIiVjICAgKioqKiogTG9hZGVkICoqKioqKiAgIFwiLCAnYmFja2dyb3VuZC1jb2xvcjogIzBmMDsgY29sb3I6ICNmZmY7Jyk7XG59KTtcbiJdfQ==