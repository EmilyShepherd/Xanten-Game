/**
 * The board object
 *
 * @author Cristian Sima
 * @version 30.11.2014
 */
 

/**
 * The bord object represents a HTML div where there is added content
 * @param id The id of the board
 */
function Board(id){
	this.id = id;
}

/**
 * It adds a message to the board
 * @param message The string to be added
 */
Board.prototype.add = function(message){
	$("#"+this.id+"_board").append("<div>"+message+"</div>");
}

/**
 * It clears the board
 */
Board.prototype.clear = function(){
	$("#"+this.id+"_board").html("");
}