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
$(document).ready(function(){
    $("#tank").click(function(){
        $("#tank-cut").toggleClass("visiblex");
		$("#tank-data").toggleClass("visiblex");
		$("#ariane").toggleClass("blur");
		$("#boosters").toggleClass("blur");
		$("#payload").toggleClass("blur");
    });
});
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
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
/*Fix navbar hamburger menu alignment */
$('div.nav-title:has(i)').addClass('fix-align1');
function openNav() {
    document.getElementById("side-buttons").style.width = "60px";
    document.getElementsByTagName("BODY")[0].style.marginLeft = "60px";
    $(".open").css("display", "none");
    $("#sidenav-title").css("position", "relative").css("left", "5px").css("top", "4px");


}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("side-buttons").style.width = "0";
    document.getElementsByTagName("BODY")[0].style.marginLeft = "0";
    $(".open").css("display", "inline-flex").css("top", "5px");
}
