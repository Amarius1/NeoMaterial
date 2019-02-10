;(function(window) {
    'use strict';

    var Waves = Waves || {};
    var $$ = document.querySelectorAll.bind(document);

    // Find exact position of element
    function isWindow(obj) {
        return obj !== null && obj === obj.window;
    }

    function getWindow(elem) {
        return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
    }

    function offset(elem) {
        var docElem, win,
            box = {top: 0, left: 0},
            doc = elem && elem.ownerDocument;

        docElem = doc.documentElement;

        if (typeof elem.getBoundingClientRect !== typeof undefined) {
            box = elem.getBoundingClientRect();
        }
        win = getWindow(doc);
        return {
            top: box.top + win.pageYOffset - docElem.clientTop,
            left: box.left + win.pageXOffset - docElem.clientLeft
        };
    }

    function convertStyle(obj) {
        var style = '';

        for (var a in obj) {
            if (obj.hasOwnProperty(a)) {
                style += (a + ':' + obj[a] + ';');
            }
        }

        return style;
    }

    var Effect = {

        // Effect delay
        duration:390,

        show: function(e, element) {

            // Disable right click
            if (e.button === 2) {
                return false;
            }

            var el = element || this;

            // Create ripple
            var ripple = document.createElement('div');
            ripple.className = 'waves-ripple';
            el.appendChild(ripple);

            // Get click coordinate and element witdh
            var pos         = offset(el);
            var relativeY   = (e.pageY - pos.top);
            var relativeX   = (e.pageX - pos.left);
            var scale       = 'scale('+((el.clientWidth / 100) * 10)+')';

            // Support for touch devices
            if ('touches' in e) {
              relativeY   = (e.touches[0].pageY - pos.top);
              relativeX   = (e.touches[0].pageX - pos.left);
            }

            // Attach data to element
            ripple.setAttribute('data-hold', Date.now());
            ripple.setAttribute('data-scale', scale);
            ripple.setAttribute('data-x', relativeX);
            ripple.setAttribute('data-y', relativeY);

            // Set ripple position
            var rippleStyle = {
                'top': relativeY+'px',
                'left': relativeX+'px',
            };

            ripple.className = ripple.className + ' waves-notransition';
            ripple.setAttribute('style', convertStyle(rippleStyle));
            ripple.className = ripple.className.replace('waves-notransition', '');

            // Scale the ripple
            rippleStyle['-webkit-transform'] = scale;
            rippleStyle['-moz-transform'] = scale;
            rippleStyle['-ms-transform'] = scale;
            rippleStyle['-o-transform'] = scale;
            rippleStyle.transform = scale;
            rippleStyle.opacity   = '0.85';




            rippleStyle['-webkit-transition-duration'] = Effect.duration + 'ms';
            rippleStyle['-moz-transition-duration']    = Effect.duration + 'ms';
            rippleStyle['-o-transition-duration']      = Effect.duration + 'ms';
            rippleStyle['transition-duration']         = Effect.duration + 'ms';



            ripple.setAttribute('style', convertStyle(rippleStyle));
        },

        hide: function(e) {
            TouchHandler.touchup(e);

            var el = this;
            var width = el.clientWidth * 1.4;

            // Get first ripple
            var ripple = null;
            var ripples = el.getElementsByClassName('waves-ripple');
            if (ripples.length > 0) {
                ripple = ripples[ripples.length - 1];
            } else {
                return false;
            }

            var relativeX   = ripple.getAttribute('data-x');
            var relativeY   = ripple.getAttribute('data-y');
            var scale       = ripple.getAttribute('data-scale');

            // Get delay beetween mousedown and mouse leave
            var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
            var delay = 350 - diff;

            if (delay < 0) {
                delay = 0;
            }

            // Fade out ripple after delay
            setTimeout(function() {
                var style = {
                    'top': relativeY+'px',
                    'left': relativeX+'px',
                    'opacity': '0',

                    // Duration
                    '-webkit-transition-duration': Effect.duration + 'ms',
                    '-moz-transition-duration': Effect.duration + 'ms',
                    '-o-transition-duration': Effect.duration + 'ms',
                    'transition-duration': Effect.duration + 'ms',
                    '-webkit-transform': scale,
                    '-moz-transform': scale,
                    '-ms-transform': scale,
                    '-o-transform': scale,
                    'transform': scale,
                };

                ripple.setAttribute('style', convertStyle(style));

                setTimeout(function() {
                    try {
                        el.removeChild(ripple);
                    } catch(e) {
                        return false;
                    }
                }, Effect.duration);
            }, delay);
        },

        // Little hack to make <input> can perform waves effect
        wrapInput: function(elements) {
            for (var a = 0; a < elements.length; a++) {
                var el = elements[a];

                if (el.tagName.toLowerCase() === 'input') {
                    var parent = el.parentNode;

                    // If input already have parent just pass through
                    if (parent.tagName.toLowerCase() === 'i' && parent.className.indexOf('ripple') !== -1) {
                        continue;
                    }

                    // Put element class and style to the specified parent
                    var wrapper = document.createElement('i');
                    wrapper.className = el.className + ' waves-input-wrapper';

                    var elementStyle = el.getAttribute('style');

                    if (!elementStyle) {
                        elementStyle = '';
                    }

                    wrapper.setAttribute('style', elementStyle);

                    el.className = 'waves-button-input';
                    el.removeAttribute('style');

                    // Put element as child
                    parent.replaceChild(wrapper, el);
                    wrapper.appendChild(el);
                }
            }
        }
    };


    /**
     * Disable mousedown event for 500ms during and after touch
     */
    var TouchHandler = {
        /* uses an integer rather than bool so there's no issues with
         * needing to clear timeouts if another touch event occurred
         * within the 500ms. Cannot mouseup between touchstart and
         * touchend, nor in the 500ms after touchend. */
        touches: 0,
        allowEvent: function(e) {
            var allow = true;

            if (e.type === 'touchstart') {
                TouchHandler.touches += 1; //push
            } else if (e.type === 'touchend' || e.type === 'touchcancel') {
                setTimeout(function() {
                    if (TouchHandler.touches > 0) {
                        TouchHandler.touches -= 1; //pop after 500ms
                    }
                }, 500);
            } else if (e.type === 'mousedown' && TouchHandler.touches > 0) {
                allow = false;
            }

            return allow;
        },
        touchup: function(e) {
            TouchHandler.allowEvent(e);
        }
    };


    /**
     * Delegated click handler for .ripple element.
     * returns null when .ripple element not in "click tree"
     */
    function getWavesEffectElement(e) {
        if (TouchHandler.allowEvent(e) === false) {
            return null;
        }

        var element = null;
        var target = e.target || e.srcElement;

        while (target.parentElement !== null) {
            if (!(target instanceof SVGElement) && target.className.indexOf('ripple') !== -1) {
                element = target;
                break;
            } else if (target.classList.contains('ripple')) {
                element = target;
                break;
            }
            target = target.parentElement;
        }

        return element;
    }

    /**
     * Bubble the click and show effect if .ripple elem was found
     */
    function showEffect(e) {
        var element = getWavesEffectElement(e);

        if (element !== null) {
            Effect.show(e, element);

            if ('ontouchstart' in window) {
                element.addEventListener('touchend', Effect.hide, false);
                element.addEventListener('touchcancel', Effect.hide, false);
            }

            element.addEventListener('mouseup', Effect.hide, false);
            element.addEventListener('mouseleave', Effect.hide, false);
        }
    }

    Waves.displayEffect = function(options) {
        options = options || {};

        if ('duration' in options) {
            Effect.duration = options.duration;
        }

        //Wrap input inside <i> tag
        Effect.wrapInput($$('.ripple'));

        if ('ontouchstart' in window) {
            document.body.addEventListener('touchstart', showEffect, false);
        }

        document.body.addEventListener('mousedown', showEffect, false);
    };

    /**
     * Attach Waves to an input element (or any element which doesn't
     * bubble mouseup/mousedown events).
     *   Intended to be used with dynamically loaded forms/inputs, or
     * where the user doesn't want a delegated click handler.
     */
    Waves.attach = function(element) {
        //FUTURE: automatically add waves classes and allow users
        // to specify them with an options param? Eg. light/classic/button
        if (element.tagName.toLowerCase() === 'input') {
            Effect.wrapInput([element]);
            element = element.parentElement;
        }

        if ('ontouchstart' in window) {
            element.addEventListener('touchstart', showEffect, false);
        }

        element.addEventListener('mousedown', showEffect, false);
    };

    window.Waves = Waves;

    document.addEventListener('DOMContentLoaded', function() {
        Waves.displayEffect();
    }, false);

})(window);


