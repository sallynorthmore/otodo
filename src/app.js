var app = {

		'init': function init() {
			this.menu();
			this.expander();
			this.overlay();

			// Initialise scroll on desktop & add CSS
			if ($('html').hasClass('desktop')) {
				// initialise carousel & history components
				this.carousel();
				this.history();
				this.snapTo();
				this.hubAnimation();
			}
		},

		'hubAnimation': function hubAnimation(){
			var $section = $('[data-panel="2"]'),
					$house = $('[data-js="house"]');

			$section.on("mousemove", function(event){
				// detect mouse x
				if( event.pageX < 510) {
					$house.addClass("is-right");
					$house.removeClass("is-left");
				} else {
					$house.removeClass("is-right");
					$house.addClass("is-left");
				}
			});
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

			$historyItem.on('click mouseenter', function(){
				if ( !$(this).hasClass('is-large') ) {
					$history.children().removeClass('is-large');
					$(this).addClass('is-large');
				} else {
					// $(this).removeClass('is-large');
				}
			});

			$(['data-js="participate"']).on('click', function(e){

			});
		},

		'overlay': function overlay() {
			var $page = $('[data-js="page"]'),
					$overlay = $('[data-js="overlay"]'),
					$overlayTrigger = $('[data-js="overlayTrigger"]'),
					$overlayClose = $('[data-js="closeOverlay"]'),
					$overlayCarousel = $('[data-js="overlay-carousel"]');


			$overlayTrigger.on('click', function(){
				var overlayNumber = $(this).attr('data-overlay');
				$('[data-overlaynumber='+ overlayNumber +']').addClass('is-active');
				$page.addClass('is-overlay');

				// Init carousel if it has one
				if ( $('[data-overlaynumber='+ overlayNumber +']').hasClass('is-carousel')) {
					$overlayCarousel.slick({
						arrows: true,
						dots: true,
						responsive: [
					    {
					      breakpoint: 860,
					      settings: {
					        arrows: false,
					        dots: true
					      }
					    },
						]
					});

					// On before slide change
					$overlayCarousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
						if (nextSlide == 1) {
							$(this).parents('.Overlay-inner').addClass('is-second');
						} else {
							$(this).parents('.Overlay-inner').removeClass('is-second');
						}
					});
				}
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
					link.removeClass("is-active");
					$(this).addClass("is-active");
					page.removeClass("has-nav");
					open = false;
			});
		},

		'scrollTo': function scrollTo() {
			var $container = $('[data-js="scroll"]'),
					$navLink =$('[data-js="navlink"]'),
					header = $('[data-js="header"]'),
  		 		headerClass = $('[data-js="header"]').attr("class");

			/* Slide to section on nav link click */
			$navLink.on('click', function(event){
				event.preventDefault();
				var index =   $(this).data('section'),
						section = "#section0" + index;

				// $container.moveTo(section);
				$(window).scrollTo(section, 500, {
					onAfter: function() {
						/* Update nav link class when section active */
 					 $('[data-js="navlink"]').removeClass('is-active');
 					 $('[data-section="' + index +'"]').addClass('is-active');
 					 header.attr('class', headerClass);

 					 /* Update nav container class when section active */
 					 var curClass = headerClass + " is-" + index;
 					 header.attr('class', curClass);
				  }
				});
			});

			/* Continue button */
			$('[data-js="continue"]').on('click', function(event){
				event.preventDefault();

				$(window).scrollTo("#section02", 500, {
					onAfter: function() {
						/* Update nav link class when section active */
 					 $('[data-js="navlink"]').removeClass('is-active');
 					 $('[data-section="' + index +'"]').addClass('is-active');
 					 header.attr('class', headerClass);

 					 /* Update nav container class when section active */
 					 var curClass = headerClass + " is-" + index;
 					 header.attr('class', curClass);
				  }
				});
			});
		},

		'snapTo': function snapTo() {
			var $container = $('[data-js="scroll"]'),
					$navLink =$('[data-js="navlink"]'),
					header = $('[data-js="header"]'),
  		 		headerClass = $('[data-js="header"]').attr("class"),
					$continueBtn = $('[data-js="continue"]'),
					$participateBtn = $('[data-js="participate"]');


			var options = {
					$menu: $('.Navigation-items'),
					panelSelector: '.Section',
					namespace: '.panelSnap',
					onSnapStart: function($target) {
						var index = $target.data('panel');

						/* Update nav link class when section active */
						$('[data-js="navlink"]').removeClass('is-active');
						$('[data-section="' + index +'"]').addClass('is-active');
						header.attr('class', headerClass);

						/* Update nav container class when section active */
						var curClass = headerClass + " is-" + index;
						header.attr('class', curClass);

					},
					onSnapFinish: function($target) {
						var index = $target.data('panel');

						if (index == 4) {
							$('[data-item="1"]').trigger('click');
						}
					},
					directionThreshold: 400,
					slideSpeed: 400,
					easing: 'swing',
					offset: 0,
					navigation: {
						keys: {
							nextKey: 40,
							prevKey: 38,
						},
						buttons: {
							$nextButton: $continueBtn,
							$prevButton: false,
						},
						wrapAround: false
					}
				};

	    $('body').panelSnap(options);
		}
};


/**
 * START POINT
*/

$(document).ready(function() {

		app.init();
});
