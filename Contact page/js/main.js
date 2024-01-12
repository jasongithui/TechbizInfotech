
var styles = ['color: #9F78F9', 'display: block', 'line-height: 100px', 'text-align: center', 'font-family: helvetica, sans-serif', 'font-weight: bold', 'font-size: 35px', 'padding:30px', 'text-shadow: 0 1px 0 #7437FF, 0 2px 0 #2B165C, 0 3px 3px rgba(93,44,206,0.56), 0 3px 12px rgba(116,55,255,0.71)'].join(';');
console.log('%c The Digital Panda™', styles);



// CLASSES

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}


class Circle {
  constructor(radius, x, y) {
    this._radius = radius;
    this.radius = radius;
    this.growthValue = 0;
    this.position = new Point(x, y);
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {number} ease
   */
  draw(context, ease) {
    this.radius += (this._radius + this.growthValue - this.radius) * ease;
    context.moveTo(this.position.x, this.position.y);
    context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
  }

  addRadius(value) {
    this.growthValue = value;
  }

  get x() {
    return this.position.x;
  }

  set x(value) {
    this.position.x = value;
  }

  get y() {
    return this.position.y;
  }

  set y(value) {
    this.position.y = value;
  }
}

//animations
function fetchAnimation(url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
      resolve(xhr.response);
    }
    xhr.onerror = function () {
      reject();
    }
    xhr.send();
  })
}

function playAnimation(animData, container, loop) {
  animObject = lottie.loadAnimation({
    container: document.getElementById(container),
    renderer: "svg",
    loop: loop,
    autoplay: false,
    prerender: true,
    animationData: animData
  })
  return animObject;
}

function sectionIntroAnim(container) {
  // $('h1,.p--intro').attr('data-splitting', '');
  // Splitting({
  //   whitespace: true
  // });
  // $('.hero--subnav')
}

sectionIntroAnim();

let errorUrl = "404.json.gz";
let anim1Url = "fit-for-purpose.json.gz";
let anim2Url = "low-data-prediction.json.gz";
let anim3Url = "large-scale.json.gz";
let anim4Url = "synthetically-accesible.json.gz";
let anim5Url = "multi-parameter.json.gz";
let anim6Url = "centralized-infrastructure.json.gz";
let firstRun = true;

let animations;

//all the other animations

function normalize(value, min, max) {
  return (value - min) / (max - min);
}

function interpolate(value, min, max) {
  return min + (max - min) * value;
}

function map(value, min1, max1, min2, max2) {
  return interpolate(normalize(value, min1, max1), min2, max2);
}

function findPreferredRatio(width, height, maxWidth, maxHeight) {
  let dw = maxWidth / width;
  let dh = maxHeight / height;
  return dw > dh ? dw : dh;
}

function resizeCanvas(canvas) {
  let canvasHolder = document.querySelector('.canvas--holder canvas')
  canvas.width = canvasHolder.clientWidth;
  canvas.height = canvasHolder.clientHeight;
}

let contactAnimationRequest;

function loadContactAnim() {
  let parameters = {
    size: 18,
    radius: 1.5,
    proximity: 150,
    growth: 8,
    ease: 0.05
  };

  function init() {
    let imageLoaded = false;
    let canvas = document.getElementById("c");

    if (!canvas) return; // Do not init if canvas not on the page

    let image = new Image();
    let circles = [];
    let context = canvas.getContext("2d");

    window.removeEventListener("resize", resizeHandler);
    document.querySelector('.section--contact').removeEventListener('mousemove', mouseMoveHandler);
    window.removeEventListener("touchmove", touchMoveHandler);

    window.addEventListener("resize", resizeHandler);
    document.querySelector('.section--contact').addEventListener('mousemove', mouseMoveHandler);
    window.addEventListener("touchmove", touchMoveHandler);

    resizeHandler();
    loadImage();
    build()

    function build() {
      circles = [];
      const {
        size,
        radius
      } = parameters;
      const columns = Math.ceil(canvas.width / size) + 1;
      const rows = Math.ceil(canvas.height / size) + 1;
      const amount = Math.ceil(columns * rows);
      for (let i = 0; i < amount; i++) {
        const column = i % columns;
        const row = ~~(i / columns);
        circles.push(new Circle(radius, size * column, size * row));
      }
    }

    function mouseMoveHandler(event) {
      proximityHandler(event);
    }

    function touchMoveHandler(event) {
      proximityHandler(event.touches[0]);
    }

    function proximityHandler(event) {
      let offsetTop = canvas.getBoundingClientRect().top
      const {
        proximity,
        growth
      } = parameters;
      for (let c of circles) {
        let distance = Math.sqrt(
          Math.pow(c.x - event.clientX, 2) + Math.pow(c.y - event.clientY + offsetTop, 2));
        let d = map(distance, c._radius, c._radius + proximity, growth, 0);
        if (d < 0) d = 0;
        c.addRadius(d);
      }
    }

    function animate() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.save();
      context.beginPath();
      context.fillStyle = "#000000";
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (let circle of circles) {
        circle.draw(context, parameters.ease);
      }
      if (imageLoaded) {
        drawImage();
      } else {
        context.fill();
      }
      context.restore();
      window.requestAnimationFrame(animate);
    }

    function drawImage() {
      context.clip();
      const {
        naturalHeight,
        naturalWidth
      } = image;
      const ratio = findPreferredRatio(
        naturalWidth,
        naturalHeight,
        canvas.width,
        canvas.height);

      const w = naturalWidth * ratio;
      const h = naturalHeight * ratio;
      const x = canvas.width / 2 - w / 2;
      const y = canvas.height / 2 - h / 2;
      context.drawImage(image, 0, 0, naturalWidth, naturalHeight, x, y, w, h);
    }

    function resizeHandler() {
      resizeCanvas(canvas);
    }

    function loadImage() {
      image.onload = function () {
        imageLoaded = true;
      };
      //image.src = "https://dl.dropbox.com/s/lsyf2vtszhd7rao/color-blue-fade.svg?dl=0";
      image.src = "https://dl.dropbox.com/s/x0o6vmsryezo39z/semi-transparent-white.svg?dl=0";
    }

    contactAnimationRequest = requestAnimationFrame(animate)
  }

  init()
}

