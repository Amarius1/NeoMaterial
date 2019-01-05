//RIPPLE BY YOUNG PARK - FOR MOBILE BUTTONS
(function($){
  "use strict";

  $.fn.extend({
    mdRipple: function(options){
      options = $.extend({
        // Default options

      }, options);
      var namespace = 'mdRipple',
      coreClasses = {
        button: 'md-ripple-active',
        iconButton: 'md-icon-button',
        container: 'md-ripple-container',
        ripple: 'md-ripple',
        focus: 'md-focus'
      },
      coreAttributes = {
        color: 'ripple-color',
        noRipple: 'no-ripple'
      },
      rippleTemplate = '<svg preserveAspectRatio="none" viewBox="25 25 50 50"><circle cx="50" cy="50" r="25"/></svg>',
      mouseDown = false;

      // General element actions
      _initialize(this);

      // Individual element actions
      this.each(function(){
        var elem = $(this);
        elem.on(_namespaceEvents('mousedown'), _mouseDown);
        elem.on(_namespaceEvents('focus'), _drawFocus);
        elem.on(_namespaceEvents('blur'), _clearContainer);
      });

      return this;

      /////////////////////////////////

      function _initialize(elems){
        // Unbind anything within plugin namespace to prevent duplicate event bindings
        elems.off('.' + namespace);
        _addRippleContainerTo(elems);
      }

      function _addRippleContainerTo(elem) {
        var rippleContainer = elem.find('.' + coreClasses.container).get(0);
        if (!rippleContainer) {
          rippleContainer = document.createElement('div');
          rippleContainer.className = coreClasses.container;
          elem.addClass(coreClasses.button).append($(rippleContainer));
        }
      }

      function _getMouseClickCoords(elem, e) {
        var container = elem,
        coords = {};

        if (!e || elem.hasClass(coreClasses.iconButton)){
          coords.x = container.outerWidth() / 2;
          coords.y = container.outerHeight() / 2;
        } else {
          coords.x = e.pageX - container.offset().left;
          coords.y = e.pageY - container.offset().top;
        }

        return coords;
      }

      function _mouseDown(e) {
        var elem = $(this);
        if (!mouseDown && !elem.is(":disabled") && !elem.data(coreAttributes.noRipple)) {
          mouseDown = true;
          var coords = _getMouseClickCoords(elem, e);
          _removeFocus(elem);
          _drawRipple(elem, coords);
        }
        e.preventDefault();
      }

      function _drawRipple(elem, coords) {
        var container = elem.find('.' + coreClasses.container).first(),
        color = elem.data(coreAttributes.color),
        ripple = $(rippleTemplate),
        containerDims = {
          width: container.outerWidth(),
          height: container.outerHeight()
        },
        initialDiameter = (containerDims.width > containerDims.height ? containerDims.width : containerDims.height) * .5,
        greatestWidth, greatestHeight, diameter = 1, scale = 1,
        vm = this;

        ripple.addClass(coreClasses.ripple).css({
          'fill': !!color ? color : '',
          'transform': 'translate(' + coords.x + 'px, ' + coords.y + 'px) translate(-50%, -50%)',
          'opacity': .5,
          'width': initialDiameter,
          'height': initialDiameter
        });
        container.append(ripple);

        if(coords.x >= containerDims.width / 2){
          greatestWidth = coords.x;
        }
        else{
          greatestWidth = containerDims.width - coords.x;
        }
        if(coords.y >= containerDims.height / 2){
          greatestHeight = coords.y;
        }
        else{
          greatestHeight = containerDims.height - coords.y;
        }

        diameter = Math.sqrt(Math.pow(greatestWidth, 2) + Math.pow(greatestHeight, 2)) * 2.05;
        scale = (diameter / initialDiameter);

        // Forces the browser to calculate an actual value
        ripple.css('opacity');
        ripple.css('transform');
        ripple.css({
          'opacity': 1,
          'transform': 'translate(' + coords.x + 'px,' + coords.y + 'px) translate(-50%,-50%) scale(' + scale + ')'
        });

        elem.bind(_namespaceEvents('mouseup mouseleave'), function(e){
          mouseDown = false;
          _hideRipple(ripple);
          $(this).unbind(_namespaceEvents('mouseup mouseleave'));
        });
      }

      function _drawFocus(){
        var elem = $(this);

        if(!elem.is(":active")) {
          var container = elem.find('.' + coreClasses.container).first(),
          color = elem.data(coreAttributes.color),
          ripple = $(rippleTemplate),
          coords = _getMouseClickCoords(elem);

          // Destroy all previous instances of focus ripple
          container.find('.' + coreClasses.focus).remove();

          ripple.addClass(coreClasses.focus).css({
            'fill': !!color ? color : '',
            'transform': 'translate(' + coords.x + 'px, ' + coords.y + 'px) translate(-50%,-50%)',
            'width': coords.x * 2 * .9,
            'height': coords.x * 2 * .9
          });

          container.append(ripple);
        }
      }

      function _hideRipple(elem) {
        elem.css('opacity', 0);
        elem.one(_namespaceEvents('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd'), function() {
          $(this).remove();
        });
      }

      function _removeFocus(elem) {
        elem.find('.' + coreClasses.container + ' .' + coreClasses.focus).remove();
      }

      function _clearContainer() {
        $(this).find('.' + coreClasses.container).find('.' + coreClasses.focus + ', .' + coreClasses.ripple).remove();
      }

      function _namespaceEvents(eventString) {
        return eventString.trim().split(/\s+/).map(function(a){ return a + '.' + namespace; }).reduce(function(a, b){ return a + ' ' + b });
      }
    }
  });
})(jQuery);

(function(){
  $(document).ready(function(){
    $('a.ripple, a.md-button, .ripple-image').mdRipple();

    $('.party-button').on('click focus', function(){
      $(this).data('ripple-color', '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6));
    });
    $('.focus-me').focus();
  });
})();
/*DESKTOP RIPPLE*/
(function() {
    const showEvent = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 'touchstart' : 'mousedown';
    const hideEvent = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 'touchend' : 'mouseup';
    $(document).on(showEvent, '[ripple]', function(e){
        if (e.button == 2){
            return false
        }
    	$ripple = $('<span class="ripple-effect" />'),
    	$button = $(this),
    	$offset = $button.offset(),
    	xPos = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && 'touches' in e ? ( e.touches[0].pageX - $offset.left ) : (e.pageX - $offset.left),
    	yPos = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) && 'touches' in e ? ( e.touches[0].pageY - $offset.top ) : (e.pageY - $offset.top),
    	$color = $button.data('ripple-color') || $button.css('color'),
    	scaledSize = Math.max( $button.width() , $button.height()) * Math.PI * 1.5;
    	$ripple.css({
    		'top': yPos,
    		'left': xPos,
    		'background-color': $color,
            opacity: .2
    	}).appendTo( $button ).animate({
    		'height': scaledSize,
    		'width': scaledSize,
    	}, 500/3*2)
        $(document).on(hideEvent, $button, function (e) {
            $ripple.animate({
                'opacity': 0
            }, 700/3, function () {
                $(this).remove()
            })
        })
    })
}());
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
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
}
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
