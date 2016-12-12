var app = {

	'init': function init() {
		// this.menu();
	},

	'menu': function orientation() {
		var button = $('[data-js="navbutton"]');

		// console.log("nav button is " + button.html());

		button.on('click', function () {
			console.log("Clicked!");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm9yaWVudGF0aW9uIiwiYnV0dG9uIiwiJCIsIm9uIiwiY29uc29sZSIsImxvZyIsImRvY3VtZW50IiwicmVhZHkiXSwibWFwcGluZ3MiOiJBQUFBLElBQUlBLE1BQU07O0FBRVIsU0FBUSxTQUFTQyxJQUFULEdBQWdCO0FBQ3ZCO0FBQ0EsRUFKTzs7QUFPUixTQUFRLFNBQVNDLFdBQVQsR0FBdUI7QUFDOUIsTUFBSUMsU0FBU0MsRUFBRSx1QkFBRixDQUFiOztBQUVBOztBQUVBRCxTQUFPRSxFQUFQLENBQVUsT0FBVixFQUFtQixZQUFVO0FBQzVCQyxXQUFRQyxHQUFSLENBQVksVUFBWjtBQUNBLEdBRkQ7QUFHQTtBQWZPLENBQVY7O0FBbUJBOzs7O0FBSUFILEVBQUVJLFFBQUYsRUFBWUMsS0FBWixDQUFrQixZQUFXOztBQUUzQlQsS0FBSUMsSUFBSjtBQUNBSyxTQUFRQyxHQUFSLENBQVksNkJBQVosRUFBMkMsc0NBQTNDO0FBQ0QsQ0FKRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0Ly8gdGhpcy5tZW51KCk7XG5cdFx0fSxcblxuXG5cdFx0J21lbnUnOiBmdW5jdGlvbiBvcmllbnRhdGlvbigpIHtcblx0XHRcdHZhciBidXR0b24gPSAkKCdbZGF0YS1qcz1cIm5hdmJ1dHRvblwiXScpO1xuXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcIm5hdiBidXR0b24gaXMgXCIgKyBidXR0b24uaHRtbCgpKTtcblxuXHRcdFx0YnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKFwiQ2xpY2tlZCFcIik7XG5cdFx0XHR9KTtcblx0XHR9LFxufTtcblxuXG4vKipcbiAqIFNUQVJUIFBPSU5UXG4qL1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdGFwcC5pbml0KCk7XG5cdFx0Y29uc29sZS5sb2coXCIlYyAgICoqKioqIExvYWRlZCAqKioqKiogICBcIiwgJ2JhY2tncm91bmQtY29sb3I6ICMwZjA7IGNvbG9yOiAjZmZmOycpO1xufSk7XG4iXX0=