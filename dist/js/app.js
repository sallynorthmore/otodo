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
		$('[data-js="scroll"]').onepage_scroll({
			sectionContainer: '[data-js="section"]', // sectionContainer accepts any kind of selector in case you don't want to use section
			easing: "ease", // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
			// "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
			animationTime: 1000, // AnimationTime let you define how long each section takes to animate
			pagination: true, // You can either show or hide the pagination. Toggle true for show, false for hide.
			updateURL: false, // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
			beforeMove: function (index) {}, // This option accepts a callback function. The function will be called before the page moves.
			afterMove: function (index) {}, // This option accepts a callback function. The function will be called after the page moves.
			loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
			keyboard: true, // You can activate the keyboard controls
			responsiveFallback: false, // You can fallback to normal page scroll by defining the width of the browser in which
			// you want the responsive fallback to be triggered. For example, set this to 600 and whenever
			// the browser's width is less than 600, the fallback will kick in.
			direction: "vertical" // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCIkIiwiaGFzQ2xhc3MiLCJyZWwiLCJ0eXBlIiwiaHJlZiIsImFwcGVuZFRvIiwib25lcGFnZSIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsIm9uIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImluZGV4IiwiYWZ0ZXJNb3ZlIiwibG9vcCIsImtleWJvYXJkIiwicmVzcG9uc2l2ZUZhbGxiYWNrIiwiZGlyZWN0aW9uIiwiZG9jdW1lbnQiLCJyZWFkeSIsImNvbnNvbGUiLCJsb2ciXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE1BQU07O0FBRVIsU0FBUSxTQUFTQyxJQUFULEdBQWdCO0FBQ3ZCLE9BQUtDLElBQUw7O0FBRUE7QUFDQSxNQUFJQyxFQUFFLE1BQUYsRUFBVUMsUUFBVixDQUFtQixTQUFuQixDQUFKLEVBQW1DO0FBQ2xDRCxLQUFFLFNBQUYsRUFBYTtBQUNWRSxTQUFLLFlBREs7QUFFVkMsVUFBTSxVQUZJO0FBR1ZDLFVBQU07QUFISSxJQUFiLEVBSUdDLFFBSkgsQ0FJWSxNQUpaO0FBS0EsUUFBS0MsT0FBTDtBQUNBO0FBQ0QsRUFkTzs7QUFnQlIsU0FBUSxTQUFTUCxJQUFULEdBQWdCO0FBQ3ZCLE1BQUlRLFNBQVNQLEVBQUUsdUJBQUYsQ0FBYjtBQUFBLE1BQ0VRLE9BQU9SLEVBQUUsa0JBQUYsQ0FEVDtBQUFBLE1BRUVTLE9BQU9ULEVBQUUscUJBQUYsQ0FGVDtBQUFBLE1BR0VVLE9BQU8sS0FIVDs7QUFLQUgsU0FBT0ksRUFBUCxDQUFVLE9BQVYsRUFBbUIsWUFBVTtBQUM1QixPQUFJRCxJQUFKLEVBQVU7QUFDVEYsU0FBS0ksV0FBTCxDQUFpQixTQUFqQjtBQUNBRixXQUFPLEtBQVA7QUFDQSxJQUhELE1BR087QUFDTkYsU0FBS0ssUUFBTCxDQUFjLFNBQWQ7QUFDQUgsV0FBTyxJQUFQO0FBQ0E7QUFDRCxHQVJEOztBQVVBRCxPQUFLRSxFQUFMLENBQVEsT0FBUixFQUFpQixZQUFVO0FBQ3pCSCxRQUFLSSxXQUFMLENBQWlCLFNBQWpCO0FBQ0FGLFVBQU8sS0FBUDtBQUNELEdBSEQ7QUFJQSxFQXBDTzs7QUFzQ1IsWUFBVyxTQUFTSixPQUFULEdBQW1CO0FBQzdCTixJQUFFLG9CQUFGLEVBQXdCYyxjQUF4QixDQUF1QztBQUN0Q0MscUJBQWtCLHFCQURvQixFQUNPO0FBQzNDQyxXQUFRLE1BRjRCLEVBRUg7QUFDQTtBQUNqQ0Msa0JBQWUsSUFKcUIsRUFJSDtBQUNqQ0MsZUFBWSxJQUx3QixFQUtIO0FBQ2pDQyxjQUFXLEtBTnlCLEVBTUg7QUFDakNDLGVBQVksVUFBU0MsS0FBVCxFQUFnQixDQUFFLENBUE0sRUFPSDtBQUNqQ0MsY0FBVyxVQUFTRCxLQUFULEVBQWdCLENBQUUsQ0FSTyxFQVFIO0FBQ2pDRSxTQUFNLEtBVDhCLEVBU0g7QUFDakNDLGFBQVUsSUFWMEIsRUFVSDtBQUNqQ0MsdUJBQW9CLEtBWGdCLEVBV0Y7QUFDRDtBQUNBO0FBQ2pDQyxjQUFXLFVBZHlCLENBY0g7QUFkRyxHQUF2QztBQWdCQTtBQXZETyxDQUFWOztBQTJEQTs7OztBQUlBMUIsRUFBRTJCLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUUzQi9CLEtBQUlDLElBQUo7QUFDQStCLFNBQVFDLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxzQ0FBM0M7QUFDRCxDQUpEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSB7XG5cblx0XHQnaW5pdCc6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHR0aGlzLm1lbnUoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQkKFwiPGxpbmsvPlwiLCB7XG5cdFx0XHRcdCAgIHJlbDogXCJzdHlsZXNoZWV0XCIsXG5cdFx0XHRcdCAgIHR5cGU6IFwidGV4dC9jc3NcIixcblx0XHRcdFx0ICAgaHJlZjogXCIvY3NzL29uZXBhZ2Utc2Nyb2xsLmNzc1wiXG5cdFx0XHRcdH0pLmFwcGVuZFRvKFwiaGVhZFwiKTtcblx0XHRcdFx0dGhpcy5vbmVwYWdlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdvbmVwYWdlJzogZnVuY3Rpb24gb25lcGFnZSgpIHtcblx0XHRcdCQoJ1tkYXRhLWpzPVwic2Nyb2xsXCJdJykub25lcGFnZV9zY3JvbGwoe1xuXHRcdFx0XHRzZWN0aW9uQ29udGFpbmVyOiAnW2RhdGEtanM9XCJzZWN0aW9uXCJdJywgICAgIC8vIHNlY3Rpb25Db250YWluZXIgYWNjZXB0cyBhbnkga2luZCBvZiBzZWxlY3RvciBpbiBjYXNlIHlvdSBkb24ndCB3YW50IHRvIHVzZSBzZWN0aW9uXG5cdFx0XHQgICBlYXNpbmc6IFwiZWFzZVwiLCAgICAgICAgICAgICAgICAgIC8vIEVhc2luZyBvcHRpb25zIGFjY2VwdHMgdGhlIENTUzMgZWFzaW5nIGFuaW1hdGlvbiBzdWNoIFwiZWFzZVwiLCBcImxpbmVhclwiLCBcImVhc2UtaW5cIixcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiZWFzZS1vdXRcIiwgXCJlYXNlLWluLW91dFwiLCBvciBldmVuIGN1YmljIGJlemllciB2YWx1ZSBzdWNoIGFzIFwiY3ViaWMtYmV6aWVyKDAuMTc1LCAwLjg4NSwgMC40MjAsIDEuMzEwKVwiXG5cdFx0XHQgICBhbmltYXRpb25UaW1lOiAxMDAwLCAgICAgICAgICAgICAvLyBBbmltYXRpb25UaW1lIGxldCB5b3UgZGVmaW5lIGhvdyBsb25nIGVhY2ggc2VjdGlvbiB0YWtlcyB0byBhbmltYXRlXG5cdFx0XHQgICBwYWdpbmF0aW9uOiB0cnVlLCAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIGVpdGhlciBzaG93IG9yIGhpZGUgdGhlIHBhZ2luYXRpb24uIFRvZ2dsZSB0cnVlIGZvciBzaG93LCBmYWxzZSBmb3IgaGlkZS5cblx0XHRcdCAgIHVwZGF0ZVVSTDogZmFsc2UsICAgICAgICAgICAgICAgIC8vIFRvZ2dsZSB0aGlzIHRydWUgaWYgeW91IHdhbnQgdGhlIFVSTCB0byBiZSB1cGRhdGVkIGF1dG9tYXRpY2FsbHkgd2hlbiB0aGUgdXNlciBzY3JvbGwgdG8gZWFjaCBwYWdlLlxuXHRcdFx0ICAgYmVmb3JlTW92ZTogZnVuY3Rpb24oaW5kZXgpIHt9LCAgLy8gVGhpcyBvcHRpb24gYWNjZXB0cyBhIGNhbGxiYWNrIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYmVmb3JlIHRoZSBwYWdlIG1vdmVzLlxuXHRcdFx0ICAgYWZ0ZXJNb3ZlOiBmdW5jdGlvbihpbmRleCkge30sICAgLy8gVGhpcyBvcHRpb24gYWNjZXB0cyBhIGNhbGxiYWNrIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIHBhZ2UgbW92ZXMuXG5cdFx0XHQgICBsb29wOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgICAvLyBZb3UgY2FuIGhhdmUgdGhlIHBhZ2UgbG9vcCBiYWNrIHRvIHRoZSB0b3AvYm90dG9tIHdoZW4gdGhlIHVzZXIgbmF2aWdhdGVzIGF0IHVwL2Rvd24gb24gdGhlIGZpcnN0L2xhc3QgcGFnZS5cblx0XHRcdCAgIGtleWJvYXJkOiB0cnVlLCAgICAgICAgICAgICAgICAgIC8vIFlvdSBjYW4gYWN0aXZhdGUgdGhlIGtleWJvYXJkIGNvbnRyb2xzXG5cdFx0XHQgICByZXNwb25zaXZlRmFsbGJhY2s6IGZhbHNlLCAgICAgICAgLy8gWW91IGNhbiBmYWxsYmFjayB0byBub3JtYWwgcGFnZSBzY3JvbGwgYnkgZGVmaW5pbmcgdGhlIHdpZHRoIG9mIHRoZSBicm93c2VyIGluIHdoaWNoXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB5b3Ugd2FudCB0aGUgcmVzcG9uc2l2ZSBmYWxsYmFjayB0byBiZSB0cmlnZ2VyZWQuIEZvciBleGFtcGxlLCBzZXQgdGhpcyB0byA2MDAgYW5kIHdoZW5ldmVyXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYnJvd3NlcidzIHdpZHRoIGlzIGxlc3MgdGhhbiA2MDAsIHRoZSBmYWxsYmFjayB3aWxsIGtpY2sgaW4uXG5cdFx0XHQgICBkaXJlY3Rpb246IFwidmVydGljYWxcIiAgICAgICAgICAgIC8vIFlvdSBjYW4gbm93IGRlZmluZSB0aGUgZGlyZWN0aW9uIG9mIHRoZSBPbmUgUGFnZSBTY3JvbGwgYW5pbWF0aW9uLiBPcHRpb25zIGF2YWlsYWJsZSBhcmUgXCJ2ZXJ0aWNhbFwiIGFuZCBcImhvcml6b250YWxcIi4gVGhlIGRlZmF1bHQgdmFsdWUgaXMgXCJ2ZXJ0aWNhbFwiLlxuXHRcdFx0fSk7XG5cdFx0fVxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG5cdFx0Y29uc29sZS5sb2coXCIlYyAgICoqKioqIExvYWRlZCAqKioqKiogICBcIiwgJ2JhY2tncm91bmQtY29sb3I6ICMwZjA7IGNvbG9yOiAjZmZmOycpO1xufSk7XG4iXX0=