function initForm() {
  var formFields = $('.input-field--wrapper');

  formFields.each(function () {
    var field = $(this);
    var input = field.find('.form--input');
    var label = field.find('.label');

    function checkInput() {
      var valueLength = input.val().length;

      if (valueLength > 0) {
        label.addClass('active')
      } else {
        label.removeClass('active')
      }
    }

    input.change(function () {
      checkInput()
    })
  });
}


$('#button-form').click(function () {
  setTimeout(function () {
    $('.section.footer').toggleClass('form-active');
  }, 200)
});

$('.anchor-up').click(function () {
  $("html, body").animate({
    scrollTop: 0
  }, "slow");
  return false;
});


// initialize loading animation
var loaderPlayed = false;

function loader() {
  anime({
    targets: '#loader svg circle',
    translateX: [function () {
      return anime.random(-100, 100);
    }, 0],
    translateY: [function () {
      return anime.random(-100, 100);
    }, 0],
    delay: anime.stagger(200, {
      grid: [20, 20],
      from: 'center'
    }),
    easing: 'easeInOutQuad',
    opacity: [0, 1],
    complete: function () {
      closeLoader();
    }
  });

  function pulse() {
    anime({
      targets: '#loader svg circle',
      delay: anime.stagger(100, {
        grid: [20, 20],
        from: 'center'
      }),
      easing: 'linear',
      duration: 1500,
      loop: true,
      direction: "alternate",
      opacity: function () {
        return anime.random(1, 5) / 10;
      },
      complete: function () {
        // window.addEventListener("load", closeLoader());
        // pulse()
      }
    });
  }

}

function closeLoader() {
  anime({
    targets: '#loader svg circle',
    scale:[1,0],
    delay: anime.stagger(20, {grid: [20, 20], from: 'center'}),
    easing: 'easeInQuint',
    duration:1000,
    update: function(anim) {
      if(anim.progress > 70)
           $('.page-load--animation').addClass('closed')

    }
  });
}

var pageID;

loader();
(async function () {
  animations = {
    anim1: {
      path: 'anim1',
      animData: await fetchAnimation(filePath + anim1Url)
    },
    anim2: {
      path: 'anim2',
      animData: await fetchAnimation(filePath + anim2Url)
    },
    anim3: {
      path: 'anim3',
      animData: await fetchAnimation(filePath + anim3Url)
    },
    anim4: {
      path: 'anim4',
      animData: await fetchAnimation(filePath + anim4Url)
    },
    anim5: {
      path: 'anim5',
      animData: await fetchAnimation(filePath + anim5Url)
    },
    anim6: {
      path: 'anim6',
      animData: await fetchAnimation(filePath + anim6Url)
    },
  }
  loadContactAnim()
  initializeBarba()
  initForm();
})()

