document.addEventListener('DOMContentLoaded', function() {
  const ctaLinks = document.querySelectorAll('.ctaLink');
  const downloadBox1 = document.querySelectorAll('.box1');
  const downloadBox2 = document.querySelectorAll('.box2');
  const downloadBox3 = document.querySelectorAll('.box3');
  const downloadBox4 = document.querySelectorAll('.box4');
  const popup = document.querySelectorAll('#brochurePopup');
  const popups = document.querySelectorAll('#brochurePopup, #box1, #box2, #box3, #box4');
  const pop1 = document.querySelectorAll('#box1');
  const pop2 = document.querySelectorAll('#box2');
  const pop3 = document.querySelectorAll('#box3');
  const pop4 = document.querySelectorAll('#box4');
  const overlay = document.getElementById('overlay');
  const zone = document.getElementById('zone-your-industry');
  const homeHeroWrapper = document.querySelector('.HomeHero .wrapper');
  const topBar = document.getElementById('sp-tm-top-bar');
  const topBar2 = document.getElementById('sp-tm-header');
  const columnBox1 = document.querySelector('#columnBox1');
  const columnBox2 = document.querySelector('#columnBox2');
  const columnBox3 = document.querySelector('#columnBox3');
  const columnBox4 = document.querySelector('#columnBox4');



  ctaLinks.forEach(function(btn, index) {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      popup[index].style.display = 'block';
      overlay.style.display = 'block';

      // Set z-index for .HomeHero .wrapper to 10 
      homeHeroWrapper.style.zIndex = 10;
    });
  });
   
  downloadBox1.forEach(function(btn, index) {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      pop1[index].style.display = 'block';
      overlay.style.display = 'block';
   
     // set z-index for #sp-tm-top-bar
     topBar.style.zIndex = 1;
     topBar2.style.zIndex = 1;
     zone.style.zIndex = 3;
     homeHeroWrapper.style.zIndex = 3;
     columnBox2.style.zIndex = -1;
     columnBox3.style.zIndex = -1;
     columnBox4.style.zIndex = -1;
    });
  });

  downloadBox2.forEach(function(btn, index) {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      pop2[index].style.display = 'block';
      overlay.style.display = 'block';
     zone.style.zIndex = 3;     
     topBar.style.zIndex = 2;
     topBar2.style.zIndex = 2;
     homeHeroWrapper.style.zIndex = 2;
     columnBox2.style.zIndex = 0;
     columnBox3.style.zIndex = -1;
     columnBox4.style.zIndex = -1;

    });
  });

  downloadBox3.forEach(function(btn, index) {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      pop3[index].style.display = 'block';
      overlay.style.display = 'block';
     zone.style.zIndex = 3;
     topBar.style.zIndex = 2;
     topBar2.style.zIndex = 2;
     homeHeroWrapper.style.zIndex = 2;
     columnBox1.style.zIndex = -1;
     columnBox2.style.zIndex = -1;
     columnBox3.style.zIndex = -1;
     columnBox4.style.zIndex = -2;

    });
  });

  downloadBox4.forEach(function(btn, index) {
    btn.addEventListener('click', function(event) {
      event.preventDefault();
      pop4[index].style.display = 'block';
      overlay.style.display = 'block';
     zone.style.zIndex = 3;
     topBar.style.zIndex = 2;
     topBar2.style.zIndex = 2;
     homeHeroWrapper.style.zIndex = 2;       

    });
  });

  overlay.addEventListener('click', function(event) {
    popups.forEach(function(popup) {
      if (event.target === overlay || event.target.classList.contains('close-btn')) {
        popup.style.display = 'none';
        overlay.style.display = 'none';
        
        // Reset z-index for .HomeHero .wrapper to default (or any other value)
        homeHeroWrapper.style.zIndex = 3; // Reset to default or set your desired value
        topBar.style.zIndex = 4;
        topBar2.style.zIndex = 4;
        columnBox1.style.zIndex = 0;
        columnBox2.style.zIndex = 0;
        columnBox3.style.zIndex = 0;
        columnBox4.style.zIndex = 0;

      }
    });
  });
});
