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
    $('button.accordion, a.ripple, a.md-button, .ripple-image').mdRipple();

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


var pages = new Array('one', 'two', 'three', 'four');

function toggleMenu() {
 document.getElementsByClassName('wrapper')[0].classList.toggle('menu-open');
}

function goToPage(page) {
  var wrapper = document.getElementsByClassName('wrapper')[0];
  var sections = document.getElementsByTagName('section');
  for (i = 0; i < sections.length; i++) {
    sections[i].classList.remove('before','after');
    if (i > page) {
      sections[i].classList.add('after');
    }
  }
  wrapper.classList.remove('menu-open','page-one','page-two');
  wrapper.classList.add('page-' + pages[page]);
}



(function ($, window, document, undefined) {

    var pluginName = 'slide',
        defaults = {
            // General settings...
            slideSpeed: 500,
            enableSwipe: true,

            // If you change class / data attribute names,
            // you will need to change related CSS files
            viewport: '.slider-viewport',
            track: '.slider-track',
            slide: '.slide',
            // Arrows
            prevArrow: '.slider-prev',
            nextArrow: '.slider-next',
            // Slider state
            atLastSlide: '.slider-end',
            atFirstSlide: '.slider-start',
            noSlide: '.no-slide',
            // Slide image classes
            imageContainerClass: '.slide-image',
            imageAsBackgroundClass: '.slide-image-background',
            imageAsBackgroundWrapperClass: '.slide-image-background-wrapper',
            // Slide background classes / data attributes
            backgroundClass: '.slide-data-background',
            backgroundZoomClass: '.slide-data-zoom-background',
            backgroundDataAttr: 'background',
            backgroundZoomDataAttr: 'zoom-background',

            // Check if we should enable single slide mode..
            // Return true to scroll only one slide or false to slide the default distance.
            // You can also set this to a boolean instead of a function.
            // By default, if any slide is wider than 30% of the viewport, single slide mode is enabled.
            isInSingleSlideMode: function ($slider) {
                var isInSingleSlideMode = false,
                    viewportWidth = $slider.find(this.viewport).width();

                $slider.find(this.slide).each(function () {
                    isInSingleSlideMode = $(this).outerWidth() / viewportWidth > .3;
                    return ! isInSingleSlideMode;
                });

                return isInSingleSlideMode;
            },

            // Slide distance used if "isInSingleSlideMode" is true.
            // Return any value supported by the jquery.scrollTo plugin:
            // https://github.com/flesler/jquery.scrollTo
            // By default this will slide 70% of the viewport.
            defaultSlideDistance: function ($slider, $viewport, $track, isNext) {
                return (isNext ? '+=' : '-=') + ($viewport.width() * .7) + 'px';
            },

            // Before callbacks...
            // Return false to cancel slide.
            onBeforeSlideNext: function ($slider) { },
            onBeforeSlidePrev: function ($slider) { },

            // After callbacks...
            onAfterSlideNext: function ($slider) { },
            onAfterSlidePrev: function ($slider) { }
        };

    function Plugin(element, options) {
        // Merge options...
        this.options = $.extend( {}, defaults, options);

        // Cache elements...
        this.$slider = $(element);
        this.$viewport = this.$slider.find(this.options.viewport);
        this.$track = this.$slider.find(this.options.track);
        this.$slides = this.$slider.find(this.options.slide);

        // Calculated values...
        this.viewportWidth = 0;
        this.slidesTotalWidth = 0;
        this.singleSlideIsWiderThanViewport = false;
        this.slidesFitInViewport = false;
        this.isInSingleSlideMode = false;
        this.noSlideClass = (this.options.noSlide).substr(1);
        this.onResize = null;
        this.isSliding = false;

        // Kickoff...
        this.init();
    }

    Plugin.prototype = {

        init: function ()  {
            this.swapSlideCoverImages();
            this.insertDataBackgrounds();
            this.registerEvents();
            this.evaluateSlider();

            // Do a recheck after 1 second
            // in case images load slowly...
            setTimeout(function () {
                this.evaluateSlider();
            }.bind(this), 1000);
        },

        swapSlideCoverImages: function () {
            this.$slider.find('img' + this.options.imageAsBackgroundClass).each(function (index, image) {
                var $image = $(image),
                    $container = $image.closest(this.options.imageContainerClass),
                    imageUrl = $image.prop('src');

                if (imageUrl) {
                    $container
                        .css('backgroundImage', 'url(' + imageUrl + ')')
                        .addClass((this.options.imageAsBackgroundWrapperClass).substr(1));
                }
            }.bind(this));
        },

        insertDataBackgrounds: function () {
            this.$slider.find(this.options.slide).each(function (index, slide) {
                var $slide = $(slide),
                    $background,
                    backgroundUrl = $slide.data(this.options.backgroundDataAttr) || $slide.data(this.options.backgroundZoomDataAttr),
                    shouldZoom = !! $slide.data(this.options.backgroundZoomDataAttr);

                if (backgroundUrl) {
                    $background = $('<div/>')
                        .addClass((this.options.backgroundClass).substr(1))
                        .css('backgroundImage', 'url(' + backgroundUrl + ')');

                    if (shouldZoom) {
                        $background.addClass((this.options.backgroundZoomClass).substr(1));
                    }

                    $slide.prepend($background);
                }
            }.bind(this));
        },

        registerEvents: function () {
            // Next arrow click...
            this.$slider.on('click', this.options.nextArrow, function (e) {
                e.preventDefault();
                this.slideTo(this.$slides, true);
            }.bind(this));

            // Prev arrow click...
            this.$slider.on('click', this.options.prevArrow, function (e) {
                e.preventDefault();
                this.slideTo($(this.$slides.get().reverse()), false);
            }.bind(this));

            if (this.options.enableSwipe) {
                // Swipe left...
                this.$slider.on('swiperight', function () {
                    this.slideTo($(this.$slides.get().reverse()), false);
                }.bind(this));

                // Swipe right...
                this.$slider.on('swipeleft', function () {
                    this.slideTo(this.$slides, true);
                }.bind(this));

                // No dragging when "swiping" with the mouse...
                this.$slider.on('dragstart', 'a, img', function (e) {
                    e.preventDefault();
                });

                // Don't follow links when swiping (IE 11 & Edge)...
                this.$slider.on('click', 'a', function (e) {
                    if (this.isSliding) {
                        e.preventDefault();
                    }
                }.bind(this));
            }

            // Window resize event...
            $(window).on('resize', function () {
                clearTimeout(this.onResize);
                this.onResize = setTimeout(function () {
                    this.evaluateSlider();
                    this.onResize = null;
                }.bind(this), 900);
            }.bind(this));
        },

        // Triggered on init
        // and on window resize.
        evaluateSlider: function () {
            this.updateSliderInfo();
            this.updateSlider();
            this.updateArrows();
        },

        updateSliderInfo: function () {
            this.viewportWidth = this.getViewportWidth();
            this.slidesTotalWidth = this.getSlidesWidth();
            this.singleSlideIsWiderThanViewport = this.isSingleSlideWiderThanViewport();
            this.slidesFitInViewport = this.checkSlidesFitInViewport();
            this.isInSingleSlideMode = this.options.isInSingleSlideMode instanceof Function
                ? this.options.isInSingleSlideMode(this.$slider)
                : this.options.isInSingleSlideMode;
        },

        updateSlider: function () {
            if (this.slidesFitInViewport || this.singleSlideIsWiderThanViewport) {
                this.$slider.addClass(this.noSlideClass);
            } else {
                this.$slider.removeClass(this.noSlideClass);
            }

            if (this.singleSlideIsWiderThanViewport) {
                this.slideTo(this.$slides, true);
            }
        },

        updateArrows: function () {
            var atLastSlide = (this.options.atLastSlide).substr(1),
                atFirstSlide = (this.options.atFirstSlide).substr(1);

            if (this.isAtLastSlide()) {
                this.$slider.addClass(atLastSlide);
            } else {
                this.$slider.removeClass(atLastSlide);
            }

            if (this.isAFirstSlide()) {
                this.$slider.addClass(atFirstSlide);
            } else {
                this.$slider.removeClass(atFirstSlide);
            }
        },

        slideTo: function ($slides, isNext) {
            if (this.isSliding || this.runBeforeCallback(isNext) === false) {
                return false;
            }

            this.isSliding = true;

            this.$viewport.scrollTo(this.getSlideToPosition($slides, isNext), this.options.slideSpeed, {
                onAfter: function () {
                    this.updateArrows();
                    this.runAfterCallback(isNext);
                    this.isSliding = false;
                }.bind(this)
            });
        },

        getSlideToPosition: function ($slides, isNext) {
            if ( ! this.isInSingleSlideMode) {
                return this.options.defaultSlideDistance(this.$slider, this.$viewport, this.$track, isNext);
            }

            var trackOffset = this.getTrackOffset(),
                halfViewportWidth = this.viewportWidth / 2,
                slideToOffset = 0,
                isPrev = ! isNext;

            $slides.each(function (index, slide) {
                var $slide = $(slide),
                    slideWidth = $slide.outerWidth(),
                    leftOffset = $slide.position().left + parseInt($slide.css("marginLeft")),
                    slideCenterPosition = leftOffset + (slideWidth / 2) - trackOffset,
                    slideCenterIsOverHalfWay = slideCenterPosition - 2 > halfViewportWidth,
                    slideCenterIsBeforeHalfWay = slideCenterPosition + 2 < halfViewportWidth;

                slideToOffset = leftOffset + ((slideWidth - this.viewportWidth) / 2); //=> Center slide

                if ( (isNext && slideCenterIsOverHalfWay) ||
                     (isPrev && slideCenterIsBeforeHalfWay) ) {
                    return false;
                }
            }.bind(this));

            return slideToOffset;
        },

        getTrackOffset: function () {
            return Math.abs(this.$track.position().left);
        },

        getViewportWidth: function () {
            return parseFloat(this.$viewport.width());
        },

        getSlidesWidth: function () {
            var width = 0;

            this.$slides.each(function () {
                width += parseFloat($(this).outerWidth(true));
            });

            return width;
        },

        checkSlidesFitInViewport: function () {
            return this.viewportWidth > this.slidesTotalWidth;
        },

        isSingleSlideWiderThanViewport: function () {
            return this.$slides.length <= 1 && this.slidesTotalWidth >= this.viewportWidth;
        },

        isAFirstSlide: function () {
            return this.getTrackOffset() - 1 <= this.getSlideOverflow(this.$slides.first());
        },

        isAtLastSlide: function () {
            var trackRemaining = this.slidesTotalWidth - this.getTrackOffset() - 1,
                slideOverflow = this.getSlideOverflow(this.$slides.last());

            return this.viewportWidth >= trackRemaining - slideOverflow;
        },

        getSlideOverflow: function ($slide) {
            if ($slide.outerWidth() <= this.viewportWidth) {
                return 0;
            }

            return ($slide.outerWidth() - this.viewportWidth) / 2;
        },

        runBeforeCallback: function (isNext) {
            var beforeCallback = isNext
                    ? this.options.onBeforeSlideNext
                    : this.options.onBeforeSlidePrev;

            if (beforeCallback instanceof Function) {
                return beforeCallback(this.$slider);
            }

            return true;
        },

        runAfterCallback: function (isNext) {
            var afterCallback = isNext
                    ? this.options.onAfterSlideNext
                    : this.options.onAfterSlidePrev;

            if (afterCallback instanceof Function) {
                afterCallback(this.$slider);
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if ( ! $.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

$('.slider').slide();
