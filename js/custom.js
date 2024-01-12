jQuery(function ($) {
	
	var header = $('#sp-tm-header');
	var navLink = $('li a#sp-module-link');
	if($('#sp-tm-header').length) {
		var headerHeight = header.outerHeight();
		var tmpin = function () {
			var scrollTop = $(window).scrollTop();
			if (scrollTop > 0) {
				header.addClass('pin');
				navLink.addClass('sp-module-links');
			} else {
				if (header.hasClass('pin')) {
					header.removeClass('pin');
				}
				if (navLink.hasClass('sp-module-links')) {
					navLink.removeClass('sp-module-links');
				}
			}
		};
		tmpin();
		$(window).scroll(function () {
			tmpin();
		});
	}


	
	$('#Agree0').click(function () {
		$('#check').toggleClass('ticked');
	});
	
	var tmtopbar = $('#sp-tm-top-bar');
	var tmlogo = $('#sp-logo');
	
	if($('#sp-tm-header').length) {
		var stickyHeader = function () {
			var scrollTop = $(window).scrollTop();
			if (scrollTop > 500) {
				header.addClass('header-stick');
				tmtopbar.addClass('top-bar-stick');
				tmlogo.addClass('logo-stick');
				
			} else {
				if (header.hasClass('header-stick')) {
					header.removeClass('header-stick');
					tmtopbar.removeClass('top-bar-stick');
					tmlogo.removeClass('logo-stick');
				}
			}
		};
		stickyHeader();
		$(window).scroll(function () {
			stickyHeader();
		});
	}
	/*
	var previousScroll = 0;
	$(window).scroll(function(){
		var scroll = $(this).scrollTop();
		if (scroll > previousScroll){
			$('#sp-tm-top-bar, #sp-tm-header').addClass('down');
		} else {
			$('#sp-tm-top-bar, #sp-tm-header').removeClass('down');
		}
		previousScroll = scroll;
	});
*/



	$(window).scroll(function () {
		if ($(this).scrollTop() > 600) {
			//		$('#sp-tm-top-bar, #sp-tm-header').addClass('scrolled');
			$('.sp-scroll-up').fadeIn(800);
		} else {
			//		$('#sp-tm-top-bar').removeClass('scrolled');
			$('.sp-scroll-up').fadeOut(800);
		}
	});
	
	$('.sp-scroll-up').click(function () {
		$("html, body").animate({
			scrollTop: 0
		}, 600);
		return false;
	});
	
	$('.sp-megamenu-wrapper').parent().parent().css('position', 'static').parent().css('position', 'relative');
	$('.sp-menu-full').each(function () {
		$(this).parent().addClass('menu-justify');
	});
	
	$('.oc-menu-block h3').on('click', function (event) {
		event.preventDefault();
		$target = $(event.target);
		$target.toggleClass('expand');
		$(this).next().slideToggle();
		return false;
	});
	$('.tm-site-menu').on('click', function (event) {
		event.preventDefault();
		$('.offcanvas-init').toggleClass('offcanvas-active');
		$('.tm-site-menu').toggleClass('active');
	});
	
	$('.close-offcanvas, .offcanvas-overlay').on('click', function (event) {
		event.preventDefault();
		$('.offcanvas-init').removeClass('offcanvas-active');
		$('.tm-site-menu').removeClass('active');
	});
	
	$(document).on('click', '.offcanvas-inner .menu-toggler', function(event){
		event.preventDefault();
		$(this).closest('.menu-parent').toggleClass('menu-parent-open').find('>.menu-child').slideToggle(400);
	});
	
	// $('[data-toggle="tooltip"]').tooltip();
});

jQuery(function ($) {
var $bigBall = document.querySelector('.cursor__ball--big');
var $smallBall = document.querySelector('.cursor__ball--small');
var $hoverables = document.querySelectorAll('.hoverable');

// Listeners
document.body.addEventListener('mousemove', onMouseMove);
for (var i = 0; i < $hoverables.length; i++) {
  $hoverables[i].addEventListener('mouseenter', onMouseHover);
  $hoverables[i].addEventListener('mouseleave', onMouseHoverOut);
}

// Move the cursor
  function onMouseMove(e) {
    var posX = e.clientX; // Mouse X position relative to the viewport
    var posY = e.clientY; // Mouse Y position relative to the viewport

    TweenMax.to($bigBall, 0.4, {
      x: posX - 15,
      y: posY - 15
    });
    TweenMax.to($smallBall, 0.1, {
      x: posX - 5,
      y: posY - 7
    });
  }

// Hover an element
function onMouseHover() {
  TweenMax.to($bigBall, 0.5, {
    scale: 4
  });
}
function onMouseHoverOut() {
  TweenMax.to($bigBall, 0.5, {
    scale: 1
  });
}
});