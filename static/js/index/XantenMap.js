/**
 * The map object. It has information regarding a map
 *
 * @author Cristian Sima
 * @version 27.11.2014
 */



/**
 * The game object. Has information regarding the game, player, engines.
 */
function XantenMap(mapArray, name){
	this.mapArray 		= mapArray;
	this.selectedCell 	= null;
	this.name 			= name;
}

XantenMap.prototype.getArray = function(){
	return this.mapArray;
}

XantenMap.prototype.selectCell = function(x, y){
	// select the square
	game.news.add("You hit the square: x:"+x+" y:"+y);
}

XantenMap.prototype.getSelectedCell = function(){
	return this.selectedCell;
}