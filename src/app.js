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

			button.on('click', function(){
				if (open) {
					page.removeClass("has-nav");
					open = false;
				} else {
					page.addClass("has-nav");
					open = true;
				}
			});

			link.on('click', function(){
					page.removeClass("has-nav");
					open = false;
			});
		},

		'onepage': function onepage() {
			$('[data-js="scroll"]').onepage_scroll({
				sectionContainer: '[data-js="section"]',     // sectionContainer accepts any kind of selector in case you don't want to use section
			   easing: "ease",                  // Easing options accepts the CSS3 easing animation such "ease", "linear", "ease-in",
			                                    // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)"
			   animationTime: 1000,             // AnimationTime let you define how long each section takes to animate
			   pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
			   updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
			   beforeMove: function(index) {},  // This option accepts a callback function. The function will be called before the page moves.
			   afterMove: function(index) {},   // This option accepts a callback function. The function will be called after the page moves.
			   loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
			   keyboard: true,                  // You can activate the keyboard controls
			   responsiveFallback: false,        // You can fallback to normal page scroll by defining the width of the browser in which
			                                    // you want the responsive fallback to be triggered. For example, set this to 600 and whenever
			                                    // the browser's width is less than 600, the fallback will kick in.
			   direction: "vertical"            // You can now define the direction of the One Page Scroll animation. Options available are "vertical" and "horizontal". The default value is "vertical".
			});
		}
};


/**
 * START POINT
*/

$(document).ready(function() {

		app.init();
		console.log("%c   ***** Loaded ******   ", 'background-color: #0f0; color: #fff;');
});
