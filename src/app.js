var app = {

		'init': function init() {
			this.menu();
		},


		'menu': function orientation() {
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
};


/**
 * START POINT
*/

$(document).ready(function() {

		app.init();
		console.log("%c   ***** Loaded ******   ", 'background-color: #0f0; color: #fff;');
});
