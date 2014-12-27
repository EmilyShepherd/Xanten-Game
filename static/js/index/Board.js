/**
 * The board object
 * @file Contains the board object
 * @author Cristian Sima
 * @version 30.11.2014
 */
 

/**
 * The bord object represents a HTML div where there is added content
 * @constructor
 * @param {string} id The id of the board. It can be 'actions', 'news' or 'tasks'
 */
function Board(id){
	this.id = id;
}

/**
 * It adds a message to the board
 * @memberOf Board.prototype
 * @param {string} message The string to be added
 */
Board.prototype.add = function(message){
	$("#"+this.id+"_board").append("<div>"+message+"</div>");
}

/**
 * It clears the board
 * @memberOf Board.prototype
 */
Board.prototype.clear = function(){
	$("#"+this.id+"_board").html("");
}