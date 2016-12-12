var app = {

	'init': function init() {
		this.menu();
	},

	'menu': function orientation() {
		var button = $('[data-js="navbutton"]'),
		    page = $('[data-js="page"]'),
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
	}
};

/**
 * START POINT
*/

$(document).ready(function () {

	app.init();
	console.log("%c   ***** Loaded ******   ", 'background-color: #0f0; color: #fff;');
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCJvcmllbnRhdGlvbiIsImJ1dHRvbiIsIiQiLCJwYWdlIiwib3BlbiIsIm9uIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsImRvY3VtZW50IiwicmVhZHkiLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJQSxNQUFNOztBQUVSLFNBQVEsU0FBU0MsSUFBVCxHQUFnQjtBQUN2QixPQUFLQyxJQUFMO0FBQ0EsRUFKTzs7QUFPUixTQUFRLFNBQVNDLFdBQVQsR0FBdUI7QUFDOUIsTUFBSUMsU0FBU0MsRUFBRSx1QkFBRixDQUFiO0FBQUEsTUFDRUMsT0FBT0QsRUFBRSxrQkFBRixDQURUO0FBQUEsTUFFRUUsT0FBTyxLQUZUOztBQUlBSCxTQUFPSSxFQUFQLENBQVUsT0FBVixFQUFtQixZQUFVO0FBQzVCLE9BQUlELElBQUosRUFBVTtBQUNURCxTQUFLRyxXQUFMLENBQWlCLFNBQWpCO0FBQ0FGLFdBQU8sS0FBUDtBQUNBLElBSEQsTUFHTztBQUNORCxTQUFLSSxRQUFMLENBQWMsU0FBZDtBQUNBSCxXQUFPLElBQVA7QUFDQTtBQUNELEdBUkQ7QUFTQTtBQXJCTyxDQUFWOztBQXlCQTs7OztBQUlBRixFQUFFTSxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0JaLEtBQUlDLElBQUo7QUFDQVksU0FBUUMsR0FBUixDQUFZLDZCQUFaLEVBQTJDLHNDQUEzQztBQUNELENBSkQiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IHtcblxuXHRcdCdpbml0JzogZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRcdHRoaXMubWVudSgpO1xuXHRcdH0sXG5cblxuXHRcdCdtZW51JzogZnVuY3Rpb24gb3JpZW50YXRpb24oKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnW2RhdGEtanM9XCJuYXZidXR0b25cIl0nKSxcblx0XHRcdFx0XHRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXG5cdFx0XHRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKG9wZW4pIHtcblx0XHRcdFx0XHRwYWdlLnJlbW92ZUNsYXNzKFwiaGFzLW5hdlwiKTtcblx0XHRcdFx0XHRvcGVuID0gZmFsc2U7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cGFnZS5hZGRDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IHRydWU7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcblx0XHRjb25zb2xlLmxvZyhcIiVjICAgKioqKiogTG9hZGVkICoqKioqKiAgIFwiLCAnYmFja2dyb3VuZC1jb2xvcjogIzBmMDsgY29sb3I6ICNmZmY7Jyk7XG59KTtcbiJdfQ==