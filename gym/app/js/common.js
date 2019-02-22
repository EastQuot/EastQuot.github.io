$(function () {

	let qs = (selector) => document.querySelector(selector)
	let qsAll = (selector) => document.querySelectorAll(selector)


	let headerLine = qs('.header-line'),
		topMenu = qs('.top-menu').cloneNode(true),
		mobileMenuButton = qs('.mobile-menu-button');

	let a = headerLine.insertAdjacentHTML('afterEnd', '<div class="mobile-menu d-lg-none"></div>')
	let mobMenu = qs(".mobile-menu");

	mobMenu.appendChild(topMenu)


	$('.mobile-menu-button').click(function () {
		$('.mobile-menu').stop().slideToggle();
	})





	function Menu(options) {
		var elem = options.elem;

		elem.forEach(function (elem) {
			elem.onmousedown = function () {
				return false;
			}

			elem.onclick = function (event) {
				event.stopPropagation();
				event.preventDefault();
				elem.classList.toggle('open');

				// function open(e){
				// 	console.log(1)
				// 	elem.classList.remove('open')
				// 	document.removeEventListener('click',open)
				// }

				// document.addEventListener('click', open)

			};
			elem.onmouseleave = function (event) {
				elem.classList.remove('open')
			}
		})

	}

	Menu({ elem: qsAll('.classes') });


	let likeTrainers = qs('.our-trainers');

	likeTrainers.onclick = function (e) {
		if (e.target.className == 'fa fa-heart') {
			e.preventDefault();
			e.target.style.color = e.target.style.color == 'red' ? '' : 'red';
		}
		if (e.target.className == 'fa fa-thumbs-up') {
			e.preventDefault();
			e.target.style.color = e.target.style.color == 'rgb(2, 158, 198)' ? '' : 'rgb(2, 158, 198)';
		}
	}


	$(document).ready(function () {

		$('.our-trainers').owlCarousel({
			// loop:true,
			pagination: false,
			nav: true,
			items: 2,
			navText: "",
			responsiveClass: true,
			responsive: {
				0: {
					items: 1
				},
				400: {
					items: 2
				},
				768: {
					items: 3
				},
				992: {
					items: 2
				}
			}
		})

		$('.gallery').owlCarousel({
			// loop:true,
			pagination: false,
			nav: true,
			items: 1,
			navText: "",
			responsiveClass: true,
			responsive: {
				0: {
					items: 0
				},
				400: {
					items: 1
				},
				768: {
					items: 1
				},
				992: {
					items: 1
				}
			}
		})



	});

	$('.footer-menu h4').click(function () {
		$('.footer-menu ul').stop().slideToggle();
	})
	$('.community h4').click(function () {
		$('.community ul').stop().slideToggle();
	})


	$(window).on('load', function () {
		$('.preloader').fadeOut('slow');
	})


});














