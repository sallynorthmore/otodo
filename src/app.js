var app = {

		'init': function init() {
			// this.menu();
		},


		'menu': function orientation() {
			var button = $('[data-js="navbutton"]');

			// console.log("nav button is " + button.html());

			button.on('click', function(){
				console.log("Clicked!");
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
