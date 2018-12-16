//RIPPLE
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
