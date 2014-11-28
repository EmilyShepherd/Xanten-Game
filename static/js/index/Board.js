/**
 * 
 *
 * @author Cristian Sima
 * @version 27.11.2014
 */



function Board(id){
	this.id = id;
}

Board.prototype.add = function(message){
	$("#"+this.id+"_board").append("<div>"+message+"</div>");
}

Board.prototype.clear = function(){
	$("#"+this.id+"_board").html("");
}

