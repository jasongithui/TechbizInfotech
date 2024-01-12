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
      TweenMax.to($bigBall, 0.3, {
        scale: 4
      });
    }
    function onMouseHoverOut() {
      TweenMax.to($bigBall, 0.3, {
        scale: 1
      });
    }
    });