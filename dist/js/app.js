var app = {

	'init': function init() {
		this.menu();
		this.expander();

		// Initialise scroll on desktop & add CSS
		if ($('html').hasClass('desktop')) {
			// Add one-page scroll css & js
			$("<link/>", {
				rel: "stylesheet",
				type: "text/css",
				href: "/css/onepage-scroll.css"
			}).appendTo("head");
			this.onepage();

			// initialise slickjs
			this.carousel();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIiQiLCJoYXNDbGFzcyIsInJlbCIsInR5cGUiLCJocmVmIiwiYXBwZW5kVG8iLCJvbmVwYWdlIiwiY2Fyb3VzZWwiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsInJlc3BvbnNpdmUiLCJicmVha3BvaW50Iiwic2V0dGluZ3MiLCJjaGlsZHJlbiIsIm9uIiwiaW5kZXgiLCJyZW1vdmVDbGFzcyIsImFkZENsYXNzIiwid2luZG93Iiwib25yZXNpemUiLCJpbm5lcldpZHRoIiwiJGl0ZW0iLCIkdHJpZ2dlciIsImZpbmQiLCIkY29udGVudCIsInBhcmVudCIsInRvZ2dsZUNsYXNzIiwiYnV0dG9uIiwicGFnZSIsImxpbmsiLCJvcGVuIiwiJGNvbnRhaW5lciIsIiRuYXZMaW5rIiwiaGVhZGVyIiwiaGVhZGVyQ2xhc3MiLCJhdHRyIiwib25lcGFnZV9zY3JvbGwiLCJzZWN0aW9uQ29udGFpbmVyIiwiZWFzaW5nIiwiYW5pbWF0aW9uVGltZSIsInBhZ2luYXRpb24iLCJ1cGRhdGVVUkwiLCJiZWZvcmVNb3ZlIiwiY3VyQ2xhc3MiLCJsb29wIiwia2V5Ym9hcmQiLCJyZXNwb25zaXZlRmFsbGJhY2siLCJkaXJlY3Rpb24iLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwic2VjdGlvbiIsImRhdGEiLCJtb3ZlVG8iLCJkb2N1bWVudCIsInJlYWR5IiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsTUFBTTs7QUFFUixTQUFRLFNBQVNDLElBQVQsR0FBZ0I7QUFDdkIsT0FBS0MsSUFBTDtBQUNBLE9BQUtDLFFBQUw7O0FBRUE7QUFDQSxNQUFJQyxFQUFFLE1BQUYsRUFBVUMsUUFBVixDQUFtQixTQUFuQixDQUFKLEVBQW1DO0FBQ2xDO0FBQ0FELEtBQUUsU0FBRixFQUFhO0FBQ1ZFLFNBQUssWUFESztB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LCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cdFx0XHR0aGlzLmV4cGFuZGVyKCk7XG5cblx0XHRcdC8vIEluaXRpYWxpc2Ugc2Nyb2xsIG9uIGRlc2t0b3AgJiBhZGQgQ1NTXG5cdFx0XHRpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdkZXNrdG9wJykpIHtcblx0XHRcdFx0Ly8gQWRkIG9uZS1wYWdlIHNjcm9sbCBjc3MgJiBqc1xuXHRcdFx0XHQkKFwiPGxpbmsvPlwiLCB7XG5cdFx0XHRcdCAgIHJlbDogXCJzdHlsZXNoZWV0XCIsXG5cdFx0XHRcdCAgIHR5cGU6IFwidGV4dC9jc3NcIixcblx0XHRcdFx0ICAgaHJlZjogXCIvY3NzL29uZXBhZ2Utc2Nyb2xsLmNzc1wiXG5cdFx0XHRcdH0pLmFwcGVuZFRvKFwiaGVhZFwiKTtcblx0XHRcdFx0dGhpcy5vbmVwYWdlKCk7XG5cblx0XHRcdFx0Ly8gaW5pdGlhbGlzZSBzbGlja2pzXG5cdFx0XHRcdHRoaXMuY2Fyb3VzZWwoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J2Nhcm91c2VsJzogZnVuY3Rpb24gY2Fyb3VzZWwoKSB7XG5cdFx0XHRcdHZhciAkY2Fyb3VzZWwgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsXCJdJyksXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljayh7XG5cdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRyZXNwb25zaXZlOiBbXG5cdFx0XHRcdCAgICB7XG5cdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0ICAgICAgc2V0dGluZ3M6IFwidW5zbGlja1wiXG5cdFx0XHRcdCAgICB9LFxuXHRcdFx0XHRcdF1cblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0Ly8gTWFrZSBzbGlkZXMgcmVzcG9uZCB0byBuYXZcblx0XHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKCdzbGlja0dvVG8nLCBpbmRleCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc2xpY2sgcmVpbml0IHdoZW4gYnJvd3NlciBzaXplIGluY3JlYXNlZCAmIGl0IGlzbid0IGFscmVhZHkgaW5pdGlhbGl6ZWRcblx0XHRcdFx0d2luZG93Lm9ucmVzaXplID0gZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRpZiAod2luZG93LmlubmVyV2lkdGggPj0gODYwICYmICEkY2Fyb3VzZWwuaGFzQ2xhc3MoJ3NsaWNrLWluaXRpYWxpemVkJykpIHtcblxuXHRcdFx0XHRcdFx0Ly8gRGVzdHJveSBhbmQgcmVpbml0IHNsaWNrXG5cdFx0XHRcdFx0XHQkY2Fyb3VzZWwuc2xpY2soJ3Vuc2xpY2snKTtcblxuXHRcdFx0XHRcdFx0JGNhcm91c2VsLnNsaWNrKHtcblx0XHRcdFx0XHRcdFx0YXJyb3dzOiBmYWxzZSxcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2l2ZTogW1xuXHRcdFx0XHRcdFx0ICAgIHtcblx0XHRcdFx0XHRcdCAgICAgIGJyZWFrcG9pbnQ6IDg2MCxcblx0XHRcdFx0XHRcdCAgICAgIHNldHRpbmdzOiBcInVuc2xpY2tcIlxuXHRcdFx0XHRcdFx0ICAgIH0sXG5cdFx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnZXhwYW5kZXInOiBmdW5jdGlvbiBleHBhbmRlcigpe1xuXHRcdFx0dmFyICRpdGVtID0gJCgnW2RhdGEtanM9XCJleHBhbmRlclwiXScpLFxuXHRcdFx0XHRcdCR0cmlnZ2VyID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlclRyaWdnZXJcIl0nKSxcblx0XHRcdFx0XHQkY29udGVudCA9ICRpdGVtLmZpbmQoJ1tkYXRhLWpzPVwiZXhwYW5kZXJDb250ZW50XCJdJyk7XG5cblx0XHRcdCR0cmlnZ2VyLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCQodGhpcykucGFyZW50KCkudG9nZ2xlQ2xhc3MoXCJpcy1leHBhbmRlZFwiKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnbWVudSc6IGZ1bmN0aW9uIG1lbnUoKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnW2RhdGEtanM9XCJuYXZidXR0b25cIl0nKSxcblx0XHRcdFx0XHRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0bGluayA9ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblxuXHRcdFx0YnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChvcGVuKSB7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhZ2UuYWRkQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGluay5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb25lcGFnZSc6IGZ1bmN0aW9uIG9uZXBhZ2UoKSB7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXG5cdFx0XHQkY29udGFpbmVyLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogJ1tkYXRhLWpzPVwic2VjdGlvblwiXScsXG5cdFx0XHQgICBlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdCAgIGFuaW1hdGlvblRpbWU6IDUwMCxcblx0XHRcdCAgIHBhZ2luYXRpb246IGZhbHNlLFxuXHRcdFx0ICAgdXBkYXRlVVJMOiBmYWxzZSxcblx0XHRcdCAgIGJlZm9yZU1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCB9LFxuXHRcdFx0ICAgbG9vcDogZmFsc2UsXG5cdFx0XHQgICBrZXlib2FyZDogdHJ1ZSxcblx0XHRcdCAgIHJlc3BvbnNpdmVGYWxsYmFjazogNjAwLFxuXHRcdFx0ICAgZGlyZWN0aW9uOiBcInZlcnRpY2FsXCJcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBzZWN0aW9uID0gJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyk7XG5cdFx0XHRcdCRjb250YWluZXIubW92ZVRvKHNlY3Rpb24pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JGNvbnRhaW5lci5tb3ZlVG8oMik7XG5cdFx0XHR9KTtcblx0XHR9XG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcblx0XHRjb25zb2xlLmxvZyhcIiVjICAgKioqKiogTG9hZGVkICoqKioqKiAgIFwiLCAnYmFja2dyb3VuZC1jb2xvcjogIzBmMDsgY29sb3I6ICNmZmY7Jyk7XG59KTtcbiJdfQ==