//barba transitions
function initializeBarba() {
  barba.init({
    transitions: [{
      sync: true,
      beforeLeave(data) {
        var end = data.next.html.indexOf(' data-wf-site="');
        var start = data.next.html.indexOf('data-wf-page="');
        var string = data.next.html.slice(start, end);
        var arr = string.split('"');
        pageID = arr[1];
        window.cancelAnimationFrame(contactAnimationRequest)
        lottie.destroy()
        waypoints.forEach(function(w) {
          w.destroy()
        })
        waypoints = []
      },
      beforeLeave(data) {
        const done = this.async();
        $(data.next.container).css('opacity', 0).hide(); //hide the next container in some way
        anime({ //animate the current container in some way. We like Anime.js
          targets: data.current.container,
          duration: 350,
          opacity: [1, 0],
          easing:"linear",
          complete: function () {
            done();
            sectionIntroAnim();
            $(data.next.container).show(); // when the animation finishes, make the next container visible
            anime({ //then animate the next container or elements in.
              targets: data.next.container,
              duration: 350,
              easing: 'easeInOutQuart',
              opacity: [0, 1],
              // translateY:[200,0]
            });
          }
        });
      },
      beforeEnter() {
        $('html').attr('data-wf-page', pageID); //applies the correct webflow page ID
        // IX 2 Fix for loading animations when the site loads
        window.Webflow && window.Webflow.destroy();
        window.Webflow && window.Webflow.ready();
        window.Webflow && window.Webflow.require('ix2').init();
        $('#button-form').click(function () {
          setTimeout(function () {
            $('.section.footer').toggleClass('form-active');
          }, 200)
        });

        $('.anchor-up').click(function () {
          $("html, body").animate({
            scrollTop: 0
          }, "slow");
          return false;
        });
      },
      enter(data) {
        //do some cool animations or load scripts you want to execute
        window.scrollTo(0, 0)
        setTimeout(loadContactAnim, 200)
        initForm();

      }
    }],
    views: [{
      namespace: 'home',
      beforeEnter() {
      },
      afterEnter(data) {
        // initTabs();
        //homepage
        // let introAnim = await playAnimation(introURL,"intro-anim",true)
        // introAnim.playSegments([
        //     [0, 180]
        // ], true);
        // introAnim.addEventListener('loopComplete', loopAnim);
        // introAnim.addEventListener('enterFrame', function() {
        //     if (firstRun && introAnim.currentFrame >= 30) {

        //         firstRun = false;
        //     }
        // });
        // function loopAnim() {
        //     introAnim.playSegments([31, 180], true);
        // }
        // introPlaying = true;
        // Object.keys(animations).forEach(function(name) {
        //   animations[name]['animObj'] = playAnimation(animations[name]['animData'], name, true)
        // })
        //show animated item on scroll into view

        //init animated tabs
        $(document).ready(function () {
          updateAnimations()
          if (!document.getElementById("counter") || !document.getElementById("totalSlides")) return;
          var numItems = $(".w-slider-dot").length;
          document.getElementById("totalSlides").innerHTML = (numItems < 9 ? '0' : '') + (numItems);
          var myIndex = $(".w-slider-dot.w-active").index();
          document.getElementById("counter").innerHTML = (myIndex < 9 ? '0' : '') + (myIndex + 1)
          $(".w-slide").attrchange({
            trackValues: true,
            callback: function (event) {
              myIndex = $(".w-slider-dot.w-active").index();
              document.getElementById("counter").innerHTML = (myIndex < 9 ? '0' : '') + (myIndex + 1)
            }

          });

        });

        // Tab next button

        $('.tab--container').on('click', '.tab--prev-trigger, .tab--next-trigger', function () {
          var direction = $(this).hasClass('tab--prev-trigger') ? -1 : 1;
          var tablinks = $(this).parent().find('.tabs--menu');
          var index = tablinks.find('.w--current').index() + direction;
          index = index >= tablinks.children().length ? 0 : index;
          tablinks.find('.tab--link').eq(index).trigger('click');
        });
        //on tab link click play the right animation
        $('.tab--link').on('click', function () {
          index = parseInt(this.dataset.wTab.replace('Tab ', ''));
          for (i = 0; i < Object.keys(animations).length; i++) {
            if (i == index)
              animations["anim" + (index)].animObj.play();
            else if (index == 6)
              animations["anim" + (Object.keys(animations).length)].animObj.goToAndPlay(1);
            else
              animations["anim" + (i + 1)].animObj.goToAndStop(1);
          }
        });
      }
    }, {
      namespace: 'approach',
      afterEnter() {
        $(function () { updateAnimations() })
      }
    },
     {
      namespace: 'news',
      beforeEnter() {
        // Init news
        function hideAnimation(el) {
            $(el).fadeOut()
        }

        function showAnimation(el) {
            $(el).fadeIn()
        }

        window.pcms = new PandaCMS()
        window.pcms_filter = pcms.enableFilter(showAnimation, hideAnimation, activeClass='pcms-filter-active')
        window.pcms_pagination = pcms.enablePagination(5)

        $(document).on("keydown", "form#wf-form-news-search", function(event) {
          return event.key != "Enter";
        });
      }
    },
    {
      namespace: 'post',
      afterEnter(){
        $('.post--content.w-richtext h2').each(function(){
          var newID = $(this).text().replace(/\s+/g, '-').toLowerCase();
          $(this).attr('id',newID);
          $('div.subnav--links-wrapper').append('<a href="#'+newID+'" class="subnav--link">'+$(this).text()+'</a>');
        });
      } ,
      beforeLeave(data) {
        $('.post--progress-bar').css('width',"0%");
      }
    }]
  });
}

let waypoints = []

function updateAnimations() {
  Object.keys(animations).forEach(function (name) {
    animations[name]['animObj'] = playAnimation(animations[name]['animData'], name, true)
    animations[name]['animObj'].addEventListener('DOMLoaded', () => {
      var element = $('.approach__anim#' + name)[0]
      waypoints.push(new Waypoint.Inview({
        element: element,
        entered: function () {
          animations[element.id].animObj.play();
        },
        exited: function () {
          animations[element.id].animObj.pause();
        }
      }))
    })
  })
}
