var app = {

		'init': function init() {
			this.menu();
			this.expander();

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

		'expander': function expander(){
			var $item = $('[data-js="expander"]'),
					$trigger = $item.find('[data-js="expanderTrigger"]'),
					$content = $item.find('[data-js="expanderContent"]');

			$trigger.on('click', function(){
				$(this).parent().toggleClass("is-expanded");
			});
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

			var $container = $('[data-js="scroll"]'),
					$navLink =$('[data-js="navlink"]'),
					header = $('[data-js="header"]'),
  		 		headerClass = $('[data-js="header"]').attr("class");


			$container.onepage_scroll({
				sectionContainer: '[data-js="section"]',
			   easing: "ease-out",
			   animationTime: 500,
			   pagination: false,
			   updateURL: false,
			   beforeMove: function(index) {
					 /* Update nav link class when section active */
					 $('[data-js="navlink"]').removeClass('is-active');
					 $('[data-section="' + index +'"]').addClass('is-active');
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
			$navLink.on('click', function(event){
				event.preventDefault();
				var section = $(this).data('section');
				$container.moveTo(section);
			});

			/* Continue button */
			$('[data-js="continue"]').on('click', function(event){
				event.preventDefault();
				$container.moveTo(2);
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
