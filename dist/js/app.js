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
			beforeMove: function (index) {}, // This option accepts a callback function. The function will be called before the page moves.
			afterMove: function (index) {}, // This option accepts a callback function. The function will be called after the page moves.
			loop: false, // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
			keyboard: true, // You can activate the keyboard controls
			responsiveFallback: false, // You can fallback to normal page scroll by defining the width of the browser in which
			// you want the responsive fallback to be triggered. For example, set this to 600 and whenever
			// the browser's width is less than 600, the fallback will kick in.
			direction: "vertical" // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
		});

		$navLink.on('click', function (event) {

			event.preventDefault();
			var section = $(this).data('section');

			console.log("link clicked ", section);
			$container.moveTo(section);
		});

		// Continue button
		// $('[data-js="continue"]').on('click', function(){
		// 	console.log("click continue");
		// 	$container.moveTo(1);
		// });
		//
		// // Menu to triggered
		// $container.onepage_scroll({
		//   afterMove: function(index) {
		//
		//   }
		// });
	}
};

/**
 * START POINT
*/

$(document).ready(function () {

	app.init();
	console.log("%c   ***** Loaded ******   ", 'background-color: #0f0; color: #fff;');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCIkIiwiaGFzQ2xhc3MiLCJyZWwiLCJ0eXBlIiwiaHJlZiIsImFwcGVuZFRvIiwib25lcGFnZSIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsIm9uIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsIiRjb250YWluZXIiLCIkbmF2TGluayIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImluZGV4IiwiYWZ0ZXJNb3ZlIiwibG9vcCIsImtleWJvYXJkIiwicmVzcG9uc2l2ZUZhbGxiYWNrIiwiZGlyZWN0aW9uIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCIsInNlY3Rpb24iLCJkYXRhIiwiY29uc29sZSIsImxvZyIsIm1vdmVUbyIsImRvY3VtZW50IiwicmVhZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE1BQU07O0FBRVIsU0FBUSxTQUFTQyxJQUFULEdBQWdCO0FBQ3ZCLE9BQUtDLElBQUw7O0FBRUE7QUFDQSxNQUFJQyxFQUFFLE1BQUYsRUFBVUMsUUFBVixDQUFtQixTQUFuQixDQUFKLEVBQW1DO0FBQ2xDRCxLQUFFLFNBQUYsRUFBYTtBQUNWRSxTQUFLLFlBREs7QUFFVkMsVUFBTSxVQUZJO0FBR1ZDLFVBQU07QUFISSxJQUFiLEVBSUdDLFFBSkgsQ0FJWSxNQUpaO0FBS0EsUUFBS0MsT0FBTDtBQUNBO0FBQ0QsRUFkTzs7QUFnQlIsU0FBUSxTQUFTUCxJQUFULEdBQWdCO0FBQ3ZCLE1BQUlRLFNBQVNQLEVBQUUsdUJBQUYsQ0FBYjtBQUFBLE1BQ0VRLE9BQU9SLEVBQUUsa0JBQUYsQ0FEVDtBQUFBLE1BRUVTLE9BQU9ULEVBQUUscUJBQUYsQ0FGVDtBQUFBLE1BR0VVLE9BQU8sS0FIVDs7QUFLQUgsU0FBT0ksRUFBUCxDQUFVLE9BQVYsRUFBbUIsWUFBVTtBQUM1QixPQUFJRCxJQUFKLEVBQVU7QUFDVEYsU0FBS0ksV0FBTCxDQUFpQixTQUFqQjtBQUNBRixXQUFPLEtBQVA7QUFDQSxJQUhELE1BR087QUFDTkYsU0FBS0ssUUFBTCxDQUFjLFNBQWQ7QUFDQUgsV0FBTyxJQUFQO0FBQ0E7QUFDRCxHQVJEOztBQVVBRCxPQUFLRSxFQUFMLENBQVEsT0FBUixFQUFpQixZQUFVO0FBQ3pCSCxRQUFLSSxXQUFMLENBQWlCLFNBQWpCO0FBQ0FGLFVBQU8sS0FBUDtBQUNELEdBSEQ7QUFJQSxFQXBDTzs7QUFzQ1IsWUFBVyxTQUFTSixPQUFULEdBQW1COztBQUU3QixNQUFJUSxhQUFhZCxFQUFFLG9CQUFGLENBQWpCO0FBQUEsTUFDRWUsV0FBVWYsRUFBRSxxQkFBRixDQURaOztBQUdBYyxhQUFXRSxjQUFYLENBQTBCO0FBQ3pCQyxxQkFBa0IscUJBRE8sRUFDb0I7QUFDM0NDLFdBQVEsTUFGZSxFQUVVO0FBQ0E7QUFDakNDLGtCQUFlLElBSlEsRUFJVTtBQUNqQ0MsZUFBWSxJQUxXLEVBS1U7QUFDakNDLGNBQVcsS0FOWSxFQU1VO0FBQ2pDQyxlQUFZLFVBQVNDLEtBQVQsRUFBZ0IsQ0FBRSxDQVBQLEVBT1U7QUFDakNDLGNBQVcsVUFBU0QsS0FBVCxFQUFnQixDQUFFLENBUk4sRUFRVTtBQUNqQ0UsU0FBTSxLQVRpQixFQVNVO0FBQ2pDQyxhQUFVLElBVmEsRUFVVTtBQUNqQ0MsdUJBQW9CLEtBWEcsRUFXVztBQUNEO0FBQ0E7QUFDakNDLGNBQVcsVUFkWSxDQWNVO0FBZFYsR0FBMUI7O0FBaUJBYixXQUFTSixFQUFULENBQVksT0FBWixFQUFxQixVQUFTa0IsS0FBVCxFQUFlOztBQUVuQ0EsU0FBTUMsY0FBTjtBQUNBLE9BQUlDLFVBQVUvQixFQUFFLElBQUYsRUFBUWdDLElBQVIsQ0FBYSxTQUFiLENBQWQ7O0FBRUFDLFdBQVFDLEdBQVIsQ0FBWSxlQUFaLEVBQTZCSCxPQUE3QjtBQUNBakIsY0FBV3FCLE1BQVgsQ0FBa0JKLE9BQWxCO0FBQ0EsR0FQRDs7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0M7QUFDQTtBQUNBO0FBQ0E7QUFDRDtBQWpGTyxDQUFWOztBQXFGQTs7OztBQUlBL0IsRUFBRW9DLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUUzQnhDLEtBQUlDLElBQUo7QUFDQW1DLFNBQVFDLEdBQVIsQ0FBWSw2QkFBWixFQUEyQyxzQ0FBM0M7QUFDRCxDQUpEIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBhcHAgPSB7XG5cblx0XHQnaW5pdCc6IGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0XHR0aGlzLm1lbnUoKTtcblxuXHRcdFx0Ly8gSW5pdGlhbGlzZSBzY3JvbGwgb24gZGVza3RvcCAmIGFkZCBDU1Ncblx0XHRcdGlmICgkKCdodG1sJykuaGFzQ2xhc3MoJ2Rlc2t0b3AnKSkge1xuXHRcdFx0XHQkKFwiPGxpbmsvPlwiLCB7XG5cdFx0XHRcdCAgIHJlbDogXCJzdHlsZXNoZWV0XCIsXG5cdFx0XHRcdCAgIHR5cGU6IFwidGV4dC9jc3NcIixcblx0XHRcdFx0ICAgaHJlZjogXCIvY3NzL29uZXBhZ2Utc2Nyb2xsLmNzc1wiXG5cdFx0XHRcdH0pLmFwcGVuZFRvKFwiaGVhZFwiKTtcblx0XHRcdFx0dGhpcy5vbmVwYWdlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdCdtZW51JzogZnVuY3Rpb24gbWVudSgpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpLFxuXHRcdFx0XHRcdHBhZ2UgPSAkKCdbZGF0YS1qcz1cInBhZ2VcIl0nKSxcblx0XHRcdFx0XHRsaW5rID0gJCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRsaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdCdvbmVwYWdlJzogZnVuY3Rpb24gb25lcGFnZSgpIHtcblxuXHRcdFx0dmFyICRjb250YWluZXIgPSAkKCdbZGF0YS1qcz1cInNjcm9sbFwiXScpLFxuXHRcdFx0XHRcdCRuYXZMaW5rID0kKCdbZGF0YS1qcz1cIm5hdmxpbmtcIl0nKTtcblxuXHRcdFx0JGNvbnRhaW5lci5vbmVwYWdlX3Njcm9sbCh7XG5cdFx0XHRcdHNlY3Rpb25Db250YWluZXI6ICdbZGF0YS1qcz1cInNlY3Rpb25cIl0nLCAgICAgLy8gc2VjdGlvbkNvbnRhaW5lciBhY2NlcHRzIGFueSBraW5kIG9mIHNlbGVjdG9yIGluIGNhc2UgeW91IGRvbid0IHdhbnQgdG8gdXNlIHNlY3Rpb25cblx0XHRcdCAgIGVhc2luZzogXCJlYXNlXCIsICAgICAgICAgICAgICAgICAgLy8gRWFzaW5nIG9wdGlvbnMgYWNjZXB0cyB0aGUgQ1NTMyBlYXNpbmcgYW5pbWF0aW9uIHN1Y2ggXCJlYXNlXCIsIFwibGluZWFyXCIsIFwiZWFzZS1pblwiLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJlYXNlLW91dFwiLCBcImVhc2UtaW4tb3V0XCIsIG9yIGV2ZW4gY3ViaWMgYmV6aWVyIHZhbHVlIHN1Y2ggYXMgXCJjdWJpYy1iZXppZXIoMC4xNzUsIDAuODg1LCAwLjQyMCwgMS4zMTApXCJcblx0XHRcdCAgIGFuaW1hdGlvblRpbWU6IDEwMDAsICAgICAgICAgICAgIC8vIEFuaW1hdGlvblRpbWUgbGV0IHlvdSBkZWZpbmUgaG93IGxvbmcgZWFjaCBzZWN0aW9uIHRha2VzIHRvIGFuaW1hdGVcblx0XHRcdCAgIHBhZ2luYXRpb246IHRydWUsICAgICAgICAgICAgICAgIC8vIFlvdSBjYW4gZWl0aGVyIHNob3cgb3IgaGlkZSB0aGUgcGFnaW5hdGlvbi4gVG9nZ2xlIHRydWUgZm9yIHNob3csIGZhbHNlIGZvciBoaWRlLlxuXHRcdFx0ICAgdXBkYXRlVVJMOiBmYWxzZSwgICAgICAgICAgICAgICAgLy8gVG9nZ2xlIHRoaXMgdHJ1ZSBpZiB5b3Ugd2FudCB0aGUgVVJMIHRvIGJlIHVwZGF0ZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSB1c2VyIHNjcm9sbCB0byBlYWNoIHBhZ2UuXG5cdFx0XHQgICBiZWZvcmVNb3ZlOiBmdW5jdGlvbihpbmRleCkge30sICAvLyBUaGlzIG9wdGlvbiBhY2NlcHRzIGEgY2FsbGJhY2sgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBiZWZvcmUgdGhlIHBhZ2UgbW92ZXMuXG5cdFx0XHQgICBhZnRlck1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7fSwgICAvLyBUaGlzIG9wdGlvbiBhY2NlcHRzIGEgY2FsbGJhY2sgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBhZnRlciB0aGUgcGFnZSBtb3Zlcy5cblx0XHRcdCAgIGxvb3A6IGZhbHNlLCAgICAgICAgICAgICAgICAgICAgIC8vIFlvdSBjYW4gaGF2ZSB0aGUgcGFnZSBsb29wIGJhY2sgdG8gdGhlIHRvcC9ib3R0b20gd2hlbiB0aGUgdXNlciBuYXZpZ2F0ZXMgYXQgdXAvZG93biBvbiB0aGUgZmlyc3QvbGFzdCBwYWdlLlxuXHRcdFx0ICAga2V5Ym9hcmQ6IHRydWUsICAgICAgICAgICAgICAgICAgLy8gWW91IGNhbiBhY3RpdmF0ZSB0aGUga2V5Ym9hcmQgY29udHJvbHNcblx0XHRcdCAgIHJlc3BvbnNpdmVGYWxsYmFjazogZmFsc2UsICAgICAgICAvLyBZb3UgY2FuIGZhbGxiYWNrIHRvIG5vcm1hbCBwYWdlIHNjcm9sbCBieSBkZWZpbmluZyB0aGUgd2lkdGggb2YgdGhlIGJyb3dzZXIgaW4gd2hpY2hcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHlvdSB3YW50IHRoZSByZXNwb25zaXZlIGZhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZC4gRm9yIGV4YW1wbGUsIHNldCB0aGlzIHRvIDYwMCBhbmQgd2hlbmV2ZXJcblx0XHRcdCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBicm93c2VyJ3Mgd2lkdGggaXMgbGVzcyB0aGFuIDYwMCwgdGhlIGZhbGxiYWNrIHdpbGwga2ljayBpbi5cblx0XHRcdCAgIGRpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiICAgICAgICAgICAgLy8gWW91IGNhbiBub3cgZGVmaW5lIHRoZSBkaXJlY3Rpb24gb2YgdGhlIE9uZSBQYWdlIFNjcm9sbCBhbmltYXRpb24uIE9wdGlvbnMgYXZhaWxhYmxlIGFyZSBcInZlcnRpY2FsXCIgYW5kIFwiaG9yaXpvbnRhbFwiLiBUaGUgZGVmYXVsdCB2YWx1ZSBpcyBcInZlcnRpY2FsXCIuXG5cdFx0XHR9KTtcblxuXHRcdFx0JG5hdkxpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBzZWN0aW9uID0gJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyk7XG5cblx0XHRcdFx0Y29uc29sZS5sb2coXCJsaW5rIGNsaWNrZWQgXCIsIHNlY3Rpb24pO1xuXHRcdFx0XHQkY29udGFpbmVyLm1vdmVUbyhzZWN0aW9uKTtcblx0XHRcdH0pO1xuXG5cdFx0XHQvLyBDb250aW51ZSBidXR0b25cblx0XHRcdC8vICQoJ1tkYXRhLWpzPVwiY29udGludWVcIl0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0Ly8gXHRjb25zb2xlLmxvZyhcImNsaWNrIGNvbnRpbnVlXCIpO1xuXHRcdFx0Ly8gXHQkY29udGFpbmVyLm1vdmVUbygxKTtcblx0XHRcdC8vIH0pO1xuXHRcdFx0Ly9cblx0XHRcdC8vIC8vIE1lbnUgdG8gdHJpZ2dlcmVkXG5cdFx0XHQvLyAkY29udGFpbmVyLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHQgIC8vICAgYWZ0ZXJNb3ZlOiBmdW5jdGlvbihpbmRleCkge1xuXHRcdCAgLy9cblx0XHQgIC8vICAgfVxuXHRcdCAgLy8gfSk7XG5cdFx0fVxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG5cdFx0Y29uc29sZS5sb2coXCIlYyAgICoqKioqIExvYWRlZCAqKioqKiogICBcIiwgJ2JhY2tncm91bmQtY29sb3I6ICMwZjA7IGNvbG9yOiAjZmZmOycpO1xufSk7XG4iXX0=