//DROPDOWN
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.cbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}
/*Fix buttons alignment */
$('div.nav-title:has(i)').addClass('responsive-align');


//ACCORDION
(function($) {
    $('.accordion > li:eq(0) a.accordion-action').addClass('active').next().slideDown();

    $('.accordion a.accordion-action').click(function(j) {
        var dropDown = $(this).closest('li').find('div.accordion-content');

        $(this).closest('.accordion').find('div.accordion-content').not(dropDown).slideUp();

        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).closest('.accordion').find('a.active').removeClass('active');
            $(this).addClass('active');
        }

        dropDown.stop(false, true).slideToggle();

        j.preventDefault();
    });
})(jQuery);
//PRELOADER
document.addEventListener("DOMContentLoaded", function(){
	$("#load-wrapper").delay(1200).fadeOut('slow');

	$("#loader")
		.delay(1000)
		.fadeOut();
});
//DARK THEME
$("#dark").change(function(){
    if($(this).is(":checked")){
        if($("#dark").is(":checked")){
            $('body,div.form__label-outlined').addClass("dark");
            $('button.accordion,div.card,div.panel').addClass("dark2");
            $('H1,H2,H3,H4,H5').removeClass("dark-text").addClass("white-text");
            $('nav').addClass("dark2");
            $('i').addClass("white-text");
            $('div.sidenav-bkg,a.light').addClass("dark3");
            $('a.light').addClass("white-text");
            $('button.accordion,a.btn').addClass("white-text");
            $('p,span,div.card,a.btn,a.btn-outline,div.form__label-outlined').addClass("light-text");
            $('input.form__field-outlined').addClass("form__field-outlined-dark");
            $('input.form__field,textarea.form__field').addClass("form__field-dark");
        }
    }
});


