jQuery(function ($) {
	
	var header = $('#sp-tm-header');
	if($('#sp-tm-header').length) {
		var headerHeight = header.outerHeight();
		var tmpin = function () {
			var scrollTop = $(window).scrollTop();
			if (scrollTop > 0) {
				header.addClass('pin');
			} else {
				if (header.hasClass('pin')) {
					header.removeClass('pin');
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