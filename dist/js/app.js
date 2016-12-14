var app = {

	'init': function init() {
		this.menu();

		// Initialise scroll on desktop & add CSS
		if ($('html').hasClass('desktop')) {
			$("<link/>", {
				rel: "stylesheet",
				type: "text/css",
				href: "/css/onepage-scroll.css"
			}).appendTo("head");
			this.onepage();
		}
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
		    $navLink = $('[data-js="navlink"]');

		$container.onepage_scroll({
			sectionContainer: '[data-js="section"]', // sectionContainer accepts any kind of selector in case you don't want to use section
			easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
			// "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
			animationTime: 1000, // AnimationTime let you define how long each section takes to animate
			pagination: true, // You can either show or hide the pagination. Toggle true for show, false for hide.
			updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
			beforeMove: function (index) {
				/* Update nav link class when section active */
				$('[data-js="navlink"]').removeClass('is-active');
				$('[data-section="' + index + '"]').addClass('is-active');
			}, // This option accepts a callback function. The function will be called before the page moves.
			afterMove: function (index) {}, // This option accepts a callback function. The function will be called after the page moves.
			loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
			keyboard: true, // You can activate the keyboard controls
			responsiveFallback: false, // You can fallback to normal page scroll by defining the width of the browser in which
			// you want the responsive fallback to be triggered. For example, set this to 600 and whenever
			// the browser's width is less than 600, the fallback will kick in.
			direction: "vertical" // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCIkIiwiaGFzQ2xhc3MiLCJyZWwiLCJ0eXBlIiwiaHJlZiIsImFwcGVuZFRvIiwib25lcGFnZSIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsIm9uIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsIiRjb250YWluZXIiLCIkbmF2TGluayIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImluZGV4IiwiYWZ0ZXJNb3ZlIiwibG9vcCIsImtleWJvYXJkIiwicmVzcG9uc2l2ZUZhbGxiYWNrIiwiZGlyZWN0aW9uIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInNlY3Rpb24iLCJkYXRhIiwibW92ZVRvIiwiZG9jdW1lbnQiLCJyZWFkeSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE1BQU07O0FBRVIsU0FBUSxTQUFTQyxJQUFULEdBQWdCO0FBQ3ZCLE9BQUtDLElBQUw7O0FBRUE7QUFDQSxNQUFJQyxFQUFFLE1BQUYsRUFBVUMsUUFBVixDQUFtQixTQUFuQixDQUFKLEVBQW1DO0FBQ2xDRCxLQUFFLFNBQUYsRUFBYTtBQUNWRSxTQUFLLFlBREs7QUFFVkMsVUFBTSxVQUZJO0FBR1ZDLFVBQU07QUFISSxJQUFiLEVBSUdDLFFBSkgsQ0FJWSxNQUpaO0FBS0EsUUFBS0MsT0FBTDtBQUNBO0FBQ0QsRUFkTzs7QUFnQlIsU0FBUSxTQUFTUCxJQUFULEdBQWdCO0FBQ3ZCLE1BQUlRLFNBQVNQLEVBQUUsdUJBQUYsQ0FBYjtBQUFBLE1BQ0VRLE9BQU9SLEVBQUUsa0JBQUYsQ0FEVDtBQUFBLE1BRUVTLE9BQU9ULEVBQUUscUJBQUYsQ0FGVDtBQUFBLE1BR0VVLE9BQU8sS0FIVDs7QUFLQUgsU0FBT0ksRUFBUCxDQUFVLE9BQVYsRUFBbUIsWUFBVTtBQUM1QixPQUFJRCxJQUFKLEVBQVU7QUFDVEYsU0FBS0ksV0FBTCxDQUFpQixTQUFqQjtBQUNBRixXQUFPLEtBQVA7QUFDQSxJQUhELE1BR087QUFDTkYsU0FBS0ssUUFBTCxDQUFjLFNBQWQ7QUFDQUgsV0FBTyxJQUFQO0FBQ0E7QUFDRCxHQVJEOztBQVVBRCxPQUFLRSxFQUFMLENBQVEsT0FBUixFQUFpQixZQUFVO0FBQ3pCSCxRQUFLSSxXQUFMLENBQWlCLFNBQWpCO0FBQ0FGLFVBQU8sS0FBUDtBQUNELEdBSEQ7QUFJQSxFQXBDTzs7QUFzQ1IsWUFBVyxTQUFTSixPQUFULEdBQW1COztBQUU3QixNQUFJUSxhQUFhZCxFQUFFLG9CQUFGLENBQWpCO0FBQUEsTUFDRWUsV0FBVWYsRUFBRSxxQkFBRixDQURaOztBQUdBYyxhQUFXRSxjQUFYLENBQTBCO0FBQ3pCQyxxQkFBa0IscUJBRE8sRUFDb0I7QUFDM0NDLFdBQVEsTUFGZSxFQUVVO0FBQ0E7QUFDakNDLGtCQUFlLElBSlEsRUFJVTtBQUNqQ0MsZUFBWSxJQUxXLEVBS1U7QUFDakNDLGNBQVcsS0FOWSxFQU1VO0FBQ2pDQyxlQUFZLFVBQVNDLEtBQVQsRUFBZ0I7QUFDNUI7QUFDQXZCLE1BQUUscUJBQUYsRUFBeUJZLFdBQXpCLENBQXFDLFdBQXJDO0FBQ0FaLE1BQUUsb0JBQW9CdUIsS0FBcEIsR0FBMkIsSUFBN0IsRUFBbUNWLFFBQW5DLENBQTRDLFdBQTVDO0FBQ0EsSUFYdUIsRUFXcEI7QUFDSFcsY0FBVyxVQUFTRCxLQUFULEVBQWdCLENBRTNCLENBZHVCLEVBY25CO0FBQ0pFLFNBQU0sS0FmaUIsRUFlVTtBQUNqQ0MsYUFBVSxJQWhCYSxFQWdCVTtBQUNqQ0MsdUJBQW9CLEtBakJHLEVBaUJXO0FBQ0Q7QUFDQTtBQUNqQ0MsY0FBVyxVQXBCWSxDQW9CVTtBQXBCVixHQUExQjs7QUF3QkE7QUFDQWIsV0FBU0osRUFBVCxDQUFZLE9BQVosRUFBcUIsVUFBU2tCLEtBQVQsRUFBZTtBQUNuQ0EsU0FBTUMsY0FBTjtBQUNBLE9BQUlDLFVBQVUvQixFQUFFLElBQUYsRUFBUWdDLElBQVIsQ0FBYSxTQUFiLENBQWQ7QUFDQWxCLGNBQVdtQixNQUFYLENBQWtCRixPQUFsQjtBQUNBLEdBSkQ7O0FBTUE7QUFDQS9CLElBQUUsc0JBQUYsRUFBMEJXLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDLFVBQVNrQixLQUFULEVBQWU7QUFDcERBLFNBQU1DLGNBQU47QUFDQWhCLGNBQVdtQixNQUFYLENBQWtCLENBQWxCO0FBQ0EsR0FIRDtBQUlBO0FBL0VPLENBQVY7O0FBbUZBOzs7O0FBSUFqQyxFQUFFa0MsUUFBRixFQUFZQyxLQUFaLENBQWtCLFlBQVc7O0FBRTNCdEMsS0FBSUMsSUFBSjtBQUNBc0MsU0FBUUMsR0FBUixDQUFZLDZCQUFaLEVBQTJDLHNDQUEzQztBQUNELENBSkQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXG5cdFx0XHQvLyBJbml0aWFsaXNlIHNjcm9sbCBvbiBkZXNrdG9wICYgYWRkIENTU1xuXHRcdFx0aWYgKCQoJ2h0bWwnKS5oYXNDbGFzcygnZGVza3RvcCcpKSB7XG5cdFx0XHRcdCQoXCI8bGluay8+XCIsIHtcblx0XHRcdFx0ICAgcmVsOiBcInN0eWxlc2hlZXRcIixcblx0XHRcdFx0ICAgdHlwZTogXCJ0ZXh0L2Nzc1wiLFxuXHRcdFx0XHQgICBocmVmOiBcIi9jc3Mvb25lcGFnZS1zY3JvbGwuY3NzXCJcblx0XHRcdFx0fSkuYXBwZW5kVG8oXCJoZWFkXCIpO1xuXHRcdFx0XHR0aGlzLm9uZXBhZ2UoKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0J21lbnUnOiBmdW5jdGlvbiBtZW51KCkge1xuXHRcdFx0dmFyIGJ1dHRvbiA9ICQoJ1tkYXRhLWpzPVwibmF2YnV0dG9uXCJdJyksXG5cdFx0XHRcdFx0cGFnZSA9ICQoJ1tkYXRhLWpzPVwicGFnZVwiXScpLFxuXHRcdFx0XHRcdGxpbmsgPSAkKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKSxcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cblx0XHRcdGJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAob3Blbikge1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRwYWdlLmFkZENsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0J29uZXBhZ2UnOiBmdW5jdGlvbiBvbmVwYWdlKCkge1xuXG5cdFx0XHR2YXIgJGNvbnRhaW5lciA9ICQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJyksXG5cdFx0XHRcdFx0JG5hdkxpbmsgPSQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpO1xuXG5cdFx0XHQkY29udGFpbmVyLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogJ1tkYXRhLWpzPVwic2VjdGlvblwiXScsICAgICAvLyBzZWN0aW9uQ29udGFpbmVyIGFjY2VwdHMgYW55IGtpbmQgb2Ygc2VsZWN0b3IgaW4gY2FzZSB5b3UgZG9uJ3Qgd2FudCB0byB1c2Ugc2VjdGlvblxuXHRcdFx0ICAgZWFzaW5nOiBcImVhc2VcIiwgICAgICAgICAgICAgICAgICAvLyBFYXNpbmcgb3B0aW9ucyBhY2NlcHRzIHRoZSBDU1MzIGVhc2luZyBhbmltYXRpb24gc3VjaCBcImVhc2VcIiwgXCJsaW5lYXJcIiwgXCJlYXNlLWluXCIsXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImVhc2Utb3V0XCIsIFwiZWFzZS1pbi1vdXRcIiwgb3IgZXZlbiBjdWJpYyBiZXppZXIgdmFsdWUgc3VjaCBhcyBcImN1YmljLWJlemllcigwLjE3NSwgMC44ODUsIDAuNDIwLCAxLjMxMClcIlxuXHRcdFx0ICAgYW5pbWF0aW9uVGltZTogMTAwMCwgICAgICAgICAgICAgLy8gQW5pbWF0aW9uVGltZSBsZXQgeW91IGRlZmluZSBob3cgbG9uZyBlYWNoIHNlY3Rpb24gdGFrZXMgdG8gYW5pbWF0ZVxuXHRcdFx0ICAgcGFnaW5hdGlvbjogdHJ1ZSwgICAgICAgICAgICAgICAgLy8gWW91IGNhbiBlaXRoZXIgc2hvdyBvciBoaWRlIHRoZSBwYWdpbmF0aW9uLiBUb2dnbGUgdHJ1ZSBmb3Igc2hvdywgZmFsc2UgZm9yIGhpZGUuXG5cdFx0XHQgICB1cGRhdGVVUkw6IGZhbHNlLCAgICAgICAgICAgICAgICAvLyBUb2dnbGUgdGhpcyB0cnVlIGlmIHlvdSB3YW50IHRoZSBVUkwgdG8gYmUgdXBkYXRlZCBhdXRvbWF0aWNhbGx5IHdoZW4gdGhlIHVzZXIgc2Nyb2xsIHRvIGVhY2ggcGFnZS5cblx0XHRcdCAgIGJlZm9yZU1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0IH0sICAvLyBUaGlzIG9wdGlvbiBhY2NlcHRzIGEgY2FsbGJhY2sgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHBhZ2UgbW92ZXMuXG5cdFx0XHQgICBhZnRlck1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7XG5cblx0XHRcdFx0IH0sICAgLy8gVGhpcyBvcHRpb24gYWNjZXB0cyBhIGNhbGxiYWNrIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIHBhZ2UgbW92ZXMuXG5cdFx0XHQgICBsb29wOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIGhhdmUgdGhlIHBhZ2UgbG9vcCBiYWNrIHRvIHRoZSB0b3AvYm90dG9tIHdoZW4gdGhlIHVzZXIgbmF2aWdhdGVzIGF0IHVwL2Rvd24gb24gdGhlIGZpcnN0L2xhc3QgcGFnZS5cblx0XHRcdCAgIGtleWJvYXJkOiB0cnVlLCAgICAgICAgICAgICAgICAgIC8vIFlvdSBjYW4gYWN0aXZhdGUgdGhlIGtleWJvYXJkIGNvbnRyb2xzXG5cdFx0XHQgICByZXNwb25zaXZlRmFsbGJhY2s6IGZhbHNlLCAgICAgICAgLy8gWW91IGNhbiBmYWxsYmFjayB0byBub3JtYWwgcGFnZSBzY3JvbGwgYnkgZGVmaW5pbmcgdGhlIHdpZHRoIG9mIHRoZSBicm93c2VyIGluIHdoaWNoXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB5b3Ugd2FudCB0aGUgcmVzcG9uc2l2ZSBmYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQuIEZvciBleGFtcGxlLCBzZXQgdGhpcyB0byA2MDAgYW5kIHdoZW5ldmVyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYnJvd3NlcidzIHdpZHRoIGlzIGxlc3MgdGhhbiA2MDAsIHRoZSBmYWxsYmFjayB3aWxsIGtpY2sgaW4uXG5cdFx0XHQgICBkaXJlY3Rpb246IFwidmVydGljYWxcIiAgICAgICAgICAgIC8vIFlvdSBjYW4gbm93IGRlZmluZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBPbmUgUGFnZSBTY3JvbGwgYW5pbWF0aW9uLiBPcHRpb25zIGF2YWlsYWJsZSBhcmUgXCJ2ZXJ0aWNhbFwiIGFuZCBcImhvcml6b250YWxcIi4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgXCJ2ZXJ0aWNhbFwiLlxuXHRcdFx0fSk7XG5cblxuXHRcdFx0LyogU2xpZGUgdG8gc2VjdGlvbiBvbiBuYXYgbGluayBjbGljayAqL1xuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR2YXIgc2VjdGlvbiA9ICQodGhpcykuZGF0YSgnc2VjdGlvbicpO1xuXHRcdFx0XHQkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBDb250aW51ZSBidXR0b24gKi9cblx0XHRcdCQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdCRjb250YWluZXIubW92ZVRvKDIpO1xuXHRcdFx0fSk7XG5cdFx0fVxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG5cdFx0Y29uc29sZS5sb2coXCIlYyAgICoqKioqIExvYWRlZCAqKioqKiogICBcIiwgJ2JhY2tncm91bmQtY29sb3I6ICMwZjA7IGNvbG9yOiAjZmZmOycpO1xufSk7XG4iXX0=