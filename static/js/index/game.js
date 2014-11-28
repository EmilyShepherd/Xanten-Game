/**
 * JS functions for game
 *
 * @author Cristian Sima & ...
 * @version 21.11.2014
 */
 

/**
 * The game object. Has information regarding the game, player, engines.
 * @param information Information from server
 * @param cityMap A map object which contains the map of the city
 * @param worldMap A map object which contains the map of the world
 */
function Game(token, player, cityMap, worldMap){
	
	this.token 		= token;
	this.player	 	= player;
	
	this.currentMap	= cityMap;			// default city map
	this.cityMap	= cityMap;
	this.worldMap	= worldMap;
	
	this.actions	 			= new Board("actions");
	this.news	 				= new Board("news");
	this.currentTasks	 		= new Board("currentTasks");
}




/**
 * It returns the player of the gmae
 * @returns Object The player of the game
 */
Game.prototype.init = function() {

	// do the things once when it is started
	$("#map-view" ).buttonset();
	$('#map-view :radio').change(function () {
	    
		if($('#map-view :radio:checked').val() == "city"){
			game.currentMap = game.cityMap;	
		} else {
			game.currentMap = game.worldMap;
		}

		game.actions.add("You have selected the "+game.currentMap.name + " map.");
		
	});
	$("#map-board td").click(function(){
		var id = $(this).attr("id");
		var array = id.substring(4, id.length);
		var elements = array.split("_");
		game.currentMap.selectCell(elements[0], elements[1]);
	});
	
	$("#news_clear").click(function(){
		game.news.clear();
	});
};