//LIGHT THEME
$("#light").change(function(){
    if($(this).is(":checked")){
        if($("#light").is(":checked")){
          $('body,div.form__label-outlined').removeClass("dark");
          $('button.accordion,div.card,div.panel').removeClass("dark2");
          $('H1,H2,H3,H4,H5').addClass("dark-text").removeClass("white-text");
          $('nav').removeClass("dark2");
          $('i').removeClass("white-text");
          $('div.sidenav-bkg,a.light').removeClass("dark3");
          $('a.light').removeClass("white-text");
          $('button.accordion,a.btn').removeClass("white-text");
          $('p,span,div.card,a.btn,a.btn-outline,div.form__label-outlined').removeClass("light-text");
          $('input.form__field-outlined').removeClass("form__field-outlined-dark");
          $('input.form__field,textarea.form__field').removeClass("form__field-dark");
        }
    }
});

// assign function to onclick property of checkbox
document.getElementById('dark2').onclick = function() {
    if ( this.checked ) {
      $('body,div.form__label-outlined').addClass("dark");
      $('button.accordion,div.card,div.panel').addClass("dark2");
      $('H1,H2,H3,H4,H5').removeClass("dark-text").addClass("white-text");
      $('nav').addClass("dark2");
      $('i').addClass("white-text");
      $('div.sidenav-bkg,a.light').addClass("dark3");
      $('a.light').addClass("white-text");
      $('button.accordion,a.btn').addClass("white-text");
      $('p,span,div.card,a.btn,a.btn-outline,div.form__label-outlined').addClass("light-text");
      $('input.form__field-outlined').addClass("form__field-outlined-dark");
      $('input.form__field,textarea.form__field').addClass("form__field-dark");

    } else {
      $('body,div.form__label-outlined').removeClass("dark");
      $('button.accordion,div.card,div.panel').removeClass("dark2");
      $('H1,H2,H3,H4,H5').addClass("dark-text").removeClass("white-text");
      $('nav').removeClass("dark2");
      $('i').removeClass("white-text");
      $('div.sidenav-bkg,a.light').removeClass("dark3");
      $('a.light').removeClass("white-text");
      $('button.accordion,a.btn').removeClass("white-text");
      $('p,span,div.card,a.btn,a.btn-outline,div.form__label-outlined').removeClass("light-text");
      $('input.form__field-outlined').removeClass("form__field-outlined-dark");
      $('input.form__field,textarea.form__field').removeClass("form__field-dark");

    }
};
var viewportWidth = window.innerWidth-20;
var viewportHeight = window.innerHeight-20;
if (viewportWidth > 1000) viewportWidth = 400;
if (viewportHeight > 500) viewportHeight = 200;
$("#dialogEditSomeText").dialog({
height: viewportHeight,
width: viewportWidth,
autoOpen: false,
modal: false,
resizable: false,
draggable: false,
position: {
my: "center top",
at: "center top",
of: window,
collision: "none"
}
, create: function (event, ui) {
$(event.target).parent().css('position', 'fixed');
}
});
$( "#btnClickMe" ).click(function() {
$( "#dialogEditSomeText" ).dialog( "open" );
});


$('html').click(function() {
  $('.dd-menu').removeClass("active");
});

$('.dd-menu ul li').each(function() {
    var delay = $(this).index() * 50 + 'ms';

    $(this).css({
        '-webkit-transition-delay': delay,
        '-moz-transition-delay': delay,
        '-o-transition-delay': delay,
        'transition-delay': delay
    });
});

$(".dropdown-action").click (function(e){
  e.stopPropagation();
  $('.dd-menu').toggleClass("active");
});

 $('.dd-menu').click (function(e){
  e.stopPropagation();
});





$(document).ready(function() {
		$('#tab-selector').each(function() {

				var $active, $content, $links = $(this).find('a');

				$active = $($links[0]);
				$active.addClass('active');

				$content = $($active[0].hash);

				$links.not($active).each(function() {
						$(this.hash).hide();
				});

				$(this).on('click', 'a', function(e) {

						$active.removeClass('active');
						$content.hide();

						$active = $(this);
						$content = $(this.hash);

						$active.addClass('active');
						$content.show();

						e.preventDefault();
				});
		});
});
