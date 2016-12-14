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
		    $navLink = $('[data-js="navlink"]'),
		    header = $('[data-js="header"]'),
		    headerClass = $('[data-js="header"]').attr("class");

		$container.onepage_scroll({
			sectionContainer: '[data-js="section"]',
			easing: "ease-out",
			animationTime: 500,
			pagination: false,
			updateURL: false,
			beforeMove: function (index) {
				/* Update nav link class when section active */
				$('[data-js="navlink"]').removeClass('is-active');
				$('[data-section="' + index + '"]').addClass('is-active');
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
		$navLink.on('click', function (event) {
			event.preventDefault();
			var section = $(this).data('section');
			$container.moveTo(section);
		});

		/* Continue button */
		$('[data-js="continue"]').on('click', function (event) {
			event.preventDefault();
			$container.moveTo(2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9hcHAuanMiXSwibmFtZXMiOlsiYXBwIiwiaW5pdCIsIm1lbnUiLCIkIiwiaGFzQ2xhc3MiLCJyZWwiLCJ0eXBlIiwiaHJlZiIsImFwcGVuZFRvIiwib25lcGFnZSIsImJ1dHRvbiIsInBhZ2UiLCJsaW5rIiwib3BlbiIsIm9uIiwicmVtb3ZlQ2xhc3MiLCJhZGRDbGFzcyIsIiRjb250YWluZXIiLCIkbmF2TGluayIsImhlYWRlciIsImhlYWRlckNsYXNzIiwiYXR0ciIsIm9uZXBhZ2Vfc2Nyb2xsIiwic2VjdGlvbkNvbnRhaW5lciIsImVhc2luZyIsImFuaW1hdGlvblRpbWUiLCJwYWdpbmF0aW9uIiwidXBkYXRlVVJMIiwiYmVmb3JlTW92ZSIsImluZGV4IiwiY3VyQ2xhc3MiLCJsb29wIiwia2V5Ym9hcmQiLCJyZXNwb25zaXZlRmFsbGJhY2siLCJkaXJlY3Rpb24iLCJldmVudCIsInByZXZlbnREZWZhdWx0Iiwic2VjdGlvbiIsImRhdGEiLCJtb3ZlVG8iLCJkb2N1bWVudCIsInJlYWR5IiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBSUEsTUFBTTs7QUFFUixTQUFRLFNBQVNDLElBQVQsR0FBZ0I7QUFDdkIsT0FBS0MsSUFBTDs7QUFFQTtBQUNBLE1BQUlDLEVBQUUsTUFBRixFQUFVQyxRQUFWLENBQW1CLFNBQW5CLENBQUosRUFBbUM7QUFDbENELEtBQUUsU0FBRixFQUFhO0FBQ1ZFLFNBQUssWUFESztBQUVWQyxVQUFNLFVBRkk7QUFHVkMsVUFBTTtBQUhJLElBQWIsRUFJR0MsUUFKSCxDQUlZLE1BSlo7QUFLQSxRQUFLQyxPQUFMO0FBQ0E7QUFDRCxFQWRPOztBQWdCUixTQUFRLFNBQVNQLElBQVQsR0FBZ0I7QUFDdkIsTUFBSVEsU0FBU1AsRUFBRSx1QkFBRixDQUFiO0FBQUEsTUFDRVEsT0FBT1IsRUFBRSxrQkFBRixDQURUO0FBQUEsTUFFRVMsT0FBT1QsRUFBRSxxQkFBRixDQUZUO0FBQUEsTUFHRVUsT0FBTyxLQUhUOztBQUtBSCxTQUFPSSxFQUFQLENBQVUsT0FBVixFQUFtQixZQUFVO0FBQzVCLE9BQUlELElBQUosRUFBVTtBQUNURixTQUFLSSxXQUFMLENBQWlCLFNBQWpCO0FBQ0FGLFdBQU8sS0FBUDtBQUNBLElBSEQsTUFHTztBQUNORixTQUFLSyxRQUFMLENBQWMsU0FBZDtBQUNBSCxXQUFPLElBQVA7QUFDQTtBQUNELEdBUkQ7O0FBVUFELE9BQUtFLEVBQUwsQ0FBUSxPQUFSLEVBQWlCLFlBQVU7QUFDekJILFFBQUtJLFdBQUwsQ0FBaUIsU0FBakI7QUFDQUYsVUFBTyxLQUFQO0FBQ0QsR0FIRDtBQUlBLEVBcENPOztBQXNDUixZQUFXLFNBQVNKLE9BQVQsR0FBbUI7O0FBRTdCLE1BQUlRLGFBQWFkLEVBQUUsb0JBQUYsQ0FBakI7QUFBQSxNQUNFZSxXQUFVZixFQUFFLHFCQUFGLENBRFo7QUFBQSxNQUVFZ0IsU0FBU2hCLEVBQUUsb0JBQUYsQ0FGWDtBQUFBLE1BR0lpQixjQUFjakIsRUFBRSxvQkFBRixFQUF3QmtCLElBQXhCLENBQTZCLE9BQTdCLENBSGxCOztBQU1BSixhQUFXSyxjQUFYLENBQTBCO0FBQ3pCQyxxQkFBa0IscUJBRE87QUFFdkJDLFdBQVEsVUFGZTtBQUd2QkMsa0JBQWUsR0FIUTtBQUl2QkMsZUFBWSxLQUpXO0FBS3ZCQyxjQUFXLEtBTFk7QUFNdkJDLGVBQVksVUFBU0MsS0FBVCxFQUFnQjtBQUM1QjtBQUNBMUIsTUFBRSxxQkFBRixFQUF5QlksV0FBekIsQ0FBcUMsV0FBckM7QUFDQVosTUFBRSxvQkFBb0IwQixLQUFwQixHQUEyQixJQUE3QixFQUFtQ2IsUUFBbkMsQ0FBNEMsV0FBNUM7QUFDQUcsV0FBT0UsSUFBUCxDQUFZLE9BQVosRUFBcUJELFdBQXJCOztBQUVBO0FBQ0EsUUFBSVUsV0FBV1YsY0FBYyxNQUFkLEdBQXVCUyxLQUF0QztBQUNBVixXQUFPRSxJQUFQLENBQVksT0FBWixFQUFxQlMsUUFBckI7QUFDQSxJQWZ1QjtBQWdCdkJDLFNBQU0sS0FoQmlCO0FBaUJ2QkMsYUFBVSxJQWpCYTtBQWtCdkJDLHVCQUFvQixHQWxCRztBQW1CdkJDLGNBQVc7QUFuQlksR0FBMUI7O0FBc0JBO0FBQ0FoQixXQUFTSixFQUFULENBQVksT0FBWixFQUFxQixVQUFTcUIsS0FBVCxFQUFlO0FBQ25DQSxTQUFNQyxjQUFOO0FBQ0EsT0FBSUMsVUFBVWxDLEVBQUUsSUFBRixFQUFRbUMsSUFBUixDQUFhLFNBQWIsQ0FBZDtBQUNBckIsY0FBV3NCLE1BQVgsQ0FBa0JGLE9BQWxCO0FBQ0EsR0FKRDs7QUFNQTtBQUNBbEMsSUFBRSxzQkFBRixFQUEwQlcsRUFBMUIsQ0FBNkIsT0FBN0IsRUFBc0MsVUFBU3FCLEtBQVQsRUFBZTtBQUNwREEsU0FBTUMsY0FBTjtBQUNBbkIsY0FBV3NCLE1BQVgsQ0FBa0IsQ0FBbEI7QUFDQSxHQUhEO0FBSUE7QUFoRk8sQ0FBVjs7QUFvRkE7Ozs7QUFJQXBDLEVBQUVxQyxRQUFGLEVBQVlDLEtBQVosQ0FBa0IsWUFBVzs7QUFFM0J6QyxLQUFJQyxJQUFKO0FBQ0F5QyxTQUFRQyxHQUFSLENBQVksNkJBQVosRUFBMkMsc0NBQTNDO0FBQ0QsQ0FKRCIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0ge1xuXG5cdFx0J2luaXQnOiBmdW5jdGlvbiBpbml0KCkge1xuXHRcdFx0dGhpcy5tZW51KCk7XG5cblx0XHRcdC8vIEluaXRpYWxpc2Ugc2Nyb2xsIG9uIGRlc2t0b3AgJiBhZGQgQ1NTXG5cdFx0XHRpZiAoJCgnaHRtbCcpLmhhc0NsYXNzKCdkZXNrdG9wJykpIHtcblx0XHRcdFx0JChcIjxsaW5rLz5cIiwge1xuXHRcdFx0XHQgICByZWw6IFwic3R5bGVzaGVldFwiLFxuXHRcdFx0XHQgICB0eXBlOiBcInRleHQvY3NzXCIsXG5cdFx0XHRcdCAgIGhyZWY6IFwiL2Nzcy9vbmVwYWdlLXNjcm9sbC5jc3NcIlxuXHRcdFx0XHR9KS5hcHBlbmRUbyhcImhlYWRcIik7XG5cdFx0XHRcdHRoaXMub25lcGFnZSgpO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHQnbWVudSc6IGZ1bmN0aW9uIG1lbnUoKSB7XG5cdFx0XHR2YXIgYnV0dG9uID0gJCgnW2RhdGEtanM9XCJuYXZidXR0b25cIl0nKSxcblx0XHRcdFx0XHRwYWdlID0gJCgnW2RhdGEtanM9XCJwYWdlXCJdJyksXG5cdFx0XHRcdFx0bGluayA9ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLFxuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblxuXHRcdFx0YnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmIChvcGVuKSB7XG5cdFx0XHRcdFx0cGFnZS5yZW1vdmVDbGFzcyhcImhhcy1uYXZcIik7XG5cdFx0XHRcdFx0b3BlbiA9IGZhbHNlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHBhZ2UuYWRkQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bGluay5vbignY2xpY2snLCBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHBhZ2UucmVtb3ZlQ2xhc3MoXCJoYXMtbmF2XCIpO1xuXHRcdFx0XHRcdG9wZW4gPSBmYWxzZTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHQnb25lcGFnZSc6IGZ1bmN0aW9uIG9uZXBhZ2UoKSB7XG5cblx0XHRcdHZhciAkY29udGFpbmVyID0gJCgnW2RhdGEtanM9XCJzY3JvbGxcIl0nKSxcblx0XHRcdFx0XHQkbmF2TGluayA9JCgnW2RhdGEtanM9XCJuYXZsaW5rXCJdJyksXG5cdFx0XHRcdFx0aGVhZGVyID0gJCgnW2RhdGEtanM9XCJoZWFkZXJcIl0nKSxcbiAgXHRcdCBcdFx0aGVhZGVyQ2xhc3MgPSAkKCdbZGF0YS1qcz1cImhlYWRlclwiXScpLmF0dHIoXCJjbGFzc1wiKTtcblxuXG5cdFx0XHQkY29udGFpbmVyLm9uZXBhZ2Vfc2Nyb2xsKHtcblx0XHRcdFx0c2VjdGlvbkNvbnRhaW5lcjogJ1tkYXRhLWpzPVwic2VjdGlvblwiXScsXG5cdFx0XHQgICBlYXNpbmc6IFwiZWFzZS1vdXRcIixcblx0XHRcdCAgIGFuaW1hdGlvblRpbWU6IDUwMCxcblx0XHRcdCAgIHBhZ2luYXRpb246IGZhbHNlLFxuXHRcdFx0ICAgdXBkYXRlVVJMOiBmYWxzZSxcblx0XHRcdCAgIGJlZm9yZU1vdmU6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgbGluayBjbGFzcyB3aGVuIHNlY3Rpb24gYWN0aXZlICovXG5cdFx0XHRcdFx0ICQoJ1tkYXRhLWpzPVwibmF2bGlua1wiXScpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgJCgnW2RhdGEtc2VjdGlvbj1cIicgKyBpbmRleCArJ1wiXScpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblx0XHRcdFx0XHQgaGVhZGVyLmF0dHIoJ2NsYXNzJywgaGVhZGVyQ2xhc3MpO1xuXG5cdFx0XHRcdFx0IC8qIFVwZGF0ZSBuYXYgY29udGFpbmVyIGNsYXNzIHdoZW4gc2VjdGlvbiBhY3RpdmUgKi9cblx0XHRcdFx0XHQgdmFyIGN1ckNsYXNzID0gaGVhZGVyQ2xhc3MgKyBcIiBpcy1cIiArIGluZGV4O1xuXHRcdFx0XHRcdCBoZWFkZXIuYXR0cignY2xhc3MnLCBjdXJDbGFzcyk7XG5cdFx0XHRcdCB9LFxuXHRcdFx0ICAgbG9vcDogZmFsc2UsXG5cdFx0XHQgICBrZXlib2FyZDogdHJ1ZSxcblx0XHRcdCAgIHJlc3BvbnNpdmVGYWxsYmFjazogNjAwLFxuXHRcdFx0ICAgZGlyZWN0aW9uOiBcInZlcnRpY2FsXCJcblx0XHRcdH0pO1xuXG5cdFx0XHQvKiBTbGlkZSB0byBzZWN0aW9uIG9uIG5hdiBsaW5rIGNsaWNrICovXG5cdFx0XHQkbmF2TGluay5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdHZhciBzZWN0aW9uID0gJCh0aGlzKS5kYXRhKCdzZWN0aW9uJyk7XG5cdFx0XHRcdCRjb250YWluZXIubW92ZVRvKHNlY3Rpb24pO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8qIENvbnRpbnVlIGJ1dHRvbiAqL1xuXHRcdFx0JCgnW2RhdGEtanM9XCJjb250aW51ZVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0JGNvbnRhaW5lci5tb3ZlVG8oMik7XG5cdFx0XHR9KTtcblx0XHR9XG59O1xuXG5cbi8qKlxuICogU1RBUlQgUE9JTlRcbiovXG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0YXBwLmluaXQoKTtcblx0XHRjb25zb2xlLmxvZyhcIiVjICAgKioqKiogTG9hZGVkICoqKioqKiAgIFwiLCAnYmFja2dyb3VuZC1jb2xvcjogIzBmMDsgY29sb3I6ICNmZmY7Jyk7XG59KTtcbiJdfQ==