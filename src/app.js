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
					responsive: [
				    {
				      breakpoint: 860,
				      settings: "unslick"
				    },
					]
				});

				// Make slides respond to nav
				$carouselNav.children().on('click', function(){
					var index = $(this).index();

					$carouselNav.children().removeClass('is-active');
					$(this).addClass('is-active');
					$carousel.slick('slickGoTo', index);
				});

				// Make slick reinit when browser size increased & it isn't already initialized
				window.onresize = function() {

					if (window.innerWidth >= 860 && !$carousel.hasClass('slick-initialized')) {

						// Destroy and reinit slick
						$carousel.slick('unslick');

						$carousel.slick({
							arrows: false,
							responsive: [
						    {
						      breakpoint: 860,
						      settings: "unslick"
						    },
							]
						});
					}
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

		'history': function history() {
			var $history = $('[data-js="history-items"]'),
					$historyItem = $('[data-js="history-item"]');

			$history.children().addClass('is-small');

			$historyItem.on('click', function(){
				if ( $(this).hasClass('is-small') ) {
					$history.children().addClass('is-small');
					$(this).removeClass('is-small');
				} else {
					$(this).addClass('is-small');
				}
			});

		},

		'overlay': function overlay() {
			var $page = $('[data-js="page"]'),
					$overlay = $('[data-js="overlay"]'),
					$overlayTrigger = $('[data-js="overlayTrigger"]'),
					$overlayClose = $('[data-js="closeOverlay"]');

			$overlayTrigger.on('click', function(){
				var overlayNumber = $(this).attr('data-overlay');
				$('[data-overlaynumber='+ overlayNumber +']').addClass('is-active');
				$page.addClass('is-overlay');
			});

			$overlayClose.on('click', function(){
				$overlay.removeClass('is-active');
				$page.removeClass('is-overlay');
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
