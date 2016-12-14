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
			arrows: false
		});

		$carouselNav.children().on('click', function () {
			var index = $(this).index();

			$carouselNav.children().removeClass('is-active');
			$(this).addClass('is-active');
			$carousel.slick('slickGoTo', index);
		});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJleHBhbmRlciIsIiQiLCJoYXNDbGFzcyIsInJlbCIsInR5cGUiLCJocmVmIiwiYXBwZW5kVG8iLCJvbmVwYWdlIiwiY2Fyb3VzZWwiLCIkY2Fyb3VzZWwiLCIkY2Fyb3VzZWxOYXYiLCJzbGljayIsImFycm93cyIsImNoaWxkcmVuIiwib24iLCJpbmRleCIsInJlbW92ZUNsYXNzIiwiYWRkQ2xhc3MiLCIkaXRlbSIsIiR0cmlnZ2VyIiwiZmluZCIsIiRjb250ZW50IiwicGFyZW50IiwidG9nZ2xlQ2xhc3MiLCJidXR0b24iLCJwYWdlIiwibGluayIsIm9wZW4iLCIkY29udGFpbmVyIiwiJG5hdkxpbmsiLCJoZWFkZXIiLCJoZWFkZXJDbGFzcyIsImF0dHIiLCJvbmVwYWdlX3Njcm9sbCIsInNlY3Rpb25Db250YWluZXIiLCJlYXNpbmciLCJhbmltYXRpb25UaW1lIiwicGFnaW5hdGlvbiIsInVwZGF0ZVVSTCIsImJlZm9yZU1vdmUiLCJjdXJDbGFzcyIsImxvb3AiLCJrZXlib2FyZCIsInJlc3BvbnNpdmVGYWxsYmFjayIsImRpcmVjdGlvbiIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzZWN0aW9uIiwiZGF0YSIsIm1vdmVUbyIsImRvY3VtZW50IiwicmVhZHkiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixPQUFLQyxJQUFMO0FBQ0EsT0FBS0MsUUFBTDs7QUFFQTtBQUNBLE1BQUlDLEVBQUUsTUFBRixFQUFVQyxRQUFWLENBQW1CLFNBQW5CLENBQUosRUFBbUM7QUFDbEM7QUFDQUQsS0FBRSxTQUFGLEVBQWE7QUFDVkUsU0FBSyxZQURLO0FBRVZDLFVBQU0sVUFGSTtBQUdWQyxVQUFNO0FBSEksSUFBYixFQUlHQyxRQUpILENBSVksTUFKWjtBQUtBLFFBQUtDLE9B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Y0FBVztBQW5CWSxHQUExQjs7QUFzQkE7QUFDQWYsV0FBU2YsRUFBVCxDQUFZLE9BQVosRUFBcUIsVUFBUytCLEtBQVQsRUFBZTtBQUNuQ0EsU0FBTUMsY0FBTjtBQUNBLE9BQUlDLFVBQVU5QyxFQUFFLElBQUYsRUFBUStDLElBQVIsQ0FBYSxTQUFiLENBQWQ7QUFDQXBCLGNBQVdxQixNQUFYLENBQWtCRixPQUFsQjtBQUNBLEdBSkQ7O0FBTUE7QUFDQTlDLElBQUUsc0JBQUYsRUFBMEJhLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDLFVBQVMrQixLQUFULEVBQWU7QUFDcERBLFNBQU1DLGNBQU47QUFDQWxCLGNBQVdxQixNQUFYLENBQWtCLENBQWxCO0FBQ0EsR0FIRDtBQUlBO0FBaEhPLENBQVY7O0FBb0hBOzs7O0FBSUFoRCxFQUFFaUQsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7O0FBRTNCdEQsS0FBSUMsSUFBSjtBQUNBc0QsU0FBUUMsR0FBUixDQUFZLDZCQUFaLEVBQTJDLHNDQUEzQztBQUNELENBSkQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXHRcdFx0dGhpcy5leHBhbmRlcigpO1xuXG5cdFx0XHQvLyBJbml0aWFsaXNlIHNjcm9sbCBvbiBkZXNrdG9wICYgYWRkIENTU1xuXHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnZGVza3RvcCcpKSB7XG5cdFx0XHRcdC8vIEFkZCBvbmUtcGFnZSBzY3JvbGwgY3NzICYganNcblx0XHRcdFx0JChcIjxsaW5rLz5cIiwge1xuXHRcdFx0XHQgICByZWw6IFwic3R5bGVzaGVldFwiLFxuXHRcdFx0XHQgICB0eXBlOiBcInRleHQvY3NzXCIsXG5cdFx0XHRcdCAgIGhyZWY6IFwiL2Nzcy9vbmVwYWdlLXNjcm9sbC5jc3NcIlxuXHRcdFx0XHR9KS5hcHBlbmRUbyhcImhlYWRcIik7XG5cdFx0XHRcdHRoaXMub25lcGFnZSgpO1xuXG5cdFx0XHRcdC8vIGluaXRpYWxpc2Ugc2xpY2tqc1xuXHRcdFx0XHR0aGlzLmNhcm91c2VsKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdjYXJvdXNlbCc6IGZ1bmN0aW9uIGNhcm91c2VsKCkge1xuXHRcdFx0dmFyICRjYXJvdXNlbCA9ICQoJ1tkYXRhLWpzPVwiY2Fyb3VzZWxcIl0nKSxcblx0XHRcdFx0XHQkY2Fyb3VzZWxOYXYgPSAkKCdbZGF0YS1qcz1cImNhcm91c2VsLW5hdlwiXScpO1xuXG5cdFx0XHQkY2Fyb3VzZWwuc2xpY2soe1xuXHRcdFx0XHRhcnJvd3M6IGZhbHNlXG5cdFx0XHR9KTtcblxuXHRcdFx0JGNhcm91c2VsTmF2LmNoaWxkcmVuKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIGluZGV4ID0gJCh0aGlzKS5pbmRleCgpO1xuXG5cdFx0XHRcdCRjYXJvdXNlbE5hdi5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG5cdFx0XHRcdCRjYXJvdXNlbC5zbGljaygnc2xpY2tHb1RvJywgaW5kZXgpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdleHBhbmRlcic6IGZ1bmN0aW9uIGV4cGFuZGVyKCl7XG5cdFx0XHR2YXIgJGl0ZW0gPSAkKCdbZGF0YS1qcz1cImV4cGFuZGVyXCJdJyksXG5cdFx0XHRcdFx0JHRyaWdnZXIgPSAkaXRlbS5maW5kKCdbZGF0YS1qcz1cImV4cGFuZGVyVHJpZ2dlclwiXScpLFxuXHRcdFx0XHRcdCRjb250ZW50ID0gJGl0ZW0uZmluZCgnW2RhdGEtanM9XCJleHBhbmRlckNvbnRlbnRcIl0nKTtcblxuXHRcdFx0JHRyaWdnZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoKS50b2dnbGVDbGFzcyhcImlzLWV4cGFuZGVkXCIpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdvbmVwYWdlJzogZnVuY3Rpb24gb25lcGFnZSgpIHtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRoZWFkZXIgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLFxuICBcdFx0IFx0XHRoZWFkZXJDbGFzcyA9ICQoJ1tkYXRhLWpzPVwiaGVhZGVyXCJdJykuYXR0cihcImNsYXNzXCIpO1xuXG5cblx0XHRcdCRjb250YWluZXIub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0XHRzZWN0aW9uQ29udGFpbmVyOiAnW2RhdGEtanM9XCJzZWN0aW9uXCJdJyxcblx0XHRcdCAgIGVhc2luZzogXCJlYXNlLW91dFwiLFxuXHRcdFx0ICAgYW5pbWF0aW9uVGltZTogNTAwLFxuXHRcdFx0ICAgcGFnaW5hdGlvbjogZmFsc2UsXG5cdFx0XHQgICB1cGRhdGVVUkw6IGZhbHNlLFxuXHRcdFx0ICAgYmVmb3JlTW92ZTogZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBsaW5rIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHQgJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCAkKCdbZGF0YS1zZWN0aW9uPVwiJyArIGluZGV4ICsnXCJdJykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBoZWFkZXJDbGFzcyk7XG5cblx0XHRcdFx0XHQgLyogVXBkYXRlIG5hdiBjb250YWluZXIgY2xhc3Mgd2hlbiBzZWN0aW9uIGFjdGl2ZSAqL1xuXHRcdFx0XHRcdCB2YXIgY3VyQ2xhc3MgPSBoZWFkZXJDbGFzcyArIFwiIGlzLVwiICsgaW5kZXg7XG5cdFx0XHRcdFx0IGhlYWRlci5hdHRyKCdjbGFzcycsIGN1ckNsYXNzKTtcblx0XHRcdFx0IH0sXG5cdFx0XHQgICBsb29wOiBmYWxzZSxcblx0XHRcdCAgIGtleWJvYXJkOiB0cnVlLFxuXHRcdFx0ICAgcmVzcG9uc2l2ZUZhbGxiYWNrOiA2MDAsXG5cdFx0XHQgICBkaXJlY3Rpb246IFwidmVydGljYWxcIlxuXHRcdFx0fSk7XG5cblx0XHRcdC8qIFNsaWRlIHRvIHNlY3Rpb24gb24gbmF2IGxpbmsgY2xpY2sgKi9cblx0XHRcdCRuYXZMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0dmFyIHNlY3Rpb24gPSAkKHRoaXMpLmRhdGEoJ3NlY3Rpb24nKTtcblx0XHRcdFx0JGNvbnRhaW5lci5tb3ZlVG8oc2VjdGlvbik7XG5cdFx0XHR9KTtcblxuXHRcdFx0LyogQ29udGludWUgYnV0dG9uICovXG5cdFx0XHQkKCdbZGF0YS1qcz1cImNvbnRpbnVlXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHQkY29udGFpbmVyLm1vdmVUbygyKTtcblx0XHRcdH0pO1xuXHRcdH1cbn07XG5cblxuLyoqXG4gKiBTVEFSVCBQT0lOVFxuKi9cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0XHRhcHAuaW5pdCgpO1xuXHRcdGNvbnNvbGUubG9nKFwiJWMgICAqKioqKiBMb2FkZWQgKioqKioqICAgXCIsICdiYWNrZ3JvdW5kLWNvbG9yOiAjMGYwOyBjb2xvcjogI2ZmZjsnKTtcbn0pO1xuIl19