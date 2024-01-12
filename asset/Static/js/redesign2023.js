(function ($) {
	console.log("redesign jquery loaded");
	if ($(".SolutionsGrid").length > 0) {
		SolutionsGrid_init();
	}
	if ($(".ProductPhase").length > 0) {
		ProductPhaseInit($);
	}
})(jQuery);

function SolutionsGrid_init() {
	document.querySelectorAll(".tabName").forEach((tab) => {
		tab.addEventListener("click", (event) => {
			toggleClassList(tab, ".tabName", "active");
			var contentID = tab.getAttribute("aria-controls");
			var $content = document.getElementById(contentID);
			toggleClassList($content, ".solutionCard", "active");
		});
	});
}

function ProductPhaseInit($) {
	if (typeof $ === "function") {
		var slideTimer = 5000;
		$(".ProductPhase").each(function () {
			ProductPhaseNextSlide($(this), $, slideTimer);
		});
		$(".phaseCard, .phaseSelector").hover(function () {
			var $ProductPhase = $(this).closest(".ProductPhase");
			var phases = $(".phaseCard", $ProductPhase).length;

			$ProductPhase.addClass("clicked");
			var index = $(this).index();
			$ProductPhase.attr("data-active", index);
			$(".phases", $ProductPhase).scrollLeft(
				(index / (phases - 1)) * $ProductPhase.parent().width()
			);
		});

		$(".phaseCard, .phaseSelector").keypress(function (e) {
			var key = e.which;
			if (key == 13) {
				// the enter key code
				$(this).click();
				return false;
			}
		});

	}
}

function ProductPhaseNextSlide($ProductPhase, $, slideTimer) {
	$ProductPhase.animate({ opacity: 1 }, slideTimer, function () {
		var docScroll = $(document).scrollTop();
		var phaseScroll = $ProductPhase.offset().top;
		var phaseHeight = $ProductPhase.height();
		var visible =
			docScroll + phaseHeight >= phaseScroll &&
			docScroll <= phaseScroll + phaseHeight;
		if ($ProductPhase.hasClass("clicked") == false && visible) {
			var phases = $(".phaseCard", $ProductPhase).length;
			var activeCard = parseInt($ProductPhase.attr("data-active"));
			console.log(phases + " " + activeCard);
			activeCard += 1;
			if (activeCard == phases) {
				activeCard = 0;
			}
			$ProductPhase.attr("data-active", activeCard);
			if ($ProductPhase.is(":visible")) {
				$(".phases", $ProductPhase).scrollLeft(
					(activeCard / (phases - 1)) * $ProductPhase.parent().width()
				);
			}
		}
		ProductPhaseNextSlide($ProductPhase, $, slideTimer);
	});
}

function toggleClassList(element, selector, className) {
	element.parentNode.querySelectorAll(selector).forEach((t) => {
		t.classList.remove(className);
	});
	element.classList.add("active");
}
