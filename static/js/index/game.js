/**
 * JS functions for game
 *
 * @author Cristian Sima & ...
 * @version 21.11.2014
 */
 
var settings = { 
				"displayCover": true
			};
/**
 * The function executes after the page loaded
 */
function init(){

	// TODO to check if there exists cookies. if a player is in a game (else send to index.html).
	// TODO to start 
}

$(document).ready(function() {
	if(settings.displayCover){
		$("#cover").fadeOut(2000, init);
	} else {
		$("#cover").hide();
		init();
	}
});